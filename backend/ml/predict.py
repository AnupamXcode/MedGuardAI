import os
import json
import joblib
import numpy as np

MODELS_DIR = os.path.join(os.path.dirname(__file__), "models")
PROCESSED_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "processed_data"))

class DDIPredictor:
    def __init__(self, models_dir=MODELS_DIR, processed_dir=PROCESSED_DIR):
        self.models_dir = models_dir
        self.processed_dir = processed_dir
        self.model = None
        self.scaler = None
        self.le = None
        self.features_dict = None
        self.ddi_types = None
        self.drugs_catalog = None
        self.is_loaded = False

    def load(self):
        if self.is_loaded:
            return
        
        model_path = os.path.join(self.models_dir, "deepddi_mlp_model.joblib")
        scaler_path = os.path.join(self.models_dir, "scaler.joblib")
        le_path = os.path.join(self.models_dir, "label_encoder.joblib")
        feat_path = os.path.join(self.processed_dir, "drug_features_pca50.json")
        ddi_path = os.path.join(self.processed_dir, "ddi_types.json")
        drugs_path = os.path.join(self.processed_dir, "drugs.json")

        self.model = joblib.load(model_path)
        self.scaler = joblib.load(scaler_path)
        self.le = joblib.load(le_path)

        with open(feat_path, "r", encoding="utf-8") as f:
            self.features_dict = json.load(f)

        with open(ddi_path, "r", encoding="utf-8") as f:
            self.ddi_types = json.load(f)

        with open(drugs_path, "r", encoding="utf-8") as f:
            self.drugs_catalog = json.load(f)

        self.is_loaded = True

    def predict(self, drug_a_id: str, drug_b_id: str, top_k: int = 3):
        self.load()

        vec_a = self.features_dict.get(drug_a_id, [0.0] * 50)
        vec_b = self.features_dict.get(drug_b_id, [0.0] * 50)

        # 100-dimensional feature vector
        feat = np.array([vec_a + vec_b], dtype=np.float32)
        feat_scaled = self.scaler.transform(feat)

        probs = self.model.predict_proba(feat_scaled)[0]
        top_indices = np.argsort(probs)[-top_k:][::-1]

        drug_a_name = self.drugs_catalog.get(drug_a_id, {}).get("name", drug_a_id)
        drug_b_name = self.drugs_catalog.get(drug_b_id, {}).get("name", drug_b_id)

        candidates = []
        for rank, idx in enumerate(top_indices, 1):
            t_id = int(self.le.inverse_transform([idx])[0])
            t_info = self.ddi_types.get(str(t_id), {})
            template = t_info.get("template", f"Interaction type {t_id}")
            desc = template.replace("Drug a", drug_a_name).replace("Drug b", drug_b_name)
            
            candidates.append({
                "rank": rank,
                "ddi_type": t_id,
                "probability": float(probs[idx]),
                "description": desc,
                "template": template
            })

        best = candidates[0]
        return {
            "drug_a_id": drug_a_id,
            "drug_b_id": drug_b_id,
            "drug_a_name": drug_a_name,
            "drug_b_name": drug_b_name,
            "predicted_ddi_type": best["ddi_type"],
            "confidence": best["probability"],
            "description": best["description"],
            "top_candidates": candidates
        }

if __name__ == "__main__":
    predictor = DDIPredictor()
    predictor.load()
    print("Testing predictor on DB00531 and DB09074...")
    result = predictor.predict("DB00531", "DB09074")
    print(json.dumps(result, indent=2))
