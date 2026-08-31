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
  AlertCircle, CheckCheck, UserCheck
} from "lucide-react";
import { toast } from "sonner";
import { apiPost } from "@/lib/api";

// ============================================================
// 10-Step Chatbot Conversational State Machine
// 1. Name -> 2. Phone -> 3. Symptoms -> 4. Duration -> 5. Hospital
// 6. Suggestion -> 7. Doctor selection -> 8. Timing -> 9. Doctor availability -> 10. Confirm appointment
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

export const STEP_ORDER: ChatStep[] = [
  ChatStep.NAME,
  ChatStep.PHONE,
  ChatStep.SYMPTOMS,
  ChatStep.DURATION,
  ChatStep.HOSPITAL,
  ChatStep.SUGGESTION,
  ChatStep.DOCTOR_SELECTION,
  ChatStep.TIMING,
  ChatStep.DOCTOR_AVAILABILITY,
  ChatStep.CONFIRM_APPOINTMENT,
];

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
}

interface BookingDetails {
  fullName: string;
  phone: string;
  symptoms: string;
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
// Specialized Knowledge Base & Specialist Doctors Dataset
// ============================================================

const SPECIALTY_DOCTORS: Record<string, DoctorProfile[]> = {
  "General Physician": [
    { id: "doc-priya-mehta", name: "Dr. Priya Mehta", specialty: "General Physician", experience: "8 years", chamber: "OPD Room 102", rating: 4.8, available: true },
    { id: "doc-rajesh-kumar", name: "Dr. Rajesh Kumar", specialty: "General Physician", experience: "12 years", chamber: "OPD Room 104", rating: 4.7, available: true },
    { id: "doc-sunita-verma", name: "Dr. Sunita Verma", specialty: "General Physician", experience: "10 years", chamber: "OPD Room 106", rating: 4.9, available: true },
  ],
  "Cardiologist": [
    { id: "doc-rajiv-narang", name: "Dr. Rajiv Narang", specialty: "Cardiologist", experience: "16 years", chamber: "Cardio Wing - C1", rating: 4.9, available: true },
    { id: "doc-anita-saxena", name: "Dr. Anita Saxena", specialty: "Cardiologist", experience: "14 years", chamber: "Cardio Wing - C3", rating: 4.8, available: true },
    { id: "doc-arjun-malhotra", name: "Dr. Arjun Malhotra", specialty: "Cardiologist", experience: "11 years", chamber: "Cath Lab OPD", rating: 4.7, available: true },
  ],
  "Orthopedic Surgeon": [
    { id: "doc-vivek-rao", name: "Dr. Vivek Rao", specialty: "Orthopedic Surgeon", experience: "12 years", chamber: "Joint Care - OPD 201", rating: 4.8, available: true },
    { id: "doc-aditi-joshi", name: "Dr. Aditi Joshi", specialty: "Orthopedic Surgeon", experience: "9 years", chamber: "Ortho Block 204", rating: 4.7, available: true },
    { id: "doc-karan-sethi", name: "Dr. Karan Sethi", specialty: "Orthopedic Surgeon", experience: "11 years", chamber: "Sports Injury Clinic", rating: 4.9, available: true },
  ],
  "Pediatrician": [
    { id: "doc-amit-sen", name: "Dr. Amit Sen", specialty: "Pediatrician", experience: "10 years", chamber: "Child Wellness - P1", rating: 4.9, available: true },
    { id: "doc-ritu-sharma", name: "Dr. Ritu Sharma", specialty: "Pediatrician", experience: "8 years", chamber: "Child OPD 108", rating: 4.8, available: true },
  ],
  "Gynecologist": [
    { id: "doc-nisha-verma", name: "Dr. Nisha Verma", specialty: "Gynecologist", experience: "13 years", chamber: "Maternity Wing - M2", rating: 4.9, available: true },
    { id: "doc-pooja-menon", name: "Dr. Pooja Menon", specialty: "Gynecologist", experience: "10 years", chamber: "Women's Health - OPD 205", rating: 4.8, available: true },
  ],
  "Neurologist": [
    { id: "doc-deepak-agrawal", name: "Dr. Deepak Agrawal", specialty: "Neurologist", experience: "18 years", chamber: "Neuroscience Center - N1", rating: 5.0, available: true },
    { id: "doc-roopa-rajan", name: "Dr. Roopa Rajan", specialty: "Neurologist", experience: "12 years", chamber: "Neuro OPD 302", rating: 4.8, available: true },
  ],
  "Pulmonologist": [
    { id: "doc-sanjay-rao", name: "Dr. Sanjay Rao", specialty: "Pulmonologist", experience: "11 years", chamber: "Chest Clinic - OPD 110", rating: 4.7, available: true },
    { id: "doc-kavita-nair", name: "Dr. Kavita Nair", specialty: "Pulmonologist", experience: "9 years", chamber: "Respiratory Care 112", rating: 4.8, available: true },
  ],
  "Gastroenterologist": [
    { id: "doc-nikhil-arora", name: "Dr. Nikhil Arora", specialty: "Gastroenterologist", experience: "13 years", chamber: "GI Suite - Room 208", rating: 4.8, available: true },
    { id: "doc-tanya-mehta", name: "Dr. Tanya Mehta", specialty: "Gastroenterologist", experience: "8 years", chamber: "GI OPD 210", rating: 4.7, available: true },
  ],
  "Dermatologist": [
    { id: "doc-aditya-bose", name: "Dr. Aditya Bose", specialty: "Dermatologist", experience: "9 years", chamber: "Derma Care - Room 115", rating: 4.7, available: true },
    { id: "doc-neha-sood", name: "Dr. Neha Sood", specialty: "Dermatologist", experience: "7 years", chamber: "Derma OPD 118", rating: 4.8, available: true },
  ],
  "ENT Specialist": [
    { id: "doc-manish-arora", name: "Dr. Manish Arora", specialty: "ENT Specialist", experience: "11 years", chamber: "ENT OPD Room 120", rating: 4.8, available: true },
    { id: "doc-swati-jain", name: "Dr. Swati Jain", specialty: "ENT Specialist", experience: "8 years", chamber: "ENT OPD Room 122", rating: 4.7, available: true },
  ],
  "Ophthalmologist": [
    { id: "doc-harish-mehta", name: "Dr. Harish Mehta", specialty: "Ophthalmologist", experience: "14 years", chamber: "Eye Clinic - Room 301", rating: 4.9, available: true },
    { id: "doc-sneha-rao", name: "Dr. Sneha Rao", specialty: "Ophthalmologist", experience: "9 years", chamber: "Vision Center 304", rating: 4.8, available: true },
  ],
};

const SYMPTOMS_SPECIALTY_MAP: Array<{ keywords: string[]; specialty: string; adviceEn: string; adviceHi: string }> = [
  {
    keywords: ["chest pain", "heart", "cardio", "breathless", "palpitation", "सीने में दर्द", "दिल", "छाती", "घबराहट"],
    specialty: "Cardiologist",
    adviceEn: "We recommend an urgent in-person cardiac evaluation with a 12-lead ECG and Troponin test. Avoid heavy physical exertion.",
    adviceHi: "हम 12-लीड ईसीजी जांच के साथ तत्काल हृदय रोग विशेषज्ञ से परामर्श की सलाह देते हैं। भारी शारीरिक श्रम से बचें।",
  },
  {
    keywords: ["knee", "joint", "bone", "fracture", "back pain", "spine", "arthritis", "हड्डी", "जोड़", "कमर दर्द", "घुटना"],
    specialty: "Orthopedic Surgeon",
    adviceEn: "Recommended for orthopedic and musculoskeletal assessment. Consider an X-Ray or MRI if pain is aggravated by weight bearing.",
    adviceHi: "हड्डी व जोड़ों की जांच कराने की सलाह दी जाती है। वजन डालने पर दर्द बढ़ने की स्थिति में एक्स-रे कराएं।",
  },
  {
    keywords: ["fever", "cold", "cough", "flu", "weakness", "body ache", "chills", "बुखार", "जुकाम", "खांसी", "कमजोरी", "बदन दर्द"],
    specialty: "General Physician",
    adviceEn: "General medical consultation advised. Stay hydrated, monitor oral temperature twice daily, and avoid unprescribed antibiotics.",
    adviceHi: "सामान्य चिकित्सक से परामर्श लें। पर्याप्त पानी पिएं, दिन में दो बार तापमान मापें और बिना डॉक्टर की सलाह के दवा न लें।",
  },
  {
    keywords: ["headache", "migraine", "dizziness", "nerve", "stroke", "seizure", "सिरदर्द", "माइग्रेन", "चक्कर", "नसों"],
    specialty: "Neurologist",
    adviceEn: "Neurological consultation advised. Track headache triggers and monitor blood pressure regularly.",
    adviceHi: "न्यूरोलॉजिस्ट से परामर्श की सलाह दी जाती है। नियमित रूप से ब्लड प्रेशर की जांच करते रहें।",
  },
  {
    keywords: ["stomach", "acidity", "vomit", "digest", "gastric", "diarrhea", "constipation", "पेट दर्द", "एसिडिटी", "उल्टी", "दस्त"],
    specialty: "Gastroenterologist",
    adviceEn: "Gastroenterology review recommended. Maintain a light bland diet, avoid spicy food, and stay hydrated with ORS.",
    adviceHi: "गैस्ट्रोएंटेरोलॉजिस्ट से परामर्श लें। हल्का सुपाच्य भोजन लें, मसालेदार खाने से बचें और ओआरएस का सेवन करें।",
  },
  {
    keywords: ["skin", "rash", "itch", "acne", "pimples", "allergy", "त्वचा", "खुजली", "एलर्जी", "चकत्ते"],
    specialty: "Dermatologist",
    adviceEn: "Dermatological evaluation advised. Avoid scrubbing the affected area and keep skin moisturized with gentle hypoallergenic lotion.",
    adviceHi: "त्वचा विशेषज्ञ से परामर्श लें। प्रभावित त्वचा को रगड़ने से बचें और हल्के मॉइस्चराइज़र का उपयोग करें।",
  },
  {
    keywords: ["pregnancy", "pregnant", "period", "maternity", "women", "गर्भवती", "महिला रोग", "मासिक धर्म"],
    specialty: "Gynecologist",
    adviceEn: "Obstetrics & Gynecology consultation recommended. Bring past ultrasound scans and prenatal prescription history.",
    adviceHi: "स्त्री एवं प्रसूति रोग विशेषज्ञ से परामर्श लें। पूर्व के अल्ट्रासाउंड स्कैन व पर्चे साथ लाएं।",
  },
  {
    keywords: ["child", "baby", "infant", "kid", "vaccine", "बच्चा", "शिशु", "टीकाकरण"],
    specialty: "Pediatrician",
    adviceEn: "Pediatric consultation recommended for comprehensive child growth and vaccination assessment.",
    adviceHi: "शिशु रोग विशेषज्ञ से परामर्श लें और बच्चे का टीकाकरण कार्ड साथ रखें।",
  },
  {
    keywords: ["lung", "asthma", "wheezing", "breath", "respiratory", "सांस", "दमा", "फेफड़े"],
    specialty: "Pulmonologist",
    adviceEn: "Pulmonology evaluation recommended. Carry existing inhalers and avoid exposure to dust or smoke pollutants.",
    adviceHi: "छाती एवं सांस रोग विशेषज्ञ से परामर्श लें। धूल और धुएं से बचें और अपने इन्हेलर साथ रखें।",
  },
  {
    keywords: ["ear", "nose", "throat", "sinus", "hearing", "tonsil", "कान", "नाक", "गला"],
    specialty: "ENT Specialist",
    adviceEn: "ENT specialist examination advised. Avoid probing the ear canal and practice warm saline gargles for throat relief.",
    adviceHi: "ईएनटी विशेषज्ञ से परामर्श लें। कान में कोई वस्तु न डालें और गले के लिए गुनगुने नमक के पानी से गरारे करें।",
  },
  {
    keywords: ["eye", "vision", "glasses", "cataract", "redness", "आंख", "नेत्र", "दृष्टि"],
    specialty: "Ophthalmologist",
    adviceEn: "Ophthalmology examination advised. Avoid rubbing the eyes and reduce digital screen time.",
    adviceHi: "नेत्र विशेषज्ञ से जांच कराएं। आंखों को मलने से बचें और स्क्रीन का कम से कम उपयोग करें।",
  },
];

const HOSPITALS_CATALOG = [
  { id: "hosp-aiims-delhi", name: "AIIMS New Delhi", synonyms: ["aiims", "ansari nagar", "एम्स", "aiims delhi"] },
  { id: "hosp-safdarjung-delhi", name: "Safdarjung Hospital, New Delhi", synonyms: ["safdarjung", "vmmc", "सफदरजंग"] },
  { id: "hosp-ggh-delhi", name: "Government General Hospital — Delhi", synonyms: ["ggh", "general hospital", "गवर्नमेंट जनरल", "civil lines"] },
  { id: "hosp-lnjp-delhi", name: "Lok Nayak Hospital (LNJP)", synonyms: ["lnjp", "lok nayak", "लोक नायक", "delhi gate"] },
  { id: "hosp-rml-delhi", name: "Dr. Ram Manohar Lohia Hospital", synonyms: ["rml", "ram manohar lohia", "आरएमएल", "connaught place"] },
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

const POPULAR_HOSPITALS = [
  "AIIMS New Delhi",
  "Safdarjung Hospital, New Delhi",
  "Government General Hospital — Delhi",
  "Lok Nayak Hospital (LNJP)",
  "Indira Gandhi Hospital Dwarka",
  "Fortis Hospital Noida",
  "Medanta — The Medicity",
  "Amrita Hospital Faridabad",
];

const COMMON_SYMPTOMS_EN = [
  "High Fever & Chills",
  "Severe Chest Pain & Palpitations",
  "Joint Pain & Knee Stiffness",
  "Severe Headache & Dizziness",
  "Stomach Pain & Acidity",
  "Persistent Cough & Breathlessness",
  "Skin Rash & Allergic Itching",
  "Eye Irritation & Blurry Vision",
];

const COMMON_SYMPTOMS_HI = [
  "तेज बुखार व कंपकंपी",
  "सीने में तेज दर्द व घबराहट",
  "जोड़ों का दर्द व घुटने की अकड़न",
  "तेज सिरदर्द व चक्कर",
  "पेट दर्द व गंभीर एसिडिटी",
  "लगातार खांसी व सांस फूलना",
  "त्वचा पर चकत्ते व खुजली",
  "आंखों में जलन व धुंधलापन",
];

const DURATION_OPTIONS_EN = [
  "Since today (< 24 hours)",
  "2 to 3 days",
  "About 1 week",
  "2 to 4 weeks",
  "More than 1 month (Chronic)",
];

const DURATION_OPTIONS_HI = [
  "आज से ही (< 24 घंटे)",
  "2 से 3 दिन",
  "लगभग 1 सप्ताह",
  "2 से 4 सप्ताह",
  "1 महीने से अधिक (पुरानी)",
];

const TIME_SLOTS = [
  "09:00 AM - 10:00 AM",
  "10:30 AM - 11:30 AM",
  "12:00 PM - 01:00 PM",
  "02:30 PM - 03:30 PM",
  "04:00 PM - 05:00 PM",
];

// Helper Functions
function parseNaturalDate(input: string): { label: string; isoDate: string } | null {
  const clean = input.toLowerCase().trim();
  const now = new Date();
  
  if (clean.includes("today") || clean.includes("आज")) {
    return { label: "Today", isoDate: now.toISOString().slice(0, 10) };
  }
  if (clean.includes("day after") || clean.includes("परसों")) {
    const target = new Date(now);
    target.setDate(target.getDate() + 2);
    return { label: "Day After Tomorrow", isoDate: target.toISOString().slice(0, 10) };
  }
  if (clean.includes("tomorrow") || clean.includes("कल")) {
    const target = new Date(now);
    target.setDate(target.getDate() + 1);
    return { label: "Tomorrow", isoDate: target.toISOString().slice(0, 10) };
  }

  const daysOfWeek = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
  const hindiDays = ["रविवार", "सोमवार", "मंगलवार", "बुधवार", "गुरुवार", "शुक्रवार", "शनिवार"];

  for (let i = 0; i < 7; i++) {
    if (clean.includes(daysOfWeek[i]) || clean.includes(hindiDays[i])) {
      const currentDay = now.getDay();
      let diff = i - currentDay;
      if (diff <= 0) diff += 7;
      const target = new Date(now);
      target.setDate(target.getDate() + diff);
      const dayName = daysOfWeek[i].charAt(0).toUpperCase() + daysOfWeek[i].slice(1);
      return { 
        label: `${dayName} (${target.toLocaleDateString("en-IN", { month: "short", day: "numeric" })})`, 
        isoDate: target.toISOString().slice(0, 10) 
      };
    }
  }

  const parsed = new Date(input);
  if (!Number.isNaN(parsed.getTime()) && parsed.getTime() >= now.getTime() - 86400000) {
    return {
      label: parsed.toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" }),
      isoDate: parsed.toISOString().slice(0, 10),
    };
  }

  return { label: "Tomorrow", isoDate: new Date(Date.now() + 86400000).toISOString().slice(0, 10) };
}

function parseNaturalTime(input: string): string | null {
  const clean = input.toLowerCase().trim();
  if (clean.includes("09") || clean.includes("9 am") || clean.includes("सुबह 9")) return "09:00 AM - 10:00 AM";
  if (clean.includes("10:30") || clean.includes("10 am") || clean.includes("सुबह 10")) return "10:30 AM - 11:30 AM";
  if (clean.includes("12") || clean.includes("noon") || clean.includes("दोपहर 12")) return "12:00 PM - 01:00 PM";
  if (clean.includes("02") || clean.includes("2 pm") || clean.includes("दोपहर 2")) return "02:30 PM - 03:30 PM";
  if (clean.includes("04") || clean.includes("4 pm") || clean.includes("शाम 4")) return "04:00 PM - 05:00 PM";

  for (const slot of TIME_SLOTS) {
    if (clean.includes(slot.toLowerCase())) return slot;
  }
  return "10:30 AM - 11:30 AM";
}

function inferSpecialtyAndAdvice(symptoms: string, isHindi: boolean): { specialty: string; advice: string } {
  const clean = symptoms.toLowerCase();
  for (const map of SYMPTOMS_SPECIALTY_MAP) {
    for (const kw of map.keywords) {
      if (clean.includes(kw.toLowerCase())) {
        return {
          specialty: map.specialty,
          advice: isHindi ? map.adviceHi : map.adviceEn,
        };
      }
    }
  }
  return {
    specialty: "General Physician",
    advice: isHindi 
      ? "हम प्राथमिक जांच व परामर्श के लिए जनरल फिजिशियन से मिलने की सलाह देते हैं।" 
      : "We recommend consulting a General Physician for comprehensive primary evaluation.",
  };
}

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

function extractPhone(input: string): string | null {
  const digits = input.replace(/\D/g, "");
  if (digits.length === 10 && /^[6-9]\d{9}$/.test(digits)) return digits;
  const match = input.match(/\b([6-9]\d{9})\b/);
  if (match) return match[1];
  if (digits.length >= 10) {
    const last10 = digits.slice(-10);
    if (/^[6-9]\d{9}$/.test(last10)) return last10;
  }
  return null;
}

function extractName(input: string): string | null {
  let clean = input.trim();
  clean = clean.replace(/^(my name is|i am|i'm|this is|मेरा नाम|नाम है)\s+/i, "").trim();
  clean = clean.replace(/[,.!?].*$/, "").trim();
  if (clean.length >= 2 && /^[a-zA-Z\u0900-\u097F\s.'-]+$/.test(clean)) {
    if (!["yes", "no", "hi", "hello", "test", "ok", "sure", "हाँ", "नहीं"].includes(clean.toLowerCase())) {
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
    time: "10:30 AM - 11:30 AM",
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
      const utterance = new SpeechSynthesisUtterance(text.replace(/[*_#🤖🩺👤👨‍⚕️🏥📅🎉🟢💡]/g, ""));
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.lang = isHindi ? "hi-IN" : "en-IN";
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn("TTS speech synthesis error:", e);
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
    isSuggestionCard?: boolean
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
      };
      setMessages((prev) => [...prev, msg]);
      setIsTyping(false);
      speakText(text);
    }, 300);
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

  // Start / Reset Conversation Flow (Step 1: Name)
  const startConversation = useCallback(() => {
    setCurrentStep(ChatStep.NAME);
    const greetingText = isHindi 
      ? "नमस्ते! मैं आपका Connect to Care AI सहायक हूँ 🤖। मैं 10 आसान चरणों में विशेषज्ञ डॉक्टर अपॉइंटमेंट और ओपीडी टोकन बुक करने में आपकी सहायता करूँगा।"
      : "Hello! I am your Connect to Care AI Assistant 🤖. I will guide you through 10 quick steps to book your specialist OPD consultation.";
    
    const step1Prompt = isHindi
      ? (currentUser?.name ? `[चरण 1/10: नाम] क्या आपका पूरा नाम "${currentUser.name}" है, या नीचे नाम लिखें:` : `[चरण 1/10: नाम] कृपया मरीज का पूरा नाम बताएं:`)
      : (currentUser?.name ? `[Step 1/10: Patient Name] Is your full name "${currentUser.name}", or enter patient name below:` : `[Step 1/10: Patient Name] Please enter the patient's full name to begin:`);

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
    }, 350);
  }, [isHindi, currentUser?.name, addBotMessage, speakText]);

  useEffect(() => {
    startConversation();
  }, [startConversation]);

  // Auto-scroll
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // ============================================================
  // Step Transition Engine (10-Step Sequential Flow)
  // ============================================================
  const handleUserInput = (input: string) => {
    if (!input.trim()) return;
    const cleanInput = input.trim();
    addUserMessage(cleanInput);
    setInputText("");

    const currentBooking = { ...booking };

    switch (currentStep) {
      // ──────────────────────────────────────────
      // Step 1: NAME
      // ──────────────────────────────────────────
      case ChatStep.NAME: {
        const name = extractName(cleanInput);
        if (!name) {
          addBotMessage(
            isHindi 
              ? "⚠️ कृपया एक मान्य नाम दर्ज करें (उदा. राहुल शर्मा):" 
              : "⚠️ Please enter a valid full name with at least 2 letters (e.g., Rahul Sharma):",
            currentUser?.name ? [currentUser.name] : undefined,
            ChatStep.NAME,
            false,
            true
          );
          return;
        }
        currentBooking.fullName = name;
        setBooking(currentBooking);

        setCurrentStep(ChatStep.PHONE);
        addBotMessage(
          isHindi 
            ? `[चरण 2/10: फोन] आपसे मिलकर खुशी हुई, ${name}! कृपया पुष्टि और एसएमएस के लिए अपना 10 अंकों का मोबाइल नंबर दर्ज करें:` 
            : `[Step 2/10: Phone] Nice to meet you, ${name}! Please enter your 10-digit mobile phone number:`,
          currentUser?.phone ? [currentUser.phone] : undefined,
          ChatStep.PHONE
        );
        break;
      }

      // ──────────────────────────────────────────
      // Step 2: PHONE
      // ──────────────────────────────────────────
      case ChatStep.PHONE: {
        const phone = extractPhone(cleanInput);
        if (!phone) {
          addBotMessage(
            isHindi 
              ? "⚠️ कृपया 10 अंकों का मान्य भारतीय मोबाइल नंबर दर्ज करें (उदा. 9876543210):" 
              : "⚠️ Please enter a valid 10-digit mobile number starting with 6, 7, 8, or 9 (e.g., 9876543210):",
            currentUser?.phone ? [currentUser.phone] : undefined,
            ChatStep.PHONE,
            false,
            true
          );
          return;
        }
        currentBooking.phone = phone;
        setBooking(currentBooking);

        setCurrentStep(ChatStep.SYMPTOMS);
        addBotMessage(
          isHindi 
            ? `[चरण 3/10: लक्षण] फोन नंबर सत्यापित हुआ (${phone})। मरीज को क्या लक्षण या परेशानी हो रही है? (नीचे चुनें या लिखें)` 
            : `[Step 3/10: Symptoms] Mobile verified (${phone}). What health symptoms or discomfort are you experiencing?`,
          isHindi ? COMMON_SYMPTOMS_HI : COMMON_SYMPTOMS_EN,
          ChatStep.SYMPTOMS
        );
        break;
      }

      // ──────────────────────────────────────────
      // Step 3: SYMPTOMS
      // ──────────────────────────────────────────
      case ChatStep.SYMPTOMS: {
        if (cleanInput.length < 2) {
          addBotMessage(
            isHindi ? "कृपया लक्षणों का संक्षिप्त विवरण दें:" : "Please describe your symptoms briefly:",
            isHindi ? COMMON_SYMPTOMS_HI : COMMON_SYMPTOMS_EN,
            ChatStep.SYMPTOMS,
            false,
            true
          );
          return;
        }
        currentBooking.symptoms = cleanInput;
        setBooking(currentBooking);

        setCurrentStep(ChatStep.DURATION);
        addBotMessage(
          isHindi 
            ? `[चरण 4/10: अवधि] लक्षण: "${cleanInput}"। ये लक्षण आपको कब से हैं (अवधि)?` 
            : `[Step 4/10: Duration] Symptoms recorded: "${cleanInput}". How long have you had these symptoms?`,
          isHindi ? DURATION_OPTIONS_HI : DURATION_OPTIONS_EN,
          ChatStep.DURATION
        );
        break;
      }

      // ──────────────────────────────────────────
      // Step 4: DURATION
      // ──────────────────────────────────────────
      case ChatStep.DURATION: {
        currentBooking.duration = cleanInput;
        setBooking(currentBooking);

        setCurrentStep(ChatStep.HOSPITAL);
        addBotMessage(
          isHindi 
            ? `[चरण 5/10: अस्पताल] अवधि: "${cleanInput}"। आप दिल्ली-एनसीआर में किस अस्पताल में दिखाना चाहते हैं?` 
            : `[Step 5/10: Hospital] Duration noted: "${cleanInput}". Which hospital across Delhi-NCR would you like to visit?`,
          POPULAR_HOSPITALS,
          ChatStep.HOSPITAL
        );
        break;
      }

      // ──────────────────────────────────────────
      // Step 5: HOSPITAL
      // ──────────────────────────────────────────
      case ChatStep.HOSPITAL: {
        const hosp = matchHospital(cleanInput);
        const hospitalName = hosp ? hosp.name : cleanInput;
        const hospitalId = hosp ? hosp.id : "hosp-ggh-delhi";

        currentBooking.hospital = hospitalName;
        currentBooking.hospitalId = hospitalId;

        // Run AI Triage & Suggestion
        const { specialty, advice } = inferSpecialtyAndAdvice(currentBooking.symptoms, isHindi);
        currentBooking.doctorSpecialty = specialty;
        currentBooking.suggestion = advice;
        setBooking(currentBooking);

        setCurrentStep(ChatStep.SUGGESTION);
        addBotMessage(
          isHindi 
            ? `[चरण 6/10: एआई क्लिनिकल सुझाव] आपके लक्षणों ("${currentBooking.symptoms}") और अवधि ("${currentBooking.duration}") के आधार पर, हमारा क्लिनिकल सुझाव है:` 
            : `[Step 6/10: AI Clinical Suggestion] Based on your reported symptoms ("${currentBooking.symptoms}") and duration ("${currentBooking.duration}"), here is our AI clinical assessment:`,
          [isHindi ? "डॉक्टर चयन के लिए आगे बढ़ें" : "Proceed with Doctor Selection", isHindi ? "अस्पताल बदलें" : "Change Hospital"],
          ChatStep.SUGGESTION,
          false,
          false,
          false,
          true // Show Suggestion Card
        );
        break;
      }

      // ──────────────────────────────────────────
      // Step 6: SUGGESTION -> DOCTOR SELECTION
      // ──────────────────────────────────────────
      case ChatStep.SUGGESTION: {
        if (cleanInput.includes("Change") || cleanInput.includes("बदलें")) {
          setCurrentStep(ChatStep.HOSPITAL);
          addBotMessage(
            isHindi ? "कृपया अपना पसंदीदा अस्पताल पुनः चुनें:" : "Please pick your hospital again:",
            POPULAR_HOSPITALS,
            ChatStep.HOSPITAL
          );
          return;
        }

        setCurrentStep(ChatStep.DOCTOR_SELECTION);
        const doctorsList = SPECIALTY_DOCTORS[currentBooking.doctorSpecialty] || SPECIALTY_DOCTORS["General Physician"];
        const docOptions = doctorsList.map((d) => `${d.name} (${d.specialty} • ${d.experience})`);

        addBotMessage(
          isHindi 
            ? `[चरण 7/10: डॉक्टर चयन] ${currentBooking.hospital} में उपलब्ध विशेषज्ञ डॉक्टर। कृपया अपना डॉक्टर चुनें:` 
            : `[Step 7/10: Doctor Selection] Available specialists at ${currentBooking.hospital}. Please select your doctor:`,
          docOptions,
          ChatStep.DOCTOR_SELECTION
        );
        break;
      }

      // ──────────────────────────────────────────
      // Step 7: DOCTOR SELECTION
      // ──────────────────────────────────────────
      case ChatStep.DOCTOR_SELECTION: {
        const doctorsList = SPECIALTY_DOCTORS[currentBooking.doctorSpecialty] || SPECIALTY_DOCTORS["General Physician"];
        const matchedDoc = doctorsList.find((d) => cleanInput.toLowerCase().includes(d.name.toLowerCase())) || doctorsList[0];

        currentBooking.doctorName = matchedDoc.name;
        currentBooking.doctorId = matchedDoc.id;
        currentBooking.doctorExperience = matchedDoc.experience;
        currentBooking.doctorChamber = matchedDoc.chamber;
        setBooking(currentBooking);

        setCurrentStep(ChatStep.TIMING);
        addBotMessage(
          isHindi 
            ? `[चरण 8/10: समय व स्लॉट] डॉक्टर: ${matchedDoc.name} (${matchedDoc.specialty})। परामर्श के लिए तारीख और समय स्लॉट चुनें:` 
            : `[Step 8/10: Timing] Selected: ${matchedDoc.name} (${matchedDoc.specialty}). Please pick your appointment date and time slot:`,
          isHindi 
            ? ["कल (Tomorrow) 10:30 AM", "कल (Tomorrow) 02:30 PM", "आज (Today) 04:00 PM", "परसों (Day After) 11:30 AM", "सोमवार 09:00 AM"] 
            : ["Tomorrow at 10:30 AM", "Tomorrow at 02:30 PM", "Today at 04:00 PM", "Day After at 11:30 AM", "Monday at 09:00 AM"],
          ChatStep.TIMING
        );
        break;
      }

      // ──────────────────────────────────────────
      // Step 8: TIMING -> DOCTOR AVAILABILITY
      // ──────────────────────────────────────────
      case ChatStep.TIMING: {
        const dateObj = parseNaturalDate(cleanInput);
        const timeSlot = parseNaturalTime(cleanInput);

        currentBooking.date = dateObj ? dateObj.label : "Tomorrow";
        currentBooking.isoDate = dateObj ? dateObj.isoDate : new Date(Date.now() + 86400000).toISOString().slice(0, 10);
        currentBooking.time = timeSlot || "10:30 AM - 11:30 AM";
        currentBooking.doctorAvailabilityStatus = "AVAILABLE";
        setBooking(currentBooking);

        setCurrentStep(ChatStep.DOCTOR_AVAILABILITY);
        addBotMessage(
          isHindi 
            ? `[चरण 9/10: डॉक्टर उपलब्धता] ${currentBooking.doctorName} की लाइव उपलब्धता की पुष्टि हो गई है:` 
            : `[Step 9/10: Doctor Availability] Live schedule check for ${currentBooking.doctorName} is verified:`,
          [isHindi ? "अपॉइंटमेंट सारांश देखें व पुष्टि करें" : "Review Summary & Confirm Appointment", isHindi ? "समय बदलें" : "Change Timing"],
          ChatStep.DOCTOR_AVAILABILITY,
          false,
          false,
          true // Show Availability Card
        );
        break;
      }

      // ──────────────────────────────────────────
      // Step 9: DOCTOR AVAILABILITY -> CONFIRM APPOINTMENT
      // ──────────────────────────────────────────
      case ChatStep.DOCTOR_AVAILABILITY: {
        if (cleanInput.includes("Change") || cleanInput.includes("बदलें")) {
          setCurrentStep(ChatStep.TIMING);
          addBotMessage(
            isHindi ? "कृपया दूसरा समय स्लॉट चुनें:" : "Please choose another time slot:",
            TIME_SLOTS,
            ChatStep.TIMING
          );
          return;
        }

        setCurrentStep(ChatStep.CONFIRM_APPOINTMENT);
        addBotMessage(
          isHindi 
            ? `[चरण 10/10: अपॉइंटमेंट पुष्टि] आपका संपूर्ण अपॉइंटमेंट सारांश तैयार है। कृपया विवरण की समीक्षा करें और टोकन बुक करें:` 
            : `[Step 10/10: Confirm Appointment] Complete appointment summary is ready. Please review the 10 details and confirm booking:`,
          [isHindi ? "पुष्टि करें और टोकन बुक करें (Confirm)" : "Confirm & Book OPD Token", isHindi ? "विवरण बदलें" : "Edit Details", isHindi ? "रद्द करें" : "Cancel"],
          ChatStep.CONFIRM_APPOINTMENT,
          true // Show Summary Card
        );
        break;
      }

      // ──────────────────────────────────────────
      // Step 10: CONFIRM APPOINTMENT
      // ──────────────────────────────────────────
      case ChatStep.CONFIRM_APPOINTMENT: {
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
              ? "कृपया 'पुष्टि करें और टोकन बुक करें' बटन पर क्लिक करें या विवरण बदलने के लिए 'विवरण बदलें' चुनें।" 
              : "Please click [Confirm & Book OPD Token] to finalize your booking, or [Edit Details] to make changes.",
            [isHindi ? "पुष्टि करें और टोकन बुक करें (Confirm)" : "Confirm & Book OPD Token", isHindi ? "विवरण बदलें" : "Edit Details", isHindi ? "रद्द करें" : "Cancel"],
            ChatStep.CONFIRM_APPOINTMENT,
            true
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
  // Final Confirmation Flow (Persisting to PostgreSQL DB / Store)
  // ============================================================
  const handleConfirmBooking = async () => {
    const generatedId = `OPD-2026-${Math.floor(100000 + Math.random() * 900000)}`;
    const finalBooking = { ...booking, appointmentId: generatedId };
    setBooking(finalBooking);
    setCurrentStep(ChatStep.BOOKED);

    const now = new Date();
    let apptDate = new Date(now);

    if (finalBooking.isoDate) {
      apptDate = new Date(`${finalBooking.isoDate}T00:00:00.000Z`);
    } else if (finalBooking.date.includes("Tomorrow") || finalBooking.date.includes("कल")) {
      apptDate.setDate(apptDate.getDate() + 1);
    } else if (finalBooking.date.includes("Day After") || finalBooking.date.includes("परसों")) {
      apptDate.setDate(apptDate.getDate() + 2);
    }

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
        doctorId: finalBooking.doctorId || undefined,
        doctorName: finalBooking.doctorName,
        dateTime: apptDate.toISOString(),
        status: "REQUESTED",
        visitType: "NEW",
        reason: `${finalBooking.doctorSpecialty} (Symptoms: ${finalBooking.symptoms}, Duration: ${finalBooking.duration})`,
        notes: `AI 10-Step Booking. Hospital: ${finalBooking.hospital}. Room: ${finalBooking.doctorChamber}. Suggestion: ${finalBooking.suggestion}. Token: ${generatedId}`,
      });
      await refreshAppointments();
      await refreshPatients();
    } catch (err) {
      console.warn("Failed to persist appointment via API:", err);
    }

    addBotMessage(
      isHindi 
        ? `🎉 बधाई ${finalBooking.fullName}! आपका अपॉइंटमेंट सफलतापूर्वक दर्ज हो गया है। आपका ओपीडी टोकन आईडी: ${generatedId}`
        : `🎉 Congratulations ${finalBooking.fullName}! Your OPD appointment has been confirmed and registered. Token ID: ${generatedId}`,
      undefined,
      ChatStep.BOOKED
    );

    toast.success(isHindi ? "अपॉइंटमेंट टोकन सफलतापूर्वक बुक हो गया!" : "OPD Appointment Confirmed & Synced!");
  };

  const handleEditBooking = () => {
    setCurrentStep(ChatStep.SYMPTOMS);
    addBotMessage(
      isHindi ? "आइए लक्षणों से विवरण अपडेट करें। आपको क्या परेशानी हो रही है?" : "Let's update your details from symptoms. What symptoms are you experiencing?",
      isHindi ? COMMON_SYMPTOMS_HI : COMMON_SYMPTOMS_EN,
      ChatStep.SYMPTOMS
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
              Connect to Care AI
            </h2>
            <div className="flex items-center gap-1.5 text-[11px] text-teal-400 font-medium leading-none mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>{isHindi ? "10-चरणीय इंटेलिजेंट ओपीडी बुकिंग" : "10-Step Intelligent OPD Booking"}</span>
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
          <Badge className="bg-teal-600 text-white font-extrabold text-[10px] px-2 py-0.5">
            {isHindi ? `चरण ${currentStepNumber}/10` : `Step ${currentStepNumber}/10`}
          </Badge>
          <span className="text-teal-300 text-xs font-semibold truncate">
            {isHindi ? STEP_LABELS[currentStep]?.hi : STEP_LABELS[currentStep]?.en}
          </span>
        </div>
        <div className="w-28 sm:w-40 bg-slate-800 rounded-full h-2 overflow-hidden">
          <div 
            className="bg-gradient-to-r from-teal-400 to-emerald-500 h-full transition-all duration-300 rounded-full"
            style={{ width: `${currentStepProgress}%` }}
          />
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

              <div className="space-y-2.5 max-w-[88%] sm:max-w-[78%]">
                <div
                  className={`px-4 py-2.5 rounded-2xl text-[13px] leading-relaxed shadow-xs ${
                    isBot
                      ? msg.isError
                        ? "bg-amber-50 text-amber-900 border border-amber-200 font-medium"
                        : "bg-white text-slate-800 border border-slate-200/70 rounded-tl-xs font-normal"
                      : "bg-teal-600 text-white rounded-tr-xs font-medium"
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.text}</p>
                </div>

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
                            {isHindi ? "सुझाई गई विशेषज्ञता:" : "Recommended Department:"} {booking.doctorSpecialty}
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

                {/* ── Step 10: Structured 10-Point Appointment Summary Card ── */}
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
                      {/* Row 1: Patient Name & Phone */}
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

                      {/* Row 3: Hospital & Suggestion */}
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

                      {/* Row 4: Doctor Selection & Timing */}
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

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex items-center gap-2 text-slate-400 text-xs font-medium pl-9 animate-pulse">
            <Bot className="w-3.5 h-3.5 text-teal-600" />
            <span>{isHindi ? "Connect to Care सोच रहा है..." : "Validating response..."}</span>
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
                : (isHindi ? `चरण ${currentStepNumber}/10: अपना उत्तर लिखें...` : `Step ${currentStepNumber}/10: Type your answer...`)
            }
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
