import React from 'react';
import { Activity, IndianRupee, Building2, GitCompare, UserCheck, ArrowRight, ArrowDown } from 'lucide-react';
import { motion } from 'motion/react';

interface HowWeHelpDiagramProps {
  onStartSearch?: () => void;
}

export const HowWeHelpDiagram: React.FC<HowWeHelpDiagramProps> = ({ onStartSearch }) => {
  const steps = [
    {
      number: '1',
      title: 'Tell Us Your Treatment',
      description: 'Surgery or treatment you need.',
      icon: Activity,
      iconColor: 'text-[#0A3B75]',
      badgeBg: 'bg-blue-50 border-blue-200 text-[#0A3B75]',
    },
    {
      number: '2',
      title: 'Set Your Budget',
      description: 'Tell us what you are comfortable spending.',
      icon: IndianRupee,
      iconColor: 'text-emerald-700',
      badgeBg: 'bg-emerald-50 border-emerald-200 text-emerald-800',
    },
    {
      number: '3',
      title: 'Explore Hospital Options',
      description: 'See suitable hospitals in Bangalore.',
      icon: Building2,
      iconColor: 'text-[#0284C7]',
      badgeBg: 'bg-sky-50 border-sky-200 text-sky-800',
    },
    {
      number: '4',
      title: 'Compare Your Options',
      description: 'Review hospital type, location and estimated cost.',
      icon: GitCompare,
      iconColor: 'text-indigo-700',
      badgeBg: 'bg-indigo-50 border-indigo-200 text-indigo-800',
    },
    {
      number: '5',
      title: 'Get Personal Support',
      description: 'An Acquire Surgery representative contacts you to help with the next step.',
      icon: UserCheck,
      iconColor: 'text-emerald-700',
      badgeBg: 'bg-emerald-50 border-emerald-200 text-emerald-800',
    },
  ];

  return (
    <section id="how-acquire-surgery-helps" className="py-16 md:py-20 bg-white border-y border-slate-100 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-50 border border-blue-200/80 text-xs font-bold text-[#0A3B75] mb-3">
            <span>Transparent 5-Step Process</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            How Acquire Surgery Helps You
          </h2>
          <p className="mt-3 text-base sm:text-lg text-slate-600">
            We simplify your hospital selection journey from first inquiry to personal coordinator support.
          </p>
        </div>

        {/* Desktop Process Flow Diagram */}
        <div className="hidden lg:grid grid-cols-5 gap-4 relative">
          {/* Subtle Connecting Line across steps */}
          <div className="absolute top-1/3 left-10 right-10 h-0.5 bg-gradient-to-r from-blue-200 via-emerald-200 to-teal-200 -z-0" />

          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                whileHover={{ y: -4 }}
                className="relative z-10 flex flex-col items-center text-center p-5 rounded-2xl bg-white border border-slate-200 shadow-xs hover:shadow-md transition-all group"
              >
                {/* Step badge */}
                <div className={`w-8 h-8 rounded-full border flex items-center justify-center font-extrabold text-xs mb-3 shadow-xs ${step.badgeBg}`}>
                  {step.number}
                </div>

                {/* Main Icon */}
                <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-200/90 flex items-center justify-center mb-4 group-hover:bg-blue-50/50 group-hover:border-blue-200 transition-colors">
                  <Icon className={`w-7 h-7 ${step.iconColor}`} />
                </div>

                {/* Step Title & Subtitle */}
                <h3 className="text-sm font-bold text-slate-900 mb-1.5 leading-snug">
                  {step.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {step.description}
                </p>

                {/* Small indicator */}
                {idx < steps.length - 1 && (
                  <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white border border-slate-200 shadow-xs flex items-center justify-center text-slate-400 z-20">
                    <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Mobile / Tablet Vertical Process Flow Diagram */}
        <div className="lg:hidden space-y-4 max-w-lg mx-auto">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <React.Fragment key={step.number}>
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.35, delay: idx * 0.08 }}
                  className="flex items-start gap-4 p-4.5 rounded-2xl bg-white border border-slate-200 shadow-xs"
                >
                  <div className="shrink-0 flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-full border flex items-center justify-center font-bold text-xs ${step.badgeBg}`}>
                      {step.number}
                    </div>
                  </div>

                  <div className="grow">
                    <div className="flex items-center gap-2 mb-1">
                      <Icon className={`w-4 h-4 ${step.iconColor}`} />
                      <h3 className="text-base font-bold text-slate-900">
                        {step.title}
                      </h3>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </motion.div>

                {idx < steps.length - 1 && (
                  <div className="flex justify-center -my-2 text-slate-300">
                    <ArrowDown className="w-4 h-4 text-blue-400 animate-bounce" />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Reassurance Footer inside diagram */}
        <div className="mt-12 text-center">
          <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto">
            Acquire Surgery is completely free for patients. We assist with factual hospital comparisons, room options, and cashless insurance paperwork.
          </p>
          {onStartSearch && (
            <div className="mt-4">
              <button
                onClick={onStartSearch}
                className="inline-flex items-center gap-2 text-sm font-bold text-[#0A3B75] hover:text-[#08305f] hover:underline cursor-pointer"
              >
                <span>Ready to start? Enter your treatment and budget</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
