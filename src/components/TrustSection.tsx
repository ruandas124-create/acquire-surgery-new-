import React from 'react';
import { ShieldCheck, IndianRupee, Layers, UserCheck } from 'lucide-react';
import { motion } from 'motion/react';

export const TrustSection: React.FC = () => {
  const cards = [
    {
      id: 'trust-card-guidance',
      title: 'Trusted Guidance',
      description: 'Understand your hospital options before making an important decision.',
      icon: ShieldCheck,
      iconColor: 'text-[#0A3B75]',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-100',
    },
    {
      id: 'trust-card-budget',
      title: 'Budget-Friendly Search',
      description: 'Explore hospitals that may fit your treatment budget.',
      icon: IndianRupee,
      iconColor: 'text-emerald-700',
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-100',
    },
    {
      id: 'trust-card-options',
      title: 'Multiple Options',
      description: 'See different hospital options instead of relying on a single choice.',
      icon: Layers,
      iconColor: 'text-[#0284C7]',
      bgColor: 'bg-sky-50',
      borderColor: 'border-sky-100',
    },
    {
      id: 'trust-card-support',
      title: 'Personal Support',
      description: 'Our representative can help you understand the next steps.',
      icon: UserCheck,
      iconColor: 'text-teal-700',
      bgColor: 'bg-teal-50',
      borderColor: 'border-teal-100',
    },
  ];

  return (
    <section id="trust-section" className="py-14 sm:py-18 bg-white border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-[#0A3B75] text-xs font-bold mb-2.5">
            <span>Patient-First Service</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Why Choose Acquire Surgery?
          </h2>
          <p className="text-sm sm:text-base text-slate-600 mt-2">
            Clear, balanced, and responsible information to help you evaluate your hospital choices in Bangalore with confidence.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.id}
                id={card.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                whileHover={{ y: -4 }}
                className={`p-6 rounded-2xl border ${card.borderColor} bg-white shadow-xs hover:shadow-md transition-all flex flex-col`}
              >
                <div className={`w-12 h-12 rounded-xl ${card.bgColor} flex items-center justify-center mb-4 shrink-0`}>
                  <Icon className={`w-6 h-6 ${card.iconColor}`} />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  {card.title}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {card.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
