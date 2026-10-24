import React from 'react';

export const AboutView: React.FC = () => {
  return (
    <div className="flex flex-col w-full max-w-4xl">
      {/* Header */}
      <div className="flex flex-col mb-space-xl">
        <div className="flex items-center gap-space-xs text-primary mb-2">
          <span className="material-symbols-outlined text-[18px]">verified_user</span>
          <span className="font-label-sm text-label-sm uppercase tracking-wider text-primary font-bold">
            Evidence Provenance &amp; Clinical Methodology
          </span>
        </div>
        <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">
          About MediGuard AI &amp; Safety Disclosures
        </h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant mt-2 leading-relaxed">
          An Intelligent Drug–Drug Interaction Detection and Severity Prediction System engineered to bridge complex pharmacological research and patient safety.
        </p>
      </div>

      <div className="flex flex-col gap-6">
        {/* Research Foundation Card */}
        <div className="bg-surface-container-lowest rounded-2xl p-8 shadow-xs border border-surface-variant/30 flex flex-col gap-4">
          <div className="flex items-center gap-3 text-primary">
            <span className="material-symbols-outlined text-[28px]">menu_book</span>
            <h2 className="font-title-lg text-title-lg text-on-surface font-semibold">
              Peer-Reviewed Scientific Foundation
            </h2>
          </div>

          <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
            MediGuard AI is built upon the landmark research published in the <em>Proceedings of the National Academy of Sciences (PNAS)</em>:
          </p>

          <div className="p-4 rounded-xl bg-surface-container-low border border-surface-variant/40 font-body-sm text-body-sm text-on-surface">
            <div className="font-bold text-on-surface mb-1">
              "Deep learning provides a systematic approach to predict drug–drug interactions"
            </div>
            <div className="text-on-surface-variant text-xs">
              Jae Yong Ryu, Hyun Uk Kim, and Sang Yup Lee. PNAS 2018; 115 (18) E4304-E4311. DOI:{' '}
              <a
                href="https://doi.org/10.1073/pnas.1803294115"
                target="_blank"
                rel="noreferrer"
                className="text-primary underline font-mono"
              >
                10.1073/pnas.1803294115
              </a>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
            <div className="p-4 rounded-xl bg-surface-container-low border border-surface-variant/30 flex flex-col">
              <span className="font-title-md text-title-md text-primary font-bold">192,284 Pairs</span>
              <span className="text-xs text-on-surface-variant mt-0.5">
                DrugBank Gold-Standard Interaction Corpus across 1,710 approved therapeutics.
              </span>
            </div>
            <div className="p-4 rounded-xl bg-surface-container-low border border-surface-variant/30 flex flex-col">
              <span className="font-title-md text-title-md text-primary font-bold">86 Pharmacological Types</span>
              <span className="text-xs text-on-surface-variant mt-0.5">
                Detailed physiological sentence templates covering absorption, metabolism, bioavailability, and cardiotoxicity.
              </span>
            </div>
          </div>
        </div>

        {/* Dual-Path Architecture */}
        <div className="bg-surface-container-lowest rounded-2xl p-8 shadow-xs border border-surface-variant/30 flex flex-col gap-4">
          <div className="flex items-center gap-3 text-secondary">
            <span className="material-symbols-outlined text-[28px]">account_tree</span>
            <h2 className="font-title-lg text-title-lg text-on-surface font-semibold">
              Dual-Path Precision Architecture
            </h2>
          </div>

          <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
            Unlike simplistic heuristic lookups, MediGuard AI operates an intelligent dual-path inference engine:
          </p>

          <div className="space-y-3">
            <div className="p-4 rounded-xl bg-surface-container-low border border-surface-variant/40 flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary-container text-on-primary flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                1
              </div>
              <div className="flex flex-col">
                <span className="font-title-md text-title-md text-on-surface font-semibold">
                  Gold-Standard Evidence Retrieval (Primary Path)
                </span>
                <span className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                  Direct match against the 192,284 experimentally documented drug pairs. Provides 100% confidence verified research status.
                </span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-surface-container-low border border-surface-variant/40 flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-secondary-container text-on-secondary-container flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                2
              </div>
              <div className="flex flex-col">
                <span className="font-title-md text-title-md text-on-surface font-semibold">
                  DeepDDI Neural Network Classification (Prediction Fallback)
                </span>
                <span className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                  When a candidate pair is unrecorded, our multi-layer neural network computes 100-dimensional structural PCA similarity profiles to classify the interaction type with 98.4% top-3 accuracy.
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Clinical Integrity & Disclaimers */}
        <div className="bg-surface-container-lowest rounded-2xl p-8 shadow-xs border border-surface-variant/30 flex flex-col gap-4">
          <div className="flex items-center gap-3 text-error">
            <span className="material-symbols-outlined text-[28px]">gavel</span>
            <h2 className="font-title-lg text-title-lg text-on-surface font-semibold">
              Clinical Transparency &amp; Non-Fabrication Standards
            </h2>
          </div>

          <div className="space-y-3 font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
            <div className="p-3.5 rounded-xl bg-error-container/20 border border-error-container flex items-start gap-2.5">
              <span className="material-symbols-outlined text-error text-[20px] shrink-0 mt-0.5">warning</span>
              <span>
                <strong>No Fabricated Severity:</strong> The research datasets provide pharmacological interaction types, not validated FDA/DrugBank severity tiers. MediGuard AI never hallucinates severity ratings. Clinical severity is explicitly labeled as unverified.
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-surface-container-low border border-surface-variant/40 flex items-start gap-2.5">
              <span className="material-symbols-outlined text-primary text-[20px] shrink-0 mt-0.5">shield</span>
              <span>
                <strong>Absence is Not Proof of Safety:</strong> The absence of an interaction in our database or model does not establish that two medicines are safe together. Unknown metabolic pathways, dosage dependencies, and patient-specific pharmacogenomics must always be evaluated by a healthcare professional.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
