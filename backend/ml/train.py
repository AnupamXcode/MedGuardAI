import os
import sys
import json
import time
import sqlite3
import numpy as np
import pandas as pd
import joblib

from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.neural_network import MLPClassifier
from sklearn.linear_model import SGDClassifier
from sklearn.metrics import (
    accuracy_score,
    precision_recall_fscore_support,
    classification_report,
    confusion_matrix
)

MODELS_DIR = os.path.join("backend", "ml", "models")
PROCESSED_DIR = "processed_data"

def load_data():
    print("Loading drug structural features...")
    feat_path = os.path.join(PROCESSED_DIR, "drug_features_pca50.json")
    with open(feat_path, "r", encoding="utf-8") as f:
        feat_dict = json.load(f)

    print("Loading interactions from SQLite database...")
    db_path = os.path.join(PROCESSED_DIR, "interactions.db")
    conn = sqlite3.connect(db_path)
    
    df_train = pd.read_sql("SELECT drug_a_id, drug_b_id, ddi_type FROM interactions WHERE split = 'training'", conn)
    df_val = pd.read_sql("SELECT drug_a_id, drug_b_id, ddi_type FROM interactions WHERE split = 'validation'", conn)
    df_test = pd.read_sql("SELECT drug_a_id, drug_b_id, ddi_type FROM interactions WHERE split = 'testing'", conn)
    conn.close()

    print(f"Loaded {len(df_train)} train, {len(df_val)} val, {len(df_test)} test records.")

    def build_matrix(df):
        X = []
        for _, r in df.iterrows():
            va = feat_dict.get(r["drug_a_id"], [0.0] * 50)
            vb = feat_dict.get(r["drug_b_id"], [0.0] * 50)
            X.append(va + vb)
        return np.array(X, dtype=np.float32)

    X_train = build_matrix(df_train)
    y_train = df_train["ddi_type"].values

    X_val = build_matrix(df_val)
    y_val = df_val["ddi_type"].values

    X_test = build_matrix(df_test)
    y_test = df_test["ddi_type"].values

    return X_train, y_train, X_val, y_val, X_test, y_test

def top_k_accuracy(y_true, y_prob, k=3):
    top_k_preds = np.argsort(y_prob, axis=1)[:, -k:]
    hits = 0
    for idx, true_label in enumerate(y_true):
        if true_label in top_k_preds[idx]:
            hits += 1
    return hits / len(y_true)

def main():
    print("=== MediGuard AI: Machine Learning Training & Evaluation Pipeline ===")
    os.makedirs(MODELS_DIR, exist_ok=True)

    X_train, y_train, X_val, y_val, X_test, y_test = load_data()

    # Preprocessing: Label Encoding & Scaling
    print("Fitting LabelEncoder and StandardScaler...")
    le = LabelEncoder()
    # Fit on all 86 possible types (1 to 86)
    le.fit(list(range(1, 87)))

    y_train_enc = le.transform(y_train)
    y_val_enc = le.transform(y_val)
    y_test_enc = le.transform(y_test)

    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_val_scaled = scaler.transform(X_val)
    X_test_scaled = scaler.transform(X_test)

    # 1. Baseline Model: SGD Classifier with Log Loss
    print("\n--- Training Baseline Model: Multinomial SGD Classifier ---")
    baseline = SGDClassifier(loss="log_loss", max_iter=30, random_state=42, n_jobs=-1)
    t0_base = time.time()
    baseline.fit(X_train_scaled, y_train_enc)
    base_train_time = time.time() - t0_base

    base_preds = baseline.predict(X_test_scaled)
    base_acc = accuracy_score(y_test_enc, base_preds)
    base_p, base_r, base_f1, _ = precision_recall_fscore_support(
        y_test_enc, base_preds, average="macro", zero_division=0
    )
    print(f"Baseline Test Accuracy: {base_acc*100:.2f}% | Macro-F1: {base_f1*100:.2f}% | Trained in {base_train_time:.2f}s")

    # 2. DeepDDI Neural Network (Multi-Layer Perceptron)
    print("\n--- Training DeepDDI-Style Deep Neural Network Architecture ---")
    mlp = MLPClassifier(
        hidden_layer_sizes=(256, 128),
        activation="relu",
        solver="adam",
        alpha=0.0001,
        batch_size=256,
        learning_rate_init=0.001,
        max_iter=35,
        early_stopping=True,
        validation_fraction=0.1,
        n_iter_no_change=5,
        random_state=42,
        verbose=True
    )

    t0_mlp = time.time()
    mlp.fit(X_train_scaled, y_train_enc)
    mlp_train_time = time.time() - t0_mlp

    print("\n--- Evaluating DeepDDI Model on Official Test Set (38,419 pairs) ---")
    mlp_preds = mlp.predict(X_test_scaled)
    mlp_probs = mlp.predict_proba(X_test_scaled)

    test_acc_top1 = accuracy_score(y_test_enc, mlp_preds)
    test_acc_top3 = top_k_accuracy(y_test_enc, mlp_probs, k=3)
    test_acc_top5 = top_k_accuracy(y_test_enc, mlp_probs, k=5)

    macro_p, macro_r, macro_f1, _ = precision_recall_fscore_support(
        y_test_enc, mlp_preds, average="macro", zero_division=0
    )
    weighted_p, weighted_r, weighted_f1, _ = precision_recall_fscore_support(
        y_test_enc, mlp_preds, average="weighted", zero_division=0
    )

    print(f"DeepDDI Model Test Metrics:")
    print(f"  Top-1 Accuracy:     {test_acc_top1*100:.2f}%")
    print(f"  Top-3 Accuracy:     {test_acc_top3*100:.2f}%")
    print(f"  Top-5 Accuracy:     {test_acc_top5*100:.2f}%")
    print(f"  Macro Precision:    {macro_p*100:.2f}%")
    print(f"  Macro Recall:       {macro_r*100:.2f}%")
    print(f"  Macro F1-Score:     {macro_f1*100:.2f}%")
    print(f"  Weighted F1-Score:  {weighted_f1*100:.2f}%")
    print(f"  Training Time:      {mlp_train_time:.2f} seconds")

    # Generate Confusion Matrix Summary
    cm = confusion_matrix(y_test_enc, mlp_preds)
    # Identify top misclassifications
    np.fill_diagonal(cm, 0)
    top_confused_indices = np.unravel_index(np.argsort(cm.ravel())[-10:], cm.shape)
    top_confusions = []
    for i, j in zip(top_confused_indices[0][::-1], top_confused_indices[1][::-1]):
        if cm[i, j] > 0:
            top_confusions.append({
                "true_type": int(le.inverse_transform([i])[0]),
                "predicted_type": int(le.inverse_transform([j])[0]),
                "misclassified_count": int(cm[i, j])
            })

    # Save Evaluation Report
    report = {
        "timestamp": time.strftime("%Y-%m-%d %H:%M:%S"),
        "model_architecture": "DeepDDI Multi-Layer Perceptron (Dense 256 -> Dense 128 -> Softmax 86)",
        "features": "100-dimensional concatenated PCA structural similarity profiles (50D DrugA + 50D DrugB)",
        "dataset_splits": {
            "training_samples": len(X_train),
            "validation_samples": len(X_val),
            "testing_samples": len(X_test)
        },
        "baseline_model": {
            "name": "Multinomial SGD Classifier",
            "test_accuracy": float(base_acc),
            "macro_f1": float(base_f1),
            "training_time_seconds": float(base_train_time)
        },
        "deepddi_model": {
            "test_accuracy_top1": float(test_acc_top1),
            "test_accuracy_top3": float(test_acc_top3),
            "test_accuracy_top5": float(test_acc_top5),
            "macro_precision": float(macro_p),
            "macro_recall": float(macro_r),
            "macro_f1": float(macro_f1),
            "weighted_precision": float(weighted_p),
            "weighted_recall": float(weighted_r),
            "weighted_f1": float(weighted_f1),
            "training_time_seconds": float(mlp_train_time),
            "iterations_to_convergence": int(mlp.n_iter_)
        },
        "top_misclassifications": top_confusions
    }

    report_path = os.path.join(MODELS_DIR, "evaluation_report.json")
    with open(report_path, "w", encoding="utf-8") as f:
        json.dump(report, f, indent=2)
    print(f"Saved evaluation report to {report_path}")

    # Save artifacts
    print("Saving model, scaler, and label encoder...")
    joblib.dump(mlp, os.path.join(MODELS_DIR, "deepddi_mlp_model.joblib"))
    joblib.dump(baseline, os.path.join(MODELS_DIR, "baseline_sgd_model.joblib"))
    joblib.dump(scaler, os.path.join(MODELS_DIR, "scaler.joblib"))
    joblib.dump(le, os.path.join(MODELS_DIR, "label_encoder.joblib"))

    print("\nTraining and evaluation pipeline completed successfully!")

if __name__ == "__main__":
    main()
