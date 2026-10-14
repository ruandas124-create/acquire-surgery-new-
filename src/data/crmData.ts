import { 
  Hospital, 
  HospitalOperatingHour, 
  HospitalAddress, 
  HospitalSurgery, 
  HospitalAccount, 
  PatientSchedule,
  DayOfWeek,
  LeadSource,
  ScheduleStatus
} from '../types';

export const DAYS_OF_WEEK: DayOfWeek[] = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday'
];

export const DEFAULT_OPERATING_HOURS: HospitalOperatingHour[] = [
  { day: 'Monday', isOpen: true, openTime: '08:00 AM', closeTime: '08:00 PM' },
  { day: 'Tuesday', isOpen: true, openTime: '08:00 AM', closeTime: '08:00 PM' },
  { day: 'Wednesday', isOpen: true, openTime: '08:00 AM', closeTime: '08:00 PM' },
  { day: 'Thursday', isOpen: true, openTime: '08:00 AM', closeTime: '08:00 PM' },
  { day: 'Friday', isOpen: true, openTime: '08:00 AM', closeTime: '08:00 PM' },
  { day: 'Saturday', isOpen: true, openTime: '08:00 AM', closeTime: '06:00 PM' },
  { day: 'Sunday', isOpen: true, openTime: '09:00 AM', closeTime: '02:00 PM' },
];

export function getHospitalAddress(hospital: Hospital): HospitalAddress {
  if (hospital.addressDetails && hospital.addressDetails.line1) {
    return hospital.addressDetails;
  }
  // Parse fallback from address string
  const parts = (hospital.address || '').split(',').map(s => s.trim());
  return {
    line1: parts[0] || hospital.address || 'Hospital Main Campus',
    line2: parts[1] || 'Opposite Medical Hub',
    area: hospital.location || parts[2] || 'Central District',
    city: hospital.city || 'Bangalore',
    state: 'Karnataka',
    pincode: (hospital.address.match(/\b\d{6}\b/) || ['560001'])[0],
  };
}

export function getHospitalOperatingHours(hospital: Hospital): HospitalOperatingHour[] {
  if (hospital.operatingHours && hospital.operatingHours.length === 7) {
    return hospital.operatingHours;
  }
  return DEFAULT_OPERATING_HOURS.map(h => ({ ...h }));
}

export function getHospitalSurgeries(hospital: Hospital): HospitalSurgery[] {
  if (hospital.surgeries && hospital.surgeries.length > 0) {
    return hospital.surgeries;
  }
  if (hospital.treatmentEstimates && hospital.treatmentEstimates.length > 0) {
    return hospital.treatmentEstimates.map((est, idx) => ({
      id: est.id || `surg-${hospital.id}-${idx}`,
      name: est.treatmentName,
      minCost: est.minCost,
      maxCost: est.maxCost,
      description: est.notes || est.description || `Specialized surgical procedure at ${hospital.name}`,
      status: (est.status as 'Active' | 'Inactive') || 'Active',
    }));
  }
  return [
    { id: `surg-1`, name: 'Knee Replacement', minCost: 150000, maxCost: 250000, description: 'Minimally invasive total or partial joint arthroplasty', status: 'Active' },
    { id: `surg-2`, name: 'Cataract Surgery', minCost: 35000, maxCost: 75000, description: 'Phacoemulsification with foldable intraocular lens', status: 'Active' },
    { id: `surg-3`, name: 'Gallbladder Surgery', minCost: 75000, maxCost: 140000, description: 'Laparoscopic cholecystectomy standard stay', status: 'Active' },
  ];
}

// Secure representation: simple SHA-like salt representation for client-side/in-memory security
export function hashPassword(plainText: string): string {
  // Simple deterministic salted hash for portal demo security
  let hash = 0;
  const salted = `acq_salt_2026_${plainText}_health_crm`;
  for (let i = 0; i < salted.length; i++) {
    const char = salted.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return `hsh_${Math.abs(hash).toString(16)}`;
}

export function generateRandomTempPassword(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
  const nums = '23456789';
  const prefix = 'Hosp@';
  let rand = '';
  for (let i = 0; i < 2; i++) rand += chars.charAt(Math.floor(Math.random() * chars.length));
  for (let i = 0; i < 2; i++) rand += nums.charAt(Math.floor(Math.random() * nums.length));
  return `${prefix}${rand}`;
}

export const INITIAL_HOSPITAL_ACCOUNTS: HospitalAccount[] = [
  {
    id: 'acc-manipal-oar',
    hospitalId: 'hosp-manipal-oar',
    hospitalName: 'Manipal Hospital, Old Airport Road',
    email: 'manipal@acquiresurgery.com',
    mobile: '+91 94296 93887',
    username: 'manipal_desk',
    passwordHash: hashPassword('surgery123'),
    accountStatus: 'Active',
    createdAt: '2026-08-15T09:30:00.000Z',
    lastLogin: '2026-09-08T05:40:00.000Z',
    mustChangePassword: false,
  },
  {
    id: 'acc-aster-cmi',
    hospitalId: 'hosp-aster-cmi',
    hospitalName: 'Aster CMI Hospital',
    email: 'aster@acquiresurgery.com',
    mobile: '+91 94296 93887',
    username: 'aster_cmi',
    passwordHash: hashPassword('surgery123'),
    accountStatus: 'Active',
    createdAt: '2026-08-18T10:15:00.000Z',
    lastLogin: '2026-09-07T14:20:00.000Z',
    mustChangePassword: false,
  },
  {
    id: 'acc-narayana-hsr',
    hospitalId: 'hosp-narayana-hsr',
    hospitalName: 'Narayana Multispeciality Hospital, HSR',
    email: 'narayana@acquiresurgery.com',
    mobile: '+91 94296 93887',
    username: 'narayana_hsr',
    passwordHash: hashPassword('surgery123'),
    accountStatus: 'Active',
    createdAt: '2026-08-20T11:00:00.000Z',
    lastLogin: '2026-09-06T16:45:00.000Z',
    mustChangePassword: false,
  },
  {
    id: 'acc-apollo-bannerghatta',
    hospitalId: 'hosp-apollo-bannerghatta',
    hospitalName: 'Apollo Hospital, Bannerghatta Road',
    email: 'apollo@acquiresurgery.com',
    mobile: '+91 94296 93887',
    username: 'apollo_bg',
    passwordHash: hashPassword('surgery123'),
    accountStatus: 'Active',
    createdAt: '2026-08-22T08:20:00.000Z',
    lastLogin: '2026-09-05T11:10:00.000Z',
    mustChangePassword: false,
  },
  {
    id: 'acc-fortis-bg-road',
    hospitalId: 'hosp-fortis-bg-road',
    hospitalName: 'Fortis Hospital, Bannerghatta Road',
    email: 'fortis@acquiresurgery.com',
    mobile: '+91 94296 93887',
    username: 'fortis_care',
    passwordHash: hashPassword('surgery123'),
    accountStatus: 'Inactive',
    createdAt: '2026-08-25T14:00:00.000Z',
    lastLogin: '2026-08-29T10:00:00.000Z',
    mustChangePassword: false,
  },
];

export const INITIAL_SCHEDULES: PatientSchedule[] = [
  {
    id: 'sched-101',
    patientName: 'Ramesh Sundaram',
    mobile: '+91 98450 12345',
    hospitalId: 'hosp-manipal-oar',
    hospitalName: 'Manipal Hospital, Old Airport Road',
    surgeryName: 'Knee Replacement',
    minCost: 240000,
    maxCost: 380000,
    budget: '₹2 – ₹5 Lakh',
    source: 'Acquire OPD',
    appointmentDate: '2026-09-12',
    preferredTime: '10:30 AM',
    status: 'Scheduled',
    createdAt: '2026-09-06T10:30:00.000Z',
    notes: [
      {
        id: 'snote-1',
        text: 'Patient evaluated for bilateral osteoarthritis grade 4. Pre-anesthesia workup scheduled.',
        authorName: 'Dr. Vikram Malhotra',
        createdAt: '2026-09-06T10:35:00.000Z',
      }
    ]
  },
  {
    id: 'sched-102',
    patientName: 'Sunita Mehra',
    mobile: '+91 97312 45678',
    hospitalId: 'hosp-aster-cmi',
    hospitalName: 'Aster CMI Hospital',
    surgeryName: 'Gallbladder Surgery',
    minCost: 85000,
    maxCost: 145000,
    budget: '₹50,000 – ₹1 Lakh',
    source: 'Google',
    appointmentDate: '2026-09-10',
    preferredTime: '02:00 PM',
    status: 'Confirmed',
    createdAt: '2026-09-05T14:15:00.000Z',
    notes: [
      {
        id: 'snote-2',
        text: 'Symptomatic cholelithiasis. Star Health Cashless pre-authorization initiated.',
        authorName: 'Dr. Anita Sen',
        createdAt: '2026-09-05T14:20:00.000Z',
      }
    ]
  },
  {
    id: 'sched-103',
    patientName: 'Deepak Rao',
    mobile: '+91 99001 88234',
    hospitalId: 'hosp-narayana-hsr',
    hospitalName: 'Narayana Multispeciality Hospital, HSR',
    surgeryName: 'Kidney Stone Surgery',
    minCost: 55000,
    maxCost: 105000,
    budget: '₹50,000 – ₹1 Lakh',
    source: 'Referral',
    referralDetails: 'Dr. S. K. Gupta (Primary Physician)',
    appointmentDate: '2026-09-14',
    preferredTime: '11:00 AM',
    status: 'Rescheduled',
    createdAt: '2026-09-04T16:00:00.000Z',
    notes: [
      {
        id: 'snote-3',
        text: 'Patient requested shift from 9th to 14th due to outstation travel.',
        authorName: 'Dr. Vikram Malhotra',
        createdAt: '2026-09-07T09:10:00.000Z',
      }
    ]
  },
  {
    id: 'sched-104',
    patientName: 'Meenakshi Iyer',
    mobile: '+91 94481 92837',
    hospitalId: 'hosp-apollo-bannerghatta',
    hospitalName: 'Apollo Hospital, Bannerghatta Road',
    surgeryName: 'Cataract Surgery',
    minCost: 40000,
    maxCost: 85000,
    budget: 'Below ₹50,000',
    source: 'Relatives / Friends',
    appointmentDate: '2026-09-08',
    preferredTime: '09:00 AM',
    status: 'Completed',
    createdAt: '2026-09-02T11:20:00.000Z',
    notes: [
      {
        id: 'snote-4',
        text: 'Right eye phacoemulsification successfully performed. Daycare discharge completed.',
        authorName: 'Pooja Hegde',
        createdAt: '2026-09-08T12:00:00.000Z',
      }
    ]
  }
];

export const LEAD_SOURCES: LeadSource[] = [
  'Acquire OPD',
  'Google',
  'Instagram',
  'Walking',
  'Relatives / Friends',
  'Billboard',
  'Referral'
];

export const SCHEDULE_STATUSES: ScheduleStatus[] = [
  'Scheduled',
  'Confirmed',
  'Rescheduled',
  'Completed',
  'Cancelled',
  'No Show'
];

export function createHospitalWhatsAppMessage(params: {
  hospitalName: string;
  username: string;
  tempPassword?: string;
  loginUrl?: string;
}): string {
  const url = params.loginUrl || (typeof window !== 'undefined' ? `${window.location.origin}` : 'https://acquireopd.com');
  const pwdText = params.tempPassword || 'surgery123';

  return `🏥 *Acquire OPD — Hospital Portal Access*

Dear *${params.hospitalName}* Team,

Your hospital access credentials for the *Acquire OPD Partner Portal* have been generated.

🔗 *Portal Login URL:* ${url}
👤 *Username:* ${params.username}
🔑 *Temporary Password:* ${pwdText}

*Security Reminder:*
Please log in and update your profile, address details, operating hours, and surgery pricing packages.

For immediate assistance, reach our desk at *+91 94296 93887* or *acquireopd@gmail.com*.

Warm regards,
*Acquire OPD Team*`;
}

export function openWhatsAppShare(mobile: string, message: string): void {
  const cleanMobile = mobile.replace(/[^0-9]/g, '');
  const fullMobile = cleanMobile.length === 10 ? `91${cleanMobile}` : cleanMobile;
  const encodedText = encodeURIComponent(message);
  const waUrl = `https://wa.me/${fullMobile}?text=${encodedText}`;
  if (typeof window !== 'undefined') {
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  }
}
