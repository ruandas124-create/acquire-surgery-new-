import React, { useState, useEffect } from 'react';
import { Logo } from './Logo';
import { Phone, Menu, X, ShieldCheck, UserCog, Search, Sparkles } from 'lucide-react';

interface NavbarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  onOpenSearch: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  onOpenSearch,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = typeof window !== 'undefined' ? (window.scrollY || window.pageYOffset || 0) : 0;
      setIsScrolled(scrollY > 20);
    };
    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', handleScroll, { passive: true });
      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, []);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'search', label: 'Find Hospitals' },
    { id: 'treatments', label: 'Treatments' },
    { id: 'how-it-works', label: 'How It Works' },
    { id: 'about', label: 'About Us' },
    { id: 'contact', label: 'Contact' },
  ];

  const handleNavClick = (id: string) => {
    setMobileMenuOpen(false);
    if (id === 'search') {
      onOpenSearch();
    } else {
      onNavigate(id);
    }
  };

  return (
    <header
      id="acquire-surgery-header"
      className={`sticky top-0 z-50 transition-all duration-200 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-xs border-b border-slate-200'
          : 'bg-white border-b border-slate-100'
      }`}
    >
      {/* Top micro-bar for trust & contact */}
      <div className="bg-gradient-to-r from-[#0A3B75] via-[#026AA7] to-[#047857] text-white py-1.5 px-3 sm:px-4 text-[11px] sm:text-xs">
        <div className="max-w-7xl mx-auto flex justify-between items-center gap-2 sm:gap-4">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <span className="inline-flex items-center gap-1.5 font-medium whitespace-nowrap shrink-0">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-300 shrink-0" />
              <span className="hidden md:inline">
                Trusted Healthcare Decision Support in Bangalore
              </span>
              <span className="hidden sm:inline md:hidden">
                Healthcare Decision Support
              </span>
              <span className="sm:hidden">
                Healthcare Support
              </span>
            </span>
            <span className="hidden sm:inline text-blue-200 shrink-0">|</span>
            <span className="hidden sm:inline text-blue-100 truncate">
              Transparent Estimates • Independent Assistance • Patient First
            </span>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <span className="text-blue-200/60 hidden sm:inline">|</span>
            <a
              href="tel:+919844955100"
              className="flex items-center gap-1.5 font-medium hover:text-emerald-200 transition-colors whitespace-nowrap shrink-0"
              title="Call Acquire Surgery Patient Desk"
            >
              <Phone className="w-3 h-3 text-emerald-300 shrink-0" />
              <span className="whitespace-nowrap tabular-nums">+91&nbsp;98449&nbsp;55100</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo */}
          <Logo
            size="md"
            showTagline={false}
            onClick={() => handleNavClick('home')}
            className="cursor-pointer py-1"
          />

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navItems.map(item => {
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-link-${item.id}`}
                  onClick={() => handleNavClick(item.id)}
                  className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                    isActive
                      ? 'text-[#0A3B75] bg-blue-50'
                      : 'text-slate-600 hover:text-[#0A3B75] hover:bg-slate-50'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Header Action Button: Find Hospitals (Visible on mobile and desktop) */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              id="header-find-hospital-btn"
              onClick={onOpenSearch}
              className="inline-flex items-center gap-1.5 sm:gap-2 bg-gradient-to-r from-[#0A3B75] to-[#0284C7] hover:from-[#093567] hover:to-[#0275b1] text-white text-xs sm:text-sm font-bold px-3.5 py-2 sm:px-5 sm:py-2.5 rounded-xl shadow-xs hover:shadow-md transition-all active:scale-[0.98] cursor-pointer whitespace-nowrap"
            >
              <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-300" />
              <span>Find Hospitals</span>
            </button>

            {/* Mobile menu hamburger button */}
            <button
              id="mobile-menu-toggle-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-hidden cursor-pointer"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 shadow-xl animate-in slide-in-from-top duration-200">
          <div className="flex flex-col gap-1 mb-4">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`flex items-center justify-between px-4 py-3 rounded-lg text-left text-base font-semibold transition-colors ${
                  currentView === item.id
                    ? 'text-[#0A3B75] bg-blue-50 font-bold'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span>{item.label}</span>
              </button>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-100 flex flex-col gap-3">
            <button
              id="mobile-nav-find-cta"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenSearch();
              }}
              className="w-full flex items-center justify-center gap-2 bg-[#0A3B75] text-white py-3 rounded-xl font-bold text-base shadow-sm"
            >
              <Search className="w-5 h-5 text-emerald-400" />
              <span>Find Suitable Hospitals</span>
            </button>


            <a
              href="tel:+919844955100"
              className="flex items-center justify-center gap-2 py-2.5 px-3 text-sm font-semibold text-emerald-700 bg-emerald-50 rounded-xl border border-emerald-100 text-center"
            >
              <Phone className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Speak to Hospital Coordinator <span className="whitespace-nowrap font-bold">(+91&nbsp;98449&nbsp;55100)</span></span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
