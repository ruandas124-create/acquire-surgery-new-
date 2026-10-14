import React from 'react';
import { ShieldAlert, Heart, Compass, CheckCircle2, Building, Users } from 'lucide-react';
import { Logo } from './Logo';

export const AboutSection: React.FC = () => {
  return (
    <section id="about-us-section" className="py-12 sm:py-16 bg-white border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column */}
          <div className="lg:col-span-7 space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-[#0A3B75] text-xs font-bold border border-blue-200">
              <Compass className="w-3.5 h-3.5 text-emerald-600" />
              <span>Our Purpose &amp; Ethics</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Helping You Find the Right Care with Acquire Surgery
            </h2>

            <p className="text-base text-slate-700 leading-relaxed">
              Acquire Surgery is built to make hospital and treatment decisions simpler for patients. We help patients explore suitable hospitals based on their treatment needs and budget, while providing personal support when they need it.
            </p>

            <div className="space-y-3 pt-2 text-sm text-slate-600 leading-relaxed">
              <p>
                Navigating surgery can feel overwhelming. Hospital costs in Bangalore often vary significantly between private deluxe facilities, standard accredited multi-specialties, and subsidized charitable trusts.
              </p>
              <p>
                We do not sell leads or force patients into high-margin commercial pipelines. Instead, our role is that of an independent decision-support companion: helping you compare options respectfully, understand the factors behind costs, and connect with hospital coordinators who understand your financial comfort level.
              </p>
            </div>

            {/* Core Values */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <span className="font-bold text-slate-900 text-sm block mb-1">Independent</span>
                <span className="text-xs text-slate-500">Unbiased discovery across multiple hospital categories</span>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <span className="font-bold text-slate-900 text-sm block mb-1">Transparent</span>
                <span className="text-xs text-slate-500">Realistic package ranges and cashless TPA details</span>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <span className="font-bold text-slate-900 text-sm block mb-1">Human Touch</span>
                <span className="text-xs text-slate-500">Caring coordinators to answer your practical questions</span>
              </div>
            </div>
          </div>

          {/* Right Column: Platform Identity & Values Card */}
          <div className="lg:col-span-5 bg-gradient-to-br from-blue-50/80 via-slate-50 to-emerald-50/50 p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm space-y-6">
            <div className="flex items-center gap-3">
              <Logo size="md" />
            </div>

            <div className="space-y-3 text-xs sm:text-sm text-slate-700">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Zero service fee for patients looking for guidance</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Verified Bangalore hospital accreditations (NABH / NABL)</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Cashless mediclaim &amp; corporate insurance support</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Coordinators stationed across key Bangalore healthcare hubs</span>
              </div>
            </div>

            {/* Prominent Medical Disclaimer */}
            <div className="p-4 bg-white rounded-2xl border border-amber-200/80 shadow-xs space-y-2 text-xs">
              <div className="flex items-center gap-2 font-bold text-amber-900">
                <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0" />
                <span>Important Medical Disclaimer</span>
              </div>
              <p className="text-slate-600 leading-relaxed text-[11px]">
                Acquire Surgery provides hospital information and patient assistance. Treatment decisions should always be made in consultation with qualified medical professionals. Treatment costs shown on the platform may be indicative and can vary based on the hospital, doctor, treatment plan and patient requirements.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
