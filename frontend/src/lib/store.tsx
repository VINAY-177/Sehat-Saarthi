"use client";

import React, { createContext, useContext, useState, useCallback, ReactNode, useMemo, useEffect } from "react";
import {
  Patient, Screening, Facility, Referral, Role,
  ReferralStatus, Urgency, AuthUser, Appointment, Notification,
} from "@/lib/types";
import { Language, translations, Translations } from "@/lib/i18n";
import { apiGet, apiPost, apiPatch } from "@/lib/api";
import { MASTER_DELHI_108_DATASET } from "./delhi-hospitals-dataset";

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
  updateUserProfile: (profileData: Partial<AuthUser>) => Promise<boolean>;
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
  addReferral: (referral: Omit<Referral, "id" | "createdAt">) => Promise<Referral>;
  updateReferralStatus: (id: string, status: ReferralStatus) => Promise<void>;
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

  // Appointments
  appointments: Appointment[];
  refreshAppointments: () => Promise<void>;
  createAppointment: (data: Partial<Appointment>) => Promise<Appointment>;
  updateAppointmentStatus: (id: string, status: string) => Promise<Appointment>;

  // Notifications
  notifications: Notification[];
  refreshNotifications: () => Promise<void>;
  markNotificationRead: (id: string) => Promise<void>;
  markAllNotificationsRead: () => Promise<void>;
}

const StoreContext = createContext<StoreState | null>(null);
const AUTH_STORAGE_KEY = "sehat-saathi-auth";
const TOKEN_STORAGE_KEY = "sehat-saathi-token";

function generateId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export const DEFAULT_DELHI_HOSPITALS: Facility[] = MASTER_DELHI_108_DATASET;

export function DataProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("en");
  const [role, setRole] = useState<Role>(Role.PATIENT);
  const [token, setToken] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [screenings, setScreenings] = useState<Screening[]>([]);
  const [facilities, setFacilities] = useState<Facility[]>(DEFAULT_DELHI_HOSPITALS);
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);

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
                patientId: verifiedUser.patientId || verifiedUser.patient?.id,
                doctorId: verifiedUser.doctorId || verifiedUser.doctor?.id,
                staffId: verifiedUser.staffId || verifiedUser.staff?.id,
                facilityId: verifiedUser.facilityId || verifiedUser.doctor?.facilityId || verifiedUser.staff?.facilityId,
                facilityName: verifiedUser.facilityName || verifiedUser.doctor?.facility?.name || verifiedUser.staff?.facility?.name,
                specialty: verifiedUser.specialty || verifiedUser.doctor?.specialty,
                dateOfBirth: verifiedUser.patient?.dateOfBirth,
                age: verifiedUser.patient?.age,
                gender: verifiedUser.patient?.gender,
                bloodGroup: verifiedUser.patient?.bloodGroup,
                address: verifiedUser.patient?.address,
                village: verifiedUser.patient?.village,
                city: verifiedUser.patient?.city,
                district: verifiedUser.patient?.district,
                state: verifiedUser.patient?.state,
                pincode: verifiedUser.patient?.pincode,
                emergencyContactName: verifiedUser.patient?.emergencyContactName,
                emergencyContactPhone: verifiedUser.patient?.emergencyContactPhone,
                emergencyContactRelation: verifiedUser.patient?.emergencyContactRelation,
                allergies: Array.isArray(verifiedUser.patient?.allergies)
                  ? verifiedUser.patient.allergies.map((a: { allergen?: string } | string) => typeof a === 'string' ? a : (a?.allergen || '')).filter(Boolean)
                  : [],
                conditions: Array.isArray(verifiedUser.patient?.conditions)
                  ? verifiedUser.patient.conditions.map((c: { name?: string } | string) => typeof c === 'string' ? c : (c?.name || '')).filter(Boolean)
                  : [],
                registrationNumber: verifiedUser.doctor?.licenseNumber,
                department: verifiedUser.doctor?.department || verifiedUser.staff?.role,
                experience: verifiedUser.doctor?.experience,
                designation: verifiedUser.staff?.role,
                createdAt: verifiedUser.createdAt,
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

  const updateUserProfile = useCallback(async (profileData: Partial<AuthUser>): Promise<boolean> => {
    const activeToken = token || (typeof window !== "undefined" ? localStorage.getItem(TOKEN_STORAGE_KEY) : null);
    const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

    try {
      const res = await fetch(`${API}/api/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(activeToken ? { Authorization: `Bearer ${activeToken}` } : {}),
        },
        body: JSON.stringify(profileData),
      });

      const data = await res.json();
      if (res.ok && data.user) {
        const u = data.user;
        const updatedAuthUser: AuthUser = {
          id: u.id,
          name: u.name,
          role: u.role as Role,
          phone: u.phone,
          email: u.email || `${u.phone}@sehatsaathi.in`,
          patientId: u.patientId || u.patient?.id,
          doctorId: u.doctorId || u.doctor?.id,
          staffId: u.staffId || u.staff?.id,
          facilityId: u.facilityId,
          facilityName: u.facilityName,
          specialty: u.specialty,
          dateOfBirth: u.patient?.dateOfBirth || profileData.dateOfBirth,
          age: u.patient?.age ?? profileData.age,
          gender: u.patient?.gender || profileData.gender,
          bloodGroup: u.patient?.bloodGroup || profileData.bloodGroup,
          address: u.patient?.address || profileData.address,
          village: u.patient?.village || profileData.village,
          city: u.patient?.city || profileData.city,
          district: u.patient?.district || profileData.district,
          state: u.patient?.state || profileData.state,
          pincode: u.patient?.pincode || profileData.pincode,
          emergencyContactName: u.patient?.emergencyContactName || profileData.emergencyContactName,
          emergencyContactPhone: u.patient?.emergencyContactPhone || profileData.emergencyContactPhone,
          emergencyContactRelation: u.patient?.emergencyContactRelation || profileData.emergencyContactRelation,
          allergies: Array.isArray(u.patient?.allergies)
            ? u.patient.allergies.map((a: { allergen?: string } | string) => typeof a === 'string' ? a : (a?.allergen || '')).filter(Boolean)
            : (profileData.allergies || []),
          conditions: Array.isArray(u.patient?.conditions)
            ? u.patient.conditions.map((c: { name?: string } | string) => typeof c === 'string' ? c : (c?.name || '')).filter(Boolean)
            : (profileData.conditions || []),
          registrationNumber: u.doctor?.licenseNumber || profileData.registrationNumber,
          department: u.doctor?.department || u.staff?.role || profileData.department,
          experience: u.doctor?.experience || profileData.experience,
          designation: u.staff?.role || profileData.designation,
          insuranceProvider: profileData.insuranceProvider ?? currentUser?.insuranceProvider ?? "Ayushman Bharat PM-JAY",
          insurancePolicyNumber: profileData.insurancePolicyNumber ?? currentUser?.insurancePolicyNumber ?? "AB-PMJAY-9182-4410",
          insuranceType: profileData.insuranceType ?? currentUser?.insuranceType ?? "Government Scheme (PM-JAY)",
          insuranceCoverageAmount: profileData.insuranceCoverageAmount ?? currentUser?.insuranceCoverageAmount ?? "₹5,00,000 / Year",
          insuranceValidTill: profileData.insuranceValidTill ?? currentUser?.insuranceValidTill ?? "31-Mar-2027",
          insuranceTpa: profileData.insuranceTpa ?? currentUser?.insuranceTpa ?? "National Health Authority (NHA)",
          insuranceStatus: profileData.insuranceStatus ?? currentUser?.insuranceStatus ?? "ACTIVE",
        };

        setCurrentUser(updatedAuthUser);
        if (data.token) {
          setToken(data.token);
          if (typeof window !== "undefined") {
            localStorage.setItem(TOKEN_STORAGE_KEY, data.token);
          }
        }
        if (typeof window !== "undefined") {
          localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(updatedAuthUser));
        }
        return true;
      }
    } catch (err) {
      console.warn("Backend update error, falling back to client store:", err);
    }

    // Fallback client store update
    if (currentUser) {
      const updated = { ...currentUser, ...profileData };
      setCurrentUser(updated as AuthUser);
      if (typeof window !== "undefined") {
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(updated));
      }
      return true;
    }
    return false;
  }, [currentUser, token]);

  // Fetch patients from PostgreSQL backend (authenticated)
  const refreshPatients = useCallback(async () => {
    try {
      const data = await apiGet<Patient[]>("/api/patients");
      if (Array.isArray(data)) {
        setPatients(data);
      }
    } catch (err) {
      console.warn("Failed to fetch patients from API:", err);
    }
  }, []);

  // Fetch referrals from backend
  const refreshReferrals = useCallback(async () => {
    try {
      const data = await apiGet<Referral[]>("/api/referrals");
      if (Array.isArray(data)) {
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
        const mapped: Referral[] = (data as unknown as ApiReferralItem[]).map((ref: ApiReferralItem) => ({
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
    } catch (err) {
      console.warn("Failed to fetch referrals from API:", err);
    }
  }, []);

  // Fetch appointments from PostgreSQL backend
  const refreshAppointments = useCallback(async () => {
    try {
      const data = await apiGet<Appointment[]>("/api/appointments");
      if (Array.isArray(data)) {
        setAppointments(data);
      }
    } catch (err) {
      console.warn("Failed to fetch appointments from API:", err);
    }
  }, []);

  const createAppointment = useCallback(async (appointmentData: Partial<Appointment>): Promise<Appointment> => {
    const created = await apiPost<Appointment>("/api/appointments", appointmentData);
    setAppointments((previous) => [created, ...previous.filter((appointment) => appointment.id !== created.id)]);
    return created;
  }, []);

  const updateAppointmentStatus = useCallback(async (id: string, newStatus: string): Promise<Appointment> => {
    const updated = await apiPatch<Appointment>(`/api/appointments/${id}/status`, { status: newStatus });
    setAppointments((prev) => prev.map((a) => a.id === id ? { ...a, ...updated } : a));
    return updated;
  }, []);

  const refreshNotifications = useCallback(async () => {
    const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
    const activeToken = token || (typeof window !== "undefined" ? localStorage.getItem(TOKEN_STORAGE_KEY) : null);
    if (!activeToken) return;
    try {
      const userId = currentUser?.id;
      const role = currentUser?.role;
      const params = new URLSearchParams();
      if (userId) params.set('userId', userId);
      if (role) params.set('role', role);
      const res = await fetch(`${API}/api/notifications?${params.toString()}`, {
        headers: { Authorization: `Bearer ${activeToken}` },
      });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          setNotifications(data);
        }
      }
    } catch (err) {
      console.warn("Failed to fetch notifications from API:", err);
    }
  }, [token, currentUser]);

  const markNotificationRead = useCallback(async (id: string) => {
    const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
    const activeToken = token || (typeof window !== "undefined" ? localStorage.getItem(TOKEN_STORAGE_KEY) : null);
    try {
      await fetch(`${API}/api/notifications/${id}/read`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(activeToken ? { Authorization: `Bearer ${activeToken}` } : {}),
        },
        body: JSON.stringify({ read: true }),
      });
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    } catch (err) {
      console.warn("Failed to mark notification as read:", err);
    }
  }, [token]);

  const markAllNotificationsRead = useCallback(async () => {
    const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
    const activeToken = token || (typeof window !== "undefined" ? localStorage.getItem(TOKEN_STORAGE_KEY) : null);
    try {
      await fetch(`${API}/api/notifications/read-all`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(activeToken ? { Authorization: `Bearer ${activeToken}` } : {}),
        },
      });
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch (err) {
      console.warn("Failed to mark all notifications as read:", err);
    }
  }, [token]);

  // Sync store with backend on mount and auth change
  useEffect(() => {
    refreshPatients();
    refreshReferrals();
    refreshAppointments();
    refreshNotifications();
  }, [token, isAuthenticated, refreshPatients, refreshReferrals, refreshAppointments, refreshNotifications]);

  // Load facilities from backend
  useEffect(() => {
    const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

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
      location?: string;
      city?: string;
      area?: string;
      rating?: number;
      emergencyAvailable?: boolean;
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
          location: h.location,
          city: h.city,
          area: h.area,
          rating: h.rating,
          emergencyAvailable: h.emergencyAvailable !== false,
        }));
        setFacilities(mapped);
      }
      // If API returns empty, keep DEFAULT_DELHI_HOSPITALS (initial state)
    }).catch(() => {
      // On network/API error, keep DEFAULT_DELHI_HOSPITALS (initial state)
    });
  }, [refreshPatients, refreshReferrals, refreshAppointments, refreshNotifications]);

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
    // Sync to backend
    const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
    const activeToken = token || (typeof window !== "undefined" ? localStorage.getItem(TOKEN_STORAGE_KEY) : null);
    const dbUpdates: Record<string, number | string | boolean> = {};
    if (updates.icuBedsUsed !== undefined) dbUpdates.availableIcu = (updates.icuBeds ?? 0) - updates.icuBedsUsed;
    if (updates.generalBedsUsed !== undefined) dbUpdates.availableBeds = (updates.generalBeds ?? 0) - updates.generalBedsUsed;
    if (Object.keys(dbUpdates).length > 0) {
      fetch(`${API}/api/hospitals/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(activeToken ? { Authorization: `Bearer ${activeToken}` } : {}),
        },
        body: JSON.stringify(dbUpdates),
      }).catch(err => console.warn('Failed to sync facility update:', err));
    }
  }, [token]);

  // ---------- Referral operations ----------

  const addReferral = useCallback(async (data: Omit<Referral, "id" | "createdAt">): Promise<Referral> => {
    const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
    const activeToken = token || (typeof window !== "undefined" ? localStorage.getItem(TOKEN_STORAGE_KEY) : null);
    try {
      const res = await fetch(`${API}/api/referrals`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(activeToken ? { Authorization: `Bearer ${activeToken}` } : {}),
        },
        body: JSON.stringify({
          patientId: data.patientId,
          patientName: data.patientName,
          toHospitalId: data.toHospitalId || data.toFacilityId || '',
          toHospitalName: data.toHospitalName || data.toFacilityName || 'General Hospital',
          doctorName: data.doctorName,
          specialty: data.specialty,
          urgency: data.urgency,
          reason: data.reason,
          status: data.status || 'PENDING',
        }),
      });
      if (res.ok) {
        const created = await res.json();
        await refreshReferrals();
        return created;
      }
    } catch (err) {
      console.warn("Failed to create referral via API:", err);
    }
    // Fallback to client-side
    const referral: Referral = {
      ...data,
      id: `ref-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      createdAt: new Date().toISOString(),
    };
    setReferrals(prev => [referral, ...prev]);
    return referral;
  }, [token, refreshReferrals]);

  const updateReferralStatus = useCallback(async (id: string, status: ReferralStatus) => {
    const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
    const activeToken = token || (typeof window !== "undefined" ? localStorage.getItem(TOKEN_STORAGE_KEY) : null);
    // Optimistic update
    setReferrals(prev => prev.map(r => (r.id === id ? { ...r, status } : r)));
    try {
      await fetch(`${API}/api/referrals/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(activeToken ? { Authorization: `Bearer ${activeToken}` } : {}),
        },
        body: JSON.stringify({ status }),
      });
    } catch (err) {
      console.warn("Failed to update referral status via API:", err);
    }
  }, [token]);

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
    updateUserProfile,
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
    appointments,
    refreshAppointments,
    createAppointment,
    updateAppointmentStatus,
    notifications,
    refreshNotifications,
    markNotificationRead,
    markAllNotificationsRead,
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
