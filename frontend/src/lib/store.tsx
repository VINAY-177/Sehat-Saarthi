"use client";

import React, { createContext, useContext, useState, useCallback, ReactNode, useMemo, useEffect } from "react";
import {
  Patient, Screening, Facility, Referral, Role,
  ReferralStatus, Urgency, AuthUser, Appointment, Notification,
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

export const DEFAULT_DELHI_HOSPITALS: Facility[] = [
  {
    id: "hosp-aiims-delhi",
    name: "AIIMS New Delhi",
    type: "Tertiary",
    district: "South Delhi",
    state: "Delhi",
    lat: 28.5672,
    lng: 77.2100,
    generalBeds: 2228,
    generalBedsUsed: 2042,
    icuBeds: 250,
    icuBedsUsed: 232,
    privateRooms: 80,
    privateRoomsUsed: 72,
    doctors: [],
    equipment: [
      { name: "3T MRI Scanner", status: "AVAILABLE", count: 4 },
      { name: "128-Slice CT Scanner", status: "AVAILABLE", count: 6 },
      { name: "Cardiac Cath Lab", status: "AVAILABLE", count: 5 },
      { name: "Dialysis Machines", status: "AVAILABLE", count: 40 },
    ],
    specialists: ["Cardiology", "Neurology", "Oncology", "Trauma", "Nephrology", "Gastroenterology", "Pulmonology"],
    bloodStock: { "O+": 45, "O-": 18, "A+": 38, "A-": 12, "B+": 52, "B-": 14, "AB+": 24, "AB-": 8 },
    pmjayEmpanelled: true,
    phone: "011-26588500",
  },
  {
    id: "hosp-safdarjung-delhi",
    name: "Safdarjung Hospital & VMMC",
    type: "Tertiary",
    district: "South Delhi",
    state: "Delhi",
    lat: 28.5684,
    lng: 77.2066,
    generalBeds: 1381,
    generalBedsUsed: 1289,
    icuBeds: 150,
    icuBedsUsed: 141,
    privateRooms: 40,
    privateRoomsUsed: 35,
    doctors: [],
    equipment: [
      { name: "Dedicated Burns ICU", status: "AVAILABLE", count: 30 },
      { name: "Digital X-Ray", status: "AVAILABLE", count: 8 },
      { name: "CT Scanner", status: "AVAILABLE", count: 3 },
    ],
    specialists: ["Burns", "Orthopaedics", "General Surgery", "Paediatrics", "Pulmonary Medicine", "Emergency"],
    bloodStock: { "O+": 32, "O-": 10, "A+": 25, "A-": 8, "B+": 40, "B-": 9, "AB+": 16, "AB-": 5 },
    pmjayEmpanelled: true,
    phone: "011-26707444",
  },
  {
    id: "hosp-ggh-delhi",
    name: "Government General Hospital — Delhi",
    type: "Government",
    district: "Central Delhi",
    state: "Delhi",
    lat: 28.6750,
    lng: 77.2250,
    generalBeds: 620,
    generalBedsUsed: 536,
    icuBeds: 60,
    icuBedsUsed: 52,
    privateRooms: 20,
    privateRoomsUsed: 15,
    doctors: [],
    equipment: [
      { name: "Ventilators", status: "AVAILABLE", count: 25 },
      { name: "Ultrasound HD", status: "AVAILABLE", count: 4 },
      { name: "ECG Units", status: "AVAILABLE", count: 12 },
    ],
    specialists: ["General Medicine", "Cardiology", "Paediatrics", "Orthopaedics", "Emergency"],
    bloodStock: { "O+": 22, "O-": 6, "A+": 18, "A-": 5, "B+": 28, "B-": 7, "AB+": 12, "AB-": 3 },
    pmjayEmpanelled: true,
    phone: "011-23955000",
  },
  {
    id: "hosp-lnjp-delhi",
    name: "Lok Nayak Hospital (LNJP)",
    type: "Government",
    district: "Central Delhi",
    state: "Delhi",
    lat: 28.6369,
    lng: 77.2410,
    generalBeds: 1820,
    generalBedsUsed: 1675,
    icuBeds: 180,
    icuBedsUsed: 166,
    privateRooms: 50,
    privateRoomsUsed: 42,
    doctors: [],
    equipment: [
      { name: "Level-1 Trauma Center", status: "AVAILABLE", count: 1 },
      { name: "Neonatal ICU Units", status: "AVAILABLE", count: 35 },
      { name: "CT Scanner 64-slice", status: "AVAILABLE", count: 2 },
    ],
    specialists: ["Infectious Diseases", "Trauma", "General Medicine", "Neonatology", "Surgery", "Orthopaedics"],
    bloodStock: { "O+": 50, "O-": 15, "A+": 35, "A-": 10, "B+": 55, "B-": 12, "AB+": 20, "AB-": 6 },
    pmjayEmpanelled: true,
    phone: "011-23236000",
  },
  {
    id: "hosp-rml-delhi",
    name: "Dr. Ram Manohar Lohia Hospital (RML)",
    type: "Tertiary",
    district: "New Delhi",
    state: "Delhi",
    lat: 28.6258,
    lng: 77.2016,
    generalBeds: 1300,
    generalBedsUsed: 1190,
    icuBeds: 120,
    icuBedsUsed: 109,
    privateRooms: 45,
    privateRoomsUsed: 38,
    doctors: [],
    equipment: [
      { name: "Cardiac Cath Lab", status: "AVAILABLE", count: 2 },
      { name: "MRI 1.5T", status: "AVAILABLE", count: 2 },
      { name: "Hyperbaric Oxygen Chamber", status: "AVAILABLE", count: 1 },
    ],
    specialists: ["Cardiology", "Critical Care", "Neurology", "Toxicology", "General Medicine", "Emergency"],
    bloodStock: { "O+": 30, "O-": 8, "A+": 22, "A-": 6, "B+": 35, "B-": 8, "AB+": 14, "AB-": 4 },
    pmjayEmpanelled: true,
    phone: "011-23365525",
  },
  {
    id: "hosp-gtb-delhi",
    name: "Guru Teg Bahadur Hospital (GTB)",
    type: "Government",
    district: "East Delhi",
    state: "Delhi",
    lat: 28.6835,
    lng: 77.3094,
    generalBeds: 1560,
    generalBedsUsed: 1430,
    icuBeds: 140,
    icuBedsUsed: 128,
    privateRooms: 30,
    privateRoomsUsed: 25,
    doctors: [],
    equipment: [
      { name: "Neuro-Surgery OT", status: "AVAILABLE", count: 4 },
      { name: "Dialysis Wing", status: "AVAILABLE", count: 20 },
      { name: "High-Speed Spiral CT", status: "AVAILABLE", count: 2 },
    ],
    specialists: ["Trauma", "Orthopaedics", "Neurosurgery", "Paediatrics", "General Medicine", "Emergency"],
    bloodStock: { "O+": 40, "O-": 12, "A+": 30, "A-": 8, "B+": 48, "B-": 10, "AB+": 18, "AB-": 5 },
    pmjayEmpanelled: true,
    phone: "011-22586262",
  },
  {
    id: "hosp-gbpant-delhi",
    name: "Govind Ballabh Pant Hospital (G.B. Pant)",
    type: "Specialized",
    district: "Central Delhi",
    state: "Delhi",
    lat: 28.6385,
    lng: 77.2398,
    generalBeds: 660,
    generalBedsUsed: 598,
    icuBeds: 90,
    icuBedsUsed: 82,
    privateRooms: 35,
    privateRoomsUsed: 30,
    doctors: [],
    equipment: [
      { name: "Bi-Plane Cath Lab", status: "AVAILABLE", count: 3 },
      { name: "Advanced Endoscopy Suite", status: "AVAILABLE", count: 4 },
      { name: "Intra-operative MRI", status: "AVAILABLE", count: 1 },
    ],
    specialists: ["Cardiology", "Neurology", "Gastroenterology", "GI Surgery", "Cardiothoracic Surgery"],
    bloodStock: { "O+": 25, "O-": 7, "A+": 20, "A-": 5, "B+": 30, "B-": 6, "AB+": 12, "AB-": 3 },
    pmjayEmpanelled: true,
    phone: "011-23234242",
  },
  {
    id: "hosp-ddu-delhi",
    name: "Deen Dayal Upadhyay Hospital (DDU)",
    type: "District",
    district: "West Delhi",
    state: "Delhi",
    lat: 28.6276,
    lng: 77.1054,
    generalBeds: 590,
    generalBedsUsed: 536,
    icuBeds: 50,
    icuBedsUsed: 44,
    privateRooms: 15,
    privateRoomsUsed: 12,
    doctors: [],
    equipment: [
      { name: "Emergency Trauma OT", status: "AVAILABLE", count: 3 },
      { name: "Digital Mammography", status: "AVAILABLE", count: 1 },
      { name: "Blood Gas Analyzers", status: "AVAILABLE", count: 4 },
    ],
    specialists: ["Emergency Care", "General Surgery", "Orthopaedics", "Obstetrics & Gynaecology", "Paediatrics"],
    bloodStock: { "O+": 20, "O-": 5, "A+": 15, "A-": 4, "B+": 25, "B-": 6, "AB+": 10, "AB-": 2 },
    pmjayEmpanelled: true,
    phone: "011-25494401",
  },
  {
    id: "hosp-sskh-delhi",
    name: "Lady Hardinge & Sucheta Kriplani Hospital",
    type: "Government",
    district: "New Delhi",
    state: "Delhi",
    lat: 28.6329,
    lng: 77.2144,
    generalBeds: 807,
    generalBedsUsed: 729,
    icuBeds: 70,
    icuBedsUsed: 63,
    privateRooms: 25,
    privateRoomsUsed: 20,
    doctors: [],
    equipment: [
      { name: "Specialized Maternity OT", status: "AVAILABLE", count: 6 },
      { name: "Neonatal Resuscitation Units", status: "AVAILABLE", count: 20 },
      { name: "Pediatric Echo Machine", status: "AVAILABLE", count: 2 },
    ],
    specialists: ["Obstetrics & Gynaecology", "Paediatrics", "Neonatology", "General Medicine", "Surgery"],
    bloodStock: { "O+": 28, "O-": 8, "A+": 20, "A-": 6, "B+": 32, "B-": 7, "AB+": 14, "AB-": 4 },
    pmjayEmpanelled: true,
    phone: "011-23363728",
  },
  {
    id: "hosp-sgm-delhi",
    name: "Sanjay Gandhi Memorial Hospital",
    type: "District",
    district: "North West Delhi",
    state: "Delhi",
    lat: 28.6946,
    lng: 77.0864,
    generalBeds: 270,
    generalBedsUsed: 232,
    icuBeds: 30,
    icuBedsUsed: 26,
    privateRooms: 10,
    privateRoomsUsed: 8,
    doctors: [],
    equipment: [
      { name: "Emergency Life Support Units", status: "AVAILABLE", count: 8 },
      { name: "Digital X-Ray Portable", status: "AVAILABLE", count: 3 },
    ],
    specialists: ["Trauma", "Emergency", "General Medicine", "Paediatrics", "Orthopaedics"],
    bloodStock: { "O+": 15, "O-": 4, "A+": 12, "A-": 3, "B+": 18, "B-": 4, "AB+": 8, "AB-": 2 },
    pmjayEmpanelled: true,
    phone: "011-27900100",
  },
  {
    id: "hosp-bsa-delhi",
    name: "Dr. Baba Saheb Ambedkar Hospital",
    type: "Government",
    district: "North West Delhi",
    state: "Delhi",
    lat: 28.7118,
    lng: 77.1166,
    generalBeds: 455,
    generalBedsUsed: 407,
    icuBeds: 45,
    icuBedsUsed: 40,
    privateRooms: 15,
    privateRoomsUsed: 12,
    doctors: [],
    equipment: [
      { name: "Hemodialysis Units", status: "AVAILABLE", count: 12 },
      { name: "Laparoscopic Surgical Towers", status: "AVAILABLE", count: 3 },
      { name: "CT Scanner 32-slice", status: "AVAILABLE", count: 1 },
    ],
    specialists: ["General Surgery", "Dialysis", "Cardiology", "Orthopaedics", "Emergency", "Paediatrics"],
    bloodStock: { "O+": 24, "O-": 6, "A+": 18, "A-": 5, "B+": 30, "B-": 6, "AB+": 12, "AB-": 3 },
    pmjayEmpanelled: true,
    phone: "011-27055585",
  },
  {
    id: "hosp-asb-delhi",
    name: "Acharya Shree Bhikshu Government Hospital",
    type: "District",
    district: "West Delhi",
    state: "Delhi",
    lat: 28.6565,
    lng: 77.1432,
    generalBeds: 135,
    generalBedsUsed: 113,
    icuBeds: 15,
    icuBedsUsed: 12,
    privateRooms: 5,
    privateRoomsUsed: 4,
    doctors: [],
    equipment: [
      { name: "ENT Surgical Microscope", status: "AVAILABLE", count: 2 },
      { name: "Ophthalmic Laser Unit", status: "AVAILABLE", count: 1 },
    ],
    specialists: ["General Medicine", "Paediatrics", "ENT", "Ophthalmology", "Emergency"],
    bloodStock: { "O+": 10, "O-": 3, "A+": 8, "A-": 2, "B+": 14, "B-": 3, "AB+": 6, "AB-": 1 },
    pmjayEmpanelled: true,
    phone: "011-25458000",
  },
  {
    id: "hosp-lbs-delhi",
    name: "Lal Bahadur Shastri Hospital (LBS)",
    type: "District",
    district: "East Delhi",
    state: "Delhi",
    lat: 28.6186,
    lng: 77.3075,
    generalBeds: 275,
    generalBedsUsed: 240,
    icuBeds: 25,
    icuBedsUsed: 21,
    privateRooms: 10,
    privateRoomsUsed: 8,
    doctors: [],
    equipment: [
      { name: "Orthopaedic C-Arm", status: "AVAILABLE", count: 2 },
      { name: "Emergency Ventilators", status: "AVAILABLE", count: 6 },
    ],
    specialists: ["Emergency Medicine", "Orthopaedics", "Paediatrics", "General Surgery", "General Medicine"],
    bloodStock: { "O+": 16, "O-": 4, "A+": 12, "A-": 3, "B+": 20, "B-": 4, "AB+": 8, "AB-": 2 },
    pmjayEmpanelled: true,
    phone: "011-22774145",
  },
  {
    id: "hosp-valmiki-delhi",
    name: "Maharishi Valmiki Hospital",
    type: "District",
    district: "North Delhi",
    state: "Delhi",
    lat: 28.7845,
    lng: 77.0628,
    generalBeds: 135,
    generalBedsUsed: 107,
    icuBeds: 15,
    icuBedsUsed: 13,
    privateRooms: 5,
    privateRoomsUsed: 3,
    doctors: [],
    equipment: [
      { name: "Labor & Delivery Suites", status: "AVAILABLE", count: 4 },
      { name: "Radiology Ultrasound", status: "AVAILABLE", count: 2 },
    ],
    specialists: ["General Medicine", "Maternal & Child Health", "Emergency", "Surgery"],
    bloodStock: { "O+": 12, "O-": 3, "A+": 9, "A-": 2, "B+": 15, "B-": 3, "AB+": 6, "AB-": 1 },
    pmjayEmpanelled: true,
    phone: "011-27761521",
  },
  {
    id: "hosp-cnbc-delhi",
    name: "Chacha Nehru Bal Chikitsalaya (CNBC)",
    type: "Specialized",
    district: "East Delhi",
    state: "Delhi",
    lat: 28.6542,
    lng: 77.2725,
    generalBeds: 180,
    generalBedsUsed: 150,
    icuBeds: 40,
    icuBedsUsed: 34,
    privateRooms: 10,
    privateRoomsUsed: 7,
    doctors: [],
    equipment: [
      { name: "Paediatric Laparoscopy", status: "AVAILABLE", count: 2 },
      { name: "Advanced Neonatal Incubators", status: "AVAILABLE", count: 25 },
      { name: "Paediatric Echocardiogram", status: "AVAILABLE", count: 2 },
    ],
    specialists: ["Super-Specialty Paediatrics", "Paediatric Surgery", "Neonatal ICU", "Paediatric Cardiology"],
    bloodStock: { "O+": 18, "O-": 5, "A+": 14, "A-": 4, "B+": 22, "B-": 5, "AB+": 8, "AB-": 2 },
    pmjayEmpanelled: true,
    phone: "011-22026130",
  },
  {
    id: "hosp-rgssh-delhi",
    name: "Rajiv Gandhi Super Speciality Hospital",
    type: "Specialized",
    district: "Shahdara",
    state: "Delhi",
    lat: 28.6812,
    lng: 77.3168,
    generalBeds: 570,
    generalBedsUsed: 496,
    icuBeds: 80,
    icuBedsUsed: 70,
    privateRooms: 30,
    privateRoomsUsed: 24,
    doctors: [],
    equipment: [
      { name: "Advanced Cardiac Cath Lab", status: "AVAILABLE", count: 2 },
      { name: "Pulmonary Function Lab", status: "AVAILABLE", count: 2 },
      { name: "Urology Holmium Laser", status: "AVAILABLE", count: 1 },
    ],
    specialists: ["Cardiology", "Pulmonology", "Gastroenterology", "Urology", "Critical Care", "GI Surgery"],
    bloodStock: { "O+": 28, "O-": 7, "A+": 22, "A-": 5, "B+": 34, "B-": 7, "AB+": 14, "AB-": 4 },
    pmjayEmpanelled: true,
    phone: "011-22890600",
  },
];

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

  // Fetch appointments from PostgreSQL backend
  const refreshAppointments = useCallback(async () => {
    const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
    const activeToken = token || (typeof window !== "undefined" ? localStorage.getItem(TOKEN_STORAGE_KEY) : null);
    try {
      const res = await fetch(`${API}/api/appointments`, {
        headers: activeToken ? { Authorization: `Bearer ${activeToken}` } : {},
      });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          setAppointments(data);
        }
      }
    } catch (err) {
      console.warn("Failed to fetch appointments from API:", err);
    }
  }, [token]);

  const createAppointment = useCallback(async (appointmentData: Partial<Appointment>): Promise<Appointment> => {
    const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
    const activeToken = token || (typeof window !== "undefined" ? localStorage.getItem(TOKEN_STORAGE_KEY) : null);
    const res = await fetch(`${API}/api/appointments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(activeToken ? { Authorization: `Bearer ${activeToken}` } : {}),
      },
      body: JSON.stringify(appointmentData),
    });
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData?.error || 'Failed to create appointment');
    }
    const created = await res.json();
    await refreshAppointments();
    return created;
  }, [token, refreshAppointments]);

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

  // Sync store with backend on mount
  useEffect(() => {
    const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

    refreshPatients();
    refreshReferrals();
    refreshAppointments();
    refreshNotifications();

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
