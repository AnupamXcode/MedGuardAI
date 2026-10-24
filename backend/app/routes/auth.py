import json
from datetime import datetime, timezone
from fastapi import APIRouter, HTTPException, status, Depends

from backend.app.schemas.auth import (
    UserRegisterRequest,
    UserLoginRequest,
    ForgotPasswordRequest,
    AuthResponse,
    UserBase
)
from backend.app.services.auth_service import (
    hash_password,
    verify_password,
    create_access_token,
    get_current_user
)
from backend.app.services.user_db import get_db_connection

router = APIRouter(prefix="/auth", tags=["User Authentication & Security"])

@router.post("/register", response_model=AuthResponse, status_code=status.HTTP_201_CREATED)
def register(req: UserRegisterRequest):
    email = req.email.strip().lower()
    full_name = req.full_name.strip()
    
    conn = get_db_connection()
    cursor = conn.cursor()

    # Check if user already exists
    cursor.execute("SELECT id FROM users WHERE email = ?", (email,))
    if cursor.fetchone():
        conn.close()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="An account with this email address already exists. Please log in."
        )

    hashed = hash_password(req.password)
    now_iso = datetime.now(timezone.utc).isoformat()

    cursor.execute("""
    INSERT INTO users (email, hashed_password, full_name, phone, onboarding_completed, created_at, updated_at)
    VALUES (?, ?, ?, ?, 0, ?, ?);
    """, (email, hashed, full_name, req.phone.strip() if req.phone else None, now_iso, now_iso))
    
    user_id = cursor.lastrowid

    # Create empty profile record
    cursor.execute("""
    INSERT INTO user_profiles (user_id, updated_at)
    VALUES (?, ?);
    """, (user_id, now_iso))

    conn.commit()
    conn.close()

    token = create_access_token(user_id=user_id, email=email)
    user_base = UserBase(
        id=user_id,
        email=email,
        full_name=full_name,
        phone=req.phone,
        onboarding_completed=False,
        created_at=now_iso
    )

    return AuthResponse(access_token=token, token_type="bearer", user=user_base)

@router.post("/login", response_model=AuthResponse)
def login(req: UserLoginRequest):
    email = req.email.strip().lower()
    
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
    SELECT id, email, hashed_password, full_name, phone, onboarding_completed, created_at
    FROM users WHERE email = ?;
    """, (email,))
    row = cursor.fetchone()
    conn.close()

    if not row or not verify_password(req.password, row["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password. Please verify your credentials."
        )

    token = create_access_token(user_id=row["id"], email=row["email"])
    user_base = UserBase(
        id=row["id"],
        email=row["email"],
        full_name=row["full_name"],
        phone=row["phone"],
        onboarding_completed=bool(row["onboarding_completed"]),
        created_at=row["created_at"]
    )

    return AuthResponse(access_token=token, token_type="bearer", user=user_base)

@router.post("/forgot-password")
def forgot_password(req: ForgotPasswordRequest):
    email = req.email.strip().lower()
    
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT id FROM users WHERE email = ?", (email,))
    row = cursor.fetchone()

    if not row:
        conn.close()
        # For security, avoid revealing if email exists or not, but return clear clinical message
        return {
            "status": "success",
            "message": "If an account matches this email, the password has been securely reset."
        }

    hashed = hash_password(req.new_password)
    now_iso = datetime.now(timezone.utc).isoformat()
    cursor.execute("UPDATE users SET hashed_password = ?, updated_at = ? WHERE id = ?", (hashed, now_iso, row["id"]))
    conn.commit()
    conn.close()

    return {
        "status": "success",
        "message": "Your password has been successfully updated. You may now sign in."
    }

@router.get("/me", response_model=UserBase)
def get_me(current_user: dict = Depends(get_current_user)):
    return UserBase(
        id=current_user["id"],
        email=current_user["email"],
        full_name=current_user["full_name"],
        phone=current_user.get("phone"),
        onboarding_completed=bool(current_user.get("onboarding_completed", 0)),
        created_at=current_user["created_at"]
    )
