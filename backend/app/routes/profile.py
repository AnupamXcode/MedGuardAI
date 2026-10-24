import json
from datetime import datetime, timezone
from typing import List, Optional
from fastapi import APIRouter, HTTPException, status, Depends

from backend.app.schemas.auth import (
    UserBase,
    ProfileDetails,
    UserMedicationItem,
    EmergencyContactItem,
    UserFullProfileResponse,
    OnboardingSaveRequest,
    UpdateAccountSettingsRequest,
    SaveHistoryRequest
)
from backend.app.services.auth_service import get_current_user, hash_password, verify_password
from backend.app.services.user_db import get_db_connection

router = APIRouter(prefix="/profile", tags=["Personal Health Profile & Settings"])

def calculate_completion_percentage(profile_row, conditions, meds, contacts) -> int:
    score = 25  # Base account created (name + email)
    if profile_row and (profile_row["dob"] or profile_row["gender"]):
        score += 20
    if conditions and len(conditions) > 0:
        score += 20
    if meds and len(meds) > 0:
        score += 20
    if contacts and len(contacts) > 0:
        score += 15
    return min(100, score)

@router.get("", response_model=UserFullProfileResponse)
def get_profile(current_user: dict = Depends(get_current_user)):
    user_id = current_user["id"]
    conn = get_db_connection()
    cursor = conn.cursor()

    # 1. Profile details
    cursor.execute("SELECT dob, age, gender, allergies, health_notes, profile_photo FROM user_profiles WHERE user_id = ?", (user_id,))
    p_row = cursor.fetchone()

    allergies_list = []
    if p_row and p_row["allergies"]:
        try:
            allergies_list = json.loads(p_row["allergies"])
        except Exception:
            allergies_list = [a.strip() for a in p_row["allergies"].split(",") if a.strip()]

    profile_details = ProfileDetails(
        dob=p_row["dob"] if p_row else None,
        age=p_row["age"] if p_row else None,
        gender=p_row["gender"] if p_row else None,
        allergies=allergies_list,
        health_notes=p_row["health_notes"] if p_row else None,
        profile_photo=p_row["profile_photo"] if p_row else None
    )

    # 2. Conditions
    cursor.execute("SELECT condition_name FROM user_conditions WHERE user_id = ?", (user_id,))
    cond_rows = cursor.fetchall()
    conditions = [r["condition_name"] for r in cond_rows]

    # 3. Medications
    cursor.execute("SELECT id, drug_id, drug_name, dosage, frequency, start_date, is_active FROM user_medications WHERE user_id = ?", (user_id,))
    med_rows = cursor.fetchall()
    medications = [
        UserMedicationItem(
            id=r["id"],
            drug_id=r["drug_id"],
            drug_name=r["drug_name"],
            dosage=r["dosage"],
            frequency=r["frequency"],
            start_date=r["start_date"],
            is_active=bool(r["is_active"])
        )
        for r in med_rows
    ]

    # 4. Emergency Contacts
    cursor.execute("SELECT id, name, relationship, phone, is_primary FROM emergency_contacts WHERE user_id = ?", (user_id,))
    contact_rows = cursor.fetchall()
    contacts = [
        EmergencyContactItem(
            id=r["id"],
            name=r["name"],
            relationship=r["relationship"],
            phone=r["phone"],
            is_primary=bool(r["is_primary"])
        )
        for r in contact_rows
    ]

    completion = calculate_completion_percentage(p_row, conditions, medications, contacts)

    cursor.execute("SELECT id, email, full_name, phone, onboarding_completed, created_at FROM users WHERE id = ?", (user_id,))
    u_row = cursor.fetchone() or current_user

    conn.close()

    user_base = UserBase(
        id=u_row["id"],
        email=u_row["email"],
        full_name=u_row["full_name"],
        phone=u_row.get("phone") if isinstance(u_row, dict) else u_row["phone"],
        onboarding_completed=bool(u_row.get("onboarding_completed", 0) if isinstance(u_row, dict) else u_row["onboarding_completed"]),
        created_at=u_row["created_at"]
    )

    return UserFullProfileResponse(
        user=user_base,
        profile=profile_details,
        conditions=conditions,
        medications=medications,
        emergency_contacts=contacts,
        profile_completion_percentage=completion
    )

@router.post("/onboarding", response_model=UserFullProfileResponse)
def save_onboarding(req: OnboardingSaveRequest, current_user: dict = Depends(get_current_user)):
    user_id = current_user["id"]
    conn = get_db_connection()
    cursor = conn.cursor()
    now_iso = datetime.now(timezone.utc).isoformat()

    # Step 1: Update user table if name or phone changed
    if req.full_name or req.phone:
        cursor.execute("""
        UPDATE users
        SET full_name = COALESCE(?, full_name),
            phone = COALESCE(?, phone),
            onboarding_completed = 1,
            updated_at = ?
        WHERE id = ?;
        """, (req.full_name, req.phone, now_iso, user_id))
    else:
        cursor.execute("UPDATE users SET onboarding_completed = 1, updated_at = ? WHERE id = ?", (now_iso, user_id))

    # Step 1 & 2: Update Profile
    allergies_json = json.dumps(req.allergies) if req.allergies else "[]"
    cursor.execute("""
    INSERT INTO user_profiles (user_id, dob, age, gender, allergies, health_notes, profile_photo, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(user_id) DO UPDATE SET
        dob = excluded.dob,
        age = excluded.age,
        gender = excluded.gender,
        allergies = excluded.allergies,
        health_notes = excluded.health_notes,
        profile_photo = excluded.profile_photo,
        updated_at = excluded.updated_at;
    """, (user_id, req.dob, req.age, req.gender, allergies_json, req.health_notes, req.profile_photo, now_iso))

    # Step 2: Replace conditions
    cursor.execute("DELETE FROM user_conditions WHERE user_id = ?", (user_id,))
    for c in req.conditions:
        c_clean = c.strip()
        if c_clean:
            cursor.execute("INSERT INTO user_conditions (user_id, condition_name) VALUES (?, ?)", (user_id, c_clean))

    # Step 3: Replace medications
    cursor.execute("DELETE FROM user_medications WHERE user_id = ?", (user_id,))
    for m in req.medications:
        cursor.execute("""
        INSERT INTO user_medications (user_id, drug_id, drug_name, dosage, frequency, start_date, is_active)
        VALUES (?, ?, ?, ?, ?, ?, 1);
        """, (user_id, m.drug_id, m.drug_name.strip(), m.dosage.strip(), m.frequency.strip(), m.start_date))

    # Step 4: Replace emergency contacts
    cursor.execute("DELETE FROM emergency_contacts WHERE user_id = ?", (user_id,))
    for idx, ec in enumerate(req.emergency_contacts):
        cursor.execute("""
        INSERT INTO emergency_contacts (user_id, name, relationship, phone, is_primary)
        VALUES (?, ?, ?, ?, ?);
        """, (user_id, ec.name.strip(), ec.relationship.strip(), ec.phone.strip(), 1 if idx == 0 else 0))

    conn.commit()
    conn.close()

    # Return refreshed profile
    return get_profile(current_user=current_user)

@router.post("/medications", response_model=UserMedicationItem)
def add_medication(item: UserMedicationItem, current_user: dict = Depends(get_current_user)):
    user_id = current_user["id"]
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("""
    INSERT INTO user_medications (user_id, drug_id, drug_name, dosage, frequency, start_date, is_active)
    VALUES (?, ?, ?, ?, ?, ?, 1);
    """, (user_id, item.drug_id, item.drug_name.strip(), item.dosage.strip(), item.frequency.strip(), item.start_date))
    
    med_id = cursor.lastrowid
    conn.commit()
    conn.close()

    item.id = med_id
    return item

@router.delete("/medications/{med_id}")
def delete_medication(med_id: int, current_user: dict = Depends(get_current_user)):
    user_id = current_user["id"]
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT id FROM user_medications WHERE id = ? AND user_id = ?", (med_id, user_id))
    if not cursor.fetchone():
        conn.close()
        raise HTTPException(status_code=404, detail="Medication record not found or unauthorized.")

    cursor.execute("DELETE FROM user_medications WHERE id = ? AND user_id = ?", (med_id, user_id))
    conn.commit()
    conn.close()
    return {"status": "success", "message": "Medication removed successfully."}

@router.post("/conditions")
def update_conditions(conditions: List[str], current_user: dict = Depends(get_current_user)):
    user_id = current_user["id"]
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("DELETE FROM user_conditions WHERE user_id = ?", (user_id,))
    for c in conditions:
        if c.strip():
            cursor.execute("INSERT INTO user_conditions (user_id, condition_name) VALUES (?, ?)", (user_id, c.strip()))

    conn.commit()
    conn.close()
    return {"status": "success", "conditions": conditions}

@router.post("/emergency-contacts", response_model=EmergencyContactItem)
def add_emergency_contact(contact: EmergencyContactItem, current_user: dict = Depends(get_current_user)):
    user_id = current_user["id"]
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("""
    INSERT INTO emergency_contacts (user_id, name, relationship, phone, is_primary)
    VALUES (?, ?, ?, ?, ?);
    """, (user_id, contact.name.strip(), contact.relationship.strip(), contact.phone.strip(), 1 if contact.is_primary else 0))
    
    c_id = cursor.lastrowid
    conn.commit()
    conn.close()

    contact.id = c_id
    return contact

@router.delete("/emergency-contacts/{contact_id}")
def delete_emergency_contact(contact_id: int, current_user: dict = Depends(get_current_user)):
    user_id = current_user["id"]
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT id FROM emergency_contacts WHERE id = ? AND user_id = ?", (contact_id, user_id))
    if not cursor.fetchone():
        conn.close()
        raise HTTPException(status_code=404, detail="Contact record not found or unauthorized.")

    cursor.execute("DELETE FROM emergency_contacts WHERE id = ? AND user_id = ?", (contact_id, user_id))
    conn.commit()
    conn.close()
    return {"status": "success", "message": "Emergency contact removed."}

@router.put("/account")
def update_account(req: UpdateAccountSettingsRequest, current_user: dict = Depends(get_current_user)):
    user_id = current_user["id"]
    conn = get_db_connection()
    cursor = conn.cursor()
    now_iso = datetime.now(timezone.utc).isoformat()

    # If updating password, verify current password
    if req.new_password:
        if not req.current_password:
            conn.close()
            raise HTTPException(status_code=400, detail="Current password is required to set a new password.")
        
        cursor.execute("SELECT hashed_password FROM users WHERE id = ?", (user_id,))
        row = cursor.fetchone()
        if not row or not verify_password(req.current_password, row["hashed_password"]):
            conn.close()
            raise HTTPException(status_code=401, detail="Incorrect current password.")
        
        new_hashed = hash_password(req.new_password)
        cursor.execute("UPDATE users SET hashed_password = ?, updated_at = ? WHERE id = ?", (new_hashed, now_iso, user_id))

    if req.full_name or req.phone:
        cursor.execute("""
        UPDATE users
        SET full_name = COALESCE(?, full_name),
            phone = COALESCE(?, phone),
            updated_at = ?
        WHERE id = ?;
        """, (req.full_name, req.phone, now_iso, user_id))

    conn.commit()
    conn.close()
    return {"status": "success", "message": "Account profile successfully updated."}

@router.delete("/account")
def delete_account(current_user: dict = Depends(get_current_user)):
    user_id = current_user["id"]
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM users WHERE id = ?", (user_id,))
    conn.commit()
    conn.close()
    return {"status": "success", "message": "Account and all associated health records permanently deleted."}

@router.post("/history")
def save_screening_history(req: SaveHistoryRequest, current_user: dict = Depends(get_current_user)):
    user_id = current_user["id"]
    conn = get_db_connection()
    cursor = conn.cursor()
    now_iso = datetime.now(timezone.utc).isoformat()

    cursor.execute("""
    INSERT INTO user_history (user_id, timestamp, medications_json, conditions_json, summary_json, results_json)
    VALUES (?, ?, ?, ?, ?, ?);
    """, (
        user_id,
        now_iso,
        json.dumps(req.medications),
        json.dumps(req.conditions),
        json.dumps(req.summary),
        json.dumps(req.results)
    ))
    conn.commit()
    conn.close()
    return {"status": "success"}

@router.get("/history")
def get_screening_history(current_user: dict = Depends(get_current_user)):
    user_id = current_user["id"]
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
    SELECT id, timestamp, medications_json, conditions_json, summary_json, results_json
    FROM user_history WHERE user_id = ? ORDER BY id DESC LIMIT 20;
    """, (user_id,))
    rows = cursor.fetchall()
    conn.close()

    history_items = []
    for r in rows:
        history_items.append({
            "id": str(r["id"]),
            "timestamp": r["timestamp"],
            "medications": json.loads(r["medications_json"]),
            "conditions": json.loads(r["conditions_json"]),
            "summary": json.loads(r["summary_json"]),
            "results": json.loads(r["results_json"])
        })
    return history_items
