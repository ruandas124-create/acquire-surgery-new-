import React from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Building2, 
  MapPin, 
  Phone, 
  Mail, 
  ArrowLeft, 
  CheckCircle2, 
  FileText,
  AlertCircle
} from 'lucide-react';

interface PrivacyPolicyPageProps {
  onBackToHome: () => void;
  onContactClick: () => void;
}

export const PrivacyPolicyPage: React.FC<PrivacyPolicyPageProps> = ({
  onBackToHome,
  onContactClick,
}) => {
  return (
    <div id="privacy-policy-page" className="py-10 sm:py-16 bg-slate-50 min-h-[85vh]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Navigation Breadcrumb / Back */}
        <div className="flex items-center justify-between">
          <button
            onClick={onBackToHome}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#0A3B75] hover:text-[#08305f] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </button>
          <span className="text-xs text-slate-400">Effective Date: October 2026</span>
        </div>

        {/* Header Hero */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-10 shadow-xs space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-[#0A3B75] text-xs font-bold border border-blue-200">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Patient Trust &amp; Privacy Commitment</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Privacy Policy
          </h1>

          {/* Primary Mandated Subsidiary Statement Banner */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-blue-50/90 to-teal-50/80 border border-teal-200/80 flex items-start gap-3.5">
            <Building2 className="w-5 h-5 text-teal-700 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="text-xs uppercase tracking-wider font-extrabold text-teal-900 block">
                Corporate Ownership &amp; Operating Entity
              </span>
              <p className="text-sm font-bold text-slate-900">
                Acquire Surgery is a subsidiary of Sulegai Mobile Apps Private Limited.
              </p>
              <p className="text-xs text-slate-600 leading-relaxed">
                All patient decision support services, hospital coordination facilities, and website operations under the Acquire Surgery brand are managed and operated by Sulegai Mobile Apps Pvt Ltd.
              </p>
            </div>
          </div>
        </div>

        {/* Main Content Sections */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-8 text-slate-700 text-sm leading-relaxed">
          
          {/* 1. Introduction & Operating Entity */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#0A3B75]" />
              <span>1. Introduction &amp; Ownership</span>
            </h2>
            <p>
              This Privacy Policy explains how <strong>Sulegai Mobile Apps Pvt Ltd</strong> (&ldquo;Company&rdquo;, &ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;us&rdquo;), operating the digital healthcare decision support platform <strong>Acquire Surgery</strong>, collects, processes, protects, and handles user and patient personal information.
            </p>
            <p className="font-semibold text-slate-800 bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs sm:text-sm">
              Acquire Surgery is a subsidiary of Sulegai Mobile Apps Private Limited.
            </p>
            <p>
              By accessing or using our website, patient matching tools, or contacting our helpline, you acknowledge the terms described in this Privacy Policy.
            </p>
          </section>

          {/* 2. Registered Company Address & Contact Information */}
          <section className="space-y-3 pt-4 border-t border-slate-100">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#0A3B75]" />
              <span>2. Corporate &amp; Operating Address</span>
            </h2>
            <p>
              The official company identity and principal registered address of the operator are:
            </p>
            <div className="bg-slate-50 rounded-2xl border border-slate-200 p-4 sm:p-5 space-y-2 text-xs sm:text-sm">
              <div>
                <span className="font-bold text-slate-900 block">Company Name:</span>
                <span className="text-slate-700">Sulegai Mobile Apps Pvt Ltd</span>
              </div>
              <div>
                <span className="font-bold text-slate-900 block">Operating Brand:</span>
                <span className="text-slate-700">Acquire Surgery (A subsidiary of Sulegai Mobile Apps Private Limited)</span>
              </div>
              <div>
                <span className="font-bold text-slate-900 block">Registered Office Address:</span>
                <span className="text-slate-700">No. 7, 1st Floor, 8th Main, 4th Cross, S.L.V Indl Area, Peenya 2nd Stage, Bangalore – 560058</span>
              </div>
              <div className="flex flex-wrap gap-4 pt-1">
                <span className="text-slate-700">
                  <strong>Helpline:</strong> <a href="tel:+919844955100" className="text-[#0A3B75] hover:underline font-semibold">+91 98449 55100</a>
                </span>
                <span className="text-slate-700">
                  <strong>Email:</strong> <a href="mailto:acquireopd@gmail.com" className="text-[#0A3B75] hover:underline font-semibold">acquireopd@gmail.com</a>
                </span>
              </div>
            </div>
          </section>

          {/* 3. Information We Collect */}
          <section className="space-y-3 pt-4 border-t border-slate-100">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Lock className="w-4 h-4 text-[#0A3B75]" />
              <span>3. Information We Collect</span>
            </h2>
            <p>
              When patients or family members use our platform to explore hospital options, we may collect the following information:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm text-slate-600">
              <li><strong>Contact Identifiers:</strong> Name, mobile phone number, and optional email address.</li>
              <li><strong>Treatment Interest:</strong> Selected surgery or procedure (e.g. Knee Replacement, Cataract, Laparoscopic Cholecystectomy, Hernia, Angioplasty).</li>
              <li><strong>Preference Details:</strong> Estimated budget preference, preferred locality or hospital network in Bangalore.</li>
              <li><strong>Technical Identifiers:</strong> Device type, browser information, and aggregated website analytics via Google tag (gtag.js) to improve performance.</li>
            </ul>
          </section>

          {/* 4. Purpose of Use: Zero Lead-Selling */}
          <section className="space-y-3 pt-4 border-t border-slate-100">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>4. Purpose of Data Processing &amp; Strict Confidentiality</span>
            </h2>
            <p>
              We collect this information strictly for the following clinical support purposes:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="font-bold text-slate-900 block mb-1">Direct Patient Assistance</span>
                <span className="text-slate-600">Connecting you with our dedicated hospital navigators within 24 hours to explain indicative costs and hospital options.</span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="font-bold text-slate-900 block mb-1">Hospital Coordination</span>
                <span className="text-slate-600">Sharing case parameters with NABH/NABL accredited hospitals only upon your request and consent.</span>
              </div>
            </div>
            <div className="p-4 rounded-xl bg-emerald-50/80 border border-emerald-200 text-xs sm:text-sm text-emerald-900">
              <strong>Zero Commercial Telemarketing or Lead Selling:</strong> We never sell, lease, auction, or broadcast your personal contact numbers to unauthorized third parties or marketing telemarketers.
            </div>
          </section>

          {/* 5. Data Security & Storage */}
          <section className="space-y-3 pt-4 border-t border-slate-100">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>5. Data Protection &amp; Security</span>
            </h2>
            <p>
              We enforce appropriate administrative, physical, and technical controls to safeguard patient inquiries. Data stored in our secure database systems is protected against unauthorized access, disclosure, or misuse.
            </p>
          </section>

          {/* 6. Medical Advisory Disclaimer */}
          <section className="space-y-3 pt-4 border-t border-slate-100">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600" />
              <span>6. Medical Information Notice</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Acquire Surgery provides hospital discovery, cost comparison estimates, and patient navigation. Our team does not offer independent diagnosis or prescribe medical treatments. Medical decisions must always be made with qualified surgeons and registered healthcare specialists.
            </p>
          </section>

          {/* 7. Grievance Officer & Inquiries */}
          <section className="space-y-3 pt-4 border-t border-slate-100">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-[#0A3B75]" />
              <span>7. Grievance Officer &amp; Privacy Contact</span>
            </h2>
            <p>
              For questions regarding this policy, data correction requests, or privacy concerns, please contact the Grievance Desk:
            </p>
            <div className="bg-slate-50 rounded-2xl border border-slate-200 p-4 sm:p-5 text-xs sm:text-sm space-y-1.5">
              <p><strong>Grievance Officer:</strong> Clinical Operations &amp; Privacy Desk</p>
              <p><strong>Entity:</strong> Sulegai Mobile Apps Pvt Ltd (Operating Acquire Surgery)</p>
              <p><strong>Corporate Relationship:</strong> Acquire Surgery is a subsidiary of Sulegai Mobile Apps Private Limited.</p>
              <p><strong>Address:</strong> No. 7, 1st Floor, 8th Main, 4th Cross, S.L.V Indl Area, Peenya 2nd Stage, Bangalore – 560058</p>
              <p><strong>Direct Helpline:</strong> <a href="tel:+919844955100" className="text-[#0A3B75] hover:underline font-semibold">+91 98449 55100</a></p>
              <p><strong>Email:</strong> <a href="mailto:acquireopd@gmail.com" className="text-[#0A3B75] hover:underline font-semibold">acquireopd@gmail.com</a></p>
            </div>
          </section>

        </div>

        {/* Bottom CTA Box */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">Need personal assistance or have a privacy question?</h3>
            <p className="text-xs text-slate-500">Our patient coordination team is available to assist you directly.</p>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={onContactClick}
              className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-[#0A3B75] text-white text-xs sm:text-sm font-bold hover:bg-[#08305f] transition-all cursor-pointer shadow-xs text-center"
            >
              Contact Coordinators
            </button>
            <button
              onClick={onBackToHome}
              className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-slate-100 text-slate-700 text-xs sm:text-sm font-bold hover:bg-slate-200 transition-all cursor-pointer text-center"
            >
              Back to Home
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
