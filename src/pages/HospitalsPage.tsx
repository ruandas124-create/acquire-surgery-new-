import React from 'react';
import { Hospital } from '../types';
import { HospitalsDirectoryView } from '../components/HospitalsDirectoryView';

interface HospitalsPageProps {
  hospitals: Hospital[];
  onViewDetails: (hospital: Hospital) => void;
  onRequestAssistance: (hospital: Hospital) => void;
}

export const HospitalsPage: React.FC<HospitalsPageProps> = ({
  hospitals,
  onViewDetails,
  onRequestAssistance,
}) => {
  return (
    <div id="hospitals-page-container" className="bg-slate-50/50 min-h-[85vh]">
      <HospitalsDirectoryView
        hospitals={hospitals}
        onViewDetails={onViewDetails}
        onRequestAssistance={onRequestAssistance}
      />
    </div>
  );
};
