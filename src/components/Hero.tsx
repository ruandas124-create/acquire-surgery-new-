import React from 'react';
import { Search, Phone, ShieldCheck, HeartPulse, Building2, CheckCircle2, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

interface HeroProps {
  onFindHospitalsClick: () => void;
  onTalkToTeamClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onFindHospitalsClick,
  onTalkToTeamClick,
}) => {
  return (
    <section id="hero-section" className="relative pt-6 pb-12 md:pt-12 md:pb-16 overflow-hidden bg-gradient-to-b from-blue-50/80 via-sky-50/40 to-white">
      {/* Soft ambient background glows */}
      <div className="absolute -top-32 right-0 w-[480px] h-[480px] bg-emerald-100/40 rounded-full blur-3xl -z-10 pointer-events-none" />
      <div className="absolute top-40 -left-20 w-[420px] h-[420px] bg-blue-100/50 rounded-full blur-3xl -z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Centered Hero Text Content */}
        <motion.div 
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="max-w-4xl mx-auto text-center space-y-6 flex flex-col items-center"
        >
          {/* 5-second clarity badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-blue-200 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold text-[#0A3B75] tracking-wide">
              Bangalore’s Dedicated Hospital Discovery &amp; Budget Platform
            </span>
          </div>

          {/* Exact Required Heading */}
          <h1 className="text-3xl sm:text-5xl lg:text-5xl xl:text-[3.25rem] font-extrabold text-slate-900 tracking-tight leading-[1.15] max-w-3xl">
            Find a <span className="text-[#0A3B75]">Trusted Hospital</span> That Fits Your{' '}
            <span className="text-emerald-700">Treatment &amp; Budget</span>
          </h1>

          {/* Exact Required Subheading */}
          <p className="text-base sm:text-lg text-slate-600 font-normal leading-relaxed max-w-2xl mx-auto">
            Tell us your surgery or treatment and budget. We help you discover suitable hospitals in Bangalore and understand your options before you decide.
          </p>

          {/* Action CTAs */}
          <div className="pt-1 flex flex-col sm:flex-row items-center justify-center gap-3.5 w-full sm:w-auto">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              id="hero-primary-find-hospitals-btn"
              onClick={onFindHospitalsClick}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-[#0A3B75] hover:bg-[#08305f] text-white font-bold text-base px-7 py-3.5 rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer"
            >
              <Search className="w-4 h-4 text-emerald-300" />
              <span>Find Hospitals</span>
              <ArrowRight className="w-4 h-4 text-blue-200" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              id="hero-secondary-talk-team-btn"
              onClick={onTalkToTeamClick}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-800 font-bold text-base px-6 py-3.5 rounded-xl border border-slate-300 shadow-xs hover:border-slate-400 transition-all cursor-pointer"
            >
              <Phone className="w-4 h-4 text-emerald-600" />
              <span>Talk to Our Team</span>
            </motion.button>
          </div>

          {/* Exact Required Trust Line */}
          <div className="pt-1 flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5 text-xs font-semibold text-slate-600">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#0A3B75]" />
              Trusted guidance
            </span>
            <span className="text-slate-300">•</span>
            <span className="flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-emerald-600" />
              Clear hospital options
            </span>
            <span className="text-slate-300">•</span>
            <span className="flex items-center gap-1.5">
              <HeartPulse className="w-4 h-4 text-teal-600" />
              Budget-focused search
            </span>
          </div>

          {/* Reassurance Checklist */}
          <div className="pt-2 grid grid-cols-1 sm:grid-cols-3 gap-2.5 w-full max-w-2xl mx-auto">
            <div className="p-2.5 rounded-xl bg-white/90 border border-slate-200/80 shadow-xs flex items-center justify-center sm:justify-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="text-xs font-medium text-slate-700">Verified NABH Centers</span>
            </div>
            <div className="p-2.5 rounded-xl bg-white/90 border border-slate-200/80 shadow-xs flex items-center justify-center sm:justify-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#0A3B75] shrink-0" />
              <span className="text-xs font-medium text-slate-700">Zero Patient Charge</span>
            </div>
            <div className="p-2.5 rounded-xl bg-white/90 border border-slate-200/80 shadow-xs flex items-center justify-center sm:justify-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
              <span className="text-xs font-medium text-slate-700">Cashless TPA Guidance</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
