import type { DrugItem } from '../services/api';

interface MyMedicationsViewProps {
  medications: DrugItem[];
  onRemove: (id: string) => void;
  onNavigateToCheck: () => void;
}

export const MyMedicationsView: React.FC<MyMedicationsViewProps> = ({
  medications,
  onRemove,
  onNavigateToCheck,
}) => {
  return (
    <div className="flex flex-col w-full">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-md mb-space-xl">
        <div className="flex flex-col max-w-2xl">
          <div className="flex items-center gap-space-xs text-primary mb-2">
            <span className="material-symbols-outlined text-[18px]">medication</span>
            <span className="font-label-sm text-label-sm uppercase tracking-wider text-primary font-bold">
              Patient Therapeutic Cabinet
            </span>
          </div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">
            My Medications &amp; Active Regimen
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant mt-1.5 leading-relaxed">
            Manage your ongoing therapeutic profile, active prescriptions, and OTC regimens ready for real-time interaction screening.
          </p>
        </div>

        <button
          onClick={onNavigateToCheck}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-on-primary font-label-lg text-label-lg shadow-sm hover:bg-primary-container transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px]">rule</span>
          <span>Run Safety Check</span>
        </button>
      </div>

      {/* Regimen Table / Cards */}
      <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-xs border border-surface-variant/30">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-surface-variant/40">
          <div className="flex items-center gap-2">
            <span className="font-title-md text-title-md text-on-surface font-semibold">
              Currently Logged Therapeutics
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-surface-container text-primary">
              {medications.length} Active
            </span>
          </div>
          <span className="text-xs text-outline font-mono">Synced with Clinical Database</span>
        </div>

        {medications.length === 0 ? (
          <div className="py-16 flex flex-col items-center justify-center text-center">
            <span className="material-symbols-outlined text-outline text-[48px] mb-3">
              medication_liquid
            </span>
            <h3 className="font-title-lg text-title-lg text-on-surface">No Medications In Cabinet</h3>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-sm mt-1 mb-6">
              Add your current prescription medicines, over-the-counter drugs, or vitamins to screen them together.
            </p>
            <button
              onClick={onNavigateToCheck}
              className="px-5 py-2.5 rounded-lg bg-primary-container text-on-primary font-label-md text-label-md hover:bg-primary transition-colors cursor-pointer"
            >
              + Search &amp; Add Medicines
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-surface-variant/40 text-on-surface-variant font-label-sm text-label-sm uppercase">
                  <th className="py-3 px-4">Therapeutic Name</th>
                  <th className="py-3 px-4">DrugBank ID</th>
                  <th className="py-3 px-4">Pharmacological Category</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-variant/20 font-body-sm text-body-sm text-on-surface">
                {medications.map((med) => (
                  <tr key={med.id} className="hover:bg-surface-container-low/40 transition-colors">
                    <td className="py-4 px-4 font-semibold text-on-surface flex items-center gap-2">
                      <span className="w-7 h-7 rounded-lg bg-primary-container/20 text-primary flex items-center justify-center font-bold text-xs">
                        Rx
                      </span>
                      <span>{med.name}</span>
                    </td>
                    <td className="py-4 px-4 font-mono text-outline font-semibold">
                      {med.id}
                    </td>
                    <td className="py-4 px-4 text-on-surface-variant max-w-xs truncate">
                      {med.categories[0] || 'Approved Therapeutic'}
                    </td>
                    <td className="py-4 px-4">
                      <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-surface-container text-primary">
                        {med.type}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <button
                        onClick={() => onRemove(med.id)}
                        className="text-outline hover:text-error text-xs font-semibold cursor-pointer p-1.5 rounded hover:bg-error-container/20 transition-colors"
                        title="Remove from regimen"
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
