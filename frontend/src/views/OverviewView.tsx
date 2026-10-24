import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  getUserHistory,
  type HistoryRecord,
  type InteractionCheckResponse,
} from '../services/api';
import {
  ShieldCheck,
  Activity,
  Pill,
  HeartPulse,
  ArrowRight,
  AlertTriangle,
  Clock,
  ExternalLink,
  PlusCircle,
  FileCheck2,
  CheckCircle2,
  Search,
  Keyboard,
  ShieldAlert,
  Stethoscope,
} from 'lucide-react';

interface OverviewViewProps {
  onNavigate: (path: string) => void;
  onPrefillAndCheck?: () => void;
  onSelectHistoryResult?: (result: InteractionCheckResponse) => void;
}

export const OverviewView: React.FC<OverviewViewProps> = ({
  onNavigate,
  onPrefillAndCheck,
  onSelectHistoryResult,
}) => {
  const { user, profile, isAuthenticated, openOnboarding, openProfileSettings } = useAuth();
  const [historyRecords, setHistoryRecords] = useState<HistoryRecord[]>([]);

  useEffect(() => {
    if (isAuthenticated) {
      getUserHistory()
        .then((records) => setHistoryRecords(records.slice(0, 5)))
        .catch(() => setHistoryRecords([]));
    }
  }, [isAuthenticated]);

  const scrollToHowItWorks = () => {
    const el = document.getElementById('how-it-works');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const getFirstName = () => {
    if (!user?.full_name) return 'Friend';
    const parts = user.full_name.trim().split(' ');
    if ((parts[0] === 'Dr.' || parts[0] === 'Dr') && parts.length > 1) {
      return `Dr. ${parts[1]}`;
    }
    return parts[0];
  };

  const getTimeGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const completionPercent = profile?.profile_completion_percentage ?? 0;
  const userMeds = profile?.medications || [];
  const userConds = profile?.conditions || [];
  const userContacts = profile?.emergency_contacts || [];

  const architectureSteps = [
    {
      num: '01',
      title: 'Enter Your Medicines',
      desc: 'Type the names of your medicines and any health condition you have (such as High Blood Pressure or Diabetes).',
      icon: Keyboard,
    },
    {
      num: '02',
      title: 'Find Exact Matches',
      desc: 'Matches brand names and generic names automatically (for example, Advil connects to Ibuprofen).',
      icon: CheckCircle2,
    },
    {
      num: '03',
      title: 'Check for Clashes',
      desc: 'Compares each pair of medicines against more than 192,000 verified medical safety records.',
      icon: Search,
    },
    {
      num: '04',
      title: 'Measure Risk Levels',
      desc: 'Shows clearly if a combination is High Risk, Moderate Risk, or Low Risk so you know what to watch out for.',
      icon: ShieldAlert,
    },
    {
      num: '05',
      title: 'Simple, Helpful Advice',
      desc: 'Gives you easy-to-read explanations, food and timing tips, and safer alternatives to discuss with your doctor.',
      icon: Stethoscope,
    },
  ];

  return (
    <div className="flex flex-col w-full space-y-12 animate-fadeIn">
      {/* ============================================================ */}
      {/* PERSONALIZED DASHBOARD BANNER (When User is Logged In) */}
      {/* ============================================================ */}
      {isAuthenticated && user && (
        <div className="space-y-6">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-teal-900 to-slate-900 text-white p-6 sm:p-8 shadow-xl border border-teal-800/40">
            <div className="pointer-events-none absolute -right-16 -top-16 w-64 h-64 bg-teal-500/10 rounded-full blur-2xl" />

            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2">
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight font-title-lg text-white">
                  {getTimeGreeting()}, {getFirstName()}
                </h1>
                <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
                  We are keeping an eye on your {userMeds.length} saved medicines and {userConds.length} health conditions across 192,000+ scientific safety checks.
                </p>
              </div>

              {/* Profile Progress Widget */}
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 shrink-0 min-w-[240px]">
                <div className="flex items-center justify-between text-xs font-semibold mb-2 text-white">
                  <span>Profile Progress</span>
                  <span className="text-sm font-bold text-teal-300">{completionPercent}%</span>
                </div>
                <div className="w-full h-2.5 bg-black/40 rounded-full overflow-hidden mb-3">
                  <div
                    className="h-full bg-teal-400 rounded-full transition-all duration-500 shadow-sm"
                    style={{ width: `${completionPercent}%` }}
                  />
                </div>
                {completionPercent < 100 ? (
                  <button
                    onClick={openOnboarding}
                    className="w-full py-1.5 px-3 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-bold transition shadow-sm flex items-center justify-center space-x-1"
                  >
                    <span>Complete Your Health Profile</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                ) : (
                  <div className="flex items-center space-x-1.5 text-[11px] text-teal-300">
                    <FileCheck2 className="w-3.5 h-3.5" />
                    <span>Your health profile is fully set up</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Medicines & Health Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Medications Card */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2 text-xs font-bold text-slate-900">
                    <div className="w-7 h-7 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center">
                      <Pill className="w-4 h-4" />
                    </div>
                    <span>My Daily Medicines ({userMeds.length})</span>
                  </div>
                  <button
                    onClick={() => openProfileSettings('medications')}
                    className="text-xs text-teal-600 font-semibold hover:underline flex items-center space-x-0.5"
                  >
                    <span>Manage</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>

                {userMeds.length === 0 ? (
                  <div className="p-4 rounded-xl bg-slate-50 border border-dashed border-slate-200 text-center text-xs text-slate-500 my-2">
                    No medicines saved yet. Add your medicines to check if they are safe together.
                  </div>
                ) : (
                  <div className="space-y-2 my-2">
                    {userMeds.slice(0, 3).map((m, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs flex justify-between items-center"
                      >
                        <span className="font-bold text-slate-900">{m.drug_name}</span>
                        <span className="text-[11px] text-slate-500 font-medium">{m.dosage}</span>
                      </div>
                    ))}
                    {userMeds.length > 3 && (
                      <div className="text-center text-[11px] text-slate-500 pt-1 font-medium">
                        + {userMeds.length - 3} more medicines
                      </div>
                    )}
                  </div>
                )}
              </div>

              <button
                onClick={() => openProfileSettings('medications')}
                className="mt-3 w-full py-1.5 px-3 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition flex items-center justify-center space-x-1"
              >
                <PlusCircle className="w-3.5 h-3.5 text-teal-600" />
                <span>Add Medicine</span>
              </button>
            </div>

            {/* Conditions Card */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2 text-xs font-bold text-slate-900">
                    <div className="w-7 h-7 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center">
                      <Activity className="w-4 h-4" />
                    </div>
                    <span>My Health Conditions ({userConds.length})</span>
                  </div>
                  <button
                    onClick={() => openProfileSettings('health')}
                    className="text-xs text-teal-600 font-semibold hover:underline flex items-center space-x-0.5"
                  >
                    <span>Manage</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>

                {userConds.length === 0 ? (
                  <div className="p-4 rounded-xl bg-slate-50 border border-dashed border-slate-200 text-center text-xs text-slate-500 my-2">
                    No health conditions added yet. Add conditions (like High Blood Pressure or Asthma) to see important warnings.
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-1.5 my-2">
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
                onClick={() => openProfileSettings('health')}
                className="mt-3 w-full py-1.5 px-3 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition flex items-center justify-center space-x-1"
              >
                <PlusCircle className="w-3.5 h-3.5 text-teal-600" />
                <span>Update Health Conditions</span>
              </button>
            </div>

            {/* Emergency Contacts Card */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2 text-xs font-bold text-slate-900">
                    <div className="w-7 h-7 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center">
                      <HeartPulse className="w-4 h-4" />
                    </div>
                    <span>Emergency Contacts ({userContacts.length})</span>
                  </div>
                  <button
                    onClick={() => openProfileSettings('emergency')}
                    className="text-xs text-teal-600 font-semibold hover:underline flex items-center space-x-0.5"
                  >
                    <span>Manage</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>

                {userContacts.length === 0 ? (
                  <div className="p-4 rounded-xl bg-slate-50 border border-dashed border-slate-200 text-center text-xs text-slate-500 my-2">
                    No emergency contact added yet.
                  </div>
                ) : (
                  <div className="space-y-2 my-2">
                    {userContacts.map((c, i) => (
                      <div
                        key={i}
                        className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs flex justify-between items-center"
                      >
                        <div>
                          <div className="font-bold text-slate-900">{c.name}</div>
                          <div className="text-[10px] text-slate-500">{c.relationship}</div>
                        </div>
                        <span className="text-[11px] text-slate-600 font-medium">{c.phone}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <button
                onClick={() => openProfileSettings('emergency')}
                className="mt-3 w-full py-1.5 px-3 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition flex items-center justify-center space-x-1"
              >
                <PlusCircle className="w-3.5 h-3.5 text-teal-600" />
                <span>Add Contact</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* SECTION A — HERO / LANDING SECTION (Screenshot Reference A) */}
      {/* ============================================================ */}
      <section className="pt-2 pb-6 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Headlines, Copy, CTAs, Information Strip */}
          <div className="lg:col-span-7 flex flex-col items-start pr-0 lg:pr-4">
            {/* Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-heading text-slate-900 tracking-tight leading-[1.15] mb-5">
              Check if your medicines are safe to take together{' '}
              <span className="text-teal-600">in plain, simple English.</span>
            </h1>

            {/* Description */}
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed mb-8 max-w-2xl font-normal">
              Taking more than one medicine at a time can sometimes cause unwanted side effects or stop a medicine from working properly. MediGuard AI checks your medicines against each other and your health conditions, giving you clear warnings and easy-to-follow advice in plain English.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3.5 mb-10 w-full sm:w-auto">
              <button
                onClick={onPrefillAndCheck ? onPrefillAndCheck : () => onNavigate('checker')}
                className="inline-flex items-center justify-center space-x-2 px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer"
              >
                <span>Check My Medicines Now</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={scrollToHowItWorks}
                className="inline-flex items-center justify-center space-x-2 px-6 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-semibold text-sm border border-slate-300 shadow-2xs transition-all duration-200 cursor-pointer"
              >
                <span>See How It Works</span>
              </button>
            </div>

            {/* Information Strip Below Hero */}
            <div className="flex flex-wrap items-center gap-y-3 gap-x-6 pt-5 border-t border-slate-200 w-full text-xs font-semibold text-slate-700">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-teal-600" />
                <span>Checks Your Health Conditions</span>
              </div>
              <span className="hidden sm:inline text-slate-300">•</span>
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-teal-600" />
                <span>Easy Risk Levels (High, Medium, Low)</span>
              </div>
              <span className="hidden sm:inline text-slate-300">•</span>
              <div className="flex items-center space-x-2">
                <FileCheck2 className="w-4 h-4 text-teal-600" />
                <span>Clear, Step-by-Step Advice</span>
              </div>
            </div>
          </div>

          {/* Right Column: Polished Clinical Card with Illustration Frame */}
          <div className="lg:col-span-5 relative mt-4 lg:mt-0">
            <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden transition-all duration-200 hover:shadow-2xl">
              {/* Card Top Window Bar */}
              <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex items-center justify-between">
                <div className="flex items-center space-x-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                </div>
                <span className="text-xs font-bold text-slate-700 font-heading">
                  How Your Medicines Are Checked
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-teal-50 text-teal-700 border border-teal-200 uppercase tracking-wide">
                  192,000+ Safety Records
                </span>
              </div>

              {/* Illustration Frame */}
              <div className="p-4 sm:p-6 bg-slate-50/50 flex items-center justify-center">
                <img
                  src="/hero-visual.png"
                  alt="MediGuard AI safety check diagram showing medicine protection shield"
                  className="w-full max-h-[380px] object-contain rounded-xl shadow-2xs"
                  loading="eager"
                />
              </div>

              {/* Card Footer with Metrics */}
              <div className="px-5 py-3.5 bg-white border-t border-slate-200 grid grid-cols-2 gap-4">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                    Safety Database
                  </span>
                  <span className="text-xs font-bold text-slate-900">
                    192,000+ Verified Medicine Checks
                  </span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                    Common Health Conditions
                  </span>
                  <span className="text-xs font-bold text-slate-900">
                    High BP, Diabetes, Dengue, Fever
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* SECTION B — HOW MEDIGUARD AI OPERATES (Screenshot Reference B) */}
      {/* ============================================================ */}
      <section id="how-it-works" className="py-12 px-6 sm:px-8 bg-slate-50/80 rounded-3xl border border-slate-200 w-full scroll-mt-24">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-teal-700 mb-2 block">
            How It Works
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold font-heading text-slate-900 tracking-tight mb-3">
            How MediGuard AI Keeps You Safe
          </h2>
          <p className="text-base text-slate-600 leading-relaxed font-normal">
            MediGuard checks your medicines in 5 simple steps to help you stay safe and informed.
          </p>
        </div>

        {/* 5-Step Process Pipeline Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 lg:gap-5 relative">
          {architectureSteps.map((stepItem, idx) => {
            const IconComponent = stepItem.icon;
            return (
              <div
                key={stepItem.num}
                className="relative bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:shadow-md hover:border-teal-400 transition-all duration-200 flex flex-col justify-between group"
              >
                <div>
                  {/* Step Badge */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-extrabold font-mono text-teal-700 bg-teal-50 border border-teal-200 px-2 py-0.5 rounded-md">
                      {stepItem.num}
                    </span>
                    <div className="w-8 h-8 rounded-xl bg-slate-50 group-hover:bg-teal-50 text-slate-600 group-hover:text-teal-700 flex items-center justify-center transition-colors">
                      <IconComponent className="w-4 h-4" />
                    </div>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-sm font-bold text-slate-900 mb-2 font-heading leading-snug">
                    {stepItem.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed font-normal">
                    {stepItem.desc}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center text-[11px] font-semibold text-teal-600">
                  <span>Step {idx + 1} of 5</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Clinical Transparency Safeguard Note */}
        <div className="mt-8 p-4 rounded-xl bg-white border border-slate-200/80 flex items-start space-x-3 text-xs text-slate-700 max-w-4xl mx-auto shadow-2xs">
          <AlertTriangle className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <span className="font-bold text-slate-900">How we protect you:</span>{' '}
            MediGuard AI checks your medicines against a verified library of 192,000+ medical research records. If a pair is not already recorded, our smart AI analyzes how the medicines work to estimate possible risks. We always show you whether an alert comes from established medical research or our smart AI estimate.
          </div>
        </div>
      </section>

      {/* Recent History Table for Authenticated Users */}
      {isAuthenticated && historyRecords.length > 0 && (
        <section className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-teal-600" />
              <h3 className="text-sm font-bold text-slate-900 font-heading">
                Recent Medicine Safety Checks
              </h3>
            </div>
            <button
              onClick={() => onNavigate('history')}
              className="text-xs text-teal-600 font-semibold hover:underline"
            >
              View Past Checks
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {historyRecords.map((rec) => {
              const hasCrit = rec.summary?.has_critical_interaction;
              return (
                <div
                  key={rec.id}
                  className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-slate-50 px-2 rounded-xl transition"
                >
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-bold text-slate-900">
                        {rec.medications.join(' + ')}
                      </span>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                          hasCrit
                            ? 'bg-red-50 text-red-700 border border-red-200'
                            : 'bg-teal-50 text-teal-700 border border-teal-200'
                        }`}
                      >
                        {hasCrit ? 'Warning Found' : 'Looks Safe'}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      {new Date(rec.created_at).toLocaleString()} • {rec.summary?.total_pairs_evaluated || 0} pairs checked
                    </div>
                  </div>

                  {onSelectHistoryResult && (
                    <button
                      onClick={() =>
                        onSelectHistoryResult({
                          summary: rec.summary,
                          interactions: rec.results,
                          condition_alerts: [],
                          disclaimer: 'Empirical DeepDDI review.',
                        })
                      }
                      className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-800 rounded-lg transition"
                    >
                      View Safety Report
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
};
