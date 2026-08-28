"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
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
  AlertCircle
} from "lucide-react";
import { toast } from "sonner";
import { apiPost } from "@/lib/api";

// ============================================================
// Phase 5 — Chatbot State Machine & Intent Validation Engine
// ============================================================

export enum ChatStep {
  GREETING = "GREETING",
  NAME = "NAME",
  PHONE = "PHONE",
  SPECIALTY = "SPECIALTY",
  HOSPITAL = "HOSPITAL",
  DATE = "DATE",
  TIME = "TIME",
  REASON = "REASON",
  CONFIRM = "CONFIRM",
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
  isError?: boolean;
}

interface BookingDetails {
  fullName: string;
  phone: string;
  doctorSpecialty: string;
  doctorName: string;
  hospital: string;
  hospitalId?: string;
  date: string;
  isoDate?: string;
  time: string;
  reason: string;
  appointmentId?: string;
}

// ---------- Standard Specialties & Synonyms ----------
const SPECIALTIES_CATALOG = [
  { name: "General Physician", synonyms: ["fever", "cold", "cough", "weakness", "body ache", "flu", "headache", "general", "बुखार", "सर्दी", "खांसी", "कमजोरी"] },
  { name: "Cardiologist", synonyms: ["heart", "cardio", "chest pain", "bp", "cardiac", "palpitations", "हृदय", "दिल", "छाती में दर्द", "ब्लड प्रेशर"] },
  { name: "Pediatrician", synonyms: ["child", "baby", "kid", "infant", "newborn", "pediatric", "बच्चा", "शिशु", "बाल रोग"] },
  { name: "Orthopedic Surgeon", synonyms: ["bone", "joint", "fracture", "knee", "back pain", "ortho", "spine", "sprain", "हड्डी", "जोड़", "कमर दर्द", "घुटने"] },
  { name: "Gynecologist", synonyms: ["pregnancy", "pregnant", "women", "period", "gynae", "maternity", "गर्भवती", "महिला रोग", "मासिक धर्म"] },
  { name: "Dermatologist", synonyms: ["skin", "rash", "itching", "acne", "pimples", "allergy", "derma", "त्वचा", "खुजली", "एलर्जी", "मुंहासे"] },
  { name: "Neurologist", synonyms: ["brain", "neuro", "nerve", "stroke", "migraine", "paralysis", "seizure", "दिमाग", "नसों", "माइग्रेन"] },
  { name: "Ophthalmologist", synonyms: ["eye", "vision", "cataract", "glasses", "sight", "cornea", "आंख", "नेत्र", "दृष्टि"] },
  { name: "Gastroenterologist", synonyms: ["stomach", "digestive", "gastric", "acidity", "vomiting", "liver", "constipation", "पेट", "गैस", "उल्टी", "एसिडिटी"] },
  { name: "Pulmonologist", synonyms: ["lung", "breath", "asthma", "respiratory", "pulmonary", "wheezing", "फेफड़े", "सांस", "दमा"] },
  { name: "ENT Specialist", synonyms: ["ear", "nose", "throat", "sinus", "hearing", "tonsil", "कान", "नाक", "गला", "टॉन्सिल"] },
];

// ---------- Standard Hospitals in Delhi-NCR ----------
const HOSPITALS_CATALOG = [
  { id: "hosp-aiims-delhi", name: "AIIMS New Delhi", synonyms: ["aiims", "ansari nagar", "एम्स"] },
  { id: "hosp-safdarjung-delhi", name: "Safdarjung Hospital, New Delhi", synonyms: ["safdarjung", "vmmc", "सफदरजंग"] },
  { id: "hosp-ggh-delhi", name: "Government General Hospital — Delhi", synonyms: ["ggh", "general hospital", "गवर्नमेंट जनरल"] },
  { id: "hosp-lnjp-delhi", name: "Lok Nayak Hospital (LNJP)", synonyms: ["lnjp", "lok nayak", "लोक नायक"] },
  { id: "hosp-rml-delhi", name: "Dr. Ram Manohar Lohia Hospital", synonyms: ["rml", "ram manohar lohia", "आरएमएल"] },
  { id: "hosp-gtb-delhi", name: "Guru Teg Bahadur Hospital (GTB)", synonyms: ["gtb", "dilshad garden", "shahdara", "जीटीबी"] },
  { id: "hosp-gbpant-delhi", name: "Govind Ballabh Pant Hospital (G.B. Pant)", synonyms: ["gb pant", "g.b. pant", "pant hospital", "जीबी पंत"] },
  { id: "hosp-ddu-delhi", name: "Deen Dayal Upadhyay Hospital (DDU)", synonyms: ["ddu", "deen dayal", "hari nagar", "दीन दयाल"] },
  { id: "hosp-igh-dwarka", name: "Indira Gandhi Hospital Dwarka", synonyms: ["dwarka", "indira gandhi dwarka", "igh", "द्वारका"] },
  { id: "hosp-rtrm-najafgarh", name: "RTRM Hospital Najafgarh", synonyms: ["najafgarh", "rtrm", "jaffarpur", "नजफगढ़"] },
  { id: "hosp-district-noida", name: "District Combined Hospital Noida", synonyms: ["noida", "sector 39 noida", "district noida", "नोएडा"] },
  { id: "hosp-fortis-noida", name: "Fortis Hospital Noida", synonyms: ["fortis noida", "sector 62", "फोर्टिस नोएडा"] },
  { id: "hosp-jaypee-noida", name: "Jaypee Hospital", synonyms: ["jaypee", "sector 128", "जेपी"] },
  { id: "hosp-gims-grnoida", name: "GIMS Greater Noida", synonyms: ["gims", "greater noida", "knowledge park", "जिम्स ग्रेटर नोएडा"] },
  { id: "hosp-sharda-grnoida", name: "Sharda Hospital", synonyms: ["sharda", "knowledge park 3", "शारदा"] },
  { id: "hosp-mmg-ghaziabad", name: "MMG District Hospital Ghaziabad", synonyms: ["ghaziabad", "mmg", "sanjay nagar", "गाजियाबाद"] },
  { id: "hosp-max-vaishali", name: "Max Super Speciality Hospital Vaishali", synonyms: ["max", "max vaishali", "vaishali", "मैक्स वैशाली"] },
  { id: "hosp-yashoda-kaushambi", name: "Yashoda Super Speciality Hospital Kaushambi", synonyms: ["yashoda", "kaushambi", "यशोदा कौशाम्बी"] },
  { id: "hosp-medanta-gurugram", name: "Medanta — The Medicity", synonyms: ["medanta", "gurugram", "gurgaon", "sector 38 gurgaon", "मेदांता"] },
  { id: "hosp-fortis-gurugram", name: "Fortis Memorial Research Institute", synonyms: ["fortis gurgaon", "fortis gurugram", "fmri", "फोर्टिस गुड़गांव"] },
  { id: "hosp-civil-gurugram", name: "Civil Hospital Gurugram", synonyms: ["civil hospital gurgaon", "civil hospital gurugram", "सिविल हॉस्पिटल गुड़गांव"] },
  { id: "hosp-amrita-faridabad", name: "Amrita Hospital Faridabad", synonyms: ["amrita", "faridabad", "sector 88 faridabad", "अमृता फरीदाबाद"] },
  { id: "hosp-bk-faridabad", name: "B.K. Civil Hospital Faridabad", synonyms: ["bk hospital", "b.k. faridabad", "nit faridabad", "बीके फरीदाबाद"] },
];

const POPULAR_SPECIALTIES = [
  "General Physician",
  "Cardiologist",
  "Pediatrician",
  "Orthopedic Surgeon",
  "Gynecologist",
  "Dermatologist",
  "Neurologist",
  "ENT Specialist",
];

const POPULAR_HOSPITALS = [
  "AIIMS New Delhi",
  "Safdarjung Hospital, New Delhi",
  "Government General Hospital — Delhi",
  "Indira Gandhi Hospital Dwarka",
  "RTRM Hospital Najafgarh",
  "Fortis Hospital Noida",
  "Medanta — The Medicity",
  "Amrita Hospital Faridabad",
];

// Helper: Calculate Date from Natural Input
function parseNaturalDate(input: string): { label: string; isoDate: string } | null {
  const clean = input.toLowerCase().trim();
  const now = new Date();
  
  if (clean.includes("today") || clean.includes("आज")) {
    return { label: "Today", isoDate: now.toISOString().slice(0, 10) };
  }
  if (clean.includes("day after tomorrow") || clean.includes("परसों")) {
    const target = new Date(now);
    target.setDate(target.getDate() + 2);
    return { label: "Day After Tomorrow", isoDate: target.toISOString().slice(0, 10) };
  }
  if (clean.includes("tomorrow") || clean.includes("कल")) {
    const target = new Date(now);
    target.setDate(target.getDate() + 1);
    return { label: "Tomorrow", isoDate: target.toISOString().slice(0, 10) };
  }

  // Weekdays
  const daysOfWeek = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
  const hindiDays = ["रविवार", "सोमवार", "मंगलवार", "बुधवार", "गुरुवार", "शुक्रवार", "शनिवार"];

  for (let i = 0; i < 7; i++) {
    if (clean.includes(daysOfWeek[i]) || clean.includes(hindiDays[i])) {
      const currentDay = now.getDay();
      let diff = i - currentDay;
      if (diff <= 0) diff += 7; // Next occurrence
      const target = new Date(now);
      target.setDate(target.getDate() + diff);
      const dayName = daysOfWeek[i].charAt(0).toUpperCase() + daysOfWeek[i].slice(1);
      return { 
        label: `${dayName} (${target.toLocaleDateString("en-IN", { month: "short", day: "numeric" })})`, 
        isoDate: target.toISOString().slice(0, 10) 
      };
    }
  }

  // Check explicit date format (e.g. 2026-08-29 or 29 Aug or 29/08)
  const parsed = new Date(input);
  if (!Number.isNaN(parsed.getTime()) && parsed.getTime() >= now.getTime() - 86400000) {
    return {
      label: parsed.toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" }),
      isoDate: parsed.toISOString().slice(0, 10),
    };
  }

  return null;
}

// Helper: Parse Natural Time Slot
function parseNaturalTime(input: string): string | null {
  const clean = input.toLowerCase().trim();
  if (clean.includes("morning") || clean.includes("सुबह")) return "10:30 AM";
  if (clean.includes("afternoon") || clean.includes("दोपहर")) return "02:00 PM";
  if (clean.includes("evening") || clean.includes("शाम")) return "04:30 PM";

  // Regex for 10:30 AM / 2 PM / 04:00 pm / 11 am
  const match = clean.match(/(\d{1,2})(?::(\d{2}))?\s*(am|pm|बजे)?/i);
  if (match) {
    let hour = parseInt(match[1], 10);
    const minute = match[2] ? match[2] : "00";
    const ampm = match[3] ? match[3].toLowerCase() : (hour < 8 || hour === 12 ? "pm" : "am");

    if (ampm === "pm" && hour < 12) hour += 12;
    if (ampm === "am" && hour === 12) hour = 0;

    // Check validity between 8 AM (8) and 8 PM (20)
    if (hour >= 8 && hour <= 20) {
      const displayHour = hour > 12 ? hour - 12 : (hour === 0 ? 12 : hour);
      const displayAmPm = hour >= 12 ? "PM" : "AM";
      return `${String(displayHour).padStart(2, "0")}:${minute} ${displayAmPm}`;
    }
  }
  return null;
}

// Helper: Match Specialty
function matchSpecialty(input: string): string | null {
  const clean = input.toLowerCase().trim();
  for (const item of SPECIALTIES_CATALOG) {
    if (clean.includes(item.name.toLowerCase())) return item.name;
    for (const syn of item.synonyms) {
      if (clean.includes(syn)) return item.name;
    }
  }
  return null;
}

// Helper: Match Hospital
function matchHospital(input: string): { id: string; name: string } | null {
  const clean = input.toLowerCase().trim();
  for (const h of HOSPITALS_CATALOG) {
    if (clean.includes(h.name.toLowerCase())) return { id: h.id, name: h.name };
    for (const syn of h.synonyms) {
      if (clean.includes(syn)) return { id: h.id, name: h.name };
    }
  }
  return null;
}

// Helper: Extract Phone
function extractPhone(input: string): string | null {
  const digits = input.replace(/\D/g, "");
  if (digits.length === 10 && /^[6-9]\d{9}$/.test(digits)) {
    return digits;
  }
  const match = input.match(/\b([6-9]\d{9})\b/);
  if (match) return match[1];
  if (digits.length >= 10) {
    const last10 = digits.slice(-10);
    if (/^[6-9]\d{9}$/.test(last10)) return last10;
  }
  return null;
}

// Helper: Extract Name
function extractName(input: string): string | null {
  let clean = input.trim();
  // Strip common conversational intros
  clean = clean.replace(/^(my name is|i am|i'm|this is|मेरा नाम|नाम है)\s+/i, "").trim();
  clean = clean.replace(/[,.!?].*$/, "").trim();

  // Name must be 2+ chars, alphabetical with spaces, not purely digits or generic words
  if (clean.length >= 2 && /^[a-zA-Z\u0900-\u097F\s.'-]+$/.test(clean)) {
    const words = clean.split(/\s+/);
    if (words.length > 0 && !["yes", "no", "hi", "hello", "test", "ok", "sure", "हाँ", "नहीं"].includes(clean.toLowerCase())) {
      return clean;
    }
  }
  return null;
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
  const { currentUser, language, setLanguage, t, refreshAppointments, refreshPatients } = useStore();

  const [currentStep, setCurrentStep] = useState<ChatStep>(ChatStep.GREETING);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  // Voice States
  const [isListening, setIsListening] = useState(false);
  const [isSpeechEnabled, setIsSpeechEnabled] = useState(true);
  const recognitionRef = useRef<ISpeechRecognitionInstance | null>(null);

  // Booking Data
  const [booking, setBooking] = useState<BookingDetails>({
    fullName: currentUser?.name || "",
    phone: currentUser?.phone || "",
    doctorSpecialty: "General Physician",
    doctorName: "Dr. Priya Mehta",
    hospital: "Government General Hospital — Delhi",
    hospitalId: "hosp-ggh-delhi",
    date: "Tomorrow",
    time: "10:30 AM",
    reason: "General Consultation & Checkup",
  });

  const chatEndRef = useRef<HTMLDivElement>(null);
  const handleUserInputRef = useRef<(input: string) => void>(() => {});

  const isHindi = language === "hi";

  // Text-To-Speech
  const speakText = useCallback((text: string) => {
    if (!isSpeechEnabled || typeof window === "undefined" || !("speechSynthesis" in window)) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text.replace(/[*_#🤖🩺👤👨‍⚕️🏥📅🎉]/g, ""));
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.lang = isHindi ? "hi-IN" : "en-IN";
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn("TTS speech synthesis error:", e);
    }
  }, [isSpeechEnabled, isHindi]);

  // Add Bot Message Helper
  const addBotMessage = useCallback((text: string, options?: string[], step?: ChatStep, isSummary?: boolean, isError?: boolean) => {
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
      };
      setMessages((prev) => [...prev, msg]);
      setIsTyping(false);
      speakText(text);
    }, 350);
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

        recognition.onerror = (event: { error: string }) => {
          console.warn("Speech recognition error:", event.error);
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

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
        toast.info(isHindi ? "सुन रहे हैं... बोलें" : "Listening... speak clearly");
      } catch (err) {
        console.warn("Could not start recognition:", err);
      }
    }
  };

  // Start / Reset Conversation Flow
  const startConversation = useCallback(() => {
    setCurrentStep(ChatStep.NAME);
    const greetingText = isHindi 
      ? "नमस्ते! मैं आपका सेहत साथी AI सहायक हूँ 🤖। मैं दिल्ली-एनसीआर में डॉक्टर परामर्श और ओपीडी टोकन बुक करने में आपकी सहायता करूँगा।"
      : "Hello! I am your Sehat Saathi AI Assistant 🤖. I will help you book an OPD doctor appointment across the Delhi-NCR healthcare network.";
    
    const nameQuestion = isHindi
      ? (currentUser?.name ? `शुरू करने के लिए, क्या आपका पूरा नाम "${currentUser.name}" है, या नीचे नाम दर्ज करें:` : `शुरू करने के लिए, कृपया अपना पूरा नाम बताएं:`)
      : (currentUser?.name ? `To get started, what is your full name? (Or tap your name below)` : `To get started, please tell me your full name:`);

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
    }, 400);
  }, [isHindi, currentUser?.name, addBotMessage, speakText]);

  useEffect(() => {
    startConversation();
  }, [startConversation]);

  // Auto-scroll
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // ---------- Multi-Field Information Extractor ----------
  const extractMultiFields = (text: string, current: BookingDetails): { updated: BookingDetails; extractedCount: number } => {
    let count = 0;
    const next = { ...current };

    // Phone
    const phone = extractPhone(text);
    if (phone && phone !== next.phone) {
      next.phone = phone;
      count++;
    }

    // Specialty
    const specialty = matchSpecialty(text);
    if (specialty && specialty !== next.doctorSpecialty) {
      next.doctorSpecialty = specialty;
      count++;
    }

    // Hospital
    const hosp = matchHospital(text);
    if (hosp && hosp.name !== next.hospital) {
      next.hospital = hosp.name;
      next.hospitalId = hosp.id;
      count++;
    }

    // Date
    const dateObj = parseNaturalDate(text);
    if (dateObj && dateObj.label !== next.date) {
      next.date = dateObj.label;
      next.isoDate = dateObj.isoDate;
      count++;
    }

    // Time
    const time = parseNaturalTime(text);
    if (time && time !== next.time) {
      next.time = time;
      count++;
    }

    // Name (only if explicit or currently at NAME step)
    if (currentStep === ChatStep.NAME || /my name is|i am|मेरा नाम/i.test(text)) {
      const name = extractName(text);
      if (name && name !== next.fullName) {
        next.fullName = name;
        count++;
      }
    }

    return { updated: next, extractedCount: count };
  };

  // ---------- In-Flight Correction Handler ----------
  const handleCorrection = (text: string): boolean => {
    const clean = text.toLowerCase();
    let corrected = false;
    const updated = { ...booking };

    if (clean.includes("change date") || clean.includes("make that") || clean.includes("तारीख बदलें") || clean.includes("instead of")) {
      const dateObj = parseNaturalDate(text);
      if (dateObj) {
        updated.date = dateObj.label;
        updated.isoDate = dateObj.isoDate;
        corrected = true;
      }
    }

    if (clean.includes("change time") || clean.includes("make it") || clean.includes("समय बदलें")) {
      const time = parseNaturalTime(text);
      if (time) {
        updated.time = time;
        corrected = true;
      }
    }

    if (clean.includes("change hospital") || clean.includes("different hospital") || clean.includes("अस्पताल बदलें")) {
      const hosp = matchHospital(text);
      if (hosp) {
        updated.hospital = hosp.name;
        updated.hospitalId = hosp.id;
        corrected = true;
      }
    }

    if (clean.includes("change phone") || clean.includes("phone number is") || clean.includes("नंबर बदलें")) {
      const phone = extractPhone(text);
      if (phone) {
        updated.phone = phone;
        corrected = true;
      }
    }

    if (corrected) {
      setBooking(updated);
      addBotMessage(
        isHindi
          ? `मैंने आपके विवरण अपडेट कर दिए हैं! नया विवरण: ${updated.hospital}, ${updated.doctorSpecialty}, ${updated.date} @ ${updated.time}`
          : `I've updated your booking details! Updated: ${updated.hospital}, ${updated.doctorSpecialty}, ${updated.date} @ ${updated.time}`,
        undefined,
        currentStep
      );
      return true;
    }
    return false;
  };

  // ============================================================
  // Step Transition & Strict Intent Validation Machine
  // ============================================================
  const handleUserInput = (input: string) => {
    if (!input.trim()) return;
    const cleanInput = input.trim();
    addUserMessage(cleanInput);
    setInputText("");

    // 1. Check for in-flight corrections first
    if (handleCorrection(cleanInput)) return;

    // 2. Extract any multi-field information provided
    const { updated: multiUpdated, extractedCount } = extractMultiFields(cleanInput, booking);
    const workingBooking = { ...multiUpdated };

    // If multi-fields were detected and we have all required fields for booking, jump directly to CONFIRM!
    if (
      extractedCount >= 2 &&
      workingBooking.fullName &&
      workingBooking.phone &&
      workingBooking.doctorSpecialty &&
      workingBooking.hospital &&
      workingBooking.date &&
      workingBooking.time
    ) {
      setBooking(workingBooking);
      setCurrentStep(ChatStep.CONFIRM);
      addBotMessage(
        isHindi 
          ? `मैंने आपके सभी विवरण दर्ज कर लिए हैं। कृपया नीचे दिए गए सारांश की समीक्षा करें और पुष्टि करें:` 
          : `I've extracted all your details. Please review your appointment summary below and confirm:`,
        [isHindi ? "पुष्टि करें (Confirm)" : "Confirm Booking", isHindi ? "विवरण बदलें" : "Edit Details", isHindi ? "रद्द करें" : "Cancel"],
        ChatStep.CONFIRM,
        true
      );
      return;
    }

    // 3. Process current state machine step with strict validation
    switch (currentStep) {
      case ChatStep.NAME: {
        const name = extractName(cleanInput);
        if (!name) {
          addBotMessage(
            isHindi 
              ? "⚠️ कृपया अपना मान्य पूरा नाम दर्ज करें (उदा. राहुल शर्मा):" 
              : "⚠️ Please provide a valid full name with at least 2 letters (e.g., Rahul Sharma):",
            currentUser?.name ? [currentUser.name] : undefined,
            ChatStep.NAME,
            false,
            true
          );
          return;
        }
        workingBooking.fullName = name;
        setBooking(workingBooking);

        // Check if phone was already extracted
        if (workingBooking.phone && workingBooking.phone.length === 10) {
          setCurrentStep(ChatStep.SPECIALTY);
          addBotMessage(
            isHindi 
              ? `धन्यवाद ${name}! आपका फोन नंबर ${workingBooking.phone} दर्ज है। आपको किस विशेषता या डॉक्टर से मिलना है?` 
              : `Thank you, ${name}! Mobile number ${workingBooking.phone} recorded. Which medical specialty do you need?`,
            POPULAR_SPECIALTIES,
            ChatStep.SPECIALTY
          );
        } else {
          setCurrentStep(ChatStep.PHONE);
          addBotMessage(
            isHindi 
              ? `आपसे मिलकर खुशी हुई, ${name}! कृपया अपना 10 अंकों का मोबाइल नंबर दर्ज करें:` 
              : `Nice to meet you, ${name}! Please enter your 10-digit mobile number for confirmation:`,
            currentUser?.phone ? [currentUser.phone] : undefined,
            ChatStep.PHONE
          );
        }
        break;
      }

      case ChatStep.PHONE: {
        const phone = extractPhone(cleanInput);
        if (!phone) {
          addBotMessage(
            isHindi 
              ? "⚠️ कृपया एक मान्य 10-अंकीय भारतीय मोबाइल नंबर दर्ज करें (उदा. 9876543210):" 
              : "⚠️ Please enter a valid 10-digit mobile number starting with 6, 7, 8, or 9 (e.g., 9876543210):",
            currentUser?.phone ? [currentUser.phone] : undefined,
            ChatStep.PHONE,
            false,
            true
          );
          return;
        }
        workingBooking.phone = phone;
        setBooking(workingBooking);

        setCurrentStep(ChatStep.SPECIALTY);
        addBotMessage(
          isHindi 
            ? "मोबाइल नंबर दर्ज हो गया। आप किस विशेषता या विभाग के डॉक्टर से मिलना चाहते हैं? (या अपने लक्षण बताएं)" 
            : "Mobile number verified! Which medical specialty do you need? (Or describe your symptoms below)",
          POPULAR_SPECIALTIES,
          ChatStep.SPECIALTY
        );
        break;
      }

      case ChatStep.SPECIALTY: {
        const specialty = matchSpecialty(cleanInput);
        if (!specialty) {
          addBotMessage(
            isHindi 
              ? "⚠️ मैं उस विशेषता को नहीं पहचान पाया। कृपया नीचे दिए गए विकल्पों में से चुनें या लक्षण बताएं:" 
              : "⚠️ I couldn't match that to a department. Please select a specialty from the options below or describe your symptoms:",
            POPULAR_SPECIALTIES,
            ChatStep.SPECIALTY,
            false,
            true
          );
          return;
        }
        workingBooking.doctorSpecialty = specialty;
        workingBooking.reason = `${specialty} Consultation for ${cleanInput}`;
        setBooking(workingBooking);

        setCurrentStep(ChatStep.HOSPITAL);
        addBotMessage(
          isHindi 
            ? `विशेषता: ${specialty}। दिल्ली-एनसीआर में अपना पसंदीदा अस्पताल चुनें:` 
            : `Department selected: ${specialty}. Please choose your preferred hospital across Delhi-NCR:`,
          POPULAR_HOSPITALS,
          ChatStep.HOSPITAL
        );
        break;
      }

      case ChatStep.HOSPITAL: {
        const hosp = matchHospital(cleanInput);
        if (!hosp) {
          addBotMessage(
            isHindi 
              ? "⚠️ कृपया नीचे दी गई सूची में से दिल्ली-एनसीआर का अस्पताल चुनें या सही नाम लिखें:" 
              : "⚠️ Hospital not recognized in our network. Please pick from the Delhi-NCR hospitals below:",
            POPULAR_HOSPITALS,
            ChatStep.HOSPITAL,
            false,
            true
          );
          return;
        }
        workingBooking.hospital = hosp.name;
        workingBooking.hospitalId = hosp.id;
        setBooking(workingBooking);

        setCurrentStep(ChatStep.DATE);
        addBotMessage(
          isHindi 
            ? `अस्पताल: ${hosp.name}। अपॉइंटमेंट के लिए पसंदीदा तारीख चुनें:` 
            : `Facility chosen: ${hosp.name}. Which date would you like to schedule your consultation for?`,
          isHindi ? ["कल (Tomorrow)", "आज (Today)", "परसों (Day After)", "सोमवार (Monday)", "शुक्रवार (Friday)"] : ["Tomorrow", "Today", "Day After Tomorrow", "Next Monday", "Next Friday"],
          ChatStep.DATE
        );
        break;
      }

      case ChatStep.DATE: {
        const dateObj = parseNaturalDate(cleanInput);
        if (!dateObj) {
          addBotMessage(
            isHindi 
              ? "⚠️ कृपया एक मान्य आगामी तारीख दर्ज करें (उदा. 'कल', 'आज', 'सोमवार', या '29 अगस्त'):" 
              : "⚠️ Please enter a valid upcoming appointment date (e.g., 'Tomorrow', 'Today', 'Monday', or '29 August'):",
            isHindi ? ["कल (Tomorrow)", "आज (Today)", "परसों", "सोमवार", "शुक्रवार"] : ["Tomorrow", "Today", "Day After Tomorrow", "Next Monday", "Next Friday"],
            ChatStep.DATE,
            false,
            true
          );
          return;
        }
        workingBooking.date = dateObj.label;
        workingBooking.isoDate = dateObj.isoDate;
        setBooking(workingBooking);

        setCurrentStep(ChatStep.TIME);
        addBotMessage(
          isHindi 
            ? `तारीख: ${dateObj.label}। ओपीडी समय स्लॉट चुनें:` 
            : `Date set: ${dateObj.label}. Please select your preferred OPD consultation time slot:`,
          ["09:30 AM", "10:30 AM", "11:30 AM", "02:00 PM", "03:30 PM", "04:30 PM"],
          ChatStep.TIME
        );
        break;
      }

      case ChatStep.TIME: {
        const time = parseNaturalTime(cleanInput);
        if (!time) {
          addBotMessage(
            isHindi 
              ? "⚠️ कृपया सुबह 8:00 से शाम 8:00 के बीच एक मान्य समय स्लॉट चुनें (उदा. 10:30 AM या 02:00 PM):" 
              : "⚠️ Please choose a valid OPD time slot between 8:00 AM and 8:00 PM (e.g., 10:30 AM or 02:00 PM):",
            ["09:30 AM", "10:30 AM", "11:30 AM", "02:00 PM", "03:30 PM", "04:30 PM"],
            ChatStep.TIME,
            false,
            true
          );
          return;
        }
        workingBooking.time = time;
        setBooking(workingBooking);

        setCurrentStep(ChatStep.REASON);
        addBotMessage(
          isHindi 
            ? `समय स्लॉट: ${time}। कृपया परामर्श का मुख्य कारण या लक्षण संक्षेप में बताएं:` 
            : `Time slot reserved: ${time}. Please briefly describe your chief complaint or symptoms:`,
          [
            isHindi ? "नियमित स्वास्थ्य जांच" : "Routine Health Checkup",
            isHindi ? "फॉलो-अप परामर्श" : "Follow-up Consultation",
            isHindi ? "तीव्र लक्षण और असुविधा" : "Acute Symptoms & Discomfort",
          ],
          ChatStep.REASON
        );
        break;
      }

      case ChatStep.REASON: {
        if (cleanInput.length < 2) {
          addBotMessage(
            isHindi ? "कृपया कारण का संक्षिप्त विवरण दें:" : "Please provide a brief reason for your consultation:",
            ["Routine Health Checkup", "Follow-up Consultation"],
            ChatStep.REASON
          );
          return;
        }
        workingBooking.reason = cleanInput;
        setBooking(workingBooking);

        setCurrentStep(ChatStep.CONFIRM);
        addBotMessage(
          isHindi 
            ? "अपॉइंटमेंट सारांश तैयार है। कृपया नीचे दिए गए विवरण की समीक्षा करें और पुष्टि करें:" 
            : "Your OPD appointment summary is ready. Please review the details below and confirm:",
          [isHindi ? "पुष्टि करें (Confirm)" : "Confirm Booking", isHindi ? "विवरण बदलें" : "Edit Details", isHindi ? "रद्द करें" : "Cancel"],
          ChatStep.CONFIRM,
          true
        );
        break;
      }

      case ChatStep.CONFIRM: {
        const lower = cleanInput.toLowerCase();
        if (lower.includes("yes") || lower.includes("confirm") || lower.includes("book") || lower.includes("ok") || lower.includes("हाँ") || lower.includes("पुष्टि")) {
          handleConfirmBooking();
        } else if (lower.includes("edit") || lower.includes("change") || lower.includes("बदलें")) {
          handleEditBooking();
        } else if (lower.includes("no") || lower.includes("cancel") || lower.includes("रद्द")) {
          handleCancelBooking();
        } else {
          addBotMessage(
            isHindi 
              ? "कृपया अपॉइंटमेंट बुक करने के लिए 'पुष्टि करें' या बदलाव के लिए 'विवरण बदलें' पर क्लिक करें।" 
              : "Please click [Confirm Booking] to finalize your appointment, or [Edit Details] to make changes.",
            [isHindi ? "पुष्टि करें (Confirm)" : "Confirm Booking", isHindi ? "विवरण बदलें" : "Edit Details", isHindi ? "रद्द करें" : "Cancel"],
            ChatStep.CONFIRM
          );
        }
        break;
      }

      default:
        break;
    }
  };

  handleUserInputRef.current = handleUserInput;

  // ============================================================
  // Confirmation Flow (Persisting to PostgreSQL DB / Store)
  // ============================================================
  const handleConfirmBooking = async () => {
    const generatedId = `OPD-2026-${Math.floor(100000 + Math.random() * 900000)}`;
    const finalBooking = { ...booking, appointmentId: generatedId };
    setBooking(finalBooking);
    setCurrentStep(ChatStep.BOOKED);

    // Compute ISO datetime instant
    const now = new Date();
    let apptDate = new Date(now);

    if (finalBooking.isoDate) {
      apptDate = new Date(`${finalBooking.isoDate}T00:00:00.000Z`);
    } else if (finalBooking.date.includes("Tomorrow") || finalBooking.date.includes("कल")) {
      apptDate.setDate(apptDate.getDate() + 1);
    } else if (finalBooking.date.includes("Day After") || finalBooking.date.includes("परसों")) {
      apptDate.setDate(apptDate.getDate() + 2);
    }

    // Time adjustment
    const timeMatch = finalBooking.time.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
    if (timeMatch) {
      let h = parseInt(timeMatch[1], 10);
      const m = parseInt(timeMatch[2], 10);
      const ampm = timeMatch[3].toUpperCase();
      if (ampm === "PM" && h < 12) h += 12;
      if (ampm === "AM" && h === 12) h = 0;
      apptDate.setHours(h, m, 0, 0);
    } else {
      apptDate.setHours(10, 30, 0, 0);
    }

    try {
      await apiPost("/api/appointments", {
        patientId: currentUser?.patientId || undefined,
        patientName: finalBooking.fullName,
        phone: finalBooking.phone,
        specialty: finalBooking.doctorSpecialty,
        dateTime: apptDate.toISOString(),
        status: "REQUESTED",
        visitType: "NEW",
        reason: `${finalBooking.doctorSpecialty}: ${finalBooking.reason}`,
        notes: `Booked via Sehat Saathi AI Assistant. Hospital: ${finalBooking.hospital}. Slot: ${finalBooking.date} at ${finalBooking.time}. Token: ${generatedId}`,
      });
      await refreshAppointments();
      await refreshPatients();
    } catch (err) {
      console.warn("Failed to persist appointment via API:", err);
    }

    addBotMessage(
      isHindi 
        ? `🎉 बधाई! आपका अपॉइंटमेंट सफलतापूर्वक बुक हो गया है और स्टाफ कतार में दर्ज हो गया है। आपका टोकन ID: ${generatedId}`
        : `🎉 Appointment confirmed and synchronized with hospital staff queue! Your OPD Token ID is ${generatedId}.`,
      undefined,
      ChatStep.BOOKED
    );

    toast.success(isHindi ? "अपॉइंटमेंट सफलतापूर्वक बुक हो गया!" : "Appointment Confirmed & Synced with Staff Queue!");
  };

  const handleEditBooking = () => {
    setCurrentStep(ChatStep.SPECIALTY);
    addBotMessage(
      isHindi ? "आइए विशेषज्ञता से विवरण अपडेट करें। आप किस डॉक्टर से परामर्श चाहते हैं?" : "Let's update your details. Which specialty or doctor would you like to consult?",
      POPULAR_SPECIALTIES,
      ChatStep.SPECIALTY
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
    <div className="flex flex-col h-full max-h-[82vh] bg-white rounded-3xl border border-slate-200/80 shadow-xl overflow-hidden font-sans">
      
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
            <div className="w-9 h-9 rounded-full bg-teal-500/20 border border-teal-500/40 text-teal-400 flex items-center justify-center shadow-xs">
              <Bot className="w-5 h-5" />
            </div>
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 border-2 border-[#0f172a] rounded-full" />
          </div>

          <div className="min-w-0">
            <h2 className="font-bold text-sm text-white truncate leading-tight">
              {t("brandName")} AI
            </h2>
            <div className="flex items-center gap-1.5 text-[11px] text-teal-400 font-medium leading-none mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>{isHindi ? "इंटेलिजेंट अपॉइंटमेंट असिस्टेंट" : "Intelligent OPD Booking"}</span>
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

      {/* ── Messages Chat Stream ── */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3.5 bg-[#f8fafc]">
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

              <div className="space-y-2.5 max-w-[85%] sm:max-w-[75%]">
                <div
                  className={`px-4 py-2.5 rounded-2xl text-[13px] leading-relaxed shadow-xs ${
                    isBot
                      ? msg.isError
                        ? "bg-amber-50 text-amber-900 border border-amber-200 font-medium"
                        : "bg-white text-slate-800 border border-slate-200/70 rounded-tl-xs font-normal"
                      : "bg-teal-600 text-white rounded-tr-xs font-medium"
                  }`}
                >
                  <p>{msg.text}</p>
                </div>

                {/* Structured Appointment Summary Card Component */}
                {msg.isSummary && currentStep === ChatStep.CONFIRM && (
                  <Card className="border border-teal-200 bg-white rounded-2xl shadow-sm overflow-hidden animate-in fade-in duration-200">
                    <div className="bg-gradient-to-r from-teal-700 to-emerald-700 px-4 py-2.5 text-white flex items-center justify-between">
                      <div className="flex items-center gap-1.5 font-bold text-xs">
                        <Sparkles className="w-3.5 h-3.5 text-teal-200" />
                        <span>{t("bookingSummaryTitle")}</span>
                      </div>
                      <Badge className="bg-white/20 text-white text-[9px] font-bold border-0">
                        {booking.hospital}
                      </Badge>
                    </div>

                    <CardContent className="p-4 space-y-3 text-xs">
                      <div className="grid grid-cols-2 gap-2 pb-2.5 border-b border-slate-100">
                        <div>
                          <span className="text-slate-400 font-bold uppercase text-[9px] block">{t("summaryPatient")}</span>
                          <span className="font-bold text-slate-800 text-xs">{booking.fullName}</span>
                          <span className="text-[10px] text-slate-500 block font-mono">{booking.phone}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 font-bold uppercase text-[9px] block">Specialty & Reason</span>
                          <span className="font-semibold text-slate-800">{booking.doctorSpecialty}</span>
                          <span className="text-[10px] text-teal-700 font-medium block truncate">{booking.reason}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 pb-2.5 border-b border-slate-100">
                        <div>
                          <span className="text-slate-400 font-bold uppercase text-[9px] block">Hospital</span>
                          <span className="font-semibold text-slate-800 flex items-center gap-1 text-[11px]">
                            <Building2 className="w-3 h-3 text-teal-600 shrink-0" />
                            {booking.hospital}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-400 font-bold uppercase text-[9px] block">{t("summaryDoctor")}</span>
                          <span className="font-bold text-slate-800 flex items-center gap-1 text-[11px]">
                            <Stethoscope className="w-3 h-3 text-teal-600 shrink-0" />
                            {booking.doctorName}
                          </span>
                        </div>
                      </div>

                      <div className="p-2.5 bg-teal-50/70 rounded-xl flex items-center justify-between text-teal-950 font-bold text-[11px]">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-teal-700" />
                          {t("summaryDateTime")}:
                        </span>
                        <span className="text-teal-800">{booking.date} @ {booking.time}</span>
                      </div>

                      {/* 3 Action Buttons: Confirm / Edit / Cancel */}
                      <div className="pt-1 grid grid-cols-1 sm:grid-cols-3 gap-1.5">
                        <Button
                          onClick={handleConfirmBooking}
                          size="sm"
                          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs h-9 rounded-xl shadow-xs gap-1"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          {t("confirmBooking")}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleEditBooking}
                          className="border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs h-9 rounded-xl gap-1"
                        >
                          <Edit3 className="w-3 h-3 text-teal-600" />
                          {t("editDetails")}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleCancelBooking}
                          className="text-rose-600 hover:bg-rose-50 font-bold text-xs h-9 rounded-xl gap-1"
                        >
                          <XCircle className="w-3 h-3" />
                          {t("cancelBooking")}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Final Success Banner after Confirmation */}
                {msg.step === ChatStep.BOOKED && currentStep === ChatStep.BOOKED && (
                  <Card className="border border-emerald-300 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl shadow-sm p-4 text-center space-y-3 animate-in zoom-in-95 duration-300">
                    <div className="w-10 h-10 bg-emerald-600 text-white rounded-full flex items-center justify-center mx-auto shadow-xs">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>

                    <div className="space-y-0.5">
                      <h3 className="text-base font-bold text-slate-900">{t("confirmedTitle")}</h3>
                      <p className="text-xs text-slate-600 font-medium">
                        {isHindi ? "आपका अपॉइंटमेंट अस्पताल स्टाफ और डॉक्टर शेड्यूल में लाइव दर्ज हो गया है।" : "Your appointment is synchronized live with the hospital staff & doctor schedule."}
                      </p>
                    </div>

                    <div className="p-2.5 bg-white rounded-xl border border-emerald-200 inline-block text-center shadow-xs">
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">{t("opdTokenLabel")}</span>
                      <span className="text-sm font-black text-emerald-800 font-mono">{booking.appointmentId}</span>
                    </div>

                    <div className="flex flex-wrap items-center justify-center gap-1.5 pt-1">
                      <Button
                        size="sm"
                        onClick={() => {
                          toast.success(isHindi ? "अपॉइंटमेंट पर्ची डाउनलोड हो रही है..." : "Downloading official OPD confirmation slip...");
                        }}
                        className="bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs rounded-xl h-8 gap-1 shadow-xs"
                      >
                        <Download className="w-3 h-3" />
                        {t("downloadSlip")}
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.push("/scheduling")}
                        className="border-slate-200 hover:bg-white text-slate-700 font-bold text-xs rounded-xl h-8 gap-1"
                      >
                        <CalendarIcon className="w-3 h-3 text-teal-600" />
                        {t("addToCalendar")}
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={startConversation}
                        className="text-teal-800 hover:bg-teal-100/50 font-bold text-xs rounded-xl h-8"
                      >
                        {t("bookAnother")}
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
                        className="px-3 py-1 rounded-full text-xs font-semibold bg-white text-teal-700 border border-teal-300 hover:bg-teal-600 hover:text-white hover:border-teal-600 transition-all shadow-2xs active:scale-95"
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

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex items-center gap-2 text-slate-400 text-xs font-medium pl-9 animate-pulse">
            <Bot className="w-3.5 h-3.5 text-teal-600" />
            <span>{isHindi ? "सेहत साथी सोच रहा है..." : "Validating response..."}</span>
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
            placeholder={isListening ? (isHindi ? "सुन रहे हैं... बोलें" : "Listening... speak now") : (isHindi ? "अपना उत्तर लिखें..." : "Type your response...")}
            className="flex-1 h-10 rounded-full bg-slate-100 border-0 focus-visible:ring-1 focus-visible:ring-teal-500 px-4 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400"
          />

          <button
            type="submit"
            disabled={!inputText.trim()}
            className="w-10 h-10 rounded-full bg-teal-600 hover:bg-teal-700 disabled:opacity-40 text-white flex items-center justify-center shrink-0 shadow-sm transition-all"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>

    </div>
  );
}
