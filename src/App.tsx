import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ConfirmationModal } from './components/ConfirmationModal';
import { MatchingResultsModal } from './components/MatchingResultsModal';
import { HospitalDetailModal } from './components/HospitalDetailModal';
import { HospitalMatchingModal } from './components/HospitalMatchingModal';
import { HomePage } from './pages/HomePage';
import { FindHospitalsPage } from './pages/FindHospitalsPage';
import { TreatmentsPage } from './pages/TreatmentsPage';
import { HowItWorksPage } from './pages/HowItWorksPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { AdminPortal } from './components/AdminPortal';
import { Hospital, SearchCriteria, TreatmentInfo } from './types';
import { api } from './services/api';

export function App() {
  const [activeView, setActiveView] = useState<string>('home');
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [treatments, setTreatments] = useState<TreatmentInfo[]>([]);
  const [matchedHospitals, setMatchedHospitals] = useState<Hospital[]>([]);
  const [hasSearched, setHasSearched] = useState<boolean>(false);
  const [currentCriteria, setCurrentCriteria] = useState<SearchCriteria>({
    name: '',
    mobile: '',
    treatment: 'Knee Replacement',
    budget: '₹2 – 3 Lakh',
    city: 'Bangalore',
  });
  const [isSearching, setIsSearching] = useState(false);

  // Modals
  const [confirmationState, setConfirmationState] = useState<{
    isOpen: boolean;
    name: string;
    treatment: string;
    mobile: string;
  }>({
    isOpen: false,
    name: '',
    treatment: '',
    mobile: '',
  });

  const [resultsModalState, setResultsModalState] = useState<{
    isOpen: boolean;
    name: string;
    treatment: string;
    mobile: string;
    matchingHospitals: Hospital[];
  }>({
    isOpen: false,
    name: '',
    treatment: '',
    mobile: '',
    matchingHospitals: [],
  });

  const [detailHospital, setDetailHospital] = useState<Hospital | null>(null);
  const [isMatchingModalOpen, setIsMatchingModalOpen] = useState(false);

  // Assistance quick modal
  const [assistanceHospital, setAssistanceHospital] = useState<Hospital | null>(null);
  const [assistName, setAssistName] = useState('');
  const [assistMobile, setAssistMobile] = useState('');
  const [assistSubmitting, setAssistSubmitting] = useState(false);

  // Update Page Title for SEO on navigation
  useEffect(() => {
    const titles: Record<string, string> = {
      home: 'Acquire Surgery - Surgical Care & Hospital Matching in Bangalore',
      search: 'Find Hospitals in Bangalore - Acquire Surgery Matching Engine',
      'find-hospitals': 'Find Hospitals in Bangalore - Acquire Surgery Matching Engine',
      treatments: 'Surgery & Treatment Costs in Bangalore - Acquire Surgery Cost Guide',
      costs: 'Surgery & Treatment Costs in Bangalore - Acquire Surgery Cost Guide',
      'how-it-works': 'How Acquire Surgery Works - Patient Decision Support',
      about: 'About Acquire Surgery - Transparent Healthcare in Bangalore',
      contact: 'Contact Patient Coordinator - Acquire Surgery Bangalore Helpline',
      admin: 'Coordinator Admin Portal - Acquire Surgery Bangalore',
    };

    if (titles[activeView] && typeof document !== 'undefined') {
      document.title = titles[activeView];
    }
  }, [activeView]);

  // Check URL hash or query params so admins and hospital staff can navigate directly (e.g. #admin, #portal)
  useEffect(() => {
    const checkHashOrQuery = () => {
      if (typeof window === 'undefined') return;
      const hash = window.location.hash.replace('#', '').toLowerCase();
      const params = new URLSearchParams(window.location.search);
      if (hash === 'admin' || hash === 'portal' || hash === 'login' || params.has('admin') || params.has('portal')) {
        setActiveView('admin');
      }
    };
    checkHashOrQuery();
    window.addEventListener('hashchange', checkHashOrQuery);
    return () => window.removeEventListener('hashchange', checkHashOrQuery);
  }, []);

  // Initial load
  useEffect(() => {
    async function loadData() {
      try {
        const [hospData, treatData] = await Promise.all([
          api.getHospitals(),
          api.getTreatments(),
        ]);
        setHospitals(hospData);
        setTreatments(treatData);
      } catch (err) {
        console.error('Failed to load initial data:', err);
      }
    }
    loadData();
  }, []);

  // Handle Search Submission
  const handleSearchSubmit = async (criteria: SearchCriteria) => {
    setCurrentCriteria(criteria);
    setIsSearching(true);

    try {
      // 1. Fetch matching hospitals from backend database
      const matches = await api.searchHospitals(criteria);
      setMatchedHospitals(matches);
      setHasSearched(true);

      // 2. Submit lead to database
      await api.createLead({
        name: criteria.name,
        mobile: criteria.mobile,
        treatment: criteria.treatment,
        budget: criteria.budget,
        city: criteria.city,
        source: 'Acquire Surgery Search Engine',
        matchedHospitalIds: matches.map(m => m.id),
      });

      // 3. Show Confirmation Modal / Popup with 24-hour representative contact confirmation message
      setResultsModalState({
        isOpen: true,
        name: criteria.name,
        treatment: criteria.treatment,
        mobile: criteria.mobile,
        matchingHospitals: matches,
      });
    } catch (err) {
      console.error('Search error:', err);
    } finally {
      setIsSearching(false);
    }
  };

  const navigateTo = (view: string) => {
    // If hospitals page is navigated to, redirect to home as hospital page is hidden
    const target = view === 'hospitals' ? 'home' : view;
    setActiveView(target);
    if (typeof window !== 'undefined' && typeof window.scrollTo === 'function') {
      try {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } catch {
        window.scrollTo(0, 0);
      }
    }
  };

  // Handle requesting assistance for a specific hospital
  const handleRequestAssistance = (hospital: Hospital) => {
    setAssistanceHospital(hospital);
  };

  const handleConfirmAssistance = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!assistName || !assistMobile) return;
    setAssistSubmitting(true);

    const mobileStr = assistMobile.startsWith('+91') ? assistMobile : `+91 ${assistMobile}`;
    try {
      await api.createLead({
        name: assistName,
        mobile: mobileStr,
        treatment: currentCriteria.treatment || 'Hospital Inquiry',
        budget: currentCriteria.budget || 'Flexible',
        city: 'Bangalore',
        source: `Assistance Request for ${assistanceHospital?.name}`,
        matchedHospitalIds: assistanceHospital ? [assistanceHospital.id] : [],
      });

      setAssistanceHospital(null);
      setConfirmationState({
        isOpen: true,
        name: assistName,
        treatment: assistanceHospital?.name || 'Hospital Guidance',
        mobile: mobileStr,
      });
      setAssistName('');
      setAssistMobile('');
    } catch (err) {
      console.error('Assistance request failed', err);
    } finally {
      setAssistSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/50 text-slate-800 font-sans selection:bg-blue-100 selection:text-[#0A3B75]">
      {/* Navigation Header */}
      <Navbar
        currentView={activeView}
        onNavigate={navigateTo}
        onOpenSearch={() => setIsMatchingModalOpen(true)}
      />

      {/* Main Content Area - Strictly Page-Separated */}
      <main className="grow">
        {/* 1. HOME PAGE */}
        {activeView === 'home' && (
          <HomePage
            hospitals={hospitals}
            onSearchSubmit={handleSearchSubmit}
            isSearching={isSearching}
            onTalkToTeam={() => navigateTo('contact')}
            onExploreAllHospitals={() => setIsMatchingModalOpen(true)}
            onViewHospitalDetails={hosp => setDetailHospital(hosp)}
            onRequestAssistance={handleRequestAssistance}
            isMatchingModalOpen={isMatchingModalOpen}
            onOpenMatchingModal={() => setIsMatchingModalOpen(true)}
            onCloseMatchingModal={() => setIsMatchingModalOpen(false)}
          />
        )}

        {/* 2. FIND HOSPITALS PAGE (Only hospital search & matching) */}
        {(activeView === 'search' || activeView === 'find-hospitals' || activeView === 'results') && (
          <FindHospitalsPage
            criteria={currentCriteria}
            matchedHospitals={matchedHospitals}
            allHospitals={hospitals}
            isSearching={isSearching}
            hasSearched={hasSearched}
            onSearchSubmit={handleSearchSubmit}
            onViewHospitalDetails={hosp => setDetailHospital(hosp)}
            onRequestAssistance={handleRequestAssistance}
          />
        )}

        {/* 3. HOSPITALS DIRECTORY PAGE - Hidden as requested */}

        {/* 4. TREATMENTS / SURGERIES PAGE (Only surgery & treatment information) */}
        {(activeView === 'treatments' || activeView === 'costs') && (
          <TreatmentsPage
            treatments={treatments}
            hospitals={hospitals}
            onSelectTreatment={tName => {
              setCurrentCriteria(prev => ({ ...prev, treatment: tName }));
              navigateTo('search');
            }}
          />
        )}

        {/* 5. HOW IT WORKS PAGE (Only detailed explanation of how Acquire Surgery works) */}
        {activeView === 'how-it-works' && (
          <HowItWorksPage
            onStartSearch={() => navigateTo('search')}
            onTalkToTeam={() => navigateTo('contact')}
          />
        )}

        {/* 6. ABOUT US PAGE (Only company & brand information) */}
        {activeView === 'about' && (
          <AboutPage
            onStartSearch={() => navigateTo('search')}
            onContactClick={() => navigateTo('contact')}
          />
        )}

        {/* 7. CONTACT US PAGE (Only contact & support information) */}
        {activeView === 'contact' && (
          <ContactPage />
        )}

        {/* 8. ADMIN & LEAD MANAGEMENT PORTAL */}
        {activeView === 'admin' && (
          <AdminPortal onClose={() => navigateTo('home')} />
        )}
      </main>

      {/* Footer */}
      <Footer
        onNavigate={navigateTo}
        onOpenAdmin={() => navigateTo('admin')}
      />

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={confirmationState.isOpen}
        name={confirmationState.name}
        treatment={confirmationState.treatment}
        mobile={confirmationState.mobile}
        onClose={() => setConfirmationState(prev => ({ ...prev, isOpen: false }))}
        onBackToOptions={() => {
          setConfirmationState(prev => ({ ...prev, isOpen: false }));
          navigateTo('search');
        }}
      />

      {/* Confirmation Modal / Popup with 24-Hour Representative Contact Message */}
      <MatchingResultsModal
        isOpen={resultsModalState.isOpen}
        name={resultsModalState.name}
        mobile={resultsModalState.mobile}
        treatment={resultsModalState.treatment}
        matchingHospitals={resultsModalState.matchingHospitals}
        onClose={() => setResultsModalState(prev => ({ ...prev, isOpen: false }))}
        onViewHospitalOptions={() => {
          setResultsModalState(prev => ({ ...prev, isOpen: false }));
          setActiveView('search');
        }}
      />

      {/* Global Hospital Matching Popup Modal */}
      <HospitalMatchingModal
        isOpen={isMatchingModalOpen}
        onClose={() => setIsMatchingModalOpen(false)}
        onSearchSubmit={(criteria) => {
          setIsMatchingModalOpen(false);
          handleSearchSubmit(criteria);
        }}
        isSubmitting={isSearching}
        initialCriteria={currentCriteria}
      />

      {/* Hospital Detail Modal */}
      <HospitalDetailModal
        isOpen={Boolean(detailHospital)}
        hospital={detailHospital}
        selectedTreatment={currentCriteria.treatment}
        onClose={() => setDetailHospital(null)}
        onRequestAssistance={handleRequestAssistance}
      />

      {/* Quick Assistance Request Modal */}
      {assistanceHospital && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="font-extrabold text-slate-900 text-lg">
              Get Assistance for {assistanceHospital.name}
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              An Acquire Surgery coordinator will connect with you to explain doctor availability, admission process, and cashless TPA coverage for this hospital.
            </p>

            <form onSubmit={handleConfirmAssistance} className="mt-4 space-y-3">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Your Name</label>
                <input
                  type="text"
                  required
                  value={assistName}
                  onChange={e => setAssistName(e.target.value)}
                  placeholder="e.g. Ramesh Kumar"
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Mobile Number</label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 bg-slate-100 border border-r-0 border-slate-300 rounded-l-xl text-xs font-bold text-slate-700">
                    +91
                  </span>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    value={assistMobile}
                    onChange={e => setAssistMobile(e.target.value.replace(/\D/g, ''))}
                    placeholder="10-digit mobile"
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-r-xl"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setAssistanceHospital(null)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={assistSubmitting}
                  className="px-5 py-2 text-xs font-bold text-white bg-[#0A3B75] hover:bg-[#082a52] rounded-xl shadow-xs cursor-pointer"
                >
                  {assistSubmitting ? 'Submitting...' : 'Request Coordinator Call'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
export default App;
