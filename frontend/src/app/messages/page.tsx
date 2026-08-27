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
  contactId?: string;
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

  const [allMessages, setAllMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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

  // Fetch messages from API
  useEffect(() => {
    async function loadMessages() {
      if (!currentUser?.id) return;
      try {
        setIsLoading(true);
        const { apiGet } = await import("@/lib/api");
        const data = await apiGet<Message[]>(`/api/messages?userId=${currentUser.id}`);
        setAllMessages(data);
      } catch (err) {
        console.error("Failed to load messages:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadMessages();
  }, [currentUser?.id]);

  const isDoctor = role === Role.DOCTOR;
  const isStaff = role === Role.HOSPITAL_STAFF;
  const isPatient = !isDoctor && !isStaff;

  const currentRoleThreads: Thread[] = useMemo(() => {
    if (!currentUser?.id) return [];
    
    const threadMap = new Map<string, Thread>();
    const sortedMessages = [...allMessages].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

    for (const msg of sortedMessages) {
      const isOutgoing = msg.senderId === currentUser.id;
      const contactId = isOutgoing ? msg.recipientId : msg.senderId;
      const contactName = isOutgoing ? msg.recipientName : msg.senderName;
      const contactRole = isOutgoing ? msg.recipientRole : msg.senderRole;
      
      let category = "PATIENTS";
      if (isDoctor) {
        if (contactRole === "DOCTOR") category = "COLLEAGUES";
        else if (contactRole === "STAFF") category = "STAFF";
        else if (contactRole === "AMBULANCE") category = "AMBULANCE";
        else category = "PATIENTS";
      } else if (isStaff) {
        if (contactRole === "PATIENT") category = "PATIENTS";
        else if (contactRole === "STAFF") category = "STAFF";
        else if (contactRole === "AMBULANCE") category = "AMBULANCE";
        else category = "HELPDESK";
      } else {
        if (contactRole === "DOCTOR") category = "DOCTORS";
        else if (contactRole === "STAFF") category = "HELPDESK";
        else if (contactRole === "AMBULANCE") category = "AMBULANCE";
        else category = "DOCTORS";
      }

      let avatarBg = "bg-teal-100 text-teal-800";
      if (contactRole === "AMBULANCE") avatarBg = "bg-rose-100 text-rose-800";
      else if (contactRole === "DOCTOR") avatarBg = "bg-purple-100 text-purple-800";
      else if (contactRole === "STAFF") avatarBg = "bg-blue-100 text-blue-800";
      
      const unreadCount = !isOutgoing && !msg.read ? 1 : 0;
      
      let lastMessageTimeStr = "Just now";
      if (msg.createdAt) {
          const date = new Date(msg.createdAt);
          lastMessageTimeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      }

      if (threadMap.has(msg.threadId)) {
        const existing = threadMap.get(msg.threadId)!;
        existing.lastMessage = msg.content;
        existing.lastMessageTime = lastMessageTimeStr;
        existing.unreadCount = !isOutgoing && !msg.read ? existing.unreadCount + 1 : existing.unreadCount;
      } else {
        threadMap.set(msg.threadId, {
          id: msg.threadId,
          contactId: contactId,
          contactName: contactName,
          contactRole: contactRole as Thread["contactRole"],
          lastMessage: msg.content,
          lastMessageTime: lastMessageTimeStr,
          unreadCount: unreadCount,
          online: true,
          category: category as Thread["category"],
          avatarBg: avatarBg,
        });
      }
    }
    
    // Sort threads by most recent message (reverse chronological)
    return Array.from(threadMap.values()).sort((a, b) => b.lastMessageTime.localeCompare(a.lastMessageTime));
  }, [allMessages, currentUser?.id, isDoctor, isStaff]);

  // Set default selected thread
  useEffect(() => {
    if (currentRoleThreads.length > 0 && !selectedThreadId) {
      setSelectedThreadId(currentRoleThreads[0].id);
    }
  }, [currentRoleThreads, selectedThreadId]);

  // Sync active message stream
  useEffect(() => {
    if (selectedThreadId) {
      setMessages(allMessages.filter(m => m.threadId === selectedThreadId));
    } else {
      setMessages([]);
    }
  }, [selectedThreadId, allMessages]);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const activeThread = currentRoleThreads.find((t) => t.id === selectedThreadId) || currentRoleThreads[0] || {
    id: "empty",
    contactId: "empty",
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
  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!messageInput.trim() || !currentUser) return;

    const payload = {
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderRole: role,
      recipientId: activeThread.contactId || "unknown",
      recipientName: activeThread.contactName,
      recipientRole: activeThread.contactRole,
      threadId: selectedThreadId,
      content: messageInput.trim(),
    };

    try {
      const { apiPost } = await import("@/lib/api");
      const newMsg = await apiPost<Message>("/api/messages", payload);
      setAllMessages((prev) => [...prev, newMsg]);
      setMessageInput("");
    } catch (err) {
      console.error("Failed to send message:", err);
    }
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

            {isLoading ? (
              <div className="p-8 text-center text-xs text-slate-400 animate-pulse">
                Loading conversations...
              </div>
            ) : filteredThreads.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400">
                No active conversations found matching your filter.
              </div>
            ) : null}
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
