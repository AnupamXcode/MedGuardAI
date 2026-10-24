import React from 'react';
import { useAuth } from '../context/AuthContext';
import {
  ShieldAlert,
  LayoutDashboard,
  SearchCheck,
  BarChart3,
  Pill,
  Activity,
  History,
  ShieldCheck,
  UserCheck,
  Plus,
} from 'lucide-react';

interface SidebarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentPath, onNavigate }) => {
  const { isAuthenticated, openProfileSettings, openAuthModal } = useAuth();

  const navItems = [
    { path: 'overview', label: 'Overview', icon: LayoutDashboard },
    { path: 'checker', label: 'Check Medicines', icon: SearchCheck },
    { path: 'results', label: 'Safety Results', icon: BarChart3 },
    { path: 'my-medications', label: 'My Saved Medicines', icon: Pill },
    { path: 'conditions', label: 'Health Conditions', icon: Activity },
    { path: 'history', label: 'Past Checks', icon: History },
    { path: 'about', label: 'About & Safety', icon: ShieldCheck },
  ];

  return (
    <aside className="fixed left-0 top-0 h-full w-72 bg-surface-container-lowest z-50 flex flex-col shadow-[0_1px_8px_rgba(45,36,33,0.06)] border-r border-outline-variant/60">
      {/* Brand & Logo Header */}
      <div
        className="p-6 flex items-center space-x-3 cursor-pointer select-none border-b border-outline-variant/40"
        onClick={() => onNavigate('overview')}
      >
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-600 to-teal-800 text-white flex items-center justify-center font-bold text-lg shadow-md shadow-teal-700/20">
          <ShieldAlert className="w-5 h-5 text-white" />
        </div>
        <div className="flex flex-col min-w-0">
          <span className="font-bold text-lg text-slate-900 tracking-tight leading-none truncate font-heading">
            MediGuard <span className="text-teal-600">AI</span>
          </span>
          <span className="text-[11px] font-medium text-slate-500 truncate mt-1">
            Smart Medicine Safety
          </span>
        </div>
      </div>

      {/* New Check Primary Action */}
      <div className="p-4">
        <button
          onClick={() => onNavigate('checker')}
          className="w-full flex items-center justify-center space-x-2 py-2.5 px-4 bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs rounded-xl shadow-sm transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Check Medicines</span>
        </button>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = currentPath === item.path;
          const Icon = item.icon;
          return (
            <button
              key={item.path}
              onClick={() => onNavigate(item.path)}
              className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition text-left cursor-pointer ${
                isActive
                  ? 'bg-primary-container/70 text-primary font-bold shadow-xs'
                  : 'text-charcoal hover:bg-surface-container hover:text-charcoal'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-primary' : 'text-charcoal-muted'}`} />
              <span>{item.label}</span>
            </button>
          );
        })}

        {/* Profile and Settings in Nav */}
        <div className="pt-2 border-t border-outline-variant/40 my-2">
          {isAuthenticated ? (
            <button
              onClick={() => openProfileSettings('profile')}
              className="w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-charcoal hover:bg-surface-container transition text-left cursor-pointer"
            >
              <UserCheck className="w-4 h-4 text-primary" />
              <span>My Health Profile</span>
            </button>
          ) : (
            <button
              onClick={() => openAuthModal('login')}
              className="w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-primary hover:bg-primary-container/40 transition text-left cursor-pointer"
            >
              <UserCheck className="w-4 h-4 text-primary" />
              <span>Sign In / Create Account</span>
            </button>
          )}
        </div>
      </nav>
    </aside>
  );
};
