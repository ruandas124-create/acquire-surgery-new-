import React from 'react';
import { Search, HeartHandshake, ShieldCheck, UserCheck, PhoneCall } from 'lucide-react';

interface CareSectionProps {
  onFindHospitalClick: () => void;
  onTalkToCoordinator: () => void;
}

export const CareSection: React.FC<CareSectionProps> = ({
  onFindHospitalClick,
  onTalkToCoordinator,
}) => {
  return (
    <section id="care-trust-section" className="py-12 sm:py-18 bg-gradient-to-b from-slate-50 via-blue-50/40 to-white border-t border-slate-200/70 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-lg shadow-blue-950/5 overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-0 items-center">
          {/* Left Text Content */}
          <div className="p-8 sm:p-12 lg:p-14 lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200/70">
              <HeartHandshake className="w-4 h-4 text-emerald-600" />
              <span>Compassionate Patient Support</span>
            </div>

            <h2 className="text-2xl sm:text-4xl lg:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Healthcare Decisions Should Feel Easier
            </h2>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Choosing a hospital for surgery can be confusing. Acquire Surgery helps simplify the process by bringing hospital options, treatment information and budget considerations together in one place.
            </p>

            {/* Reassuring checklist */}
            <div className="space-y-2.5 pt-2">
              <div className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                <ShieldCheck className="w-5 h-5 text-[#0A3B75] shrink-0 mt-0.5" />
                <span>Zero pressure — you remain 100% in control of where you consult and receive care.</span>
              </div>
              <div className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                <UserCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <span>Dedicated Bangalore coordinators who speak Kannada, English, Hindi, and Tamil.</span>
              </div>
              <div className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                <HeartHandshake className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
                <span>Assistance navigating cashless insurance, empanelled TPAs, and estimate comparisons.</span>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center gap-3.5 pt-4">
              <button
                id="care-section-find-my-hospital-btn"
                onClick={onFindHospitalClick}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#0A3B75] hover:bg-[#08305f] text-white font-bold text-sm sm:text-base px-7 py-3.5 rounded-xl shadow-md hover:shadow-lg transition-all active:scale-[0.98] cursor-pointer"
              >
                <Search className="w-4 h-4 text-emerald-300" />
                <span>Find My Hospital</span>
              </button>

              <button
                onClick={onTalkToCoordinator}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm sm:text-base px-6 py-3.5 rounded-xl transition-all cursor-pointer"
              >
                <PhoneCall className="w-4 h-4 text-emerald-700" />
                <span>Request Coordinator Callback</span>
              </button>
            </div>
          </div>

          {/* Right Image & Visual Frame */}
          <div className="lg:col-span-5 h-full relative min-h-[340px] lg:min-h-[480px] bg-slate-100">
            <img
              src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=1000&q=80"
              alt="Caring healthcare professionals in consultation with patient"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-slate-900/20 to-transparent lg:bg-gradient-to-l lg:from-transparent lg:to-white/10" />

            {/* Floating testimonial / reassurance chip */}
            <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-white/50 shadow-lg text-slate-800 text-xs">
              <div className="flex items-center gap-2 font-bold text-[#0A3B75] mb-1">
                <span>Patient Trust Commitment</span>
              </div>
              <p className="text-slate-600 leading-snug">
                &ldquo;We treat your healthcare need like we would for our own family member — with honest guidance, patient dignity, and financial clarity.&rdquo;
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
