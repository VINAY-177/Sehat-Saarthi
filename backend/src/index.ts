import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();
const app = express();

const JWT_SECRET = process.env.JWT_SECRET || 'sehat_saathi_sih_jwt_secret_key_2026';
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

app.use((req: Request, res: Response, next: NextFunction) => {
  const correlationId = `req-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
  (req as any).correlationId = correlationId;
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    const authReq = req as AuthRequest;
    const userId = authReq.user?.userId || 'anon';
    const role = authReq.user?.role || '-';
    console.log(`[${correlationId}] ${req.method} ${req.path} ${res.statusCode} ${duration}ms user=${userId} role=${role}`);
  });
  
  next();
});

// ============================================================
// Auth Middleware & Types
// ============================================================

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    role: string;
    phone: string;
    email?: string | null;
    name: string;
    patientId?: string;
    doctorId?: string;
    staffId?: string;
    facilityId?: string;
  };
}

export const authenticateToken = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return next(); // Proceed as unauthenticated
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET) as any;
    req.user = payload;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired session token' });
  }
};

export const requireAuth = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  next();
};

export const requireRole = (allowedRoles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Access denied: insufficient permissions for this role' });
    }
    next();
  };
};

app.use(authenticateToken);

// ============================================================
// 1. Authentication Endpoints (Signup, Login, Me)
// ============================================================

// Signup
app.post('/api/auth/signup', async (req: Request, res: Response) => {
  try {
    const { name, phone, email, password, role, specialty, facilityId } = req.body;

    if (!name || !phone || !password) {
      return res.status(400).json({ error: 'Name, phone number, and password are required' });
    }

    if (password.length < 4) {
      return res.status(400).json({ error: 'Password must be at least 4 characters long' });
    }

    const assignedRole = role || 'PATIENT';

    // Check if phone or email already registered
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { phone: String(phone).trim() },
          ...(email ? [{ email: String(email).trim() }] : []),
        ],
      },
    });

    if (existingUser) {
      return res.status(409).json({ error: 'An account with this phone number or email already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Create user
    const user = await prisma.user.create({
      data: {
        name: name.trim(),
        phone: String(phone).trim(),
        email: email ? String(email).trim() : null,
        passwordHash,
        role: assignedRole,
      },
    });

    let patientId: string | undefined;
    let doctorId: string | undefined;
    let staffId: string | undefined;

    // Link appropriate role entity
    if (assignedRole === 'PATIENT' || assignedRole === 'CITIZEN') {
      const count = await prisma.patient.count();
      const patient = await prisma.patient.create({
        data: {
          userId: user.id,
          mrn: `MRN-2026-${String(count + 1).padStart(4, '0')}`,
          name: user.name,
          phone: user.phone,
          email: user.email,
          age: 30,
          gender: 'Other',
          district: 'New Delhi',
          state: 'Delhi',
        },
      });
      patientId = patient.id;
    } else if (assignedRole === 'DOCTOR') {
      const doctor = await prisma.doctor.create({
        data: {
          userId: user.id,
          name: user.name,
          specialty: specialty || 'General Medicine',
          phone: user.phone,
          email: user.email,
          facilityId: facilityId || null,
          available: true,
        },
      });
      doctorId = doctor.id;
    } else if (assignedRole === 'HOSPITAL_STAFF') {
      const staff = await prisma.staff.create({
        data: {
          userId: user.id,
          name: user.name,
          phone: user.phone,
          email: user.email,
          facilityId: facilityId || null,
          role: 'NURSE',
        },
      });
      staffId = staff.id;
    }

    // Generate JWT
    const tokenPayload = {
      userId: user.id,
      name: user.name,
      role: user.role,
      phone: user.phone,
      email: user.email,
      patientId,
      doctorId,
      staffId,
      facilityId,
    };

    const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      message: 'Account created successfully',
      token,
      user: tokenPayload,
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Internal server error during registration' });
  }
});

// Built-in SIH Demo Accounts Fallback Definition
const DEMO_ACCOUNTS = [
  {
    userId: 'usr-patient-001',
    name: 'Aarav Sharma',
    phone: '9876500001',
    email: 'patient.demo@sehatsaathi.test',
    role: 'PATIENT',
    patientId: 'pat-aarav-001',
    password: 'Demo@1234',
    altPassword: 'SehatSaathi@2026',
  },
  {
    userId: 'usr-doctor-001',
    name: 'Dr. Priya Mehta',
    phone: '9876500002',
    email: 'doctor.demo@sehatsaathi.test',
    role: 'DOCTOR',
    doctorId: 'doc-priya-001',
    facilityId: 'hosp-ggh-delhi',
    password: 'Demo@1234',
    altPassword: 'SehatSaathi@2026',
  },
  {
    userId: 'usr-staff-001',
    name: 'Neha Kapoor',
    phone: '9876500003',
    email: 'staff.demo@sehatsaathi.test',
    role: 'HOSPITAL_STAFF',
    staffId: 'staff-neha-001',
    facilityId: 'hosp-ggh-delhi',
    password: 'Demo@1234',
    altPassword: 'SehatSaathi@2026',
  },
];

// Login
app.post('/api/auth/login', async (req: Request, res: Response) => {
  try {
    const { emailOrMobile, password } = req.body;

    if (!emailOrMobile || !password) {
      return res.status(400).json({ error: 'Phone/Email and password are required' });
    }

    const query = String(emailOrMobile).trim();
    let authenticatedUser: any = null;

    // 1. Try querying PostgreSQL database
    try {
      const user = await prisma.user.findFirst({
        where: {
          OR: [
            { phone: query },
            { email: query },
          ],
        },
        include: {
          patient: true,
          doctor: true,
          staff: true,
        },
      });

      if (user) {
        const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
        if (isPasswordValid) {
          authenticatedUser = {
            userId: user.id,
            name: user.name,
            role: user.role,
            phone: user.phone,
            email: user.email,
            patientId: user.patient?.id,
            doctorId: user.doctor?.id,
            staffId: user.staff?.id,
            facilityId: user.doctor?.facilityId || user.staff?.facilityId || undefined,
          };
        } else {
          return res.status(401).json({ error: 'Invalid password. Please check your credentials.' });
        }
      }
    } catch (dbErr) {
      console.warn('PostgreSQL database query fallback to demo accounts:', dbErr);
    }

    // 2. If user was not in DB or DB is starting up, check demo accounts
    if (!authenticatedUser) {
      const demoMatch = DEMO_ACCOUNTS.find(
        (acc) =>
          (acc.phone === query || acc.email === query) &&
          (password === acc.password || password === acc.altPassword || password === 'Demo@1234')
      );

      if (demoMatch) {
        authenticatedUser = {
          userId: demoMatch.userId,
          name: demoMatch.name,
          role: demoMatch.role,
          phone: demoMatch.phone,
          email: demoMatch.email,
          patientId: demoMatch.patientId,
          doctorId: demoMatch.doctorId,
          staffId: demoMatch.staffId,
          facilityId: demoMatch.facilityId,
        };
      }
    }

    if (!authenticatedUser) {
      return res.status(401).json({ error: 'Invalid credentials. Please enter a valid phone number and password.' });
    }

    const token = jwt.sign(authenticatedUser, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      message: 'Login successful',
      token,
      user: authenticatedUser,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(401).json({ error: 'Authentication failed. Please check your credentials.' });
  }
});

const VALID_BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

// Get Current Profile (Me & Profile alias)
app.get(['/api/auth/me', '/api/profile'], requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    try {
      const user = await prisma.user.findUnique({
        where: { id: req.user.userId },
        include: {
          patient: {
            include: {
              conditions: true,
              allergies: true,
              vitals: { orderBy: { recordedAt: 'desc' }, take: 1 },
            },
          },
          doctor: {
            include: {
              facility: true,
            },
          },
          staff: {
            include: {
              facility: true,
            },
          },
        },
      });

      if (user) {
        return res.json({
          id: user.id,
          name: user.name,
          phone: user.phone,
          email: user.email,
          role: user.role,
          patient: user.patient,
          doctor: user.doctor,
          staff: user.staff,
          patientId: user.patient?.id,
          doctorId: user.doctor?.id,
          staffId: user.staff?.id,
          facilityId: user.doctor?.facilityId || user.staff?.facilityId || undefined,
          facilityName: user.doctor?.facility?.name || user.staff?.facility?.name,
          specialty: user.doctor?.specialty,
        });
      }
    } catch (dbErr) {
      console.warn('DB lookup for profile fallback to token payload:', dbErr);
    }

    // Fallback directly to verified JWT payload or demo account
    const demoMatch = DEMO_ACCOUNTS.find(a => a.userId === req.user?.userId || a.phone === req.user?.phone);
    res.json({
      id: req.user.userId,
      name: demoMatch?.name || req.user.name,
      phone: demoMatch?.phone || req.user.phone,
      email: demoMatch?.email || req.user.email,
      role: req.user.role,
      patientId: req.user.patientId,
      doctorId: req.user.doctorId,
      staffId: req.user.staffId,
      facilityId: req.user.facilityId,
      specialty: (demoMatch as any)?.specialty,
      patient: req.user.role === 'PATIENT' ? {
        id: req.user.patientId || 'pat-aarav-001',
        name: demoMatch?.name || req.user.name,
        age: 28,
        gender: 'Male',
        bloodGroup: 'B+',
        district: 'Central Delhi',
        state: 'Delhi',
        village: 'Connaught Place',
        emergencyContactName: 'Ramesh Sharma',
        emergencyContactPhone: '9876500099',
        allergies: [{ allergen: 'Penicillin' }],
        conditions: [{ name: 'Hypertension — mild' }],
      } : undefined,
    });
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ error: 'Failed to fetch user profile' });
  }
});

// Update Profile (PUT /api/profile & PUT /api/auth/me)
app.put(['/api/profile', '/api/auth/me'], requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const {
      name, phone, email,
      // Patient fields
      dateOfBirth, age, gender, bloodGroup, address, village, city, district, state, pincode,
      emergencyContactName, emergencyContactPhone, emergencyContactRelation,
      allergies, conditions,
      // Doctor fields
      specialty, department, registrationNumber, licenseNumber, experience, facilityId,
      // Staff fields
      designation, shift, employeeId
    } = req.body;

    // Frontend & Backend Field Validations
    if (name !== undefined && (!name || typeof name !== 'string' || name.trim().length < 2)) {
      return res.status(400).json({ error: 'Full name must be at least 2 characters long' });
    }

    if (phone !== undefined && (!phone || typeof phone !== 'string' || phone.trim().length < 4)) {
      return res.status(400).json({ error: 'Valid phone number is required' });
    }

    if (email && typeof email === 'string' && email.trim().length > 0) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.trim())) {
        return res.status(400).json({ error: 'Invalid email address format' });
      }
    }

    if (bloodGroup && typeof bloodGroup === 'string' && bloodGroup.trim().length > 0) {
      const formattedBlood = bloodGroup.trim().toUpperCase();
      if (!VALID_BLOOD_GROUPS.includes(formattedBlood)) {
        return res.status(400).json({ error: `Invalid blood group. Please select one of: ${VALID_BLOOD_GROUPS.join(', ')}` });
      }
    }

    if (age !== undefined && age !== null && age !== '') {
      const numAge = parseInt(String(age), 10);
      if (isNaN(numAge) || numAge < 0 || numAge > 125) {
        return res.status(400).json({ error: 'Please enter a valid age between 0 and 125' });
      }
    }

    let updatedUser: any = null;

    try {
      // 1. Update Core User model
      const userUpdateData: any = {};
      if (name) userUpdateData.name = name.trim();
      if (phone) userUpdateData.phone = String(phone).trim();
      if (email !== undefined) userUpdateData.email = email ? String(email).trim() : null;

      const user = await prisma.user.update({
        where: { id: req.user.userId },
        data: userUpdateData,
      });

      // 2. Update Role-specific models
      if (req.user.role === 'PATIENT' || req.user.role === 'CITIZEN') {
        const patientData: any = {
          name: user.name,
          phone: user.phone,
          email: user.email,
        };
        if (dateOfBirth !== undefined) patientData.dateOfBirth = dateOfBirth;
        if (age !== undefined && age !== null && age !== '') patientData.age = parseInt(String(age), 10);
        if (gender !== undefined) patientData.gender = gender;
        if (bloodGroup !== undefined) patientData.bloodGroup = bloodGroup ? bloodGroup.trim().toUpperCase() : null;
        if (address !== undefined) patientData.address = address;
        if (village !== undefined) patientData.village = village;
        if (city !== undefined) patientData.city = city;
        if (district !== undefined) patientData.district = district;
        if (state !== undefined) patientData.state = state;
        if (pincode !== undefined) patientData.pincode = pincode;
        if (emergencyContactName !== undefined) patientData.emergencyContactName = emergencyContactName;
        if (emergencyContactPhone !== undefined) patientData.emergencyContactPhone = emergencyContactPhone;
        if (emergencyContactRelation !== undefined) patientData.emergencyContactRelation = emergencyContactRelation;

        const updatedPatient = await prisma.patient.upsert({
          where: { userId: user.id },
          create: {
            userId: user.id,
            mrn: `MRN-2026-${Math.floor(1000 + Math.random() * 9000)}`,
            name: user.name,
            phone: user.phone,
            email: user.email,
            age: patientData.age || 30,
            gender: patientData.gender || 'Other',
            district: patientData.district || 'New Delhi',
            state: patientData.state || 'Delhi',
            ...patientData,
          },
          update: patientData,
        });

        // Update allergies if supplied
        if (Array.isArray(allergies)) {
          await prisma.allergy.deleteMany({ where: { patientId: updatedPatient.id } });
          for (const item of allergies) {
            const allergen = typeof item === 'string' ? item.trim() : (item?.allergen || '').trim();
            if (allergen) {
              await prisma.allergy.create({
                data: {
                  patientId: updatedPatient.id,
                  allergen,
                  type: 'OTHER',
                  severity: 'MILD',
                },
              });
            }
          }
        }

        // Update conditions if supplied
        if (Array.isArray(conditions)) {
          await prisma.medicalCondition.deleteMany({ where: { patientId: updatedPatient.id } });
          for (const item of conditions) {
            const condName = typeof item === 'string' ? item.trim() : (item?.name || '').trim();
            if (condName) {
              await prisma.medicalCondition.create({
                data: {
                  patientId: updatedPatient.id,
                  name: condName,
                  status: 'ACTIVE',
                },
              });
            }
          }
        }
      } else if (req.user.role === 'DOCTOR') {
        const doctorData: any = {
          name: user.name,
          phone: user.phone,
          email: user.email,
        };
        if (specialty !== undefined) doctorData.specialty = specialty;
        if (department !== undefined) doctorData.department = department;
        if (licenseNumber !== undefined || registrationNumber !== undefined) {
          doctorData.licenseNumber = licenseNumber || registrationNumber;
        }
        if (experience !== undefined) doctorData.experience = experience;
        if (facilityId !== undefined) doctorData.facilityId = facilityId;

        await prisma.doctor.upsert({
          where: { userId: user.id },
          create: {
            userId: user.id,
            name: user.name,
            phone: user.phone,
            email: user.email,
            specialty: doctorData.specialty || 'General Medicine',
            department: doctorData.department || 'General Medicine',
            facilityId: doctorData.facilityId || null,
            ...doctorData,
          },
          update: doctorData,
        });
      } else if (req.user.role === 'HOSPITAL_STAFF') {
        const staffData: any = {
          name: user.name,
          phone: user.phone,
          email: user.email,
        };
        if (designation !== undefined || department !== undefined) {
          staffData.role = designation || department || 'NURSE';
        }
        if (facilityId !== undefined) staffData.facilityId = facilityId;

        await prisma.staff.upsert({
          where: { userId: user.id },
          create: {
            userId: user.id,
            name: user.name,
            phone: user.phone,
            email: user.email,
            facilityId: staffData.facilityId || null,
            role: staffData.role || 'NURSE',
            ...staffData,
          },
          update: staffData,
        });
      }

      // 3. Fetch full updated profile
      const fullUser = await prisma.user.findUnique({
        where: { id: user.id },
        include: {
          patient: {
            include: {
              conditions: true,
              allergies: true,
              vitals: { orderBy: { recordedAt: 'desc' }, take: 1 },
            },
          },
          doctor: { include: { facility: true } },
          staff: { include: { facility: true } },
        },
      });

      if (fullUser) {
        updatedUser = {
          id: fullUser.id,
          name: fullUser.name,
          phone: fullUser.phone,
          email: fullUser.email,
          role: fullUser.role,
          patient: fullUser.patient,
          doctor: fullUser.doctor,
          staff: fullUser.staff,
          patientId: fullUser.patient?.id,
          doctorId: fullUser.doctor?.id,
          staffId: fullUser.staff?.id,
          facilityId: fullUser.doctor?.facilityId || fullUser.staff?.facilityId || undefined,
          facilityName: fullUser.doctor?.facility?.name || fullUser.staff?.facility?.name,
          specialty: fullUser.doctor?.specialty,
        };
      }
    } catch (dbErr) {
      console.warn('DB update failed, using in-memory demo update fallback:', dbErr);
    }

    // Fallback in-memory update for demo accounts
    if (!updatedUser) {
      const demoAccount = DEMO_ACCOUNTS.find(a => a.userId === req.user?.userId || a.phone === req.user?.phone);
      if (demoAccount) {
        if (name) demoAccount.name = name.trim();
        if (phone) demoAccount.phone = phone.trim();
        if (email) demoAccount.email = email.trim();
        if (specialty) (demoAccount as any).specialty = specialty;
      }

      updatedUser = {
        id: req.user.userId,
        name: name || req.user.name,
        phone: phone || req.user.phone,
        email: email || req.user.email,
        role: req.user.role,
        patientId: req.user.patientId,
        doctorId: req.user.doctorId,
        staffId: req.user.staffId,
        facilityId: facilityId || req.user.facilityId,
        specialty: specialty || (req.user as any).specialty,
        patient: {
          id: req.user.patientId,
          name: name || req.user.name,
          age: age ? parseInt(String(age), 10) : 28,
          gender: gender || 'Male',
          bloodGroup: bloodGroup || 'B+',
          district: district || 'Central Delhi',
          state: state || 'Delhi',
          village: village || address || 'Connaught Place',
          emergencyContactName,
          emergencyContactPhone,
          allergies: Array.isArray(allergies) ? allergies.map(a => ({ allergen: typeof a === 'string' ? a : a?.allergen })) : [],
          conditions: Array.isArray(conditions) ? conditions.map(c => ({ name: typeof c === 'string' ? c : c?.name })) : [],
        },
      };
    }

    // Create fresh JWT token
    const tokenPayload = {
      userId: updatedUser.id,
      name: updatedUser.name,
      role: updatedUser.role,
      phone: updatedUser.phone,
      email: updatedUser.email,
      patientId: updatedUser.patientId,
      doctorId: updatedUser.doctorId,
      staffId: updatedUser.staffId,
      facilityId: updatedUser.facilityId,
    };
    const newToken = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      message: 'Profile updated successfully',
      token: newToken,
      user: updatedUser,
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ error: 'Failed to update user profile' });
  }
});

// ============================================================
// 2. Facilities & Core Reference Data
// ============================================================

// 15 Major Delhi Government Hospitals Master Dataset
const DELHI_GOVERNMENT_HOSPITALS = [
  {
    id: "hosp-aiims-delhi",
    name: "AIIMS New Delhi",
    type: "Tertiary",
    district: "South Delhi",
    state: "Delhi",
    location: "Sri Aurobindo Marg, Ansari Nagar, New Delhi 110029",
    phone: "011-26588500",
    lat: 28.5672,
    lng: 77.2100,
    totalBeds: 2478,
    availableBeds: 186,
    icuBeds: 250,
    availableIcu: 18,
    specialties: "Cardiology,Neurology,Oncology,Trauma,Nephrology,Gastroenterology,Pulmonology",
  },
  {
    id: "hosp-safdarjung-delhi",
    name: "Safdarjung Hospital & VMMC",
    type: "Tertiary",
    district: "South Delhi",
    state: "Delhi",
    location: "Ring Road, Opposite AIIMS, New Delhi 110029",
    phone: "011-26707444",
    lat: 28.5684,
    lng: 77.2066,
    totalBeds: 1531,
    availableBeds: 92,
    icuBeds: 150,
    availableIcu: 9,
    specialties: "Burns,Orthopaedics,General Surgery,Paediatrics,Pulmonary Medicine,Emergency",
  },
  {
    id: "hosp-ggh-delhi",
    name: "Government General Hospital — Delhi",
    type: "Government",
    district: "Central Delhi",
    state: "Delhi",
    location: "Civil Lines, Rajpur Road, Delhi 110054",
    phone: "011-23955000",
    lat: 28.6750,
    lng: 77.2250,
    totalBeds: 680,
    availableBeds: 84,
    icuBeds: 60,
    availableIcu: 8,
    specialties: "General Medicine,Cardiology,Paediatrics,Orthopaedics,Emergency",
  },
  {
    id: "hosp-lnjp-delhi",
    name: "Lok Nayak Hospital (LNJP)",
    type: "Government",
    district: "Central Delhi",
    state: "Delhi",
    location: "Jawaharlal Nehru Marg, Delhi Gate, New Delhi 110002",
    phone: "011-23236000",
    lat: 28.6369,
    lng: 77.2410,
    totalBeds: 2000,
    availableBeds: 145,
    icuBeds: 180,
    availableIcu: 14,
    specialties: "Infectious Diseases,Trauma,General Medicine,Neonatology,Surgery,Orthopaedics",
  },
  {
    id: "hosp-rml-delhi",
    name: "Dr. Ram Manohar Lohia Hospital (RML)",
    type: "Tertiary",
    district: "New Delhi",
    state: "Delhi",
    location: "Baba Kharak Singh Marg, Connaught Place, New Delhi 110001",
    phone: "011-23365525",
    lat: 28.6258,
    lng: 77.2016,
    totalBeds: 1420,
    availableBeds: 110,
    icuBeds: 120,
    availableIcu: 11,
    specialties: "Cardiology,Critical Care,Neurology,Toxicology,General Medicine,Emergency",
  },
  {
    id: "hosp-gtb-delhi",
    name: "Guru Teg Bahadur Hospital (GTB)",
    type: "Government",
    district: "East Delhi",
    state: "Delhi",
    location: "Tahirpur Road, Dilshad Garden, Shahdara, Delhi 110095",
    phone: "011-22586262",
    lat: 28.6835,
    lng: 77.3094,
    totalBeds: 1700,
    availableBeds: 130,
    icuBeds: 140,
    availableIcu: 12,
    specialties: "Trauma,Orthopaedics,Neurosurgery,Paediatrics,General Medicine,Emergency",
  },
  {
    id: "hosp-gbpant-delhi",
    name: "Govind Ballabh Pant Hospital (G.B. Pant)",
    type: "Specialized",
    district: "Central Delhi",
    state: "Delhi",
    location: "1, Jawaharlal Nehru Marg, Raj Ghat, New Delhi 110002",
    phone: "011-23234242",
    lat: 28.6385,
    lng: 77.2398,
    totalBeds: 750,
    availableBeds: 62,
    icuBeds: 90,
    availableIcu: 8,
    specialties: "Cardiology,Neurology,Gastroenterology,GI Surgery,Cardiothoracic Surgery",
  },
  {
    id: "hosp-ddu-delhi",
    name: "Deen Dayal Upadhyay Hospital (DDU)",
    type: "District",
    district: "West Delhi",
    state: "Delhi",
    location: "Clock Tower, Hari Nagar, New Delhi 110064",
    phone: "011-25494401",
    lat: 28.6276,
    lng: 77.1054,
    totalBeds: 640,
    availableBeds: 54,
    icuBeds: 50,
    availableIcu: 6,
    specialties: "Emergency Care,General Surgery,Orthopaedics,Obstetrics & Gynaecology,Paediatrics",
  },
  {
    id: "hosp-sskh-delhi",
    name: "Lady Hardinge & Sucheta Kriplani Hospital",
    type: "Government",
    district: "New Delhi",
    state: "Delhi",
    location: "Shaheed Bhagat Singh Marg, Connaught Place, New Delhi 110001",
    phone: "011-23363728",
    lat: 28.6329,
    lng: 77.2144,
    totalBeds: 877,
    availableBeds: 78,
    icuBeds: 70,
    availableIcu: 7,
    specialties: "Obstetrics & Gynaecology,Paediatrics,Neonatology,General Medicine,Surgery",
  },
  {
    id: "hosp-sgm-delhi",
    name: "Sanjay Gandhi Memorial Hospital",
    type: "District",
    district: "North West Delhi",
    state: "Delhi",
    location: "S-Block, Mangolpuri, New Delhi 110083",
    phone: "011-27900100",
    lat: 28.6946,
    lng: 77.0864,
    totalBeds: 300,
    availableBeds: 38,
    icuBeds: 30,
    availableIcu: 4,
    specialties: "Trauma,Emergency,General Medicine,Paediatrics,Orthopaedics",
  },
  {
    id: "hosp-bsa-delhi",
    name: "Dr. Baba Saheb Ambedkar Hospital",
    type: "Government",
    district: "North West Delhi",
    state: "Delhi",
    location: "Sector 6, Rohini, New Delhi 110085",
    phone: "011-27055585",
    lat: 28.7118,
    lng: 77.1166,
    totalBeds: 500,
    availableBeds: 48,
    icuBeds: 45,
    availableIcu: 5,
    specialties: "General Surgery,Dialysis,Cardiology,Orthopaedics,Emergency,Paediatrics",
  },
  {
    id: "hosp-asb-delhi",
    name: "Acharya Shree Bhikshu Government Hospital",
    type: "District",
    district: "West Delhi",
    state: "Delhi",
    location: "Moti Nagar, New Delhi 110015",
    phone: "011-25458000",
    lat: 28.6565,
    lng: 77.1432,
    totalBeds: 150,
    availableBeds: 22,
    icuBeds: 15,
    availableIcu: 3,
    specialties: "General Medicine,Paediatrics,ENT,Ophthalmology,Emergency",
  },
  {
    id: "hosp-lbs-delhi",
    name: "Lal Bahadur Shastri Hospital (LBS)",
    type: "District",
    district: "East Delhi",
    state: "Delhi",
    location: "Khichripur, Mayur Vihar Phase 2, Delhi 110091",
    phone: "011-22774145",
    lat: 28.6186,
    lng: 77.3075,
    totalBeds: 300,
    availableBeds: 35,
    icuBeds: 25,
    availableIcu: 4,
    specialties: "Emergency Medicine,Orthopaedics,Paediatrics,General Surgery,General Medicine",
  },
  {
    id: "hosp-valmiki-delhi",
    name: "Maharishi Valmiki Hospital",
    type: "District",
    district: "North Delhi",
    state: "Delhi",
    location: "Pooth Khurd, Bawana Road, Delhi 110039",
    phone: "011-27761521",
    lat: 28.7845,
    lng: 77.0628,
    totalBeds: 150,
    availableBeds: 28,
    icuBeds: 15,
    availableIcu: 2,
    specialties: "General Medicine,Maternal & Child Health,Emergency,Surgery",
  },
  {
    id: "hosp-cnbc-delhi",
    name: "Chacha Nehru Bal Chikitsalaya (CNBC)",
    type: "Specialized",
    district: "East Delhi",
    state: "Delhi",
    location: "Geeta Colony, Delhi 110031",
    phone: "011-22026130",
    lat: 28.6542,
    lng: 77.2725,
    totalBeds: 220,
    availableBeds: 30,
    icuBeds: 40,
    availableIcu: 6,
    specialties: "Super-Specialty Paediatrics,Paediatric Surgery,Neonatal ICU,Paediatric Cardiology",
  },
  {
    id: "hosp-rgssh-delhi",
    name: "Rajiv Gandhi Super Speciality Hospital",
    type: "Specialized",
    district: "Shahdara",
    state: "Delhi",
    location: "Tahirpur, Dilshad Garden, Delhi 110093",
    phone: "011-22890600",
    lat: 28.6812,
    lng: 77.3168,
    totalBeds: 650,
    availableBeds: 74,
    icuBeds: 80,
    availableIcu: 10,
    specialties: "Cardiology,Pulmonology,Gastroenterology,Urology,Critical Care,GI Surgery",
  },
];

// Get all hospitals / facilities
app.get(['/api/hospitals', '/api/facilities'], async (req: Request, res: Response) => {
  try {
    const hospitals = await prisma.hospital.findMany({
      include: { doctors: true },
      orderBy: { availableBeds: 'desc' },
    });
    if (hospitals.length > 0) {
      return res.json(hospitals);
    }
    res.json(DELHI_GOVERNMENT_HOSPITALS);
  } catch (error) {
    console.warn('DB lookup for hospitals failed, falling back to 15 Delhi hospitals dataset');
    res.json(DELHI_GOVERNMENT_HOSPITALS);
  }
});

// Get single hospital / facility
app.get(['/api/hospitals/:id', '/api/facilities/:id'], async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const hospital = await prisma.hospital.findUnique({
      where: { id },
      include: { doctors: true, staff: true, referrals: true },
    });
    if (hospital) {
      return res.json(hospital);
    }
    const fallback = DELHI_GOVERNMENT_HOSPITALS.find(h => h.id === id);
    if (fallback) {
      return res.json(fallback);
    }
    res.status(404).json({ error: 'Hospital not found' });
  } catch (error) {
    const fallback = DELHI_GOVERNMENT_HOSPITALS.find(h => h.id === (req.params.id as string));
    if (fallback) {
      return res.json(fallback);
    }
    res.status(500).json({ error: 'Failed to fetch hospital' });
  }
});

// Get all doctors
app.get('/api/doctors', async (req: Request, res: Response) => {
  try {
    const doctors = await prisma.doctor.findMany({
      include: { facility: true },
      orderBy: { name: 'asc' },
    });
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch doctors' });
  }
});

// Create/Update Doctor
app.post('/api/doctors', async (req: Request, res: Response) => {
  try {
    const { name, specialty, phone, email, facilityId, department, licenseNumber, experience } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'Doctor name is required' });
    }

    const hospital = facilityId
      ? await prisma.hospital.findUnique({ where: { id: facilityId } })
      : await prisma.hospital.findFirst();

    const doctor = await prisma.doctor.create({
      data: {
        name,
        specialty: specialty || 'General Medicine',
        phone: phone || null,
        email: email || null,
        department: department || specialty || 'General Medicine',
        licenseNumber: licenseNumber || null,
        experience: experience || null,
        facilityId: hospital?.id || null,
        available: true,
      },
    });
    res.status(201).json(doctor);
  } catch (error) {
    console.error('Error creating doctor:', error);
    res.status(500).json({ error: 'Failed to create doctor' });
  }
});

// ============================================================
// 3. Patient Management & Search (Registry)
// ============================================================

// List patients with query search and filters
app.get('/api/patients', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const { search, riskLevel, district, gender, condition } = req.query;

    const whereClause: any = {};

    if (search && typeof search === 'string') {
      const q = search.trim();
      whereClause.OR = [
        { name: { contains: q, mode: 'insensitive' } },
        { mrn: { contains: q, mode: 'insensitive' } },
        { abhaId: { contains: q, mode: 'insensitive' } },
        { phone: { contains: q, mode: 'insensitive' } },
        { village: { contains: q, mode: 'insensitive' } },
        { district: { contains: q, mode: 'insensitive' } },
      ];
    }

    if (riskLevel && typeof riskLevel === 'string') {
      whereClause.riskLevel = riskLevel;
    }

    if (district && typeof district === 'string') {
      whereClause.district = district;
    }

    if (gender && typeof gender === 'string') {
      whereClause.gender = gender;
    }

    if (condition && typeof condition === 'string') {
      whereClause.conditions = {
        some: {
          name: { contains: condition, mode: 'insensitive' },
        },
      };
    }

    const patients = await prisma.patient.findMany({
      where: whereClause,
      include: {
        conditions: true,
        allergies: true,
        vitals: {
          orderBy: { recordedAt: 'desc' },
          take: 1,
        },
        encounters: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
        appointments: {
          where: {
            status: { in: ['CONFIRMED', 'REQUESTED', 'CHECKED_IN'] },
          },
          orderBy: { dateTime: 'asc' },
          take: 1,
        },
      },
      orderBy: { updatedAt: 'desc' },
    });

    res.json(patients);
  } catch (error) {
    console.error('Error fetching patients:', error);
    res.status(500).json({ error: 'Failed to fetch patients' });
  }
});

// Get Patient 360° Profile (Complete relational record)
app.get('/api/patients/:id', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const id = req.params.id as string;
    const patient = await prisma.patient.findUnique({
      where: { id },
      include: {
        conditions: { orderBy: { createdAt: 'desc' } },
        allergies: true,
        medications: {
          include: { prescribingDoctor: true },
          orderBy: { createdAt: 'desc' },
        },
        vitals: { orderBy: { recordedAt: 'desc' } },
        encounters: {
          include: {
            doctor: true,
            vitals: true,
            prescriptions: { include: { items: true } },
            labOrders: true,
          },
          orderBy: { createdAt: 'desc' },
        },
        prescriptions: {
          include: {
            doctor: true,
            items: true,
          },
          orderBy: { createdAt: 'desc' },
        },
        labReports: {
          include: { orderingDoctor: true },
          orderBy: { createdAt: 'desc' },
        },
        documents: { orderBy: { uploadDate: 'desc' } },
        insurance: { orderBy: { createdAt: 'desc' } },
        appointments: {
          include: { doctor: true },
          orderBy: { dateTime: 'desc' },
        },
        referralsOut: {
          include: { toHospital: true },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' });
    }

    res.json(patient);
  } catch (error) {
    console.error('Error fetching patient 360:', error);
    res.status(500).json({ error: 'Failed to fetch patient profile' });
  }
});

function pickPatientFields(data: any) {
  const age = Number(data.age);
  return {
    name: String(data.name || '').trim(),
    age: Number.isFinite(age) && age > 0 ? Math.round(age) : 30,
    gender: data.gender || 'Other',
    bloodGroup: data.bloodGroup || null,
    phone: data.phone || null,
    email: data.email || null,
    dateOfBirth: data.dateOfBirth || null,
    address: data.address || null,
    village: data.village || null,
    city: data.city || data.district || null,
    district: data.district || 'New Delhi',
    state: data.state || 'Delhi',
    pincode: data.pincode || null,
    emergencyContactName: data.emergencyContactName || null,
    emergencyContactPhone: data.emergencyContactPhone || null,
    emergencyContactRelation: data.emergencyContactRelation || null,
    riskLevel: data.riskLevel || 'LOW',
    incomeCategory: data.incomeCategory || null,
  };
}

// Create new patient (used by Staff Registration flow)
app.post('/api/patients', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const data = pickPatientFields(req.body);
    if (!data.name) {
      return res.status(400).json({ error: 'Patient name is required' });
    }

    if (data.phone) {
      const existing = await prisma.patient.findFirst({ where: { phone: data.phone } });
      if (existing) {
        return res.json(existing);
      }
    }

    const count = await prisma.patient.count();
    const mrn = req.body.mrn || `MRN-2026-${String(count + 1).padStart(4, '0')}`;

    const newPatient = await prisma.patient.create({
      data: {
        ...data,
        mrn,
      },
    });

    res.status(201).json(newPatient);
  } catch (error) {
    console.error('Error creating patient:', error);
    res.status(500).json({ error: 'Failed to create patient' });
  }
});

// Update patient
app.put('/api/patients/:id', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const id = req.params.id as string;
    const data = req.body;
    const updated = await prisma.patient.update({
      where: { id },
      data,
    });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update patient' });
  }
});

// ============================================================
// 4. Clinical Encounters & AI Risk Scoring
// ============================================================

// Get encounters for a patient
app.get('/api/patients/:id/encounters', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const id = req.params.id as string;
    const encounters = await prisma.encounter.findMany({
      where: { patientId: id },
      include: {
        doctor: true,
        vitals: true,
        prescriptions: { include: { items: true } },
        labOrders: true,
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json(encounters);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch encounters' });
  }
});

// Create full encounter with optional vitals & prescription
app.post('/api/patients/:id/encounters', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const patientId = req.params.id as string;
    const {
      doctorId,
      appointmentId,
      chiefComplaint,
      symptoms,
      onset,
      severity,
      hpiNotes,
      diagnosis,
      diagnosisIcdCode,
      secondaryDiagnoses,
      clinicalNotes,
      treatmentPlan,
      riskScore,
      urgency,
      riskFactors,
      suggestedDepartment,
      followUpDate,
      vitals,
      prescriptionItems,
      labOrders,
    } = req.body;

    const result = await prisma.$transaction(async (tx) => {
      const encounter = await tx.encounter.create({
        data: {
          patientId,
          doctorId,
          appointmentId,
          chiefComplaint,
          symptoms: typeof symptoms === 'object' ? JSON.stringify(symptoms) : symptoms,
          onset,
          severity,
          hpiNotes,
          diagnosis,
          diagnosisIcdCode,
          secondaryDiagnoses: typeof secondaryDiagnoses === 'object' ? JSON.stringify(secondaryDiagnoses) : secondaryDiagnoses,
          clinicalNotes,
          treatmentPlan,
          riskScore,
          urgency,
          riskFactors: typeof riskFactors === 'object' ? JSON.stringify(riskFactors) : riskFactors,
          suggestedDepartment,
          followUpDate,
          status: 'COMPLETED',
        },
      });

      // Update patient risk level if provided
      if (urgency) {
        await tx.patient.update({
          where: { id: patientId },
          data: { riskLevel: urgency },
        });
      }

      // Save vitals if attached
      if (vitals && Object.keys(vitals).length > 0) {
        let bmi: number | undefined = undefined;
        if (vitals.height && vitals.weight) {
          const heightM = vitals.height / 100;
          bmi = parseFloat((vitals.weight / (heightM * heightM)).toFixed(1));
        }

        await tx.vital.create({
          data: {
            patientId,
            encounterId: encounter.id,
            temperature: vitals.temperature,
            bpSystolic: vitals.bpSystolic,
            bpDiastolic: vitals.bpDiastolic,
            heartRate: vitals.heartRate || vitals.pulse,
            respiratoryRate: vitals.respiratoryRate,
            spO2: vitals.spO2,
            height: vitals.height,
            weight: vitals.weight,
            bmi,
          },
        });
      }

      // Save Prescription if items exist
      if (prescriptionItems && Array.isArray(prescriptionItems) && prescriptionItems.length > 0) {
        await tx.prescription.create({
          data: {
            patientId,
            doctorId,
            encounterId: encounter.id,
            date: new Date().toISOString().split('T')[0],
            notes: treatmentPlan,
            items: {
              create: prescriptionItems.map((item: any) => ({
                medicationName: item.medicationName,
                dosage: item.dosage,
                frequency: item.frequency,
                duration: item.duration || '7 days',
                instructions: item.instructions,
              })),
            },
          },
        });

        // Also add active medications
        for (const item of prescriptionItems) {
          await tx.medication.create({
            data: {
              patientId,
              prescribingDoctorId: doctorId,
              name: item.medicationName,
              dosage: item.dosage,
              frequency: item.frequency,
              startDate: new Date().toISOString().split('T')[0],
              status: 'ACTIVE',
              notes: item.instructions,
            },
          });
        }
      }

      // Save Lab Orders if selected
      if (labOrders && Array.isArray(labOrders) && labOrders.length > 0) {
        for (const testName of labOrders) {
          await tx.labReport.create({
            data: {
              patientId,
              encounterId: encounter.id,
              orderingDoctorId: doctorId,
              testName,
              category: 'BIOCHEMISTRY',
              status: 'ORDERED',
            },
          });
        }
      }

      // Update appointment status if linked
      if (appointmentId) {
        await tx.appointment.update({
          where: { id: appointmentId },
          data: { status: 'COMPLETED' },
        });
      }
      
      return encounter;
    });

    res.status(201).json(result);
  } catch (error) {
    console.error('Error creating encounter:', error);
    res.status(500).json({ error: 'Failed to create clinical encounter' });
  }
});

// ============================================================
// 5. Appointments & Referrals
// ============================================================

// Appointments List
app.get('/api/appointments', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const { doctorId, patientId, status, date } = req.query;
    const where: any = {};
    if (doctorId && typeof doctorId === 'string') where.doctorId = doctorId;
    if (patientId && typeof patientId === 'string') where.patientId = patientId;
    if (status && typeof status === 'string') where.status = status;
    if (date && typeof date === 'string') {
      where.dateTime = { startsWith: date };
    }

    const appointments = await prisma.appointment.findMany({
      where,
      include: {
        patient: true,
        doctor: {
          include: {
            facility: true,
          },
        },
      },
      orderBy: { dateTime: 'asc' },
    });
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch appointments' });
  }
});

// Book Appointment
app.post('/api/appointments', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    let { patientId, doctorId, dateTime, status, visitType, reason, notes, patientName, phone, specialty } = req.body;

    let patient = patientId
      ? await prisma.patient.findUnique({ where: { id: patientId } })
      : null;

    if (!patient && phone) {
      patient = await prisma.patient.findFirst({ where: { phone: String(phone) } });
    }

    if (!patient && (patientName || phone)) {
      const count = await prisma.patient.count();
      patient = await prisma.patient.create({
        data: {
          mrn: `MRN-2026-${String(count + 1).padStart(4, '0')}`,
          name: patientName || 'Walk-in Patient',
          age: 30,
          gender: 'Other',
          phone: phone || null,
          district: 'New Delhi',
          state: 'Delhi',
        },
      });
    }

    if (!patient) {
      return res.status(400).json({ error: 'A registered patient is required to book an appointment' });
    }

    let doctor = doctorId
      ? await prisma.doctor.findUnique({ where: { id: doctorId } })
      : null;

    if (!doctor && specialty) {
      doctor = await prisma.doctor.findFirst({
        where: { specialty: { contains: String(specialty), mode: 'insensitive' } },
      });
    }

    if (!doctor) {
      doctor = await prisma.doctor.findFirst();
    }

    if (!doctor) {
      return res.status(400).json({ error: 'No clinician is available for booking' });
    }

    const appt = await prisma.appointment.create({
      data: {
        patientId: patient.id,
        doctorId: doctor.id,
        dateTime: dateTime || new Date(Date.now() + 86400000).toISOString(),
        status: status || 'CONFIRMED',
        visitType: visitType || 'NEW',
        reason: reason || null,
        notes: notes || null,
      },
      include: { patient: true, doctor: true },
    });
    // Auto-create notifications for appointment
    try {
      await prisma.notification.createMany({
        data: [
          {
            userId: appt.patient?.userId || null,
            role: 'PATIENT',
            category: 'APPOINTMENT',
            title: 'Appointment Confirmed',
            message: `Your appointment with ${appt.doctor?.name || 'your doctor'} has been scheduled.`,
            link: '/scheduling',
            urgency: 'NORMAL',
          },
          {
            userId: appt.doctor?.userId || null,
            role: 'DOCTOR',
            category: 'APPOINTMENT',
            title: 'New Appointment Scheduled',
            message: `New appointment with patient ${appt.patient?.name || 'a patient'}.`,
            link: '/scheduling',
            urgency: 'NORMAL',
          },
          {
            role: 'HOSPITAL_STAFF',
            category: 'APPOINTMENT',
            title: 'Appointment Scheduled',
            message: `${appt.patient?.name || 'A patient'} has an appointment with ${appt.doctor?.name || 'a doctor'}.`,
            link: '/scheduling',
            urgency: 'NORMAL',
          },
        ],
      });
    } catch (notifErr) {
      console.warn('Failed to create appointment notifications:', notifErr);
    }
    res.status(201).json(appt);
  } catch (error) {
    console.error('Error creating appointment:', error);
    res.status(500).json({ error: 'Failed to create appointment' });
  }
});

app.put('/api/appointments/:id', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const id = req.params.id as string;
    const appt = await prisma.appointment.update({
      where: { id },
      data: req.body,
    });
    res.json(appt);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update appointment' });
  }
});

// Referrals
app.get('/api/referrals', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const referrals = await prisma.referral.findMany({
      include: {
        patient: true,
        toHospital: true,
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json(referrals);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch referrals' });
  }
});

app.post('/api/referrals', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const referral = await prisma.referral.create({
      data: req.body,
    });
    res.status(201).json(referral);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create referral' });
  }
});

// ============================================================
// 6. Emergency 108 SOS System (Persistent)
// ============================================================

app.post('/api/emergency', async (req: Request, res: Response) => {
  try {
    const { phone, location, emergencyType, patientName, age, gender, notes } = req.body;

    if (!phone || !location) {
      return res.status(400).json({ error: 'Phone number and location are required for emergency dispatch' });
    }

    const hospitals = await prisma.hospital.findMany({ take: 3 });
    const assignedHospital = hospitals[0];

    const emergencyRequest = await prisma.emergencyRequest.create({
      data: {
        phone: String(phone).trim(),
        location: String(location).trim(),
        emergencyType: emergencyType || 'GENERAL',
        patientName: patientName || 'Emergency Patient',
        age: age ? Number(age) : null,
        gender: gender || null,
        assignedHospitalId: assignedHospital?.id || null,
        assignedHospitalName: assignedHospital?.name || 'Nearest Government Hospital',
        ambulanceId: `108-AMB-${Math.floor(1000 + Math.random() * 9000)}`,
        status: 'DISPATCHED',
        etaMinutes: 7,
        notes: notes || null,
      },
    });

    res.status(201).json(emergencyRequest);
  } catch (error) {
    console.error('Error logging emergency SOS:', error);
    res.status(500).json({ error: 'Failed to dispatch emergency request' });
  }
});

app.get('/api/emergency', async (req: Request, res: Response) => {
  try {
    const requests = await prisma.emergencyRequest.findMany({
      orderBy: { createdAt: 'desc' },
      take: 20,
    });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch emergency records' });
  }
});

// ============================================================
// 7. Government Health Schemes
// ============================================================

app.get('/api/schemes', async (req: Request, res: Response) => {
  try {
    const dbSchemes = await prisma.governmentScheme.findMany();
    if (dbSchemes.length > 0) {
      return res.json(dbSchemes);
    }
  } catch {}

  const schemes = [
    {
      id: 'sch-pmjay',
      schemeName: 'Ayushman Bharat PM-JAY (National Health Cover)',
      category: 'NATIONAL',
      description: 'World’s largest government-funded healthcare assurance scheme offering secondary and tertiary hospitalization.',
      eligibility: 'BPL / EWS families, unorganized sector workers, and occupational deprivation criteria under SECC.',
      coverageAmount: '₹5,00,000 per family / year',
      officialLink: 'https://pmjay.gov.in',
      stateApplicable: 'ALL',
      minAge: 0,
      maxAge: 120,
    },
    {
      id: 'sch-eshram',
      schemeName: 'e-Shram & PM Shram Yogi Health Shield',
      category: 'UNORGANIZED_WORKER',
      description: 'Comprehensive health coverage and social security for unorganized sector workers, construction laborers, and gig workers.',
      eligibility: 'Unorganized workers aged 18-59 with monthly income < ₹15,000.',
      coverageAmount: '₹2,00,000 accidental cover + cashless hospital network',
      officialLink: 'https://eshram.gov.in',
      stateApplicable: 'ALL',
      minAge: 18,
      maxAge: 59,
    },
    {
      id: 'sch-kisan',
      schemeName: 'PM-KISAN Health & Social Security Cover',
      category: 'FARMER',
      description: 'Subsidized rural healthcare insurance, emergency care, and income support for agricultural workers and farmers.',
      eligibility: 'Small and marginal farmers / agricultural laborers owning cultivable land.',
      coverageAmount: '₹3,00,000 rural health coverage & diagnostic subsidies',
      officialLink: 'https://pmkisan.gov.in',
      stateApplicable: 'ALL',
      minAge: 18,
      maxAge: 75,
    },
    {
      id: 'sch-cghs',
      schemeName: 'Central Government Health Scheme (CGHS)',
      category: 'GOVERNMENT',
      description: 'Comprehensive OPD and IPD healthcare coverage for serving and retired government employees and their dependents.',
      eligibility: 'Central / State government employees and official pensioners.',
      coverageAmount: '100% cashless hospitalization & free specialist consultations',
      officialLink: 'https://cghs.nic.in',
      stateApplicable: 'ALL',
      minAge: 0,
      maxAge: 120,
    },
    {
      id: 'sch-esic',
      schemeName: 'Employees’ State Insurance Scheme (ESIC)',
      category: 'SALARIED',
      description: 'Integrated social security and medical care for organized sector employees and their families.',
      eligibility: 'Organized sector salaried workers with monthly wage up to ₹21,000.',
      coverageAmount: 'Full medical care for self & dependents with sickness cash benefits',
      officialLink: 'https://esic.gov.in',
      stateApplicable: 'ALL',
      minAge: 18,
      maxAge: 65,
    },
    {
      id: 'sch-pmmvy',
      schemeName: 'Pradhan Mantri Matru Vandana Yojana (PMMVY & JSY)',
      category: 'MATERNAL',
      description: 'Maternal health benefit, institutional delivery incentives, and free antenatal diagnostics.',
      eligibility: 'Pregnant women and lactating mothers.',
      coverageAmount: '₹6,000 cash benefit + 100% free delivery and neonatal care',
      officialLink: 'https://pmmvy.wcd.gov.in',
      stateApplicable: 'ALL',
      minAge: 18,
      maxAge: 50,
    },
    {
      id: 'sch-nphce',
      schemeName: 'National Programme for Health Care of Elderly (NPHCE)',
      category: 'SENIOR',
      description: 'Dedicated geriatric OPD, chronic disease care, free assistive devices, and home-based care.',
      eligibility: 'Senior citizens aged 60 years and above.',
      coverageAmount: 'Free geriatric consultations & assistive living devices',
      officialLink: 'https://main.mohfw.gov.in',
      stateApplicable: 'ALL',
      minAge: 60,
      maxAge: 120,
    },
    {
      id: 'sch-niramaya',
      schemeName: 'Niramaya Health Insurance for Persons with Disability',
      category: 'DISABILITY',
      description: 'Affordable health insurance cover for persons with autism, cerebral palsy, mental retardation, and multiple disabilities.',
      eligibility: 'Citizens with certified disabilities (UDID Card).',
      coverageAmount: '₹1,00,000 per annum (includes OPD, therapy, surgery)',
      officialLink: 'https://thenationaltrust.gov.in',
      stateApplicable: 'ALL',
      minAge: 0,
      maxAge: 120,
    },
    {
      id: 'sch-dak',
      schemeName: 'Delhi Arogya Kosh & Mohalla Health Clinic',
      category: 'STATE',
      description: 'Free high-end private radiodiagnostics (MRI, CT, PET Scan) and cashless surgery for Delhi residents.',
      eligibility: 'Delhi/NCR residents with annual family income < ₹3,00,000 or universal Mohalla Clinic access.',
      coverageAmount: '₹5,00,000 cashless diagnostics & specialized surgeries',
      officialLink: 'https://delhi.gov.in',
      stateApplicable: 'Delhi',
      minAge: 0,
      maxAge: 120,
    },
  ];
  res.json(schemes);
});

// ============================================================
// 8. Messaging, Notifications & Stats
// ============================================================

app.get('/api/messages', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const { threadId, userId } = req.query;
    const where: any = {};

    if (threadId && typeof threadId === 'string') {
      where.threadId = threadId;
    } else if (userId && typeof userId === 'string') {
      where.OR = [{ senderId: userId }, { recipientId: userId }];
    }

    const messages = await prisma.message.findMany({
      where,
      orderBy: { createdAt: 'asc' },
    });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

app.post('/api/messages', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const data = req.body;
    const message = await prisma.message.create({
      data: {
        ...data,
        attachmentData: typeof data.attachmentData === 'object' ? JSON.stringify(data.attachmentData) : data.attachmentData,
      },
    });
    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ error: 'Failed to send message' });
  }
});

app.get('/api/notifications', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const { role, userId, unreadOnly } = req.query;
    const where: any = {};

    if (role && typeof role === 'string') {
      where.OR = [{ role }, { role: 'ALL' }];
    }
    if (userId && typeof userId === 'string') {
      where.userId = userId;
    }
    if (unreadOnly === 'true') {
      where.read = false;
    }

    const notifications = await prisma.notification.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
});

app.post('/api/notifications', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const notification = await prisma.notification.create({
      data: req.body,
    });
    res.status(201).json(notification);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create notification' });
  }
});

app.get('/api/stats', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const totalPatients = await prisma.patient.count();
    const emergencyPatients = await prisma.patient.count({ where: { riskLevel: 'EMERGENCY' } });
    const highRiskPatients = await prisma.patient.count({ where: { riskLevel: 'HIGH' } });
    const totalEncounters = await prisma.encounter.count();
    const totalAppointments = await prisma.appointment.count();
    const pendingReferrals = await prisma.referral.count({ where: { status: 'PENDING' } });
    const hospitals = await prisma.hospital.findMany();

    const totalICUAvailable = hospitals.reduce((acc, h) => acc + h.availableIcu, 0);
    const totalBedsAvailable = hospitals.reduce((acc, h) => acc + h.availableBeds, 0);

    res.json({
      totalPatients,
      emergencyPatients,
      highRiskPatients,
      totalEncounters,
      totalAppointments,
      pendingReferrals,
      totalFacilities: hospitals.length,
      totalICUAvailable,
      totalBedsAvailable,
      totalGeneralAvailable: totalBedsAvailable,
      totalPrivateRoomsAvailable: 24,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

app.put('/api/notifications/:id/read', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const id = String(req.params.id);
    const { read } = req.body;
    const notification = await prisma.notification.update({
      where: { id },
      data: { read: read !== undefined ? read : true },
    });
    res.json(notification);
  } catch (err) {
    console.error('Failed to update notification read status:', err);
    res.status(500).json({ error: 'Failed to update notification' });
  }
});

app.put('/api/notifications/read-all', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    const role = req.user?.role;
    await prisma.notification.updateMany({
      where: {
        OR: [
          { userId: userId },
          { role: role },
          { role: 'ALL' },
        ],
        read: false,
      },
      data: { read: true },
    });
    res.json({ success: true, message: 'All notifications marked as read' });
  } catch (err) {
    console.error('Failed to mark all notifications read:', err);
    res.status(500).json({ error: 'Failed to update notifications' });
  }
});

app.put('/api/referrals/:id', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const id = String(req.params.id);
    const referral = await prisma.referral.update({
      where: { id },
      data: req.body,
      include: { patient: true, toHospital: true },
    });
    res.json(referral);
  } catch (err) {
    console.error('Failed to update referral:', err);
    res.status(500).json({ error: 'Failed to update referral' });
  }
});

app.put('/api/hospitals/:id', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const id = String(req.params.id);
    const hospital = await prisma.hospital.update({
      where: { id },
      data: req.body,
    });
    res.json(hospital);
  } catch (err) {
    console.error('Failed to update hospital:', err);
    res.status(500).json({ error: 'Failed to update hospital' });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Sehat Saathi Backend running on port ${PORT}`);
});
