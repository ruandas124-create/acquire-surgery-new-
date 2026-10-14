import { AuthUser, UserRole, Hospital, HospitalAccount } from '../types';
import { hashPassword, INITIAL_HOSPITAL_ACCOUNTS } from '../data/crmData';

const STORAGE_KEY = 'acquire_surgery_portal_user';
const CUSTOM_ACCOUNTS_KEY = 'acquire_custom_hospital_accounts';

export interface RegisteredAccount {
  email: string;
  role: UserRole;
  name: string;
  title: string;
  hospitalId?: string;
  hospitalName?: string;
  description: string;
}

export const REGISTERED_ACCOUNTS: RegisteredAccount[] = [
  {
    email: 'admin@acquiresurgery.com',
    role: 'admin',
    name: 'Dr. Vikram Malhotra',
    title: 'Platform Master Administrator',
    description: 'Full master access to all patient inquiries, hospital directory, and pricing benchmarks.',
  },
  {
    email: 'manipal@acquiresurgery.com',
    role: 'hospital',
    name: 'Suresh Nambiar',
    title: 'Senior Surgery Desk Coordinator',
    hospitalId: 'hosp-manipal-oar',
    hospitalName: 'Manipal Hospital, Old Airport Road',
    description: 'Manipal Hospital patient referrals, packages, and bed capacity.',
  },
  {
    email: 'aster@acquiresurgery.com',
    role: 'hospital',
    name: 'Dr. Anita Sen',
    title: 'Surgical Referral Head',
    hospitalId: 'hosp-aster-cmi',
    hospitalName: 'Aster CMI Hospital',
    description: 'Aster CMI patient consultations, pricing, and live ICU status.',
  },
  {
    email: 'narayana@acquiresurgery.com',
    role: 'hospital',
    name: 'Rohan Kulkarni',
    title: 'Patient Care Navigator',
    hospitalId: 'hosp-narayana-hsr',
    hospitalName: 'Narayana Multispeciality Hospital, HSR',
    description: 'Narayana HSR surgical admissions, surgery packages, and capacity.',
  },
  {
    email: 'apollo@acquiresurgery.com',
    role: 'hospital',
    name: 'Pooja Hegde',
    title: 'Hospital Coordinator',
    hospitalId: 'hosp-apollo-bannerghatta',
    hospitalName: 'Apollo Hospital, Bannerghatta Road',
    description: 'Apollo Bannerghatta patient referrals and packages.',
  },
  {
    email: 'fortis@acquiresurgery.com',
    role: 'hospital',
    name: 'Dr. Rajesh Rao',
    title: 'Partner Care Desk',
    hospitalId: 'hosp-fortis-bg-road',
    hospitalName: 'Fortis Hospital, Bannerghatta Road',
    description: 'Fortis Hospital surgery referrals and live bed status.',
  },
];

export const authService = {
  getCurrentUser(): AuthUser | null {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored) as AuthUser;
      }
    } catch {
      // ignore
    }
    return null;
  },

  setCurrentUser(user: AuthUser | null): void {
    try {
      if (user) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch {
      // ignore
    }
  },

  async loginWithEmailAndPassword(
    identifierInput: string,
    passwordInput: string,
    hospitals: Hospital[]
  ): Promise<{ success: boolean; user?: AuthUser; error?: string }> {
    const identifier = identifierInput.trim();
    const password = passwordInput.trim();

    if (!identifier || !password) {
      return { success: false, error: 'Username and password required' };
    }

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: identifier, password }),
      });
      const data = await response.json();

      if (!data.success) {
        return { success: false, error: data.error || 'Login failed' };
      }

      // Map backend role to AuthUser structure
      const user: AuthUser = {
        id: `usr-${data.user.role}-${data.user.username}`,
        name: data.user.username,
        email: data.user.username,
        role: data.user.role,
        title: data.user.role === 'admin' ? 'Platform Master Administrator' : 'Coordinator',
      };
      
      this.setCurrentUser(user);
      return { success: true, user };
    } catch (err) {
      return { success: false, error: 'Authentication service unavailable' };
    }
  },

  changePassword(hospitalId: string, currentPassword: string, newPassword: string): { success: boolean; error?: string } {
    if (!newPassword || newPassword.length < 6) {
      return { success: false, error: 'New password must be at least 6 characters long' };
    }
    // Update locally
    try {
      const stored = localStorage.getItem(CUSTOM_ACCOUNTS_KEY);
      const accounts: HospitalAccount[] = stored ? JSON.parse(stored) : [...INITIAL_HOSPITAL_ACCOUNTS];
      const acc = accounts.find(a => a.hospitalId === hospitalId);
      if (acc) {
        acc.passwordHash = hashPassword(newPassword);
        acc.mustChangePassword = false;
        localStorage.setItem(CUSTOM_ACCOUNTS_KEY, JSON.stringify(accounts));
      }
    } catch {
      // ignore
    }
    return { success: true };
  },

  loginAsAdmin(email?: string): AuthUser {
    const user: AuthUser = {
      id: 'usr-admin-1',
      name: 'Dr. Vikram Malhotra',
      email: email || 'admin@acquiresurgery.com',
      role: 'admin',
      title: 'Platform Master Administrator',
    };
    this.setCurrentUser(user);
    return user;
  },

  loginAsHospital(hospital: Hospital, coordinatorName?: string, email?: string): AuthUser {
    const user: AuthUser = {
      id: `usr-hosp-${hospital.id}`,
      name: coordinatorName || `${hospital.name} Coordinator`,
      email: email || `desk@${hospital.name.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`,
      role: 'hospital',
      hospitalId: hospital.id,
      hospitalName: hospital.name,
      title: 'Hospital Patient Care Desk',
    };
    this.setCurrentUser(user);
    return user;
  },

  logout(): void {
    this.setCurrentUser(null);
  }
};

