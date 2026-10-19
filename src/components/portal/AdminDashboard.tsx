import React, { useState, useEffect } from 'react';
import { Lead, AuthUser, LeadStatus, Hospital, PatientSchedule } from '../../types';
import { api } from '../../services/api';
import { Logo } from '../Logo';
import { 
  Users, 
  Search, 
  Phone, 
  MessageSquare, 
  RefreshCw, 
  LogOut, 
  CheckCircle2, 
  AlertCircle, 
  Calendar, 
  Stethoscope, 
  Filter, 
  Check, 
  Clock, 
  ShieldCheck, 
  Activity, 
  FileSpreadsheet, 
  Download 
} from 'lucide-react';
import { LeadsNotesModal } from './LeadsNotesModal';
import { ManageTreatmentsSection } from './ManageTreatmentsSection';
import { INITIAL_SCHEDULES } from '../../data/crmData';

interface AdminDashboardProps {
  user: AuthUser;
  onLogout: () => void;
  onClose: () => void;
  onSwitchToHospital?: (hospitalId: string) => void;
}

const CRM_LEAD_STATUSES: LeadStatus[] = [
  'New Leads', 'RNR', 'Followup', 'Converted', 'Junk'
];

type AdminViewTab = 'front-office' | 'treatments';

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
  user, 
  onLogout, 
  onClose, 
  onSwitchToHospital 
}) => {
  const [activeTab, setActiveTab] = useState<AdminViewTab>('front-office');
  const [leads, setLeads] = useState<Lead[]>([]);
  const [schedules, setSchedules] = useState<PatientSchedule[]>(INITIAL_SCHEDULES);
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [loading, setLoading] = useState(true);
  const [leadSearch, setLeadSearch] = useState('');
  const [leadStatusFilter, setLeadStatusFilter] = useState('All');
  const [leadNotesModalTarget, setLeadNotesModalTarget] = useState<Lead | null>(null);
  const [toastMsg, setToastMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToastMsg({ type, text });
    setTimeout(() => setToastMsg(null), 3500);
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const [leadsData, hospData, schedData] = await Promise.all([
        api.getLeads(),
        api.getHospitals(),
        api.getSchedules ? api.getSchedules() : Promise.resolve(INITIAL_SCHEDULES)
      ]);
      setLeads(leadsData);
      setHospitals(hospData);
      if (schedData && schedData.length > 0) {
        setSchedules(schedData);
      }
    } catch (err) {
      console.error('Error loading admin HMS data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const statusMap: Record<string, string> = {
    'New': 'New Leads',
    'Contacted': 'RNR',
    'Follow-up': 'Followup',
    'Hospital Shortlisted': 'Converted',
    'Scheduled': 'Converted',
    'Completed': 'Converted',
    'Cancelled': 'Junk',
    'Assistance in Progress': 'Followup',
    'Hospital Selected': 'Converted',
    'Closed': 'Converted'
  };

  const filteredLeads = leads.filter(lead => {
    const displayStatus = (statusMap[lead.status] || lead.status) as string;
    const matchesSearch = 
      lead.name.toLowerCase().includes(leadSearch.toLowerCase()) ||
      lead.mobile.includes(leadSearch) ||
      lead.treatment.toLowerCase().includes(leadSearch.toLowerCase()) ||
      (lead.preferredHospitalName || '').toLowerCase().includes(leadSearch.toLowerCase());
    
    const matchesStatus = leadStatusFilter === 'All' || displayStatus === leadStatusFilter;
    return matchesSearch && matchesStatus;
  });

  const statusCounts = CRM_LEAD_STATUSES.reduce((acc, status) => {
    acc[status] = leads.filter(l => (statusMap[l.status] || l.status) === status).length;
    return acc;
  }, {} as Record<string, number>);

  // Export CSV functionality
  const handleExportCSV = () => {
    const headers = ['ID', 'Patient Name', 'Phone', 'Treatment', 'Budget', 'City', 'Status', 'Date'];
    const rows = filteredLeads.map(l => [
      l.id,
      `"${l.name}"`,
      `"${l.mobile}"`,
      `"${l.treatment}"`,
      `"${l.budget || 'Standard'}"`,
      `"${l.city || 'Bangalore'}"`,
      `"${statusMap[l.status] || l.status}"`,
      `"${new Date(l.createdAt).toLocaleDateString()}"`
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `acquire_leads_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Leads exported to CSV successfully');
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans text-slate-800">
      {/* Enterprise HMS Top Header */}
      <header className="bg-[#0B1E3B] text-white sticky top-0 z-40 border-b border-slate-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-white px-2.5 py-1 rounded-md shadow-xs">
              <Logo size="sm" showTagline={false} />
            </div>
            <div className="hidden sm:block">
              <span className="text-xs font-bold text-white tracking-wide uppercase flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-teal-400" />
                Hospital Management &amp; Decision Console
              </span>
              <span className="text-[10px] text-slate-300 block">
                Master Administration • Bangalore Network
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Quick Hospital Partner Switcher */}
            {onSwitchToHospital && hospitals.length > 0 && (
              <div className="hidden md:flex items-center gap-2 bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700 text-xs">
                <span className="text-[10px] text-slate-300 uppercase font-semibold">Partner View:</span>
                <select
                  onChange={(e) => {
                    if (e.target.value) onSwitchToHospital(e.target.value);
                  }}
                  className="bg-transparent text-teal-300 font-semibold text-xs border-0 focus:outline-hidden cursor-pointer"
                  defaultValue=""
                >
                  <option value="" disabled className="bg-slate-900 text-slate-300">Select Hospital...</option>
                  {hospitals.map(h => (
                    <option key={h.id} value={h.id} className="bg-slate-900 text-white">
                      {h.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="flex items-center gap-2 pl-2 border-l border-slate-700">
              <div className="text-right hidden sm:block">
                <span className="text-xs font-bold text-white block">{user.name || 'Master Admin'}</span>
                <span className="text-[10px] text-teal-400 block font-medium">Head of Clinical Coordination</span>
              </div>
              <button 
                onClick={onLogout} 
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 hover:text-white transition-colors cursor-pointer border border-slate-700"
                title="Sign out of Admin Console"
              >
                <LogOut className="w-3.5 h-3.5 text-slate-400" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </div>
          </div>
        </div>

        {/* Admin Navigation Bar */}
        <div className="bg-[#081528] border-t border-slate-800/90 px-4 sm:px-6 lg:px-8 overflow-x-auto">
          <div className="max-w-7xl mx-auto flex items-center justify-between py-1.5 gap-3">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab('front-office')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'front-office' 
                    ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40 shadow-xs' 
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>Front Office (Leads &amp; Queue)</span>
                {leads.length > 0 && (
                  <span className="ml-1 px-1.5 py-0.5 rounded-full text-[10px] bg-teal-500/30 text-teal-200 tabular-nums">
                    {leads.length}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTab('treatments')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'treatments' 
                    ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40 shadow-xs' 
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Stethoscope className="w-3.5 h-3.5" />
                <span>Treatments &amp; Procedures (Supabase)</span>
              </button>
            </div>

            <div className="hidden sm:flex items-center gap-2 text-[11px] text-slate-400 shrink-0">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Live DB: <code className="text-teal-300 font-mono bg-slate-800/90 px-1.5 py-0.5 rounded text-[10px] border border-slate-700">treatments.name</code></span>
            </div>
          </div>
        </div>
      </header>

      {/* Floating Notification Toast */}
      {toastMsg && (
        <div className={`fixed top-20 right-6 z-50 p-3.5 rounded-xl shadow-lg border text-xs font-semibold flex items-center gap-2.5 transition-all ${
          toastMsg.type === 'success' ? 'bg-emerald-50 text-emerald-900 border-emerald-300' : 'bg-rose-50 text-rose-900 border-rose-300'
        }`}>
          {toastMsg.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <AlertCircle className="w-4 h-4 text-rose-600" />}
          <span>{toastMsg.text}</span>
        </div>
      )}

      {/* Main Viewport Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-7 space-y-6">
        
        {/* ============================================================== */}
        {/* TAB 1: FRONT OFFICE (Leads, Intake, Inquiries, Queues) */}
        {/* ============================================================== */}
        {activeTab === 'front-office' && (
          <div className="space-y-6">
            {/* Status Summary KPI Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
              {CRM_LEAD_STATUSES.map(status => {
                const count = statusCounts[status] || 0;
                const isSelected = leadStatusFilter === status;
                return (
                  <button 
                    key={status} 
                    onClick={() => setLeadStatusFilter(status === leadStatusFilter ? 'All' : status)} 
                    className={`bg-white p-4 rounded-xl border text-left transition-all cursor-pointer shadow-xs ${
                      isSelected 
                        ? 'border-[#0B1E3B] ring-2 ring-[#0B1E3B]/20 bg-blue-50/20' 
                        : 'border-slate-200/90 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 uppercase tracking-wide">
                      <span>{status}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-[#0B1E3B]" />}
                    </div>
                    <span className="text-2xl font-bold text-slate-900 block mt-1.5 tabular-nums">
                      {count}
                    </span>
                    <span className="text-[10px] text-slate-400 mt-0.5 block">
                      {status === 'New Leads' ? 'Awaiting coordinator' : status === 'Converted' ? 'Hospital admission' : 'In follow-up pipeline'}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Front Office Inbound Queue */}
            <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden">
              <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-base font-bold text-slate-900">Front Office • Inbound Patient Queue</h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Real-time surgery requests submitted through Acquire Surgery website and hospital search engine.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={handleExportCSV}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                    title="Export filtered records"
                  >
                    <Download className="w-3.5 h-3.5 text-slate-500" />
                    <span>Export CSV</span>
                  </button>
                  <button 
                    onClick={() => loadData()} 
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0B1E3B] text-white text-xs font-semibold hover:bg-[#071325] transition-colors cursor-pointer shadow-xs"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                    <span>Refresh</span>
                  </button>
                </div>
              </div>

              {/* Filters Strip */}
              <div className="p-4 bg-slate-50/60 border-b border-slate-100 grid grid-cols-1 sm:grid-cols-12 gap-3">
                <div className="sm:col-span-8 relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input 
                    type="text" 
                    value={leadSearch} 
                    onChange={(e) => setLeadSearch(e.target.value)} 
                    placeholder="Search by patient name, mobile number, surgery name, or hospital..." 
                    className="w-full pl-9 pr-4 py-2 text-xs border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-[#0B1E3B] focus:border-[#0B1E3B]" 
                  />
                </div>
                <div className="sm:col-span-4">
                  <select 
                    value={leadStatusFilter} 
                    onChange={(e) => setLeadStatusFilter(e.target.value)} 
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white font-medium focus:ring-2 focus:ring-[#0B1E3B]"
                  >
                    <option value="All">All Statuses ({leads.length})</option>
                    {CRM_LEAD_STATUSES.map(s => (
                      <option key={s} value={s}>{s} ({statusCounts[s] || 0})</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs min-w-[900px]">
                  <thead className="bg-slate-50 text-slate-600 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-3">Patient</th>
                      <th className="px-4 py-3">Treatment Required</th>
                      <th className="px-4 py-3">Budget Bracket</th>
                      <th className="px-4 py-3">Submission</th>
                      <th className="px-4 py-3">CRM Status</th>
                      <th className="px-4 py-3">Assigned Hospital</th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredLeads.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-4 py-12 text-center text-slate-400">
                          No patient records found matching current search and status filter.
                        </td>
                      </tr>
                    ) : (
                      filteredLeads.map(lead => (
                        <tr key={lead.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="px-4 py-3">
                            <span className="font-bold text-slate-900 block">{lead.name}</span>
                            <span className="text-[11px] text-slate-500 font-mono tabular-nums">{lead.mobile}</span>
                          </td>
                          <td className="px-4 py-3">
                            <span className="font-semibold text-[#0B1E3B]">{lead.treatment}</span>
                            <span className="text-[10px] text-slate-400 block">{lead.city || 'Bangalore'}</span>
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-slate-700 font-medium tabular-nums">{lead.budget || 'Standard'}</span>
                          </td>
                          <td className="px-4 py-3 text-slate-500 text-[11px] tabular-nums">
                            {new Date(lead.createdAt).toLocaleDateString('en-IN', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric'
                            })}
                          </td>
                          <td className="px-4 py-3">
                            <select 
                              value={statusMap[lead.status] || lead.status} 
                              onChange={async (e) => {
                                const newStat = e.target.value as any;
                                try {
                                  const updated = await api.updateLead(lead.id, { 
                                    status: newStat, 
                                    authorName: user.name, 
                                    note: `Status changed to ${newStat} by ${user.name}` 
                                  });
                                  setLeads(prev => prev.map(l => l.id === lead.id ? updated : l));
                                  showToast(`Status updated to ${newStat}`);
                                } catch (err) {
                                  showToast('Failed to update status', 'error');
                                }
                              }} 
                              className={`px-2 py-1 text-xs rounded-md border font-semibold cursor-pointer ${
                                (statusMap[lead.status] || lead.status) === 'New Leads' 
                                  ? 'bg-blue-50 text-blue-800 border-blue-200' 
                                  : (statusMap[lead.status] || lead.status) === 'Converted' 
                                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                  : (statusMap[lead.status] || lead.status) === 'Followup'
                                  ? 'bg-amber-50 text-amber-800 border-amber-200'
                                  : 'bg-slate-100 text-slate-700 border-slate-200'
                              }`}
                            >
                              {CRM_LEAD_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                          </td>
                          <td className="px-4 py-3 text-slate-600 text-xs">
                            {lead.preferredHospitalName || 'Bangalore General Network'}
                          </td>
                          <td className="px-4 py-3 text-right">
                            <button 
                              onClick={() => setLeadNotesModalTarget(lead)} 
                              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold text-[#0B1E3B] hover:bg-blue-50 transition-colors cursor-pointer border border-blue-100"
                            >
                              <MessageSquare className="w-3.5 h-3.5 text-teal-600" />
                              <span>Notes ({lead.notes?.length || 0})</span>
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 2: TREATMENTS & PROCEDURES (Supabase treatments table)     */}
        {/* ============================================================== */}
        {activeTab === 'treatments' && (
          <div className="space-y-6">
            <ManageTreatmentsSection />
          </div>
        )}

      </main>

      {/* Leads Notes Modal */}
      {leadNotesModalTarget && (
        <LeadsNotesModal 
          lead={leadNotesModalTarget} 
          currentUser={user} 
          onClose={() => setLeadNotesModalTarget(null)} 
          onLeadUpdated={(updated) => { 
            setLeads(prev => prev.map(l => l.id === updated.id ? updated : l)); 
          }} 
        />
      )}
    </div>
  );
};
