import React, { useState, useEffect } from 'react';
import { Lead, AuthUser, LeadStatus } from '../../types';
import { api } from '../../services/api';
import { Logo } from '../Logo';
import { Users, Search, Phone, MessageSquare, RefreshCw, LogOut, CheckCircle2, AlertCircle, Calendar, Stethoscope, ListOrdered } from 'lucide-react';
import { LeadsNotesModal } from './LeadsNotesModal';
import { ManageTreatmentsSection } from './ManageTreatmentsSection';

interface AdminDashboardProps {
  user: AuthUser;
  onLogout: () => void;
  onClose: () => void;
  onSwitchToHospital?: (hospitalId: string) => void;
}

const CRM_LEAD_STATUSES: LeadStatus[] = [
  'New Leads', 'RNR', 'Followup', 'Converted', 'Junk'
];

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ user, onLogout, onClose, onSwitchToHospital }) => {
  const [activeTab, setActiveTab] = useState<'leads' | 'treatments'>('leads');
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [leadSearch, setLeadSearch] = useState('');
  const [leadStatusFilter, setLeadStatusFilter] = useState('All');
  const [leadNotesModalTarget, setLeadNotesModalTarget] = useState<Lead | null>(null);
  const [toastMsg, setToastMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToastMsg({ type, text });
    setTimeout(() => setToastMsg(null), 4000);
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const leadsData = await api.getLeads();
      setLeads(leadsData);
    } catch (err) {
      console.error('Error loading leads', err);
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
    acc[status] = leads.filter(l => l.status === status).length;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-slate-800">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Logo size="sm" showTagline={false} />
            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-[#062B61] text-white">Admin Dashboard</span>
          </div>

          <div className="flex items-center gap-3">
            {/* Navigation Tabs */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
              <button
                onClick={() => setActiveTab('leads')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${activeTab === 'leads' ? 'bg-white text-[#062B61] shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
              >
                <ListOrdered className="w-3.5 h-3.5" />
                <span>Website Leads</span>
              </button>
              <button
                onClick={() => setActiveTab('treatments')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${activeTab === 'treatments' ? 'bg-white text-[#062B61] shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
              >
                <Stethoscope className="w-3.5 h-3.5" />
                <span>Manage Treatments</span>
              </button>
            </div>

            <button onClick={onLogout} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer">
              <LogOut className="w-3.5 h-3.5 text-slate-500" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {activeTab === 'treatments' ? (
          <ManageTreatmentsSection />
        ) : (
          <>
            {/* Status Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {CRM_LEAD_STATUSES.map(status => (
                <button key={status} onClick={() => setLeadStatusFilter(status)} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs text-left hover:border-[#062B61] transition-all cursor-pointer">
                  <span className="text-[10px] font-bold text-slate-500 uppercase">{status}</span>
                  <span className="text-xl font-bold text-slate-900 block mt-1">{statusCounts[status] || 0}</span>
                </button>
              ))}
            </div>

            {/* Website Leads Table Card */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
                <h2 className="text-base font-bold text-slate-900">Website Leads</h2>
                <button onClick={() => loadData()} className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer">
                  <RefreshCw className="w-3.5 h-3.5" /> Refresh
                </button>
              </div>
              
              {/* Filters */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-5 pb-2">
                <div className="sm:col-span-2 relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input type="text" value={leadSearch} onChange={(e) => setLeadSearch(e.target.value)} placeholder="Search by patient name, phone, or treatment..." className="w-full pl-10 pr-4 py-2 text-xs border border-slate-300 rounded-xl bg-white focus:ring-2 focus:ring-[#062B61]" />
                </div>
                <select value={leadStatusFilter} onChange={(e) => setLeadStatusFilter(e.target.value)} className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl bg-white font-medium focus:ring-2 focus:ring-[#062B61]">
                  <option value="All">All Statuses</option>
                  {CRM_LEAD_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              {/* Leads Table */}
              <div className="mt-4 overflow-x-auto rounded-xl border border-slate-200">
                <table className="w-full text-left text-xs min-w-[950px]">
                  <thead className="bg-slate-50 text-slate-600 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-3">ID</th>
                      <th className="px-4 py-3">Name</th>
                      <th className="px-4 py-3">Phone</th>
                      <th className="px-4 py-3">Email</th>
                      <th className="px-4 py-3">Submission Date</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3">Follow-up</th>
                      <th className="px-4 py-3">Notes</th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredLeads.map(lead => (
                      <tr key={lead.id} className="hover:bg-slate-50/80">
                        <td className="px-4 py-3 text-slate-500">{lead.id.slice(-6)}</td>
                        <td className="px-4 py-3 font-bold text-slate-900">{lead.name}</td>
                        <td className="px-4 py-3 text-slate-700">{lead.mobile}</td>
                        <td className="px-4 py-3 text-slate-700">-</td>
                        <td className="px-4 py-3 text-slate-500">{new Date(lead.createdAt).toLocaleDateString()}</td>
                        <td className="px-4 py-3">
                          <select value={statusMap[lead.status] || lead.status} onChange={async (e) => {
                              const newStat = e.target.value as any;
                              const updated = await api.updateLead(lead.id, { status: newStat, authorName: user.name, note: 'Status changed' });
                              setLeads(prev => prev.map(l => l.id === lead.id ? updated : l));
                              showToast('Status updated');
                          }} className="px-2 py-1 text-xs rounded-lg border border-slate-300 bg-white">
                            {CRM_LEAD_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                          </select>
                        </td>
                        <td className="px-4 py-3 text-slate-500">{lead.followUpDate || '-'}</td>
                        <td className="px-4 py-3">
                          <button onClick={() => setLeadNotesModalTarget(lead)} className="inline-flex items-center gap-1 text-[#062B61] cursor-pointer"><MessageSquare className="w-3.5 h-3.5"/> Notes</button>
                        </td>
                        <td className="px-4 py-3 text-right">Actions</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </main>
      {leadNotesModalTarget && <LeadsNotesModal lead={leadNotesModalTarget} currentUser={user} onClose={() => setLeadNotesModalTarget(null)} onLeadUpdated={(updated) => { setLeads(prev => prev.map(l => l.id === updated.id ? updated : l)); }} />}
    </div>
  );
};
