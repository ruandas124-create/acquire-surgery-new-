import { Hospital, CategoryInfo, TreatmentInfo, Lead, SearchCriteria, PatientSchedule, HospitalAccount } from '../types';
import { supabase } from './supabaseClient';
import { INITIAL_HOSPITALS, INITIAL_CATEGORIES, INITIAL_TREATMENTS, INITIAL_LEADS } from '../data/initialData';
import { INITIAL_HOSPITAL_ACCOUNTS, INITIAL_SCHEDULES, hashPassword, generateRandomTempPassword } from '../data/crmData';

// Fallback in-memory client state if offline / fetch fails
let localHospitals = [...INITIAL_HOSPITALS];
let localCategories = [...INITIAL_CATEGORIES];
let localTreatments = [...INITIAL_TREATMENTS];
let localLeads = [...INITIAL_LEADS];
let localHospitalAccounts = [...INITIAL_HOSPITAL_ACCOUNTS];
let localSchedules = [...INITIAL_SCHEDULES];

export const api = {
  async getHospitals(params?: {
    treatment?: string;
    budget?: string;
    category?: string;
    location?: string;
    query?: string;
  }): Promise<Hospital[]> {
    try {
      const searchParams = new URLSearchParams();
      if (params?.treatment) searchParams.append('treatment', params.treatment);
      if (params?.budget) searchParams.append('budget', params.budget);
      if (params?.category) searchParams.append('category', params.category);
      if (params?.location) searchParams.append('location', params.location);
      if (params?.query) searchParams.append('query', params.query);

      const res = await fetch(`/api/hospitals?${searchParams.toString()}`);
      if (!res.ok) throw new Error('API fetch failed');
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        localHospitals = json.data;
        return json.data;
      }
    } catch {
      console.warn('Falling back to client-side hospital filtering');
    }

    // Client-side fallback filter
    let results = [...localHospitals];
    if (params?.treatment && params.treatment !== 'All Treatments') {
      const tLower = params.treatment.toLowerCase();
      results = results.filter(h =>
        h.treatmentEstimates.some(t => t.treatmentName.toLowerCase().includes(tLower)) ||
        h.specialties.some(s => s.toLowerCase().includes(tLower))
      );
    }
    if (params?.category && params.category !== 'All') {
      results = results.filter(h => h.category === params.category);
    }
    if (params?.location && params.location !== 'All Locations' && params.location !== 'All') {
      results = results.filter(h => h.location.toLowerCase().includes(params.location!.toLowerCase()));
    }
    if (params?.query) {
      const q = params.query.toLowerCase().trim();
      results = results.filter(h =>
        h.name.toLowerCase().includes(q) ||
        h.location.toLowerCase().includes(q) ||
        h.specialties.some(s => s.toLowerCase().includes(q))
      );
    }
    return results;
  },

  async getHospitalById(id: string): Promise<Hospital | null> {
    try {
      const res = await fetch(`/api/hospitals/${id}`);
      if (res.ok) {
        const json = await res.json();
        if (json.success) return json.data;
      }
    } catch {
      // ignore
    }
    return localHospitals.find(h => h.id === id) || null;
  },

  async addHospital(hospital: Partial<Hospital>): Promise<Hospital> {
    try {
      const res = await fetch('/api/hospitals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(hospital),
      });
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch {
      // fallback
    }
    const newHosp = { ...hospital, id: `hosp-${Date.now()}` } as Hospital;
    localHospitals.unshift(newHosp);
    return newHosp;
  },

  async updateHospital(id: string, updates: Partial<Hospital>): Promise<Hospital> {
    try {
      const res = await fetch(`/api/hospitals/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch {
      // fallback
    }
    const idx = localHospitals.findIndex(h => h.id === id);
    if (idx !== -1) {
      localHospitals[idx] = { ...localHospitals[idx], ...updates };
      return localHospitals[idx];
    }
    throw new Error('Hospital not found');
  },

  async deleteHospital(id: string): Promise<boolean> {
    try {
      const res = await fetch(`/api/hospitals/${id}`, { method: 'DELETE' });
      if (res.ok) return true;
    } catch {
      // fallback
    }
    localHospitals = localHospitals.filter(h => h.id !== id);
    return true;
  },

  async getCategories(): Promise<CategoryInfo[]> {
    try {
      const res = await fetch('/api/categories');
      if (res.ok) {
        const json = await res.json();
        if (json.success) {
          localCategories = json.data;
          return json.data;
        }
      }
    } catch {
      // ignore
    }
    return localCategories;
  },

  async updateCategory(id: string, updates: Partial<CategoryInfo>): Promise<CategoryInfo> {
    try {
      const res = await fetch(`/api/categories/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch {
      // ignore
    }
    const idx = localCategories.findIndex(c => c.id === id);
    if (idx !== -1) {
      localCategories[idx] = { ...localCategories[idx], ...updates };
      return localCategories[idx];
    }
    throw new Error('Category not found');
  },

  async getTreatments(): Promise<TreatmentInfo[]> {
    try {
      const res = await fetch('/api/treatments');
      if (res.ok) {
        const json = await res.json();
        if (json.success) {
          localTreatments = json.data;
          return json.data;
        }
      }
    } catch {
      // ignore
    }
    return localTreatments;
  },

  async getLeads(): Promise<Lead[]> {
    const { data, error } = await supabase.from('leads').select('*').order('created_at', { ascending: false });
    if (error) {
      console.error('Error fetching leads:', error);
      return localLeads;
    }
    return data || [];
  },

  async searchHospitals(criteria: { treatment?: string; budget?: string; location?: string }): Promise<Hospital[]> {
    return this.getHospitals({
      treatment: criteria.treatment,
      budget: criteria.budget,
      location: criteria.location,
    });
  },

  async createLead(criteria: SearchCriteria & { preferredHospitalId?: string; source?: string; matchedHospitalIds?: string[] }): Promise<{ lead: Lead; matchingCount: number }> {
    const newLeadData = {
      name: criteria.name,
      mobile: criteria.mobile,
      treatment: criteria.treatment,
      budget: criteria.budget,
      city: criteria.city || 'Bangalore',
      status: 'New Leads',
      source: criteria.source || 'Search Tool',
      notes: [`Inquiry submitted for ${criteria.treatment}`]
    };
    
    const { data, error } = await supabase.from('leads').insert([newLeadData]).select().single();
    if (error) {
      console.error('Error creating lead:', error);
      throw error;
    }
    return { lead: data, matchingCount: 0 };
  },

  async updateLead(id: string, updates: { status?: string; assignedRep?: string; note?: string; authorName?: string }): Promise<Lead> {
    const { data: lead, error: fetchError } = await supabase.from('leads').select('*').eq('id', id).single();
    if (fetchError) throw fetchError;

    const newUpdates: any = { ...updates };
    if (updates.note) {
      const author = updates.authorName || 'Staff';
      const timestamp = new Date().toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' });
      newUpdates.notes = [...(lead.notes || []), `[${timestamp} by ${author}] ${updates.note}`];
      delete newUpdates.note;
      delete newUpdates.authorName;
    }

    const { data, error } = await supabase.from('leads').update(newUpdates).eq('id', id).select().single();
    if (error) {
      console.error('Error updating lead:', error);
      throw error;
    }
    return data;
  },

  // =================== PATIENT SCHEDULING ===================
  async getSchedules(hospitalId?: string): Promise<PatientSchedule[]> {
    try {
      const url = hospitalId ? `/api/schedules?hospitalId=${encodeURIComponent(hospitalId)}` : '/api/schedules';
      const res = await fetch(url);
      if (res.ok) {
        const json = await res.json();
        if (json.success) {
          localSchedules = json.data;
          return json.data;
        }
      }
    } catch {
      // ignore
    }
    if (hospitalId) {
      return localSchedules.filter(s => s.hospitalId === hospitalId);
    }
    return localSchedules;
  },

  async createSchedule(data: Partial<PatientSchedule> & { initialNote?: string; authorName?: string }): Promise<PatientSchedule> {
    try {
      const res = await fetch('/api/schedules', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        const json = await res.json();
        if (json.success) {
          localSchedules.unshift(json.data);
          return json.data;
        }
      }
    } catch {
      // ignore
    }

    const newSched: PatientSchedule = {
      id: `sched-${Date.now()}`,
      patientName: data.patientName || 'Patient',
      mobile: data.mobile || '+91 94296 93887',
      hospitalId: data.hospitalId || 'hosp-manipal-oar',
      hospitalName: data.hospitalName || 'Manipal Hospital',
      surgeryName: data.surgeryName || 'General Surgery',
      minCost: data.minCost,
      maxCost: data.maxCost,
      budget: data.budget || '₹1 – ₹2 Lakh',
      source: data.source || 'Acquire OPD',
      referralDetails: data.referralDetails,
      appointmentDate: data.appointmentDate || new Date().toISOString().split('T')[0],
      preferredTime: data.preferredTime || '10:00 AM',
      status: data.status || 'Scheduled',
      createdAt: new Date().toISOString(),
      notes: [
        {
          id: `snote-${Date.now()}`,
          text: data.initialNote || 'Scheduled via Acquire OPD Platform',
          authorName: data.authorName || 'Platform Coordinator',
          createdAt: new Date().toISOString(),
        }
      ]
    };
    localSchedules.unshift(newSched);
    return newSched;
  },

  async updateSchedule(id: string, updates: Partial<PatientSchedule> & { note?: string; authorName?: string }): Promise<PatientSchedule> {
    try {
      const res = await fetch(`/api/schedules/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (res.ok) {
        const json = await res.json();
        if (json.success) {
          const idx = localSchedules.findIndex(s => s.id === id);
          if (idx !== -1) localSchedules[idx] = json.data;
          return json.data;
        }
      }
    } catch {
      // ignore
    }

    const sched = localSchedules.find(s => s.id === id);
    if (!sched) throw new Error('Schedule not found');
    Object.assign(sched, updates);
    if (updates.note) {
      if (!sched.notes) sched.notes = [];
      sched.notes.push({
        id: `snote-${Date.now()}`,
        text: updates.note,
        authorName: updates.authorName || 'Staff',
        createdAt: new Date().toISOString(),
      });
    }
    return sched;
  },

  async deleteSchedule(id: string): Promise<boolean> {
    try {
      const res = await fetch(`/api/schedules/${id}`, { method: 'DELETE' });
      if (res.ok) {
        localSchedules = localSchedules.filter(s => s.id !== id);
        return true;
      }
    } catch {
      // ignore
    }
    localSchedules = localSchedules.filter(s => s.id !== id);
    return true;
  },

  // =================== HOSPITAL ACCESS MANAGEMENT ===================
  async getHospitalAccounts(): Promise<HospitalAccount[]> {
    try {
      const res = await fetch('/api/hospital-accounts');
      if (res.ok) {
        const json = await res.json();
        if (json.success) {
          localHospitalAccounts = json.data;
          return json.data;
        }
      }
    } catch {
      // ignore
    }
    return localHospitalAccounts;
  },

  async createHospitalAccount(data: {
    hospitalId?: string;
    hospitalName: string;
    email: string;
    mobile: string;
    username: string;
    password?: string;
    accountStatus?: 'Active' | 'Inactive';
  }): Promise<{ account: HospitalAccount; tempPassword: string }> {
    try {
      const res = await fetch('/api/hospital-accounts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        const json = await res.json();
        if (json.success) {
          localHospitalAccounts.unshift(json.data);
          return { account: json.data, tempPassword: json.tempPassword };
        }
      }
    } catch {
      // ignore
    }

    const tempPassword = data.password || generateRandomTempPassword();
    const newAccount: HospitalAccount = {
      id: `acc-${Date.now()}`,
      hospitalId: data.hospitalId || `hosp-${Date.now()}`,
      hospitalName: data.hospitalName,
      email: data.email,
      mobile: data.mobile,
      username: data.username,
      passwordHash: hashPassword(tempPassword),
      accountStatus: data.accountStatus || 'Active',
      createdAt: new Date().toISOString(),
      mustChangePassword: true,
    };
    localHospitalAccounts.unshift(newAccount);
    return { account: newAccount, tempPassword };
  },

  async updateHospitalAccount(id: string, updates: Partial<HospitalAccount>): Promise<HospitalAccount> {
    try {
      const res = await fetch(`/api/hospital-accounts/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (res.ok) {
        const json = await res.json();
        if (json.success) {
          const idx = localHospitalAccounts.findIndex(a => a.id === id);
          if (idx !== -1) localHospitalAccounts[idx] = json.data;
          return json.data;
        }
      }
    } catch {
      // ignore
    }
    const acc = localHospitalAccounts.find(a => a.id === id);
    if (!acc) throw new Error('Account not found');
    Object.assign(acc, updates);
    return acc;
  },

  async resetHospitalPassword(id: string, password?: string): Promise<{ tempPassword: string }> {
    try {
      const res = await fetch(`/api/hospital-accounts/${id}/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        const json = await res.json();
        if (json.success) {
          return { tempPassword: json.tempPassword };
        }
      }
    } catch {
      // ignore
    }
    const acc = localHospitalAccounts.find(a => a.id === id);
    const tempPassword = password || generateRandomTempPassword();
    if (acc) {
      acc.passwordHash = hashPassword(tempPassword);
      acc.mustChangePassword = true;
    }
    return { tempPassword };
  },

  async deleteHospitalAccount(id: string): Promise<boolean> {
    try {
      const res = await fetch(`/api/hospital-accounts/${id}`, { method: 'DELETE' });
      if (res.ok) {
        localHospitalAccounts = localHospitalAccounts.filter(a => a.id !== id);
        return true;
      }
    } catch {
      // ignore
    }
    localHospitalAccounts = localHospitalAccounts.filter(a => a.id !== id);
    return true;
  },
};
