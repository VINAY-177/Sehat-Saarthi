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

  await prisma.doctor.upsert({
    where: { userId: doctorUser.id },
    update: { name: 'Dr. Priya Mehta', specialty: 'General Physician', department: 'General Physician', licenseNumber: 'DEMO-DOC-001', phone: '9876500002', email: 'doctor.demo@sehatsaathi.test', facilityId: hospital.id, experience: '8 years', available: true },
    create: { userId: doctorUser.id, name: 'Dr. Priya Mehta', specialty: 'General Physician', department: 'General Physician', licenseNumber: 'DEMO-DOC-001', phone: '9876500002', email: 'doctor.demo@sehatsaathi.test', facilityId: hospital.id, experience: '8 years', available: true },
  });

  const staffUser = await prisma.user.upsert({
    where: { phone: '9876500003' },
    update: { name: 'Neha Kapoor', email: 'staff.demo@sehatsaathi.test', passwordHash, role: 'HOSPITAL_STAFF' },
    create: { name: 'Neha Kapoor', phone: '9876500003', email: 'staff.demo@sehatsaathi.test', passwordHash, role: 'HOSPITAL_STAFF' },
  });

  await prisma.staff.upsert({
    where: { userId: staffUser.id },
    update: { name: 'Neha Kapoor', role: 'Hospital Operations', phone: '9876500003', email: 'staff.demo@sehatsaathi.test', facilityId: hospital.id },
    create: { userId: staffUser.id, name: 'Neha Kapoor', role: 'Hospital Operations', phone: '9876500003', email: 'staff.demo@sehatsaathi.test', facilityId: hospital.id },
  });

  const patientUser = await prisma.user.upsert({
    where: { phone: '9876500001' },
    update: { name: 'Aarav Sharma', email: 'patient.demo@sehatsaathi.test', passwordHash, role: 'PATIENT' },
    create: { name: 'Aarav Sharma', phone: '9876500001', email: 'patient.demo@sehatsaathi.test', passwordHash, role: 'PATIENT' },
  });

  await prisma.patient.upsert({
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

  console.log('✅ Demo accounts and 12 specialties / 4 clinicians each are ready.');
  console.log('   Password for demo accounts: Demo@1234');
  console.log('   Patient: 9876500001 | Doctor: 9876500002 | Staff: 9876500003');
}

main().catch((error) => {
  console.error('❌ Demo seed failed:', error);
  process.exit(1);
}).finally(async () => {
  await prisma.$disconnect();
});
