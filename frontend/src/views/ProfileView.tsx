import React from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Activity,
  Pill,
  HeartPulse,
  Settings,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

interface ProfileViewProps {
  onNavigateToCheck: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ onNavigateToCheck }) => {
  const {
    user,
    profile,
    isAuthenticated,
    openAuthModal,
    openProfileSettings,
    openOnboarding,
  } = useAuth();

  const completionPercent = profile?.profile_completion_percentage ?? 0;
  const userMeds = profile?.medications || [];
  const userConds = profile?.conditions || [];
  const userContacts = profile?.emergency_contacts || [];

  // ============================================================
  // UNATHENTICATED STATE: Clean invitation to Sign In / Sign Up
  // ============================================================
  if (!isAuthenticated || !user) {
    return (
      <div className="max-w-3xl mx-auto py-12 px-4 animate-fadeIn space-y-8">
        <div className="text-center space-y-3">
          <h1 className="text-3xl sm:text-4xl font-bold font-heading text-slate-900 tracking-tight">
            My Health Profile
          </h1>
          <p className="text-base text-slate-600 max-w-xl mx-auto">
            Your personal profile securely stores your daily medicines, medical conditions, and emergency contacts so you never have to re-enter them.
          </p>
        </div>

        {/* Feature Highlights Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-xs space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex flex-col items-center text-center p-4 rounded-xl bg-slate-50 border border-slate-100">
              <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center mb-3">
                <Pill className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-slate-900 mb-1">Save Your Medicines</h3>
              <p className="text-xs text-slate-500">
                Keep your active prescriptions safe in your digital cabinet.
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-4 rounded-xl bg-slate-50 border border-slate-100">
              <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center mb-3">
                <Activity className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-slate-900 mb-1">Health Warnings</h3>
              <p className="text-xs text-slate-500">
                Get warned if a medicine isn't safe with high blood pressure or asthma.
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-4 rounded-xl bg-slate-50 border border-slate-100">
              <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center mb-3">
                <HeartPulse className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-slate-900 mb-1">Emergency Contacts</h3>
              <p className="text-xs text-slate-500">
                Add doctors and family members to reach during an emergency.
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => openAuthModal('login')}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm transition shadow-sm"
            >
              Sign In to Your Account
            </button>
            <button
              type="button"
              onClick={() => openAuthModal('register')}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#008060] hover:bg-[#006e52] text-white font-semibold text-sm transition shadow-sm"
            >
              Create Free Account
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ============================================================
  // AUTHENTICATED STATE: View profile details & launch settings
  // ============================================================
  return (
    <div className="max-w-5xl mx-auto py-6 space-y-6 animate-fadeIn">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-white border border-slate-200 shadow-xs">
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 rounded-2xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-xl border border-teal-200">
            {user.full_name ? user.full_name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold font-heading text-slate-900">
              {user.full_name || 'My Health Profile'}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">{user.email}</p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => openProfileSettings('profile')}
          className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs transition"
        >
          <Settings className="w-4 h-4" />
          <span>Edit Profile &amp; Settings</span>
        </button>
      </div>

      {/* Completion Widget if not 100% */}
      {completionPercent < 100 && (
        <div className="p-4 rounded-xl bg-teal-50 border border-teal-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-teal-900">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-teal-700 shrink-0" />
            <span>
              Your profile is <strong>{completionPercent}%</strong> complete. Adding your conditions and daily medicines improves safety warnings.
            </span>
          </div>
          <button
            type="button"
            onClick={openOnboarding}
            className="px-3.5 py-1.5 rounded-lg bg-teal-700 hover:bg-teal-800 text-white font-semibold text-xs shrink-0 transition"
          >
            Complete Setup
          </button>
        </div>
      )}

      {/* Profile Overview Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Saved Medicines */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2 text-xs font-bold text-slate-900">
                <Pill className="w-4 h-4 text-teal-600" />
                <span>My Saved Medicines ({userMeds.length})</span>
              </div>
              <button
                type="button"
                onClick={() => openProfileSettings('medications')}
                className="text-xs text-teal-600 font-semibold hover:underline"
              >
                Manage
              </button>
            </div>

            {userMeds.length === 0 ? (
              <p className="text-xs text-slate-500 italic py-2">
                No medicines saved yet. Add your daily medicines to keep track of them.
              </p>
            ) : (
              <div className="space-y-1.5 py-1">
                {userMeds.slice(0, 4).map((m, idx) => (
                  <div key={idx} className="p-2 rounded-lg bg-slate-50 border border-slate-100 text-xs">
                    <span className="font-semibold text-slate-900">{m.drug_name}</span>
                    <span className="text-slate-500 ml-1.5 text-[11px]">• {m.dosage}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={onNavigateToCheck}
            className="mt-4 w-full py-2 px-3 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-800 text-xs font-semibold transition flex items-center justify-center space-x-1"
          >
            <span>Check Safety for These Medicines</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Card 2: Health Conditions */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2 text-xs font-bold text-slate-900">
                <Activity className="w-4 h-4 text-teal-600" />
                <span>Health Conditions ({userConds.length})</span>
              </div>
              <button
                type="button"
                onClick={() => openProfileSettings('health')}
                className="text-xs text-teal-600 font-semibold hover:underline"
              >
                Manage
              </button>
            </div>

            {userConds.length === 0 ? (
              <p className="text-xs text-slate-500 italic py-2">
                No health conditions recorded. Add any conditions to see custom warnings.
              </p>
            ) : (
              <div className="flex flex-wrap gap-1.5 py-1">
                {userConds.map((c) => (
                  <span
                    key={c}
                    className="px-2.5 py-1 rounded-lg bg-teal-50 border border-teal-200 text-teal-900 text-xs font-medium"
                  >
                    {c}
                  </span>
                ))}
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => openProfileSettings('health')}
            className="mt-4 w-full py-2 px-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition"
          >
            Update Conditions
          </button>
        </div>

        {/* Card 3: Emergency Contacts */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2 text-xs font-bold text-slate-900">
                <HeartPulse className="w-4 h-4 text-teal-600" />
                <span>Emergency Contacts ({userContacts.length})</span>
              </div>
              <button
                type="button"
                onClick={() => openProfileSettings('emergency')}
                className="text-xs text-teal-600 font-semibold hover:underline"
              >
                Manage
              </button>
            </div>

            {userContacts.length === 0 ? (
              <p className="text-xs text-slate-500 italic py-2">
                No emergency contacts listed yet. Add trusted contacts who can be reached if needed.
              </p>
            ) : (
              <div className="space-y-1.5 py-1">
                {userContacts.map((c, idx) => (
                  <div key={idx} className="p-2 rounded-lg bg-slate-50 border border-slate-100 text-xs flex justify-between">
                    <div>
                      <span className="font-semibold text-slate-900">{c.name}</span>
                      <span className="text-slate-500 ml-1 text-[11px]">({c.relationship})</span>
                    </div>
                    <span className="text-slate-600 text-[11px]">{c.phone}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => openProfileSettings('emergency')}
            className="mt-4 w-full py-2 px-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition"
          >
            Add or Edit Contacts
          </button>
        </div>
      </div>
    </div>
  );
};
