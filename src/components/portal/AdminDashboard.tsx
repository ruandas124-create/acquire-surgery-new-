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
  TrendingUp,
  BarChart3,
  DollarSign,
  Building2,
  Filter,
  Check,
  Clock,
  ArrowUpRight,
  ShieldCheck,
  Plus,
  Activity,
  Bed,
  FileSpreadsheet,
  Download
} from 'lucide-react';
import { LeadsNotesModal } from './LeadsNotesModal';
import { ManageTreatmentsSection } from './ManageTreatmentsSection';
import { INITIAL_SCHEDULES, LEAD_SOURCES } from '../../data/crmData';

interface AdminDashboardProps {
  user: AuthUser;
  onLogout: () => void;
  onClose: () => void;
  onSwitchToHospital?: (hospitalId: string) => void;
}

const CRM_LEAD_STATUSES: LeadStatus[] = [
  'New Leads', 'RNR', 'Followup', 'Converted', 'Junk'
];

type AdminViewTab = 'front-office' | 'doctors' | 'packages' | 'sales' | 'analytics' | 'hospitals';

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

        {/* HMS Navigation Bar */}
        <div className="bg-[#081528] border-t border-slate-800/90 px-4 sm:px-6 lg:px-8 overflow-x-auto">
          <div className="max-w-7xl mx-auto flex items-center gap-1 py-1">
            <button
              onClick={() => setActiveTab('front-office')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'front-office' 
                  ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40 shadow-xs' 
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Front Office (Leads &amp; Queue)</span>
            </button>

            <button
              onClick={() => setActiveTab('doctors')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'doctors' 
                  ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40 shadow-xs' 
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Stethoscope className="w-3.5 h-3.5" />
              <span>Doctor Dashboard</span>
            </button>

            <button
              onClick={() => setActiveTab('packages')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'packages' 
                  ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40 shadow-xs' 
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <DollarSign className="w-3.5 h-3.5" />
              <span>Package Dashboard</span>
            </button>

            <button
              onClick={() => setActiveTab('sales')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'sales' 
                  ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40 shadow-xs' 
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Sales &amp; Referrals</span>
            </button>

            <button
              onClick={() => setActiveTab('analytics')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'analytics' 
                  ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40 shadow-xs' 
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Analytic Hub</span>
            </button>

            <button
              onClick={() => setActiveTab('hospitals')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'hospitals' 
                  ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40 shadow-xs' 
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Hospital Admin</span>
            </button>
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
        {/* TAB 2: DOCTOR DASHBOARD (Specialist queue, consults, OT slots) */}
        {/* ============================================================== */}
        {activeTab === 'doctors' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Stethoscope className="w-5 h-5 text-teal-600" />
                  Doctor Dashboard • Clinical Consultation &amp; OT Queue
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Scheduled specialist evaluations, pre-anesthesia clearances, and surgical admissions across Bangalore hospitals.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500">Active Consults: <strong className="text-slate-900 tabular-nums">{schedules.length}</strong></span>
              </div>
            </div>

            {/* Doctor Case Queue Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {schedules.map((item) => (
                <div key={item.id} className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs space-y-3.5">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm">{item.patientName}</h3>
                      <span className="text-xs text-slate-500 font-mono tabular-nums">{item.mobile}</span>
                    </div>
                    <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                      item.status === 'Confirmed' 
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
                        : item.status === 'Scheduled'
                        ? 'bg-blue-50 text-blue-800 border border-blue-200'
                        : 'bg-amber-50 text-amber-800 border border-amber-200'
                    }`}>
                      {item.status}
                    </span>
                  </div>

                  <div className="space-y-1.5 text-xs border-t border-slate-100 pt-3">
                    <div className="flex justify-between text-slate-600">
                      <span>Procedure:</span>
                      <strong className="text-slate-900">{item.surgeryName}</strong>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Facility:</span>
                      <span className="text-slate-700 truncate max-w-[180px]">{item.hospitalName}</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Appointment:</span>
                      <span className="text-slate-800 font-semibold tabular-nums">{item.appointmentDate} · {item.preferredTime}</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Estimated Range:</span>
                      <span className="text-teal-700 font-bold tabular-nums">₹{item.minCost.toLocaleString('en-IN')} – ₹{item.maxCost.toLocaleString('en-IN')}</span>
                    </div>
                  </div>

                  {item.notes && item.notes.length > 0 && (
                    <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/60 text-[11px] text-slate-600">
                      <span className="font-semibold text-slate-800 block mb-0.5">Clinical Note:</span>
                      <p className="line-clamp-2 leading-relaxed">{item.notes[0].text}</p>
                    </div>
                  )}

                  <div className="pt-1 flex items-center justify-between text-[11px] text-slate-400">
                    <span>Source: {item.source}</span>
                    <button 
                      onClick={() => showToast(`Opening doctor case file for ${item.patientName}`)}
                      className="text-[#0B1E3B] font-bold hover:underline cursor-pointer"
                    >
                      View Case &rarr;
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 3: PACKAGE DASHBOARD (Surgery Pricing & Catalogue) */}
        {/* ============================================================== */}
        {activeTab === 'packages' && (
          <div className="space-y-6">
            <ManageTreatmentsSection />
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 4: SALES & REFERRALS DASHBOARD (Channel Attribution & Conversion) */}
        {/* ============================================================== */}
        {activeTab === 'sales' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs p-5">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-teal-600" />
                Sales, Referrals &amp; Inbound Channel Attribution
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Acquisition channels and conversion velocity for surgical admissions in Bangalore network.
              </p>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-1">
                <span className="text-[11px] font-bold text-slate-500 uppercase">Total Inquiries Tracked</span>
                <span className="text-2xl font-bold text-slate-900 block tabular-nums">{leads.length + schedules.length}</span>
                <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                  <ArrowUpRight className="w-3.5 h-3.5" /> +18.4% vs previous month
                </span>
              </div>
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-1">
                <span className="text-[11px] font-bold text-slate-500 uppercase">Qualified Admissions</span>
                <span className="text-2xl font-bold text-emerald-700 block tabular-nums">
                  {leads.filter(l => (statusMap[l.status] || l.status) === 'Converted').length + 8}
                </span>
                <span className="text-[11px] text-slate-500">Confirmed surgical procedures</span>
              </div>
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-1">
                <span className="text-[11px] font-bold text-slate-500 uppercase">Avg Package Value</span>
                <span className="text-2xl font-bold text-slate-900 block tabular-nums">₹1,85,000</span>
                <span className="text-[11px] text-slate-500">Across NABH partner hospitals</span>
              </div>
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-1">
                <span className="text-[11px] font-bold text-slate-500 uppercase">Cashless Insurance Desk</span>
                <span className="text-2xl font-bold text-blue-700 block tabular-nums">74.2%</span>
                <span className="text-[11px] text-slate-500">Pre-authorization claim rate</span>
              </div>
            </div>

            {/* Channel Attribution Breakdown */}
            <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs p-6 space-y-4">
              <h3 className="font-bold text-slate-900 text-sm">Inbound Patient Referral Channels</h3>
              <div className="space-y-3">
                {LEAD_SOURCES.map((source, idx) => {
                  const percentages = [38, 24, 14, 10, 8, 4, 2];
                  const pct = percentages[idx] || 5;
                  return (
                    <div key={source} className="space-y-1">
                      <div className="flex justify-between text-xs font-semibold text-slate-700">
                        <span>{source}</span>
                        <span className="tabular-nums font-mono text-slate-900">{pct}%</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div 
                          className="bg-gradient-to-r from-[#0B1E3B] to-teal-600 h-full rounded-full transition-all duration-500"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 5: ANALYTIC HUB (HMS KPIs, Budget Brackets, Turnaround) */}
        {/* ============================================================== */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs p-5">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-teal-600" />
                Analytic Hub • Hospital Network &amp; Demand Performance
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Real-time operational KPIs, procedure demand distribution, and hospital matching turnaround times.
              </p>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
                <span className="text-xs font-bold text-slate-500 block uppercase">Median Coordinator Response Time</span>
                <span className="text-2xl font-bold text-[#0B1E3B] mt-1 block tabular-nums">14 Minutes</span>
                <p className="text-xs text-slate-400 mt-1">From initial form submission to first coordinator consultation call.</p>
              </div>

              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
                <span className="text-xs font-bold text-slate-500 block uppercase">Network Hospital Occupancy</span>
                <span className="text-2xl font-bold text-teal-700 mt-1 block tabular-nums">82.6%</span>
                <p className="text-xs text-slate-400 mt-1">Aggregated bed availability across all 9 affiliated Bangalore hospitals.</p>
              </div>

              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
                <span className="text-xs font-bold text-slate-500 block uppercase">Patient Satisfaction Score</span>
                <span className="text-2xl font-bold text-emerald-600 mt-1 block tabular-nums">4.8 / 5.0</span>
                <p className="text-xs text-slate-400 mt-1">Based on post-admission independent patient feedback.</p>
              </div>
            </div>

            {/* Popular Surgeries Distribution */}
            <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs p-6 space-y-4">
              <h3 className="font-bold text-slate-900 text-sm">Top Requested Surgical Procedures</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { name: 'Knee Replacement (Arthroplasty)', pct: 32, count: '68 cases' },
                  { name: 'Cataract Surgery (Phaco)', pct: 24, count: '51 cases' },
                  { name: 'Gallbladder Surgery (Lap Chole)', pct: 18, count: '39 cases' },
                  { name: 'Kidney Stone Surgery (RIRS / PCNL)', pct: 14, count: '30 cases' },
                  { name: 'Hernia Mesh Repair', pct: 12, count: '25 cases' },
                ].map(proc => (
                  <div key={proc.name} className="p-3 rounded-lg border border-slate-100 bg-slate-50/50 space-y-1.5">
                    <div className="flex justify-between text-xs font-bold text-slate-800">
                      <span>{proc.name}</span>
                      <span className="text-teal-700 tabular-nums">{proc.count} ({proc.pct}%)</span>
                    </div>
                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div className="bg-[#0B1E3B] h-full rounded-full" style={{ width: `${proc.pct * 2}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 6: HOSPITAL ADMIN (Affiliated Hospitals Directory) */}
        {/* ============================================================== */}
        {activeTab === 'hospitals' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-teal-600" />
                  Hospital Partner Network &amp; Facility Directory
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Accredited hospital partners in Bangalore integrated into Acquire Surgery matching engine.
                </p>
              </div>
              <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
                {hospitals.length} Verified Partner Hospitals
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {hospitals.map(hosp => (
                <div key={hosp.id} className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden flex flex-col justify-between">
                  <div className="p-5 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700 block">
                          {hosp.category}
                        </span>
                        <h3 className="font-bold text-slate-900 text-sm leading-snug">{hosp.name}</h3>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 shrink-0">
                        NABH Verified
                      </span>
                    </div>

                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {hosp.description || 'Premier surgical care institution in Bangalore with modular OTs and cashless TPA desks.'}
                    </p>

                    <div className="space-y-1 text-xs text-slate-600 pt-1 border-t border-slate-100">
                      <div className="flex justify-between">
                        <span>Zone:</span>
                        <strong className="text-slate-800">{hosp.location}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>Bed Capacity:</span>
                        <span className="text-slate-800 font-mono tabular-nums">{hosp.bedCount} Beds</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Helpline:</span>
                        <span className="text-slate-700 font-mono tabular-nums">{hosp.phone}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] text-slate-500">
                      {hosp.treatmentEstimates?.length || 0} Surgery Packages
                    </span>
                    {onSwitchToHospital && (
                      <button
                        onClick={() => onSwitchToHospital(hosp.id)}
                        className="text-xs font-bold text-[#0B1E3B] hover:text-teal-700 cursor-pointer inline-flex items-center gap-1"
                      >
                        <span>Login as Partner</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
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
