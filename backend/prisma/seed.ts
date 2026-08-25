import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding Sehat Saathi Interconnected SIH Demo Database...\n');

  // Clean existing tables in reverse dependency order
  await prisma.prescriptionItem.deleteMany().catch(() => {});
  await prisma.prescription.deleteMany().catch(() => {});
  await prisma.labReport.deleteMany().catch(() => {});
  await prisma.vital.deleteMany().catch(() => {});
  await prisma.encounter.deleteMany().catch(() => {});
  await prisma.appointment.deleteMany().catch(() => {});
  await prisma.medication.deleteMany().catch(() => {});
  await prisma.allergy.deleteMany().catch(() => {});
  await prisma.medicalCondition.deleteMany().catch(() => {});
  await prisma.medicalDocument.deleteMany().catch(() => {});
  await prisma.insurance.deleteMany().catch(() => {});
  await prisma.referral.deleteMany().catch(() => {});
  await prisma.emergencyRequest.deleteMany().catch(() => {});
  await prisma.interaction.deleteMany().catch(() => {});
  await prisma.message.deleteMany().catch(() => {});
  await prisma.notification.deleteMany().catch(() => {});
  await prisma.staff.deleteMany().catch(() => {});
  await prisma.doctor.deleteMany().catch(() => {});
  await prisma.patient.deleteMany().catch(() => {});
  await prisma.user.deleteMany().catch(() => {});
  await prisma.governmentScheme.deleteMany().catch(() => {});
  await prisma.hospital.deleteMany().catch(() => {});

  const demoPasswordHash = await bcrypt.hash('Demo@1234', 10);

  // ============================================================
  // 1. 15 Major Delhi Government Hospitals Network
  // ============================================================
  console.log('🏥 Seeding 15 Major Delhi Government Hospitals...');

  const aiims = await prisma.hospital.create({
    data: {
      id: 'hosp-aiims-delhi',
      name: 'AIIMS New Delhi',
      type: 'Tertiary',
      district: 'South Delhi',
      state: 'Delhi',
      location: 'Sri Aurobindo Marg, Ansari Nagar, New Delhi 110029',
      phone: '011-26588500',
      lat: 28.5672,
      lng: 77.2100,
      totalBeds: 2478,
      availableBeds: 186,
      icuBeds: 250,
      availableIcu: 18,
      specialties: 'Cardiology,Neurology,Oncology,Trauma,Nephrology,Gastroenterology,Pulmonology',
    },
  });

  const safdarjung = await prisma.hospital.create({
    data: {
      id: 'hosp-safdarjung-delhi',
      name: 'Safdarjung Hospital & VMMC',
      type: 'Tertiary',
      district: 'South Delhi',
      state: 'Delhi',
      location: 'Ring Road, Opposite AIIMS, New Delhi 110029',
      phone: '011-26707444',
      lat: 28.5684,
      lng: 77.2066,
      totalBeds: 1531,
      availableBeds: 92,
      icuBeds: 150,
      availableIcu: 9,
      specialties: 'Burns,Orthopaedics,General Surgery,Paediatrics,Pulmonary Medicine,Emergency',
    },
  });

  const gghDelhi = await prisma.hospital.create({
    data: {
      id: 'hosp-ggh-delhi',
      name: 'Government General Hospital — Delhi',
      type: 'Government',
      district: 'Central Delhi',
      state: 'Delhi',
      location: 'Civil Lines, Rajpur Road, Delhi 110054',
      phone: '011-23955000',
      lat: 28.6750,
      lng: 77.2250,
      totalBeds: 680,
      availableBeds: 84,
      icuBeds: 60,
      availableIcu: 8,
      specialties: 'General Medicine,Cardiology,Paediatrics,Orthopaedics,Emergency',
    },
  });

  const lnjp = await prisma.hospital.create({
    data: {
      id: 'hosp-lnjp-delhi',
      name: 'Lok Nayak Hospital (LNJP)',
      type: 'Government',
      district: 'Central Delhi',
      state: 'Delhi',
      location: 'Jawaharlal Nehru Marg, Delhi Gate, New Delhi 110002',
      phone: '011-23236000',
      lat: 28.6369,
      lng: 77.2410,
      totalBeds: 2000,
      availableBeds: 145,
      icuBeds: 180,
      availableIcu: 14,
      specialties: 'Infectious Diseases,Trauma,General Medicine,Neonatology,Surgery,Orthopaedics',
    },
  });

  const rml = await prisma.hospital.create({
    data: {
      id: 'hosp-rml-delhi',
      name: 'Dr. Ram Manohar Lohia Hospital (RML)',
      type: 'Tertiary',
      district: 'New Delhi',
      state: 'Delhi',
      location: 'Baba Kharak Singh Marg, Connaught Place, New Delhi 110001',
      phone: '011-23365525',
      lat: 28.6258,
      lng: 77.2016,
      totalBeds: 1420,
      availableBeds: 110,
      icuBeds: 120,
      availableIcu: 11,
      specialties: 'Cardiology,Critical Care,Neurology,Toxicology,General Medicine,Emergency',
    },
  });

  const gtb = await prisma.hospital.create({
    data: {
      id: 'hosp-gtb-delhi',
      name: 'Guru Teg Bahadur Hospital (GTB)',
      type: 'Government',
      district: 'East Delhi',
      state: 'Delhi',
      location: 'Tahirpur Road, Dilshad Garden, Shahdara, Delhi 110095',
      phone: '011-22586262',
      lat: 28.6835,
      lng: 77.3094,
      totalBeds: 1700,
      availableBeds: 130,
      icuBeds: 140,
      availableIcu: 12,
      specialties: 'Trauma,Orthopaedics,Neurosurgery,Paediatrics,General Medicine,Emergency',
    },
  });

  const gbpant = await prisma.hospital.create({
    data: {
      id: 'hosp-gbpant-delhi',
      name: 'Govind Ballabh Pant Hospital (G.B. Pant)',
      type: 'Specialized',
      district: 'Central Delhi',
      state: 'Delhi',
      location: '1, Jawaharlal Nehru Marg, Raj Ghat, New Delhi 110002',
      phone: '011-23234242',
      lat: 28.6385,
      lng: 77.2398,
      totalBeds: 750,
      availableBeds: 62,
      icuBeds: 90,
      availableIcu: 8,
      specialties: 'Cardiology,Neurology,Gastroenterology,GI Surgery,Cardiothoracic Surgery',
    },
  });

  const ddu = await prisma.hospital.create({
    data: {
      id: 'hosp-ddu-delhi',
      name: 'Deen Dayal Upadhyay Hospital (DDU)',
      type: 'District',
      district: 'West Delhi',
      state: 'Delhi',
      location: 'Clock Tower, Hari Nagar, New Delhi 110064',
      phone: '011-25494401',
      lat: 28.6276,
      lng: 77.1054,
      totalBeds: 640,
      availableBeds: 54,
      icuBeds: 50,
      availableIcu: 6,
      specialties: 'Emergency Care,General Surgery,Orthopaedics,Obstetrics & Gynaecology,Paediatrics',
    },
  });

  const sskh = await prisma.hospital.create({
    data: {
      id: 'hosp-sskh-delhi',
      name: 'Lady Hardinge & Sucheta Kriplani Hospital',
      type: 'Government',
      district: 'New Delhi',
      state: 'Delhi',
      location: 'Shaheed Bhagat Singh Marg, Connaught Place, New Delhi 110001',
      phone: '011-23363728',
      lat: 28.6329,
      lng: 77.2144,
      totalBeds: 877,
      availableBeds: 78,
      icuBeds: 70,
      availableIcu: 7,
      specialties: 'Obstetrics & Gynaecology,Paediatrics,Neonatology,General Medicine,Surgery',
    },
  });

  const sgm = await prisma.hospital.create({
    data: {
      id: 'hosp-sgm-delhi',
      name: 'Sanjay Gandhi Memorial Hospital',
      type: 'District',
      district: 'North West Delhi',
      state: 'Delhi',
      location: 'S-Block, Mangolpuri, New Delhi 110083',
      phone: '011-27900100',
      lat: 28.6946,
      lng: 77.0864,
      totalBeds: 300,
      availableBeds: 38,
      icuBeds: 30,
      availableIcu: 4,
      specialties: 'Trauma,Emergency,General Medicine,Paediatrics,Orthopaedics',
    },
  });

  const bsa = await prisma.hospital.create({
    data: {
      id: 'hosp-bsa-delhi',
      name: 'Dr. Baba Saheb Ambedkar Hospital',
      type: 'Government',
      district: 'North West Delhi',
      state: 'Delhi',
      location: 'Sector 6, Rohini, New Delhi 110085',
      phone: '011-27055585',
      lat: 28.7118,
      lng: 77.1166,
      totalBeds: 500,
      availableBeds: 48,
      icuBeds: 45,
      availableIcu: 5,
      specialties: 'General Surgery,Dialysis,Cardiology,Orthopaedics,Emergency,Paediatrics',
    },
  });

  const asb = await prisma.hospital.create({
    data: {
      id: 'hosp-asb-delhi',
      name: 'Acharya Shree Bhikshu Government Hospital',
      type: 'District',
      district: 'West Delhi',
      state: 'Delhi',
      location: 'Moti Nagar, New Delhi 110015',
      phone: '011-25458000',
      lat: 28.6565,
      lng: 77.1432,
      totalBeds: 150,
      availableBeds: 22,
      icuBeds: 15,
      availableIcu: 3,
      specialties: 'General Medicine,Paediatrics,ENT,Ophthalmology,Emergency',
    },
  });

  const lbs = await prisma.hospital.create({
    data: {
      id: 'hosp-lbs-delhi',
      name: 'Lal Bahadur Shastri Hospital (LBS)',
      type: 'District',
      district: 'East Delhi',
      state: 'Delhi',
      location: 'Khichripur, Mayur Vihar Phase 2, Delhi 110091',
      phone: '011-22774145',
      lat: 28.6186,
      lng: 77.3075,
      totalBeds: 300,
      availableBeds: 35,
      icuBeds: 25,
      availableIcu: 4,
      specialties: 'Emergency Medicine,Orthopaedics,Paediatrics,General Surgery,General Medicine',
    },
  });

  const valmiki = await prisma.hospital.create({
    data: {
      id: 'hosp-valmiki-delhi',
      name: 'Maharishi Valmiki Hospital',
      type: 'District',
      district: 'North Delhi',
      state: 'Delhi',
      location: 'Pooth Khurd, Bawana Road, Delhi 110039',
      phone: '011-27761521',
      lat: 28.7845,
      lng: 77.0628,
      totalBeds: 150,
      availableBeds: 28,
      icuBeds: 15,
      availableIcu: 2,
      specialties: 'General Medicine,Maternal & Child Health,Emergency,Surgery',
    },
  });

  const cnbc = await prisma.hospital.create({
    data: {
      id: 'hosp-cnbc-delhi',
      name: 'Chacha Nehru Bal Chikitsalaya (CNBC)',
      type: 'Specialized',
      district: 'East Delhi',
      state: 'Delhi',
      location: 'Geeta Colony, Delhi 110031',
      phone: '011-22026130',
      lat: 28.6542,
      lng: 77.2725,
      totalBeds: 220,
      availableBeds: 30,
      icuBeds: 40,
      availableIcu: 6,
      specialties: 'Super-Specialty Paediatrics,Paediatric Surgery,Neonatal ICU,Paediatric Cardiology',
    },
  });

  const rgssh = await prisma.hospital.create({
    data: {
      id: 'hosp-rgssh-delhi',
      name: 'Rajiv Gandhi Super Speciality Hospital',
      type: 'Specialized',
      district: 'Shahdara',
      state: 'Delhi',
      location: 'Tahirpur, Dilshad Garden, Delhi 110093',
      phone: '011-22890600',
      lat: 28.6812,
      lng: 77.3168,
      totalBeds: 650,
      availableBeds: 74,
      icuBeds: 80,
      availableIcu: 10,
      specialties: 'Cardiology,Pulmonology,Gastroenterology,Urology,Critical Care,GI Surgery',
    },
  });

  // ============================================================
  // 2. Interconnected Demo Accounts (Doctor, Staff, Patient)
  // ============================================================
  console.log('👤 Seeding Interconnected Demo Users...');

  // 👨‍⚕️ Doctor Demo: Dr. Priya Mehta
  const doctorUser = await prisma.user.create({
    data: {
      name: 'Dr. Priya Mehta',
      phone: '9876500002',
      email: 'doctor.demo@sehatsaathi.test',
      passwordHash: demoPasswordHash,
      role: 'DOCTOR',
    },
  });

  const doctor = await prisma.doctor.create({
    data: {
      userId: doctorUser.id,
      name: 'Dr. Priya Mehta',
      specialty: 'General Medicine',
      department: 'General Medicine & Internal Care',
      licenseNumber: 'DEMO-DOC-001',
      phone: '9876500002',
      email: 'doctor.demo@sehatsaathi.test',
      facilityId: gghDelhi.id,
      experience: '8 years',
      available: true,
    },
  });

  // 🧑‍💼 Staff Demo: Neha Kapoor
  const staffUser = await prisma.user.create({
    data: {
      name: 'Neha Kapoor',
      phone: '9876500003',
      email: 'staff.demo@sehatsaathi.test',
      passwordHash: demoPasswordHash,
      role: 'HOSPITAL_STAFF',
    },
  });

  const staff = await prisma.staff.create({
    data: {
      userId: staffUser.id,
      name: 'Neha Kapoor',
      role: 'Hospital Operations',
      phone: '9876500003',
      email: 'staff.demo@sehatsaathi.test',
      facilityId: gghDelhi.id,
    },
  });

  // 👤 Patient Demo: Aarav Sharma
  const patientUser = await prisma.user.create({
    data: {
      name: 'Aarav Sharma',
      phone: '9876500001',
      email: 'patient.demo@sehatsaathi.test',
      passwordHash: demoPasswordHash,
      role: 'PATIENT',
    },
  });

  const patient = await prisma.patient.create({
    data: {
      userId: patientUser.id,
      mrn: 'MRN-2026-0001',
      name: 'Aarav Sharma',
      age: 28,
      gender: 'Male',
      bloodGroup: 'B+',
      phone: '9876500001',
      email: 'patient.demo@sehatsaathi.test',
      dateOfBirth: '1998-04-15',
      address: 'Flat 302, Green View Apartments',
      village: 'Civil Lines',
      city: 'Delhi',
      district: 'Central Delhi',
      state: 'Delhi',
      pincode: '110054',
      emergencyContactName: 'Kavita Sharma',
      emergencyContactPhone: '9876500009',
      emergencyContactRelation: 'Mother',
      riskLevel: 'MODERATE',
      incomeCategory: 'APL',
      abhaLinked: true,
      abhaId: '91-2849-5820-1928',
    },
  });

  // ============================================================
  // 3. Clinical Data for Aarav Sharma
  // ============================================================
  console.log('🩺 Seeding Clinical Vitals, Conditions, & Past Encounter...');

  // Vitals
  await prisma.vital.create({
    data: {
      patientId: patient.id,
      temperature: 36.8,
      bpSystolic: 138,
      bpDiastolic: 88,
      heartRate: 76,
      respiratoryRate: 16,
      spO2: 98.5,
      height: 176,
      weight: 73,
      bmi: 23.6,
    },
  });

  // Active Condition
  await prisma.medicalCondition.create({
    data: {
      patientId: patient.id,
      name: 'Hypertension — mild',
      icdCode: 'I10',
      status: 'ACTIVE',
      onsetDate: '2026-02-10',
      notes: 'Stage 1 essential hypertension. Responding well to lifestyle modifications.',
    },
  });

  // Allergy
  await prisma.allergy.create({
    data: {
      patientId: patient.id,
      allergen: 'Dust Mites',
      type: 'ENVIRONMENTAL',
      severity: 'MILD',
      reaction: 'Occasional morning sneezing and mild rhinitis',
    },
  });

  // Past Encounter (18 Aug 2026)
  const pastEncounter = await prisma.encounter.create({
    data: {
      patientId: patient.id,
      doctorId: doctor.id,
      chiefComplaint: 'Mild occasional morning headaches, slightly elevated home BP readings',
      symptoms: JSON.stringify(['Mild headache', 'Occasional fatigue']),
      onset: 'Gradual over 2 weeks',
      severity: 'Mild',
      diagnosis: 'Mild Essential Hypertension (Stage 1)',
      diagnosisIcdCode: 'I10',
      treatmentPlan: 'Prescribed Telmisartan 20mg OD in morning. Advised 30 min daily brisk walking and low sodium diet.',
      riskScore: 42,
      urgency: 'MODERATE',
      suggestedDepartment: 'General Medicine',
      status: 'COMPLETED',
    },
  });

  // Prescription
  await prisma.prescription.create({
    data: {
      patientId: patient.id,
      doctorId: doctor.id,
      encounterId: pastEncounter.id,
      date: '2026-08-18',
      notes: 'Take with warm water before breakfast daily.',
      items: {
        create: [
          {
            medicationName: 'Telmisartan 20mg',
            dosage: '20mg',
            frequency: 'Once Daily (Morning)',
            duration: '30 days',
            instructions: 'Take before breakfast with water',
          },
        ],
      },
    },
  });

  await prisma.medication.create({
    data: {
      patientId: patient.id,
      prescribingDoctorId: doctor.id,
      name: 'Telmisartan 20mg',
      dosage: '20mg',
      frequency: 'Once Daily (Morning)',
      startDate: '2026-08-18',
      status: 'ACTIVE',
      notes: 'Take before breakfast',
    },
  });

  // ============================================================
  // 4. Interconnected Appointments
  // ============================================================
  console.log('📅 Seeding Interconnected Appointments...');

  // Main SIH Demo Appointment: 28 Aug 2026, 10:30 AM (Confirmed)
  await prisma.appointment.create({
    data: {
      patientId: patient.id,
      doctorId: doctor.id,
      dateTime: '2026-08-28T10:30:00.000Z',
      status: 'CONFIRMED',
      visitType: 'NEW',
      reason: 'General Consultation & Hypertension Evaluation',
      notes: 'Patient to present home blood pressure logs.',
    },
  });

  // Follow-up: 04 Sep 2026, 11:00 AM (Scheduled)
  await prisma.appointment.create({
    data: {
      patientId: patient.id,
      doctorId: doctor.id,
      dateTime: '2026-09-04T11:00:00.000Z',
      status: 'REQUESTED',
      visitType: 'FOLLOW_UP',
      reason: 'Follow-up blood pressure review and lifestyle check',
      notes: 'Review response to Telmisartan 20mg.',
    },
  });

  // Completed: 18 Aug 2026, 02:00 PM
  await prisma.appointment.create({
    data: {
      patientId: patient.id,
      doctorId: doctor.id,
      dateTime: '2026-08-18T14:00:00.000Z',
      status: 'COMPLETED',
      visitType: 'NEW',
      reason: 'Initial intake consultation and baseline vitals recording',
    },
  });

  // ============================================================
  // 5. Interconnected Referral (Doctor -> AIIMS Cardiology)
  // ============================================================
  console.log('⭐ Seeding Interconnected Clinical Referral...');

  await prisma.referral.create({
    data: {
      patientId: patient.id,
      patientName: patient.name,
      fromHospitalId: gghDelhi.id,
      toHospitalId: aiims.id,
      toHospitalName: aiims.name,
      doctorName: doctor.name,
      specialty: 'Cardiology',
      status: 'PENDING',
      urgency: 'MODERATE',
      reason: 'Further cardiovascular evaluation and ambulatory blood pressure monitoring',
      notes: 'Stage 1 hypertension evaluation; recommended 24h Holter BP monitoring.',
    },
  });

  // ============================================================
  // 6. Interconnected Demo Messages
  // ============================================================
  console.log('💬 Seeding Interconnected Demo Messages...');

  // Thread 1: Patient (Aarav) ↔ Doctor (Dr. Priya)
  await prisma.message.createMany({
    data: [
      {
        senderId: doctorUser.id,
        senderName: doctor.name,
        senderRole: 'DOCTOR',
        recipientId: patientUser.id,
        recipientName: patient.name,
        recipientRole: 'PATIENT',
        threadId: 'thread-aarav-drpriya',
        content: 'Hello Aarav, your appointment is confirmed for 28 August at 10:30 AM. Please bring your previous prescriptions if available.',
        read: true,
        createdAt: new Date(Date.now() - 7200000), // 2 hours ago
      },
      {
        senderId: patientUser.id,
        senderName: patient.name,
        senderRole: 'PATIENT',
        recipientId: doctorUser.id,
        recipientName: doctor.name,
        recipientRole: 'DOCTOR',
        threadId: 'thread-aarav-drpriya',
        content: "Thank you, doctor. I'll be there. I also wanted to discuss my recent blood pressure readings.",
        read: true,
        createdAt: new Date(Date.now() - 3600000), // 1 hour ago
      },
      {
        senderId: doctorUser.id,
        senderName: doctor.name,
        senderRole: 'DOCTOR',
        recipientId: patientUser.id,
        recipientName: patient.name,
        recipientRole: 'PATIENT',
        threadId: 'thread-aarav-drpriya',
        content: "Certainly. We'll review them during your consultation.",
        read: false,
        createdAt: new Date(Date.now() - 1800000), // 30 mins ago
      },
    ],
  });

  // Thread 2: Staff (Neha) ↔ Doctor (Dr. Priya)
  await prisma.message.createMany({
    data: [
      {
        senderId: staffUser.id,
        senderName: staff.name,
        senderRole: 'HOSPITAL_STAFF',
        recipientId: doctorUser.id,
        recipientName: doctor.name,
        recipientRole: 'DOCTOR',
        threadId: 'thread-neha-drpriya',
        content: "Good morning, Doctor. Aarav Sharma's appointment has been confirmed for 10:30 AM.",
        read: true,
        createdAt: new Date(Date.now() - 5400000), // 1.5 hours ago
      },
      {
        senderId: doctorUser.id,
        senderName: doctor.name,
        senderRole: 'DOCTOR',
        recipientId: staffUser.id,
        recipientName: staff.name,
        recipientRole: 'HOSPITAL_STAFF',
        threadId: 'thread-neha-drpriya',
        content: "Thank you. Please ensure his previous records are available before the consultation.",
        read: false,
        createdAt: new Date(Date.now() - 3000000),
      },
    ],
  });

  // ============================================================
  // 7. Interconnected Demo Notifications
  // ============================================================
  console.log('🔔 Seeding Role-Specific Notifications...');

  // Patient Notifications
  await prisma.notification.createMany({
    data: [
      {
        userId: patientUser.id,
        role: 'PATIENT',
        category: 'APPOINTMENT',
        title: 'Appointment Confirmed',
        message: 'Appointment confirmed with Dr. Priya Mehta — 28 Aug, 10:30 AM',
        urgency: 'NORMAL',
        read: false,
        createdAt: new Date(Date.now() - 7200000),
      },
      {
        userId: patientUser.id,
        role: 'PATIENT',
        category: 'APPOINTMENT',
        title: 'Follow-up Scheduled',
        message: 'Your follow-up appointment has been scheduled for 04 Sep.',
        urgency: 'NORMAL',
        read: false,
        createdAt: new Date(Date.now() - 3600000),
      },
    ],
  });

  // Doctor Notifications
  await prisma.notification.createMany({
    data: [
      {
        userId: doctorUser.id,
        role: 'DOCTOR',
        category: 'APPOINTMENT',
        title: 'New Appointment',
        message: 'New appointment: Aarav Sharma — 28 Aug, 10:30 AM',
        urgency: 'NORMAL',
        read: false,
        createdAt: new Date(Date.now() - 7200000),
      },
      {
        userId: doctorUser.id,
        role: 'DOCTOR',
        category: 'CLINICAL',
        title: 'Patient Record Updated',
        message: 'Patient record updated for Aarav Sharma.',
        urgency: 'NORMAL',
        read: false,
        createdAt: new Date(Date.now() - 3600000),
      },
    ],
  });

  // Staff Notifications
  await prisma.notification.createMany({
    data: [
      {
        userId: staffUser.id,
        role: 'HOSPITAL_STAFF',
        category: 'APPOINTMENT',
        title: 'Appointment Scheduled',
        message: 'Appointment successfully scheduled for Aarav Sharma.',
        urgency: 'NORMAL',
        read: false,
        createdAt: new Date(Date.now() - 7200000),
      },
      {
        userId: staffUser.id,
        role: 'HOSPITAL_STAFF',
        category: 'SYSTEM',
        title: 'Patient Registered',
        message: 'New patient registered: Aarav Sharma.',
        urgency: 'NORMAL',
        read: false,
        createdAt: new Date(Date.now() - 10800000),
      },
    ],
  });

  // ============================================================
  // 8. Emergency 108 SOS Record
  // ============================================================
  console.log('🚑 Seeding Emergency 108 SOS Dispatch...');

  await prisma.emergencyRequest.create({
    data: {
      phone: '9876500001',
      location: 'Near Civil Lines Metro Station, Gate 2, Delhi',
      emergencyType: 'CARDIAC',
      patientName: 'Aarav Sharma',
      age: 28,
      gender: 'Male',
      assignedHospitalId: gghDelhi.id,
      assignedHospitalName: gghDelhi.name,
      ambulanceId: '108-ALS-1081',
      status: 'DISPATCHED',
      etaMinutes: 6,
      notes: 'Pre-hospital ALS emergency response simulation active.',
    },
  });

  console.log('\n======================================================');
  console.log('✅ SEED COMPLETED: Interconnected SIH Demo Accounts');
  console.log('======================================================');
  console.log('👤 Patient:  Aarav Sharma     | Phone: 9876500001 | Pass: Demo@1234');
  console.log('👨‍⚕️ Doctor:   Dr. Priya Mehta  | Phone: 9876500002 | Pass: Demo@1234');
  console.log('🧑‍💼 Staff:    Neha Kapoor      | Phone: 9876500003 | Pass: Demo@1234');
  console.log('======================================================\n');
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
