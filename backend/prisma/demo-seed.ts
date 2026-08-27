import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Sehat Saathi: ensuring demo accounts exist...');

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
      specialties: 'General Medicine,Cardiology,Paediatrics,Orthopaedics,Emergency',
    },
  });

  const doctorUser = await prisma.user.upsert({
    where: { phone: '9876500002' },
    update: {
      name: 'Dr. Priya Mehta',
      email: 'doctor.demo@sehatsaathi.test',
      passwordHash,
      role: 'DOCTOR',
    },
    create: {
      name: 'Dr. Priya Mehta',
      phone: '9876500002',
      email: 'doctor.demo@sehatsaathi.test',
      passwordHash,
      role: 'DOCTOR',
    },
  });

  await prisma.doctor.upsert({
    where: { userId: doctorUser.id },
    update: {
      name: 'Dr. Priya Mehta',
      specialty: 'General Medicine',
      department: 'General Medicine & Internal Care',
      licenseNumber: 'DEMO-DOC-001',
      phone: '9876500002',
      email: 'doctor.demo@sehatsaathi.test',
      facilityId: hospital.id,
      experience: '8 years',
      available: true,
    },
    create: {
      userId: doctorUser.id,
      name: 'Dr. Priya Mehta',
      specialty: 'General Medicine',
      department: 'General Medicine & Internal Care',
      licenseNumber: 'DEMO-DOC-001',
      phone: '9876500002',
      email: 'doctor.demo@sehatsaathi.test',
      facilityId: hospital.id,
      experience: '8 years',
      available: true,
    },
  });

  const staffUser = await prisma.user.upsert({
    where: { phone: '9876500003' },
    update: {
      name: 'Neha Kapoor',
      email: 'staff.demo@sehatsaathi.test',
      passwordHash,
      role: 'HOSPITAL_STAFF',
    },
    create: {
      name: 'Neha Kapoor',
      phone: '9876500003',
      email: 'staff.demo@sehatsaathi.test',
      passwordHash,
      role: 'HOSPITAL_STAFF',
    },
  });

  await prisma.staff.upsert({
    where: { userId: staffUser.id },
    update: {
      name: 'Neha Kapoor',
      role: 'Hospital Operations',
      phone: '9876500003',
      email: 'staff.demo@sehatsaathi.test',
      facilityId: hospital.id,
    },
    create: {
      userId: staffUser.id,
      name: 'Neha Kapoor',
      role: 'Hospital Operations',
      phone: '9876500003',
      email: 'staff.demo@sehatsaathi.test',
      facilityId: hospital.id,
    },
  });

  const patientUser = await prisma.user.upsert({
    where: { phone: '9876500001' },
    update: {
      name: 'Aarav Sharma',
      email: 'patient.demo@sehatsaathi.test',
      passwordHash,
      role: 'PATIENT',
    },
    create: {
      name: 'Aarav Sharma',
      phone: '9876500001',
      email: 'patient.demo@sehatsaathi.test',
      passwordHash,
      role: 'PATIENT',
    },
  });

  await prisma.patient.upsert({
    where: { userId: patientUser.id },
    update: {
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
    },
    create: {
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
    },
  });

  console.log('✅ Demo accounts are ready. Password for all three: Demo@1234');
  console.log('   Patient: 9876500001');
  console.log('   Doctor:  9876500002');
  console.log('   Staff:   9876500003');
}

main()
  .catch((error) => {
    console.error('❌ Demo seed failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
