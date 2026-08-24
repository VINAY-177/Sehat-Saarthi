"use client";

import React, { createContext, useContext, useState, useCallback, ReactNode, useMemo, useEffect } from "react";
import {
  Patient, Screening, Facility, Referral, Role,
  ReferralStatus, Urgency, AuthUser,
} from "@/lib/types";
import { Language, translations, Translations } from "@/lib/i18n";

// ============================================================
// Sehat Saathi AI — In-Memory Data Store & Language Context
// ============================================================

interface StoreState {
  // Language & i18n
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: keyof Translations) => string;

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
const AUTH_STORAGE_KEY = "sehat-saathi-auth";

function generateId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export function DataProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("en");
  const [role, setRole] = useState<Role>(Role.PATIENT);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [screenings, setScreenings] = useState<Screening[]>([]);
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [referrals, setReferrals] = useState<Referral[]>([]);

  // Language translation helper
  const toggleLanguage = useCallback(() => {
    setLanguage((prev) => (prev === "en" ? "hi" : "en"));
  }, []);

  const t = useCallback(
    (key: keyof Translations): string => {
      const dict = translations[language] || translations.en;
      return dict[key] || translations.en[key] || String(key);
    },
    [language]
  );

  const login = useCallback((user: AuthUser) => {
    setIsAuthenticated(true);
    setCurrentUser(user);
    setRole(user.role);
    if (typeof window !== "undefined") {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    }
  }, []);

  const logout = useCallback(() => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  }, []);

  // Restore auth from localStorage
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = localStorage.getItem(AUTH_STORAGE_KEY);
      if (!raw) return;
      const user = JSON.parse(raw) as AuthUser;
      if (user?.id && user?.role) {
        setIsAuthenticated(true);
        setCurrentUser(user);
        setRole(user.role);
      }
    } catch {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  }, []);

  // Sync store with backend on mount
  useEffect(() => {
    const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

    fetch(`${API}/api/patients`).then(r => r.ok ? r.json() : []).then((data: Patient[]) => {
      if (Array.isArray(data) && data.length > 0) {
        setPatients(data);
      }
    }).catch(() => {});

    interface ApiHospital {
      id: string;
      name: string;
      type?: string;
      district?: string;
      state?: string;
      lat?: number;
      lng?: number;
      totalBeds?: number;
      availableBeds?: number;
      icuBeds?: number;
      availableIcu?: number;
      specialties?: string;
      phone?: string;
    }

    fetch(`${API}/api/hospitals`).then(r => r.ok ? r.json() : []).then((data: ApiHospital[]) => {
      if (Array.isArray(data) && data.length > 0) {
        const mapped: Facility[] = data.map((h, idx) => ({
          id: h.id,
          name: h.name,
          type: (h.type === "Private" ? "Private" : "Government") as Facility["type"],
          district: h.district ?? "New Delhi",
          state: h.state ?? "Delhi",
          lat: h.lat ?? (28.6139 + (idx % 4 - 2) * 0.03),
          lng: h.lng ?? (77.2090 + (Math.floor(idx / 4) - 1) * 0.03),
          generalBeds: h.totalBeds ?? 100,
          generalBedsUsed: Math.max(0, (h.totalBeds ?? 100) - (h.availableBeds ?? 20)),
          icuBeds: h.icuBeds ?? 20,
          icuBedsUsed: Math.max(0, (h.icuBeds ?? 20) - (h.availableIcu ?? 5)),
          privateRooms: 10,
          privateRoomsUsed: 2,
          doctors: [],
          equipment: [],
          specialists: h.specialties ? h.specialties.split(",") : ["General Medicine"],
          bloodStock: { "O+": 10, "O-": 5, "A+": 12, "A-": 4, "B+": 14, "B-": 3, "AB+": 6, "AB-": 2 },
          pmjayEmpanelled: true,
          phone: h.phone || "011-23404440",
        }));
        setFacilities(mapped);
      }
    }).catch(() => {});

    interface ApiReferral {
      id: string;
      patientId?: string;
      patientName?: string;
      toHospitalName?: string;
      toHospitalId?: string;
      doctorName?: string;
      specialty?: string;
      urgency?: Referral["urgency"];
      reason?: string;
      status?: Referral["status"];
      createdAt?: string;
    }

    fetch(`${API}/api/referrals`).then(r => r.ok ? r.json() : []).then((data: ApiReferral[]) => {
      if (Array.isArray(data) && data.length > 0) {
        const mapped: Referral[] = data.map(ref => ({
          id: ref.id,
          patientId: ref.patientId ?? "",
          patientName: ref.patientName ?? "",
          fromFacility: "",
          toFacility: ref.toHospitalName ?? "",
          toHospitalId: ref.toHospitalId ?? "",
          doctorName: ref.doctorName ?? "",
          specialty: ref.specialty ?? "",
          urgency: ref.urgency || Urgency.MODERATE,
          reason: ref.reason ?? "",
          status: ref.status || ReferralStatus.PENDING,
          createdAt: ref.createdAt ?? new Date().toISOString(),
        }));
        setReferrals(mapped);
      }
    }).catch(() => {});
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
    return screenings.filter(s => s.patientId === patientId);
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

  // Computed aggregate stats
  const stats = useMemo(() => {
    return {
      totalPatients: patients.length,
      totalScreenings: screenings.length,
      emergencyCases: screenings.filter(s => s.urgency === "EMERGENCY").length,
      pendingReferrals: referrals.filter(r => r.status === ReferralStatus.PENDING).length,
      totalFacilities: facilities.length,
      totalICUAvailable: facilities.reduce((sum, f) => sum + (f.icuBeds - f.icuBedsUsed), 0),
      totalGeneralAvailable: facilities.reduce((sum, f) => sum + (f.generalBeds - f.generalBedsUsed), 0),
      totalPrivateRoomsAvailable: facilities.reduce((sum, f) => sum + (f.privateRooms - f.privateRoomsUsed), 0),
    };
  }, [patients, screenings, referrals, facilities]);

  const value: StoreState = {
    language,
    setLanguage,
    toggleLanguage,
    t,
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
