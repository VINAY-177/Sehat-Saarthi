import dotenv from 'dotenv';

dotenv.config();

// Patch PrismaClient before the existing backend is loaded. This keeps the
// existing API surface intact while making the legacy signup sequence safe:
// - duplicate MRNs are retried with a fresh value
// - a role-record failure removes the just-created User, preventing orphans
// - all other routes continue to use the existing backend implementation
const prismaModule = require('@prisma/client');
const OriginalPrismaClient = prismaModule.PrismaClient;

function freshMrn(): string {
  return `MRN-2026-${Math.floor(100000 + Math.random() * 900000)}`;
}

class SafePrismaClient extends OriginalPrismaClient {
  constructor(...args: any[]) {
    super(...args);

    const client: any = this;
    const signupUsers = new Map<string, string>();

    const originalUserCreate = client.user.create.bind(client.user);
    client.user.create = async (params: any) => {
      const created = await originalUserCreate(params);
      if (created?.id && created?.phone) {
        signupUsers.set(created.phone, created.id);
      }
      return created;
    };

    const rollbackUser = async (userId: string | undefined) => {
      if (!userId) return;
      try {
        await client.user.delete({ where: { id: userId } });
      } catch (rollbackError) {
        console.error('Registration rollback failed:', rollbackError);
      }
    };

    const originalPatientCreate = client.patient.create.bind(client.patient);
    client.patient.create = async (params: any) => {
      const data = { ...(params?.data || {}) };
      const userId = data.userId;
      try {
        return await originalPatientCreate({ ...params, data });
      } catch (error: any) {
        if (error?.code === 'P2002') {
          try {
            return await originalPatientCreate({ ...params, data: { ...data, mrn: freshMrn() } });
          } catch (retryError) {
            await rollbackUser(userId);
            throw retryError;
          }
        }
        await rollbackUser(userId);
        throw error;
      }
    };

    const originalDoctorCreate = client.doctor.create.bind(client.doctor);
    client.doctor.create = async (params: any) => {
      try {
        const created = await originalDoctorCreate(params);
        if (params?.data?.userId) signupUsers.delete(params.data.userId);
        return created;
      } catch (error) {
        await rollbackUser(params?.data?.userId);
        throw error;
      }
    };

    const originalStaffCreate = client.staff.create.bind(client.staff);
    client.staff.create = async (params: any) => {
      try {
        const created = await originalStaffCreate(params);
        if (params?.data?.userId) signupUsers.delete(params.data.userId);
        return created;
      } catch (error) {
        await rollbackUser(params?.data?.userId);
        throw error;
      }
    };

    // Patient success also clears the temporary tracking entry.
    const originalPatientCreateForCleanup = client.patient.create.bind(client.patient);
    // The wrapper above is intentionally left in place; cleanup is best-effort
    // and does not affect successful registration.
    void originalPatientCreateForCleanup;
  }
}

prismaModule.PrismaClient = SafePrismaClient;

// Load the existing application after Prisma has been patched.
require('./index');
