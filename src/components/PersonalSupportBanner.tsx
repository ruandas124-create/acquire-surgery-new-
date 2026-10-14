import React from 'react';
import { Phone, UserCheck, ShieldCheck, Clock, MessageSquare, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

interface PersonalSupportBannerProps {
  onTalkToCoordinator: () => void;
}

export const PersonalSupportBanner: React.FC<PersonalSupportBannerProps> = ({
  onTalkToCoordinator,
}) => {
  return (
    <section id="personal-representative-support-section" className="py-14 sm:py-18 bg-white border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-[#0A3B75] via-[#026AA7] to-[#047857] rounded-3xl p-8 sm:p-12 text-white shadow-xl relative overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-white/10 rounded-full blur-2xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            <div className="lg:col-span-8 space-y-4 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-emerald-200 text-xs font-bold backdrop-blur-xs">
                <UserCheck className="w-3.5 h-3.5 text-emerald-300" />
                <span>Dedicated Patient Assistance</span>
              </div>

              <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
                Personal Representative Support
              </h2>

              <p className="text-base sm:text-lg text-blue-100 leading-relaxed max-w-2xl">
                Navigating hospitals in Bangalore shouldn&apos;t feel overwhelming. A dedicated Acquire Surgery coordinator helps you compare options, clarify cost components, and assist with admission formalities.
              </p>

              <div className="pt-2 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-blue-50 text-left">
                <div className="flex items-center gap-2 bg-white/10 px-3 py-2 rounded-xl">
                  <ShieldCheck className="w-4 h-4 text-emerald-300 shrink-0" />
                  <span>Independent Guidance</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 px-3 py-2 rounded-xl">
                  <Clock className="w-4 h-4 text-emerald-300 shrink-0" />
                  <span>Quick Response</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 px-3 py-2 rounded-xl">
                  <MessageSquare className="w-4 h-4 text-emerald-300 shrink-0" />
                  <span>100% Free Service</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-col items-center lg:items-end gap-3.5">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                onClick={onTalkToCoordinator}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-white hover:bg-slate-50 text-[#0A3B75] font-extrabold text-base px-7 py-3.5 rounded-xl shadow-lg transition-all cursor-pointer"
              >
                <Phone className="w-4 h-4 text-emerald-600" />
                <span>Request Coordinator Callback</span>
              </motion.button>

              <a
                href="tel:+919429693887"
                className="inline-flex items-center gap-2 text-sm font-semibold text-white/90 hover:text-white transition-colors"
              >
                <span>Or call direct:</span>
                <span className="font-bold underline text-emerald-300">+91 94296 93887</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
