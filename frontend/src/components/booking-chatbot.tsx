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
  Edit3, XCircle, ArrowLeft, Download, Calendar as CalendarIcon
} from "lucide-react";
import { toast } from "sonner";

// Chatbot Flow Step Enum
export enum ChatStep {
  GREETING = "GREETING",
  NAME = "NAME",
  PHONE = "PHONE",
  LOCATION = "LOCATION",
  SYMPTOMS = "SYMPTOMS",
  DURATION = "DURATION",
  SEVERITY = "SEVERITY",
  DOCTOR_TYPE = "DOCTOR_TYPE",
  HOSPITAL = "HOSPITAL",
  DATE_TIME = "DATE_TIME",
  SUMMARY = "SUMMARY",
  CONFIRMED = "CONFIRMED",
}

interface Message {
  id: string;
  sender: "bot" | "user";
  text: string;
  timestamp: string;
  options?: string[];
  step?: ChatStep;
  isSummary?: boolean;
}

interface BookingDetails {
  fullName: string;
  phone: string;
  location: string;
  symptoms: string[];
  duration: string;
  severity: string;
  doctorSpecialty: string;
  doctorName: string;
  hospital: string;
  date: string;
  time: string;
  appointmentId?: string;
}

// English Options
const SYMPTOM_EXAMPLES_EN = [
  "Fever & Chills",
  "Cough & Cold",
  "Chest Pain",
  "Shortness of Breath",
  "Headache & Dizziness",
  "Stomach Ache & Nausea",
  "Joint & Back Pain",
  "Skin Rash / Allergy",
];

const DURATION_OPTIONS_EN = [
  "Today",
  "1 to 2 days",
  "3 to 7 days",
  "More than a week",
];

const SEVERITY_OPTIONS_EN = [
  "Mild (Manageable discomfort)",
  "Moderate (Affecting routine)",
  "Severe (Urgent attention)",
];

const DOCTOR_SPECIALTIES_EN = [
  "General Physician",
  "Cardiologist",
  "Pediatrician",
  "Orthopedic Surgeon",
  "Gynecologist",
  "Pulmonologist",
  "ENT Specialist",
];

const POPULAR_CITIES_EN = [
  "New Delhi",
  "Varanasi",
  "Noida",
  "Lucknow",
  "Gurugram",
  "Mumbai",
  "Patna",
];

const HOSPITAL_OPTIONS_EN = [
  "AI Nearest Hospital (Auto-Match)",
  "AIIMS New Delhi",
  "Safdarjung Hospital, New Delhi",
  "Sir Sunderlal Hospital (BHU), Varanasi",
  "District Hospital, Varanasi",
  "Max Super Speciality Hospital",
];

// Hindi Options
const SYMPTOM_EXAMPLES_HI = [
  "बुखार और ठंड लगना",
  "खांसी और जुकाम",
  "सीने में दर्द",
  "सांस लेने में तकलीफ",
  "सिरदर्द और चक्कर आना",
  "पेट दर्द और मतली",
  "जोड़ों और पीठ का दर्द",
  "त्वचा पर एलर्जी",
];

const DURATION_OPTIONS_HI = [
  "आज से",
  "1 से 2 दिन",
  "3 से 7 दिन",
  "एक सप्ताह से अधिक",
];

const SEVERITY_OPTIONS_HI = [
  "हल्का (सामान्य असुविधा)",
  "मध्यम (दिनचर्या प्रभावित)",
  "गंभीर (तत्काल परामर्श आवश्यक)",
];

const DOCTOR_SPECIALTIES_HI = [
  "सामान्य चिकित्सक (General Physician)",
  "हृदय रोग विशेषज्ञ (Cardiologist)",
  "शिशु रोग विशेषज्ञ (Pediatrician)",
  "हड्डी रोग विशेषज्ञ (Orthopedic)",
  "महिला रोग विशेषज्ञ (Gynecologist)",
  "श्वसन रोग विशेषज्ञ (Pulmonologist)",
  "ईएनटी विशेषज्ञ (ENT Specialist)",
];

const POPULAR_CITIES_HI = [
  "नई दिल्ली",
  "वाराणसी",
  "नोएडा",
  "लखनऊ",
  "गुरुग्राम",
  "मुंबई",
  "पटना",
];

const HOSPITAL_OPTIONS_HI = [
  "AI नजदीकी अस्पताल (Auto-Match)",
  "एम्स नई दिल्ली (AIIMS)",
  "सफदरजंग अस्पताल, नई दिल्ली",
  "सर सुंदरलाल अस्पताल BHU, वाराणसी",
  "जिला अस्पताल, वाराणसी",
  "मैक्स सुपर स्पेशियलिटी अस्पताल",
];

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
  const { currentUser, language, setLanguage, t } = useStore();

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
    location: "",
    symptoms: [],
    duration: "",
    severity: "",
    doctorSpecialty: "",
    doctorName: "Dr. Rajesh Sharma",
    hospital: "AIIMS New Delhi",
    date: language === "hi" ? "कल" : "Tomorrow",
    time: "10:30 AM",
  });

  const chatEndRef = useRef<HTMLDivElement>(null);
  const handleUserInputRef = useRef<(input: string) => void>(() => {});

  const isHindi = language === "hi";
  const symptomExamples = isHindi ? SYMPTOM_EXAMPLES_HI : SYMPTOM_EXAMPLES_EN;
  const durationOptions = isHindi ? DURATION_OPTIONS_HI : DURATION_OPTIONS_EN;
  const severityOptions = isHindi ? SEVERITY_OPTIONS_HI : SEVERITY_OPTIONS_EN;
  const doctorSpecialties = isHindi ? DOCTOR_SPECIALTIES_HI : DOCTOR_SPECIALTIES_EN;
  const popularCities = isHindi ? POPULAR_CITIES_HI : POPULAR_CITIES_EN;
  const hospitalOptions = isHindi ? HOSPITAL_OPTIONS_HI : HOSPITAL_OPTIONS_EN;

  // Text-To-Speech
  const speakText = useCallback((text: string) => {
    if (!isSpeechEnabled || typeof window === "undefined" || !("speechSynthesis" in window)) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text.replace(/[*_#🤖🩺👤👨‍⚕️🏥📅]/g, ""));
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.lang = isHindi ? "hi-IN" : "en-IN";
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn("TTS speech synthesis error:", e);
    }
  }, [isSpeechEnabled, isHindi]);

  // Add message helper
  const addBotMessage = useCallback((text: string, options?: string[], step?: ChatStep, isSummary?: boolean) => {
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
      };
      setMessages((prev) => [...prev, msg]);
      setIsTyping(false);
      speakText(text);
    }, 400);
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

  // Initial bot message on load / language switch
  const startConversation = useCallback(() => {
    setCurrentStep(ChatStep.GREETING);
    const greetingText = isHindi 
      ? "नमस्ते! मैं आपका सेहत साथी हूँ 🤖। मैं डॉक्टर अपॉइंटमेंट बुक करने में आपकी मदद कर सकता हूँ।"
      : "Hi, I'm your Sehat Saathi 🤖. I can help you book an appointment.";
    
    const nameQuestion = isHindi
      ? (currentUser?.name ? `आपका पूरा नाम क्या है? (या नीचे नाम पर टैप करें)` : `आपका पूरा नाम क्या है?`)
      : (currentUser?.name ? `What's your full name? (Or tap below)` : `What's your full name?`);

    setMessages([
      {
        id: "msg-1",
        sender: "bot",
        text: greetingText,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
    speakText(greetingText);

    setTimeout(() => {
      addBotMessage(nameQuestion, currentUser?.name ? [currentUser.name] : undefined, ChatStep.NAME);
      setCurrentStep(ChatStep.NAME);
    }, 500);
  }, [isHindi, currentUser?.name, addBotMessage, speakText]);

  useEffect(() => {
    startConversation();
  }, [startConversation]);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // AI Rule-Based Doctor Recommendation Engine
  const suggestDoctorForSymptoms = (symptomList: string[]): { specialty: string; doctorName: string } => {
    const text = symptomList.join(" ").toLowerCase();
    if (text.includes("chest") || text.includes("heart") || text.includes("breath") || text.includes("सीने") || text.includes("हृदय") || text.includes("सांस")) {
      return { 
        specialty: isHindi ? "हृदय रोग विशेषज्ञ (Cardiologist)" : "Cardiologist", 
        doctorName: isHindi ? "डॉ. प्रिया शर्मा" : "Dr. Priya Sharma" 
      };
    }
    if (text.includes("child") || text.includes("infant") || text.includes("baby") || text.includes("बच्चे") || text.includes("शिशु")) {
      return { 
        specialty: isHindi ? "शिशु रोग विशेषज्ञ (Pediatrician)" : "Pediatrician", 
        doctorName: isHindi ? "डॉ. अंजलि वर्मा" : "Dr. Anjali Verma" 
      };
    }
    if (text.includes("joint") || text.includes("bone") || text.includes("back") || text.includes("जोड़ों") || text.includes("पीठ") || text.includes("हड्डी")) {
      return { 
        specialty: isHindi ? "हड्डी रोग विशेषज्ञ (Orthopedic)" : "Orthopedic Surgeon", 
        doctorName: isHindi ? "डॉ. विक्रम सेठी" : "Dr. Vikram Sethi" 
      };
    }
    if (text.includes("throat") || text.includes("ear") || text.includes("nose") || text.includes("गले") || text.includes("कान") || text.includes("नाक")) {
      return { 
        specialty: isHindi ? "ईएनटी विशेषज्ञ (ENT Specialist)" : "ENT Specialist", 
        doctorName: isHindi ? "डॉ. संजय गुप्ता" : "Dr. Sanjay Gupta" 
      };
    }
    if (text.includes("pregnancy") || text.includes("women") || text.includes("period") || text.includes("गर्भवती") || text.includes("महिला")) {
      return { 
        specialty: isHindi ? "महिला रोग विशेषज्ञ (Gynecologist)" : "Gynecologist", 
        doctorName: isHindi ? "डॉ. मीनाक्षी सुंदरम" : "Dr. Meenakshi Sundaram" 
      };
    }
    return { 
      specialty: isHindi ? "सामान्य चिकित्सक (General Physician)" : "General Physician", 
      doctorName: isHindi ? "डॉ. राजेश कुमार" : "Dr. Rajesh Kumar" 
    };
  };

  // State Machine Step Transition Handler
  const handleUserInput = (input: string) => {
    if (!input.trim()) return;
    const cleanInput = input.trim();
    addUserMessage(cleanInput);
    setInputText("");

    switch (currentStep) {
      case ChatStep.NAME: {
        setBooking((prev) => ({ ...prev, fullName: cleanInput }));
        setCurrentStep(ChatStep.PHONE);
        addBotMessage(
          isHindi ? `आपसे मिलकर खुशी हुई, ${cleanInput}! कृपया मोबाइल नंबर दर्ज करें:` : `Nice to meet you, ${cleanInput}! Please enter your mobile number:`,
          currentUser?.phone ? [currentUser.phone] : undefined,
          ChatStep.PHONE
        );
        break;
      }

      case ChatStep.PHONE: {
        setBooking((prev) => ({ ...prev, phone: cleanInput }));
        setCurrentStep(ChatStep.LOCATION);
        addBotMessage(
          isHindi ? "धन्यवाद। आप किस शहर या इलाके में हैं?" : "Got it. Which city or area are you in?",
          popularCities,
          ChatStep.LOCATION
        );
        break;
      }

      case ChatStep.LOCATION: {
        setBooking((prev) => ({ ...prev, location: cleanInput }));
        setCurrentStep(ChatStep.SYMPTOMS);
        addBotMessage(
          isHindi ? "कृपया अपने लक्षण बताएं या नीचे दिए गए विकल्पों में से चुनें:" : "Please describe your symptoms, or pick from common examples:",
          symptomExamples,
          ChatStep.SYMPTOMS
        );
        break;
      }

      case ChatStep.SYMPTOMS: {
        const symptomsList = [cleanInput];
        const aiRec = suggestDoctorForSymptoms(symptomsList);

        setBooking((prev) => ({
          ...prev,
          symptoms: symptomsList,
          doctorSpecialty: aiRec.specialty,
          doctorName: aiRec.doctorName,
        }));

        setCurrentStep(ChatStep.DURATION);
        addBotMessage(
          isHindi ? `दर्ज किया: "${cleanInput}"। आपको ये लक्षण कब से हैं?` : `Recorded: "${cleanInput}". How long have you had these symptoms?`,
          durationOptions,
          ChatStep.DURATION
        );
        break;
      }

      case ChatStep.DURATION: {
        setBooking((prev) => ({ ...prev, duration: cleanInput }));
        setCurrentStep(ChatStep.SEVERITY);
        addBotMessage(
          isHindi ? "आपके लक्षणों की गंभीरता कैसी है?" : "How severe are your symptoms?",
          severityOptions,
          ChatStep.SEVERITY
        );
        break;
      }

      case ChatStep.SEVERITY: {
        setBooking((prev) => ({ ...prev, severity: cleanInput }));
        setCurrentStep(ChatStep.DOCTOR_TYPE);

        const aiRec = suggestDoctorForSymptoms(booking.symptoms);
        addBotMessage(
          isHindi 
            ? `AI सुझाव: ${aiRec.specialty}। आप किस डॉक्टर से मिलना चाहते हैं?` 
            : `AI Recommendation: ${aiRec.specialty}. What type of doctor would you like to consult?`,
          [`${isHindi ? "AI सुझाव: " : "AI Suggested: "}${aiRec.specialty}`, ...doctorSpecialties],
          ChatStep.DOCTOR_TYPE
        );
        break;
      }

      case ChatStep.DOCTOR_TYPE: {
        const chosenSpecialty = cleanInput.replace("AI Suggested: ", "").replace("AI सुझाव: ", "");
        const docName = chosenSpecialty.includes("Cardiologist") || chosenSpecialty.includes("हृदय") 
          ? (isHindi ? "डॉ. प्रिया शर्मा (कार्डियोलॉजी)" : "Dr. Priya Sharma (Cardiology)") 
          : chosenSpecialty.includes("Pediatrician") || chosenSpecialty.includes("शिशु")
          ? (isHindi ? "डॉ. अंजलि वर्मा (बाल रोग)" : "Dr. Anjali Verma (Pediatrics)")
          : chosenSpecialty.includes("Orthopedic") || chosenSpecialty.includes("हड्डी")
          ? (isHindi ? "डॉ. विक्रम सेठी (ऑर्थोपेडिक्स)" : "Dr. Vikram Sethi (Orthopedics)")
          : (isHindi ? "डॉ. राजेश कुमार (सामान्य चिकित्सक)" : "Dr. Rajesh Kumar (General Physician)");

        setBooking((prev) => ({
          ...prev,
          doctorSpecialty: chosenSpecialty,
          doctorName: docName,
        }));

        setCurrentStep(ChatStep.HOSPITAL);
        addBotMessage(
          isHindi ? "पसंदीदा अस्पताल चुनें या नजदीकी उपयुक्त अस्पताल खोजें:" : "Select your preferred hospital:",
          hospitalOptions,
          ChatStep.HOSPITAL
        );
        break;
      }

      case ChatStep.HOSPITAL: {
        const chosenHospital = cleanInput.includes("Auto-Match") 
          ? (booking.location.toLowerCase().includes("varanasi") || booking.location.includes("वाराणसी") ? (isHindi ? "जिला अस्पताल, वाराणसी" : "District Hospital, Varanasi") : (isHindi ? "एम्स नई दिल्ली" : "AIIMS New Delhi")) 
          : cleanInput;

        setBooking((prev) => ({ ...prev, hospital: chosenHospital }));
        setCurrentStep(ChatStep.DATE_TIME);
        addBotMessage(
          isHindi ? "अपॉइंटमेंट के लिए सुविधाजनक समय स्लॉट चुनें:" : "Choose your preferred date and time slot:",
          isHindi ? [
            "आज शाम 04:00 बजे",
            "कल सुबह 10:30 बजे",
            "कल दोपहर 02:00 बजे",
            "परसों सुबह 11:00 बजे",
          ] : [
            "Today at 04:00 PM",
            "Tomorrow at 10:30 AM",
            "Tomorrow at 02:00 PM",
            "Day After Tomorrow at 11:00 AM",
          ],
          ChatStep.DATE_TIME
        );
        break;
      }

      case ChatStep.DATE_TIME: {
        let datePart = isHindi ? "कल" : "Tomorrow";
        let timePart = "10:30 AM";

        if (cleanInput.includes("Today") || cleanInput.includes("आज")) {
          datePart = isHindi ? "आज" : "Today";
          timePart = "04:00 PM";
        } else if (cleanInput.includes("Tomorrow") || cleanInput.includes("कल")) {
          datePart = isHindi ? "कल" : "Tomorrow";
          timePart = cleanInput.includes("02:00") || cleanInput.includes("दोपहर") ? "02:00 PM" : "10:30 AM";
        } else {
          datePart = isHindi ? "परसों" : "Day After Tomorrow";
          timePart = "11:00 AM";
        }

        const updatedBooking = { ...booking, date: datePart, time: timePart };
        setBooking(updatedBooking);
        setCurrentStep(ChatStep.SUMMARY);

        addBotMessage(
          isHindi 
            ? "अपॉइंटमेंट सारांश तैयार है। कृपया विवरण देखकर पुष्टि करें:"
            : "Your booking summary is ready. Please review and confirm:",
          undefined,
          ChatStep.SUMMARY,
          true
        );
        break;
      }

      default:
        break;
    }
  };

  handleUserInputRef.current = handleUserInput;

  // Confirmation Flow
  const handleConfirmBooking = () => {
    const generatedId = `OPD-2026-${Math.floor(100000 + Math.random() * 900000)}`;
    const finalBooking = { ...booking, appointmentId: generatedId };
    setBooking(finalBooking);
    setCurrentStep(ChatStep.CONFIRMED);

    // Save appointment to backend API
    const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
    fetch(`${API}/api/appointments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        patientId: currentUser?.id || "p-demo-1",
        doctorId: "doc-1",
        dateTime: new Date(Date.now() + 86400000).toISOString(),
        status: "CONFIRMED",
        visitType: "NEW",
        reason: `${finalBooking.doctorSpecialty}: ${finalBooking.symptoms.join(", ")}`,
        notes: `Booked via Sehat Saathi AI. Severity: ${finalBooking.severity}. Hospital: ${finalBooking.hospital}`,
      }),
    }).catch((err) => console.warn("Failed to persist appointment:", err));

    addBotMessage(
      isHindi 
        ? `🎉 बधाई! आपका अपॉइंटमेंट बुक हो गया है। आपका टोकन ID: ${generatedId}`
        : `🎉 Appointment confirmed! Your OPD Token ID is ${generatedId}.`,
      undefined,
      ChatStep.CONFIRMED
    );

    toast.success(isHindi ? "अपॉइंटमेंट सफलतापूर्वक बुक हो गया!" : "Appointment Confirmed Successfully!");
  };

  const handleEditBooking = () => {
    setCurrentStep(ChatStep.SYMPTOMS);
    addBotMessage(
      isHindi ? "आइए लक्षणों को फिर से दर्ज करें। आप क्या अनुभव कर रहे हैं?" : "Let's update your symptoms. What are you experiencing?",
      symptomExamples,
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
      
      {/* ── Sleek, Clean, Modern Header ── */}
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
              <span>{t("botSubtitle")}</span>
            </div>
          </div>
        </div>

        {/* Right: Controls (Language Toggle + Voice Mute + Reset) */}
        <div className="flex items-center gap-2 shrink-0">
          
          {/* Segmented EN / हिंदी Toggle Pill */}
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

          {/* Voice Mute / Unmute */}
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

          {/* Reset Flow */}
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
                <div className="w-7 h-7 rounded-full bg-teal-600 text-white flex items-center justify-center shadow-xs shrink-0 mt-0.5">
                  <Bot className="w-3.5 h-3.5" />
                </div>
              )}

              <div className={`space-y-2.5 max-w-[85%] sm:max-w-[75%]`}>
                <div
                  className={`px-4 py-2.5 rounded-2xl text-[13px] leading-relaxed shadow-xs ${
                    isBot
                      ? "bg-white text-slate-800 border border-slate-200/70 rounded-tl-xs font-normal"
                      : "bg-teal-600 text-white rounded-tr-xs font-medium"
                  }`}
                >
                  <p>{msg.text}</p>
                </div>

                {/* Structured Appointment Summary Card Component */}
                {msg.isSummary && currentStep === ChatStep.SUMMARY && (
                  <Card className="border border-teal-200 bg-white rounded-2xl shadow-sm overflow-hidden animate-in fade-in duration-200">
                    <div className="bg-gradient-to-r from-teal-700 to-emerald-700 px-4 py-2.5 text-white flex items-center justify-between">
                      <div className="flex items-center gap-1.5 font-bold text-xs">
                        <Sparkles className="w-3.5 h-3.5 text-teal-200" />
                        <span>{t("bookingSummaryTitle")}</span>
                      </div>
                    </div>

                    <CardContent className="p-4 space-y-3 text-xs">
                      <div className="grid grid-cols-2 gap-2 pb-2.5 border-b border-slate-100">
                        <div>
                          <span className="text-slate-400 font-bold uppercase text-[9px] block">{t("summaryPatient")}</span>
                          <span className="font-bold text-slate-800 text-xs">{booking.fullName}</span>
                          <span className="text-[10px] text-slate-500 block font-mono">{booking.phone}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 font-bold uppercase text-[9px] block">{t("summarySymptoms")}</span>
                          <span className="font-semibold text-slate-800">{booking.symptoms.join(", ")}</span>
                          <span className="text-[10px] text-teal-700 font-medium block">{booking.duration} · {booking.severity}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 pb-2.5 border-b border-slate-100">
                        <div>
                          <span className="text-slate-400 font-bold uppercase text-[9px] block">{t("summaryDoctor")}</span>
                          <span className="font-bold text-slate-800 flex items-center gap-1 text-[11px]">
                            <Stethoscope className="w-3 h-3 text-teal-600 shrink-0" />
                            {booking.doctorName}
                          </span>
                          <Badge variant="outline" className="text-[9px] bg-teal-50 text-teal-800 border-teal-200 mt-0.5 py-0">
                            {booking.doctorSpecialty}
                          </Badge>
                        </div>
                        <div>
                          <span className="text-slate-400 font-bold uppercase text-[9px] block">{t("summaryHospital")}</span>
                          <span className="font-semibold text-slate-800 flex items-center gap-1 text-[11px]">
                            <Building2 className="w-3 h-3 text-teal-600 shrink-0" />
                            {booking.hospital}
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
                {msg.step === ChatStep.CONFIRMED && currentStep === ChatStep.CONFIRMED && (
                  <Card className="border border-emerald-300 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl shadow-sm p-4 text-center space-y-3 animate-in zoom-in-95 duration-300">
                    <div className="w-10 h-10 bg-emerald-600 text-white rounded-full flex items-center justify-center mx-auto shadow-xs">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>

                    <div className="space-y-0.5">
                      <h3 className="text-base font-bold text-slate-900">{t("confirmedTitle")}</h3>
                      <p className="text-xs text-slate-600 font-medium">
                        {t("confirmedSubtitle")}
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

                {/* Quick Select Option Chips (Pill Shaped) */}
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
            <span>{isHindi ? "सेहत साथी सोच रहा है..." : "Typing..."}</span>
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
          {/* Voice Input Mic Button */}
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

          {/* Text Input Field */}
          <Input
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={isListening ? (isHindi ? "सुन रहे हैं... बोलें" : "Listening... speak now") : (isHindi ? "अपना उत्तर लिखें..." : "Type your message...")}
            className="flex-1 h-10 rounded-full bg-slate-100 border-0 focus-visible:ring-1 focus-visible:ring-teal-500 px-4 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400"
          />

          {/* Send Button */}
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
