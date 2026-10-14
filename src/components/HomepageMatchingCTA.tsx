import React from 'react';
import { Search, Sparkles, ArrowRight, ShieldCheck, CheckCircle2, Building2 } from 'lucide-react';
import { motion } from 'motion/react';

interface HomepageMatchingCTAProps {
  onOpenModal: () => void;
}

export const HomepageMatchingCTA: React.FC<HomepageMatchingCTAProps> = ({ onOpenModal }) => {
  return (
    <div 
      id="homepage-matching-cta-section"
      className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 sm:-mt-10 relative z-20"
    >
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="bg-white rounded-3xl border border-slate-200/90 shadow-xl shadow-blue-950/5 relative overflow-hidden p-6 sm:p-8 md:p-10 transition-all hover:border-blue-300/80 group"
      >
        {/* Subtle top brand accent line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#0A3B75] via-[#0284C7] to-[#059669]" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8">
          {/* Text Content */}
          <div className="text-center md:text-left space-y-2.5 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/60 text-xs font-semibold text-[#0A3B75]">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>Personalized Matching</span>
            </div>

            {/* Exact Required Headline */}
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-snug">
              Find Your Hospital with Acquire Surgery
            </h2>

            {/* Exact Required Short Description */}
            <p className="text-sm sm:text-base text-slate-600 font-medium leading-relaxed">
              Explore trusted hospital options matched to your needs and budget.
            </p>

            {/* Subtitle / Promise */}
            <p className="text-xs text-slate-500 leading-normal hidden sm:block">
              Tell us what you need, and Acquire Surgery will help you explore trusted hospital options that match your treatment, location, and budget.
            </p>
          </div>

          {/* Action Button */}
          <div className="shrink-0 w-full md:w-auto flex flex-col items-center md:items-end gap-2.5">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              id="homepage-open-matching-popup-btn"
              onClick={onOpenModal}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-gradient-to-r from-[#0A3B75] via-[#026AA7] to-[#059669] hover:from-[#083161] hover:to-[#047857] text-white font-extrabold text-base px-8 py-4 rounded-2xl shadow-md hover:shadow-lg transition-all cursor-pointer"
            >
              <Search className="w-4 h-4 text-emerald-300" />
              <span>Find Hospitals</span>
              <ArrowRight className="w-4 h-4 text-blue-200" />
            </motion.button>

            <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              Free guidance • 100% confidential
            </span>
          </div>
        </div>

        {/* Bottom Feature Badges */}
        <div className="mt-6 pt-5 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-600">
          <div className="flex items-center gap-2 justify-center sm:justify-start">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-semibold text-slate-700">Verified NABH Centers</span>
          </div>
          <div className="flex items-center gap-2 justify-center sm:justify-start">
            <CheckCircle2 className="w-4 h-4 text-[#0A3B75] shrink-0" />
            <span className="font-semibold text-slate-700">Indicative Pricing Guides</span>
          </div>
          <div className="flex items-center gap-2 justify-center sm:justify-start">
            <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
            <span className="font-semibold text-slate-700">Zero Patient Charge</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
