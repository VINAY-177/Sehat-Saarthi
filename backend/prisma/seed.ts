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

  // NCR Hospitals (Southwest Delhi, Noida, Greater Noida, Ghaziabad, Gurugram, Faridabad)
  await prisma.hospital.createMany({
    data: [
      {
        id: 'hosp-igh-dwarka',
        name: 'Indira Gandhi Hospital Dwarka',
        type: 'Government',
        district: 'South West Delhi',
        state: 'Delhi',
        location: 'Sector 9 Dwarka, New Delhi 110077',
        phone: '011-28033100',
        lat: 28.5828,
        lng: 77.0622,
        totalBeds: 350,
        availableBeds: 42,
        icuBeds: 35,
        availableIcu: 5,
        specialties: 'Emergency,Orthopaedics,General Surgery,Paediatrics,Obstetrics & Gynaecology',
      },
      {
        id: 'hosp-rtrm-najafgarh',
        name: 'RTRM Hospital Najafgarh',
        type: 'District',
        district: 'South West Delhi',
        state: 'Delhi',
        location: 'Jaffarpur Kalan, Najafgarh, Delhi 110073',
        phone: '011-25018661',
        lat: 28.5412,
        lng: 76.9275,
        totalBeds: 200,
        availableBeds: 32,
        icuBeds: 18,
        availableIcu: 3,
        specialties: 'General Medicine,Emergency,Maternal & Child Health,Surgery',
      },
      {
        id: 'hosp-district-noida',
        name: 'District Combined Hospital Noida',
        type: 'Government',
        district: 'Gautam Budh Nagar',
        state: 'Uttar Pradesh',
        location: 'Sector 39, Noida 201301',
        phone: '0120-2502100',
        lat: 28.5658,
        lng: 77.3524,
        totalBeds: 300,
        availableBeds: 38,
        icuBeds: 25,
        availableIcu: 4,
        specialties: 'General Medicine,Emergency,Obstetrics & Gynaecology,Paediatrics,Surgery',
      },
      {
        id: 'hosp-fortis-noida',
        name: 'Fortis Hospital Noida',
        type: 'Tertiary',
        district: 'Gautam Budh Nagar',
        state: 'Uttar Pradesh',
        location: 'B-22, Sector 62, Noida 201301',
        phone: '0120-4300222',
        lat: 28.6189,
        lng: 77.3725,
        totalBeds: 200,
        availableBeds: 28,
        icuBeds: 40,
        availableIcu: 6,
        specialties: 'Cardiology,Neurology,Orthopaedics,Oncology,Critical Care',
      },
      {
        id: 'hosp-jaypee-noida',
        name: 'Jaypee Hospital',
        type: 'Tertiary',
        district: 'Gautam Budh Nagar',
        state: 'Uttar Pradesh',
        location: 'Sector 128, Noida 201304',
        phone: '0120-4122222',
        lat: 28.5135,
        lng: 77.3758,
        totalBeds: 525,
        availableBeds: 62,
        icuBeds: 70,
        availableIcu: 8,
        specialties: 'Cardiology,Neurosurgery,Oncology,Organ Transplant,Gastroenterology',
      },
      {
        id: 'hosp-felix-noida',
        name: 'Felix Hospital Noida',
        type: 'Specialized',
        district: 'Gautam Budh Nagar',
        state: 'Uttar Pradesh',
        location: 'Sector 137, Noida 201305',
        phone: '0120-4888888',
        lat: 28.5495,
        lng: 77.3928,
        totalBeds: 150,
        availableBeds: 22,
        icuBeds: 20,
        availableIcu: 3,
        specialties: 'General Medicine,Emergency,Paediatrics,Obstetrics & Gynaecology',
      },
      {
        id: 'hosp-gims-grnoida',
        name: 'GIMS Greater Noida',
        type: 'Government',
        district: 'Gautam Budh Nagar',
        state: 'Uttar Pradesh',
        location: 'Knowledge Park II, Greater Noida 201310',
        phone: '0120-2341700',
        lat: 28.4682,
        lng: 77.5028,
        totalBeds: 500,
        availableBeds: 58,
        icuBeds: 50,
        availableIcu: 6,
        specialties: 'General Medicine,Surgery,Orthopaedics,Paediatrics,Pulmonology,Emergency',
      },
      {
        id: 'hosp-sharda-grnoida',
        name: 'Sharda Hospital',
        type: 'Specialized',
        district: 'Gautam Budh Nagar',
        state: 'Uttar Pradesh',
        location: 'Knowledge Park III, Greater Noida 201306',
        phone: '0120-4590300',
        lat: 28.4735,
        lng: 77.4831,
        totalBeds: 350,
        availableBeds: 44,
        icuBeds: 40,
        availableIcu: 5,
        specialties: 'Cardiology,Neurology,Nephrology,General Medicine,Surgery,Emergency',
      },
      {
        id: 'hosp-yatharth-grnoida',
        name: 'Yatharth Hospital Greater Noida',
        type: 'Specialized',
        district: 'Gautam Budh Nagar',
        state: 'Uttar Pradesh',
        location: 'Omega 1, Near Pari Chowk, Greater Noida 201310',
        phone: '0120-4857000',
        lat: 28.4715,
        lng: 77.5142,
        totalBeds: 400,
        availableBeds: 48,
        icuBeds: 50,
        availableIcu: 7,
        specialties: 'Cardiology,Orthopaedics,Neurosurgery,Oncology,Critical Care,Gastroenterology',
      },
      {
        id: 'hosp-mmg-ghaziabad',
        name: 'MMG District Hospital Ghaziabad',
        type: 'Government',
        district: 'Ghaziabad',
        state: 'Uttar Pradesh',
        location: 'Sanjay Nagar, Ghaziabad 201001',
        phone: '0120-2793506',
        lat: 28.6882,
        lng: 77.4428,
        totalBeds: 250,
        availableBeds: 30,
        icuBeds: 20,
        availableIcu: 3,
        specialties: 'General Medicine,Surgery,Emergency,Orthopaedics,Obstetrics & Gynaecology',
      },
      {
        id: 'hosp-max-vaishali',
        name: 'Max Super Speciality Hospital Vaishali',
        type: 'Tertiary',
        district: 'Ghaziabad',
        state: 'Uttar Pradesh',
        location: 'Vaishali, Sector 1, Ghaziabad 201010',
        phone: '0120-4016000',
        lat: 28.6438,
        lng: 77.3385,
        totalBeds: 300,
        availableBeds: 36,
        icuBeds: 50,
        availableIcu: 7,
        specialties: 'Cardiology,Oncology,Neurology,Orthopaedics,Gastroenterology,Critical Care',
      },
      {
        id: 'hosp-yashoda-kaushambi',
        name: 'Yashoda Super Speciality Hospital Kaushambi',
        type: 'Specialized',
        district: 'Ghaziabad',
        state: 'Uttar Pradesh',
        location: 'Kaushambi, Ghaziabad 201010',
        phone: '0120-4182000',
        lat: 28.6445,
        lng: 77.3218,
        totalBeds: 350,
        availableBeds: 40,
        icuBeds: 45,
        availableIcu: 6,
        specialties: 'Cardiology,Neurology,Nephrology,Urology,Gastroenterology,Orthopaedics',
      },
      {
        id: 'hosp-medanta-gurugram',
        name: 'Medanta — The Medicity',
        type: 'Tertiary',
        district: 'Gurugram',
        state: 'Haryana',
        location: 'Sector 38, Gurugram 122001',
        phone: '0124-4141414',
        lat: 28.4398,
        lng: 77.0425,
        totalBeds: 1250,
        availableBeds: 120,
        icuBeds: 150,
        availableIcu: 15,
        specialties: 'Cardiology,Neurosurgery,Oncology,Organ Transplant,Liver Transplant,Robotics Surgery',
      },
      {
        id: 'hosp-fortis-gurugram',
        name: 'Fortis Memorial Research Institute',
        type: 'Tertiary',
        district: 'Gurugram',
        state: 'Haryana',
        location: 'Sector 44, Gurugram 122002',
        phone: '0124-4962200',
        lat: 28.4595,
        lng: 77.0725,
        totalBeds: 310,
        availableBeds: 38,
        icuBeds: 70,
        availableIcu: 9,
        specialties: 'Oncology,Cardiology,Orthopaedics,Neurology,Urology,Critical Care',
      },
      {
        id: 'hosp-civil-gurugram',
        name: 'Civil Hospital Gurugram',
        type: 'Government',
        district: 'Gurugram',
        state: 'Haryana',
        location: 'Sector 10A, Gurugram 122001',
        phone: '0124-2322412',
        lat: 28.4602,
        lng: 77.0325,
        totalBeds: 450,
        availableBeds: 52,
        icuBeds: 40,
        availableIcu: 5,
        specialties: 'General Medicine,Emergency,Surgery,Orthopaedics,Obstetrics & Gynaecology,Paediatrics',
      },
      {
        id: 'hosp-amrita-faridabad',
        name: 'Amrita Hospital Faridabad',
        type: 'Tertiary',
        district: 'Faridabad',
        state: 'Haryana',
        location: 'Sector 88, Greater Faridabad 121002',
        phone: '0129-2854000',
        lat: 28.4215,
        lng: 77.3685,
        totalBeds: 2400,
        availableBeds: 280,
        icuBeds: 200,
        availableIcu: 22,
        specialties: 'Cardiology,Neurology,Oncology,Organ Transplant,Gastroenterology,Nephrology,Pulmonology',
      },
      {
        id: 'hosp-bk-faridabad',
        name: 'B.K. Civil Hospital Faridabad',
        type: 'Government',
        district: 'Faridabad',
        state: 'Haryana',
        location: 'NIT, Faridabad 121001',
        phone: '0129-2418183',
        lat: 28.3985,
        lng: 77.3045,
        totalBeds: 400,
        availableBeds: 48,
        icuBeds: 35,
        availableIcu: 4,
        specialties: 'General Medicine,Emergency,Surgery,Orthopaedics,Paediatrics,Obstetrics & Gynaecology',
      },
    ],
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
      specialty: 'General Physician',
      department: 'General Physician',
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

  // ============================================================
  // 3. 8 Comprehensive Demo Patients Registry
  // ============================================================
  console.log('👤 Seeding 8 Comprehensive Demo Patients Registry...');

  const demoPatientsData = [
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

  const createdPatientsMap: Record<string, any> = {};
  const createdPatientUsersMap: Record<string, any> = {};

  for (const item of demoPatientsData) {
    const user = await prisma.user.create({
      data: {
        name: item.name,
        phone: item.phone,
        email: item.email,
        passwordHash: demoPasswordHash,
        role: 'PATIENT',
      },
    });

    const pat = await prisma.patient.create({
      data: {
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

    createdPatientsMap[item.mrn] = pat;
    createdPatientUsersMap[item.mrn] = user;

    // Vitals
    await prisma.vital.create({
      data: {
        patientId: pat.id,
        ...item.vitals,
      },
    });

    // Conditions
    for (const cond of item.conditions) {
      await prisma.medicalCondition.create({
        data: {
          patientId: pat.id,
          ...cond,
        },
      });
    }

    // Allergies
    for (const allg of item.allergies) {
      await prisma.allergy.create({
        data: {
          patientId: pat.id,
          ...allg,
        },
      });
    }
  }

  const patient = createdPatientsMap['MRN-2026-0001'];
  const patientUser = createdPatientUsersMap['MRN-2026-0001'];
  const sunita = createdPatientsMap['MRN-2026-0002'];
  const ramesh = createdPatientsMap['MRN-2026-0003'];
  const meera = createdPatientsMap['MRN-2026-0004'];
  const rajesh = createdPatientsMap['MRN-2026-0005'];
  const anita = createdPatientsMap['MRN-2026-0006'];
  const vikram = createdPatientsMap['MRN-2026-0007'];

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
      suggestedDepartment: 'General Physician',
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
  // 4. Interconnected Appointments Roster (Covering All Lifecycles)
  // ============================================================
  console.log('📅 Seeding Interconnected Appointments Across All Lifecycles...');

  const todayStr = new Date().toISOString().split('T')[0];

  const fullAppointmentsRoster = [
    {
      patientId: ramesh.id,
      doctorId: doctor.id,
      dateTime: `${todayStr}T04:00:00.000Z`,
      status: 'COMPLETED',
      visitType: 'FOLLOW_UP',
      reason: 'Chronic COPD respiratory assessment and inhaler technique review',
      notes: 'Consultation concluded. SpO2 maintained at 94% on room air.',
    },
    {
      patientId: patient.id,
      doctorId: doctor.id,
      dateTime: `${todayStr}T05:00:00.000Z`,
      status: 'CONFIRMED',
      visitType: 'NEW',
      reason: 'General Consultation & Essential Hypertension Evaluation',
      notes: 'Patient to present home blood pressure logs.',
    },
    {
      patientId: sunita.id,
      doctorId: doctor.id,
      dateTime: `${todayStr}T06:00:00.000Z`,
      status: 'CHECKED_IN',
      visitType: 'FOLLOW_UP',
      reason: 'Type 2 Diabetes glucose control and HbA1c review',
      notes: 'Patient arrived at clinic waiting lounge. Triaged by Staff Neha.',
    },
    {
      patientId: rajesh.id,
      doctorId: doctor.id,
      dateTime: `${todayStr}T06:30:00.000Z`,
      status: 'IN_CONSULTATION',
      visitType: 'NEW',
      reason: 'Bilateral knee pain management and mobility assessment',
      notes: 'Active consultation in progress with Dr. Priya Mehta in OPD Room 104.',
    },
    {
      patientId: meera.id,
      doctorId: doctor.id,
      dateTime: `${todayStr}T08:30:00.000Z`,
      status: 'REQUESTED',
      visitType: 'FOLLOW_UP',
      reason: 'Second trimester routine prenatal review and nutritional advice',
      notes: 'Requested online via Sehat Saathi patient portal. Awaiting staff confirmation.',
    },
    {
      patientId: anita.id,
      doctorId: doctor.id,
      dateTime: `${todayStr}T09:30:00.000Z`,
      status: 'REQUESTED',
      visitType: 'NEW',
      reason: 'Seasonal allergic rhinitis flare-up and antihistamine review',
      notes: 'Booked via AI Voice Chatbot assistant.',
    },
    {
      patientId: vikram.id,
      doctorId: doctor.id,
      dateTime: `${todayStr}T10:30:00.000Z`,
      status: 'CONFIRMED',
      visitType: 'EMERGENCY',
      reason: 'Acute gastroenteritis follow-up and oral rehydration review',
      notes: 'Confirmed by hospital operations lead.',
    },
    {
      patientId: patient.id,
      doctorId: doctor.id,
      dateTime: '2026-08-18T08:30:00.000Z',
      status: 'COMPLETED',
      visitType: 'NEW',
      reason: 'Initial intake consultation and baseline vitals recording',
      notes: 'Diagnosed with Stage 1 Hypertension. Prescribed Telmisartan 20mg.',
    },
  ];

  for (const appt of fullAppointmentsRoster) {
    await prisma.appointment.create({
      data: appt,
    });
  }

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
