import os
import json
import pandas as pd
import numpy as np

def validate_processed_data():
    processed_dir = "processed_data"
    print("=== Validating Processed Datasets ===")
    
    # 1. ddi_types.json
    ddi_path = os.path.join(processed_dir, "ddi_types.json")
    assert os.path.exists(ddi_path), "ddi_types.json missing!"
    with open(ddi_path, "r", encoding="utf-8") as f:
        ddi_types = json.load(f)
    assert len(ddi_types) == 86, f"Expected 86 DDI types, found {len(ddi_types)}"
    print(f"PASS: 86 DDI types verified (types 1 to {max(int(k) for k in ddi_types.keys())}).")
    
    # 2. drugs.json
    drugs_path = os.path.join(processed_dir, "drugs.json")
    assert os.path.exists(drugs_path), "drugs.json missing!"
    with open(drugs_path, "r", encoding="utf-8") as f:
        drugs = json.load(f)
    assert len(drugs) == 1710, f"Expected 1,710 drugs, found {len(drugs)}"
    for drug_id, d in drugs.items():
        assert "name" in d and len(d["name"]) > 0, f"Drug {drug_id} has no valid name"
        assert "categories" in d, f"Drug {drug_id} missing categories list"
    print(f"PASS: All 1,710 drugs verified with non-empty names and categories.")
    
    # 3. drug_features_pca50.json
    features_path = os.path.join(processed_dir, "drug_features_pca50.json")
    assert os.path.exists(features_path), "drug_features_pca50.json missing!"
    with open(features_path, "r", encoding="utf-8") as f:
        features = json.load(f)
    assert len(features) == 1710, f"Expected 1,710 drug feature entries, found {len(features)}"
    for drug_id, vec in features.items():
        assert len(vec) == 50, f"Feature vector for {drug_id} has length {len(vec)} != 50"
        assert not np.isnan(vec).any(), f"NaN found in feature vector for {drug_id}"
    print(f"PASS: 1,710 50-dimensional feature vectors verified without NaNs.")
    
    # 4. interactions.db & interactions.csv.gz
    import sqlite3
    db_path = os.path.join(processed_dir, "interactions.db")
    assert os.path.exists(db_path), "interactions.db missing!"
    conn = sqlite3.connect(db_path)
    df_interactions = pd.read_sql("SELECT * FROM interactions", conn)
    conn.close()
    assert len(df_interactions) == 192284, f"Expected 192,284 pairs, found {len(df_interactions)}"
    
    # Check splits
    splits = df_interactions["split"].value_counts().to_dict()
    assert splits.get("training") == 115446, f"Incorrect train count: {splits.get('training')}"
    assert splits.get("validation") == 38419, f"Incorrect val count: {splits.get('validation')}"
    assert splits.get("testing") == 38419, f"Incorrect test count: {splits.get('testing')}"
    print(f"PASS: 192,284 interactions verified with exact PNAS splits (115,446 train / 38,419 val / 38,419 test).")
    
    # Check no nulls in required columns
    required_cols = ["drug_a_id", "drug_b_id", "drug_a_name", "drug_b_name", "ddi_type", "canonical_pair", "split"]
    for col in required_cols:
        null_count = df_interactions[col].isnull().sum()
        assert null_count == 0, f"Column {col} has {null_count} nulls!"
    print(f"PASS: Zero null values across all required interaction fields.")
    
    # 5. alternatives & condition alerts
    alt_path = os.path.join(processed_dir, "alternatives.json")
    assert os.path.exists(alt_path), "alternatives.json missing!"
    with open(alt_path, "r", encoding="utf-8") as f:
        alts = json.load(f)
    assert len(alts) > 0, "No alternatives found!"
    print(f"PASS: {len(alts)} alternative medication substitution entries verified.")
    
    alert_path = os.path.join(processed_dir, "condition_alerts.json")
    assert os.path.exists(alert_path), "condition_alerts.json missing!"
    with open(alert_path, "r", encoding="utf-8") as f:
        alerts = json.load(f)
    assert len(alerts) > 0, "No condition alerts found!"
    print(f"PASS: {len(alerts)} disease & dietary contraindication alerts verified.")
    
    print("\nALL PREPROCESSED DATA INTEGRITY CHECKS PASSED SUCCESSFULLY!")

if __name__ == "__main__":
    validate_processed_data()
