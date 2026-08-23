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

// Create new patient
app.post('/api/patients', async (req, res) => {
  try {
    const data = req.body;
    const count = await prisma.patient.count();
    const mrn = `MRN-2025-${String(count + 1).padStart(4, '0')}`;

    const newPatient = await prisma.patient.create({
      data: {
        ...data,
        mrn: data.mrn || mrn,
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
    const appt = await prisma.appointment.create({
      data: req.body,
    });
    res.status(201).json(appt);
  } catch (error) {
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
// 6. Overall Stats Overview
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
