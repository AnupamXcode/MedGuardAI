import type { InteractionCheckResponse } from '../services/api';

export interface HistoryItem {
  id: string;
  timestamp: string;
  medications: string[];
  conditions: string[];
  results: InteractionCheckResponse;
}

interface HistoryViewProps {
  history: HistoryItem[];
  onSelectHistoryItem: (item: HistoryItem) => void;
  onClearHistory: () => void;
  onNavigateToCheck: () => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({
  history,
  onSelectHistoryItem,
  onClearHistory,
  onNavigateToCheck,
}) => {
  return (
    <div className="flex flex-col w-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-md mb-space-xl">
        <div className="flex flex-col max-w-2xl">
          <div className="flex items-center gap-space-xs text-primary mb-2">
            <span className="material-symbols-outlined text-[18px]">history</span>
            <span className="font-label-sm text-label-sm uppercase tracking-wider text-primary font-bold">
              Audit Trail &amp; Log
            </span>
          </div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">
            Interaction Check History
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant mt-1.5 leading-relaxed">
            Review past multi-drug screenings, timestamps, detected interaction signals, and clinical evaluations performed in this session.
          </p>
        </div>

        {history.length > 0 && (
          <button
            onClick={onClearHistory}
            className="text-xs font-semibold text-outline hover:text-error transition-colors cursor-pointer self-start md:self-auto"
          >
            Clear History Log
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <div className="bg-surface-container-lowest rounded-2xl p-16 shadow-xs border border-surface-variant/30 flex flex-col items-center justify-center text-center">
          <span className="material-symbols-outlined text-outline text-[48px] mb-3">history_toggle_off</span>
          <h3 className="font-title-lg text-title-lg text-on-surface font-semibold">No Screening History Yet</h3>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-md mt-1 mb-6">
            Whenever you run an interaction check, your evaluated regimen and clinical findings will be recorded here for rapid review.
          </p>
          <button
            onClick={onNavigateToCheck}
            className="px-5 py-2.5 rounded-lg bg-primary text-on-primary font-label-md text-label-md hover:bg-primary-container transition-colors cursor-pointer"
          >
            Start Your First Screening
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {history.map((item) => (
            <div
              key={item.id}
              onClick={() => onSelectHistoryItem(item)}
              className="bg-surface-container-lowest rounded-2xl p-6 shadow-xs border border-surface-variant/30 hover:border-primary/40 hover:shadow-md transition-all cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-surface-container text-primary flex items-center justify-center font-bold text-lg shrink-0">
                  <span className="material-symbols-outlined text-[24px]">checklist</span>
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-title-md text-title-md text-on-surface font-semibold">
                      {item.medications.join(' + ')}
                    </span>
                    <span className="text-outline text-xs">•</span>
                    <span className="text-xs text-on-surface-variant font-mono">
                      {item.timestamp}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-primary-container/20 text-primary">
                      {item.results.summary.verified_interactions_count} Verified Signals
                    </span>
                    {item.results.summary.predicted_interactions_count > 0 && (
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-secondary-container/30 text-secondary">
                        {item.results.summary.predicted_interactions_count} DeepDDI Predictions
                      </span>
                    )}
                    {item.conditions.length > 0 && (
                      <span className="text-xs text-outline">
                        Conditions: {item.conditions.join(', ')}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 text-primary font-semibold text-xs shrink-0">
                <span>View Full Synthesis</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
