import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding Sehat Saathi PostgreSQL database...\n');

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

  const defaultPasswordHash = await bcrypt.hash('SehatSaathi@2026', 10);

  // ============================================================
  // 1. Delhi Government Hospitals
  // ============================================================
  console.log('🏥 Seeding Delhi Government Hospitals...');
  const aiims = await prisma.hospital.create({
    data: {
      name: 'AIIMS New Delhi',
      type: 'Government',
      district: 'South Delhi',
      state: 'Delhi',
      location: 'Ansari Nagar, New Delhi 110029',
      phone: '011-26588500',
      lat: 28.5672,
      lng: 77.2100,
      totalBeds: 2478,
      availableBeds: 186,
      icuBeds: 250,
      availableIcu: 18,
      specialties: 'Cardiology,Neurology,Oncology,Trauma,Orthopaedics,Nephrology',
    },
  });

  const safdarjung = await prisma.hospital.create({
    data: {
      name: 'Safdarjung Hospital',
      type: 'Government',
      district: 'South Delhi',
      state: 'Delhi',
      location: 'Ansari Nagar West, Ring Road, New Delhi 110029',
      phone: '011-26707444',
      lat: 28.5684,
      lng: 77.2066,
      totalBeds: 1531,
      availableBeds: 92,
      icuBeds: 150,
      availableIcu: 9,
      specialties: 'Orthopaedics,Burns,Surgery,General Medicine,Emergency',
    },
  });

  const rml = await prisma.hospital.create({
    data: {
      name: 'Dr. Ram Manohar Lohia Hospital',
      type: 'Government',
      district: 'New Delhi',
      state: 'Delhi',
      location: 'Baba Kharak Singh Marg, New Delhi 110001',
      phone: '011-23404440',
      lat: 28.6254,
      lng: 77.2015,
      totalBeds: 1420,
      availableBeds: 110,
      icuBeds: 120,
      availableIcu: 14,
      specialties: 'Cardiology,General Medicine,Surgery,Paediatrics,Neurology',
    },
  });

  const lnjp = await prisma.hospital.create({
    data: {
      name: 'Lok Nayak Hospital (LNJP)',
      type: 'Government',
      district: 'Central Delhi',
      state: 'Delhi',
      location: 'Jawaharlal Nehru Marg, New Delhi 110002',
      phone: '011-23236000',
      lat: 28.6384,
      lng: 77.2394,
      totalBeds: 2000,
      availableBeds: 240,
      icuBeds: 180,
      availableIcu: 16,
      specialties: 'General Medicine,Surgery,Paediatrics,Dermatology,Emergency',
    },
  });

  // ============================================================
  // 2. Demo Users & Clinical Staff
  // ============================================================
  console.log('👤 Seeding Users, Doctors, Staff and Patients...');

  // Doctor 1: Dr. Rajesh Kumar
  const doctor1User = await prisma.user.create({
    data: {
      name: 'Dr. Rajesh Kumar',
      phone: '9876543210',
      email: 'rajesh.kumar@aiims.gov.in',
      passwordHash: defaultPasswordHash,
      role: 'DOCTOR',
    },
  });

  const doctor1 = await prisma.doctor.create({
    data: {
      userId: doctor1User.id,
      name: 'Dr. Rajesh Kumar',
      specialty: 'Cardiology',
      department: 'Cardiology & Critical Care',
      licenseNumber: 'DMC-2014-48291',
      phone: '9876543210',
      email: 'rajesh.kumar@aiims.gov.in',
      facilityId: aiims.id,
      experience: '12 Years',
      available: true,
    },
  });

  // Doctor 2: Dr. Priya Sharma
  const doctor2User = await prisma.user.create({
    data: {
      name: 'Dr. Priya Sharma',
      phone: '9876543211',
      email: 'priya.sharma@safdarjung.gov.in',
      passwordHash: defaultPasswordHash,
      role: 'DOCTOR',
    },
  });

  const doctor2 = await prisma.doctor.create({
    data: {
      userId: doctor2User.id,
      name: 'Dr. Priya Sharma',
      specialty: 'General Medicine',
      department: 'Internal Medicine',
      licenseNumber: 'DMC-2018-62910',
      phone: '9876543211',
      email: 'priya.sharma@safdarjung.gov.in',
      facilityId: safdarjung.id,
      experience: '8 Years',
      available: true,
    },
  });

  // Staff User: Sunita Sharma (Operations Lead / Nurse)
  const staffUser = await prisma.user.create({
    data: {
      name: 'Sunita Sharma (Nurse)',
      phone: '9876543220',
      email: 'sunita.sharma@aiims.gov.in',
      passwordHash: defaultPasswordHash,
      role: 'HOSPITAL_STAFF',
    },
  });

  await prisma.staff.create({
    data: {
      userId: staffUser.id,
      name: 'Sunita Sharma (Nurse)',
      role: 'NURSE',
      phone: '9876543220',
      email: 'sunita.sharma@aiims.gov.in',
      facilityId: aiims.id,
    },
  });

  // Patient 1: Ramesh Kumar
  const patient1User = await prisma.user.create({
    data: {
      name: 'Ramesh Kumar',
      phone: '9876543230',
      email: 'ramesh.kumar@example.com',
      passwordHash: defaultPasswordHash,
      role: 'PATIENT',
    },
  });

  const patient1 = await prisma.patient.create({
    data: {
      userId: patient1User.id,
      mrn: 'MRN-2026-0001',
      name: 'Ramesh Kumar',
      age: 52,
      gender: 'Male',
      bloodGroup: 'B+',
      phone: '9876543230',
      email: 'ramesh.kumar@example.com',
      dateOfBirth: '1974-05-12',
      address: 'House No. 42, Gali No. 3',
      village: 'Najafgarh',
      district: 'South West Delhi',
      state: 'Delhi',
      pincode: '110043',
      emergencyContactName: 'Geeta Kumar',
      emergencyContactPhone: '9876543239',
      emergencyContactRelation: 'Spouse',
      riskLevel: 'HIGH',
      incomeCategory: 'BPL',
      abhaLinked: true,
      abhaId: '91-4820-1928-3841',
    },
  });

  // Patient 2: Sunita Devi
  const patient2User = await prisma.user.create({
    data: {
      name: 'Sunita Devi',
      phone: '9876543231',
      email: 'sunita.devi@example.com',
      passwordHash: defaultPasswordHash,
      role: 'PATIENT',
    },
  });

  const patient2 = await prisma.patient.create({
    data: {
      userId: patient2User.id,
      mrn: 'MRN-2026-0002',
      name: 'Sunita Devi',
      age: 46,
      gender: 'Female',
      bloodGroup: 'O+',
      phone: '9876543231',
      email: 'sunita.devi@example.com',
      dateOfBirth: '1980-08-20',
      address: 'B-12, Sector 4',
      district: 'North West Delhi',
      state: 'Delhi',
      pincode: '110085',
      emergencyContactName: 'Vikram Singh',
      emergencyContactPhone: '9876543238',
      emergencyContactRelation: 'Brother',
      riskLevel: 'MODERATE',
      incomeCategory: 'EWS',
      abhaLinked: false,
    },
  });

  // Patient 3: Amit Patel
  const patient3 = await prisma.patient.create({
    data: {
      mrn: 'MRN-2026-0003',
      name: 'Amit Patel',
      age: 29,
      gender: 'Male',
      bloodGroup: 'A+',
      phone: '9876543232',
      district: 'Central Delhi',
      state: 'Delhi',
      riskLevel: 'LOW',
      incomeCategory: 'APL',
    },
  });

  // ============================================================
  // 3. Clinical Data (Vitals, Conditions, Encounters)
  // ============================================================
  console.log('🩺 Seeding Clinical Encounters and Vitals...');

  // Patient 1 Vitals & Condition
  await prisma.vital.create({
    data: {
      patientId: patient1.id,
      temperature: 37.2,
      bpSystolic: 145,
      bpDiastolic: 92,
      heartRate: 88,
      respiratoryRate: 18,
      spO2: 96,
      height: 172,
      weight: 78,
      bmi: 26.4,
    },
  });

  await prisma.medicalCondition.create({
    data: {
      patientId: patient1.id,
      name: 'Hypertension Stage 2',
      icdCode: 'I10',
      status: 'ACTIVE',
    },
  });

  await prisma.allergy.create({
    data: {
      patientId: patient1.id,
      allergen: 'Penicillin',
      type: 'DRUG',
      severity: 'SEVERE',
      reaction: 'Anaphylaxis / Skin Urticaria',
    },
  });

  // Clinical Encounter for Patient 1
  const encounter1 = await prisma.encounter.create({
    data: {
      patientId: patient1.id,
      doctorId: doctor1.id,
      chiefComplaint: 'Chest tightness, elevated blood pressure & mild dyspnea',
      symptoms: JSON.stringify(['Chest pain', 'Shortness of breath', 'Headache']),
      onset: 'Gradual over 3 days',
      severity: 'Moderate',
      diagnosis: 'Essential Hypertension with Angina Pectoris Symptoms',
      diagnosisIcdCode: 'I20.9',
      treatmentPlan: 'Prescribed Amlodipine 5mg OD + Telmisartan 40mg OD. Advised low salt diet & ECG monitoring.',
      riskScore: 78,
      urgency: 'HIGH',
      status: 'COMPLETED',
    },
  });

  // Prescription
  await prisma.prescription.create({
    data: {
      patientId: patient1.id,
      doctorId: doctor1.id,
      encounterId: encounter1.id,
      date: new Date().toISOString().split('T')[0],
      notes: 'Take medications post meals regularly.',
      items: {
        create: [
          {
            medicationName: 'Telmisartan 40mg',
            dosage: '40mg',
            frequency: 'Once Daily (Morning)',
            duration: '30 days',
            instructions: 'Take with water before breakfast',
          },
          {
            medicationName: 'Amlodipine 5mg',
            dosage: '5mg',
            frequency: 'Once Daily (Night)',
            duration: '30 days',
            instructions: 'Take after dinner',
          },
        ],
      },
    },
  });

  // ============================================================
  // 4. Appointments & Referrals
  // ============================================================
  console.log('📅 Seeding Appointments & Referrals...');

  await prisma.appointment.create({
    data: {
      patientId: patient1.id,
      doctorId: doctor1.id,
      dateTime: new Date(Date.now() + 86400000).toISOString(),
      status: 'CONFIRMED',
      visitType: 'FOLLOW_UP',
      reason: 'Hypertension and cardiac follow-up review',
    },
  });

  await prisma.appointment.create({
    data: {
      patientId: patient2.id,
      doctorId: doctor2.id,
      dateTime: new Date(Date.now() + 172800000).toISOString(),
      status: 'CONFIRMED',
      visitType: 'NEW',
      reason: 'General health checkup and seasonal fever evaluation',
    },
  });

  await prisma.referral.create({
    data: {
      patientId: patient1.id,
      patientName: patient1.name,
      fromHospitalId: lnjp.id,
      toHospitalId: aiims.id,
      toHospitalName: aiims.name,
      doctorName: doctor1.name,
      specialty: 'Cardiology',
      status: 'PENDING',
      urgency: 'HIGH',
      reason: 'Coronary Angiography and Advanced Cardiac Consultation',
    },
  });

  // ============================================================
  // 5. Emergency Requests (108 SOS)
  // ============================================================
  console.log('🚑 Seeding Emergency 108 SOS Records...');

  await prisma.emergencyRequest.create({
    data: {
      phone: '9876543299',
      location: 'Near Najafgarh Metro Station, Pillar 42, New Delhi',
      emergencyType: 'CARDIAC',
      patientName: 'Kishore Sharma',
      age: 58,
      gender: 'Male',
      assignedHospitalId: aiims.id,
      assignedHospitalName: aiims.name,
      ambulanceId: '108-AMB-4029',
      status: 'EN_ROUTE',
      etaMinutes: 6,
      notes: 'Acute chest pain with sweating reported by family.',
    },
  });

  console.log('\n✅ Database seeding completed successfully!');
  console.log('----------------------------------------------------');
  console.log('Demo Credentials for Testing:');
  console.log('Doctor:  Phone 9876543210 | Password SehatSaathi@2026');
  console.log('Staff:   Phone 9876543220 | Password SehatSaathi@2026');
  console.log('Patient: Phone 9876543230 | Password SehatSaathi@2026');
  console.log('----------------------------------------------------');
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
