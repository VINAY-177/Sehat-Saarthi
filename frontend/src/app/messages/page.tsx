"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import Link from "next/link";
import { Message, Patient, Urgency, Role } from "@/lib/types";
import { useStore } from "@/lib/store";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  MessageSquare,
  Search,
  Send,
  Paperclip,
  Stethoscope,
  Phone,
  FileText,
  FlaskConical,
  CheckCheck,
  Building2,
  Siren,
  HeartPulse,
  Calendar,
  Bed,
  Sparkles,
  User as UserIcon,
} from "lucide-react";
import { UrgencyBadge } from "@/components/urgency-badge";

interface Thread {
  id: string;
  contactName: string;
  contactRole: "DOCTOR" | "PATIENT" | "STAFF" | "AMBULANCE";
  contactSpecialtyOrMrn?: string;
  patientId?: string;
  facilityName?: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  online: boolean;
  avatarBg?: string;
  category: "DOCTORS" | "PATIENTS" | "COLLEAGUES" | "STAFF" | "AMBULANCE" | "HELPDESK";
}

export default function MessagesPage() {
  const { role, currentUser } = useStore();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedThreadId, setSelectedThreadId] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("ALL");
  const [messageInput, setMessageInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load patients for context
  useEffect(() => {
    async function loadPatients() {
      try {
        const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
        const pRes = await fetch(`${API}/api/patients`);
        if (pRes.ok) setPatients(await pRes.json());
      } catch (err) {
        console.warn("Could not fetch patients for messages context:", err);
      }
    }
    loadPatients();
  }, []);

  // 1. Patient / Citizen Isolated Threads
  const patientThreads: Thread[] = useMemo(() => [
    {
      id: "pat-thread-1",
      contactName: "Dr. Priya Sharma",
      contactRole: "DOCTOR",
      contactSpecialtyOrMrn: "Senior Cardiologist (AIIMS New Delhi)",
      facilityName: "AIIMS New Delhi",
      lastMessage: "Always take Aspirin strictly after breakfast. I have updated your digital prescription.",
      lastMessageTime: "10:45 AM",
      unreadCount: 0,
      online: true,
      category: "DOCTORS",
      avatarBg: "bg-teal-100 text-teal-800",
    },
    {
      id: "pat-thread-2",
      contactName: "Dr. Rajesh Kumar",
      contactRole: "DOCTOR",
      contactSpecialtyOrMrn: "General Physician (OPD Clinic)",
      facilityName: "Safdarjung Hospital",
      lastMessage: "Your blood test results show normal glucose levels. Keep up the dietary plan.",
      lastMessageTime: "Yesterday",
      unreadCount: 1,
      online: false,
      category: "DOCTORS",
      avatarBg: "bg-blue-100 text-blue-800",
    },
    {
      id: "pat-thread-3",
      contactName: "AIIMS OPD Helpdesk & Tokens",
      contactRole: "STAFF",
      contactSpecialtyOrMrn: "Queue & OPD Token Support Desk",
      facilityName: "AIIMS New Delhi",
      lastMessage: "Token #24 confirmed for Room 102 tomorrow morning at 10:30 AM.",
      lastMessageTime: "Yesterday",
      unreadCount: 0,
      online: true,
      category: "HELPDESK",
      avatarBg: "bg-emerald-100 text-emerald-800",
    },
    {
      id: "pat-thread-4",
      contactName: "108 Emergency Care Response",
      contactRole: "AMBULANCE",
      contactSpecialtyOrMrn: "Emergency Dispatch & Triage Desk",
      facilityName: "National Health Mission",
      lastMessage: "For urgent ambulance support, tap the 108 emergency button or type your location.",
      lastMessageTime: "2 days ago",
      unreadCount: 0,
      online: true,
      category: "AMBULANCE",
      avatarBg: "bg-rose-100 text-rose-800",
    },
  ], []);

  // 2. Doctor / Clinician Isolated Threads
  const doctorThreads: Thread[] = useMemo(() => [
    {
      id: "doc-thread-1",
      contactName: "Amit Sharma",
      contactRole: "PATIENT",
      contactSpecialtyOrMrn: "MRN-2025-0001 (Post-Op Cardiology)",
      patientId: patients[0]?.id || "p-1",
      lastMessage: "Doctor, I took the morning dosage of Atorvastatin. Feeling much better.",
      lastMessageTime: "10:45 AM",
      unreadCount: 0,
      online: true,
      category: "PATIENTS",
      avatarBg: "bg-teal-100 text-teal-800",
    },
    {
      id: "doc-thread-2",
      contactName: "Ramesh Yadav",
      contactRole: "PATIENT",
      contactSpecialtyOrMrn: "MRN-2025-0003 (Acute COPD & Triage)",
      patientId: patients[2]?.id || "p-3",
      lastMessage: "Doctor, chest tightness has decreased after nebulization.",
      lastMessageTime: "09:15 AM",
      unreadCount: 2,
      online: true,
      category: "PATIENTS",
      avatarBg: "bg-amber-100 text-amber-800",
    },
    {
      id: "doc-thread-3",
      contactName: "Dr. Vikram Sethi",
      contactRole: "DOCTOR",
      contactSpecialtyOrMrn: "Orthopedic Surgeon (Safdarjung)",
      lastMessage: "Please review the X-Ray hip joint views before scheduling arthroscopy tomorrow.",
      lastMessageTime: "08:30 AM",
      unreadCount: 1,
      online: true,
      category: "COLLEAGUES",
      avatarBg: "bg-purple-100 text-purple-800",
    },
    {
      id: "doc-thread-4",
      contactName: "ICU Operations Coordinator",
      contactRole: "STAFF",
      contactSpecialtyOrMrn: "Safdarjung Hospital Operations",
      lastMessage: "ICU Bed #4 allocated and prepared for incoming cardiology transfer.",
      lastMessageTime: "Yesterday",
      unreadCount: 0,
      online: true,
      category: "STAFF",
      avatarBg: "bg-blue-100 text-blue-800",
    },
  ], [patients]);

  // 3. Hospital Staff / Operations Isolated Threads
  const staffThreads: Thread[] = useMemo(() => [
    {
      id: "staff-thread-1",
      contactName: "Ambulance Unit DL-01-AB-1234",
      contactRole: "AMBULANCE",
      contactSpecialtyOrMrn: "Advanced Life Support (108 Fleet)",
      lastMessage: "Trauma case en-route with driver Manoj. ETA 8 minutes to Emergency Bay 2.",
      lastMessageTime: "11:02 AM",
      unreadCount: 1,
      online: true,
      category: "AMBULANCE",
      avatarBg: "bg-rose-100 text-rose-800",
    },
    {
      id: "staff-thread-2",
      contactName: "Dr. Priya Sharma",
      contactRole: "DOCTOR",
      contactSpecialtyOrMrn: "Chief Cardiologist (AIIMS)",
      lastMessage: "Requesting 1 ICU Bed reservation for incoming acute MI patient transfer.",
      lastMessageTime: "10:15 AM",
      unreadCount: 0,
      online: true,
      category: "STAFF",
      avatarBg: "bg-purple-100 text-purple-800",
    },
    {
      id: "staff-thread-3",
      contactName: "OPD Central Admissions Desk",
      contactRole: "STAFF",
      contactSpecialtyOrMrn: "Hospital Registration & ABHA Desk",
      lastMessage: "142 OPD tokens generated today. 28 verified via Ayushman Bharat ABHA ID.",
      lastMessageTime: "09:40 AM",
      unreadCount: 0,
      online: true,
      category: "HELPDESK",
      avatarBg: "bg-blue-100 text-blue-800",
    },
    {
      id: "staff-thread-4",
      contactName: "Sunita Devi (Patient Inquiry)",
      contactRole: "PATIENT",
      contactSpecialtyOrMrn: "MRN-2025-0012 (Admissions Inquiry)",
      lastMessage: "Can we get an estimate for the General Ward bed occupancy for tomorrow?",
      lastMessageTime: "Yesterday",
      unreadCount: 0,
      online: false,
      category: "PATIENTS",
      avatarBg: "bg-teal-100 text-teal-800",
    },
  ], []);

  // Determine active thread set by role
  const isDoctor = role === Role.DOCTOR;
  const isStaff = role === Role.HOSPITAL_STAFF;
  const isPatient = !isDoctor && !isStaff;

  const currentRoleThreads: Thread[] = useMemo(() => {
    if (isDoctor) return doctorThreads;
    if (isStaff) return staffThreads;
    return patientThreads;
  }, [isDoctor, isStaff, doctorThreads, staffThreads, patientThreads]);

  // Set default selected thread
  useEffect(() => {
    if (currentRoleThreads.length > 0) {
      setSelectedThreadId(currentRoleThreads[0].id);
    }
  }, [currentRoleThreads]);

  // Seeded messages per thread
  const threadMessagesMap: Record<string, Message[]> = useMemo(() => ({
    // Patient Threads
    "pat-thread-1": [
      {
        id: "pm-1",
        senderId: "pat-1",
        senderName: currentUser?.name || "Patient",
        senderRole: "PATIENT",
        recipientId: "doc-1",
        recipientName: "Dr. Priya Sharma",
        recipientRole: "DOCTOR",
        threadId: "pat-thread-1",
        content: "Good morning Doctor. Should I continue taking Aspirin 75mg before breakfast or after?",
        read: true,
        createdAt: "2026-08-24T05:00:00Z",
      },
      {
        id: "pm-2",
        senderId: "doc-1",
        senderName: "Dr. Priya Sharma",
        senderRole: "DOCTOR",
        recipientId: "pat-1",
        recipientName: currentUser?.name || "Patient",
        recipientRole: "PATIENT",
        threadId: "pat-thread-1",
        content: "Good morning! Always take Aspirin strictly after breakfast to prevent gastric irritation. I have attached your updated digital prescription slip below.",
        attachmentType: "PRESCRIPTION",
        attachmentData: JSON.stringify({ rxNumber: "RX-8842", drugs: "Aspirin 75mg, Atorvastatin 40mg, Metoprolol 50mg" }),
        read: true,
        createdAt: "2026-08-24T05:05:00Z",
      },
      {
        id: "pm-3",
        senderId: "pat-1",
        senderName: currentUser?.name || "Patient",
        senderRole: "PATIENT",
        recipientId: "doc-1",
        recipientName: "Dr. Priya Sharma",
        recipientRole: "DOCTOR",
        threadId: "pat-thread-1",
        content: "Thank you doctor, noted. I took the morning dosage and am feeling much better.",
        read: true,
        createdAt: "2026-08-24T05:15:00Z",
      },
    ],
    "pat-thread-2": [
      {
        id: "pm-4",
        senderId: "doc-2",
        senderName: "Dr. Rajesh Kumar",
        senderRole: "DOCTOR",
        recipientId: "pat-1",
        recipientName: currentUser?.name || "Patient",
        recipientRole: "PATIENT",
        threadId: "pat-thread-2",
        content: "Your blood test results show normal fasting glucose levels (94 mg/dL). Keep up the dietary plan.",
        attachmentType: "LAB_REPORT",
        attachmentData: JSON.stringify({ testName: "Fasting Blood Glucose", result: "94 mg/dL (Normal)" }),
        read: true,
        createdAt: "2026-08-23T14:30:00Z",
      },
    ],
    "pat-thread-3": [
      {
        id: "pm-5",
        senderId: "staff-1",
        senderName: "AIIMS OPD Helpdesk",
        senderRole: "STAFF",
        recipientId: "pat-1",
        recipientName: currentUser?.name || "Patient",
        recipientRole: "PATIENT",
        threadId: "pat-thread-3",
        content: "Namaste! Your OPD Token #24 is confirmed for Room 102 tomorrow morning at 10:30 AM. Please arrive 15 minutes prior for ABHA verification.",
        read: true,
        createdAt: "2026-08-23T16:00:00Z",
      },
    ],
    "pat-thread-4": [
      {
        id: "pm-6",
        senderId: "amb-1",
        senderName: "108 Emergency Control",
        senderRole: "AMBULANCE",
        recipientId: "pat-1",
        recipientName: currentUser?.name || "Patient",
        recipientRole: "PATIENT",
        threadId: "pat-thread-4",
        content: "108 Emergency Helpdesk is active. For medical emergencies, tap the Call 108 button or message here.",
        read: true,
        createdAt: "2026-08-22T08:00:00Z",
      },
    ],

    // Doctor Threads
    "doc-thread-1": [
      {
        id: "dm-1",
        senderId: "pat-1",
        senderName: "Amit Sharma",
        senderRole: "PATIENT",
        recipientId: "doc-1",
        recipientName: currentUser?.name || "Dr. Clinician",
        recipientRole: "DOCTOR",
        threadId: "doc-thread-1",
        content: "Doctor, I took the morning dosage of Atorvastatin. Feeling much better.",
        read: true,
        createdAt: "2026-08-24T05:15:00Z",
      },
    ],
    "doc-thread-2": [
      {
        id: "dm-2",
        senderId: "pat-2",
        senderName: "Ramesh Yadav",
        senderRole: "PATIENT",
        recipientId: "doc-1",
        recipientName: currentUser?.name || "Dr. Clinician",
        recipientRole: "DOCTOR",
        threadId: "doc-thread-2",
        content: "Doctor, chest tightness has decreased after nebulization. Oxygen saturation is 96%.",
        read: false,
        createdAt: "2026-08-24T03:45:00Z",
      },
    ],
    "doc-thread-3": [
      {
        id: "dm-3",
        senderId: "doc-3",
        senderName: "Dr. Vikram Sethi",
        senderRole: "DOCTOR",
        recipientId: "doc-1",
        recipientName: currentUser?.name || "Dr. Clinician",
        recipientRole: "DOCTOR",
        threadId: "doc-thread-3",
        content: "Please review the X-Ray hip joint views for Ramesh Yadav before scheduling arthroscopy tomorrow.",
        attachmentType: "LAB_REPORT",
        attachmentData: JSON.stringify({ testName: "Pelvic X-Ray AP/Lat", result: "Joint space narrowing Grade 2" }),
        read: false,
        createdAt: "2026-08-24T03:00:00Z",
      },
    ],
    "doc-thread-4": [
      {
        id: "dm-4",
        senderId: "staff-2",
        senderName: "ICU Coordinator",
        senderRole: "STAFF",
        recipientId: "doc-1",
        recipientName: currentUser?.name || "Dr. Clinician",
        recipientRole: "DOCTOR",
        threadId: "doc-thread-4",
        content: "ICU Bed #4 allocated and prepared for incoming cardiology transfer with ventilator standby.",
        read: true,
        createdAt: "2026-08-23T18:00:00Z",
      },
    ],

    // Staff Threads
    "staff-thread-1": [
      {
        id: "sm-1",
        senderId: "amb-1",
        senderName: "Ambulance Unit DL-01",
        senderRole: "AMBULANCE",
        recipientId: "staff-1",
        recipientName: currentUser?.name || "Hospital Staff",
        recipientRole: "STAFF",
        threadId: "staff-thread-1",
        content: "Trauma case en-route with driver Manoj. ETA 8 minutes to Emergency Bay 2. Patient BP 110/70, SpO2 94%.",
        read: false,
        createdAt: "2026-08-24T05:32:00Z",
      },
    ],
    "staff-thread-2": [
      {
        id: "sm-2",
        senderId: "doc-1",
        senderName: "Dr. Priya Sharma",
        senderRole: "DOCTOR",
        recipientId: "staff-1",
        recipientName: currentUser?.name || "Hospital Staff",
        recipientRole: "STAFF",
        threadId: "staff-thread-2",
        content: "Requesting 1 ICU Bed reservation for incoming acute MI patient transfer from Primary Health Centre.",
        read: true,
        createdAt: "2026-08-24T04:45:00Z",
      },
    ],
    "staff-thread-3": [
      {
        id: "sm-3",
        senderId: "staff-desk",
        senderName: "OPD Registration Desk",
        senderRole: "STAFF",
        recipientId: "staff-1",
        recipientName: currentUser?.name || "Hospital Staff",
        recipientRole: "STAFF",
        threadId: "staff-thread-3",
        content: "142 OPD tokens generated today. 28 verified via Ayushman Bharat ABHA ID. System synchronized.",
        read: true,
        createdAt: "2026-08-24T04:10:00Z",
      },
    ],
    "staff-thread-4": [
      {
        id: "sm-4",
        senderId: "pat-12",
        senderName: "Sunita Devi",
        senderRole: "PATIENT",
        recipientId: "staff-1",
        recipientName: currentUser?.name || "Hospital Staff",
        recipientRole: "STAFF",
        threadId: "staff-thread-4",
        content: "Can we get an estimate for the General Ward bed occupancy for tomorrow morning?",
        read: true,
        createdAt: "2026-08-23T19:00:00Z",
      },
    ],
  }), [currentUser]);

  // Sync active message stream
  useEffect(() => {
    if (selectedThreadId && threadMessagesMap[selectedThreadId]) {
      setMessages(threadMessagesMap[selectedThreadId]);
    } else {
      setMessages([]);
    }
  }, [selectedThreadId, threadMessagesMap]);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const activeThread = currentRoleThreads.find((t) => t.id === selectedThreadId) || currentRoleThreads[0] || {
    id: "empty",
    contactName: "Select Conversation",
    contactRole: "DOCTOR",
    lastMessage: "",
    lastMessageTime: "",
    unreadCount: 0,
    online: false,
    category: "DOCTORS",
  };

  const activePatient = patients.find((p) => p.name === activeThread.contactName) || patients[0];

  // Send Message Handler
  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!messageInput.trim()) return;

    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      senderId: currentUser?.id || "user-1",
      senderName: currentUser?.name || (isDoctor ? "Dr. Clinician" : isStaff ? "Hospital Staff" : "Patient"),
      senderRole: (isDoctor ? "DOCTOR" : isStaff ? "STAFF" : "PATIENT") as "DOCTOR" | "PATIENT" | "STAFF" | "ADMIN",
      recipientId: activeThread.id,
      recipientName: activeThread.contactName,
      recipientRole: (activeThread.contactRole === "AMBULANCE" ? "STAFF" : activeThread.contactRole) as "DOCTOR" | "PATIENT" | "STAFF" | "ADMIN",
      threadId: selectedThreadId,
      content: messageInput.trim(),
      read: true,
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, newMsg]);
    setMessageInput("");
  };

  // Filter tabs per role
  const roleFilterTabs = useMemo(() => {
    if (isDoctor) {
      return [
        { key: "ALL", label: "All Messages" },
        { key: "PATIENTS", label: "Patients" },
        { key: "COLLEAGUES", label: "Colleagues" },
        { key: "STAFF", label: "Specialists" },
        { key: "AMBULANCE", label: "Ops" },
      ];
    }
    if (isStaff) {
      return [
        { key: "ALL", label: "All Communications" },
        { key: "PATIENTS", label: "Patients" },
        { key: "STAFF", label: "Colleagues" },
        { key: "HELPDESK", label: "Specialists" },
        { key: "AMBULANCE", label: "Ops" },
      ];
    }
    // Patient / Citizen
    return [
      { key: "ALL", label: "All Chats" },
      { key: "DOCTORS", label: "My Doctors" },
      { key: "HELPDESK", label: "Hospital Helpdesk" },
      { key: "AMBULANCE", label: "Emergency Ops" },
    ];
  }, [isDoctor, isStaff]);

  // Filtered threads list
  const filteredThreads = currentRoleThreads.filter((t) => {
    const matchesCategory = filterCategory === "ALL" || t.category === filterCategory;
    const matchesSearch =
      !searchQuery ||
      t.contactName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.contactSpecialtyOrMrn && t.contactSpecialtyOrMrn.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-16 animate-in fade-in duration-300">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200/80 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-br from-teal-600 to-emerald-600 text-white rounded-2xl shadow-sm">
            <MessageSquare className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-slate-900">
                {isDoctor 
                  ? "Clinical Consultations & Colleague Messaging" 
                  : isStaff 
                  ? "Hospital Operations & Fleet Dispatch Comms" 
                  : "Doctor Consultations & Care Helpdesk"}
              </h1>
              <Badge variant="outline" className="bg-teal-50 text-teal-700 border-teal-200 font-bold text-[10px]">
                {isDoctor ? "Doctor Portal" : isStaff ? "Staff Operations" : "Patient Portal"}
              </Badge>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              {isDoctor
                ? "Encrypted patient triage inquiries, specialist case consults, and bed coordination."
                : isStaff
                ? "Live 108 ambulance telemetry, bed reservations, and patient registration support."
                : "Direct messaging with your consulting doctors, prescription guidance, and hospital OPD tokens."}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 font-bold px-3 py-1 text-xs gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            256-bit Encrypted Channel
          </Badge>
        </div>
      </div>

      {/* 3-Column Messaging Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[720px]">
        
        {/* Column 1: Filtered Role Conversation Threads (4 Cols) */}
        <div className="lg:col-span-4 bg-white rounded-3xl border border-slate-200/80 shadow-sm flex flex-col overflow-hidden">
          {/* Search & Role Filter Tabs */}
          <div className="p-4 border-b border-slate-100 space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search conversations..."
                className="pl-9 h-10 rounded-xl bg-slate-50 border-slate-200 text-xs focus:bg-white"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Role-Specific Filter Tabs */}
            <div className="flex items-center gap-1 overflow-x-auto pb-1 text-[11px] font-bold scrollbar-hide">
              {roleFilterTabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setFilterCategory(tab.key)}
                  className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${
                    filterCategory === tab.key
                      ? "bg-slate-900 text-white shadow-sm"
                      : "text-slate-500 hover:bg-slate-100 hover:text-slate-800"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Thread Cards List */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-50 p-2 space-y-1">
            {filteredThreads.map((thread) => {
              const isSelected = thread.id === selectedThreadId;

              return (
                <div
                  key={thread.id}
                  onClick={() => setSelectedThreadId(thread.id)}
                  className={`p-3.5 rounded-2xl cursor-pointer transition-all flex items-start gap-3 ${
                    isSelected
                      ? "bg-teal-50/80 border border-teal-200 shadow-sm"
                      : "hover:bg-slate-50 border border-transparent"
                  }`}
                >
                  {/* Avatar Icon */}
                  <div className="relative shrink-0">
                    <div
                      className={`w-11 h-11 rounded-2xl font-bold flex items-center justify-center text-sm shadow-sm ${
                        thread.avatarBg || "bg-teal-100 text-teal-800"
                      }`}
                    >
                      {thread.contactRole === "AMBULANCE" ? (
                        <Siren className="w-5 h-5 text-rose-600 animate-pulse" />
                      ) : thread.contactRole === "DOCTOR" ? (
                        <Stethoscope className="w-5 h-5 text-teal-700" />
                      ) : thread.contactRole === "STAFF" ? (
                        <Building2 className="w-5 h-5 text-blue-700" />
                      ) : (
                        <UserIcon className="w-5 h-5 text-teal-700" />
                      )}
                    </div>
                    {thread.online && (
                      <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white" />
                    )}
                  </div>

                  {/* Text Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-0.5">
                      <h4 className={`text-sm font-bold truncate ${isSelected ? "text-teal-950" : "text-slate-900"}`}>
                        {thread.contactName}
                      </h4>
                      <span className="text-[10px] text-slate-400 font-medium shrink-0 ml-1">
                        {thread.lastMessageTime}
                      </span>
                    </div>

                    {thread.contactSpecialtyOrMrn && (
                      <span className="text-[10px] font-semibold text-slate-400 block mb-1 truncate">
                        {thread.contactSpecialtyOrMrn}
                      </span>
                    )}

                    <p className="text-xs text-slate-500 truncate leading-tight">{thread.lastMessage}</p>
                  </div>

                  {thread.unreadCount > 0 && (
                    <span className="w-5 h-5 rounded-full bg-teal-600 text-white text-[10px] font-bold flex items-center justify-center shrink-0 self-center">
                      {thread.unreadCount}
                    </span>
                  )}
                </div>
              );
            })}

            {filteredThreads.length === 0 && (
              <div className="p-8 text-center text-xs text-slate-400">
                No active conversations found matching your filter.
              </div>
            )}
          </div>
        </div>

        {/* Column 2: Active Chat Feed (5 Cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200/80 shadow-sm flex flex-col overflow-hidden">
          {/* Chat Header */}
          <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-teal-600 text-white font-bold flex items-center justify-center text-sm shadow-sm">
                {activeThread.contactRole === "AMBULANCE" ? (
                  <Siren className="w-5 h-5" />
                ) : (
                  activeThread.contactName.replace("Dr. ", "").charAt(0)
                )}
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 text-sm leading-tight">{activeThread.contactName}</h3>
                <p className="text-[11px] text-slate-500 font-medium flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  {activeThread.contactSpecialtyOrMrn || "Verified Contact"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <a href="tel:108">
                <Button size="icon" variant="ghost" className="h-9 w-9 text-slate-500 hover:text-slate-800 rounded-xl" title="Voice Call">
                  <Phone className="w-4 h-4" />
                </Button>
              </a>
            </div>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/30">
            {messages.map((msg) => {
              const isOutgoing =
                msg.senderName === currentUser?.name ||
                (isDoctor && msg.senderRole === "DOCTOR") ||
                (isStaff && msg.senderRole === "STAFF") ||
                (isPatient && msg.senderRole === "PATIENT");

              return (
                <div key={msg.id} className={`flex flex-col ${isOutgoing ? "items-end" : "items-start"}`}>
                  <div className="flex items-end gap-2 max-w-[85%]">
                    <div
                      className={`p-4 rounded-2xl text-xs space-y-2 leading-relaxed shadow-sm ${
                        isOutgoing
                          ? "bg-teal-600 text-white rounded-br-none"
                          : "bg-white text-slate-800 border border-slate-200/80 rounded-bl-none"
                      }`}
                    >
                      <p className="whitespace-pre-line">{msg.content}</p>

                      {/* Attachment Previews */}
                      {msg.attachmentType === "PRESCRIPTION" && (
                        <div className="p-3 rounded-xl bg-teal-700/80 text-white border border-teal-500/40 text-[11px] space-y-1.5 mt-2">
                          <div className="flex items-center gap-1.5 font-bold">
                            <FileText className="w-3.5 h-3.5 text-teal-200" />
                            <span>Digital Prescription Slip</span>
                          </div>
                          <p className="text-[10px] text-teal-100 font-mono">
                            {JSON.parse(msg.attachmentData || "{}").drugs || "Regimen Attached"}
                          </p>
                        </div>
                      )}

                      {msg.attachmentType === "LAB_REPORT" && (
                        <div className="p-3 rounded-xl bg-blue-50 text-blue-900 border border-blue-200 text-[11px] space-y-1 mt-2">
                          <div className="flex items-center gap-1.5 font-bold">
                            <FlaskConical className="w-3.5 h-3.5 text-blue-600" />
                            <span>Diagnostic Pathology Report</span>
                          </div>
                          <p className="text-[10px] font-bold text-teal-700">
                            {JSON.parse(msg.attachmentData || "{}").testName}: {JSON.parse(msg.attachmentData || "{}").result}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  <span className="text-[10px] text-slate-400 mt-1 flex items-center gap-1 px-1">
                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    {isOutgoing && <CheckCheck className="w-3 h-3 text-teal-600 ml-0.5" />}
                  </span>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input Bar */}
          <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-100 bg-white flex items-center gap-2">
            <Button type="button" size="icon" variant="ghost" className="h-10 w-10 text-slate-400 hover:text-slate-600 rounded-xl shrink-0">
              <Paperclip className="w-4 h-4" />
            </Button>
            <Input
              placeholder={
                isDoctor
                  ? "Type clinical guidance, dosage, or reply..."
                  : isStaff
                  ? "Type bed allocation or dispatch message..."
                  : "Type your query for the doctor or helpdesk..."
              }
              className="h-11 rounded-xl bg-slate-50 border-slate-200 text-xs focus:bg-white flex-1"
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
            />
            <Button type="submit" className="h-11 px-4 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl shrink-0 gap-1.5">
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline text-xs">Send</span>
            </Button>
          </form>
        </div>

        {/* Column 3: Role-Specific Clinical / Operational Context Panel (3 Cols) */}
        <div className="lg:col-span-3 bg-white rounded-3xl border border-slate-200/80 shadow-sm p-4 overflow-y-auto flex flex-col justify-between">
          {/* A. DOCTOR VIEW: Patient Clinical Context */}
          {isDoctor && (
            <div className="space-y-4">
              <div className="text-center space-y-1.5 pb-3 border-b border-slate-100">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 text-white font-bold text-lg flex items-center justify-center mx-auto shadow-sm">
                  {activePatient?.name?.charAt(0) || "P"}
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-sm">{activePatient?.name || "Patient Record"}</h3>
                  <p className="text-[10px] text-slate-400 font-mono">{activePatient?.mrn || "MRN-2025-0001"}</p>
                </div>
                <div className="flex items-center justify-center gap-1.5 pt-0.5">
                  <UrgencyBadge urgency={(activePatient?.riskLevel as Urgency) || Urgency.HIGH} size="sm" />
                  <Badge variant="outline" className="text-[10px] bg-slate-50 font-semibold">
                    {activePatient?.age || 40} yrs • {activePatient?.gender || "Male"}
                  </Badge>
                </div>
              </div>

              {/* Active Conditions */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Active Conditions
                </span>
                <div className="space-y-1">
                  {(activePatient?.conditions || [{ id: "1", name: "Hypertension (I10)", status: "CHRONIC" }, { id: "2", name: "Coronary Artery Disease", status: "ACTIVE" }]).map((c) => (
                    <div key={c.id} className="p-2 rounded-lg bg-slate-50 border border-slate-100 text-xs font-semibold text-slate-800 flex justify-between items-center gap-1">
                      <span className="truncate">{c.name}</span>
                      <Badge variant="outline" className="text-[9px] py-0 bg-white shrink-0">
                        {c.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>

              {/* Vitals Snapshot */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Latest Telemetry
                </span>
                <div className="grid grid-cols-2 gap-2 text-center text-xs">
                  <div className="p-2 bg-slate-50 rounded-lg border border-slate-100">
                    <span className="text-[10px] text-slate-400 block font-bold">BP</span>
                    <span className="font-extrabold text-slate-900">138/88</span>
                  </div>
                  <div className="p-2 bg-slate-50 rounded-lg border border-slate-100">
                    <span className="text-[10px] text-slate-400 block font-bold whitespace-nowrap">SpO₂</span>
                    <span className="font-extrabold text-emerald-600">97%</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2 pt-3 border-t border-slate-100">
                <Link href={`/patients/${activePatient?.id || "p-1"}/encounter`}>
                  <Button className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl h-9 text-xs gap-1.5 shadow-sm">
                    <Stethoscope className="w-3.5 h-3.5" />
                    Clinical Encounter
                  </Button>
                </Link>
                <Link href={`/patients/${activePatient?.id || "p-1"}`}>
                  <Button variant="outline" className="w-full font-bold rounded-xl h-9 text-xs border-slate-200 hover:bg-slate-50">
                    Open Patient Profile
                  </Button>
                </Link>
              </div>
            </div>
          )}

          {/* B. STAFF VIEW: Hospital Ward Telemetry */}
          {isStaff && (
            <div className="space-y-4">
              <div className="text-center space-y-1.5 pb-3 border-b border-slate-100">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-teal-600 text-white font-bold text-lg flex items-center justify-center mx-auto shadow-sm">
                  <Building2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-sm">Safdarjung Operations</h3>
                  <p className="text-[10px] text-slate-400 font-mono">Hospital Ward Center</p>
                </div>
                <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px] font-bold">
                  Fleet &amp; Beds Live
                </Badge>
              </div>

              {/* Ward Occupancy */}
              <div className="space-y-2 text-xs">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Live Capacity</span>
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                  <div className="flex justify-between font-bold">
                    <span className="text-slate-600">ICU Beds Available</span>
                    <span className="text-emerald-700">8 / 24</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-1.5">
                    <div className="bg-emerald-500 h-1.5 rounded-full w-2/3" />
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                  <div className="flex justify-between font-bold">
                    <span className="text-slate-600">Active 108 Fleet</span>
                    <span className="text-blue-700">4 En-Route</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-1.5">
                    <div className="bg-blue-500 h-1.5 rounded-full w-4/5" />
                  </div>
                </div>
              </div>

              <div className="space-y-2 pt-3 border-t border-slate-100">
                <Link href="/facilities">
                  <Button className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl h-9 text-xs gap-1.5 shadow-sm">
                    <Bed className="w-3.5 h-3.5" />
                    Manage Beds &amp; Wards
                  </Button>
                </Link>
                <Link href="/ambulance">
                  <Button variant="outline" className="w-full font-bold rounded-xl h-9 text-xs border-slate-200 hover:bg-slate-50">
                    <Siren className="w-3.5 h-3.5 text-red-600 mr-1" />
                    Ambulance Dispatch
                  </Button>
                </Link>
              </div>
            </div>
          )}

          {/* C. PATIENT VIEW: Care Team & Prescription Refills */}
          {isPatient && (
            <div className="space-y-4">
              <div className="text-center space-y-1.5 pb-3 border-b border-slate-100">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 text-white font-bold text-lg flex items-center justify-center mx-auto shadow-sm">
                  <HeartPulse className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-sm">{currentUser?.name || "Citizen Patient"}</h3>
                  <p className="text-[10px] text-slate-400 font-mono">ABHA: 91-8472-1094-8841</p>
                </div>
                <Badge variant="outline" className="bg-teal-50 text-teal-700 border-teal-200 text-[10px] font-bold">
                  Verified Patient ID
                </Badge>
              </div>

              {/* Patient Care Support Info */}
              <div className="space-y-2 text-xs">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Assigned Doctor</span>
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 space-y-0.5">
                  <span className="font-bold text-slate-900 block">{activeThread.contactName}</span>
                  <span className="text-[11px] text-slate-500 block">{activeThread.facilityName || "AIIMS New Delhi"}</span>
                </div>

                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block pt-1">Prescription Slip</span>
                <div className="p-2.5 rounded-xl bg-teal-50/60 border border-teal-200/80 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-teal-900 text-[11px]">
                    <FileText className="w-3.5 h-3.5 text-teal-700" />
                    <span>RX-8842 Active</span>
                  </div>
                  <p className="text-[10px] text-teal-800">Aspirin 75mg, Atorvastatin 40mg</p>
                </div>
              </div>

              <div className="space-y-2 pt-3 border-t border-slate-100">
                <Link href="/chatbot">
                  <Button className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl h-9 text-xs gap-1.5 shadow-sm">
                    <Sparkles className="w-3.5 h-3.5" />
                    Book Doctor with AI Saathi
                  </Button>
                </Link>
                <Link href="/scheduling">
                  <Button variant="outline" className="w-full font-bold rounded-xl h-9 text-xs border-slate-200 hover:bg-slate-50">
                    <Calendar className="w-3.5 h-3.5 text-teal-600 mr-1" />
                    View Appointment Schedule
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
