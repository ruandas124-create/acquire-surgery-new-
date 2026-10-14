import React, { useState, useRef, useEffect } from 'react';
import { SearchCriteria } from '../types';
import { 
  Search, 
  MapPin, 
  IndianRupee, 
  Activity, 
  User, 
  Phone, 
  ChevronDown, 
  CheckCircle2, 
  AlertCircle,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface HospitalMatchingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSearchSubmit: (criteria: SearchCriteria) => void;
  isSubmitting?: boolean;
  initialCriteria?: Partial<SearchCriteria>;
}

const COMMON_TREATMENTS = [
  'Knee Replacement',
  'Cataract Surgery',
  'Gallbladder Surgery',
  'Hernia Surgery',
  'Kidney Stone Surgery',
  'Heart Surgery (Bypass / Stent)',
  'Appendectomy',
  'Hip Replacement',
  'Hysterectomy (Gynae Surgery)',
  'Piles / Fissure / Fistula',
  'ACL Reconstruction (Arthroscopy)',
  'Spine Surgery / Slip Disc',
  'IVF & Fertility Treatment',
  'Thyroid Surgery',
  'Other Surgical Treatment'
];

const BUDGET_TIERS = [
  'Below ₹50,000',
  '₹50,000 – ₹1 Lakh',
  '₹1 – ₹2 Lakh',
  '₹2 – ₹5 Lakh',
  '₹5 Lakh+',
  'Enter my own budget'
];

const BANGALORE_LOCATIONS = [
  'Bangalore (All Zones)',
  'South Bangalore (Bannerghatta, Jayanagar, BTM)',
  'North Bangalore (Hebbal, Yelahanka, Yeshwanthpur)',
  'East Bangalore (Whitefield, Indiranagar, Marathahalli)',
  'Central Bangalore (Old Airport Rd, Richmond Rd, MG Rd)',
  'West Bangalore (Rajajinagar, Malleshwaram)',
  'Mysore (Coming Soon)'
];

export const HospitalMatchingModal: React.FC<HospitalMatchingModalProps> = ({
  isOpen,
  onClose,
  onSearchSubmit,
  isSubmitting = false,
  initialCriteria,
}) => {
  const [name, setName] = useState(initialCriteria?.name || '');
  const [mobile, setMobile] = useState(initialCriteria?.mobile || '');
  const [treatment, setTreatment] = useState(initialCriteria?.treatment || 'Knee Replacement');
  const [treatmentQuery, setTreatmentQuery] = useState(initialCriteria?.treatment || '');
  const [isTreatmentOpen, setIsTreatmentOpen] = useState(false);
  const [location, setLocation] = useState(initialCriteria?.city || 'Bangalore (All Zones)');
  const [budget, setBudget] = useState(initialCriteria?.budget || '₹1 – ₹2 Lakh');
  const [customBudget, setCustomBudget] = useState('');
  const [isCustomBudgetMode, setIsCustomBudgetMode] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Inline validation errors
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const dropdownRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // Sync initial criteria when opened
  useEffect(() => {
    if (isOpen) {
      if (initialCriteria?.name) setName(initialCriteria.name);
      if (initialCriteria?.mobile) {
        const cleanMobile = initialCriteria.mobile.replace(/\+91\s?/, '');
        setMobile(cleanMobile);
      }
      if (initialCriteria?.treatment) {
        setTreatment(initialCriteria.treatment);
        setTreatmentQuery(initialCriteria.treatment);
      }
      if (initialCriteria?.budget) {
        setBudget(initialCriteria.budget);
      }
      setErrors({});
      setIsSubmitted(false);
    }
  }, [isOpen, initialCriteria]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (typeof window !== 'undefined') {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, onClose]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsTreatmentOpen(false);
      }
    };
    if (typeof document !== 'undefined') {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, []);

  const validatePhone = (num: string) => {
    const digits = num.replace(/\D/g, '');
    const nationalDigits = digits.length === 12 && digits.startsWith('91') ? digits.slice(2) : digits;
    return nationalDigits.length === 10;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};

    const finalTreatment = treatmentQuery.trim() || treatment;
    if (!finalTreatment) {
      newErrors.treatment = 'Please select or type your required treatment or surgery';
    }

    if (!name.trim()) {
      newErrors.name = 'Please enter your full name';
    }

    if (!mobile.trim()) {
      newErrors.mobile = 'Please enter your 10-digit mobile number';
    } else if (!validatePhone(mobile)) {
      newErrors.mobile = 'Please enter a valid 10-digit Indian mobile number';
    }

    const finalBudget = isCustomBudgetMode && customBudget.trim()
      ? `₹${customBudget}`
      : budget;

    if (!finalBudget) {
      newErrors.budget = 'Please select an indicative budget range';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsSubmitted(true);
    onSearchSubmit({
      name: name.trim(),
      mobile: mobile.trim().startsWith('+91') ? mobile.trim() : `+91 ${mobile.trim()}`,
      treatment: finalTreatment,
      budget: finalBudget,
      city: location.includes('(') ? location.split('(')[0].trim() : location,
    });
  };

  const filteredTreatments = COMMON_TREATMENTS.filter(t =>
    t.toLowerCase().includes(treatmentQuery.toLowerCase())
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <div 
          id="hospital-matching-modal-backdrop"
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-slate-900/60 backdrop-blur-xs overflow-y-auto"
          onClick={onClose}
        >
          <motion.div
            ref={modalRef}
            id="hospital-matching-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-matching-headline"
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden relative max-h-[92vh] sm:max-h-[88vh] flex flex-col my-auto"
          >
            {/* Header */}
            <div className="bg-gradient-to-br from-[#062B61] via-[#0A3B75] to-[#041d42] p-6 sm:p-7 text-white relative shrink-0">
              {/* Close (×) Button */}
              <button
                id="close-matching-modal-btn"
                type="button"
                onClick={onClose}
                className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white/90 hover:text-white transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-semibold mb-2.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span>Acquire Surgery Matching</span>
              </div>

              {/* Exact Required Title */}
              <h2 
                id="modal-matching-headline" 
                className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-white leading-tight"
              >
                Find Your Hospital with Acquire Surgery
              </h2>

              {/* Exact Required Subtitle & Supporting text */}
              <p className="text-xs sm:text-sm text-slate-200 mt-1.5 leading-relaxed max-w-xl">
                Personalized hospital options based on your treatment needs, preferred location, and budget.
              </p>
            </div>

            {/* Scrollable Form Body */}
            <div className="p-5 sm:p-7 overflow-y-auto grow space-y-5 sm:space-y-6">
              {/* Confirmation message displayed after successful submission */}
              {isSubmitted && (
                <div 
                  id="modal-confirmation-banner"
                  className="p-4 sm:p-5 rounded-2xl bg-emerald-50 border border-emerald-200/90 text-slate-800 flex items-start gap-3.5 shadow-xs"
                >
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm sm:text-base font-bold text-emerald-950">
                      Thank you for your submission! Our representative will contact you within 24 hours.
                    </p>
                    <p className="text-xs text-emerald-800">
                      Your request has been safely received by Acquire Surgery.
                    </p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
                
                {/* 1. Treatment / Procedure Field */}
                <div className="space-y-1.5 relative" ref={dropdownRef}>
                  <div className="flex items-center justify-between">
                    <label 
                      htmlFor="modal-treatment-input"
                      className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1"
                    >
                      Treatment / Procedure <span className="text-rose-500">*</span>
                    </label>
                    <span className="text-[11px] text-slate-400 font-medium">Search or select</span>
                  </div>

                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Activity className="w-4 h-4 text-emerald-600" />
                    </div>
                    <input
                      id="modal-treatment-input"
                      type="text"
                      value={treatmentQuery}
                      onFocus={() => setIsTreatmentOpen(true)}
                      onChange={(e) => {
                        setTreatmentQuery(e.target.value);
                        setTreatment(e.target.value);
                        setIsTreatmentOpen(true);
                        if (errors.treatment) setErrors(prev => ({ ...prev, treatment: '' }));
                      }}
                      placeholder="Type or select procedure (e.g., Knee Replacement, Cataract)"
                      className={`w-full pl-10 pr-10 py-3 bg-slate-50/80 hover:bg-white focus:bg-white border rounded-xl text-slate-900 placeholder:text-slate-400 text-sm font-medium transition-all focus:outline-hidden focus:ring-2 focus:ring-[#0A3B75]/20 ${
                        errors.treatment ? 'border-rose-400 ring-1 ring-rose-300' : 'border-slate-300 focus:border-[#0A3B75]'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setIsTreatmentOpen(!isTreatmentOpen)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                      aria-label="Toggle procedures dropdown"
                    >
                      <ChevronDown className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Dropdown Menu */}
                  {isTreatmentOpen && (
                    <div className="absolute z-40 left-0 right-0 mt-1 bg-white border border-slate-200 rounded-2xl shadow-xl max-h-56 overflow-y-auto py-1.5">
                      {filteredTreatments.length > 0 ? (
                        filteredTreatments.map((t) => (
                          <button
                            key={t}
                            type="button"
                            onClick={() => {
                              setTreatment(t);
                              setTreatmentQuery(t);
                              setIsTreatmentOpen(false);
                              if (errors.treatment) setErrors(prev => ({ ...prev, treatment: '' }));
                            }}
                            className={`w-full text-left px-4 py-2 text-xs sm:text-sm flex items-center justify-between hover:bg-blue-50 transition-colors cursor-pointer ${
                              treatment === t ? 'bg-blue-50 font-bold text-[#0A3B75]' : 'text-slate-700'
                            }`}
                          >
                            <span>{t}</span>
                            {treatment === t && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                          </button>
                        ))
                      ) : (
                        <div className="p-3 text-xs text-slate-500">
                          Press tab or click outside to use &ldquo;{treatmentQuery}&rdquo; as a custom procedure.
                        </div>
                      )}
                    </div>
                  )}

                  {errors.treatment && (
                    <p className="text-xs text-rose-600 flex items-center gap-1 font-medium mt-1">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      {errors.treatment}
                    </p>
                  )}
                </div>

                {/* 2. Preferred Location & 3. Budget in Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                  {/* Preferred Location */}
                  <div className="space-y-1.5">
                    <label 
                      htmlFor="modal-location-select"
                      className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1"
                    >
                      Preferred Location <span className="text-slate-400 font-normal text-[11px]">(City / Zone)</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <MapPin className="w-4 h-4 text-[#0A3B75]" />
                      </div>
                      <select
                        id="modal-location-select"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="w-full pl-10 pr-9 py-3 bg-slate-50/80 hover:bg-white focus:bg-white border border-slate-300 focus:border-[#0A3B75] rounded-xl text-slate-900 text-xs sm:text-sm font-semibold transition-all focus:outline-hidden focus:ring-2 focus:ring-[#0A3B75]/20 appearance-none cursor-pointer"
                      >
                        {BANGALORE_LOCATIONS.map((loc) => (
                          <option key={loc} value={loc} disabled={loc.includes('Coming Soon')}>
                            {loc}
                          </option>
                        ))}
                      </select>
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400">
                        <ChevronDown className="w-4 h-4" />
                      </div>
                    </div>
                  </div>

                  {/* Budget Selector Header */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1">
                      Budget Range <span className="text-rose-500">*</span>
                    </label>
                    <div className="text-[11px] text-slate-500 pt-1">
                      Select an indicative bracket below or enter your budget
                    </div>
                  </div>
                </div>

                {/* Budget Range Chips */}
                <div className="space-y-2">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {BUDGET_TIERS.map((tier) => {
                      const isCustomTier = tier === 'Enter my own budget';
                      const isSelected = isCustomTier ? isCustomBudgetMode : (!isCustomBudgetMode && budget === tier);

                      return (
                        <button
                          key={tier}
                          type="button"
                          id={`modal-budget-tier-${tier.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()}`}
                          onClick={() => {
                            if (isCustomTier) {
                              setIsCustomBudgetMode(true);
                            } else {
                              setIsCustomBudgetMode(false);
                              setBudget(tier);
                            }
                            if (errors.budget) setErrors(prev => ({ ...prev, budget: '' }));
                          }}
                          className={`px-3 py-2.5 rounded-xl text-xs font-bold border transition-all text-center flex items-center justify-center gap-1 cursor-pointer ${
                            isSelected
                              ? 'bg-[#0A3B75] text-white border-[#0A3B75] shadow-xs scale-[1.01]'
                              : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-white'
                          }`}
                        >
                          <IndianRupee className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-emerald-300' : 'text-slate-400'}`} />
                          <span className="truncate">{tier}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Custom Budget Input */}
                  {isCustomBudgetMode && (
                    <div className="p-3 bg-blue-50/70 rounded-xl border border-blue-200 flex items-center gap-3">
                      <span className="text-xs font-bold text-[#0A3B75] shrink-0">Approx Target:</span>
                      <div className="relative flex-1">
                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500 font-bold text-xs">₹</span>
                        <input
                          type="number"
                          value={customBudget}
                          onChange={(e) => setCustomBudget(e.target.value)}
                          placeholder="e.g. 150000"
                          className="w-full pl-7 pr-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-[#0A3B75]"
                        />
                      </div>
                      <span className="text-[11px] text-slate-500 hidden sm:inline shrink-0">
                        (Matched to ±20%)
                      </span>
                    </div>
                  )}

                  {errors.budget && (
                    <p className="text-xs text-rose-600 flex items-center gap-1 font-medium mt-1">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      {errors.budget}
                    </p>
                  )}
                </div>

                {/* Patient Contact Info: Name & Mobile */}
                <div className="pt-2 border-t border-slate-100">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Your Name */}
                    <div className="space-y-1.5">
                      <label 
                        htmlFor="modal-patient-name"
                        className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1"
                      >
                        Your Name <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                          <User className="w-4 h-4" />
                        </div>
                        <input
                          id="modal-patient-name"
                          type="text"
                          value={name}
                          onChange={(e) => {
                            setName(e.target.value);
                            if (errors.name) setErrors(prev => ({ ...prev, name: '' }));
                          }}
                          placeholder="Enter full name"
                          className={`w-full pl-10 pr-4 py-2.5 bg-slate-50/80 hover:bg-white focus:bg-white border rounded-xl text-slate-900 placeholder:text-slate-400 text-xs sm:text-sm font-medium transition-all focus:outline-hidden focus:ring-2 focus:ring-[#0A3B75]/20 ${
                            errors.name ? 'border-rose-400 ring-1 ring-rose-300' : 'border-slate-300 focus:border-[#0A3B75]'
                          }`}
                        />
                      </div>
                      {errors.name && (
                        <p className="text-xs text-rose-600 flex items-center gap-1 font-medium mt-1">
                          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                          {errors.name}
                        </p>
                      )}
                    </div>

                    {/* Mobile Number */}
                    <div className="space-y-1.5">
                      <label 
                        htmlFor="modal-patient-mobile"
                        className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1"
                      >
                        Mobile Number <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative flex">
                        <div className="inline-flex items-center px-3 bg-slate-100/90 border border-r-0 border-slate-300 rounded-l-xl text-slate-700 font-semibold text-xs">
                          <span className="mr-1">🇮🇳</span> +91
                        </div>
                        <input
                          id="modal-patient-mobile"
                          type="tel"
                          maxLength={10}
                          value={mobile}
                          onChange={(e) => {
                            const onlyNums = e.target.value.replace(/\D/g, '');
                            setMobile(onlyNums);
                            if (errors.mobile) setErrors(prev => ({ ...prev, mobile: '' }));
                          }}
                          placeholder="Enter 10-digit mobile"
                          className={`w-full pl-3 pr-4 py-2.5 bg-slate-50/80 hover:bg-white focus:bg-white border rounded-r-xl text-slate-900 placeholder:text-slate-400 text-xs sm:text-sm font-medium transition-all focus:outline-hidden focus:ring-2 focus:ring-[#0A3B75]/20 ${
                            errors.mobile ? 'border-rose-400 ring-1 ring-rose-300' : 'border-slate-300 focus:border-[#0A3B75]'
                          }`}
                        />
                      </div>
                      {errors.mobile ? (
                        <p className="text-xs text-rose-600 flex items-center gap-1 font-medium mt-1">
                          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                          {errors.mobile}
                        </p>
                      ) : (
                        <p className="text-[11px] text-slate-400">
                          For coordinator guidance &amp; cost estimate verification.
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Submit CTA & Trust Message */}
                <div className="pt-2">
                  <button
                    id="modal-find-hospitals-submit-btn"
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-[#0A3B75] via-[#026AA7] to-[#059669] hover:from-[#083161] hover:to-[#047857] text-white font-extrabold text-sm sm:text-base py-3.5 px-6 rounded-xl sm:rounded-2xl shadow-md hover:shadow-lg transition-all active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Matching Verified Hospitals...</span>
                      </div>
                    ) : (
                      <>
                        <Search className="w-4 h-4 text-emerald-300" />
                        <span>Find Hospitals</span>
                        <ArrowRight className="w-4 h-4 text-blue-200" />
                      </>
                    )}
                  </button>

                  {/* Secondary Trust Message - Exact Requirement */}
                  <div className="mt-3.5 text-center">
                    <p className="text-xs font-semibold text-slate-600 flex items-center justify-center flex-wrap gap-x-2 gap-y-1">
                      <span className="text-[#0A3B75]">Trusted Hospitals</span>
                      <span className="text-slate-300">•</span>
                      <span className="text-emerald-700">Personalized Options</span>
                      <span className="text-slate-300">•</span>
                      <span className="text-teal-700">Transparent Guidance</span>
                    </p>
                    <p className="text-[11px] text-slate-400 mt-1">
                      No spam, no hidden charges. All patient decisions remain 100% yours.
                    </p>
                  </div>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
