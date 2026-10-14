import React from 'react';
import { CheckCircle2, Phone, ArrowRight, ShieldCheck, HeartHandshake, X } from 'lucide-react';
import { motion } from 'motion/react';

interface ConfirmationModalProps {
  isOpen: boolean;
  name: string;
  treatment: string;
  mobile: string;
  onClose: () => void;
  onBackToOptions: () => void;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  name,
  treatment,
  mobile,
  onClose,
  onBackToOptions,
}) => {
  if (!isOpen) return null;

  return (
    <div
      id="representative-support-confirmation-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.25 }}
        className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 relative overflow-hidden text-center"
        onClick={e => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Icon */}
        <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto mb-4 shadow-xs">
          <CheckCircle2 className="w-9 h-9 text-emerald-600" />
        </div>

        {/* Exact Required Headline */}
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          We&apos;re Here to Support You
        </h2>

        {/* Exact Required Thank You Copy */}
        <p className="text-sm sm:text-base text-slate-700 leading-relaxed max-w-md mx-auto mt-3 font-medium">
          Thank you, <strong className="text-slate-900 font-bold">{name || 'Patient'}</strong>. We have received your request for{' '}
          <strong className="text-[#0A3B75] font-bold">{treatment || 'your treatment'}</strong>.
        </p>

        {/* Exact Required Contact Body */}
        <div className="my-5 p-4.5 rounded-2xl bg-slate-50 border border-slate-200 text-left space-y-2.5">
          <p className="text-sm text-slate-700 leading-relaxed">
            An Acquire Surgery representative will contact you on your registered mobile number{' '}
            <strong className="text-slate-900">({mobile})</strong> to help you understand your available hospital options.
          </p>
          <div className="flex items-center gap-2 text-xs text-slate-500 pt-1.5 border-t border-slate-200">
            <HeartHandshake className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Independent, patient-first decision support in Bangalore.</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          {/* Exact Required Button */}
          <button
            id="modal-view-hospital-options-btn"
            onClick={onBackToOptions}
            className="w-full bg-[#0A3B75] hover:bg-[#08305f] text-white font-bold text-base py-3.5 px-6 rounded-xl shadow-md hover:shadow-lg transition-all active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>View Hospital Options</span>
            <ArrowRight className="w-4 h-4 text-blue-200" />
          </button>

          <a
            id="modal-call-direct-btn"
            href="tel:+919429693887"
            className="w-full inline-flex items-center justify-center gap-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-sm py-3 px-6 rounded-xl border border-emerald-200 transition-colors"
          >
            <Phone className="w-4 h-4 text-emerald-600" />
            <span>Call Coordinator (+91 94296 93887)</span>
          </a>
        </div>
      </motion.div>
    </div>
  );
};
