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
  "Moderate (Uncomfortable, affecting routine)",
  "Severe (Urgent clinical attention)",
];

const DOCTOR_SPECIALTIES_EN = [
  "General Physician",
  "Cardiologist",
  "Pediatrician",
  "Orthopedic Surgeon",
  "Gynecologist",
  "Pulmonologist (Chest Specialist)",
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
  "AI Nearest Suitable Hospital (Auto-Match)",
  "AIIMS New Delhi",
  "Safdarjung Hospital, New Delhi",
  "Sir Sunderlal Hospital (BHU), Varanasi",
  "District Hospital, Varanasi",
  "Max Super Speciality Hospital",
  "Fortis Memorial Research Institute",
];

// Hindi Options
const SYMPTOM_EXAMPLES_HI = [
  "बुखार और ठंड लगना (Fever)",
  "खांसी और जुकाम (Cough & Cold)",
  "सीने में दर्द (Chest Pain)",
  "सांस फूलना / सांस लेने में तकलीफ",
  "सिरदर्द और चक्कर आना",
  "पेट दर्द और मतली (Stomach Ache)",
  "जोड़ों और पीठ का दर्द (Joint Pain)",
  "त्वचा पर चकत्ते / एलर्जी (Skin Rash)",
];

const DURATION_OPTIONS_HI = [
  "आज से (Today)",
  "1 से 2 दिन (1-2 days)",
  "3 से 7 दिन (3-7 days)",
  "एक सप्ताह से अधिक (>1 week)",
];

const SEVERITY_OPTIONS_HI = [
  "हल्का (सामान्य असुविधा)",
  "मध्यम (दिनचर्या प्रभावित)",
  "गंभीर (तत्काल डॉक्टरी परामर्श आवश्यक)",
];

const DOCTOR_SPECIALTIES_HI = [
  "सामान्य चिकित्सक (General Physician)",
  "हृदय रोग विशेषज्ञ (Cardiologist)",
  "शिशु रोग विशेषज्ञ (Pediatrician)",
  "हड्डी रोग विशेषज्ञ (Orthopedic)",
  "महिला रोग विशेषज्ञ (Gynecologist)",
  "फेफड़ा / श्वसन रोग विशेषज्ञ (Pulmonologist)",
  "ईएनटी विशेषज्ञ (ENT Specialist)",
];

const POPULAR_CITIES_HI = [
  "नई दिल्ली (New Delhi)",
  "वाराणसी (Varanasi)",
  "नोएडा (Noida)",
  "लखनऊ (Lucknow)",
  "गुरुग्राम (Gurugram)",
  "मुंबई (Mumbai)",
  "पटना (Patna)",
];

const HOSPITAL_OPTIONS_HI = [
  "AI नजदीकी उपयुक्त अस्पताल (Auto-Match)",
  "एम्स नई दिल्ली (AIIMS New Delhi)",
  "सफदरजंग अस्पताल, नई दिल्ली",
  "सर सुंदरलाल अस्पताल (BHU), वाराणसी",
  "जिला अस्पताल, वाराणसी",
  "मैक्स सुपर स्पेशियलिटी अस्पताल",
  "फोर्टिस मेमोरियल रिसर्च इंस्टीट्यूट",
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
    date: language === "hi" ? "कल (Tomorrow)" : "Tomorrow",
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
    }, 450);
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
        toast.info(isHindi ? "सुन रहे हैं... कृपया अपना उत्तर बोलें।" : "Listening... Speak your response clearly.");
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
      ? (currentUser?.name ? `आपका पूरा नाम क्या है? (या नीचे अपने नाम पर टैप करें)` : `आपका पूरा नाम क्या है?`)
      : (currentUser?.name ? `What's your full name? (Or tap your saved name below)` : `What's your full name?`);

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
    }, 600);
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
        doctorName: isHindi ? "डॉ. प्रिया शर्मा (कार्डियोलॉजी)" : "Dr. Priya Sharma (Cardiology Specialist)" 
      };
    }
    if (text.includes("child") || text.includes("infant") || text.includes("baby") || text.includes("बच्चे") || text.includes("शिशु")) {
      return { 
        specialty: isHindi ? "शिशु रोग विशेषज्ञ (Pediatrician)" : "Pediatrician", 
        doctorName: isHindi ? "डॉ. अंजलि वर्मा (बाल रोग विभाग)" : "Dr. Anjali Verma (Pediatrics Lead)" 
      };
    }
    if (text.includes("joint") || text.includes("bone") || text.includes("back") || text.includes("जोड़ों") || text.includes("पीठ") || text.includes("हड्डी")) {
      return { 
        specialty: isHindi ? "हड्डी रोग विशेषज्ञ (Orthopedic)" : "Orthopedic Surgeon", 
        doctorName: isHindi ? "डॉ. विक्रम सेठी (ऑर्थोपेडिक्स)" : "Dr. Vikram Sethi (Orthopedics)" 
      };
    }
    if (text.includes("throat") || text.includes("ear") || text.includes("nose") || text.includes("गले") || text.includes("कान") || text.includes("नाक")) {
      return { 
        specialty: isHindi ? "ईएनटी विशेषज्ञ (ENT Specialist)" : "ENT Specialist", 
        doctorName: isHindi ? "डॉ. संजय गुप्ता (ईएनटी)" : "Dr. Sanjay Gupta (ENT Specialist)" 
      };
    }
    if (text.includes("pregnancy") || text.includes("women") || text.includes("period") || text.includes("गर्भवती") || text.includes("महिला")) {
      return { 
        specialty: isHindi ? "महिला रोग विशेषज्ञ (Gynecologist)" : "Gynecologist", 
        doctorName: isHindi ? "डॉ. मीनाक्षी सुंदरम (स्त्री रोग)" : "Dr. Meenakshi Sundaram (OB-GYN)" 
      };
    }
    return { 
      specialty: isHindi ? "सामान्य चिकित्सक (General Physician)" : "General Physician", 
      doctorName: isHindi ? "डॉ. राजेश कुमार (वरिष्ठ चिकित्सक)" : "Dr. Rajesh Kumar (Senior Consultant)" 
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
          isHindi ? `आपसे मिलकर खुशी हुई, ${cleanInput}! कृपया अपना 10 अंकों का मोबाइल नंबर दर्ज करें:` : `Nice to meet you, ${cleanInput}! Please enter your mobile number.`,
          currentUser?.phone ? [currentUser.phone] : undefined,
          ChatStep.PHONE
        );
        break;
      }

      case ChatStep.PHONE: {
        setBooking((prev) => ({ ...prev, phone: cleanInput }));
        setCurrentStep(ChatStep.LOCATION);
        addBotMessage(
          isHindi ? "धन्यवाद। आप किस शहर या इलाके में हैं?" : "Got it. Which city or area are you currently in?",
          popularCities,
          ChatStep.LOCATION
        );
        break;
      }

      case ChatStep.LOCATION: {
        setBooking((prev) => ({ ...prev, location: cleanInput }));
        setCurrentStep(ChatStep.SYMPTOMS);
        addBotMessage(
          isHindi ? "कृपया अपने लक्षण बताएं। आप नीचे दिए गए विकल्पों में से चुन सकते हैं या लिखकर बता सकते हैं:" : "Please describe your symptoms. You can pick an option or type your own.",
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
          isHindi ? `दर्ज किया गया: "${cleanInput}"। आपको ये लक्षण कब से हैं?` : `Recorded: "${cleanInput}". How long have you had these symptoms?`,
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
            ? `आपके लक्षणों के आधार पर हमारा AI ${aiRec.specialty} से परामर्श की सलाह देता है। आप किस डॉक्टर से मिलना चाहते हैं?` 
            : `Based on your symptoms, our AI suggests consulting a ${aiRec.specialty}. What type of doctor would you like to consult?`,
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
          isHindi ? "क्या आपका कोई पसंदीदा अस्पताल है? या मैं नजदीकी उपयुक्त अस्पताल खोजूं?" : "Do you have a preferred hospital? Or should I find the nearest suitable one?",
          hospitalOptions,
          ChatStep.HOSPITAL
        );
        break;
      }

      case ChatStep.HOSPITAL: {
        const chosenHospital = cleanInput.includes("Auto-Match") 
          ? (booking.location.toLowerCase().includes("varanasi") || booking.location.includes("वाराणसी") ? (isHindi ? "जिला अस्पताल, वाराणसी" : "District Hospital, Varanasi") : (isHindi ? "एम्स नई दिल्ली (नजदीकी अस्पताल)" : "AIIMS New Delhi (Nearest Match)")) 
          : cleanInput;

        setBooking((prev) => ({ ...prev, hospital: chosenHospital }));
        setCurrentStep(ChatStep.DATE_TIME);
        addBotMessage(
          isHindi ? "आप किस दिन और समय पर परामर्श लेना चाहेंगे? पसंदीदा समय चुनें:" : "When would you prefer your consultation? Choose a preferred date and time slot:",
          isHindi ? [
            "आज शाम 04:00 बजे (Today 4 PM)",
            "कल सुबह 10:30 बजे (Tomorrow 10:30 AM)",
            "कल दोपहर 02:00 बजे (Tomorrow 2 PM)",
            "परसों सुबह 11:00 बजे (Day After 11 AM)",
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
        let datePart = isHindi ? "कल (Tomorrow)" : "Tomorrow";
        let timePart = "10:30 AM";

        if (cleanInput.includes("Today") || cleanInput.includes("आज")) {
          datePart = isHindi ? "आज (Today)" : "Today";
          timePart = "04:00 PM";
        } else if (cleanInput.includes("Tomorrow") || cleanInput.includes("कल")) {
          datePart = isHindi ? "कल (Tomorrow)" : "Tomorrow";
          timePart = cleanInput.includes("02:00") ? "02:00 PM" : "10:30 AM";
        } else {
          datePart = isHindi ? "परसों" : "Day After Tomorrow";
          timePart = "11:00 AM";
        }

        const updatedBooking = { ...booking, date: datePart, time: timePart };
        setBooking(updatedBooking);
        setCurrentStep(ChatStep.SUMMARY);

        addBotMessage(
          isHindi 
            ? "उत्कृष्ट! आपके अपॉइंटमेंट का विवरण तैयार है। कृपया नीचे दिए गए सारांश की समीक्षा करें और पुष्टि करें:"
            : "Great! I have prepared your booking summary. Please review the details below:",
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
    fetch("http://localhost:5000/api/appointments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        patientId: currentUser?.id || "p-demo-1",
        doctorId: "doc-1",
        dateTime: new Date(Date.now() + 86400000).toISOString(),
        status: "CONFIRMED",
        visitType: "NEW",
        reason: `${finalBooking.doctorSpecialty}: ${finalBooking.symptoms.join(", ")}`,
        notes: `Booked via Sehat Saathi AI Bot. Severity: ${finalBooking.severity}. Hospital: ${finalBooking.hospital}`,
      }),
    }).catch((err) => console.warn("Failed to persist appointment:", err));

    addBotMessage(
      isHindi 
        ? `🎉 बधाई! आपका अपॉइंटमेंट सफलतापूर्वक बुक हो गया है। आपका टोकन आईडी ${generatedId} है।`
        : `🎉 Congratulations! Your appointment is confirmed with Token ID ${generatedId}.`,
      undefined,
      ChatStep.CONFIRMED
    );

    toast.success(isHindi ? "अपॉइंटमेंट सफलतापूर्वक बुक हो गया!" : "Appointment Confirmed Successfully!");
  };

  const handleEditBooking = () => {
    setCurrentStep(ChatStep.SYMPTOMS);
    addBotMessage(
      isHindi ? "कोई बात नहीं! आइए लक्षणों को फिर से दर्ज करें। आप क्या अनुभव कर रहे हैं?" : "No problem! Let's update your symptoms. What are you experiencing?",
      symptomExamples,
      ChatStep.SYMPTOMS
    );
  };

  const handleCancelBooking = () => {
    addBotMessage(
      isHindi ? "अपॉइंटमेंट बुकिंग रद्द कर दी गई है। आप कभी भी नया परामर्श बुक कर सकते हैं।" : "Your booking session has been cancelled. You can restart anytime.",
      [isHindi ? "नया अपॉइंटमेंट बुक करें" : "Book New Appointment"]
    );
    setTimeout(() => {
      if (onBackToDashboard) onBackToDashboard();
      else router.push("/");
    }, 1500);
  };

  return (
    <div className="flex flex-col h-full max-h-[82vh] bg-white rounded-3xl border border-slate-200/80 shadow-lg overflow-hidden font-sans">
      
      {/* ── Chatbot Header ── */}
      <div className="bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 p-4 sm:p-5 text-white flex items-center justify-between shadow-md border-b border-teal-500/20 shrink-0">
        <div className="flex items-center gap-3">
          {onBackToDashboard && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onBackToDashboard}
              className="text-slate-300 hover:text-white hover:bg-white/10 rounded-xl mr-1 h-9 w-9"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
          )}

          <div className="relative">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-teal-400 to-emerald-500 p-0.5 shadow-md flex items-center justify-center">
              <Bot className="w-6 h-6 text-slate-950" />
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 border-2 border-slate-950 rounded-full animate-pulse" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-extrabold text-sm sm:text-base tracking-tight">{t("botTitle")}</h2>
              <Badge className="bg-teal-400/20 text-teal-300 border-teal-400/30 text-[10px] font-bold px-1.5 py-0">
                {t("onlineAssistant")}
              </Badge>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">
              {t("botSubtitle")}
            </p>
          </div>
        </div>

        {/* Header Action Controls: Language Toggle + Voice + Reset */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          
          {/* Language Switcher Button */}
          <div className="flex items-center bg-white/10 backdrop-blur-md p-0.5 rounded-xl border border-white/15">
            <button
              type="button"
              onClick={() => setLanguage("en")}
              className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all ${
                language === "en" ? "bg-teal-500 text-slate-950 shadow-xs" : "text-slate-300 hover:text-white"
              }`}
            >
              EN
            </button>
            <button
              type="button"
              onClick={() => setLanguage("hi")}
              className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all ${
                language === "hi" ? "bg-teal-500 text-slate-950 shadow-xs" : "text-slate-300 hover:text-white"
              }`}
            >
              हिंदी
            </button>
          </div>

          {/* Voice Readback Mute / Unmute */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              setIsSpeechEnabled(!isSpeechEnabled);
              toast.info(isSpeechEnabled ? t("voiceOff") : t("voiceOn"));
            }}
            className="text-slate-300 hover:text-white hover:bg-white/10 rounded-xl h-9 w-9"
            title={isSpeechEnabled ? t("voiceOn") : t("voiceOff")}
          >
            {isSpeechEnabled ? <Volume2 className="w-4 h-4 text-teal-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
          </Button>

          {/* Reset Flow */}
          <Button
            variant="ghost"
            size="icon"
            onClick={startConversation}
            className="text-slate-300 hover:text-white hover:bg-white/10 rounded-xl h-9 w-9"
            title={t("resetChat")}
          >
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* ── Messages Chat Stream ── */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-slate-50/60">
        {messages.map((msg) => {
          const isBot = msg.sender === "bot";
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300 ${
                isBot ? "justify-start" : "justify-end"
              }`}
            >
              {isBot && (
                <div className="w-8 h-8 rounded-xl bg-teal-600 text-white flex items-center justify-center shadow-xs shrink-0 mt-0.5">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div className={`space-y-3 max-w-[85%] sm:max-w-[75%]`}>
                <div
                  className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-xs ${
                    isBot
                      ? "bg-white text-slate-800 border border-slate-200/80 rounded-tl-none font-medium"
                      : "bg-[#1e3a5f] text-white rounded-tr-none font-semibold shadow-md shadow-[#1e3a5f]/15"
                  }`}
                >
                  <p>{msg.text}</p>
                </div>

                {/* Structured Appointment Summary Card Component */}
                {msg.isSummary && currentStep === ChatStep.SUMMARY && (
                  <Card className="border border-teal-200 bg-white rounded-2xl shadow-md overflow-hidden animate-in fade-in zoom-in-95 duration-300">
                    <div className="bg-gradient-to-r from-teal-600 to-emerald-600 px-4 py-3 text-white flex items-center justify-between">
                      <div className="flex items-center gap-2 font-bold text-xs">
                        <Sparkles className="w-4 h-4 text-teal-200" />
                        <span>{t("bookingSummaryTitle")}</span>
                      </div>
                      <Badge className="bg-white/20 text-white border-0 text-[10px]">
                        {isHindi ? "समीक्षा करें" : "Review"}
                      </Badge>
                    </div>

                    <CardContent className="p-4 space-y-3 text-xs">
                      <div className="grid grid-cols-2 gap-3 pb-3 border-b border-slate-100">
                        <div>
                          <span className="text-slate-400 font-bold uppercase text-[10px] block">{t("summaryPatient")}</span>
                          <span className="font-extrabold text-slate-800 text-sm">{booking.fullName}</span>
                          <span className="text-[11px] text-slate-500 block font-mono">{booking.phone}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 font-bold uppercase text-[10px] block">{t("summarySymptoms")}</span>
                          <span className="font-bold text-slate-800">{booking.symptoms.join(", ")}</span>
                          <span className="text-[10px] text-teal-700 font-semibold block">{booking.duration} · {booking.severity}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3 pb-3 border-b border-slate-100">
                        <div>
                          <span className="text-slate-400 font-bold uppercase text-[10px] block">{t("summaryDoctor")}</span>
                          <span className="font-bold text-slate-800 flex items-center gap-1">
                            <Stethoscope className="w-3.5 h-3.5 text-teal-600" />
                            {booking.doctorName}
                          </span>
                          <Badge variant="outline" className="text-[9px] bg-teal-50 text-teal-800 border-teal-200 mt-0.5">
                            {booking.doctorSpecialty}
                          </Badge>
                        </div>
                        <div>
                          <span className="text-slate-400 font-bold uppercase text-[10px] block">{t("summaryHospital")}</span>
                          <span className="font-bold text-slate-800 flex items-center gap-1">
                            <Building2 className="w-3.5 h-3.5 text-teal-600" />
                            {booking.hospital}
                          </span>
                        </div>
                      </div>

                      <div className="p-3 bg-teal-50/70 rounded-xl flex items-center justify-between text-teal-950 font-bold">
                        <span className="flex items-center gap-1.5">
                          <Clock className="w-4 h-4 text-teal-700" />
                          {t("summaryDateTime")}:
                        </span>
                        <span className="text-teal-800">{booking.date} @ {booking.time}</span>
                      </div>

                      {/* 3 Action Buttons: Confirm / Edit / Cancel */}
                      <div className="pt-2 grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <Button
                          onClick={handleConfirmBooking}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs h-10 rounded-xl shadow-sm gap-1.5"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          {t("confirmBooking")}
                        </Button>
                        <Button
                          variant="outline"
                          onClick={handleEditBooking}
                          className="border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs h-10 rounded-xl gap-1.5"
                        >
                          <Edit3 className="w-3.5 h-3.5 text-teal-600" />
                          {t("editDetails")}
                        </Button>
                        <Button
                          variant="ghost"
                          onClick={handleCancelBooking}
                          className="text-rose-600 hover:bg-rose-50 font-bold text-xs h-10 rounded-xl gap-1"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          {t("cancelBooking")}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Final Success Banner after Confirmation */}
                {msg.step === ChatStep.CONFIRMED && currentStep === ChatStep.CONFIRMED && (
                  <Card className="border border-emerald-300 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl shadow-lg p-5 text-center space-y-4 animate-in zoom-in-95 duration-500">
                    <div className="w-12 h-12 bg-emerald-600 text-white rounded-full flex items-center justify-center mx-auto shadow-md">
                      <CheckCircle2 className="w-7 h-7" />
                    </div>

                    <div className="space-y-1">
                      <h3 className="text-lg font-black text-slate-900">{t("confirmedTitle")}</h3>
                      <p className="text-xs text-slate-600 font-medium">
                        {t("confirmedSubtitle")}
                      </p>
                    </div>

                    <div className="p-3 bg-white rounded-xl border border-emerald-200 inline-block text-center shadow-xs">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">{t("opdTokenLabel")}</span>
                      <span className="text-base font-black text-emerald-800 font-mono tracking-wide">{booking.appointmentId}</span>
                    </div>

                    <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                      <Button
                        size="sm"
                        onClick={() => {
                          toast.success(isHindi ? "अपॉइंटमेंट पर्ची डाउनलोड हो रही है..." : "Downloading official OPD confirmation slip...");
                        }}
                        className="bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs rounded-xl h-9 gap-1.5 shadow-sm"
                      >
                        <Download className="w-3.5 h-3.5" />
                        {t("downloadSlip")}
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          router.push("/scheduling");
                        }}
                        className="border-slate-200 hover:bg-white text-slate-700 font-bold text-xs rounded-xl h-9 gap-1.5"
                      >
                        <CalendarIcon className="w-3.5 h-3.5 text-teal-600" />
                        {t("addToCalendar")}
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={startConversation}
                        className="text-teal-800 hover:bg-teal-100/50 font-bold text-xs rounded-xl h-9"
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
                        className="px-3 py-1.5 rounded-xl text-xs font-bold bg-white text-teal-800 border border-teal-200 hover:bg-teal-600 hover:text-white hover:border-teal-600 transition-all shadow-xs"
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {!isBot && (
                <div className="w-8 h-8 rounded-xl bg-slate-800 text-white flex items-center justify-center shadow-xs shrink-0 mt-0.5">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          );
        })}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold pl-11 animate-pulse">
            <Bot className="w-4 h-4 text-teal-600" />
            <span>{isHindi ? "सेहत साथी सोच रहा है..." : "Sehat Saathi is typing..."}</span>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* ── Input Control Bar ── */}
      <div className="p-3 sm:p-4 bg-white border-t border-slate-200/80 shrink-0">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleUserInput(inputText);
          }}
          className="flex items-center gap-2"
        >
          {/* Voice Input Mic Button */}
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={toggleListening}
            className={`h-11 w-11 rounded-2xl shrink-0 transition-all ${
              isListening
                ? "bg-red-500 text-white border-red-500 animate-pulse shadow-md shadow-red-500/30"
                : "border-slate-200 hover:bg-slate-50 text-slate-600 hover:text-teal-600"
            }`}
            title={isListening ? t("listening") : t("tapToSpeak")}
          >
            <Mic className="w-5 h-5" />
          </Button>

          {/* Text Input Field */}
          <Input
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={isListening ? t("listening") : t("typeMessagePlaceholder")}
            className="h-11 rounded-2xl border-slate-200 bg-slate-50/70 text-xs sm:text-sm font-medium focus-visible:ring-teal-500 text-slate-800"
          />

          {/* Send Button */}
          <Button
            type="submit"
            disabled={!inputText.trim()}
            className="h-11 px-4 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-2xl shadow-sm shrink-0 disabled:opacity-40"
          >
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>

    </div>
  );
}
