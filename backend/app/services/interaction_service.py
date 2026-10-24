import os
import json
import sqlite3
import itertools
from typing import List, Dict, Any, Optional

from backend.app.services.drug_service import drug_service
from backend.ml.predict import DDIPredictor

PROCESSED_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "..", "processed_data"))

class InteractionService:
    def __init__(self, processed_dir: str = PROCESSED_DIR):
        self.processed_dir = processed_dir
        self.db_path = os.path.join(self.processed_dir, "interactions.db")
        self.alternatives: Dict[str, List[str]] = {}
        self.condition_alerts: List[Dict[str, str]] = []
        self.predictor = DDIPredictor()
        self.load_metadata()

    def load_metadata(self):
        alt_path = os.path.join(self.processed_dir, "alternatives.json")
        if os.path.exists(alt_path):
            with open(alt_path, "r", encoding="utf-8") as f:
                self.alternatives = json.load(f)

        alerts_path = os.path.join(self.processed_dir, "condition_alerts.json")
        if os.path.exists(alerts_path):
            with open(alerts_path, "r", encoding="utf-8") as f:
                self.condition_alerts = json.load(f)

    def check_regimen(self, medication_inputs: List[str], condition_inputs: Optional[List[str]] = None) -> Dict[str, Any]:
        condition_inputs = condition_inputs or []
        
        # 1. Resolve drugs to DrugBank objects
        resolved_drugs = []
        unresolved = []
        for raw in medication_inputs:
            d = drug_service.get_by_id_or_name(raw)
            if d:
                # Prevent duplicates in regimen
                if not any(x["id"] == d["id"] for x in resolved_drugs):
                    resolved_drugs.append(d)
            else:
                unresolved.append(raw)

        if len(resolved_drugs) < 2:
            return {
                "summary": {
                    "total_medications": len(resolved_drugs),
                    "total_pairs_evaluated": 0,
                    "verified_interactions_count": 0,
                    "predicted_interactions_count": 0,
                    "insufficient_evidence_count": 0,
                    "has_critical_interaction": False
                },
                "interactions": [],
                "condition_alerts": [],
                "unresolved_medications": unresolved,
                "disclaimer": "At least two medications are required to perform a pairwise drug–drug interaction evaluation."
            }

        # 2. Pairwise evaluation
        pairs = list(itertools.combinations(resolved_drugs, 2))
        results = []
        verified_count = 0
        predicted_count = 0
        insufficient_count = 0

        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()

        for drug_a, drug_b in pairs:
            id_a, id_b = drug_a["id"], drug_b["id"]
            name_a, name_b = drug_a["name"], drug_b["name"]
            canonical = f"{min(id_a, id_b)}_{max(id_a, id_b)}"

            # Step 2a: Lookup in gold-standard verified research database
            cursor.execute(
                "SELECT ddi_type, description, split FROM interactions WHERE canonical_pair = ? LIMIT 1",
                (canonical,)
            )
            row = cursor.fetchone()

            if row:
                t_id, desc, split_name = row
                verified_count += 1
                
                # Fetch alternatives
                alts = []
                for n in [name_a, name_b]:
                    if n in self.alternatives:
                        alts.extend(self.alternatives[n][:3])

                results.append({
                    "drug_a_id": id_a,
                    "drug_a_name": name_a,
                    "drug_b_id": id_b,
                    "drug_b_name": name_b,
                    "evidence_status": "verified_database",
                    "interaction_type": int(t_id),
                    "description": desc,
                    "source": f"DrugBank Gold-Standard Research Corpus ({split_name.capitalize()} split)",
                    "confidence": 1.0,
                    "severity": "Unverified / Clinical Severity Assessment Unavailable",
                    "alternatives": list(dict.fromkeys(alts))
                })
            else:
                # Step 2b: Predict using trained DeepDDI Neural Classifier
                try:
                    pred = self.predictor.predict(id_a, id_b)
                    conf = pred.get("confidence", 0.0)
                    
                    if conf >= 0.35:
                        predicted_count += 1
                        
                        alts = []
                        for n in [name_a, name_b]:
                            if n in self.alternatives:
                                alts.extend(self.alternatives[n][:3])

                        results.append({
                            "drug_a_id": id_a,
                            "drug_a_name": name_a,
                            "drug_b_id": id_b,
                            "drug_b_name": name_b,
                            "evidence_status": "model_prediction",
                            "interaction_type": int(pred["predicted_ddi_type"]),
                            "description": pred["description"],
                            "source": "MediGuard DeepDDI Neural Classifier (86-Type Architecture)",
                            "confidence": round(conf, 4),
                            "severity": "Unverified / Clinical Severity Assessment Unavailable",
                            "alternatives": list(dict.fromkeys(alts))
                        })
                    else:
                        insufficient_count += 1
                        results.append({
                            "drug_a_id": id_a,
                            "drug_a_name": name_a,
                            "drug_b_id": id_b,
                            "drug_b_name": name_b,
                            "evidence_status": "insufficient_evidence",
                            "interaction_type": None,
                            "description": f"No documented interaction was found between {name_a} and {name_b} in the verified clinical research corpus, and structural predictive confidence is below threshold. NOTE: An absent record does NOT establish clinical safety.",
                            "source": "No Established Evidence",
                            "confidence": None,
                            "severity": "Unverified / Clinical Severity Assessment Unavailable",
                            "alternatives": []
                        })
                except Exception as e:
                    insufficient_count += 1
                    results.append({
                        "drug_a_id": id_a,
                        "drug_a_name": name_a,
                        "drug_b_id": id_b,
                        "drug_b_name": name_b,
                        "evidence_status": "insufficient_evidence",
                        "interaction_type": None,
                        "description": f"Evaluation unavailable for {name_a} and {name_b}: {str(e)}",
                        "source": "Insufficient Evidence",
                        "confidence": None,
                        "severity": "Unverified / Clinical Severity Assessment Unavailable",
                        "alternatives": []
                    })

        conn.close()

        # Step 3: Match condition alerts
        matched_condition_alerts = []
        drug_names_in_regimen = {d["name"].lower(): d["name"] for d in resolved_drugs}
        
        for alert in self.condition_alerts:
            alert_drug = alert.get("drug", "").lower()
            alert_disease = alert.get("disease", "").lower()
            
            # Check if drug is in regimen
            if alert_drug in drug_names_in_regimen:
                # If patient specified conditions, filter by condition; else include if high relevance
                matching_cond = None
                for c in condition_inputs:
                    c_clean = c.lower().strip()
                    if c_clean and (c_clean in alert_disease or alert_disease in c_clean):
                        matching_cond = c
                        break
                        
                if matching_cond or len(condition_inputs) == 0:
                    matched_condition_alerts.append({
                        "condition": matching_cond if matching_cond else alert.get("disease"),
                        "drug_name": drug_names_in_regimen[alert_drug],
                        "warning": alert.get("warning"),
                        "food_constituent": alert.get("food_constituent"),
                        "source": "Research Dataset SD06 (KEGG Disease & Dietary Interference)"
                    })

        # Step 4: Summary & Disclaimer
        has_critical = (verified_count > 0 or predicted_count > 0)
        
        summary = {
            "total_medications": len(resolved_drugs),
            "total_pairs_evaluated": len(pairs),
            "verified_interactions_count": verified_count,
            "predicted_interactions_count": predicted_count,
            "insufficient_evidence_count": insufficient_count,
            "has_critical_interaction": has_critical
        }

        disclaimer = (
            "MediGuard AI is a clinical pharmacovigilance intelligence tool developed for educational, "
            "research, and decision-support purposes. Absence of an interaction record does NOT imply "
            "that two medicines are safe in combination. Always verify therapeutic regimens with a licensed "
            "physician or board-certified clinical pharmacist."
        )

        return {
            "summary": summary,
            "interactions": results,
            "condition_alerts": matched_condition_alerts[:5],
            "unresolved_medications": unresolved,
            "disclaimer": disclaimer
        }

interaction_service = InteractionService()
