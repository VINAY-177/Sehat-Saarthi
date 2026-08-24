// ============================================================
// Sehat Saathi AI — Comprehensive Bilingual Localization (English / हिंदी)
// ============================================================

export type Language = "en" | "hi";

export interface Translations {
  // Brand & Tagline
  brandName: string;
  tagline: string;
  subTagline: string;

  // Header & User Actions
  dashboardOverview: string;
  notifications: string;
  myProfile: string;
  switchAccount: string;
  logout: string;
  langSwitch: string;

  // Nav Groups & Links
  overview: string;
  clinical: string;
  management: string;
  operations: string;
  registry: string;
  healthServices: string;
  
  dashboard: string;
  aiBookingBot: string;
  appointmentSchedule: string;
  patientRecords: string;
  riskAssessment: string;
  referrals: string;
  facilitiesBeds: string;
  emergencyAmbulance: string;
  govSchemes: string;
  abhaId: string;
  messages: string;
  registerPatient: string;
  findHospitals: string;

  // Emergency & Top CTAs
  emergency108: string;
  callEmergency108: string;
  verifiedAbha: string;
  abdmCompliant: string;

  // Dashboard Greetings & Widgets
  goodMorning: string;
  goodAfternoon: string;
  goodEvening: string;
  goodNight: string;
  companionReady: string;
  bookDoctor60Sec: string;
  bookWithAi: string;
  voiceAndChat: string;
  quickServices: string;
  nearbyHospitals: string;
  bedsAvailable: string;
  dailyHealthTip: string;
  healthTipText: string;

  // Doctor & Clinical Dashboard
  clinicalTriage: string;
  activePatients: string;
  emergencyAlerts: string;
  pendingReferrals: string;
  icuBedsAvailable: string;
  priorityTriageQueue: string;
  quickClinicalActions: string;
  newAiTriage: string;
  recentReferrals: string;

  // Staff & Operations Dashboard
  hospitalOpsCenter: string;
  liveBedTelemetry: string;
  generalBeds: string;
  privateRooms: string;
  ambulanceFleetDispatch: string;
  bloodBankSupplies: string;
  incomingReferrals: string;

  // Calendar Widget
  appointments: string;
  scheduleAppointment: string;
  addAppointmentNote: string;
  insuranceSummary: string;
  activeCover: string;
  noAppointmentsDay: string;

  // Schemes & Occupation
  occupationCategory: string;
  incomeCategory: string;
  evaluateEligibility: string;
  unorganizedWorker: string;
  salariedWorker: string;
  farmerWorker: string;
  unemployedWorker: string;
  govEmployee: string;
  highMatchEligible: string;
  documentVerificationNeeded: string;
  officialPortal: string;
  disclaimerText: string;

  // Login & Signup Screens
  signInTitle: string;
  signInSub: string;
  signUpTitle: string;
  signUpSub: string;
  iAmA: string;
  patientRole: string;
  doctorRole: string;
  staffRole: string;
  emailOrMobile: string;
  password: string;
  forgotPassword: string;
  continueBtn: string;
  orDivider: string;
  noAccount: string;
  createOne: string;
  alreadyAccount: string;
  logInHere: string;
  fullName: string;
  phoneLabel: string;
  specialtyLabel: string;
  districtLabel: string;
  facilityLabel: string;
  createAccountBtn: string;
  heroHeadline: string;
  heroHeadlineAccent: string;
  heroSubtext: string;
  signupHeroHeadline: string;
  signupHeroSubtext: string;
  trustBadgeText: string;

  // Chatbot Flow
  botTitle: string;
  botSubtitle: string;
  onlineAssistant: string;
  resetChat: string;
  voiceOn: string;
  voiceOff: string;
  listening: string;
  tapToSpeak: string;
  typeMessagePlaceholder: string;
  quickOptions: string;
  suggestedByAi: string;
  confirmBooking: string;
  editDetails: string;
  cancelBooking: string;
  bookingSummaryTitle: string;
  summaryPatient: string;
  summarySymptoms: string;
  summaryDoctor: string;
  summaryHospital: string;
  summaryDateTime: string;
  summarySeverity: string;
  confirmedTitle: string;
  confirmedSubtitle: string;
  opdTokenLabel: string;
  downloadSlip: string;
  addToCalendar: string;
  bookAnother: string;

  // Common Actions
  viewAll: string;
  search: string;
  send: string;
  all: string;
  filter: string;
}

export const translations: Record<Language, Translations> = {
  en: {
    // Brand
    brandName: "Sehat Saathi",
    tagline: "Saath Humara, Sehat Aapki",
    subTagline: "AI-Powered Healthcare Navigation for India",

    // Header & User Actions
    dashboardOverview: "Dashboard Overview",
    notifications: "Notifications",
    myProfile: "My Profile",
    switchAccount: "Switch Account",
    logout: "Log out",
    langSwitch: "हिंदी",

    // Nav Groups
    overview: "Overview",
    clinical: "Clinical",
    management: "Management",
    operations: "Operations",
    registry: "Registry",
    healthServices: "Health Services",

    // Nav Links
    dashboard: "Dashboard",
    aiBookingBot: "AI Booking Bot",
    appointmentSchedule: "Appointment Schedule",
    patientRecords: "Patient Records",
    riskAssessment: "Risk Assessment",
    referrals: "Referrals",
    facilitiesBeds: "Facilities & Beds",
    emergencyAmbulance: "Emergency 108 Ambulance",
    govSchemes: "Government Schemes",
    abhaId: "ABHA Health ID",
    messages: "Clinical Messages",
    registerPatient: "Register Patient",
    findHospitals: "Find Hospitals",

    // Emergency & CTAs
    emergency108: "108 Emergency",
    callEmergency108: "Call 108 Ambulance Dispatch",
    verifiedAbha: "ABHA Health ID",
    abdmCompliant: "256-bit Encrypted · ABDM Compliant",

    // Dashboard Greetings
    goodMorning: "Good Morning",
    goodAfternoon: "Good Afternoon",
    goodEvening: "Good Evening",
    goodNight: "Good Night",
    companionReady: "Your intelligent health companion is ready to assist you.",
    bookDoctor60Sec: "Book Doctor Consultation with Sehat Saathi in 60 Seconds",
    bookWithAi: "Book with Sehat Saathi",
    voiceAndChat: "Voice & Chat",
    quickServices: "Quick Healthcare Services",
    nearbyHospitals: "Nearby Hospitals",
    bedsAvailable: "Beds Available",
    dailyHealthTip: "Daily Preventive Health Tip",
    healthTipText: "Stay hydrated — drink at least 8 glasses of water daily. Proper hydration supports your immune system and overall well-being.",

    // Doctor Dashboard
    clinicalTriage: "Clinical Triage & Encounters",
    activePatients: "Active Patients",
    emergencyAlerts: "Emergency Red-Alerts",
    pendingReferrals: "Pending Referrals",
    icuBedsAvailable: "ICU Beds Available",
    priorityTriageQueue: "Priority Triage Queue",
    quickClinicalActions: "Quick Clinical Actions",
    newAiTriage: "New AI Clinical Triage",
    recentReferrals: "Recent Referrals",

    // Staff Dashboard
    hospitalOpsCenter: "Hospital Operations Center",
    liveBedTelemetry: "Real-time facility capacity & bed telemetry",
    generalBeds: "General Ward Beds",
    privateRooms: "Private Rooms",
    ambulanceFleetDispatch: "Ambulance Fleet Dispatch",
    bloodBankSupplies: "Blood Bank & Supplies",
    incomingReferrals: "Incoming Clinical Referrals",

    // Calendar Widget
    appointments: "Appointments",
    scheduleAppointment: "Schedule appointment",
    addAppointmentNote: "Add appointment note",
    insuranceSummary: "Insurance summary",
    activeCover: "Active Cover",
    noAppointmentsDay: "No appointments scheduled for this date",

    // Schemes & Occupation
    occupationCategory: "Occupation category",
    incomeCategory: "Income / Socio-Economic Category",
    evaluateEligibility: "Evaluate Scheme Eligibility & Benefits",
    unorganizedWorker: "Unorganized sector worker",
    salariedWorker: "Organized sector / salaried",
    farmerWorker: "Farmer / agricultural worker",
    unemployedWorker: "Unemployed",
    govEmployee: "Government employee",
    highMatchEligible: "High Match: Eligible",
    documentVerificationNeeded: "Document Verification Needed",
    officialPortal: "Official Portal",
    disclaimerText: "This navigator provides automated rule-based guidance in compliance with National Health Stack standards.",

    // Login & Signup Screens
    signInTitle: "Sign in to your account",
    signInSub: "Select your role and enter your credentials to continue.",
    signUpTitle: "Create your account",
    signUpSub: "Join thousands of citizens, doctors, and hospitals on Sehat Saathi.",
    iAmA: "I AM A",
    patientRole: "Patient",
    doctorRole: "Doctor",
    staffRole: "Staff",
    emailOrMobile: "Email or Mobile Number",
    password: "Password",
    forgotPassword: "Forgot password?",
    continueBtn: "Continue",
    orDivider: "or",
    noAccount: "Don't have an account?",
    createOne: "Create one",
    alreadyAccount: "Already have an account?",
    logInHere: "Log in here",
    fullName: "Full Name",
    phoneLabel: "Mobile Number",
    specialtyLabel: "Medical Specialty",
    districtLabel: "District / City",
    facilityLabel: "Hospital / Facility Name",
    createAccountBtn: "Create Account & Sign In",
    heroHeadline: "Smarter healthcare,",
    heroHeadlineAccent: "accessible to everyone.",
    heroSubtext: "One platform connecting patients, doctors, and hospitals — powered by AI for a healthier India.",
    signupHeroHeadline: "Create Your Healthcare Account.",
    signupHeroSubtext: "Join thousands of citizens, certified doctors, and healthcare facilities unified on the Sehat Saathi clinical intelligence network.",
    trustBadgeText: "ABDM Compliant · End-to-End Encrypted · HIPAA Ready",

    // Chatbot Flow
    botTitle: "Sehat Saathi AI",
    botSubtitle: "Online · Voice & Chat",
    onlineAssistant: "Online",
    resetChat: "Reset Flow",
    voiceOn: "Voice Readback On",
    voiceOff: "Voice Muted",
    listening: "Listening... speak now",
    tapToSpeak: "Tap to speak in Hindi or English",
    typeMessagePlaceholder: "Type your answer or select an option below...",
    quickOptions: "Quick Options",
    suggestedByAi: "AI Smart Recommendation",
    confirmBooking: "Confirm Appointment",
    editDetails: "Edit Details",
    cancelBooking: "Cancel",
    bookingSummaryTitle: "Appointment Booking Summary",
    summaryPatient: "Patient Name",
    summarySymptoms: "Symptoms",
    summaryDoctor: "Doctor / Specialty",
    summaryHospital: "Hospital / Clinic",
    summaryDateTime: "Date & Time",
    summarySeverity: "Severity",
    confirmedTitle: "Appointment Confirmed Successfully!",
    confirmedSubtitle: "Your OPD appointment token and clinical record have been issued.",
    opdTokenLabel: "Appointment ID / OPD Token",
    downloadSlip: "Download Appointment Slip",
    addToCalendar: "Add to Calendar",
    bookAnother: "Book Another Appointment",

    // Common
    viewAll: "View All",
    search: "Search...",
    send: "Send",
    all: "All",
    filter: "Filter",
  },

  hi: {
    // Brand
    brandName: "सेहत साथी",
    tagline: "साथ हमारा, सेहत आपकी",
    subTagline: "भारत के लिए एआई-संचालित स्वास्थ्य सेवा नेविगेशन",

    // Header & User Actions
    dashboardOverview: "डैशबोर्ड अवलोकन",
    notifications: "सूचनाएं",
    myProfile: "मेरी प्रोफ़ाइल",
    switchAccount: "खाता बदलें",
    logout: "लॉग आउट",
    langSwitch: "English",

    // Nav Groups
    overview: "अवलोकन",
    clinical: "चिकित्सीय",
    management: "प्रबंधन",
    operations: "संचालन",
    registry: "पंजीकरण",
    healthServices: "स्वास्थ्य सेवाएं",

    // Nav Links
    dashboard: "डैशबोर्ड",
    aiBookingBot: "एआई बुकिंग बॉट",
    appointmentSchedule: "अपॉइंटमेंट अनुसूची",
    patientRecords: "रोगी रिकॉर्ड्स",
    riskAssessment: "जोखिम मूल्यांकन",
    referrals: "रेफरल प्रबंधन",
    facilitiesBeds: "अस्पताल एवं बेड स्थिति",
    emergencyAmbulance: "108 आपातकालीन एम्बुलेंस",
    govSchemes: "सरकारी स्वास्थ्य योजनाएं",
    abhaId: "आभा (ABHA) स्वास्थ्य कार्ड",
    messages: "संदेश एवं परामर्श",
    registerPatient: "नया मरीज पंजीकृत करें",
    findHospitals: "अस्पताल खोजें",

    // Emergency & CTAs
    emergency108: "108 आपातकाल",
    callEmergency108: "108 एम्बुलेंस को तुरंत कॉल करें",
    verifiedAbha: "आभा हेल्थ आईडी",
    abdmCompliant: "256-बिट एन्क्रिप्टेड · एबीडीएम प्रमाणित",

    // Dashboard Greetings
    goodMorning: "शुभ प्रभात",
    goodAfternoon: "शुभ दोपहर",
    goodEvening: "शुभ संध्या",
    goodNight: "शुभ रात्रि",
    companionReady: "आपका डिजिटल सेहत साथी आपकी सहायता के लिए तैयार है।",
    bookDoctor60Sec: "सेहत साथी से 60 सेकंड में डॉक्टर परामर्श बुक करें",
    bookWithAi: "सेहत साथी से बुक करें",
    voiceAndChat: "आवाज और चैट",
    quickServices: "त्वरित स्वास्थ्य सेवाएं",
    nearbyHospitals: "नजदीकी अस्पताल",
    bedsAvailable: "बेड उपलब्ध",
    dailyHealthTip: "दैनिक स्वास्थ्य सलाह",
    healthTipText: "पर्याप्त पानी पिएं — दिन में कम से कम 8 गिलास पानी पिएं। उचित हाइड्रेशन आपकी रोग प्रतिरोधक क्षमता और समग्र स्वास्थ्य को बेहतर रखता है।",

    // Doctor Dashboard
    clinicalTriage: "क्लिनिकल ट्राइएज एवं मरीज परामर्श",
    activePatients: "सक्रिय मरीज",
    emergencyAlerts: "आपातकालीन रेड अलर्ट",
    pendingReferrals: "लंबित रेफरल",
    icuBedsAvailable: "उपलब्ध आईसीयू बेड",
    priorityTriageQueue: "प्राथमिकता ट्राइएज कतार",
    quickClinicalActions: "त्वरित क्लिनिकल कार्य",
    newAiTriage: "नया AI क्लिनिकल ट्राइएज",
    recentReferrals: "हाल के रेफरल",

    // Staff Dashboard
    hospitalOpsCenter: "अस्पताल संचालन केंद्र",
    liveBedTelemetry: "वास्तविक समय वार्ड क्षमता एवं बेड स्थिति",
    generalBeds: "जनरल वार्ड बेड",
    privateRooms: "प्राइवेट कमरे",
    ambulanceFleetDispatch: "एम्बुलेंस बेड़ा प्रेषण",
    bloodBankSupplies: "ब्लड बैंक एवं दवा आपूर्ति",
    incomingReferrals: "आने वाले मरीज रेफरल",

    // Calendar Widget
    appointments: "अपॉइंटमेंट्स (परामर्श)",
    scheduleAppointment: "अपॉइंटमेंट बुक करें",
    addAppointmentNote: "परामर्श नोट जोड़ें",
    insuranceSummary: "बीमा सारांश (Insurance)",
    activeCover: "सक्रिय बीमा कवर",
    noAppointmentsDay: "इस तिथि के लिए कोई अपॉइंटमेंट नहीं है",

    // Schemes & Occupation
    occupationCategory: "व्यवसाय श्रेणी (Occupation)",
    incomeCategory: "आय / सामाजिक-आर्थिक श्रेणी",
    evaluateEligibility: "योजना पात्रता एवं लाभ जांचें",
    unorganizedWorker: "असंगठित क्षेत्र के श्रमिक (Unorganized)",
    salariedWorker: "संगठित क्षेत्र / वेतनभोगी (Salaried)",
    farmerWorker: "किसान / कृषि श्रमिक (Farmer)",
    unemployedWorker: "बेरोजगार (Unemployed)",
    govEmployee: "सरकारी कर्मचारी (Government)",
    highMatchEligible: "उच्च पात्रता: पात्र हैं",
    documentVerificationNeeded: "दस्तावेज़ सत्यापन आवश्यक",
    officialPortal: "आधिकारिक पोर्टल",
    disclaimerText: "यह नेविगेटर राष्ट्रीय स्वास्थ्य स्टैक मानकों के अनुपालन में स्वचालित मार्गदर्शन प्रदान करता है।",

    // Login & Signup Screens
    signInTitle: "अपने खाते में साइन इन करें",
    signInSub: "जारी रखने के लिए अपनी भूमिका चुनें और विवरण दर्ज करें।",
    signUpTitle: "नया खाता बनाएं",
    signUpSub: "सेहत साथी पर हजारों नागरिकों, डॉक्टरों और अस्पतालों से जुड़ें।",
    iAmA: "मेरी भूमिका है",
    patientRole: "रोगी / नागरिक",
    doctorRole: "चिकित्सक (Doctor)",
    staffRole: "अस्पताल स्टाफ",
    emailOrMobile: "ईमेल या मोबाइल नंबर",
    password: "पासवर्ड",
    forgotPassword: "पासवर्ड भूल गए?",
    continueBtn: "साइन इन करें (Continue)",
    orDivider: "या",
    noAccount: "खाता नहीं है?",
    createOne: "नया खाता बनाएं",
    alreadyAccount: "पहले से खाता है?",
    logInHere: "यहाँ लॉग इन करें",
    fullName: "पूरा नाम",
    phoneLabel: "मोबाइल नंबर",
    specialtyLabel: "चिकित्सा विशेषता (Specialty)",
    districtLabel: "जिला / शहर",
    facilityLabel: "अस्पताल का नाम",
    createAccountBtn: "खाता बनाएं और साइन इन करें",
    heroHeadline: "स्मार्ट स्वास्थ्य सेवा,",
    heroHeadlineAccent: "हर भारतीय के लिए सुलभ।",
    heroSubtext: "मरीजों, डॉक्टरों और अस्पतालों को एक साथ जोड़ने वाला AI-संचालित डिजिटल स्वास्थ्य प्लेटफॉर्म।",
    signupHeroHeadline: "अपना डिजिटल स्वास्थ्य खाता बनाएं।",
    signupHeroSubtext: "सेहत साथी क्लिनिकल इंटेलिजेंस नेटवर्क पर हजारों नागरिकों, प्रमाणित डॉक्टरों और स्वास्थ्य सुविधाओं से जुड़ें।",
    trustBadgeText: "एबीडीएम प्रमाणित · 256-बिट एन्क्रिप्टेड · सुरक्षित डेटा",

    // Chatbot Flow
    botTitle: "सेहत साथी AI",
    botSubtitle: "ऑनलाइन · वॉयस एवं चैट",
    onlineAssistant: "ऑनलाइन",
    resetChat: "रीसेट करें",
    voiceOn: "आवाज वाचन सक्रिय",
    voiceOff: "आवाज म्यूट",
    listening: "सुन रहे हैं... कृपया बोलें",
    tapToSpeak: "हिंदी या अंग्रेजी में बोलने के लिए माइक दबाएं",
    typeMessagePlaceholder: "अपना उत्तर लिखें या नीचे दिए गए विकल्पों में से चुनें...",
    quickOptions: "त्वरित विकल्प",
    suggestedByAi: "एआई स्मार्ट सुझाव",
    confirmBooking: "अपॉइंटमेंट की पुष्टि करें",
    editDetails: "विवरण संशोधित करें",
    cancelBooking: "रद्द करें",
    bookingSummaryTitle: "अपॉइंटमेंट बुकिंग सारांश",
    summaryPatient: "मरीज का नाम",
    summarySymptoms: "लक्षण",
    summaryDoctor: "डॉक्टर / विशेषज्ञता",
    summaryHospital: "अस्पताल / क्लिनिक",
    summaryDateTime: "तिथि एवं समय",
    summarySeverity: "गंभीरता",
    confirmedTitle: "अपॉइंटमेंट सफलतापूर्वक बुक हो गया!",
    confirmedSubtitle: "आपका ओपीडी टोकन और डिजिटल क्लिनिकल रिकॉर्ड जारी कर दिया गया है।",
    opdTokenLabel: "अपॉइंटमेंट आईडी / ओपीडी टोकन",
    downloadSlip: "अपॉइंटमेंट पर्ची डाउनलोड करें",
    addToCalendar: "कैलेंडर में जोड़ें",
    bookAnother: "एक और अपॉइंटमेंट बुक करें",

    // Common
    viewAll: "सभी देखें",
    search: "खोजें...",
    send: "भेजें",
    all: "सभी",
    filter: "फ़िल्टर",
  },
};
