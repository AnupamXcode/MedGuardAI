export interface DrugItem {
  id: string;
  name: string;
  type: string;
  groups: string;
  categories: string[];
}

export interface DrugSearchResponse {
  query: string;
  total: number;
  results: DrugItem[];
}

export interface PairInteractionResult {
  drug_a_id: string;
  drug_a_name: string;
  drug_b_id: string;
  drug_b_name: string;
  evidence_status: 'verified_database' | 'model_prediction' | 'insufficient_evidence';
  interaction_type: number | null;
  description: string;
  source: string;
  confidence: number | null;
  severity: string;
  alternatives: string[];
}

export interface ConditionAlertItem {
  condition: string;
  drug_name: string;
  warning: string;
  food_constituent?: string | null;
  source: string;
}

export interface RegimenSummary {
  total_medications: number;
  total_pairs_evaluated: number;
  verified_interactions_count: number;
  predicted_interactions_count: number;
  insufficient_evidence_count: number;
  has_critical_interaction: boolean;
}

export interface InteractionCheckResponse {
  summary: RegimenSummary;
  interactions: PairInteractionResult[];
  condition_alerts: ConditionAlertItem[];
  unresolved_medications?: string[];
  disclaimer: string;
}

export interface HealthResponse {
  status: string;
  version: string;
  database_records: number;
  drugs_catalog_size: number;
  model_loaded: boolean;
}

export interface UserBase {
  id: number;
  email: string;
  full_name: string;
  phone?: string | null;
  onboarding_completed: boolean;
  created_at: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: UserBase;
}

export interface UserMedicationItem {
  id?: number;
  drug_id?: string | null;
  drug_name: string;
  dosage: string;
  frequency: string;
  start_date?: string | null;
  is_active: boolean;
}

export interface EmergencyContactItem {
  id?: number;
  name: string;
  relationship: string;
  phone: string;
  is_primary: boolean;
}

export interface ProfileDetails {
  dob?: string | null;
  age?: number | null;
  gender?: string | null;
  allergies: string[];
  health_notes?: string | null;
  profile_photo?: string | null;
}

export interface UserFullProfileResponse {
  user: UserBase;
  profile: ProfileDetails;
  conditions: string[];
  medications: UserMedicationItem[];
  emergency_contacts: EmergencyContactItem[];
  profile_completion_percentage: number;
}

export interface OnboardingSaveRequest {
  full_name?: string;
  phone?: string;
  dob?: string;
  age?: number;
  gender?: string;
  profile_photo?: string;
  conditions: string[];
  allergies: string[];
  health_notes?: string;
  medications: UserMedicationItem[];
  emergency_contacts: EmergencyContactItem[];
}

export interface HistoryRecord {
  id: number;
  created_at: string;
  medications: string[];
  conditions: string[];
  summary: RegimenSummary;
  results: PairInteractionResult[];
}

const rawBase = (import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000').trim();
const API_BASE = rawBase.replace(/\/+$/, '');
const TOKEN_KEY = 'mediguard_auth_token';

export function getStoredToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setStoredToken(token: string): void {
  try {
    localStorage.setItem(TOKEN_KEY, token);
  } catch (e) {
    console.error('Failed to save auth token:', e);
  }
}

export function removeStoredToken(): void {
  try {
    localStorage.removeItem(TOKEN_KEY);
  } catch (e) {
    console.error('Failed to clear auth token:', e);
  }
}

export async function fetchHealth(): Promise<HealthResponse> {
  const res = await fetch(`${API_BASE}/api/health`);
  if (!res.ok) throw new Error(`Health check failed: ${res.statusText}`);
  return res.json();
}

export async function searchDrugs(query: string): Promise<DrugItem[]> {
  const params = new URLSearchParams({ q: query, limit: '12' });
  const res = await fetch(`${API_BASE}/api/drugs/search?${params.toString()}`);
  if (!res.ok) throw new Error(`Drug search failed: ${res.statusText}`);
  const data: DrugSearchResponse = await res.json();
  return data.results;
}

export async function checkInteractions(medications: string[], conditions: string[] = []): Promise<InteractionCheckResponse> {
  const res = await fetch(`${API_BASE}/api/interactions/check`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ medications, conditions }),
  });
  if (!res.ok) {
    const errorBody = await res.text();
    throw new Error(`Interaction check failed (${res.status}): ${errorBody}`);
  }
  return res.json();
}

// ================= AUTHENTICATION API =================

export async function registerUser(payload: {
  email: string;
  password: string;
  full_name: string;
  phone?: string;
}): Promise<AuthResponse> {
  const res = await fetch(`${API_BASE}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(err.detail || 'Registration failed');
  }
  const data: AuthResponse = await res.json();
  setStoredToken(data.access_token);
  return data;
}

export async function loginUser(payload: { email: string; password: string }): Promise<AuthResponse> {
  const res = await fetch(`${API_BASE}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(err.detail || 'Login failed');
  }
  const data: AuthResponse = await res.json();
  setStoredToken(data.access_token);
  return data;
}

export async function forgotPassword(payload: { email: string; new_password: string }): Promise<{ message: string }> {
  const res = await fetch(`${API_BASE}/api/auth/forgot-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(err.detail || 'Password reset failed');
  }
  return res.json();
}

export async function getCurrentUser(): Promise<UserBase> {
  const token = getStoredToken();
  if (!token) throw new Error('Not authenticated');
  const res = await fetch(`${API_BASE}/api/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    if (res.status === 401) removeStoredToken();
    throw new Error('Authentication expired');
  }
  return res.json();
}

// ================= PROFILE & ONBOARDING API =================

export async function getFullProfile(): Promise<UserFullProfileResponse> {
  const token = getStoredToken();
  if (!token) throw new Error('Not authenticated');
  const res = await fetch(`${API_BASE}/api/profile`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    if (res.status === 401) removeStoredToken();
    throw new Error('Failed to fetch profile');
  }
  return res.json();
}

export async function saveOnboardingProfile(payload: OnboardingSaveRequest): Promise<UserFullProfileResponse> {
  const token = getStoredToken();
  if (!token) throw new Error('Not authenticated');
  const res = await fetch(`${API_BASE}/api/profile/onboarding`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(err.detail || 'Failed to save onboarding data');
  }
  return res.json();
}

export async function addUserMedication(item: UserMedicationItem): Promise<UserMedicationItem> {
  const token = getStoredToken();
  if (!token) throw new Error('Not authenticated');
  const res = await fetch(`${API_BASE}/api/profile/medications`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(item),
  });
  if (!res.ok) throw new Error('Failed to add medication');
  return res.json();
}

export async function deleteUserMedication(medicationId: number): Promise<{ message: string }> {
  const token = getStoredToken();
  if (!token) throw new Error('Not authenticated');
  const res = await fetch(`${API_BASE}/api/profile/medications/${medicationId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to remove medication');
  return res.json();
}

export async function updateUserConditions(conditions: string[]): Promise<{ conditions: string[] }> {
  const token = getStoredToken();
  if (!token) throw new Error('Not authenticated');
  const res = await fetch(`${API_BASE}/api/profile/conditions`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ conditions }),
  });
  if (!res.ok) throw new Error('Failed to update conditions');
  return res.json();
}

export async function addEmergencyContact(contact: EmergencyContactItem): Promise<EmergencyContactItem> {
  const token = getStoredToken();
  if (!token) throw new Error('Not authenticated');
  const res = await fetch(`${API_BASE}/api/profile/emergency-contacts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(contact),
  });
  if (!res.ok) throw new Error('Failed to add emergency contact');
  return res.json();
}

export async function deleteEmergencyContact(contactId: number): Promise<{ message: string }> {
  const token = getStoredToken();
  if (!token) throw new Error('Not authenticated');
  const res = await fetch(`${API_BASE}/api/profile/emergency-contacts/${contactId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to delete emergency contact');
  return res.json();
}

export async function updateAccountSettings(payload: {
  full_name?: string;
  phone?: string;
  current_password?: string;
  new_password?: string;
}): Promise<{ message: string; user: UserBase }> {
  const token = getStoredToken();
  if (!token) throw new Error('Not authenticated');
  const res = await fetch(`${API_BASE}/api/profile/account`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(err.detail || 'Failed to update account');
  }
  return res.json();
}

export async function deleteUserAccount(): Promise<{ message: string }> {
  const token = getStoredToken();
  if (!token) throw new Error('Not authenticated');
  const res = await fetch(`${API_BASE}/api/profile/account`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to delete account');
  removeStoredToken();
  return res.json();
}

export async function saveUserHistory(payload: {
  medications: string[];
  conditions: string[];
  summary: RegimenSummary;
  results: PairInteractionResult[];
}): Promise<{ message: string }> {
  const token = getStoredToken();
  if (!token) return { message: 'Anonymous session, not saved' };
  const res = await fetch(`${API_BASE}/api/profile/history`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) return { message: 'Could not record history' };
  return res.json();
}

export async function getUserHistory(): Promise<HistoryRecord[]> {
  const token = getStoredToken();
  if (!token) return [];
  const res = await fetch(`${API_BASE}/api/profile/history`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) return [];
  return res.json();
}

