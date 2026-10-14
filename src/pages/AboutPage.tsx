import React from 'react';
import { Logo } from '../components/Logo';
import { 
  ShieldCheck, 
  HeartHandshake, 
  Compass, 
  Users, 
  Award, 
  CheckCircle2, 
  ShieldAlert,
  ArrowRight,
  Phone,
  Mail,
  MapPin
} from 'lucide-react';
import { motion } from 'motion/react';

interface AboutPageProps {
  onStartSearch: () => void;
  onContactClick: () => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({
  onStartSearch,
  onContactClick,
}) => {
  return (
    <div id="about-us-page-container" className="py-10 sm:py-16 bg-slate-50/50 min-h-[85vh]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Top Header */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-xs font-bold text-[#0A3B75] mb-3">
            <Compass className="w-3.5 h-3.5 text-emerald-600" />
            <span>Independent Healthcare Decision Support</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            About Acquire Surgery
          </h1>
          <p className="mt-3 text-base sm:text-lg text-slate-600 leading-relaxed">
            Helping Indian families find trusted hospitals in Bangalore for surgery and specialized treatment based on their clinical requirements and budget.
          </p>
        </div>

        {/* Mission Card */}
        <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 shadow-sm space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                Our Purpose: Transparent Healthcare Decisions
              </h2>
              <p className="text-base text-slate-700 leading-relaxed">
                When a family member or parent needs surgery, finding the right surgical center and hospital can feel overwhelming. Hospital facilities and treatment packages in Bangalore often vary between multi-specialties, single-specialty centers, and community trust institutions.
              </p>
              <p className="text-base text-slate-700 leading-relaxed">
                Acquire Surgery was founded with a singular conviction: <strong>patients and families deserve honest, unbiased information and personal guidance before making an important healthcare decision</strong>.
              </p>
            </div>

            <div className="lg:col-span-5 flex justify-center">
              <Logo variant="official-card" className="w-full max-w-xs shadow-md border-slate-200" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-4">
            <div className="p-5 rounded-2xl bg-blue-50/60 border border-blue-100 space-y-2">
              <ShieldCheck className="w-6 h-6 text-[#0A3B75]" />
              <h3 className="font-bold text-slate-900 text-base">Unbiased Discovery</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                We represent the patient, not hospital commercial quotas. We compare options across all categories fairly and respectfully.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-emerald-50/60 border border-emerald-100 space-y-2">
              <HeartHandshake className="w-6 h-6 text-emerald-700" />
              <h3 className="font-bold text-slate-900 text-base">Zero Patient Charge</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Our decision support, hospital matching, and coordinator guidance are 100% free for patients and their family members.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-sky-50/60 border border-sky-100 space-y-2">
              <Award className="w-6 h-6 text-[#0284C7]" />
              <h3 className="font-bold text-slate-900 text-base">Quality Standards</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                We track NABH and NABL hospital accreditations, intensive care capacities, and surgical specializations in Bangalore.
              </p>
            </div>
          </div>
        </div>

        {/* Ethical Standards & Patient Dignity */}
        <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 shadow-sm space-y-6">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Our Patient Commitments
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-slate-700">
            <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>No commercial lead-selling:</strong> We never sell your personal contact details to third-party telemarketers.</span>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>No discount marketing tricks:</strong> We do not run artificial discounts. We provide realistic indicative cost ranges.</span>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>Respect for all budget tiers:</strong> Budget-friendly hospitals receive equal respect and clinical scrutiny as luxury facilities.</span>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>Human coordinator support:</strong> Real coordinators in Bangalore who answer practical logistical and financial questions.</span>
            </div>
          </div>
        </div>

        {/* Prominent Medical Responsibility Disclaimer */}
        <div className="bg-amber-50/70 rounded-3xl border border-amber-200/90 p-6 sm:p-8 shadow-xs space-y-3">
          <div className="flex items-center gap-2 font-bold text-amber-900 text-base">
            <ShieldAlert className="w-5 h-5 text-amber-700 shrink-0" />
            <span>Important Medical Disclaimer &amp; Responsibility</span>
          </div>
          <p className="text-xs sm:text-sm text-amber-950 leading-relaxed">
            Acquire Surgery provides hospital information, transparent cost estimates, and patient assistance. <strong>Treatment decisions should always be made in consultation with qualified medical professionals.</strong> Displayed surgical package figures are indicative averages based on hospital schedules and can vary depending on patient clinical conditions, doctor recommendations, implant choices, and hospital stay duration.
          </p>
        </div>

        {/* Office & Contact Box */}
        <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-10 shadow-xs flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-xl font-bold text-slate-900">Acquire Surgery Bangalore Operations</h3>
            <p className="text-xs sm:text-sm text-slate-600 flex items-center justify-center md:justify-start gap-1.5">
              <MapPin className="w-4 h-4 text-[#0A3B75]" />
              <span>100 Feet Road, Indiranagar, Bangalore 560038, Karnataka, India</span>
            </p>
            <p className="text-xs sm:text-sm text-slate-600 flex items-center justify-center md:justify-start gap-1.5">
              <Phone className="w-4 h-4 text-emerald-600" />
              <span>Patient Helpline: +91 94296 93887</span>
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={onContactClick}
              className="px-5 py-3 rounded-xl bg-white border border-slate-300 font-bold text-xs sm:text-sm text-slate-800 hover:bg-slate-50 cursor-pointer"
            >
              Contact Team
            </button>
            <button
              onClick={onStartSearch}
              className="px-5 py-3 rounded-xl bg-[#0A3B75] text-white font-bold text-xs sm:text-sm shadow-xs hover:bg-[#08305f] cursor-pointer flex items-center gap-1.5"
            >
              <span>Find Hospitals</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
