import { useState } from 'react';
import type { InteractionCheckResponse } from '../services/api';

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
        <h2 className="font-headline-md text-headline-md text-on-surface">No Analysis Available</h2>
        <p className="font-body-md text-body-md text-on-surface-variant max-w-md mt-2 mb-6">
          Please add medications in the Interaction Checker and run an evaluation to generate a clinical safety report.
        </p>
        <button
          onClick={onRunNewCheck}
          className="px-6 py-3 rounded-lg bg-primary text-on-primary font-label-lg text-label-lg shadow-sm hover:bg-primary-container transition-colors cursor-pointer"
        >
          Go to Interaction Checker
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
          <div className="flex items-center gap-space-sm text-primary">
            <span className="material-symbols-outlined text-[18px]">verified</span>
            <span className="font-label-md text-label-md uppercase tracking-wider font-bold">
              Clinical Pharmacology Synthesis
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-primary/40"></span>
            <span className="font-label-md text-label-md text-on-surface-variant font-mono">
              REF: #MG-8841-CLINICAL
            </span>
          </div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">
            Medication Interaction &amp; Safety Report
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-3xl">
            Algorithmic cross-analysis performed across active multi-drug regimens, secondary metabolic pathways, and concurrent patient chronic indications.
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
            <span>Run New Check</span>
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
                Regimen Evaluated
              </div>
              <div className="font-title-md text-title-md text-on-surface truncate">
                {summary.total_medications} Active Therapeutics
              </div>
              <div className="font-body-sm text-body-sm text-outline truncate">
                {summary.total_pairs_evaluated} Pairwise Combinations Tested
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
                Interactions Found
              </div>
              <div className="font-title-md text-title-md text-on-surface truncate">
                {summary.verified_interactions_count + summary.predicted_interactions_count} Signals Detected
              </div>
              <div className="font-body-sm text-body-sm text-outline truncate">
                {summary.verified_interactions_count} Verified DB • {summary.predicted_interactions_count} DeepDDI Neural
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
                Computation Node
              </div>
              <div className="font-title-md text-title-md text-on-surface">
                Live Engine Session
              </div>
              <div className="font-body-sm text-body-sm text-outline">
                DrugBank Corpus • Synced
              </div>
            </div>
          </div>

          {/* Col 4 */}
          <div className="flex items-center justify-start md:justify-end gap-space-xs">
            {summary.has_critical_interaction ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-error-container text-on-error-container font-label-sm text-label-sm font-semibold">
                <span className="w-2 h-2 rounded-full bg-error animate-ping"></span>
                Action Required
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-container text-primary font-label-sm text-label-sm font-semibold">
                <span className="material-symbols-outlined text-[16px]">check_circle</span>
                No Severe Database Signals
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
                {summary.verified_interactions_count} Documented Research Interactions
              </span>
              {summary.predicted_interactions_count > 0 && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-label-sm font-semibold">
                  <span className="material-symbols-outlined text-[15px]">psychology</span>
                  {summary.predicted_interactions_count} DeepDDI Neural Predictions
                </span>
              )}
              {summary.insufficient_evidence_count > 0 && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container text-on-surface-variant font-label-sm text-label-sm font-semibold">
                  <span className="material-symbols-outlined text-[15px]">help_outline</span>
                  {summary.insufficient_evidence_count} Insufficient Evidence
                </span>
              )}
            </div>

            <span className="font-label-sm text-label-sm text-outline font-mono">
              Dual-Path Precision Screening
            </span>
          </div>

          <div className="bg-surface-container-low rounded-xl p-space-md flex flex-col md:flex-row items-start md:items-center justify-between gap-space-md border border-surface-variant/40">
            <div className="flex items-start gap-space-md">
              <div className="w-12 h-12 rounded-xl bg-primary-container text-on-primary flex items-center justify-center shrink-0 shadow-xs mt-0.5 md:mt-0">
                <span className="material-symbols-outlined text-[24px]">info</span>
              </div>
              <div className="flex flex-col">
                <span className="font-title-md text-title-md text-on-surface font-semibold">
                  Evidence Status Declaration &amp; Severity Transparency
                </span>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                  The peer-reviewed research data provides validated <strong>pharmacological interaction types</strong> (e.g. metabolism changes, absorption inhibition, clearance reduction). Clinical severity tiers (Low/Moderate/High) are explicitly documented as <strong>Unverified / Clinical Severity Assessment Unavailable</strong> to prevent clinical misinformation.
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
          <span>Pairwise Therapeutic Evaluations ({interactions.length})</span>
        </h2>

        {interactions.map((pair, idx) => {
          const isExpanded = expandedIndex === idx;
          const isVerified = pair.evidence_status === 'verified_database';
          const isPredicted = pair.evidence_status === 'model_prediction';

          return (
            <div
              key={`${pair.drug_a_id}-${pair.drug_b_id}`}
              className="bg-surface-container-lowest rounded-2xl shadow-xs border border-surface-variant/40 overflow-hidden transition-all duration-200"
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

                      {/* Evidence Badge */}
                      {isVerified && (
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-primary-container/20 text-primary border border-primary/20">
                          Verified Research Evidence
                        </span>
                      )}
                      {isPredicted && (
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-secondary-container/40 text-secondary border border-secondary/20">
                          DeepDDI Prediction ({Math.round((pair.confidence || 0) * 100)}% Confidence)
                        </span>
                      )}
                      {!isVerified && !isPredicted && (
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-surface-container text-on-surface-variant">
                          No Documented Record
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
                      <span>Pharmacological Mechanism &amp; Effect</span>
                      {pair.interaction_type && (
                        <span className="text-outline font-mono">• DDI Type #{pair.interaction_type}</span>
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
                        Data Provenance &amp; Source
                      </span>
                      <span className="font-body-md text-body-md text-on-surface font-medium">
                        {pair.source}
                      </span>
                      <span className="text-xs text-outline mt-1">
                        Corroborated by PNAS DeepDDI Systematic Gold-Standard Dataset
                      </span>
                    </div>

                    <div className="p-3.5 rounded-xl bg-surface-container-lowest border border-surface-variant/30 flex flex-col">
                      <span className="text-xs text-on-surface-variant uppercase tracking-wider font-semibold mb-1">
                        Clinical Severity Assessment
                      </span>
                      <span className="font-body-md text-body-md text-error font-medium">
                        {pair.severity}
                      </span>
                      <span className="text-xs text-outline mt-1">
                        Requires clinical evaluation by attending pharmacist
                      </span>
                    </div>
                  </div>

                  {/* Alternative Medications Suggestion (from SD04) */}
                  {pair.alternatives && pair.alternatives.length > 0 && (
                    <div className="p-4 rounded-xl bg-surface-container-lowest border border-surface-variant/30">
                      <div className="flex items-center gap-2 text-secondary font-bold text-xs uppercase tracking-wider mb-2">
                        <span className="material-symbols-outlined text-[16px]">swap_horiz</span>
                        <span>Potential Lower-Risk Alternatives (Research Dataset SD04)</span>
                      </div>
                      <p className="text-xs text-on-surface-variant mb-2">
                        The following therapeutic alternatives were predicted to lower negative health effects in research models:
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
              Concurrent Condition &amp; Dietary Alerts ({condition_alerts.length})
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
                      Therapeutic: {alert.drug_name}
                    </span>
                    {alert.food_constituent && (
                      <span className="font-label-sm text-label-sm text-outline">
                        (Constituent: {alert.food_constituent})
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
          <span className="font-label-lg text-label-lg">Clinical Safety Disclaimer &amp; Patient Notice</span>
        </div>
        <p>{disclaimer}</p>
      </div>
    </div>
  );
};
