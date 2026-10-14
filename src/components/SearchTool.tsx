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
  ShieldCheck
} from 'lucide-react';

interface SearchToolProps {
  initialCriteria?: Partial<SearchCriteria>;
  onSearchSubmit: (criteria: SearchCriteria) => void;
  isSubmitting?: boolean;
  compactMode?: boolean;
}

const COMMON_TREATMENTS = [
  'Piles',
  'Knee Replacement',
  'Cataract Surgery',
  'Gallbladder Surgery',
  'Hernia Surgery',
  'Kidney Stone Surgery',
  'Heart Surgery',
  'Appendectomy',
  'Hip Replacement',
  'Hysterectomy (Gynae Surgery)',
  'Other'
];

const BUDGET_TIERS = [
  'Below ₹50,000',
  '₹50,000 – ₹1 Lakh',
  '₹1 – ₹2 Lakh',
  '₹2 – ₹5 Lakh',
  '₹5 Lakh+',
  'Enter my own budget'
];

const CITIES = ['Bangalore', 'Mysore (Coming Soon)', 'Mangalore (Coming Soon)', 'Hubli (Coming Soon)'];

export const SearchTool: React.FC<SearchToolProps> = ({
  initialCriteria,
  onSearchSubmit,
  isSubmitting = false,
  compactMode = false,
}) => {
  const [name, setName] = useState(initialCriteria?.name || '');
  const [mobile, setMobile] = useState(initialCriteria?.mobile || '');
  const [treatment, setTreatment] = useState(initialCriteria?.treatment || 'Knee Replacement');
  const [treatmentQuery, setTreatmentQuery] = useState(initialCriteria?.treatment || '');
  const [isTreatmentOpen, setIsTreatmentOpen] = useState(false);
  const [budget, setBudget] = useState(initialCriteria?.budget || '₹1 – ₹2 Lakh');
  const [customBudget, setCustomBudget] = useState('');
  const [isCustomBudgetMode, setIsCustomBudgetMode] = useState(false);
  const [city, setCity] = useState(initialCriteria?.city || 'Bangalore');
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  // Validation errors
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const dropdownRef = useRef<HTMLDivElement>(null);

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
    // Clean non-digits
    const digits = num.replace(/\D/g, '');
    // If it starts with 91 and has 12 digits, strip 91
    const nationalDigits = digits.length === 12 && digits.startsWith('91') ? digits.slice(2) : digits;
    return nationalDigits.length === 10;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};

    if (!name.trim()) {
      newErrors.name = 'Please enter your name';
    }

    if (!mobile.trim()) {
      newErrors.mobile = 'Please enter your mobile number';
    } else if (!validatePhone(mobile)) {
      newErrors.mobile = 'Enter a valid 10-digit Indian mobile number';
    }

    const finalTreatment = treatmentQuery.trim() || treatment;
    if (!finalTreatment) {
      newErrors.treatment = 'Please select or enter the required treatment';
    }

    const finalBudget = isCustomBudgetMode && customBudget.trim()
      ? `₹${customBudget}`
      : budget;

    if (!finalBudget) {
      newErrors.budget = 'Please select your estimated budget';
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
      city,
    });
  };

  const filteredTreatments = COMMON_TREATMENTS.filter(t =>
    t.toLowerCase().includes(treatmentQuery.toLowerCase())
  );

  return (
    <div
      id="main-patient-search-tool-card"
      className={`bg-white rounded-2xl md:rounded-3xl border border-slate-200/90 shadow-xl shadow-blue-950/5 relative overflow-hidden transition-all ${
        compactMode ? 'p-6' : 'p-6 sm:p-8 lg:p-10'
      }`}
    >
      {/* Subtle top brand accent line */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#0A3B75] via-[#0284C7] to-[#059669]" />

      {/* Header */}
      <div className="mb-6 sm:mb-8 text-center sm:text-left">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/60 text-xs font-semibold text-[#0A3B75] mb-2.5">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          <span>Acquire Surgery Matching</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Find Your Hospital with Acquire Surgery
        </h2>
        <p className="text-sm sm:text-base text-slate-600 mt-1.5 leading-relaxed">
          Tell us what you need, and Acquire Surgery will help you explore trusted hospital options that match your treatment, location, and budget.
        </p>
      </div>

      {/* Confirmation Message Displayed Only After Successful Submission */}
      {isSubmitted && (
        <div 
          id="search-form-confirmation-banner"
          className="mb-6 p-4 sm:p-5 rounded-2xl bg-emerald-50 border border-emerald-200/90 text-slate-800 flex items-start gap-3.5 shadow-xs"
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

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
          {/* 1. Name Field */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              1. Your Name <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <User className="w-5 h-5" />
              </div>
              <input
                id="patient-search-name-input"
                type="text"
                value={name}
                onChange={e => {
                  setName(e.target.value);
                  if (errors.name) setErrors(prev => ({ ...prev, name: '' }));
                }}
                placeholder="Enter your name"
                className={`w-full pl-11 pr-4 py-3 bg-slate-50/80 hover:bg-white focus:bg-white border rounded-xl text-slate-900 placeholder:text-slate-400 text-sm font-medium transition-all focus:outline-hidden focus:ring-2 focus:ring-[#0A3B75]/20 ${
                  errors.name ? 'border-rose-400 ring-1 ring-rose-300' : 'border-slate-300 focus:border-[#0A3B75]'
                }`}
              />
            </div>
            {errors.name && (
              <p className="text-xs text-rose-600 flex items-center gap-1 font-medium mt-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.name}
              </p>
            )}
          </div>

          {/* 2. Mobile Number Field */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              2. Mobile Number <span className="text-rose-500">*</span>
            </label>
            <div className="relative flex">
              <div className="inline-flex items-center px-3.5 bg-slate-100/90 border border-r-0 border-slate-300 rounded-l-xl text-slate-700 font-semibold text-sm">
                <span className="text-base mr-1.5">🇮🇳</span> +91
              </div>
              <div className="relative flex-1">
                <input
                  id="patient-search-mobile-input"
                  type="tel"
                  maxLength={10}
                  value={mobile}
                  onChange={e => {
                    const onlyNums = e.target.value.replace(/\D/g, '');
                    setMobile(onlyNums);
                    if (errors.mobile) setErrors(prev => ({ ...prev, mobile: '' }));
                  }}
                  placeholder="Enter your mobile number"
                  className={`w-full pl-3 pr-4 py-3 bg-slate-50/80 hover:bg-white focus:bg-white border rounded-r-xl text-slate-900 placeholder:text-slate-400 text-sm font-medium transition-all focus:outline-hidden focus:ring-2 focus:ring-[#0A3B75]/20 ${
                    errors.mobile ? 'border-rose-400 ring-1 ring-rose-300' : 'border-slate-300 focus:border-[#0A3B75]'
                  }`}
                />
              </div>
            </div>
            {errors.mobile ? (
              <p className="text-xs text-rose-600 flex items-center gap-1 font-medium mt-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.mobile}
              </p>
            ) : (
              <p className="text-[11px] text-slate-500">
                A coordinator will reach out to help with hospital options.
              </p>
            )}
          </div>

          {/* 3. Treatment / Surgery Field (Searchable Dropdown) */}
          <div className="space-y-1.5 relative" ref={dropdownRef}>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              3. Treatment / Surgery <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Activity className="w-5 h-5 text-emerald-600" />
              </div>
              <input
                id="patient-search-treatment-input"
                type="text"
                value={treatmentQuery}
                onFocus={() => setIsTreatmentOpen(true)}
                onChange={e => {
                  setTreatmentQuery(e.target.value);
                  setTreatment(e.target.value);
                  setIsTreatmentOpen(true);
                  if (errors.treatment) setErrors(prev => ({ ...prev, treatment: '' }));
                }}
                placeholder="Type or select surgery (e.g., Knee Replacement)"
                className={`w-full pl-11 pr-10 py-3 bg-slate-50/80 hover:bg-white focus:bg-white border rounded-xl text-slate-900 placeholder:text-slate-400 text-sm font-medium transition-all focus:outline-hidden focus:ring-2 focus:ring-[#0A3B75]/20 ${
                  errors.treatment ? 'border-rose-400 ring-1 ring-rose-300' : 'border-slate-300 focus:border-[#0A3B75]'
                }`}
              />
              <button
                type="button"
                onClick={() => setIsTreatmentOpen(!isTreatmentOpen)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>

            {/* Dropdown Menu */}
            {isTreatmentOpen && (
              <div className="absolute z-30 left-0 right-0 mt-1.5 bg-white border border-slate-200 rounded-xl shadow-xl max-h-60 overflow-y-auto py-1">
                {filteredTreatments.length > 0 ? (
                  filteredTreatments.map(t => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => {
                        setTreatment(t);
                        setTreatmentQuery(t);
                        setIsTreatmentOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2.5 text-sm flex items-center justify-between hover:bg-blue-50 transition-colors ${
                        treatment === t ? 'bg-blue-50/70 font-bold text-[#0A3B75]' : 'text-slate-700'
                      }`}
                    >
                      <span>{t}</span>
                      {treatment === t && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                    </button>
                  ))
                ) : (
                  <div className="p-3 text-xs text-slate-500">
                    Press tab or click away to use &ldquo;{treatmentQuery}&rdquo; as custom treatment.
                  </div>
                )}
              </div>
            )}
            {errors.treatment && (
              <p className="text-xs text-rose-600 flex items-center gap-1 font-medium mt-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.treatment}
              </p>
            )}
          </div>

          {/* 5. Location Field (Default Bangalore) */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              5. Location <span className="text-slate-400 font-normal">(Hospital City)</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <MapPin className="w-5 h-5 text-[#0A3B75]" />
              </div>
              <select
                id="patient-search-city-select"
                value={city}
                onChange={e => setCity(e.target.value)}
                className="w-full pl-11 pr-10 py-3 bg-slate-50/80 hover:bg-white focus:bg-white border border-slate-300 focus:border-[#0A3B75] rounded-xl text-slate-900 text-sm font-semibold transition-all focus:outline-hidden focus:ring-2 focus:ring-[#0A3B75]/20 appearance-none cursor-pointer"
              >
                {CITIES.map(c => (
                  <option key={c} value={c} disabled={c.includes('Coming Soon')}>
                    {c}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-400">
                <ChevronDown className="w-4 h-4" />
              </div>
            </div>
            <p className="text-[11px] text-slate-500">
              Showing options across Bangalore zones (Hebbal, Bannerghatta, Whitefield, etc.)
            </p>
          </div>
        </div>

        {/* 4. Your Budget Field (Indian currency format ₹) */}
        <div className="space-y-2 pt-2 border-t border-slate-100">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              4. Your Budget <span className="text-rose-500">*</span>
            </label>
            <span className="text-xs text-slate-500">
              Select an indicative bracket or specify an exact amount
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-2.5">
            {BUDGET_TIERS.map(tier => {
              const isCustomTier = tier === 'Enter my own budget';
              const isSelected = isCustomTier ? isCustomBudgetMode : (!isCustomBudgetMode && budget === tier);

              return (
                <button
                  key={tier}
                  type="button"
                  id={`budget-chip-${tier.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()}`}
                  onClick={() => {
                    if (isCustomTier) {
                      setIsCustomBudgetMode(true);
                    } else {
                      setIsCustomBudgetMode(false);
                      setBudget(tier);
                    }
                    if (errors.budget) setErrors(prev => ({ ...prev, budget: '' }));
                  }}
                  className={`px-3 py-2.5 rounded-xl text-xs sm:text-sm font-semibold border transition-all text-center flex items-center justify-center gap-1.5 ${
                    isSelected
                      ? 'bg-[#0A3B75] text-white border-[#0A3B75] shadow-xs scale-[1.02]'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-white'
                  }`}
                >
                  <IndianRupee className={`w-3.5 h-3.5 ${isSelected ? 'text-emerald-300' : 'text-slate-400'}`} />
                  <span className="truncate">{tier}</span>
                </button>
              );
            })}
          </div>

          {/* Custom Budget Input if chosen */}
          {isCustomBudgetMode && (
            <div className="mt-3 p-3.5 bg-blue-50/60 rounded-xl border border-blue-200 flex flex-col sm:flex-row items-center gap-3">
              <span className="text-xs font-bold text-[#0A3B75]">Enter Approx Amount:</span>
              <div className="relative flex-1 w-full sm:w-auto">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500 font-bold">₹</span>
                <input
                  type="number"
                  value={customBudget}
                  onChange={e => setCustomBudget(e.target.value)}
                  placeholder="e.g. 175000"
                  className="w-full pl-8 pr-4 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-[#0A3B75]"
                />
              </div>
              <span className="text-xs text-slate-500">
                (We match options within ~20% of your target)
              </span>
            </div>
          )}

          {errors.budget && (
            <p className="text-xs text-rose-600 flex items-center gap-1 font-medium mt-1">
              <AlertCircle className="w-3.5 h-3.5" />
              {errors.budget}
            </p>
          )}
        </div>

        {/* CTA Button & Microcopy */}
        <div className="pt-3">
          <button
            id="patient-search-submit-btn"
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-[#0A3B75] via-[#026AA7] to-[#059669] hover:from-[#083161] hover:to-[#047857] text-white font-extrabold text-base sm:text-lg py-3.5 sm:py-4 px-6 rounded-xl sm:rounded-2xl shadow-md hover:shadow-lg transition-all active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Finding Matching Hospitals in Bangalore...</span>
              </div>
            ) : (
              <>
                <Search className="w-5 h-5 text-emerald-300" />
                <span>Find Hospitals</span>
                <ArrowRight className="w-5 h-5 text-blue-200" />
              </>
            )}
          </button>

          {/* Trust-oriented microcopy below CTA */}
          <div className="mt-3.5 flex flex-wrap items-center justify-center gap-y-1 gap-x-3 text-xs text-slate-600 font-semibold">
            <span className="flex items-center gap-1.5 text-[#0A3B75]">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Trusted Hospitals
            </span>
            <span className="text-slate-300">•</span>
            <span className="flex items-center gap-1.5 text-emerald-700">
              <CheckCircle2 className="w-4 h-4 text-[#0A3B75]" />
              Personalized Options
            </span>
            <span className="text-slate-300">•</span>
            <span className="flex items-center gap-1.5 text-teal-700">
              <Sparkles className="w-4 h-4 text-teal-600" />
              Transparent Guidance
            </span>
          </div>
        </div>
      </form>
    </div>
  );
};
