import React, { useState } from 'react';
import { Hospital } from '../types';
import { HospitalCard } from './HospitalCard';
import { Building2, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';

interface FeaturedHospitalCategoriesProps {
  hospitals: Hospital[];
  onViewHospitalDetails: (hospital: Hospital) => void;
  onRequestAssistance: (hospital: Hospital) => void;
  onExploreAllHospitals: () => void;
}

export const FeaturedHospitalCategories: React.FC<FeaturedHospitalCategoriesProps> = ({
  hospitals,
  onViewHospitalDetails,
  onRequestAssistance,
  onExploreAllHospitals,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const categories = [
    {
      name: 'All',
      label: 'All Categories',
      desc: 'Explore diverse hospital options across Bangalore.',
    },
    {
      name: 'Premium Hospital',
      label: 'Premium Hospital',
      desc: 'Advanced infrastructure, dedicated patient suites, and quaternary surgical facilities.',
    },
    {
      name: 'Standard Hospital',
      label: 'Standard Hospital',
      desc: 'Established multi-specialty centers offering experienced specialists and standard care facilities.',
    },
    {
      name: 'Budget-Friendly Hospital',
      label: 'Budget-Friendly Hospital',
      desc: 'NABH-accredited facilities offering economical care options while maintaining high clinical standards.',
    },
    {
      name: 'Specialty Hospital',
      label: 'Specialty Hospital',
      desc: 'Dedicated single-discipline centers of excellence for orthopedics, cardiology, and eye care.',
    },
  ];

  const displayedHospitals = activeCategory === 'All'
    ? hospitals.slice(0, 4)
    : hospitals.filter(h => h.category === activeCategory).slice(0, 4);

  return (
    <section id="hospital-categories-section" className="py-16 md:py-20 bg-slate-50/60 border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-50 border border-blue-200/80 text-xs font-bold text-[#0A3B75] mb-3">
            <Building2 className="w-3.5 h-3.5 text-[#0A3B75]" />
            <span>Bangalore Hospital Landscape</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Hospital Options by Category
          </h2>
          <p className="mt-3 text-base sm:text-lg text-slate-600">
            We categorize hospitals neutrally and respectfully so you can choose based on both clinical needs and your family budget.
          </p>
        </div>

        {/* Category Description Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="p-4.5 rounded-2xl bg-white border border-blue-100 shadow-xs">
            <span className="text-xs font-bold uppercase tracking-wider text-[#0A3B75] block mb-1">
              Premium Hospital
            </span>
            <p className="text-xs text-slate-600 leading-relaxed">
              Advanced facilities, robotic surgical suites, and broader private service options.
            </p>
          </div>

          <div className="p-4.5 rounded-2xl bg-white border border-sky-100 shadow-xs">
            <span className="text-xs font-bold uppercase tracking-wider text-sky-700 block mb-1">
              Standard Hospital
            </span>
            <p className="text-xs text-slate-600 leading-relaxed">
              Experienced surgical faculty and comprehensive inpatient care.
            </p>
          </div>

          <div className="p-4.5 rounded-2xl bg-white border border-emerald-100 shadow-xs">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 block mb-1">
              Budget-Friendly Hospital
            </span>
            <p className="text-xs text-slate-600 leading-relaxed">
              Economical hospital care options meeting required clinical standards.
            </p>
          </div>

          <div className="p-4.5 rounded-2xl bg-white border border-teal-100 shadow-xs">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-700 block mb-1">
              Specialty Hospital
            </span>
            <p className="text-xs text-slate-600 leading-relaxed">
              Dedicated single-discipline center of excellence for specific surgeries and treatments.
            </p>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
          {categories.map(cat => (
            <button
              key={cat.name}
              onClick={() => setActiveCategory(cat.name)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeCategory === cat.name
                  ? 'bg-[#0A3B75] text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Selected Hospitals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayedHospitals.map(hospital => (
            <HospitalCard
              key={hospital.id}
              hospital={hospital}
              onViewDetails={() => onViewHospitalDetails(hospital)}
              onRequestAssistance={() => onRequestAssistance(hospital)}
            />
          ))}
        </div>

        {/* Bottom CTA to full directory */}
        <div className="mt-10 text-center">
          <button
            onClick={onExploreAllHospitals}
            className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 text-[#0A3B75] font-bold text-sm px-6 py-3 rounded-xl border border-slate-300 shadow-xs hover:border-[#0A3B75] transition-all cursor-pointer"
          >
            <span>Explore All Bangalore Hospitals</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};
