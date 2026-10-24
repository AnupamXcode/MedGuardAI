import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  type UserBase,
  type UserFullProfileResponse,
  getStoredToken,
  removeStoredToken,
  getCurrentUser,
  getFullProfile,
  loginUser,
  registerUser,
} from '../services/api';

interface AuthContextType {
  user: UserBase | null;
  profile: UserFullProfileResponse | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  showAuthModal: boolean;
  authModalTab: 'login' | 'register' | 'forgot';
  openAuthModal: (tab?: 'login' | 'register' | 'forgot') => void;
  closeAuthModal: () => void;
  login: (email: string, pass: string) => Promise<void>;
  register: (data: { email: string; password: string; full_name: string; phone?: string }) => Promise<void>;
  logout: () => void;
  refreshProfile: () => Promise<UserFullProfileResponse | null>;
  isOnboardingOpen: boolean;
  openOnboarding: () => void;
  closeOnboarding: () => void;
  isProfileSettingsOpen: boolean;
  profileSettingsTab: 'profile' | 'health' | 'medications' | 'emergency' | 'account';
  openProfileSettings: (tab?: 'profile' | 'health' | 'medications' | 'emergency' | 'account') => void;
  closeProfileSettings: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserBase | null>(null);
  const [profile, setProfile] = useState<UserFullProfileResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<'login' | 'register' | 'forgot'>('login');
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [isProfileSettingsOpen, setIsProfileSettingsOpen] = useState(false);
  const [profileSettingsTab, setProfileSettingsTab] = useState<'profile' | 'health' | 'medications' | 'emergency' | 'account'>('profile');

  const refreshProfile = useCallback(async (): Promise<UserFullProfileResponse | null> => {
    try {
      const data = await getFullProfile();
      setProfile(data);
      setUser(data.user);
      return data;
    } catch {
      return null;
    }
  }, []);

  // Restore session on mount
  useEffect(() => {
    const initAuth = async () => {
      const token = getStoredToken();
      if (!token) {
        setIsLoading(false);
        return;
      }
      try {
        const u = await getCurrentUser();
        setUser(u);
        const p = await getFullProfile();
        setProfile(p);
        // If first-time user hasn't completed onboarding, prompt onboarding
        if (!u.onboarding_completed) {
          setIsOnboardingOpen(true);
        }
      } catch (err) {
        console.error('Session expired or invalid:', err);
        removeStoredToken();
        setUser(null);
        setProfile(null);
      } finally {
        setIsLoading(false);
      }
    };
    initAuth();
  }, []);

  const openAuthModal = (tab: 'login' | 'register' | 'forgot' = 'login') => {
    setAuthModalTab(tab);
    setShowAuthModal(true);
  };

  const closeAuthModal = () => {
    setShowAuthModal(false);
  };

  const login = async (email: string, pass: string) => {
    const res = await loginUser({ email, password: pass });
    setUser(res.user);
    closeAuthModal();
    const p = await refreshProfile();
    if (!res.user.onboarding_completed && (!p || p.profile_completion_percentage < 30)) {
      setIsOnboardingOpen(true);
    }
  };

  const register = async (data: { email: string; password: string; full_name: string; phone?: string }) => {
    const res = await registerUser(data);
    setUser(res.user);
    closeAuthModal();
    await refreshProfile();
    // New registration always triggers onboarding wizard
    setIsOnboardingOpen(true);
  };

  const logout = () => {
    removeStoredToken();
    setUser(null);
    setProfile(null);
    setIsOnboardingOpen(false);
    setIsProfileSettingsOpen(false);
  };

  const openOnboarding = () => setIsOnboardingOpen(true);
  const closeOnboarding = () => setIsOnboardingOpen(false);

  const openProfileSettings = (tab: 'profile' | 'health' | 'medications' | 'emergency' | 'account' = 'profile') => {
    setProfileSettingsTab(tab);
    setIsProfileSettingsOpen(true);
  };
  const closeProfileSettings = () => setIsProfileSettingsOpen(false);

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        isAuthenticated: !!user,
        isLoading,
        showAuthModal,
        authModalTab,
        openAuthModal,
        closeAuthModal,
        login,
        register,
        logout,
        refreshProfile,
        isOnboardingOpen,
        openOnboarding,
        closeOnboarding,
        isProfileSettingsOpen,
        profileSettingsTab,
        openProfileSettings,
        closeProfileSettings,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
