// ============================================================
// Sehat Saathi AI — Type Definitions
// Mirrors the planned Prisma schema for future migration
// ============================================================

// ---------- Enums ----------

export enum Role {
  CITIZEN = "CITIZEN",
  PATIENT = "PATIENT",
  HOSPITAL_STAFF = "HOSPITAL_STAFF",
  ADMIN = "ADMIN",
  DOCTOR = "DOCTOR",
}

export enum Urgency {
  LOW = "LOW",
  MODERATE = "MODERATE",
  HIGH = "HIGH",
  EMERGENCY = "EMERGENCY",
}

export enum FacilityType {
  SEHAT_MANDIR = "SEHAT_MANDIR",
  PHC = "PHC",
  CHC = "CHC",
  DISTRICT_HOSPITAL = "DISTRICT_HOSPITAL",
}

export enum ReferralStatus {
  PENDING = "PENDING",
  ACCEPTED = "ACCEPTED",
  EN_ROUTE = "EN_ROUTE",
  ARRIVED = "ARRIVED",
}

export enum AmbulanceStatus {
  AVAILABLE = "AVAILABLE",
  DISPATCHED = "DISPATCHED",
  EN_ROUTE = "EN_ROUTE",
}

// ---------- Models ----------

export interface User {
  id: string;
  role: Role;
  name: string;
  phone: string;
  createdAt: string;
}

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  bloodGroup: string | null;
  village: string;
  district: string;
  state: string;
  incomeCategory: string | null;
  abhaLinked: boolean;
  registeredById: string;
  createdAt: string;
  phone?: string;
  email?: string;
  abhaNumber?: string;
}

export interface Vitals {
  bpSystolic: number;
  bpDiastolic: number;
  pulse: number;
  temperature: number;   // in °C
  spO2: number;          // percentage
  respiratoryRate?: number;
}

export interface Comorbidities {
  diabetes: boolean;
  hypertension: boolean;
  heartDisease: boolean;
  pregnancy: boolean;
  asthma: boolean;
  kidney: boolean;
}

export interface Screening {
  id: string;
  patientId: string;
  symptoms: string[];
  vitals: Vitals;
  comorbidities: Comorbidities;
  riskScore: number;
  riskFactors: RiskFactor[];
  riskSummary: string;
  urgency: Urgency;
  createdAt: string;
}

export interface RiskFactor {
  factor: string;
  contribution: number;
  detail: string;
  icon?: string;
}

export interface RiskResult {
  score: number;
  urgency: Urgency;
  factors: RiskFactor[];
  summary: string;
}

export interface BloodStock {
  "O+": number;
  "O-": number;
  "A+": number;
  "A-": number;
  "B+": number;
  "B-": number;
  "AB+": number;
  "AB-": number;
}

export interface Facility {
  id: string;
  name: string;
  type: FacilityType;
  district: string;
  state: string;
  lat: number;
  lng: number;
  icuBeds: number;
  icuBedsUsed: number;
  generalBeds: number;
  generalBedsUsed: number;
  privateRooms: number;
  privateRoomsUsed: number;
  doctors: Doctor[];
  equipment: Equipment[];
  specialists: string[];
  bloodStock: BloodStock;
  pmjayEmpanelled: boolean;
  phone: string;
}

export interface Referral {
  id: string;
  patientId: string;
  patientName: string;
  fromFacilityId: string | null;
  toFacilityId: string;
  toFacilityName: string;
  status: ReferralStatus;
  urgency: Urgency;
  ambulanceId: string | null;
  reason: string;
  createdAt: string;
}

export interface Ambulance {
  id: string;
  vehicleNo: string;
  lat: number;
  lng: number;
  status: AmbulanceStatus;
}

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  available: boolean;
  experience: string;
  phone: string;
}

export interface Equipment {
  name: string;
  status: 'AVAILABLE' | 'IN_USE' | 'MAINTENANCE';
  count: number;
}

export interface AuthUser {
  id: string;
  name: string;
  role: Role;
  phone: string;
  email: string;
  facilityId?: string;
  specialty?: string;
}

export interface SchemeEligibilityCheck {
  id: string;
  patientId: string;
  inputs: Record<string, unknown>;
  results: SchemeResult[];
  createdAt: string;
}

export interface SchemeResult {
  schemeName: string;
  status: "POTENTIALLY_ELIGIBLE" | "NOT_ELIGIBLE" | "NEEDS_VERIFICATION";
  reason: string;
  officialLink: string;
}

// ---------- Symptom Definitions ----------

export const SYMPTOM_LIST = [
  "Chest pain",
  "Breathlessness",
  "High fever (>39°C)",
  "Persistent cough",
  "Abdominal pain",
  "Severe headache",
  "Weakness / fatigue",
  "Dizziness",
  "Nausea / vomiting",
  "Diarrhoea",
  "Joint pain",
  "Skin rash",
  "Difficulty swallowing",
  "Blurred vision",
  "Seizures",
  "Bleeding (unexplained)",
  "Swelling (limbs/face)",
  "Urinary problems",
  "Weight loss (unexplained)",
  "Loss of consciousness",
] as const;

export type Symptom = (typeof SYMPTOM_LIST)[number];

// ---------- Blood Groups ----------

export const BLOOD_GROUPS = [
  "O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-",
] as const;

export type BloodGroup = (typeof BLOOD_GROUPS)[number];

// ---------- Utility Types ----------

export interface FacilityMatch {
  facility: Facility;
  score: number;
  distance: number;      // in km
  reasons: string[];
}

export interface PatientRegistrationInput {
  name: string;
  age: number;
  gender: string;
  bloodGroup: string;
  village: string;
  district: string;
  state: string;
  incomeCategory: string;
  vitals: Vitals;
  symptoms: string[];
  comorbidities: Comorbidities;
}
