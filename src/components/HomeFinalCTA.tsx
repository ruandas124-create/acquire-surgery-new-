import React from 'react';
import { Search, ArrowRight, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';

interface HomeFinalCTAProps {
  onFindHospitalsClick: () => void;
}

export const HomeFinalCTA: React.FC<HomeFinalCTAProps> = ({ onFindHospitalsClick }) => {
  return (
    <section id="home-final-cta-section" className="py-16 sm:py-20 bg-slate-50 border-t border-slate-200">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200 mb-4">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Transparent • Caring • Independent</span>
        </div>

        <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Ready to Find the Right Care with Acquire Surgery?
        </h2>

        <p className="mt-4 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Tell us your surgery needs and budget. Explore accredited Bangalore hospitals with clear cost breakdowns and personal guidance.
        </p>

        <div className="mt-8 flex justify-center">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onFindHospitalsClick}
            className="inline-flex items-center gap-2.5 bg-[#0A3B75] hover:bg-[#08305f] text-white font-extrabold text-base sm:text-lg px-8 py-4 rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer"
          >
            <Search className="w-5 h-5 text-emerald-300" />
            <span>Find Hospitals Within Your Budget</span>
            <ArrowRight className="w-5 h-5 text-blue-200" />
          </motion.button>
        </div>

        <p className="mt-4 text-xs text-slate-500">
          Acquire Surgery provides hospital information and patient assistance. Treatment decisions should always be made in consultation with qualified medical professionals.
        </p>
      </div>
    </section>
  );
};
