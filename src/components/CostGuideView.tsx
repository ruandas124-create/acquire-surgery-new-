import React, { useState } from 'react';
import { TreatmentInfo, Hospital } from '../types';
import { 
  Activity, 
  Clock, 
  Calendar, 
  Search, 
  ArrowRight, 
  CheckCircle2, 
  Info,
  Building2
} from 'lucide-react';

interface CostGuideViewProps {
  treatments: TreatmentInfo[];
  hospitals: Hospital[];
  onSelectTreatment: (treatmentName: string) => void;
}

export const CostGuideView: React.FC<CostGuideViewProps> = ({
  treatments,
  hospitals,
  onSelectTreatment,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCat, setSelectedCat] = useState('All');

  const categories = ['All', 'Orthopedics', 'General & Laparoscopic Surgery', 'Cardiology & Cardiac Surgery', 'Ophthalmology', 'Urology', 'Gynecology'];

  const filtered = treatments.filter(t => {
    const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          t.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCat === 'All' || t.category.toLowerCase().includes(selectedCat.toLowerCase());
    return matchesSearch && matchesCategory;
  });

  return (
    <div id="treatment-guide-view" className="py-8 sm:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-[#0A3B75] text-xs font-bold mb-2.5 border border-blue-200">
          <Activity className="w-3.5 h-3.5 text-emerald-600" />
          <span>Bangalore Surgery &amp; Treatment Guide</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Surgeries &amp; Treatments in Bangalore
        </h1>
        <p className="text-sm sm:text-base text-slate-600 mt-2">
          Explore surgical procedures, hospital stay expectations, recovery timelines, and hospital options in Bangalore.
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div className="mb-8 p-4 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search surgery or treatment..."
            className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#0A3B75]"
          >
          </input>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCat(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                selectedCat === cat
                  ? 'bg-[#0A3B75] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Treatment Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(t => {
          // Count hospitals providing this treatment
          const matchingHospCount = hospitals.filter(h =>
            h.treatmentEstimates.some(est => est.treatmentName.toLowerCase().includes(t.name.toLowerCase()))
          ).length;

          return (
            <div
              key={t.id}
              className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-md bg-blue-50 text-[#0A3B75] border border-blue-200/60">
                    {t.category}
                  </span>
                  <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5 text-slate-400" />
                    <span>{matchingHospCount} Hospitals in Blr</span>
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  {t.name}
                </h3>

                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  {t.description}
                </p>

                {/* Treatment Guidance Box (NO COST DISPLAYED) */}
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 mb-4 space-y-1">
                  <div className="text-[11px] font-bold text-slate-800 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Hospital Matching Support</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-snug">
                    We use your budget to help identify suitable hospital options in Bangalore.
                  </p>
                </div>

                {/* Stay & Recovery Timelines */}
                <div className="grid grid-cols-2 gap-2 text-xs mb-4">
                  <div className="bg-slate-50/60 p-2 rounded-lg border border-slate-100 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <div>
                      <span className="text-[10px] text-slate-400 block leading-tight">Typical Stay</span>
                      <span className="font-semibold text-slate-800">{t.typicalStay}</span>
                    </div>
                  </div>
                  <div className="bg-slate-50/60 p-2 rounded-lg border border-slate-100 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <div>
                      <span className="text-[10px] text-slate-400 block leading-tight">Recovery</span>
                      <span className="font-semibold text-slate-800">{t.recoveryDays}</span>
                    </div>
                  </div>
                </div>

                {/* Common Procedure variants */}
                <div className="mb-4">
                  <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider block mb-1">
                    Common Variants:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {t.commonProcedures.map((proc, i) => (
                      <span
                        key={i}
                        className="text-[11px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-700"
                      >
                        {proc}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action */}
              <button
                onClick={() => onSelectTreatment(t.name)}
                className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-blue-50 hover:bg-[#0A3B75] text-[#0A3B75] hover:text-white text-xs sm:text-sm font-bold transition-all cursor-pointer"
              >
                <span>Find Hospitals for {t.name}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
