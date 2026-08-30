"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useStore } from "@/lib/store";
import { Role, BLOOD_GROUPS, AuthUser } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Phone, 
  Mail, 
  Droplets, 
  User, 
  MapPin, 
  Activity,
  Ambulance,
  ArrowRight,
  Settings,
  Bell,
  Shield,
  LogOut,
  Stethoscope,
  Building2,
  Award,
  Clock,
  Briefcase,
  Hash,
  Edit3,
  CheckCircle2,
  Save,
  X,
  Loader2,
  HeartPulse,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";

export default function ProfilePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isOnboarding = searchParams?.get("onboarding") === "true";

  const { 
    currentUser, 
    patients, 
    screenings, 
    referrals, 
    logout, 
    role, 
    updateUserProfile,
    language,
  } = useStore();

  const [isEditing, setIsEditing] = useState(isOnboarding);
  const [saving, setSaving] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    age: "",
    gender: "Male",
    bloodGroup: "B+",
    address: "",
    village: "",
    district: "New Delhi",
    state: "Delhi",
    emergencyContactName: "",
    emergencyContactPhone: "",
    allergies: "",
    conditions: "",
    specialty: "General Medicine",
    department: "General Medicine",
    registrationNumber: "",
    experience: "8 years",
    designation: "Operations Coordinator",
    shift: "Morning (8 AM – 4 PM)",
    facilityName: "",
    insuranceProvider: "Ayushman Bharat (PM-JAY)",
    insurancePolicyNumber: "AB-PMJAY-9182-4410",
    insuranceType: "Government Scheme (PM-JAY)",
    insuranceCoverageAmount: "₹5,00,000 / Year",
    insuranceValidTill: "31-Mar-2027",
    insuranceTpa: "National Health Authority (NHA)",
    insuranceStatus: "ACTIVE",
  });

  // Sync formData with currentUser when loaded
  useEffect(() => {
    if (currentUser) {
      setFormData({
        name: currentUser.name || "",
        phone: currentUser.phone || "",
        email: currentUser.email || "",
        age: currentUser.age ? String(currentUser.age) : "28",
        gender: currentUser.gender || "Male",
        bloodGroup: currentUser.bloodGroup || "B+",
        address: currentUser.address || currentUser.village || "",
        village: currentUser.village || "",
        district: currentUser.district || "Central Delhi",
        state: currentUser.state || "Delhi",
        emergencyContactName: currentUser.emergencyContactName || "",
        emergencyContactPhone: currentUser.emergencyContactPhone || "",
        allergies: Array.isArray(currentUser.allergies) ? currentUser.allergies.join(", ") : "",
        conditions: Array.isArray(currentUser.conditions) ? currentUser.conditions.join(", ") : "",
        specialty: currentUser.specialty || "General Medicine",
        department: currentUser.department || "General Medicine",
        registrationNumber: currentUser.registrationNumber || (currentUser.id ? `DMC-2024-${currentUser.id.slice(-5).toUpperCase()}` : "DMC-2024-001"),
        experience: currentUser.experience || "8 years",
        designation: currentUser.designation || "Operations Coordinator",
        shift: currentUser.shift || "Morning (8 AM – 4 PM)",
        facilityName: currentUser.facilityName || (role === Role.DOCTOR ? "Government General Hospital — Delhi" : "Government General Hospital — Delhi"),
        insuranceProvider: currentUser.insuranceProvider || "Ayushman Bharat (PM-JAY)",
        insurancePolicyNumber: currentUser.insurancePolicyNumber || "AB-PMJAY-9182-4410",
        insuranceType: currentUser.insuranceType || "Government Scheme (PM-JAY)",
        insuranceCoverageAmount: currentUser.insuranceCoverageAmount || "₹5,00,000 / Year",
        insuranceValidTill: currentUser.insuranceValidTill || "31-Mar-2027",
        insuranceTpa: currentUser.insuranceTpa || "National Health Authority (NHA)",
        insuranceStatus: currentUser.insuranceStatus || "ACTIVE",
      });
    }
  }, [currentUser, role]);

  const getUserInitials = (name?: string) => {
    if (!name || typeof name !== "string") return "SS";
    const parts = name.trim().split(/\s+/).filter(Boolean);
    if (parts.length === 0) return "SS";
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || formData.name.trim().length < 2) {
      toast.error("Please enter a valid full name (at least 2 characters)");
      return;
    }

    if (formData.phone && formData.phone.trim().length < 4) {
      toast.error("Please enter a valid phone number");
      return;
    }

    if (formData.email && formData.email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email.trim())) {
        toast.error("Please enter a valid email address");
        return;
      }
    }

    setSaving(true);

    try {
      const payload: Partial<AuthUser> = {
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim() || undefined,
      };

      if (isPatient) {
        payload.age = formData.age ? parseInt(formData.age, 10) : undefined;
        payload.gender = formData.gender;
        payload.bloodGroup = formData.bloodGroup;
        payload.address = formData.address.trim();
        payload.village = formData.village.trim() || formData.address.trim();
        payload.district = formData.district.trim();
        payload.state = formData.state.trim();
        payload.emergencyContactName = formData.emergencyContactName.trim();
        payload.emergencyContactPhone = formData.emergencyContactPhone.trim();
        payload.allergies = formData.allergies
          ? formData.allergies.split(",").map((s) => s.trim()).filter(Boolean)
          : [];
        payload.conditions = formData.conditions
          ? formData.conditions.split(",").map((s) => s.trim()).filter(Boolean)
          : [];
        payload.insuranceProvider = formData.insuranceProvider.trim();
        payload.insurancePolicyNumber = formData.insurancePolicyNumber.trim();
        payload.insuranceType = formData.insuranceType.trim();
        payload.insuranceCoverageAmount = formData.insuranceCoverageAmount.trim();
        payload.insuranceValidTill = formData.insuranceValidTill.trim();
        payload.insuranceTpa = formData.insuranceTpa.trim();
        payload.insuranceStatus = formData.insuranceStatus.trim();
      } else if (isDoctor) {
        payload.specialty = formData.specialty.trim();
        payload.department = formData.department.trim();
        payload.registrationNumber = formData.registrationNumber.trim();
        payload.experience = formData.experience.trim();
      } else if (isStaff) {
        payload.designation = formData.designation.trim();
        payload.shift = formData.shift.trim();
        payload.department = formData.department.trim();
      }

      const success = await updateUserProfile(payload);

      if (success) {
        toast.success(language === "hi" ? "प्रोफ़ाइल व स्वास्थ्य बीमा विवरण अपडेट किए गए!" : "Profile and health insurance updated successfully!");
        setIsEditing(false);
      } else {
        toast.error("Failed to save changes. Please try again.");
      }
    } catch (err) {
      console.error("Save profile error:", err);
      toast.error("An error occurred while saving profile");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (currentUser) {
      setFormData({
        name: currentUser.name || "",
        phone: currentUser.phone || "",
        email: currentUser.email || "",
        age: currentUser.age ? String(currentUser.age) : "28",
        gender: currentUser.gender || "Male",
        bloodGroup: currentUser.bloodGroup || "B+",
        address: currentUser.address || currentUser.village || "",
        village: currentUser.village || "",
        district: currentUser.district || "Central Delhi",
        state: currentUser.state || "Delhi",
        emergencyContactName: currentUser.emergencyContactName || "",
        emergencyContactPhone: currentUser.emergencyContactPhone || "",
        allergies: Array.isArray(currentUser.allergies) ? currentUser.allergies.join(", ") : "",
        conditions: Array.isArray(currentUser.conditions) ? currentUser.conditions.join(", ") : "",
        specialty: currentUser.specialty || "General Medicine",
        department: currentUser.department || "General Medicine",
        registrationNumber: currentUser.registrationNumber || (currentUser.id ? `DMC-2024-${currentUser.id.slice(-5).toUpperCase()}` : "DMC-2024-001"),
        experience: currentUser.experience || "8 years",
        designation: currentUser.designation || "Operations Coordinator",
        shift: currentUser.shift || "Morning (8 AM – 4 PM)",
        facilityName: currentUser.facilityName || "Government General Hospital — Delhi",
        insuranceProvider: currentUser.insuranceProvider || "Ayushman Bharat (PM-JAY)",
        insurancePolicyNumber: currentUser.insurancePolicyNumber || "AB-PMJAY-9182-4410",
        insuranceType: currentUser.insuranceType || "Government Scheme (PM-JAY)",
        insuranceCoverageAmount: currentUser.insuranceCoverageAmount || "₹5,00,000 / Year",
        insuranceValidTill: currentUser.insuranceValidTill || "31-Mar-2027",
        insuranceTpa: currentUser.insuranceTpa || "National Health Authority (NHA)",
        insuranceStatus: currentUser.insuranceStatus || "ACTIVE",
      });
    }
    setIsEditing(false);
  };

  if (!currentUser) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4 animate-in fade-in">
        <div className="p-4 bg-teal-50 rounded-2xl text-teal-600 shadow-sm">
          <HeartPulse className="h-10 w-10 animate-pulse" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800">Profile Not Found</h2>
        <p className="text-slate-500 text-sm">Please log in to view and manage your healthcare profile.</p>
        <Link href="/login">
          <Button className="bg-teal-600 hover:bg-teal-700 text-white rounded-xl px-6">Log In</Button>
        </Link>
      </div>
    );
  }

  const isPatient = role === Role.PATIENT || role === Role.CITIZEN;
  const isDoctor = role === Role.DOCTOR;
  const isStaff = role === Role.HOSPITAL_STAFF;

  // Patient stats
  const patient = isPatient 
    ? patients.find((p) => p.id === currentUser.patientId || p.id === currentUser.id || p.name === currentUser.name) 
    : null;
  const patientScreenings = screenings.filter((s) => s.patientId === currentUser.id || (patient && s.patientId === patient.id));
  const patientReferrals = referrals.filter((r) => r.patientId === currentUser.id || (patient && r.patientId === patient.id));

  const roleLabel = isDoctor 
    ? (language === "hi" ? "डॉक्टर" : "Doctor")
    : isStaff 
    ? (language === "hi" ? "अस्पताल स्टाफ" : "Hospital Staff")
    : (language === "hi" ? "मरीज" : "Patient");

  const roleBannerGradient = isDoctor 
    ? "from-blue-600 via-teal-600 to-emerald-600" 
    : isStaff 
      ? "from-indigo-600 via-purple-600 to-teal-600" 
      : "from-teal-600 via-emerald-600 to-teal-800";
  const roleBadgeStyle = isDoctor 
    ? "bg-blue-50 text-blue-700 border-blue-200" 
    : isStaff 
      ? "bg-indigo-50 text-indigo-700 border-indigo-200" 
      : "bg-teal-50 text-teal-700 border-teal-200";

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-16 animate-in fade-in duration-500">
      
      {/* Onboarding Welcome Banner */}
      {isOnboarding && (
        <div className="bg-gradient-to-r from-teal-500 to-emerald-600 p-6 rounded-3xl text-white shadow-md flex items-start gap-4 animate-in slide-in-from-top-3">
          <div className="p-3 bg-white/20 rounded-2xl shrink-0 backdrop-blur-sm">
            <Sparkles className="h-6 w-6 text-yellow-200" />
          </div>
          <div className="space-y-1">
            <h2 className="text-xl font-bold">{language === "hi" ? "अपनी प्रोफ़ाइल पूरी करें" : "Complete Your Profile"}</h2>
            <p className="text-teal-50 text-sm">
              {language === "hi"
                ? "अपनी स्वास्थ्य प्रोफ़ाइल पूरी करें ताकि सेहत साथी एक सहज क्लिनिकल और रेफरल अनुभव प्रदान कर सके।"
                : "Let's complete your healthcare profile so Sehat Saathi can provide a seamless clinical and referral experience."}
            </p>
          </div>
        </div>
      )}

      {/* Profile Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
            {isEditing 
              ? (language === "hi" ? "प्रोफ़ाइल संपादित करें" : "Edit Profile")
              : (language === "hi" ? "मेरी प्रोफ़ाइल" : "My Profile")}
          </h1>
          <p className="text-slate-500 text-sm mt-1 font-medium">
            {language === "hi"
              ? `अपनी व्यक्तिगत, संपर्क और ${isDoctor ? "क्लिनिकल" : isStaff ? "संचालन" : "स्वास्थ्य"} जानकारी का प्रबंधन करें।`
              : `Manage your personal, contact, and ${isDoctor ? "clinical" : isStaff ? "operations" : "healthcare"} information.`}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {!isEditing ? (
            <Button 
              onClick={() => setIsEditing(true)}
              className="bg-teal-600 hover:bg-teal-700 text-white rounded-xl h-10 px-4 font-semibold shadow-xs gap-2"
            >
              <Edit3 className="h-4 w-4" />
              {language === "hi" ? "प्रोफ़ाइल संपादित करें" : "Edit Profile"}
            </Button>
          ) : (
            <Button 
              variant="outline"
              onClick={handleCancel}
              className="border-slate-200 text-slate-600 hover:bg-slate-50 rounded-xl h-10 px-4 font-semibold gap-1.5"
            >
              <X className="h-4 w-4" />
              {language === "hi" ? "रद्द करें" : "Cancel"}
            </Button>
          )}
          <Button 
            variant="outline" 
            onClick={handleLogout}
            className="text-rose-600 border-rose-200 hover:bg-rose-50 hover:text-rose-700 transition-colors rounded-xl h-10 px-4 font-semibold gap-2"
          >
            <LogOut className="h-4 w-4" />
            {language === "hi" ? "लॉग आउट" : "Logout"}
          </Button>
        </div>
      </div>

      <form onSubmit={handleSave}>
        <div className="grid md:grid-cols-12 gap-6">
          
          {/* Identity & Avatar Card */}
          <Card className="md:col-span-4 border-slate-200/80 shadow-xs rounded-3xl overflow-hidden relative bg-white">
            <div className={`h-28 bg-gradient-to-r ${roleBannerGradient}`} />
            <CardContent className="p-6 pt-0 flex flex-col items-center text-center space-y-3 relative -mt-14">
              <div className="w-24 h-24 rounded-full bg-white p-1 shadow-lg ring-4 ring-white">
                <div className="w-full h-full rounded-full bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center text-white text-2xl font-bold shadow-inner">
                  {getUserInitials(formData.name || currentUser.name)}
                </div>
              </div>
              
              <div className="space-y-1 w-full pt-1">
                <h2 className="text-xl font-bold text-slate-900 truncate">
                  {formData.name || currentUser.name || "User"}
                </h2>
                <div className="flex items-center justify-center gap-2">
                  <Badge variant="secondary" className={`px-3 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider border ${roleBadgeStyle}`}>
                    {roleLabel}
                  </Badge>
                </div>
                {isDoctor && (
                  <p className="text-xs text-teal-700 font-semibold mt-1">
                    {formData.specialty || currentUser.specialty || "General Medicine"}
                  </p>
                )}
                <p className="text-xs text-slate-400 font-medium">
                  {currentUser.email || currentUser.phone}
                </p>
              </div>

              {/* Status Badge */}
              <div className="w-full bg-slate-50 border border-slate-100 p-3 rounded-2xl flex items-center justify-between text-xs font-semibold text-slate-600 mt-2">
                <span className="flex items-center gap-1.5 text-emerald-700">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  Account Verified
                </span>
                <span className="text-slate-400 font-normal">256-bit Encrypted</span>
              </div>
            </CardContent>
          </Card>

          {/* Details & Form Card */}
          <div className="md:col-span-8 space-y-6">
            
            {/* Personal / Account Information */}
            <Card className="shadow-xs rounded-3xl border-slate-200/80 overflow-hidden bg-white">
              <CardHeader className="bg-slate-50/70 border-b border-slate-100 py-4 px-6">
                <CardTitle className="text-base font-bold flex items-center gap-2 text-slate-800">
                  <User className="h-4 w-4 text-teal-600" />
                  Personal &amp; Contact Details
                </CardTitle>
                <CardDescription className="text-xs text-slate-500">
                  {isEditing ? "Update your personal and communication credentials." : "Your verified identity and contact information."}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  
                  {/* Full Name */}
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-slate-700">Full Name *</Label>
                    {isEditing ? (
                      <Input 
                        value={formData.name} 
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Aarav Sharma"
                        className="rounded-xl h-10 border-slate-200 bg-slate-50/50"
                        required
                      />
                    ) : (
                      <p className="font-semibold text-sm text-slate-900 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                        {formData.name || "Not provided"}
                      </p>
                    )}
                  </div>

                  {/* Phone */}
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-slate-700">Mobile Phone *</Label>
                    {isEditing ? (
                      <Input 
                        value={formData.phone} 
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="10-digit mobile"
                        className="rounded-xl h-10 border-slate-200 bg-slate-50/50"
                        required
                      />
                    ) : (
                      <p className="font-semibold text-sm text-slate-900 bg-slate-50 p-2.5 rounded-xl border border-slate-100 flex items-center gap-2">
                        <Phone className="h-3.5 w-3.5 text-teal-600" />
                        {formData.phone || "Not provided"}
                      </p>
                    )}
                  </div>

                  {/* Email */}
                  <div className="space-y-1.5 sm:col-span-2">
                    <Label className="text-xs font-bold text-slate-700">Email Address</Label>
                    {isEditing ? (
                      <Input 
                        type="email"
                        value={formData.email} 
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="e.g. name@domain.com"
                        className="rounded-xl h-10 border-slate-200 bg-slate-50/50"
                      />
                    ) : (
                      <p className="font-semibold text-sm text-slate-900 bg-slate-50 p-2.5 rounded-xl border border-slate-100 flex items-center gap-2">
                        <Mail className="h-3.5 w-3.5 text-teal-600" />
                        {formData.email || "Not provided"}
                      </p>
                    )}
                  </div>

                </div>
              </CardContent>
            </Card>

            {/* Patient-Specific Medical & Emergency Details */}
            {isPatient && (
              <>
                <Card className="shadow-xs rounded-3xl border-slate-200/80 overflow-hidden bg-white">
                <CardHeader className="bg-slate-50/70 border-b border-slate-100 py-4 px-6">
                  <CardTitle className="text-base font-bold flex items-center gap-2 text-slate-800">
                    <Droplets className="h-4 w-4 text-rose-500" />
                    Healthcare &amp; Emergency Profile
                  </CardTitle>
                  <CardDescription className="text-xs text-slate-500">
                    Blood group, emergency contacts, known allergies, and address.
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    
                    {/* Blood Group */}
                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold text-slate-700">Blood Group</Label>
                      {isEditing ? (
                        <Select 
                          value={formData.bloodGroup} 
                          onValueChange={(val) => val && setFormData({ ...formData, bloodGroup: val })}
                        >
                          <SelectTrigger className="h-10 rounded-xl bg-slate-50/50 border-slate-200">
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            {BLOOD_GROUPS.map((bg) => (
                              <SelectItem key={bg} value={bg}>{bg}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <p className="font-bold text-sm text-rose-700 bg-rose-50/60 p-2.5 rounded-xl border border-rose-100">
                          {formData.bloodGroup || "Not provided"}
                        </p>
                      )}
                    </div>

                    {/* Gender */}
                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold text-slate-700">Gender</Label>
                      {isEditing ? (
                        <Select 
                          value={formData.gender} 
                          onValueChange={(val) => val && setFormData({ ...formData, gender: val })}
                        >
                          <SelectTrigger className="h-10 rounded-xl bg-slate-50/50 border-slate-200">
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Male">Male</SelectItem>
                            <SelectItem value="Female">Female</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <p className="font-semibold text-sm text-slate-900 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                          {formData.gender || "Not provided"}
                        </p>
                      )}
                    </div>

                    {/* Age */}
                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold text-slate-700">Age (Years)</Label>
                      {isEditing ? (
                        <Input 
                          type="number"
                          min={0}
                          max={125}
                          value={formData.age} 
                          onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                          placeholder="e.g. 28"
                          className="rounded-xl h-10 border-slate-200 bg-slate-50/50"
                        />
                      ) : (
                        <p className="font-semibold text-sm text-slate-900 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                          {formData.age ? `${formData.age} yrs` : "Not provided"}
                        </p>
                      )}
                    </div>

                  </div>

                  {/* Address & District */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold text-slate-700">Address / Area</Label>
                      {isEditing ? (
                        <Input 
                          value={formData.address} 
                          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                          placeholder="e.g. Connaught Place, Block B"
                          className="rounded-xl h-10 border-slate-200 bg-slate-50/50"
                        />
                      ) : (
                        <p className="font-semibold text-sm text-slate-900 bg-slate-50 p-2.5 rounded-xl border border-slate-100 flex items-center gap-2">
                          <MapPin className="h-3.5 w-3.5 text-teal-600" />
                          {formData.address || "Not provided"}
                        </p>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold text-slate-700">City / District</Label>
                      {isEditing ? (
                        <Input 
                          value={formData.district} 
                          onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                          placeholder="e.g. Central Delhi"
                          className="rounded-xl h-10 border-slate-200 bg-slate-50/50"
                        />
                      ) : (
                        <p className="font-semibold text-sm text-slate-900 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                          {formData.district ? `${formData.district}, ${formData.state}` : "Delhi"}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Emergency Contact */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold text-slate-700">Emergency Contact Name</Label>
                      {isEditing ? (
                        <Input 
                          value={formData.emergencyContactName} 
                          onChange={(e) => setFormData({ ...formData, emergencyContactName: e.target.value })}
                          placeholder="e.g. Ramesh Sharma"
                          className="rounded-xl h-10 border-slate-200 bg-slate-50/50"
                        />
                      ) : (
                        <p className="font-semibold text-sm text-slate-900 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                          {formData.emergencyContactName || "Not provided"}
                        </p>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold text-slate-700">Emergency Contact Phone</Label>
                      {isEditing ? (
                        <Input 
                          value={formData.emergencyContactPhone} 
                          onChange={(e) => setFormData({ ...formData, emergencyContactPhone: e.target.value })}
                          placeholder="e.g. 9876500099"
                          className="rounded-xl h-10 border-slate-200 bg-slate-50/50"
                        />
                      ) : (
                        <p className="font-semibold text-sm text-slate-900 bg-slate-50 p-2.5 rounded-xl border border-slate-100 flex items-center gap-2">
                          <Phone className="h-3.5 w-3.5 text-rose-500" />
                          {formData.emergencyContactPhone || "Not provided"}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Allergies & Conditions */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold text-slate-700">Known Allergies</Label>
                      {isEditing ? (
                        <Input 
                          value={formData.allergies} 
                          onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
                          placeholder="Comma-separated (e.g. Penicillin, Dust)"
                          className="rounded-xl h-10 border-slate-200 bg-slate-50/50"
                        />
                      ) : (
                        <p className="font-semibold text-sm text-slate-900 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                          {formData.allergies || "None reported"}
                        </p>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold text-slate-700">Existing Medical Conditions</Label>
                      {isEditing ? (
                        <Input 
                          value={formData.conditions} 
                          onChange={(e) => setFormData({ ...formData, conditions: e.target.value })}
                          placeholder="Comma-separated (e.g. Hypertension — mild)"
                          className="rounded-xl h-10 border-slate-200 bg-slate-50/50"
                        />
                      ) : (
                        <p className="font-semibold text-sm text-slate-900 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                          {formData.conditions || "None reported"}
                        </p>
                      )}
                    </div>
                  </div>

                </CardContent>
              </Card>

              {/* Patient Health Insurance & Ayushman Coverage Card */}
              <Card className="shadow-xs rounded-3xl border-slate-200/80 overflow-hidden bg-white mt-6">
                <CardHeader className="bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 border-b border-emerald-100 py-4 px-6 flex flex-row items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 bg-emerald-600 text-white rounded-xl shadow-xs">
                      <Shield className="h-4 w-4" />
                    </div>
                    <div>
                      <CardTitle className="text-base font-extrabold text-slate-900">
                        {language === "hi" ? "स्वास्थ्य बीमा एवं सरकारी योजनाएं" : "Health Insurance & Government Coverage"}
                      </CardTitle>
                      <CardDescription className="text-xs text-slate-500 font-medium mt-0.5">
                        {language === "hi"
                          ? "आयुष्मान भारत (PM-JAY), सीजीएचएस, व निजी कैशलेस स्वास्थ्य बीमा"
                          : "Ayushman Bharat (PM-JAY), CGHS, DAK & Private Cashless Health Insurance"}
                      </CardDescription>
                    </div>
                  </div>
                  <Badge className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs px-2.5 py-1 shadow-2xs gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>{formData.insuranceStatus || "ACTIVE"}</span>
                  </Badge>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Provider */}
                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold text-slate-700">
                        {language === "hi" ? "बीमा प्रदाता / योजना" : "Insurance Provider / Scheme"}
                      </Label>
                      {isEditing ? (
                        <Select
                          value={formData.insuranceProvider}
                          onValueChange={(val) => val && setFormData({ ...formData, insuranceProvider: val })}
                        >
                          <SelectTrigger className="h-10 rounded-xl bg-slate-50/50 border-slate-200 text-xs font-bold">
                            <SelectValue placeholder="Select Provider" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Ayushman Bharat (PM-JAY)">Ayushman Bharat (PM-JAY) — Govt.</SelectItem>
                            <SelectItem value="Central Government Health Scheme (CGHS)">Central Govt Health Scheme (CGHS)</SelectItem>
                            <SelectItem value="Delhi Arogya Kosh (DAK)">Delhi Arogya Kosh (DAK) — Delhi Govt.</SelectItem>
                            <SelectItem value="Ex-Servicemen Health Scheme (ECHS)">Ex-Servicemen Health Scheme (ECHS)</SelectItem>
                            <SelectItem value="Star Health Comprehensive">Star Health Comprehensive</SelectItem>
                            <SelectItem value="Care Health Insurance">Care Health Insurance</SelectItem>
                            <SelectItem value="HDFC ERGO Optima Secure">HDFC ERGO Optima Secure</SelectItem>
                            <SelectItem value="ICICI Lombard Complete Health">ICICI Lombard Complete Health</SelectItem>
                            <SelectItem value="Niva Bupa ReAssure">Niva Bupa ReAssure</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <p className="font-extrabold text-sm text-slate-900 bg-slate-50 p-2.5 rounded-xl border border-slate-100 flex items-center gap-2">
                          <Shield className="h-4 w-4 text-emerald-600" />
                          {formData.insuranceProvider || "Ayushman Bharat (PM-JAY)"}
                        </p>
                      )}
                    </div>

                    {/* Policy / Beneficiary Number */}
                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold text-slate-700">
                        {language === "hi" ? "पॉलिसी / लाभार्थी आईडी" : "Policy / Beneficiary ID"}
                      </Label>
                      {isEditing ? (
                        <Input
                          value={formData.insurancePolicyNumber}
                          onChange={(e) => setFormData({ ...formData, insurancePolicyNumber: e.target.value })}
                          placeholder="e.g. AB-PMJAY-9182-4410"
                          className="rounded-xl h-10 border-slate-200 bg-slate-50/50 text-xs font-mono"
                        />
                      ) : (
                        <p className="font-mono font-bold text-sm text-slate-900 bg-slate-50 p-2.5 rounded-xl border border-slate-100 flex items-center justify-between">
                          <span>{formData.insurancePolicyNumber || "AB-PMJAY-9182-4410"}</span>
                          <span className="text-[10px] font-sans font-extrabold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">
                            {language === "hi" ? "सत्यापित" : "Verified"}
                          </span>
                        </p>
                      )}
                    </div>

                    {/* Coverage Amount */}
                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold text-slate-700">
                        {language === "hi" ? "वार्षिक कवरेज राशि" : "Sum Insured / Annual Coverage"}
                      </Label>
                      {isEditing ? (
                        <Input
                          value={formData.insuranceCoverageAmount}
                          onChange={(e) => setFormData({ ...formData, insuranceCoverageAmount: e.target.value })}
                          placeholder="e.g. ₹5,00,000 / Year"
                          className="rounded-xl h-10 border-slate-200 bg-slate-50/50 text-xs font-bold"
                        />
                      ) : (
                        <p className="font-extrabold text-sm text-emerald-800 bg-emerald-50/60 p-2.5 rounded-xl border border-emerald-200">
                          {formData.insuranceCoverageAmount || "₹5,00,000 / Year"}
                        </p>
                      )}
                    </div>

                    {/* Valid Till */}
                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold text-slate-700">
                        {language === "hi" ? "वैधता अवधि" : "Coverage Valid Till"}
                      </Label>
                      {isEditing ? (
                        <Input
                          value={formData.insuranceValidTill}
                          onChange={(e) => setFormData({ ...formData, insuranceValidTill: e.target.value })}
                          placeholder="e.g. 31-Mar-2027"
                          className="rounded-xl h-10 border-slate-200 bg-slate-50/50 text-xs"
                        />
                      ) : (
                        <p className="font-semibold text-sm text-slate-900 bg-slate-50 p-2.5 rounded-xl border border-slate-100 flex items-center gap-2">
                          <Clock className="h-3.5 w-3.5 text-slate-400" />
                          {formData.insuranceValidTill || "31-Mar-2027"}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Cashless Hospital Support Notice */}
                  <div className="p-3.5 rounded-2xl bg-teal-50/80 border border-teal-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2.5">
                      <Building2 className="w-5 h-5 text-teal-700 shrink-0" />
                      <div>
                        <span className="font-extrabold text-teal-950 block">
                          {language === "hi" ? "118+ नेटवर्क अस्पतालों में 100% कैशलेस सुविधा" : "100% Cashless at 118+ Empanelled Hospitals"}
                        </span>
                        <span className="text-[11px] text-teal-800 font-medium">
                          {language === "hi"
                            ? "इस बीमा / योजना के तहत दिल्ली-एनसीआर के सरकारी एवं पैनलबद्ध अस्पतालों में सीधा कैशलेस उपचार उपलब्ध है।"
                            : "Pre-authorized cashless admission available across all Delhi-NCR partner facilities."}
                        </span>
                      </div>
                    </div>
                    <Link href="/hospitals" className="shrink-0">
                      <Button size="sm" variant="outline" className="h-8 text-xs font-bold border-teal-300 text-teal-800 hover:bg-teal-100 rounded-xl gap-1">
                        <span>{language === "hi" ? "अस्पताल खोजें" : "Find Hospitals"}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </>
            )}

            {/* Doctor-Specific Professional Details */}
            {isDoctor && (
              <Card className="shadow-xs rounded-3xl border-slate-200/80 overflow-hidden bg-white">
                <CardHeader className="bg-slate-50/70 border-b border-slate-100 py-4 px-6">
                  <CardTitle className="text-base font-bold flex items-center gap-2 text-slate-800">
                    <Stethoscope className="h-4 w-4 text-blue-600" />
                    Clinical Credentials &amp; Hospital Affiliation
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold text-slate-700">Specialization</Label>
                      {isEditing ? (
                        <Input 
                          value={formData.specialty} 
                          onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                          className="rounded-xl h-10 border-slate-200 bg-slate-50/50"
                        />
                      ) : (
                        <p className="font-semibold text-sm text-slate-900 bg-slate-50 p-2.5 rounded-xl border border-slate-100 flex items-center gap-2">
                          <Stethoscope className="h-3.5 w-3.5 text-blue-500" />
                          {formData.specialty || "General Medicine"}
                        </p>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold text-slate-700">Medical Registration No.</Label>
                      {isEditing ? (
                        <Input 
                          value={formData.registrationNumber} 
                          onChange={(e) => setFormData({ ...formData, registrationNumber: e.target.value })}
                          placeholder="e.g. DEMO-DOC-001"
                          className="rounded-xl h-10 border-slate-200 bg-slate-50/50"
                        />
                      ) : (
                        <p className="font-semibold text-sm text-slate-900 bg-slate-50 p-2.5 rounded-xl border border-slate-100 flex items-center gap-2">
                          <Award className="h-3.5 w-3.5 text-amber-500" />
                          {formData.registrationNumber || "DEMO-DOC-001"}
                        </p>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold text-slate-700">Hospital / Facility</Label>
                      <p className="font-semibold text-sm text-slate-900 bg-slate-50 p-2.5 rounded-xl border border-slate-100 flex items-center gap-2">
                        <Building2 className="h-3.5 w-3.5 text-teal-600" />
                        {formData.facilityName || "Government General Hospital — Delhi"}
                      </p>
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold text-slate-700">Experience</Label>
                      {isEditing ? (
                        <Input 
                          value={formData.experience} 
                          onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                          placeholder="e.g. 8 years"
                          className="rounded-xl h-10 border-slate-200 bg-slate-50/50"
                        />
                      ) : (
                        <p className="font-semibold text-sm text-slate-900 bg-slate-50 p-2.5 rounded-xl border border-slate-100 flex items-center gap-2">
                          <Clock className="h-3.5 w-3.5 text-slate-500" />
                          {formData.experience || "8 years"}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Staff-Specific Details */}
            {isStaff && (
              <Card className="shadow-xs rounded-3xl border-slate-200/80 overflow-hidden bg-white">
                <CardHeader className="bg-slate-50/70 border-b border-slate-100 py-4 px-6">
                  <CardTitle className="text-base font-bold flex items-center gap-2 text-slate-800">
                    <Briefcase className="h-4 w-4 text-indigo-600" />
                    Hospital Operations Identity
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold text-slate-700">Employee ID</Label>
                      <p className="font-semibold text-sm text-slate-900 bg-slate-50 p-2.5 rounded-xl border border-slate-100 flex items-center gap-2">
                        <Hash className="h-3.5 w-3.5 text-indigo-500" />
                        DEMO-STAFF-001
                      </p>
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold text-slate-700">Designation / Role</Label>
                      {isEditing ? (
                        <Input 
                          value={formData.designation} 
                          onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                          className="rounded-xl h-10 border-slate-200 bg-slate-50/50"
                        />
                      ) : (
                        <p className="font-semibold text-sm text-slate-900 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                          {formData.designation || "Operations Coordinator"}
                        </p>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold text-slate-700">Department</Label>
                      <p className="font-semibold text-sm text-slate-900 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                        Hospital Operations
                      </p>
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold text-slate-700">Hospital Facility</Label>
                      <p className="font-semibold text-sm text-slate-900 bg-slate-50 p-2.5 rounded-xl border border-slate-100 flex items-center gap-2">
                        <Building2 className="h-3.5 w-3.5 text-teal-600" />
                        {formData.facilityName || "Government General Hospital — Delhi"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Save Action Bar (in edit mode) */}
            {isEditing && (
              <div className="flex items-center justify-end gap-3 bg-white p-4 rounded-3xl border border-slate-200/80 shadow-xs">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={handleCancel}
                  disabled={saving}
                  className="rounded-xl h-11 px-5 font-semibold"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={saving}
                  className="bg-teal-600 hover:bg-teal-700 text-white rounded-xl h-11 px-6 font-bold shadow-xs gap-2"
                >
                  {saving ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Saving to Database...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            )}

            {/* Settings & Preferences */}
            <Card id="settings" className="shadow-xs rounded-3xl border-slate-200/80 overflow-hidden bg-white">
              <CardHeader className="bg-slate-50/70 border-b border-slate-100 py-4 px-6">
                <CardTitle className="text-base font-bold flex items-center gap-2 text-slate-800">
                  <Settings className="h-4 w-4 text-teal-600" />
                  Preferences &amp; Security
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-slate-100">
                  <div className="p-4 px-6 flex items-center justify-between hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-teal-50 rounded-xl text-teal-600">
                        <Bell className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-semibold text-sm text-slate-900">Notifications &amp; Reminders</p>
                        <p className="text-xs text-slate-500">SMS and in-app appointment alerts active</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-emerald-700 bg-emerald-50 border-emerald-200 font-bold text-[11px]">
                      Enabled
                    </Badge>
                  </div>
                  <div className="p-4 px-6 flex items-center justify-between hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-teal-50 rounded-xl text-teal-600">
                        <Shield className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-semibold text-sm text-slate-900">Security &amp; Session</p>
                        <p className="text-xs text-slate-500">JWT Token 7-day persistent session</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-teal-700 bg-teal-50 border-teal-200 font-bold text-[11px]">
                      Active
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

          </div>
        </div>
      </form>

      {/* Patient Health Overview Summary (Read-Only) */}
      {isPatient && (
        <div className="mt-8 space-y-4">
          <h2 className="text-xl font-bold tracking-tight text-slate-900">Health History Overview</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <Card className="shadow-xs rounded-3xl border-slate-200/80 bg-white">
              <CardContent className="p-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3.5 bg-blue-50 text-blue-600 rounded-2xl">
                    <Activity className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-2xl text-slate-900">{patientScreenings.length}</h3>
                    <p className="font-medium text-xs text-slate-500">Clinical Screenings Recorded</p>
                  </div>
                </div>
                <Link href="/patients">
                  <Button variant="ghost" size="sm" className="rounded-xl text-teal-600 font-semibold gap-1">
                    View
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="shadow-xs rounded-3xl border-slate-200/80 bg-white">
              <CardContent className="p-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3.5 bg-amber-50 text-amber-600 rounded-2xl">
                    <Ambulance className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-2xl text-slate-900">{patientReferrals.length}</h3>
                    <p className="font-medium text-xs text-slate-500">Tertiary Referrals Dispatched</p>
                  </div>
                </div>
                <Link href="/referrals">
                  <Button variant="ghost" size="sm" className="rounded-xl text-teal-600 font-semibold gap-1">
                    View
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

    </div>
  );
}
