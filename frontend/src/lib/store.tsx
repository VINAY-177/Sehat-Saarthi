"use client";

import React, { createContext, useContext, useState, useCallback, ReactNode, useMemo, useEffect } from "react";
import {
  Patient, Screening, Facility, Referral, Role,
  ReferralStatus, Urgency, AuthUser,
} from "@/lib/types";
import { Language, translations, Translations } from "@/lib/i18n";

// ============================================================
// Sehat Saathi AI — Reactive Data Store & Language Context
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

  // Auth & Session
  token: string | null;
  isAuthenticated: boolean;
  currentUser: AuthUser | null;
  login: (user: AuthUser, token?: string) => void;
  logout: () => void;
  getAuthHeaders: () => Record<string, string>;

  // Patients
  patients: Patient[];
  addPatient: (patient: Omit<Patient, "id" | "createdAt">) => Patient;
  getPatient: (id: string) => Patient | undefined;
  refreshPatients: () => Promise<void>;

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
  refreshReferrals: () => Promise<void>;

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
const TOKEN_STORAGE_KEY = "sehat-saathi-token";

function generateId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export function DataProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("en");
  const [role, setRole] = useState<Role>(Role.PATIENT);
  const [token, setToken] = useState<string | null>(null);
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

  const getAuthHeaders = useCallback((): Record<string, string> => {
    const activeToken = token || (typeof window !== "undefined" ? localStorage.getItem(TOKEN_STORAGE_KEY) : null);
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (activeToken) {
      headers["Authorization"] = `Bearer ${activeToken}`;
    }
    return headers;
  }, [token]);

  const login = useCallback((user: AuthUser, authToken?: string) => {
    setIsAuthenticated(true);
    setCurrentUser(user);
    setRole(user.role);
    if (authToken) {
      setToken(authToken);
    }
    if (typeof window !== "undefined") {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
      if (authToken) {
        localStorage.setItem(TOKEN_STORAGE_KEY, authToken);
      }
    }
  }, []);

  const logout = useCallback(() => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    setToken(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem(AUTH_STORAGE_KEY);
      localStorage.removeItem(TOKEN_STORAGE_KEY);
    }
  }, []);

  // Restore auth from localStorage and re-fetch /api/auth/me to verify
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const savedToken = localStorage.getItem(TOKEN_STORAGE_KEY);
      const raw = localStorage.getItem(AUTH_STORAGE_KEY);
      if (savedToken) {
        setToken(savedToken);
      }
      if (raw) {
        const user = JSON.parse(raw) as AuthUser;
        if (user?.id && user?.role) {
          setIsAuthenticated(true);
          setCurrentUser(user);
          setRole(user.role);
        }
      }

      // Verify token with backend
      if (savedToken) {
        const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
        fetch(`${API}/api/auth/me`, {
          headers: { Authorization: `Bearer ${savedToken}` },
        })
          .then((r) => (r.ok ? r.json() : null))
          .then((verifiedUser) => {
            if (verifiedUser) {
              const mappedUser: AuthUser = {
                id: verifiedUser.id,
                name: verifiedUser.name,
                role: verifiedUser.role as Role,
                phone: verifiedUser.phone,
                email: verifiedUser.email || `${verifiedUser.phone}@sehatsaathi.in`,
                patientId: verifiedUser.patientId,
                doctorId: verifiedUser.doctorId,
                staffId: verifiedUser.staffId,
                facilityId: verifiedUser.facilityId,
              };
              setCurrentUser(mappedUser);
              setRole(mappedUser.role);
              localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(mappedUser));
            }
          })
          .catch(() => {});
      }
    } catch {
      localStorage.removeItem(AUTH_STORAGE_KEY);
      localStorage.removeItem(TOKEN_STORAGE_KEY);
    }
  }, []);

  // Fetch patients from PostgreSQL backend
  const refreshPatients = useCallback(async () => {
    const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
    try {
      const res = await fetch(`${API}/api/patients`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          setPatients(data);
        }
      }
    } catch (err) {
      console.warn("Failed to fetch patients from API:", err);
    }
  }, []);

  // Fetch referrals from backend
  const refreshReferrals = useCallback(async () => {
    const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
    try {
      const res = await fetch(`${API}/api/referrals`);
      if (res.ok) {
        interface ApiReferralItem {
          id: string;
          patientId?: string;
          patientName?: string;
          toHospitalName?: string;
          toHospitalId?: string;
          doctorName?: string;
          specialty?: string;
          urgency?: Urgency;
          reason?: string;
          status?: ReferralStatus;
          createdAt?: string;
        }
        const data = await res.json();
        if (Array.isArray(data)) {
          const mapped: Referral[] = data.map((ref: ApiReferralItem) => ({
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
      }
    } catch (err) {
      console.warn("Failed to fetch referrals from API:", err);
    }
  }, []);

  // Sync store with backend on mount
  useEffect(() => {
    const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

    refreshPatients();
    refreshReferrals();

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
  }, [refreshPatients, refreshReferrals]);

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
    token,
    isAuthenticated,
    currentUser,
    login,
    logout,
    getAuthHeaders,
    patients,
    addPatient,
    getPatient,
    refreshPatients,
    screenings,
    addScreening,
    getScreeningsForPatient,
    facilities,
    updateFacility,
    referrals,
    addReferral,
    updateReferralStatus,
    refreshReferrals,
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
