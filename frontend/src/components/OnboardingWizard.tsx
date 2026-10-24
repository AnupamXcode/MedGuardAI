import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  searchDrugs,
  saveOnboardingProfile,
  type UserMedicationItem,
  type EmergencyContactItem,
  type DrugItem,
} from '../services/api';
import {
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  User,
  Activity,
  Pill,
  HeartPulse,
  PhoneCall,
  Plus,
  Trash2,
  Search,
  AlertTriangle,
  X,
  Sparkles,
  FastForward,
} from 'lucide-react';

const COMMON_CONDITIONS = [
  'Hypertension (High Blood Pressure)',
  'Type 2 Diabetes',
  'Type 1 Diabetes',
  'Coronary Artery Disease',
  'Chronic Kidney Disease (CKD)',
  'Hepatic Impairment / Liver Disease',
  'Bronchial Asthma',
  'Dengue Fever / Thrombocytopenia',
  'Atrial Fibrillation',
  'Peptic Ulcer Disease',
  'Gout / Hyperuricemia',
  'Epilepsy / Seizure Disorder',
  'Hypothyroidism',
  'Depression / Anxiety',
];

const COMMON_ALLERGIES = [
  'Penicillin & Beta-lactams',
  'Sulfa Drugs (Sulfonamides)',
  'NSAIDs (Aspirin / Ibuprofen)',
  'Cephalosporins',
  'Tetracyclines',
  'Codeine / Opioids',
  'Contrast Media (Iodine)',
  'Latex',
];

export const OnboardingWizard: React.FC = () => {
  const { user, profile, isOnboardingOpen, closeOnboarding, refreshProfile } = useAuth();

  const [step, setStep] = useState<number>(1);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Step 1: Basic Information
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [dob, setDob] = useState('');
  const [age, setAge] = useState<number | ''>('');
  const [gender, setGender] = useState('');
  const [profilePhoto, setProfilePhoto] = useState('');

  // Step 2: Health Information
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
  const [conditionSearch, setConditionSearch] = useState('');
  const [selectedAllergies, setSelectedAllergies] = useState<string[]>([]);
  const [allergyInput, setAllergyInput] = useState('');
  const [healthNotes, setHealthNotes] = useState('');

  // Step 3: Current Medications
  const [medications, setMedications] = useState<UserMedicationItem[]>([]);
  const [medQuery, setMedQuery] = useState('');
  const [medSearchResults, setMedSearchResults] = useState<DrugItem[]>([]);
  const [isSearchingMeds, setIsSearchingMeds] = useState(false);
  const [newMedName, setNewMedName] = useState('');
  const [newMedId, setNewMedId] = useState('');
  const [newDosage, setNewDosage] = useState('');
  const [newFrequency, setNewFrequency] = useState('Once daily');
  const [newStartDate, setNewStartDate] = useState('');

  // Step 4: Emergency Contacts
  const [contacts, setContacts] = useState<EmergencyContactItem[]>([
    { name: '', relationship: 'Spouse', phone: '', is_primary: true },
  ]);

  // Pre-fill from existing user and profile when opening
  useEffect(() => {
    if (user) {
      setFullName(user.full_name || '');
      setEmail(user.email || '');
      setPhone(user.phone || '');
    }
    if (profile) {
      if (profile.profile?.dob) {
        setDob(profile.profile.dob);
        setAge(profile.profile.age || '');
      }
      if (profile.profile?.gender) setGender(profile.profile.gender);
      if (profile.profile?.profile_photo) setProfilePhoto(profile.profile.profile_photo);
      if (profile.profile?.allergies) setSelectedAllergies(profile.profile.allergies);
      if (profile.profile?.health_notes) setHealthNotes(profile.profile.health_notes);
      if (profile.conditions) setSelectedConditions(profile.conditions);
      if (profile.medications && profile.medications.length > 0) setMedications(profile.medications);
      if (profile.emergency_contacts && profile.emergency_contacts.length > 0) {
        setContacts(profile.emergency_contacts);
      }
    }
  }, [user, profile]);

  // Auto calculate age from DOB
  const handleDobChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setDob(val);
    if (val) {
      const birth = new Date(val);
      const today = new Date();
      let calculatedAge = today.getFullYear() - birth.getFullYear();
      const m = today.getMonth() - birth.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
        calculatedAge--;
      }
      if (calculatedAge >= 0 && calculatedAge < 130) {
        setAge(calculatedAge);
      }
    } else {
      setAge('');
    }
  };

  // Search medications from backend
  useEffect(() => {
    if (!medQuery.trim() || medQuery.length < 2) {
      setMedSearchResults([]);
      return;
    }
    const timer = setTimeout(async () => {
      setIsSearchingMeds(true);
      try {
        const results = await searchDrugs(medQuery.trim());
        setMedSearchResults(results.slice(0, 6));
      } catch (err) {
        console.error('Drug search error:', err);
      } finally {
        setIsSearchingMeds(false);
      }
    }, 250);
    return () => clearTimeout(timer);
  }, [medQuery]);

  const selectDrugResult = (drug: DrugItem) => {
    setNewMedName(drug.name);
    setNewMedId(drug.id);
    setMedQuery('');
    setMedSearchResults([]);
  };

  const handleAddMedication = () => {
    if (!newMedName.trim()) return;
    const item: UserMedicationItem = {
      drug_id: newMedId || undefined,
      drug_name: newMedName.trim(),
      dosage: newDosage.trim() || 'Standard clinical dose',
      frequency: newFrequency,
      start_date: newStartDate || undefined,
      is_active: true,
    };
    setMedications([...medications, item]);
    setNewMedName('');
    setNewMedId('');
    setNewDosage('');
    setNewStartDate('');
  };

  const handleRemoveMedication = (index: number) => {
    setMedications(medications.filter((_, i) => i !== index));
  };

  const toggleCondition = (cond: string) => {
    if (selectedConditions.includes(cond)) {
      setSelectedConditions(selectedConditions.filter((c) => c !== cond));
    } else {
      setSelectedConditions([...selectedConditions, cond]);
    }
  };

  const addCustomCondition = () => {
    const trimmed = conditionSearch.trim();
    if (trimmed && !selectedConditions.includes(trimmed)) {
      setSelectedConditions([...selectedConditions, trimmed]);
      setConditionSearch('');
    }
  };

  const toggleAllergy = (allergy: string) => {
    if (selectedAllergies.includes(allergy)) {
      setSelectedAllergies(selectedAllergies.filter((a) => a !== allergy));
    } else {
      setSelectedAllergies([...selectedAllergies, allergy]);
    }
  };

  const addCustomAllergy = () => {
    const trimmed = allergyInput.trim();
    if (trimmed && !selectedAllergies.includes(trimmed)) {
      setSelectedAllergies([...selectedAllergies, trimmed]);
      setAllergyInput('');
    }
  };

  const handleAddContact = () => {
    if (contacts.length >= 2) return;
    setContacts([
      ...contacts,
      { name: '', relationship: 'Family Member', phone: '', is_primary: false },
    ]);
  };

  const handleRemoveContact = (index: number) => {
    setContacts(contacts.filter((_, i) => i !== index));
  };

  const updateContact = (index: number, field: keyof EmergencyContactItem, val: any) => {
    const updated = [...contacts];
    updated[index] = { ...updated[index], [field]: val };
    setContacts(updated);
  };

  // Skip Remaining Setup (Single-action skip after Step 2)
  const handleSkipRemainingSetup = async () => {
    setSaving(true);
    setError(null);
    try {
      const validContacts = contacts.filter((c) => c.name.trim() && c.phone.trim());

      await saveOnboardingProfile({
        full_name: fullName.trim() || undefined,
        phone: phone.trim() || undefined,
        dob: dob || undefined,
        age: typeof age === 'number' ? age : undefined,
        gender: gender || undefined,
        profile_photo: profilePhoto || undefined,
        conditions: selectedConditions,
        allergies: selectedAllergies,
        health_notes: healthNotes.trim() || undefined,
        medications: medications,
        emergency_contacts: validContacts,
      });

      await refreshProfile();
      setSuccess(true);
      setTimeout(() => {
        closeOnboarding();
        setSuccess(false);
        setStep(1);
      }, 700);
    } catch (err: any) {
      setError(err.message || 'Failed to save health profile.');
    } finally {
      setSaving(false);
    }
  };

  // Full Save and Complete (Step 5)
  const handleSaveAndComplete = async () => {
    setSaving(true);
    setError(null);
    try {
      const validContacts = contacts.filter((c) => c.name.trim() && c.phone.trim());

      await saveOnboardingProfile({
        full_name: fullName.trim() || undefined,
        phone: phone.trim() || undefined,
        dob: dob || undefined,
        age: typeof age === 'number' ? age : undefined,
        gender: gender || undefined,
        profile_photo: profilePhoto || undefined,
        conditions: selectedConditions,
        allergies: selectedAllergies,
        health_notes: healthNotes.trim() || undefined,
        medications,
        emergency_contacts: validContacts,
      });

      await refreshProfile();
      setSuccess(true);
      setTimeout(() => {
        closeOnboarding();
        setSuccess(false);
        setStep(1);
      }, 800);
    } catch (err: any) {
      setError(err.message || 'Failed to save health profile. Please review fields.');
    } finally {
      setSaving(false);
    }
  };

  if (!isOnboardingOpen) return null;

  const filteredConditions = COMMON_CONDITIONS.filter((c) =>
    c.toLowerCase().includes(conditionSearch.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Wizard Top Header */}
        <div className="bg-gradient-to-r from-teal-700 via-teal-600 to-slate-900 px-6 py-5 text-white relative shrink-0">
          <button
            onClick={closeOnboarding}
            className="absolute top-4 right-4 p-1.5 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-teal-100 mb-1">
            <Sparkles className="w-4 h-4 text-teal-300" />
            <span>Personal Health Profile Setup</span>
          </div>
          <h2 className="text-xl font-bold font-title-lg">
            {step === 1 && 'Step 1: Basic Information'}
            {step === 2 && 'Step 2: Health Conditions & Allergies'}
            {step === 3 && 'Step 3: Current Medicines'}
            {step === 4 && 'Step 4: Emergency Contacts'}
            {step === 5 && 'Step 5: Review & Confirm Profile'}
          </h2>
          <p className="text-xs text-slate-200 mt-0.5">
            {step === 1 && 'Enter your basic details so we can check your medicines accurately.'}
            {step === 2 && 'Select any health conditions and allergies to screen for safety warnings.'}
            {step === 3 && 'Add medicines you take every day to check if they clash.'}
            {step === 4 && 'Add emergency contacts for quick reference.'}
            {step === 5 && 'Check your details before saving your profile.'}
          </p>

          {/* Stepper Progress Bar */}
          <div className="mt-4 flex items-center justify-between relative">
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-white/20 -translate-y-1/2 z-0" />
            <div
              className="absolute top-1/2 left-0 h-1 bg-teal-300 transition-all duration-300 -translate-y-1/2 z-0"
              style={{ width: `${((step - 1) / 4) * 100}%` }}
            />
            {[1, 2, 3, 4, 5].map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setStep(s)}
                className={`relative z-10 w-7 h-7 rounded-full text-xs font-bold flex items-center justify-center transition-all ${
                  s === step
                    ? 'bg-white text-teal-800 ring-4 ring-teal-300/40 scale-110 shadow-md'
                    : s < step
                    ? 'bg-teal-400 text-slate-900 font-bold'
                    : 'bg-teal-900/80 text-white/70 border border-white/20'
                }`}
              >
                {s < step ? '✓' : s}
              </button>
            ))}
          </div>
        </div>

        {/* Wizard Scrollable Body */}
        <div className="p-6 overflow-y-auto flex-1 bg-white">
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-800 text-xs flex items-start space-x-2 border border-red-200">
              <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0 text-red-600" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="mb-4 p-4 rounded-xl bg-teal-50 text-teal-800 text-sm flex items-center space-x-3 border border-teal-200 animate-fadeIn">
              <CheckCircle2 className="w-6 h-6 text-teal-600 shrink-0" />
              <div>
                <div className="font-bold">Health Profile Successfully Saved!</div>
                <div className="text-xs text-teal-700">Taking you to your personal health dashboard...</div>
              </div>
            </div>
          )}

          {/* STEP 1: Basic Information */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="p-3 bg-teal-50/70 rounded-xl border border-teal-100 text-xs text-teal-900 flex items-start space-x-2">
                <User className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Quick Setup:</strong> Steps 1 &amp; 2 cover the basics. Steps 3 &amp; 4 are optional and can be added anytime later.
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-900 mb-1">
                    Full Legal Name <span className="text-teal-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Sarah Johnson"
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-900 mb-1">
                    Email Address <span className="text-slate-500 font-normal">(Account identity)</span>
                  </label>
                  <input
                    type="email"
                    disabled
                    value={email}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 bg-slate-100 text-slate-500 cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-900 mb-1">
                    Phone Number with Country Code <span className="text-slate-500 font-normal">(Optional)</span>
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 (555) 019-2834"
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-900 mb-1">
                    Gender Identity <span className="text-slate-500 font-normal">(Optional)</span>
                  </label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 text-slate-900"
                  >
                    <option value="">Select gender (optional)</option>
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                    <option value="Non-binary">Non-binary</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-900 mb-1">
                    Date of Birth <span className="text-slate-500 font-normal">(Auto-calculates age)</span>
                  </label>
                  <input
                    type="date"
                    value={dob}
                    onChange={handleDobChange}
                    max={new Date().toISOString().split('T')[0]}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-900 mb-1">
                    Calculated Age <span className="text-slate-500 font-normal">(Years)</span>
                  </label>
                  <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(e.target.value ? parseInt(e.target.value) : '')}
                    placeholder="e.g. 42"
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-900 mb-1">
                  Profile Photo URL <span className="text-slate-500 font-normal">(Optional avatar)</span>
                </label>
                <input
                  type="url"
                  value={profilePhoto}
                  onChange={(e) => setProfilePhoto(e.target.value)}
                  placeholder="https://example.com/photo.jpg"
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 text-slate-900"
                />
              </div>
            </div>
          )}

          {/* STEP 2: Health Information */}
          {step === 2 && (
            <div className="space-y-5">
              {/* Highlight banner letting user know they can skip remaining steps right after Step 2 */}
              <div className="p-3.5 bg-teal-50 rounded-xl border border-teal-200 text-xs text-teal-900 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                  <span>
                    <strong>Basic Details Complete!</strong> You can click <em>"Skip Remaining Setup"</em> below to start using your dashboard immediately.
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-900 mb-1">
                  Health Conditions or Illnesses
                </label>
                <p className="text-[11px] text-slate-500 mb-2">
                  Pick any conditions you have so we can warn you if a medicine isn't safe for you (for example, high blood pressure, diabetes, or asthma).
                </p>

                {/* Search & Custom condition */}
                <div className="flex space-x-2 mb-3">
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      value={conditionSearch}
                      onChange={(e) => setConditionSearch(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomCondition())}
                      placeholder="Search conditions or type your own (e.g. Asthma, High BP)..."
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500"
                    />
                  </div>
                  {conditionSearch.trim() && (
                    <button
                      type="button"
                      onClick={addCustomCondition}
                      className="px-3 py-2 bg-teal-600 text-white text-xs font-semibold rounded-lg hover:bg-teal-700 transition flex items-center space-x-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add</span>
                    </button>
                  )}
                </div>

                {/* Condition Chips */}
                <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto p-2 border border-slate-200 rounded-xl bg-slate-50">
                  {filteredConditions.map((cond) => {
                    const isSelected = selectedConditions.includes(cond);
                    return (
                      <button
                        key={cond}
                        type="button"
                        onClick={() => toggleCondition(cond)}
                        className={`text-xs px-2.5 py-1.5 rounded-lg border transition flex items-center space-x-1.5 ${
                          isSelected
                            ? 'bg-teal-600 text-white border-teal-600 shadow-sm font-medium'
                            : 'bg-white text-slate-700 border-slate-200 hover:border-teal-400'
                        }`}
                      >
                        <span>{cond}</span>
                        {isSelected && <span className="text-[10px]">✕</span>}
                      </button>
                    );
                  })}
                </div>

                {selectedConditions.filter((c) => !COMMON_CONDITIONS.includes(c)).length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {selectedConditions
                      .filter((c) => !COMMON_CONDITIONS.includes(c))
                      .map((c) => (
                        <span
                          key={c}
                          className="text-xs px-2.5 py-1 rounded-lg bg-slate-800 text-white font-medium flex items-center space-x-1"
                        >
                          <span>{c}</span>
                          <button type="button" onClick={() => toggleCondition(c)}>
                            ✕
                          </button>
                        </span>
                      ))}
                  </div>
                )}
              </div>

              {/* Allergies and Sensitivities */}
              <div className="pt-2 border-t border-slate-200">
                <label className="block text-xs font-bold text-slate-900 mb-1">
                  Known Allergies &amp; Sensitivities
                </label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {COMMON_ALLERGIES.map((allergy) => {
                    const isSel = selectedAllergies.includes(allergy);
                    return (
                      <button
                        key={allergy}
                        type="button"
                        onClick={() => toggleAllergy(allergy)}
                        className={`text-xs px-2.5 py-1 rounded-full border transition ${
                          isSel
                            ? 'bg-teal-700 text-white border-teal-700 font-medium'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-teal-400'
                        }`}
                      >
                        {allergy} {isSel ? '✓' : '+'}
                      </button>
                    );
                  })}
                </div>

                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={allergyInput}
                    onChange={(e) => setAllergyInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomAllergy())}
                    placeholder="Other allergy (e.g. Penicillin, Peanuts)..."
                    className="flex-1 px-3 py-2 text-xs rounded-lg border border-slate-300 bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500/30"
                  />
                  {allergyInput.trim() && (
                    <button
                      type="button"
                      onClick={addCustomAllergy}
                      className="px-3 py-2 bg-slate-800 text-white text-xs font-semibold rounded-lg hover:bg-slate-900 transition"
                    >
                      Add Allergy
                    </button>
                  )}
                </div>
              </div>

              {/* Additional Health Notes */}
              <div className="pt-2 border-t border-slate-200">
                <label className="block text-xs font-bold text-slate-900 mb-1">
                  Additional Health Notes <span className="text-slate-500 font-normal">(Optional)</span>
                </label>
                <textarea
                  rows={2}
                  value={healthNotes}
                  onChange={(e) => setHealthNotes(e.target.value)}
                  placeholder="e.g. Sensitive stomach, prone to dizziness, or any note from your doctor..."
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500/30"
                />
              </div>
            </div>
          )}

          {/* STEP 3: Current Medications */}
          {step === 3 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-900 mb-1">
                  Add Your Daily Medicines
                </label>
                <p className="text-[11px] text-slate-500 mb-3">
                  Search from over 1,700 verified medicines to check if they are safe to take together.
                </p>

                {/* Medication Search Input */}
                <div className="relative mb-2">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={medQuery}
                    onChange={(e) => setMedQuery(e.target.value)}
                    placeholder="Type medicine name (e.g. Aspirin, Metformin, Lisinopril)..."
                    className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 text-slate-900"
                  />
                  {isSearchingMeds && (
                    <span className="absolute right-3 top-2.5 text-xs text-slate-400 animate-pulse">
                      Searching...
                    </span>
                  )}

                  {/* Dropdown Results */}
                  {medSearchResults.length > 0 && (
                    <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-slate-200 rounded-xl shadow-xl z-20 overflow-hidden divide-y divide-slate-100">
                      {medSearchResults.map((drug) => (
                        <button
                          key={drug.id}
                          type="button"
                          onClick={() => selectDrugResult(drug)}
                          className="w-full px-4 py-2.5 text-left hover:bg-teal-50 flex items-center justify-between transition text-xs"
                        >
                          <div>
                            <span className="font-bold text-slate-900">{drug.name}</span>
                            <span className="ml-2 text-[10px] text-slate-500">({drug.id})</span>
                          </div>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-medium">
                            {drug.type}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Medication Details Entry Card */}
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-900 mb-0.5">Medicine Name</label>
                      <input
                        type="text"
                        value={newMedName}
                        onChange={(e) => setNewMedName(e.target.value)}
                        placeholder="e.g. Warfarin"
                        className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 bg-white text-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-900 mb-0.5">Dose</label>
                      <input
                        type="text"
                        value={newDosage}
                        onChange={(e) => setNewDosage(e.target.value)}
                        placeholder="e.g. 5 mg"
                        className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 bg-white text-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-900 mb-0.5">How Often</label>
                      <select
                        value={newFrequency}
                        onChange={(e) => setNewFrequency(e.target.value)}
                        className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 bg-white text-slate-900"
                      >
                        <option value="Once daily">Once a day</option>
                        <option value="Twice daily (BID)">Twice a day</option>
                        <option value="Three times daily (TID)">Three times a day</option>
                        <option value="Every 8 hours">Every 8 hours</option>
                        <option value="As needed (PRN)">As needed</option>
                        <option value="Weekly">Once a week</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center space-x-2">
                      <label className="text-[11px] text-slate-500">Start Date (Optional):</label>
                      <input
                        type="date"
                        value={newStartDate}
                        onChange={(e) => setNewStartDate(e.target.value)}
                        className="px-2 py-1 text-xs rounded-lg border border-slate-300 bg-white text-slate-900"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleAddMedication}
                      disabled={!newMedName.trim()}
                      className="px-4 py-1.5 rounded-lg bg-teal-600 text-white text-xs font-semibold hover:bg-teal-700 transition disabled:opacity-40 flex items-center space-x-1.5 shadow-sm"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Medicine</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Current Active List */}
              <div>
                <label className="block text-xs font-bold text-slate-900 mb-2">
                  My Medicine List ({medications.length} {medications.length === 1 ? 'medicine' : 'medicines'})
                </label>
                {medications.length === 0 ? (
                  <div className="p-6 rounded-xl border border-dashed border-slate-200 bg-slate-50 text-center text-xs text-slate-500">
                    No medicines added yet. Add any pills or medicines above, or jump straight to your dashboard.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {medications.map((m, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-lg bg-teal-100 flex items-center justify-center text-teal-700">
                            <Pill className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="font-bold text-xs text-slate-900 flex items-center space-x-2">
                              <span>{m.drug_name}</span>
                              {m.drug_id && (
                                <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-200 text-slate-600 font-normal">
                                  {m.drug_id}
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-slate-500">
                              {m.dosage} • {m.frequency}
                              {m.start_date && ` • Started ${m.start_date}`}
                            </div>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveMedication(idx)}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                          title="Remove medicine"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STEP 4: Emergency Contacts */}
          {step === 4 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-900 mb-1">
                  Emergency Contacts (Optional)
                </label>
                <p className="text-[11px] text-slate-500 mb-3">
                  Add contacts so family members or your doctor can be easily reached if needed.
                </p>

                <div className="space-y-3">
                  {contacts.map((contact, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl border border-slate-200 bg-slate-50 relative space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <PhoneCall className="w-4 h-4 text-teal-600" />
                          <span className="text-xs font-bold text-slate-900">
                            {idx === 0 ? 'Primary Emergency Contact' : 'Secondary Emergency Contact'}
                          </span>
                        </div>
                        {contacts.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveContact(idx)}
                            className="text-xs text-red-600 hover:underline flex items-center space-x-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Remove</span>
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-900 mb-1">Contact Name *</label>
                          <input
                            type="text"
                            value={contact.name}
                            onChange={(e) => updateContact(idx, 'name', e.target.value)}
                            placeholder="e.g. John Jenkins"
                            className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 bg-white text-slate-900"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-900 mb-1">Relationship *</label>
                          <select
                            value={contact.relationship}
                            onChange={(e) => updateContact(idx, 'relationship', e.target.value)}
                            className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 bg-white text-slate-900"
                          >
                            <option value="Spouse">Spouse / Partner</option>
                            <option value="Parent">Parent</option>
                            <option value="Child">Son / Daughter</option>
                            <option value="Sibling">Brother / Sister</option>
                            <option value="Caregiver">Caregiver</option>
                            <option value="Physician">Doctor / Clinic</option>
                            <option value="Friend">Friend</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-900 mb-1">Phone Number *</label>
                          <input
                            type="tel"
                            value={contact.phone}
                            onChange={(e) => updateContact(idx, 'phone', e.target.value)}
                            placeholder="+1 (555) 456-7890"
                            className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 bg-white text-slate-900"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {contacts.length < 2 && (
                  <button
                    type="button"
                    onClick={handleAddContact}
                    className="mt-3 px-3 py-1.5 border border-dashed border-teal-600 text-teal-700 hover:bg-teal-50 rounded-lg text-xs font-semibold transition flex items-center space-x-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Another Emergency Contact</span>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* STEP 5: Review and Save */}
          {step === 5 && (
            <div className="space-y-4">
              <div className="p-4 bg-teal-50 rounded-xl border border-teal-200 text-xs text-teal-900">
                <strong>Profile Summary:</strong> Please check your details below before saving. You can change any of this anytime from your health profile.
              </div>

              {/* Review Section 1: Basic Info */}
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2 text-xs font-bold text-slate-900">
                    <User className="w-4 h-4 text-teal-600" />
                    <span>Basic Details</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="text-xs text-teal-600 font-semibold hover:underline"
                  >
                    Edit
                  </button>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  <div>
                    <span className="text-slate-500 block text-[10px]">Name</span>
                    <span className="font-semibold text-slate-900">{fullName || 'Not specified'}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Email</span>
                    <span className="font-semibold text-slate-900">{email}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Phone</span>
                    <span className="font-semibold text-slate-900">{phone || '—'}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Age / DOB</span>
                    <span className="font-semibold text-slate-900">
                      {age ? `${age} yrs` : '—'} {dob ? `(${dob})` : ''}
                    </span>
                  </div>
                </div>
              </div>

              {/* Review Section 2: Conditions & Allergies */}
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2 text-xs font-bold text-slate-900">
                    <Activity className="w-4 h-4 text-teal-600" />
                    <span>Health Conditions &amp; Allergies</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="text-xs text-teal-600 font-semibold hover:underline"
                  >
                    Edit
                  </button>
                </div>
                <div className="space-y-1.5 text-xs">
                  <div>
                    <span className="text-slate-500 text-[10px] block">Selected Conditions:</span>
                    {selectedConditions.length === 0 ? (
                      <span className="text-slate-400 italic">None added</span>
                    ) : (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {selectedConditions.map((c) => (
                          <span
                            key={c}
                            className="px-2 py-0.5 rounded bg-teal-50 border border-teal-200 text-teal-800 text-[11px] font-medium"
                          >
                            {c}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="pt-1">
                    <span className="text-slate-500 text-[10px] block">Allergies:</span>
                    {selectedAllergies.length === 0 ? (
                      <span className="text-slate-400 italic">No allergies recorded</span>
                    ) : (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {selectedAllergies.map((a) => (
                          <span
                            key={a}
                            className="px-2 py-0.5 rounded bg-slate-200 text-slate-800 text-[11px] font-medium"
                          >
                            {a}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Review Section 3: Medications */}
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2 text-xs font-bold text-slate-900">
                    <Pill className="w-4 h-4 text-teal-600" />
                    <span>Saved Medicines ({medications.length})</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    className="text-xs text-teal-600 font-semibold hover:underline"
                  >
                    Edit
                  </button>
                </div>
                {medications.length === 0 ? (
                  <span className="text-xs text-slate-400 italic">No medicines added yet.</span>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {medications.map((m, idx) => (
                      <div
                        key={idx}
                        className="p-2 rounded-lg bg-white border border-slate-200 text-xs"
                      >
                        <div className="font-bold text-slate-900">{m.drug_name}</div>
                        <div className="text-[11px] text-slate-500">
                          {m.dosage} • {m.frequency}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Review Section 4: Emergency Contacts */}
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2 text-xs font-bold text-slate-900">
                    <HeartPulse className="w-4 h-4 text-teal-600" />
                    <span>Emergency Contacts</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setStep(4)}
                    className="text-xs text-teal-600 font-semibold hover:underline"
                  >
                    Edit
                  </button>
                </div>
                <div className="text-xs space-y-1">
                  {contacts.filter((c) => c.name.trim()).map((c, idx) => (
                    <div key={idx} className="flex justify-between text-slate-900">
                      <span className="font-semibold">
                        {c.name} ({c.relationship}) {c.is_primary ? '• Primary' : ''}
                      </span>
                      <span className="text-slate-500">{c.phone}</span>
                    </div>
                  ))}
                  {contacts.filter((c) => c.name.trim()).length === 0 && (
                    <span className="text-slate-400 italic">No contact specified.</span>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Wizard Footer Controls */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center space-x-2">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-100 transition flex items-center space-x-1"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={closeOnboarding}
                className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 transition"
              >
                Close
              </button>
            )}
          </div>

          <div className="flex items-center space-x-3">
            {/* The single-action 'Skip Remaining Setup' button (Available on step 2 and above) */}
            {step >= 2 && step < 5 && (
              <button
                type="button"
                onClick={handleSkipRemainingSetup}
                disabled={saving || success}
                className="px-4 py-2 rounded-xl border border-teal-600 text-teal-700 bg-teal-50 hover:bg-teal-100 text-xs font-semibold transition flex items-center space-x-1.5 shadow-xs disabled:opacity-50"
                title="Save entered info and jump directly to your dashboard"
              >
                <FastForward className="w-3.5 h-3.5 text-teal-600" />
                <span>Skip Remaining Setup</span>
              </button>
            )}

            {step < 5 ? (
              <button
                type="button"
                onClick={() => setStep(step + 1)}
                className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold transition flex items-center space-x-1.5 shadow-sm"
              >
                <span>Continue</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSaveAndComplete}
                disabled={saving || success}
                className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition flex items-center space-x-2 shadow-md shadow-teal-700/20 disabled:opacity-50"
              >
                {saving ? (
                  <span>Saving Profile...</span>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Save &amp; Go to Dashboard</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
