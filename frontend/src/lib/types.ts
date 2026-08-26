// ============================================================
// Sehat Saathi AI — Type Definitions
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
  TERTIARY = "TERTIARY",
  GOVERNMENT = "GOVERNMENT",
  SPECIALIZED = "SPECIALIZED",
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

// ---------- Extended Models (Phase 1) ----------

export interface Patient {
  id: string;
  mrn?: string;
  name: string;
  dateOfBirth?: string;
  age: number;
  gender: string;
  bloodGroup: string | null;
  phone?: string;
  email?: string;
  abhaId?: string;
  abhaLinked: boolean;
  registeredById?: string;
  address?: string;
  village?: string;
  city?: string;
  district: string;
  state: string;
  pincode?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  emergencyContactRelation?: string;
  riskLevel?: string;
  incomeCategory?: string | null;
  createdAt: string;
  updatedAt?: string;

  // Relations (optional when populated)
  conditions?: MedicalCondition[];
  allergies?: Allergy[];
  medications?: Medication[];
  prescriptions?: Prescription[];
  labReports?: LabReport[];
  documents?: MedicalDocument[];
  insurance?: Insurance[];
  appointments?: Appointment[];
  encounters?: Encounter[];
  vitals?: Vital[];
  referralsOut?: Referral[];
}

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  department?: string;
  licenseNumber?: string;
  phone?: string;
  email?: string;
  facilityId?: string;
  available: boolean;
  experience?: string;
  facility?: {
    id: string;
    name: string;
    location?: string;
  };
}

export interface Vital {
  id: string;
  patientId: string;
  encounterId?: string | null;
  temperature?: number | null;
  bpSystolic?: number | null;
  bpDiastolic?: number | null;
  heartRate?: number | null;
  respiratoryRate?: number | null;
  spO2?: number | null;
  height?: number | null;
  weight?: number | null;
  bmi?: number | null;
  recordedAt: string;
}

export interface MedicalCondition {
  id: string;
  patientId: string;
  name: string;
  icdCode?: string | null;
  onsetDate?: string | null;
  status: "ACTIVE" | "RESOLVED" | "CHRONIC" | string;
  notes?: string | null;
  createdAt?: string;
}

export interface Allergy {
  id: string;
  patientId: string;
  allergen: string;
  type: "DRUG" | "FOOD" | "ENVIRONMENTAL" | string;
  reaction?: string | null;
  severity: "MILD" | "MODERATE" | "SEVERE" | "LIFE_THREATENING" | string;
  createdAt?: string;
}

export interface Medication {
  id: string;
  patientId: string;
  prescribingDoctorId?: string | null;
  name: string;
  dosage: string;
  frequency: string;
  startDate: string;
  endDate?: string | null;
  status: "ACTIVE" | "COMPLETED" | "DISCONTINUED" | string;
  notes?: string | null;
  prescribingDoctor?: Doctor | null;
}

export interface PrescriptionItem {
  id: string;
  prescriptionId?: string;
  medicationName: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions?: string | null;
}

export interface Prescription {
  id: string;
  patientId: string;
  doctorId: string;
  encounterId?: string | null;
  date: string;
  notes?: string | null;
  doctor?: Doctor;
  items: PrescriptionItem[];
}

export interface LabReport {
  id: string;
  patientId: string;
  encounterId?: string | null;
  orderingDoctorId?: string | null;
  testName: string;
  category: string;
  result?: string | null;
  unit?: string | null;
  referenceRange?: string | null;
  status: "ORDERED" | "SAMPLE_COLLECTED" | "PROCESSING" | "COMPLETED" | string;
  reportDate?: string | null;
  notes?: string | null;
  orderingDoctor?: Doctor | null;
}

export interface MedicalDocument {
  id: string;
  patientId: string;
  fileName: string;
  fileUrl?: string | null;
  category: string;
  notes?: string | null;
  uploadDate: string;
}

export interface Insurance {
  id: string;
  patientId: string;
  provider: string;
  policyNumber?: string | null;
  coverageType?: string | null;
  validFrom?: string | null;
  validTo?: string | null;
  pmjayStatus?: string | null;
  cghsStatus?: string | null;
}

export interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  dateTime: string;
  endTime?: string | null;
  status: "REQUESTED" | "CONFIRMED" | "CHECKED_IN" | "IN_CONSULTATION" | "COMPLETED" | "DECLINED" | "CANCELLED" | string;
  visitType: "NEW" | "FOLLOW_UP" | "EMERGENCY" | string;
  reason?: string | null;
  notes?: string | null;
  cancelReason?: string | null;
  patient?: Patient;
  doctor?: Doctor;
}

export interface Encounter {
  id: string;
  patientId: string;
  doctorId: string;
  appointmentId?: string | null;
  chiefComplaint?: string | null;
  symptoms?: string | null; // JSON or string
  onset?: string | null;
  severity?: string | null;
  hpiNotes?: string | null;
  diagnosis?: string | null;
  diagnosisIcdCode?: string | null;
  secondaryDiagnoses?: string | null;
  clinicalNotes?: string | null;
  treatmentPlan?: string | null;
  riskScore?: number | null;
  urgency?: string | null;
  riskFactors?: string | null;
  suggestedDepartment?: string | null;
  followUpDate?: string | null;
  status: string;
  createdAt: string;
  doctor?: Doctor;
  vitals?: Vital[];
  prescriptions?: Prescription[];
  labOrders?: LabReport[];
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
  type: FacilityType | string;
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
  fromFacilityId?: string | null;
  fromHospitalId?: string | null;
  toFacilityId?: string;
  toFacilityName?: string;
  toHospitalId?: string;
  toHospitalName?: string;
  doctorName?: string | null;
  specialty?: string | null;
  status: ReferralStatus;
  urgency: Urgency;
  ambulanceId?: string | null;
  reason: string;
  notes?: string | null;
  createdAt: string;
  toHospital?: Facility;
}

export interface Ambulance {
  id: string;
  vehicleNo: string;
  lat: number;
  lng: number;
  status: AmbulanceStatus;
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
  facilityName?: string;
  specialty?: string;
  patientId?: string;
  doctorId?: string;
  staffId?: string;
  // Extended Profile Fields
  dateOfBirth?: string;
  age?: number;
  gender?: string;
  bloodGroup?: string | null;
  address?: string;
  village?: string;
  city?: string;
  district?: string;
  state?: string;
  pincode?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  emergencyContactRelation?: string;
  allergies?: string[];
  conditions?: string[];
  registrationNumber?: string;
  department?: string;
  experience?: string;
  designation?: string;
  shift?: string;
  createdAt?: string;
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

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: string;
  recipientId: string;
  recipientName: string;
  recipientRole: string;
  threadId: string;
  content: string;
  attachmentType?: "PRESCRIPTION" | "LAB_REPORT" | "APPOINTMENT" | "DOCUMENT" | string | null;
  attachmentId?: string | null;
  attachmentData?: string | null;
  read: boolean;
  createdAt: string;
}

export interface Interaction {
  id: string;
  patientId: string;
  staffId?: string | null;
  staffName?: string | null;
  type: "PHONE_CALL" | "SMS" | "WHATSAPP" | "VIDEO" | "IN_PERSON" | string;
  status: "CONNECTED" | "NO_ANSWER" | "CALLBACK_REQUESTED" | "COMPLETED" | string;
  notes?: string | null;
  callbackDate?: string | null;
  createdAt: string;
}

export interface Notification {
  id: string;
  userId?: string | null;
  role: string;
  category: "CLINICAL" | "APPOINTMENT" | "LAB" | "REFERRAL" | "EMERGENCY" | "SYSTEM" | string;
  title: string;
  message: string;
  link?: string | null;
  urgency: "NORMAL" | "HIGH" | "EMERGENCY" | string;
  read: boolean;
  createdAt: string;
}

// ---------- Utility Types ----------

export interface FacilityMatch {
  facility: Facility;
  score: number;
  distance: number; // in km
  reasons: string[];
}

export interface PatientRegistrationInput {
  name: string;
  age: number;
  gender: string;
  bloodGroup: string;
  phone?: string;
  village: string;
  district: string;
  state: string;
  incomeCategory: string;
  vitals: Vitals;
  symptoms: string[];
  comorbidities: Comorbidities;
}

