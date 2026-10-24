import os
import json
from typing import List, Optional, Dict, Any

PROCESSED_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "..", "processed_data"))

class DrugService:
    def __init__(self, processed_dir: str = PROCESSED_DIR):
        self.processed_dir = processed_dir
        self.drugs: Dict[str, Dict[str, Any]] = {}
        self.name_to_id: Dict[str, str] = {}
        self.load()

    def load(self):
        drugs_path = os.path.join(self.processed_dir, "drugs.json")
        if not os.path.exists(drugs_path):
            raise FileNotFoundError(f"Drugs database not found at {drugs_path}")
        
        with open(drugs_path, "r", encoding="utf-8") as f:
            self.drugs = json.load(f)

        for drug_id, data in self.drugs.items():
            name = data.get("name", "").strip().lower()
            if name:
                self.name_to_id[name] = drug_id
            self.name_to_id[drug_id.lower()] = drug_id

        COMMON_ALIASES = {
            "aspirin": "DB00945",
            "paracetamol": "DB00316",
            "tylenol": "DB00316",
            "advil": "DB01050",
            "motrin": "DB01050",
            "lipitor": "DB01076",
            "zestril": "DB00722",
            "prinivil": "DB00722",
            "glucophage": "DB00331",
            "coumadin": "DB00682",
            "jantoven": "DB00682",
            "plavix": "DB00758",
            "lasix": "DB00695",
            "norvasc": "DB00381",
            "synthroid": "DB00451",
            "prilosec": "DB00338",
            "nexium": "DB00136",
            "lopressor": "DB00264",
            "toprol": "DB00264",
            "zocor": "DB00641",
            "crestor": "DB01098",
            "amoxil": "DB01060",
            "augmentin": "DB01060",
            "cipro": "DB00537",
            "zithromax": "DB00207",
            "prozac": "DB00472",
            "zoloft": "DB01104",
            "lexapro": "DB01175",
            "celexa": "DB00215",
            "effexor": "DB00285",
            "cymbalta": "DB00476",
            "xanax": "DB00404",
            "valium": "DB00829",
            "ativan": "DB00186",
            "klonopin": "DB01068",
            "ambien": "DB00422",
            "adderall": "DB00182",
            "ritalin": "DB00422",
            "cozaar": "DB00678",
            "diovan": "DB00177",
            "benicar": "DB00275"
        }

        for alias, db_id in COMMON_ALIASES.items():
            if db_id in self.drugs:
                self.name_to_id[alias] = db_id

    def search(self, query: str, limit: int = 15) -> List[Dict[str, Any]]:
        q = query.strip().lower()
        if not q:
            # Return popular representative drugs
            popular = ["warfarin", "aspirin", "lisinopril", "metformin", "atorvastatin", "ibuprofen", "amoxicillin", "clopidogrel"]
            results = []
            for name in popular:
                if name in self.name_to_id:
                    results.append(self.drugs[self.name_to_id[name]])
            return results[:limit]

        matches = []
        # Priority 1: Exact prefix match on drug name
        for drug_id, d in self.drugs.items():
            name_lower = d.get("name", "").lower()
            if name_lower.startswith(q) or drug_id.lower().startswith(q):
                matches.append((1, d))
            elif q in name_lower:
                matches.append((2, d))
            elif any(q in c.lower() for c in d.get("categories", [])):
                matches.append((3, d))

        # Sort by match priority, then alphabetical by name
        matches.sort(key=lambda x: (x[0], x[1].get("name", "")))
        return [m[1] for m in matches[:limit]]

    def get_by_id_or_name(self, identifier: str) -> Optional[Dict[str, Any]]:
        clean = identifier.strip()
        lower = clean.lower()
        
        # Check direct ID match
        if clean in self.drugs:
            return self.drugs[clean]
        
        # Check lowercase ID or name mapping
        if lower in self.name_to_id:
            return self.drugs[self.name_to_id[lower]]

        # Substring search fallback
        for name, drug_id in self.name_to_id.items():
            if lower == name or lower in name:
                return self.drugs[drug_id]

        return None

# Singleton instance
drug_service = DrugService()
