import React, { useState, useEffect } from 'react';
import { 
  AuthUser, 
  Hospital, 
  Lead, 
  HospitalSurgery, 
  HospitalOperatingHour,
  HospitalAddress,
  DayOfWeek,
  HospitalCapacityStatus
} from '../../types';
import { api } from '../../services/api';
import { authService } from '../../services/auth';
import { 
  getHospitalAddress, 
  getHospitalOperatingHours, 
  getHospitalSurgeries,
  DAYS_OF_WEEK
} from '../../data/crmData';
import { 
  Building2, 
  FileText, 
  Clock, 
  MapPin, 
  Plus, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  XCircle, 
  Save, 
  IndianRupee, 
  ShieldCheck, 
  LogOut, 
  KeyRound, 
  Users, 
  Bed, 
  Activity, 
  Check, 
  AlertCircle,
  Eye,
  EyeOff,
  Sparkles,
  Phone,
  Mail,
  ExternalLink,
  ChevronRight,
  Filter
} from 'lucide-react';
import { Logo } from '../Logo';

interface HospitalDashboardProps {
  user: AuthUser;
  hospitals: Hospital[];
  onLogout: () => void;
  onClose: () => void;
  onSwitchHospital?: (hospitalId: string) => void;
}

export const HospitalDashboard: React.FC<HospitalDashboardProps> = ({
  user,
  hospitals,
  onLogout,
  onClose,
}) => {
  // Find current hospital partner
  const currentHospitalId = user.hospitalId || hospitals[0]?.id || 'hosp-manipal-oar';
  const hospital = hospitals.find(h => h.id === currentHospitalId) || hospitals[0];

  const [activeTab, setActiveTab] = useState<'profile' | 'surgeries' | 'hours' | 'leads' | 'capacity' | 'security'>('profile');
  const [loading, setLoading] = useState(false);

  // Success / Error notification banner
  const [successToast, setSuccessToast] = useState<string | null>(null);
  const [errorToast, setErrorToast] = useState<string | null>(null);

  // 1. Hospital Basic Info State
  const [hospitalName, setHospitalName] = useState(hospital?.name || '');
  const [imageUrl, setImageUrl] = useState(hospital?.imageUrl || '');
  const [registrationNumber, setRegistrationNumber] = useState(hospital?.registrationNumber || 'REG-KA-2018-09412');
  const [mobileNumber, setMobileNumber] = useState(hospital?.mobile || hospital?.phone || '+91 94296 93887');
  const [emailAddress, setEmailAddress] = useState(hospital?.email || user.email || 'acquireopd@gmail.com');
  const [category, setCategory] = useState(hospital?.category || 'Standard Hospital');
  const [description, setDescription] = useState(hospital?.description || '');

  // 2. Hospital Address State (Broken into separate fields)
  const [addressLine1, setAddressLine1] = useState('');
  const [addressLine2, setAddressLine2] = useState('');
  const [stateName, setStateName] = useState('Karnataka');
  const [cityName, setCityName] = useState('Bangalore');
  const [areaLocality, setAreaLocality] = useState('');
  const [pincode, setPincode] = useState('');

  // 3. Hospital Operating Hours State (Monday through Sunday)
  const [operatingHours, setOperatingHours] = useState<HospitalOperatingHour[]>([]);

  // 4. Surgery & Treatment Management State
  const [surgeries, setSurgeries] = useState<HospitalSurgery[]>([]);
  const [surgeryModalOpen, setSurgeryModalOpen] = useState(false);
  const [editingSurgeryId, setEditingSurgeryId] = useState<string | null>(null);
  const [surgeryName, setSurgeryName] = useState('');
  const [minCost, setMinCost] = useState('');
  const [maxCost, setMaxCost] = useState('');
  const [surgeryDesc, setSurgeryDesc] = useState('');
  const [surgeryStatus, setSurgeryStatus] = useState<'Active' | 'Inactive'>('Active');

  // 5. Change Password State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // 6. Assigned Leads
  const [leads, setLeads] = useState<Lead[]>([]);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [noteText, setNoteText] = useState('');

  // 7. Capacity
  const [capacity, setCapacity] = useState<HospitalCapacityStatus>({
    icuStatus: 'Available',
    generalBedsAvailable: Math.round((hospital?.bedCount || 200) * 0.15),
    emergencyActive: true,
    acceptingReferrals: true,
    tpaDeskOpen: true,
  });

  // Load initial hospital data
  useEffect(() => {
    if (hospital) {
      setHospitalName(hospital.name);
      setImageUrl(hospital.imageUrl || '');
      setRegistrationNumber(hospital.registrationNumber || 'REG-KA-2018-09412');
      setMobileNumber(hospital.mobile || hospital.phone || '+91 94296 93887');
      setEmailAddress(hospital.email || user.email || 'acquireopd@gmail.com');
      setCategory(hospital.category);
      setDescription(hospital.description || '');

      // Load Address
      const addr = getHospitalAddress(hospital);
      setAddressLine1(addr.line1 || '');
      setAddressLine2(addr.line2 || '');
      setAreaLocality(addr.area || hospital.location || '');
      setCityName(addr.city || 'Bangalore');
      setStateName(addr.state || 'Karnataka');
      setPincode(addr.pincode || '560001');

      // Load Operating Hours
      setOperatingHours(getHospitalOperatingHours(hospital));

      // Load Surgeries
      setSurgeries(getHospitalSurgeries(hospital));
    }
  }, [hospital, user.email]);

  // Load leads
  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const all = await api.getLeads();
        // Filter leads relevant to this hospital
        const relevant = all.filter(l => 
          l.preferredHospitalId === hospital?.id || 
          l.matchedHospitalIds?.includes(hospital?.id) ||
          surgeries.some(s => s.name.toLowerCase().includes(l.treatment.toLowerCase()))
        );
        setLeads(relevant);
      } catch (err) {
        console.error('Error fetching hospital leads', err);
      }
    };
    fetchLeads();
  }, [hospital?.id, surgeries]);

  // Show Toast
  const notifySuccess = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(null), 4000);
  };

  const notifyError = (msg: string) => {
    setErrorToast(msg);
    setTimeout(() => setErrorToast(null), 4000);
  };

  // Toggle day open/closed
  const handleToggleDay = (day: DayOfWeek) => {
    setOperatingHours(prev => prev.map(h => {
      if (h.day === day) {
        return { ...h, isOpen: !h.isOpen };
      }
      return h;
    }));
  };

  // Change day timings
  const handleTimeChange = (day: DayOfWeek, field: 'openTime' | 'closeTime', value: string) => {
    setOperatingHours(prev => prev.map(h => {
      if (h.day === day) {
        return { ...h, [field]: value };
      }
      return h;
    }));
  };

  // Save Hospital Profile & Address & Operating Hours
  const handleSaveProfile = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);

    try {
      const fullAddressString = `${addressLine1}${addressLine2 ? ', ' + addressLine2 : ''}, ${areaLocality}, ${cityName}, ${stateName} ${pincode}`;
      
      const updatedData: Partial<Hospital> = {
        name: hospitalName,
        imageUrl,
        registrationNumber,
        mobile: mobileNumber,
        phone: mobileNumber,
        email: emailAddress,
        category,
        description,
        location: areaLocality,
        city: cityName,
        address: fullAddressString,
        addressDetails: {
          line1: addressLine1,
          line2: addressLine2,
          area: areaLocality,
          city: cityName,
          state: stateName,
          pincode: pincode,
        },
        operatingHours,
        surgeries,
        treatmentEstimates: surgeries.map(s => ({
          treatmentName: s.name,
          minCost: s.minCost,
          maxCost: s.maxCost,
          notes: s.description,
          status: s.status,
        })),
      };

      await api.updateHospital(hospital.id, updatedData);
      notifySuccess('Hospital profile and operational information updated successfully!');
    } catch (err: any) {
      notifyError(err?.message || 'Failed to update hospital profile.');
    } finally {
      setLoading(false);
    }
  };

  // Open Add Surgery Modal
  const handleOpenAddSurgery = () => {
    setEditingSurgeryId(null);
    setSurgeryName('');
    setMinCost('');
    setMaxCost('');
    setSurgeryDesc('');
    setSurgeryStatus('Active');
    setSurgeryModalOpen(true);
  };

  // Open Edit Surgery Modal
  const handleOpenEditSurgery = (surg: HospitalSurgery) => {
    setEditingSurgeryId(surg.id);
    setSurgeryName(surg.name);
    setMinCost(surg.minCost.toString());
    setMaxCost(surg.maxCost.toString());
    setSurgeryDesc(surg.description || '');
    setSurgeryStatus(surg.status);
    setSurgeryModalOpen(true);
  };

  // Save / Update Surgery
  const handleSaveSurgery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!surgeryName.trim()) {
      notifyError('Surgery name is required');
      return;
    }
    const min = parseInt(minCost.replace(/[^0-9]/g, ''), 10) || 10000;
    const max = parseInt(maxCost.replace(/[^0-9]/g, ''), 10) || min * 1.5;

    let updatedList: HospitalSurgery[];
    if (editingSurgeryId) {
      updatedList = surgeries.map(s => {
        if (s.id === editingSurgeryId) {
          return {
            ...s,
            name: surgeryName.trim(),
            minCost: min,
            maxCost: max,
            description: surgeryDesc.trim(),
            status: surgeryStatus,
          };
        }
        return s;
      });
    } else {
      const newSurg: HospitalSurgery = {
        id: `surg-${Date.now()}`,
        name: surgeryName.trim(),
        minCost: min,
        maxCost: max,
        description: surgeryDesc.trim(),
        status: surgeryStatus,
      };
      updatedList = [newSurg, ...surgeries];
    }

    setSurgeries(updatedList);
    setSurgeryModalOpen(false);

    // Persist to backend
    try {
      await api.updateHospital(hospital.id, {
        surgeries: updatedList,
        treatmentEstimates: updatedList.map(s => ({
          treatmentName: s.name,
          minCost: s.minCost,
          maxCost: s.maxCost,
          notes: s.description,
          status: s.status,
        })),
      });
      notifySuccess(editingSurgeryId ? 'Surgery updated successfully!' : 'New surgery added successfully!');
    } catch {
      notifyError('Failed to persist surgery changes to server');
    }
  };

  // Toggle Surgery Status (Activate / Deactivate)
  const handleToggleSurgeryStatus = async (surgId: string) => {
    const updated = surgeries.map(s => {
      if (s.id === surgId) {
        const nextStatus: 'Active' | 'Inactive' = s.status === 'Active' ? 'Inactive' : 'Active';
        return { ...s, status: nextStatus };
      }
      return s;
    });
    setSurgeries(updated);

    try {
      await api.updateHospital(hospital.id, {
        surgeries: updated,
        treatmentEstimates: updated.map(s => ({
          treatmentName: s.name,
          minCost: s.minCost,
          maxCost: s.maxCost,
          notes: s.description,
          status: s.status,
        })),
      });
      notifySuccess('Surgery status updated!');
    } catch {
      notifyError('Failed to update surgery status');
    }
  };

  // Delete Surgery
  const handleDeleteSurgery = async (surgId: string) => {
    if (!confirm('Are you sure you want to remove this surgery from your hospital list?')) return;

    const updated = surgeries.filter(s => s.id !== surgId);
    setSurgeries(updated);

    try {
      await api.updateHospital(hospital.id, {
        surgeries: updated,
        treatmentEstimates: updated.map(s => ({
          treatmentName: s.name,
          minCost: s.minCost,
          maxCost: s.maxCost,
          notes: s.description,
          status: s.status,
        })),
      });
      notifySuccess('Surgery removed successfully');
    } catch {
      notifyError('Failed to remove surgery');
    }
  };

  // Handle Change Password
  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('New password and confirm password do not match');
      return;
    }

    const res = authService.changePassword(hospital.id, currentPassword, newPassword);
    if (res.success) {
      setPasswordSuccess('Password successfully changed! Use your new password on your next login.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      notifySuccess('Password updated successfully');
    } else {
      setPasswordError(res.error || 'Failed to change password');
    }
  };

  return (
    <div id="acquire-hospital-crm" className="min-h-screen bg-slate-100 flex flex-col">
      {/* Top Professional Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Logo size="sm" showTagline={false} />
            <div className="h-6 w-px bg-slate-200 hidden sm:block" />
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-[#062B61] text-white">
                Hospital Partner Portal
              </span>
              <span className="text-xs text-slate-500 font-semibold hidden md:inline">
                {hospital.name}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <div className="text-xs font-bold text-slate-800">{user.name}</div>
              <div className="text-[11px] text-slate-500">{hospital.location} Desk</div>
            </div>

            <button
              onClick={onLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5 text-slate-500" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex overflow-x-auto gap-1 border-t border-slate-100 no-scrollbar">
          {[
            { id: 'profile', label: 'Hospital Profile & Address', icon: Building2 },
            { id: 'hours', label: 'Operating Hours', icon: Clock },
            { id: 'surgeries', label: `Surgery & Treatments (${surgeries.length})`, icon: FileText },
            { id: 'leads', label: `Patient Inquiries (${leads.length})`, icon: Users },
            { id: 'capacity', label: 'Capacity & TPA Desk', icon: Bed },
            { id: 'security', label: 'Change Password', icon: KeyRound },
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-3 text-xs font-semibold border-b-2 whitespace-nowrap transition-colors cursor-pointer ${
                  isActive
                    ? 'border-[#062B61] text-[#062B61] bg-blue-50/50'
                    : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#062B61]' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </header>

      {/* Notification Toast */}
      {successToast && (
        <div className="fixed top-20 right-6 z-50 bg-emerald-700 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 text-xs font-semibold animate-in fade-in slide-in-from-top-4">
          <CheckCircle2 className="w-5 h-5 text-emerald-200 shrink-0" />
          <span>{successToast}</span>
        </div>
      )}
      {errorToast && (
        <div className="fixed top-20 right-6 z-50 bg-rose-700 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 text-xs font-semibold animate-in fade-in slide-in-from-top-4">
          <AlertCircle className="w-5 h-5 text-rose-200 shrink-0" />
          <span>{errorToast}</span>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* TAB 1: HOSPITAL PROFILE & STRUCTURED ADDRESS */}
        {activeTab === 'profile' && (
          <form onSubmit={handleSaveProfile} className="space-y-6">
            {/* Top Card: Basic Information */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 sm:p-7">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
                <div>
                  <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-[#062B61]" />
                    Hospital Basic Information
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Manage your hospital's public branding, official licensing, and verified contact points.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#062B61] hover:bg-[#0A3B75] text-white text-xs font-bold transition-all shadow-xs cursor-pointer disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    <span>{loading ? 'Saving Changes...' : 'Save Changes'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSaveProfile()}
                    disabled={loading}
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
                  >
                    Update Profile
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 pt-6">
                {/* Hospital Name */}
                <div className="sm:col-span-2">
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">
                    Hospital Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={hospitalName}
                    onChange={(e) => setHospitalName(e.target.value)}
                    placeholder="e.g. Manipal Hospital, Old Airport Road"
                    className="w-full px-3.5 py-2.5 text-xs font-medium border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#062B61] focus:border-[#062B61] bg-white"
                  />
                </div>

                {/* Registration / License Number */}
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">
                    Hospital Registration / License Number <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={registrationNumber}
                    onChange={(e) => setRegistrationNumber(e.target.value)}
                    placeholder="e.g. REG-KA-2018-09412"
                    className="w-full px-3.5 py-2.5 text-xs font-medium border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#062B61] focus:border-[#062B61] bg-white"
                  />
                </div>

                {/* Profile Picture / Logo URL */}
                <div className="sm:col-span-3">
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">
                    Hospital Profile Picture / Logo Image URL
                  </label>
                  <div className="flex gap-3 items-center">
                    <div className="w-14 h-14 rounded-xl border border-slate-200 overflow-hidden shrink-0 bg-slate-50 flex items-center justify-center">
                      {imageUrl ? (
                        <img 
                          src={imageUrl} 
                          alt="Hospital Logo Preview" 
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <Building2 className="w-6 h-6 text-slate-400" />
                      )}
                    </div>
                    <div className="flex-1">
                      <input
                        type="url"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        placeholder="https://images.unsplash.com/photo-..."
                        className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#062B61] focus:border-[#062B61] bg-white"
                      />
                      <p className="text-[11px] text-slate-400 mt-1">
                        High-resolution photo or facility banner shown to prospective patients.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Mobile Number */}
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">
                    Hospital Mobile Number <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="tel"
                      required
                      value={mobileNumber}
                      onChange={(e) => setMobileNumber(e.target.value)}
                      placeholder="+91 94296 93887"
                      className="w-full pl-9 pr-3.5 py-2.5 text-xs font-medium border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#062B61] focus:border-[#062B61] bg-white"
                    />
                  </div>
                </div>

                {/* Email Address */}
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">
                    Hospital Email Address <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="email"
                      required
                      value={emailAddress}
                      onChange={(e) => setEmailAddress(e.target.value)}
                      placeholder="acquireopd@gmail.com"
                      className="w-full pl-9 pr-3.5 py-2.5 text-xs font-medium border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#062B61] focus:border-[#062B61] bg-white"
                    />
                  </div>
                </div>

                {/* Hospital Tier / Category */}
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">
                    Facility Tier
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 text-xs font-medium border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#062B61] focus:border-[#062B61] bg-white"
                  >
                    <option value="Premium Hospital">Premium Hospital (Advanced Robotic Suites)</option>
                    <option value="Standard Hospital">Standard Hospital (NABH Multi-Specialty)</option>
                    <option value="Budget-Friendly Hospital">Budget-Friendly Hospital (Affordable Care)</option>
                    <option value="Specialty Hospital">Specialty Center of Excellence</option>
                  </select>
                </div>

                {/* Description */}
                <div className="sm:col-span-3">
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">
                    Hospital Overview & Clinical Highlights
                  </label>
                  <textarea
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Briefly describe surgical strengths, key department heads, advanced ICUs, or special services..."
                    className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#062B61] focus:border-[#062B61] bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Second Card: Hospital Address (Separate Fields Requirement) */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 sm:p-7">
              <div className="pb-4 border-b border-slate-100">
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-[#062B61]" />
                  Hospital Physical Address
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Structured geographic details for route guidance and patient navigation. (Separate fields)
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 pt-5">
                {/* Address Line 1 */}
                <div className="sm:col-span-2">
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">
                    Address Line 1 <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={addressLine1}
                    onChange={(e) => setAddressLine1(e.target.value)}
                    placeholder="e.g. 98, HAL Old Airport Road"
                    className="w-full px-3.5 py-2.5 text-xs font-medium border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#062B61] focus:border-[#062B61] bg-white"
                  />
                </div>

                {/* Address Line 2 */}
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">
                    Address Line 2 (Optional)
                  </label>
                  <input
                    type="text"
                    value={addressLine2}
                    onChange={(e) => setAddressLine2(e.target.value)}
                    placeholder="e.g. Near Leela Palace / Block 4"
                    className="w-full px-3.5 py-2.5 text-xs font-medium border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#062B61] focus:border-[#062B61] bg-white"
                  />
                </div>

                {/* Area / Locality */}
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">
                    Area / Locality <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={areaLocality}
                    onChange={(e) => setAreaLocality(e.target.value)}
                    placeholder="e.g. Kodihalli / Indiranagar"
                    className="w-full px-3.5 py-2.5 text-xs font-medium border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#062B61] focus:border-[#062B61] bg-white"
                  />
                </div>

                {/* City */}
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">
                    City <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={cityName}
                    onChange={(e) => setCityName(e.target.value)}
                    placeholder="e.g. Bangalore"
                    className="w-full px-3.5 py-2.5 text-xs font-medium border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#062B61] focus:border-[#062B61] bg-white"
                  />
                </div>

                {/* State */}
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">
                    State <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={stateName}
                    onChange={(e) => setStateName(e.target.value)}
                    placeholder="e.g. Karnataka"
                    className="w-full px-3.5 py-2.5 text-xs font-medium border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#062B61] focus:border-[#062B61] bg-white"
                  />
                </div>

                {/* Pincode */}
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">
                    Pincode <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value.replace(/[^0-9]/g, ''))}
                    placeholder="560017"
                    className="w-full px-3.5 py-2.5 text-xs font-medium border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#062B61] focus:border-[#062B61] bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Bottom Action Strip */}
            <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
              <div className="text-xs text-slate-500">
                All changes reflect directly across patient searches and referral matching.
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-[#062B61] hover:bg-[#0A3B75] text-white text-xs font-bold transition-all shadow-xs cursor-pointer disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>{loading ? 'Saving...' : 'Save Changes'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleSaveProfile()}
                  disabled={loading}
                  className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
                >
                  Update Profile
                </button>
              </div>
            </div>
          </form>
        )}

        {/* TAB 2: OPERATING HOURS (Monday through Sunday with toggles and timings) */}
        {activeTab === 'hours' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 sm:p-7">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
                <div>
                  <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-[#062B61]" />
                    Hospital Operating Hours (Weekly Timings)
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Configure daily OPD schedules, admission desks, and emergency opening hours for each day of the week.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleSaveProfile()}
                  disabled={loading}
                  className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#062B61] hover:bg-[#0A3B75] text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>{loading ? 'Saving...' : 'Save Changes'}</span>
                </button>
              </div>

              <div className="divide-y divide-slate-100 mt-2">
                {DAYS_OF_WEEK.map((day) => {
                  const schedule = operatingHours.find(h => h.day === day) || {
                    day,
                    isOpen: true,
                    openTime: '08:00 AM',
                    closeTime: '08:00 PM'
                  };

                  return (
                    <div 
                      key={day} 
                      className={`py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors ${
                        schedule.isOpen ? 'bg-transparent' : 'bg-slate-50/70 opacity-80'
                      }`}
                    >
                      {/* Day and Status Toggle */}
                      <div className="flex items-center gap-4 min-w-[180px]">
                        <button
                          type="button"
                          onClick={() => handleToggleDay(day)}
                          className={`w-12 h-6 rounded-full p-1 transition-colors cursor-pointer flex items-center ${
                            schedule.isOpen ? 'bg-emerald-600 justify-end' : 'bg-slate-300 justify-start'
                          }`}
                        >
                          <div className="w-4 h-4 rounded-full bg-white shadow-xs" />
                        </button>
                        <div>
                          <span className="font-bold text-xs text-slate-900 block">{day}</span>
                          <span className={`text-[11px] font-semibold ${schedule.isOpen ? 'text-emerald-700' : 'text-slate-400'}`}>
                            {schedule.isOpen ? 'Open for Consultations' : 'Closed / Emergency Only'}
                          </span>
                        </div>
                      </div>

                      {/* Opening & Closing Timings */}
                      {schedule.isOpen ? (
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[11px] font-medium text-slate-500">From:</span>
                            <input
                              type="text"
                              value={schedule.openTime}
                              onChange={(e) => handleTimeChange(day, 'openTime', e.target.value)}
                              placeholder="08:00 AM"
                              className="w-28 px-3 py-1.5 text-xs font-semibold border border-slate-300 rounded-lg text-slate-800 bg-white"
                            />
                          </div>
                          <span className="text-slate-400 text-xs">—</span>
                          <div className="flex items-center gap-1.5">
                            <span className="text-[11px] font-medium text-slate-500">To:</span>
                            <input
                              type="text"
                              value={schedule.closeTime}
                              onChange={(e) => handleTimeChange(day, 'closeTime', e.target.value)}
                              placeholder="08:00 PM"
                              className="w-28 px-3 py-1.5 text-xs font-semibold border border-slate-300 rounded-lg text-slate-800 bg-white"
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="text-xs text-slate-400 italic">
                          Closed for routine OPD appointments on {day}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 pt-5 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => handleSaveProfile()}
                  disabled={loading}
                  className="px-6 py-2.5 rounded-xl bg-[#062B61] hover:bg-[#0A3B75] text-white text-xs font-bold transition-all cursor-pointer"
                >
                  Save Weekly Timings
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: SURGERY & TREATMENT MANAGEMENT */}
        {activeTab === 'surgeries' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 sm:p-7">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
                <div>
                  <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-[#062B61]" />
                    Surgery & Treatment Management
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Maintain your hospital's active surgery packages, transparent price ranges, and procedure availability.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleOpenAddSurgery}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#062B61] hover:bg-[#0A3B75] text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Surgery</span>
                </button>
              </div>

              {/* Clean Table: Surgery | Cost Range | Status | Actions */}
              <div className="mt-6 overflow-x-auto rounded-xl border border-slate-200">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-600 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-3">Surgery / Treatment</th>
                      <th className="px-4 py-3">Cost Range (₹)</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {surgeries.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="py-8 text-center text-slate-400 text-xs">
                          No surgeries configured yet. Click "Add Surgery" to publish your first treatment package.
                        </td>
                      </tr>
                    ) : (
                      surgeries.map(surg => (
                        <tr key={surg.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="px-4 py-3.5">
                            <div className="font-bold text-slate-900 text-xs">{surg.name}</div>
                            {surg.description && (
                              <div className="text-[11px] text-slate-500 mt-0.5 max-w-md truncate">
                                {surg.description}
                              </div>
                            )}
                          </td>
                          <td className="px-4 py-3.5">
                            <span className="font-bold text-slate-900">
                              ₹{surg.minCost.toLocaleString('en-IN')} – ₹{surg.maxCost.toLocaleString('en-IN')}
                            </span>
                          </td>
                          <td className="px-4 py-3.5">
                            <button
                              onClick={() => handleToggleSurgeryStatus(surg.id)}
                              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold cursor-pointer transition-colors ${
                                surg.status === 'Active'
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                                  : 'bg-slate-100 text-slate-500 border border-slate-200 hover:bg-slate-200'
                              }`}
                              title="Click to toggle status"
                            >
                              {surg.status === 'Active' ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                              <span>{surg.status}</span>
                            </button>
                          </td>
                          <td className="px-4 py-3.5 text-right">
                            <div className="inline-flex items-center gap-1.5">
                              <button
                                onClick={() => handleOpenEditSurgery(surg)}
                                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
                                title="Edit Surgery"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleToggleSurgeryStatus(surg.id)}
                                className="px-2.5 py-1 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 text-xs font-medium transition-colors cursor-pointer"
                              >
                                {surg.status === 'Active' ? 'Deactivate' : 'Activate'}
                              </button>
                              <button
                                onClick={() => handleDeleteSurgery(surg.id)}
                                className="p-1 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition-colors cursor-pointer"
                                title="Delete Surgery"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
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

        {/* TAB 4: PATIENT INQUIRIES & REFERRALS */}
        {activeTab === 'leads' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 sm:p-7">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
                <div>
                  <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <Users className="w-5 h-5 text-[#062B61]" />
                    Direct Inquiries & Matching Patients ({leads.length})
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Patients who selected {hospital.name} or matched your hospital's surgical departments.
                  </p>
                </div>
              </div>

              <div className="mt-4 overflow-x-auto rounded-xl border border-slate-200">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-600 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-3">Patient</th>
                      <th className="px-4 py-3">Contact</th>
                      <th className="px-4 py-3">Treatment</th>
                      <th className="px-4 py-3">Budget</th>
                      <th className="px-4 py-3">Date</th>
                      <th className="px-4 py-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {leads.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-slate-400 text-xs">
                          No inquiries assigned at the moment. New patient submissions will appear here.
                        </td>
                      </tr>
                    ) : (
                      leads.map(lead => (
                        <tr key={lead.id} className="hover:bg-slate-50/80">
                          <td className="px-4 py-3.5 font-bold text-slate-900">
                            {lead.name}
                          </td>
                          <td className="px-4 py-3.5 font-medium text-slate-700">
                            {lead.mobile}
                          </td>
                          <td className="px-4 py-3.5 font-semibold text-[#062B61]">
                            {lead.treatment}
                          </td>
                          <td className="px-4 py-3.5 text-slate-600">
                            {lead.budget}
                          </td>
                          <td className="px-4 py-3.5 text-slate-500">
                            {new Date(lead.createdAt).toLocaleDateString('en-IN')}
                          </td>
                          <td className="px-4 py-3.5">
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                              {lead.status}
                            </span>
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

        {/* TAB 5: CAPACITY & TPA DESK */}
        {activeTab === 'capacity' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 sm:p-7">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
                <div>
                  <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <Bed className="w-5 h-5 text-[#062B61]" />
                    Live Bed Capacity & TPA Status
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Signal real-time capacity and cashless readiness to the central patient coordination team.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => notifySuccess('Capacity status updated and broadcasted to platform navigators!')}
                  className="px-5 py-2.5 rounded-xl bg-[#062B61] hover:bg-[#0A3B75] text-white text-xs font-bold transition-all cursor-pointer"
                >
                  Save Capacity
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 pt-6">
                {/* ICU Status */}
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                  <label className="text-xs font-bold text-slate-700 block">
                    ICU Capacity Status
                  </label>
                  <select
                    value={capacity.icuStatus}
                    onChange={(e) => setCapacity({ ...capacity, icuStatus: e.target.value as any })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white"
                  >
                    <option value="Available">Available (Beds ready for admissions)</option>
                    <option value="Limited">Limited (1–2 critical beds left)</option>
                    <option value="Full">Full (Diverting non-emergency)</option>
                  </select>
                </div>

                {/* General Beds Available */}
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                  <label className="text-xs font-bold text-slate-700 block">
                    Available Surgical Beds
                  </label>
                  <input
                    type="number"
                    value={capacity.generalBedsAvailable}
                    onChange={(e) => setCapacity({ ...capacity, generalBedsAvailable: parseInt(e.target.value, 10) || 0 })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white"
                  />
                </div>

                {/* Emergency Desk */}
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                  <label className="text-xs font-bold text-slate-700 block">
                    Emergency & Trauma Desk
                  </label>
                  <div className="flex items-center gap-3 pt-1">
                    <button
                      type="button"
                      onClick={() => setCapacity({ ...capacity, emergencyActive: !capacity.emergencyActive })}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer ${
                        capacity.emergencyActive ? 'bg-emerald-600 text-white' : 'bg-slate-300 text-slate-700'
                      }`}
                    >
                      {capacity.emergencyActive ? '24x7 Active' : 'Standby'}
                    </button>
                    <span className="text-xs text-slate-500">Trauma surgeon on duty</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: CHANGE PASSWORD */}
        {activeTab === 'security' && (
          <div className="max-w-lg mx-auto">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 sm:p-7">
              <div className="pb-4 border-b border-slate-100">
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <KeyRound className="w-5 h-5 text-[#062B61]" />
                  Change Hospital Account Password
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Update your credentials for secure access to {hospital.name}'s portal.
                </p>
              </div>

              {passwordSuccess && (
                <div className="mt-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center gap-2 font-medium">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{passwordSuccess}</span>
                </div>
              )}
              {passwordError && (
                <div className="mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2 font-medium">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{passwordError}</span>
                </div>
              )}

              <form onSubmit={handleChangePassword} className="space-y-4 pt-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Current Password
                  </label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password"
                    className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#062B61] bg-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    New Password
                  </label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Minimum 6 characters"
                    className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#062B61] bg-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Confirm New Password
                  </label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter new password"
                    className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#062B61] bg-white"
                  />
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5 text-slate-400" />}
                    <span>{showPassword ? 'Hide Passwords' : 'Show Passwords'}</span>
                  </button>
                </div>

                <div className="pt-3">
                  <button
                    type="submit"
                    className="w-full py-2.5 px-4 rounded-xl bg-[#062B61] hover:bg-[#0A3B75] text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
                  >
                    Update Account Password
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>

      {/* MODAL: ADD / EDIT SURGERY */}
      {surgeryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="bg-gradient-to-r from-[#062B61] to-[#0A3B75] px-6 py-4 text-white flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-sky-300" />
                {editingSurgeryId ? 'Edit Surgery / Treatment' : 'Add New Surgery / Treatment'}
              </h3>
              <button
                onClick={() => setSurgeryModalOpen(false)}
                className="p-1 rounded-lg text-white/70 hover:text-white hover:bg-white/10"
              >
                <XCircle className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveSurgery} className="p-6 space-y-4">
              {/* Surgery Name */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Surgery / Treatment Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={surgeryName}
                  onChange={(e) => setSurgeryName(e.target.value)}
                  placeholder="e.g. Knee Replacement"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#062B61] bg-white"
                />
              </div>

              {/* Cost Range */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Minimum Cost (₹) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    value={minCost}
                    onChange={(e) => setMinCost(e.target.value)}
                    placeholder="150000"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#062B61] bg-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Maximum Cost (₹) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    value={maxCost}
                    onChange={(e) => setMaxCost(e.target.value)}
                    placeholder="250000"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#062B61] bg-white"
                  />
                </div>
              </div>

              {/* Optional Description */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Optional Description / Package Inclusions
                </label>
                <textarea
                  rows={2}
                  value={surgeryDesc}
                  onChange={(e) => setSurgeryDesc(e.target.value)}
                  placeholder="e.g. Includes implant, standard stay, and surgeon fee"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#062B61] bg-white resize-none"
                />
              </div>

              {/* Status */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Status
                </label>
                <select
                  value={surgeryStatus}
                  onChange={(e) => setSurgeryStatus(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#062B61] bg-white font-medium"
                >
                  <option value="Active">Active (Accepting referrals)</option>
                  <option value="Inactive">Inactive (Temporarily suspended)</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setSurgeryModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#062B61] hover:bg-[#0A3B75] text-white text-xs font-bold"
                >
                  {editingSurgeryId ? 'Update Surgery' : 'Save Surgery'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
