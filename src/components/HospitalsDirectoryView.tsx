import React, { useState } from 'react';
import { Hospital } from '../types';
import { HospitalCard } from './HospitalCard';
import { Search, MapPin, Building2, Filter, Sparkles, CheckCircle2 } from 'lucide-react';

interface HospitalsDirectoryViewProps {
  hospitals: Hospital[];
  onViewDetails: (hospital: Hospital) => void;
  onRequestAssistance: (hospital: Hospital) => void;
}

export const HospitalsDirectoryView: React.FC<HospitalsDirectoryViewProps> = ({
  hospitals,
  onViewDetails,
  onRequestAssistance,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [locationFilter, setLocationFilter] = useState('All');

  const categories = ['All', 'Premium Hospital', 'Standard Hospital', 'Budget-Friendly Hospital', 'Specialty Hospital'];

  // Extract unique locations
  const locations = ['All', ...Array.from(new Set(hospitals.map(h => h.location.split('/')[0].trim())))];

  const filtered = hospitals.filter(h => {
    const matchesSearch = h.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          h.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          h.specialties.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = categoryFilter === 'All' || h.category === categoryFilter;
    const matchesLocation = locationFilter === 'All' || h.location.toLowerCase().includes(locationFilter.toLowerCase());
    return matchesSearch && matchesCategory && matchesLocation;
  });

  return (
    <div id="hospitals-directory-view" className="py-8 sm:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-[#0A3B75] text-xs font-bold mb-2.5 border border-blue-200">
          <Building2 className="w-3.5 h-3.5 text-emerald-600" />
          <span>Hospitals in Bangalore Directory</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Explore Accredited Hospitals in Bangalore
        </h1>
        <p className="text-sm sm:text-base text-slate-600 mt-2">
          Review reputable tertiary centers, trust institutions, and super-specialty hospitals categorized respectfully by infrastructure and budget tier.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="mb-8 p-4 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search by hospital name or specialty..."
            className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#0A3B75]"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Category */}
          <div className="flex items-center gap-1 text-xs">
            <span className="text-slate-500 font-medium">Category:</span>
            <select
              value={categoryFilter}
              onChange={e => setCategoryFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-800"
            >
              {categories.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Area */}
          <div className="flex items-center gap-1 text-xs">
            <span className="text-slate-500 font-medium">Area:</span>
            <select
              value={locationFilter}
              onChange={e => setLocationFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-800"
            >
              {locations.map(loc => (
                <option key={loc} value={loc}>{loc === 'All' ? 'All Bangalore' : loc}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Result Count */}
      <div className="mb-6 flex items-center justify-between text-xs text-slate-500">
        <span>Showing <strong>{filtered.length}</strong> hospitals in Bangalore</span>
        <span className="text-emerald-700 font-semibold flex items-center gap-1">
          <CheckCircle2 className="w-3.5 h-3.5" /> NABH / NABL verified standards
        </span>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
        {filtered.map(hospital => (
          <HospitalCard
            key={hospital.id}
            hospital={hospital}
            onViewDetails={onViewDetails}
            onRequestAssistance={onRequestAssistance}
          />
        ))}
      </div>
    </div>
  );
};
