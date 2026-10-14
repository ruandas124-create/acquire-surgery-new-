import React from 'react';
import { TreatmentInfo, Hospital } from '../types';
import { CostGuideView } from '../components/CostGuideView';

interface TreatmentsPageProps {
  treatments: TreatmentInfo[];
  hospitals: Hospital[];
  onSelectTreatment: (treatmentName: string) => void;
}

export const TreatmentsPage: React.FC<TreatmentsPageProps> = ({
  treatments,
  hospitals,
  onSelectTreatment,
}) => {
  return (
    <div id="treatments-page-container" className="bg-slate-50/50 min-h-[85vh]">
      <CostGuideView
        treatments={treatments}
        hospitals={hospitals}
        onSelectTreatment={onSelectTreatment}
      />
    </div>
  );
};
