import React from 'react';
import { Heart, Users, ShieldCheck, ArrowRight, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';

interface FamilyCareSectionProps {
  onFindHospitalClick: () => void;
}

export const FamilyCareSection: React.FC<FamilyCareSectionProps> = ({ onFindHospitalClick }) => {
  return (
    <section id="family-care-section" className="py-16 md:py-20 bg-slate-50/70 border-b border-slate-200/80 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-lg shadow-slate-200/40 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
            {/* Left Column: Warm Emotional Messaging */}
            <motion.div 
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="lg:col-span-7 p-6 sm:p-10 lg:p-14 space-y-5"
            >
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-50 border border-rose-100 text-xs font-bold text-rose-700">
                <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
                <span>Family-First Decision Support</span>
              </div>

              {/* Exact Required Headline */}
              <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
                Choosing a Hospital Shouldn&apos;t Be Confusing
              </h2>

              {/* Exact Required Text */}
              <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
                When a parent or family member needs surgery, finding suitable healthcare facilities and understanding the cost can be difficult. Acquire Surgery helps you explore suitable hospital options based on your treatment needs and budget.
              </p>

              {/* Specific Family Benefits */}
              <div className="pt-2 space-y-3">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-bold text-slate-900">Clear Breakdown of Bangalore Hospital Options</p>
                    <p className="text-xs text-slate-500">Know which hospitals specialize in your family member&apos;s procedure and what room categories exist.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#0A3B75] shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-bold text-slate-900">Understanding Realistic Indicative Costs</p>
                    <p className="text-xs text-slate-500">Plan surgery expenses with confidence and clarity, including implant variations and doctor charges.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-bold text-slate-900">A Supportive Coordinator to Answer Every Question</p>
                    <p className="text-xs text-slate-500">You don&apos;t have to navigate appointments, admission protocols, or insurance paperwork alone.</p>
                  </div>
                </div>
              </div>

              {/* Exact Required CTA */}
              <div className="pt-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  id="family-care-cta-btn"
                  onClick={onFindHospitalClick}
                  className="inline-flex items-center justify-center gap-2.5 bg-[#0A3B75] hover:bg-[#08305f] text-white font-bold text-base px-8 py-3.5 rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer"
                >
                  <Users className="w-4 h-4 text-emerald-300" />
                  <span>Find Your Care</span>
                  <ArrowRight className="w-4 h-4 text-blue-200" />
                </motion.button>
              </div>
            </motion.div>

            {/* Right Column: Realistic Warm Photography of Indian Family */}
            <motion.div 
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="lg:col-span-5 h-72 sm:h-96 lg:h-full min-h-[340px] relative overflow-hidden bg-slate-100"
            >
              <img
                src="https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=1200&q=80"
                alt="Loving Indian adult child having a thoughtful, caring healthcare discussion with their elderly parents at home"
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/10 to-transparent lg:bg-gradient-to-l lg:from-transparent lg:via-slate-950/20 lg:to-slate-950/60" />

              {/* Floating Quote Card */}
              <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-white/95 backdrop-blur-md border border-slate-200/90 shadow-lg text-slate-800">
                <div className="flex items-center gap-2 text-xs font-bold text-[#0A3B75] mb-1">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Patient &amp; Family Reassurance</span>
                </div>
                <p className="text-xs text-slate-700 italic">
                  &ldquo;Having someone objectively explain which Bangalore hospitals match our father&apos;s knee surgery and what the real total cost would be took away all our stress.&rdquo;
                </p>
                <p className="text-[11px] font-semibold text-slate-500 mt-1">
                  — Ramesh &amp; Ananya K., Jayanagar Bangalore
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};
