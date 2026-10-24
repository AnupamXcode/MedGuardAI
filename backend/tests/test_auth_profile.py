import urllib.request
import json
import unittest

BASE_URL = "http://127.0.0.1:8000"

def request_json(method, path, payload=None, token=None):
    headers = {
        "Content-Type": "application/json",
        "User-Agent": "TestClient"
    }
    if token:
        headers["Authorization"] = f"Bearer {token}"
        
    data = json.dumps(payload).encode("utf-8") if payload else None
    req = urllib.request.Request(f"{BASE_URL}{path}", data=data, headers=headers, method=method)
    try:
        with urllib.request.urlopen(req) as resp:
            return resp.status, json.loads(resp.read().decode("utf-8"))
    except urllib.error.HTTPError as e:
        error_body = e.read().decode("utf-8")
        try:
            return e.code, json.loads(error_body)
        except Exception:
            return e.code, {"detail": error_body}

import time

class TestAuthAndProfile(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        ts = int(time.time())
        cls.user1_email = f"sarah.jenkins.{ts}@hospital.org"
        cls.user1_pass = "ClinicalPass2026!"
        cls.user2_email = f"alex.rivera.{ts}@clinic.edu"
        cls.user2_pass = "SecurePass789!"
        cls.token1 = None
        cls.token2 = None

    def test_01_register_user(self):
        # Register user 1
        status, res = request_json("POST", "/api/auth/register", {
            "email": self.user1_email,
            "password": self.user1_pass,
            "full_name": "Dr. Sarah Jenkins",
            "phone": "+1 (555) 234-5678"
        })
        # If user already exists (from prior run), status may be 409, then login
        if status == 409:
            status, res = request_json("POST", "/api/auth/login", {
                "email": self.user1_email,
                "password": self.user1_pass
            })
            self.assertEqual(status, 200)
        else:
            self.assertEqual(status, 201)
            self.assertIn("access_token", res)
            self.assertEqual(res["user"]["email"], self.user1_email)

        self.__class__.token1 = res["access_token"]

    def test_02_register_duplicate_email(self):
        status, res = request_json("POST", "/api/auth/register", {
            "email": self.user1_email,
            "password": "AnotherPassword123",
            "full_name": "Imposter"
        })
        self.assertEqual(status, 409)

    def test_03_login_invalid_password(self):
        status, res = request_json("POST", "/api/auth/login", {
            "email": self.user1_email,
            "password": "WrongPassword!"
        })
        self.assertEqual(status, 401)

    def test_04_unauthenticated_profile_access_denied(self):
        status, res = request_json("GET", "/api/profile")
        self.assertEqual(status, 401)

    def test_05_authenticated_profile_retrieval(self):
        status, res = request_json("GET", "/api/profile", token=self.token1)
        self.assertEqual(status, 200)
        self.assertEqual(res["user"]["email"], self.user1_email)
        self.assertIn("profile_completion_percentage", res)

    def test_06_onboarding_wizard_submission(self):
        payload = {
            "full_name": "Dr. Sarah Jenkins, PharmD",
            "phone": "+1 (555) 234-5678",
            "dob": "1988-06-15",
            "age": 38,
            "gender": "Female",
            "conditions": ["Essential Hypertension", "Type 2 Diabetes"],
            "allergies": ["Penicillin", "Sulfa Drugs"],
            "health_notes": "Monitored for renal clearance every 6 months.",
            "medications": [
                {
                    "drug_id": "DB00682",
                    "drug_name": "Warfarin",
                    "dosage": "5mg",
                    "frequency": "Once daily at bedtime",
                    "start_date": "2024-01-15",
                    "is_active": True
                },
                {
                    "drug_id": "DB00722",
                    "drug_name": "Lisinopril",
                    "dosage": "10mg",
                    "frequency": "Once daily in morning",
                    "start_date": "2023-05-10",
                    "is_active": True
                }
            ],
            "emergency_contacts": [
                {
                    "name": "David Jenkins",
                    "relationship": "Spouse",
                    "phone": "+1 (555) 987-6543",
                    "is_primary": True
                }
            ]
        }
        status, res = request_json("POST", "/api/profile/onboarding", payload, token=self.token1)
        self.assertEqual(status, 200)
        self.assertTrue(res["user"]["onboarding_completed"])
        self.assertEqual(len(res["conditions"]), 2)
        self.assertEqual(len(res["medications"]), 2)
        self.assertEqual(len(res["emergency_contacts"]), 1)
        self.assertGreaterEqual(res["profile_completion_percentage"], 80)

    def test_07_user_isolation_and_authorization(self):
        # Register user 2
        status, res2 = request_json("POST", "/api/auth/register", {
            "email": self.user2_email,
            "password": self.user2_pass,
            "full_name": "Alex Rivera",
            "phone": "+1 (555) 345-6789"
        })
        if status == 409:
            status, res2 = request_json("POST", "/api/auth/login", {
                "email": self.user2_email,
                "password": self.user2_pass
            })
        self.token2 = res2["access_token"]

        # User 2 profile should NOT see User 1's medications or contacts
        status, u2_profile = request_json("GET", "/api/profile", token=self.token2)
        self.assertEqual(status, 200)
        self.assertEqual(u2_profile["user"]["email"], self.user2_email)
        self.assertEqual(len(u2_profile["medications"]), 0)
        self.assertEqual(len(u2_profile["emergency_contacts"]), 0)

        # Attempt by User 2 to delete User 1's medication should fail
        # Get User 1's med ID
        _, u1_profile = request_json("GET", "/api/profile", token=self.token1)
        med_id = u1_profile["medications"][0]["id"]
        status, del_res = request_json("DELETE", f"/api/profile/medications/{med_id}", token=self.token2)
        self.assertEqual(status, 404)

    def test_08_forgot_password_flow(self):
        status, res = request_json("POST", "/api/auth/forgot-password", {
            "email": self.user1_email,
            "new_password": "NewUpdatedClinicalPass2026!"
        })
        self.assertEqual(status, 200)

        # Test login with old password fails
        status, _ = request_json("POST", "/api/auth/login", {
            "email": self.user1_email,
            "password": self.user1_pass
        })
        self.assertEqual(status, 401)

        # Test login with new password succeeds
        status, res = request_json("POST", "/api/auth/login", {
            "email": self.user1_email,
            "password": "NewUpdatedClinicalPass2026!"
        })
        self.assertEqual(status, 200)
        self.assertIn("access_token", res)

if __name__ == "__main__":
    unittest.main()
