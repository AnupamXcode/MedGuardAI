import os
import sys
import subprocess
import time

def run_suite(name, command):
    print(f"\n==========================================")
    print(f"  RUNNING SUITE: {name}")
    print(f"==========================================")
    t0 = time.time()
    res = subprocess.run(command, shell=True, text=True, capture_output=True)
    dt = time.time() - t0
    
    print(res.stdout)
    if res.stderr:
        print("STDERR:", res.stderr)
        
    if res.returncode == 0:
        print(f"--> [PASS] {name} completed in {dt:.2f}s")
        return True
    else:
        print(f"--> [FAIL] {name} exited with code {res.returncode}")
        return False

def main():
    print("************************************************************")
    print("    MediGuard AI - Comprehensive Test Verification Suite    ")
    print("************************************************************")
    
    all_passed = True

    # 1. Preprocessed Data Integrity Tests
    pass_data = run_suite("Data Preprocessing Integrity", "py -3.11 backend/data_preparation/validate_data.py")
    if not pass_data: all_passed = False

    # 2. ML Prediction Unit Tests
    pass_ml = run_suite("Machine Learning Inference Tests", "py -3.11 backend/tests/test_ml.py")
    if not pass_ml: all_passed = False

    # 3. FastAPI Endpoint Integration Tests
    pass_api = run_suite("FastAPI Integration & Route Validation", "py -3.11 backend/tests/test_api.py")
    if not pass_api: all_passed = False

    # 4. Frontend Production Build Check
    pass_build = run_suite("Frontend TypeScript & Vite Production Build", "npm run build --prefix frontend")
    if not pass_build: all_passed = False

    print("\n************************************************************")
    if all_passed:
        print("    OVERALL RESULT: ALL 4 TEST SUITES PASSED (100% GREEN)    ")
    else:
        print("    OVERALL RESULT: SOME TEST SUITES FAILED                ")
    print("************************************************************\n")
    sys.exit(0 if all_passed else 1)

if __name__ == "__main__":
    main()
