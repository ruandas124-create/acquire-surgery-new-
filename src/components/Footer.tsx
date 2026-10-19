import React from 'react';
import { Logo } from './Logo';
import { Phone, Mail, MapPin, ShieldAlert, ShieldCheck, HeartPulse, UserCog, ArrowRight } from 'lucide-react';

interface FooterProps {
  onNavigate: (view: string) => void;
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenAdmin }) => {
  return (
    <footer id="site-footer" className="bg-[#0A192F] text-slate-300 pt-16 pb-28 sm:pb-32 border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 mb-12">
          {/* Brand & Healthcare Mission */}
          <div className="lg:col-span-5 space-y-4">
            <Logo size="md" variant="white" showTagline={false} />
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-sm">
              Acquire Surgery is Bangalore&apos;s independent healthcare decision support platform. We connect patients with accredited surgical hospitals matching their clinical requirements and indicative budget.
            </p>
            <div className="flex flex-wrap items-center gap-3 text-xs text-teal-400 font-semibold pt-1">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                NABH/NABL Accredited Partners
              </span>
              <span className="text-slate-600">·</span>
              <span className="flex items-center gap-1.5">
                <HeartPulse className="w-4 h-4 text-teal-300" />
                Zero Patient Service Charge
              </span>
            </div>
          </div>

          {/* Platform Navigation */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Platform Navigation
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button
                  onClick={() => onNavigate('home')}
                  className="hover:text-teal-300 text-slate-400 hover:text-white transition-colors cursor-pointer text-left flex items-center gap-1.5"
                >
                  <span>Find Hospitals by Budget</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('costs')}
                  className="hover:text-teal-300 text-slate-400 hover:text-white transition-colors cursor-pointer text-left flex items-center gap-1.5"
                >
                  <span>Surgery Cost Guide in Bangalore</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('how-it-works')}
                  className="hover:text-teal-300 text-slate-400 hover:text-white transition-colors cursor-pointer text-left flex items-center gap-1.5"
                >
                  <span>How Acquire Surgery Works</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('about')}
                  className="hover:text-teal-300 text-slate-400 hover:text-white transition-colors cursor-pointer text-left flex items-center gap-1.5"
                >
                  <span>About Our Care Coordination</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('contact')}
                  className="hover:text-teal-300 text-slate-400 hover:text-white transition-colors cursor-pointer text-left flex items-center gap-1.5"
                >
                  <span>Contact Patient Helpline</span>
                </button>
              </li>
              {/* Exactly ONE Admin Login button in the platform navigation list */}
              <li className="pt-2">
                <button
                  id="footer-admin-login-btn"
                  onClick={onOpenAdmin}
                  className="group inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-teal-300 hover:text-white text-xs font-semibold transition-all cursor-pointer"
                  title="Hospital & Master Admin Portal"
                >
                  <UserCog className="w-3.5 h-3.5 text-teal-400 group-hover:text-white transition-colors" />
                  <span>Admin Login</span>
                  <ArrowRight className="w-3 h-3 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Details & Coordinated Desk */}
          <div className="lg:col-span-4 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Patient Care &amp; Support
            </h4>
            <div className="space-y-3 text-xs text-slate-400">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-teal-950/60 border border-teal-800/40 flex items-center justify-center shrink-0">
                  <Phone className="w-4 h-4 text-teal-400" />
                </div>
                <div>
                  <span className="block text-[11px] text-slate-400">24x7 Surgical Coordination</span>
                  <a href="tel:+919429693887" className="text-white hover:text-teal-300 font-bold tabular-nums whitespace-nowrap">
                    +91&nbsp;94296&nbsp;93887
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-950/60 border border-blue-800/40 flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4 text-blue-400" />
                </div>
                <div>
                  <span className="block text-[11px] text-slate-400">Direct Case Inquiries</span>
                  <a href="mailto:acquireopd@gmail.com" className="text-white hover:text-teal-300 font-medium">
                    acquireopd@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-800/80 border border-slate-700/60 flex items-center justify-center shrink-0 mt-0.5">
                  <MapPin className="w-4 h-4 text-slate-300" />
                </div>
                <div>
                  <span className="block text-[11px] text-slate-400">Bangalore Center</span>
                  <span className="text-slate-300 text-xs">
                    12th Main Rd, HAL 2nd Stage, Indiranagar, Bengaluru, Karnataka 560038
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Medical Disclaimer Banner */}
        <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/50 mb-8 text-xs text-slate-300 flex items-start gap-3">
          <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <p className="text-[11px] leading-relaxed text-slate-400">
            <strong className="text-slate-200 font-semibold">Important Medical Notice:</strong> Acquire Surgery is an independent healthcare information and patient decision support platform. Surgical decisions must always be made in consultation with accredited surgeons. Treatment pricing and estimates shown on the platform are indicative averages based on hospital schedules and can vary according to doctor consultation, implant selection, room category, and clinical requirements.
          </p>
        </div>

        {/* Clean Bottom Copyright Bar - NO duplicate Admin Login button here */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 pt-5 border-t border-slate-800/80">
          <div>
            &copy; {new Date().getFullYear()} Acquire Surgery. All rights reserved. Registered healthcare decision support in Bengaluru, Karnataka.
          </div>
          <div className="flex flex-wrap items-center gap-3 text-slate-500 text-[11px]">
            <span>Privacy Policy</span>
            <span>·</span>
            <span>Terms of Assistance</span>
            <span>·</span>
            <span>NABH Partner Network</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
