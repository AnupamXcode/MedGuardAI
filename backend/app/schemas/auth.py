from typing import List, Optional
from pydantic import BaseModel, Field

EMAIL_PATTERN = r"^[^@\s]+@[^@\s]+\.[^@\s]+$"

class UserRegisterRequest(BaseModel):
    email: str = Field(..., pattern=EMAIL_PATTERN, description="Valid email address")
    password: str = Field(..., min_length=6, description="Minimum 6 characters")
    full_name: str = Field(..., min_length=2)
    phone: Optional[str] = None

class UserLoginRequest(BaseModel):
    email: str = Field(..., pattern=EMAIL_PATTERN)
    password: str

class ForgotPasswordRequest(BaseModel):
    email: str = Field(..., pattern=EMAIL_PATTERN)
    new_password: str = Field(..., min_length=6)

class UserBase(BaseModel):
    id: int
    email: str
    full_name: str
    phone: Optional[str] = None
    onboarding_completed: bool = False
    created_at: str

class AuthResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserBase

class UserMedicationItem(BaseModel):
    id: Optional[int] = None
    drug_id: Optional[str] = None
    drug_name: str = Field(..., min_length=1)
    dosage: str = Field(..., min_length=1)
    frequency: str = Field(..., min_length=1)
    start_date: Optional[str] = None
    is_active: bool = True

class EmergencyContactItem(BaseModel):
    id: Optional[int] = None
    name: str = Field(..., min_length=1)
    relationship: str = Field(..., min_length=1)
    phone: str = Field(..., min_length=1)
    is_primary: bool = True

class ProfileDetails(BaseModel):
    dob: Optional[str] = None
    age: Optional[int] = None
    gender: Optional[str] = None
    allergies: List[str] = Field(default_factory=list)
    health_notes: Optional[str] = None
    profile_photo: Optional[str] = None

class UserFullProfileResponse(BaseModel):
    user: UserBase
    profile: ProfileDetails
    conditions: List[str] = Field(default_factory=list)
    medications: List[UserMedicationItem] = Field(default_factory=list)
    emergency_contacts: List[EmergencyContactItem] = Field(default_factory=list)
    profile_completion_percentage: int

class OnboardingSaveRequest(BaseModel):
    # Step 1: Basic Information
    full_name: Optional[str] = None
    phone: Optional[str] = None
    dob: Optional[str] = None
    age: Optional[int] = None
    gender: Optional[str] = None
    profile_photo: Optional[str] = None
    # Step 2: Health Information
    conditions: List[str] = Field(default_factory=list)
    allergies: List[str] = Field(default_factory=list)
    health_notes: Optional[str] = None
    # Step 3: Medications
    medications: List[UserMedicationItem] = Field(default_factory=list)
    # Step 4: Emergency Contacts
    emergency_contacts: List[EmergencyContactItem] = Field(default_factory=list)

class UpdateAccountSettingsRequest(BaseModel):
    full_name: Optional[str] = None
    phone: Optional[str] = None
    current_password: Optional[str] = None
    new_password: Optional[str] = None

class SaveHistoryRequest(BaseModel):
    medications: List[str]
    conditions: List[str] = Field(default_factory=list)
    summary: dict
    results: List[dict]
