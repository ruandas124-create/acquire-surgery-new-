import React from 'react';
import { 
  ArrowRight, 
  X, 
  CheckCircle2, 
  HeartHandshake,
  MapPin,
  Activity,
  User,
  Phone
} from 'lucide-react';
import { motion } from 'motion/react';
import { Hospital } from '../types';

interface MatchingResultsModalProps {
  isOpen: boolean;
  name: string;
  mobile: string;
  treatment: string;
  location?: string;
  matchingHospitals?: Hospital[];
  onClose: () => void;
  onViewHospitalOptions: () => void;
}

export const MatchingResultsModal: React.FC<MatchingResultsModalProps> = ({
  isOpen,
  name,
  mobile,
  treatment,
  location = 'Bangalore',
  onClose,
  onViewHospitalOptions,
}) => {
  if (!isOpen) return null;

  return (
    <div
      id="matching-hospital-results-modal"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 md:p-6 bg-slate-900/60 backdrop-blur-sm transition-all"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.96 }}
        transition={{ duration: 0.28, ease: 'easeOut' }}
        onClick={e => e.stopPropagation()}
        className="bg-white w-full max-w-xl rounded-t-3xl sm:rounded-3xl shadow-2xl border border-slate-200/90 relative overflow-hidden max-h-[92vh] flex flex-col"
      >
        {/* Top Accent Line */}
        <div className="h-1.5 w-full bg-gradient-to-r from-[#0A3B75] via-[#0284C7] to-[#059669]" />

        {/* Modal Header */}
        <div className="p-5 sm:p-6 pb-3 sm:pb-4 relative border-b border-slate-100 text-center">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800 mb-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Submission Received</span>
          </div>

          {/* Heading */}
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Request Confirmed
          </h2>

          {/* Short Requirement Summary */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-2.5 text-xs">
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-slate-100 text-slate-800 font-semibold border border-slate-200/80">
              <Activity className="w-3.5 h-3.5 text-[#0A3B75]" />
              <span>Treatment: <strong className="font-bold text-slate-900">{treatment}</strong></span>
            </span>
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-slate-100 text-slate-800 font-semibold border border-slate-200/80">
              <MapPin className="w-3.5 h-3.5 text-emerald-600" />
              <span>Location: <strong className="font-bold text-slate-900">{location}</strong></span>
            </span>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 sm:p-6 pt-4 space-y-5 overflow-y-auto">
          {/* Prominent Confirmation Message Box (Replaces hospital count completely) */}
          <div className="p-6 rounded-2xl bg-gradient-to-b from-emerald-50 via-emerald-50/70 to-blue-50/40 border border-emerald-200/90 shadow-xs text-center space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-xs">
              <CheckCircle2 className="w-8 h-8 text-emerald-600" />
            </div>
            <p className="text-base sm:text-lg font-bold text-slate-900 leading-snug max-w-md mx-auto">
              Thank you for your submission! Our representative will contact you within 24 hours.
            </p>
          </div>

          {/* Submission Details Summary Card */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-3 text-left">
            <div className="flex items-center justify-between pb-2.5 border-b border-slate-200/70">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
                Patient &amp; Request Details
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                Logged in System
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
              <div className="p-3 rounded-xl bg-white border border-slate-200/80 flex items-start gap-2.5">
                <User className="w-4 h-4 text-[#0A3B75] shrink-0 mt-0.5" />
                <div>
                  <span className="text-slate-400 block text-[11px] font-medium">Patient Name</span>
                  <span className="font-bold text-slate-900 text-sm">{name || 'Patient'}</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-white border border-slate-200/80 flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <span className="text-slate-400 block text-[11px] font-medium">Contact Number</span>
                  <span className="font-bold text-slate-900 text-sm">{mobile || 'Registered Mobile'}</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-white border border-slate-200/80 flex items-start gap-2.5">
                <Activity className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <span className="text-slate-400 block text-[11px] font-medium">Procedure / Treatment</span>
                  <span className="font-bold text-slate-900 text-sm">{treatment || 'Treatment Inquiry'}</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-white border border-slate-200/80 flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                <div>
                  <span className="text-slate-400 block text-[11px] font-medium">Preferred City</span>
                  <span className="font-bold text-slate-900 text-sm">{location || 'Bangalore'}</span>
                </div>
              </div>
            </div>

            {/* Reassurance Message */}
            <div className="pt-2.5 flex items-start gap-2.5 text-xs text-slate-600 border-t border-slate-200/70">
              <HeartHandshake className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                An Acquire Surgery healthcare coordinator is reviewing your requirements and will reach out to help you explore the best options, compare costs, and assist with hospital admissions and insurance.
              </p>
            </div>
          </div>
        </div>

        {/* Modal Footer CTAs: 1. Close, 2. View Hospitals */}
        <div className="p-4 sm:p-5 border-t border-slate-100 bg-slate-50/50 flex flex-col-reverse sm:flex-row items-center justify-end gap-2.5">
          {/* Button 1: Close */}
          <button
            id="modal-close-results-btn"
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-3 bg-white hover:bg-slate-100 text-slate-700 font-semibold text-sm rounded-xl border border-slate-300 transition-colors cursor-pointer"
          >
            Close
          </button>

          {/* Button 2: View Hospitals */}
          <button
            id="modal-view-hospitals-btn"
            onClick={onViewHospitalOptions}
            className="w-full sm:w-auto bg-[#0A3B75] hover:bg-[#08305f] text-white font-bold text-sm sm:text-base py-3 px-7 rounded-xl shadow-md hover:shadow-lg transition-all active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>View Hospital Options</span>
            <ArrowRight className="w-4 h-4 text-blue-200" />
          </button>
        </div>
      </motion.div>
    </div>
  );
};
