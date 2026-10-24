import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, User, Activity, Pill, HeartPulse, Settings, LogOut, ChevronDown, LogIn, Sparkles } from 'lucide-react';

interface HeaderProps {
  dbStatus?: string;
}

export const Header: React.FC<HeaderProps> = ({ dbStatus = 'PNAS DeepDDI v4.2' }) => {
  const { user, profile, isAuthenticated, openAuthModal, logout, openProfileSettings, openOnboarding } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const completionPercent = profile?.profile_completion_percentage ?? 0;

  return (
    <header className="fixed top-0 left-72 right-0 h-16 bg-surface-container-lowest/95 backdrop-blur-md shadow-[0_1px_8px_rgba(45,36,33,0.05)] z-40 flex items-center justify-between px-6 border-b border-outline-variant/50">
      {/* Left: Engine Status Badge */}
      <div className="flex items-center space-x-3">
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs bg-surface-container text-primary font-semibold border border-outline-variant/60">
          <ShieldCheck className="w-3.5 h-3.5 mr-1 text-primary" />
          <span>{dbStatus}</span>
        </span>
        <span className="hidden sm:inline text-xs text-charcoal-muted">
          192k Dual-Path Evidence Base
        </span>
      </div>

      {/* Right: User / Auth Controls */}
      <div className="flex items-center space-x-4">
        {isAuthenticated && user ? (
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center space-x-3 p-1.5 rounded-xl hover:bg-surface-container transition border border-transparent hover:border-outline-variant/50"
            >
              {/* Profile Completion Badge */}
              <div className="hidden sm:flex flex-col items-end">
                <span className="text-xs font-bold text-charcoal leading-tight">
                  {user.full_name || 'Practitioner'}
                </span>
                <div className="flex items-center space-x-1 mt-0.5">
                  <div className="w-12 h-1.5 bg-surface-container-high rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all duration-300"
                      style={{ width: `${completionPercent}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-charcoal-muted font-medium">
                    {completionPercent}%
                  </span>
                </div>
              </div>

              {/* Avatar */}
              <div className="w-9 h-9 rounded-full bg-primary-container text-primary flex items-center justify-center font-bold text-sm shadow-xs border border-primary/20">
                {user.full_name ? user.full_name.charAt(0).toUpperCase() : 'U'}
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-charcoal-muted" />
            </button>

            {/* Profile Dropdown Menu */}
            {dropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-64 bg-surface-container-lowest rounded-2xl shadow-xl border border-outline-variant/80 py-2 z-50 animate-fadeIn divide-y divide-outline-variant/40">
                {/* User Summary */}
                <div className="px-4 py-2.5">
                  <div className="font-bold text-xs text-charcoal">{user.full_name}</div>
                  <div className="text-[11px] text-charcoal-muted truncate">{user.email}</div>
                  <div className="mt-2 flex items-center justify-between text-[11px] bg-surface-container-low px-2 py-1 rounded-lg">
                    <span className="text-charcoal font-medium">Profile Completion</span>
                    <span className="font-bold text-primary">{completionPercent}%</span>
                  </div>
                  {completionPercent < 100 && (
                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        openOnboarding();
                      }}
                      className="mt-2 w-full text-center text-[11px] py-1 bg-primary text-white font-semibold rounded-lg hover:bg-[#B84A24] transition flex items-center justify-center space-x-1"
                    >
                      <Sparkles className="w-3 h-3" />
                      <span>Complete Onboarding</span>
                    </button>
                  )}
                </div>

                {/* Navigation Items */}
                <div className="py-1">
                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      openProfileSettings('profile');
                    }}
                    className="w-full px-4 py-2 text-left text-xs text-charcoal hover:bg-surface-container flex items-center space-x-2.5"
                  >
                    <User className="w-4 h-4 text-primary" />
                    <span>My Profile</span>
                  </button>
                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      openProfileSettings('health');
                    }}
                    className="w-full px-4 py-2 text-left text-xs text-charcoal hover:bg-surface-container flex items-center space-x-2.5"
                  >
                    <Activity className="w-4 h-4 text-primary" />
                    <span>Health Information</span>
                  </button>
                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      openProfileSettings('medications');
                    }}
                    className="w-full px-4 py-2 text-left text-xs text-charcoal hover:bg-surface-container flex items-center space-x-2.5"
                  >
                    <Pill className="w-4 h-4 text-primary" />
                    <span>My Medications ({profile?.medications?.length || 0})</span>
                  </button>
                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      openProfileSettings('emergency');
                    }}
                    className="w-full px-4 py-2 text-left text-xs text-charcoal hover:bg-surface-container flex items-center space-x-2.5"
                  >
                    <HeartPulse className="w-4 h-4 text-primary" />
                    <span>Emergency Contact</span>
                  </button>
                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      openProfileSettings('account');
                    }}
                    className="w-full px-4 py-2 text-left text-xs text-charcoal hover:bg-surface-container flex items-center space-x-2.5"
                  >
                    <Settings className="w-4 h-4 text-primary" />
                    <span>Account Settings</span>
                  </button>
                </div>

                {/* Logout Action */}
                <div className="pt-1">
                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      logout();
                    }}
                    className="w-full px-4 py-2 text-left text-xs text-error font-semibold hover:bg-error-container/30 flex items-center space-x-2.5"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Log Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center space-x-2">
            <button
              onClick={() => openAuthModal('login')}
              className="px-3.5 py-1.5 text-xs font-semibold text-charcoal hover:text-primary transition rounded-lg hover:bg-surface-container"
            >
              Sign In
            </button>
            <button
              onClick={() => openAuthModal('register')}
              className="px-4 py-1.5 text-xs font-semibold bg-primary hover:bg-[#B84A24] text-white rounded-xl shadow-sm transition flex items-center space-x-1.5"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Create Account</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
