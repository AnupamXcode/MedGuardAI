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
    description: 'High blood pressure that puts extra strain on your heart and arteries over time.',
    relevantClasses: ['Blood Pressure Medicines', 'Water Pills', 'Heart Medicines']
  },
  {
    name: 'Type 2 Diabetes',
    category: 'Endocrine & Metabolic',
    description: 'High blood sugar levels where your body has trouble converting sugar into energy.',
    relevantClasses: ['Blood Sugar Medicines', 'Insulin', 'Metformin']
  },
  {
    name: 'Renal Impairment',
    category: 'Kidney Health',
    description: 'Reduced kidney function, which can slow down how fast medicines leave your body.',
    relevantClasses: ['Kidney-Sensitive Medicines', 'Pain Relievers']
  },
  {
    name: 'Atrial Fibrillation',
    category: 'Heart Rhythm',
    description: 'An irregular or rapid heart rhythm that can increase the risk of blood clots or stroke.',
    relevantClasses: ['Blood Thinners', 'Heart Rhythm Medicines', 'Beta Blockers']
  },
  {
    name: 'Hepatic Impairment',
    category: 'Liver Health',
    description: 'Liver weakness or reduced liver function, affecting how your body breaks down medicines.',
    relevantClasses: ['Liver-Processed Medicines', 'Pain Medicines']
  },
  {
    name: 'Asthma / COPD',
    category: 'Lungs & Breathing',
    description: 'Breathing difficulties and sensitive airways that can react to dust, cold weather, or certain medicines.',
    relevantClasses: ['Inhalers', 'Steroid Sprays', 'Airway Relaxers']
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
          <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">
            Health Conditions &amp; Illnesses
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant mt-1.5 leading-relaxed">
            Select any health conditions you have so we can flag medicines that might not be safe for you.
          </p>
        </div>

        <button
          onClick={onNavigateToCheck}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-on-primary font-label-lg text-label-lg shadow-sm hover:bg-primary-container transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px]">rule</span>
          <span>Check With My Conditions</span>
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
          <strong>Safety Notice:</strong> Health condition alerts help you and your doctor spot medicines that may need extra care with your health history. They do not replace personalized advice from your doctor or healthcare provider.
        </span>
      </div>
    </div>
  );
};
