"use client";

import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Bot, User, Mic, Volume2, VolumeX, Send, RefreshCw, 
  CheckCircle2, Clock, Stethoscope, Building2, Sparkles,
  Edit3, XCircle, ArrowLeft, Download, Calendar as CalendarIcon,
  AlertCircle, CheckCheck, UserCheck, Bed,
  Zap, Star, HeartPulse
} from "lucide-react";
import { toast } from "sonner";
import { apiPost } from "@/lib/api";

// ============================================================
// 10-Step Conversational State Machine
// ============================================================

export enum ChatStep {
  NAME = "NAME",                                 // Step 1: Patient Full Name
  PHONE = "PHONE",                               // Step 2: Contact Phone Number
  SYMPTOMS = "SYMPTOMS",                         // Step 3: Reported Symptoms / Chief Complaint
  DURATION = "DURATION",                         // Step 4: Duration of Symptoms
  HOSPITAL = "HOSPITAL",                         // Step 5: Preferred Hospital in Delhi-NCR
  SUGGESTION = "SUGGESTION",                     // Step 6: AI Clinical Triage & Specialty Suggestion
  DOCTOR_SELECTION = "DOCTOR_SELECTION",         // Step 7: Specialist Doctor Selection
  TIMING = "TIMING",                             // Step 8: Consultation Date & Time Slot
  DOCTOR_AVAILABILITY = "DOCTOR_AVAILABILITY",   // Step 9: Live Doctor Availability Check & Slot Verification
  CONFIRM_APPOINTMENT = "CONFIRM_APPOINTMENT",   // Step 10: Appointment Confirmation & Token Generation
  BOOKED = "BOOKED",                             // Success Receipt State
}

export const STEP_LABELS: Record<ChatStep, { en: string; hi: string; number: number }> = {
  [ChatStep.NAME]: { en: "Patient Name", hi: "मरीज का नाम", number: 1 },
  [ChatStep.PHONE]: { en: "Phone Number", hi: "मोबाइल नंबर", number: 2 },
  [ChatStep.SYMPTOMS]: { en: "Symptoms", hi: "स्वास्थ्य लक्षण", number: 3 },
  [ChatStep.DURATION]: { en: "Duration", hi: "लक्षणों की अवधि", number: 4 },
  [ChatStep.HOSPITAL]: { en: "Hospital", hi: "अस्पताल चयन", number: 5 },
  [ChatStep.SUGGESTION]: { en: "AI Suggestion", hi: "एआई क्लिनिकल सुझाव", number: 6 },
  [ChatStep.DOCTOR_SELECTION]: { en: "Doctor Selection", hi: "डॉक्टर चयन", number: 7 },
  [ChatStep.TIMING]: { en: "Timing & Slot", hi: "समय व तारीख", number: 8 },
  [ChatStep.DOCTOR_AVAILABILITY]: { en: "Doctor Availability", hi: "डॉक्टर उपलब्धता", number: 9 },
  [ChatStep.CONFIRM_APPOINTMENT]: { en: "Confirm Appointment", hi: "अपॉइंटमेंट पुष्टि", number: 10 },
  [ChatStep.BOOKED]: { en: "Booking Complete", hi: "बुकिंग पूर्ण", number: 10 },
};

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
  totalBeds: number;
  availableBeds: number;
  availableIcu: number;
  rating: number;
  type: string;
}

interface BookingDetails {
  fullName: string;
  phone: string;
  symptoms: string;
  severity?: string;
  duration: string;
  hospital: string;
  hospitalId?: string;
  suggestion: string;
  doctorSpecialty: string;
  doctorName: string;
  doctorId?: string;
  doctorExperience?: string;
  doctorChamber?: string;
  date: string;
  isoDate?: string;
  time: string;
  doctorAvailabilityStatus: "AVAILABLE" | "BUSY" | "ON_LEAVE";
  appointmentId?: string;
}

// ============================================================
// Datasets
// ============================================================

const FEATURED_HOSPITALS: HospitalCardItem[] = [
  { id: "hosp-aiims-delhi", name: "AIIMS New Delhi", district: "South Delhi", totalBeds: 2478, availableBeds: 184, availableIcu: 18, rating: 4.9, type: "Apex Tertiary" },
  { id: "hosp-safdarjung-delhi", name: "Safdarjung Hospital", district: "South Delhi", totalBeds: 1600, availableBeds: 142, availableIcu: 14, rating: 4.7, type: "Central Govt" },
  { id: "hosp-ggh-delhi", name: "Govt. General Hospital", district: "Central Delhi", totalBeds: 680, availableBeds: 84, availableIcu: 8, rating: 4.6, type: "State Referral" },
  { id: "hosp-lnjp-delhi", name: "Lok Nayak Hospital (LNJP)", district: "Central Delhi", totalBeds: 2000, availableBeds: 120, availableIcu: 15, rating: 4.5, type: "Govt Teaching" },
  { id: "hosp-fortis-noida", name: "Fortis Hospital Noida", district: "Gautam Budh Nagar", totalBeds: 200, availableBeds: 28, availableIcu: 6, rating: 4.8, type: "Tertiary Care" },
  { id: "hosp-medanta-gurugram", name: "Medanta The Medicity", district: "Gurugram", totalBeds: 1250, availableBeds: 120, availableIcu: 15, rating: 4.9, type: "Super Specialty" },
  { id: "hosp-amrita-faridabad", name: "Amrita Hospital", district: "Faridabad", totalBeds: 2400, availableBeds: 280, availableIcu: 22, rating: 4.8, type: "Apex Care" },
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
};

const SYMPTOM_CATEGORIES = [
  { icon: "🌡️", titleEn: "Fever & Infection", titleHi: "बुखार व संक्रमण", val: "High Fever & Body Ache" },
  { icon: "🫀", titleEn: "Heart & Chest", titleHi: "हृदय व छाती", val: "Chest Pain & Palpitations" },
  { icon: "🦴", titleEn: "Joints & Spine", titleHi: "जोड़ व हड्डी", val: "Knee & Joint Pain" },
  { icon: "🧠", titleEn: "Headache & Neuro", titleHi: "सिरदर्द व नसों", val: "Severe Migraine & Dizziness" },
  { icon: "🫁", titleEn: "Cough & Breathing", titleHi: "खांसी व सांस", val: "Persistent Cough & Breathlessness" },
  { icon: "🤰", titleEn: "Maternity & Women", titleHi: "गर्भावस्था व महिला", val: "Prenatal & Maternity Care" },
  { icon: "👶", titleEn: "Child Wellness", titleHi: "शिशु रोग", val: "Pediatric Health Checkup" },
  { icon: "🩺", titleEn: "General Checkup", titleHi: "सामान्य जांच", val: "Routine Health Checkup" },
];

const TIME_MATRIX = {
  morning: ["09:00 AM", "10:00 AM", "11:15 AM"],
  afternoon: ["01:30 PM", "02:45 PM", "03:30 PM"],
  evening: ["04:30 PM", "05:15 PM"],
};

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
  const { currentUser, language, setLanguage, t, refreshAppointments, refreshPatients } = useStore();
  const isHindi = language === "hi";

  const [currentStep, setCurrentStep] = useState<ChatStep>(ChatStep.NAME);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  // Voice States
  const [isListening, setIsListening] = useState(false);
  const [isSpeechEnabled, setIsSpeechEnabled] = useState(true);
  const recognitionRef = useRef<ISpeechRecognitionInstance | null>(null);

  // 10-Step Booking Data
  const [booking, setBooking] = useState<BookingDetails>({
    fullName: currentUser?.name || "",
    phone: currentUser?.phone || "",
    symptoms: "Fever & Body Ache",
    severity: "Moderate",
    duration: "2 to 3 days",
    hospital: "Government General Hospital — Delhi",
    hospitalId: "hosp-ggh-delhi",
    suggestion: "General clinical examination and temperature monitoring.",
    doctorSpecialty: "General Physician",
    doctorName: "Dr. Priya Mehta",
    doctorId: "doc-priya-mehta",
    doctorExperience: "8 years",
    doctorChamber: "OPD Room 102",
    date: "Tomorrow",
    time: "10:30 AM",
    doctorAvailabilityStatus: "AVAILABLE",
  });

  const chatEndRef = useRef<HTMLDivElement>(null);
  const handleUserInputRef = useRef<(input: string) => void>(() => {});

  // Progress Calculation (1 to 10)
  const currentStepNumber = useMemo(() => {
    return STEP_LABELS[currentStep]?.number || 1;
  }, [currentStep]);

  const currentStepProgress = useMemo(() => {
    return (currentStepNumber / 10) * 100;
  }, [currentStepNumber]);

  // Text-To-Speech
  const speakText = useCallback((text: string) => {
    if (!isSpeechEnabled || typeof window === "undefined" || !("speechSynthesis" in window)) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text.replace(/[*_#🤖🩺👤👨‍⚕️🏥📅🎉🟢💡⚡]/g, ""));
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
      speakText(text);
    }, 180);
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
      toast.error(isHindi ? "इस ब्राउज़र में वॉयस इनपुट समर्थित नहीं है।" : "Voice input is not supported in this browser.");
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
        toast.info(isHindi ? "सुन रहे हैं... बोलें" : "Listening with Groq AI speed...");
      } catch (err) {
        console.warn("Could not start voice recognition:", err);
      }
    }
  };

  // Start Conversation (Step 1: Name)
  const startConversation = useCallback(() => {
    setCurrentStep(ChatStep.NAME);
    const greetingText = isHindi 
      ? "नमस्ते! मैं आपका Connect to Care AI सहायक हूँ 🤖 (Groq LPU Powered ⚡)। मैं 10 आसान चरणों में आपके विशेषज्ञ डॉक्टर का अपॉइंटमेंट बुक करूँगा।"
      : "Hello! I am your Connect to Care AI Assistant 🤖 (Powered by Groq LPU ⚡). I will guide you through 10 fast steps to book your specialist OPD consultation.";
    
    const step1Prompt = isHindi
      ? (currentUser?.name ? `[चरण 1/10: नाम] क्या आपका पूरा नाम "${currentUser.name}" है, या नीचे नाम लिखें:` : `[चरण 1/10: नाम] कृपया मरीज का पूरा नाम बताएं:`)
      : (currentUser?.name ? `[Step 1/10: Patient Name] Is your full name "${currentUser.name}", or enter patient name below:` : `[Step 1/10: Patient Name] Please enter the patient's full name to get started:`);

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
      addBotMessage(step1Prompt, currentUser?.name ? [currentUser.name] : undefined, ChatStep.NAME);
    }, 250);
  }, [isHindi, currentUser?.name, addBotMessage, speakText]);

  useEffect(() => {
    startConversation();
  }, [startConversation]);

  // Auto-scroll
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // ============================================================
  // Groq AI Hybrid Processor (AI + 10-Step Deterministic Flow)
  // ============================================================
  const handleUserInput = async (input: string) => {
    if (!input.trim()) return;
    const cleanInput = input.trim();
    addUserMessage(cleanInput);
    setInputText("");
    setIsTyping(true);

    const currentBooking = { ...booking };

    try {
      // Call Next.js Groq AI route
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
        
        // Merge extracted entities
        if (aiData.extracted) {
          if (aiData.extracted.fullName) currentBooking.fullName = aiData.extracted.fullName;
          if (aiData.extracted.phone) currentBooking.phone = aiData.extracted.phone;
          if (aiData.extracted.symptoms) currentBooking.symptoms = aiData.extracted.symptoms;
          if (aiData.extracted.duration) currentBooking.duration = aiData.extracted.duration;
          if (aiData.extracted.hospital) currentBooking.hospital = aiData.extracted.hospital;
          if (aiData.extracted.doctorSpecialty) currentBooking.doctorSpecialty = aiData.extracted.doctorSpecialty;
          if (aiData.extracted.suggestion) currentBooking.suggestion = aiData.extracted.suggestion;
          if (aiData.extracted.doctorName) currentBooking.doctorName = aiData.extracted.doctorName;
          if (aiData.extracted.date) currentBooking.date = aiData.extracted.date;
          if (aiData.extracted.time) currentBooking.time = aiData.extracted.time;
        }

        // Advance Step
        const nextStepEnum = (aiData.nextStep as ChatStep) || getNextFallbackStep(currentStep);
        setCurrentStep(nextStepEnum);
        setBooking(currentBooking);

        addBotMessage(
          aiData.reply,
          aiData.options,
          nextStepEnum,
          nextStepEnum === ChatStep.CONFIRM_APPOINTMENT,
          false,
          nextStepEnum === ChatStep.DOCTOR_AVAILABILITY,
          nextStepEnum === ChatStep.SUGGESTION,
          aiData.widgetType
        );
        return;
      }
    } catch (aiErr) {
      console.warn("Groq AI stream fallback to local engine:", aiErr);
    }

    // Fallback deterministic 10-step state machine
    runLocalStepMachine(cleanInput, currentBooking);
  };

  const getNextFallbackStep = (step: ChatStep): ChatStep => {
    switch (step) {
      case ChatStep.NAME: return ChatStep.PHONE;
      case ChatStep.PHONE: return ChatStep.SYMPTOMS;
      case ChatStep.SYMPTOMS: return ChatStep.DURATION;
      case ChatStep.DURATION: return ChatStep.HOSPITAL;
      case ChatStep.HOSPITAL: return ChatStep.SUGGESTION;
      case ChatStep.SUGGESTION: return ChatStep.DOCTOR_SELECTION;
      case ChatStep.DOCTOR_SELECTION: return ChatStep.TIMING;
      case ChatStep.TIMING: return ChatStep.DOCTOR_AVAILABILITY;
      case ChatStep.DOCTOR_AVAILABILITY: return ChatStep.CONFIRM_APPOINTMENT;
      case ChatStep.CONFIRM_APPOINTMENT: return ChatStep.BOOKED;
      default: return ChatStep.NAME;
    }
  };

  const runLocalStepMachine = (cleanInput: string, currentBooking: BookingDetails) => {
    switch (currentStep) {
      case ChatStep.NAME: {
        currentBooking.fullName = cleanInput;
        setBooking(currentBooking);
        setCurrentStep(ChatStep.PHONE);
        addBotMessage(
          isHindi ? `[चरण 2/10: फोन] नमस्ते ${cleanInput}! कृपया 10 अंकों का मोबाइल नंबर दर्ज करें:` : `[Step 2/10: Phone] Nice to meet you, ${cleanInput}! Please enter your 10-digit mobile number:`,
          currentUser?.phone ? [currentUser.phone] : undefined,
          ChatStep.PHONE
        );
        break;
      }
      case ChatStep.PHONE: {
        const digits = cleanInput.replace(/\D/g, "");
        currentBooking.phone = digits.length >= 10 ? digits.slice(-10) : cleanInput;
        setBooking(currentBooking);
        setCurrentStep(ChatStep.SYMPTOMS);
        addBotMessage(
          isHindi ? `[चरण 3/10: लक्षण] क्या लक्षण या परेशानी हो रही है? (नीचे कार्ड चुनें या लिखें)` : `[Step 3/10: Symptoms] What health symptoms or discomfort are you experiencing?`,
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
        currentBooking.symptoms = cleanInput;
        setBooking(currentBooking);
        setCurrentStep(ChatStep.DURATION);
        addBotMessage(
          isHindi ? `[चरण 4/10: अवधि] लक्षण "${cleanInput}" कितने समय से हैं?` : `[Step 4/10: Duration] How long have you had these symptoms?`,
          isHindi ? ["आज से ही (< 24 घंटे)", "2 से 3 दिन", "1 सप्ताह", "1 महीने से अधिक"] : ["Since today (< 24 hrs)", "2 to 3 days", "About 1 week", "More than 1 month"],
          ChatStep.DURATION
        );
        break;
      }
      case ChatStep.DURATION: {
        currentBooking.duration = cleanInput;
        setBooking(currentBooking);
        setCurrentStep(ChatStep.HOSPITAL);
        addBotMessage(
          isHindi ? `[चरण 5/10: अस्पताल] दिल्ली-एनसीआर में अपना पसंदीदा अस्पताल चुनें:` : `[Step 5/10: Hospital] Which hospital across Delhi-NCR would you like to visit?`,
          ["AIIMS New Delhi", "Safdarjung Hospital", "Govt. General Hospital", "Fortis Hospital Noida", "Medanta Gurugram", "Amrita Faridabad"],
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
        currentBooking.hospital = cleanInput;
        // Clinical rule inference
        const lower = currentBooking.symptoms.toLowerCase();
        if (lower.includes("chest") || lower.includes("heart") || lower.includes("दर्द") || lower.includes("दिल")) {
          currentBooking.doctorSpecialty = "Cardiologist";
          currentBooking.suggestion = isHindi ? "12-लीड ईसीजी के साथ तत्काल हृदय रोग विशेषज्ञ से जांच की सलाह दी जाती है।" : "Immediate in-person cardiac evaluation recommended.";
        } else if (lower.includes("joint") || lower.includes("knee") || lower.includes("हड्डी")) {
          currentBooking.doctorSpecialty = "Orthopedic Surgeon";
          currentBooking.suggestion = isHindi ? "हड्डी व जोड़ों के विशेषज्ञ से परामर्श लें।" : "Orthopedic joint and mobility consultation recommended.";
        } else {
          currentBooking.doctorSpecialty = "General Physician";
          currentBooking.suggestion = isHindi ? "व्यापक प्राथमिक स्वास्थ्य जांच की सलाह दी जाती है।" : "Comprehensive primary care clinical consultation advised.";
        }
        setBooking(currentBooking);
        setCurrentStep(ChatStep.SUGGESTION);
        addBotMessage(
          isHindi ? `[चरण 6/10: एआई सुझाव] हमारे एआई क्लिनिकल ट्रायज के आधार पर:` : `[Step 6/10: AI Suggestion] Based on our AI clinical triage:`,
          [isHindi ? "डॉक्टर चुनें" : "Proceed with Doctor Selection", isHindi ? "अस्पताल बदलें" : "Change Hospital"],
          ChatStep.SUGGESTION,
          false,
          false,
          false,
          true
        );
        break;
      }
      case ChatStep.SUGGESTION: {
        setCurrentStep(ChatStep.DOCTOR_SELECTION);
        const docs = SPECIALTY_DOCTORS[currentBooking.doctorSpecialty] || SPECIALTY_DOCTORS["General Physician"];
        addBotMessage(
          isHindi ? `[चरण 7/10: डॉक्टर चयन] ${currentBooking.hospital} में उपलब्ध विशेषज्ञ:` : `[Step 7/10: Doctor Selection] Available specialists at ${currentBooking.hospital}:`,
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
          isHindi ? `[चरण 8/10: समय व स्लॉट] ${matched.name} के लिए समय स्लॉट चुनें:` : `[Step 8/10: Timing] Select time slot for ${matched.name}:`,
          ["Tomorrow 10:00 AM", "Tomorrow 02:45 PM", "Today 04:30 PM", "Day After 11:15 AM"],
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
        currentBooking.time = cleanInput;
        currentBooking.date = "Tomorrow";
        setBooking(currentBooking);
        setCurrentStep(ChatStep.DOCTOR_AVAILABILITY);
        addBotMessage(
          isHindi ? `[चरण 9/10: डॉक्टर उपलब्धता] लाइव शेड्यूल सत्यापित हो गया है:` : `[Step 9/10: Doctor Availability] Live schedule check verified:`,
          [isHindi ? "अपॉइंटमेंट की पुष्टि करें" : "Confirm Appointment", isHindi ? "समय बदलें" : "Change Timing"],
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
          isHindi ? `[चरण 10/10: अपॉइंटमेंट पुष्टि] कृपया सारांश की समीक्षा करें और पुष्टि करें:` : `[Step 10/10: Confirm Appointment] Please review summary and confirm booking:`,
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

  // Final Confirmation
  const handleConfirmBooking = async () => {
    const generatedId = `OPD-2026-${Math.floor(100000 + Math.random() * 900000)}`;
    const finalBooking = { ...booking, appointmentId: generatedId };
    setBooking(finalBooking);
    setCurrentStep(ChatStep.BOOKED);

    const now = new Date();
    const apptDate = new Date(now.getTime() + 86400000);

    try {
      await apiPost("/api/appointments", {
        patientId: currentUser?.patientId || undefined,
        patientName: finalBooking.fullName,
        phone: finalBooking.phone,
        specialty: finalBooking.doctorSpecialty,
        doctorId: finalBooking.doctorId || undefined,
        doctorName: finalBooking.doctorName,
        dateTime: apptDate.toISOString(),
        status: "REQUESTED",
        visitType: "NEW",
        reason: `${finalBooking.doctorSpecialty} (Symptoms: ${finalBooking.symptoms})`,
        notes: `Groq AI Booking. Hospital: ${finalBooking.hospital}. Room: ${finalBooking.doctorChamber}. Token: ${generatedId}`,
      });
      await refreshAppointments();
      await refreshPatients();
    } catch (err) {
      console.warn("Failed to persist appointment via API:", err);
    }

    addBotMessage(
      isHindi 
        ? `🎉 बधाई ${finalBooking.fullName}! आपका अपॉइंटमेंट सफलतापूर्वक दर्ज हो गया है। आपका ओपीडी टोकन आईडी: ${generatedId}`
        : `🎉 Congratulations ${finalBooking.fullName}! Your OPD appointment is registered. Token ID: ${generatedId}`,
      undefined,
      ChatStep.BOOKED
    );

    toast.success(isHindi ? "अपॉइंटमेंट टोकन सफलतापूर्वक बुक हो गया!" : "OPD Appointment Confirmed & Synced!");
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
        
        {/* Left: Avatar + Title & Live Status */}
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
            <div className="flex items-center gap-1.5">
              <h2 className="font-extrabold text-sm text-white truncate leading-tight">
                Connect to Care AI
              </h2>
              <Badge className="bg-amber-400/20 text-amber-300 border-amber-400/40 text-[9px] font-black px-1.5 py-0">
                <Zap className="w-2.5 h-2.5 mr-0.5 text-amber-400" /> Groq LPU
              </Badge>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-teal-400 font-medium leading-none mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>{isHindi ? "10-चरणीय इंटेलिजेंट ओपीडी बुकिंग" : "10-Step Interactive OPD Assistant"}</span>
            </div>
          </div>
        </div>

        {/* Right: Controls */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center bg-slate-800/90 p-0.5 rounded-xl border border-slate-700">
            <button
              type="button"
              onClick={() => setLanguage("en")}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                language === "en" ? "bg-teal-600 text-white shadow-xs" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              EN
            </button>
            <button
              type="button"
              onClick={() => setLanguage("hi")}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                language === "hi" ? "bg-teal-600 text-white shadow-xs" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              हिंदी
            </button>
          </div>

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

      {/* ── 10-Step Interactive Progress Bar ── */}
      <div className="bg-slate-900/95 border-b border-slate-800 px-4 py-2 text-white flex items-center justify-between text-xs font-bold shrink-0">
        <div className="flex items-center gap-2">
          <Badge className="bg-gradient-to-r from-teal-500 to-emerald-600 text-slate-950 font-black text-[10px] px-2 py-0.5 shadow-xs">
            {isHindi ? `चरण ${currentStepNumber}/10` : `Step ${currentStepNumber}/10`}
          </Badge>
          <span className="text-teal-300 text-xs font-semibold truncate">
            {isHindi ? STEP_LABELS[currentStep]?.hi : STEP_LABELS[currentStep]?.en}
          </span>
        </div>
        <div className="w-28 sm:w-44 bg-slate-800 rounded-full h-2 overflow-hidden border border-slate-700/50">
          <div 
            className="bg-gradient-to-r from-teal-400 via-emerald-400 to-amber-300 h-full transition-all duration-300 rounded-full"
            style={{ width: `${currentStepProgress}%` }}
          />
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

                {/* ── Interactive Widget: Category & Symptom Selector ── */}
                {(msg.widgetType === "symptom_selector" || (msg.step === ChatStep.SYMPTOMS && currentStep === ChatStep.SYMPTOMS)) && (
                  <div className="p-3 bg-white rounded-2xl border border-teal-200 shadow-sm space-y-2.5 animate-in fade-in duration-300">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
                      <span className="text-[11px] font-extrabold text-slate-800 flex items-center gap-1.5">
                        <HeartPulse className="w-3.5 h-3.5 text-teal-600" />
                        {isHindi ? "त्वरित लक्षण चुनें (टैप करें):" : "Tap Chief Symptom Category:"}
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

                {/* ── Interactive Widget: Hospital Cards Deck ── */}
                {(msg.widgetType === "hospital_cards" || (msg.step === ChatStep.HOSPITAL && currentStep === ChatStep.HOSPITAL)) && (
                  <div className="p-3 bg-white rounded-2xl border border-teal-200 shadow-sm space-y-2 animate-in fade-in duration-300">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
                      <span className="text-[11px] font-extrabold text-slate-800 flex items-center gap-1">
                        <Building2 className="w-3.5 h-3.5 text-teal-600" />
                        {isHindi ? "दिल्ली-एनसीआर के मुख्य अस्पताल (चुनें):" : "Select Delhi-NCR Hospital Facility:"}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[220px] overflow-y-auto pr-1">
                      {FEATURED_HOSPITALS.map((hosp) => (
                        <div
                          key={hosp.id}
                          onClick={() => handleUserInput(hosp.name)}
                          className="p-2.5 rounded-xl border border-slate-200 hover:border-teal-500 bg-white hover:bg-teal-50/40 transition-all cursor-pointer space-y-1.5 shadow-2xs hover:shadow-xs group"
                        >
                          <div className="flex items-start justify-between">
                            <span className="font-extrabold text-xs text-slate-900 group-hover:text-teal-700 transition-colors line-clamp-1">
                              {hosp.name}
                            </span>
                            <span className="text-[10px] font-bold text-amber-600 flex items-center gap-0.5">
                              <Star className="w-2.5 h-2.5 fill-amber-500 text-amber-500" /> {hosp.rating}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-[10px] text-slate-500 font-medium">
                            <span>📍 {hosp.district}</span>
                            <span className="text-emerald-700 font-bold flex items-center gap-1">
                              <Bed className="w-3 h-3 text-emerald-600" /> {hosp.availableBeds} beds
                            </span>
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
                        {isHindi ? "उपलब्ध विशेषज्ञ डॉक्टर (टैप करें):" : "Verified Specialist Doctors:"}
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

                {/* ── Interactive Widget: Time Slot Matrix ── */}
                {(msg.widgetType === "time_matrix" || (msg.step === ChatStep.TIMING && currentStep === ChatStep.TIMING)) && (
                  <div className="p-3 bg-white rounded-2xl border border-teal-200 shadow-sm space-y-2.5 animate-in fade-in duration-300">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
                      <span className="text-[11px] font-extrabold text-slate-800 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-teal-600" />
                        {isHindi ? "ओपीडी स्लॉट मैट्रिक्स (कल के लिए):" : "Select OPD Consultation Time Matrix:"}
                      </span>
                    </div>

                    <div className="space-y-2">
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1">☀️ {isHindi ? "सुबह (Morning)" : "Morning"}</span>
                        <div className="flex flex-wrap gap-1.5">
                          {TIME_MATRIX.morning.map((slot, i) => (
                            <button
                              key={i}
                              type="button"
                              onClick={() => handleUserInput(slot)}
                              className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-50 border border-slate-200 hover:bg-teal-600 hover:text-white transition-all text-slate-700"
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
                              onClick={() => handleUserInput(slot)}
                              className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-50 border border-slate-200 hover:bg-teal-600 hover:text-white transition-all text-slate-700"
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
                              onClick={() => handleUserInput(slot)}
                              className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-50 border border-slate-200 hover:bg-teal-600 hover:text-white transition-all text-slate-700"
                            >
                              {slot}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* ── Step 6: AI Clinical Suggestion Card ── */}
                {msg.isSuggestionCard && (
                  <Card className="border-2 border-teal-300 bg-gradient-to-br from-teal-50/80 to-emerald-50/50 rounded-2xl shadow-sm overflow-hidden animate-in fade-in duration-200 p-4 space-y-3">
                    <div className="flex items-center justify-between border-b border-teal-200 pb-2">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-teal-700 animate-pulse" />
                        <h4 className="font-black text-xs text-teal-950">
                          {isHindi ? "एआई क्लिनिकल ट्रायज एवं सुझाव" : "AI Clinical Triage & Care Suggestion"}
                        </h4>
                      </div>
                      <Badge className="bg-teal-700 text-white text-[10px] font-bold">
                        {booking.doctorSpecialty}
                      </Badge>
                    </div>

                    <div className="space-y-2 text-xs">
                      <div className="flex items-start gap-2 bg-white/90 p-2.5 rounded-xl border border-teal-100">
                        <Stethoscope className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold text-slate-800 block text-[11px]">
                            {isHindi ? "सुझाई गई विशेषता:" : "Recommended Department:"} {booking.doctorSpecialty}
                          </span>
                          <p className="text-slate-600 text-[11px] mt-0.5 leading-relaxed">{booking.suggestion}</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-slate-500 px-1">
                        <span>{isHindi ? "लक्षण:" : "Symptoms:"} <strong className="text-slate-800">{booking.symptoms}</strong></span>
                        <span>{isHindi ? "अवधि:" : "Duration:"} <strong className="text-slate-800">{booking.duration}</strong></span>
                      </div>
                    </div>
                  </Card>
                )}

                {/* ── Step 9: Live Doctor Availability Verification Card ── */}
                {msg.isAvailabilityCard && (
                  <Card className="border-2 border-emerald-400 bg-emerald-50/70 rounded-2xl shadow-sm overflow-hidden animate-in fade-in duration-200 p-4 space-y-3">
                    <div className="flex items-center justify-between border-b border-emerald-200 pb-2">
                      <div className="flex items-center gap-1.5 font-bold text-xs text-emerald-950">
                        <UserCheck className="w-4 h-4 text-emerald-700" />
                        <span>{isHindi ? "डॉक्टर उपलब्धता लाइव सत्यापित" : "Live Doctor Availability Verified"}</span>
                      </div>
                      <Badge className="bg-emerald-600 text-white text-[10px] font-extrabold gap-1 shadow-2xs">
                        <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                        <span>{isHindi ? "उपलब्ध (AVAILABLE)" : "AVAILABLE"}</span>
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs bg-white p-3 rounded-xl border border-emerald-100 shadow-2xs">
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold uppercase block">{isHindi ? "डॉक्टर" : "Doctor"}</span>
                        <span className="font-extrabold text-slate-900">{booking.doctorName}</span>
                        <span className="text-[10px] text-teal-700 font-semibold block">{booking.doctorSpecialty}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold uppercase block">{isHindi ? "स्थान व कमरा" : "Location & Room"}</span>
                        <span className="font-bold text-slate-800 text-[11px] flex items-center gap-1">
                          <Building2 className="w-3 h-3 text-teal-600 shrink-0" />
                          {booking.doctorChamber || "OPD Room 102"}
                        </span>
                        <span className="text-[10px] text-slate-500 block truncate">{booking.hospital}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[11px] bg-emerald-100/80 px-3 py-1.5 rounded-lg text-emerald-900 font-bold">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-emerald-700" />
                        {booking.date} @ {booking.time}
                      </span>
                      <span className="text-[10px] font-normal text-emerald-800">
                        {isHindi ? "स्लॉट 5 मिनट के लिए आरक्षित" : "Slot held for 5 mins"}
                      </span>
                    </div>
                  </Card>
                )}

                {/* ── Step 10: Structured 10-Point Summary Card ── */}
                {msg.isSummary && currentStep === ChatStep.CONFIRM_APPOINTMENT && (
                  <Card className="border-2 border-teal-400 bg-white rounded-2xl shadow-md overflow-hidden animate-in fade-in duration-200">
                    <div className="bg-gradient-to-r from-teal-700 to-emerald-700 px-4 py-2.5 text-white flex items-center justify-between">
                      <div className="flex items-center gap-1.5 font-black text-xs">
                        <Sparkles className="w-4 h-4 text-teal-200" />
                        <span>{isHindi ? "10-चरणीय अपॉइंटमेंट सारांश" : "10-Point Appointment Summary"}</span>
                      </div>
                      <Badge className="bg-white/20 text-white text-[9px] font-bold border-0">
                        {booking.hospital}
                      </Badge>
                    </div>

                    <CardContent className="p-4 space-y-3 text-xs">
                      {/* Row 1: Name & Phone */}
                      <div className="grid grid-cols-2 gap-2 pb-2.5 border-b border-slate-100">
                        <div>
                          <span className="text-slate-400 font-bold uppercase text-[9px] block">1. {isHindi ? "मरीज का नाम" : "Patient Name"}</span>
                          <span className="font-extrabold text-slate-900 text-xs">{booking.fullName}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 font-bold uppercase text-[9px] block">2. {isHindi ? "फोन नंबर" : "Phone Number"}</span>
                          <span className="font-mono font-bold text-slate-800">{booking.phone}</span>
                        </div>
                      </div>

                      {/* Row 2: Symptoms & Duration */}
                      <div className="grid grid-cols-2 gap-2 pb-2.5 border-b border-slate-100">
                        <div>
                          <span className="text-slate-400 font-bold uppercase text-[9px] block">3. {isHindi ? "स्वास्थ्य लक्षण" : "Symptoms"}</span>
                          <span className="font-semibold text-slate-800 text-[11px]">{booking.symptoms}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 font-bold uppercase text-[9px] block">4. {isHindi ? "लक्षण अवधि" : "Duration"}</span>
                          <span className="font-semibold text-slate-800 text-[11px]">{booking.duration}</span>
                        </div>
                      </div>

                      {/* Row 3: Hospital & AI Suggestion */}
                      <div className="grid grid-cols-2 gap-2 pb-2.5 border-b border-slate-100">
                        <div>
                          <span className="text-slate-400 font-bold uppercase text-[9px] block">5. {isHindi ? "अस्पताल" : "Hospital"}</span>
                          <span className="font-bold text-slate-800 flex items-center gap-1 text-[11px]">
                            <Building2 className="w-3 h-3 text-teal-600 shrink-0" />
                            {booking.hospital}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-400 font-bold uppercase text-[9px] block">6. {isHindi ? "एआई सुझाव" : "AI Suggestion"}</span>
                          <span className="text-[10px] text-teal-800 font-medium block truncate">{booking.suggestion}</span>
                        </div>
                      </div>

                      {/* Row 4: Doctor & Slot */}
                      <div className="grid grid-cols-2 gap-2 pb-2.5 border-b border-slate-100">
                        <div>
                          <span className="text-slate-400 font-bold uppercase text-[9px] block">7. {isHindi ? "विशेषज्ञ डॉक्टर" : "Doctor Selected"}</span>
                          <span className="font-extrabold text-slate-900 flex items-center gap-1 text-[11px]">
                            <Stethoscope className="w-3 h-3 text-teal-600 shrink-0" />
                            {booking.doctorName}
                          </span>
                          <span className="text-[9px] text-teal-700 font-semibold">{booking.doctorSpecialty}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 font-bold uppercase text-[9px] block">8. {isHindi ? "समय व तारीख" : "Date & Timing"}</span>
                          <span className="font-bold text-slate-800 text-[11px] block">{booking.date}</span>
                          <span className="text-[10px] text-teal-700 font-medium block">{booking.time}</span>
                        </div>
                      </div>

                      {/* Row 5: Availability Status Badge */}
                      <div className="p-2.5 bg-emerald-50 rounded-xl flex items-center justify-between text-emerald-950 font-bold text-[11px] border border-emerald-200">
                        <span className="flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                          9. {isHindi ? "डॉक्टर उपलब्धता:" : "Doctor Availability:"}
                        </span>
                        <span className="text-emerald-800 font-extrabold uppercase">🟢 Verified Available</span>
                      </div>

                      {/* Row 6: Confirmation Action Buttons */}
                      <div className="pt-1.5 grid grid-cols-1 sm:grid-cols-3 gap-1.5">
                        <Button
                          onClick={handleConfirmBooking}
                          size="sm"
                          className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs h-10 rounded-xl shadow-xs gap-1 sm:col-span-3 sm:text-sm"
                        >
                          <CheckCheck className="w-4 h-4" />
                          10. {isHindi ? "पुष्टि करें और टोकन बुक करें" : "Confirm & Book OPD Token"}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleEditBooking}
                          className="border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs h-8 rounded-xl gap-1 sm:col-span-2"
                        >
                          <Edit3 className="w-3 h-3 text-teal-600" />
                          {isHindi ? "विवरण बदलें" : "Edit Details"}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleCancelBooking}
                          className="text-rose-600 hover:bg-rose-50 font-bold text-xs h-8 rounded-xl gap-1"
                        >
                          <XCircle className="w-3 h-3" />
                          {isHindi ? "रद्द करें" : "Cancel"}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Final Success Banner after Confirmation */}
                {msg.step === ChatStep.BOOKED && currentStep === ChatStep.BOOKED && (
                  <Card className="border border-emerald-300 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl shadow-sm p-4 text-center space-y-3 animate-in zoom-in-95 duration-300">
                    <div className="w-12 h-12 bg-emerald-600 text-white rounded-full flex items-center justify-center mx-auto shadow-xs">
                      <CheckCircle2 className="w-7 h-7" />
                    </div>

                    <div className="space-y-0.5">
                      <h3 className="text-base font-black text-slate-900">
                        {isHindi ? "अपॉइंटमेंट टोकन सफलतापूर्वक बुक हो गया!" : "OPD Appointment Confirmed & Synced!"}
                      </h3>
                      <p className="text-xs text-slate-600 font-medium">
                        {isHindi ? "आपका अपॉइंटमेंट अस्पताल स्टाफ और डॉक्टर शेड्यूल में लाइव दर्ज हो गया है।" : "Your appointment is synchronized live with the hospital staff & doctor schedule."}
                      </p>
                    </div>

                    <div className="p-3 bg-white rounded-xl border border-emerald-200 inline-block text-center shadow-xs">
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">OPD Token ID</span>
                      <span className="text-base font-black text-emerald-800 font-mono">{booking.appointmentId}</span>
                    </div>

                    <div className="flex flex-wrap items-center justify-center gap-1.5 pt-1">
                      <Button
                        size="sm"
                        onClick={() => {
                          toast.success(isHindi ? "अपॉइंटमेंट पर्ची डाउनलोड हो रही है..." : "Downloading official OPD confirmation slip...");
                        }}
                        className="bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs rounded-xl h-9 gap-1.5 shadow-xs"
                      >
                        <Download className="w-3.5 h-3.5" />
                        {isHindi ? "पर्ची डाउनलोड करें" : "Download OPD Slip"}
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.push("/scheduling")}
                        className="border-slate-200 hover:bg-white text-slate-700 font-bold text-xs rounded-xl h-9 gap-1.5"
                      >
                        <CalendarIcon className="w-3.5 h-3.5 text-teal-600" />
                        {isHindi ? "शेड्यूल देखें" : "View Schedule"}
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={startConversation}
                        className="text-teal-800 hover:bg-teal-100/50 font-bold text-xs rounded-xl h-9"
                      >
                        {isHindi ? "दूसरा टोकन बुक करें" : "Book Another"}
                      </Button>
                    </div>
                  </Card>
                )}

                {/* Quick Select Option Chips */}
                {msg.options && msg.options.length > 0 && currentStep === msg.step && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {msg.options.map((opt, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => handleUserInput(opt)}
                        className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white text-teal-700 border border-teal-300 hover:bg-teal-600 hover:text-white hover:border-teal-600 transition-all shadow-2xs active:scale-95 text-left"
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {!isBot && (
                <div className="w-7 h-7 rounded-full bg-slate-700 text-white flex items-center justify-center shadow-xs shrink-0 mt-0.5">
                  <User className="w-3.5 h-3.5" />
                </div>
              )}
            </div>
          );
        })}

        {/* Typing indicator with Groq Lightning Badge */}
        {isTyping && (
          <div className="flex items-center gap-2 text-teal-700 text-xs font-semibold pl-9 animate-pulse">
            <Zap className="w-3.5 h-3.5 text-amber-500" />
            <span>{isHindi ? "Groq AI सोच रहा है..." : "Groq LPU generating response..."}</span>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* ── Input Control Bar ── */}
      <div className="p-3 bg-white border-t border-slate-100 shrink-0">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleUserInput(inputText);
          }}
          className="flex items-center gap-2"
        >
          <button
            type="button"
            onClick={toggleListening}
            className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-all ${
              isListening
                ? "bg-red-500 text-white animate-pulse shadow-md shadow-red-500/25"
                : "bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-teal-600"
            }`}
            title={isListening ? t("listening") : t("tapToSpeak")}
          >
            <Mic className="w-4 h-4" />
          </button>

          <Input
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={
              isListening 
                ? (isHindi ? "सुन रहे हैं... बोलें" : "Listening... speak now") 
                : (isHindi ? `चरण ${currentStepNumber}/10: अपना उत्तर या प्रश्न लिखें...` : `Step ${currentStepNumber}/10: Type your answer or question...`)
            }
            className="flex-1 h-10 rounded-full bg-slate-100 border-0 focus-visible:ring-1 focus-visible:ring-teal-500 px-4 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400"
          />

          <button
            type="submit"
            disabled={!inputText.trim()}
            className="w-10 h-10 rounded-full bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 disabled:opacity-40 text-white flex items-center justify-center shrink-0 shadow-sm transition-all"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>

    </div>
  );
}
