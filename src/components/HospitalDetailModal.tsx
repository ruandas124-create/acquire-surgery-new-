import React from 'react';
import { Hospital } from '../types';
import { 
  X, 
  MapPin, 
  Phone, 
  Building2, 
  CheckCircle2, 
  ShieldCheck, 
  Award, 
  Bed, 
  Calendar,
  CreditCard,
  PhoneCall,
  Sparkles,
  Info
} from 'lucide-react';

interface HospitalDetailModalProps {
  hospital: Hospital | null;
  selectedTreatment?: string;
  isOpen: boolean;
  onClose: () => void;
  onRequestAssistance: (hospital: Hospital) => void;
}

export const HospitalDetailModal: React.FC<HospitalDetailModalProps> = ({
  hospital,
  selectedTreatment,
  isOpen,
  onClose,
  onRequestAssistance,
}) => {
  if (!isOpen || !hospital) return null;

  return (
    <div
      id="hospital-detail-dialog"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-150"
    >
      <div
        className="bg-white rounded-3xl max-w-3xl w-full my-6 shadow-2xl border border-slate-100 overflow-hidden relative"
        onClick={e => e.stopPropagation()}
      >
        {/* Header Hero Image */}
        <div className="relative h-56 sm:h-64 w-full bg-slate-100">
          <img
            src={hospital.imageUrl}
            alt={hospital.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-transparent" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2.5 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-md transition-colors"
            aria-label="Close details"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Title & Category over image */}
          <div className="absolute bottom-4 left-4 right-4 text-white">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white text-[#0A3B75] shadow-xs mb-2">
              <Building2 className="w-3.5 h-3.5" />
              <span>{hospital.category}</span>
            </span>
            <h2 className="text-xl sm:text-3xl font-extrabold tracking-tight">
              {hospital.name}
            </h2>
            <p className="text-xs sm:text-sm text-slate-200 mt-1 flex items-center gap-1">
              <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{hospital.address}</span>
            </p>
          </div>
        </div>

        {/* Modal Scrollable Content */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[65vh] overflow-y-auto">
          {/* Key Quick Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 text-center">
              <span className="text-[11px] font-medium text-slate-500 block">Rating</span>
              <span className="text-base font-bold text-slate-900 flex items-center justify-center gap-1 mt-0.5">
                <span className="text-amber-500">★</span> {hospital.rating}
                <span className="text-xs text-slate-400 font-normal">({hospital.reviewCount})</span>
              </span>
            </div>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 text-center">
              <span className="text-[11px] font-medium text-slate-500 block">Bed Capacity</span>
              <span className="text-base font-bold text-slate-900 mt-0.5 block">
                {hospital.bedCount}+ Beds
              </span>
            </div>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 text-center">
              <span className="text-[11px] font-medium text-slate-500 block">Established</span>
              <span className="text-base font-bold text-slate-900 mt-0.5 block">
                {hospital.establishedYear}
              </span>
            </div>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 text-center">
              <span className="text-[11px] font-medium text-slate-500 block">Accreditation</span>
              <span className="text-base font-bold text-emerald-700 mt-0.5 block truncate">
                {hospital.accreditations.join(', ')}
              </span>
            </div>
          </div>

          {/* About Hospital */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-2">
              About the Institution
            </h4>
            <p className="text-sm text-slate-700 leading-relaxed">
              {hospital.description}
            </p>
          </div>

          {/* Surgical & Treatment Capabilities */}
          <div className="border border-slate-200 rounded-2xl p-4 sm:p-5 bg-slate-50/50">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h4 className="text-base font-bold text-slate-900">
                  Surgical &amp; Treatment Capabilities
                </h4>
                <p className="text-xs text-slate-500">
                  Clinical departments and surgical specialties available at this hospital
                </p>
              </div>
              <span className="text-[11px] bg-blue-100/70 text-[#0A3B75] px-2.5 py-1 rounded-md font-semibold">
                Verified Facilities
              </span>
            </div>

            <div className="space-y-2 mt-3">
              {hospital.treatmentEstimates.map(est => {
                const isMatch = selectedTreatment && est.treatmentName.toLowerCase().includes(selectedTreatment.toLowerCase());
                return (
                  <div
                    key={est.treatmentName}
                    className={`p-3 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs transition-colors ${
                      isMatch
                        ? 'bg-blue-50/80 border-blue-300 ring-1 ring-blue-300'
                        : 'bg-white border-slate-200'
                    }`}
                  >
                    <div>
                      <span className="font-bold text-slate-900 text-sm block">
                        {est.treatmentName}
                        {isMatch && (
                          <span className="ml-2 text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">
                            Your Selected Surgery
                          </span>
                        )}
                      </span>
                      {est.notes && (
                        <span className="text-slate-500 text-[11px] block mt-0.5">
                          {est.notes}
                        </span>
                      )}
                    </div>
                    <div className="text-left sm:text-right sm:shrink-0 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200/60">
                      Specialist &amp; Facility Active
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-3 p-3 bg-blue-50/70 rounded-xl border border-blue-200/70 text-xs text-slate-700 flex items-start gap-2">
              <Info className="w-4 h-4 text-[#0A3B75] shrink-0 mt-0.5" />
              <span>
                <strong>Guidance Note:</strong> We use your budget to help identify suitable hospital options. Exact admission charges, room selection, and surgery details are shared transparently through an Acquire Surgery representative upon doctor assessment.
              </span>
            </div>
          </div>

          {/* Key Facilities & Cashless Insurance */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <h5 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Hospital Infrastructure &amp; Amenities
              </h5>
              <ul className="space-y-1.5 text-xs text-slate-700">
                {hospital.facilities.map((fac, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span>{fac}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <h5 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
                <CreditCard className="w-4 h-4 text-[#0A3B75]" />
                Cashless Insurance &amp; TPA Empanelled
              </h5>
              <div className="flex flex-wrap gap-1.5">
                {hospital.insuranceCashless.map((ins, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 bg-white border border-slate-200 rounded-md text-xs font-medium text-slate-700"
                  >
                    {ins}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 sm:p-6 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-slate-500 text-center sm:text-left">
            Have questions about this hospital? Speak directly with our coordinator.
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="w-1/2 sm:w-auto px-4 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-semibold text-slate-700 hover:bg-white cursor-pointer"
            >
              Close
            </button>
            <button
              onClick={() => {
                onClose();
                onRequestAssistance(hospital);
              }}
              className="w-1/2 sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#0A3B75] hover:bg-[#08305f] text-white text-xs sm:text-sm font-bold shadow-xs transition-all cursor-pointer"
            >
              <PhoneCall className="w-4 h-4 text-emerald-300" />
              <span>Get Assistance Here</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
