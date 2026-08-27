import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

dotenv.config();

const expressModule = require('express');
const prismaModule = require('@prisma/client');
const OriginalPrismaClient = prismaModule.PrismaClient;
const JWT_SECRET = process.env.JWT_SECRET || 'sehat_saathi_sih_jwt_secret_key_2026';

function freshMrn(): string {
  return `MRN-2026-${Math.floor(100000 + Math.random() * 900000)}`;
}

async function signupHandler(req: any, res: any) {
  const prisma = new OriginalPrismaClient();

  try {
    const raw = req.body || {};
    const name = typeof raw.name === 'string' ? raw.name.trim() : '';
    const phone = typeof raw.phone === 'string' ? raw.phone.trim() : '';
    const email = typeof raw.email === 'string' && raw.email.trim() ? raw.email.trim().toLowerCase() : null;
    const password = typeof raw.password === 'string' ? raw.password : '';
    const role = typeof raw.role === 'string' ? raw.role : 'PATIENT';
    const specialty = typeof raw.specialty === 'string' && raw.specialty.trim()
      ? raw.specialty.trim()
      : 'General Medicine';
    const facilityId = typeof raw.facilityId === 'string' && raw.facilityId.trim()
      ? raw.facilityId.trim()
      : null;

    if (!name || !phone || !password) {
      return res.status(400).json({ error: 'Name, phone number, and password are required' });
    }
    if (password.length < 4) {
      return res.status(400).json({ error: 'Password must be at least 4 characters long' });
    }

    const allowedRoles = new Set(['PATIENT', 'CITIZEN', 'DOCTOR', 'HOSPITAL_STAFF']);
    if (!allowedRoles.has(role)) {
      return res.status(400).json({ error: 'Invalid account role' });
    }

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { phone },
          ...(email ? [{ email }] : []),
        ],
      },
      select: { id: true },
    });

    if (existingUser) {
      return res.status(409).json({ error: 'An account with this phone number or email already exists' });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const result = await prisma.$transaction(async (tx: any) => {
      const user = await tx.user.create({
        data: { name, phone, email, passwordHash, role },
      });

      let patientId: string | undefined;
      let doctorId: string | undefined;
      let staffId: string | undefined;
      let linkedFacilityId: string | undefined;

      if (role === 'PATIENT' || role === 'CITIZEN') {
        let patient: any;
        for (let attempt = 0; attempt < 5; attempt += 1) {
          try {
            patient = await tx.patient.create({
              data: {
                userId: user.id,
                mrn: freshMrn(),
                name,
                phone,
                email,
                age: 30,
                gender: 'Other',
                district: 'New Delhi',
                state: 'Delhi',
              },
            });
            break;
          } catch (err: any) {
            if (err?.code !== 'P2002' || attempt === 4) throw err;
          }
        }
        patientId = patient.id;
      } else if (role === 'DOCTOR') {
        if (facilityId) {
          const facility = await tx.hospital.findUnique({ where: { id: facilityId }, select: { id: true } });
          if (!facility) throw Object.assign(new Error('Selected facility was not found'), { code: 'FACILITY_NOT_FOUND' });
        }
        const doctor = await tx.doctor.create({
          data: {
            userId: user.id,
            name,
            specialty,
            phone,
            email,
            facilityId,
            available: true,
          },
        });
        doctorId = doctor.id;
        linkedFacilityId = doctor.facilityId || undefined;
      } else {
        if (facilityId) {
          const facility = await tx.hospital.findUnique({ where: { id: facilityId }, select: { id: true } });
          if (!facility) throw Object.assign(new Error('Selected facility was not found'), { code: 'FACILITY_NOT_FOUND' });
        }
        const staff = await tx.staff.create({
          data: {
            userId: user.id,
            name,
            phone,
            email,
            facilityId,
            role: 'NURSE',
          },
        });
        staffId = staff.id;
        linkedFacilityId = staff.facilityId || undefined;
      }

      return { user, patientId, doctorId, staffId, facilityId: linkedFacilityId || facilityId || undefined };
    });

    const tokenPayload = {
      userId: result.user.id,
      name: result.user.name,
      role: result.user.role,
      phone: result.user.phone,
      email: result.user.email,
      patientId: result.patientId,
      doctorId: result.doctorId,
      staffId: result.staffId,
      facilityId: result.facilityId,
    };

    const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: '7d' });
    return res.status(201).json({
      message: 'Account created successfully',
      token,
      user: tokenPayload,
    });
  } catch (error: any) {
    console.error('Signup error:', {
      code: error?.code,
      message: error?.message,
      meta: error?.meta,
      correlationId: req.correlationId,
    });

    if (error?.code === 'P2002') {
      const target = Array.isArray(error?.meta?.target) ? error.meta.target.join(', ') : '';
      return res.status(409).json({
        error: target.includes('phone')
          ? 'An account with this phone number already exists'
          : target.includes('email')
            ? 'An account with this email already exists'
            : 'This account information is already registered',
      });
    }

    if (error?.code === 'FACILITY_NOT_FOUND') {
      return res.status(400).json({ error: 'Selected facility was not found' });
    }

    if (error?.code === 'P2003') {
      return res.status(400).json({ error: 'One of the selected account details is invalid' });
    }

    return res.status(503).json({ error: 'Registration service is temporarily unavailable. Please try again.' });
  } finally {
    await prisma.$disconnect().catch(() => undefined);
  }
}

// Intercept only the signup registration route before the existing backend is
// loaded. Every other route remains exactly as implemented in index.ts.
const originalPost = expressModule.application.post;
expressModule.application.post = function patchedPost(this: any, path: any, ...handlers: any[]) {
  if (path === '/api/auth/signup') {
    return originalPost.call(this, path, signupHandler);
  }
  return originalPost.call(this, path, ...handlers);
};

require('./index');
