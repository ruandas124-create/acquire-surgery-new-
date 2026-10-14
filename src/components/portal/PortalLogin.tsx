import React, { useState } from 'react';
import { AuthUser, Hospital } from '../../types';
import { authService, REGISTERED_ACCOUNTS } from '../../services/auth';
import { 
  ShieldCheck, 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  Building2, 
  UserCheck, 
  AlertCircle,
  X,
  Sparkles,
  KeyRound
} from 'lucide-react';
import { Logo } from '../Logo';

interface PortalLoginProps {
  hospitals: Hospital[];
  onLoginSuccess: (user: AuthUser) => void;
  onCancel: () => void;
}

export const PortalLogin: React.FC<PortalLoginProps> = ({
  hospitals,
  onLoginSuccess,
  onCancel,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email.trim()) {
      setErrorMessage('Please enter your email address');
      return;
    }

    if (!password.trim()) {
      setErrorMessage('Please enter your password');
      return;
    }

    setIsLoading(true);

    const result = await authService.loginWithEmailAndPassword(email, password, hospitals);
    setIsLoading(false);

    if (result.success && result.user) {
      onLoginSuccess(result.user);
    } else {
      setErrorMessage(result.error || 'Authentication failed. Please check your credentials.');
    }
  };

  const handleQuickSelectEmail = (sampleEmail: string, samplePassword?: string) => {
    setEmail(sampleEmail);
    setPassword(samplePassword || 'Acquire@8131');
    setErrorMessage('');
  };

  return (
    <div id="acquire-portal-login" className="min-h-[80vh] flex items-center justify-center py-10 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        {/* Main Card */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-br from-[#062B61] via-[#0A3B75] to-[#041d42] p-7 text-white text-center relative">
            <button
              onClick={onCancel}
              className="absolute top-5 right-5 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-colors cursor-pointer"
              title="Return to Public Website"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex justify-center mb-3">
              <div className="bg-white px-3 py-1.5 rounded-xl shadow-xs inline-block">
                <Logo size="sm" showTagline={false} />
              </div>
            </div>

            <h1 className="text-xl font-extrabold tracking-tight">Portal Sign In</h1>
            <p className="text-xs text-slate-300 mt-1 max-w-xs mx-auto">
              Enter your email and password to access your Admin or Hospital Partner dashboard.
            </p>

            <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] font-semibold border border-emerald-400/30">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Encrypted Healthcare Authentication</span>
            </div>
          </div>

          {/* Form: Email & Password Only */}
          <div className="p-6 sm:p-7 space-y-5">
            {errorMessage && (
              <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* 1. Username or Email Address Input */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">
                  Username or Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    required
                    autoFocus
                    autoComplete="username"
                    placeholder="e.g. admin or manipal_desk or email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errorMessage) setErrorMessage('');
                    }}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-medium focus:ring-2 focus:ring-[#062B61] focus:border-[#062B61] transition-all"
                  />
                </div>
              </div>

              {/* 2. Password Input */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-700 block">
                    Password
                  </label>
                  <span className="text-[11px] text-slate-400 font-medium">
                    (Admin: Acquire@8131)
                  </span>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    autoComplete="current-password"
                    placeholder="Enter account password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (errorMessage) setErrorMessage('');
                    }}
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-medium focus:ring-2 focus:ring-[#062B61] focus:border-[#062B61] transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-[#062B61] to-[#0A3B75] hover:from-[#052452] hover:to-[#093567] text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>



            {/* Cancel / Return */}
            <div className="text-center pt-2">
              <button
                type="button"
                onClick={onCancel}
                className="text-xs text-slate-500 hover:text-slate-800 font-medium transition-colors cursor-pointer"
              >
                &larr; Back to Acquire SURGERY Website
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
