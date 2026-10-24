import { useState, useEffect, useRef } from 'react';
import { searchDrugs, checkInteractions } from '../services/api';
import type { DrugItem, InteractionCheckResponse } from '../services/api';

interface InteractionCheckerViewProps {
  selectedMedications: DrugItem[];
  onAddMedication: (drug: DrugItem) => void;
  onRemoveMedication: (id: string) => void;
  onClearMedications: () => void;
  selectedConditions: string[];
  onToggleCondition: (cond: string) => void;
  onResultsReady: (results: InteractionCheckResponse) => void;
}

const COMMON_CONDITIONS = [
  'Hypertension',
  'Type 2 Diabetes',
  'Renal Impairment',
  'Atrial Fibrillation',
  'Asthma / COPD',
  'Hepatic Impairment',
  'Heart Failure'
];

export const InteractionCheckerView: React.FC<InteractionCheckerViewProps> = ({
  selectedMedications,
  onAddMedication,
  onRemoveMedication,
  onClearMedications,
  selectedConditions,
  onToggleCondition,
  onResultsReady,
}) => {
  const [query, setQuery] = useState('');
  const [candidates, setCandidates] = useState<DrugItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Debounced search
  useEffect(() => {
    if (!query.trim()) {
      setCandidates([]);
      setIsDropdownOpen(false);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setIsSearching(true);
        const results = await searchDrugs(query);
        setCandidates(results);
        setIsDropdownOpen(true);
      } catch (err) {
        console.error('Drug search error:', err);
      } finally {
        setIsSearching(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectDrug = (drug: DrugItem) => {
    onAddMedication(drug);
    setQuery('');
    setIsDropdownOpen(false);
    setErrorMsg(null);
  };

  const handleLoadSample = async () => {
    try {
      setIsSearching(true);
      const warf = (await searchDrugs('Warfarin'))[0];
      const asp = (await searchDrugs('Aspirin'))[0];
      const lisin = (await searchDrugs('Lisinopril'))[0];

      if (warf) onAddMedication(warf);
      if (asp) onAddMedication(asp);
      if (lisin) onAddMedication(lisin);
      setErrorMsg(null);
    } catch (err) {
      console.error('Failed to load sample:', err);
    } finally {
      setIsSearching(false);
    }
  };

  const handleRunCheck = async () => {
    if (selectedMedications.length < 2) {
      setErrorMsg('Please select at least 2 medications to evaluate pairwise interactions.');
      return;
    }

    try {
      setIsLoading(true);
      setErrorMsg(null);
      const medIds = selectedMedications.map(m => m.id);
      const response = await checkInteractions(medIds, selectedConditions);
      onResultsReady(response);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to analyze interactions. Please verify backend connectivity.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col w-full">
      {/* Top Section: Header & Operational Context */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-md mb-space-xl">
        <div className="flex flex-col max-w-2xl">
          <div className="flex items-center gap-space-xs text-primary mb-2">
            <span className="material-symbols-outlined text-[18px]">verified_user</span>
            <span className="font-label-sm text-label-sm uppercase tracking-wider text-primary font-bold">
              Precision Pharmacovigilance Engine
            </span>
          </div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">
            Check Drug Interactions &amp; Safety
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant mt-1.5 leading-relaxed">
            Screen multi-drug combinations against known contraindications, adverse metabolic competition, and pre-existing patient health conditions.
          </p>
        </div>

        {/* Quick Metric Bar */}
        <div className="flex items-center gap-space-sm bg-surface-container-lowest px-4 py-2.5 rounded-xl shadow-xs self-start md:self-auto border border-surface-variant/30">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse"></span>
            <span className="font-label-md text-label-md text-on-surface font-semibold">Live Protocol Session</span>
          </div>
          <span className="w-1 h-1 rounded-full bg-outline-variant"></span>
          <span className="font-body-sm text-body-sm text-on-surface-variant">
            Active Buffer: <strong className="text-on-surface font-semibold">{selectedMedications.length} Rx + {selectedConditions.length} Conditions</strong>
          </span>
        </div>
      </div>

      {/* Main Workspace Grid (7 cols / 5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-start">
        {/* Left Column: Input and Regimen Panel (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-space-lg">
          {/* Card 1: Search & Autocomplete Interface */}
          <div className="bg-surface-container-lowest rounded-2xl p-space-lg shadow-xs border border-surface-variant/30 relative" ref={searchContainerRef}>
            <div className="flex items-center justify-between mb-space-md">
              <div className="flex items-center gap-space-xs">
                <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-surface-container text-primary">
                  <span className="material-symbols-outlined text-[18px]">search_insights</span>
                </span>
                <h2 className="font-title-md text-title-md text-on-surface font-semibold">
                  Search &amp; Add Medications
                </h2>
              </div>
              <span className="font-label-sm text-label-sm text-on-surface-variant bg-surface-container px-2 py-0.5 rounded font-mono">
                1,710 Synced Therapeutics
              </span>
            </div>

            {/* Search Input Bar */}
            <div className="relative mb-3">
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-4 text-outline text-[22px] pointer-events-none">
                  search
                </span>
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onFocus={() => { if (candidates.length > 0) setIsDropdownOpen(true); }}
                  placeholder="Search medicine by generic name, brand, or active substance (e.g. Warfarin, Aspirin, Metformin)..."
                  className="w-full h-12 pl-12 pr-24 rounded-lg bg-surface-container-lowest text-on-surface font-body-md text-body-md placeholder:text-outline border border-surface-variant focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-xs transition-all"
                />
                {isSearching && (
                  <div className="absolute right-4 text-primary animate-spin">
                    <span className="material-symbols-outlined text-[20px]">progress_activity</span>
                  </div>
                )}
              </div>

              {/* Autocomplete Dropdown Popover */}
              {isDropdownOpen && candidates.length > 0 && (
                <div className="absolute left-0 right-0 top-14 bg-surface-container-lowest rounded-xl shadow-xl z-30 p-2 border border-surface-variant/40 max-h-80 overflow-y-auto">
                  <div className="px-3 py-1.5 flex items-center justify-between border-b border-surface-container-high pb-2 mb-1">
                    <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant font-bold">
                      Recommended Database Matches
                    </span>
                    <span className="font-label-sm text-label-sm text-primary font-semibold">
                      {candidates.length} Available Candidates
                    </span>
                  </div>
                  <div className="flex flex-col gap-1">
                    {candidates.map((drug: DrugItem) => (
                      <div
                        key={drug.id}
                        onClick={() => handleSelectDrug(drug)}
                        className="flex items-center justify-between p-2.5 rounded-lg bg-surface-container-low hover:bg-surface-container cursor-pointer transition-colors group"
                      >
                        <div className="flex items-center gap-space-sm min-w-0">
                          <span className="w-8 h-8 rounded-lg bg-primary-container text-on-primary flex items-center justify-center font-bold text-xs shrink-0">
                            Rx
                          </span>
                          <div className="flex flex-col min-w-0">
                            <span className="font-label-lg text-label-lg text-on-surface font-semibold truncate group-hover:text-primary transition-colors">
                              {drug.name}
                            </span>
                            <span className="font-body-sm text-body-sm text-on-surface-variant truncate">
                              ID: {drug.id} • {drug.categories[0] || drug.type}
                            </span>
                          </div>
                        </div>
                        <span className="font-label-sm text-label-sm text-primary font-bold px-2 py-1 bg-surface-container-lowest rounded shadow-xs group-hover:bg-primary-container group-hover:text-on-primary transition-all">
                          + Add
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Quick Helper Suggestion */}
            <div className="flex items-center justify-between text-on-surface-variant text-body-sm pt-1">
              <span>Popular clinical tests: Warfarin, Aspirin, Lisinopril, Metformin</span>
              <button
                type="button"
                onClick={handleLoadSample}
                className="text-primary hover:underline font-semibold cursor-pointer text-xs"
              >
                Load Sample Regimen
              </button>
            </div>
          </div>

          {/* Card 2: Active Regimen Buffer */}
          <div className="bg-surface-container-lowest rounded-2xl p-space-lg shadow-xs border border-surface-variant/30">
            <div className="flex items-center justify-between mb-space-md">
              <div className="flex items-center gap-space-xs">
                <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-surface-container text-primary">
                  <span className="material-symbols-outlined text-[18px]">medication</span>
                </span>
                <h2 className="font-title-md text-title-md text-on-surface font-semibold">
                  Active Medication Buffer ({selectedMedications.length})
                </h2>
              </div>
              {selectedMedications.length > 0 && (
                <button
                  type="button"
                  onClick={onClearMedications}
                  className="text-outline hover:text-error text-xs font-semibold cursor-pointer transition-colors"
                >
                  Clear All
                </button>
              )}
            </div>

            {selectedMedications.length === 0 ? (
              <div className="py-10 flex flex-col items-center justify-center text-center border-2 border-dashed border-surface-variant rounded-xl">
                <span className="material-symbols-outlined text-outline text-[40px] mb-2">
                  playlist_add
                </span>
                <p className="font-title-md text-title-md text-on-surface">No Medications Selected</p>
                <p className="font-body-sm text-body-sm text-on-surface-variant max-w-sm mt-1">
                  Search above and add 2 or more medications to begin multi-drug interaction screening.
                </p>
                <button
                  type="button"
                  onClick={handleLoadSample}
                  className="mt-4 px-4 py-2 bg-surface-container text-primary rounded-lg font-label-md text-label-md hover:bg-primary-container hover:text-on-primary transition-colors cursor-pointer"
                >
                  Load 3 Sample Therapeutics
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2.5">
                {selectedMedications.map((med, idx) => (
                  <div
                    key={med.id}
                    className="flex items-center justify-between p-3.5 rounded-xl bg-surface-container-low border border-surface-variant/30 shadow-xs"
                  >
                    <div className="flex items-center gap-space-sm min-w-0">
                      <div className="w-9 h-9 rounded-lg bg-surface-container text-primary flex items-center justify-center font-bold text-xs shrink-0">
                        #{idx + 1}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="font-title-md text-title-md text-on-surface font-semibold truncate">
                          {med.name}
                        </span>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="font-mono text-[11px] text-outline font-semibold">
                            {med.id}
                          </span>
                          <span className="text-outline-variant">•</span>
                          <span className="text-[12px] text-on-surface-variant truncate">
                            {med.categories[0] || 'Approved Therapeutic'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => onRemoveMedication(med.id)}
                      className="p-1.5 rounded-lg text-outline hover:text-error hover:bg-error-container/20 transition-colors cursor-pointer"
                      title="Remove medication"
                    >
                      <span className="material-symbols-outlined text-[20px]">delete</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Conditions & Run Check Action (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-space-lg">
          {/* Card 3: Patient Conditions */}
          <div className="bg-surface-container-lowest rounded-2xl p-space-lg shadow-xs border border-surface-variant/30">
            <div className="flex items-center justify-between mb-space-md">
              <div className="flex items-center gap-space-xs">
                <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-surface-container text-secondary">
                  <span className="material-symbols-outlined text-[18px]">cardiology</span>
                </span>
                <h2 className="font-title-md text-title-md text-on-surface font-semibold">
                  Baseline Pathologies
                </h2>
              </div>
              <span className="font-label-sm text-label-sm text-secondary font-bold bg-secondary-container/30 px-2 py-0.5 rounded">
                SD06 Synced
              </span>
            </div>

            <p className="font-body-sm text-body-sm text-on-surface-variant mb-4 leading-relaxed">
              Select concurrent patient chronic indications to screen for disease-drug metabolism interactions.
            </p>

            <div className="flex flex-col gap-2">
              {COMMON_CONDITIONS.map((cond) => {
                const isSelected = selectedConditions.includes(cond);
                return (
                  <label
                    key={cond}
                    className={`flex items-center justify-between p-3 rounded-lg border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-secondary-container/20 border-secondary text-on-surface font-semibold'
                        : 'bg-surface-container-lowest border-surface-variant/50 text-on-surface-variant hover:bg-surface-container-low'
                    }`}
                  >
                    <span className="font-label-md text-label-md">{cond}</span>
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => onToggleCondition(cond)}
                      className="w-4 h-4 rounded text-primary focus:ring-primary/20 accent-primary"
                    />
                  </label>
                );
              })}
            </div>

            <div className="mt-4 p-2.5 rounded-lg bg-surface-container-low text-body-sm text-outline flex items-start gap-2">
              <span className="material-symbols-outlined text-primary text-[18px] shrink-0 mt-0.5">info</span>
              <span>
                Health condition alerts are informational and cross-referenced against research dataset SD06 (KEGG Disease database).
              </span>
            </div>
          </div>

          {/* Card 4: Run Check Action Panel */}
          <div className="bg-surface-container-lowest rounded-2xl p-space-lg shadow-xs border border-surface-variant/30 flex flex-col gap-4">
            {errorMsg && (
              <div className="p-3.5 rounded-xl bg-error-container text-on-error-container text-body-sm flex items-start gap-2">
                <span className="material-symbols-outlined text-[20px] text-error shrink-0">error</span>
                <span>{errorMsg}</span>
              </div>
            )}

            <button
              type="button"
              onClick={handleRunCheck}
              disabled={isLoading || selectedMedications.length < 2}
              className={`w-full py-3.5 px-space-md rounded-xl font-label-lg text-label-lg flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer ${
                isLoading || selectedMedications.length < 2
                  ? 'bg-surface-variant text-outline cursor-not-allowed'
                  : 'bg-primary text-on-primary hover:bg-primary-container active:scale-[0.99]'
              }`}
            >
              {isLoading ? (
                <>
                  <span className="material-symbols-outlined animate-spin text-[20px]">progress_activity</span>
                  <span>Executing Dual-Path Pharmacovigilance Scan...</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[20px]">analytics</span>
                  <span>Analyze {selectedMedications.length} Medications ({Math.max(0, (selectedMedications.length * (selectedMedications.length - 1)) / 2)} Pairs)</span>
                </>
              )}
            </button>

            <div className="text-center">
              <span className="font-body-sm text-body-sm text-outline">
                Dual-Path Engine: DrugBank Gold-Standard + DeepDDI Neural Fallback
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
