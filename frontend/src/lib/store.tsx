"use client";

import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";
import {
  Patient, Screening, Facility, Referral, Role, Urgency,
  ReferralStatus, AuthUser,
} from "@/lib/types";
// ============================================================
// Sehat Saathi AI — In-Memory Data Store
// React Context-based global state.
// Designed for easy swap to Supabase/Prisma later.
// ============================================================

interface StoreState {
  // Current role
  role: Role;
  setRole: (role: Role) => void;

  // Auth
  isAuthenticated: boolean;
  currentUser: AuthUser | null;
  login: (user: AuthUser) => void;
  logout: () => void;

  // Patients
  patients: Patient[];
  addPatient: (patient: Omit<Patient, "id" | "createdAt">) => Patient;
  getPatient: (id: string) => Patient | undefined;

  // Screenings
  screenings: Screening[];
  addScreening: (screening: Omit<Screening, "id" | "createdAt">) => Screening;
  getScreeningsForPatient: (patientId: string) => Screening[];

  // Facilities
  facilities: Facility[];
  updateFacility: (id: string, updates: Partial<Facility>) => void;

  // Referrals
  referrals: Referral[];
  addReferral: (referral: Omit<Referral, "id" | "createdAt">) => Referral;
  updateReferralStatus: (id: string, status: ReferralStatus) => void;

  // Stats
  stats: {
    totalPatients: number;
    totalScreenings: number;
    emergencyCases: number;
    pendingReferrals: number;
    totalFacilities: number;
    totalICUAvailable: number;
    totalGeneralAvailable: number;
    totalPrivateRoomsAvailable: number;
  };
}

const StoreContext = createContext<StoreState | null>(null);

function generateId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export function DataProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<Role>(Role.PATIENT);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [screenings, setScreenings] = useState<Screening[]>([]);
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [referrals, setReferrals] = useState<Referral[]>([]);

  const login = useCallback((user: AuthUser) => {
    setIsAuthenticated(true);
    setCurrentUser(user);
    setRole(user.role);
  }, []);

  const logout = useCallback(() => {
    setIsAuthenticated(false);
    setCurrentUser(null);
  }, []);

  // ---------- Patient operations ----------

  const addPatient = useCallback((data: Omit<Patient, "id" | "createdAt">): Patient => {
    const patient: Patient = {
      ...data,
      id: generateId("pat"),
      createdAt: new Date().toISOString(),
    };
    setPatients(prev => [patient, ...prev]);
    return patient;
  }, []);

  const getPatient = useCallback((id: string): Patient | undefined => {
    return patients.find(p => p.id === id);
  }, [patients]);

  // ---------- Screening operations ----------

  const addScreening = useCallback((data: Omit<Screening, "id" | "createdAt">): Screening => {
    const screening: Screening = {
      ...data,
      id: generateId("scr"),
      createdAt: new Date().toISOString(),
    };
    setScreenings(prev => [screening, ...prev]);
    return screening;
  }, []);

  const getScreeningsForPatient = useCallback((patientId: string): Screening[] => {
    return screenings
      .filter(s => s.patientId === patientId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [screenings]);

  // ---------- Facility operations ----------

  const updateFacility = useCallback((id: string, updates: Partial<Facility>) => {
    setFacilities(prev =>
      prev.map(f => (f.id === id ? { ...f, ...updates } : f))
    );
  }, []);

  // ---------- Referral operations ----------

  const addReferral = useCallback((data: Omit<Referral, "id" | "createdAt">): Referral => {
    const referral: Referral = {
      ...data,
      id: generateId("ref"),
      createdAt: new Date().toISOString(),
    };
    setReferrals(prev => [referral, ...prev]);
    return referral;
  }, []);

  const updateReferralStatus = useCallback((id: string, status: ReferralStatus) => {
    setReferrals(prev =>
      prev.map(r => (r.id === id ? { ...r, status } : r))
    );
  }, []);

  // ---------- Computed stats ----------

  const stats = {
    totalPatients: patients.length,
    totalScreenings: screenings.length,
    emergencyCases: screenings.filter(s => s.urgency === Urgency.EMERGENCY).length,
    pendingReferrals: referrals.filter(r => r.status === ReferralStatus.PENDING).length,
    totalFacilities: facilities.length,
    totalICUAvailable: facilities.reduce((sum, f) => sum + (f.icuBeds - f.icuBedsUsed), 0),
    totalGeneralAvailable: facilities.reduce((sum, f) => sum + (f.generalBeds - f.generalBedsUsed), 0),
    totalPrivateRoomsAvailable: facilities.reduce((sum, f) => sum + (f.privateRooms - f.privateRoomsUsed), 0),
  };

  const value: StoreState = {
    role,
    setRole,
    isAuthenticated,
    currentUser,
    login,
    logout,
    patients,
    addPatient,
    getPatient,
    screenings,
    addScreening,
    getScreeningsForPatient,
    facilities,
    updateFacility,
    referrals,
    addReferral,
    updateReferralStatus,
    stats,
  };

  return (
    <StoreContext.Provider value={value}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore(): StoreState {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error("useStore must be used within a DataProvider");
  }
  return context;
}
