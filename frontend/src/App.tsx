import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { AuthModal } from './components/AuthModal';
import { OnboardingWizard } from './components/OnboardingWizard';
import { ProfileSettingsModal } from './components/ProfileSettingsModal';
import { OverviewView } from './views/OverviewView';
import { InteractionCheckerView } from './views/InteractionCheckerView';
import { InteractionResultsView } from './views/InteractionResultsView';
import { MyMedicationsView } from './views/MyMedicationsView';
import { ConditionsView } from './views/ConditionsView';
import { HistoryView, type HistoryItem } from './views/HistoryView';
import { AboutView } from './views/AboutView';
import {
  fetchHealth,
  saveUserHistory,
  type DrugItem,
  type InteractionCheckResponse,
} from './services/api';

const AppContent: React.FC = () => {
  const { profile, isAuthenticated } = useAuth();

  const [currentPath, setCurrentPath] = useState<string>('overview');
  const [selectedMedications, setSelectedMedications] = useState<DrugItem[]>([]);
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
  const [currentResults, setCurrentResults] = useState<InteractionCheckResponse | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem('mediguard_history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [dbStatus, setDbStatus] = useState<string>('Live Database v4.2');

  // Check health on mount
  useEffect(() => {
    fetchHealth()
      .then((h) => {
        setDbStatus(`Live PNAS DB ${h.version} (${h.database_records.toLocaleString()} pairs)`);
      })
      .catch(() => {
        setDbStatus('Offline (Backend connecting...)');
      });
  }, []);

  // Save history to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('mediguard_history', JSON.stringify(history));
    } catch (e) {
      console.error('Failed to save history:', e);
    }
  }, [history]);

  const handleAddMedication = (drug: DrugItem) => {
    if (!selectedMedications.some((m) => m.id === drug.id)) {
      setSelectedMedications([...selectedMedications, drug]);
    }
  };

  const handleRemoveMedication = (id: string) => {
    setSelectedMedications(selectedMedications.filter((m) => m.id !== id));
  };

  const handleClearMedications = () => {
    setSelectedMedications([]);
  };

  const handleToggleCondition = (cond: string) => {
    if (selectedConditions.includes(cond)) {
      setSelectedConditions(selectedConditions.filter((c) => c !== cond));
    } else {
      setSelectedConditions([...selectedConditions, cond]);
    }
  };

  // Prefill checker from saved user profile
  const handlePrefillFromProfile = () => {
    if (profile) {
      if (profile.medications && profile.medications.length > 0) {
        const drugItems: DrugItem[] = profile.medications.map((m) => ({
          id: m.drug_id || m.drug_name,
          name: m.drug_name,
          type: 'Prescription',
          groups: 'approved',
          categories: [],
        }));
        setSelectedMedications(drugItems);
      }
      if (profile.conditions && profile.conditions.length > 0) {
        setSelectedConditions(profile.conditions);
      }
    }
    setCurrentPath('checker');
  };

  const handleResultsReady = (results: InteractionCheckResponse) => {
    setCurrentResults(results);

    // Save to local state history
    const newItem: HistoryItem = {
      id: Date.now().toString(),
      timestamp: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      medications: selectedMedications.map((m) => m.name),
      conditions: selectedConditions,
      results,
    };
    setHistory((prev) => [newItem, ...prev.slice(0, 19)]); // Keep last 20

    // Also persist in authenticated backend database
    if (isAuthenticated) {
      saveUserHistory({
        medications: selectedMedications.map((m) => m.name),
        conditions: selectedConditions,
        summary: results.summary,
        results: results.interactions,
      }).catch((e) => console.error('Error recording user history:', e));
    }

    setCurrentPath('results');
  };

  const handleSelectHistoryItem = (item: HistoryItem) => {
    setCurrentResults(item.results);
    setCurrentPath('results');
  };

  const handleSelectDirectResult = (result: InteractionCheckResponse) => {
    setCurrentResults(result);
    setCurrentPath('results');
  };

  return (
    <div className="min-h-screen bg-background font-body-md text-charcoal antialiased flex">
      {/* Fixed Left Navigation Sidebar */}
      <Sidebar currentPath={currentPath} onNavigate={(path) => setCurrentPath(path)} />

      {/* Main Content Area */}
      <div className="pl-72 flex flex-col min-h-screen flex-1">
        {/* Fixed Top Clinical Header */}
        <Header dbStatus={dbStatus} />

        {/* Dynamic Route View */}
        <main className="relative pt-20 flex-1 w-full px-6 sm:px-8 pb-16 max-w-7xl mx-auto">
          {currentPath === 'overview' && (
            <OverviewView
              onNavigate={(path) => setCurrentPath(path)}
              onPrefillAndCheck={handlePrefillFromProfile}
              onSelectHistoryResult={handleSelectDirectResult}
            />
          )}

          {currentPath === 'checker' && (
            <InteractionCheckerView
              selectedMedications={selectedMedications}
              onAddMedication={handleAddMedication}
              onRemoveMedication={handleRemoveMedication}
              onClearMedications={handleClearMedications}
              selectedConditions={selectedConditions}
              onToggleCondition={handleToggleCondition}
              onResultsReady={handleResultsReady}
            />
          )}

          {currentPath === 'results' && (
            <InteractionResultsView
              results={currentResults}
              onEditMedicines={() => setCurrentPath('checker')}
              onRunNewCheck={() => setCurrentPath('checker')}
            />
          )}

          {currentPath === 'my-medications' && (
            <MyMedicationsView
              medications={selectedMedications}
              onRemove={handleRemoveMedication}
              onNavigateToCheck={() => setCurrentPath('checker')}
            />
          )}

          {currentPath === 'conditions' && (
            <ConditionsView
              selectedConditions={selectedConditions}
              onToggleCondition={handleToggleCondition}
              onNavigateToCheck={() => setCurrentPath('checker')}
            />
          )}

          {currentPath === 'history' && (
            <HistoryView
              history={history}
              onSelectHistoryItem={handleSelectHistoryItem}
              onClearHistory={() => setHistory([])}
              onNavigateToCheck={() => setCurrentPath('checker')}
            />
          )}

          {currentPath === 'about' && <AboutView />}
        </main>
      </div>

      {/* Global Modals & Wizards */}
      <AuthModal />
      <OnboardingWizard />
      <ProfileSettingsModal />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
