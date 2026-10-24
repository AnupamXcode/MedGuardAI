import os
import sys
import unittest

# Ensure root is in python path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..")))

from backend.ml.predict import DDIPredictor

class TestDDIPrediction(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.predictor = DDIPredictor()
        cls.predictor.load()

    def test_predictor_loaded(self):
        self.assertTrue(self.predictor.is_loaded)
        self.assertIsNotNone(self.predictor.model)
        self.assertIsNotNone(self.predictor.scaler)
        self.assertIsNotNone(self.predictor.le)
        self.assertEqual(len(self.predictor.features_dict), 1710)
        self.assertEqual(len(self.predictor.ddi_types), 86)

    def test_prediction_output_structure(self):
        # Cyclophosphamide (DB00531) and Olaparib (DB09074)
        res = self.predictor.predict("DB00531", "DB09074", top_k=3)
        self.assertEqual(res["drug_a_id"], "DB00531")
        self.assertEqual(res["drug_b_id"], "DB09074")
        self.assertIn("predicted_ddi_type", res)
        self.assertIsInstance(res["predicted_ddi_type"], int)
        self.assertTrue(1 <= res["predicted_ddi_type"] <= 86)
        self.assertTrue(0.0 <= res["confidence"] <= 1.0)
        self.assertIn("description", res)
        self.assertGreater(len(res["description"]), 0)
        self.assertEqual(len(res["top_candidates"]), 3)

    def test_top_k_candidates_ordering(self):
        res = self.predictor.predict("DB00682", "DB00945", top_k=5)
        candidates = res["top_candidates"]
        self.assertEqual(len(candidates), 5)
        # Check descending probability
        for i in range(len(candidates) - 1):
            self.assertGreaterEqual(candidates[i]["probability"], candidates[i + 1]["probability"])

    def test_unknown_or_fallback_drug_id(self):
        # Test with an uncataloged dummy ID to ensure imputation works without crashing
        res = self.predictor.predict("DB99999", "DB00682", top_k=3)
        self.assertIsNotNone(res)
        self.assertTrue(1 <= res["predicted_ddi_type"] <= 86)
        self.assertTrue(0.0 <= res["confidence"] <= 1.0)

if __name__ == "__main__":
    unittest.main()
