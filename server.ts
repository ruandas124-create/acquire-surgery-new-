import 'dotenv/config';
import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { INITIAL_HOSPITALS, INITIAL_CATEGORIES, INITIAL_TREATMENTS, INITIAL_LEADS } from './src/data/initialData';
import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';
import { 
  INITIAL_HOSPITAL_ACCOUNTS, 
  INITIAL_SCHEDULES, 
  hashPassword, 
  generateRandomTempPassword 
} from './src/data/crmData';
import { 
  Hospital, 
  CategoryInfo, 
  TreatmentInfo, 
  Lead, 
  LeadStatus, 
  HospitalAccount, 
  PatientSchedule 
} from './src/types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || 'https://zfifmfzrzxmbwilcsnhx.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

// In-memory persistent state (seeded with comprehensive initial data)
let hospitals: Hospital[] = [...INITIAL_HOSPITALS];
let categories: CategoryInfo[] = [...INITIAL_CATEGORIES];
let treatments: TreatmentInfo[] = [...INITIAL_TREATMENTS];
let leads: Lead[] = [...INITIAL_LEADS];
let hospitalAccounts: HospitalAccount[] = [...INITIAL_HOSPITAL_ACCOUNTS];
let schedules: PatientSchedule[] = [...INITIAL_SCHEDULES];

function parseBudgetNumeric(budgetString: string): number {
  if (!budgetString) return 1000000;
  const lower = budgetString.toLowerCase();
  if (lower.includes('below 50,000') || lower.includes('below ₹50,000')) return 50000;
  if (lower.includes('50,000 – 1 lakh') || lower.includes('50,000 – ₹1 lakh')) return 100000;
  if (lower.includes('1 – 2 lakh') || lower.includes('1 – ₹2 lakh')) return 200000;
  if (lower.includes('2 – 5 lakh') || lower.includes('2 – ₹5 lakh')) return 500000;
  if (lower.includes('5 lakh+') || lower.includes('5 lakh')) return 10000000;
  // If numeric string
  const digits = budgetString.replace(/[^0-9]/g, '');
  if (digits) {
    const val = parseInt(digits, 10);
    return val > 0 ? val : 1000000;
  }
  return 1000000;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // =================== API ROUTES ===================

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
  });

  // Authentication: Login using exclusively public.user_roles in Supabase
  app.post('/api/login', async (req, res) => {
    try {
      const { username, password } = req.body;
      const cleanUsername = typeof username === 'string' ? username.trim() : '';
      const cleanPassword = typeof password === 'string' ? password.trim() : '';

      if (!cleanUsername || !cleanPassword) {
        return res.status(400).json({ success: false, error: 'Username and password required' });
      }

      // Query public.user_roles table in Supabase
      let userRecord: any = null;

      // 1. First query with 'username'
      const { data: users1, error: err1 } = await supabase
        .from('user_roles')
        .select('*')
        .ilike('username', cleanUsername)
        .limit(1);

      if (err1) {
        // If 'username' column query failed, attempt query with capitalized 'Username'
        const { data: users2, error: err2 } = await supabase
          .from('user_roles')
          .select('*')
          .ilike('Username', cleanUsername)
          .limit(1);

        if (!err2 && users2 && users2.length > 0) {
          userRecord = users2[0];
        } else if (err2) {
          console.error('Database query error on user_roles:', err2.message);
          return res.status(500).json({ success: false, error: 'Database service error' });
        }
      } else if (users1 && users1.length > 0) {
        userRecord = users1[0];
      }

      if (!userRecord) {
        return res.status(401).json({ success: false, error: 'Invalid username or password' });
      }

      const storedPassword = userRecord.password ?? userRecord.Password ?? '';
      const storedUsername = userRecord.username ?? userRecord.Username ?? cleanUsername;
      const storedRole = (userRecord.role ?? userRecord.Role ?? 'admin').toLowerCase();

      let isPasswordValid = false;

      // Plaintext verification
      if (storedPassword === cleanPassword) {
        isPasswordValid = true;
      } 
      // Bcrypt hash verification
      else if (storedPassword.startsWith('$2a$') || storedPassword.startsWith('$2b$') || storedPassword.startsWith('$2y$')) {
        try {
          isPasswordValid = await bcrypt.compare(cleanPassword, storedPassword);
        } catch {
          isPasswordValid = false;
        }
      }

      if (!isPasswordValid) {
        return res.status(401).json({ success: false, error: 'Invalid username or password' });
      }

      return res.json({
        success: true,
        user: {
          username: storedUsername,
          role: storedRole
        }
      });
    } catch (routeErr: any) {
      console.error('Server login handler error:', routeErr?.message || 'Internal error');
      return res.status(500).json({ success: false, error: 'Authentication service encountered an error' });
    }
  });

  // Hospitals: GET with dynamic matching & filters
  app.get('/api/hospitals', (req, res) => {
    const { treatment, budget, category, location, query } = req.query;
    let filtered = [...hospitals];

    if (treatment && typeof treatment === 'string' && treatment !== 'All Treatments' && treatment !== 'Other') {
      const targetTreatment = treatment.toLowerCase();
      filtered = filtered.filter(h =>
        h.treatmentEstimates.some(t => t.treatmentName.toLowerCase().includes(targetTreatment)) ||
        h.specialties.some(s => s.toLowerCase().includes(targetTreatment))
      );
    }

    if (budget && typeof budget === 'string') {
      const maxBudget = parseBudgetNumeric(budget);
      if (maxBudget < 10000000) {
        // filter or rank by affordability for the given treatment if specified
        if (treatment && typeof treatment === 'string' && treatment !== 'All Treatments' && treatment !== 'Other') {
          const targetTreatment = treatment.toLowerCase();
          filtered = filtered.filter(h => {
            const estimate = h.treatmentEstimates.find(t => t.treatmentName.toLowerCase().includes(targetTreatment));
            if (!estimate) return true;
            // allow hospitals whose minCost is within or close to budget
            return estimate.minCost <= maxBudget * 1.25;
          });
        }
      }
    }

    if (category && typeof category === 'string' && category !== 'All') {
      filtered = filtered.filter(h => h.category === category);
    }

    if (location && typeof location === 'string' && location !== 'All Locations' && location !== 'All') {
      filtered = filtered.filter(h => h.location.toLowerCase().includes(location.toLowerCase()));
    }

    if (query && typeof query === 'string' && query.trim()) {
      const q = query.toLowerCase().trim();
      filtered = filtered.filter(h =>
        h.name.toLowerCase().includes(q) ||
        h.location.toLowerCase().includes(q) ||
        h.specialties.some(s => s.toLowerCase().includes(q))
      );
    }

    res.json({
      success: true,
      count: filtered.length,
      data: filtered,
    });
  });

  // Single Hospital: GET
  app.get('/api/hospitals/:id', (req, res) => {
    const hospital = hospitals.find(h => h.id === req.params.id);
    if (!hospital) {
      return res.status(404).json({ success: false, error: 'Hospital not found' });
    }
    res.json({ success: true, data: hospital });
  });

  // Hospitals: POST (Admin add)
  app.post('/api/hospitals', (req, res) => {
    const body = req.body;
    if (!body.name || !body.category) {
      return res.status(400).json({ success: false, error: 'Name and category are required' });
    }
    const newHospital: Hospital = {
      id: `hosp-${Date.now()}`,
      name: body.name,
      category: body.category,
      location: body.location || 'Bangalore',
      city: 'Bangalore',
      rating: body.rating || 4.5,
      reviewCount: body.reviewCount || 50,
      establishedYear: body.establishedYear || 2015,
      bedCount: body.bedCount || 150,
      specialties: body.specialties || ['General Surgery'],
      facilities: body.facilities || ['NABH Accredited', '24x7 Emergency', 'Cashless TPA Desk'],
      accreditations: body.accreditations || ['NABH'],
      description: body.description || '',
      imageUrl: body.imageUrl || 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?auto=format&fit=crop&w=800&q=80',
      phone: body.phone || '+91 80 4000 0000',
      address: body.address || 'Bangalore, Karnataka',
      insuranceCashless: body.insuranceCashless || ['Star Health', 'Medi Assist'],
      treatmentEstimates: body.treatmentEstimates || [],
    };
    hospitals.unshift(newHospital);
    res.status(201).json({ success: true, data: newHospital });
  });

  // Hospitals: PUT (Admin edit)
  app.put('/api/hospitals/:id', (req, res) => {
    const index = hospitals.findIndex(h => h.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ success: false, error: 'Hospital not found' });
    }
    hospitals[index] = { ...hospitals[index], ...req.body, id: req.params.id };
    res.json({ success: true, data: hospitals[index] });
  });

  // Hospitals: DELETE (Admin delete)
  app.delete('/api/hospitals/:id', (req, res) => {
    const index = hospitals.findIndex(h => h.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ success: false, error: 'Hospital not found' });
    }
    const deleted = hospitals.splice(index, 1);
    res.json({ success: true, data: deleted[0] });
  });

  // Categories: GET
  app.get('/api/categories', (req, res) => {
    res.json({ success: true, data: categories });
  });

  // Categories: PUT (Admin update category descriptions)
  app.put('/api/categories/:id', (req, res) => {
    const index = categories.findIndex(c => c.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ success: false, error: 'Category not found' });
    }
    categories[index] = { ...categories[index], ...req.body, id: req.params.id };
    res.json({ success: true, data: categories[index] });
  });

  // Treatments: GET
  app.get('/api/treatments', (req, res) => {
    res.json({ success: true, data: treatments });
  });

  // Treatments: POST (Admin add treatment)
  app.post('/api/treatments', (req, res) => {
    const body = req.body;
    if (!body.name) {
      return res.status(400).json({ success: false, error: 'Treatment name required' });
    }
    const newTreatment: TreatmentInfo = {
      id: `treat-${Date.now()}`,
      name: body.name,
      category: body.category || 'General Surgery',
      averageBangaloreMinCost: body.averageBangaloreMinCost || 50000,
      averageBangaloreMaxCost: body.averageBangaloreMaxCost || 120000,
      recoveryDays: body.recoveryDays || '1–2 weeks',
      typicalStay: body.typicalStay || '1–2 days',
      description: body.description || '',
      commonProcedures: body.commonProcedures || [body.name],
    };
    treatments.push(newTreatment);
    res.status(201).json({ success: true, data: newTreatment });
  });

  // Leads: GET (Admin view leads)
  app.get('/api/leads', (req, res) => {
    const sorted = [...leads].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    res.json({ success: true, count: sorted.length, data: sorted });
  });

  // Leads: POST (Create lead from patient search or callback request)
  app.post('/api/leads', (req, res) => {
    const { name, mobile, treatment, budget, city = 'Bangalore', preferredHospitalId, source = 'Search Tool' } = req.body;

    if (!name || !mobile || !treatment) {
      return res.status(400).json({ success: false, error: 'Name, mobile number, and treatment are required' });
    }

    const maxBudget = parseBudgetNumeric(budget);

    // Calculate matching hospitals dynamically
    let matching = hospitals.filter(h => {
      const hasTreatment = h.treatmentEstimates.some(t => t.treatmentName.toLowerCase().includes(treatment.toLowerCase())) ||
                           h.specialties.some(s => s.toLowerCase().includes(treatment.toLowerCase()));
      if (!hasTreatment) return false;
      const estimate = h.treatmentEstimates.find(t => t.treatmentName.toLowerCase().includes(treatment.toLowerCase()));
      if (estimate && maxBudget < 10000000) {
        return estimate.minCost <= maxBudget * 1.35;
      }
      return true;
    });

    if (matching.length === 0) {
      matching = hospitals.slice(0, 4);
    }

    const newLead: Lead = {
      id: `lead-${Date.now()}`,
      name,
      mobile,
      treatment,
      budget: budget || '₹1 – ₹2 Lakh',
      budgetNumeric: maxBudget,
      city,
      createdAt: new Date().toISOString(),
      matchedHospitalIds: matching.map(h => h.id),
      matchedHospitalCount: matching.length,
      status: 'New' as LeadStatus,
      assignedRep: 'Unassigned',
      notes: [`Inquiry submitted for ${treatment}. Budget: ${budget}. Found ${matching.length} matching hospitals.`],
      preferredHospitalId,
      source,
    };

    leads.unshift(newLead);
    res.status(201).json({ success: true, data: newLead, matchingCount: matching.length });
  });

  // Leads: PATCH (Update lead status, assignment, notes)
  app.patch('/api/leads/:id', (req, res) => {
    const lead = leads.find(l => l.id === req.params.id);
    if (!lead) {
      return res.status(404).json({ success: false, error: 'Lead not found' });
    }
    const { status, assignedRep, note, authorName } = req.body;
    if (status) lead.status = status;
    if (assignedRep !== undefined) lead.assignedRep = assignedRep;
    if (note) {
      if (!lead.notes) lead.notes = [];
      const timestamp = new Date().toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' });
      const author = authorName || 'Admin';
      lead.notes.push(`[${timestamp} by ${author}] ${note}`);
    }
    res.json({ success: true, data: lead });
  });

  // =================== PATIENT SCHEDULING ===================
  app.get('/api/schedules', (req, res) => {
    const hospitalId = req.query.hospitalId as string;
    let list = [...schedules];
    if (hospitalId) {
      list = list.filter(s => s.hospitalId === hospitalId);
    }
    res.json({ success: true, data: list });
  });

  app.post('/api/schedules', (req, res) => {
    const body = req.body;
    if (!body.patientName || !body.mobile || !body.hospitalId || !body.surgeryName) {
      return res.status(400).json({ success: false, error: 'Patient name, mobile, hospital, and surgery are required' });
    }
    const hosp = hospitals.find(h => h.id === body.hospitalId);
    const newSchedule: PatientSchedule = {
      id: `sched-${Date.now()}`,
      patientName: body.patientName,
      mobile: body.mobile,
      hospitalId: body.hospitalId,
      hospitalName: body.hospitalName || hosp?.name || 'Selected Hospital',
      surgeryName: body.surgeryName,
      minCost: body.minCost,
      maxCost: body.maxCost,
      budget: body.budget || '₹1 – ₹2 Lakh',
      source: body.source || 'Acquire OPD',
      referralDetails: body.referralDetails,
      appointmentDate: body.appointmentDate || new Date().toISOString().split('T')[0],
      preferredTime: body.preferredTime || '10:00 AM',
      status: body.status || 'Scheduled',
      createdAt: new Date().toISOString(),
      notes: body.notes || [
        {
          id: `note-${Date.now()}`,
          text: body.initialNote || 'Scheduled via Acquire OPD Platform',
          authorName: body.authorName || 'Platform Coordinator',
          createdAt: new Date().toISOString(),
        }
      ],
    };
    schedules.unshift(newSchedule);
    res.status(201).json({ success: true, data: newSchedule });
  });

  app.patch('/api/schedules/:id', (req, res) => {
    const schedule = schedules.find(s => s.id === req.params.id);
    if (!schedule) {
      return res.status(404).json({ success: false, error: 'Schedule record not found' });
    }
    const { status, appointmentDate, preferredTime, note, authorName, ...rest } = req.body;
    if (status) schedule.status = status;
    if (appointmentDate) schedule.appointmentDate = appointmentDate;
    if (preferredTime) schedule.preferredTime = preferredTime;
    Object.assign(schedule, rest);
    if (note) {
      if (!schedule.notes) schedule.notes = [];
      schedule.notes.push({
        id: `snote-${Date.now()}`,
        text: note,
        authorName: authorName || 'Staff',
        createdAt: new Date().toISOString(),
      });
    }
    res.json({ success: true, data: schedule });
  });

  app.delete('/api/schedules/:id', (req, res) => {
    const idx = schedules.findIndex(s => s.id === req.params.id);
    if (idx === -1) {
      return res.status(404).json({ success: false, error: 'Schedule record not found' });
    }
    const deleted = schedules.splice(idx, 1);
    res.json({ success: true, data: deleted[0] });
  });

  // =================== HOSPITAL ACCESS MANAGEMENT ===================
  app.get('/api/hospital-accounts', (req, res) => {
    res.json({ success: true, data: hospitalAccounts });
  });

  app.post('/api/hospital-accounts', (req, res) => {
    const { hospitalId, hospitalName, email, mobile, username, password, accountStatus } = req.body;
    if (!hospitalName || !email || !mobile || !username) {
      return res.status(400).json({ success: false, error: 'Hospital Name, Email, Mobile, and Username are required' });
    }
    // Check duplicate username
    if (hospitalAccounts.some(a => a.username.toLowerCase() === username.toLowerCase())) {
      return res.status(400).json({ success: false, error: 'Username is already in use by another hospital account' });
    }

    // Connect to existing hospital or create linked hospital
    let matchedHosp = hospitals.find(h => h.id === hospitalId || h.name.toLowerCase() === hospitalName.toLowerCase());
    let targetHospitalId = hospitalId;
    if (!matchedHosp) {
      targetHospitalId = `hosp-${Date.now()}`;
      matchedHosp = {
        id: targetHospitalId,
        name: hospitalName,
        category: 'Standard Hospital',
        location: 'Bangalore',
        city: 'Bangalore',
        rating: 4.5,
        reviewCount: 20,
        establishedYear: 2018,
        bedCount: 100,
        specialties: ['General Surgery'],
        facilities: ['NABH Accredited', '24x7 Emergency'],
        accreditations: ['NABH'],
        description: `Verified hospital partner ${hospitalName}.`,
        imageUrl: 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?auto=format&fit=crop&w=800&q=80',
        phone: mobile,
        address: 'Bangalore, Karnataka',
        insuranceCashless: ['Star Health', 'Medi Assist'],
        treatmentEstimates: [],
        email,
        mobile,
      };
      hospitals.unshift(matchedHosp);
    }

    const plainPassword = password || generateRandomTempPassword();
    const newAccount: HospitalAccount = {
      id: `acc-${Date.now()}`,
      hospitalId: matchedHosp.id,
      hospitalName: matchedHosp.name,
      email,
      mobile,
      username,
      passwordHash: hashPassword(plainPassword),
      accountStatus: accountStatus || 'Active',
      createdAt: new Date().toISOString(),
      mustChangePassword: true,
    };

    hospitalAccounts.unshift(newAccount);
    res.status(201).json({ 
      success: true, 
      data: newAccount, 
      tempPassword: plainPassword 
    });
  });

  app.patch('/api/hospital-accounts/:id', (req, res) => {
    const acc = hospitalAccounts.find(a => a.id === req.params.id);
    if (!acc) {
      return res.status(404).json({ success: false, error: 'Account not found' });
    }
    const { accountStatus, email, mobile, hospitalName } = req.body;
    if (accountStatus) acc.accountStatus = accountStatus;
    if (email) acc.email = email;
    if (mobile) acc.mobile = mobile;
    if (hospitalName) acc.hospitalName = hospitalName;
    res.json({ success: true, data: acc });
  });

  app.post('/api/hospital-accounts/:id/reset-password', (req, res) => {
    const acc = hospitalAccounts.find(a => a.id === req.params.id);
    if (!acc) {
      return res.status(404).json({ success: false, error: 'Account not found' });
    }
    const newPlainPassword = req.body.password || generateRandomTempPassword();
    acc.passwordHash = hashPassword(newPlainPassword);
    acc.mustChangePassword = true;
    res.json({ 
      success: true, 
      message: 'Password reset successfully', 
      tempPassword: newPlainPassword 
    });
  });

  app.delete('/api/hospital-accounts/:id', (req, res) => {
    const idx = hospitalAccounts.findIndex(a => a.id === req.params.id);
    if (idx === -1) {
      return res.status(404).json({ success: false, error: 'Account not found' });
    }
    const deleted = hospitalAccounts.splice(idx, 1);
    res.json({ success: true, data: deleted[0] });
  });

  // Stats: GET
  app.get('/api/stats', (req, res) => {
    res.json({
      success: true,
      totalHospitals: hospitals.length,
      totalTreatments: treatments.length,
      totalLeads: leads.length,
      newLeads: leads.filter(l => l.status === 'New Leads').length,
      inProgressLeads: leads.filter(l => l.status === 'RNR' || l.status === 'Followup').length,
      closedLeads: leads.filter(l => l.status === 'Converted' || l.status === 'Junk').length,
    });
  });

  // =================== VITE MIDDLEWARE ===================
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Right Hospital server listening on port ${PORT}`);
  });
}

startServer();
