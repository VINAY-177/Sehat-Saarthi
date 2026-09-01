"use client";

import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { 
  Bot, Mic, Volume2, VolumeX, Send, RefreshCw, 
  CheckCircle2, Clock, Stethoscope, Building2, Sparkles,
  Edit3, ArrowLeft,
  AlertCircle, CheckCheck, UserCheck, Bed,
  Star, HeartPulse, Navigation, Compass,
  AlertTriangle, ChevronRight
} from "lucide-react";
import { toast } from "sonner";

// ============================================================
// Conversational Booking Flow (Seamless & Natural)
// ============================================================

export enum ChatStep {
  NAME = "NAME",
  PHONE = "PHONE",
  SYMPTOMS = "SYMPTOMS",
  SPECIALTY_CHOICE = "SPECIALTY_CHOICE",
  HOSPITAL = "HOSPITAL",
  DOCTOR_SELECTION = "DOCTOR_SELECTION",
  TIMING = "TIMING",
  DOCTOR_AVAILABILITY = "DOCTOR_AVAILABILITY",
  CONFIRM_APPOINTMENT = "CONFIRM_APPOINTMENT",
  BOOKED = "BOOKED",
}

interface Message {
  id: string;
  sender: "bot" | "user";
  text: string;
  timestamp: string;
  options?: string[];
  step?: ChatStep;
  isSummary?: boolean;
  isAvailabilityCard?: boolean;
  isSuggestionCard?: boolean;
  widgetType?: string | null;
  isError?: boolean;
}

interface DoctorProfile {
  id: string;
  name: string;
  specialty: string;
  experience: string;
  chamber: string;
  rating: number;
  available: boolean;
  fee?: string;
}

interface HospitalCardItem {
  id: string;
  name: string;
  district: string;
  lat: number;
  lng: number;
  totalBeds: number;
  availableBeds: number;
  availableIcu: number;
  rating: number;
  type: string;
  distanceKm?: number;
}

interface BookingDetails {
  fullName: string;
  phone: string;
  symptoms: string;
  severity?: string;
  duration: string;
  hospital: string;
  hospitalId?: string;
  hospitalDistance?: string;
  suggestion: string;
  doctorSpecialty: string;
  doctorName: string;
  doctorId?: string;
  doctorExperience?: string;
  doctorChamber?: string;
  date: string;
  isoDate?: string;
  time: string;
  isUrgent?: boolean;
  doctorAvailabilityStatus: "AVAILABLE" | "BUSY" | "ON_LEAVE";
  appointmentId?: string;
}

// ============================================================
// Delhi-NCR Hospital Network with Precise GPS Coordinates
// ============================================================

const MASTER_HOSPITALS: HospitalCardItem[] = [
  { id: "hosp-aiims-delhi", name: "AIIMS New Delhi", district: "Ansari Nagar, South Delhi", lat: 28.5672, lng: 77.2100, totalBeds: 2478, availableBeds: 184, availableIcu: 18, rating: 4.9, type: "Apex Tertiary" },
  { id: "hosp-safdarjung-delhi", name: "Safdarjung Hospital", district: "Ring Road, South Delhi", lat: 28.5694, lng: 77.2078, totalBeds: 1600, availableBeds: 142, availableIcu: 14, rating: 4.7, type: "Central Govt" },
  { id: "hosp-ggh-delhi", name: "Government General Hospital", district: "Civil Lines, Central Delhi", lat: 28.6750, lng: 77.2250, totalBeds: 680, availableBeds: 84, availableIcu: 8, rating: 4.6, type: "State Referral" },
  { id: "hosp-lnjp-delhi", name: "Lok Nayak Hospital (LNJP)", district: "Delhi Gate, Central Delhi", lat: 28.6366, lng: 77.2415, totalBeds: 2000, availableBeds: 120, availableIcu: 15, rating: 4.5, type: "Teaching Hospital" },
  { id: "hosp-rml-delhi", name: "Dr. Ram Manohar Lohia Hospital", district: "Connaught Place, New Delhi", lat: 28.6253, lng: 77.2025, totalBeds: 1400, availableBeds: 96, availableIcu: 12, rating: 4.6, type: "Central Govt" },
  { id: "hosp-gtb-delhi", name: "Guru Teg Bahadur Hospital (GTB)", district: "Dilshad Garden, East Delhi", lat: 28.6836, lng: 77.3117, totalBeds: 1500, availableBeds: 110, availableIcu: 12, rating: 4.5, type: "Govt Hospital" },
  { id: "hosp-igh-dwarka", name: "Indira Gandhi Hospital Dwarka", district: "Sector 9, Dwarka", lat: 28.5828, lng: 77.0622, totalBeds: 350, availableBeds: 42, availableIcu: 5, rating: 4.5, type: "District Hospital" },
  { id: "hosp-fortis-noida", name: "Fortis Hospital Noida", district: "Sector 62, Noida", lat: 28.6189, lng: 77.3725, totalBeds: 200, availableBeds: 28, availableIcu: 6, rating: 4.8, type: "Super Specialty" },
  { id: "hosp-jaypee-noida", name: "Jaypee Hospital Noida", district: "Sector 128, Noida", lat: 28.5135, lng: 77.3758, totalBeds: 525, availableBeds: 62, availableIcu: 8, rating: 4.7, type: "Tertiary Care" },
  { id: "hosp-gims-grnoida", name: "GIMS Greater Noida", district: "Knowledge Park II, Greater Noida", lat: 28.4682, lng: 77.5028, totalBeds: 500, availableBeds: 58, availableIcu: 6, rating: 4.6, type: "Govt Institute" },
  { id: "hosp-max-vaishali", name: "Max Super Speciality Hospital", district: "Vaishali, Ghaziabad", lat: 28.6438, lng: 77.3385, totalBeds: 300, availableBeds: 36, availableIcu: 7, rating: 4.8, type: "Super Specialty" },
  { id: "hosp-medanta-gurugram", name: "Medanta — The Medicity", district: "Sector 38, Gurugram", lat: 28.4398, lng: 77.0425, totalBeds: 1250, availableBeds: 120, availableIcu: 15, rating: 4.9, type: "Super Specialty" },
  { id: "hosp-fortis-gurugram", name: "Fortis Memorial Research Institute", district: "Sector 44, Gurugram", lat: 28.4595, lng: 77.0725, totalBeds: 310, availableBeds: 38, availableIcu: 9, rating: 4.8, type: "Super Specialty" },
  { id: "hosp-civil-gurugram", name: "Civil Hospital Gurugram", district: "Sector 10A, Gurugram", lat: 28.4602, lng: 77.0325, totalBeds: 450, availableBeds: 52, availableIcu: 5, rating: 4.4, type: "District Hospital" },
  { id: "hosp-amrita-faridabad", name: "Amrita Hospital", district: "Sector 88, Faridabad", lat: 28.4215, lng: 77.3685, totalBeds: 2400, availableBeds: 280, availableIcu: 22, rating: 4.8, type: "Apex Care" },
  { id: "hosp-bk-faridabad", name: "B.K. Civil Hospital Faridabad", district: "NIT, Faridabad", lat: 28.3985, lng: 77.3045, totalBeds: 400, availableBeds: 48, availableIcu: 4, rating: 4.3, type: "District Hospital" },
];

const MEDICAL_SPECIALTIES = [
  { id: "General Physician", nameEn: "General Physician", nameHi: "सामान्य चिकित्सक", icon: "🩺", descEn: "Fever, cold, infections, checkups", descHi: "बुखार, सर्दी-जुकाम, सामान्य जांच" },
  { id: "Cardiologist", nameEn: "Cardiologist", nameHi: "हृदय रोग विशेषज्ञ", icon: "🫀", descEn: "Chest pain, BP, palpitations", descHi: "सीने में दर्द, बीपी, दिल की धड़कन" },
  { id: "Orthopedic Surgeon", nameEn: "Orthopedic Surgeon", nameHi: "हड्डी व जोड़ रोग", icon: "🦴", descEn: "Joint pain, backache, fractures", descHi: "जोड़ों का दर्द, कमर दर्द, फ्रैक्चर" },
  { id: "Pulmonologist", nameEn: "Pulmonologist", nameHi: "श्वसन व फेफड़ा रोग", icon: "🫁", descEn: "Asthma, cough, breathlessness", descHi: "सांस फूलना, लगातार खांसी, दमा" },
  { id: "Neurologist", nameEn: "Neurologist", nameHi: "मस्तिष्क व तंत्रिका", icon: "🧠", descEn: "Migraine, numbness, nerve pain", descHi: "माइग्रेन, सिरदर्द, नसों की समस्या" },
  { id: "Pediatrician", nameEn: "Pediatrician", nameHi: "शिशु व बाल रोग", icon: "👶", descEn: "Child wellness, vaccinations", descHi: "बच्चों की बीमारियां, टीकाकरण" },
  { id: "Gynecologist", nameEn: "Gynecologist", nameHi: "स्त्री एवं प्रसूति रोग", icon: "🤰", descEn: "Pregnancy, maternity health", descHi: "गर्भावस्था, महिला स्वास्थ्य" },
  { id: "Dermatologist", nameEn: "Dermatologist", nameHi: "त्वचा रोग विशेषज्ञ", icon: "🔬", descEn: "Skin allergies, rash, hair", descHi: "त्वचा एलर्जी, दाद, बाल" },
  { id: "ENT Specialist", nameEn: "ENT Specialist", nameHi: "कान, नाक व गला", icon: "👂", descEn: "Ear pain, throat, sinus", descHi: "कान दर्द, गला खराब, साइनस" },
  { id: "Ophthalmologist", nameEn: "Ophthalmologist", nameHi: "नेत्र रोग विशेषज्ञ", icon: "👁️", descEn: "Eye strain, vision check", descHi: "आंखों में जलन, कम दिखना" },
];

const SPECIALTY_DOCTORS: Record<string, DoctorProfile[]> = {
  "General Physician": [
    { id: "doc-priya-mehta", name: "Dr. Priya Mehta", specialty: "General Physician", experience: "8 yrs", chamber: "OPD Room 102", rating: 4.8, available: true, fee: "Free (Govt OPD)" },
    { id: "doc-rajesh-kumar", name: "Dr. Rajesh Kumar", specialty: "General Physician", experience: "12 yrs", chamber: "OPD Room 104", rating: 4.7, available: true, fee: "Free (Govt OPD)" },
    { id: "doc-sunita-verma", name: "Dr. Sunita Verma", specialty: "General Physician", experience: "10 yrs", chamber: "OPD Room 106", rating: 4.9, available: true, fee: "Free (Govt OPD)" },
  ],
  "Cardiologist": [
    { id: "doc-rajiv-narang", name: "Dr. Rajiv Narang", specialty: "Cardiologist", experience: "16 yrs", chamber: "Cardio Wing - C1", rating: 4.9, available: true, fee: "Free (Govt OPD)" },
    { id: "doc-anita-saxena", name: "Dr. Anita Saxena", specialty: "Cardiologist", experience: "14 yrs", chamber: "Cardio Wing - C3", rating: 4.8, available: true, fee: "Free (Govt OPD)" },
    { id: "doc-arjun-malhotra", name: "Dr. Arjun Malhotra", specialty: "Cardiologist", experience: "11 yrs", chamber: "Cath Lab OPD", rating: 4.7, available: true, fee: "Free (Govt OPD)" },
  ],
  "Orthopedic Surgeon": [
    { id: "doc-vivek-rao", name: "Dr. Vivek Rao", specialty: "Orthopedic Surgeon", experience: "12 yrs", chamber: "Joint Care 201", rating: 4.8, available: true, fee: "Free (Govt OPD)" },
    { id: "doc-aditi-joshi", name: "Dr. Aditi Joshi", specialty: "Orthopedic Surgeon", experience: "9 yrs", chamber: "Ortho Block 204", rating: 4.7, available: true, fee: "Free (Govt OPD)" },
  ],
  "Pediatrician": [
    { id: "doc-amit-sen", name: "Dr. Amit Sen", specialty: "Pediatrician", experience: "10 yrs", chamber: "Child Wellness P1", rating: 4.9, available: true, fee: "Free (Govt OPD)" },
    { id: "doc-ritu-sharma", name: "Dr. Ritu Sharma", specialty: "Pediatrician", experience: "8 yrs", chamber: "Child OPD 108", rating: 4.8, available: true, fee: "Free (Govt OPD)" },
  ],
  "Gynecologist": [
    { id: "doc-nisha-verma", name: "Dr. Nisha Verma", specialty: "Gynecologist", experience: "13 yrs", chamber: "Maternity Wing M2", rating: 4.9, available: true, fee: "Free (Govt OPD)" },
    { id: "doc-pooja-menon", name: "Dr. Pooja Menon", specialty: "Gynecologist", experience: "10 yrs", chamber: "Women's Health 205", rating: 4.8, available: true, fee: "Free (Govt OPD)" },
  ],
  "Neurologist": [
    { id: "doc-deepak-agrawal", name: "Dr. Deepak Agrawal", specialty: "Neurologist", experience: "18 yrs", chamber: "Neuro Center N1", rating: 5.0, available: true, fee: "Free (Govt OPD)" },
    { id: "doc-roopa-rajan", name: "Dr. Roopa Rajan", specialty: "Neurologist", experience: "12 yrs", chamber: "Neuro OPD 302", rating: 4.8, available: true, fee: "Free (Govt OPD)" },
  ],
  "Pulmonologist": [
    { id: "doc-sanjay-rao", name: "Dr. Sanjay Rao", specialty: "Pulmonologist", experience: "11 yrs", chamber: "Chest Clinic 110", rating: 4.7, available: true, fee: "Free (Govt OPD)" },
  ],
  "Dermatologist": [
    { id: "doc-kavita-das", name: "Dr. Kavita Das", specialty: "Dermatologist", experience: "10 yrs", chamber: "Derma OPD 115", rating: 4.8, available: true, fee: "Free (Govt OPD)" },
  ],
  "ENT Specialist": [
    { id: "doc-suresh-agarwal", name: "Dr. Suresh Agarwal", specialty: "ENT Specialist", experience: "14 yrs", chamber: "ENT Clinic 208", rating: 4.8, available: true, fee: "Free (Govt OPD)" },
  ],
  "Ophthalmologist": [
    { id: "doc-meenakshi-swaminathan", name: "Dr. M. Swaminathan", specialty: "Ophthalmologist", experience: "15 yrs", chamber: "Eye OPD 301", rating: 4.9, available: true, fee: "Free (Govt OPD)" },
  ],
};

const SYMPTOM_CATEGORIES = [
  { icon: "🌡️", titleEn: "Fever & Infection", titleHi: "बुखार व संक्रमण", val: "High Fever & Body Ache", specialty: "General Physician" },
  { icon: "🫀", titleEn: "Heart & Chest", titleHi: "हृदय व छाती", val: "Chest Pain & Palpitations", specialty: "Cardiologist" },
  { icon: "🦴", titleEn: "Joints & Spine", titleHi: "जोड़ व हड्डी", val: "Knee & Joint Pain", specialty: "Orthopedic Surgeon" },
  { icon: "🧠", titleEn: "Headache & Neuro", titleHi: "सिरदर्द व नसों", val: "Severe Migraine & Dizziness", specialty: "Neurologist" },
  { icon: "🫁", titleEn: "Cough & Breathing", titleHi: "खांसी व सांस", val: "Persistent Cough & Breathlessness", specialty: "Pulmonologist" },
  { icon: "🤰", titleEn: "Maternity & Women", titleHi: "गर्भावस्था व महिला", val: "Prenatal & Maternity Care", specialty: "Gynecologist" },
  { icon: "👶", titleEn: "Child Wellness", titleHi: "शिशु रोग", val: "Pediatric Health Checkup", specialty: "Pediatrician" },
  { icon: "🔬", titleEn: "Skin & Allergies", titleHi: "त्वचा व एलर्जी", val: "Skin Rash & Itching", specialty: "Dermatologist" },
];

const TIME_MATRIX = {
  morning: ["09:00 AM", "10:00 AM", "11:15 AM"],
  afternoon: ["01:30 PM", "02:45 PM", "03:30 PM"],
  evening: ["04:30 PM", "05:15 PM"],
};

// Haversine distance in km
function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

// Strict Client-Side Input Validators
function validateName(input: string): { valid: boolean; cleanName?: string } {
  const trimmed = input.trim();
  const cleaned = trimmed.replace(/^(my name is|i am|i'm|मेरा नाम|नाम है)\s+/i, "").trim();
  if (!/^[a-zA-Z\u0900-\u097F\s.'-]{2,50}$/.test(cleaned)) {
    return { valid: false };
  }
  if (!/[aeiouy\u0904-\u0914\u093E-\u094C\u0902\u0903]/i.test(cleaned)) {
    return { valid: false };
  }
  if (/^(asdf|qwerty|zxcv|1234|test|xyz|abc|yxjhgcj|ghjkl|mnbvc)$/i.test(cleaned.toLowerCase())) {
    return { valid: false };
  }
  if (/[bcdfghjklmnpqrstvwxz]{5,}/i.test(cleaned)) {
    return { valid: false };
  }
  return { valid: true, cleanName: cleaned };
}

function validatePhone(input: string): { valid: boolean; cleanPhone?: string } {
  const digits = input.replace(/\D/g, "");
  if (digits.length === 10 && /^[6-9]\d{9}$/.test(digits)) {
    return { valid: true, cleanPhone: digits };
  }
  const match = input.match(/\b([6-9]\d{9})\b/);
  if (match) return { valid: true, cleanPhone: match[1] };
  return { valid: false };
}

function validateSymptoms(input: string): boolean {
  const trimmed = input.trim();
  if (trimmed.length < 3) return false;
  if (/^[0-9!@#$%^&*()_+=\-[\]{};':"\\|,.<>/?`~]+$/.test(trimmed)) return false;
  if (/^(asdf|qwerty|zxcv|test|xyz|abc|12345|help)$/i.test(trimmed.toLowerCase())) return false;
  return true;
}

interface ISpeechRecognitionInstance {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((event: { results: Array<Array<{ transcript: string }>> }) => void) | null;
  onerror: ((event: { error: string }) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
}

interface ISpeechRecognitionConstructor {
  new (): ISpeechRecognitionInstance;
}

export function BookingChatbot({ onBackToDashboard }: { onBackToDashboard?: () => void }) {
  const router = useRouter();
  const { 
    currentUser, 
    language, 
    setLanguage, 
    t, 
    refreshAppointments, 
    refreshPatients,
    createAppointment 
  } = useStore();
  const isHindi = language === "hi";

  const [currentStep, setCurrentStep] = useState<ChatStep>(ChatStep.NAME);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  // 72-Hour / 3-Day Selected Day Tab for UI
  const [selectedDayTab, setSelectedDayTab] = useState<"Today" | "Tomorrow" | "Day After Tomorrow">("Tomorrow");

  // GPS States
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [gpsHospitals, setGpsHospitals] = useState<HospitalCardItem[]>(MASTER_HOSPITALS);

  // Voice States
  const [isListening, setIsListening] = useState(false);
  const [isSpeechEnabled, setIsSpeechEnabled] = useState(true);
  const recognitionRef = useRef<ISpeechRecognitionInstance | null>(null);

  // Booking Data
  const [booking, setBooking] = useState<BookingDetails>({
    fullName: currentUser?.name || "",
    phone: currentUser?.phone || "",
    symptoms: "Fever & Body Ache",
    severity: "Moderate",
    duration: "2 to 3 days",
    hospital: "Government General Hospital",
    hospitalId: "hosp-ggh-delhi",
    hospitalDistance: "",
    suggestion: "General clinical evaluation and vital parameters check.",
    doctorSpecialty: "General Physician",
    doctorName: "Dr. Priya Mehta",
    doctorId: "doc-priya-mehta",
    doctorExperience: "8 years",
    doctorChamber: "OPD Room 102",
    date: "Tomorrow",
    time: "10:00 AM",
    isUrgent: false,
    doctorAvailabilityStatus: "AVAILABLE",
  });

  const chatEndRef = useRef<HTMLDivElement>(null);
  const handleUserInputRef = useRef<(input: string) => void>(() => {});

  // 3-Day options within 72 hours
  const threeDayOptions = useMemo(() => {
    const today = new Date();
    const tomorrow = new Date(Date.now() + 86400000);
    const dayAfter = new Date(Date.now() + 172800000);

    const fmt = (d: Date) => d.toLocaleDateString(isHindi ? "hi-IN" : "en-IN", { weekday: "short", day: "numeric", month: "short" });
    return [
      { key: "Today" as const, label: isHindi ? `आज (${fmt(today)})` : `Today (${fmt(today)})` },
      { key: "Tomorrow" as const, label: isHindi ? `कल (${fmt(tomorrow)})` : `Tomorrow (${fmt(tomorrow)})` },
      { key: "Day After Tomorrow" as const, label: isHindi ? `परसों (${fmt(dayAfter)})` : `Day After (${fmt(dayAfter)})` },
    ];
  }, [isHindi]);

  // Text-To-Speech
  const speakText = useCallback((text: string) => {
    if (!isSpeechEnabled || typeof window === "undefined" || !("speechSynthesis" in window)) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text.replace(/[*_#🤖🩺👤👨‍⚕️🏥📅🎉🟢💡⚡📍🚨]/g, ""));
      utterance.rate = 1.05;
      utterance.pitch = 1.0;
      utterance.lang = isHindi ? "hi-IN" : "en-IN";
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn("TTS error:", e);
    }
  }, [isSpeechEnabled, isHindi]);

  // Add Bot Message Helper
  const addBotMessage = useCallback((
    text: string, 
    options?: string[], 
    step?: ChatStep, 
    isSummary?: boolean, 
    isError?: boolean,
    isAvailabilityCard?: boolean,
    isSuggestionCard?: boolean,
    widgetType?: string | null
  ) => {
    setIsTyping(true);
    setTimeout(() => {
      const msg: Message = {
        id: `bot-${Date.now()}-${Math.random()}`,
        sender: "bot",
        text,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        options,
        step,
        isSummary,
        isError,
        isAvailabilityCard,
        isSuggestionCard,
        widgetType,
      };
      setMessages((prev) => [...prev, msg]);
      setIsTyping(false);
      if (text) speakText(text);
    }, 150);
  }, [speakText]);

  const addUserMessage = (text: string) => {
    const msg: Message = {
      id: `user-${Date.now()}`,
      sender: "user",
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    setMessages((prev) => [...prev, msg]);
  };

  // GPS Location Trigger
  const handleGpsLocation = () => {
    if (typeof window === "undefined" || !("geolocation" in navigator)) {
      toast.error(isHindi ? "जीपीएस आपके ब्राउज़र में समर्थित नहीं है।" : "GPS is not supported in this browser.");
      return;
    }

    setIsLocating(true);
    toast.info(isHindi ? "आपका सटीक जीपीएस स्थान खोजा जा रहा है..." : "Detecting your current GPS coordinates...");

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setUserLocation({ lat: latitude, lng: longitude });

        const sorted = MASTER_HOSPITALS.map((h) => ({
          ...h,
          distanceKm: calculateDistanceKm(latitude, longitude, h.lat, h.lng),
        })).sort((a, b) => (a.distanceKm || 0) - (b.distanceKm || 0));

        setGpsHospitals(sorted);
        setIsLocating(false);

        const nearest = sorted[0];
        toast.success(
          isHindi
            ? `निकटतम अस्पताल मिला: ${nearest.name} (${nearest.distanceKm} किमी दूर)`
            : `Closest hospital found: ${nearest.name} (${nearest.distanceKm} km away)`
        );

        addBotMessage(
          isHindi
            ? `📍 आपका जीपीएस स्थान प्राप्त हो गया! सबसे नजदीक **${nearest.name}** (${nearest.distanceKm} किमी) है। कृपया अस्पताल चुनें:`
            : `📍 Location detected! Nearest hospital is **${nearest.name}** (${nearest.distanceKm} km away). Please select your hospital:`,
          sorted.slice(0, 4).map((h) => `${h.name} (${h.distanceKm} km)`),
          ChatStep.HOSPITAL,
          false,
          false,
          false,
          false,
          "hospital_cards"
        );
      },
      (err) => {
        setIsLocating(false);
        console.warn("Geolocation error:", err);
        toast.error(isHindi ? "स्थान की अनुमति नहीं मिली। कृपया नीचे सूची में से चुनें।" : "Location access denied. Please select from the hospital network below.");
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  // Initialize Speech Recognition
  useEffect(() => {
    if (typeof window !== "undefined") {
      const win = window as unknown as { SpeechRecognition?: ISpeechRecognitionConstructor; webkitSpeechRecognition?: ISpeechRecognitionConstructor };
      const SpeechRec = win.SpeechRecognition || win.webkitSpeechRecognition;
      if (SpeechRec) {
        const recognition = new SpeechRec();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = isHindi ? "hi-IN" : "en-IN";

        recognition.onresult = (event: { results: Array<Array<{ transcript: string }>> }) => {
          const transcript = event.results[0][0].transcript;
          if (transcript) {
            setInputText(transcript);
            handleUserInputRef.current(transcript);
          }
          setIsListening(false);
        };

        recognition.onerror = () => setIsListening(false);
        recognition.onend = () => setIsListening(false);
        recognitionRef.current = recognition;
      }
    }
  }, [isHindi]);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      toast.error(isHindi ? "वॉयस इनपुट समर्थित नहीं है।" : "Voice input is not supported in this browser.");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.lang = isHindi ? "hi-IN" : "en-IN";
        recognitionRef.current.start();
        setIsListening(true);
        toast.info(isHindi ? "सुन रहे हैं... बोलें" : "Listening with AI precision...");
      } catch (err) {
        console.warn("Could not start voice recognition:", err);
      }
    }
  };

  // Start Natural Conversation (No Step Numbers)
  const startConversation = useCallback(() => {
    setCurrentStep(ChatStep.NAME);
    const greetingText = isHindi 
      ? "नमस्ते! मैं आपका Sehat Saarthi AI सहायक हूँ 🤖। मैं दिल्ली-एनसीआर में डॉक्टर परामर्श और ओपीडी टोकन बुक करने में आपकी सहायता करूँगा।"
      : "Hello! I am your Sehat Saarthi AI Assistant 🤖. I will help you find the right specialist doctor and book your OPD token across Delhi-NCR.";
    
    const nameQuestion = isHindi
      ? (currentUser?.name ? `शुरू करने के लिए, क्या आपका पूरा नाम "${currentUser.name}" है, या नीचे अपना नाम बताएं:` : `शुरू करने के लिए, कृपया मरीज का पूरा नाम बताएं:`)
      : (currentUser?.name ? `To begin, is your full name "${currentUser.name}", or please tell me your full name:` : `To get started, please tell me the patient's full name:`);

    setMessages([
      {
        id: "msg-init",
        sender: "bot",
        text: greetingText,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
    speakText(greetingText);

    setTimeout(() => {
      addBotMessage(nameQuestion, currentUser?.name ? [currentUser.name] : undefined, ChatStep.NAME);
    }, 200);
  }, [isHindi, currentUser?.name, addBotMessage, speakText]);

  useEffect(() => {
    startConversation();
  }, [startConversation]);

  // Auto-scroll
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Symptom AI Specialty Matcher
  const recommendSpecialtyFromSymptoms = (symptomText: string) => {
    const lower = symptomText.toLowerCase();
    if (lower.includes("chest") || lower.includes("heart") || lower.includes("दर्द") || lower.includes("दिल") || lower.includes("छाती") || lower.includes("bp") || lower.includes("palpitat")) {
      return {
        specialty: "Cardiologist",
        specialtyHi: "हृदय रोग विशेषज्ञ (Cardiologist)",
        suggestion: isHindi ? "12-लीड ईसीजी एवं हृदय रोग विशेषज्ञ द्वारा जांच की सिफारिश की जाती है।" : "Immediate in-person cardiology evaluation & ECG recommended."
      };
    }
    if (lower.includes("joint") || lower.includes("knee") || lower.includes("bone") || lower.includes("हड्डी") || lower.includes("कमर") || lower.includes("जोड़") || lower.includes("fracture")) {
      return {
        specialty: "Orthopedic Surgeon",
        specialtyHi: "हड्डी व जोड़ विशेषज्ञ (Orthopedic)",
        suggestion: isHindi ? "हड्डी, जोड़ व गतिशीलता विशेषज्ञ से परामर्श की सलाह दी जाती है।" : "Orthopedic mobility and joint assessment recommended."
      };
    }
    if (lower.includes("breath") || lower.includes("cough") || lower.includes("asthma") || lower.includes("सांस") || lower.includes("खांसी") || lower.includes("दमा")) {
      return {
        specialty: "Pulmonologist",
        specialtyHi: "श्वसन व फेफड़ा रोग विशेषज्ञ (Pulmonologist)",
        suggestion: isHindi ? "छाती व श्वसन प्रणाली की विस्तृत जांच की सलाह दी जाती है।" : "Pulmonary chest & airway consultation advised."
      };
    }
    if (lower.includes("head") || lower.includes("neuro") || lower.includes("migraine") || lower.includes("सिर") || lower.includes("चक्कर") || lower.includes("नस")) {
      return {
        specialty: "Neurologist",
        specialtyHi: "मस्तिष्क व तंत्रिका विशेषज्ञ (Neurologist)",
        suggestion: isHindi ? "न्यूरोलॉजिकल एवं सिरदर्द मूल्यांकन की सलाह दी जाती है।" : "Neurological and headache clinical evaluation recommended."
      };
    }
    if (lower.includes("child") || lower.includes("baby") || lower.includes("बच्चे") || lower.includes("शिशु") || lower.includes("pediatric")) {
      return {
        specialty: "Pediatrician",
        specialtyHi: "बाल व शिशु रोग विशेषज्ञ (Pediatrician)",
        suggestion: isHindi ? "शिशु रोग विशेषज्ञ द्वारा स्वास्थ्य जांच की सिफारिश की जाती है।" : "Specialized pediatric wellness checkup advised."
      };
    }
    if (lower.includes("preg") || lower.includes("women") || lower.includes("गर्भवती") || lower.includes("महिला") || lower.includes("maternity") || lower.includes("period")) {
      return {
        specialty: "Gynecologist",
        specialtyHi: "स्त्री एवं प्रसूति रोग विशेषज्ञ (Gynecologist)",
        suggestion: isHindi ? "स्त्री एवं प्रसूति रोग विशेषज्ञ से परामर्श की सलाह दी जाती है।" : "Obstetrics and gynecological care consultation advised."
      };
    }
    if (lower.includes("skin") || lower.includes("rash") || lower.includes("itch") || lower.includes("त्वचा") || lower.includes("खुजली") || lower.includes("दाद") || lower.includes("hair")) {
      return {
        specialty: "Dermatologist",
        specialtyHi: "त्वचा रोग विशेषज्ञ (Dermatologist)",
        suggestion: isHindi ? "त्वचा विशेषज्ञ द्वारा क्लिनिकल जांच की सलाह दी जाती है।" : "Dermatological skin evaluation recommended."
      };
    }
    if (lower.includes("ear") || lower.includes("nose") || lower.includes("throat") || lower.includes("कान") || lower.includes("गला") || lower.includes("sinus")) {
      return {
        specialty: "ENT Specialist",
        specialtyHi: "कान, नाक व गला विशेषज्ञ (ENT)",
        suggestion: isHindi ? "ईएनटी विशेषज्ञ द्वारा जांच की सलाह दी जाती है।" : "ENT specialist evaluation recommended."
      };
    }
    if (lower.includes("eye") || lower.includes("vision") || lower.includes("आंख") || lower.includes("चश्मा")) {
      return {
        specialty: "Ophthalmologist",
        specialtyHi: "नेत्र रोग विशेषज्ञ (Ophthalmologist)",
        suggestion: isHindi ? "नेत्र रोग विशेषज्ञ द्वारा दृष्टि परीक्षण की सलाह दी जाती है।" : "Comprehensive ophthalmic examination advised."
      };
    }
    return {
      specialty: "General Physician",
      specialtyHi: "सामान्य चिकित्सक (General Physician)",
      suggestion: isHindi ? "व्यापक प्राथमिक स्वास्थ्य जांच एवं क्लिनिकल परामर्श की सलाह दी जाती है।" : "Comprehensive primary care clinical consultation advised."
    };
  };

  // Check 72h / 3 days timing limit
  const check72HourLimit = (input: string): { within72Hours: boolean; exceedsLimit: boolean; isUrgent: boolean } => {
    const lower = input.toLowerCase();
    if (lower.includes("urgent") || lower.includes("emergency") || lower.includes("तत्काल") || lower.includes("इमरजेंसी") || lower.includes("approval") || lower.includes("अनुमोदन")) {
      return { within72Hours: true, exceedsLimit: false, isUrgent: true };
    }
    if (
      lower.includes("next week") ||
      lower.includes("next month") ||
      lower.includes("अगले हफ्ते") ||
      lower.includes("अगले महीने") ||
      /(\b[4-9]|\b[1-9]\d)\s*(days|दिन)/i.test(lower) ||
      lower.includes("10 days") ||
      lower.includes("5 days") ||
      lower.includes("after a week")
    ) {
      return { within72Hours: false, exceedsLimit: true, isUrgent: false };
    }
    return { within72Hours: true, exceedsLimit: false, isUrgent: false };
  };

  // ============================================================
  // Hybrid AI Validation & Conversational Engine
  // ============================================================
  const handleUserInput = async (input: string) => {
    if (!input.trim()) return;
    const cleanInput = input.trim();
    addUserMessage(cleanInput);
    setInputText("");
    setIsTyping(true);

    const currentBooking = { ...booking };

    // Strict Client-Side Pre-validation
    if (currentStep === ChatStep.NAME) {
      const { valid, cleanName } = validateName(cleanInput);
      if (!valid) {
        setIsTyping(false);
        addBotMessage(
          isHindi 
            ? "⚠️ कृपया एक मान्य पूरा नाम दर्ज करें (कम से कम 2 अक्षर, बिना नंबर या विशेष प्रतीकों के):" 
            : "⚠️ Please enter a genuine full name (at least 2 letters, without numbers or random keys):",
          currentUser?.name ? [currentUser.name] : undefined,
          ChatStep.NAME,
          false,
          true
        );
        return;
      }
      currentBooking.fullName = cleanName || cleanInput;
    } else if (currentStep === ChatStep.PHONE) {
      const { valid, cleanPhone } = validatePhone(cleanInput);
      if (!valid) {
        setIsTyping(false);
        addBotMessage(
          isHindi 
            ? "⚠️ कृपया 10 अंकों का मान्य भारतीय मोबाइल नंबर दर्ज करें (उदा. 9876543210):" 
            : "⚠️ Please enter a valid 10-digit Indian mobile number (e.g., 9876543210):",
          currentUser?.phone ? [currentUser.phone] : undefined,
          ChatStep.PHONE,
          false,
          true
        );
        return;
      }
      currentBooking.phone = cleanPhone || cleanInput;
    } else if (currentStep === ChatStep.SYMPTOMS) {
      if (!validateSymptoms(cleanInput)) {
        setIsTyping(false);
        addBotMessage(
          isHindi 
            ? "⚠️ कृपया अपनी स्वास्थ्य परेशानी या लक्षणों का वास्तविक विवरण दें (उदा. बुखार, सीने में दर्द, घुटने का दर्द):" 
            : "⚠️ Please describe your genuine health symptoms or complaint (e.g. fever, knee pain, routine checkup):",
          isHindi ? ["तेज बुखार व कंपकंपी", "सीने में दर्द व घबराहट", "जोड़ों का दर्द", "लगातार खांसी"] : ["High Fever & Body Ache", "Chest Pain & Palpitations", "Joint & Knee Pain", "Persistent Cough"],
          ChatStep.SYMPTOMS,
          false,
          true,
          false,
          false,
          "symptom_selector"
        );
        return;
      }
      currentBooking.symptoms = cleanInput;
      const rec = recommendSpecialtyFromSymptoms(cleanInput);
      currentBooking.doctorSpecialty = rec.specialty;
      currentBooking.suggestion = rec.suggestion;
    } else if (currentStep === ChatStep.TIMING) {
      const { exceedsLimit, isUrgent } = check72HourLimit(cleanInput);
      if (exceedsLimit) {
        setIsTyping(false);
        addBotMessage(
          isHindi
            ? "⚠️ नियमित ओपीडी अपॉइंटमेंट केवल अगले 72 घंटों (3 दिन) के लिए ही बुक किए जा सकते हैं। यदि आपको तत्काल परामर्श की आवश्यकता है, तो आप 'स्टाफ अनुमोदन हेतु तत्काल अनुरोध' भेज सकते हैं:"
            : "⚠️ Regular OPD consultations can only be booked up to 72 hours (3 days) in advance. If you require priority scheduling, you can send an 'Urgent Request for Staff Approval':",
          [isHindi ? "🚨 स्टाफ अनुमोदन हेतु तत्काल अनुरोध भेजें" : "🚨 Send Urgent Request for Staff Approval", "Tomorrow 10:00 AM", "Today 04:30 PM"],
          ChatStep.TIMING,
          false,
          true,
          false,
          false,
          "time_matrix"
        );
        return;
      }
      if (isUrgent) {
        currentBooking.isUrgent = true;
        currentBooking.date = "Today (Priority)";
        currentBooking.time = "Urgent / Immediate Slot";
        setBooking(currentBooking);
        setCurrentStep(ChatStep.CONFIRM_APPOINTMENT);
        setIsTyping(false);
        addBotMessage(
          isHindi
            ? "🚨 तत्काल प्राथमिकता अनुरोध तैयार है। यह टिकट सीधे अस्पताल के ऑन-ड्यूटी स्टाफ को त्वरित अनुमोदन के लिए भेजा जाएगा। कृपया पुष्टि करें:"
            : "🚨 Urgent Priority Request prepared. This token will be routed to on-duty hospital staff for expedited review. Please confirm details below:",
          [isHindi ? "तत्काल अनुरोध की पुष्टि करें (Confirm Urgent)" : "Confirm Urgent Request", isHindi ? "समय बदलें" : "Change Timing"],
          ChatStep.CONFIRM_APPOINTMENT,
          true
        );
        return;
      }
    }

    try {
      // Call Next.js AI Validation Route (Groq LPU Engine)
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: cleanInput,
          currentStep,
          language,
          bookingDetails: currentBooking,
          conversationHistory: messages.slice(-6),
        }),
      });

      if (res.ok) {
        const aiData = await res.json();
        
        // If AI flagged invalid input
        if (aiData.isValid === false && (aiData.reply || aiData.validationError)) {
          setIsTyping(false);
          addBotMessage(
            aiData.reply || aiData.validationError,
            aiData.options,
            currentStep,
            false,
            true
          );
          return;
        }

        // Merge extracted entities
        if (aiData.extracted) {
          if (aiData.extracted.fullName && validateName(aiData.extracted.fullName).valid) {
            currentBooking.fullName = aiData.extracted.fullName;
          }
          if (aiData.extracted.phone && validatePhone(aiData.extracted.phone).valid) {
            currentBooking.phone = aiData.extracted.phone;
          }
          if (aiData.extracted.symptoms) currentBooking.symptoms = aiData.extracted.symptoms;
          if (aiData.extracted.doctorSpecialty) currentBooking.doctorSpecialty = aiData.extracted.doctorSpecialty;
          if (aiData.extracted.suggestion) currentBooking.suggestion = aiData.extracted.suggestion;
          if (aiData.extracted.hospital) currentBooking.hospital = aiData.extracted.hospital;
          if (aiData.extracted.doctorName) currentBooking.doctorName = aiData.extracted.doctorName;
          if (aiData.extracted.date) currentBooking.date = aiData.extracted.date;
          if (aiData.extracted.time) currentBooking.time = aiData.extracted.time;
        }

        const cleanReply = (aiData.reply || "")
          .replace(/\[Step \d+\/\d+[^\]]*\]/gi, "")
          .replace(/\[चरण \d+\/\d+[^\]]*\]/gi, "")
          .trim();

        if (cleanReply) {
          const nextStepEnum = (aiData.nextStep as ChatStep) || getNextFallbackStep(currentStep);
          setCurrentStep(nextStepEnum);
          setBooking(currentBooking);

          addBotMessage(
            cleanReply,
            aiData.options,
            nextStepEnum,
            nextStepEnum === ChatStep.CONFIRM_APPOINTMENT,
            false,
            nextStepEnum === ChatStep.DOCTOR_AVAILABILITY,
            nextStepEnum === ChatStep.SPECIALTY_CHOICE,
            aiData.widgetType
          );
          return;
        }
      }
    } catch (aiErr) {
      console.warn("AI validation fallback to deterministic engine:", aiErr);
    }

    // Fallback deterministic state machine
    runVerifiedLocalMachine(cleanInput, currentBooking);
  };

  const getNextFallbackStep = (step: ChatStep): ChatStep => {
    switch (step) {
      case ChatStep.NAME: return ChatStep.PHONE;
      case ChatStep.PHONE: return ChatStep.SYMPTOMS;
      case ChatStep.SYMPTOMS: return ChatStep.SPECIALTY_CHOICE;
      case ChatStep.SPECIALTY_CHOICE: return ChatStep.HOSPITAL;
      case ChatStep.HOSPITAL: return ChatStep.DOCTOR_SELECTION;
      case ChatStep.DOCTOR_SELECTION: return ChatStep.TIMING;
      case ChatStep.TIMING: return ChatStep.DOCTOR_AVAILABILITY;
      case ChatStep.DOCTOR_AVAILABILITY: return ChatStep.CONFIRM_APPOINTMENT;
      case ChatStep.CONFIRM_APPOINTMENT: return ChatStep.BOOKED;
      default: return ChatStep.NAME;
    }
  };

  const runVerifiedLocalMachine = (cleanInput: string, currentBooking: BookingDetails) => {
    switch (currentStep) {
      case ChatStep.NAME: {
        const { valid, cleanName } = validateName(cleanInput);
        if (!valid) {
          addBotMessage(
            isHindi ? "⚠️ कृपया अपना मान्य नाम बताएं (कम से कम 2 अक्षर):" : "⚠️ Please provide a valid full name:",
            currentUser?.name ? [currentUser.name] : undefined,
            ChatStep.NAME,
            false,
            true
          );
          return;
        }
        currentBooking.fullName = cleanName || cleanInput;
        setBooking(currentBooking);
        setCurrentStep(ChatStep.PHONE);
        addBotMessage(
          isHindi ? `आपसे मिलकर खुशी हुई, ${currentBooking.fullName}! कृपया पुष्टि और एसएमएस के लिए अपना 10 अंकों का मोबाइल नंबर दर्ज करें:` : `Nice to meet you, ${currentBooking.fullName}! Please enter your 10-digit mobile number for confirmation:`,
          currentUser?.phone ? [currentUser.phone] : undefined,
          ChatStep.PHONE
        );
        break;
      }
      case ChatStep.PHONE: {
        const { valid, cleanPhone } = validatePhone(cleanInput);
        if (!valid) {
          addBotMessage(
            isHindi ? "⚠️ कृपया 10 अंकों का मान्य भारतीय मोबाइल नंबर दर्ज करें:" : "⚠️ Please enter a valid 10-digit mobile number:",
            currentUser?.phone ? [currentUser.phone] : undefined,
            ChatStep.PHONE,
            false,
            true
          );
          return;
        }
        currentBooking.phone = cleanPhone || cleanInput;
        setBooking(currentBooking);
        setCurrentStep(ChatStep.SYMPTOMS);
        addBotMessage(
          isHindi ? `फोन नंबर सत्यापित हुआ। आपको क्या लक्षण या स्वास्थ्य संबंधी परेशानी हो रही है? (नीचे कार्ड चुनें या लिखें)` : `Mobile verified! What health symptoms or discomfort are you experiencing?`,
          isHindi ? ["तेज बुखार व कंपकंपी", "सीने में दर्द व घबराहट", "जोड़ों का दर्द", "लगातार खांसी"] : ["High Fever & Body Ache", "Chest Pain & Palpitations", "Joint & Knee Pain", "Persistent Cough"],
          ChatStep.SYMPTOMS,
          false,
          false,
          false,
          false,
          "symptom_selector"
        );
        break;
      }
      case ChatStep.SYMPTOMS: {
        if (!validateSymptoms(cleanInput)) {
          addBotMessage(
            isHindi ? "⚠️ कृपया अपने स्वास्थ्य लक्षणों का विवरण दें:" : "⚠️ Please describe your health symptoms:",
            ["High Fever & Body Ache", "Chest Pain & Palpitations", "Joint & Knee Pain"],
            ChatStep.SYMPTOMS,
            false,
            true
          );
          return;
        }
        currentBooking.symptoms = cleanInput;
        const rec = recommendSpecialtyFromSymptoms(cleanInput);
        currentBooking.doctorSpecialty = rec.specialty;
        currentBooking.suggestion = rec.suggestion;
        setBooking(currentBooking);
        setCurrentStep(ChatStep.SPECIALTY_CHOICE);
        addBotMessage(
          isHindi 
            ? `आपके लक्षणों के आधार पर, हम **${rec.specialtyHi}** से परामर्श की सिफारिश करते हैं। आप किस प्रकार के डॉक्टर को दिखाना चाहते हैं? नीचे से चुनें या पुष्टि करें:`
            : `Based on your symptoms (${cleanInput}), we recommend consulting a **${rec.specialty}**. Which type of specialist doctor would you prefer? Select below:`,
          [rec.specialty, "General Physician", "Cardiologist", "Orthopedic Surgeon"],
          ChatStep.SPECIALTY_CHOICE,
          false,
          false,
          false,
          true,
          "specialty_selector"
        );
        break;
      }
      case ChatStep.SPECIALTY_CHOICE: {
        currentBooking.doctorSpecialty = cleanInput;
        setBooking(currentBooking);
        setCurrentStep(ChatStep.HOSPITAL);
        addBotMessage(
          isHindi 
            ? `विशेषज्ञता चुन ली गई है (${cleanInput})। दिल्ली-एनसीआर में आप किस अस्पताल में जाना चाहते हैं? आप जीपीएस से निकटतम अस्पताल भी खोज सकते हैं:` 
            : `Specialty selected (${cleanInput}). Which Delhi-NCR hospital facility would you like to visit? You can also use GPS:`,
          ["AIIMS New Delhi", "Safdarjung Hospital", "Government General Hospital", "Fortis Hospital Noida", "Medanta Gurugram", "Amrita Hospital"],
          ChatStep.HOSPITAL,
          false,
          false,
          false,
          false,
          "hospital_cards"
        );
        break;
      }
      case ChatStep.HOSPITAL: {
        currentBooking.hospital = cleanInput.replace(/\s*\(\d+(\.\d+)?\s*km\)/i, "");
        const matchedHosp = MASTER_HOSPITALS.find(h => cleanInput.includes(h.name)) || MASTER_HOSPITALS[0];
        currentBooking.hospitalId = matchedHosp.id;
        setBooking(currentBooking);
        setCurrentStep(ChatStep.DOCTOR_SELECTION);
        const docs = SPECIALTY_DOCTORS[currentBooking.doctorSpecialty] || SPECIALTY_DOCTORS["General Physician"];
        addBotMessage(
          isHindi ? `${currentBooking.hospital} में उपलब्ध ${currentBooking.doctorSpecialty} डॉक्टर। कृपया अपना डॉक्टर चुनें:` : `Available ${currentBooking.doctorSpecialty} doctors at ${currentBooking.hospital}. Please select your doctor:`,
          docs.map((d) => `${d.name} (${d.specialty})`),
          ChatStep.DOCTOR_SELECTION,
          false,
          false,
          false,
          false,
          "doctor_cards"
        );
        break;
      }
      case ChatStep.DOCTOR_SELECTION: {
        const docs = SPECIALTY_DOCTORS[currentBooking.doctorSpecialty] || SPECIALTY_DOCTORS["General Physician"];
        const matched = docs.find((d) => cleanInput.toLowerCase().includes(d.name.toLowerCase())) || docs[0];
        currentBooking.doctorName = matched.name;
        currentBooking.doctorId = matched.id;
        currentBooking.doctorChamber = matched.chamber;
        setBooking(currentBooking);
        setCurrentStep(ChatStep.TIMING);
        addBotMessage(
          isHindi 
            ? `${matched.name} के लिए अपॉइंटमेंट अगले 72 घंटों (3 दिन) के लिए खुले हैं। कृपया अपना दिन व समय चुनें:` 
            : `OPD slots for ${matched.name} are available for the next 72 hours (3 days). Please select your preferred day and time slot:`,
          ["Tomorrow 10:00 AM", "Tomorrow 02:45 PM", "Today 04:30 PM", "Day After 11:15 AM", "🚨 Urgent Request"],
          ChatStep.TIMING,
          false,
          false,
          false,
          false,
          "time_matrix"
        );
        break;
      }
      case ChatStep.TIMING: {
        const { exceedsLimit, isUrgent } = check72HourLimit(cleanInput);
        if (exceedsLimit) {
          addBotMessage(
            isHindi
              ? "⚠️ ओपीडी अपॉइंटमेंट केवल 72 घंटों (3 दिन) के भीतर ही बुक किए जा सकते हैं। यदि आपकी स्थिति गंभीर है तो तत्काल अनुरोध भेजें:"
              : "⚠️ OPD consultations are limited to 72 hours (3 days) in advance. For emergency cases, please submit an Urgent Staff Request:",
            [isHindi ? "🚨 स्टाफ अनुमोदन हेतु तत्काल अनुरोध भेजें" : "🚨 Send Urgent Request for Staff Approval", "Tomorrow 10:00 AM"],
            ChatStep.TIMING,
            false,
            true,
            false,
            false,
            "time_matrix"
          );
          return;
        }

        if (isUrgent) {
          currentBooking.isUrgent = true;
          currentBooking.date = "Today (Priority)";
          currentBooking.time = "Urgent / Immediate Slot";
          setBooking(currentBooking);
          setCurrentStep(ChatStep.CONFIRM_APPOINTMENT);
          addBotMessage(
            isHindi
              ? "🚨 तत्काल प्राथमिकता अनुरोध तैयार है। यह सीधे अस्पताल स्टाफ के पास अनुमोदन हेतु जाएगा। कृपया समीक्षा करें और पुष्टि करें:"
              : "🚨 Urgent Priority Request prepared for on-duty hospital staff. Please review the details below and confirm:",
            [isHindi ? "पुष्टि करें और टोकन बुक करें (Confirm)" : "Confirm & Book OPD Token", isHindi ? "विवरण बदलें" : "Edit Details"],
            ChatStep.CONFIRM_APPOINTMENT,
            true
          );
          return;
        }

        // Parse slot selection
        if (cleanInput.includes("Today") || cleanInput.includes("आज")) {
          currentBooking.date = "Today";
        } else if (cleanInput.includes("Day After") || cleanInput.includes("परसों")) {
          currentBooking.date = "Day After Tomorrow";
        } else {
          currentBooking.date = "Tomorrow";
        }
        currentBooking.time = cleanInput.replace(/(Today|Tomorrow|Day After Tomorrow|आज|कल|परसों|Day After)s*[-:]?s*/gi, "").trim() || "10:00 AM";

        setBooking(currentBooking);
        setCurrentStep(ChatStep.DOCTOR_AVAILABILITY);
        addBotMessage(
          isHindi ? `${currentBooking.doctorName} की लाइव उपलब्धता की पुष्टि हो गई है (${currentBooking.date} • ${currentBooking.time}):` : `Live schedule verified for ${currentBooking.doctorName} on ${currentBooking.date} at ${currentBooking.time}:`,
          [isHindi ? "अपॉइंटमेंट सारांश देखें व पुष्टि करें" : "Review Summary & Confirm Appointment", isHindi ? "समय बदलें" : "Change Timing"],
          ChatStep.DOCTOR_AVAILABILITY,
          false,
          false,
          true
        );
        break;
      }
      case ChatStep.DOCTOR_AVAILABILITY: {
        setCurrentStep(ChatStep.CONFIRM_APPOINTMENT);
        addBotMessage(
          isHindi ? `आपका अपॉइंटमेंट सारांश तैयार है। कृपया विवरण की समीक्षा करें और पुष्टि करें:` : `Your appointment summary is ready. Please review the details below and confirm:`,
          [isHindi ? "पुष्टि करें और टोकन बुक करें (Confirm)" : "Confirm & Book OPD Token", isHindi ? "विवरण बदलें" : "Edit Details", isHindi ? "रद्द करें" : "Cancel"],
          ChatStep.CONFIRM_APPOINTMENT,
          true
        );
        break;
      }
      case ChatStep.CONFIRM_APPOINTMENT: {
        const lower = cleanInput.toLowerCase();
        if (lower.includes("yes") || lower.includes("confirm") || lower.includes("book") || lower.includes("हाँ") || lower.includes("पुष्टि")) {
          handleConfirmBooking();
        } else {
          handleCancelBooking();
        }
        break;
      }
      default:
        break;
    }
  };

  handleUserInputRef.current = handleUserInput;

  // Final Confirmation & Sync with Appointment Schedule
  const handleConfirmBooking = async () => {
    const generatedId = `OPD-2026-${Math.floor(100000 + Math.random() * 900000)}`;
    const finalBooking = { ...booking, appointmentId: generatedId };
    setBooking(finalBooking);
    setCurrentStep(ChatStep.BOOKED);

    // Compute exact appointment Date
    let apptDateTime = new Date();
    if (finalBooking.date === "Tomorrow") {
      apptDateTime = new Date(Date.now() + 86400000);
    } else if (finalBooking.date === "Day After Tomorrow" || finalBooking.date === "Day After") {
      apptDateTime = new Date(Date.now() + 172800000);
    }
    
    // Parse time
    if (finalBooking.time && finalBooking.time.includes(":")) {
      const match = finalBooking.time.match(/(\d+):(\d+)\s*(AM|PM)?/i);
      if (match) {
        let hours = parseInt(match[1], 10);
        const mins = parseInt(match[2], 10);
        const ampm = match[3]?.toUpperCase();
        if (ampm === "PM" && hours < 12) hours += 12;
        if (ampm === "AM" && hours === 12) hours = 0;
        apptDateTime.setHours(hours, mins, 0, 0);
      }
    }

    try {
      await createAppointment({
        patientId: currentUser?.patientId || "pat-aarav-001",
        doctorId: finalBooking.doctorId || "doc-priya-001",
        facilityId: finalBooking.hospitalId || undefined,
        dateTime: apptDateTime.toISOString(),
        status: finalBooking.isUrgent ? "REQUESTED" : "CONFIRMED",
        visitType: finalBooking.isUrgent ? "EMERGENCY" : "NEW",
        reason: `${finalBooking.doctorSpecialty} (Symptoms: ${finalBooking.symptoms})`,
        notes: `${finalBooking.isUrgent ? "🚨 URGENT FAST-TRACK STAFF APPROVAL REQUEST. " : ""}Hospital: ${finalBooking.hospital}. Room: ${finalBooking.doctorChamber}. Token: ${generatedId}`,
        doctor: {
          id: finalBooking.doctorId || "doc-priya-001",
          name: finalBooking.doctorName,
          specialty: finalBooking.doctorSpecialty,
        },
        patient: {
          id: currentUser?.patientId || "pat-aarav-001",
          name: finalBooking.fullName,
          phone: finalBooking.phone,
          mrn: currentUser?.patientId ? "MRN-2026-0001" : "MRN-2026-NEW",
          age: 28,
          gender: "MALE",
          district: "New Delhi",
          bloodGroup: "O+",
          riskLevel: finalBooking.isUrgent ? "HIGH" : "LOW",
        },
      });

      await refreshAppointments();
      await refreshPatients();
    } catch (err) {
      console.warn("Failed to persist appointment via store/API:", err);
    }

    addBotMessage(
      isHindi 
        ? `✅ ${finalBooking.fullName} जी, आपका अपॉइंटमेंट सफलतापूर्वक दर्ज कर लिया गया है और शेड्यूल में जोड़ दिया गया है। हम आपके शीघ्र स्वस्थ होने और अच्छे स्वास्थ्य की कामना करते हैं। आपका ओपीडी टोकन आईडी: ${generatedId}`
        : `✅ ${finalBooking.fullName}, your OPD appointment has been confirmed and scheduled. We wish you good health and a speedy recovery. Token ID: ${generatedId}`,
      undefined,
      ChatStep.BOOKED
    );

    toast.success(isHindi ? "अपॉइंटमेंट टोकन सफलतापूर्वक दर्ज हुआ!" : "OPD Appointment Confirmed & Synced to Schedule!");
  };

  const handleEditBooking = () => {
    setCurrentStep(ChatStep.SYMPTOMS);
    addBotMessage(
      isHindi ? "आइए लक्षणों से विवरण अपडेट करें। आपको क्या परेशानी हो रही है?" : "Let's update details from symptoms. What are you experiencing?",
      isHindi ? ["तेज बुखार व कंपकंपी", "सीने में दर्द", "जोड़ों का दर्द"] : ["High Fever & Body Ache", "Chest Pain & Palpitations", "Joint & Knee Pain"],
      ChatStep.SYMPTOMS,
      false,
      false,
      false,
      false,
      "symptom_selector"
    );
  };

  const handleCancelBooking = () => {
    addBotMessage(
      isHindi ? "अपॉइंटमेंट बुकिंग सत्र रद्द कर दिया गया है।" : "Your booking session has been cancelled.",
      [isHindi ? "नया अपॉइंटमेंट बुक करें" : "Book New Appointment"]
    );
    setTimeout(() => {
      if (onBackToDashboard) onBackToDashboard();
      else router.push("/");
    }, 1500);
  };

  return (
    <div className="flex flex-col h-full max-h-[84vh] bg-white rounded-3xl border border-slate-200/80 shadow-xl overflow-hidden font-sans">
      
      {/* ── Header ── */}
      <div className="bg-[#0f172a] h-16 px-4 sm:px-5 text-white flex items-center justify-between shadow-xs border-b border-slate-800 shrink-0">
        
        {/* Left: Avatar + Title & Live AI Status */}
        <div className="flex items-center gap-3 min-w-0">
          {onBackToDashboard && (
            <button
              type="button"
              onClick={onBackToDashboard}
              className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}

          <div className="relative shrink-0">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-teal-500 to-emerald-400 text-slate-950 flex items-center justify-center shadow-md font-black">
              <Bot className="w-5 h-5" />
            </div>
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 border-2 border-[#0f172a] rounded-full" />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-sm sm:text-base text-white truncate">
                {isHindi ? "सेहत सारथी एआई" : "Sehat Saarthi AI"}
              </span>
              <Badge className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[9px] font-bold px-1.5 py-0">
                ⚡ LPU Fast
              </Badge>
            </div>
            <span className="text-[11px] text-slate-400 block truncate">
              {isHindi ? "दिल्ली-एनसीआर ओपीडी परामर्श सहायक" : "Delhi-NCR 72-Hour OPD Booking Assistant"}
            </span>
          </div>
        </div>

        {/* Right: Language, Speech, Reset Controls */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setLanguage(isHindi ? "en" : "hi")}
            className="text-[11px] font-bold px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-teal-300 border border-slate-700 transition-colors"
            title="Toggle Language"
          >
            {isHindi ? "ENG" : "हिंदी"}
          </button>

          <button
            type="button"
            onClick={() => {
              setIsSpeechEnabled(!isSpeechEnabled);
              toast.info(isSpeechEnabled ? t("voiceOff") : t("voiceOn"));
            }}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title={isSpeechEnabled ? t("voiceOn") : t("voiceOff")}
          >
            {isSpeechEnabled ? <Volume2 className="w-4 h-4 text-teal-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
          </button>

          <button
            type="button"
            onClick={startConversation}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title={t("resetChat")}
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ── Messages Chat Stream ── */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 bg-[#f8fafc]">
        {messages.map((msg) => {
          const isBot = msg.sender === "bot";
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-2.5 animate-in fade-in duration-200 ${
                isBot ? "justify-start" : "justify-end"
              }`}
            >
              {isBot && (
                <div className={`w-7 h-7 rounded-full ${msg.isError ? "bg-amber-600" : "bg-teal-600"} text-white flex items-center justify-center shadow-xs shrink-0 mt-0.5`}>
                  {msg.isError ? <AlertCircle className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
                </div>
              )}

              <div className="space-y-3 max-w-[92%] sm:max-w-[82%]">
                {msg.text ? (
                  <div
                    className={`px-4 py-2.5 rounded-2xl text-[13px] leading-relaxed shadow-xs ${
                      isBot
                        ? msg.isError
                          ? "bg-amber-50 text-amber-900 border border-amber-200 font-medium"
                          : "bg-white text-slate-800 border border-slate-200/70 rounded-tl-xs font-normal"
                        : "bg-gradient-to-r from-teal-600 to-emerald-600 text-white rounded-tr-xs font-medium shadow-md shadow-teal-600/10"
                    }`}
                  >
                    <p className="whitespace-pre-line">{msg.text}</p>
                  </div>
                ) : null}

                {/* ── Interactive Widget: Category & Symptom Selector ── */}
                {(msg.widgetType === "symptom_selector" || (msg.step === ChatStep.SYMPTOMS && currentStep === ChatStep.SYMPTOMS)) && (
                  <div className="p-3 bg-white rounded-2xl border border-teal-200 shadow-sm space-y-2.5 animate-in fade-in duration-300">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
                      <span className="text-[11px] font-extrabold text-slate-800 flex items-center gap-1.5">
                        <HeartPulse className="w-3.5 h-3.5 text-teal-600" />
                        {isHindi ? "लक्षण श्रेणी चुनें (टैप करें):" : "Select Health Category / Symptoms:"}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                      {SYMPTOM_CATEGORIES.map((cat, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => handleUserInput(cat.val)}
                          className="flex flex-col items-center text-center p-2 rounded-xl border border-slate-100 hover:border-teal-400 bg-slate-50/70 hover:bg-teal-50/50 transition-all text-xs group"
                        >
                          <span className="text-lg group-hover:scale-110 transition-transform">{cat.icon}</span>
                          <span className="font-bold text-slate-800 text-[11px] mt-1 line-clamp-1">
                            {isHindi ? cat.titleHi : cat.titleEn}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* ── Interactive Widget: Specialty Selection with AI Suggestion ── */}
                {(msg.widgetType === "specialty_selector" || (msg.step === ChatStep.SPECIALTY_CHOICE && currentStep === ChatStep.SPECIALTY_CHOICE)) && (
                  <div className="p-3 bg-white rounded-2xl border border-teal-300 shadow-sm space-y-3 animate-in fade-in duration-300">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
                      <span className="text-[11px] font-extrabold text-slate-800 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                        {isHindi ? "अनुशंसित विशेषज्ञ डॉक्टर चुनें:" : "Choose Doctor Specialty:"}
                      </span>
                      <Badge className="bg-emerald-100 text-emerald-800 border-0 text-[10px] font-bold">
                        ⭐ AI Recommended
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[260px] overflow-y-auto pr-1">
                      {MEDICAL_SPECIALTIES.map((spec) => {
                        const isRecommended = spec.id === booking.doctorSpecialty;
                        return (
                          <div
                            key={spec.id}
                            onClick={() => handleUserInput(spec.id)}
                            className={`p-2.5 rounded-xl border transition-all cursor-pointer space-y-1 group ${
                              isRecommended
                                ? "border-teal-500 bg-gradient-to-br from-teal-50/80 to-emerald-50/40 shadow-xs ring-1 ring-teal-400"
                                : "border-slate-200 hover:border-teal-400 bg-white hover:bg-slate-50"
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className="text-lg">{spec.icon}</span>
                                <div>
                                  <span className="font-extrabold text-xs text-slate-900 group-hover:text-teal-700 block">
                                    {isHindi ? spec.nameHi : spec.nameEn}
                                  </span>
                                  <span className="text-[10px] text-slate-500 line-clamp-1">
                                    {isHindi ? spec.descHi : spec.descEn}
                                  </span>
                                </div>
                              </div>
                              {isRecommended && (
                                <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* ── Interactive Widget: Hospital Cards Deck + GPS Tracker ── */}
                {(msg.widgetType === "hospital_cards" || (msg.step === ChatStep.HOSPITAL && currentStep === ChatStep.HOSPITAL)) && (
                  <div className="p-3 bg-white rounded-2xl border border-teal-200 shadow-sm space-y-2.5 animate-in fade-in duration-300">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                      <span className="text-[11px] font-extrabold text-slate-800 flex items-center gap-1">
                        <Building2 className="w-3.5 h-3.5 text-teal-600" />
                        {isHindi ? "अस्पताल चुनें:" : "Select Hospital Facility:"}
                      </span>

                      {/* GPS Live Geolocation Button */}
                      <button
                        type="button"
                        onClick={handleGpsLocation}
                        disabled={isLocating}
                        className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-[10px] font-bold shadow-xs hover:scale-105 active:scale-95 transition-all"
                      >
                        <Compass className={`w-3 h-3 ${isLocating ? "animate-spin" : ""}`} />
                        <span>{isLocating ? (isHindi ? "स्थान खोज रहे हैं..." : "Locating...") : (isHindi ? "📍 जीपीएस से निकटतम खोजें" : "📍 Find Nearest via GPS")}</span>
                      </button>
                    </div>

                    {userLocation && (
                      <div className="p-2 bg-emerald-50 rounded-xl border border-emerald-200 text-[10px] text-emerald-900 font-bold flex items-center justify-between">
                        <span className="flex items-center gap-1">
                          <Navigation className="w-3 h-3 text-emerald-700" />
                          {isHindi ? "जीपीएस स्थान सक्रिय (दूरी अनुसार):" : "GPS Active (Sorted by distance):"}
                        </span>
                        <span className="font-mono text-emerald-800">{userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}</span>
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[240px] overflow-y-auto pr-1">
                      {gpsHospitals.map((hosp) => (
                        <div
                          key={hosp.id}
                          onClick={() => handleUserInput(hosp.distanceKm !== undefined ? `${hosp.name} (${hosp.distanceKm} km)` : hosp.name)}
                          className="p-2.5 rounded-xl border border-slate-200 hover:border-teal-500 bg-white hover:bg-teal-50/40 transition-all cursor-pointer space-y-1.5 shadow-2xs hover:shadow-xs group"
                        >
                          <div className="flex items-start justify-between gap-1">
                            <span className="font-extrabold text-xs text-slate-900 group-hover:text-teal-700 transition-colors line-clamp-1">
                              {hosp.name}
                            </span>
                            <span className="text-[10px] font-bold text-amber-600 flex items-center gap-0.5 shrink-0">
                              <Star className="w-2.5 h-2.5 fill-amber-500 text-amber-500" /> {hosp.rating}
                            </span>
                          </div>

                          <div className="flex items-center justify-between text-[10px] text-slate-500 font-medium">
                            <span className="truncate">{hosp.district}</span>
                            {hosp.distanceKm !== undefined ? (
                              <Badge className="bg-emerald-100 text-emerald-800 text-[9px] font-black px-1.5 py-0 border border-emerald-200 shrink-0">
                                📍 {hosp.distanceKm} km
                              </Badge>
                            ) : (
                              <span className="text-emerald-700 font-bold flex items-center gap-1 shrink-0">
                                <Bed className="w-3 h-3 text-emerald-600" /> {hosp.availableBeds} beds
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* ── Interactive Widget: Doctor Profile Cards ── */}
                {(msg.widgetType === "doctor_cards" || (msg.step === ChatStep.DOCTOR_SELECTION && currentStep === ChatStep.DOCTOR_SELECTION)) && (
                  <div className="p-3 bg-white rounded-2xl border border-teal-200 shadow-sm space-y-2 animate-in fade-in duration-300">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
                      <span className="text-[11px] font-extrabold text-slate-800 flex items-center gap-1">
                        <Stethoscope className="w-3.5 h-3.5 text-teal-600" />
                        {isHindi ? `${booking.doctorSpecialty} विशेषज्ञ डॉक्टर:` : `${booking.doctorSpecialty} Specialist Doctors:`}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {(SPECIALTY_DOCTORS[booking.doctorSpecialty] || SPECIALTY_DOCTORS["General Physician"]).map((doc) => (
                        <div
                          key={doc.id}
                          onClick={() => handleUserInput(doc.name)}
                          className="p-3 rounded-xl border border-slate-200 hover:border-teal-500 bg-white hover:bg-teal-50/40 transition-all cursor-pointer space-y-1.5 shadow-2xs group"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="w-7 h-7 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center font-black text-xs">
                                {doc.name.replace("Dr. ", "").charAt(0)}
                              </div>
                              <div>
                                <span className="font-extrabold text-xs text-slate-900 group-hover:text-teal-700 transition-colors block leading-tight">
                                  {doc.name}
                                </span>
                                <span className="text-[10px] text-teal-700 font-semibold">{doc.specialty} • {doc.experience}</span>
                              </div>
                            </div>
                            <span className="text-[10px] font-bold text-amber-600 flex items-center gap-0.5">
                              <Star className="w-2.5 h-2.5 fill-amber-500 text-amber-500" /> {doc.rating}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-100">
                            <span>🚪 {doc.chamber}</span>
                            <Badge className="bg-emerald-100 text-emerald-800 text-[9px] font-bold border-0">
                              🟢 Live OPD
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* ── Interactive Widget: 72-Hour / 3-Day Time Slot Matrix + Urgent Option ── */}
                {(msg.widgetType === "time_matrix" || (msg.step === ChatStep.TIMING && currentStep === ChatStep.TIMING)) && (
                  <div className="p-3.5 bg-white rounded-2xl border border-teal-300 shadow-sm space-y-3 animate-in fade-in duration-300">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                      <span className="text-[11px] font-extrabold text-slate-800 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-teal-600" />
                        {isHindi ? "परामर्श दिन व समय चुनें (72 घंटे विंडो):" : "Select OPD Consultation Slot (72-Hr Window):"}
                      </span>
                      <span className="text-[9px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">
                        ⏱️ Max 3 Days
                      </span>
                    </div>

                    {/* Day Tabs (Today / Tomorrow / Day After) */}
                    <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100/80 rounded-xl">
                      {threeDayOptions.map((day) => (
                        <button
                          key={day.key}
                          type="button"
                          onClick={() => setSelectedDayTab(day.key)}
                          className={`py-1.5 px-2 rounded-lg text-[11px] font-extrabold transition-all text-center ${
                            selectedDayTab === day.key
                              ? "bg-teal-600 text-white shadow-xs"
                              : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
                          }`}
                        >
                          {day.label}
                        </button>
                      ))}
                    </div>

                    {/* Time Slots for Selected Day */}
                    <div className="space-y-2 pt-1">
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1">☀️ {isHindi ? "सुबह (Morning)" : "Morning"}</span>
                        <div className="flex flex-wrap gap-1.5">
                          {TIME_MATRIX.morning.map((slot, i) => (
                            <button
                              key={i}
                              type="button"
                              onClick={() => handleUserInput(`${selectedDayTab} ${slot}`)}
                              className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-50 border border-slate-200 hover:bg-teal-600 hover:text-white transition-all text-slate-700 hover:border-teal-600"
                            >
                              {slot}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1">⛅ {isHindi ? "दोपहर (Afternoon)" : "Afternoon"}</span>
                        <div className="flex flex-wrap gap-1.5">
                          {TIME_MATRIX.afternoon.map((slot, i) => (
                            <button
                              key={i}
                              type="button"
                              onClick={() => handleUserInput(`${selectedDayTab} ${slot}`)}
                              className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-50 border border-slate-200 hover:bg-teal-600 hover:text-white transition-all text-slate-700 hover:border-teal-600"
                            >
                              {slot}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1">🌙 {isHindi ? "शाम (Evening)" : "Evening"}</span>
                        <div className="flex flex-wrap gap-1.5">
                          {TIME_MATRIX.evening.map((slot, i) => (
                            <button
                              key={i}
                              type="button"
                              onClick={() => handleUserInput(`${selectedDayTab} ${slot}`)}
                              className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-50 border border-slate-200 hover:bg-teal-600 hover:text-white transition-all text-slate-700 hover:border-teal-600"
                            >
                              {slot}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Urgent Staff Approval Request Button */}
                    <div className="pt-2 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={() => handleUserInput("🚨 Urgent Request for Staff Approval")}
                        className="w-full flex items-center justify-between p-2.5 rounded-xl bg-gradient-to-r from-rose-50 to-amber-50 hover:from-rose-100 hover:to-amber-100 border border-rose-200 text-rose-900 transition-all text-left group"
                      >
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 bg-rose-500 text-white rounded-lg group-hover:scale-105 transition-transform">
                            <AlertTriangle className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="font-extrabold text-xs block text-rose-950">
                              {isHindi ? "गंभीर स्थिति? तत्काल स्टाफ अनुमोदन भेजें" : "Need Urgent Care? Send Staff Approval Request"}
                            </span>
                            <span className="text-[10px] text-rose-700">
                              {isHindi ? "यदि स्लॉट अनुपलब्ध हैं या तुरंत डॉक्टर चाहिए" : "For acute symptoms or when slots are full"}
                            </span>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-rose-600 group-hover:translate-x-0.5 transition-transform" />
                      </button>
                    </div>
                  </div>
                )}

                {/* ── Live Doctor Availability Verification Card ── */}
                {msg.isAvailabilityCard && (
                  <Card className="border-2 border-emerald-400 bg-emerald-50/70 rounded-2xl shadow-sm overflow-hidden animate-in fade-in duration-200 p-4 space-y-3">
                    <div className="flex items-center justify-between border-b border-emerald-200 pb-2">
                      <div className="flex items-center gap-2">
                        <UserCheck className="w-4 h-4 text-emerald-700" />
                        <h4 className="font-black text-xs text-emerald-950">
                          {isHindi ? "डॉक्टर उपलब्धता एवं समय सत्यापन" : "Doctor Live Schedule & Slot Verified"}
                        </h4>
                      </div>
                      <Badge className="bg-emerald-600 text-white text-[10px] font-bold">
                        ✓ Confirmed Slot
                      </Badge>
                    </div>

                    <div className="space-y-1.5 text-xs text-slate-700">
                      <div className="flex justify-between">
                        <span className="text-slate-500">{isHindi ? "डॉक्टर:" : "Doctor:"}</span>
                        <strong className="text-slate-900">{booking.doctorName} ({booking.doctorSpecialty})</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">{isHindi ? "तारीख व समय:" : "Date & Timing:"}</span>
                        <strong className="text-emerald-800">{booking.date} • {booking.time}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">{isHindi ? "ओपीडी कक्ष:" : "OPD Chamber:"}</span>
                        <span className="font-mono text-slate-800">{booking.doctorChamber}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">{isHindi ? "अस्पताल:" : "Hospital:"}</span>
                        <span className="font-semibold text-slate-800">{booking.hospital}</span>
                      </div>
                    </div>
                  </Card>
                )}

                {/* ── Summary & Confirmation Card ── */}
                {msg.isSummary && (
                  <Card className="border-2 border-teal-500 bg-gradient-to-br from-white to-teal-50/50 rounded-2xl shadow-md overflow-hidden animate-in zoom-in-95 duration-200 p-4 space-y-3">
                    <div className="flex items-center justify-between border-b border-teal-100 pb-2">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-teal-600 text-white rounded-lg">
                          <CheckCheck className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="font-black text-xs text-teal-950">
                            {booking.isUrgent ? (isHindi ? "🚨 तत्काल ओपीडी अनुरोध" : "🚨 Urgent Fast-Track OPD Request") : (isHindi ? "ओपीडी अपॉइंटमेंट विवरण" : "OPD Consultation Summary")}
                          </h4>
                          <span className="text-[10px] text-slate-400 block">
                            {isHindi ? "कृपया विवरण जांचें और पुष्टि करें" : "Please review details before booking token"}
                          </span>
                        </div>
                      </div>
                      <Badge className={`text-[10px] font-black ${booking.isUrgent ? "bg-rose-600 text-white animate-pulse" : "bg-teal-700 text-white"}`}>
                        {booking.isUrgent ? "URGENT" : "OPD PASS"}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="p-2 bg-white rounded-xl border border-slate-200/80">
                        <span className="text-[10px] text-slate-400 uppercase font-bold block">{isHindi ? "मरीज का नाम" : "Patient Name"}</span>
                        <strong className="text-slate-900 text-[11px] truncate block">{booking.fullName}</strong>
                        <span className="text-[10px] text-slate-500 font-mono">{booking.phone}</span>
                      </div>

                      <div className="p-2 bg-white rounded-xl border border-slate-200/80">
                        <span className="text-[10px] text-slate-400 uppercase font-bold block">{isHindi ? "चिकित्सक / विभाग" : "Attending Doctor"}</span>
                        <strong className="text-slate-900 text-[11px] truncate block">{booking.doctorName}</strong>
                        <span className="text-[10px] text-teal-700 font-semibold">{booking.doctorSpecialty}</span>
                      </div>

                      <div className="p-2 bg-white rounded-xl border border-slate-200/80">
                        <span className="text-[10px] text-slate-400 uppercase font-bold block">{isHindi ? "अस्पताल" : "Hospital"}</span>
                        <strong className="text-slate-900 text-[11px] truncate block">{booking.hospital}</strong>
                        <span className="text-[10px] text-slate-500">{booking.doctorChamber}</span>
                      </div>

                      <div className="p-2 bg-white rounded-xl border border-slate-200/80">
                        <span className="text-[10px] text-slate-400 uppercase font-bold block">{isHindi ? "दिन व समय" : "Date & Timing"}</span>
                        <strong className="text-emerald-700 text-[11px] truncate block">{booking.date}</strong>
                        <span className="text-[10px] text-slate-600">{booking.time}</span>
                      </div>
                    </div>

                    {booking.isUrgent && (
                      <div className="p-2 bg-rose-50 border border-rose-200 rounded-xl text-[10px] text-rose-900 font-bold flex items-center gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                        <span>{isHindi ? "यह तत्काल अनुरोध ऑन-ड्यूटी अस्पताल स्टाफ को प्राथमिकता अनुमोदन के लिए भेजा जाएगा।" : "Fast-track ticket will be sent to hospital staff for immediate approval."}</span>
                      </div>
                    )}

                    <div className="flex items-center gap-2 pt-1">
                      <Button
                        type="button"
                        onClick={handleConfirmBooking}
                        className="flex-1 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white text-xs font-extrabold h-9 rounded-xl shadow-md shadow-teal-600/20"
                      >
                        ✓ {booking.isUrgent ? (isHindi ? "तत्काल अनुरोध भेजें" : "Submit Urgent Request") : (isHindi ? "पुष्टि करें व टोकन लें" : "Confirm & Book Token")}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleEditBooking}
                        className="h-9 px-3 text-xs border-slate-300 text-slate-700 rounded-xl"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </Card>
                )}

                {/* ── Quick Action Options Pills ── */}
                {msg.options && msg.options.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {msg.options.map((opt, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => handleUserInput(opt)}
                        className="px-3 py-1.5 rounded-full text-xs font-semibold bg-white border border-teal-200 text-teal-800 hover:bg-teal-600 hover:text-white transition-all shadow-2xs active:scale-95 flex items-center gap-1"
                      >
                        <span>{opt}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {isTyping && (
          <div className="flex items-center gap-2 text-slate-400 text-xs">
            <div className="w-7 h-7 rounded-full bg-teal-600 text-white flex items-center justify-center shadow-xs">
              <Bot className="w-3.5 h-3.5" />
            </div>
            <div className="flex items-center gap-1 bg-white px-3 py-2 rounded-2xl border border-slate-200/80 shadow-2xs">
              <span className="w-1.5 h-1.5 bg-teal-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
              <span className="w-1.5 h-1.5 bg-teal-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
              <span className="w-1.5 h-1.5 bg-teal-500 rounded-full animate-bounce" />
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* ── Input Bar ── */}
      <div className="p-3 bg-white border-t border-slate-200/80 shrink-0">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (inputText.trim()) {
              handleUserInput(inputText);
            }
          }}
          className="flex items-center gap-2"
        >
          <button
            type="button"
            onClick={toggleListening}
            className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all shadow-xs shrink-0 ${
              isListening
                ? "bg-rose-500 text-white animate-pulse shadow-rose-500/30"
                : "bg-slate-100 hover:bg-slate-200 text-slate-700"
            }`}
            title={isListening ? "Listening..." : "Click to speak"}
          >
            <Mic className={`w-4 h-4 ${isListening ? "animate-spin" : ""}`} />
          </button>

          <Input
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={
              isListening
                ? (isHindi ? "सुन रहे हैं... बोलिए..." : "Listening... Speak now...")
                : (isHindi ? "अपना उत्तर या लक्षण यहाँ लिखें..." : "Type your answer or symptoms here...")
            }
            className="flex-1 h-10 rounded-2xl bg-slate-50 border-slate-200 text-xs sm:text-sm focus-visible:ring-teal-500"
          />

          <Button
            type="submit"
            disabled={!inputText.trim() || isTyping}
            className="h-10 px-4 rounded-2xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-bold shadow-md shadow-teal-600/20 shrink-0"
          >
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>

    </div>
  );
}
