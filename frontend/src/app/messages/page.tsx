"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import Link from "next/link";
import { Message, Patient, Urgency } from "@/lib/types";
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
} from "lucide-react";
import { UrgencyBadge } from "@/components/urgency-badge";

interface Thread {
  id: string;
  contactName: string;
  contactRole: "DOCTOR" | "PATIENT" | "STAFF";
  contactSpecialtyOrMrn?: string;
  patientId?: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  online: boolean;
}

export default function MessagesPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedThreadId, setSelectedThreadId] = useState<string>("thread-1");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRole, setFilterRole] = useState<string>("ALL");
  const [messageInput, setMessageInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Pre-seed realistic conversation threads
  const threads: Thread[] = useMemo(() => {
    return [
      {
        id: "thread-1",
        contactName: "Amit Sharma",
        contactRole: "PATIENT",
        contactSpecialtyOrMrn: "MRN-2025-0001",
        patientId: patients[0]?.id || "",
        lastMessage: "Doctor, I took the morning dosage of Atorvastatin. Feeling much better.",
        lastMessageTime: "10:45 AM",
        unreadCount: 0,
        online: true,
      },
      {
        id: "thread-2",
        contactName: "Dr. Priya Sharma",
        contactRole: "DOCTOR",
        contactSpecialtyOrMrn: "Chief Cardiologist (AIIMS)",
        patientId: patients[0]?.id || "",
        lastMessage: "Please review the post-op telemetry results for Ramesh Yadav in ICU.",
        lastMessageTime: "09:30 AM",
        unreadCount: 2,
        online: true,
      },
      {
        id: "thread-3",
        contactName: "Ramesh Yadav",
        contactRole: "PATIENT",
        contactSpecialtyOrMrn: "MRN-2025-0003",
        patientId: patients[2]?.id || "",
        lastMessage: "Ambulance transfer confirmed to AIIMS Emergency.",
        lastMessageTime: "Yesterday",
        unreadCount: 0,
        online: false,
      },
      {
        id: "thread-4",
        contactName: "Emergency Care Coordinator",
        contactRole: "STAFF",
        contactSpecialtyOrMrn: "Safdarjung Hospital Operations",
        lastMessage: "ICU Bed #4 allocated for incoming cardiology transfer.",
        lastMessageTime: "Yesterday",
        unreadCount: 0,
        online: true,
      },
      {
        id: "thread-5",
        contactName: "Priya Gupta",
        contactRole: "PATIENT",
        contactSpecialtyOrMrn: "MRN-2025-0002",
        patientId: patients[1]?.id || "",
        lastMessage: "Headache has subsided after the prescribed Paracetamol.",
        lastMessageTime: "2 days ago",
        unreadCount: 0,
        online: false,
      },
    ];
  }, [patients]);

  // Initial messages mock data
  const initialThreadMessages: Record<string, Message[]> = useMemo(() => ({
    "thread-1": [
      {
        id: "m-1",
        senderId: "pat-1",
        senderName: "Amit Sharma",
        senderRole: "PATIENT",
        recipientId: "doc-1",
        recipientName: "Dr. Priya Sharma",
        recipientRole: "DOCTOR",
        threadId: "thread-1",
        content: "Good morning Doctor. Should I continue taking Aspirin 75mg before breakfast or after?",
        read: true,
        createdAt: "2025-08-23T05:00:00Z",
      },
      {
        id: "m-2",
        senderId: "doc-1",
        senderName: "Dr. Priya Sharma",
        senderRole: "DOCTOR",
        recipientId: "pat-1",
        recipientName: "Amit Sharma",
        recipientRole: "PATIENT",
        threadId: "thread-1",
        content: "Good morning Amit. Always take Aspirin strictly after breakfast to prevent gastric irritation. I've attached your latest prescription slip below.",
        attachmentType: "PRESCRIPTION",
        attachmentData: JSON.stringify({ rxNumber: "RX-8842", drugs: "Aspirin 75mg, Atorvastatin 40mg, Metoprolol 50mg" }),
        read: true,
        createdAt: "2025-08-23T05:05:00Z",
      },
      {
        id: "m-3",
        senderId: "pat-1",
        senderName: "Amit Sharma",
        senderRole: "PATIENT",
        recipientId: "doc-1",
        recipientName: "Dr. Priya Sharma",
        recipientRole: "DOCTOR",
        threadId: "thread-1",
        content: "Doctor, I took the morning dosage of Atorvastatin. Feeling much better.",
        read: true,
        createdAt: "2025-08-23T05:15:00Z",
      },
    ],
    "thread-2": [
      {
        id: "m-4",
        senderId: "doc-1",
        senderName: "Dr. Priya Sharma",
        senderRole: "DOCTOR",
        recipientId: "doc-2",
        recipientName: "Dr. Rajesh Kumar",
        recipientRole: "DOCTOR",
        threadId: "thread-2",
        content: "Please review the post-op telemetry results for Ramesh Yadav in ICU.",
        attachmentType: "LAB_REPORT",
        attachmentData: JSON.stringify({ testName: "Cardiac Troponin I", result: "0.08 ng/mL", status: "Critical Alert" }),
        read: false,
        createdAt: "2025-08-23T04:00:00Z",
      },
    ],
  }), []);

  useEffect(() => {
    async function loadData() {
      try {
        const pRes = await fetch("http://localhost:5000/api/patients");
        if (pRes.ok) setPatients(await pRes.json());
      } catch (err) {
        console.error("Error loading messages initial data:", err);
      }
    }
    loadData();
  }, []);

  useEffect(() => {
    setMessages(initialThreadMessages[selectedThreadId] || []);
  }, [selectedThreadId, initialThreadMessages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const activeThread = threads.find((t) => t.id === selectedThreadId) || threads[0];
  const activePatient = patients.find((p) => p.name === activeThread.contactName) || patients[0];

  // Send Message Handler
  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!messageInput.trim()) return;

    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      senderId: "current-user",
      senderName: "Dr. Clinician",
      senderRole: "DOCTOR",
      recipientId: activeThread.id,
      recipientName: activeThread.contactName,
      recipientRole: activeThread.contactRole,
      threadId: selectedThreadId,
      content: messageInput.trim(),
      read: true,
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, newMsg]);
    setMessageInput("");
  };

  const filteredThreads = threads.filter((t) => {
    const matchesRole = filterRole === "ALL" || t.contactRole === filterRole;
    const matchesSearch =
      !searchQuery ||
      t.contactName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.contactSpecialtyOrMrn && t.contactSpecialtyOrMrn.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesRole && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-16 animate-in fade-in duration-300">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200/80 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-br from-teal-500 to-emerald-600 text-white rounded-2xl shadow-sm">
            <MessageSquare className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900">Clinical Messaging & Care Coordination</h1>
            <p className="text-xs text-slate-500 font-medium">
              Real-time encrypted consultation channels, prescription sharing, and patient inquiries.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 font-bold px-3 py-1 text-xs gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            EHR Live Sync Active
          </Badge>
        </div>
      </div>

      {/* 3-Column Messaging Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[720px]">
        {/* Column 1: Conversations List (3.5 cols) */}
        <div className="lg:col-span-4 bg-white rounded-3xl border border-slate-200/80 shadow-sm flex flex-col overflow-hidden">
          {/* Search & Tabs */}
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

            <div className="flex items-center gap-1 overflow-x-auto pb-1 text-[11px] font-bold">
              {["ALL", "PATIENT", "DOCTOR", "STAFF"].map((role) => (
                <button
                  key={role}
                  onClick={() => setFilterRole(role)}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    filterRole === role
                      ? "bg-slate-900 text-white shadow-sm"
                      : "text-slate-500 hover:bg-slate-100 hover:text-slate-800"
                  }`}
                >
                  {role === "ALL" ? "All" : role === "PATIENT" ? "Patients" : role === "DOCTOR" ? "Clinicians" : "Staff"}
                </button>
              ))}
            </div>
          </div>

          {/* Threads List */}
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
                  {/* Avatar */}
                  <div className="relative shrink-0">
                    <div
                      className={`w-11 h-11 rounded-2xl font-bold flex items-center justify-center text-sm ${
                        thread.contactRole === "DOCTOR"
                          ? "bg-purple-100 text-purple-800"
                          : thread.contactRole === "STAFF"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-teal-100 text-teal-800"
                      }`}
                    >
                      {thread.contactName.replace("Dr. ", "").charAt(0)}
                    </div>
                    {thread.online && (
                      <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white" />
                    )}
                  </div>

                  {/* Thread Summary */}
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
          </div>
        </div>

        {/* Column 2: Active Chat Workspace (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200/80 shadow-sm flex flex-col overflow-hidden">
          {/* Chat Header */}
          <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-teal-600 text-white font-bold flex items-center justify-center text-sm shadow-sm">
                {activeThread.contactName.replace("Dr. ", "").charAt(0)}
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 text-sm leading-tight">{activeThread.contactName}</h3>
                <p className="text-[11px] text-slate-500 font-medium flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  {activeThread.contactSpecialtyOrMrn || "Verified Patient Contact"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button size="icon" variant="ghost" className="h-9 w-9 text-slate-500 hover:text-slate-800 rounded-xl">
                <Phone className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Chat Message Stream */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/30">
            {messages.map((msg) => {
              const isOutgoing = msg.senderRole === "DOCTOR";

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
                      <p>{msg.content}</p>

                      {/* Clinical Attachment Preview */}
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
                            <span>Critical Diagnostic Alert</span>
                          </div>
                          <p className="text-[10px] font-bold text-rose-600">
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
              placeholder="Type clinical instructions or reply..."
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

        {/* Column 3: Patient Clinical Context Panel (3.5 cols) */}
        <div className="lg:col-span-3 bg-white rounded-3xl border border-slate-200/80 shadow-sm p-4 overflow-y-auto flex flex-col">
          <div className="space-y-4 flex-1">
            {/* Header / Profile */}
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
                Active Diagnoses ({activePatient?.conditions?.length || 2})
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
          </div>

          {/* Context Action Links */}
          <div className="space-y-2 pt-3 mt-3 border-t border-slate-100">
            <Link href={`/patients/${activePatient?.id || "p-1"}/encounter`}>
              <Button className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl h-9 text-xs gap-1.5 shadow-sm">
                <Stethoscope className="w-3.5 h-3.5" />
                Start Clinical Consultation
              </Button>
            </Link>

            <Link href={`/patients/${activePatient?.id || "p-1"}`}>
              <Button variant="outline" className="w-full font-bold rounded-xl h-9 text-xs border-slate-200 hover:bg-slate-50">
                Open Patient 360° Profile
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
