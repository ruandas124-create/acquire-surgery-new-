import React, { useState } from 'react';
import { 
  ClipboardList, 
  IndianRupee, 
  Building2, 
  GitCompare, 
  UserCheck, 
  ArrowRight, 
  CheckCircle2, 
  HelpCircle, 
  ShieldCheck, 
  ChevronDown,
  Sparkles,
  Phone
} from 'lucide-react';
import { motion } from 'motion/react';

interface HowItWorksPageProps {
  onStartSearch: () => void;
  onTalkToTeam: () => void;
}

export const HowItWorksPage: React.FC<HowItWorksPageProps> = ({
  onStartSearch,
  onTalkToTeam,
}) => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const steps = [
    {
      number: '1',
      title: 'Tell Us Your Surgery or Treatment Need',
      summary: 'Define your clinical procedure and family requirements.',
      details: [
        'Select or search for the specific surgery needed (e.g. Knee Replacement, Cataract, Gallbladder, Hernia, Angioplasty).',
        'Share patient contact details so our team can coordinate with you directly.',
        'Choose your preferred area in Bangalore if convenient travel is a consideration.',
      ],
      icon: ClipboardList,
      color: 'text-[#0A3B75]',
      bg: 'bg-blue-50',
    },
    {
      number: '2',
      title: 'Set Your Budget Comfort Level',
      summary: 'Tell us what expense range feels comfortable for your family.',
      details: [
        'Select a realistic budget bracket (e.g. Under ₹50,000, ₹1–2 Lakh, ₹2–5 Lakh, or specify a custom figure).',
        'Indicate whether you will be using private health insurance, corporate mediclaim, or self-pay.',
        'We use this financial guidance to identify hospitals that align with your financial boundaries without compromising clinical care.',
      ],
      icon: IndianRupee,
      color: 'text-emerald-700',
      bg: 'bg-emerald-50',
    },
    {
      number: '3',
      title: 'Explore Matching Hospital Options',
      summary: 'Discover suitable hospitals across Bangalore.',
      details: [
        'Our database filters institutions based on surgical department experience, clinical infrastructure, and budget fit.',
        'Hospitals are categorized neutrally: Premium Hospitals, Standard Hospitals, Budget-Friendly Hospitals, and Specialty Centers.',
        'Review hospital accreditations (NABH, NABL), bed capacity, and intensive care setups.',
      ],
      icon: Building2,
      color: 'text-[#0284C7]',
      bg: 'bg-sky-50',
    },
    {
      number: '4',
      title: 'Compare Options & Understand Cost Drivers',
      summary: 'Review room types, indicative package costs, and implant specs.',
      details: [
        'Understand how room categories (general ward vs twin sharing vs private room) influence surgical theatre charges.',
        'Clarify implant specifications (e.g. titanium vs ceramic joints, monofocal vs trifocal lenses) and their pricing impact.',
        'Verify cashless TPA network tie-ups so insurance pre-authorizations are arranged smoothly.',
      ],
      icon: GitCompare,
      color: 'text-indigo-700',
      bg: 'bg-indigo-50',
    },
    {
      number: '5',
      title: 'Get 1-on-1 Personal Coordinator Support',
      summary: 'An Acquire Surgery representative assists you through the next steps.',
      details: [
        'A healthcare navigator calls you to answer questions and clarify doubts.',
        'We help coordinate second opinions and doctor consultation appointments.',
        'Zero pressure, zero bias: you retain complete freedom to decide what is best for your family.',
      ],
      icon: UserCheck,
      color: 'text-emerald-700',
      bg: 'bg-emerald-50',
    },
  ];

  const faqs = [
    {
      q: 'Does Acquire Surgery charge patients any fee for this service?',
      a: 'No. Acquire Surgery is 100% free for patients and their families. There are zero advisory charges, hidden costs, or consultation markup fees.',
    },
    {
      q: 'Are the displayed surgery costs final or estimated?',
      a: 'All displayed surgery figures are estimated indicative costs based on typical institutional tariff schedules in Bangalore. The actual cost will depend on the final treatment plan, treating doctor, patient comorbidities, room selection, and hospital stay duration.',
    },
    {
      q: 'Does Acquire Surgery recommend only expensive private hospitals?',
      a: 'Not at all. We believe healthcare must be affordable and transparent. We feature reputable trust hospitals, budget-friendly NABH-accredited community hospitals, standard multi-specialties, and premium tertiary institutions.',
    },
    {
      q: 'Can Acquire Surgery help with cashless health insurance / TPA approvals?',
      a: 'Yes. Our coordinators help you understand whether your insurance policy has a cashless network tie-up with your shortlisted hospital and what documents you need for pre-authorization.',
    },
    {
      q: 'Does Acquire Surgery replace medical advice from doctors?',
      a: 'No. Acquire Surgery provides discovery, transparency, and patient decision support. All clinical diagnoses and medical decisions must always be made in consultation with qualified healthcare professionals.',
    },
  ];

  return (
    <div id="how-it-works-detailed-page" className="py-10 sm:py-16 bg-slate-50/50 min-h-[85vh]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-xs font-bold text-[#0A3B75] mb-3">
            <span>Patient Guidance Methodology</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            How Acquire Surgery Works
          </h1>
          <p className="mt-3 text-base sm:text-lg text-slate-600 leading-relaxed">
            A clear, transparent, patient-first process designed to take the confusion out of choosing a hospital in Bangalore.
          </p>
        </div>

        {/* Detailed 5-Step Deep Dive */}
        <div className="space-y-6 mb-16">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs"
              >
                <div className="flex flex-col sm:flex-row sm:items-start gap-5">
                  <div className="shrink-0 flex items-center sm:flex-col gap-3">
                    <div className={`w-12 h-12 rounded-2xl ${step.bg} flex items-center justify-center font-extrabold text-lg text-slate-800 shadow-xs`}>
                      {step.number}
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center">
                      <Icon className={`w-5 h-5 ${step.color}`} />
                    </div>
                  </div>

                  <div className="grow space-y-3">
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                        Step {step.number}
                      </span>
                      <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-0.5">
                        {step.title}
                      </h2>
                      <p className="text-sm font-medium text-slate-600 mt-1">
                        {step.summary}
                      </p>
                    </div>

                    <div className="bg-slate-50/80 rounded-2xl p-4 border border-slate-100 space-y-2">
                      {step.details.map((detail, dIdx) => (
                        <div key={dIdx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{detail}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Patient Decision FAQs Section */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs mb-12">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold mb-2">
              <HelpCircle className="w-3.5 h-3.5 text-[#0A3B75]" />
              <span>Frequently Asked Questions</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Common Questions from Patients &amp; Families
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, fIdx) => (
              <div
                key={fIdx}
                className="border border-slate-200 rounded-2xl overflow-hidden transition-colors"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === fIdx ? null : fIdx)}
                  className="w-full flex items-center justify-between p-4.5 text-left font-bold text-sm sm:text-base text-slate-900 hover:bg-slate-50 cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${openFaq === fIdx ? 'rotate-180' : ''}`} />
                </button>
                {openFaq === fIdx && (
                  <div className="px-4.5 pb-4.5 text-xs sm:text-sm text-slate-600 leading-relaxed bg-slate-50/50 border-t border-slate-100">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* CTA Box */}
        <div className="bg-gradient-to-r from-[#0A3B75] to-[#047857] rounded-3xl p-8 text-white text-center shadow-lg">
          <h2 className="text-2xl sm:text-3xl font-extrabold">
            Ready to Explore Suitable Hospitals in Bangalore?
          </h2>
          <p className="mt-2 text-sm sm:text-base text-blue-100 max-w-xl mx-auto">
            Enter your treatment and budget to see suitable hospital options, or speak directly with our coordinator team.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3.5">
            <button
              onClick={onStartSearch}
              className="px-6 py-3 bg-white text-[#0A3B75] font-bold text-sm rounded-xl shadow-md hover:bg-slate-50 cursor-pointer flex items-center gap-2"
            >
              <span>Find Hospitals Within Your Budget</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={onTalkToTeam}
              className="px-6 py-3 bg-white/15 hover:bg-white/25 text-white font-bold text-sm rounded-xl border border-white/20 cursor-pointer flex items-center gap-2"
            >
              <Phone className="w-4 h-4 text-emerald-300" />
              <span>Talk to Our Team (+91 94296 93887)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
