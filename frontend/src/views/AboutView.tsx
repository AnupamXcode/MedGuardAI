import React from 'react';

export const AboutView: React.FC = () => {
  return (
    <div className="flex flex-col w-full max-w-4xl">
      {/* Header */}
      <div className="flex flex-col mb-space-xl">
        <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">
          About MediGuard AI &amp; Safety Information
        </h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant mt-2 leading-relaxed">
          A smart medicine safety assistant designed to help patients and families easily understand how their medicines interact and stay safe.
        </p>
      </div>

      <div className="flex flex-col gap-6">
        {/* Research Foundation Card */}
        <div className="bg-surface-container-lowest rounded-2xl p-8 shadow-xs border border-surface-variant/30 flex flex-col gap-4">
          <div className="flex items-center gap-3 text-primary">
            <span className="material-symbols-outlined text-[28px]">menu_book</span>
            <h2 className="font-title-lg text-title-lg text-on-surface font-semibold">
              Built on Verified Medical Research
            </h2>
          </div>

          <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
            MediGuard AI is powered by medical research published in the <em>Proceedings of the National Academy of Sciences (PNAS)</em>:
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
              <span className="font-title-md text-title-md text-primary font-bold">192,284 Medicine Pairs</span>
              <span className="text-xs text-on-surface-variant mt-0.5">
                Verified safety records covering 1,710 approved medicines.
              </span>
            </div>
            <div className="p-4 rounded-xl bg-surface-container-low border border-surface-variant/30 flex flex-col">
              <span className="font-title-md text-title-md text-primary font-bold">86 Reaction Types</span>
              <span className="text-xs text-on-surface-variant mt-0.5">
                Clear descriptions explaining how medicines change absorption, body breakdown, and heart safety.
              </span>
            </div>
          </div>
        </div>

        {/* Dual-Path Architecture */}
        <div className="bg-surface-container-lowest rounded-2xl p-8 shadow-xs border border-surface-variant/30 flex flex-col gap-4">
          <div className="flex items-center gap-3 text-secondary">
            <span className="material-symbols-outlined text-[28px]">account_tree</span>
            <h2 className="font-title-lg text-title-lg text-on-surface font-semibold">
              Two-Layer Safety Check
            </h2>
          </div>

          <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
            To give you the most accurate answers, MediGuard AI checks your medicines in two steps:
          </p>

          <div className="space-y-3">
            <div className="p-4 rounded-xl bg-surface-container-low border border-surface-variant/40 flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary-container text-on-primary flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                1
              </div>
              <div className="flex flex-col">
                <span className="font-title-md text-title-md text-on-surface font-semibold">
                  1. Verified Medical Library (First Check)
                </span>
                <span className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                  First, we check our library of 192,284 proven medicine pairs from published medical research. When a match is found, you get a verified medical alert.
                </span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-surface-container-low border border-surface-variant/40 flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-secondary-container text-on-secondary-container flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                2
              </div>
              <div className="flex flex-col">
                <span className="font-title-md text-title-md text-on-surface font-semibold">
                  2. Smart AI Prediction (When Unlisted)
                </span>
                <span className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                  If a medicine combination has not been tested in scientific studies yet, our smart AI model analyzes how each medicine works to estimate possible risks.
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
              Our Commitment to Honest Safety
            </h2>
          </div>

          <div className="space-y-3 font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
            <div className="p-3.5 rounded-xl bg-error-container/20 border border-error-container flex items-start gap-2.5">
              <span className="material-symbols-outlined text-error text-[20px] shrink-0 mt-0.5">warning</span>
              <span>
                <strong>No Made-Up Risk Ratings:</strong> We never invent false danger levels. We tell you exactly what happens in your body, and clearly mark when a risk level needs a doctor's confirmation.
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-surface-container-low border border-surface-variant/40 flex items-start gap-2.5">
              <span className="material-symbols-outlined text-primary text-[20px] shrink-0 mt-0.5">shield</span>
              <span>
                <strong>No Warning Does Not Guarantee 100% Safety:</strong> Just because no warning appears does not mean two medicines are completely safe for everyone. Your dosage, diet, and unique health can affect how medicines work. Always talk with your doctor or pharmacist.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
