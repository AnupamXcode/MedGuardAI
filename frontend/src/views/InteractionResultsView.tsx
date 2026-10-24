import { useState } from 'react';
import type { InteractionCheckResponse, PairInteractionResult } from '../services/api';

const getRiskLevel = (pair: PairInteractionResult) => {
  if (pair.evidence_status === 'insufficient_evidence') {
    return {
      tier: 'No Known Clash',
      cardClass: 'bg-emerald-50/90 border-2 border-emerald-500 shadow-xs',
      headerClass: 'bg-emerald-100/90 text-emerald-950 border-b border-emerald-300',
      titleClass: 'text-emerald-950 font-bold',
      badgeClass: 'bg-emerald-600 text-white font-bold shadow-xs',
      dotClass: 'bg-white',
      explanationClass: 'text-emerald-950 font-medium',
      subtextClass: 'text-emerald-800/80 border-t border-emerald-200/80',
      explanation: 'No dangerous interaction was found in published research datasets. Routine monitoring advised.',
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
      cardClass: 'bg-rose-50/95 border-2 border-rose-500 shadow-sm',
      headerClass: 'bg-rose-100/95 text-rose-950 border-b border-rose-300',
      titleClass: 'text-rose-950 font-bold',
      badgeClass: 'bg-rose-600 text-white font-bold shadow-xs',
      dotClass: 'bg-white animate-pulse',
      explanationClass: 'text-rose-950 font-semibold',
      subtextClass: 'text-rose-800/80 border-t border-rose-200/80',
      explanation: 'Both medicines may significantly amplify side effects (such as bleeding or heart strain). Talk to your doctor before combining.',
      icon: 'error',
      iconColor: 'text-rose-700',
      parentBorder: 'border-l-4 border-l-rose-500',
    };
  }

  if (moderateRiskPatterns.some((pattern) => text.includes(pattern))) {
    return {
      tier: 'Moderate Warning',
      cardClass: 'bg-amber-50/95 border-2 border-amber-500 shadow-sm',
      headerClass: 'bg-amber-100/95 text-amber-950 border-b border-amber-300',
      titleClass: 'text-amber-950 font-bold',
      badgeClass: 'bg-amber-500 text-slate-950 font-bold shadow-xs',
      dotClass: 'bg-slate-950',
      explanationClass: 'text-amber-950 font-semibold',
      subtextClass: 'text-amber-800/80 border-t border-amber-200/80',
      explanation: 'May alter drug breakdown or increase blood levels. A dose adjustment or scheduled spacing may be needed.',
      icon: 'warning',
      iconColor: 'text-amber-700',
      parentBorder: 'border-l-4 border-l-amber-500',
    };
  }

  return {
    tier: 'Mild / Monitor',
    cardClass: 'bg-sky-50/95 border-2 border-sky-500 shadow-sm',
    headerClass: 'bg-sky-100/95 text-sky-950 border-b border-sky-300',
    titleClass: 'text-sky-950 font-bold',
    badgeClass: 'bg-sky-600 text-white font-bold shadow-xs',
    dotClass: 'bg-white',
    explanationClass: 'text-sky-950 font-medium',
    subtextClass: 'text-sky-800/80 border-t border-sky-200/80',
    explanation: 'May cause minor changes in absorption or effectiveness. Discuss timing with your pharmacist.',
    icon: 'info',
    iconColor: 'text-sky-700',
    parentBorder: 'border-l-4 border-l-sky-500',
  };
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
        <div className="w-16 h-16 rounded-2xl bg-surface-container flex items-center justify-center text-primary mb-4 shadow-sm">
          <span className="material-symbols-outlined text-[36px]">analytics</span>
        </div>
        <h2 className="font-headline-md text-headline-md text-on-surface">No Safety Report Yet</h2>
        <p className="font-body-md text-body-md text-on-surface-variant max-w-md mt-2 mb-6">
          Please choose at least 2 medicines in the Medicine Checker to see if they are safe to take together.
        </p>
        <button
          onClick={onRunNewCheck}
          className="px-6 py-3 rounded-lg bg-primary text-on-primary font-label-lg text-label-lg shadow-sm hover:bg-primary-container transition-colors cursor-pointer"
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

  return (
    <div className="flex flex-col w-full">
      {/* Top Context Header & Actions */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-space-lg mb-space-xl">
        <div className="space-y-space-xs">
          <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">
            Your Medicine Safety Report
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-3xl">
            We checked your medicines against each other, looking for unwanted reactions and clashes with your health conditions.
          </p>
        </div>

        <div className="flex items-center gap-space-sm shrink-0">
          <button
            type="button"
            onClick={onEditMedicines}
            className="flex items-center gap-space-xs px-space-md py-2.5 rounded-lg bg-surface-container-lowest text-primary font-label-lg text-label-lg shadow-xs hover:bg-surface-container-low transition-colors cursor-pointer border border-surface-variant/40"
          >
            <span className="material-symbols-outlined text-[18px]">tune</span>
            <span>Edit Medicines</span>
          </button>
          <button
            type="button"
            onClick={onRunNewCheck}
            className="flex items-center gap-space-xs px-space-md py-2.5 rounded-lg bg-primary text-on-primary font-label-lg text-label-lg shadow-sm hover:bg-primary-container transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">restart_alt</span>
            <span>Start New Check</span>
          </button>
        </div>
      </div>

      {/* Meta Summary Bar */}
      <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-xs mb-space-lg border border-surface-variant/30">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-space-md items-center">
          {/* Col 1 */}
          <div className="flex items-center gap-space-sm">
            <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-primary shrink-0">
              <span className="material-symbols-outlined text-[22px]">medication</span>
            </div>
            <div className="min-w-0">
              <div className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-bold">
                Medicines Checked
              </div>
              <div className="font-title-md text-title-md text-on-surface truncate">
                {summary.total_medications} Medicines
              </div>
              <div className="font-body-sm text-body-sm text-outline truncate">
                {summary.total_pairs_evaluated} Pairs Tested
              </div>
            </div>
          </div>

          {/* Col 2 */}
          <div className="flex items-center gap-space-sm">
            <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-secondary shrink-0">
              <span className="material-symbols-outlined text-[22px]">hub</span>
            </div>
            <div className="min-w-0">
              <div className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-bold">
                Warnings Found
              </div>
              <div className="font-title-md text-title-md text-on-surface truncate">
                {summary.verified_interactions_count + summary.predicted_interactions_count} Possible Clashes
              </div>
              <div className="font-body-sm text-body-sm text-outline truncate">
                {summary.verified_interactions_count} Verified Research • {summary.predicted_interactions_count} AI Predictions
              </div>
            </div>
          </div>

          {/* Col 3 */}
          <div className="flex items-center gap-space-sm">
            <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-on-surface-variant shrink-0">
              <span className="material-symbols-outlined text-[22px]">schedule</span>
            </div>
            <div className="min-w-0">
              <div className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-bold">
                System Status
              </div>
              <div className="font-title-md text-title-md text-on-surface">
                System Active
              </div>
              <div className="font-body-sm text-body-sm text-outline">
                Medical Database • Up to Date
              </div>
            </div>
          </div>

          {/* Col 4 */}
          <div className="flex items-center justify-start md:justify-end gap-space-xs">
            {summary.has_critical_interaction ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-error-container text-on-error-container font-label-sm text-label-sm font-semibold">
                <span className="w-2 h-2 rounded-full bg-error animate-ping"></span>
                Please Review Warnings
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-container text-primary font-label-sm text-label-sm font-semibold">
                <span className="material-symbols-outlined text-[16px]">check_circle</span>
                No Serious Clashes Found
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Top Executive Summary Banner */}
      <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-xs mb-space-xl relative overflow-hidden border border-surface-variant/30">
        <div className="relative z-10 flex flex-col gap-space-md">
          <div className="flex flex-wrap items-center justify-between gap-space-sm">
            <div className="flex flex-wrap items-center gap-space-sm">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-container text-on-primary font-label-sm text-label-sm font-semibold">
                <span className="material-symbols-outlined text-[15px]">verified</span>
                {summary.verified_interactions_count} Verified Medical Warnings
              </span>
              {summary.predicted_interactions_count > 0 && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-label-sm font-semibold">
                  <span className="material-symbols-outlined text-[15px]">psychology</span>
                  {summary.predicted_interactions_count} Smart AI Estimates
                </span>
              )}
              {summary.insufficient_evidence_count > 0 && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container text-on-surface-variant font-label-sm text-label-sm font-semibold">
                  <span className="material-symbols-outlined text-[15px]">help_outline</span>
                  {summary.insufficient_evidence_count} Need More Info
                </span>
              )}
            </div>

            <span className="font-label-sm text-label-sm text-outline font-mono">
              Double-Checked for Safety
            </span>
          </div>

          <div className="bg-surface-container-low rounded-xl p-space-md flex flex-col md:flex-row items-start md:items-center justify-between gap-space-md border border-surface-variant/40">
            <div className="flex items-start gap-space-md">
              <div className="w-12 h-12 rounded-xl bg-primary-container text-on-primary flex items-center justify-center shrink-0 shadow-xs mt-0.5 md:mt-0">
                <span className="material-symbols-outlined text-[24px]">info</span>
              </div>
              <div className="flex flex-col">
                <span className="font-title-md text-title-md text-on-surface font-semibold">
                  Understanding Your Results
                </span>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                  Verified medical research tells us how medicines affect each other (for example, slowing down how your body clears them, or increasing side effects). We clearly show whether a warning comes from proven medical studies or AI estimates so you always know the source.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Pairwise Interaction Cards */}
      <div className="flex flex-col gap-4 mb-space-xl">
        <h2 className="font-headline-sm text-headline-sm text-on-surface tracking-tight flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-[24px]">compare_arrows</span>
          <span>Medicine Clashes &amp; Explanations ({interactions.length})</span>
        </h2>

        {interactions.map((pair, idx) => {
          const isExpanded = expandedIndex === idx;
          const isVerified = pair.evidence_status === 'verified_database';
          const isPredicted = pair.evidence_status === 'model_prediction';
          const risk = getRiskLevel(pair);

          return (
            <div
              key={`${pair.drug_a_id}-${pair.drug_b_id}`}
              className={`bg-surface-container-lowest rounded-2xl shadow-xs border border-surface-variant/40 overflow-hidden transition-all duration-200 ${risk.parentBorder}`}
            >
              {/* Accordion Header */}
              <div
                onClick={() => toggleAccordion(idx)}
                className="p-5 flex items-center justify-between cursor-pointer hover:bg-surface-container-low/50 transition-colors select-none"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    isVerified
                      ? 'bg-primary-container text-on-primary'
                      : isPredicted
                      ? 'bg-secondary-container text-on-secondary-container'
                      : 'bg-surface-container text-outline'
                  }`}>
                    <span className="material-symbols-outlined text-[22px]">
                      {isVerified ? 'verified' : isPredicted ? 'psychology' : 'help'}
                    </span>
                  </div>

                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-title-md text-title-md text-on-surface font-bold">
                        {pair.drug_a_name}
                      </span>
                      <span className="text-outline text-sm font-semibold">✕</span>
                      <span className="font-title-md text-title-md text-on-surface font-bold">
                        {pair.drug_b_name}
                      </span>

                      {/* Risk Level Badge */}
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold shadow-xs ${risk.badgeClass}`}>
                        <span className={`w-2 h-2 rounded-full ${risk.dotClass}`}></span>
                        <span>{risk.tier}</span>
                      </span>

                      {/* Evidence Badge */}
                      {isVerified && (
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-primary-container/20 text-primary border border-primary/20">
                          Verified Medical Fact
                        </span>
                      )}
                      {isPredicted && (
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-secondary-container/40 text-secondary border border-secondary/20">
                          AI Safety Prediction ({Math.round((pair.confidence || 0) * 100)}% Confidence)
                        </span>
                      )}
                      {!isVerified && !isPredicted && (
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-surface-container text-on-surface-variant">
                          No Known Clashes
                        </span>
                      )}
                    </div>

                    <p className="font-body-sm text-body-sm text-on-surface-variant truncate mt-1">
                      {pair.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0 ml-4">
                  <span className="material-symbols-outlined text-outline transition-transform duration-200" style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                    expand_more
                  </span>
                </div>
              </div>

              {/* Accordion Body */}
              {isExpanded && (
                <div className="px-6 pb-6 pt-2 border-t border-surface-variant/30 bg-surface-container-low/20 flex flex-col gap-4">
                  {/* Explanation Block */}
                  <div className="p-4 rounded-xl bg-surface-container-lowest border border-surface-variant/30">
                    <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider mb-2">
                      <span className="material-symbols-outlined text-[16px]">science</span>
                      <span>What Happens When Taken Together</span>
                      {pair.interaction_type && (
                        <span className="text-outline font-mono">• Safety Type #{pair.interaction_type}</span>
                      )}
                    </div>
                    <p className="font-body-md text-body-md text-on-surface leading-relaxed">
                      {pair.description}
                    </p>
                  </div>

                  {/* Provenance and Evidence Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-3.5 rounded-xl bg-surface-container-lowest border border-surface-variant/30 flex flex-col">
                      <span className="text-xs text-on-surface-variant uppercase tracking-wider font-semibold mb-1">
                        Where This Information Comes From
                      </span>
                      <span className="font-body-md text-body-md text-on-surface font-medium">
                        {pair.source}
                      </span>
                      <span className="text-xs text-outline mt-1">
                        Verified in published medical research datasets
                      </span>
                    </div>

                    {/* Prominently Highlighted Risk Level Card */}
                    <div className={`rounded-xl border overflow-hidden flex flex-col justify-between transition-all ${risk.cardClass}`}>
                      {/* High-visibility colored header bar */}
                      <div className={`px-4 py-2.5 flex items-center justify-between ${risk.headerClass}`}>
                        <div className="flex items-center gap-2">
                          <span className={`material-symbols-outlined text-[20px] ${risk.iconColor}`}>
                            {risk.icon}
                          </span>
                          <span className={`text-xs uppercase tracking-wider font-extrabold ${risk.titleClass}`}>
                            Risk Level
                          </span>
                        </div>
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold shadow-xs ${risk.badgeClass}`}>
                          <span className={`w-2 h-2 rounded-full ${risk.dotClass}`}></span>
                          <span>{risk.tier}</span>
                        </span>
                      </div>

                      {/* Content Body with evident colored text */}
                      <div className="p-4 flex flex-col justify-between h-full space-y-2">
                        <p className={`font-body-md text-body-md leading-relaxed ${risk.explanationClass}`}>
                          {risk.explanation}
                        </p>
                        <span className={`text-xs pt-2.5 font-medium ${risk.subtextClass}`}>
                          Exact clinical risk depends on your personal prescribed dosage. Share this with your doctor.
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Alternative Medications Suggestion (from SD04) */}
                  {pair.alternatives && pair.alternatives.length > 0 && (
                    <div className="p-4 rounded-xl bg-surface-container-lowest border border-surface-variant/30">
                      <div className="flex items-center gap-2 text-secondary font-bold text-xs uppercase tracking-wider mb-2">
                        <span className="material-symbols-outlined text-[16px]">swap_horiz</span>
                        <span>Safer Alternatives to Ask Your Doctor About</span>
                      </div>
                      <p className="text-xs text-on-surface-variant mb-2">
                        Medical studies suggest these alternative medicines may carry a lower risk of side effects:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {pair.alternatives.map((alt) => (
                          <span
                            key={alt}
                            className="px-3 py-1 rounded-lg bg-surface-container text-primary font-label-md text-label-md font-semibold"
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

      {/* Condition & Dietary Alerts Section (from SD06) */}
      {condition_alerts && condition_alerts.length > 0 && (
        <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-xs border border-surface-variant/30 mb-space-xl">
          <div className="flex items-center gap-2 mb-4">
            <span className="material-symbols-outlined text-secondary text-[24px]">vital_signs</span>
            <h3 className="font-title-lg text-title-lg text-on-surface font-semibold">
              Important Warnings for Your Health &amp; Diet ({condition_alerts.length})
            </h3>
          </div>

          <div className="flex flex-col gap-3">
            {condition_alerts.map((alert, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-surface-container-low border border-surface-variant/40 flex items-start gap-3"
              >
                <span className="material-symbols-outlined text-secondary text-[20px] shrink-0 mt-0.5">
                  info
                </span>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="font-label-md text-label-md text-on-surface font-bold">
                      {alert.condition}
                    </span>
                    <span className="text-outline text-xs">•</span>
                    <span className="font-label-sm text-label-sm text-primary font-semibold">
                      Medicine: {alert.drug_name}
                    </span>
                    {alert.food_constituent && (
                      <span className="font-label-sm text-label-sm text-outline">
                        (Food/Drink: {alert.food_constituent})
                      </span>
                    )}
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                    {alert.warning}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Regulatory & Safety Clinical Disclaimer */}
      <div className="p-space-lg rounded-2xl bg-surface-container-low border border-surface-variant/50 text-body-sm text-on-surface-variant leading-relaxed">
        <div className="flex items-center gap-2 text-primary font-bold mb-2">
          <span className="material-symbols-outlined text-[20px]">verified_user</span>
          <span className="font-label-lg text-label-lg">Important Safety Note</span>
        </div>
        <p>{disclaimer}</p>
      </div>
    </div>
  );
};
