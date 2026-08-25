"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { Role } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Phone, 
  Mail, 
  Droplets, 
  User, 
  Calendar, 
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
} from "lucide-react";

export default function ProfilePage() {
  const router = useRouter();
  const { currentUser, patients, screenings, referrals, logout, role, token, login } = useStore();

  useEffect(() => {
    const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
    const activeToken = token || (typeof window !== "undefined" ? localStorage.getItem("sehat-saathi-token") : null);
    if (activeToken) {
      fetch(`${API}/api/auth/me`, {
        headers: { Authorization: `Bearer ${activeToken}` },
      })
        .then((r) => (r.ok ? r.json() : null))
        .then((data) => {
          if (data && data.name) {
            login({
              id: data.id,
              name: data.name,
              role: data.role,
              phone: data.phone,
              email: data.email || `${data.phone}@sehatsaathi.in`,
              patientId: data.patientId,
              doctorId: data.doctorId,
              staffId: data.staffId,
              facilityId: data.facilityId,
              specialty: data.doctor?.specialty,
            }, activeToken);
          }
        })
        .catch(() => {});
    }
  }, [token, login]);

  if (!currentUser) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <h2 className="text-2xl font-bold">Profile Not Found</h2>
        <p className="text-muted-foreground">Please log in to view your profile.</p>
        <Link href="/login">
          <Button>Log In</Button>
        </Link>
      </div>
    );
  }

  const initials = currentUser.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const isPatient = role === Role.PATIENT || role === Role.CITIZEN;
  const isDoctor = role === Role.DOCTOR;
  const isStaff = role === Role.HOSPITAL_STAFF;

  // Patient-specific data
  const patient = isPatient ? patients.find((p) => p.id === currentUser.id || p.name === currentUser.name) : null;
  const patientScreenings = screenings.filter((s) => s.patientId === currentUser.id || (patient && s.patientId === patient.id));
  const patientReferrals = referrals.filter((r) => r.patientId === currentUser.id || (patient && r.patientId === patient.id));

  const roleLabel = isDoctor ? "Doctor" : isStaff ? "Hospital Staff" : "Patient";
  const roleColor = isDoctor ? "blue" : isStaff ? "indigo" : "teal";

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">My Profile</h1>
        <Button 
          variant="outline" 
          onClick={handleLogout}
          className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 transition-colors rounded-xl h-10 px-4"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </Button>
      </div>

      <div className="grid md:grid-cols-12 gap-6">
        {/* Section 1: User Avatar Section */}
        <Card className="md:col-span-4 border-none shadow-lg rounded-2xl overflow-hidden relative">
          <div className={`absolute top-0 left-0 right-0 h-32 bg-gradient-to-br ${
            isDoctor ? "from-blue-400 to-indigo-600" : isStaff ? "from-indigo-400 to-purple-600" : "from-teal-400 to-emerald-600"
          }`} />
          <CardContent className="p-8 flex flex-col items-center text-center space-y-4 relative mt-12">
            <div className="w-32 h-32 rounded-full bg-white p-1.5 shadow-xl">
              <div className={`w-full h-full rounded-full bg-slate-100 flex items-center justify-center text-${roleColor}-600 text-4xl font-bold border border-slate-200`}>
                {initials}
              </div>
            </div>
            <div className="pt-2">
              <h2 className="text-2xl font-bold text-slate-900">{currentUser.name}</h2>
              <div className="flex items-center justify-center gap-2 mt-2">
                <Badge variant="secondary" className={`bg-${roleColor}-50 text-${roleColor}-700 hover:bg-${roleColor}-100 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider border border-${roleColor}-200`}>
                  {roleLabel}
                </Badge>
              </div>
              {isDoctor && currentUser.specialty && (
                <p className="text-sm text-blue-600 mt-2 font-medium">{currentUser.specialty}</p>
              )}
              <p className="text-sm text-slate-500 mt-2 font-medium">Member since 2024</p>
            </div>
          </CardContent>
        </Card>

        {/* Section 2: Role-Specific Info */}
        <div className="md:col-span-8 space-y-6">
          {/* Contact & Identity */}
          <Card className="shadow-md rounded-2xl border-slate-200/60 overflow-hidden">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4">
              <CardTitle className="text-lg flex items-center gap-2 text-slate-800">
                <User className="h-5 w-5 text-teal-600" />
                {isDoctor ? "Doctor Details" : isStaff ? "Staff Details" : "Personal Details"}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Common fields */}
                <div className="space-y-1">
                  <p className="text-xs text-slate-500 uppercase font-semibold flex items-center gap-1.5">
                    <Phone className="h-3.5 w-3.5 text-teal-500" /> Phone
                  </p>
                  <p className="font-medium text-slate-900">{currentUser.phone || 'Not provided'}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-slate-500 uppercase font-semibold flex items-center gap-1.5">
                    <Mail className="h-3.5 w-3.5 text-teal-500" /> Email
                  </p>
                  <p className="font-medium text-slate-900 truncate">{currentUser.email || 'Not provided'}</p>
                </div>

                {/* Patient-specific fields */}
                {isPatient && (
                  <>
                    <div className="space-y-1">
                      <p className="text-xs text-slate-500 uppercase font-semibold flex items-center gap-1.5">
                        <Droplets className="h-3.5 w-3.5 text-rose-500" /> Blood Group
                      </p>
                      <p className="font-medium text-slate-900">{patient?.bloodGroup || 'Unknown'}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-slate-500 uppercase font-semibold flex items-center gap-1.5">
                        <User className="h-3.5 w-3.5 text-teal-500" /> Gender
                      </p>
                      <p className="font-medium text-slate-900 capitalize">{patient?.gender || 'Unknown'}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-slate-500 uppercase font-semibold flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5 text-teal-500" /> Age
                      </p>
                      <p className="font-medium text-slate-900">{patient ? `${patient.age} years` : 'Unknown'}</p>
                    </div>
                    <div className="space-y-1 sm:col-span-2 lg:col-span-3 pt-2 border-t border-slate-100">
                      <p className="text-xs text-slate-500 uppercase font-semibold flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5 text-teal-500" /> Address
                      </p>
                      <p className="font-medium text-slate-900">
                        {patient ? `${patient.village}, ${patient.district}, ${patient.state}` : 'Unknown'}
                      </p>
                    </div>
                  </>
                )}

                {/* Doctor-specific fields */}
                {isDoctor && (
                  <>
                    <div className="space-y-1">
                      <p className="text-xs text-slate-500 uppercase font-semibold flex items-center gap-1.5">
                        <Stethoscope className="h-3.5 w-3.5 text-blue-500" /> Specialty
                      </p>
                      <p className="font-medium text-slate-900">{currentUser.specialty || 'General Medicine'}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-slate-500 uppercase font-semibold flex items-center gap-1.5">
                        <Award className="h-3.5 w-3.5 text-amber-500" /> Registration No.
                      </p>
                      <p className="font-medium text-slate-900">DMC-2024-{currentUser.id.slice(-5).toUpperCase()}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-slate-500 uppercase font-semibold flex items-center gap-1.5">
                        <Briefcase className="h-3.5 w-3.5 text-indigo-500" /> Department
                      </p>
                      <p className="font-medium text-slate-900">{currentUser.specialty || 'General Medicine'}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-slate-500 uppercase font-semibold flex items-center gap-1.5">
                        <Building2 className="h-3.5 w-3.5 text-teal-500" /> Hospital
                      </p>
                      <p className="font-medium text-slate-900">{currentUser.facilityName || 'AIIMS, New Delhi'}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-slate-500 uppercase font-semibold flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5 text-slate-500" /> Experience
                      </p>
                      <p className="font-medium text-slate-900">8+ years</p>
                    </div>
                  </>
                )}

                {/* Staff-specific fields */}
                {isStaff && (
                  <>
                    <div className="space-y-1">
                      <p className="text-xs text-slate-500 uppercase font-semibold flex items-center gap-1.5">
                        <Hash className="h-3.5 w-3.5 text-indigo-500" /> Staff ID
                      </p>
                      <p className="font-medium text-slate-900">STF-{currentUser.id.slice(-5).toUpperCase()}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-slate-500 uppercase font-semibold flex items-center gap-1.5">
                        <Building2 className="h-3.5 w-3.5 text-teal-500" /> Facility
                      </p>
                      <p className="font-medium text-slate-900">{currentUser.facilityName || 'Safdarjung Hospital'}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-slate-500 uppercase font-semibold flex items-center gap-1.5">
                        <Briefcase className="h-3.5 w-3.5 text-indigo-500" /> Designation
                      </p>
                      <p className="font-medium text-slate-900">Operations Coordinator</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-slate-500 uppercase font-semibold flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5 text-slate-500" /> Shift
                      </p>
                      <p className="font-medium text-slate-900">Morning (8 AM – 4 PM)</p>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
          
          {/* Settings Section */}
          <Card className="shadow-md rounded-2xl border-slate-200/60 overflow-hidden">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4">
              <CardTitle className="text-lg flex items-center gap-2 text-slate-800">
                <Settings className="h-5 w-5 text-teal-600" />
                Preferences & Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-slate-100">
                <div className="p-4 px-6 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-teal-100/50 rounded-lg text-teal-600">
                      <Bell className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">Notifications</p>
                      <p className="text-xs text-slate-500">Manage SMS and Email alerts</p>
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-slate-400" />
                </div>
                <div className="p-4 px-6 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-teal-100/50 rounded-lg text-teal-600">
                      <Shield className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">Privacy & Security</p>
                      <p className="text-xs text-slate-500">Update password and security pins</p>
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-slate-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Health Overview — Patient Only */}
      {isPatient && (
        <div className="mt-10">
          <h2 className="text-2xl font-bold tracking-tight mb-6 text-slate-900">Health Overview</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="shadow-md rounded-2xl border-slate-200/60 hover:shadow-lg transition-shadow">
              <CardContent className="p-6 flex items-center justify-between">
                <div className="flex items-center gap-5">
                  <div className="p-4 bg-blue-50 rounded-2xl">
                    <Activity className="h-8 w-8 text-blue-500" />
                  </div>
                  <div>
                    <h3 className="font-bold text-3xl text-slate-900">{patientScreenings.length}</h3>
                    <p className="font-medium text-slate-500">Health Screenings</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="shadow-md rounded-2xl border-slate-200/60 hover:shadow-lg transition-shadow">
              <CardContent className="p-6 flex items-center justify-between">
                <div className="flex items-center gap-5">
                  <div className="p-4 bg-amber-50 rounded-2xl">
                    <Ambulance className="h-8 w-8 text-amber-500" />
                  </div>
                  <div>
                    <h3 className="font-bold text-3xl text-slate-900">{patientReferrals.length}</h3>
                    <p className="font-medium text-slate-500">Clinical Referrals</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
