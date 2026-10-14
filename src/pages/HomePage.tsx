import React, { useState } from 'react';
import { Hero } from '../components/Hero';
import { HomepageMatchingCTA } from '../components/HomepageMatchingCTA';
import { HospitalMatchingModal } from '../components/HospitalMatchingModal';
import { HowWeHelpDiagram } from '../components/HowWeHelpDiagram';
import { FamilyCareSection } from '../components/FamilyCareSection';
import { TrustSection } from '../components/TrustSection';
import { BudgetTransparency } from '../components/BudgetTransparency';
import { PersonalSupportBanner } from '../components/PersonalSupportBanner';
import { HomeFinalCTA } from '../components/HomeFinalCTA';
import { Hospital, SearchCriteria } from '../types';

interface HomePageProps {
  hospitals: Hospital[];
  onSearchSubmit: (criteria: SearchCriteria) => void;
  isSearching: boolean;
  onTalkToTeam: () => void;
  onExploreAllHospitals: () => void;
  onViewHospitalDetails: (hospital: Hospital) => void;
  onRequestAssistance: (hospital: Hospital) => void;
  isMatchingModalOpen?: boolean;
  onCloseMatchingModal?: () => void;
  onOpenMatchingModal?: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  hospitals,
  onSearchSubmit,
  isSearching,
  onTalkToTeam,
  onExploreAllHospitals,
  onViewHospitalDetails,
  onRequestAssistance,
  isMatchingModalOpen: externalModalOpen,
  onCloseMatchingModal,
  onOpenMatchingModal,
}) => {
  const [internalModalOpen, setInternalModalOpen] = useState(false);

  // Controlled or uncontrolled modal state
  const isModalOpen = externalModalOpen !== undefined ? externalModalOpen : internalModalOpen;

  const handleOpenModal = () => {
    if (onOpenMatchingModal) {
      onOpenMatchingModal();
    } else {
      setInternalModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    if (onCloseMatchingModal) {
      onCloseMatchingModal();
    } else {
      setInternalModalOpen(false);
    }
  };

  return (
    <div className="space-y-0">
      {/* 1. Hero Section */}
      <Hero
        onFindHospitalsClick={handleOpenModal}
        onTalkToTeamClick={onTalkToTeam}
      />

      {/* 2. Compact Premium Homepage CTA: "Find Your Hospital with Acquire Surgery" */}
      <HomepageMatchingCTA onOpenModal={handleOpenModal} />

      {/* 3. How Acquire Surgery Helps You (5-Step Visual Diagram) */}
      <HowWeHelpDiagram onStartSearch={handleOpenModal} />

      {/* 4. Indian Parents / Family Section ("Choosing a Hospital Shouldn't Be Confusing") */}
      <FamilyCareSection onFindHospitalClick={handleOpenModal} />

      {/* 5. Why Choose Acquire Surgery? (4 Cards) */}
      <TrustSection />

      {/* 6. Hospital Options by Category section is hidden as requested */}

      {/* 7. Budget Transparency: "Your Budget. Your Options. Your Decision." */}
      <BudgetTransparency onExploreOptions={onExploreAllHospitals} />

      {/* 8. Personal Representative Support Banner */}
      <PersonalSupportBanner onTalkToCoordinator={onTalkToTeam} />

      {/* 9. Final Homepage CTA */}
      <HomeFinalCTA onFindHospitalsClick={handleOpenModal} />

      {/* Premium Hospital-Matching Popup Modal (only if not handled by parent App) */}
      {externalModalOpen === undefined && (
        <HospitalMatchingModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSearchSubmit={(criteria) => {
            handleCloseModal();
            onSearchSubmit(criteria);
          }}
          isSubmitting={isSearching}
        />
      )}
    </div>
  );
};
