import React from 'react';

interface ConditionsViewProps {
  selectedConditions: string[];
  onToggleCondition: (cond: string) => void;
  onNavigateToCheck: () => void;
}

const CONDITION_CATALOG = [
  {
    name: 'Hypertension',
    category: 'Cardiovascular',
    description: 'Elevated systemic arterial blood pressure requiring chronic therapeutic control with ACE inhibitors, ARBs, or CCBs.',
    relevantClasses: ['Antihypertensives', 'Diuretics', 'Vasodilators']
  },
  {
    name: 'Type 2 Diabetes',
    category: 'Endocrine & Metabolic',
    description: 'Impaired glucose tolerance and insulin resistance requiring metformin, SGLT2 inhibitors, or insulin therapy.',
    relevantClasses: ['Hypoglycemic Agents', 'Insulins', 'Biguanides']
  },
  {
    name: 'Renal Impairment',
    category: 'Renal & Urological',
    description: 'Reduced glomerular filtration rate (eGFR) affecting primary renal clearance and drug half-life elimination.',
    relevantClasses: ['Nephrotoxic Agents', 'Renally Cleared Drugs']
  },
  {
    name: 'Atrial Fibrillation',
    category: 'Cardiovascular / Hematologic',
    description: 'Supraventricular tachyarrhythmia with elevated thromboembolic risk requiring anticoagulant prophylaxis (e.g. Warfarin, DOACs).',
    relevantClasses: ['Anticoagulants', 'Antiarrhythmics', 'Beta Blockers']
  },
  {
    name: 'Hepatic Impairment',
    category: 'Gastrointestinal & Hepatic',
    description: 'Altered hepatic CYP450 enzyme metabolism and compromised first-pass bioavailability clearance.',
    relevantClasses: ['Hepatotoxic Therapeutics', 'CYP3A4 Substrates']
  },
  {
    name: 'Asthma / COPD',
    category: 'Pulmonary & Respiratory',
    description: 'Chronic obstructive airway hyper-reactivity sensitive to beta-receptor antagonism and NSAID-induced bronchospasm.',
    relevantClasses: ['Bronchodilators', 'Inhaled Corticosteroids']
  }
];

export const ConditionsView: React.FC<ConditionsViewProps> = ({
  selectedConditions,
  onToggleCondition,
  onNavigateToCheck,
}) => {
  return (
    <div className="flex flex-col w-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-md mb-space-xl">
        <div className="flex flex-col max-w-2xl">
          <div className="flex items-center gap-space-xs text-primary mb-2">
            <span className="material-symbols-outlined text-[18px]">clinical_notes</span>
            <span className="font-label-sm text-label-sm uppercase tracking-wider text-primary font-bold">
              Chronic Disease Profiles
            </span>
          </div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">
            Patient Health Conditions
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant mt-1.5 leading-relaxed">
            Configure chronic indications to cross-reference multi-drug regimens with disease-drug interactions from research dataset SD06.
          </p>
        </div>

        <button
          onClick={onNavigateToCheck}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-on-primary font-label-lg text-label-lg shadow-sm hover:bg-primary-container transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px]">rule</span>
          <span>Apply in Checker</span>
        </button>
      </div>

      {/* Catalog Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md mb-space-xl">
        {CONDITION_CATALOG.map((c) => {
          const isSelected = selectedConditions.includes(c.name);
          return (
            <div
              key={c.name}
              onClick={() => onToggleCondition(c.name)}
              className={`p-6 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'bg-secondary-container/20 border-secondary shadow-sm'
                  : 'bg-surface-container-lowest border-surface-variant/40 hover:bg-surface-container-low/40 shadow-xs'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs uppercase tracking-wider font-bold text-secondary">
                    {c.category}
                  </span>
                  <div className={`w-5 h-5 rounded flex items-center justify-center border transition-all ${
                    isSelected ? 'bg-secondary border-secondary text-on-secondary' : 'border-outline'
                  }`}>
                    {isSelected && <span className="material-symbols-outlined text-[16px]">check</span>}
                  </div>
                </div>
                <h3 className="font-title-lg text-title-lg text-on-surface font-semibold mb-2">
                  {c.name}
                </h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed mb-4">
                  {c.description}
                </p>
              </div>

              <div className="flex flex-wrap gap-1.5 pt-3 border-t border-surface-variant/30">
                {c.relevantClasses.map((cls) => (
                  <span
                    key={cls}
                    className="px-2.5 py-0.5 rounded-md text-[11px] font-medium bg-surface-container text-on-surface-variant"
                  >
                    {cls}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Clinical Notice */}
      <div className="p-4 rounded-xl bg-surface-container-low border border-surface-variant/40 text-body-sm text-outline flex items-start gap-2">
        <span className="material-symbols-outlined text-primary text-[20px] shrink-0 mt-0.5">info</span>
        <span>
          <strong>Informational Context Notice:</strong> Health condition data is cross-referenced with KEGG Disease interactions from research dataset SD06. This feature provides educational context and does not deliver definitive diagnostic evaluations.
        </span>
      </div>
    </div>
  );
};
