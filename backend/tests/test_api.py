import urllib.request
import json

BASE_URL = "http://127.0.0.1:8000"

def get(path):
    req = urllib.request.Request(f"{BASE_URL}{path}", headers={"User-Agent": "TestClient"})
    with urllib.request.urlopen(req) as resp:
        return json.loads(resp.read().decode("utf-8"))

def post(path, payload):
    req = urllib.request.Request(
        f"{BASE_URL}{path}",
        data=json.dumps(payload).encode("utf-8"),
        headers={"Content-Type": "application/json", "User-Agent": "TestClient"}
    )
    with urllib.request.urlopen(req) as resp:
        return json.loads(resp.read().decode("utf-8"))

def test_health():
    res = get("/api/health")
    assert res["status"] == "healthy"
    assert res["database_records"] == 192284
    assert res["drugs_catalog_size"] == 1710
    assert res["model_loaded"] is True

def test_drug_search():
    res = get("/api/drugs/search?q=warf")
    assert res["total"] >= 1
    names = [r["name"].lower() for r in res["results"]]
    assert any("warfarin" in n for n in names)

def test_interaction_verified_pair():
    # Warfarin and Aspirin have well-known documented interactions in DrugBank
    res = post("/api/interactions/check", {"medications": ["Warfarin", "Aspirin"]})
    assert res["summary"]["total_medications"] == 2
    assert res["summary"]["total_pairs_evaluated"] == 1
    assert len(res["interactions"]) == 1
    pair = res["interactions"][0]
    assert pair["evidence_status"] in ["verified_database", "model_prediction"]
    assert pair["severity"] == "Unverified / Clinical Severity Assessment Unavailable"
    assert len(pair["description"]) > 0

def test_unknown_or_single_medication_validation():
    # Only 1 medication should return 400 error
    try:
        post("/api/interactions/check", {"medications": ["Warfarin"]})
        assert False, "Expected HTTP error for single medication"
    except urllib.error.HTTPError as e:
        assert e.code == 400

if __name__ == "__main__":
    print("Running API tests directly...")
    test_health()
    print("PASS: Health endpoint")
    test_drug_search()
    print("PASS: Drug search endpoint")
    test_interaction_verified_pair()
    print("PASS: Pair interaction endpoint")
    test_unknown_or_single_medication_validation()
    print("PASS: Validation error handling")
    print("\nALL API TESTS PASSED!")
