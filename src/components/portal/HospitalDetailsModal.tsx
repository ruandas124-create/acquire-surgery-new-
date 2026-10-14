import React from 'react';
import { Hospital, HospitalAccount } from '../../types';
import { 
  getHospitalAddress, 
  getHospitalOperatingHours, 
  getHospitalSurgeries 
} from '../../data/crmData';
import { 
  X, 
  Building2, 
  MapPin, 
  Clock, 
  Phone, 
  Mail, 
  FileText, 
  CheckCircle2, 
  XCircle, 
  ShieldCheck, 
  KeyRound, 
  Calendar, 
  ExternalLink,
  Edit3
} from 'lucide-react';

interface HospitalDetailsModalProps {
  hospital: Hospital;
  account?: HospitalAccount | null;
  onClose: () => void;
  onEdit?: () => void;
}

export const HospitalDetailsModal: React.FC<HospitalDetailsModalProps> = ({
  hospital,
  account,
  onClose,
  onEdit
}) => {
  const address = getHospitalAddress(hospital);
  const operatingHours = getHospitalOperatingHours(hospital);
  const surgeries = getHospitalSurgeries(hospital);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div 
        id="hospital-details-modal"
        className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8 max-h-[90vh] flex flex-col"
      >
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-[#062B61] to-[#0A3B75] px-6 py-5 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white/10 p-1 flex items-center justify-center overflow-hidden border border-white/20 shrink-0">
              {hospital.imageUrl ? (
                <img 
                  src={hospital.imageUrl} 
                  alt={hospital.name} 
                  className="w-full h-full object-cover rounded-lg"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <Building2 className="w-6 h-6 text-white" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white">{hospital.name}</h2>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                  {hospital.category}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                License: {hospital.registrationNumber || 'REG-KA-2018-09412'} • {hospital.location}, {hospital.city}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onEdit && (
              <button
                onClick={onEdit}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-semibold text-white transition-colors cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Profile</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-slate-800">
          {/* Section 1: Hospital Basic Information */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-[#062B61]" />
              Hospital Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
              <div>
                <span className="text-slate-500 block">Hospital Name</span>
                <span className="font-semibold text-slate-900">{hospital.name}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Registration / License</span>
                <span className="font-semibold text-slate-900">{hospital.registrationNumber || 'REG-KA-2018-09412'}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Official Contact</span>
                <span className="font-semibold text-slate-900">{hospital.mobile || hospital.phone || '+91 94296 93887'}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Official Email</span>
                <span className="font-semibold text-slate-900">{hospital.email || 'acquireopd@gmail.com'}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Total Capacity</span>
                <span className="font-semibold text-slate-900">{hospital.bedCount} Beds (Rating: {hospital.rating} ★)</span>
              </div>
              <div>
                <span className="text-slate-500 block">Accreditations</span>
                <span className="font-semibold text-slate-900">{hospital.accreditations?.join(', ') || 'NABH Accredited'}</span>
              </div>
            </div>
          </div>

          {/* Section 2: Hospital Structured Address */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-[#062B61]" />
              Hospital Address (Structured Fields)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
              <div>
                <span className="text-slate-500 block">Address Line 1</span>
                <span className="font-semibold text-slate-900">{address.line1}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Address Line 2</span>
                <span className="font-semibold text-slate-900">{address.line2 || '—'}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Area / Locality</span>
                <span className="font-semibold text-slate-900">{address.area}</span>
              </div>
              <div>
                <span className="text-slate-500 block">City</span>
                <span className="font-semibold text-slate-900">{address.city}</span>
              </div>
              <div>
                <span className="text-slate-500 block">State</span>
                <span className="font-semibold text-slate-900">{address.state}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Pincode</span>
                <span className="font-semibold text-slate-900">{address.pincode}</span>
              </div>
            </div>
          </div>

          {/* Section 3: Hospital Operating Hours */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-[#062B61]" />
              Hospital Operating Hours (Weekly Schedule)
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
              {operatingHours.map(schedule => (
                <div 
                  key={schedule.day} 
                  className={`p-2.5 rounded-lg border text-center text-xs ${
                    schedule.isOpen 
                      ? 'bg-white border-slate-200' 
                      : 'bg-slate-100 border-slate-200 text-slate-400'
                  }`}
                >
                  <span className="font-bold block text-[11px] mb-1 text-slate-700">{schedule.day.slice(0, 3)}</span>
                  {schedule.isOpen ? (
                    <>
                      <span className="text-[10px] text-emerald-700 font-semibold block">Open</span>
                      <span className="text-[9px] text-slate-500 block leading-tight mt-0.5">
                        {schedule.openTime} – {schedule.closeTime}
                      </span>
                    </>
                  ) : (
                    <span className="text-[10px] text-rose-600 font-semibold block">Closed</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Section 4: Surgery & Treatment List */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-[#062B61]" />
                Surgeries & Treatment Cost Range ({surgeries.length})
              </h3>
            </div>
            <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 text-slate-600 font-semibold uppercase text-[10px]">
                  <tr>
                    <th className="px-3 py-2">Surgery / Treatment</th>
                    <th className="px-3 py-2">Cost Range</th>
                    <th className="px-3 py-2">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {surgeries.map((surg, idx) => (
                    <tr key={surg.id || idx} className="hover:bg-slate-50">
                      <td className="px-3 py-2.5 font-medium text-slate-900">
                        {surg.name}
                        {surg.description && (
                          <span className="block text-[10px] text-slate-400 font-normal truncate max-w-xs">
                            {surg.description}
                          </span>
                        )}
                      </td>
                      <td className="px-3 py-2.5 font-semibold text-[#062B61]">
                        ₹{surg.minCost.toLocaleString('en-IN')} – ₹{surg.maxCost.toLocaleString('en-IN')}
                      </td>
                      <td className="px-3 py-2.5">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          surg.status === 'Active' 
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                            : 'bg-slate-100 text-slate-500 border border-slate-200'
                        }`}>
                          {surg.status === 'Active' ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                          {surg.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 5: Account Information (if linked) */}
          {account && (
            <div className="bg-blue-50/50 rounded-xl p-4 border border-blue-100">
              <h3 className="text-xs font-bold uppercase tracking-wider text-blue-900 mb-2 flex items-center gap-1.5">
                <KeyRound className="w-4 h-4 text-blue-700" />
                Hospital Access Account Credentials
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                <div>
                  <span className="text-slate-500 block">Username</span>
                  <span className="font-semibold text-slate-900">{account.username}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Account Status</span>
                  <span className={`font-semibold ${account.accountStatus === 'Active' ? 'text-emerald-700' : 'text-rose-600'}`}>
                    {account.accountStatus}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block">Created On</span>
                  <span className="font-semibold text-slate-900">
                    {new Date(account.createdAt).toLocaleDateString('en-IN')}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block">Last Login</span>
                  <span className="font-semibold text-slate-900">
                    {account.lastLogin ? new Date(account.lastLogin).toLocaleDateString('en-IN') : 'Never'}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
};
