import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Sehat Saathi: ensuring demo accounts and clinician data exist...');

  const passwordHash = await bcrypt.hash('Demo@1234', 10);

  const hospital = await prisma.hospital.upsert({
    where: { id: 'hosp-ggh-delhi' },
    update: {},
    create: {
      id: 'hosp-ggh-delhi',
      name: 'Government General Hospital — Delhi',
      type: 'Government',
      district: 'Central Delhi',
      state: 'Delhi',
      location: 'Civil Lines, Rajpur Road, Delhi 110054',
      phone: '011-23955000',
      lat: 28.675,
      lng: 77.225,
      totalBeds: 680,
      availableBeds: 84,
      icuBeds: 60,
      availableIcu: 8,
      specialties: 'General Medicine,Cardiology,Paediatrics,Orthopaedics,Emergency,Neurology,Neurosurgery,General Surgery',
    },
  });

  const doctorUser = await prisma.user.upsert({
    where: { phone: '9876500002' },
    update: { name: 'Dr. Priya Mehta', email: 'doctor.demo@sehatsaathi.test', passwordHash, role: 'DOCTOR' },
    create: { name: 'Dr. Priya Mehta', phone: '9876500002', email: 'doctor.demo@sehatsaathi.test', passwordHash, role: 'DOCTOR' },
  });

  const doctor = await prisma.doctor.upsert({
    where: { userId: doctorUser.id },
    update: { name: 'Dr. Priya Mehta', specialty: 'General Physician', department: 'General Physician', licenseNumber: 'DEMO-DOC-001', phone: '9876500002', email: 'doctor.demo@sehatsaathi.test', facilityId: hospital.id, experience: '8 years', available: true },
    create: { userId: doctorUser.id, name: 'Dr. Priya Mehta', specialty: 'General Physician', department: 'General Physician', licenseNumber: 'DEMO-DOC-001', phone: '9876500002', email: 'doctor.demo@sehatsaathi.test', facilityId: hospital.id, experience: '8 years', available: true },
  });

  const staffUser = await prisma.user.upsert({
    where: { phone: '9876500003' },
    update: { name: 'Neha Kapoor', email: 'staff.demo@sehatsaathi.test', passwordHash, role: 'HOSPITAL_STAFF' },
    create: { name: 'Neha Kapoor', phone: '9876500003', email: 'staff.demo@sehatsaathi.test', passwordHash, role: 'HOSPITAL_STAFF' },
  });

  const staff = await prisma.staff.upsert({
    where: { userId: staffUser.id },
    update: { name: 'Neha Kapoor', role: 'Hospital Operations', phone: '9876500003', email: 'staff.demo@sehatsaathi.test', facilityId: hospital.id },
    create: { userId: staffUser.id, name: 'Neha Kapoor', role: 'Hospital Operations', phone: '9876500003', email: 'staff.demo@sehatsaathi.test', facilityId: hospital.id },
  });

  const patientUser = await prisma.user.upsert({
    where: { phone: '9876500001' },
    update: { name: 'Aarav Sharma', email: 'patient.demo@sehatsaathi.test', passwordHash, role: 'PATIENT' },
    create: { name: 'Aarav Sharma', phone: '9876500001', email: 'patient.demo@sehatsaathi.test', passwordHash, role: 'PATIENT' },
  });

  const patient = await prisma.patient.upsert({
    where: { userId: patientUser.id },
    update: { mrn: 'MRN-2026-0001', name: 'Aarav Sharma', age: 28, gender: 'Male', bloodGroup: 'B+', phone: '9876500001', email: 'patient.demo@sehatsaathi.test', dateOfBirth: '1998-04-15', address: 'Flat 302, Green View Apartments', village: 'Civil Lines', city: 'New Delhi', district: 'Central Delhi', state: 'Delhi', pincode: '110054', emergencyContactName: 'Kavita Sharma', emergencyContactPhone: '9876500009', emergencyContactRelation: 'Mother', riskLevel: 'MODERATE', incomeCategory: 'APL', abhaLinked: true, abhaId: '91-2849-5820-1928' },
    create: { userId: patientUser.id, mrn: 'MRN-2026-0001', name: 'Aarav Sharma', age: 28, gender: 'Male', bloodGroup: 'B+', phone: '9876500001', email: 'patient.demo@sehatsaathi.test', dateOfBirth: '1998-04-15', address: 'Flat 302, Green View Apartments', village: 'Civil Lines', city: 'New Delhi', district: 'Central Delhi', state: 'Delhi', pincode: '110054', emergencyContactName: 'Kavita Sharma', emergencyContactPhone: '9876500009', emergencyContactRelation: 'Mother', riskLevel: 'MODERATE', incomeCategory: 'APL', abhaLinked: true, abhaId: '91-2849-5820-1928' },
  });

  // Names supplied by the user are retained exactly. Additional clinician names are synthetic reference data.
  const clinicians = [
    ['Dr Deepak Agrawal', 'Neurosurgery'], ['Dr PS Chandra', 'Neurosurgery'], ['Dr Rajeev Sharma', 'Neurosurgery'], ['Dr Neeraj Kapoor', 'Neurosurgery'],
    ['Dr Roopa Rajan', 'Neurology'], ['Dr Anu Gupta', 'Neurology'], ['Dr Manjari Tripathi', 'Neurology'], ['Dr Kavya Nair', 'Neurology'],
    ['Dr Rajiv Narang', 'Cardiology'], ['Dr Anita Saxena', 'Cardiology'], ['Dr Arjun Malhotra', 'Cardiology'], ['Dr Meera Iyer', 'Cardiology'],
    ['Dr Rohan Bhatia', 'General Surgery'], ['Dr Nisha Verma', 'General Surgery'], ['Dr Sameer Khanna', 'General Surgery'], ['Dr Pooja Menon', 'General Surgery'],
    ['Dr Vivek Rao', 'Orthopaedics'], ['Dr Aditi Joshi', 'Orthopaedics'], ['Dr Karan Sethi', 'Orthopaedics'], ['Dr Shreya Das', 'Orthopaedics'],
    ['Dr Amit Sen', 'Paediatrics'], ['Dr Ritu Sharma', 'Paediatrics'], ['Dr Manav Gupta', 'Paediatrics'], ['Dr Isha Kapoor', 'Paediatrics'],
    ['Dr Nikhil Arora', 'Gastroenterology'], ['Dr Tanya Mehta', 'Gastroenterology'], ['Dr Rahul Jain', 'Gastroenterology'], ['Dr Simran Kaur', 'Gastroenterology'],
    ['Dr Aditya Bose', 'Dermatology'], ['Dr Neha Sood', 'Dermatology'], ['Dr Varun Shah', 'Dermatology'], ['Dr Rhea Kapoor', 'Dermatology'],
    ['Dr Sanjay Rao', 'Pulmonology'], ['Dr Kavita Nair', 'Pulmonology'], ['Dr Mohit Bansal', 'Pulmonology'], ['Dr Priyanka Das', 'Pulmonology'],
    ['Dr Akash Verma', 'Psychiatry'], ['Dr Radhika Sen', 'Psychiatry'], ['Dr Kunal Mehra', 'Psychiatry'], ['Dr Anjali Roy', 'Psychiatry'],
    ['Dr Harish Mehta', 'Ophthalmology'], ['Dr Sneha Rao', 'Ophthalmology'], ['Dr Deepa Nair', 'Ophthalmology'], ['Dr Yash Malhotra', 'Ophthalmology'],
    ['Dr Manish Arora', 'ENT'], ['Dr Swati Jain', 'ENT'], ['Dr Rohit Sinha', 'ENT'], ['Dr Priti Shah', 'ENT'],
  ];

  for (let i = 0; i < clinicians.length; i += 1) {
    const [name, specialty] = clinicians[i];
    const phone = `90000${String(10000 + i).slice(-5)}`;
    const email = `clinician.demo.${i + 1}@sehatsaathi.test`;
    const user = await prisma.user.upsert({
      where: { phone },
      update: { name, email, role: 'DOCTOR' },
      create: { name, phone, email, passwordHash, role: 'DOCTOR' },
    });
    await prisma.doctor.upsert({
      where: { userId: user.id },
      update: { name, specialty, department: specialty, phone, email, facilityId: hospital.id, experience: 'Reference data', available: true },
      create: { userId: user.id, name, specialty, department: specialty, licenseNumber: `DEMO-${String(i + 2).padStart(3, '0')}`, phone, email, facilityId: hospital.id, experience: 'Reference data', available: true },
    });
  }

  // ============================================================
  // Comprehensive Demo Patients Registry (8 realistic patients)
  // ============================================================
  const demoPatientsList = [
    {
      phone: '9876500001',
      email: 'patient.demo@sehatsaathi.test',
      name: 'Aarav Sharma',
      mrn: 'MRN-2026-0001',
      age: 28,
      gender: 'Male',
      bloodGroup: 'B+',
      dateOfBirth: '1998-04-15',
      address: 'Flat 302, Green View Apartments',
      village: 'Civil Lines',
      city: 'New Delhi',
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
      conditions: [{ name: 'Essential Hypertension — Stage 1', icdCode: 'I10', status: 'ACTIVE', onsetDate: '2026-02-10', notes: 'Well controlled on low dose ARB' }],
      allergies: [{ allergen: 'Dust Mites', type: 'ENVIRONMENTAL', severity: 'MILD', reaction: 'Morning sneezing' }],
      vitals: { temperature: 36.8, bpSystolic: 138, bpDiastolic: 88, heartRate: 76, respiratoryRate: 16, spO2: 98.5, height: 176, weight: 73, bmi: 23.6 },
    },
    {
      phone: '9876500004',
      email: 'sunita.devi@sehatsaathi.test',
      name: 'Sunita Devi',
      mrn: 'MRN-2026-0002',
      age: 45,
      gender: 'Female',
      bloodGroup: 'O+',
      dateOfBirth: '1981-08-22',
      address: 'House 42, Sector 8',
      village: 'Rohini',
      city: 'Delhi',
      district: 'North West Delhi',
      state: 'Delhi',
      pincode: '110085',
      emergencyContactName: 'Ramesh Devi',
      emergencyContactPhone: '9876500014',
      emergencyContactRelation: 'Spouse',
      riskLevel: 'HIGH',
      incomeCategory: 'BPL',
      abhaLinked: true,
      abhaId: '91-3948-1029-4820',
      conditions: [{ name: 'Type 2 Diabetes Mellitus', icdCode: 'E11.9', status: 'CHRONIC', onsetDate: '2023-05-14', notes: 'Fasting glucose 142 mg/dL, HbA1c 7.6%' }],
      allergies: [{ allergen: 'Sulfonamides', type: 'DRUG', severity: 'SEVERE', reaction: 'Urticaria and facial rash' }],
      vitals: { temperature: 37.0, bpSystolic: 142, bpDiastolic: 92, heartRate: 82, respiratoryRate: 18, spO2: 97.0, height: 158, weight: 68, bmi: 27.2 },
    },
    {
      phone: '9876500005',
      email: 'ramesh.kumar@sehatsaathi.test',
      name: 'Ramesh Kumar',
      mrn: 'MRN-2026-0003',
      age: 62,
      gender: 'Male',
      bloodGroup: 'A+',
      dateOfBirth: '1964-11-03',
      address: 'B-12, GT Road Extension',
      village: 'Dilshad Garden',
      city: 'Delhi',
      district: 'East Delhi',
      state: 'Delhi',
      pincode: '110095',
      emergencyContactName: 'Deepak Kumar',
      emergencyContactPhone: '9876500015',
      emergencyContactRelation: 'Son',
      riskLevel: 'HIGH',
      incomeCategory: 'EWS',
      abhaLinked: true,
      abhaId: '91-5820-9182-3847',
      conditions: [{ name: 'Chronic Obstructive Pulmonary Disease (COPD)', icdCode: 'J44.9', status: 'CHRONIC', onsetDate: '2021-09-19', notes: 'Ex-smoker. Maintenance bronchodilator therapy.' }],
      allergies: [{ allergen: 'Penicillin', type: 'DRUG', severity: 'SEVERE', reaction: 'Anaphylactoid wheezing' }],
      vitals: { temperature: 36.6, bpSystolic: 130, bpDiastolic: 84, heartRate: 88, respiratoryRate: 22, spO2: 94.0, height: 168, weight: 61, bmi: 21.6 },
    },
    {
      phone: '9876500006',
      email: 'meera.patel@sehatsaathi.test',
      name: 'Meera Patel',
      mrn: 'MRN-2026-0004',
      age: 34,
      gender: 'Female',
      bloodGroup: 'AB+',
      dateOfBirth: '1992-06-18',
      address: 'Pocket C-4, Press Enclave',
      village: 'Saket',
      city: 'New Delhi',
      district: 'South Delhi',
      state: 'Delhi',
      pincode: '110017',
      emergencyContactName: 'Anil Patel',
      emergencyContactPhone: '9876500016',
      emergencyContactRelation: 'Spouse',
      riskLevel: 'LOW',
      incomeCategory: 'APL',
      abhaLinked: true,
      abhaId: '91-1029-4857-2938',
      conditions: [{ name: 'Antenatal Care — Second Trimester', icdCode: 'Z34.8', status: 'ACTIVE', onsetDate: '2026-04-01', notes: 'Routine prenatal screening normal' }],
      allergies: [],
      vitals: { temperature: 36.9, bpSystolic: 116, bpDiastolic: 74, heartRate: 74, respiratoryRate: 16, spO2: 99.0, height: 162, weight: 64, bmi: 24.4 },
    },
    {
      phone: '9876500007',
      email: 'rajesh.verma@sehatsaathi.test',
      name: 'Rajesh Verma',
      mrn: 'MRN-2026-0005',
      age: 51,
      gender: 'Male',
      bloodGroup: 'O-',
      dateOfBirth: '1975-01-30',
      address: 'Sector 6, DDA SFS Flats',
      village: 'Dwarka',
      city: 'New Delhi',
      district: 'South West Delhi',
      state: 'Delhi',
      pincode: '110075',
      emergencyContactName: 'Pooja Verma',
      emergencyContactPhone: '9876500017',
      emergencyContactRelation: 'Spouse',
      riskLevel: 'MODERATE',
      incomeCategory: 'APL',
      abhaLinked: true,
      abhaId: '91-8472-9182-4720',
      conditions: [{ name: 'Primary Osteoarthritis of Bilateral Knees', icdCode: 'M17.0', status: 'ACTIVE', onsetDate: '2024-10-12', notes: 'Pain on climbing stairs, morning stiffness < 30 mins' }],
      allergies: [{ allergen: 'NSAIDs / Ibuprofen', type: 'DRUG', severity: 'MODERATE', reaction: 'Gastric irritation' }],
      vitals: { temperature: 36.7, bpSystolic: 128, bpDiastolic: 82, heartRate: 70, respiratoryRate: 15, spO2: 98.0, height: 172, weight: 82, bmi: 27.7 },
    },
    {
      phone: '9876500008',
      email: 'anita.singh@sehatsaathi.test',
      name: 'Anita Singh',
      mrn: 'MRN-2026-0006',
      age: 24,
      gender: 'Female',
      bloodGroup: 'B-',
      dateOfBirth: '2002-09-10',
      address: '14/3 Ajmal Khan Road',
      village: 'Karol Bagh',
      city: 'Delhi',
      district: 'Central Delhi',
      state: 'Delhi',
      pincode: '110005',
      emergencyContactName: 'Suresh Singh',
      emergencyContactPhone: '9876500018',
      emergencyContactRelation: 'Father',
      riskLevel: 'LOW',
      incomeCategory: 'APL',
      abhaLinked: true,
      abhaId: '91-7291-3847-1928',
      conditions: [{ name: 'Seasonal Allergic Rhinitis', icdCode: 'J30.2', status: 'ACTIVE', onsetDate: '2025-03-01', notes: 'Exacerbated by pollen during seasonal change' }],
      allergies: [{ allergen: 'Tree Pollen', type: 'ENVIRONMENTAL', severity: 'MILD', reaction: 'Rhinitis and watery eyes' }],
      vitals: { temperature: 36.8, bpSystolic: 112, bpDiastolic: 72, heartRate: 68, respiratoryRate: 14, spO2: 99.0, height: 165, weight: 55, bmi: 20.2 },
    },
    {
      phone: '9876500010',
      email: 'vikram.malhotra@sehatsaathi.test',
      name: 'Vikram Malhotra',
      mrn: 'MRN-2026-0007',
      age: 39,
      gender: 'Male',
      bloodGroup: 'A-',
      dateOfBirth: '1987-12-05',
      address: 'Block E, Inner Circle',
      village: 'Connaught Place',
      city: 'New Delhi',
      district: 'New Delhi',
      state: 'Delhi',
      pincode: '110001',
      emergencyContactName: 'Neha Malhotra',
      emergencyContactPhone: '9876500019',
      emergencyContactRelation: 'Spouse',
      riskLevel: 'MODERATE',
      incomeCategory: 'APL',
      abhaLinked: true,
      abhaId: '91-4920-1847-5920',
      conditions: [{ name: 'Acute Gastroenteritis', icdCode: 'A09', status: 'ACTIVE', onsetDate: '2026-08-26', notes: 'Abdominal cramps and mild dehydration' }],
      allergies: [],
      vitals: { temperature: 37.4, bpSystolic: 122, bpDiastolic: 78, heartRate: 84, respiratoryRate: 17, spO2: 98.0, height: 178, weight: 76, bmi: 24.0 },
    },
    {
      phone: '9876500011',
      email: 'kavita.joshi@sehatsaathi.test',
      name: 'Kavita Joshi',
      mrn: 'MRN-2026-0008',
      age: 58,
      gender: 'Female',
      bloodGroup: 'B+',
      dateOfBirth: '1968-03-25',
      address: 'K-82, Central Market Road',
      village: 'Lajpat Nagar II',
      city: 'New Delhi',
      district: 'South East Delhi',
      state: 'Delhi',
      pincode: '110024',
      emergencyContactName: 'Vinod Joshi',
      emergencyContactPhone: '9876500020',
      emergencyContactRelation: 'Spouse',
      riskLevel: 'MODERATE',
      incomeCategory: 'APL',
      abhaLinked: true,
      abhaId: '91-3847-5920-1029',
      conditions: [
        { name: 'Primary Hypothyroidism', icdCode: 'E03.9', status: 'CHRONIC', onsetDate: '2020-01-15', notes: 'On Levothyroxine 50mcg daily' },
        { name: 'Lumbar Spondylosis with Sciatalgia', icdCode: 'M47.8', status: 'CHRONIC', onsetDate: '2022-07-20', notes: 'L4-L5 disc degeneration on past MRI' }
      ],
      allergies: [{ allergen: 'Peanuts', type: 'FOOD', severity: 'MODERATE', reaction: 'Skin urticaria' }],
      vitals: { temperature: 36.6, bpSystolic: 134, bpDiastolic: 86, heartRate: 72, respiratoryRate: 16, spO2: 98.0, height: 155, weight: 66, bmi: 27.5 },
    },
  ];

  const createdPatients: Record<string, any> = {};

  for (const item of demoPatientsList) {
    const user = await prisma.user.upsert({
      where: { phone: item.phone },
      update: { name: item.name, email: item.email, passwordHash, role: 'PATIENT' },
      create: { name: item.name, phone: item.phone, email: item.email, passwordHash, role: 'PATIENT' },
    });

    const pat = await prisma.patient.upsert({
      where: { userId: user.id },
      update: {
        mrn: item.mrn,
        name: item.name,
        age: item.age,
        gender: item.gender,
        bloodGroup: item.bloodGroup,
        phone: item.phone,
        email: item.email,
        dateOfBirth: item.dateOfBirth,
        address: item.address,
        village: item.village,
        city: item.city,
        district: item.district,
        state: item.state,
        pincode: item.pincode,
        emergencyContactName: item.emergencyContactName,
        emergencyContactPhone: item.emergencyContactPhone,
        emergencyContactRelation: item.emergencyContactRelation,
        riskLevel: item.riskLevel,
        incomeCategory: item.incomeCategory,
        abhaLinked: item.abhaLinked,
        abhaId: item.abhaId,
      },
      create: {
        userId: user.id,
        mrn: item.mrn,
        name: item.name,
        age: item.age,
        gender: item.gender,
        bloodGroup: item.bloodGroup,
        phone: item.phone,
        email: item.email,
        dateOfBirth: item.dateOfBirth,
        address: item.address,
        village: item.village,
        city: item.city,
        district: item.district,
        state: item.state,
        pincode: item.pincode,
        emergencyContactName: item.emergencyContactName,
        emergencyContactPhone: item.emergencyContactPhone,
        emergencyContactRelation: item.emergencyContactRelation,
        riskLevel: item.riskLevel,
        incomeCategory: item.incomeCategory,
        abhaLinked: item.abhaLinked,
        abhaId: item.abhaId,
      },
    });

    createdPatients[item.mrn] = pat;

    // Seed Vitals
    await prisma.vital.create({
      data: {
        patientId: pat.id,
        ...item.vitals,
      },
    });

    // Seed Conditions
    for (const cond of item.conditions) {
      const existingCond = await prisma.medicalCondition.findFirst({
        where: { patientId: pat.id, name: cond.name },
      });
      if (!existingCond) {
        await prisma.medicalCondition.create({
          data: { patientId: pat.id, ...cond },
        });
      }
    }

    // Seed Allergies
    for (const allg of item.allergies) {
      const existingAllg = await prisma.allergy.findFirst({
        where: { patientId: pat.id, allergen: allg.allergen },
      });
      if (!existingAllg) {
        await prisma.allergy.create({
          data: { patientId: pat.id, ...allg },
        });
      }
    }
  }

  // ============================================================
  // Interconnected Demo Appointment Schedule (All Statuses)
  // ============================================================
  const todayISO = new Date().toISOString().split('T')[0];
  const aarav = createdPatients['MRN-2026-0001'];
  const sunita = createdPatients['MRN-2026-0002'];
  const ramesh = createdPatients['MRN-2026-0003'];
  const meera = createdPatients['MRN-2026-0004'];
  const rajesh = createdPatients['MRN-2026-0005'];
  const anita = createdPatients['MRN-2026-0006'];
  const vikram = createdPatients['MRN-2026-0007'];

  const scheduleRoster = [
    // Today's schedule for Dr. Priya Mehta
    {
      patient: ramesh,
      dateTime: `${todayISO}T04:00:00.000Z`, // 09:30 AM IST
      status: 'COMPLETED',
      visitType: 'FOLLOW_UP',
      reason: 'Chronic COPD respiratory assessment and inhaler technique review',
      notes: 'Consultation concluded. SpO2 maintained at 94% on room air.',
    },
    {
      patient: aarav,
      dateTime: `${todayISO}T05:00:00.000Z`, // 10:30 AM IST
      status: 'CONFIRMED',
      visitType: 'NEW',
      reason: 'General consultation and essential hypertension evaluation',
      notes: 'Patient to present 14-day home blood pressure log.',
    },
    {
      patient: sunita,
      dateTime: `${todayISO}T06:00:00.000Z`, // 11:30 AM IST
      status: 'CHECKED_IN',
      visitType: 'FOLLOW_UP',
      reason: 'Type 2 Diabetes glucose control and HbA1c review',
      notes: 'Patient arrived at clinic waiting lounge. Triaged by Staff Neha.',
    },
    {
      patient: rajesh,
      dateTime: `${todayISO}T06:30:00.000Z`, // 12:00 PM IST
      status: 'IN_CONSULTATION',
      visitType: 'NEW',
      reason: 'Bilateral knee pain management and mobility assessment',
      notes: 'Active consultation in progress with Dr. Priya Mehta in OPD Room 104.',
    },
    {
      patient: meera,
      dateTime: `${todayISO}T08:30:00.000Z`, // 02:00 PM IST
      status: 'REQUESTED',
      visitType: 'FOLLOW_UP',
      reason: 'Second trimester routine prenatal review and nutritional advice',
      notes: 'Requested online via Sehat Saathi patient portal. Awaiting staff confirmation.',
    },
    {
      patient: anita,
      dateTime: `${todayISO}T09:30:00.000Z`, // 03:00 PM IST
      status: 'REQUESTED',
      visitType: 'NEW',
      reason: 'Seasonal allergic rhinitis flare-up and antihistamine review',
      notes: 'Booked via AI Voice Chatbot assistant.',
    },
    {
      patient: vikram,
      dateTime: `${todayISO}T10:30:00.000Z`, // 04:00 PM IST
      status: 'CONFIRMED',
      visitType: 'EMERGENCY',
      reason: 'Acute gastroenteritis follow-up and oral rehydration review',
      notes: 'Confirmed by hospital operations lead.',
    },
    // Past completed encounter for historical 360 view
    {
      patient: aarav,
      dateTime: '2026-08-18T08:30:00.000Z',
      status: 'COMPLETED',
      visitType: 'NEW',
      reason: 'Initial intake consultation and baseline vitals recording',
      notes: 'Diagnosed with Stage 1 Hypertension. Prescribed Telmisartan 20mg.',
    },
  ];

  for (const appt of scheduleRoster) {
    if (!appt.patient) continue;
    const existing = await prisma.appointment.findFirst({
      where: {
        patientId: appt.patient.id,
        doctorId: doctor.id,
        dateTime: appt.dateTime,
      },
    });

    if (existing) {
      await prisma.appointment.update({
        where: { id: existing.id },
        data: {
          status: appt.status,
          visitType: appt.visitType,
          reason: appt.reason,
          notes: appt.notes,
        },
      });
    } else {
      await prisma.appointment.create({
        data: {
          patientId: appt.patient.id,
          doctorId: doctor.id,
          dateTime: appt.dateTime,
          status: appt.status,
          visitType: appt.visitType,
          reason: appt.reason,
          notes: appt.notes,
        },
      });
    }
  }

  // Seed Past Encounter for Aarav
  const existingEncounter = await prisma.encounter.findFirst({
    where: { patientId: aarav.id, doctorId: doctor.id },
  });

  if (!existingEncounter) {
    const pastEnc = await prisma.encounter.create({
      data: {
        patientId: aarav.id,
        doctorId: doctor.id,
        chiefComplaint: 'Morning headaches, home BP 140/90 mmHg',
        symptoms: JSON.stringify(['Headache', 'Mild fatigue']),
        onset: 'Gradual over 2 weeks',
        severity: 'Moderate',
        diagnosis: 'Essential Hypertension (Stage 1)',
        diagnosisIcdCode: 'I10',
        treatmentPlan: 'Prescribed Telmisartan 20mg OD in morning. Advised 30 min daily brisk walking and low sodium diet.',
        riskScore: 42,
        urgency: 'MODERATE',
        suggestedDepartment: 'General Physician',
        status: 'COMPLETED',
      },
    });

    await prisma.prescription.create({
      data: {
        patientId: aarav.id,
        doctorId: doctor.id,
        encounterId: pastEnc.id,
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
        patientId: aarav.id,
        prescribingDoctorId: doctor.id,
        name: 'Telmisartan 20mg',
        dosage: '20mg',
        frequency: 'Once Daily (Morning)',
        startDate: '2026-08-18',
        status: 'ACTIVE',
        notes: 'Take before breakfast',
      },
    });
  }

  console.log('✅ Demo accounts, 8 realistic demo patients, and interconnected appointment schedule are ready.');
  console.log('   Doctor: Dr. Priya Mehta (General Physician) | 9876500002');
  console.log('   Staff: Neha Kapoor | 9876500003');
  console.log('   Patients: Aarav Sharma (9876500001), Sunita Devi, Ramesh Kumar, Meera Patel, Rajesh Verma, Anita Singh, Vikram Malhotra, Kavita Joshi');
  console.log('   Password: Demo@1234');
}

main().catch((error) => {
  console.error('❌ Demo seed failed:', error);
  process.exit(1);
}).finally(async () => {
  await prisma.$disconnect();
});
