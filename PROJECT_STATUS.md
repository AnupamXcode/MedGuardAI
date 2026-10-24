# MediGuard AI — Project Status & Architectural Audit

**Date:** October 2026  
**System:** Intelligent Drug–Drug Interaction Detection and Severity Prediction System  
**Lead Engineer:** Full-Stack & Machine Learning Lead

---

## 1. Executive Summary

MediGuard AI provides precision pharmacovigilance and drug–drug interaction (DDI) intelligence. This audit establishes the baseline across:
1. **Frontend Architecture & Design System:** Google Stitch-generated UI screens with the `Clinical Clarity` theme specification.
2. **Research Datasets:** Seven comprehensive Excel research datasets (`pnas.1803294115.sd01.xlsx` through `sd07.xlsx`) originating from the landmark PNAS study on DeepDDI (*Ryu et al., 2018*).
3. **Machine Learning & Evidence Architecture:** Multi-class DDI type classification across 86 pharmacological interaction types, preserving the official research train/validation/test splits, with dual-path evidence retrieval (Verified Research Database vs. ML Prediction).

---

## 2. Dataset Audit & Inventory

The `dataset/` directory contains seven supplementary Excel datasets from *PNAS (10.1073/pnas.1803294115)*.

| Dataset File | Sheet Name | Total Rows | Data Rows | Primary Identifier | Role in MediGuard AI |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **`pnas.1803294115.sd01.xlsx`** | `Dataset S1` | 89 | 86 | Integer `DDI type` (1–86) | **Taxonomy & Explanation Templates**: Ground-truth natural language templates for 86 DDI types. |
| **`pnas.1803294115.sd02.xlsx`** | `Dataset S2` | 192,287 | 192,284 | DrugBank ID pairs (`DBxxxxx`) | **Primary DDI Training & Evidence Corpus**: Contains 192,284 interaction pairs across 1,710 unique approved drugs with official splits. |
| **`pnas.1803294115.sd03.xlsx`** | `Dataset S3` | 642 | 640 | Drug names | **External Benchmark**: DeepDDI predictions validated against Drugs.com clinical monograph consistency. |
| **`pnas.1803294115.sd04.xlsx`** | `Dataset S4` | 26,005 | 26,002 | Drug pairs + Alternative drug | **Alternative Medication Recommendations**: Pairs with negative health effects and suggested lower-risk alternatives. |
| **`pnas.1803294115.sd05.xlsx`** | `Dataset S5` | 358,999 | 358,996 | Food constituent + Drug | **Drug–Food Interaction Knowledge Base**: Pharmacological effects of dietary compounds on approved drugs. |
| **`pnas.1803294115.sd06.xlsx`** | `Dataset S6` | 4,570 | 4,567 | Food + Drug + KEGG Disease | **Condition & Disease Interactions**: Dietary constituents affecting drug bioavailability in specific diseases. |
| **`pnas.1803294115.sd07.xlsx`** | `Dataset S7` | 339 | 337 | Food constituent + Bioactivity | **Dietary Bioactivity Catalog**: Bioactivities inferred for specific nutritional compounds. |

### Detailed Findings for Core Datasets

#### Dataset S1 (`sd01.xlsx`) — 86 DDI Types
- **Header:** Row 2 contains `DDI type` and `General sentence structure`.
- **Labels:** 86 distinct pharmacological interaction categories (e.g., Type 1: *"Drug a can cause a decrease in the absorption of Drug b resulting in a reduced serum concentration and potentially a decrease in efficacy"*).
- **Integrity:** Zero missing values, zero corrupted templates.

#### Dataset S2 (`sd02.xlsx`) — Gold-Standard Interaction Corpus
- **Header:** Row 2 contains `Sentences describing the reported drug-drug interactions` and `Data type used to optimize the DNN architecture`.
- **Pre-existing Splits:**
  - `training`: 115,446 pairs (60.03%)
  - `validation`: 38,419 pairs (19.98%)
  - `testing`: 38,419 pairs (19.98%)
  - Total data rows: 192,284 pairs.
- **Drug Entities:** 1,710 unique DrugBank identifiers (`DBxxxxx`).
- **Template Regex Extraction:** Tested across sentences; 100% of data sentences map directly to one of the 86 DDI types from SD01 with extracted `Drug A`, `Drug B`, and `DDI Type`.
- **Leakage Prevention:** Official splits preserve the exact benchmarking distribution used in the peer-reviewed research, preventing split leakage.

#### Drug Vocabulary & Name Resolution
- SD02 uses DrugBank IDs (`DBxxxxx`). Clinical users require generic and brand names (e.g., *Warfarin, Aspirin, Lisinopril, Metformin*).
- Through the verified research vocabulary (`drugbank_slim_df.csv` and `Approved_drug_Information.txt`), 1,705 of 1,710 drugs (99.7%) map to official generic names, pharmacological classes, and SMILES structures. Remaining 5 IDs are resolved via the PubChem PUG-REST API.

---

## 3. Machine Learning & Clinical Severity Decisions

### Target Objective
- **Primary Task:** Multi-class classification of Drug–Drug Interaction Type (86 classes) given a candidate drug pair.
- **Baseline & Production Models:**
  - Feature representation: Structural fingerprints / drug entity vectors and pharmacological category profiles.
  - Model: High-efficiency neural classifier / gradient-boosted multi-class model benchmarked against the official test split (38,419 pairs).
  - Metrics: Macro-F1, Micro-F1, Precision, Recall, and Top-K accuracy.

### Policy on Clinical Severity Labels
- **Finding:** The research datasets contain **pharmacological interaction types**, NOT validated FDA/DrugBank severity tiers (e.g., Mild/Moderate/Severe).
- **Strict Rule Adherence:** MediGuard AI **will not invent** artificial severity scores or hallucinate severity levels.
- **Implementation:** The system will report the exact pharmacological interaction type and mechanism. Severity will be explicitly flagged as `Clinical Severity Tier: Unverified / Not Formally Classified by Research Dataset`, preventing clinical misinformation.

---

## 4. Frontend & Architecture Inventory

### Design System: `Clinical Clarity` (Google Stitch)
- **Palette:** Modern clinical teal/emerald design:
  - `surface`: `#eefdf8`
  - `surface-container-lowest`: `#ffffff`
  - `primary`: `#00624d` (Deep Medical Emerald)
  - `primary-container`: `#147d64`
  - `secondary`: `#006b5e`
  - `error`: `#ba1a1a`
  - `error-container`: `#ffdad6`
- **Typography:** Plus Jakarta Sans (Headlines/Display) + Inter (Body/Labels).
- **Screens:**
  1. **Overview Dashboard (`mediguard_ai_overview`):** Hero section, trust badges, pharmacological vector graphics, system metrics.
  2. **Interaction Checker (`mediguard_ai_interaction_checker`):** Autocomplete drug search, active medication buffer tags, patient condition selectors, clear & analyze actions.
  3. **Interaction Results (`mediguard_ai_interaction_results`):** Synthesis dossier, risk cards, pairwise collapsible accordions, pharmacological mechanism, evidence source badge.
  4. **My Medications (`mediguard_ai_my_medications`):** Patient medication cabinet, schedule, dosage.
  5. **Health Conditions (`conditions`):** Multi-condition screening view.
  6. **Interaction History (`history`):** Historical check logs and audit trail.
  7. **About & Safety (`about`):** Clinical disclaimer, methodology, data provenance.

---

## 5. Implementation Roadmap

- [x] **Phase 1: Project Audit** (Completed — `PROJECT_STATUS.md` generated)
- [ ] **Phase 2: Data Preparation** (Reusable ETL pipeline: parse SD01-SD07, resolve 1,710 drug names, generate clean parquet/JSON/SQLite database)
- [ ] **Phase 3: Machine Learning Pipeline** (Train 86-class interaction classifier on official 115k train / 38k test split, compute macro-F1/confusion metrics, export artifacts)
- [ ] **Phase 4: FastAPI Backend** (Search, interaction check, pairwise lookup, ML prediction fallback, health check, CORS)
- [ ] **Phase 5: Frontend Integration** (React + TypeScript + Vite + Tailwind, preserving Google Stitch design 100%, dynamic API integration)
- [ ] **Phase 6: Verification & Delivery** (Automated tests, production build verification, Windows run scripts, README)
