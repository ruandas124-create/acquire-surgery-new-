import React from 'react';
import { ClipboardList, Compass, Scale, Headphones, ArrowRight } from 'lucide-react';

interface HowItWorksProps {
  onStartSearch: () => void;
}

export const HowItWorks: React.FC<HowItWorksProps> = ({ onStartSearch }) => {
  const steps = [
    {
      number: '1',
      title: 'Tell Us Your Need',
      desc: 'Enter your name, mobile number, surgery/treatment and budget.',
      icon: ClipboardList,
      color: 'from-blue-600 to-[#0A3B75]',
      bgBadge: 'bg-blue-50 text-[#0A3B75]',
    },
    {
      number: '2',
      title: 'Explore Hospital Options',
      desc: 'See hospitals that may fit your treatment requirements and budget.',
      icon: Compass,
      color: 'from-sky-500 to-blue-600',
      bgBadge: 'bg-sky-50 text-sky-700',
    },
    {
      number: '3',
      title: 'Compare Your Options',
      desc: 'Review hospital type, location and estimated treatment cost.',
      icon: Scale,
      color: 'from-teal-500 to-emerald-600',
      bgBadge: 'bg-teal-50 text-teal-700',
    },
    {
      number: '4',
      title: 'Get Personal Support',
      desc: 'An Acquire Surgery representative contacts you to help with the next step.',
      icon: Headphones,
      color: 'from-emerald-500 to-emerald-700',
      bgBadge: 'bg-emerald-50 text-emerald-800',
    },
  ];

  return (
    <section id="how-it-works-section" className="py-12 sm:py-16 bg-slate-50 border-t border-slate-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-slate-200 text-slate-700 text-xs font-semibold mb-2.5 shadow-xs">
            <span>Simple 4-Step Process</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            How Acquire Surgery Works
          </h2>
          <p className="text-sm sm:text-base text-slate-600 mt-2">
            A straightforward, patient-centric flow designed to make hospital decision-making clear and reassuring.
          </p>
        </div>

        {/* 4 Cards with responsive connection flow */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={step.number}
                id={`how-it-works-step-${step.number}`}
                className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md transition-all relative flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className={`w-8 h-8 rounded-full ${step.bgBadge} font-extrabold text-sm flex items-center justify-center`}>
                      {step.number}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-700">
                      <Icon className="w-5 h-5 text-slate-700" />
                    </div>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-2">
                    {step.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {step.desc}
                  </p>
                </div>

                {idx < steps.length - 1 && (
                  <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 z-10">
                    <div className="w-6 h-6 rounded-full bg-white border border-slate-200 shadow-xs flex items-center justify-center text-slate-400">
                      <ArrowRight className="w-3 h-3" />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom micro-CTA */}
        <div className="mt-10 text-center">
          <button
            onClick={onStartSearch}
            className="inline-flex items-center gap-2 bg-[#0A3B75] hover:bg-[#08305f] text-white font-bold text-sm px-6 py-3 rounded-xl shadow-xs hover:shadow-md transition-all active:scale-[0.98] cursor-pointer"
          >
            <span>Start Exploring Hospitals Now</span>
            <ArrowRight className="w-4 h-4 text-emerald-300" />
          </button>
        </div>
      </div>
    </section>
  );
};
