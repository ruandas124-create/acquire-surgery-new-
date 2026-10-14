import React from 'react';
import { Activity, IndianRupee, Building2, CheckCircle2, ShieldCheck, Stethoscope, FileText } from 'lucide-react';
import { motion } from 'motion/react';

interface BudgetTransparencyProps {
  onExploreOptions?: () => void;
}

export const BudgetTransparency: React.FC<BudgetTransparencyProps> = () => {
  return (
    <section id="budget-transparency-section" className="py-14 sm:py-18 bg-white border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold mb-2.5 border border-emerald-200">
            <IndianRupee className="w-3.5 h-3.5 text-emerald-600" />
            <span>Financial Clarity in Healthcare</span>
          </div>

          {/* Exact Required Heading */}
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Your Budget. Your Options. Your Decision.
          </h2>

          {/* Exact Required Text */}
          <p className="text-base sm:text-lg text-slate-600 mt-3 leading-relaxed">
            Every patient&apos;s needs and budget are different. Acquire Surgery helps you discover hospital options that are relevant to your treatment and budget, so you can make a more informed choice.
          </p>
        </div>

        {/* Visual Showing: Treatment Need + Budget → Suitable Hospital Options → Informed Decision */}
        <div className="p-6 sm:p-8 bg-gradient-to-br from-blue-50/70 via-slate-50 to-emerald-50/70 rounded-3xl border border-slate-200 shadow-xs mb-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative items-center">
            {/* Step A: Treatment Need + Budget */}
            <motion.div 
              whileHover={{ y: -3 }}
              className="bg-white p-6 rounded-2xl border border-blue-200/80 shadow-xs flex flex-col items-center text-center relative"
            >
              <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center mb-4 text-[#0A3B75]">
                <div className="flex items-center gap-1">
                  <Activity className="w-6 h-6 text-[#0A3B75]" />
                  <span className="text-slate-300 font-bold">+</span>
                  <IndianRupee className="w-5 h-5 text-emerald-600" />
                </div>
              </div>
              <span className="text-xs font-bold text-[#0A3B75] uppercase tracking-wider mb-1">Your Input</span>
              <h3 className="text-lg font-extrabold text-slate-900">Treatment Need + Budget</h3>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                You tell us the surgery required and what expense range feels comfortable for your family.
              </p>
            </motion.div>

            {/* Step B: Suitable Hospital Options */}
            <motion.div 
              whileHover={{ y: -3 }}
              className="bg-white p-6 rounded-2xl border border-sky-200/80 shadow-xs flex flex-col items-center text-center relative"
            >
              <div className="w-14 h-14 rounded-2xl bg-sky-50 border border-sky-100 flex items-center justify-center mb-4 text-[#0284C7]">
                <Building2 className="w-7 h-7 text-[#0284C7]" />
              </div>
              <span className="text-xs font-bold text-[#0284C7] uppercase tracking-wider mb-1">Our Matching Engine</span>
              <h3 className="text-lg font-extrabold text-slate-900">Suitable Hospital Options</h3>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                We identify suitable accredited Bangalore hospital options matching your treatment and budget.
              </p>
            </motion.div>

            {/* Step C: Informed Decision */}
            <motion.div 
              whileHover={{ y: -3 }}
              className="bg-white p-6 rounded-2xl border border-emerald-300 shadow-xs flex flex-col items-center text-center ring-2 ring-emerald-400/30"
            >
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center mb-4 text-emerald-700">
                <CheckCircle2 className="w-7 h-7 text-emerald-600" />
              </div>
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider mb-1">Your Outcome</span>
              <h3 className="text-lg font-extrabold text-slate-900">Informed Decision</h3>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                You and your family make your choice with peace of mind, backed by personal representative support.
              </p>
            </motion.div>
          </div>
        </div>

        {/* Cost Factors Transparency Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-5 rounded-2xl border border-slate-200 bg-white">
            <div className="flex items-center gap-2 mb-2 font-bold text-slate-900 text-sm">
              <Building2 className="w-4 h-4 text-[#0A3B75]" />
              <span>Room Category &amp; Bed Type</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              General wards, twin-sharing, private deluxe rooms, and suites carry different room rents and scaled OT procedure tariffs in Bangalore.
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-slate-200 bg-white">
            <div className="flex items-center gap-2 mb-2 font-bold text-slate-900 text-sm">
              <Stethoscope className="w-4 h-4 text-emerald-600" />
              <span>Implants &amp; Consumables</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Joint replacements (titanium vs ceramic), intraocular lenses (monofocal vs multifocal), and surgical meshes influence final hospital bills.
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-slate-200 bg-white">
            <div className="flex items-center gap-2 mb-2 font-bold text-slate-900 text-sm">
              <FileText className="w-4 h-4 text-teal-600" />
              <span>Cashless Insurance TPA Desk</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Our team verifies cashless insurance tie-ups across hospitals to ensure smooth pre-authorizations and minimize out-of-pocket costs.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
