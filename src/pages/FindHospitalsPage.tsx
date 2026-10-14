import React, { useState } from 'react';
import { Hospital, SearchCriteria } from '../types';
import { SearchTool } from '../components/SearchTool';
import { SearchResults } from '../components/SearchResults';
import { Search, Sparkles, Building2, ShieldCheck, MapPin } from 'lucide-react';
import { motion } from 'motion/react';

interface FindHospitalsPageProps {
  criteria: SearchCriteria;
  matchedHospitals: Hospital[];
  allHospitals: Hospital[];
  isSearching: boolean;
  hasSearched: boolean;
  onSearchSubmit: (criteria: SearchCriteria) => void;
  onViewHospitalDetails: (hospital: Hospital) => void;
  onRequestAssistance: (hospital: Hospital) => void;
}

export const FindHospitalsPage: React.FC<FindHospitalsPageProps> = ({
  criteria,
  matchedHospitals,
  allHospitals,
  isSearching,
  hasSearched,
  onSearchSubmit,
  onViewHospitalDetails,
  onRequestAssistance,
}) => {
  const [showSearchForm, setShowSearchForm] = useState<boolean>(!hasSearched);

  const hospitalsToDisplay = matchedHospitals.length > 0 ? matchedHospitals : allHospitals;

  return (
    <div id="find-hospitals-page-container" className="py-8 sm:py-12 bg-slate-50/50 min-h-[80vh]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Top Title */}
        <div className="mb-8 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-50 border border-blue-200/80 text-xs font-bold text-[#0A3B75] mb-2.5">
            <Search className="w-3.5 h-3.5 text-emerald-600" />
            <span>Bangalore Hospital Matching Engine</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Find Hospitals for Your Treatment &amp; Budget
          </h1>
          <p className="mt-2 text-sm sm:text-base text-slate-600">
            Compare accredited hospitals in Bangalore by surgical specialty, indicative package cost, and room categories.
          </p>
        </div>

        {/* Toggleable Search Form */}
        {showSearchForm ? (
          <div className="max-w-4xl mx-auto mb-12">
            <SearchTool
              initialCriteria={criteria}
              onSearchSubmit={newCriteria => {
                onSearchSubmit(newCriteria);
                setShowSearchForm(false);
              }}
              isSubmitting={isSearching}
            />

            {hasSearched && (
              <div className="mt-4 text-center">
                <button
                  onClick={() => setShowSearchForm(false)}
                  className="text-xs font-semibold text-slate-500 hover:text-[#0A3B75] underline cursor-pointer"
                >
                  Cancel and view current hospital results
                </button>
              </div>
            )}
          </div>
        ) : (
          <SearchResults
            criteria={criteria}
            hospitals={hospitalsToDisplay}
            isLoading={isSearching}
            onModifySearch={() => setShowSearchForm(true)}
            onViewHospitalDetails={onViewHospitalDetails}
            onRequestAssistance={onRequestAssistance}
          />
        )}
      </div>
    </div>
  );
};
