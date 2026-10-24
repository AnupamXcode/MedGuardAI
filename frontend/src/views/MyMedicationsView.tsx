import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  type DrugItem,
  addUserMedication,
  deleteUserMedication,
  searchDrugs,
} from '../services/api';

interface MyMedicationsViewProps {
  medications: DrugItem[];
  onRemove: (id: string) => void;
  onAddMedication?: (drug: DrugItem) => void;
  onNavigateToCheck: () => void;
}

export const MyMedicationsView: React.FC<MyMedicationsViewProps> = ({
  medications,
  onRemove,
  onAddMedication,
  onNavigateToCheck,
}) => {
  const { profile, isAuthenticated, refreshProfile, openAuthModal } = useAuth();

  // Add form state
  const [medQuery, setMedQuery] = useState('');
  const [searchResults, setSearchResults] = useState<DrugItem[]>([]);
  const [selectedDrug, setSelectedDrug] = useState<DrugItem | null>(null);
  const [dosage, setDosage] = useState('');
  const [frequency, setFrequency] = useState('Once daily');
  const [isSaving, setIsSaving] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const profileMeds = profile?.medications || [];

  // Search autocomplete
  const handleSearch = async (val: string) => {
    setMedQuery(val);
    if (!val || val.length < 2) {
      setSearchResults([]);
      return;
    }
    try {
      const results = await searchDrugs(val.trim());
      setSearchResults(results.slice(0, 6));
    } catch {
      // ignore
    }
  };

  // Add new medicine to persistent profile
  const handleAddMedicine = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!medQuery.trim()) return;
    setIsSaving(true);
    setFeedbackMsg(null);

    try {
      if (isAuthenticated) {
        await addUserMedication({
          drug_id: selectedDrug?.id || undefined,
          drug_name: selectedDrug?.name || medQuery.trim(),
          dosage: dosage.trim() || 'Standard dose',
          frequency: frequency,
          is_active: true,
        });
        await refreshProfile();
      }

      // Also add to active checker if callback present
      if (onAddMedication && selectedDrug) {
        onAddMedication(selectedDrug);
      }

      setMedQuery('');
      setSelectedDrug(null);
      setDosage('');
      setSearchResults([]);
      setFeedbackMsg({ type: 'success', text: 'Medicine successfully saved to your profile cabinet!' });
    } catch (err: any) {
      setFeedbackMsg({ type: 'error', text: err.message || 'Failed to save medicine.' });
    } finally {
      setIsSaving(false);
    }
  };

  // Delete medicine
  const handleDeleteMedicine = async (id?: number, drugName?: string, drugId?: string) => {
    if (!window.confirm(`Remove ${drugName || 'this medicine'} from your saved list?`)) return;

    try {
      if (id && isAuthenticated) {
        await deleteUserMedication(id);
        await refreshProfile();
      }
      if (drugId) {
        onRemove(drugId);
      }
      setFeedbackMsg({ type: 'success', text: 'Medicine removed from your cabinet.' });
    } catch (err: any) {
      setFeedbackMsg({ type: 'error', text: err.message || 'Failed to remove medicine.' });
    }
  };

  // Save active session meds to profile
  const handleSaveSessionMedsToProfile = async () => {
    if (!isAuthenticated) {
      openAuthModal('register');
      return;
    }
    setIsSaving(true);
    try {
      for (const sm of medications) {
        const alreadyInProfile = profileMeds.some(
          (pm) => pm.drug_name.toLowerCase() === sm.name.toLowerCase()
        );
        if (!alreadyInProfile) {
          await addUserMedication({
            drug_id: sm.id,
            drug_name: sm.name,
            dosage: sm.categories?.[0] || 'Standard dose',
            frequency: 'Once daily',
            is_active: true,
          });
        }
      }
      await refreshProfile();
      setFeedbackMsg({ type: 'success', text: `Saved all active medicines to your account!` });
    } catch (err: any) {
      setFeedbackMsg({ type: 'error', text: err.message || 'Failed to sync medicines.' });
    } finally {
      setIsSaving(false);
    }
  };

  // Unsaved session meds count
  const unsavedCount = medications.filter(
    (sm) => !profileMeds.some((pm) => pm.drug_name.toLowerCase() === sm.name.toLowerCase())
  ).length;

  return (
    <div className="flex flex-col w-full max-w-5xl mx-auto space-y-8 animate-fadeIn pb-16">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="flex flex-col max-w-2xl space-y-1">
          <div className="inline-flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-[#008060]">
            <span className="material-symbols-outlined text-[18px]">pill</span>
            <span>Your Personal Cabinet</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            My Saved Medicines
          </h1>
          <p className="text-sm text-slate-600 leading-relaxed">
            Your medications are securely saved to your account. You can review them anytime and run instant safety checks across all of them together.
          </p>
        </div>

        <button
          onClick={onNavigateToCheck}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#008060] hover:bg-[#006e52] text-white text-xs font-bold shadow-sm transition-colors cursor-pointer self-start md:self-auto"
        >
          <span className="material-symbols-outlined text-[18px]">rule</span>
          <span>Check Safety with Checker</span>
        </button>
      </div>

      {/* Sync Banner if there are unsaved session medicines */}
      {unsavedCount > 0 && (
        <div className="p-4 rounded-2xl bg-teal-50 border border-teal-300 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#008060] text-white flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[20px]">sync</span>
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900">
                You have {unsavedCount} medicine{unsavedCount > 1 ? 's' : ''} in your active check session not yet saved to your profile cabinet.
              </div>
              <div className="text-[11px] text-slate-600">
                {medications.map((m) => m.name).join(', ')}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleSaveSessionMedsToProfile}
            disabled={isSaving}
            className="px-4 py-2 rounded-xl bg-[#008060] hover:bg-[#006e52] text-white text-xs font-bold transition shadow-xs cursor-pointer shrink-0 disabled:opacity-50"
          >
            {isSaving ? 'Saving...' : '+ Save to Profile Cabinet'}
          </button>
        </div>
      )}

      {/* Feedback Message Alert */}
      {feedbackMsg && (
        <div
          className={`p-3.5 rounded-xl text-xs font-semibold flex items-center justify-between ${
            feedbackMsg.type === 'success'
              ? 'bg-emerald-50 text-emerald-900 border border-emerald-300'
              : 'bg-rose-50 text-rose-900 border border-rose-300'
          }`}
        >
          <span>{feedbackMsg.text}</span>
          <button
            type="button"
            onClick={() => setFeedbackMsg(null)}
            className="text-slate-500 hover:text-slate-800 font-bold ml-2"
          >
            ✕
          </button>
        </div>
      )}

      {/* Add New Medicine Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-300 shadow-sm space-y-4">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <span className="material-symbols-outlined text-[20px] text-[#008060]">add_circle</span>
          <span>Add a New Medicine to Your Cabinet</span>
        </h2>

        <form onSubmit={handleAddMedicine} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Autocomplete Input */}
            <div className="relative md:col-span-1">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600 block mb-1">
                Medicine Name *
              </label>
              <input
                type="text"
                value={medQuery}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Search name (e.g. Metformin)..."
                className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#008060]/30"
              />

              {/* Autocomplete Dropdown */}
              {searchResults.length > 0 && (
                <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-slate-300 rounded-xl shadow-xl z-20 overflow-hidden divide-y divide-slate-100">
                  {searchResults.map((drug) => (
                    <button
                      key={drug.id}
                      type="button"
                      onClick={() => {
                        setSelectedDrug(drug);
                        setMedQuery(drug.name);
                        setSearchResults([]);
                      }}
                      className="w-full px-3 py-2 text-left hover:bg-slate-50 flex items-center justify-between text-xs transition"
                    >
                      <span className="font-bold text-slate-900">{drug.name}</span>
                      <span className="text-[10px] text-slate-400 font-mono">{drug.id}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Dosage */}
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600 block mb-1">
                Dosage
              </label>
              <input
                type="text"
                value={dosage}
                onChange={(e) => setDosage(e.target.value)}
                placeholder="e.g. 5 mg, 500 mg, 1 tablet"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#008060]/30"
              />
            </div>

            {/* Frequency */}
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600 block mb-1">
                How Often
              </label>
              <select
                value={frequency}
                onChange={(e) => setFrequency(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#008060]/30"
              >
                <option value="Once daily">Once daily</option>
                <option value="Twice daily">Twice daily</option>
                <option value="Three times daily">Three times daily</option>
                <option value="Every morning">Every morning</option>
                <option value="Every evening">Every evening</option>
                <option value="As needed (PRN)">As needed</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end pt-1">
            <button
              type="submit"
              disabled={!medQuery.trim() || isSaving}
              className="px-5 py-2 rounded-xl bg-[#008060] hover:bg-[#006e52] text-white text-xs font-bold transition shadow-xs disabled:opacity-40 cursor-pointer"
            >
              {isSaving ? 'Adding...' : '+ Add to Saved Cabinet'}
            </button>
          </div>
        </form>
      </div>

      {/* Saved Medicines Cabinet List */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-300 shadow-sm space-y-5">
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-slate-900">
              Active Saved Medicines
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-teal-100 text-teal-900 border border-teal-300">
              {isAuthenticated ? profileMeds.length : medications.length} Saved
            </span>
          </div>

          <span className="text-xs text-slate-500 font-medium hidden sm:inline">
            Encrypted &amp; private to your account
          </span>
        </div>

        {/* Empty state */}
        {(isAuthenticated ? profileMeds.length : medications.length) === 0 ? (
          <div className="py-14 text-center space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 mx-auto">
              <span className="material-symbols-outlined text-[32px]">medication</span>
            </div>
            <h3 className="text-base font-bold text-slate-900">
              No Medicines Saved in Your Cabinet Yet
            </h3>
            <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
              Use the search box above to add your daily prescriptions, vitamins, or over-the-counter pills.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 uppercase tracking-wider font-bold">
                  <th className="py-3 px-3">Medicine Name</th>
                  <th className="py-3 px-3">Dosage</th>
                  <th className="py-3 px-3">Frequency</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                {isAuthenticated
                  ? profileMeds.map((med) => (
                      <tr key={med.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3.5 px-3 font-bold text-slate-900 flex items-center gap-2.5">
                          <span className="w-7 h-7 rounded-lg bg-teal-100 text-[#008060] flex items-center justify-center font-bold text-xs shrink-0">
                            Rx
                          </span>
                          <div>
                            <span className="text-sm">{med.drug_name}</span>
                            {med.drug_id && (
                              <span className="text-[10px] text-slate-400 font-mono block">
                                {med.drug_id}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-3.5 px-3 text-slate-700">
                          {med.dosage || 'Standard dose'}
                        </td>
                        <td className="py-3.5 px-3">
                          <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-800 font-semibold text-[11px] border border-slate-200">
                            {med.frequency}
                          </span>
                        </td>
                        <td className="py-3.5 px-3 text-right">
                          <button
                            type="button"
                            onClick={() => handleDeleteMedicine(med.id, med.drug_name, med.drug_id || undefined)}
                            className="px-2.5 py-1 text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded-lg font-bold text-xs transition cursor-pointer"
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))
                  : medications.map((med) => (
                      <tr key={med.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3.5 px-3 font-bold text-slate-900 flex items-center gap-2.5">
                          <span className="w-7 h-7 rounded-lg bg-teal-100 text-[#008060] flex items-center justify-center font-bold text-xs shrink-0">
                            Rx
                          </span>
                          <span className="text-sm">{med.name}</span>
                        </td>
                        <td className="py-3.5 px-3 text-slate-700">
                          {med.categories[0] || 'Standard dose'}
                        </td>
                        <td className="py-3.5 px-3">
                          <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-800 font-semibold text-[11px]">
                            Once daily
                          </span>
                        </td>
                        <td className="py-3.5 px-3 text-right">
                          <button
                            type="button"
                            onClick={() => onRemove(med.id)}
                            className="px-2.5 py-1 text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded-lg font-bold text-xs transition cursor-pointer"
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
