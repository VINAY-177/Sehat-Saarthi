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
    update: { name: 'Dr. Priya Mehta', specialty: 'General Medicine', department: 'General Medicine & Internal Care', licenseNumber: 'DEMO-DOC-001', phone: '9876500002', email: 'doctor.demo@sehatsaathi.test', facilityId: hospital.id, experience: '8 years', available: true },
    create: { userId: doctorUser.id, name: 'Dr. Priya Mehta', specialty: 'General Medicine', department: 'General Medicine & Internal Care', licenseNumber: 'DEMO-DOC-001', phone: '9876500002', email: 'doctor.demo@sehatsaathi.test', facilityId: hospital.id, experience: '8 years', available: true },
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

  // Reference/demo clinicians. Names supplied by the user are retained exactly;
  // additional names are explicitly synthetic demo data and are not represented as real physicians.
  const clinicians = [
    ['Dr Deepak Agrawal', 'Neurosurgery'], ['Dr PS Chandra', 'Neurosurgery'], ['Dr Rajeev Sharma', 'Neurosurgery'], ['Dr Demo Neeraj Kapoor', 'Neurosurgery'],
    ['Dr Roopa Rajan', 'Neurology'], ['Dr Anu Gupta', 'Neurology'], ['Dr Manjari Tripathi', 'Neurology'], ['Dr Demo Kavya Nair', 'Neurology'],
    ['Dr Rajiv Narang', 'Cardiology'], ['Dr Anita Saxena', 'Cardiology'], ['Dr Demo Arjun Malhotra', 'Cardiology'], ['Dr Demo Meera Iyer', 'Cardiology'],
    ['Dr Demo Rohan Bhatia', 'General Surgery'], ['Dr Demo Nisha Verma', 'General Surgery'], ['Dr Demo Sameer Khanna', 'General Surgery'], ['Dr Demo Pooja Menon', 'General Surgery'],
    ['Dr Demo Vivek Rao', 'Orthopaedics'], ['Dr Demo Aditi Joshi', 'Orthopaedics'], ['Dr Demo Karan Sethi', 'Orthopaedics'], ['Dr Demo Shreya Das', 'Orthopaedics'],
    ['Dr Demo Amit Sen', 'Paediatrics'], ['Dr Demo Ritu Sharma', 'Paediatrics'], ['Dr Demo Manav Gupta', 'Paediatrics'], ['Dr Demo Isha Kapoor', 'Paediatrics'],
    ['Dr Demo Nikhil Arora', 'Gastroenterology'], ['Dr Demo Tanya Mehta', 'Gastroenterology'], ['Dr Demo Rahul Jain', 'Gastroenterology'], ['Dr Demo Simran Kaur', 'Gastroenterology'],
    ['Dr Demo Aditya Bose', 'Dermatology'], ['Dr Demo Neha Sood', 'Dermatology'], ['Dr Demo Varun Shah', 'Dermatology'], ['Dr Demo Rhea Kapoor', 'Dermatology'],
    ['Dr Demo Sanjay Rao', 'Pulmonology'], ['Dr Demo Kavita Nair', 'Pulmonology'], ['Dr Demo Mohit Bansal', 'Pulmonology'], ['Dr Demo Priyanka Das', 'Pulmonology'],
    ['Dr Demo Akash Verma', 'Psychiatry'], ['Dr Demo Radhika Sen', 'Psychiatry'], ['Dr Demo Kunal Mehra', 'Psychiatry'], ['Dr Demo Anjali Roy', 'Psychiatry'],
    ['Dr Demo Harish Mehta', 'Ophthalmology'], ['Dr Demo Sneha Rao', 'Ophthalmology'], ['Dr Demo Deepa Nair', 'Ophthalmology'], ['Dr Demo Yash Malhotra', 'Ophthalmology'],
    ['Dr Demo Manish Arora', 'ENT'], ['Dr Demo Swati Jain', 'ENT'], ['Dr Demo Rohit Sinha', 'ENT'], ['Dr Demo Priti Shah', 'ENT'],
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
      update: { name, specialty, department: specialty, phone, email, facilityId: hospital.id, experience: 'Demo data', available: true },
      create: { userId: user.id, name, specialty, department: specialty, licenseNumber: `DEMO-${String(i + 2).padStart(3, '0')}`, phone, email, facilityId: hospital.id, experience: 'Demo data', available: true },
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
