import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding Sehat Saathi database...\n');

  // ============================================================
  // 1. Hospitals (existing — keep)
  // ============================================================
  console.log('🏥 Seeding Hospitals...');
  const hospitals = await Promise.all([
    prisma.hospital.create({
      data: {
        name: 'AIIMS, New Delhi',
        type: 'Government',
        district: 'New Delhi',
        state: 'Delhi',
        location: 'Ansari Nagar, New Delhi',
        totalBeds: 2500,
        availableBeds: 120,
        icuBeds: 250,
        availableIcu: 15,
        specialties: 'Cardiology,Neurology,Oncology,Trauma,Orthopaedics,Nephrology',
      },
    }),
    prisma.hospital.create({
      data: {
        name: 'Safdarjung Hospital',
        type: 'Government',
        district: 'South Delhi',
        state: 'Delhi',
        location: 'Ring Road, New Delhi',
        totalBeds: 1530,
        availableBeds: 45,
        icuBeds: 150,
        availableIcu: 5,
        specialties: 'Orthopaedics,Burns,Surgery,General Medicine',
      },
    }),
    prisma.hospital.create({
      data: {
        name: 'Fortis Memorial Research Institute',
        type: 'Private',
        district: 'Gurugram',
        state: 'NCR',
        location: 'Sector 44, Gurugram',
        totalBeds: 1000,
        availableBeds: 210,
        icuBeds: 100,
        availableIcu: 25,
        specialties: 'Oncology,Neurology,Cardiology,Transplants',
      },
    }),
    prisma.hospital.create({
      data: {
        name: 'Max Super Speciality Hospital',
        type: 'Private',
        district: 'South Delhi',
        state: 'Delhi',
        location: 'Saket, New Delhi',
        totalBeds: 500,
        availableBeds: 50,
        icuBeds: 75,
        availableIcu: 10,
        specialties: 'Cardiac Sciences,Orthopaedics,Oncology',
      },
    }),
    prisma.hospital.create({
      data: {
        name: 'Lok Nayak Jai Prakash Narayan Hospital (LNJP)',
        type: 'Government',
        district: 'Central Delhi',
        state: 'Delhi',
        location: 'Jawaharlal Nehru Marg, New Delhi',
        totalBeds: 2000,
        availableBeds: 300,
        icuBeds: 200,
        availableIcu: 18,
        specialties: 'General Medicine,Surgery,Paediatrics,Dermatology',
      },
    }),
  ]);
  console.log(`  ✅ ${hospitals.length} hospitals created`);

  // ============================================================
  // 2. Government Schemes (existing — keep)
  // ============================================================
  console.log('📋 Seeding Government Schemes...');
  await prisma.governmentScheme.createMany({
    data: [
      {
        schemeName: 'Ayushman Bharat PM-JAY',
        description: 'National health protection scheme covering ₹5 lakhs per family per year for secondary and tertiary care hospitalization.',
        eligibility: 'BPL families, deprived households per SECC data.',
        coverageAmount: '₹5,00,000',
        officialLink: 'https://pmjay.gov.in',
        stateApplicable: 'National',
      },
      {
        schemeName: 'Delhi Arogya Kosh (DAK)',
        description: 'Financial assistance to needy eligible patients for medical treatment, surgeries, and high-end diagnostics in Delhi.',
        eligibility: 'Residents of Delhi with annual family income up to ₹3 lakhs.',
        coverageAmount: 'Up to ₹5,00,000',
        officialLink: 'https://health.delhigovt.nic.in',
        stateApplicable: 'Delhi',
      },
      {
        schemeName: 'Central Government Health Scheme (CGHS)',
        description: 'Comprehensive medical care to Central Government employees and pensioners in Delhi/NCR.',
        eligibility: 'Central Government employees, pensioners, and their dependents.',
        coverageAmount: 'Varies',
        officialLink: 'https://cghs.nic.in',
        stateApplicable: 'National',
      },
      {
        schemeName: 'Aam Aadmi Mohalla Clinics',
        description: 'Primary health care centers offering free consultations, medicines, and diagnostics in Delhi.',
        eligibility: 'All residents of Delhi.',
        coverageAmount: 'Free Primary Care',
        officialLink: 'https://mohalla.delhi.gov.in',
        stateApplicable: 'Delhi',
      },
    ],
  });
  console.log('  ✅ 4 government schemes created');

  // ============================================================
  // 3. Doctors
  // ============================================================
  console.log('🩺 Seeding Doctors...');
  const doctors = await Promise.all([
    prisma.doctor.create({
      data: {
        name: 'Dr. Priya Sharma',
        specialty: 'Cardiology',
        department: 'Cardiac Sciences',
        licenseNumber: 'DMC-2019-45821',
        phone: '9876501001',
        email: 'priya.sharma@aiims.edu',
        facilityId: hospitals[0].id,
        experience: '12 years',
        available: true,
      },
    }),
    prisma.doctor.create({
      data: {
        name: 'Dr. Rajesh Kumar',
        specialty: 'General Medicine',
        department: 'Internal Medicine',
        licenseNumber: 'DMC-2015-31204',
        phone: '9876501002',
        email: 'rajesh.kumar@safdarjung.in',
        facilityId: hospitals[1].id,
        experience: '18 years',
        available: true,
      },
    }),
    prisma.doctor.create({
      data: {
        name: 'Dr. Anita Verma',
        specialty: 'Orthopaedics',
        department: 'Orthopaedic Surgery',
        licenseNumber: 'DMC-2017-28903',
        phone: '9876501003',
        email: 'anita.verma@maxhealthcare.com',
        facilityId: hospitals[3].id,
        experience: '10 years',
        available: true,
      },
    }),
  ]);
  console.log(`  ✅ ${doctors.length} doctors created`);

  // ============================================================
  // 4. Patients
  // ============================================================
  console.log('👤 Seeding Patients...');
  const patients = await Promise.all([
    prisma.patient.create({
      data: {
        mrn: 'MRN-2025-0001',
        name: 'Amit Sharma',
        dateOfBirth: '1985-03-15',
        age: 40,
        gender: 'Male',
        bloodGroup: 'B+',
        phone: '9811001001',
        email: 'amit.sharma@email.com',
        abhaId: '91-1234-5678-9012',
        abhaLinked: true,
        address: '42, Lajpat Nagar',
        city: 'New Delhi',
        district: 'South Delhi',
        state: 'Delhi',
        pincode: '110024',
        emergencyContactName: 'Sunita Sharma',
        emergencyContactPhone: '9811001010',
        emergencyContactRelation: 'Wife',
        riskLevel: 'HIGH',
        incomeCategory: 'APL',
      },
    }),
    prisma.patient.create({
      data: {
        mrn: 'MRN-2025-0002',
        name: 'Priya Gupta',
        dateOfBirth: '1992-07-22',
        age: 33,
        gender: 'Female',
        bloodGroup: 'O+',
        phone: '9811001002',
        email: 'priya.gupta@email.com',
        abhaId: '91-2345-6789-0123',
        abhaLinked: true,
        address: '15, Rohini Sector 7',
        city: 'New Delhi',
        district: 'North West Delhi',
        state: 'Delhi',
        pincode: '110085',
        emergencyContactName: 'Rakesh Gupta',
        emergencyContactPhone: '9811001020',
        emergencyContactRelation: 'Husband',
        riskLevel: 'LOW',
        incomeCategory: 'APL',
      },
    }),
    prisma.patient.create({
      data: {
        mrn: 'MRN-2025-0003',
        name: 'Ramesh Yadav',
        dateOfBirth: '1968-11-05',
        age: 57,
        gender: 'Male',
        bloodGroup: 'A-',
        phone: '9811001003',
        abhaLinked: false,
        address: '8, Shahdara',
        city: 'New Delhi',
        district: 'East Delhi',
        state: 'Delhi',
        pincode: '110032',
        emergencyContactName: 'Meena Yadav',
        emergencyContactPhone: '9811001030',
        emergencyContactRelation: 'Wife',
        riskLevel: 'EMERGENCY',
        incomeCategory: 'BPL',
      },
    }),
    prisma.patient.create({
      data: {
        mrn: 'MRN-2025-0004',
        name: 'Suman Devi',
        dateOfBirth: '1975-01-30',
        age: 50,
        gender: 'Female',
        bloodGroup: 'AB+',
        phone: '9811001004',
        email: 'suman.devi@email.com',
        abhaLinked: false,
        address: '23, Dwarka Sector 12',
        city: 'New Delhi',
        district: 'South West Delhi',
        state: 'Delhi',
        pincode: '110078',
        emergencyContactName: 'Vikram Singh',
        emergencyContactPhone: '9811001040',
        emergencyContactRelation: 'Son',
        riskLevel: 'MODERATE',
        incomeCategory: 'EWS',
      },
    }),
    prisma.patient.create({
      data: {
        mrn: 'MRN-2025-0005',
        name: 'Arjun Patel',
        dateOfBirth: '2000-09-12',
        age: 25,
        gender: 'Male',
        bloodGroup: 'O-',
        phone: '9811001005',
        email: 'arjun.patel@email.com',
        abhaId: '91-3456-7890-1234',
        abhaLinked: true,
        address: '5, Sector 62',
        city: 'Noida',
        district: 'Gautam Buddh Nagar',
        state: 'Uttar Pradesh',
        pincode: '201301',
        riskLevel: 'LOW',
        incomeCategory: 'APL',
      },
    }),
  ]);
  console.log(`  ✅ ${patients.length} patients created`);

  // ============================================================
  // 5. Medical Conditions
  // ============================================================
  console.log('🏷️ Seeding Medical Conditions...');
  await prisma.medicalCondition.createMany({
    data: [
      { patientId: patients[0].id, name: 'Hypertension', icdCode: 'I10', onsetDate: '2020-06-15', status: 'CHRONIC', notes: 'On medication, controlled' },
      { patientId: patients[0].id, name: 'Type 2 Diabetes Mellitus', icdCode: 'E11', onsetDate: '2021-03-10', status: 'ACTIVE', notes: 'HbA1c last: 7.2%' },
      { patientId: patients[0].id, name: 'Coronary Artery Disease', icdCode: 'I25.1', onsetDate: '2024-01-20', status: 'ACTIVE', notes: 'Stent placed Jan 2024' },
      { patientId: patients[2].id, name: 'COPD', icdCode: 'J44.1', onsetDate: '2018-09-01', status: 'CHRONIC', notes: 'Ex-smoker, on inhalers' },
      { patientId: patients[2].id, name: 'Chronic Kidney Disease Stage 3', icdCode: 'N18.3', onsetDate: '2022-05-20', status: 'ACTIVE', notes: 'eGFR 42 mL/min' },
      { patientId: patients[3].id, name: 'Rheumatoid Arthritis', icdCode: 'M06.9', onsetDate: '2019-11-15', status: 'ACTIVE', notes: 'On DMARDs' },
      { patientId: patients[3].id, name: 'Hypothyroidism', icdCode: 'E03.9', onsetDate: '2017-04-01', status: 'CHRONIC', notes: 'TSH stable on Levothyroxine' },
      { patientId: patients[1].id, name: 'Seasonal Allergic Rhinitis', icdCode: 'J30.2', onsetDate: '2023-03-01', status: 'RESOLVED' },
    ],
  });
  console.log('  ✅ 8 medical conditions created');

  // ============================================================
  // 6. Allergies
  // ============================================================
  console.log('⚠️ Seeding Allergies...');
  await prisma.allergy.createMany({
    data: [
      { patientId: patients[0].id, allergen: 'Penicillin', type: 'DRUG', reaction: 'Skin rash, hives', severity: 'MODERATE' },
      { patientId: patients[0].id, allergen: 'Shellfish', type: 'FOOD', reaction: 'Anaphylaxis', severity: 'SEVERE' },
      { patientId: patients[1].id, allergen: 'Dust mites', type: 'ENVIRONMENTAL', reaction: 'Sneezing, nasal congestion', severity: 'MILD' },
      { patientId: patients[2].id, allergen: 'Aspirin', type: 'DRUG', reaction: 'Bronchospasm', severity: 'SEVERE' },
      { patientId: patients[3].id, allergen: 'Sulfonamides', type: 'DRUG', reaction: 'Skin rash', severity: 'MODERATE' },
    ],
  });
  console.log('  ✅ 5 allergies created');

  // ============================================================
  // 7. Appointments
  // ============================================================
  console.log('📅 Seeding Appointments...');
  const appointments = await Promise.all([
    prisma.appointment.create({
      data: { patientId: patients[0].id, doctorId: doctors[0].id, dateTime: '2025-08-20T10:00:00Z', status: 'COMPLETED', visitType: 'FOLLOW_UP', reason: 'Cardiology follow-up post stent' },
    }),
    prisma.appointment.create({
      data: { patientId: patients[0].id, doctorId: doctors[0].id, dateTime: '2025-09-15T10:30:00Z', status: 'CONFIRMED', visitType: 'FOLLOW_UP', reason: 'Routine cardiac check' },
    }),
    prisma.appointment.create({
      data: { patientId: patients[1].id, doctorId: doctors[1].id, dateTime: '2025-08-18T14:00:00Z', status: 'COMPLETED', visitType: 'NEW', reason: 'Persistent headache and fatigue' },
    }),
    prisma.appointment.create({
      data: { patientId: patients[2].id, doctorId: doctors[1].id, dateTime: '2025-08-22T09:00:00Z', status: 'COMPLETED', visitType: 'EMERGENCY', reason: 'Acute breathlessness and chest pain' },
    }),
    prisma.appointment.create({
      data: { patientId: patients[2].id, doctorId: doctors[0].id, dateTime: '2025-09-01T11:00:00Z', status: 'REQUESTED', visitType: 'FOLLOW_UP', reason: 'Post-emergency cardiac review' },
    }),
    prisma.appointment.create({
      data: { patientId: patients[3].id, doctorId: doctors[2].id, dateTime: '2025-08-25T15:00:00Z', status: 'CHECKED_IN', visitType: 'FOLLOW_UP', reason: 'Joint pain assessment' },
    }),
    prisma.appointment.create({
      data: { patientId: patients[4].id, doctorId: doctors[1].id, dateTime: '2025-08-28T11:30:00Z', status: 'CONFIRMED', visitType: 'NEW', reason: 'Annual health check-up' },
    }),
  ]);
  console.log(`  ✅ ${appointments.length} appointments created`);

  // ============================================================
  // 8. Encounters
  // ============================================================
  console.log('📝 Seeding Encounters...');
  const encounters = await Promise.all([
    prisma.encounter.create({
      data: {
        patientId: patients[0].id,
        doctorId: doctors[0].id,
        appointmentId: appointments[0].id,
        chiefComplaint: 'Follow-up for coronary artery disease post-stent',
        symptoms: JSON.stringify(['Chest pain', 'Breathlessness']),
        onset: 'Gradual',
        severity: 'Moderate',
        hpiNotes: 'Patient reports intermittent chest tightness during exertion. No rest pain. Compliant with medications.',
        diagnosis: 'Stable Angina',
        diagnosisIcdCode: 'I20.8',
        secondaryDiagnoses: JSON.stringify(['Hypertension - controlled', 'T2DM - controlled']),
        clinicalNotes: 'S: Intermittent exertional chest tightness. O: BP 138/88, HR 76, SpO2 97%. A: Stable angina, post-PCI. P: Continue current medications, stress test in 3 months.',
        treatmentPlan: 'Continue Aspirin 75mg, Atorvastatin 40mg, Metoprolol 50mg. Stress test in 3 months.',
        riskScore: 62,
        urgency: 'HIGH',
        riskFactors: JSON.stringify([{ factor: 'Cardiac History', contribution: 25, detail: 'Post-PCI with coronary stent' }, { factor: 'Hypertension', contribution: 15, detail: 'BP 138/88 mmHg' }, { factor: 'Diabetes', contribution: 12, detail: 'HbA1c 7.2%' }]),
        suggestedDepartment: 'Cardiology',
        followUpDate: '2025-11-20',
        status: 'COMPLETED',
      },
    }),
    prisma.encounter.create({
      data: {
        patientId: patients[1].id,
        doctorId: doctors[1].id,
        appointmentId: appointments[2].id,
        chiefComplaint: 'Persistent headache and fatigue for 2 weeks',
        symptoms: JSON.stringify(['Severe headache', 'Weakness / fatigue', 'Dizziness']),
        onset: 'Gradual',
        severity: 'Mild',
        hpiNotes: 'Young female presenting with 2-week history of frontal headaches, worse in the morning. Associated fatigue. No visual changes. No fever.',
        diagnosis: 'Tension-type Headache',
        diagnosisIcdCode: 'G44.2',
        clinicalNotes: 'S: Headache and fatigue x 2 weeks. O: BP 110/70, HR 72, SpO2 99%. Neuro exam normal. A: Tension headache, likely stress-related. P: Paracetamol PRN, stress management, follow up if persistent.',
        treatmentPlan: 'Paracetamol 500mg PRN (max 4/day). Sleep hygiene counseling. Review in 2 weeks if no improvement.',
        riskScore: 18,
        urgency: 'LOW',
        riskFactors: JSON.stringify([{ factor: 'Symptom Duration', contribution: 8, detail: '2 weeks persistent' }]),
        followUpDate: '2025-09-01',
        status: 'COMPLETED',
      },
    }),
    prisma.encounter.create({
      data: {
        patientId: patients[2].id,
        doctorId: doctors[1].id,
        appointmentId: appointments[3].id,
        chiefComplaint: 'Acute breathlessness and chest pain',
        symptoms: JSON.stringify(['Chest pain', 'Breathlessness', 'Dizziness', 'Weakness / fatigue']),
        onset: 'Sudden',
        severity: 'Severe',
        hpiNotes: 'Elderly male brought to ER with sudden onset severe dyspnea and retrosternal chest pain. History of COPD and CKD. Ex-smoker.',
        diagnosis: 'Acute Exacerbation of COPD with Acute Coronary Syndrome',
        diagnosisIcdCode: 'J44.1',
        secondaryDiagnoses: JSON.stringify(['Acute Coronary Syndrome - rule out', 'CKD Stage 3']),
        clinicalNotes: 'S: Sudden dyspnea + chest pain. O: BP 160/100, HR 112, SpO2 88%, RR 28, Temp 37.8°C. Bilateral wheeze. A: AECOPD + possible ACS. P: O2, nebulization, ECG, Troponin, admit ICU.',
        treatmentPlan: 'Oxygen therapy, Nebulized Salbutamol + Ipratropium, IV Methylprednisolone, Serial Troponins, ECG monitoring. ICU admission.',
        riskScore: 89,
        urgency: 'EMERGENCY',
        riskFactors: JSON.stringify([
          { factor: 'Critical SpO2', contribution: 30, detail: 'SpO2 88% - below critical threshold' },
          { factor: 'Tachycardia', contribution: 15, detail: 'HR 112 bpm' },
          { factor: 'Hypertensive Crisis', contribution: 15, detail: 'BP 160/100 mmHg' },
          { factor: 'Multiple Comorbidities', contribution: 20, detail: 'COPD + CKD + possible ACS' },
        ]),
        suggestedDepartment: 'Emergency / Pulmonology',
        status: 'COMPLETED',
      },
    }),
  ]);
  console.log(`  ✅ ${encounters.length} encounters created`);

  // ============================================================
  // 9. Vitals
  // ============================================================
  console.log('💓 Seeding Vitals...');
  await prisma.vital.createMany({
    data: [
      // Patient 1 - historical vitals
      { patientId: patients[0].id, encounterId: encounters[0].id, temperature: 36.8, bpSystolic: 138, bpDiastolic: 88, heartRate: 76, respiratoryRate: 18, spO2: 97, height: 172, weight: 78, bmi: 26.4, recordedAt: new Date('2025-08-20T10:15:00Z') },
      { patientId: patients[0].id, temperature: 36.6, bpSystolic: 142, bpDiastolic: 92, heartRate: 80, respiratoryRate: 16, spO2: 98, recordedAt: new Date('2025-07-15T09:30:00Z') },
      { patientId: patients[0].id, temperature: 37.0, bpSystolic: 135, bpDiastolic: 85, heartRate: 74, respiratoryRate: 17, spO2: 97, recordedAt: new Date('2025-06-10T11:00:00Z') },
      // Patient 2
      { patientId: patients[1].id, encounterId: encounters[1].id, temperature: 36.5, bpSystolic: 110, bpDiastolic: 70, heartRate: 72, respiratoryRate: 16, spO2: 99, height: 162, weight: 58, bmi: 22.1, recordedAt: new Date('2025-08-18T14:15:00Z') },
      // Patient 3 - emergency vitals
      { patientId: patients[2].id, encounterId: encounters[2].id, temperature: 37.8, bpSystolic: 160, bpDiastolic: 100, heartRate: 112, respiratoryRate: 28, spO2: 88, height: 168, weight: 72, bmi: 25.5, recordedAt: new Date('2025-08-22T09:10:00Z') },
      { patientId: patients[2].id, temperature: 37.2, bpSystolic: 148, bpDiastolic: 94, heartRate: 88, respiratoryRate: 22, spO2: 93, recordedAt: new Date('2025-08-22T12:00:00Z') },
      { patientId: patients[2].id, temperature: 36.9, bpSystolic: 140, bpDiastolic: 88, heartRate: 82, respiratoryRate: 20, spO2: 95, recordedAt: new Date('2025-08-22T18:00:00Z') },
      // Patient 4
      { patientId: patients[3].id, temperature: 36.7, bpSystolic: 128, bpDiastolic: 82, heartRate: 78, respiratoryRate: 18, spO2: 98, height: 155, weight: 65, bmi: 27.1, recordedAt: new Date('2025-08-10T15:00:00Z') },
      // Patient 5
      { patientId: patients[4].id, temperature: 36.4, bpSystolic: 118, bpDiastolic: 76, heartRate: 68, respiratoryRate: 14, spO2: 99, height: 178, weight: 70, bmi: 22.1, recordedAt: new Date('2025-08-01T10:00:00Z') },
    ],
  });
  console.log('  ✅ 9 vitals records created');

  // ============================================================
  // 10. Medications
  // ============================================================
  console.log('💊 Seeding Medications...');
  await prisma.medication.createMany({
    data: [
      { patientId: patients[0].id, prescribingDoctorId: doctors[0].id, name: 'Aspirin', dosage: '75mg', frequency: 'Once daily', startDate: '2024-01-25', status: 'ACTIVE' },
      { patientId: patients[0].id, prescribingDoctorId: doctors[0].id, name: 'Atorvastatin', dosage: '40mg', frequency: 'Once daily at bedtime', startDate: '2024-01-25', status: 'ACTIVE' },
      { patientId: patients[0].id, prescribingDoctorId: doctors[0].id, name: 'Metoprolol', dosage: '50mg', frequency: 'Twice daily', startDate: '2024-01-25', status: 'ACTIVE' },
      { patientId: patients[0].id, prescribingDoctorId: doctors[1].id, name: 'Metformin', dosage: '500mg', frequency: 'Twice daily with meals', startDate: '2021-03-15', status: 'ACTIVE' },
      { patientId: patients[0].id, prescribingDoctorId: doctors[1].id, name: 'Telmisartan', dosage: '40mg', frequency: 'Once daily', startDate: '2020-07-01', status: 'ACTIVE' },
      { patientId: patients[2].id, prescribingDoctorId: doctors[1].id, name: 'Salbutamol Inhaler', dosage: '100mcg', frequency: 'As needed', startDate: '2018-09-15', status: 'ACTIVE' },
      { patientId: patients[2].id, prescribingDoctorId: doctors[1].id, name: 'Tiotropium', dosage: '18mcg', frequency: 'Once daily', startDate: '2019-01-01', status: 'ACTIVE' },
      { patientId: patients[3].id, prescribingDoctorId: doctors[2].id, name: 'Methotrexate', dosage: '15mg', frequency: 'Once weekly', startDate: '2020-01-10', status: 'ACTIVE', notes: 'Folic acid supplementation required' },
      { patientId: patients[3].id, prescribingDoctorId: doctors[1].id, name: 'Levothyroxine', dosage: '50mcg', frequency: 'Once daily (empty stomach)', startDate: '2017-04-15', status: 'ACTIVE' },
      { patientId: patients[1].id, prescribingDoctorId: doctors[1].id, name: 'Paracetamol', dosage: '500mg', frequency: 'As needed (max 4/day)', startDate: '2025-08-18', endDate: '2025-09-01', status: 'COMPLETED' },
    ],
  });
  console.log('  ✅ 10 medications created');

  // ============================================================
  // 11. Prescriptions
  // ============================================================
  console.log('📄 Seeding Prescriptions...');
  const rx1 = await prisma.prescription.create({
    data: {
      patientId: patients[0].id,
      doctorId: doctors[0].id,
      encounterId: encounters[0].id,
      date: '2025-08-20',
      notes: 'Continue current cardiac regimen. Review in 3 months.',
      items: {
        create: [
          { medicationName: 'Aspirin', dosage: '75mg', frequency: 'Once daily', duration: '90 days', instructions: 'Take after breakfast' },
          { medicationName: 'Atorvastatin', dosage: '40mg', frequency: 'Once daily', duration: '90 days', instructions: 'Take at bedtime' },
          { medicationName: 'Metoprolol', dosage: '50mg', frequency: 'Twice daily', duration: '90 days', instructions: 'Take with meals' },
        ],
      },
    },
  });
  const rx2 = await prisma.prescription.create({
    data: {
      patientId: patients[1].id,
      doctorId: doctors[1].id,
      encounterId: encounters[1].id,
      date: '2025-08-18',
      notes: 'For tension headache. Review if no improvement in 2 weeks.',
      items: {
        create: [
          { medicationName: 'Paracetamol', dosage: '500mg', frequency: 'As needed', duration: '14 days', instructions: 'Max 4 tablets per day. Take with water.' },
        ],
      },
    },
  });
  console.log('  ✅ 2 prescriptions created');

  // ============================================================
  // 12. Lab Reports
  // ============================================================
  console.log('🔬 Seeding Lab Reports...');
  await prisma.labReport.createMany({
    data: [
      { patientId: patients[0].id, encounterId: encounters[0].id, orderingDoctorId: doctors[0].id, testName: 'HbA1c', category: 'BIOCHEMISTRY', result: '7.2', unit: '%', referenceRange: '4.0 - 5.6', status: 'COMPLETED', reportDate: '2025-08-21' },
      { patientId: patients[0].id, encounterId: encounters[0].id, orderingDoctorId: doctors[0].id, testName: 'Lipid Panel - Total Cholesterol', category: 'LIPID', result: '198', unit: 'mg/dL', referenceRange: '< 200', status: 'COMPLETED', reportDate: '2025-08-21' },
      { patientId: patients[0].id, encounterId: encounters[0].id, orderingDoctorId: doctors[0].id, testName: 'Lipid Panel - LDL', category: 'LIPID', result: '112', unit: 'mg/dL', referenceRange: '< 100', status: 'COMPLETED', reportDate: '2025-08-21', notes: 'Slightly elevated LDL despite statin' },
      { patientId: patients[0].id, orderingDoctorId: doctors[0].id, testName: 'Cardiac Troponin I', category: 'BIOCHEMISTRY', result: '0.02', unit: 'ng/mL', referenceRange: '< 0.04', status: 'COMPLETED', reportDate: '2025-08-20' },
      { patientId: patients[2].id, encounterId: encounters[2].id, orderingDoctorId: doctors[1].id, testName: 'CBC - Hemoglobin', category: 'CBC', result: '11.2', unit: 'g/dL', referenceRange: '13.0 - 17.0', status: 'COMPLETED', reportDate: '2025-08-22', notes: 'Mild anemia' },
      { patientId: patients[2].id, encounterId: encounters[2].id, orderingDoctorId: doctors[1].id, testName: 'Serum Creatinine', category: 'KIDNEY', result: '1.8', unit: 'mg/dL', referenceRange: '0.7 - 1.3', status: 'COMPLETED', reportDate: '2025-08-22', notes: 'Elevated — consistent with CKD Stage 3' },
      { patientId: patients[2].id, orderingDoctorId: doctors[1].id, testName: 'Cardiac Troponin I', category: 'BIOCHEMISTRY', result: '0.08', unit: 'ng/mL', referenceRange: '< 0.04', status: 'COMPLETED', reportDate: '2025-08-22', notes: 'Mildly elevated — serial monitoring' },
    ],
  });
  console.log('  ✅ 7 lab reports created');

  // ============================================================
  // 13. Insurance
  // ============================================================
  console.log('🛡️ Seeding Insurance...');
  await prisma.insurance.createMany({
    data: [
      { patientId: patients[0].id, provider: 'Star Health Insurance', policyNumber: 'SH-2024-789456', coverageType: 'FAMILY', validFrom: '2024-01-01', validTo: '2025-12-31', pmjayStatus: 'NOT_ENROLLED', cghsStatus: 'NOT_APPLICABLE' },
      { patientId: patients[2].id, provider: 'Ayushman Bharat PM-JAY', policyNumber: 'PMJAY-DL-2023-456', coverageType: 'FAMILY', validFrom: '2023-04-01', validTo: '2026-03-31', pmjayStatus: 'ENROLLED', cghsStatus: 'NOT_APPLICABLE' },
      { patientId: patients[3].id, provider: 'Delhi Arogya Kosh', policyNumber: 'DAK-2024-123', coverageType: 'INDIVIDUAL', validFrom: '2024-06-01', validTo: '2025-05-31', pmjayStatus: 'NOT_ENROLLED', cghsStatus: 'NOT_APPLICABLE' },
    ],
  });
  console.log('  ✅ 3 insurance records created');

  // ============================================================
  // 14. Referrals
  // ============================================================
  console.log('🔀 Seeding Referrals...');
  await prisma.referral.createMany({
    data: [
      { patientId: patients[2].id, patientName: 'Ramesh Yadav', toHospitalId: hospitals[0].id, toHospitalName: 'AIIMS, New Delhi', doctorName: 'Dr. Priya Sharma', specialty: 'Cardiology', status: 'ACCEPTED', urgency: 'EMERGENCY', reason: 'Suspected ACS with COPD exacerbation. Requires ICU and cardiac intervention capability.' },
      { patientId: patients[3].id, patientName: 'Suman Devi', toHospitalId: hospitals[3].id, toHospitalName: 'Max Super Speciality Hospital', doctorName: 'Dr. Anita Verma', specialty: 'Orthopaedics', status: 'PENDING', urgency: 'MODERATE', reason: 'Worsening joint deformity in hands. Needs surgical evaluation for possible joint replacement.' },
    ],
  });
  console.log('  ✅ 2 referrals created');

  console.log('\n🎉 Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
