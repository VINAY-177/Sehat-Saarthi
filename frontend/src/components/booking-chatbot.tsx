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
  Edit3, XCircle
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

const SYMPTOM_EXAMPLES = [
  "Fever & Chills",
  "Cough & Cold",
  "Chest Pain",
  "Shortness of Breath",
  "Headache & Dizziness",
  "Stomach Ache & Nausea",
  "Joint & Back Pain",
  "Skin Rash / Allergy",
];

const DURATION_OPTIONS = [
  "Today",
  "1 to 2 days",
  "3 to 7 days",
  "More than a week",
];

const SEVERITY_OPTIONS = [
  "Mild (Manageable discomfort)",
  "Moderate (Uncomfortable, affecting routine)",
  "Severe (Urgent clinical attention)",
];

const DOCTOR_SPECIALTIES = [
  "General Physician",
  "Cardiologist",
  "Pediatrician",
  "Orthopedic Surgeon",
  "Gynecologist",
  "Pulmonologist (Chest Specialist)",
  "ENT Specialist",
];

const POPULAR_CITIES = [
  "New Delhi",
  "Varanasi",
  "Noida",
  "Lucknow",
  "Gurugram",
  "Mumbai",
  "Patna",
];

const HOSPITAL_OPTIONS = [
  "AI Nearest Suitable Hospital (Auto-Match)",
  "AIIMS New Delhi",
  "Safdarjung Hospital, New Delhi",
  "Sir Sunderlal Hospital (BHU), Varanasi",
  "District Hospital, Varanasi",
  "Max Super Speciality Hospital",
  "Fortis Memorial Research Institute",
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
  const { currentUser } = useStore();

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
    date: "Tomorrow",
    time: "10:30 AM",
  });

  const chatEndRef = useRef<HTMLDivElement>(null);
  const handleUserInputRef = useRef<(input: string) => void>(() => {});

  // Text-To-Speech
  const speakText = useCallback((text: string) => {
    if (!isSpeechEnabled || typeof window === "undefined" || !("speechSynthesis" in window)) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text.replace(/[*_#🤖🩺👤👨‍⚕️🏥📅]/g, ""));
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.lang = "en-IN";
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn("TTS speech synthesis error:", e);
    }
  }, [isSpeechEnabled]);

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
        recognition.lang = "en-IN";

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
  }, []);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      toast.error("Voice input is not supported in this browser.");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
        toast.info("Listening... Speak your response clearly.");
      } catch (err) {
        console.warn("Could not start recognition:", err);
      }
    }
  };

  // Initial bot message on load
  useEffect(() => {
    const greetingText = "Hi, I'm your Sehat Saathi 🤖. I can help you book an appointment.";
    const nameQuestion = currentUser?.name 
      ? `What's your full name? (Or tap your saved name below)`
      : `What's your full name?`;

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
  }, []);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // AI Rule-Based Doctor Recommendation Engine
  const suggestDoctorForSymptoms = (symptomList: string[]): { specialty: string; doctorName: string } => {
    const text = symptomList.join(" ").toLowerCase();
    if (text.includes("chest") || text.includes("heart") || text.includes("breath") || text.includes("palpitation")) {
      return { specialty: "Cardiologist", doctorName: "Dr. Priya Sharma (Cardiology Specialist)" };
    }
    if (text.includes("child") || text.includes("infant") || text.includes("baby")) {
      return { specialty: "Pediatrician", doctorName: "Dr. Anjali Verma (Pediatrics Lead)" };
    }
    if (text.includes("joint") || text.includes("bone") || text.includes("back") || text.includes("fracture")) {
      return { specialty: "Orthopedic Surgeon", doctorName: "Dr. Vikram Sethi (Orthopedics)" };
    }
    if (text.includes("throat") || text.includes("ear") || text.includes("nose") || text.includes("sinus")) {
      return { specialty: "ENT Specialist", doctorName: "Dr. Sanjay Gupta (ENT Specialist)" };
    }
    if (text.includes("pregnancy") || text.includes("women") || text.includes("period")) {
      return { specialty: "Gynecologist", doctorName: "Dr. Meenakshi Sundaram (OB-GYN)" };
    }
    return { specialty: "General Physician", doctorName: "Dr. Rajesh Kumar (Senior Consultant)" };
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
          `Nice to meet you, ${cleanInput}! Please enter your mobile number.`,
          currentUser?.phone ? [currentUser.phone] : undefined,
          ChatStep.PHONE
        );
        break;
      }

      case ChatStep.PHONE: {
        setBooking((prev) => ({ ...prev, phone: cleanInput }));
        setCurrentStep(ChatStep.LOCATION);
        addBotMessage(
          "Got it. Which city or area are you currently in?",
          POPULAR_CITIES,
          ChatStep.LOCATION
        );
        break;
      }

      case ChatStep.LOCATION: {
        setBooking((prev) => ({ ...prev, location: cleanInput }));
        setCurrentStep(ChatStep.SYMPTOMS);
        addBotMessage(
          "Please describe your symptoms. You can pick an option or type your own.",
          SYMPTOM_EXAMPLES,
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
          `Recorded: "${cleanInput}". How long have you had these symptoms?`,
          DURATION_OPTIONS,
          ChatStep.DURATION
        );
        break;
      }

      case ChatStep.DURATION: {
        setBooking((prev) => ({ ...prev, duration: cleanInput }));
        setCurrentStep(ChatStep.SEVERITY);
        addBotMessage(
          "How severe are your symptoms?",
          SEVERITY_OPTIONS,
          ChatStep.SEVERITY
        );
        break;
      }

      case ChatStep.SEVERITY: {
        setBooking((prev) => ({ ...prev, severity: cleanInput }));
        setCurrentStep(ChatStep.DOCTOR_TYPE);

        const aiRec = suggestDoctorForSymptoms(booking.symptoms);
        addBotMessage(
          `Based on your symptoms, our AI suggests consulting a ${aiRec.specialty}. What type of doctor would you like to consult?`,
          [`AI Suggested: ${aiRec.specialty}`, ...DOCTOR_SPECIALTIES],
          ChatStep.DOCTOR_TYPE
        );
        break;
      }

      case ChatStep.DOCTOR_TYPE: {
        const chosenSpecialty = cleanInput.replace("AI Suggested: ", "");
        const docName = chosenSpecialty === "Cardiologist" 
          ? "Dr. Priya Sharma (Cardiology)" 
          : chosenSpecialty === "Pediatrician"
          ? "Dr. Anjali Verma (Pediatrics)"
          : chosenSpecialty === "Orthopedic Surgeon"
          ? "Dr. Vikram Sethi (Orthopedics)"
          : "Dr. Rajesh Kumar (General Physician)";

        setBooking((prev) => ({
          ...prev,
          doctorSpecialty: chosenSpecialty,
          doctorName: docName,
        }));

        setCurrentStep(ChatStep.HOSPITAL);
        addBotMessage(
          "Do you have a preferred hospital? Or should I find the nearest suitable one?",
          HOSPITAL_OPTIONS,
          ChatStep.HOSPITAL
        );
        break;
      }

      case ChatStep.HOSPITAL: {
        const chosenHospital = cleanInput.includes("Auto-Match") 
          ? (booking.location.toLowerCase().includes("varanasi") ? "District Hospital, Varanasi" : "AIIMS New Delhi (Nearest Match)") 
          : cleanInput;

        setBooking((prev) => ({ ...prev, hospital: chosenHospital }));
        setCurrentStep(ChatStep.DATE_TIME);
        addBotMessage(
          "When would you prefer your consultation? Choose a preferred date and time slot:",
          [
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
        let datePart = "Tomorrow";
        let timePart = "10:30 AM";

        if (cleanInput.includes("Today")) {
          datePart = "Today";
          timePart = cleanInput.replace("Today at ", "").trim();
        } else if (cleanInput.includes("Tomorrow")) {
          datePart = "Tomorrow";
          timePart = cleanInput.replace("Tomorrow at ", "").replace("Day After ", "").trim();
        } else {
          timePart = cleanInput;
        }

        const updatedBooking = { ...booking, date: datePart, time: timePart };
        setBooking(updatedBooking);
        setCurrentStep(ChatStep.SUMMARY);

        const summaryText = `Here is your appointment summary:\n• Patient: ${updatedBooking.fullName} (${updatedBooking.phone}, ${updatedBooking.location || "Local"})\n• Symptoms: ${updatedBooking.symptoms.join(", ")} (${updatedBooking.duration}, ${updatedBooking.severity})\n• Doctor: ${updatedBooking.doctorName}\n• Hospital: ${updatedBooking.hospital}\n• Date & Time: ${datePart} at ${timePart}\n\nPlease verify and confirm your booking.`;

        addBotMessage(summaryText, ["Confirm Appointment", "Edit Details", "Cancel"], ChatStep.SUMMARY, true);
        break;
      }

      case ChatStep.SUMMARY: {
        if (cleanInput.toLowerCase().includes("confirm")) {
          handleConfirmBooking();
        } else if (cleanInput.toLowerCase().includes("edit")) {
          handleResetToStep(ChatStep.SYMPTOMS);
        } else if (cleanInput.toLowerCase().includes("cancel")) {
          handleCancelBooking();
        } else {
          addBotMessage(
            "Please tap 'Confirm Appointment' to finalize, 'Edit Details' to change info, or 'Cancel'.",
            ["Confirm Appointment", "Edit Details", "Cancel"]
          );
        }
        break;
      }

      default:
        break;
    }
  };

  // Final Confirmation Action
  const handleConfirmBooking = async () => {
    const appointmentId = `APT-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;
    
    try {
      // Save appointment to backend
      await fetch("http://localhost:5000/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patientId: currentUser?.id || "p-1",
          doctorId: "doc-1",
          dateTime: new Date(Date.now() + 86400000).toISOString(),
          status: "CONFIRMED",
          visitType: "NEW",
          reason: `${booking.symptoms.join(", ")} (${booking.severity})`,
          notes: `Booked via Sehat Saathi Voice AI Assistant. Location: ${booking.location}, Hospital: ${booking.hospital}`,
        }),
      });
    } catch (e) {
      console.warn("Backend save skipped:", e);
    }

    setBooking((prev) => ({ ...prev, appointmentId }));
    setCurrentStep(ChatStep.CONFIRMED);

    const confirmSpeech = `Your appointment is confirmed! Appointment ID is ${appointmentId} with ${booking.doctorName} at ${booking.hospital} on ${booking.date} at ${booking.time}.`;
    addBotMessage(
      `🎉 Appointment Confirmed Successfully!\nAppointment ID: ${appointmentId}\nDoctor: ${booking.doctorName}\nHospital: ${booking.hospital}\nDate & Time: ${booking.date} at ${booking.time}`,
      undefined,
      ChatStep.CONFIRMED
    );
    speakText(confirmSpeech);
    toast.success("Appointment Confirmed!");
  };

  const handleResetToStep = (step: ChatStep) => {
    setCurrentStep(step);
    if (step === ChatStep.SYMPTOMS) {
      addBotMessage(
        "Let's update your symptoms. What are you experiencing?",
        SYMPTOM_EXAMPLES,
        ChatStep.SYMPTOMS
      );
    } else {
      addBotMessage("Please type your updated information.");
    }
  };

  const handleCancelBooking = () => {
    setCurrentStep(ChatStep.GREETING);
    addBotMessage(
      "Your appointment request was cancelled. Let me know when you'd like to book again!",
      ["Start New Booking"]
    );
    toast.info("Booking cancelled.");
  };

  const handleOptionClick = (option: string) => {
    if (option === "Start New Booking") {
      setCurrentStep(ChatStep.NAME);
      addBotMessage("What's your full name?", currentUser?.name ? [currentUser.name] : undefined, ChatStep.NAME);
      return;
    }
    if (option === "Confirm Appointment") {
      handleConfirmBooking();
      return;
    }
    if (option === "Edit Details") {
      handleResetToStep(ChatStep.SYMPTOMS);
      return;
    }
    if (option === "Cancel") {
      handleCancelBooking();
      return;
    }
    handleUserInput(option);
  };

  handleUserInputRef.current = handleUserInput;

  return (
    <div className="flex flex-col h-[650px] max-h-[85vh] bg-white rounded-3xl border border-slate-200/80 shadow-2xl overflow-hidden font-sans">
      {/* Chatbot Top Header Bar */}
      <div className="bg-gradient-to-r from-teal-700 via-teal-600 to-emerald-600 text-white px-5 py-4 flex items-center justify-between shadow-md shrink-0">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-inner">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-400 border-2 border-teal-800" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h2 className="font-extrabold text-base tracking-tight text-white">Sehat Saathi AI</h2>
              <Badge className="bg-white/20 text-white text-[10px] font-bold border-0 h-4 px-1.5">
                Voice Assistant
              </Badge>
            </div>
            <p className="text-xs text-teal-100/90 font-medium">Smart Clinical Appointment Booking</p>
          </div>
        </div>

        {/* Voice & Sound Toggles */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setIsSpeechEnabled(!isSpeechEnabled);
              if (isSpeechEnabled && typeof window !== "undefined") window.speechSynthesis?.cancel();
            }}
            className={`p-2 rounded-xl border transition-all ${
              isSpeechEnabled 
                ? "bg-white/20 border-white/30 text-white" 
                : "bg-black/20 border-transparent text-white/50"
            }`}
            title={isSpeechEnabled ? "Voice Output: ON (Click to Mute)" : "Voice Output: OFF"}
          >
            {isSpeechEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          <button
            type="button"
            onClick={() => {
              setCurrentStep(ChatStep.NAME);
              setMessages([]);
              addBotMessage("Hi, I'm your Sehat Saathi 🤖. What's your full name?", currentUser?.name ? [currentUser.name] : undefined, ChatStep.NAME);
            }}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-colors"
            title="Restart Conversation"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Chat Messages Body */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 bg-slate-50/60">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-2.5 ${msg.sender === "user" ? "flex-row-reverse" : "flex-row"}`}
          >
            {/* Avatar */}
            <div
              className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${
                msg.sender === "user"
                  ? "bg-blue-600 text-white"
                  : "bg-gradient-to-br from-teal-500 to-emerald-600 text-white"
              }`}
            >
              {msg.sender === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            {/* Bubble */}
            <div className={`space-y-2 max-w-[85%] sm:max-w-[75%]`}>
              <div
                className={`p-3.5 rounded-2xl text-xs sm:text-sm font-medium leading-relaxed shadow-sm ${
                  msg.sender === "user"
                    ? "bg-blue-600 text-white rounded-tr-none"
                    : "bg-white text-slate-800 border border-slate-200/70 rounded-tl-none"
                }`}
              >
                {/* Check if summary card */}
                {msg.isSummary ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-1.5 text-teal-700 font-extrabold text-xs uppercase tracking-wider pb-1 border-b border-slate-100">
                      <Sparkles className="w-4 h-4 text-teal-600" /> Appointment Summary
                    </div>
                    <div className="grid grid-cols-1 gap-2 text-xs text-slate-700">
                      <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 border border-slate-100">
                        <User className="w-4 h-4 text-teal-600 shrink-0" />
                        <div>
                          <span className="font-bold text-slate-900">{booking.fullName}</span>
                          <span className="text-slate-500 ml-1">({booking.phone}, {booking.location})</span>
                        </div>
                      </div>
                      <div className="flex items-start gap-2 p-2 rounded-xl bg-slate-50 border border-slate-100">
                        <Stethoscope className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold text-slate-900">{booking.symptoms.join(", ")}</span>
                          <span className="text-slate-500 block text-[11px]">{booking.duration} • {booking.severity}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 border border-slate-100">
                        <Building2 className="w-4 h-4 text-teal-600 shrink-0" />
                        <div>
                          <span className="font-bold text-slate-900">{booking.doctorName}</span>
                          <span className="text-slate-500 block text-[11px]">{booking.hospital}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 p-2 rounded-xl bg-teal-50/70 border border-teal-200 text-teal-950">
                        <Clock className="w-4 h-4 text-teal-700 shrink-0" />
                        <span className="font-extrabold">{booking.date} at {booking.time}</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="whitespace-pre-line">{msg.text}</p>
                )}
                
                <span
                  className={`block text-[9px] mt-1 text-right font-mono ${
                    msg.sender === "user" ? "text-blue-100" : "text-slate-400"
                  }`}
                >
                  {msg.timestamp}
                </span>
              </div>

              {/* Quick Reply Pills */}
              {msg.options && msg.options.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {msg.options.map((option, idx) => {
                    const isConfirm = option === "Confirm Appointment";
                    const isCancel = option === "Cancel";
                    const isEdit = option === "Edit Details";

                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleOptionClick(option)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-sm ${
                          isConfirm
                            ? "bg-gradient-to-r from-teal-600 to-emerald-600 text-white hover:from-teal-700 hover:to-emerald-700 shadow-teal-600/20"
                            : isCancel
                            ? "bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100"
                            : isEdit
                            ? "bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100"
                            : "bg-white text-slate-700 border border-slate-200 hover:border-teal-400 hover:bg-teal-50/50 hover:text-teal-900"
                        }`}
                      >
                        {isConfirm && <CheckCircle2 className="w-3.5 h-3.5 inline mr-1" />}
                        {isEdit && <Edit3 className="w-3.5 h-3.5 inline mr-1" />}
                        {isCancel && <XCircle className="w-3.5 h-3.5 inline mr-1" />}
                        {option}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Typing Animation */}
        {isTyping && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 text-white flex items-center justify-center shadow-sm">
              <Bot className="w-4 h-4" />
            </div>
            <div className="p-3 bg-white rounded-2xl rounded-tl-none border border-slate-200 shadow-sm flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-teal-500 animate-bounce" />
              <span className="w-2 h-2 rounded-full bg-teal-500 animate-bounce [animation-delay:0.2s]" />
              <span className="w-2 h-2 rounded-full bg-teal-500 animate-bounce [animation-delay:0.4s]" />
            </div>
          </div>
        )}

        {/* Confirmed Success State View */}
        {currentStep === ChatStep.CONFIRMED && (
          <Card className="border-2 border-emerald-500/40 bg-gradient-to-b from-emerald-50/80 to-white rounded-3xl overflow-hidden shadow-lg animate-in zoom-in-95 duration-300">
            <CardContent className="p-6 text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center shadow-inner">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <h3 className="text-xl font-black text-slate-900">Appointment Booked!</h3>
                <p className="text-xs text-slate-500 font-medium">Digital OPD Token Generated &amp; SMS Dispatched</p>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-emerald-200/80 text-left space-y-2 text-xs shadow-sm">
                <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                  <span className="text-slate-500 font-semibold">Appointment ID</span>
                  <span className="font-mono font-extrabold text-teal-700">{booking.appointmentId}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 font-semibold">Patient Name</span>
                  <span className="font-bold text-slate-900">{booking.fullName}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 font-semibold">Doctor &amp; Specialty</span>
                  <span className="font-bold text-slate-900">{booking.doctorName}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 font-semibold">Hospital</span>
                  <span className="font-bold text-slate-900">{booking.hospital}</span>
                </div>
                <div className="flex justify-between items-center pt-1 border-t border-slate-100">
                  <span className="text-slate-500 font-semibold">Schedule</span>
                  <span className="font-extrabold text-emerald-700">{booking.date} at {booking.time}</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 pt-2">
                <Button
                  type="button"
                  onClick={() => {
                    if (onBackToDashboard) {
                      onBackToDashboard();
                    } else {
                      router.push("/");
                    }
                  }}
                  className="flex-1 h-11 bg-teal-700 hover:bg-teal-800 text-white font-bold rounded-xl text-xs shadow-sm"
                >
                  Back to Dashboard
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/scheduling")}
                  className="flex-1 h-11 border-slate-200 font-bold rounded-xl text-xs hover:bg-slate-50"
                >
                  View in Appointments
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Input Bar with Mic & Send */}
      <div className="p-3 sm:p-4 bg-white border-t border-slate-200/80 shrink-0">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleUserInput(inputText);
          }}
          className="flex items-center gap-2"
        >
          {/* Voice Microphone Button */}
          <button
            type="button"
            onClick={toggleListening}
            className={`p-3 rounded-2xl transition-all shadow-sm shrink-0 ${
              isListening
                ? "bg-rose-600 text-white animate-pulse shadow-rose-600/30 scale-105"
                : "bg-slate-100 hover:bg-teal-50 text-slate-700 hover:text-teal-700 border border-slate-200"
            }`}
            title={isListening ? "Listening... Tap to stop" : "Speak naturally via Microphone"}
          >
            {isListening ? <Mic className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          {/* Text Input */}
          <Input
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={
              isListening
                ? "Listening to your voice..."
                : currentStep === ChatStep.NAME
                ? "Type your full name..."
                : currentStep === ChatStep.PHONE
                ? "Type your 10-digit mobile number..."
                : currentStep === ChatStep.SYMPTOMS
                ? "Describe your symptoms..."
                : "Type your reply or tap an option above..."
            }
            className="h-11 rounded-2xl border-slate-200 focus-visible:ring-teal-600 text-xs sm:text-sm bg-slate-50/50"
            disabled={currentStep === ChatStep.CONFIRMED}
          />

          {/* Send Button */}
          <Button
            type="submit"
            disabled={!inputText.trim() || currentStep === ChatStep.CONFIRMED}
            className="h-11 px-4 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-bold shadow-md shadow-teal-700/20 shrink-0"
          >
            <Send className="w-4 h-4" />
          </Button>
        </form>

        {isListening && (
          <div className="flex items-center justify-center gap-2 pt-2 text-[11px] font-bold text-rose-600 animate-pulse">
            <span className="w-2 h-2 rounded-full bg-rose-600" />
            Listening to your microphone... Speak naturally in English, Hindi, or Hinglish.
          </div>
        )}
      </div>
    </div>
  );
}
