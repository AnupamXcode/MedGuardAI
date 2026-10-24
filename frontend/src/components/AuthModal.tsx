import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { forgotPassword } from '../services/api';
import { ShieldCheck, Mail, Lock, User, Phone, X, AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { showAuthModal, authModalTab, closeAuthModal, login, register, openAuthModal } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (!showAuthModal) return null;

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email || !password) {
      setError('Please provide both email address and password.');
      return;
    }
    setSubmitting(true);
    try {
      await login(email.trim(), password);
    } catch (err: any) {
      setError(err.message || 'Invalid credentials or login failed.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!fullName.trim() || fullName.length < 2) {
      setError('Please enter your full name (minimum 2 characters).');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }
    if (password.length < 6) {
      setError('Password must contain at least 6 characters.');
      return;
    }
    setSubmitting(true);
    try {
      await register({
        full_name: fullName.trim(),
        email: email.trim().toLowerCase(),
        password,
        phone: phone.trim() || undefined,
      });
    } catch (err: any) {
      setError(err.message || 'Registration failed.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    if (!email.trim() || !email.includes('@')) {
      setError('Please enter the email address linked to your account.');
      return;
    }
    if (newPassword.length < 6) {
      setError('New password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match. Please re-enter.');
      return;
    }
    setSubmitting(true);
    try {
      const res = await forgotPassword({
        email: email.trim().toLowerCase(),
        new_password: newPassword,
      });
      setSuccessMsg(res.message || 'Password reset successfully! You can now log in.');
      setPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setError(err.message || 'Failed to reset password.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Top Header Banner with clinical teal gradient */}
        <div className="bg-gradient-to-r from-teal-700 via-teal-600 to-slate-900 p-6 text-white relative">
          <button
            onClick={closeAuthModal}
            className="absolute top-4 right-4 p-1.5 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center space-x-2.5 mb-2">
            <div className="w-9 h-9 rounded-xl bg-white/15 backdrop-blur-md flex items-center justify-center border border-white/20">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <span className="text-xs uppercase tracking-wider font-semibold text-teal-100">MediGuard AI Clinical Suite</span>
          </div>
          <h2 className="text-2xl font-bold font-title-lg tracking-tight">
            {authModalTab === 'login' && 'Welcome Back'}
            {authModalTab === 'register' && 'Create Your Health Account'}
            {authModalTab === 'forgot' && 'Reset Password'}
          </h2>
          <p className="text-xs text-slate-200 mt-1">
            {authModalTab === 'login' && 'Access your personalized interaction guard and medication profile.'}
            {authModalTab === 'register' && 'Setup your profile for automated contraindication checking.'}
            {authModalTab === 'forgot' && 'Provide your registered email to reset your account credentials.'}
          </p>
        </div>

        {/* Tab switchers */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-4 pt-2">
          <button
            type="button"
            onClick={() => { setError(null); setSuccessMsg(null); openAuthModal('login'); }}
            className={`pb-2.5 px-3 text-xs font-semibold transition border-b-2 ${
              authModalTab === 'login'
                ? 'border-teal-600 text-teal-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setError(null); setSuccessMsg(null); openAuthModal('register'); }}
            className={`pb-2.5 px-3 text-xs font-semibold transition border-b-2 ${
              authModalTab === 'register'
                ? 'border-primary text-primary'
                : 'border-transparent text-charcoal-muted hover:text-charcoal'
            }`}
          >
            Register Account
          </button>
          <button
            type="button"
            onClick={() => { setError(null); setSuccessMsg(null); openAuthModal('forgot'); }}
            className={`pb-2.5 px-3 text-xs font-semibold transition border-b-2 ${
              authModalTab === 'forgot'
                ? 'border-primary text-primary'
                : 'border-transparent text-charcoal-muted hover:text-charcoal'
            }`}
          >
            Forgot Password
          </button>
        </div>

        {/* Modal Form Body */}
        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-error-container text-on-error-container text-xs flex items-start space-x-2 border border-error/20">
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0 text-error" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-4 p-3 rounded-lg bg-[#E6F4EA] text-[#137333] text-xs flex items-start space-x-2 border border-[#137333]/20">
              <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0 text-[#137333]" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* LOGIN FORM */}
          {authModalTab === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-charcoal mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-charcoal-muted absolute left-3 top-2.5" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="doctor.name@hospital.org"
                    className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-outline-variant bg-surface-container-low focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary text-charcoal placeholder-charcoal-muted/60 transition"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-charcoal">Password</label>
                  <button
                    type="button"
                    onClick={() => openAuthModal('forgot')}
                    className="text-[11px] text-primary hover:underline font-medium"
                  >
                    Forgot?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-charcoal-muted absolute left-3 top-2.5" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-outline-variant bg-surface-container-low focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary text-charcoal placeholder-charcoal-muted/60 transition"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full mt-2 py-2.5 px-4 rounded-xl bg-primary hover:bg-[#B84A24] text-white font-semibold text-sm shadow-md shadow-primary/20 hover:shadow-lg transition flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                <span>{submitting ? 'Authenticating...' : 'Sign In to MediGuard'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* REGISTRATION FORM */}
          {authModalTab === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-charcoal mb-1">
                  Full Name <span className="text-primary">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-charcoal-muted absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Dr. Eleanor Vance"
                    className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-outline-variant bg-surface-container-low focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary text-charcoal placeholder-charcoal-muted/60 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-charcoal mb-1">
                  Email Address <span className="text-primary">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-charcoal-muted absolute left-3 top-2.5" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="eleanor@clinic.org"
                    className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-outline-variant bg-surface-container-low focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary text-charcoal placeholder-charcoal-muted/60 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-charcoal mb-1">
                  Phone Number <span className="text-charcoal-muted text-[11px] font-normal">(Optional)</span>
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-charcoal-muted absolute left-3 top-2.5" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 (555) 019-2834"
                    className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-outline-variant bg-surface-container-low focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary text-charcoal placeholder-charcoal-muted/60 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-charcoal mb-1">
                  Password <span className="text-primary">*</span>
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-charcoal-muted absolute left-3 top-2.5" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Minimum 6 characters"
                    className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-outline-variant bg-surface-container-low focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary text-charcoal placeholder-charcoal-muted/60 transition"
                  />
                </div>
              </div>

              <div className="text-[11px] text-charcoal-muted bg-surface-container-low p-2.5 rounded-lg border border-outline-variant/60">
                🔒 <strong>Privacy Assurance:</strong> Personal health records are isolated and encrypted per user. Never shared with unapproved third parties.
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-2.5 px-4 rounded-xl bg-primary hover:bg-[#B84A24] text-white font-semibold text-sm shadow-md shadow-primary/20 hover:shadow-lg transition flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                <span>{submitting ? 'Creating Profile...' : 'Complete Registration & Begin Setup'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* FORGOT PASSWORD FORM */}
          {authModalTab === 'forgot' && (
            <form onSubmit={handleForgotSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-charcoal mb-1">Account Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-charcoal-muted absolute left-3 top-2.5" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your.email@hospital.org"
                    className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-outline-variant bg-surface-container-low focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary text-charcoal placeholder-charcoal-muted/60 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-charcoal mb-1">New Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-charcoal-muted absolute left-3 top-2.5" />
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="New secure password"
                    className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-outline-variant bg-surface-container-low focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary text-charcoal placeholder-charcoal-muted/60 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-charcoal mb-1">Confirm New Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-charcoal-muted absolute left-3 top-2.5" />
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter new password"
                    className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-outline-variant bg-surface-container-low focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary text-charcoal placeholder-charcoal-muted/60 transition"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-2.5 px-4 rounded-xl bg-primary hover:bg-[#B84A24] text-white font-semibold text-sm shadow-md shadow-primary/20 hover:shadow-lg transition flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                <span>{submitting ? 'Updating...' : 'Save New Password & Sign In'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
