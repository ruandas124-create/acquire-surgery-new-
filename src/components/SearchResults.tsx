import React, { useState } from 'react';
import { Hospital, SearchCriteria } from '../types';
import { HospitalCard } from './HospitalCard';
import { 
  Building2, 
  ArrowLeft, 
  Search, 
  CheckCircle, 
  SlidersHorizontal,
  Info,
  MapPin,
  Activity,
  Filter,
  ShieldCheck
} from 'lucide-react';
import { motion } from 'motion/react';

interface SearchResultsProps {
  criteria: SearchCriteria;
  hospitals: Hospital[];
  isLoading?: boolean;
  onModifySearch: () => void;
  onViewHospitalDetails: (hospital: Hospital) => void;
  onRequestAssistance: (hospital: Hospital) => void;
}

export const SearchResults: React.FC<SearchResultsProps> = ({
  criteria,
  hospitals,
  isLoading = false,
  onModifySearch,
  onViewHospitalDetails,
  onRequestAssistance,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedLocation, setSelectedLocation] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'match' | 'rating' | 'beds'>('match');

  const categories = [
    'All',
    'Premium Hospital',
    'Standard Hospital',
    'Budget-Friendly Hospital',
    'Specialty Hospital'
  ];

  const locations = [
    'All Locations',
    'Hebbal',
    'Whitefield',
    'Koramangala',
    'Indiranagar',
    'Bannerghatta Road',
    'Yeshwanthpur',
    'Old Airport Road'
  ];

  // Dynamic filter
  let filtered = hospitals;
  if (selectedCategory !== 'All') {
    filtered = filtered.filter(h => h.category === selectedCategory);
  }
  if (selectedLocation !== 'All Locations') {
    filtered = filtered.filter(h => h.location.toLowerCase().includes(selectedLocation.toLowerCase()));
  }

  // Sort
  filtered = [...filtered].sort((a, b) => {
    if (sortBy === 'rating') return b.rating - a.rating;
    if (sortBy === 'beds') return b.bedCount - a.bedCount;
    return 0;
  });

  return (
    <div id="hospital-search-results-page" className="py-8 sm:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Top Breadcrumb & Modify Search */}
      <div className="mb-6 flex items-center justify-between flex-wrap gap-4">
        <button
          id="back-to-search-btn"
          onClick={onModifySearch}
          className="inline-flex items-center gap-2 text-sm font-bold text-[#0A3B75] hover:text-[#082a52] transition-colors cursor-pointer group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <span>Modify Treatment &amp; Budget Criteria</span>
        </button>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-800 rounded-full border border-emerald-200 text-xs font-semibold">
          <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
          <span>Matching Hospitals Available</span>
        </div>
      </div>

      {/* Main Criteria Overview Card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 mb-8">
        {/* Exact Required Structure Heading */}
        <div className="border-b border-slate-100 pb-5 mb-5">
          <span className="text-xs font-bold uppercase tracking-wider text-[#0A3B75] block mb-1">
            Search Results
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Hospitals Matching Your Requirements
          </h1>

          {/* Criteria Pills: Treatment, Location, Budget */}
          <div className="mt-4 flex flex-wrap items-center gap-2.5 sm:gap-3">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-blue-50 border border-blue-200/80 text-xs sm:text-sm font-semibold text-[#0A3B75]">
              <Activity className="w-4 h-4 text-blue-600" />
              <span>Treatment: <strong className="font-bold">{criteria.treatment}</strong></span>
            </div>

            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-xs sm:text-sm font-semibold text-slate-700">
              <MapPin className="w-4 h-4 text-slate-500" />
              <span>Location: <strong className="font-bold">{criteria.city || 'Bangalore'}</strong></span>
            </div>

            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs sm:text-sm font-semibold text-emerald-900">
              <Filter className="w-4 h-4 text-emerald-600" />
              <span>Budget Filter: <strong className="font-bold">{criteria.budget}</strong></span>
            </div>
          </div>

          <p className="text-xs text-slate-500 mt-3 flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-[#0A3B75] shrink-0" />
            <span>We use your budget to help identify suitable hospital options.</span>
          </p>
        </div>

        {/* Dynamic Count Banner: Hospitals Available */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/80 p-4.5 rounded-2xl border border-slate-200">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Hospitals Available
            </h2>
            <p className="text-lg sm:text-xl font-extrabold text-slate-900 mt-0.5">
              <span className="text-[#0A3B75]">{filtered.length} hospitals</span> match your requirements
            </p>
          </div>

          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-slate-400" />
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as any)}
              className="text-xs font-semibold bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-[#0A3B75]"
            >
              <option value="match">Sort by: Recommended</option>
              <option value="rating">Sort by: Highest Rating</option>
              <option value="beds">Sort by: Hospital Bed Capacity</option>
            </select>
          </div>
        </div>
      </div>

      {/* Hospital Category Guide Card */}
      <div className="mb-8 p-5 bg-white rounded-2xl border border-slate-200 text-xs text-slate-600 shadow-xs">
        <p className="font-bold text-slate-900 text-sm mb-3 flex items-center gap-1.5">
          <Info className="w-4 h-4 text-[#0A3B75]" />
          <span>Understanding Hospital Categories in Bangalore:</span>
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="bg-blue-50/40 p-3 rounded-xl border border-blue-100">
            <span className="font-bold text-[#0A3B75] block mb-1">Premium Hospital</span>
            Advanced facilities, robotic suites, and broader private service options.
          </div>
          <div className="bg-sky-50/40 p-3 rounded-xl border border-sky-100">
            <span className="font-bold text-sky-800 block mb-1">Standard Hospital</span>
            Good balance of experienced surgical faculty and expected treatment cost.
          </div>
          <div className="bg-emerald-50/40 p-3 rounded-xl border border-emerald-100">
            <span className="font-bold text-emerald-800 block mb-1">Budget-Friendly Hospital</span>
            Options focused on affordability while meeting the required treatment criteria.
          </div>
          <div className="bg-teal-50/40 p-3 rounded-xl border border-teal-100">
            <span className="font-bold text-teal-800 block mb-1">Specialty Hospital</span>
            Dedicated center of excellence for specific surgeries and clinical disciplines.
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#0A3B75] text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Location Dropdown Filter */}
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-slate-400" />
          <select
            value={selectedLocation}
            onChange={e => setSelectedLocation(e.target.value)}
            className="text-xs font-semibold bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-slate-700 focus:outline-hidden"
          >
            {locations.map(loc => (
              <option key={loc} value={loc}>{loc}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Matching Hospitals Grid (Staggered Animation) */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((hospital, idx) => (
            <motion.div
              key={hospital.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: idx * 0.05 }}
            >
              <HospitalCard
                hospital={hospital}
                selectedBudget={criteria.budget}
                selectedTreatment={criteria.treatment}
                onViewDetails={onViewHospitalDetails}
                onRequestAssistance={onRequestAssistance}
              />
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8">
          <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-800">No Hospitals Match Current Filter</h3>
          <p className="text-sm text-slate-500 mt-1 max-w-md mx-auto">
            Try switching category tabs or clearing area filters to see all available hospitals matching your treatment.
          </p>
          <button
            onClick={() => {
              setSelectedCategory('All');
              setSelectedLocation('All Locations');
            }}
            className="mt-4 px-4 py-2 bg-blue-50 text-[#0A3B75] text-xs font-bold rounded-lg hover:bg-blue-100"
          >
            Reset All Filters
          </button>
        </div>
      )}

      {/* Decision Support & Transparent Guidance */}
      <div className="mt-12 p-5 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-600 text-center max-w-3xl mx-auto space-y-1.5">
        <p className="font-bold text-slate-800">
          Decision Support &amp; Hospital Matching Notice
        </p>
        <p className="leading-relaxed">
          We use your budget to help identify suitable hospital options. Final admission details, room selection, and clinical treatment plans are determined based on individual doctor consultations and patient evaluation. An Acquire Surgery representative will guide you through all options.
        </p>
      </div>
    </div>
  );
};
