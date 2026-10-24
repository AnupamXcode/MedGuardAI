import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  addUserMedication,
  deleteUserMedication,
  updateUserConditions,
  addEmergencyContact,
  deleteEmergencyContact,
  updateAccountSettings,
  deleteUserAccount,
  searchDrugs,
  saveOnboardingProfile,
  type DrugItem,
} from '../services/api';
import {
  User,
  Activity,
  Pill,
  HeartPulse,
  Settings,
  LogOut,
  X,
  Trash2,
  Plus,
  Save,
  CheckCircle2,
  AlertTriangle,
  Search,
  Lock,
} from 'lucide-react';

export const ProfileSettingsModal: React.FC = () => {
  const {
    user,
    profile,
    isProfileSettingsOpen,
    profileSettingsTab,
    closeProfileSettings,
    refreshProfile,
    logout,
  } = useAuth();

  const [activeTab, setActiveTab] = useState<'profile' | 'health' | 'medications' | 'emergency' | 'account'>(
    profileSettingsTab || 'profile'
  );

  useEffect(() => {
    if (profileSettingsTab) setActiveTab(profileSettingsTab);
  }, [profileSettingsTab]);

  // Form states
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [dob, setDob] = useState('');
  const [age, setAge] = useState<number | ''>('');
  const [gender, setGender] = useState('');
  const [allergiesText, setAllergiesText] = useState('');
  const [healthNotes, setHealthNotes] = useState('');

  // Medications state
  const [medQuery, setMedQuery] = useState('');
  const [medSearchResults, setMedSearchResults] = useState<DrugItem[]>([]);
  const [newMedName, setNewMedName] = useState('');
  const [newMedId, setNewMedId] = useState('');
  const [newDosage, setNewDosage] = useState('');
  const [newFrequency, setNewFrequency] = useState('Once daily');

  // Conditions state
  const [conditions, setConditions] = useState<string[]>([]);
  const [newCondition, setNewCondition] = useState('');

  // Emergency contact state
  const [contactName, setContactName] = useState('');
  const [contactRel, setContactRel] = useState('Spouse');
  const [contactPhone, setContactPhone] = useState('');

  // Account settings
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Feedback states
  const [saving, setSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (user) {
      setFullName(user.full_name || '');
      setPhone(user.phone || '');
    }
    if (profile) {
      if (profile.profile) {
        setDob(profile.profile.dob || '');
        setAge(profile.profile.age || '');
        setGender(profile.profile.gender || '');
        setAllergiesText((profile.profile.allergies || []).join(', '));
        setHealthNotes(profile.profile.health_notes || '');
      }
      setConditions(profile.conditions || []);
    }
  }, [user, profile]);

  if (!isProfileSettingsOpen) return null;

  // Search medications
  const handleMedSearch = async (q: string) => {
    setMedQuery(q);
    if (!q || q.length < 2) {
      setMedSearchResults([]);
      return;
    }
    try {
      const results = await searchDrugs(q.trim());
      setMedSearchResults(results.slice(0, 6));
    } catch {
      // ignore
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setStatusMsg(null);
    try {
      const parsedAllergies = allergiesText
        .split(',')
        .map((a) => a.trim())
        .filter(Boolean);

      await saveOnboardingProfile({
        full_name: fullName.trim() || undefined,
        phone: phone.trim() || undefined,
        dob: dob || undefined,
        age: typeof age === 'number' ? age : undefined,
        gender: gender || undefined,
        allergies: parsedAllergies,
        health_notes: healthNotes.trim() || undefined,
        conditions: conditions,
        medications: profile?.medications || [],
        emergency_contacts: profile?.emergency_contacts || [],
      });
      await refreshProfile();
      setStatusMsg({ type: 'success', text: 'Personal profile updated successfully!' });
    } catch (err: any) {
      setStatusMsg({ type: 'error', text: err.message || 'Failed to update profile.' });
    } finally {
      setSaving(false);
    }
  };

  const handleAddCondition = async () => {
    if (!newCondition.trim()) return;
    const trimmed = newCondition.trim();
    if (conditions.includes(trimmed)) return;
    const updated = [...conditions, trimmed];
    setConditions(updated);
    setNewCondition('');
    try {
      await updateUserConditions(updated);
      await refreshProfile();
      setStatusMsg({ type: 'success', text: `Condition '${trimmed}' added.` });
    } catch (err: any) {
      setStatusMsg({ type: 'error', text: err.message || 'Failed to add condition.' });
    }
  };

  const handleRemoveCondition = async (cond: string) => {
    const updated = conditions.filter((c) => c !== cond);
    setConditions(updated);
    try {
      await updateUserConditions(updated);
      await refreshProfile();
      setStatusMsg({ type: 'success', text: `Condition removed.` });
    } catch (err: any) {
      setStatusMsg({ type: 'error', text: err.message || 'Failed to remove condition.' });
    }
  };

  const handleAddMedication = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMedName.trim()) return;
    setSaving(true);
    setStatusMsg(null);
    try {
      await addUserMedication({
        drug_id: newMedId || undefined,
        drug_name: newMedName.trim(),
        dosage: newDosage.trim() || 'Standard dose',
        frequency: newFrequency,
        is_active: true,
      });
      setNewMedName('');
      setNewMedId('');
      setNewDosage('');
      await refreshProfile();
      setStatusMsg({ type: 'success', text: 'Medicine added to your saved list.' });
    } catch (err: any) {
      setStatusMsg({ type: 'error', text: err.message || 'Failed to add medicine.' });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteMedication = async (id: number) => {
    if (!window.confirm('Are you sure you want to remove this medicine from your list?')) return;
    try {
      await deleteUserMedication(id);
      await refreshProfile();
      setStatusMsg({ type: 'success', text: 'Medicine removed.' });
    } catch (err: any) {
      setStatusMsg({ type: 'error', text: err.message || 'Failed to remove medicine.' });
    }
  };

  const handleAddContact = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName.trim() || !contactPhone.trim()) return;
    setSaving(true);
    setStatusMsg(null);
    try {
      await addEmergencyContact({
        name: contactName.trim(),
        relationship: contactRel,
        phone: contactPhone.trim(),
        is_primary: (profile?.emergency_contacts?.length || 0) === 0,
      });
      setContactName('');
      setContactPhone('');
      await refreshProfile();
      setStatusMsg({ type: 'success', text: 'Emergency contact saved.' });
    } catch (err: any) {
      setStatusMsg({ type: 'error', text: err.message || 'Failed to add contact.' });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteContact = async (id: number) => {
    if (!window.confirm('Delete this emergency contact?')) return;
    try {
      await deleteEmergencyContact(id);
      await refreshProfile();
      setStatusMsg({ type: 'success', text: 'Contact removed.' });
    } catch (err: any) {
      setStatusMsg({ type: 'error', text: err.message || 'Failed to remove contact.' });
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMsg(null);
    if (!currentPassword) {
      setStatusMsg({ type: 'error', text: 'Current password is required.' });
      return;
    }
    if (newPassword.length < 6) {
      setStatusMsg({ type: 'error', text: 'New password must be at least 6 characters.' });
      return;
    }
    if (newPassword !== confirmPassword) {
      setStatusMsg({ type: 'error', text: 'Passwords do not match.' });
      return;
    }
    setSaving(true);
    try {
      await updateAccountSettings({
        current_password: currentPassword,
        new_password: newPassword,
      });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setStatusMsg({ type: 'success', text: 'Password successfully changed!' });
    } catch (err: any) {
      setStatusMsg({ type: 'error', text: err.message || 'Password update failed.' });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccountData = async () => {
    try {
      await deleteUserAccount();
      logout();
      closeProfileSettings();
    } catch (err: any) {
      setStatusMsg({ type: 'error', text: err.message || 'Failed to delete account.' });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-4xl bg-surface-container-lowest rounded-2xl shadow-2xl border border-outline-variant overflow-hidden flex flex-col md:flex-row max-h-[90vh]">
        {/* Left Sidebar Menu */}
        <div className="w-full md:w-64 bg-surface-container-low border-b md:border-b-0 md:border-r border-outline-variant/60 p-4 shrink-0 flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-3 mb-6 p-2 rounded-xl bg-surface-container-lowest border border-outline-variant/60">
              <div className="w-10 h-10 rounded-full bg-primary-container text-primary flex items-center justify-center font-bold text-base">
                {user?.full_name ? user.full_name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="overflow-hidden">
                <div className="font-bold text-xs text-charcoal truncate">{user?.full_name || 'User Profile'}</div>
                <div className="text-[10px] text-charcoal-muted truncate">{user?.email}</div>
              </div>
            </div>

            <nav className="space-y-1">
              <button
                type="button"
                onClick={() => { setActiveTab('profile'); setStatusMsg(null); }}
                className={`w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition ${
                  activeTab === 'profile'
                    ? 'bg-primary text-white shadow-sm'
                    : 'text-charcoal hover:bg-surface-container-highest'
                }`}
              >
                <User className="w-4 h-4" />
                <span>My Profile</span>
              </button>

              <button
                type="button"
                onClick={() => { setActiveTab('health'); setStatusMsg(null); }}
                className={`w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition ${
                  activeTab === 'health'
                    ? 'bg-primary text-white shadow-sm'
                    : 'text-charcoal hover:bg-surface-container-highest'
                }`}
              >
                <Activity className="w-4 h-4" />
                <span>Health &amp; Illnesses</span>
              </button>

              <button
                type="button"
                onClick={() => { setActiveTab('medications'); setStatusMsg(null); }}
                className={`w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition ${
                  activeTab === 'medications'
                    ? 'bg-primary text-white shadow-sm'
                    : 'text-charcoal hover:bg-surface-container-highest'
                }`}
              >
                <Pill className="w-4 h-4" />
                <span>My Saved Medicines ({profile?.medications?.length || 0})</span>
              </button>

              <button
                type="button"
                onClick={() => { setActiveTab('emergency'); setStatusMsg(null); }}
                className={`w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition ${
                  activeTab === 'emergency'
                    ? 'bg-primary text-white shadow-sm'
                    : 'text-charcoal hover:bg-surface-container-highest'
                }`}
              >
                <HeartPulse className="w-4 h-4" />
                <span>Emergency Contacts</span>
              </button>

              <button
                type="button"
                onClick={() => { setActiveTab('account'); setStatusMsg(null); }}
                className={`w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition ${
                  activeTab === 'account'
                    ? 'bg-primary text-white shadow-sm'
                    : 'text-charcoal hover:bg-surface-container-highest'
                }`}
              >
                <Settings className="w-4 h-4" />
                <span>Account Settings</span>
              </button>
            </nav>
          </div>

          <div className="pt-4 border-t border-outline-variant/60 mt-4">
            <button
              type="button"
              onClick={() => {
                logout();
                closeProfileSettings();
              }}
              className="w-full flex items-center space-x-2 px-3 py-2 rounded-xl text-xs font-semibold text-error hover:bg-error-container/40 transition"
            >
              <LogOut className="w-4 h-4" />
              <span>Log Out</span>
            </button>
          </div>
        </div>

        {/* Right Content Area */}
        <div className="flex-1 p-6 overflow-y-auto relative flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-outline-variant/60 mb-5">
              <div>
                <h3 className="text-lg font-bold text-charcoal font-title-lg">
                  {activeTab === 'profile' && 'Personal Details & Profile'}
                  {activeTab === 'health' && 'Health Conditions & Allergies'}
                  {activeTab === 'medications' && 'My Saved Medicines'}
                  {activeTab === 'emergency' && 'Emergency Contacts'}
                  {activeTab === 'account' && 'Account Password & Security'}
                </h3>
                <p className="text-xs text-charcoal-muted">
                  Your health information is private and securely saved to your personal account.
                </p>
              </div>
              <button
                onClick={closeProfileSettings}
                className="p-1.5 rounded-full text-charcoal-muted hover:text-charcoal hover:bg-surface-container-highest transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Notification alert banner */}
            {statusMsg && (
              <div
                className={`mb-4 p-3 rounded-xl text-xs flex items-center space-x-2 border ${
                  statusMsg.type === 'success'
                    ? 'bg-[#E6F4EA] text-[#137333] border-[#137333]/30'
                    : 'bg-error-container text-on-error-container border-error/30'
                }`}
              >
                {statusMsg.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-[#137333]" />
                ) : (
                  <AlertTriangle className="w-4 h-4 shrink-0 text-error" />
                )}
                <span>{statusMsg.text}</span>
              </div>
            )}

            {/* TAB 1: PROFILE */}
            {activeTab === 'profile' && (
              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-charcoal mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-outline-variant bg-surface-container-low text-charcoal focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-charcoal mb-1">Email Address</label>
                    <input
                      type="email"
                      disabled
                      value={user?.email || ''}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-outline-variant/60 bg-surface-container-highest/60 text-charcoal-muted cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-charcoal mb-1">Phone Number</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+1 (555) 000-0000"
                      className="w-full px-3 py-2 text-xs rounded-lg border border-outline-variant bg-surface-container-low text-charcoal focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-charcoal mb-1">Gender</label>
                    <select
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-outline-variant bg-surface-container-low text-charcoal"
                    >
                      <option value="">Not specified</option>
                      <option value="Female">Female</option>
                      <option value="Male">Male</option>
                      <option value="Non-binary">Non-binary</option>
                      <option value="Prefer not to say">Prefer not to say</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-charcoal mb-1">Date of Birth</label>
                    <input
                      type="date"
                      value={dob}
                      onChange={(e) => setDob(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-outline-variant bg-surface-container-low text-charcoal"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-charcoal mb-1">Age</label>
                    <input
                      type="number"
                      value={age}
                      onChange={(e) => setAge(e.target.value ? parseInt(e.target.value) : '')}
                      placeholder="e.g. 42"
                      className="w-full px-3 py-2 text-xs rounded-lg border border-outline-variant bg-surface-container-low text-charcoal"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <label className="block text-xs font-semibold text-charcoal mb-1">
                    Known Allergies (separated by commas)
                  </label>
                  <input
                    type="text"
                    value={allergiesText}
                    onChange={(e) => setAllergiesText(e.target.value)}
                    placeholder="e.g. Penicillin, Sulfa, Peanuts"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-outline-variant bg-surface-container-low text-charcoal"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-charcoal mb-1">Health &amp; Dietary Notes</label>
                  <textarea
                    rows={2}
                    value={healthNotes}
                    onChange={(e) => setHealthNotes(e.target.value)}
                    placeholder="Any food sensitivities, special diets, or notes from your doctor..."
                    className="w-full px-3 py-2 text-xs rounded-lg border border-outline-variant bg-surface-container-low text-charcoal"
                  />
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-5 py-2 rounded-xl bg-primary hover:bg-[#B84A24] text-white text-xs font-semibold transition flex items-center space-x-1.5 shadow-md shadow-primary/20 disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    <span>{saving ? 'Saving...' : 'Save Profile Changes'}</span>
                  </button>
                </div>
              </form>
            )}

            {/* TAB 2: HEALTH CONDITIONS */}
            {activeTab === 'health' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-charcoal mb-1">Add a Health Condition</label>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={newCondition}
                      onChange={(e) => setNewCondition(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddCondition())}
                      placeholder="e.g. High blood pressure, Asthma, Diabetes, Liver issue..."
                      className="flex-1 px-3 py-2 text-xs rounded-lg border border-outline-variant bg-surface-container-low text-charcoal focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                    <button
                      type="button"
                      onClick={handleAddCondition}
                      className="px-4 py-2 bg-primary text-white text-xs font-semibold rounded-lg hover:bg-[#B84A24] transition flex items-center space-x-1"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add</span>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-charcoal mb-2">
                    Your Recorded Conditions ({conditions.length})
                  </label>
                  {conditions.length === 0 ? (
                    <div className="p-6 rounded-xl border border-dashed border-outline-variant bg-surface-container-low text-center text-xs text-charcoal-muted">
                      No conditions added yet. Add any health conditions above so we can warn you if a medicine isn't safe for you.
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {conditions.map((c) => (
                        <div
                          key={c}
                          className="px-3 py-1.5 rounded-lg bg-surface-container-low border border-outline-variant flex items-center space-x-2 text-xs text-charcoal"
                        >
                          <Activity className="w-3.5 h-3.5 text-primary" />
                          <span className="font-semibold">{c}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveCondition(c)}
                            className="text-charcoal-muted hover:text-error transition"
                            title="Remove condition"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB 3: MEDICATIONS */}
            {activeTab === 'medications' && (
              <div className="space-y-4">
                <form onSubmit={handleAddMedication} className="p-3.5 rounded-xl border border-outline-variant bg-surface-container-low space-y-3">
                  <div className="font-bold text-xs text-charcoal flex items-center space-x-1.5">
                    <Plus className="w-4 h-4 text-primary" />
                    <span>Add a New Medicine</span>
                  </div>

                  {/* Search box with drugbank autocomplete */}
                  <div className="relative">
                    <Search className="w-4 h-4 text-charcoal-muted absolute left-3 top-2.5" />
                    <input
                      type="text"
                      value={medQuery}
                      onChange={(e) => handleMedSearch(e.target.value)}
                      placeholder="Search for a medicine (e.g. Aspirin, Metformin, Lisinopril)..."
                      className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-outline-variant bg-white text-charcoal"
                    />

                    {medSearchResults.length > 0 && (
                      <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-outline-variant rounded-xl shadow-xl z-20 overflow-hidden divide-y divide-outline-variant/40">
                        {medSearchResults.map((drug) => (
                          <button
                            key={drug.id}
                            type="button"
                            onClick={() => {
                              setNewMedName(drug.name);
                              setNewMedId(drug.id);
                              setMedQuery('');
                              setMedSearchResults([]);
                            }}
                            className="w-full px-3 py-2 text-left hover:bg-primary-container/40 flex items-center justify-between transition text-xs"
                          >
                            <span className="font-bold text-charcoal">{drug.name}</span>
                            <span className="text-[10px] text-charcoal-muted">{drug.id}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <div>
                      <label className="block text-[11px] font-semibold text-charcoal mb-0.5">Medicine Name *</label>
                      <input
                        type="text"
                        required
                        value={newMedName}
                        onChange={(e) => setNewMedName(e.target.value)}
                        placeholder="e.g. Warfarin"
                        className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-outline-variant bg-white text-charcoal"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-charcoal mb-0.5">Dose</label>
                      <input
                        type="text"
                        value={newDosage}
                        onChange={(e) => setNewDosage(e.target.value)}
                        placeholder="e.g. 5 mg"
                        className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-outline-variant bg-white text-charcoal"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-charcoal mb-0.5">How Often</label>
                      <select
                        value={newFrequency}
                        onChange={(e) => setNewFrequency(e.target.value)}
                        className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-outline-variant bg-white text-charcoal"
                      >
                        <option value="Once daily">Once a day</option>
                        <option value="Twice daily (BID)">Twice a day</option>
                        <option value="Three times daily (TID)">Three times a day</option>
                        <option value="As needed (PRN)">As needed</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={!newMedName.trim() || saving}
                      className="px-4 py-1.5 rounded-lg bg-primary text-white text-xs font-semibold hover:bg-[#B84A24] transition disabled:opacity-40"
                    >
                      Add Medicine
                    </button>
                  </div>
                </form>

                {/* List of medications */}
                <div className="space-y-2">
                  {(profile?.medications || []).length === 0 ? (
                    <div className="p-6 rounded-xl border border-dashed border-outline-variant bg-surface-container-low text-center text-xs text-charcoal-muted">
                      No medicines saved yet. Add your daily medicines above.
                    </div>
                  ) : (
                    profile?.medications?.map((m) => (
                      <div
                        key={m.id}
                        className="p-3 rounded-xl bg-surface-container-low border border-outline-variant/60 flex items-center justify-between"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-lg bg-primary-container flex items-center justify-center text-primary">
                            <Pill className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="font-bold text-xs text-charcoal">
                              {m.drug_name}
                              {m.drug_id && (
                                <span className="ml-1.5 text-[10px] text-charcoal-muted font-normal">
                                  ({m.drug_id})
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-charcoal-muted">
                              {m.dosage} • {m.frequency}
                            </div>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => m.id && handleDeleteMedication(m.id)}
                          className="p-1.5 text-charcoal-muted hover:text-error hover:bg-error-container/40 rounded-lg transition"
                          title="Delete medicine"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* TAB 4: EMERGENCY CONTACTS */}
            {activeTab === 'emergency' && (
              <div className="space-y-4">
                <form onSubmit={handleAddContact} className="p-3.5 rounded-xl border border-outline-variant bg-surface-container-low space-y-3">
                  <div className="font-bold text-xs text-charcoal flex items-center space-x-1.5">
                    <Plus className="w-4 h-4 text-primary" />
                    <span>Add an Emergency Contact</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <div>
                      <label className="block text-[11px] font-semibold text-charcoal mb-0.5">Name *</label>
                      <input
                        type="text"
                        required
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                        placeholder="e.g. John Doe"
                        className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-outline-variant bg-white text-charcoal"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-charcoal mb-0.5">Relationship *</label>
                      <select
                        value={contactRel}
                        onChange={(e) => setContactRel(e.target.value)}
                        className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-outline-variant bg-white text-charcoal"
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
                      <label className="block text-[11px] font-semibold text-charcoal mb-0.5">Phone *</label>
                      <input
                        type="tel"
                        required
                        value={contactPhone}
                        onChange={(e) => setContactPhone(e.target.value)}
                        placeholder="+1 (555) 000-0000"
                        className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-outline-variant bg-white text-charcoal"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={!contactName.trim() || !contactPhone.trim() || saving}
                      className="px-4 py-1.5 rounded-lg bg-primary text-white text-xs font-semibold hover:bg-[#B84A24] transition disabled:opacity-40"
                    >
                      Save Contact
                    </button>
                  </div>
                </form>

                <div className="space-y-2">
                  {(profile?.emergency_contacts || []).length === 0 ? (
                    <div className="p-6 rounded-xl border border-dashed border-outline-variant bg-surface-container-low text-center text-xs text-charcoal-muted">
                      No emergency contacts added yet.
                    </div>
                  ) : (
                    profile?.emergency_contacts?.map((c) => (
                      <div
                        key={c.id}
                        className="p-3 rounded-xl bg-surface-container-low border border-outline-variant/60 flex items-center justify-between"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-lg bg-primary-container flex items-center justify-center text-primary">
                            <HeartPulse className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="font-bold text-xs text-charcoal">
                              {c.name}{' '}
                              <span className="font-normal text-charcoal-muted text-[11px]">
                                ({c.relationship})
                              </span>
                            </div>
                            <div className="text-[11px] text-charcoal-muted">{c.phone}</div>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => c.id && handleDeleteContact(c.id)}
                          className="p-1.5 text-charcoal-muted hover:text-error hover:bg-error-container/40 rounded-lg transition"
                          title="Delete contact"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* TAB 5: ACCOUNT SETTINGS */}
            {activeTab === 'account' && (
              <div className="space-y-6">
                <form onSubmit={handleUpdatePassword} className="p-4 rounded-xl border border-outline-variant bg-surface-container-low space-y-3">
                  <div className="font-bold text-xs text-charcoal flex items-center space-x-1.5">
                    <Lock className="w-4 h-4 text-primary" />
                    <span>Change Account Password</span>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-charcoal mb-1">Current Password</label>
                    <input
                      type="password"
                      required
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full px-3 py-1.5 text-xs rounded-lg border border-outline-variant bg-white text-charcoal"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-charcoal mb-1">New Password</label>
                      <input
                        type="password"
                        required
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Minimum 6 characters"
                        className="w-full px-3 py-1.5 text-xs rounded-lg border border-outline-variant bg-white text-charcoal"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-charcoal mb-1">Confirm New Password</label>
                      <input
                        type="password"
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Re-enter new password"
                        className="w-full px-3 py-1.5 text-xs rounded-lg border border-outline-variant bg-white text-charcoal"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-1">
                    <button
                      type="submit"
                      disabled={saving}
                      className="px-4 py-1.5 rounded-lg bg-primary text-white text-xs font-semibold hover:bg-[#B84A24] transition disabled:opacity-50"
                    >
                      Update Password
                    </button>
                  </div>
                </form>

                {/* Danger zone: delete account */}
                <div className="p-4 rounded-xl border border-error/30 bg-error-container/20 space-y-2">
                  <div className="font-bold text-xs text-error flex items-center space-x-1.5">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Danger Zone: Delete Account &amp; Saved Data</span>
                  </div>
                  <p className="text-[11px] text-charcoal-muted">
                    Permanently delete your profile, saved medicines, emergency contacts, and check history. This cannot be undone.
                  </p>

                  {!showDeleteConfirm ? (
                    <button
                      type="button"
                      onClick={() => setShowDeleteConfirm(true)}
                      className="px-3 py-1.5 bg-error text-white text-xs font-semibold rounded-lg hover:bg-[#93000A] transition"
                    >
                      Delete Account
                    </button>
                  ) : (
                    <div className="flex items-center space-x-2 pt-2">
                      <button
                        type="button"
                        onClick={handleDeleteAccountData}
                        className="px-4 py-1.5 bg-error text-white text-xs font-bold rounded-lg hover:bg-[#93000A] transition"
                      >
                        Yes, Delete My Account
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowDeleteConfirm(false)}
                        className="px-3 py-1.5 bg-surface-container-highest text-charcoal text-xs font-semibold rounded-lg hover:bg-surface-dim transition"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
