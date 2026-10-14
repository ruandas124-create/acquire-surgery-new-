import React from 'react';
import { Logo } from './Logo';
import { Phone, Mail, MapPin, ShieldAlert, ShieldCheck, HeartPulse, UserCog } from 'lucide-react';

interface FooterProps {
  onNavigate: (view: string) => void;
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenAdmin }) => {
  return (
    <footer id="site-footer" className="bg-slate-900 text-slate-300 pt-12 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 mb-12">
          {/* Brand & Mission */}
          <div className="lg:col-span-4 space-y-4">
            <Logo size="md" variant="white" showTagline={false} />
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed pr-4">
              Acquire Surgery helps patients find suitable hospitals for surgery and treatment in Bangalore based on clinical needs, budget transparency, and dedicated personal assistance.
            </p>
            <div className="flex items-center gap-3 text-xs text-emerald-400 font-semibold">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" />
                Trusted Guidance
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <HeartPulse className="w-4 h-4" />
                Patient-First Care
              </span>
            </div>
          </div>

          {/* Quick Navigation Links */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Platform Navigation
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onNavigate('home')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer text-left"
                >
                  Find Hospitals by Budget
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('costs')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer text-left"
                >
                  Surgery Cost in Bangalore
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('how-it-works')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer text-left"
                >
                  How Acquire Surgery Works
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('about')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer text-left"
                >
                  About Acquire Surgery
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('contact')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer text-left"
                >
                  Contact &amp; Coordinator Support
                </button>
              </li>
              <li className="pt-1">
                <button
                  id="footer-admin-login-btn"
                  onClick={onOpenAdmin}
                  className="hover:text-emerald-400 text-slate-300 hover:text-white transition-colors cursor-pointer text-left inline-flex items-center gap-1.5 font-medium"
                >
                  <UserCog className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Admin &amp; Coordinator Login</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="lg:col-span-5 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Patient Care &amp; Office
            </h4>
            <div className="space-y-2.5 text-xs text-slate-400">
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Helpline: <a href="tel:+919429693887" className="text-white hover:text-emerald-400 font-bold">+91 94296 93887</a></span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Email: <a href="mailto:acquireopd@gmail.com" className="text-white hover:text-emerald-400">acquireopd@gmail.com</a></span>
              </div>
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>12th Main Rd, HAL 2nd Stage, Indiranagar, Bengaluru, Karnataka 560038</span>
              </div>
            </div>
          </div>
        </div>

        {/* Mandatory Medical Disclaimer Box */}
        <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 mb-8 text-xs text-slate-300 space-y-1.5">
          <div className="flex items-center gap-2 font-bold text-amber-300">
            <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Important Medical Disclaimer</span>
          </div>
          <p className="text-[11px] leading-relaxed text-slate-400">
            Acquire Surgery provides verified hospital information and patient assistance. Treatment decisions should always be made in consultation with qualified medical professionals. Treatment costs shown on the platform may be indicative and can vary based on the hospital, doctor, treatment plan and patient requirements.
          </p>
        </div>

        {/* Bottom copyright */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 pt-4 border-t border-slate-800">
          <div>
            &copy; {new Date().getFullYear()} Acquire Surgery. All rights reserved. Patient-first healthcare decision support.
          </div>
          <div className="flex flex-wrap items-center gap-4 text-slate-500">
            <span>Bengaluru, India</span>
            <span>•</span>
            <span>Privacy Policy</span>
            <span>•</span>
            <span>Terms of Assistance</span>
            <span>•</span>
            <button
              id="footer-bottom-admin-login-btn"
              onClick={onOpenAdmin}
              className="hover:text-emerald-400 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer inline-flex items-center gap-1 font-semibold"
            >
              <UserCog className="w-3.5 h-3.5 text-emerald-400" />
              <span>Admin Login</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
