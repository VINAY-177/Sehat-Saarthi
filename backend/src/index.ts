import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// ============================================================
// 1. Core / Reference Data
// ============================================================

// Get all hospitals
app.get('/api/hospitals', async (req, res) => {
  try {
    const hospitals = await prisma.hospital.findMany({
      include: { doctors: true },
    });
    res.json(hospitals);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch hospitals' });
  }
});

// Get all government schemes
app.get('/api/schemes', async (req, res) => {
  try {
    const schemes = await prisma.governmentScheme.findMany();
    res.json(schemes);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch government schemes' });
  }
});

// Get all doctors
app.get('/api/doctors', async (req, res) => {
  try {
    const doctors = await prisma.doctor.findMany({
      include: { facility: true },
    });
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch doctors' });
  }
});

app.post('/api/doctors', async (req, res) => {
  try {
    const { name, specialty, phone, email, facilityId, department, licenseNumber, experience } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }

    if (phone || email) {
      const existing = await prisma.doctor.findFirst({
        where: {
          OR: [
            ...(phone ? [{ phone }] : []),
            ...(email ? [{ email }] : []),
          ],
        },
      });
      if (existing) {
        return res.json(existing);
      }
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
// 2. Patient Management & Search (Registry)
// ============================================================

// List patients with query search and filters
app.get('/api/patients', async (req, res) => {
  try {
    const { search, riskLevel, district, gender, condition } = req.query;

    const whereClause: any = {};

    if (search && typeof search === 'string') {
      const q = search.trim();
      whereClause.OR = [
        { name: { contains: q } },
        { mrn: { contains: q } },
        { abhaId: { contains: q } },
        { phone: { contains: q } },
        { village: { contains: q } },
        { district: { contains: q } },
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
          name: { contains: condition },
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
app.get('/api/patients/:id', async (req, res) => {
  try {
    const { id } = req.params;
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

// Create new patient (also used when staff intake or citizen signup)
app.post('/api/patients', async (req, res) => {
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
app.put('/api/patients/:id', async (req, res) => {
  try {
    const { id } = req.params;
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
// 3. Clinical Encounters & AI Risk Scoring
// ============================================================

// Get encounters for a patient
app.get('/api/patients/:id/encounters', async (req, res) => {
  try {
    const { id } = req.params;
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
app.post('/api/patients/:id/encounters', async (req, res) => {
  try {
    const { id: patientId } = req.params;
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

    const encounter = await prisma.encounter.create({
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
      await prisma.patient.update({
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

      await prisma.vital.create({
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
      await prisma.prescription.create({
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
        await prisma.medication.create({
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
        await prisma.labReport.create({
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
      await prisma.appointment.update({
        where: { id: appointmentId },
        data: { status: 'COMPLETED' },
      });
    }

    res.status(201).json(encounter);
  } catch (error) {
    console.error('Error creating encounter:', error);
    res.status(500).json({ error: 'Failed to create clinical encounter' });
  }
});

// ============================================================
// 4. Vitals & Medical History Sub-routes
// ============================================================

// Vitals
app.get('/api/patients/:id/vitals', async (req, res) => {
  try {
    const vitals = await prisma.vital.findMany({
      where: { patientId: req.params.id },
      orderBy: { recordedAt: 'desc' },
    });
    res.json(vitals);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch vitals' });
  }
});

app.post('/api/patients/:id/vitals', async (req, res) => {
  try {
    const { id: patientId } = req.params;
    const data = req.body;
    let bmi: number | undefined = undefined;
    if (data.height && data.weight) {
      const heightM = data.height / 100;
      bmi = parseFloat((data.weight / (heightM * heightM)).toFixed(1));
    }

    const vital = await prisma.vital.create({
      data: {
        ...data,
        patientId,
        bmi,
      },
    });
    res.status(201).json(vital);
  } catch (error) {
    res.status(500).json({ error: 'Failed to record vital' });
  }
});

// Conditions
app.get('/api/patients/:id/conditions', async (req, res) => {
  try {
    const conditions = await prisma.medicalCondition.findMany({
      where: { patientId: req.params.id },
      orderBy: { createdAt: 'desc' },
    });
    res.json(conditions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch conditions' });
  }
});

app.post('/api/patients/:id/conditions', async (req, res) => {
  try {
    const condition = await prisma.medicalCondition.create({
      data: {
        ...req.body,
        patientId: req.params.id,
      },
    });
    res.status(201).json(condition);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add condition' });
  }
});

// Allergies
app.get('/api/patients/:id/allergies', async (req, res) => {
  try {
    const allergies = await prisma.allergy.findMany({
      where: { patientId: req.params.id },
    });
    res.json(allergies);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch allergies' });
  }
});

app.post('/api/patients/:id/allergies', async (req, res) => {
  try {
    const allergy = await prisma.allergy.create({
      data: {
        ...req.body,
        patientId: req.params.id,
      },
    });
    res.status(201).json(allergy);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add allergy' });
  }
});

// Medications
app.get('/api/patients/:id/medications', async (req, res) => {
  try {
    const meds = await prisma.medication.findMany({
      where: { patientId: req.params.id },
      include: { prescribingDoctor: true },
      orderBy: { createdAt: 'desc' },
    });
    res.json(meds);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch medications' });
  }
});

app.post('/api/patients/:id/medications', async (req, res) => {
  try {
    const med = await prisma.medication.create({
      data: {
        ...req.body,
        patientId: req.params.id,
      },
    });
    res.status(201).json(med);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add medication' });
  }
});

// Prescriptions
app.get('/api/patients/:id/prescriptions', async (req, res) => {
  try {
    const rxs = await prisma.prescription.findMany({
      where: { patientId: req.params.id },
      include: {
        doctor: true,
        items: true,
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json(rxs);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch prescriptions' });
  }
});

// Lab Reports
app.get('/api/patients/:id/lab-reports', async (req, res) => {
  try {
    const reports = await prisma.labReport.findMany({
      where: { patientId: req.params.id },
      include: { orderingDoctor: true },
      orderBy: { createdAt: 'desc' },
    });
    res.json(reports);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch lab reports' });
  }
});

app.post('/api/patients/:id/lab-reports', async (req, res) => {
  try {
    const report = await prisma.labReport.create({
      data: {
        ...req.body,
        patientId: req.params.id,
      },
    });
    res.status(201).json(report);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create lab report' });
  }
});

// Insurance
app.get('/api/patients/:id/insurance', async (req, res) => {
  try {
    const insurance = await prisma.insurance.findMany({
      where: { patientId: req.params.id },
      orderBy: { createdAt: 'desc' },
    });
    res.json(insurance);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch insurance' });
  }
});

// ============================================================
// 5. Appointments & Referrals
// ============================================================

// Appointments
app.get('/api/appointments', async (req, res) => {
  try {
    const { doctorId, status, date } = req.query;
    const where: any = {};
    if (doctorId && typeof doctorId === 'string') where.doctorId = doctorId;
    if (status && typeof status === 'string') where.status = status;
    if (date && typeof date === 'string') {
      where.dateTime = { startsWith: date };
    }

    const appointments = await prisma.appointment.findMany({
      where,
      include: {
        patient: true,
        doctor: true,
      },
      orderBy: { dateTime: 'asc' },
    });
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch appointments' });
  }
});

app.post('/api/appointments', async (req, res) => {
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
        where: { specialty: { contains: String(specialty) } },
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
    res.status(201).json(appt);
  } catch (error) {
    console.error('Error creating appointment:', error);
    res.status(500).json({ error: 'Failed to create appointment' });
  }
});

app.put('/api/appointments/:id', async (req, res) => {
  try {
    const appt = await prisma.appointment.update({
      where: { id: req.params.id },
      data: req.body,
    });
    res.json(appt);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update appointment' });
  }
});

// Referrals
app.get('/api/referrals', async (req, res) => {
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

app.post('/api/referrals', async (req, res) => {
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
// 5.5 Government Health Schemes
// ============================================================

app.get('/api/schemes', async (req, res) => {
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
    {
      id: 'sch-up-mmjay',
      schemeName: 'UP Mukhyamantri Jan Arogya Yojana (MMJAY)',
      category: 'STATE',
      description: 'State health cover for families left out of the SECC list, unorganized workers, and rural households in Uttar Pradesh.',
      eligibility: 'Residents of Uttar Pradesh with Antyodaya or BPL/EWS status.',
      coverageAmount: '₹5,00,000 per family / year',
      officialLink: 'https://ayushmanup.in',
      stateApplicable: 'Uttar Pradesh',
      minAge: 0,
      maxAge: 120,
    },
    {
      id: 'sch-chiranjeevi',
      schemeName: 'Mukhyamantri Ayushman Rajasthan Health Cover',
      category: 'STATE',
      description: 'Universal cashless health assurance for all families in Rajasthan for secondary & tertiary treatment.',
      eligibility: 'Residents of Rajasthan (Free for BPL, farmers, contractual workers, nominal premium for others).',
      coverageAmount: '₹25,00,000 universal annual health cover',
      officialLink: 'https://chiranjeevi.rajasthan.gov.in',
      stateApplicable: 'Rajasthan',
      minAge: 0,
      maxAge: 120,
    },
  ];
  res.json(schemes);
});

// ============================================================
// 6. Messaging & Care Coordination System (Phase 3)
// ============================================================

// List messages / threads
app.get('/api/messages', async (req, res) => {
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

// Send new message
app.post('/api/messages', async (req, res) => {
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

// Mark messages in thread as read
app.put('/api/messages/read', async (req, res) => {
  try {
    const { threadId, recipientId } = req.body;
    await prisma.message.updateMany({
      where: {
        threadId,
        recipientId,
        read: false,
      },
      data: { read: true },
    });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to mark messages as read' });
  }
});

// ============================================================
// 7. Interactions / Call History (Phase 3)
// ============================================================

app.get('/api/patients/:id/interactions', async (req, res) => {
  try {
    const interactions = await prisma.interaction.findMany({
      where: { patientId: req.params.id },
      orderBy: { createdAt: 'desc' },
    });
    res.json(interactions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch interactions' });
  }
});

app.post('/api/patients/:id/interactions', async (req, res) => {
  try {
    const interaction = await prisma.interaction.create({
      data: {
        ...req.body,
        patientId: req.params.id,
      },
    });
    res.status(201).json(interaction);
  } catch (error) {
    res.status(500).json({ error: 'Failed to log interaction' });
  }
});

// ============================================================
// 8. Notifications System (Phase 3)
// ============================================================

app.get('/api/notifications', async (req, res) => {
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

app.post('/api/notifications', async (req, res) => {
  try {
    const notification = await prisma.notification.create({
      data: req.body,
    });
    res.status(201).json(notification);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create notification' });
  }
});

app.put('/api/notifications/:id/read', async (req, res) => {
  try {
    const notification = await prisma.notification.update({
      where: { id: req.params.id },
      data: { read: true },
    });
    res.json(notification);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update notification' });
  }
});

app.put('/api/notifications/read-all', async (req, res) => {
  try {
    const { role } = req.body;
    await prisma.notification.updateMany({
      where: role ? { OR: [{ role }, { role: 'ALL' }] } : {},
      data: { read: true },
    });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to mark all notifications as read' });
  }
});

// ============================================================
// 9. Overall Stats Overview
// ============================================================

app.get('/api/stats', async (req, res) => {
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
      totalHospitals: hospitals.length,
      totalICUAvailable,
      totalBedsAvailable,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Sehat Saathi Backend server running on http://localhost:${PORT}`);
});
