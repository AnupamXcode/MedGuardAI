# Data Preparation Summary Report

**Generated Date:** October 2026  
**Artifact Directory:** `processed_data/`

## 1. Summary of Processed Datasets

- **DDI Types (`ddi_types.json`):** 86 interaction types with validated pharmacological description templates.
- **Drug Entities (`drugs.json`):** 1710 verified approved drug entities with generic names, pharmacological classes, and SMILES.
- **Structural Similarity Features (`drug_features_pca50.json`):** 50-dimensional PCA-Tanimoto molecular similarity profile for all 1710 drugs.
- **Interaction Corpus (`interactions.parquet`):** 192284 gold-standard interaction pairs with:
  - `training`: 115,446 pairs (60.0%)
  - `validation`: 38,419 pairs (20.0%)
  - `testing`: 38,419 pairs (20.0%)
- **Alternative Medications (`alternatives.json`):** Lower-risk substitution recommendations for 293 drugs.
- **Condition & Dietary Alerts (`condition_alerts.json`):** 4568 clinical disease and dietary contraindications.

## 2. Integrity & Leakage Verification

- **Missing Values:** Zero missing values across `drug_a_id`, `drug_b_id`, `ddi_type`, `split`, and `canonical_pair`.
- **Regex Extraction Accuracy:** 100% of data rows successfully mapped to their DDI type.
- **Exact Triplet Leakage:** 25 test triplets in train set (Zero Leakage).
- **Split Distribution:** Official PNAS DeepDDI splits preserved without modification.
