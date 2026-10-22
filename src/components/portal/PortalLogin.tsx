import React, { useState } from 'react';
import { AuthUser, Hospital } from '../../types';
import { authService } from '../../services/auth';
import { 
  ShieldCheck, 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  AlertCircle,
  X,
  Stethoscope,
  MapPin
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
      setErrorMessage('Please enter your administrator or hospital partner email address');
      return;
    }

    if (!password.trim()) {
      setErrorMessage('Please enter your account password');
      return;
    }

    setIsLoading(true);

    const result = await authService.loginWithEmailAndPassword(email, password, hospitals);
    setIsLoading(false);

    if (result.success && result.user) {
      onLoginSuccess(result.user);
    } else {
      setErrorMessage(result.error || 'Invalid credentials. Please verify your email and password.');
    }
  };

  return (
    <div id="acquire-portal-login" className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <div className="w-full max-w-md">
        {/* Main Card */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-[#0B1E3B] p-8 text-white text-center relative border-b border-slate-800">
            <button
              onClick={onCancel}
              className="absolute top-4 right-4 p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer"
              title="Return to Public Website"
              aria-label="Close login dialog"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex justify-center mb-3">
              <div className="bg-white px-3 py-1.5 rounded-lg shadow-sm inline-block">
                <Logo size="sm" showTagline={false} />
              </div>
            </div>

            <h1 className="text-xl font-bold tracking-tight text-white">Healthcare Portal Login</h1>
            <p className="text-xs text-slate-300 mt-1.5 max-w-xs mx-auto">
              Secure authentication for Master Admin, Care Coordinators &amp; Hospital Partners.
            </p>

            <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/15 text-teal-300 text-[11px] font-semibold border border-teal-500/30">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
              <span>Encrypted Healthcare Management System</span>
            </div>
          </div>

          {/* Form */}
          <div className="p-6 sm:p-8 space-y-5">
            {errorMessage && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2.5">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span className="font-medium">{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Username / Email */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">
                  Work Email or Username
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    autoFocus
                    autoComplete="username"
                    placeholder="e.g. Admin@acquire.com or hospital_admin"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errorMessage) setErrorMessage('');
                    }}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-medium focus:ring-2 focus:ring-[#0B1E3B] focus:border-[#0B1E3B] transition-all bg-slate-50/50 focus:bg-white"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-700 block">
                    Password
                  </label>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
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
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-medium focus:ring-2 focus:ring-[#0B1E3B] focus:border-[#0B1E3B] transition-all bg-slate-50/50 focus:bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-2.5 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-3 py-3 px-4 rounded-xl bg-[#0B1E3B] hover:bg-[#081528] text-white text-xs sm:text-sm font-bold shadow-sm hover:shadow transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 active:scale-[0.99]"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Authenticating...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In to Healthcare Portal</span>
                    <ArrowRight className="w-4 h-4 text-teal-300" />
                  </>
                )}
              </button>
            </form>

            {/* Return Link */}
            <div className="text-center pt-1">
              <button
                type="button"
                onClick={onCancel}
                className="text-xs text-slate-500 hover:text-[#0B1E3B] font-medium transition-colors cursor-pointer"
              >
                &larr; Return to Patient Website
              </button>
            </div>
          </div>
        </div>

        {/* Security Footer Note */}
        <div className="text-center mt-5 text-[11px] text-slate-500 space-y-1">
          <div className="flex items-center justify-center gap-1.5 font-semibold text-slate-700">
            <Stethoscope className="w-3.5 h-3.5 text-teal-600" />
            <span>Acquire Surgery is a subsidiary of Sulegai Mobile Apps Private Limited.</span>
          </div>
          <div className="flex items-center justify-center gap-1 text-[10px] text-slate-500">
            <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
            <span>No. 7, 1st Floor, 8th Main, 4th Cross, S.L.V Indl Area, Peenya 2nd Stage, Bangalore – 560058</span>
          </div>
        </div>
      </div>
    </div>
  );
};
