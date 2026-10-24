import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
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
import { ProfileView } from './views/ProfileView';
import {
  type DrugItem,
  type InteractionCheckResponse,
  saveUserHistory,
} from './services/api';

const AppContent: React.FC = () => {
  const { profile, isAuthenticated, openAuthModal } = useAuth();

  const [currentPath, setCurrentPath] = useState<string>('overview');
  const [selectedMedications, setSelectedMedications] = useState<DrugItem[]>(() => {
    try {
      const saved = localStorage.getItem('mediguard_active_meds');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
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

  // Save active medications and history to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('mediguard_active_meds', JSON.stringify(selectedMedications));
    } catch (e) {
      console.error('Failed to save active meds:', e);
    }
  }, [selectedMedications]);

  useEffect(() => {
    try {
      localStorage.setItem('mediguard_history', JSON.stringify(history));
    } catch (e) {
      console.error('Failed to save history:', e);
    }
  }, [history]);

  // Synchronize when medications are added/removed in profile modal
  useEffect(() => {
    const handleSyncFromStorage = () => {
      try {
        const saved = localStorage.getItem('mediguard_active_meds');
        if (saved) {
          setSelectedMedications(JSON.parse(saved));
        }
      } catch {
        // ignore
      }
    };
    window.addEventListener('mediguard_meds_updated', handleSyncFromStorage);
    return () => {
      window.removeEventListener('mediguard_meds_updated', handleSyncFromStorage);
    };
  }, []);

  // When user logs in with saved profile medications, if active session is empty, auto-populate from profile
  useEffect(() => {
    if (isAuthenticated && profile?.medications && profile.medications.length > 0) {
      if (selectedMedications.length === 0) {
        const drugItems: DrugItem[] = profile.medications.map((m) => ({
          id: m.drug_id || m.drug_name,
          name: m.drug_name,
          type: 'Prescription',
          groups: 'approved',
          categories: [m.dosage || 'Standard dose'],
        }));
        setSelectedMedications(drugItems);
      }
    }
  }, [isAuthenticated, profile?.medications]);

  // Auth-gated Navigation:
  // When not signed in: only 'overview', 'about', 'profile' are accessible.
  // Clicking any protected feature opens the signup modal.
  const handleNavigate = (path: string) => {
    const publicPaths = ['overview', 'about', 'profile'];
    if (!isAuthenticated && !publicPaths.includes(path)) {
      openAuthModal('register');
      return;
    }
    setCurrentPath(path);
  };

  // "Check an Interaction" action:
  // When not signed in -> opens signup modal (already present in codebase)
  // When signed in -> navigates straight to interaction checker
  const handleCheckInteractionClick = () => {
    if (!isAuthenticated) {
      openAuthModal('register');
    } else {
      setCurrentPath('checker');
    }
  };

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
    if (!isAuthenticated) {
      openAuthModal('register');
      return;
    }

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
    <div className="min-h-screen bg-slate-50/60 font-body-md text-charcoal antialiased flex flex-col">
      {/* ========================================================= */}
      {/* Clean Top Navbar (replacing side navbar) */}
      {/* ========================================================= */}
      <Header
        currentPath={currentPath}
        onNavigate={handleNavigate}
        onCheckInteraction={handleCheckInteractionClick}
      />

      {/* ========================================================= */}
      {/* Main Full-Width Application View Container */}
      {/* ========================================================= */}
      <main className="flex-1 w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8 max-w-7xl mx-auto">
        {currentPath === 'overview' && (
          <OverviewView
            onNavigate={handleNavigate}
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
            onEditMedicines={() => handleNavigate('checker')}
            onRunNewCheck={() => handleNavigate('checker')}
          />
        )}

        {currentPath === 'my-medications' && (
          <MyMedicationsView
            medications={selectedMedications}
            onRemove={handleRemoveMedication}
            onAddMedication={handleAddMedication}
            onNavigateToCheck={() => handleNavigate('checker')}
          />
        )}

        {currentPath === 'conditions' && (
          <ConditionsView
            selectedConditions={selectedConditions}
            onToggleCondition={handleToggleCondition}
            onNavigateToCheck={() => handleNavigate('checker')}
          />
        )}

        {currentPath === 'history' && (
          <HistoryView
            history={history}
            onSelectHistoryItem={handleSelectHistoryItem}
            onClearHistory={() => setHistory([])}
            onNavigateToCheck={() => handleNavigate('checker')}
          />
        )}

        {currentPath === 'about' && <AboutView />}

        {currentPath === 'profile' && (
          <ProfileView onNavigateToCheck={() => handleNavigate('checker')} />
        )}
      </main>

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
