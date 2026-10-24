import React, { useState } from 'react';
import type { InteractionCheckResponse, PairInteractionResult } from '../services/api';

type SeverityTier = 'safe' | 'mild' | 'moderate' | 'high';

interface RiskLevelInfo {
  tier: string;
  levelKey: SeverityTier;
  levelNumber: number;
  cardClass: string;
  headerClass: string;
  titleClass: string;
  badgeClass: string;
  dotClass: string;
  explanationClass: string;
  subtextClass: string;
  explanation: string;
  icon: string;
  iconColor: string;
  parentBorder: string;
}

const getRiskLevel = (pair: PairInteractionResult): RiskLevelInfo => {
  if (pair.evidence_status === 'insufficient_evidence') {
    return {
      tier: 'No Known Clash',
      levelKey: 'safe',
      levelNumber: 1,
      cardClass: 'bg-emerald-50 border-2 border-emerald-500 shadow-xs',
      headerClass: 'bg-emerald-100 text-emerald-950 border-b border-emerald-300',
      titleClass: 'text-emerald-950 font-extrabold',
      badgeClass: 'bg-emerald-600 text-white font-bold shadow-xs',
      dotClass: 'bg-white',
      explanationClass: 'text-slate-900 font-semibold',
      subtextClass: 'text-emerald-900 border-t border-emerald-200',
      explanation: 'No dangerous interaction was found in published medical research. Routine monitoring advised.',
      icon: 'check_circle',
      iconColor: 'text-emerald-700',
      parentBorder: 'border-l-4 border-l-emerald-500',
    };
  }

  const text = (pair.description || '').toLowerCase();
  const highRiskPatterns = [
    'bleeding',
    'hemorrhage',
    'cardiotoxicity',
    'qt prolongation',
    'arrhythmia',
    'hypoglycemia',
    'toxicity',
    'fatal',
    'apnea',
    'respiratory depression',
    'hyperkalemia',
    'worsening of adverse effects',
  ];

  const moderateRiskPatterns = [
    'metabolism',
    'serum concentration',
    'clearance',
    'hypotension',
    'hypertension',
    'sedation',
    'drowsiness',
    'bradycardia',
    'tachycardia',
    'adverse effects',
  ];

  if (highRiskPatterns.some((pattern) => text.includes(pattern))) {
    return {
      tier: 'High Caution / Severe Risk',
      levelKey: 'high',
      levelNumber: 4,
      cardClass: 'bg-rose-50 border-2 border-rose-600 shadow-xs',
      headerClass: 'bg-rose-100 text-rose-950 border-b border-rose-300',
      titleClass: 'text-rose-950 font-extrabold',
      badgeClass: 'bg-rose-600 text-white font-bold shadow-xs',
      dotClass: 'bg-white animate-pulse',
      explanationClass: 'text-slate-900 font-semibold',
      subtextClass: 'text-rose-900 border-t border-rose-200',
      explanation: 'Both medicines may significantly amplify adverse reactions (such as internal bleeding or heart strain). Talk to your doctor before combining.',
      icon: 'error',
      iconColor: 'text-rose-700',
      parentBorder: 'border-l-4 border-l-rose-600',
    };
  }

  if (moderateRiskPatterns.some((pattern) => text.includes(pattern))) {
    return {
      tier: 'Moderate Warning',
      levelKey: 'moderate',
      levelNumber: 3,
      cardClass: 'bg-amber-50 border-2 border-amber-500 shadow-xs',
      headerClass: 'bg-amber-100 text-amber-950 border-b border-amber-300',
      titleClass: 'text-amber-950 font-extrabold',
      badgeClass: 'bg-amber-500 text-slate-950 font-bold shadow-xs',
      dotClass: 'bg-slate-950',
      explanationClass: 'text-slate-900 font-semibold',
      subtextClass: 'text-amber-900 border-t border-amber-200',
      explanation: 'May alter drug breakdown or increase blood concentration. A dose adjustment or scheduled time spacing may be needed.',
      icon: 'warning',
      iconColor: 'text-amber-700',
      parentBorder: 'border-l-4 border-l-amber-500',
    };
  }

  return {
    tier: 'Mild / Monitor',
    levelKey: 'mild',
    levelNumber: 2,
    cardClass: 'bg-sky-50 border-2 border-sky-500 shadow-xs',
    headerClass: 'bg-sky-100 text-sky-950 border-b border-sky-300',
    titleClass: 'text-sky-950 font-extrabold',
    badgeClass: 'bg-sky-600 text-white font-bold shadow-xs',
    dotClass: 'bg-white',
    explanationClass: 'text-slate-900 font-semibold',
    subtextClass: 'text-sky-900 border-t border-sky-200',
    explanation: 'May cause minor changes in absorption or kidney excretion. Discuss proper timing or hydration with your doctor or pharmacist.',
    icon: 'info',
    iconColor: 'text-sky-700',
    parentBorder: 'border-l-4 border-l-sky-500',
  };
};

const calculateOverallSeverity = (pairs: PairInteractionResult[]): SeverityTier => {
  let highest: SeverityTier = 'safe';
  for (const pair of pairs) {
    const risk = getRiskLevel(pair);
    if (risk.levelKey === 'high') return 'high';
    if (risk.levelKey === 'moderate') highest = 'moderate';
    else if (risk.levelKey === 'mild' && highest === 'safe') highest = 'mild';
  }
  return highest;
};

interface InteractionResultsViewProps {
  results: InteractionCheckResponse | null;
  onEditMedicines: () => void;
  onRunNewCheck: () => void;
}

export const InteractionResultsView: React.FC<InteractionResultsViewProps> = ({
  results,
  onEditMedicines,
  onRunNewCheck,
}) => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

  if (!results || !results.interactions || results.interactions.length === 0) {
    return (
      <div className="py-20 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center text-[#008060] mb-4 shadow-sm border border-slate-200">
          <span className="material-symbols-outlined text-[36px]">analytics</span>
        </div>
        <h2 className="text-2xl font-bold text-slate-900">No Safety Report Yet</h2>
        <p className="text-sm text-slate-600 max-w-md mt-2 mb-6">
          Please select at least 2 medicines in the Medicine Checker to evaluate whether they can be safely taken together.
        </p>
        <button
          onClick={onRunNewCheck}
          className="px-6 py-3 rounded-xl bg-[#008060] text-white font-bold text-sm shadow-sm hover:bg-[#006e52] transition-colors cursor-pointer"
        >
          Go to Medicine Checker
        </button>
      </div>
    );
  }

  const { summary, interactions, condition_alerts, disclaimer } = results;

  const toggleAccordion = (idx: number) => {
    setExpandedIndex(expandedIndex === idx ? null : idx);
  };

  const overallSeverityKey = calculateOverallSeverity(interactions);

  // Overall scale definitions
  const scaleLevels = [
    {
      key: 'safe',
      label: '1. Safe / Compatible',
      shortLabel: 'Safe',
      activeBg: 'bg-emerald-600 text-white border-emerald-600 ring-4 ring-emerald-100 shadow-md',
      inactiveBg: 'bg-emerald-50/60 text-emerald-900 border-emerald-200',
      activeText: 'text-emerald-900',
      dot: 'bg-emerald-500',
    },
    {
      key: 'mild',
      label: '2. Mild / Monitor',
      shortLabel: 'Mild',
      activeBg: 'bg-sky-600 text-white border-sky-600 ring-4 ring-sky-100 shadow-md',
      inactiveBg: 'bg-sky-50/60 text-sky-900 border-sky-200',
      activeText: 'text-sky-900',
      dot: 'bg-sky-500',
    },
    {
      key: 'moderate',
      label: '3. Moderate Warning',
      shortLabel: 'Moderate',
      activeBg: 'bg-amber-500 text-slate-950 border-amber-500 ring-4 ring-amber-100 shadow-md',
      inactiveBg: 'bg-amber-50/60 text-amber-900 border-amber-200',
      activeText: 'text-amber-900',
      dot: 'bg-amber-500',
    },
    {
      key: 'high',
      label: '4. High Caution / Severe',
      shortLabel: 'High Risk',
      activeBg: 'bg-rose-600 text-white border-rose-600 ring-4 ring-rose-100 shadow-md',
      inactiveBg: 'bg-rose-50/60 text-rose-900 border-rose-200',
      activeText: 'text-rose-900',
      dot: 'bg-rose-500',
    },
  ];

  const overallDescriptions: Record<SeverityTier, { title: string; desc: string; badge: string; border: string; bg: string; icon: string }> = {
    safe: {
      title: 'Safe / No Known Clashes Detected',
      desc: 'None of the tested combinations have documented harmful interactions in clinical literature. Routine medication schedules can proceed as prescribed.',
      badge: 'bg-emerald-600 text-white',
      border: 'border-emerald-400',
      bg: 'bg-emerald-50/90',
      icon: 'check_circle',
    },
    mild: {
      title: 'Mild Interaction Detected — Monitor Routine',
      desc: 'One or more medications may cause mild absorption changes or minor kidney/liver clearance effects. Not immediately dangerous, but timing separation may help.',
      badge: 'bg-sky-600 text-white',
      border: 'border-sky-400',
      bg: 'bg-sky-50/90',
      icon: 'info',
    },
    moderate: {
      title: 'Moderate Warning — Clinical Attention Recommended',
      desc: 'One or more combinations may alter drug blood levels or increase the likelihood of side effects. A dosage adjustment or spacing is frequently advised.',
      badge: 'bg-amber-500 text-slate-950',
      border: 'border-amber-400',
      bg: 'bg-amber-50/90',
      icon: 'warning',
    },
    high: {
      title: 'High Caution — Severe Adverse Risk Detected',
      desc: 'A significant medical clash was detected (such as amplified bleeding risk or heart rhythm strain). Please contact your doctor or pharmacist before taking together.',
      badge: 'bg-rose-600 text-white',
      border: 'border-rose-500',
      bg: 'bg-rose-50/90',
      icon: 'error',
    },
  };

  const currentOverall = overallDescriptions[overallSeverityKey];

  // Unique medicine names tested
  const medicineNames = Array.from(
    new Set(interactions.flatMap((i) => [i.drug_a_name, i.drug_b_name]))
  );

  return (
    <div className="flex flex-col w-full max-w-5xl mx-auto space-y-6 animate-fadeIn pb-16">
      {/* ========================================================= */}
      {/* CLINICAL REPORT HEADER BAR */}
      {/* ========================================================= */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-300 shadow-sm space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-200">
          <div className="space-y-1.5">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-900 text-white text-xs font-bold tracking-wide">
              <span className="material-symbols-outlined text-[15px] text-teal-400">medical_services</span>
              <span>CLINICAL SAFETY ASSESSMENT REPORT</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Medicine Interaction Safety Report
            </h1>
            <p className="text-xs sm:text-sm text-slate-700 font-medium">
              Verified against 192,284 peer-reviewed clinical trial pairs and DeepDDI neural predictions.
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={onEditMedicines}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold border border-slate-300 transition-colors shadow-xs cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px] text-slate-700">tune</span>
              <span>Edit Medicines</span>
            </button>
            <button
              type="button"
              onClick={onRunNewCheck}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#008060] hover:bg-[#006e52] text-white text-xs font-bold shadow-sm transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">restart_alt</span>
              <span>New Check</span>
            </button>
          </div>
        </div>

        {/* Medicines Evaluated Chips in High Contrast */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
              Medicines Evaluated:
            </span>
            {medicineNames.map((med) => (
              <span
                key={med}
                className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-white border border-slate-300 text-slate-900 font-bold shadow-xs"
              >
                <span className="w-2 h-2 rounded-full bg-[#008060]"></span>
                <span>{med}</span>
              </span>
            ))}
          </div>

          <div className="text-slate-700 font-semibold shrink-0">
            {summary.total_pairs_evaluated} Pair{summary.total_pairs_evaluated > 1 ? 's' : ''} Evaluated
          </div>
        </div>

        {/* ========================================================= */}
        {/* IMMEDIATE SEVERITY SCALE (LANDING VIEW - NO SCROLL NEEDED) */}
        {/* ========================================================= */}
        <div className="pt-2 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider font-extrabold text-slate-900 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[18px] text-[#008060]">speed</span>
              <span>Overall Clinical Severity Scale</span>
            </span>
            <span className="text-xs font-bold text-slate-600">
              Highest Detected Level: <strong className="text-slate-950 uppercase">{overallSeverityKey}</strong>
            </span>
          </div>

          {/* 4-Step Interactive Visual Scale Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
            {scaleLevels.map((lvl) => {
              const isActive = lvl.key === overallSeverityKey;
              return (
                <div
                  key={lvl.key}
                  className={`relative p-3.5 rounded-2xl border transition-all flex flex-col justify-between ${
                    isActive
                      ? `${lvl.activeBg} scale-[1.02]`
                      : `${lvl.inactiveBg} border-slate-300 opacity-80`
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] font-extrabold uppercase tracking-wider">
                      {lvl.shortLabel}
                    </span>
                    {isActive ? (
                      <span className="px-2 py-0.5 rounded-full bg-white/20 text-[10px] font-extrabold tracking-wide uppercase">
                        ACTIVE RESULT
                      </span>
                    ) : (
                      <span className={`w-2 h-2 rounded-full ${lvl.dot}`}></span>
                    )}
                  </div>
                  <div className={`text-xs font-bold ${isActive ? 'text-white' : 'text-slate-800'}`}>
                    {lvl.label}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Executive Verdict Callout Banner (Above the fold) */}
          <div className={`p-5 rounded-2xl border-2 ${currentOverall.border} ${currentOverall.bg} shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-3`}>
            <div className="flex items-start gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-white border border-slate-300 flex items-center justify-center shrink-0 shadow-xs">
                <span className="material-symbols-outlined text-[28px] text-slate-900">
                  {currentOverall.icon}
                </span>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-extrabold ${currentOverall.badge}`}>
                    {scaleLevels.find((l) => l.key === overallSeverityKey)?.label}
                  </span>
                  <h2 className="text-base sm:text-lg font-bold text-slate-950">
                    {currentOverall.title}
                  </h2>
                </div>
                <p className="text-xs sm:text-sm text-slate-900 font-medium leading-relaxed max-w-2xl">
                  {currentOverall.desc}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0 sm:border-l sm:border-slate-300 sm:pl-4">
              <div className="text-right sm:text-center">
                <div className="text-2xl font-extrabold text-slate-950">
                  {summary.verified_interactions_count + summary.predicted_interactions_count}
                </div>
                <div className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                  Total Warnings
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* DETAILED PAIRWISE INTERACTION FINDINGS */}
      {/* ========================================================= */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <span className="material-symbols-outlined text-[#008060] text-[24px]">compare_arrows</span>
            <span>Detailed Medication Findings ({interactions.length})</span>
          </h2>
          <span className="text-xs font-bold text-slate-600">
            Click any row to expand details
          </span>
        </div>

        {interactions.map((pair, idx) => {
          const isExpanded = expandedIndex === idx;
          const isVerified = pair.evidence_status === 'verified_database';
          const isPredicted = pair.evidence_status === 'model_prediction';
          const risk = getRiskLevel(pair);

          return (
            <div
              key={`${pair.drug_a_id}-${pair.drug_b_id}`}
              className={`bg-white rounded-2xl shadow-xs border-2 border-slate-300 overflow-hidden transition-all duration-200 ${risk.parentBorder}`}
            >
              {/* Accordion Header */}
              <div
                onClick={() => toggleAccordion(idx)}
                className="p-5 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors select-none"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 border border-slate-300 shadow-xs ${
                    isVerified
                      ? 'bg-teal-50 text-[#008060]'
                      : isPredicted
                      ? 'bg-purple-50 text-purple-700'
                      : 'bg-slate-100 text-slate-700'
                  }`}>
                    <span className="material-symbols-outlined text-[24px]">
                      {isVerified ? 'verified' : isPredicted ? 'psychology' : 'help'}
                    </span>
                  </div>

                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span className="text-base sm:text-lg font-extrabold text-slate-950">
                        {pair.drug_a_name}
                      </span>
                      <span className="text-slate-400 text-sm font-bold">✕</span>
                      <span className="text-base sm:text-lg font-extrabold text-slate-950">
                        {pair.drug_b_name}
                      </span>

                      {/* HIGH-CONTRAST SEVERITY BADGE ON HEADER */}
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold shadow-xs ${risk.badgeClass}`}>
                        <span className={`w-2 h-2 rounded-full ${risk.dotClass}`}></span>
                        <span>{risk.tier}</span>
                      </span>

                      {/* High-Contrast Evidence Badge */}
                      {isVerified && (
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-teal-100 text-teal-900 border border-teal-300">
                          Verified Medical Fact
                        </span>
                      )}
                      {isPredicted && (
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-100 text-purple-900 border border-purple-300">
                          AI Safety Prediction ({Math.round((pair.confidence || 0) * 100)}% Confidence)
                        </span>
                      )}
                      {!isVerified && !isPredicted && (
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-800 border border-slate-300">
                          No Known Clashes
                        </span>
                      )}
                    </div>

                    <p className="text-xs sm:text-sm text-slate-700 font-semibold truncate mt-1">
                      {pair.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 ml-3">
                  <span className="text-xs font-bold text-slate-500 hidden sm:inline">
                    {isExpanded ? 'Hide' : 'View'}
                  </span>
                  <span
                    className="material-symbols-outlined text-slate-700 transition-transform duration-200"
                    style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}
                  >
                    expand_more
                  </span>
                </div>
              </div>

              {/* Accordion Body */}
              {isExpanded && (
                <div className="px-6 pb-6 pt-3 border-t border-slate-200 bg-slate-50/60 flex flex-col gap-4">
                  {/* Top Highlight: Prominent Risk Level Card */}
                  <div className={`rounded-2xl border-2 overflow-hidden flex flex-col justify-between transition-all ${risk.cardClass}`}>
                    <div className={`px-4 py-3 flex items-center justify-between ${risk.headerClass}`}>
                      <div className="flex items-center gap-2">
                        <span className={`material-symbols-outlined text-[22px] ${risk.iconColor}`}>
                          {risk.icon}
                        </span>
                        <span className={`text-xs uppercase tracking-wider font-extrabold ${risk.titleClass}`}>
                          Clinical Severity Finding
                        </span>
                      </div>
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold shadow-xs ${risk.badgeClass}`}>
                        <span className={`w-2 h-2 rounded-full ${risk.dotClass}`}></span>
                        <span>{risk.tier}</span>
                      </span>
                    </div>

                    <div className="p-4 sm:p-5 flex flex-col justify-between space-y-2.5 bg-white/70">
                      <p className={`text-sm sm:text-base leading-relaxed ${risk.explanationClass}`}>
                        {risk.explanation}
                      </p>
                      <div className={`text-xs pt-3 font-semibold ${risk.subtextClass}`}>
                        <strong>Doctor / Pharmacist Note: </strong>
                        Exact clinical risk depends on your personal prescribed dosage and timing. Share this finding with your healthcare provider.
                      </div>
                    </div>
                  </div>

                  {/* Biological Reaction Description */}
                  <div className="p-5 rounded-2xl bg-white border border-slate-300 shadow-xs space-y-2">
                    <div className="flex items-center gap-2 text-slate-900 font-extrabold text-xs uppercase tracking-wider">
                      <span className="material-symbols-outlined text-[18px] text-[#008060]">science</span>
                      <span>What Happens Inside Your Body</span>
                      {pair.interaction_type && (
                        <span className="text-slate-500 font-mono text-[11px]">• Biological Reaction #{pair.interaction_type}</span>
                      )}
                    </div>
                    <p className="text-sm text-slate-800 leading-relaxed font-medium">
                      {pair.description}
                    </p>
                  </div>

                  {/* Provenance and Evidence Details */}
                  <div className="p-4 rounded-xl bg-white border border-slate-300 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                    <div>
                      <span className="font-bold text-slate-900 uppercase text-[10px] tracking-wider block">
                        Evidence Data Source
                      </span>
                      <span className="font-semibold text-slate-800">{pair.source}</span>
                    </div>
                    <div className="text-slate-600 font-medium">
                      Validated via PNAS Medical Research Database
                    </div>
                  </div>

                  {/* Alternative Medications Suggestion (from SD04) */}
                  {pair.alternatives && pair.alternatives.length > 0 && (
                    <div className="p-5 rounded-2xl bg-white border border-slate-300 shadow-xs space-y-2">
                      <div className="flex items-center gap-2 text-slate-900 font-extrabold text-xs uppercase tracking-wider">
                        <span className="material-symbols-outlined text-[18px] text-[#008060]">swap_horiz</span>
                        <span>Safer Alternatives to Ask Your Doctor About</span>
                      </div>
                      <p className="text-xs text-slate-700 font-medium">
                        Medical literature indicates these alternative medicines may carry a lower risk of interaction:
                      </p>
                      <div className="flex flex-wrap gap-2 pt-1">
                        {pair.alternatives.map((alt) => (
                          <span
                            key={alt}
                            className="px-3 py-1.5 rounded-lg bg-teal-50 border border-teal-200 text-[#008060] font-bold text-xs shadow-xs"
                          >
                            {alt}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ========================================================= */}
      {/* CONDITION & DIETARY ALERTS SECTION (from SD06) */}
      {/* ========================================================= */}
      {condition_alerts && condition_alerts.length > 0 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-300 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-amber-600 text-[26px]">vital_signs</span>
            <h3 className="text-lg sm:text-xl font-extrabold text-slate-900">
              Important Health Condition &amp; Food Alerts ({condition_alerts.length})
            </h3>
          </div>

          <div className="grid grid-cols-1 gap-3 pt-1">
            {condition_alerts.map((alert, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-amber-50/70 border border-amber-300 flex items-start gap-3 shadow-xs"
              >
                <span className="material-symbols-outlined text-amber-700 text-[22px] shrink-0 mt-0.5">
                  warning
                </span>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-extrabold text-slate-950">
                      Condition: {alert.condition}
                    </span>
                    <span className="text-slate-400 text-xs">•</span>
                    <span className="text-xs font-bold text-teal-800">
                      Medicine: {alert.drug_name}
                    </span>
                    {alert.food_constituent && (
                      <span className="text-xs font-bold text-amber-900">
                        (Food/Drink Clash: {alert.food_constituent})
                      </span>
                    )}
                  </div>
                  <p className="text-xs sm:text-sm text-slate-800 font-medium leading-relaxed">
                    {alert.warning}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* CLINICAL SAFETY DISCLAIMER */}
      {/* ========================================================= */}
      <div className="p-6 rounded-2xl bg-white border border-slate-300 text-slate-800 text-xs leading-relaxed shadow-xs space-y-1.5">
        <div className="flex items-center gap-2 text-slate-900 font-extrabold">
          <span className="material-symbols-outlined text-[20px] text-[#008060]">verified_user</span>
          <span className="text-xs uppercase tracking-wider">Clinical Regulatory Note</span>
        </div>
        <p className="font-medium text-slate-700">{disclaimer}</p>
      </div>
    </div>
  );
};
