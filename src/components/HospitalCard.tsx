import React from 'react';
import { Hospital, HospitalCategory } from '../types';
import { 
  MapPin, 
  CheckCircle2, 
  ShieldCheck, 
  Sparkles, 
  PhoneCall, 
  ChevronRight, 
  Info,
  Building2,
  Bed,
  Calendar
} from 'lucide-react';

interface HospitalCardProps {
  hospital: Hospital;
  selectedTreatment?: string;
  selectedBudget?: string;
  onViewDetails: (hospital: Hospital) => void;
  onRequestAssistance: (hospital: Hospital) => void;
}

const CATEGORY_STYLES: Record<HospitalCategory, {
  badge: string;
  border: string;
  accentText: string;
  desc: string;
}> = {
  'Premium Hospital': {
    badge: 'bg-blue-50 text-[#0A3B75] border-blue-200',
    border: 'border-blue-100 hover:border-blue-300',
    accentText: 'text-[#0A3B75]',
    desc: 'Advanced facilities and broader service options.',
  },
  'Standard Hospital': {
    badge: 'bg-sky-50 text-sky-800 border-sky-200',
    border: 'border-sky-100 hover:border-sky-300',
    accentText: 'text-sky-700',
    desc: 'Hospitals offering commonly required treatment facilities.',
  },
  'Budget-Friendly Hospital': {
    badge: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    border: 'border-emerald-100 hover:border-emerald-300',
    accentText: 'text-emerald-700',
    desc: 'Hospitals offering more economical options.',
  },
  'Specialty Hospital': {
    badge: 'bg-teal-50 text-teal-800 border-teal-200',
    border: 'border-teal-100 hover:border-teal-300',
    accentText: 'text-teal-700',
    desc: 'Dedicated center of clinical excellence for specific conditions.',
  },
};

export const HospitalCard: React.FC<HospitalCardProps> = ({
  hospital,
  selectedTreatment,
  selectedBudget,
  onViewDetails,
  onRequestAssistance,
}) => {
  const categoryStyle = CATEGORY_STYLES[hospital.category] || CATEGORY_STYLES['Standard Hospital'];

  return (
    <div
      id={`hospital-card-${hospital.id}`}
      className={`bg-white rounded-2xl border ${categoryStyle.border} shadow-xs hover:shadow-lg transition-all duration-200 overflow-hidden flex flex-col justify-between`}
    >
      <div>
        {/* Top Image + Category Ribbon */}
        <div className="relative h-44 sm:h-48 w-full overflow-hidden bg-slate-100">
          <img
            src={hospital.imageUrl}
            alt={hospital.name}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

          {/* Category Badge */}
          <div className="absolute top-3 left-3">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border shadow-xs backdrop-blur-md bg-white/95 ${categoryStyle.badge}`}>
              <Building2 className="w-3.5 h-3.5" />
              <span>{hospital.category}</span>
            </span>
          </div>

          {/* Rating Badge */}
          <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-lg border border-slate-200 shadow-xs flex items-center gap-1 text-xs font-bold text-slate-800">
            <span className="text-amber-500">★</span>
            <span>{hospital.rating.toFixed(1)}</span>
            <span className="text-[10px] text-slate-500 font-normal">({hospital.reviewCount})</span>
          </div>

          {/* Location on image overlay */}
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs font-medium">
            <span className="inline-flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
              <span>{hospital.location}, {hospital.city}</span>
            </span>
            <span className="text-slate-200 text-[11px]">
              Est. {hospital.establishedYear} • {hospital.bedCount}+ Beds
            </span>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-5 sm:p-6 space-y-4">
          {/* Hospital Name & Category Tagline */}
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug hover:text-[#0A3B75] transition-colors">
              {hospital.name}
            </h3>
            <p className="text-xs text-slate-500 mt-1 italic flex items-center gap-1">
              <Info className="w-3 h-3 text-slate-400 shrink-0" />
              <span>{categoryStyle.desc}</span>
            </p>
          </div>

          {/* Treatment Suitability Information - No cost displayed */}
          <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200/90 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-700 font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{selectedTreatment ? `${selectedTreatment} Unit` : 'Surgical & Treatment Care'}</span>
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 text-[#0A3B75] border border-blue-200">
                Matched Option
              </span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              We use your budget to help identify suitable hospital options. Connect with an Acquire Surgery representative to explore doctor availability and admission guidance.
            </p>
          </div>

          {/* Specialties Pills */}
          <div>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
              Key Specialties:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {hospital.specialties.slice(0, 4).map(s => (
                <span
                  key={s}
                  className="px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700 text-xs font-medium border border-slate-200/60"
                >
                  {s}
                </span>
              ))}
              {hospital.specialties.length > 4 && (
                <span className="text-[11px] text-slate-500 self-center pl-1">
                  +{hospital.specialties.length - 4} more
                </span>
              )}
            </div>
          </div>

          {/* Key Facilities Highlights */}
          <div className="space-y-1 pt-1 border-t border-slate-100">
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-600">
              {hospital.facilities.slice(0, 3).map((f, i) => (
                <span key={i} className="inline-flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>{f}</span>
                </span>
              ))}
            </div>
          </div>

          {/* Short Description */}
          <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
            {hospital.description}
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="p-5 pt-0 sm:p-6 sm:pt-0 grid grid-cols-2 gap-3">
        <button
          id={`view-details-${hospital.id}`}
          onClick={() => onViewDetails(hospital)}
          className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl border border-slate-300 hover:border-slate-400 bg-white hover:bg-slate-50 text-slate-800 text-xs sm:text-sm font-bold transition-all cursor-pointer"
        >
          <span>View Details</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        </button>

        <button
          id={`get-assistance-${hospital.id}`}
          onClick={() => onRequestAssistance(hospital)}
          className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-[#0A3B75] hover:bg-[#08305f] text-white text-xs sm:text-sm font-bold transition-all shadow-xs hover:shadow-md cursor-pointer"
        >
          <PhoneCall className="w-3.5 h-3.5 text-emerald-300" />
          <span>Get Assistance</span>
        </button>
      </div>
    </div>
  );
};
