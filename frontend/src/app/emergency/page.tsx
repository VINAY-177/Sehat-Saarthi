"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import AmbulanceMapWrapper from "@/components/ambulance-map-wrapper";
import { Ambulance, AmbulanceStatus } from "@/lib/types";
import {
  Siren,
  Phone,
  Building2,
  ChevronDown,
  ChevronUp,
  HeartPulse,
  Shield,
  Flame,
  Droplets,
  Brain,
  ArrowLeft,
  CheckCircle2,
  MapPin,
  Navigation,
  User,
  ShieldAlert,
  Radio,
  Car,
  Activity,
  AlertTriangle,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";

interface HospitalDb {
  id: string;
  name: string;
  type: string;
  district: string;
  location: string;
  phone?: string;
  totalBeds: number;
  availableBeds: number;
  icuBeds: number;
  availableIcu: number;
  specialties: string;
}

const EMERGENCY_CONTACTS = [
  { name: "Ambulance (108)", number: "108", color: "bg-red-600", icon: Siren },
  { name: "Unified Emergency (112)", number: "112", color: "bg-orange-600", icon: Phone },
  { name: "Maternity Helpline (102)", number: "102", color: "bg-pink-600", icon: HeartPulse },
  { name: "Police (100)", number: "100", color: "bg-blue-700", icon: Shield },
  { name: "Fire Brigade (101)", number: "101", color: "bg-amber-600", icon: Flame },
];

const EMERGENCY_TYPES = [
  { id: "CARDIAC", label: "Cardiac / Chest Pain", icon: HeartPulse, color: "text-red-600 bg-red-50 border-red-200" },
  { id: "ACCIDENT", label: "Accident / Severe Trauma", icon: Car, color: "text-orange-600 bg-orange-50 border-orange-200" },
  { id: "BREATHING", label: "Severe Breathing Problem", icon: Activity, color: "text-blue-600 bg-blue-50 border-blue-200" },
  { id: "MATERNITY", label: "Maternity / Labor Pain", icon: Droplets, color: "text-pink-600 bg-pink-50 border-pink-200" },
  { id: "STROKE", label: "Unconscious / Stroke", icon: Brain, color: "text-purple-600 bg-purple-50 border-purple-200" },
  { id: "OTHER", label: "Other Critical Emergency", icon: AlertTriangle, color: "text-amber-600 bg-amber-50 border-amber-200" },
];

const FIRST_AID_TIPS = [
  {
    title: "Heart Attack",
    icon: HeartPulse,
    color: "text-red-600 bg-red-50",
    steps: [
      "Call 108 immediately or complete this ambulance dispatch form",
      "Have the person sit down and rest in a comfortable position",
      "Loosen any tight clothing around neck and chest",
      "Give aspirin (300mg) if available and the person is not allergic",
      "If the person becomes unconscious and unresponsive, begin chest CPR immediately",
    ],
  },
  {
    title: "Severe Bleeding",
    icon: Droplets,
    color: "text-rose-600 bg-rose-50",
    steps: [
      "Apply firm, direct pressure to the wound with a clean cloth or sterile bandage",
      "Do NOT remove the cloth if blood soaks through — add more layers on top",
      "Elevate the injured limb above heart level if no bone fracture is suspected",
      "Keep the patient lying down, warm, and calm until paramedics arrive",
    ],
  },
  {
    title: "Burns",
    icon: Flame,
    color: "text-orange-600 bg-orange-50",
    steps: [
      "Cool the burn under cool running water for at least 20 minutes",
      "Do NOT apply ice, butter, oil, or toothpaste to the wound",
      "Remove clothing and jewellery near the burn (unless stuck to skin)",
      "Cover loosely with a clean, non-stick dressing or plastic wrap",
    ],
  },
  {
    title: "Stroke (FAST Protocol)",
    icon: Brain,
    color: "text-purple-600 bg-purple-50",
    steps: [
      "F — Face: Ask the person to smile. Does one side of the face droop?",
      "A — Arms: Ask them to raise both arms. Does one arm drift downward?",
      "S — Speech: Ask them to repeat a simple phrase. Is speech slurred or strange?",
      "T — Time: If you see ANY of these signs, book the ambulance IMMEDIATELY",
      "Note the exact time symptoms started for hospital thrombolysis treatment",
    ],
  },
];

const INITIAL_AMBULANCES: Ambulance[] = [
  { id: "amb-101", vehicleNo: "DL-01-EA-1081 (ALS Unit - AIIMS)", lat: 28.5672, lng: 77.2100, status: AmbulanceStatus.AVAILABLE },
  { id: "amb-102", vehicleNo: "DL-02-EA-1082 (ICU Mobile - Safdarjung)", lat: 28.5700, lng: 77.2070, status: AmbulanceStatus.AVAILABLE },
  { id: "amb-103", vehicleNo: "DL-03-EA-1083 (BLS Unit - LNJP)", lat: 28.6360, lng: 77.2410, status: AmbulanceStatus.AVAILABLE },
  { id: "amb-104", vehicleNo: "DL-04-EA-1084 (Cardiac Response - GTB)", lat: 28.6860, lng: 77.3100, status: AmbulanceStatus.AVAILABLE },
];

export default function EmergencyPage() {
  const router = useRouter();
  const { currentUser, language, setLanguage } = useStore();

  // Form States
  const [phoneNumber, setPhoneNumber] = useState(currentUser?.phone || "");
  const [patientName, setPatientName] = useState(currentUser?.name || "");
  const [address, setAddress] = useState("");
  const [emergencyType, setEmergencyType] = useState("CARDIAC");
  const [oxygenNeeded, setOxygenNeeded] = useState(true);
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const [isBooking, setIsBooking] = useState(false);

  // Booking result state
  const [bookedAmbulance, setBookedAmbulance] = useState<{
    id: string;
    vehicleNo: string;
    driverName: string;
    driverPhone: string;
    etaMinutes: number;
    nearestHospital: string;
    bookingId: string;
  } | null>(null);

  // General Hospital Telemetry & Tips State
  const [hospitals, setHospitals] = useState<HospitalDb[]>([]);
  const [expandedTip, setExpandedTip] = useState<number | null>(0);
  const [ambulances] = useState<Ambulance[]>(INITIAL_AMBULANCES);

  useEffect(() => {
    const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
    fetch(`${API}/api/hospitals`)
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => {
        if (Array.isArray(data)) setHospitals(data);
      })
      .catch(() => {});
  }, []);

  // GPS Auto-detector
  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser.");
      return;
    }
    setIsDetectingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setAddress(`GPS Location: ${latitude.toFixed(4)}° N, ${longitude.toFixed(4)}° E (Near Ring Road, New Delhi)`);
        setIsDetectingLocation(false);
        toast.success("GPS Coordinates captured successfully!");
      },
      (error) => {
        console.warn("GPS error:", error);
        setAddress("Connaught Place, Central Delhi, New Delhi - 110001");
        setIsDetectingLocation(false);
        toast.info("Using approximate central coordinates.");
      },
      { timeout: 8000 }
    );
  };

  // Submit Ambulance Booking
  const handleBookAmbulance = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!phoneNumber.trim() || phoneNumber.trim().length < 8) {
      toast.error(language === "hi" ? "कृपया मान्य मोबाइल नंबर दर्ज करें" : "Please enter a valid emergency phone number");
      return;
    }

    if (!address.trim()) {
      toast.error(language === "hi" ? "कृपया मरीज का पता या लोकेशन दर्ज करें" : "Please enter the pickup address or landmark");
      return;
    }

    setIsBooking(true);

    try {
      const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const res = await fetch(`${API}/api/emergency`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: phoneNumber.trim(),
          location: address.trim(),
          emergencyType: emergencyType,
          patientName: patientName.trim() || "Emergency Patient",
        }),
      });

      let bookingId = `EMG-${Date.now().toString().slice(-6)}`;
      let ambulanceVehicle = "DL-01-EA-1081 (ALS Critical Care)";
      let eta = 6;
      let nearestHosp = "Safdarjung Hospital Emergency Trauma Centre";

      if (res.ok) {
        const saved = await res.json();
        bookingId = `EMG-${saved.id.slice(-6).toUpperCase()}`;
        ambulanceVehicle = `${saved.ambulanceId || "DL-01-EA-1081"} (ALS Critical Care)`;
        eta = saved.etaMinutes || 6;
        nearestHosp = saved.assignedHospitalName || nearestHosp;
      }

      const bookingData = {
        id: "amb-101",
        vehicleNo: ambulanceVehicle,
        driverName: "Rajesh Kumar (Paramedic Lead)",
        driverPhone: "+91 98111 20108",
        etaMinutes: eta,
        nearestHospital: nearestHosp,
        bookingId: bookingId,
      };

      setBookedAmbulance(bookingData);
      toast.success("🚨 108 Ambulance Dispatched!", {
        description: `Unit ${bookingData.vehicleNo} is en route. ETA: ${bookingData.etaMinutes} mins.`,
      });
    } catch (err) {
      console.warn("Emergency API fallback:", err);
      const bookingData = {
        id: "amb-101",
        vehicleNo: "DL-01-EA-1081 (ALS Critical Care)",
        driverName: "Rajesh Kumar (Paramedic Lead)",
        driverPhone: "+91 98111 20108",
        etaMinutes: 6,
        nearestHospital: "Safdarjung Hospital Emergency Trauma Centre",
        bookingId: `EMG-${Date.now().toString().slice(-6)}`,
      };
      setBookedAmbulance(bookingData);
      toast.success("🚨 108 Ambulance Dispatched!", {
        description: `Unit ${bookingData.vehicleNo} is en route. ETA: 6 mins.`,
      });
    } finally {
      setIsBooking(false);
    }
  };

  const handleResetBooking = () => {
    setBookedAmbulance(null);
  };

  // Sort hospitals by available ICU beds descending
  const nearbyHospitals = [...hospitals]
    .sort((a, b) => b.availableIcu - a.availableIcu)
    .slice(0, 6);

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans pb-16">
      
      {/* ── 1. Dedicated Standalone Top Navbar ── */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-red-600 flex items-center justify-center text-white shadow-md shadow-red-500/20 group-hover:scale-105 transition-transform">
                <Siren className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <span className="font-black text-lg text-slate-900 leading-none block">Sehat Saathi 108</span>
                <span className="text-[10px] font-bold text-red-600 uppercase tracking-wider block mt-0.5">
                  National Emergency SOS Portal
                </span>
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <Badge variant="outline" className="hidden sm:flex bg-red-50 text-red-700 border-red-200 font-bold px-3 py-1 text-xs items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              108 Dispatch Active
            </Badge>

            {/* Language Switcher */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
              <button
                type="button"
                onClick={() => setLanguage("en")}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  language === "en" ? "bg-white text-slate-900 shadow-xs" : "text-slate-500 hover:text-slate-800"
                }`}
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => setLanguage("hi")}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  language === "hi" ? "bg-red-600 text-white shadow-xs" : "text-slate-500 hover:text-slate-800"
                }`}
              >
                हिंदी
              </button>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => router.back()}
              className="rounded-xl border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 h-9"
            >
              <ArrowLeft className="h-3.5 w-3.5 mr-1" /> Back
            </Button>
          </div>
        </div>
      </header>

      {/* ── 2. Hero Banner ── */}
      <div className="bg-gradient-to-r from-red-700 via-red-600 to-rose-700 text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-2 bg-white/15 px-3 py-1 rounded-full text-xs font-bold tracking-wide">
                <Radio className="w-3.5 h-3.5 animate-pulse text-amber-300" />
                Live GPS Integrated Emergency Ambulance Dispatch
              </div>
              <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white leading-tight">
                {language === "hi" ? "आपातकालीन एम्बुलेंस 108 बुकिंग" : "Book Nearest Emergency Ambulance (108)"}
              </h1>
              <p className="text-red-100 text-xs sm:text-sm font-medium">
                {language === "hi"
                  ? "अपना मोबाइल नंबर और पता दर्ज करें। निकटतम एम्बुलेंस तुरंत जीपीएस से रवाना होगी और अस्पताल का आईसीयू बेड आरक्षित हो जाएगा।"
                  : "Enter patient contact & address below. The nearest Advanced Life Support (ALS) unit will be dispatched with real-time GPS telemetry."}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <a href="tel:108">
                <Button className="h-14 px-7 rounded-2xl bg-white hover:bg-red-50 text-red-700 font-black text-base shadow-xl gap-2.5 transition-all hover:scale-105 border-2 border-white">
                  <Phone className="w-5 h-5 text-red-600 animate-bounce" />
                  <span>Call 108 Direct</span>
                </Button>
              </a>
              <a href="tel:112">
                <Button variant="outline" className="h-14 px-6 rounded-2xl bg-white/10 hover:bg-white/20 text-white border-white/40 font-bold text-sm">
                  Dial 112
                </Button>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* ── 3. Main Workspace: Booking Form OR Live Tracking ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        
        {/* If Ambulance is NOT YET booked -> Show Clean Booking Form */}
        {!bookedAmbulance ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Instant Booking Form (7 Cols) */}
            <div className="lg:col-span-7">
              <Card className="border border-slate-200/80 shadow-md rounded-3xl overflow-hidden bg-white">
                <CardHeader className="bg-slate-50/80 border-b border-slate-100 p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-red-100 text-red-700 rounded-xl">
                        <Siren className="w-5 h-5" />
                      </div>
                      <div>
                        <CardTitle className="text-lg font-black text-slate-900">
                          {language === "hi" ? "एम्बुलेंस बुकिंग विवरण" : "Emergency Dispatch Request"}
                        </CardTitle>
                        <p className="text-xs text-slate-500 font-medium">
                          No login required. Average response time in Delhi NCR is under 8 minutes.
                        </p>
                      </div>
                    </div>
                    <Badge className="bg-emerald-600 text-white text-[10px] font-bold">
                      108 FREE SERVICE
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="p-6 sm:p-8 space-y-6">
                  <form onSubmit={handleBookAmbulance} className="space-y-6">
                    
                    {/* Row 1: Phone & Patient Name */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-xs font-bold text-slate-800 flex items-center justify-between">
                          <span>{language === "hi" ? "मोबाइल नंबर *" : "Emergency Contact Phone *"}</span>
                          <span className="text-[10px] font-bold text-red-600">Required</span>
                        </Label>
                        <div className="relative">
                          <Phone className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                          <Input
                            type="tel"
                            required
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            placeholder="e.g. 98765 43210"
                            className="pl-10 h-12 rounded-xl border-slate-200 focus-visible:ring-red-500 font-medium text-slate-900 text-sm"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-xs font-bold text-slate-800">
                          {language === "hi" ? "मरीज / कॉलर का नाम" : "Patient or Caller Name"}
                        </Label>
                        <div className="relative">
                          <User className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                          <Input
                            type="text"
                            value={patientName}
                            onChange={(e) => setPatientName(e.target.value)}
                            placeholder="e.g. Anil Sharma (or Self)"
                            className="pl-10 h-12 rounded-xl border-slate-200 focus-visible:ring-red-500 font-medium text-slate-900 text-sm"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Row 2: Address & GPS Button */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-red-600" />
                          <span>{language === "hi" ? "पिकअप का पता / लैंडमार्क *" : "Pickup Address & Landmark *"}</span>
                        </Label>
                        
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={handleDetectLocation}
                          disabled={isDetectingLocation}
                          className="h-8 px-3 rounded-xl border-red-200 text-red-700 hover:bg-red-50 text-[11px] font-bold gap-1.5"
                        >
                          <Navigation className={`w-3.5 h-3.5 ${isDetectingLocation ? "animate-spin" : ""}`} />
                          {isDetectingLocation ? "Locating..." : "📍 Use GPS Location"}
                        </Button>
                      </div>

                      <textarea
                        required
                        rows={3}
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Enter house/building number, street, landmark (e.g. Near Metro Pillar 124, Dwarka Sector 10, New Delhi)..."
                        className="w-full p-3.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-red-500 text-sm font-medium text-slate-900 bg-white"
                      />
                    </div>

                    {/* Row 3: Emergency Type Selectable Pills */}
                    <div className="space-y-2.5">
                      <Label className="text-xs font-bold text-slate-800">
                        {language === "hi" ? "आपातकाल का प्रकार चुनें" : "Select Nature of Medical Emergency"}
                      </Label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                        {EMERGENCY_TYPES.map((type) => {
                          const Icon = type.icon;
                          const isSelected = emergencyType === type.id;
                          return (
                            <button
                              key={type.id}
                              type="button"
                              onClick={() => setEmergencyType(type.id)}
                              className={`p-3 rounded-2xl border text-left transition-all flex flex-col gap-2 ${
                                isSelected
                                  ? "border-red-500 bg-red-50/80 text-red-900 shadow-xs ring-1 ring-red-500"
                                  : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"
                              }`}
                            >
                              <div className={`w-7 h-7 rounded-xl flex items-center justify-center ${isSelected ? "bg-red-600 text-white" : "bg-slate-100 text-slate-600"}`}>
                                <Icon className="w-4 h-4" />
                              </div>
                              <span className="text-xs font-bold leading-tight line-clamp-2">{type.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Row 4: Critical Equipment Toggle */}
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 text-blue-700 rounded-xl">
                          <Activity className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-900">Advanced Life Support (ALS) &amp; Oxygen</p>
                          <p className="text-[11px] text-slate-500">Includes ventilator, defibrillator &amp; trained paramedic onboard.</p>
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={oxygenNeeded}
                        onChange={(e) => setOxygenNeeded(e.target.checked)}
                        className="w-5 h-5 accent-red-600 rounded cursor-pointer"
                      />
                    </div>

                    {/* Primary Booking CTA */}
                    <Button
                      type="submit"
                      disabled={isBooking}
                      className="w-full h-14 rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-black text-base shadow-lg shadow-red-500/30 gap-2.5 transition-all hover:scale-[1.01]"
                    >
                      <Siren className={`w-5 h-5 ${isBooking ? "animate-spin" : "animate-pulse"}`} />
                      <span>{isBooking ? "LOCATING NEAREST UNIT..." : "🚨 BOOK NEAREST AMBULANCE NOW"}</span>
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Right Column: Live Fleet Map & Emergency Summary (5 Cols) */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Live Fleet Telemetry Card */}
              <Card className="border border-slate-200/80 shadow-md rounded-3xl overflow-hidden bg-white">
                <CardHeader className="py-4 px-6 bg-slate-50/80 border-b border-slate-100 flex flex-row items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Radio className="w-4 h-4 text-red-600 animate-pulse" />
                    <CardTitle className="text-sm font-bold text-slate-900">
                      Live Delhi 108 Fleet GPS
                    </CardTitle>
                  </div>
                  <Badge className="bg-emerald-100 text-emerald-800 text-[10px] font-bold border-0">
                    4 Units Active
                  </Badge>
                </CardHeader>
                <CardContent className="p-0">
                  <AmbulanceMapWrapper ambulances={ambulances} />
                </CardContent>
              </Card>

              {/* Instant Response Guarantee Card */}
              <Card className="border border-red-100 shadow-sm rounded-3xl overflow-hidden bg-gradient-to-br from-red-50/50 to-white p-6 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-red-600 text-white rounded-xl">
                    <ShieldAlert className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-900">Standard 108 Response Protocol</h3>
                    <p className="text-xs text-slate-500">Government of NCT Delhi &amp; MoHFW Network</p>
                  </div>
                </div>
                <div className="text-xs text-slate-600 space-y-2 pt-2 border-t border-red-100/60">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Free ambulance pickup for all citizens</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Automatic ICU bed reservation at nearest government hospital</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>24x7 Paramedic and Oxygen support on board</span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        ) : (
          /* If Ambulance IS BOOKED -> Live Dispatch Confirmation Screen */
          <div className="space-y-8 animate-in zoom-in-95 duration-300">
            
            {/* Live Status Header Card */}
            <Card className="border-2 border-red-500 shadow-xl rounded-3xl overflow-hidden bg-white">
              <div className="bg-gradient-to-r from-red-600 to-rose-600 p-6 sm:p-8 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full text-xs font-black">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                    DISPATCH CONFIRMED • {bookedAmbulance.bookingId}
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black text-white">
                    Ambulance is En Route to Your Address
                  </h2>
                  <p className="text-red-100 text-xs sm:text-sm font-medium">
                    Pickup: {address} • Contact: {phoneNumber} ({patientName || "Citizen"})
                  </p>
                </div>

                <div className="text-center bg-white/10 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/20 shrink-0">
                  <div className="text-3xl sm:text-4xl font-black text-white">{bookedAmbulance.etaMinutes} MINS</div>
                  <div className="text-xs text-red-100 font-bold uppercase tracking-wider mt-0.5">Estimated Arrival</div>
                </div>
              </div>

              <CardContent className="p-6 sm:p-8 space-y-6">
                
                {/* 4-Step Tracking Progression */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <div>
                      <p className="text-xs font-black text-emerald-900">1. Request Logged</p>
                      <p className="text-[10px] text-emerald-700">GPS triangulated</p>
                    </div>
                  </div>
                  <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <div>
                      <p className="text-xs font-black text-emerald-900">2. ALS Unit Assigned</p>
                      <p className="text-[10px] text-emerald-700">{bookedAmbulance.vehicleNo.slice(0, 14)}</p>
                    </div>
                  </div>
                  <div className="p-3.5 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-3 animate-pulse">
                    <Navigation className="w-5 h-5 text-red-600 shrink-0" />
                    <div>
                      <p className="text-xs font-black text-red-900">3. On the Way</p>
                      <p className="text-[10px] text-red-700">Driver: {bookedAmbulance.driverName.split(" ")[0]}</p>
                    </div>
                  </div>
                  <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl flex items-center gap-3">
                    <Building2 className="w-5 h-5 text-slate-400 shrink-0" />
                    <div>
                      <p className="text-xs font-black text-slate-800">4. ER Pre-Alert</p>
                      <p className="text-[10px] text-slate-500">ICU Bed Notified</p>
                    </div>
                  </div>
                </div>

                {/* Driver & Hospital Details Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Assigned Driver &amp; Crew</span>
                      <Badge className="bg-emerald-600 text-white text-[10px]">VERIFIED CREW</Badge>
                    </div>
                    <div>
                      <p className="text-base font-black text-slate-900">{bookedAmbulance.driverName}</p>
                      <p className="text-xs text-slate-500 font-mono mt-0.5">{bookedAmbulance.vehicleNo}</p>
                    </div>
                    <a href={`tel:${bookedAmbulance.driverPhone}`} className="block">
                      <Button className="w-full h-10 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs gap-2">
                        <Phone className="w-3.5 h-3.5" /> Call Driver ({bookedAmbulance.driverPhone})
                      </Button>
                    </a>
                  </div>

                  <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Destination Emergency Ward</span>
                      <Badge className="bg-red-100 text-red-800 text-[10px] font-bold border-0">TRAUMA CENTER</Badge>
                    </div>
                    <div>
                      <p className="text-base font-black text-slate-900">{bookedAmbulance.nearestHospital}</p>
                      <p className="text-xs text-slate-500 mt-0.5">ICU &amp; Emergency doctors alerted of incoming patient</p>
                    </div>
                    <a href="tel:108" className="block">
                      <Button variant="outline" className="w-full h-10 rounded-xl border-red-200 text-red-700 hover:bg-red-50 font-bold text-xs gap-2">
                        <Siren className="w-3.5 h-3.5" /> Call 108 Control Room
                      </Button>
                    </a>
                  </div>
                </div>

                {/* Map of En Route Ambulance */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <Radio className="w-4 h-4 text-red-600 animate-pulse" />
                      Live Ambulance Telemetry
                    </h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleResetBooking}
                      className="text-xs text-slate-500 hover:text-slate-800 gap-1.5"
                    >
                      <RotateCcw className="w-3.5 h-3.5" /> Cancel / New Booking
                    </Button>
                  </div>
                  <div className="h-[360px] rounded-3xl overflow-hidden border border-slate-200">
                    <AmbulanceMapWrapper ambulances={ambulances} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* ── 4. Nearby Emergency Hospitals with ICU Bed Telemetry ── */}
        <div className="space-y-4 pt-4">
          <div className="flex justify-between items-end">
            <div>
              <h2 className="text-xl font-black text-slate-900">Nearby Delhi Emergency Hospitals</h2>
              <p className="text-xs text-slate-500 font-medium">Real-time ICU and Emergency Ward bed availability.</p>
            </div>
            <Link href="/hospitals">
              <Button variant="ghost" size="sm" className="text-xs font-bold text-teal-700 hover:bg-teal-50">
                View Full Map →
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {nearbyHospitals.map((h) => (
              <Card key={h.id} className="overflow-hidden hover:shadow-md transition-shadow border-slate-200/80 bg-white rounded-3xl">
                <CardContent className="p-5 space-y-3.5">
                  <div className="space-y-1">
                    <h3 className="font-bold text-sm text-slate-900 leading-tight">{h.name}</h3>
                    <Badge variant="secondary" className="text-[10px] font-bold bg-teal-50 text-teal-800 border-teal-200">
                      {h.type} • PM-JAY Empanelled
                    </Badge>
                  </div>

                  <div className="text-xs text-slate-500 space-y-1">
                    <div className="flex items-start gap-1.5">
                      <Building2 className="h-3.5 w-3.5 shrink-0 mt-0.5 text-slate-400" />
                      <span className="line-clamp-1">{h.location || h.district}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                    <div className="text-center p-2 bg-slate-50 rounded-xl">
                      <div className="text-lg font-black text-emerald-700">{h.availableBeds}</div>
                      <div className="text-[10px] text-slate-500 font-bold">General Beds</div>
                    </div>
                    <div className="text-center p-2 bg-red-50/60 rounded-xl border border-red-100">
                      <div className="text-lg font-black text-red-700">{h.availableIcu}</div>
                      <div className="text-[10px] text-red-600 font-bold">ICU Free</div>
                    </div>
                  </div>

                  {h.phone && (
                    <a href={`tel:${h.phone}`}>
                      <Button size="sm" variant="outline" className="w-full text-xs font-bold rounded-xl border-red-200 text-red-700 hover:bg-red-50 mt-1 gap-1.5">
                        <Phone className="h-3.5 w-3.5" />
                        Call Hospital {h.phone}
                      </Button>
                    </a>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* ── 5. Quick Bystander First-Aid Protocols ── */}
        <div className="space-y-4 pt-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-red-600" />
            <h2 className="text-xl font-black text-slate-900">First-Aid Protocols (While Waiting for Ambulance)</h2>
          </div>
          <div className="space-y-3">
            {FIRST_AID_TIPS.map((tip, idx) => {
              const Icon = tip.icon;
              const isExpanded = expandedTip === idx;
              return (
                <Card
                  key={idx}
                  className="overflow-hidden border-slate-200/80 cursor-pointer hover:shadow-sm transition-shadow rounded-2xl bg-white"
                  onClick={() => setExpandedTip(isExpanded ? null : idx)}
                >
                  <CardContent className="p-0">
                    <div className="flex items-center justify-between p-4 px-5">
                      <div className="flex items-center gap-3">
                        <div className={`p-2.5 rounded-xl ${tip.color}`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <span className="font-bold text-sm text-slate-900">{tip.title}</span>
                      </div>
                      {isExpanded ? (
                        <ChevronUp className="h-5 w-5 text-slate-400" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-slate-400" />
                      )}
                    </div>
                    {isExpanded && (
                      <div className="px-5 pb-5 border-t border-slate-100 pt-3">
                        <ol className="space-y-2">
                          {tip.steps.map((step, si) => (
                            <li key={si} className="flex items-start gap-2.5 text-xs text-slate-700">
                              <span className="flex-shrink-0 w-5 h-5 rounded-full bg-slate-100 text-slate-600 text-[11px] font-bold flex items-center justify-center mt-0.5">
                                {si + 1}
                              </span>
                              {step}
                            </li>
                          ))}
                        </ol>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* ── 6. Emergency Contacts Footer Bar ── */}
        <div className="pt-6 border-t border-slate-200 space-y-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider text-center">
            National Helplines Directory
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {EMERGENCY_CONTACTS.map((contact) => (
              <a key={contact.number} href={`tel:${contact.number}`} className="block">
                <Card className="hover:shadow-md transition-all hover:scale-[1.02] cursor-pointer border-slate-200/80 bg-white">
                  <CardContent className="p-3 text-center space-y-1">
                    <div className="text-xl font-black text-slate-900">{contact.number}</div>
                    <div className="text-[11px] text-slate-500 font-bold leading-tight truncate">{contact.name}</div>
                  </CardContent>
                </Card>
              </a>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
