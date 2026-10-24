import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Shield,
  ChevronRight,
  ChevronDown,
  User,
  Activity,
  Pill,
  HeartPulse,
  Settings,
  LogOut,
  Menu,
  X,
  Sparkles,
} from 'lucide-react';

interface HeaderProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  onCheckInteraction: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentPath,
  onNavigate,
  onCheckInteraction,
}) => {
  const {
    user,
    profile,
    isAuthenticated,
    openAuthModal,
    logout,
    openProfileSettings,
    openOnboarding,
  } = useAuth();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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

  // Clean, single-line labels from our current setup (reduced text for clean spacing as in reference image)
  const navItems = isAuthenticated
    ? [
        { path: 'overview', label: 'Overview' },
        { path: 'checker', label: 'Checker' },
        { path: 'results', label: 'Results' },
        { path: 'my-medications', label: 'Saved Meds' },
        { path: 'conditions', label: 'Conditions' },
        { path: 'history', label: 'History' },
        { path: 'about', label: 'About' },
      ]
    : [
        { path: 'overview', label: 'Overview' },
        { path: 'conditions', label: 'Conditions' },
        { path: 'about', label: 'About' },
      ];

  const handleNavClick = (path: string) => {
    setMobileMenuOpen(false);
    onNavigate(path);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-[88px] py-5 flex items-center justify-between gap-6">
        {/* ========================================================= */}
        {/* LEFT: Brand Logo (shrink-0 prevents any overlap) */}
        {/* ========================================================= */}
        <div
          className="flex items-center space-x-3 cursor-pointer select-none group shrink-0"
          onClick={() => handleNavClick('overview')}
        >
          {/* Dark rounded box with cyan/teal shield */}
          <div className="w-10 h-10 rounded-xl bg-[#0B1528] flex items-center justify-center text-teal-400 shadow-sm border border-slate-800 transition-transform group-hover:scale-105">
            <Shield className="w-5 h-5 text-teal-400 stroke-[2.2]" />
          </div>

          <div className="flex flex-col">
            <div className="flex items-center space-x-1">
              <span className="font-bold text-lg text-slate-900 tracking-tight leading-none font-heading">
                Mediguard
              </span>
              <span className="font-bold text-lg text-teal-600 leading-none font-heading">
                AI
              </span>
            </div>
            <span className="text-[9px] font-bold text-slate-400 tracking-widest uppercase mt-1">
              SYSTEM PROTOTYPE
            </span>
          </div>
        </div>

        {/* ========================================================= */}
        {/* CENTER: Clean Single-Line Navigation Links (Desktop) */}
        {/* ========================================================= */}
        <nav className="hidden md:flex items-center justify-center space-x-5 lg:space-x-7 flex-1 px-4">
          {navItems.map((item) => {
            const isActive = currentPath === item.path;
            return (
              <button
                key={item.path}
                type="button"
                onClick={() => handleNavClick(item.path)}
                className={`text-[13px] lg:text-[14px] font-medium transition-colors whitespace-nowrap py-1 cursor-pointer ${
                  isActive
                    ? 'text-[#008060] font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* ========================================================= */}
        {/* RIGHT: Actions (shrink-0 prevents wrapping) */}
        {/* ========================================================= */}
        <div className="flex items-center space-x-3 shrink-0">
          {/* Standout CTA button: "Check an Interaction >" */}
          <button
            type="button"
            onClick={onCheckInteraction}
            className="inline-flex items-center space-x-1.5 px-4 py-2.5 bg-[#008060] hover:bg-[#006e52] text-white text-xs sm:text-sm font-semibold rounded-lg shadow-sm transition-all duration-150 cursor-pointer whitespace-nowrap shrink-0"
          >
            <span>Check an Interaction</span>
            <ChevronRight className="w-4 h-4 stroke-[2.2]" />
          </button>

          {/* User Logged In vs Logged Out State */}
          {!isAuthenticated ? (
            <button
              type="button"
              onClick={() => openAuthModal('login')}
              className="text-xs sm:text-sm font-semibold text-slate-700 hover:text-[#008060] px-3 py-2 rounded-lg hover:bg-slate-100 transition cursor-pointer whitespace-nowrap shrink-0"
            >
              Sign In
            </button>
          ) : (
            <div className="relative shrink-0" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center space-x-2 p-1.5 rounded-xl hover:bg-slate-100 transition border border-transparent hover:border-slate-200 cursor-pointer whitespace-nowrap"
              >
                {/* User avatar */}
                <div className="w-8 h-8 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-xs border border-teal-200 shrink-0">
                  {user?.full_name ? user.full_name.charAt(0).toUpperCase() : 'U'}
                </div>
                <span className="hidden lg:inline text-xs font-semibold text-slate-800 max-w-[100px] truncate">
                  {user?.full_name?.split(' ')[0] || 'Profile'}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500 shrink-0" />
              </button>

              {/* Profile Dropdown Menu */}
              {dropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-fadeIn divide-y divide-slate-100">
                  {/* User Summary */}
                  <div className="px-4 py-2.5">
                    <div className="font-bold text-xs text-slate-900">{user?.full_name}</div>
                    <div className="text-[11px] text-slate-500 truncate">{user?.email}</div>
                    <div className="mt-2 flex items-center justify-between text-[11px] bg-slate-50 px-2 py-1 rounded-lg border border-slate-100">
                      <span className="text-slate-600 font-medium">Profile Progress</span>
                      <span className="font-bold text-teal-700">{completionPercent}%</span>
                    </div>
                    {completionPercent < 100 && (
                      <button
                        type="button"
                        onClick={() => {
                          setDropdownOpen(false);
                          openOnboarding();
                        }}
                        className="mt-2 w-full text-center text-[11px] py-1 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700 transition flex items-center justify-center space-x-1"
                      >
                        <Sparkles className="w-3 h-3" />
                        <span>Finish Profile Setup</span>
                      </button>
                    )}
                  </div>

                  {/* Navigation Items */}
                  <div className="py-1">
                    <button
                      type="button"
                      onClick={() => {
                        setDropdownOpen(false);
                        handleNavClick('profile');
                      }}
                      className="w-full px-4 py-2 text-left text-xs text-slate-700 hover:bg-slate-50 flex items-center space-x-2.5"
                    >
                      <User className="w-4 h-4 text-teal-600" />
                      <span>My Profile</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setDropdownOpen(false);
                        openProfileSettings('health');
                      }}
                      className="w-full px-4 py-2 text-left text-xs text-slate-700 hover:bg-slate-50 flex items-center space-x-2.5"
                    >
                      <Activity className="w-4 h-4 text-teal-600" />
                      <span>Health Conditions</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setDropdownOpen(false);
                        openProfileSettings('medications');
                      }}
                      className="w-full px-4 py-2 text-left text-xs text-slate-700 hover:bg-slate-50 flex items-center space-x-2.5"
                    >
                      <Pill className="w-4 h-4 text-teal-600" />
                      <span>My Saved Medicines ({profile?.medications?.length || 0})</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setDropdownOpen(false);
                        openProfileSettings('emergency');
                      }}
                      className="w-full px-4 py-2 text-left text-xs text-slate-700 hover:bg-slate-50 flex items-center space-x-2.5"
                    >
                      <HeartPulse className="w-4 h-4 text-teal-600" />
                      <span>Emergency Contacts</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setDropdownOpen(false);
                        openProfileSettings('account');
                      }}
                      className="w-full px-4 py-2 text-left text-xs text-slate-700 hover:bg-slate-50 flex items-center space-x-2.5"
                    >
                      <Settings className="w-4 h-4 text-teal-600" />
                      <span>Account Settings</span>
                    </button>
                  </div>

                  {/* Logout Action */}
                  <div className="pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        setDropdownOpen(false);
                        logout();
                      }}
                      className="w-full px-4 py-2 text-left text-xs text-red-600 font-semibold hover:bg-red-50 flex items-center space-x-2.5"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Mobile Menu Hamburger */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 shrink-0"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* MOBILE DROPDOWN DRAWER */}
      {/* ========================================================= */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 py-3 space-y-1 animate-fadeIn">
          {navItems.map((item) => {
            const isActive = currentPath === item.path;
            return (
              <button
                key={item.path}
                type="button"
                onClick={() => handleNavClick(item.path)}
                className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                  isActive
                    ? 'bg-teal-50 text-[#008060] font-bold'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                {item.label}
              </button>
            );
          })}

          <button
            type="button"
            onClick={() => {
              setMobileMenuOpen(false);
              handleNavClick('profile');
            }}
            className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Profile &amp; Settings
          </button>

          {!isAuthenticated ? (
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                openAuthModal('login');
              }}
              className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-semibold text-[#008060] hover:bg-teal-50"
            >
              Sign In to Your Account
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                logout();
              }}
              className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-semibold text-red-600 hover:bg-red-50"
            >
              Sign Out
            </button>
          )}
        </div>
      )}
    </header>
  );
};
