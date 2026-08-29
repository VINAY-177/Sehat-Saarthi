import { Facility } from "./types";

// ============================================================
// Delhi-NCR Verified Real Hospitals Master Healthcare Network
// Exclusively Hospitals (General, Super-Specialty, Multi-Specialty,
// Apex Institutes, MCD & District Hospitals) across Delhi,
// Noida, Greater Noida, Ghaziabad, Gurugram, and Faridabad.
// (NO clinics, NO dispensaries, NO primary health sub-centres)
// ============================================================

export const DELHI_NCR_108_HOSPITALS: Facility[] = [
  {
    "id": "hosp-aiims-delhi",
    "name": "AIIMS New Delhi",
    "type": "Tertiary",
    "district": "South Delhi",
    "state": "Delhi",
    "lat": 28.5672,
    "lng": 77.21,
    "generalBeds": 2228,
    "icuBeds": 250,
    "privateRooms": 80,
    "phone": "011-26588500",
    "city": "Delhi",
    "area": "Ansari Nagar",
    "address": "Sri Aurobindo Marg Ansari Nagar New Delhi 110029",
    "rating": 4.8,
    "specialties": [
      "Cardiology",
      "Neurology",
      "Oncology",
      "Trauma",
      "Nephrology",
      "Gastroenterology",
      "Pulmonology"
    ],
    "schemes": [
      "PM-JAY",
      "CGHS",
      "ECHS",
      "Delhi Arogya Kosh (DAK)",
      "Delhi Arogya Nidhi (DAN)",
      "Rashtriya Arogya Nidhi (RAN)",
      "Free Dialysis Scheme",
      "RBSK"
    ],
    "dakEmpanelled": true,
    "freeSurgeryEmpanelled": true,
    "freeDiagnosticsAvailable": true,
    "cghsEmpanelled": true,
    "danEmpanelled": true,
    "jsyAvailable": true,
    "echsEmpanelled": true,
    "generalBedsUsed": 1871,
    "icuBedsUsed": 205,
    "privateRoomsUsed": 64,
    "doctors": [],
    "equipment": [
      {
        "name": "CT Scanner",
        "status": "AVAILABLE",
        "count": 11
      },
      {
        "name": "MRI Scanner",
        "status": "AVAILABLE",
        "count": 7
      },
      {
        "name": "ICU Ventilators",
        "status": "AVAILABLE",
        "count": 200
      },
      {
        "name": "Dialysis Machines",
        "status": "AVAILABLE",
        "count": 44
      },
      {
        "name": "Emergency Trauma OT",
        "status": "AVAILABLE",
        "count": 14
      }
    ],
    "specialists": [
      "Cardiology",
      "Neurology",
      "Oncology",
      "Trauma",
      "Nephrology",
      "Gastroenterology",
      "Pulmonology"
    ],
    "bloodStock": {
      "O+": 133,
      "O-": 35,
      "A+": 106,
      "A-": 26,
      "B+": 142,
      "B-": 35,
      "AB+": 71,
      "AB-": 17
    },
    "pmjayEmpanelled": true,
    "emergencyAvailable": true
  },
  {
    "id": "hosp-safdarjung-delhi",
    "name": "Safdarjung Hospital & VMMC",
    "type": "Tertiary",
    "district": "South Delhi",
    "state": "Delhi",
    "lat": 28.5684,
    "lng": 77.2066,
    "generalBeds": 1381,
    "icuBeds": 150,
    "privateRooms": 40,
    "phone": "011-26707444",
    "city": "Delhi",
    "area": "Ring Road",
    "address": "Ansari Nagar West Opposite AIIMS New Delhi 110029",
    "rating": 4.5,
    "specialties": [
      "Burns & Plastic Surgery",
      "Orthopaedics",
      "General Surgery",
      "Cardiology",
      "Obstetrics & Gynaecology"
    ],
    "schemes": [
      "PM-JAY",
      "CGHS",
      "ECHS",
      "Delhi Arogya Kosh (DAK)",
      "Delhi Arogya Nidhi (DAN)",
      "Janani Suraksha Yojana (JSY)",
      "Free Surgery Scheme"
    ],
    "dakEmpanelled": true,
    "freeSurgeryEmpanelled": true,
    "freeDiagnosticsAvailable": true,
    "cghsEmpanelled": true,
    "danEmpanelled": true,
    "jsyAvailable": true,
    "echsEmpanelled": true,
    "generalBedsUsed": 1270,
    "icuBedsUsed": 124,
    "privateRoomsUsed": 34,
    "doctors": [],
    "equipment": [
      {
        "name": "CT Scanner",
        "status": "AVAILABLE",
        "count": 6
      },
      {
        "name": "MRI Scanner",
        "status": "AVAILABLE",
        "count": 4
      },
      {
        "name": "ICU Ventilators",
        "status": "AVAILABLE",
        "count": 120
      },
      {
        "name": "Dialysis Machines",
        "status": "AVAILABLE",
        "count": 27
      },
      {
        "name": "Emergency Trauma OT",
        "status": "AVAILABLE",
        "count": 9
      }
    ],
    "specialists": [
      "Burns & Plastic Surgery",
      "Orthopaedics",
      "General Surgery",
      "Cardiology",
      "Obstetrics & Gynaecology"
    ],
    "bloodStock": {
      "O+": 82,
      "O-": 22,
      "A+": 66,
      "A-": 16,
      "B+": 88,
      "B-": 22,
      "AB+": 44,
      "AB-": 11
    },
    "pmjayEmpanelled": true,
    "emergencyAvailable": true
  },
  {
    "id": "hosp-rml-delhi",
    "name": "Dr. Ram Manohar Lohia Hospital (RML)",
    "type": "Tertiary",
    "district": "New Delhi",
    "state": "Delhi",
    "lat": 28.6253,
    "lng": 77.2008,
    "generalBeds": 1300,
    "icuBeds": 120,
    "privateRooms": 35,
    "phone": "011-23365525",
    "city": "Delhi",
    "area": "Connaught Place / Baba Kharak Singh Marg",
    "address": "Baba Kharak Singh Marg Connaught Place New Delhi 110001",
    "rating": 4.4,
    "specialties": [
      "General Medicine",
      "Cardiology",
      "Nephrology",
      "Neurology",
      "General Surgery",
      "Pediatrics"
    ],
    "schemes": [
      "PM-JAY",
      "CGHS",
      "ECHS",
      "Delhi Arogya Kosh (DAK)",
      "Delhi Arogya Nidhi (DAN)",
      "Rashtriya Arogya Nidhi (RAN)"
    ],
    "dakEmpanelled": true,
    "freeSurgeryEmpanelled": true,
    "freeDiagnosticsAvailable": true,
    "cghsEmpanelled": true,
    "danEmpanelled": true,
    "jsyAvailable": true,
    "echsEmpanelled": true,
    "generalBedsUsed": 1183,
    "icuBedsUsed": 100,
    "privateRoomsUsed": 28,
    "doctors": [],
    "equipment": [
      {
        "name": "CT Scanner",
        "status": "AVAILABLE",
        "count": 6
      },
      {
        "name": "MRI Scanner",
        "status": "AVAILABLE",
        "count": 4
      },
      {
        "name": "ICU Ventilators",
        "status": "AVAILABLE",
        "count": 96
      },
      {
        "name": "Dialysis Machines",
        "status": "AVAILABLE",
        "count": 26
      },
      {
        "name": "Emergency Trauma OT",
        "status": "AVAILABLE",
        "count": 8
      }
    ],
    "specialists": [
      "General Medicine",
      "Cardiology",
      "Nephrology",
      "Neurology",
      "General Surgery",
      "Pediatrics"
    ],
    "bloodStock": {
      "O+": 78,
      "O-": 20,
      "A+": 62,
      "A-": 15,
      "B+": 83,
      "B-": 20,
      "AB+": 41,
      "AB-": 10
    },
    "pmjayEmpanelled": true,
    "emergencyAvailable": true
  },
  {
    "id": "hosp-lh-delhi",
    "name": "Lady Hardinge Medical College & Smt. SK Hospital",
    "type": "Government",
    "district": "New Delhi",
    "state": "Delhi",
    "lat": 28.6341,
    "lng": 77.2148,
    "generalBeds": 850,
    "icuBeds": 70,
    "privateRooms": 20,
    "phone": "011-23363728",
    "city": "Delhi",
    "area": "Connaught Place",
    "address": "Shaheed Bhagat Singh Marg Connaught Place New Delhi 110001",
    "rating": 4.4,
    "specialties": [
      "Obstetrics & Gynaecology",
      "Maternal Health",
      "Pediatrics",
      "Neonatology",
      "General Surgery"
    ],
    "schemes": [
      "Janani Suraksha Yojana (JSY)",
      "PM Matru Vandana (PMMVY)",
      "Delhi Arogya Kosh (DAK)",
      "PM-JAY",
      "CGHS",
      "RBSK"
    ],
    "dakEmpanelled": true,
    "freeSurgeryEmpanelled": true,
    "freeDiagnosticsAvailable": true,
    "cghsEmpanelled": true,
    "danEmpanelled": true,
    "jsyAvailable": true,
    "echsEmpanelled": true,
    "generalBedsUsed": 764,
    "icuBedsUsed": 59,
    "privateRoomsUsed": 17,
    "doctors": [],
    "equipment": [
      {
        "name": "CT Scanner",
        "status": "AVAILABLE",
        "count": 4
      },
      {
        "name": "MRI Scanner",
        "status": "AVAILABLE",
        "count": 2
      },
      {
        "name": "ICU Ventilators",
        "status": "AVAILABLE",
        "count": 56
      },
      {
        "name": "Dialysis Machines",
        "status": "AVAILABLE",
        "count": 17
      },
      {
        "name": "Emergency Trauma OT",
        "status": "AVAILABLE",
        "count": 5
      }
    ],
    "specialists": [
      "Obstetrics & Gynaecology",
      "Maternal Health",
      "Pediatrics",
      "Neonatology",
      "General Surgery"
    ],
    "bloodStock": {
      "O+": 51,
      "O-": 13,
      "A+": 40,
      "A-": 10,
      "B+": 54,
      "B-": 13,
      "AB+": 27,
      "AB-": 6
    },
    "pmjayEmpanelled": true,
    "emergencyAvailable": true
  },
  {
    "id": "hosp-kalawati-delhi",
    "name": "Kalawati Saran Children's Hospital",
    "type": "Specialized",
    "district": "New Delhi",
    "state": "Delhi",
    "lat": 28.6335,
    "lng": 77.2142,
    "generalBeds": 450,
    "icuBeds": 50,
    "privateRooms": 10,
    "phone": "011-23344160",
    "city": "Delhi",
    "area": "Bangla Sahib",
    "address": "Bangla Sahib Marg Connaught Place New Delhi 110001",
    "rating": 4.5,
    "specialties": [
      "Pediatric Intensive Care",
      "Pediatric Surgery",
      "Neonatology",
      "Child Neurology",
      "Pediatric Nephrology"
    ],
    "schemes": [
      "Rashtriya Bal Swasthya Karyakram (RBSK)",
      "Delhi Arogya Kosh (DAK)",
      "PM-JAY",
      "CGHS",
      "Delhi Arogya Nidhi (DAN)"
    ],
    "dakEmpanelled": true,
    "freeSurgeryEmpanelled": true,
    "freeDiagnosticsAvailable": true,
    "cghsEmpanelled": true,
    "danEmpanelled": true,
    "jsyAvailable": true,
    "echsEmpanelled": true,
    "generalBedsUsed": 400,
    "icuBedsUsed": 43,
    "privateRoomsUsed": 8,
    "doctors": [],
    "equipment": [
      {
        "name": "CT Scanner",
        "status": "AVAILABLE",
        "count": 2
      },
      {
        "name": "MRI Scanner",
        "status": "AVAILABLE",
        "count": 1
      },
      {
        "name": "ICU Ventilators",
        "status": "AVAILABLE",
        "count": 40
      },
      {
        "name": "Dialysis Machines",
        "status": "AVAILABLE",
        "count": 9
      },
      {
        "name": "Emergency Trauma OT",
        "status": "AVAILABLE",
        "count": 3
      }
    ],
    "specialists": [
      "Pediatric Intensive Care",
      "Pediatric Surgery",
      "Neonatology",
      "Child Neurology",
      "Pediatric Nephrology"
    ],
    "bloodStock": {
      "O+": 27,
      "O-": 7,
      "A+": 21,
      "A-": 5,
      "B+": 28,
      "B-": 7,
      "AB+": 14,
      "AB-": 3
    },
    "pmjayEmpanelled": true,
    "emergencyAvailable": true
  },
  {
    "id": "hosp-vpci-delhi",
    "name": "Vallabhbhai Patel Chest Institute (VPCI)",
    "type": "Specialized",
    "district": "North Delhi",
    "state": "Delhi",
    "lat": 28.6874,
    "lng": 77.2145,
    "generalBeds": 200,
    "icuBeds": 25,
    "privateRooms": 15,
    "phone": "011-27667102",
    "city": "Delhi",
    "area": "Delhi University North Campus",
    "address": "University of Delhi North Campus New Delhi 110007",
    "rating": 4.5,
    "specialties": [
      "Pulmonology",
      "Respiratory Medicine",
      "Allergy & Immunotherapy",
      "Thoracic Surgery",
      "Sleep Medicine"
    ],
    "schemes": [
      "CGHS",
      "ECHS",
      "PM-JAY",
      "NTEP National TB Elimination",
      "Delhi Free Diagnostics"
    ],
    "dakEmpanelled": true,
    "freeSurgeryEmpanelled": false,
    "freeDiagnosticsAvailable": true,
    "cghsEmpanelled": true,
    "danEmpanelled": true,
    "jsyAvailable": false,
    "echsEmpanelled": true,
    "generalBedsUsed": 176,
    "icuBedsUsed": 21,
    "privateRoomsUsed": 12,
    "doctors": [],
    "equipment": [
      {
        "name": "CT Scanner",
        "status": "AVAILABLE",
        "count": 1
      },
      {
        "name": "MRI Scanner",
        "status": "AVAILABLE",
        "count": 1
      },
      {
        "name": "ICU Ventilators",
        "status": "AVAILABLE",
        "count": 20
      },
      {
        "name": "Dialysis Machines",
        "status": "AVAILABLE",
        "count": 4
      },
      {
        "name": "Emergency Trauma OT",
        "status": "AVAILABLE",
        "count": 2
      }
    ],
    "specialists": [
      "Pulmonology",
      "Respiratory Medicine",
      "Allergy & Immunotherapy",
      "Thoracic Surgery",
      "Sleep Medicine"
    ],
    "bloodStock": {
      "O+": 12,
      "O-": 3,
      "A+": 9,
      "A-": 2,
      "B+": 12,
      "B-": 3,
      "AB+": 6,
      "AB-": 1
    },
    "pmjayEmpanelled": true,
    "emergencyAvailable": true
  },
  {
    "id": "hosp-ihbas-delhi",
    "name": "Institute of Human Behaviour & Allied Sciences (IHBAS)",
    "type": "Specialized",
    "district": "Shahdara",
    "state": "Delhi",
    "lat": 28.6812,
    "lng": 77.315,
    "generalBeds": 450,
    "icuBeds": 30,
    "privateRooms": 20,
    "phone": "011-22599722",
    "city": "Delhi",
    "area": "Dilshad Garden",
    "address": "Tahirpur Road Dilshad Garden Delhi 110095",
    "rating": 4.4,
    "specialties": [
      "Psychiatry",
      "Neurology",
      "Neurosurgery",
      "Clinical Psychology",
      "Neuro-Radiology",
      "De-addiction"
    ],
    "schemes": [
      "Delhi Arogya Kosh (DAK)",
      "PM-JAY",
      "CGHS",
      "Delhi Arogya Nidhi (DAN)",
      "Tele-MANAS"
    ],
    "dakEmpanelled": true,
    "freeSurgeryEmpanelled": true,
    "freeDiagnosticsAvailable": true,
    "cghsEmpanelled": true,
    "danEmpanelled": true,
    "jsyAvailable": false,
    "echsEmpanelled": true,
    "generalBedsUsed": 391,
    "icuBedsUsed": 26,
    "privateRoomsUsed": 17,
    "doctors": [],
    "equipment": [
      {
        "name": "CT Scanner",
        "status": "AVAILABLE",
        "count": 2
      },
      {
        "name": "MRI Scanner",
        "status": "AVAILABLE",
        "count": 1
      },
      {
        "name": "ICU Ventilators",
        "status": "AVAILABLE",
        "count": 24
      },
      {
        "name": "Dialysis Machines",
        "status": "AVAILABLE",
        "count": 9
      },
      {
        "name": "Emergency Trauma OT",
        "status": "AVAILABLE",
        "count": 3
      }
    ],
    "specialists": [
      "Psychiatry",
      "Neurology",
      "Neurosurgery",
      "Clinical Psychology",
      "Neuro-Radiology",
      "De-addiction"
    ],
    "bloodStock": {
      "O+": 27,
      "O-": 7,
      "A+": 21,
      "A-": 5,
      "B+": 28,
      "B-": 7,
      "AB+": 14,
      "AB-": 3
    },
    "pmjayEmpanelled": true,
    "emergencyAvailable": true
  },
  {
    "id": "hosp-aiia-delhi",
    "name": "All India Institute of Ayurveda (AIIA)",
    "type": "Specialized",
    "district": "South East Delhi",
    "state": "Delhi",
    "lat": 28.5285,
    "lng": 77.294,
    "generalBeds": 250,
    "icuBeds": 15,
    "privateRooms": 30,
    "phone": "011-29997100",
    "city": "Delhi",
    "area": "Sarita Vihar",
    "address": "Mathura Road Gautampuri Sarita Vihar New Delhi 110076",
    "rating": 4.6,
    "specialties": [
      "Ayurvedic Medicine",
      "Panchakarma",
      "Kayachikitsa",
      "Shalya Tantra",
      "Integrative Cardiology"
    ],
    "schemes": [
      "AYUSH National Mission",
      "CGHS",
      "PM-JAY AYUSH Benefit",
      "ECHS"
    ],
    "dakEmpanelled": false,
    "freeSurgeryEmpanelled": false,
    "freeDiagnosticsAvailable": true,
    "cghsEmpanelled": true,
    "danEmpanelled": false,
    "jsyAvailable": true,
    "echsEmpanelled": true,
    "generalBedsUsed": 215,
    "icuBedsUsed": 13,
    "privateRoomsUsed": 24,
    "doctors": [],
    "equipment": [
      {
        "name": "CT Scanner",
        "status": "AVAILABLE",
        "count": 1
      },
      {
        "name": "MRI Scanner",
        "status": "AVAILABLE",
        "count": 1
      },
      {
        "name": "ICU Ventilators",
        "status": "AVAILABLE",
        "count": 12
      },
      {
        "name": "Dialysis Machines",
        "status": "AVAILABLE",
        "count": 5
      },
      {
        "name": "Emergency Trauma OT",
        "status": "AVAILABLE",
        "count": 2
      }
    ],
    "specialists": [
      "Ayurvedic Medicine",
      "Panchakarma",
      "Kayachikitsa",
      "Shalya Tantra",
      "Integrative Cardiology"
    ],
    "bloodStock": {
      "O+": 15,
      "O-": 4,
      "A+": 12,
      "A-": 3,
      "B+": 16,
      "B-": 4,
      "AB+": 8,
      "AB-": 2
    },
    "pmjayEmpanelled": true,
    "emergencyAvailable": true
  },
  {
    "id": "hosp-nitrd-delhi",
    "name": "National Institute of TB & Respiratory Diseases (NITRD)",
    "type": "Specialized",
    "district": "South Delhi",
    "state": "Delhi",
    "lat": 28.524,
    "lng": 77.189,
    "generalBeds": 520,
    "icuBeds": 35,
    "privateRooms": 15,
    "phone": "011-26517834",
    "city": "Delhi",
    "area": "Mehrauli",
    "address": "Sri Aurobindo Marg Near Qutub Minar Mehrauli New Delhi 110030",
    "rating": 4.3,
    "specialties": [
      "Pulmonology",
      "Thoracic Surgery",
      "TB & MDR-TB Care",
      "Respiratory ICU",
      "Bronchoscopy"
    ],
    "schemes": [
      "NTEP National TB Elimination",
      "Ni-kshay Poshan",
      "CGHS",
      "PM-JAY",
      "ECHS"
    ],
    "dakEmpanelled": true,
    "freeSurgeryEmpanelled": true,
    "freeDiagnosticsAvailable": true,
    "cghsEmpanelled": true,
    "danEmpanelled": true,
    "jsyAvailable": false,
    "echsEmpanelled": true,
    "generalBedsUsed": 442,
    "icuBedsUsed": 31,
    "privateRoomsUsed": 12,
    "doctors": [],
    "equipment": [
      {
        "name": "CT Scanner",
        "status": "AVAILABLE",
        "count": 2
      },
      {
        "name": "MRI Scanner",
        "status": "AVAILABLE",
        "count": 1
      },
      {
        "name": "ICU Ventilators",
        "status": "AVAILABLE",
        "count": 28
      },
      {
        "name": "Dialysis Machines",
        "status": "AVAILABLE",
        "count": 10
      },
      {
        "name": "Emergency Trauma OT",
        "status": "AVAILABLE",
        "count": 3
      }
    ],
    "specialists": [
      "Pulmonology",
      "Thoracic Surgery",
      "TB & MDR-TB Care",
      "Respiratory ICU",
      "Bronchoscopy"
    ],
    "bloodStock": {
      "O+": 30,
      "O-": 8,
      "A+": 24,
      "A-": 6,
      "B+": 32,
      "B-": 8,
      "AB+": 16,
      "AB-": 4
    },
    "pmjayEmpanelled": true,
    "emergencyAvailable": true
  },
  {
    "id": "hosp-army-rr-delhi",
    "name": "Army Hospital Research & Referral (AHRR)",
    "type": "Tertiary",
    "district": "South West Delhi",
    "state": "Delhi",
    "lat": 28.5835,
    "lng": 77.152,
    "generalBeds": 900,
    "icuBeds": 100,
    "privateRooms": 80,
    "phone": "011-25693300",
    "city": "Delhi",
    "area": "Dhaula Kuan",
    "address": "Near Subroto Park Dhaula Kuan New Delhi 110010",
    "rating": 4.9,
    "specialties": [
      "Cardiothoracic Surgery",
      "Neurosurgery",
      "Organ Transplant",
      "Oncology",
      "Joint Replacement",
      "Critical Care"
    ],
    "schemes": [
      "ECHS",
      "Armed Forces Medical Services",
      "CGHS Referral"
    ],
    "dakEmpanelled": false,
    "freeSurgeryEmpanelled": false,
    "freeDiagnosticsAvailable": false,
    "cghsEmpanelled": true,
    "danEmpanelled": false,
    "jsyAvailable": false,
    "echsEmpanelled": true,
    "generalBedsUsed": 756,
    "icuBedsUsed": 90,
    "privateRoomsUsed": 68,
    "doctors": [],
    "equipment": [
      {
        "name": "CT Scanner",
        "status": "AVAILABLE",
        "count": 4
      },
      {
        "name": "MRI Scanner",
        "status": "AVAILABLE",
        "count": 3
      },
      {
        "name": "ICU Ventilators",
        "status": "AVAILABLE",
        "count": 80
      },
      {
        "name": "Dialysis Machines",
        "status": "AVAILABLE",
        "count": 18
      },
      {
        "name": "Emergency Trauma OT",
        "status": "AVAILABLE",
        "count": 6
      }
    ],
    "specialists": [
      "Cardiothoracic Surgery",
      "Neurosurgery",
      "Organ Transplant",
      "Oncology",
      "Joint Replacement",
      "Critical Care"
    ],
    "bloodStock": {
      "O+": 54,
      "O-": 14,
      "A+": 43,
      "A-": 10,
      "B+": 57,
      "B-": 14,
      "AB+": 28,
      "AB-": 7
    },
    "pmjayEmpanelled": true,
    "emergencyAvailable": true
  },
  {
    "id": "hosp-base-delhicantt",
    "name": "Base Hospital Delhi Cantt",
    "type": "Government",
    "district": "South West Delhi",
    "state": "Delhi",
    "lat": 28.598,
    "lng": 77.129,
    "generalBeds": 700,
    "icuBeds": 60,
    "privateRooms": 40,
    "phone": "011-25693100",
    "city": "Delhi",
    "area": "Delhi Cantt",
    "address": "Ring Road Delhi Cantt New Delhi 110010",
    "rating": 4.6,
    "specialties": [
      "General Medicine",
      "General Surgery",
      "Orthopaedics",
      "Emergency Trauma",
      "Pediatrics"
    ],
    "schemes": [
      "ECHS",
      "Armed Forces Benefit"
    ],
    "dakEmpanelled": false,
    "freeSurgeryEmpanelled": false,
    "freeDiagnosticsAvailable": false,
    "cghsEmpanelled": true,
    "danEmpanelled": false,
    "jsyAvailable": false,
    "echsEmpanelled": true,
    "generalBedsUsed": 644,
    "icuBedsUsed": 55,
    "privateRoomsUsed": 32,
    "doctors": [],
    "equipment": [
      {
        "name": "CT Scanner",
        "status": "AVAILABLE",
        "count": 3
      },
      {
        "name": "MRI Scanner",
        "status": "AVAILABLE",
        "count": 2
      },
      {
        "name": "ICU Ventilators",
        "status": "AVAILABLE",
        "count": 48
      },
      {
        "name": "Dialysis Machines",
        "status": "AVAILABLE",
        "count": 14
      },
      {
        "name": "Emergency Trauma OT",
        "status": "AVAILABLE",
        "count": 4
      }
    ],
    "specialists": [
      "General Medicine",
      "General Surgery",
      "Orthopaedics",
      "Emergency Trauma",
      "Pediatrics"
    ],
    "bloodStock": {
      "O+": 42,
      "O-": 11,
      "A+": 33,
      "A-": 8,
      "B+": 44,
      "B-": 11,
      "AB+": 22,
      "AB-": 5
    },
    "pmjayEmpanelled": true,
    "emergencyAvailable": true
  },
  {
    "id": "hosp-railway-delhi",
    "name": "Northern Railway Central Hospital",
    "type": "Government",
    "district": "Central Delhi",
    "state": "Delhi",
    "lat": 28.643,
    "lng": 77.2205,
    "generalBeds": 500,
    "icuBeds": 45,
    "privateRooms": 30,
    "phone": "011-23363441",
    "city": "Delhi",
    "area": "Connaught Place / Basant Lane",
    "address": "Basant Lane Chelmsford Road New Delhi 110055",
    "rating": 4.3,
    "specialties": [
      "Cardiology",
      "Orthopaedics",
      "General Medicine",
      "Gastroenterology",
      "Urology"
    ],
    "schemes": [
      "Railway Health Scheme (REHS)",
      "CGHS",
      "PM-JAY"
    ],
    "dakEmpanelled": false,
    "freeSurgeryEmpanelled": false,
    "freeDiagnosticsAvailable": true,
    "cghsEmpanelled": true,
    "danEmpanelled": false,
    "jsyAvailable": false,
    "echsEmpanelled": true,
    "generalBedsUsed": 454,
    "icuBedsUsed": 36,
    "privateRoomsUsed": 26,
    "doctors": [],
    "equipment": [
      {
        "name": "CT Scanner",
        "status": "AVAILABLE",
        "count": 2
      },
      {
        "name": "MRI Scanner",
        "status": "AVAILABLE",
        "count": 1
      },
      {
        "name": "ICU Ventilators",
        "status": "AVAILABLE",
        "count": 36
      },
      {
        "name": "Dialysis Machines",
        "status": "AVAILABLE",
        "count": 10
      },
      {
        "name": "Emergency Trauma OT",
        "status": "AVAILABLE",
        "count": 3
      }
    ],
    "specialists": [
      "Cardiology",
      "Orthopaedics",
      "General Medicine",
      "Gastroenterology",
      "Urology"
    ],
    "bloodStock": {
      "O+": 30,
      "O-": 8,
      "A+": 24,
      "A-": 6,
      "B+": 32,
      "B-": 8,
      "AB+": 16,
      "AB-": 4
    },
    "pmjayEmpanelled": true,
    "emergencyAvailable": true
  },
  {
    "id": "hosp-esic-basaidarapur",
    "name": "ESIC Model Hospital & PGIMSR Basaidarapur",
    "type": "Government",
    "district": "West Delhi",
    "state": "Delhi",
    "lat": 28.6615,
    "lng": 77.135,
    "generalBeds": 650,
    "icuBeds": 60,
    "privateRooms": 25,
    "phone": "011-25100664",
    "city": "Delhi",
    "area": "Basaidarapur",
    "address": "Ring Road Basaidarapur New Delhi 110015",
    "rating": 4.2,
    "specialties": [
      "General Medicine",
      "General Surgery",
      "Orthopaedics",
      "Cardiology",
      "Pediatrics",
      "Obstetrics & Gynaecology"
    ],
    "schemes": [
      "ESIC Insured Scheme",
      "PM-JAY",
      "CGHS"
    ],
    "dakEmpanelled": false,
    "freeSurgeryEmpanelled": true,
    "freeDiagnosticsAvailable": true,
    "cghsEmpanelled": true,
    "danEmpanelled": false,
    "jsyAvailable": true,
    "echsEmpanelled": true,
    "generalBedsUsed": 584,
    "icuBedsUsed": 49,
    "privateRoomsUsed": 21,
    "doctors": [],
    "equipment": [
      {
        "name": "CT Scanner",
        "status": "AVAILABLE",
        "count": 3
      },
      {
        "name": "MRI Scanner",
        "status": "AVAILABLE",
        "count": 2
      },
      {
        "name": "ICU Ventilators",
        "status": "AVAILABLE",
        "count": 48
      },
      {
        "name": "Dialysis Machines",
        "status": "AVAILABLE",
        "count": 13
      },
      {
        "name": "Emergency Trauma OT",
        "status": "AVAILABLE",
        "count": 4
      }
    ],
    "specialists": [
      "General Medicine",
      "General Surgery",
      "Orthopaedics",
      "Cardiology",
      "Pediatrics",
      "Obstetrics & Gynaecology"
    ],
    "bloodStock": {
      "O+": 39,
      "O-": 10,
      "A+": 31,
      "A-": 7,
      "B+": 41,
      "B-": 10,
      "AB+": 20,
      "AB-": 5
    },
    "pmjayEmpanelled": true,
    "emergencyAvailable": true
  },
  {
    "id": "hosp-esic-okhla",
    "name": "ESIC Hospital Okhla",
    "type": "Government",
    "district": "South East Delhi",
    "state": "Delhi",
    "lat": 28.529,
    "lng": 77.279,
    "generalBeds": 350,
    "icuBeds": 30,
    "privateRooms": 15,
    "phone": "011-26814161",
    "city": "Delhi",
    "area": "Okhla Phase I",
    "address": "Sri Maa Anandmayee Marg Okhla Industrial Area Phase 1 New Delhi 110020",
    "rating": 4.1,
    "specialties": [
      "General Medicine",
      "Occupational Health",
      "General Surgery",
      "Orthopaedics",
      "Emergency Care"
    ],
    "schemes": [
      "ESIC Insured Scheme",
      "PM-JAY"
    ],
    "dakEmpanelled": false,
    "freeSurgeryEmpanelled": false,
    "freeDiagnosticsAvailable": true,
    "cghsEmpanelled": true,
    "danEmpanelled": false,
    "jsyAvailable": true,
    "echsEmpanelled": true,
    "generalBedsUsed": 311,
    "icuBedsUsed": 25,
    "privateRoomsUsed": 12,
    "doctors": [],
    "equipment": [
      {
        "name": "CT Scanner",
        "status": "AVAILABLE",
        "count": 1
      },
      {
        "name": "MRI Scanner",
        "status": "AVAILABLE",
        "count": 1
      },
      {
        "name": "ICU Ventilators",
        "status": "AVAILABLE",
        "count": 24
      },
      {
        "name": "Dialysis Machines",
        "status": "AVAILABLE",
        "count": 7
      },
      {
        "name": "Emergency Trauma OT",
        "status": "AVAILABLE",
        "count": 2
      }
    ],
    "specialists": [
      "General Medicine",
      "Occupational Health",
      "General Surgery",
      "Orthopaedics",
      "Emergency Care"
    ],
    "bloodStock": {
      "O+": 21,
      "O-": 5,
      "A+": 16,
      "A-": 4,
      "B+": 22,
      "B-": 5,
      "AB+": 11,
      "AB-": 2
    },
    "pmjayEmpanelled": true,
    "emergencyAvailable": true
  },
  {
    "id": "hosp-esic-jhilmil",
    "name": "ESIC Hospital Jhilmil",
    "type": "Government",
    "district": "Shahdara",
    "state": "Delhi",
    "lat": 28.675,
    "lng": 77.319,
    "generalBeds": 300,
    "icuBeds": 25,
    "privateRooms": 10,
    "phone": "011-22144833",
    "city": "Delhi",
    "area": "Jhilmil",
    "address": "Jhilmil Colony Shahdara Delhi 110095",
    "rating": 4,
    "specialties": [
      "General Medicine",
      "Surgery",
      "Pediatrics",
      "Obstetrics & Gynaecology",
      "Trauma Care"
    ],
    "schemes": [
      "ESIC Scheme",
      "PM-JAY"
    ],
    "dakEmpanelled": false,
    "freeSurgeryEmpanelled": false,
    "freeDiagnosticsAvailable": true,
    "cghsEmpanelled": true,
    "danEmpanelled": false,
    "jsyAvailable": true,
    "echsEmpanelled": true,
    "generalBedsUsed": 264,
    "icuBedsUsed": 21,
    "privateRoomsUsed": 8,
    "doctors": [],
    "equipment": [
      {
        "name": "CT Scanner",
        "status": "AVAILABLE",
        "count": 1
      },
      {
        "name": "MRI Scanner",
        "status": "AVAILABLE",
        "count": 1
      },
      {
        "name": "ICU Ventilators",
        "status": "AVAILABLE",
        "count": 20
      },
      {
        "name": "Dialysis Machines",
        "status": "AVAILABLE",
        "count": 6
      },
      {
        "name": "Emergency Trauma OT",
        "status": "AVAILABLE",
        "count": 2
      }
    ],
    "specialists": [
      "General Medicine",
      "Surgery",
      "Pediatrics",
      "Obstetrics & Gynaecology",
      "Trauma Care"
    ],
    "bloodStock": {
      "O+": 18,
      "O-": 4,
      "A+": 14,
      "A-": 3,
      "B+": 19,
      "B-": 4,
      "AB+": 9,
      "AB-": 2
    },
    "pmjayEmpanelled": true,
    "emergencyAvailable": true
  },
  {
    "id": "hosp-esic-rohini",
    "name": "ESIC Hospital Rohini Sector 15",
    "type": "Government",
    "district": "North West Delhi",
    "state": "Delhi",
    "lat": 28.729,
    "lng": 77.132,
    "generalBeds": 300,
    "icuBeds": 25,
    "privateRooms": 10,
    "phone": "011-27553050",
    "city": "Delhi",
    "area": "Rohini Sector 15",
    "address": "Sector 15 Rohini Delhi 110085",
    "rating": 4.1,
    "specialties": [
      "General Medicine",
      "Orthopaedics",
      "Pediatrics",
      "Gynecology",
      "ENT",
      "Ophthalmology"
    ],
    "schemes": [
      "ESIC Scheme",
      "PM-JAY"
    ],
    "dakEmpanelled": false,
    "freeSurgeryEmpanelled": false,
    "freeDiagnosticsAvailable": true,
    "cghsEmpanelled": true,
    "danEmpanelled": false,
    "jsyAvailable": true,
    "echsEmpanelled": true,
    "generalBedsUsed": 261,
    "icuBedsUsed": 21,
    "privateRoomsUsed": 8,
    "doctors": [],
    "equipment": [
      {
        "name": "CT Scanner",
        "status": "AVAILABLE",
        "count": 1
      },
      {
        "name": "MRI Scanner",
        "status": "AVAILABLE",
        "count": 1
      },
      {
        "name": "ICU Ventilators",
        "status": "AVAILABLE",
        "count": 20
      },
      {
        "name": "Dialysis Machines",
        "status": "AVAILABLE",
        "count": 6
      },
      {
        "name": "Emergency Trauma OT",
        "status": "AVAILABLE",
        "count": 2
      }
    ],
    "specialists": [
      "General Medicine",
      "Orthopaedics",
      "Pediatrics",
      "Gynecology",
      "ENT",
      "Ophthalmology"
    ],
    "bloodStock": {
      "O+": 18,
      "O-": 4,
      "A+": 14,
      "A-": 3,
      "B+": 19,
      "B-": 4,
      "AB+": 9,
      "AB-": 2
    },
    "pmjayEmpanelled": true,
    "emergencyAvailable": true
  },
  {
    "id": "hosp-lnjp-delhi",
    "name": "Lok Nayak Hospital (LNJP / MAMC)",
    "type": "Government",
    "district": "Central Delhi",
    "state": "Delhi",
    "lat": 28.6369,
    "lng": 77.2405,
    "generalBeds": 1800,
    "icuBeds": 180,
    "privateRooms": 20,
    "phone": "011-23233000",
    "city": "Delhi",
    "area": "Delhi Gate",
    "address": "Jawaharlal Nehru Marg Delhi Gate New Delhi 110002",
    "rating": 4.3,
    "specialties": [
      "General Medicine",
      "Pediatrics",
      "Obstetrics & Gynaecology",
      "Orthopaedics",
      "ENT",
      "Ophthalmology",
      "Dermatology"
    ],
    "schemes": [
      "Delhi Arogya Kosh (DAK)",
      "Delhi Free Surgery Scheme",
      "Delhi Free Diagnostics",
      "Delhi Arogya Nidhi (DAN)",
      "PM-JAY",
      "JSY",
      "RBSK",
      "NTEP"
    ],
    "dakEmpanelled": true,
    "freeSurgeryEmpanelled": true,
    "freeDiagnosticsAvailable": true,
    "cghsEmpanelled": true,
    "danEmpanelled": true,
    "jsyAvailable": true,
    "echsEmpanelled": false,
    "generalBedsUsed": 1548,
    "icuBedsUsed": 156,
    "privateRoomsUsed": 16,
    "doctors": [],
    "equipment": [
      {
        "name": "CT Scanner",
        "status": "AVAILABLE",
        "count": 9
      },
      {
        "name": "MRI Scanner",
        "status": "AVAILABLE",
        "count": 6
      },
      {
        "name": "ICU Ventilators",
        "status": "AVAILABLE",
        "count": 144
      },
      {
        "name": "Dialysis Machines",
        "status": "AVAILABLE",
        "count": 36
      },
      {
        "name": "Emergency Trauma OT",
        "status": "AVAILABLE",
        "count": 12
      }
    ],
    "specialists": [
      "General Medicine",
      "Pediatrics",
      "Obstetrics & Gynaecology",
      "Orthopaedics",
      "ENT",
      "Ophthalmology",
      "Dermatology"
    ],
    "bloodStock": {
      "O+": 108,
      "O-": 28,
      "A+": 86,
      "A-": 21,
      "B+": 115,
      "B-": 28,
      "AB+": 57,
      "AB-": 14
    },
    "pmjayEmpanelled": true,
    "emergencyAvailable": true
  },
  {
    "id": "hosp-gbpant-delhi",
    "name": "Govind Ballabh Pant Hospital (GIPMER)",
    "type": "Specialized",
    "district": "Central Delhi",
    "state": "Delhi",
    "lat": 28.6382,
    "lng": 77.2395,
    "generalBeds": 650,
    "icuBeds": 80,
    "privateRooms": 20,
    "phone": "011-23234242",
    "city": "Delhi",
    "area": "Rajghat / Delhi Gate",
    "address": "1 Jawaharlal Nehru Marg Near Delhi Gate New Delhi 110002",
    "rating": 4.6,
    "specialties": [
      "Cardiology",
      "Cardiothoracic Surgery",
      "Neurology",
      "Neurosurgery",
      "Gastroenterology",
      "GI Surgery",
      "Psychiatry"
    ],
    "schemes": [
      "Delhi Arogya Kosh (DAK)",
      "Delhi Free Surgery Scheme",
      "Delhi Free Diagnostics",
      "Delhi Arogya Nidhi (DAN)",
      "PM-JAY",
      "CGHS",
      "RAN"
    ],
    "dakEmpanelled": true,
    "freeSurgeryEmpanelled": true,
    "freeDiagnosticsAvailable": true,
    "cghsEmpanelled": true,
    "danEmpanelled": true,
    "jsyAvailable": false,
    "echsEmpanelled": true,
    "generalBedsUsed": 552,
    "icuBedsUsed": 70,
    "privateRoomsUsed": 17,
    "doctors": [],
    "equipment": [
      {
        "name": "CT Scanner",
        "status": "AVAILABLE",
        "count": 3
      },
      {
        "name": "MRI Scanner",
        "status": "AVAILABLE",
        "count": 2
      },
      {
        "name": "ICU Ventilators",
        "status": "AVAILABLE",
        "count": 64
      },
      {
        "name": "Dialysis Machines",
        "status": "AVAILABLE",
        "count": 13
      },
      {
        "name": "Emergency Trauma OT",
        "status": "AVAILABLE",
        "count": 4
      }
    ],
    "specialists": [
      "Cardiology",
      "Cardiothoracic Surgery",
      "Neurology",
      "Neurosurgery",
      "Gastroenterology",
      "GI Surgery",
      "Psychiatry"
    ],
    "bloodStock": {
      "O+": 39,
      "O-": 10,
      "A+": 31,
      "A-": 7,
      "B+": 41,
      "B-": 10,
      "AB+": 20,
      "AB-": 5
    },
    "pmjayEmpanelled": true,
    "emergencyAvailable": true
  },
  {
    "id": "hosp-gtb-delhi",
    "name": "Guru Teg Bahadur Hospital (GTB / UCMS)",
    "type": "Government",
    "district": "East Delhi",
    "state": "Delhi",
    "lat": 28.6837,
    "lng": 77.3106,
    "generalBeds": 1500,
    "icuBeds": 160,
    "privateRooms": 25,
    "phone": "011-22586262",
    "city": "Delhi",
    "area": "Dilshad Garden",
    "address": "Taharpur Road Dilshad Garden Delhi 110095",
    "rating": 4.3,
    "specialties": [
      "General Medicine",
      "General Surgery",
      "Orthopaedics",
      "Pediatrics",
      "Obstetrics & Gynaecology",
      "Neurosurgery",
      "Cardiology"
    ],
    "schemes": [
      "Delhi Arogya Kosh (DAK)",
      "Delhi Free Surgery Scheme",
      "Delhi Free Diagnostics",
      "Delhi Arogya Nidhi (DAN)",
      "PM-JAY",
      "JSY",
      "RBSK",
      "NTEP"
    ],
    "dakEmpanelled": true,
    "freeSurgeryEmpanelled": true,
    "freeDiagnosticsAvailable": true,
    "cghsEmpanelled": true,
    "danEmpanelled": true,
    "jsyAvailable": true,
    "echsEmpanelled": false,
    "generalBedsUsed": 1260,
    "icuBedsUsed": 142,
    "privateRoomsUsed": 20,
    "doctors": [],
    "equipment": [
      {
        "name": "CT Scanner",
        "status": "AVAILABLE",
        "count": 7
      },
      {
        "name": "MRI Scanner",
        "status": "AVAILABLE",
        "count": 5
      },
      {
        "name": "ICU Ventilators",
        "status": "AVAILABLE",
        "count": 128
      },
      {
        "name": "Dialysis Machines",
        "status": "AVAILABLE",
        "count": 30
      },
      {
        "name": "Emergency Trauma OT",
        "status": "AVAILABLE",
        "count": 10
      }
    ],
    "specialists": [
      "General Medicine",
      "General Surgery",
      "Orthopaedics",
      "Pediatrics",
      "Obstetrics & Gynaecology",
      "Neurosurgery",
      "Cardiology"
    ],
    "bloodStock": {
      "O+": 90,
      "O-": 24,
      "A+": 72,
      "A-": 18,
      "B+": 96,
      "B-": 24,
      "AB+": 48,
      "AB-": 12
    },
    "pmjayEmpanelled": true,
    "emergencyAvailable": true
  },
  {
    "id": "hosp-ddu-delhi",
    "name": "Deen Dayal Upadhyay Hospital (DDU)",
    "type": "Government",
    "district": "West Delhi",
    "state": "Delhi",
    "lat": 28.6275,
    "lng": 77.112,
    "generalBeds": 640,
    "icuBeds": 65,
    "privateRooms": 15,
    "phone": "011-25494401",
    "city": "Delhi",
    "area": "Hari Nagar",
    "address": "Clock Tower Hari Nagar New Delhi 110064",
    "rating": 4.2,
    "specialties": [
      "Trauma Care",
      "Orthopaedics",
      "General Surgery",
      "General Medicine",
      "Pediatrics",
      "Gynecology"
    ],
    "schemes": [
      "Delhi Arogya Kosh (DAK)",
      "Delhi Free Surgery Scheme",
      "Delhi Free Diagnostics",
      "Delhi Arogya Nidhi (DAN)",
      "PM-JAY",
      "JSY",
      "NTEP"
    ],
    "dakEmpanelled": true,
    "freeSurgeryEmpanelled": true,
    "freeDiagnosticsAvailable": true,
    "cghsEmpanelled": true,
    "danEmpanelled": true,
    "jsyAvailable": true,
    "echsEmpanelled": false,
    "generalBedsUsed": 588,
    "icuBedsUsed": 58,
    "privateRoomsUsed": 13,
    "doctors": [],
    "equipment": [
      {
        "name": "CT Scanner",
        "status": "AVAILABLE",
        "count": 3
      },
      {
        "name": "MRI Scanner",
        "status": "AVAILABLE",
        "count": 2
      },
      {
        "name": "ICU Ventilators",
        "status": "AVAILABLE",
        "count": 52
      },
      {
        "name": "Dialysis Machines",
        "status": "AVAILABLE",
        "count": 12
      },
      {
        "name": "Emergency Trauma OT",
        "status": "AVAILABLE",
        "count": 4
      }
    ],
    "specialists": [
      "Trauma Care",
      "Orthopaedics",
      "General Surgery",
      "General Medicine",
      "Pediatrics",
      "Gynecology"
    ],
    "bloodStock": {
      "O+": 37,
      "O-": 10,
      "A+": 30,
      "A-": 7,
      "B+": 40,
      "B-": 10,
      "AB+": 20,
      "AB-": 5
    },
    "pmjayEmpanelled": true,
    "emergencyAvailable": true
  },
  {
    "id": "hosp-bsa-rohini",
    "name": "Dr. Baba Saheb Ambedkar Hospital & Medical College",
    "type": "Government",
    "district": "North West Delhi",
    "state": "Delhi",
    "lat": 28.7125,
    "lng": 77.1185,
    "generalBeds": 540,
    "icuBeds": 60,
    "privateRooms": 15,
    "phone": "011-27055585",
    "city": "Delhi",
    "area": "Rohini Sector 6",
    "address": "Sector 6 Rohini Delhi 110085",
    "rating": 4.3,
    "specialties": [
      "General Medicine",
      "General Surgery",
      "Orthopaedics",
      "Pediatrics",
      "Obstetrics & Gynaecology",
      "Emergency"
    ],
    "schemes": [
      "Delhi Arogya Kosh (DAK)",
      "Delhi Free Surgery Scheme",
      "Delhi Free Diagnostics",
      "Delhi Arogya Nidhi (DAN)",
      "PM-JAY",
      "JSY",
      "RBSK",
      "NTEP"
    ],
    "dakEmpanelled": true,
    "freeSurgeryEmpanelled": true,
    "freeDiagnosticsAvailable": true,
    "cghsEmpanelled": true,
    "danEmpanelled": true,
    "jsyAvailable": true,
    "echsEmpanelled": false,
    "generalBedsUsed": 491,
    "icuBedsUsed": 54,
    "privateRoomsUsed": 12,
    "doctors": [],
    "equipment": [
      {
        "name": "CT Scanner",
        "status": "AVAILABLE",
        "count": 2
      },
      {
        "name": "MRI Scanner",
        "status": "AVAILABLE",
        "count": 1
      },
      {
        "name": "ICU Ventilators",
        "status": "AVAILABLE",
        "count": 48
      },
      {
        "name": "Dialysis Machines",
        "status": "AVAILABLE",
        "count": 10
      },
      {
        "name": "Emergency Trauma OT",
        "status": "AVAILABLE",
        "count": 3
      }
    ],
    "specialists": [
      "General Medicine",
      "General Surgery",
      "Orthopaedics",
      "Pediatrics",
      "Obstetrics & Gynaecology",
      "Emergency"
    ],
    "bloodStock": {
      "O+": 31,
      "O-": 8,
      "A+": 25,
      "A-": 6,
      "B+": 33,
      "B-": 8,
      "AB+": 16,
      "AB-": 4
    },
    "pmjayEmpanelled": true,
    "emergencyAvailable": true
  },
  {
    "id": "hosp-igh-dwarka",
    "name": "Indira Gandhi Hospital Dwarka",
    "type": "Government",
    "district": "South West Delhi",
    "state": "Delhi",
    "lat": 28.5828,
    "lng": 77.0622,
    "generalBeds": 1241,
    "icuBeds": 140,
    "privateRooms": 30,
    "phone": "011-28033100",
    "city": "Delhi",
    "area": "Dwarka Sector 9",
    "address": "Sector 9 Dwarka New Delhi 110077",
    "rating": 4.4,
    "specialties": [
      "Emergency",
      "Orthopaedics",
      "General Surgery",
      "Paediatrics",
      "Obstetrics & Gynaecology",
      "Cardiology",
      "Neurology"
    ],
    "schemes": [
      "Delhi Arogya Kosh (DAK)",
      "Delhi Free Surgery Scheme",
      "Delhi Free Diagnostics",
      "Delhi Arogya Nidhi (DAN)",
      "PM-JAY",
      "JSY",
      "RBSK",
      "NTEP"
    ],
    "dakEmpanelled": true,
    "freeSurgeryEmpanelled": true,
    "freeDiagnosticsAvailable": true,
    "cghsEmpanelled": true,
    "danEmpanelled": true,
    "jsyAvailable": true,
    "echsEmpanelled": false,
    "generalBedsUsed": 1116,
    "icuBedsUsed": 128,
    "privateRoomsUsed": 24,
    "doctors": [],
    "equipment": [
      {
        "name": "CT Scanner",
        "status": "AVAILABLE",
        "count": 6
      },
      {
        "name": "MRI Scanner",
        "status": "AVAILABLE",
        "count": 4
      },
      {
        "name": "ICU Ventilators",
        "status": "AVAILABLE",
        "count": 112
      },
      {
        "name": "Dialysis Machines",
        "status": "AVAILABLE",
        "count": 24
      },
      {
        "name": "Emergency Trauma OT",
        "status": "AVAILABLE",
        "count": 8
      }
    ],
    "specialists": [
      "Emergency",
      "Orthopaedics",
      "General Surgery",
      "Paediatrics",
      "Obstetrics & Gynaecology",
      "Cardiology",
      "Neurology"
    ],
    "bloodStock": {
      "O+": 73,
      "O-": 19,
      "A+": 58,
      "A-": 14,
      "B+": 78,
      "B-": 19,
      "AB+": 39,
      "AB-": 9
    },
    "pmjayEmpanelled": true,
    "emergencyAvailable": true
  },
  {
    "id": "hosp-sgm-mangolpuri",
    "name": "Sanjay Gandhi Memorial Hospital",
    "type": "Government",
    "district": "North West Delhi",
    "state": "Delhi",
    "lat": 28.6935,
    "lng": 77.089,
    "generalBeds": 600,
    "icuBeds": 60,
    "privateRooms": 15,
    "phone": "011-27900100",
    "city": "Delhi",
    "area": "Mangolpuri",
    "address": "S-Block Mangolpuri Delhi 110083",
    "rating": 4.1,
    "specialties": [
      "Emergency Trauma",
      "General Surgery",
      "Orthopaedics",
      "General Medicine",
      "Pediatrics",
      "Obstetrics & Gynaecology"
    ],
    "schemes": [
      "Delhi Arogya Kosh (DAK)",
      "Delhi Free Surgery Scheme",
      "Delhi Free Diagnostics",
      "PM-JAY",
      "JSY"
    ],
    "dakEmpanelled": true,
    "freeSurgeryEmpanelled": true,
    "freeDiagnosticsAvailable": true,
    "cghsEmpanelled": true,
    "danEmpanelled": true,
    "jsyAvailable": true,
    "echsEmpanelled": false,
    "generalBedsUsed": 534,
    "icuBedsUsed": 49,
    "privateRoomsUsed": 12,
    "doctors": [],
    "equipment": [
      {
        "name": "CT Scanner",
        "status": "AVAILABLE",
        "count": 3
      },
      {
        "name": "MRI Scanner",
        "status": "AVAILABLE",
        "count": 2
      },
      {
        "name": "ICU Ventilators",
        "status": "AVAILABLE",
        "count": 48
      },
      {
        "name": "Dialysis Machines",
        "status": "AVAILABLE",
        "count": 12
      },
      {
        "name": "Emergency Trauma OT",
        "status": "AVAILABLE",
        "count": 4
      }
    ],
    "specialists": [
      "Emergency Trauma",
      "General Surgery",
      "Orthopaedics",
      "General Medicine",
      "Pediatrics",
      "Obstetrics & Gynaecology"
    ],
    "bloodStock": {
      "O+": 36,
      "O-": 9,
      "A+": 28,
      "A-": 7,
      "B+": 38,
      "B-": 9,
      "AB+": 19,
      "AB-": 4
    },
    "pmjayEmpanelled": true,
    "emergencyAvailable": true
  },
  {
    "id": "hosp-rgssh-tahirpur",
    "name": "Rajiv Gandhi Super Speciality Hospital (RGSSH)",
    "type": "Specialized",
    "district": "East Delhi",
    "state": "Delhi",
    "lat": 28.6855,
    "lng": 77.318,
    "generalBeds": 650,
    "icuBeds": 80,
    "privateRooms": 40,
    "phone": "011-22890600",
    "city": "Delhi",
    "area": "Tahirpur / Dilshad Garden",
    "address": "Tahirpur Dilshad Garden Delhi 110093",
    "rating": 4.5,
    "specialties": [
      "Cardiology",
      "Cardiothoracic Surgery",
      "Gastroenterology",
      "Nephrology",
      "Urology",
      "Pulmonology",
      "Endocrinology"
    ],
    "schemes": [
      "Delhi Arogya Kosh (DAK)",
      "Delhi Free Surgery Scheme",
      "Delhi Free Diagnostics",
      "PM-JAY",
      "CGHS"
    ],
    "dakEmpanelled": true,
    "freeSurgeryEmpanelled": true,
    "freeDiagnosticsAvailable": true,
    "cghsEmpanelled": true,
    "danEmpanelled": true,
    "jsyAvailable": false,
    "echsEmpanelled": true,
    "generalBedsUsed": 572,
    "icuBedsUsed": 66,
    "privateRoomsUsed": 33,
    "doctors": [],
    "equipment": [
      {
        "name": "CT Scanner",
        "status": "AVAILABLE",
        "count": 3
      },
      {
        "name": "MRI Scanner",
        "status": "AVAILABLE",
        "count": 2
      },
      {
        "name": "ICU Ventilators",
        "status": "AVAILABLE",
        "count": 64
      },
      {
        "name": "Dialysis Machines",
        "status": "AVAILABLE",
        "count": 13
      },
      {
        "name": "Emergency Trauma OT",
        "status": "AVAILABLE",
        "count": 4
      }
    ],
    "specialists": [
      "Cardiology",
      "Cardiothoracic Surgery",
      "Gastroenterology",
      "Nephrology",
      "Urology",
      "Pulmonology",
      "Endocrinology"
    ],
    "bloodStock": {
      "O+": 39,
      "O-": 10,
      "A+": 31,
      "A-": 7,
      "B+": 41,
      "B-": 10,
      "AB+": 20,
      "AB-": 5
    },
    "pmjayEmpanelled": true,
    "emergencyAvailable": true
  },
  {
    "id": "hosp-dsci-delhi",
    "name": "Delhi State Cancer Institute (DSCI)",
    "type": "Specialized",
    "district": "East Delhi",
    "state": "Delhi",
    "lat": 28.684,
    "lng": 77.312,
    "generalBeds": 250,
    "icuBeds": 30,
    "privateRooms": 20,
    "phone": "011-22135200",
    "city": "Delhi",
    "area": "Dilshad Garden",
    "address": "GTB Hospital Complex Dilshad Garden Delhi 110095",
    "rating": 4.6,
    "specialties": [
      "Radiation Oncology",
      "Medical Oncology",
      "Surgical Oncology",
      "Nuclear Medicine",
      "Palliative Care",
      "PET-CT"
    ],
    "schemes": [
      "Delhi Arogya Kosh (DAK)",
      "Delhi Free Surgery Scheme",
      "Delhi Free Diagnostics",
      "PM-JAY Cancer Cover",
      "CGHS",
      "RAN Cancer Aid"
    ],
    "dakEmpanelled": true,
    "freeSurgeryEmpanelled": true,
    "freeDiagnosticsAvailable": true,
    "cghsEmpanelled": true,
    "danEmpanelled": true,
    "jsyAvailable": false,
    "echsEmpanelled": true,
    "generalBedsUsed": 217,
    "icuBedsUsed": 25,
    "privateRoomsUsed": 16,
    "doctors": [],
    "equipment": [
      {
        "name": "CT Scanner",
        "status": "AVAILABLE",
        "count": 1
      },
      {
        "name": "MRI Scanner",
        "status": "AVAILABLE",
        "count": 1
      },
      {
        "name": "ICU Ventilators",
        "status": "AVAILABLE",
        "count": 24
      },
      {
        "name": "Dialysis Machines",
        "status": "AVAILABLE",
        "count": 5
      },
      {
        "name": "Emergency Trauma OT",
        "status": "AVAILABLE",
        "count": 2
      }
    ],
    "specialists": [
      "Radiation Oncology",
      "Medical Oncology",
      "Surgical Oncology",
      "Nuclear Medicine",
      "Palliative Care",
      "PET-CT"
    ],
    "bloodStock": {
      "O+": 15,
      "O-": 4,
      "A+": 12,
      "A-": 3,
      "B+": 16,
      "B-": 4,
      "AB+": 8,
      "AB-": 2
    },
    "pmjayEmpanelled": true,
    "emergencyAvailable": true
  },
  {
    "id": "hosp-jssh-janakpuri",
    "name": "Janakpuri Super Speciality Hospital (JSSH)",
    "type": "Specialized",
    "district": "West Delhi",
    "state": "Delhi",
    "lat": 28.621,
    "lng": 77.085,
    "generalBeds": 300,
    "icuBeds": 40,
    "privateRooms": 25,
    "phone": "011-28236500",
    "city": "Delhi",
    "area": "Janakpuri C-2B",
    "address": "C-2B Janakpuri New Delhi 110058",
    "rating": 4.4,
    "specialties": [
      "Cardiology",
      "Neurology",
      "Gastroenterology",
      "Nephrology",
      "Dialysis",
      "Endocrinology"
    ],
    "schemes": [
      "Delhi Arogya Kosh (DAK)",
      "Delhi Free Surgery Scheme",
      "Delhi Free Diagnostics",
      "PM-JAY",
      "Free Dialysis"
    ],
    "dakEmpanelled": true,
    "freeSurgeryEmpanelled": true,
    "freeDiagnosticsAvailable": true,
    "cghsEmpanelled": true,
    "danEmpanelled": true,
    "jsyAvailable": false,
    "echsEmpanelled": true,
    "generalBedsUsed": 258,
    "icuBedsUsed": 34,
    "privateRoomsUsed": 21,
    "doctors": [],
    "equipment": [
      {
        "name": "CT Scanner",
        "status": "AVAILABLE",
        "count": 1
      },
      {
        "name": "MRI Scanner",
        "status": "AVAILABLE",
        "count": 1
      },
      {
        "name": "ICU Ventilators",
        "status": "AVAILABLE",
        "count": 32
      },
      {
        "name": "Dialysis Machines",
        "status": "AVAILABLE",
        "count": 6
      },
      {
        "name": "Emergency Trauma OT",
        "status": "AVAILABLE",
        "count": 2
      }
    ],
    "specialists": [
      "Cardiology",
      "Neurology",
      "Gastroenterology",
      "Nephrology",
      "Dialysis",
      "Endocrinology"
    ],
    "bloodStock": {
      "O+": 18,
      "O-": 4,
      "A+": 14,
      "A-": 3,
      "B+": 19,
      "B-": 4,
      "AB+": 9,
      "AB-": 2
    },
    "pmjayEmpanelled": true,
    "emergencyAvailable": true
  },
  {
    "id": "hosp-burari-delhi",
    "name": "Burari Hospital",
    "type": "Government",
    "district": "North Delhi",
    "state": "Delhi",
    "lat": 28.752,
    "lng": 77.195,
    "generalBeds": 800,
    "icuBeds": 80,
    "privateRooms": 20,
    "phone": "011-27618000",
    "city": "Delhi",
    "area": "Burari",
    "address": "Kaushik Enclave Burari Delhi 110084",
    "rating": 4.2,
    "specialties": [
      "General Medicine",
      "General Surgery",
      "Orthopaedics",
      "Pediatrics",
      "Obstetrics & Gynaecology",
      "ICU Care"
    ],
    "schemes": [
      "Delhi Arogya Kosh (DAK)",
      "Delhi Free Surgery Scheme",
      "Delhi Free Diagnostics",
      "PM-JAY",
      "JSY"
    ],
    "dakEmpanelled": true,
    "freeSurgeryEmpanelled": true,
    "freeDiagnosticsAvailable": true,
    "cghsEmpanelled": true,
    "danEmpanelled": true,
    "jsyAvailable": true,
    "echsEmpanelled": false,
    "generalBedsUsed": 680,
    "icuBedsUsed": 68,
    "privateRoomsUsed": 16,
    "doctors": [],
    "equipment": [
      {
        "name": "CT Scanner",
        "status": "AVAILABLE",
        "count": 4
      },
      {
        "name": "MRI Scanner",
        "status": "AVAILABLE",
        "count": 2
      },
      {
        "name": "ICU Ventilators",
        "status": "AVAILABLE",
        "count": 64
      },
      {
        "name": "Dialysis Machines",
        "status": "AVAILABLE",
        "count": 16
      },
      {
        "name": "Emergency Trauma OT",
        "status": "AVAILABLE",
        "count": 5
      }
    ],
    "specialists": [
      "General Medicine",
      "General Surgery",
      "Orthopaedics",
      "Pediatrics",
      "Obstetrics & Gynaecology",
      "ICU Care"
    ],
    "bloodStock": {
      "O+": 48,
      "O-": 12,
      "A+": 38,
      "A-": 9,
      "B+": 51,
      "B-": 12,
      "AB+": 25,
      "AB-": 6
    },
    "pmjayEmpanelled": true,
    "emergencyAvailable": true
  },
  {
    "id": "hosp-ambedkar-nagar",
    "name": "Ambedkar Nagar Hospital",
    "type": "Government",
    "district": "South Delhi",
    "state": "Delhi",
    "lat": 28.518,
    "lng": 77.234,
    "generalBeds": 600,
    "icuBeds": 60,
    "privateRooms": 15,
    "phone": "011-29965000",
    "city": "Delhi",
    "area": "Dakshinpuri",
    "address": "Sector 5 Dakshinpuri Ambedkar Nagar New Delhi 110062",
    "rating": 4.2,
    "specialties": [
      "General Medicine",
      "General Surgery",
      "Pediatrics",
      "Obstetrics & Gynaecology",
      "Orthopaedics",
      "Emergency Trauma"
    ],
    "schemes": [
      "Delhi Arogya Kosh (DAK)",
      "Delhi Free Surgery Scheme",
      "Delhi Free Diagnostics",
      "PM-JAY",
      "JSY"
    ],
    "dakEmpanelled": true,
    "freeSurgeryEmpanelled": true,
    "freeDiagnosticsAvailable": true,
    "cghsEmpanelled": true,
    "danEmpanelled": true,
    "jsyAvailable": true,
    "echsEmpanelled": false,
    "generalBedsUsed": 504,
    "icuBedsUsed": 52,
    "privateRoomsUsed": 13,
    "doctors": [],
    "equipment": [
      {
        "name": "CT Scanner",
        "status": "AVAILABLE",
        "count": 3
      },
      {
        "name": "MRI Scanner",
        "status": "AVAILABLE",
        "count": 2
      },
      {
        "name": "ICU Ventilators",
        "status": "AVAILABLE",
        "count": 48
      },
      {
        "name": "Dialysis Machines",
        "status": "AVAILABLE",
        "count": 12
      },
      {
        "name": "Emergency Trauma OT",
        "status": "AVAILABLE",
        "count": 4
      }
    ],
    "specialists": [
      "General Medicine",
      "General Surgery",
      "Pediatrics",
      "Obstetrics & Gynaecology",
      "Orthopaedics",
      "Emergency Trauma"
    ],
    "bloodStock": {
      "O+": 36,
      "O-": 9,
      "A+": 28,
      "A-": 7,
      "B+": 38,
      "B-": 9,
      "AB+": 19,
      "AB-": 4
    },
    "pmjayEmpanelled": true,
    "emergencyAvailable": true
  },
  {
    "id": "hosp-ggsg-raghubir",
    "name": "Guru Gobind Singh Govt Hospital",
    "type": "Government",
    "district": "West Delhi",
    "state": "Delhi",
    "lat": 28.648,
    "lng": 77.108,
    "generalBeds": 350,
    "icuBeds": 30,
    "privateRooms": 10,
    "phone": "011-25988500",
    "city": "Delhi",
    "area": "Raghubir Nagar",
    "address": "Raghubir Nagar Near Tagore Garden New Delhi 110027",
    "rating": 4.1,
    "specialties": [
      "General Medicine",
      "General Surgery",
      "Pediatrics",
      "Gynecology",
      "Orthopaedics",
      "Emergency"
    ],
    "schemes": [
      "Delhi Arogya Kosh (DAK)",
      "Delhi Free Diagnostics",
      "Delhi Free Surgery Scheme",
      "PM-JAY",
      "JSY"
    ],
    "dakEmpanelled": true,
    "freeSurgeryEmpanelled": true,
    "freeDiagnosticsAvailable": true,
    "cghsEmpanelled": true,
    "danEmpanelled": true,
    "jsyAvailable": true,
    "echsEmpanelled": false,
    "generalBedsUsed": 322,
    "icuBedsUsed": 26,
    "privateRoomsUsed": 8,
    "doctors": [],
    "equipment": [
      {
        "name": "CT Scanner",
        "status": "AVAILABLE",
        "count": 1
      },
      {
        "name": "MRI Scanner",
        "status": "AVAILABLE",
        "count": 1
      },
      {
        "name": "ICU Ventilators",
        "status": "AVAILABLE",
        "count": 24
      },
      {
        "name": "Dialysis Machines",
        "status": "AVAILABLE",
        "count": 7
      },
      {
        "name": "Emergency Trauma OT",
        "status": "AVAILABLE",
        "count": 2
      }
    ],
    "specialists": [
      "General Medicine",
      "General Surgery",
      "Pediatrics",
      "Gynecology",
      "Orthopaedics",
      "Emergency"
    ],
    "bloodStock": {
      "O+": 21,
      "O-": 5,
      "A+": 16,
      "A-": 4,
      "B+": 22,
      "B-": 5,
      "AB+": 11,
      "AB-": 2
    },
    "pmjayEmpanelled": true,
    "emergencyAvailable": true
  },
  {
    "id": "hosp-lbs-khichripur",
    "name": "Lal Bahadur Shastri Hospital (LBS)",
    "type": "Government",
    "district": "East Delhi",
    "state": "Delhi",
    "lat": 28.621,
    "lng": 77.319,
    "generalBeds": 400,
    "icuBeds": 35,
    "privateRooms": 10,
    "phone": "011-22774145",
    "city": "Delhi",
    "area": "Khichripur / Mayur Vihar Phase II",
    "address": "Khichripur Near Kalyanpuri Delhi 110091",
    "rating": 4.1,
    "specialties": [
      "General Medicine",
      "General Surgery",
      "Obstetrics & Gynaecology",
      "Pediatrics",
      "Emergency Trauma",
      "Eye Care"
    ],
    "schemes": [
      "Delhi Arogya Kosh (DAK)",
      "Delhi Free Surgery Scheme",
      "Delhi Free Diagnostics",
      "PM-JAY",
      "JSY"
    ],
    "dakEmpanelled": true,
    "freeSurgeryEmpanelled": true,
    "freeDiagnosticsAvailable": true,
    "cghsEmpanelled": true,
    "danEmpanelled": true,
    "jsyAvailable": true,
    "echsEmpanelled": false,
    "generalBedsUsed": 363,
    "icuBedsUsed": 31,
    "privateRoomsUsed": 8,
    "doctors": [],
    "equipment": [
      {
        "name": "CT Scanner",
        "status": "AVAILABLE",
        "count": 2
      },
      {
        "name": "MRI Scanner",
        "status": "AVAILABLE",
        "count": 1
      },
      {
        "name": "ICU Ventilators",
        "status": "AVAILABLE",
        "count": 28
      },
      {
        "name": "Dialysis Machines",
        "status": "AVAILABLE",
        "count": 8
      },
      {
        "name": "Emergency Trauma OT",
        "status": "AVAILABLE",
        "count": 2
      }
    ],
    "specialists": [
      "General Medicine",
      "General Surgery",
      "Obstetrics & Gynaecology",
      "Pediatrics",
      "Emergency Trauma",
      "Eye Care"
    ],
    "bloodStock": {
      "O+": 24,
      "O-": 6,
      "A+": 19,
      "A-": 4,
      "B+": 25,
      "B-": 6,
      "AB+": 12,
      "AB-": 3
    },
    "pmjayEmpanelled": true,
    "emergencyAvailable": true
  },
  {
    "id": "hosp-bjrm-jahangirpuri",
    "name": "Babu Jagjivan Ram Memorial Hospital",
    "type": "Government",
    "district": "North West Delhi",
    "state": "Delhi",
    "lat": 28.729,
    "lng": 77.168,
    "generalBeds": 300,
    "icuBeds": 25,
    "privateRooms": 10,
    "phone": "011-27631800",
    "city": "Delhi",
    "area": "Jahangirpuri",
    "address": "E-Block Jahangirpuri Delhi 110033",
    "rating": 4,
    "specialties": [
      "Emergency Trauma",
      "General Medicine",
      "Surgery",
      "Pediatrics",
      "Gynecology",
      "Orthopaedics"
    ],
    "schemes": [
      "Delhi Arogya Kosh (DAK)",
      "Delhi Free Surgery Scheme",
      "Delhi Free Diagnostics",
      "PM-JAY",
      "JSY"
    ],
    "dakEmpanelled": true,
    "freeSurgeryEmpanelled": true,
    "freeDiagnosticsAvailable": true,
    "cghsEmpanelled": true,
    "danEmpanelled": true,
    "jsyAvailable": true,
    "echsEmpanelled": false,
    "generalBedsUsed": 270,
    "icuBedsUsed": 22,
    "privateRoomsUsed": 8,
    "doctors": [],
    "equipment": [
      {
        "name": "CT Scanner",
        "status": "AVAILABLE",
        "count": 1
      },
      {
        "name": "MRI Scanner",
        "status": "AVAILABLE",
        "count": 1
      },
      {
        "name": "ICU Ventilators",
        "status": "AVAILABLE",
        "count": 20
      },
      {
        "name": "Dialysis Machines",
        "status": "AVAILABLE",
        "count": 6
      },
      {
        "name": "Emergency Trauma OT",
        "status": "AVAILABLE",
        "count": 2
      }
    ],
    "specialists": [
      "Emergency Trauma",
      "General Medicine",
      "Surgery",
      "Pediatrics",
      "Gynecology",
      "Orthopaedics"
    ],
    "bloodStock": {
      "O+": 18,
      "O-": 4,
      "A+": 14,
      "A-": 3,
      "B+": 19,
      "B-": 4,
      "AB+": 9,
      "AB-": 2
    },
    "pmjayEmpanelled": true,
    "emergencyAvailable": true
  },
  {
    "id": "hosp-bmh-pitampura",
    "name": "Bhagwan Mahavir Hospital",
    "type": "Government",
    "district": "North West Delhi",
    "state": "Delhi",
    "lat": 28.698,
    "lng": 77.121,
    "generalBeds": 300,
    "icuBeds": 25,
    "privateRooms": 10,
    "phone": "011-27034455",
    "city": "Delhi",
    "area": "Pitampura",
    "address": "H-4/5 Guru Harkishan Marg Pitampura Delhi 110034",
    "rating": 4.1,
    "specialties": [
      "General Medicine",
      "Pediatrics",
      "Gynecology",
      "General Surgery",
      "Orthopaedics",
      "ENT"
    ],
    "schemes": [
      "Delhi Arogya Kosh (DAK)",
      "Delhi Free Surgery Scheme",
      "Delhi Free Diagnostics",
      "PM-JAY",
      "JSY"
    ],
    "dakEmpanelled": true,
    "freeSurgeryEmpanelled": true,
    "freeDiagnosticsAvailable": true,
    "cghsEmpanelled": true,
    "danEmpanelled": true,
    "jsyAvailable": true,
    "echsEmpanelled": false,
    "generalBedsUsed": 267,
    "icuBedsUsed": 22,
    "privateRoomsUsed": 8,
    "doctors": [],
    "equipment": [
      {
        "name": "CT Scanner",
        "status": "AVAILABLE",
        "count": 1
      },
      {
        "name": "MRI Scanner",
        "status": "AVAILABLE",
        "count": 1
      },
      {
        "name": "ICU Ventilators",
        "status": "AVAILABLE",
        "count": 20
      },
      {
        "name": "Dialysis Machines",
        "status": "AVAILABLE",
        "count": 6
      },
      {
        "name": "Emergency Trauma OT",
        "status": "AVAILABLE",
        "count": 2
      }
    ],
    "specialists": [
      "General Medicine",
      "Pediatrics",
      "Gynecology",
      "General Surgery",
      "Orthopaedics",
      "ENT"
    ],
    "bloodStock": {
      "O+": 18,
      "O-": 4,
      "A+": 14,
      "A-": 3,
      "B+": 19,
      "B-": 4,
      "AB+": 9,
      "AB-": 2
    },
    "pmjayEmpanelled": true,
    "emergencyAvailable": true
  },
  {
    "id": "hosp-mvh-poothkhurd",
    "name": "Maharishi Valmiki Hospital",
    "type": "Government",
    "district": "North West Delhi",
    "state": "Delhi",
    "lat": 28.775,
    "lng": 77.042,
    "generalBeds": 300,
    "icuBeds": 25,
    "privateRooms": 10,
    "phone": "011-27761520",
    "city": "Delhi",
    "area": "Pooth Khurd / Bawana",
    "address": "Pooth Khurd Bawana Road Delhi 110039",
    "rating": 4,
    "specialties": [
      "General Medicine",
      "General Surgery",
      "Orthopaedics",
      "Emergency Trauma",
      "Pediatrics",
      "Maternal Health"
    ],
    "schemes": [
      "Delhi Arogya Kosh (DAK)",
      "Delhi Free Surgery Scheme",
      "Delhi Free Diagnostics",
      "PM-JAY",
      "JSY"
    ],
    "dakEmpanelled": true,
    "freeSurgeryEmpanelled": true,
    "freeDiagnosticsAvailable": true,
    "cghsEmpanelled": true,
    "danEmpanelled": true,
    "jsyAvailable": true,
    "echsEmpanelled": false,
    "generalBedsUsed": 264,
    "icuBedsUsed": 23,
    "privateRoomsUsed": 8,
    "doctors": [],
    "equipment": [
      {
        "name": "CT Scanner",
        "status": "AVAILABLE",
        "count": 1
      },
      {
        "name": "MRI Scanner",
        "status": "AVAILABLE",
        "count": 1
      },
      {
        "name": "ICU Ventilators",
        "status": "AVAILABLE",
        "count": 20
      },
      {
        "name": "Dialysis Machines",
        "status": "AVAILABLE",
        "count": 6
      },
      {
        "name": "Emergency Trauma OT",
        "status": "AVAILABLE",
        "count": 2
      }
    ],
    "specialists": [
      "General Medicine",
      "General Surgery",
      "Orthopaedics",
      "Emergency Trauma",
      "Pediatrics",
      "Maternal Health"
    ],
    "bloodStock": {
      "O+": 18,
      "O-": 4,
      "A+": 14,
      "A-": 3,
      "B+": 19,
      "B-": 4,
      "AB+": 9,
      "AB-": 2
    },
    "pmjayEmpanelled": true,
    "emergencyAvailable": true
  },
  {
    "id": "hosp-dcbb-ashokvihar",
    "name": "Deep Chand Bandhu Hospital",
    "type": "Government",
    "district": "North Delhi",
    "state": "Delhi",
    "lat": 28.689,
    "lng": 77.172,
    "generalBeds": 300,
    "icuBeds": 25,
    "privateRooms": 10,
    "phone": "011-27305952",
    "city": "Delhi",
    "area": "Ashok Vihar Phase IV",
    "address": "Kokiwala Bagh Ashok Vihar Phase IV Delhi 110052",
    "rating": 4.1,
    "specialties": [
      "General Medicine",
      "Pediatrics",
      "Obstetrics & Gynaecology",
      "General Surgery",
      "Eye Care",
      "Dental"
    ],
    "schemes": [
      "Delhi Arogya Kosh (DAK)",
      "Delhi Free Surgery Scheme",
      "Delhi Free Diagnostics",
      "PM-JAY",
      "JSY"
    ],
    "dakEmpanelled": true,
    "freeSurgeryEmpanelled": true,
    "freeDiagnosticsAvailable": true,
    "cghsEmpanelled": true,
    "danEmpanelled": true,
    "jsyAvailable": true,
    "echsEmpanelled": false,
    "generalBedsUsed": 261,
    "icuBedsUsed": 20,
    "privateRoomsUsed": 8,
    "doctors": [],
    "equipment": [
      {
        "name": "CT Scanner",
        "status": "AVAILABLE",
        "count": 1
      },
      {
        "name": "MRI Scanner",
        "status": "AVAILABLE",
        "count": 1
      },
      {
        "name": "ICU Ventilators",
        "status": "AVAILABLE",
        "count": 20
      },
      {
        "name": "Dialysis Machines",
        "status": "AVAILABLE",
        "count": 6
      },
      {
        "name": "Emergency Trauma OT",
        "status": "AVAILABLE",
        "count": 2
      }
    ],
    "specialists": [
      "General Medicine",
      "Pediatrics",
      "Obstetrics & Gynaecology",
      "General Surgery",
      "Eye Care",
      "Dental"
    ],
    "bloodStock": {
      "O+": 18,
      "O-": 4,
      "A+": 14,
      "A-": 3,
      "B+": 19,
      "B-": 4,
      "AB+": 9,
      "AB-": 2
    },
    "pmjayEmpanelled": true,
    "emergencyAvailable": true
  },
  {
    "id": "hosp-aruna-civillines",
    "name": "Aruna Asaf Ali Govt Hospital",
    "type": "Government",
    "district": "Central Delhi",
    "state": "Delhi",
    "lat": 28.671,
    "lng": 77.221,
    "generalBeds": 150,
    "icuBeds": 15,
    "privateRooms": 8,
    "phone": "011-23965582",
    "city": "Delhi",
    "area": "Civil Lines / Rajpur Road",
    "address": "5 Rajpur Road Civil Lines Delhi 110054",
    "rating": 4.1,
    "specialties": [
      "General Medicine",
      "General Surgery",
      "Orthopaedics",
      "Pediatrics",
      "Gynecology",
      "Emergency"
    ],
    "schemes": [
      "Delhi Arogya Kosh (DAK)",
      "Delhi Free Diagnostics",
      "Delhi Free Surgery Scheme",
      "PM-JAY",
      "JSY"
    ],
    "dakEmpanelled": true,
    "freeSurgeryEmpanelled": true,
    "freeDiagnosticsAvailable": true,
    "cghsEmpanelled": true,
    "danEmpanelled": true,
    "jsyAvailable": true,
    "echsEmpanelled": false,
    "generalBedsUsed": 129,
    "icuBedsUsed": 12,
    "privateRoomsUsed": 6,
    "doctors": [],
    "equipment": [
      {
        "name": "CT Scanner",
        "status": "AVAILABLE",
        "count": 1
      },
      {
        "name": "MRI Scanner",
        "status": "AVAILABLE",
        "count": 1
      },
      {
        "name": "ICU Ventilators",
        "status": "AVAILABLE",
        "count": 12
      },
      {
        "name": "Dialysis Machines",
        "status": "AVAILABLE",
        "count": 4
      },
      {
        "name": "Emergency Trauma OT",
        "status": "AVAILABLE",
        "count": 2
      }
    ],
    "specialists": [
      "General Medicine",
      "General Surgery",
      "Orthopaedics",
      "Pediatrics",
      "Gynecology",
      "Emergency"
    ],
    "bloodStock": {
      "O+": 9,
      "O-": 2,
      "A+": 7,
      "A-": 2,
      "B+": 9,
      "B-": 2,
      "AB+": 4,
      "AB-": 1
    },
    "pmjayEmpanelled": true,
    "emergencyAvailable": true
  },
  {
    "id": "hosp-srhc-narela",
    "name": "Satyawadi Raja Harish Chandra Hospital",
    "type": "Government",
    "district": "North Delhi",
    "state": "Delhi",
    "lat": 28.845,
    "lng": 77.098,
    "generalBeds": 300,
    "icuBeds": 25,
    "privateRooms": 10,
    "phone": "011-27783261",
    "city": "Delhi",
    "area": "Narela",
    "address": "Plot No 30 Sector A-7 Narela Delhi 110040",
    "rating": 4,
    "specialties": [
      "General Medicine",
      "Surgery",
      "Orthopaedics",
      "Pediatrics",
      "Obstetrics & Gynaecology",
      "Emergency"
    ],
    "schemes": [
      "Delhi Arogya Kosh (DAK)",
      "Delhi Free Surgery Scheme",
      "Delhi Free Diagnostics",
      "PM-JAY",
      "JSY"
    ],
    "dakEmpanelled": true,
    "freeSurgeryEmpanelled": true,
    "freeDiagnosticsAvailable": true,
    "cghsEmpanelled": true,
    "danEmpanelled": true,
    "jsyAvailable": true,
    "echsEmpanelled": false,
    "generalBedsUsed": 255,
    "icuBedsUsed": 21,
    "privateRoomsUsed": 8,
    "doctors": [],
    "equipment": [
      {
        "name": "CT Scanner",
        "status": "AVAILABLE",
        "count": 1
      },
      {
        "name": "MRI Scanner",
        "status": "AVAILABLE",
        "count": 1
      },
      {
        "name": "ICU Ventilators",
        "status": "AVAILABLE",
        "count": 20
      },
      {
        "name": "Dialysis Machines",
        "status": "AVAILABLE",
        "count": 6
      },
      {
        "name": "Emergency Trauma OT",
        "status": "AVAILABLE",
        "count": 2
      }
    ],
    "specialists": [
      "General Medicine",
      "Surgery",
      "Orthopaedics",
      "Pediatrics",
      "Obstetrics & Gynaecology",
      "Emergency"
    ],
    "bloodStock": {
      "O+": 18,
      "O-": 4,
      "A+": 14,
      "A-": 3,
      "B+": 19,
      "B-": 4,
      "AB+": 9,
      "AB-": 2
    },
    "pmjayEmpanelled": true,
    "emergencyAvailable": true
  },
  {
    "id": "hosp-rtrm-najafgarh",
    "name": "Rao Tula Ram Memorial Hospital (RTRM)",
    "type": "Government",
    "district": "South West Delhi",
    "state": "Delhi",
    "lat": 28.5412,
    "lng": 76.9275,
    "generalBeds": 200,
    "icuBeds": 20,
    "privateRooms": 8,
    "phone": "011-25018661",
    "city": "Delhi",
    "area": "Jaffarpur Kalan / Najafgarh",
    "address": "Jaffarpur Kalan Najafgarh Delhi 110073",
    "rating": 4,
    "specialties": [
      "General Medicine",
      "Emergency Trauma",
      "Maternal & Child Health",
      "General Surgery",
      "Orthopaedics"
    ],
    "schemes": [
      "Delhi Arogya Kosh (DAK)",
      "Delhi Free Surgery Scheme",
      "Delhi Free Diagnostics",
      "PM-JAY",
      "JSY"
    ],
    "dakEmpanelled": true,
    "freeSurgeryEmpanelled": true,
    "freeDiagnosticsAvailable": true,
    "cghsEmpanelled": true,
    "danEmpanelled": true,
    "jsyAvailable": true,
    "echsEmpanelled": false,
    "generalBedsUsed": 168,
    "icuBedsUsed": 17,
    "privateRoomsUsed": 6,
    "doctors": [],
    "equipment": [
      {
        "name": "CT Scanner",
        "status": "AVAILABLE",
        "count": 1
      },
      {
        "name": "MRI Scanner",
        "status": "AVAILABLE",
        "count": 1
      },
      {
        "name": "ICU Ventilators",
        "status": "AVAILABLE",
        "count": 16
      },
      {
        "name": "Dialysis Machines",
        "status": "AVAILABLE",
        "count": 4
      },
      {
        "name": "Emergency Trauma OT",
        "status": "AVAILABLE",
        "count": 2
      }
    ],
    "specialists": [
      "General Medicine",
      "Emergency Trauma",
      "Maternal & Child Health",
      "General Surgery",
      "Orthopaedics"
    ],
    "bloodStock": {
      "O+": 12,
      "O-": 3,
      "A+": 9,
      "A-": 2,
      "B+": 12,
      "B-": 3,
      "AB+": 6,
      "AB-": 1
    },
    "pmjayEmpanelled": true,
    "emergencyAvailable": true
  },
  {
    "id": "hosp-svbp-patelnagar",
    "name": "Sardar Vallabh Bhai Patel Hospital",
    "type": "Government",
    "district": "West Delhi",
    "state": "Delhi",
    "lat": 28.654,
    "lng": 77.162,
    "generalBeds": 200,
    "icuBeds": 18,
    "privateRooms": 8,
    "phone": "011-25881452",
    "city": "Delhi",
    "area": "East Patel Nagar",
    "address": "East Patel Nagar New Delhi 110008",
    "rating": 4.1,
    "specialties": [
      "General Medicine",
      "Pediatrics",
      "Gynecology",
      "General Surgery",
      "Orthopaedics",
      "Emergency"
    ],
    "schemes": [
      "Delhi Arogya Kosh (DAK)",
      "Delhi Free Diagnostics",
      "PM-JAY",
      "JSY"
    ],
    "dakEmpanelled": true,
    "freeSurgeryEmpanelled": true,
    "freeDiagnosticsAvailable": true,
    "cghsEmpanelled": true,
    "danEmpanelled": true,
    "jsyAvailable": true,
    "echsEmpanelled": false,
    "generalBedsUsed": 184,
    "icuBedsUsed": 15,
    "privateRoomsUsed": 6,
    "doctors": [],
    "equipment": [
      {
        "name": "CT Scanner",
        "status": "AVAILABLE",
        "count": 1
      },
      {
        "name": "MRI Scanner",
        "status": "AVAILABLE",
        "count": 1
      },
      {
        "name": "ICU Ventilators",
        "status": "AVAILABLE",
        "count": 14
      },
      {
        "name": "Dialysis Machines",
        "status": "AVAILABLE",
        "count": 4
      },
      {
        "name": "Emergency Trauma OT",
        "status": "AVAILABLE",
        "count": 2
      }
    ],
    "specialists": [
      "General Medicine",
      "Pediatrics",
      "Gynecology",
      "General Surgery",
      "Orthopaedics",
      "Emergency"
    ],
    "bloodStock": {
      "O+": 12,
      "O-": 3,
      "A+": 9,
      "A-": 2,
      "B+": 12,
      "B-": 3,
      "AB+": 6,
      "AB-": 1
    },
    "pmjayEmpanelled": true,
    "emergencyAvailable": true
  },
  {
    "id": "hosp-abg-motinagar",
    "name": "Acharyashree Bhikshu Govt Hospital",
    "type": "Government",
    "district": "West Delhi",
    "state": "Delhi",
    "lat": 28.662,
    "lng": 77.142,
    "generalBeds": 250,
    "icuBeds": 20,
    "privateRooms": 8,
    "phone": "011-25455955",
    "city": "Delhi",
    "area": "Moti Nagar",
    "address": "Near Zakhira Flyover Moti Nagar New Delhi 110015",
    "rating": 4,
    "specialties": [
      "General Medicine",
      "General Surgery",
      "Pediatrics",
      "Gynecology",
      "Orthopaedics",
      "Emergency"
    ],
    "schemes": [
      "Delhi Arogya Kosh (DAK)",
      "Delhi Free Diagnostics",
      "PM-JAY",
      "JSY"
    ],
    "dakEmpanelled": true,
    "freeSurgeryEmpanelled": true,
    "freeDiagnosticsAvailable": true,
    "cghsEmpanelled": true,
    "danEmpanelled": true,
    "jsyAvailable": true,
    "echsEmpanelled": false,
    "generalBedsUsed": 227,
    "icuBedsUsed": 17,
    "privateRoomsUsed": 6,
    "doctors": [],
    "equipment": [
      {
        "name": "CT Scanner",
        "status": "AVAILABLE",
        "count": 1
      },
      {
        "name": "MRI Scanner",
        "status": "AVAILABLE",
        "count": 1
      },
      {
        "name": "ICU Ventilators",
        "status": "AVAILABLE",
        "count": 16
      },
      {
        "name": "Dialysis Machines",
        "status": "AVAILABLE",
        "count": 5
      },
      {
        "name": "Emergency Trauma OT",
        "status": "AVAILABLE",
        "count": 2
      }
    ],
    "specialists": [
      "General Medicine",
      "General Surgery",
      "Pediatrics",
      "Gynecology",
      "Orthopaedics",
      "Emergency"
    ],
    "bloodStock": {
      "O+": 15,
      "O-": 4,
      "A+": 12,
      "A-": 3,
      "B+": 16,
      "B-": 4,
      "AB+": 8,
      "AB-": 2
    },
    "pmjayEmpanelled": true,
    "emergencyAvailable": true
  },
  {
    "id": "hosp-dhas-karkardooma",
    "name": "Dr. Hedgewar Aarogya Sansthan",
    "type": "Government",
    "district": "East Delhi",
    "state": "Delhi",
    "lat": 28.652,
    "lng": 77.298,
    "generalBeds": 300,
    "icuBeds": 25,
    "privateRooms": 10,
    "phone": "011-22308870",
    "city": "Delhi",
    "area": "Karkardooma",
    "address": "CBD Ground Near Karkardooma Metro Station Delhi 110032",
    "rating": 4.2,
    "specialties": [
      "General Medicine",
      "Pediatrics",
      "General Surgery",
      "Orthopaedics",
      "Obstetrics & Gynaecology",
      "Emergency"
    ],
    "schemes": [
      "Delhi Arogya Kosh (DAK)",
      "Delhi Free Surgery Scheme",
      "Delhi Free Diagnostics",
      "PM-JAY",
      "JSY"
    ],
    "dakEmpanelled": true,
    "freeSurgeryEmpanelled": true,
    "freeDiagnosticsAvailable": true,
    "cghsEmpanelled": true,
    "danEmpanelled": true,
    "jsyAvailable": true,
    "echsEmpanelled": false,
    "generalBedsUsed": 270,
    "icuBedsUsed": 21,
    "privateRoomsUsed": 8,
    "doctors": [],
    "equipment": [
      {
        "name": "CT Scanner",
        "status": "AVAILABLE",
        "count": 1
      },
      {
        "name": "MRI Scanner",
        "status": "AVAILABLE",
        "count": 1
      },
      {
        "name": "ICU Ventilators",
        "status": "AVAILABLE",
        "count": 20
      },
      {
        "name": "Dialysis Machines",
        "status": "AVAILABLE",
        "count": 6
      },
      {
        "name": "Emergency Trauma OT",
        "status": "AVAILABLE",
        "count": 2
      }
    ],
    "specialists": [
      "General Medicine",
      "Pediatrics",
      "General Surgery",
      "Orthopaedics",
      "Obstetrics & Gynaecology",
      "Emergency"
    ],
    "bloodStock": {
      "O+": 18,
      "O-": 4,
      "A+": 14,
      "A-": 3,
      "B+": 19,
      "B-": 4,
      "AB+": 9,
      "AB-": 2
    },
    "pmjayEmpanelled": true,
    "emergencyAvailable": true
  },
  {
    "id": "hosp-cnbc-geetacolony",
    "name": "Chacha Nehru Bal Chikitsalaya (Pediatric)",
    "type": "Specialized",
    "district": "East Delhi",
    "state": "Delhi",
    "lat": 28.6525,
    "lng": 77.2695,
    "generalBeds": 300,
    "icuBeds": 40,
    "privateRooms": 10,
    "phone": "011-22055600",
    "city": "Delhi",
    "area": "Geeta Colony",
    "address": "Raja Ram Kohli Marg Geeta Colony Delhi 110031",
    "rating": 4.5,
    "specialties": [
      "Pediatric Surgery",
      "Neonatal Intensive Care (NICU)",
      "Pediatric Cardiology",
      "Child Neurology",
      "Pediatric Nephrology"
    ],
    "schemes": [
      "Rashtriya Bal Swasthya Karyakram (RBSK)",
      "Delhi Arogya Kosh (DAK)",
      "PM-JAY",
      "JSY",
      "Delhi Free Diagnostics"
    ],
    "dakEmpanelled": true,
    "freeSurgeryEmpanelled": true,
    "freeDiagnosticsAvailable": true,
    "cghsEmpanelled": true,
    "danEmpanelled": true,
    "jsyAvailable": true,
    "echsEmpanelled": true,
    "generalBedsUsed": 267,
    "icuBedsUsed": 35,
    "privateRoomsUsed": 8,
    "doctors": [],
    "equipment": [
      {
        "name": "CT Scanner",
        "status": "AVAILABLE",
        "count": 1
      },
      {
        "name": "MRI Scanner",
        "status": "AVAILABLE",
        "count": 1
      },
      {
        "name": "ICU Ventilators",
        "status": "AVAILABLE",
        "count": 32
      },
      {
        "name": "Dialysis Machines",
        "status": "AVAILABLE",
        "count": 6
      },
      {
        "name": "Emergency Trauma OT",
        "status": "AVAILABLE",
        "count": 2
      }
    ],
    "specialists": [
      "Pediatric Surgery",
      "Neonatal Intensive Care (NICU)",
      "Pediatric Cardiology",
      "Child Neurology",
      "Pediatric Nephrology"
    ],
    "bloodStock": {
      "O+": 18,
      "O-": 4,
      "A+": 14,
      "A-": 3,
      "B+": 19,
      "B-": 4,
      "AB+": 9,
      "AB-": 2
    },
    "pmjayEmpanelled": true,
    "emergencyAvailable": true
  },
  {
    "id": "hosp-dadadev-dabri",
    "name": "Dada Dev Matri Avum Shishu Chikitsalaya",
    "type": "Specialized",
    "district": "South West Delhi",
    "state": "Delhi",
    "lat": 28.601,
    "lng": 77.085,
    "generalBeds": 250,
    "icuBeds": 25,
    "privateRooms": 10,
    "phone": "011-25394274",
    "city": "Delhi",
    "area": "Dabri / Dwarka",
    "address": "Dabri-Nasirpur Road Dwarka Sector 1 New Delhi 110045",
    "rating": 4.3,
    "specialties": [
      "Obstetrics & Gynaecology",
      "Maternal Care",
      "Neonatal Care (NICU)",
      "Pediatrics",
      "High-Risk Pregnancy"
    ],
    "schemes": [
      "Janani Suraksha Yojana (JSY)",
      "PM Matru Vandana (PMMVY)",
      "Delhi Arogya Kosh (DAK)",
      "PM-JAY"
    ],
    "dakEmpanelled": true,
    "freeSurgeryEmpanelled": true,
    "freeDiagnosticsAvailable": true,
    "cghsEmpanelled": true,
    "danEmpanelled": true,
    "jsyAvailable": true,
    "echsEmpanelled": false,
    "generalBedsUsed": 220,
    "icuBedsUsed": 22,
    "privateRoomsUsed": 8,
    "doctors": [],
    "equipment": [
      {
        "name": "CT Scanner",
        "status": "AVAILABLE",
        "count": 1
      },
      {
        "name": "MRI Scanner",
        "status": "AVAILABLE",
        "count": 1
      },
      {
        "name": "ICU Ventilators",
        "status": "AVAILABLE",
        "count": 20
      },
      {
        "name": "Dialysis Machines",
        "status": "AVAILABLE",
        "count": 5
      },
      {
        "name": "Emergency Trauma OT",
        "status": "AVAILABLE",
        "count": 2
      }
    ],
    "specialists": [
      "Obstetrics & Gynaecology",
      "Maternal Care",
      "Neonatal Care (NICU)",
      "Pediatrics",
      "High-Risk Pregnancy"
    ],
    "bloodStock": {
      "O+": 15,
      "O-": 4,
      "A+": 12,
      "A-": 3,
      "B+": 16,
      "B-": 4,
      "AB+": 8,
      "AB-": 2
    },
    "pmjayEmpanelled": true,
    "emergencyAvailable": true
  },
  {
    "id": "hosp-hindurao-malkaganj",
    "name": "Hindu Rao Hospital & NDMC Medical College",
    "type": "Government",
    "district": "North Delhi",
    "state": "Delhi",
    "lat": 28.674,
    "lng": 77.208,
    "generalBeds": 900,
    "icuBeds": 80,
    "privateRooms": 20,
    "phone": "011-23905600",
    "city": "Delhi",
    "area": "Malka Ganj / Sabzi Mandi",
    "address": "Bara Hindu Rao Near Malka Ganj Delhi 110007",
    "rating": 4.2,
    "specialties": [
      "General Medicine",
      "General Surgery",
      "Orthopaedics",
      "Pediatrics",
      "Obstetrics & Gynaecology",
      "Emergency Trauma"
    ],
    "schemes": [
      "PM-JAY",
      "Delhi Arogya Kosh (DAK)",
      "Delhi Free Diagnostics",
      "JSY",
      "NTEP"
    ],
    "dakEmpanelled": true,
    "freeSurgeryEmpanelled": true,
    "freeDiagnosticsAvailable": true,
    "cghsEmpanelled": true,
    "danEmpanelled": true,
    "jsyAvailable": true,
    "echsEmpanelled": true,
    "generalBedsUsed": 783,
    "icuBedsUsed": 72,
    "privateRoomsUsed": 16,
    "doctors": [],
    "equipment": [
      {
        "name": "CT Scanner",
        "status": "AVAILABLE",
        "count": 4
      },
      {
        "name": "MRI Scanner",
        "status": "AVAILABLE",
        "count": 3
      },
      {
        "name": "ICU Ventilators",
        "status": "AVAILABLE",
        "count": 64
      },
      {
        "name": "Dialysis Machines",
        "status": "AVAILABLE",
        "count": 18
      },
      {
        "name": "Emergency Trauma OT",
        "status": "AVAILABLE",
        "count": 6
      }
    ],
    "specialists": [
      "General Medicine",
      "General Surgery",
      "Orthopaedics",
      "Pediatrics",
      "Obstetrics & Gynaecology",
      "Emergency Trauma"
    ],
    "bloodStock": {
      "O+": 54,
      "O-": 14,
      "A+": 43,
      "A-": 10,
      "B+": 57,
      "B-": 14,
      "AB+": 28,
      "AB-": 7
    },
    "pmjayEmpanelled": true,
    "emergencyAvailable": true
  },
  {
    "id": "hosp-kasturba-daryaganj",
    "name": "Kasturba Hospital",
    "type": "Government",
    "district": "Central Delhi",
    "state": "Delhi",
    "lat": 28.6505,
    "lng": 77.234,
    "generalBeds": 450,
    "icuBeds": 30,
    "privateRooms": 10,
    "phone": "011-23275024",
    "city": "Delhi",
    "area": "Daryaganj / Jama Masjid",
    "address": "Near Jama Masjid Daryaganj Delhi 110006",
    "rating": 4.1,
    "specialties": [
      "Maternity & Child Health",
      "Obstetrics & Gynaecology",
      "Neonatal ICU",
      "General Surgery"
    ],
    "schemes": [
      "Janani Suraksha Yojana (JSY)",
      "PM Matru Vandana (PMMVY)",
      "PM-JAY",
      "Delhi Arogya Kosh (DAK)"
    ],
    "dakEmpanelled": true,
    "freeSurgeryEmpanelled": true,
    "freeDiagnosticsAvailable": true,
    "cghsEmpanelled": true,
    "danEmpanelled": true,
    "jsyAvailable": true,
    "echsEmpanelled": false,
    "generalBedsUsed": 387,
    "icuBedsUsed": 27,
    "privateRoomsUsed": 8,
    "doctors": [],
    "equipment": [
      {
        "name": "CT Scanner",
        "status": "AVAILABLE",
        "count": 2
      },
      {
        "name": "MRI Scanner",
        "status": "AVAILABLE",
        "count": 1
      },
      {
        "name": "ICU Ventilators",
        "status": "AVAILABLE",
        "count": 24
      },
      {
        "name": "Dialysis Machines",
        "status": "AVAILABLE",
        "count": 9
      },
      {
        "name": "Emergency Trauma OT",
        "status": "AVAILABLE",
        "count": 3
      }
    ],
    "specialists": [
      "Maternity & Child Health",
      "Obstetrics & Gynaecology",
      "Neonatal ICU",
      "General Surgery"
    ],
    "bloodStock": {
      "O+": 27,
      "O-": 7,
      "A+": 21,
      "A-": 5,
      "B+": 28,
      "B-": 7,
      "AB+": 14,
      "AB-": 3
    },
    "pmjayEmpanelled": true,
    "emergencyAvailable": true
  },
  {
    "id": "hosp-swamidayanand-shahdara",
    "name": "Swami Dayanand Hospital",
    "type": "Government",
    "district": "Shahdara",
    "state": "Delhi",
    "lat": 28.678,
    "lng": 77.309,
    "generalBeds": 400,
    "icuBeds": 35,
    "privateRooms": 10,
    "phone": "011-22588480",
    "city": "Delhi",
    "area": "Dilshad Garden / Shahdara",
    "address": "F-Block Dilshad Garden Shahdara Delhi 110095",
    "rating": 4.1,
    "specialties": [
      "General Medicine",
      "General Surgery",
      "Orthopaedics",
      "Pediatrics",
      "Obstetrics & Gynaecology",
      "Emergency"
    ],
    "schemes": [
      "PM-JAY",
      "Delhi Arogya Kosh (DAK)",
      "Delhi Free Diagnostics",
      "JSY"
    ],
    "dakEmpanelled": true,
    "freeSurgeryEmpanelled": true,
    "freeDiagnosticsAvailable": true,
    "cghsEmpanelled": true,
    "danEmpanelled": true,
    "jsyAvailable": true,
    "echsEmpanelled": false,
    "generalBedsUsed": 340,
    "icuBedsUsed": 28,
    "privateRoomsUsed": 8,
    "doctors": [],
    "equipment": [
      {
        "name": "CT Scanner",
        "status": "AVAILABLE",
        "count": 2
      },
      {
        "name": "MRI Scanner",
        "status": "AVAILABLE",
        "count": 1
      },
      {
        "name": "ICU Ventilators",
        "status": "AVAILABLE",
        "count": 28
      },
      {
        "name": "Dialysis Machines",
        "status": "AVAILABLE",
        "count": 8
      },
      {
        "name": "Emergency Trauma OT",
        "status": "AVAILABLE",
        "count": 2
      }
    ],
    "specialists": [
      "General Medicine",
      "General Surgery",
      "Orthopaedics",
      "Pediatrics",
      "Obstetrics & Gynaecology",
      "Emergency"
    ],
    "bloodStock": {
      "O+": 24,
      "O-": 6,
      "A+": 19,
      "A-": 4,
      "B+": 25,
      "B-": 6,
      "AB+": 12,
      "AB-": 3
    },
    "pmjayEmpanelled": true,
    "emergencyAvailable": true
  },
  {
    "id": "hosp-charakpalika-motibagh",
    "name": "Charak Palika Hospital NDMC",
    "type": "Government",
    "district": "South Delhi",
    "state": "Delhi",
    "lat": 28.583,
    "lng": 77.172,
    "generalBeds": 150,
    "icuBeds": 15,
    "privateRooms": 12,
    "phone": "011-24675555",
    "city": "Delhi",
    "area": "Moti Bagh",
    "address": "Shanti Path Moti Bagh New Delhi 110021",
    "rating": 4.3,
    "specialties": [
      "General Medicine",
      "General Surgery",
      "Pediatrics",
      "Gynecology",
      "Orthopaedics",
      "Emergency"
    ],
    "schemes": [
      "NDMC Health Scheme",
      "CGHS",
      "PM-JAY"
    ],
    "dakEmpanelled": false,
    "freeSurgeryEmpanelled": false,
    "freeDiagnosticsAvailable": true,
    "cghsEmpanelled": true,
    "danEmpanelled": false,
    "jsyAvailable": true,
    "echsEmpanelled": true,
    "generalBedsUsed": 126,
    "icuBedsUsed": 12,
    "privateRoomsUsed": 9,
    "doctors": [],
    "equipment": [
      {
        "name": "CT Scanner",
        "status": "AVAILABLE",
        "count": 1
      },
      {
        "name": "MRI Scanner",
        "status": "AVAILABLE",
        "count": 1
      },
      {
        "name": "ICU Ventilators",
        "status": "AVAILABLE",
        "count": 12
      },
      {
        "name": "Dialysis Machines",
        "status": "AVAILABLE",
        "count": 4
      },
      {
        "name": "Emergency Trauma OT",
        "status": "AVAILABLE",
        "count": 2
      }
    ],
    "specialists": [
      "General Medicine",
      "General Surgery",
      "Pediatrics",
      "Gynecology",
      "Orthopaedics",
      "Emergency"
    ],
    "bloodStock": {
      "O+": 9,
      "O-": 2,
      "A+": 7,
      "A-": 2,
      "B+": 9,
      "B-": 2,
      "AB+": 4,
      "AB-": 1
    },
    "pmjayEmpanelled": true,
    "emergencyAvailable": true
  },
  {
    "id": "hosp-gangaram-delhi",
    "name": "Sir Ganga Ram Hospital",
    "type": "Tertiary",
    "district": "Central Delhi",
    "state": "Delhi",
    "lat": 28.6385,
    "lng": 77.1895,
    "generalBeds": 675,
    "icuBeds": 90,
    "privateRooms": 120,
    "phone": "011-25750000",
    "city": "Delhi",
    "area": "Rajinder Nagar",
    "address": "Sir Ganga Ram Hospital Marg Rajinder Nagar New Delhi 110060",
    "rating": 4.7,
    "specialties": [
      "Liver Transplant",
      "Kidney Transplant",
      "Gastroenterology",
      "Cardiology",
      "Nephrology",
      "Robotic Surgery",
      "Oncology"
    ],
    "schemes": [
      "Delhi Free Surgery Scheme",
      "Delhi Free Diagnostics",
      "PM-JAY",
      "CGHS",
      "ECHS",
      "Farishte Dilli Ke"
    ],
    "dakEmpanelled": false,
    "freeSurgeryEmpanelled": true,
    "freeDiagnosticsAvailable": true,
    "cghsEmpanelled": true,
    "danEmpanelled": false,
    "jsyAvailable": false,
    "echsEmpanelled": true,
    "generalBedsUsed": 621,
    "icuBedsUsed": 75,
    "privateRoomsUsed": 103,
    "doctors": [],
    "equipment": [
      {
        "name": "CT Scanner",
        "status": "AVAILABLE",
        "count": 3
      },
      {
        "name": "MRI Scanner",
        "status": "AVAILABLE",
        "count": 2
      },
      {
        "name": "ICU Ventilators",
        "status": "AVAILABLE",
        "count": 72
      },
      {
        "name": "Dialysis Machines",
        "status": "AVAILABLE",
        "count": 13
      },
      {
        "name": "Emergency Trauma OT",
        "status": "AVAILABLE",
        "count": 4
      }
    ],
    "specialists": [
      "Liver Transplant",
      "Kidney Transplant",
      "Gastroenterology",
      "Cardiology",
      "Nephrology",
      "Robotic Surgery",
      "Oncology"
    ],
    "bloodStock": {
      "O+": 40,
      "O-": 10,
      "A+": 32,
      "A-": 8,
      "B+": 43,
      "B-": 10,
      "AB+": 21,
      "AB-": 5
    },
    "pmjayEmpanelled": true,
    "emergencyAvailable": true
  },
  {
    "id": "hosp-blk-delhi",
    "name": "BLK-Max Super Speciality Hospital",
    "type": "Tertiary",
    "district": "Central Delhi",
    "state": "Delhi",
    "lat": 28.6441,
    "lng": 77.1795,
    "generalBeds": 650,
    "icuBeds": 125,
    "privateRooms": 100,
    "phone": "011-30403040",
    "city": "Delhi",
    "area": "Pusa Road / Karol Bagh",
    "address": "Building No 5 Pusa Road Rajinder Nagar Karol Bagh New Delhi 110005",
    "rating": 4.6,
    "specialties": [
      "Bone Marrow Transplant",
      "Oncology",
      "Cardiology",
      "Neurosurgery",
      "Bariatric Surgery",
      "Organ Transplant"
    ],
    "schemes": [
      "Delhi Free Surgery Scheme",
      "Delhi Free Diagnostics",
      "PM-JAY",
      "CGHS",
      "ECHS",
      "Farishte Dilli Ke"
    ],
    "dakEmpanelled": false,
    "freeSurgeryEmpanelled": true,
    "freeDiagnosticsAvailable": true,
    "cghsEmpanelled": true,
    "danEmpanelled": false,
    "jsyAvailable": false,
    "echsEmpanelled": true,
    "generalBedsUsed": 591,
    "icuBedsUsed": 106,
    "privateRoomsUsed": 83,
    "doctors": [],
    "equipment": [
      {
        "name": "CT Scanner",
        "status": "AVAILABLE",
        "count": 3
      },
      {
        "name": "MRI Scanner",
        "status": "AVAILABLE",
        "count": 2
      },
      {
        "name": "ICU Ventilators",
        "status": "AVAILABLE",
        "count": 100
      },
      {
        "name": "Dialysis Machines",
        "status": "AVAILABLE",
        "count": 13
      },
      {
        "name": "Emergency Trauma OT",
        "status": "AVAILABLE",
        "count": 4
      }
    ],
    "specialists": [
      "Bone Marrow Transplant",
      "Oncology",
      "Cardiology",
      "Neurosurgery",
      "Bariatric Surgery",
      "Organ Transplant"
    ],
    "bloodStock": {
      "O+": 39,
      "O-": 10,
      "A+": 31,
      "A-": 7,
      "B+": 41,
      "B-": 10,
      "AB+": 20,
      "AB-": 5
    },
    "pmjayEmpanelled": true,
    "emergencyAvailable": true
  },
  {
    "id": "hosp-max-saket",
    "name": "Max Super Speciality Hospital Saket",
    "type": "Tertiary",
    "district": "South Delhi",
    "state": "Delhi",
    "lat": 28.528,
    "lng": 77.212,
    "generalBeds": 530,
    "icuBeds": 100,
    "privateRooms": 90,
    "phone": "011-26515050",
    "city": "Delhi",
    "area": "Saket Institutional Area",
    "address": "1 2 Press Enclave Marg Saket District Centre New Delhi 110017",
    "rating": 4.7,
    "specialties": [
      "Cardiology",
      "Oncology",
      "Neurosurgery",
      "Orthopaedics",
      "Liver Transplant",
      "Robotics"
    ],
    "schemes": [
      "Delhi Free Surgery Scheme",
      "Delhi Free Diagnostics",
      "PM-JAY",
      "CGHS",
      "ECHS",
      "Farishte Dilli Ke"
    ],
    "dakEmpanelled": false,
    "freeSurgeryEmpanelled": true,
    "freeDiagnosticsAvailable": true,
    "cghsEmpanelled": true,
    "danEmpanelled": false,
    "jsyAvailable": false,
    "echsEmpanelled": true,
    "generalBedsUsed": 476,
    "icuBedsUsed": 86,
    "privateRoomsUsed": 72,
    "doctors": [],
    "equipment": [
      {
        "name": "CT Scanner",
        "status": "AVAILABLE",
        "count": 2
      },
      {
        "name": "MRI Scanner",
        "status": "AVAILABLE",
        "count": 1
      },
      {
        "name": "ICU Ventilators",
        "status": "AVAILABLE",
        "count": 80
      },
      {
        "name": "Dialysis Machines",
        "status": "AVAILABLE",
        "count": 10
      },
      {
        "name": "Emergency Trauma OT",
        "status": "AVAILABLE",
        "count": 3
      }
    ],
    "specialists": [
      "Cardiology",
      "Oncology",
      "Neurosurgery",
      "Orthopaedics",
      "Liver Transplant",
      "Robotics"
    ],
    "bloodStock": {
      "O+": 31,
      "O-": 8,
      "A+": 25,
      "A-": 6,
      "B+": 33,
      "B-": 8,
      "AB+": 16,
      "AB-": 4
    },
    "pmjayEmpanelled": true,
    "emergencyAvailable": true
  },
  {
    "id": "hosp-max-patparganj",
    "name": "Max Super Speciality Hospital Patparganj",
    "type": "Tertiary",
    "district": "East Delhi",
    "state": "Delhi",
    "lat": 28.629,
    "lng": 77.306,
    "generalBeds": 400,
    "icuBeds": 70,
    "privateRooms": 60,
    "phone": "011-43033333",
    "city": "Delhi",
    "area": "Patparganj",
    "address": "108A IP Extension Patparganj Delhi 110092",
    "rating": 4.6,
    "specialties": [
      "Cardiology",
      "Oncology",
      "Orthopaedics",
      "Neurology",
      "Gastroenterology",
      "Kidney Transplant"
    ],
    "schemes": [
      "Delhi Free Surgery Scheme",
      "PM-JAY",
      "CGHS",
      "ECHS",
      "Farishte Dilli Ke"
    ],
    "dakEmpanelled": false,
    "freeSurgeryEmpanelled": true,
    "freeDiagnosticsAvailable": true,
    "cghsEmpanelled": true,
    "danEmpanelled": false,
    "jsyAvailable": false,
    "echsEmpanelled": true,
    "generalBedsUsed": 356,
    "icuBedsUsed": 60,
    "privateRoomsUsed": 51,
    "doctors": [],
    "equipment": [
      {
        "name": "CT Scanner",
        "status": "AVAILABLE",
        "count": 2
      },
      {
        "name": "MRI Scanner",
        "status": "AVAILABLE",
        "count": 1
      },
      {
        "name": "ICU Ventilators",
        "status": "AVAILABLE",
        "count": 56
      },
      {
        "name": "Dialysis Machines",
        "status": "AVAILABLE",
        "count": 8
      },
      {
        "name": "Emergency Trauma OT",
        "status": "AVAILABLE",
        "count": 2
      }
    ],
    "specialists": [
      "Cardiology",
      "Oncology",
      "Orthopaedics",
      "Neurology",
      "Gastroenterology",
      "Kidney Transplant"
    ],
    "bloodStock": {
      "O+": 24,
      "O-": 6,
      "A+": 19,
      "A-": 4,
      "B+": 25,
      "B-": 6,
      "AB+": 12,
      "AB-": 3
    },
    "pmjayEmpanelled": true,
    "emergencyAvailable": true
  },
  {
    "id": "hosp-max-shalimarbagh",
    "name": "Max Super Speciality Hospital Shalimar Bagh",
    "type": "Tertiary",
    "district": "North West Delhi",
    "state": "Delhi",
    "lat": 28.709,
    "lng": 77.162,
    "generalBeds": 300,
    "icuBeds": 50,
    "privateRooms": 50,
    "phone": "011-66422222",
    "city": "Delhi",
    "area": "Shalimar Bagh",
    "address": "FC-50 C & D Block Shalimar Bagh New Delhi 110088",
    "rating": 4.6,
    "specialties": [
      "Cardiology",
      "Cancer Care",
      "Neurosciences",
      "Orthopaedics",
      "Urology",
      "Renal Transplant"
    ],
    "schemes": [
      "Delhi Free Surgery Scheme",
      "PM-JAY",
      "CGHS",
      "ECHS",
      "Farishte Dilli Ke"
    ],
    "dakEmpanelled": false,
    "freeSurgeryEmpanelled": true,
    "freeDiagnosticsAvailable": true,
    "cghsEmpanelled": true,
    "danEmpanelled": false,
    "jsyAvailable": false,
    "echsEmpanelled": true,
    "generalBedsUsed": 264,
    "icuBedsUsed": 43,
    "privateRoomsUsed": 41,
    "doctors": [],
    "equipment": [
      {
        "name": "CT Scanner",
        "status": "AVAILABLE",
        "count": 1
      },
      {
        "name": "MRI Scanner",
        "status": "AVAILABLE",
        "count": 1
      },
      {
        "name": "ICU Ventilators",
        "status": "AVAILABLE",
        "count": 40
      },
      {
        "name": "Dialysis Machines",
        "status": "AVAILABLE",
        "count": 6
      },
      {
        "name": "Emergency Trauma OT",
        "status": "AVAILABLE",
        "count": 2
      }
    ],
    "specialists": [
      "Cardiology",
      "Cancer Care",
      "Neurosciences",
      "Orthopaedics",
      "Urology",
      "Renal Transplant"
    ],
    "bloodStock": {
      "O+": 18,
      "O-": 4,
      "A+": 14,
      "A-": 3,
      "B+": 19,
      "B-": 4,
      "AB+": 9,
      "AB-": 2
    },
    "pmjayEmpanelled": true,
    "emergencyAvailable": true
  },
  {
    "id": "hosp-apollo-delhi",
    "name": "Indraprastha Apollo Hospital",
    "type": "Tertiary",
    "district": "South East Delhi",
    "state": "Delhi",
    "lat": 28.5385,
    "lng": 77.2845,
    "generalBeds": 710,
    "icuBeds": 140,
    "privateRooms": 150,
    "phone": "011-26925858",
    "city": "Delhi",
    "area": "Sarita Vihar",
    "address": "Delhi Mathura Road Sarita Vihar New Delhi 110076",
    "rating": 4.8,
    "specialties": [
      "Organ Transplant",
      "Cardiology",
      "Oncology",
      "Neurosurgery",
      "Orthopaedics",
      "Pediatrics",
      "Emergency Care"
    ],
    "schemes": [
      "Delhi Free Surgery Scheme",
      "PM-JAY",
      "CGHS",
      "ECHS",
      "Farishte Dilli Ke"
    ],
    "dakEmpanelled": false,
    "freeSurgeryEmpanelled": true,
    "freeDiagnosticsAvailable": true,
    "cghsEmpanelled": true,
    "danEmpanelled": false,
    "jsyAvailable": false,
    "echsEmpanelled": true,
    "generalBedsUsed": 617,
    "icuBedsUsed": 124,
    "privateRoomsUsed": 130,
    "doctors": [],
    "equipment": [
      {
        "name": "CT Scanner",
        "status": "AVAILABLE",
        "count": 3
      },
      {
        "name": "MRI Scanner",
        "status": "AVAILABLE",
        "count": 2
      },
      {
        "name": "ICU Ventilators",
        "status": "AVAILABLE",
        "count": 112
      },
      {
        "name": "Dialysis Machines",
        "status": "AVAILABLE",
        "count": 14
      },
      {
        "name": "Emergency Trauma OT",
        "status": "AVAILABLE",
        "count": 4
      }
    ],
    "specialists": [
      "Organ Transplant",
      "Cardiology",
      "Oncology",
      "Neurosurgery",
      "Orthopaedics",
      "Pediatrics",
      "Emergency Care"
    ],
    "bloodStock": {
      "O+": 42,
      "O-": 11,
      "A+": 33,
      "A-": 8,
      "B+": 44,
      "B-": 11,
      "AB+": 22,
      "AB-": 5
    },
    "pmjayEmpanelled": true,
    "emergencyAvailable": true
  },
  {
    "id": "hosp-fortis-escorts-okhla",
    "name": "Fortis Escorts Heart Institute",
    "type": "Tertiary",
    "district": "South East Delhi",
    "state": "Delhi",
    "lat": 28.5605,
    "lng": 77.2795,
    "generalBeds": 310,
    "icuBeds": 80,
    "privateRooms": 60,
    "phone": "011-47135000",
    "city": "Delhi",
    "area": "Okhla Road",
    "address": "Okhla Road Sukhdev Vihar Metro Station New Delhi 110025",
    "rating": 4.8,
    "specialties": [
      "Interventional Cardiology",
      "Cardiothoracic Surgery",
      "Pediatric Cardiology",
      "Electrophysiology",
      "Heart Transplant"
    ],
    "schemes": [
      "Delhi Free Surgery Scheme",
      "PM-JAY",
      "CGHS",
      "ECHS",
      "Farishte Dilli Ke"
    ],
    "dakEmpanelled": false,
    "freeSurgeryEmpanelled": true,
    "freeDiagnosticsAvailable": true,
    "cghsEmpanelled": true,
    "danEmpanelled": false,
    "jsyAvailable": false,
    "echsEmpanelled": true,
    "generalBedsUsed": 266,
    "icuBedsUsed": 72,
    "privateRoomsUsed": 50,
    "doctors": [],
    "equipment": [
      {
        "name": "CT Scanner",
        "status": "AVAILABLE",
        "count": 1
      },
      {
        "name": "MRI Scanner",
        "status": "AVAILABLE",
        "count": 1
      },
      {
        "name": "ICU Ventilators",
        "status": "AVAILABLE",
        "count": 64
      },
      {
        "name": "Dialysis Machines",
        "status": "AVAILABLE",
        "count": 6
      },
      {
        "name": "Emergency Trauma OT",
        "status": "AVAILABLE",
        "count": 2
      }
    ],
    "specialists": [
      "Interventional Cardiology",
      "Cardiothoracic Surgery",
      "Pediatric Cardiology",
      "Electrophysiology",
      "Heart Transplant"
    ],
    "bloodStock": {
      "O+": 18,
      "O-": 4,
      "A+": 14,
      "A-": 3,
      "B+": 19,
      "B-": 4,
      "AB+": 9,
      "AB-": 2
    },
    "pmjayEmpanelled": true,
    "emergencyAvailable": true
  },
  {
    "id": "hosp-fortis-vasantkunj",
    "name": "Fortis Flt. Lt. Rajan Dhall Hospital Vasant Kunj",
    "type": "Tertiary",
    "district": "South West Delhi",
    "state": "Delhi",
    "lat": 28.529,
    "lng": 77.151,
    "generalBeds": 200,
    "icuBeds": 40,
    "privateRooms": 40,
    "phone": "011-42776222",
    "city": "Delhi",
    "area": "Vasant Kunj Sector B",
    "address": "Sector B Pocket 1 Aruna Asaf Ali Marg Vasant Kunj New Delhi 110070",
    "rating": 4.6,
    "specialties": [
      "Cardiology",
      "Orthopaedics",
      "Oncology",
      "Kidney Transplant",
      "Gastroenterology",
      "Pulmonology"
    ],
    "schemes": [
      "Delhi Free Surgery Scheme",
      "PM-JAY",
      "CGHS",
      "ECHS",
      "Farishte Dilli Ke"
    ],
    "dakEmpanelled": false,
    "freeSurgeryEmpanelled": true,
    "freeDiagnosticsAvailable": true,
    "cghsEmpanelled": true,
    "danEmpanelled": false,
    "jsyAvailable": false,
    "echsEmpanelled": true,
    "generalBedsUsed": 170,
    "icuBedsUsed": 36,
    "privateRoomsUsed": 32,
    "doctors": [],
    "equipment": [
      {
        "name": "CT Scanner",
        "status": "AVAILABLE",
        "count": 1
      },
      {
        "name": "MRI Scanner",
        "status": "AVAILABLE",
        "count": 1
      },
      {
        "name": "ICU Ventilators",
        "status": "AVAILABLE",
        "count": 32
      },
      {
        "name": "Dialysis Machines",
        "status": "AVAILABLE",
        "count": 4
      },
      {
        "name": "Emergency Trauma OT",
        "status": "AVAILABLE",
        "count": 2
      }
    ],
    "specialists": [
      "Cardiology",
      "Orthopaedics",
      "Oncology",
      "Kidney Transplant",
      "Gastroenterology",
      "Pulmonology"
    ],
    "bloodStock": {
      "O+": 12,
      "O-": 3,
      "A+": 9,
      "A-": 2,
      "B+": 12,
      "B-": 3,
      "AB+": 6,
      "AB-": 1
    },
    "pmjayEmpanelled": true,
    "emergencyAvailable": true
  },
  {
    "id": "hosp-fortis-shalimarbagh",
    "name": "Fortis Hospital Shalimar Bagh",
    "type": "Tertiary",
    "district": "North West Delhi",
    "state": "Delhi",
    "lat": 28.718,
    "lng": 77.161,
    "generalBeds": 260,
    "icuBeds": 45,
    "privateRooms": 45,
    "phone": "011-45302222",
    "city": "Delhi",
    "area": "Shalimar Bagh",
    "address": "AA Block Poorbi Shalimar Bagh New Delhi 110088",
    "rating": 4.5,
    "specialties": [
      "Cardiology",
      "Neurology",
      "Orthopaedics",
      "Oncology",
      "Critical Care",
      "Gastroenterology"
    ],
    "schemes": [
      "Delhi Free Surgery Scheme",
      "PM-JAY",
      "CGHS",
      "ECHS",
      "Farishte Dilli Ke"
    ],
    "dakEmpanelled": false,
    "freeSurgeryEmpanelled": true,
    "freeDiagnosticsAvailable": true,
    "cghsEmpanelled": true,
    "danEmpanelled": false,
    "jsyAvailable": false,
    "echsEmpanelled": true,
    "generalBedsUsed": 218,
    "icuBedsUsed": 41,
    "privateRoomsUsed": 38,
    "doctors": [],
    "equipment": [
      {
        "name": "CT Scanner",
        "status": "AVAILABLE",
        "count": 1
      },
      {
        "name": "MRI Scanner",
        "status": "AVAILABLE",
        "count": 1
      },
      {
        "name": "ICU Ventilators",
        "status": "AVAILABLE",
        "count": 36
      },
      {
        "name": "Dialysis Machines",
        "status": "AVAILABLE",
        "count": 5
      },
      {
        "name": "Emergency Trauma OT",
        "status": "AVAILABLE",
        "count": 2
      }
    ],
    "specialists": [
      "Cardiology",
      "Neurology",
      "Orthopaedics",
      "Oncology",
      "Critical Care",
      "Gastroenterology"
    ],
    "bloodStock": {
      "O+": 15,
      "O-": 4,
      "A+": 12,
      "A-": 3,
      "B+": 16,
      "B-": 4,
      "AB+": 8,
      "AB-": 2
    },
    "pmjayEmpanelled": true,
    "emergencyAvailable": true
  },
  {
    "id": "hosp-venkateshwar-dwarka",
    "name": "Venkateshwar Hospital Dwarka",
    "type": "Tertiary",
    "district": "South West Delhi",
    "state": "Delhi",
    "lat": 28.591,
    "lng": 77.043,
    "generalBeds": 325,
    "icuBeds": 60,
    "privateRooms": 50,
    "phone": "011-48555555",
    "city": "Delhi",
    "area": "Dwarka Sector 18A",
    "address": "Sector 18A Dwarka New Delhi 110075",
    "rating": 4.6,
    "specialties": [
      "Cardiology",
      "Oncology",
      "Liver & Kidney Transplant",
      "Neurosurgery",
      "Orthopaedics",
      "Critical Care"
    ],
    "schemes": [
      "Delhi Free Surgery Scheme",
      "PM-JAY",
      "CGHS",
      "ECHS",
      "Farishte Dilli Ke"
    ],
    "dakEmpanelled": false,
    "freeSurgeryEmpanelled": true,
    "freeDiagnosticsAvailable": true,
    "cghsEmpanelled": true,
    "danEmpanelled": false,
    "jsyAvailable": false,
    "echsEmpanelled": true,
    "generalBedsUsed": 299,
    "icuBedsUsed": 49,
    "privateRoomsUsed": 41,
    "doctors": [],
    "equipment": [
      {
        "name": "CT Scanner",
        "status": "AVAILABLE",
        "count": 1
      },
      {
        "name": "MRI Scanner",
        "status": "AVAILABLE",
        "count": 1
      },
      {
        "name": "ICU Ventilators",
        "status": "AVAILABLE",
        "count": 48
      },
      {
        "name": "Dialysis Machines",
        "status": "AVAILABLE",
        "count": 6
      },
      {
        "name": "Emergency Trauma OT",
        "status": "AVAILABLE",
        "count": 2
      }
    ],
    "specialists": [
      "Cardiology",
      "Oncology",
      "Liver & Kidney Transplant",
      "Neurosurgery",
      "Orthopaedics",
      "Critical Care"
    ],
    "bloodStock": {
      "O+": 19,
      "O-": 5,
      "A+": 15,
      "A-": 3,
      "B+": 20,
      "B-": 5,
      "AB+": 10,
      "AB-": 2
    },
    "pmjayEmpanelled": true,
    "emergencyAvailable": true
  },
  {
    "id": "hosp-manipal-dwarka",
    "name": "Manipal Hospital Dwarka",
    "type": "Tertiary",
    "district": "South West Delhi",
    "state": "Delhi",
    "lat": 28.5865,
    "lng": 77.068,
    "generalBeds": 380,
    "icuBeds": 65,
    "privateRooms": 60,
    "phone": "011-49674967",
    "city": "Delhi",
    "area": "Dwarka Sector 6",
    "address": "Sector 6 Dwarka New Delhi 110075",
    "rating": 4.7,
    "specialties": [
      "Cardiology",
      "Cardiothoracic Surgery",
      "Neurosurgery",
      "Oncology",
      "Organ Transplant",
      "Orthopaedics"
    ],
    "schemes": [
      "Delhi Free Surgery Scheme",
      "PM-JAY",
      "CGHS",
      "ECHS",
      "Farishte Dilli Ke"
    ],
    "dakEmpanelled": false,
    "freeSurgeryEmpanelled": true,
    "freeDiagnosticsAvailable": true,
    "cghsEmpanelled": true,
    "danEmpanelled": false,
    "jsyAvailable": false,
    "echsEmpanelled": true,
    "generalBedsUsed": 345,
    "icuBedsUsed": 53,
    "privateRoomsUsed": 48,
    "doctors": [],
    "equipment": [
      {
        "name": "CT Scanner",
        "status": "AVAILABLE",
        "count": 1
      },
      {
        "name": "MRI Scanner",
        "status": "AVAILABLE",
        "count": 1
      },
      {
        "name": "ICU Ventilators",
        "status": "AVAILABLE",
        "count": 52
      },
      {
        "name": "Dialysis Machines",
        "status": "AVAILABLE",
        "count": 7
      },
      {
        "name": "Emergency Trauma OT",
        "status": "AVAILABLE",
        "count": 2
      }
    ],
    "specialists": [
      "Cardiology",
      "Cardiothoracic Surgery",
      "Neurosurgery",
      "Oncology",
      "Organ Transplant",
      "Orthopaedics"
    ],
    "bloodStock": {
      "O+": 22,
      "O-": 6,
      "A+": 18,
      "A-": 4,
      "B+": 24,
      "B-": 6,
      "AB+": 12,
      "AB-": 3
    },
    "pmjayEmpanelled": true,
    "emergencyAvailable": true
  },
  {
    "id": "hosp-holyfamily-okhla",
    "name": "Holy Family Hospital",
    "type": "Tertiary",
    "district": "South East Delhi",
    "state": "Delhi",
    "lat": 28.562,
    "lng": 77.275,
    "generalBeds": 345,
    "icuBeds": 50,
    "privateRooms": 40,
    "phone": "011-26845900",
    "city": "Delhi",
    "area": "Okhla",
    "address": "Okhla Road Jamia Nagar New Delhi 110025",
    "rating": 4.5,
    "specialties": [
      "Cardiology",
      "General Surgery",
      "Orthopaedics",
      "Obstetrics & Gynaecology",
      "Pediatrics",
      "Critical Care"
    ],
    "schemes": [
      "PM-JAY",
      "CGHS",
      "ECHS",
      "Farishte Dilli Ke"
    ],
    "dakEmpanelled": false,
    "freeSurgeryEmpanelled": true,
    "freeDiagnosticsAvailable": true,
    "cghsEmpanelled": true,
    "danEmpanelled": false,
    "jsyAvailable": false,
    "echsEmpanelled": true,
    "generalBedsUsed": 310,
    "icuBedsUsed": 42,
    "privateRoomsUsed": 34,
    "doctors": [],
    "equipment": [
      {
        "name": "CT Scanner",
        "status": "AVAILABLE",
        "count": 1
      },
      {
        "name": "MRI Scanner",
        "status": "AVAILABLE",
        "count": 1
      },
      {
        "name": "ICU Ventilators",
        "status": "AVAILABLE",
        "count": 40
      },
      {
        "name": "Dialysis Machines",
        "status": "AVAILABLE",
        "count": 6
      },
      {
        "name": "Emergency Trauma OT",
        "status": "AVAILABLE",
        "count": 2
      }
    ],
    "specialists": [
      "Cardiology",
      "General Surgery",
      "Orthopaedics",
      "Obstetrics & Gynaecology",
      "Pediatrics",
      "Critical Care"
    ],
    "bloodStock": {
      "O+": 19,
      "O-": 5,
      "A+": 15,
      "A-": 3,
      "B+": 20,
      "B-": 5,
      "AB+": 10,
      "AB-": 2
    },
    "pmjayEmpanelled": true,
    "emergencyAvailable": true
  },
  {
    "id": "hosp-ststephens-tishazari",
    "name": "St. Stephen's Hospital",
    "type": "Tertiary",
    "district": "Central Delhi",
    "state": "Delhi",
    "lat": 28.665,
    "lng": 77.218,
    "generalBeds": 600,
    "icuBeds": 70,
    "privateRooms": 50,
    "phone": "011-23966021",
    "city": "Delhi",
    "area": "Tis Hazari",
    "address": "St. Stephen's Hospital Marg Tis Hazari Delhi 110054",
    "rating": 4.5,
    "specialties": [
      "Cardiology",
      "Orthopaedics",
      "General Medicine",
      "General Surgery",
      "Pediatrics",
      "Gynecology"
    ],
    "schemes": [
      "PM-JAY",
      "CGHS",
      "ECHS",
      "Farishte Dilli Ke"
    ],
    "dakEmpanelled": false,
    "freeSurgeryEmpanelled": true,
    "freeDiagnosticsAvailable": true,
    "cghsEmpanelled": true,
    "danEmpanelled": false,
    "jsyAvailable": false,
    "echsEmpanelled": true,
    "generalBedsUsed": 534,
    "icuBedsUsed": 59,
    "privateRoomsUsed": 41,
    "doctors": [],
    "equipment": [
      {
        "name": "CT Scanner",
        "status": "AVAILABLE",
        "count": 3
      },
      {
        "name": "MRI Scanner",
        "status": "AVAILABLE",
        "count": 2
      },
      {
        "name": "ICU Ventilators",
        "status": "AVAILABLE",
        "count": 56
      },
      {
        "name": "Dialysis Machines",
        "status": "AVAILABLE",
        "count": 12
      },
      {
        "name": "Emergency Trauma OT",
        "status": "AVAILABLE",
        "count": 4
      }
    ],
    "specialists": [
      "Cardiology",
      "Orthopaedics",
      "General Medicine",
      "General Surgery",
      "Pediatrics",
      "Gynecology"
    ],
    "bloodStock": {
      "O+": 36,
      "O-": 9,
      "A+": 28,
      "A-": 7,
      "B+": 38,
      "B-": 9,
      "AB+": 19,
      "AB-": 4
    },
    "pmjayEmpanelled": true,
    "emergencyAvailable": true
  },
  {
    "id": "hosp-moolchand-lajpatnagar",
    "name": "Moolchand Medcity",
    "type": "Tertiary",
    "district": "South East Delhi",
    "state": "Delhi",
    "lat": 28.568,
    "lng": 77.238,
    "generalBeds": 350,
    "icuBeds": 50,
    "privateRooms": 50,
    "phone": "011-42000000",
    "city": "Delhi",
    "area": "Lajpat Nagar III",
    "address": "Lala Lajpat Rai Marg Near Moolchand Metro Station New Delhi 110024",
    "rating": 4.5,
    "specialties": [
      "Cardiology",
      "Orthopaedics",
      "Oncology",
      "IVF & Fertility",
      "Gastroenterology",
      "Nephrology"
    ],
    "schemes": [
      "PM-JAY",
      "CGHS",
      "ECHS",
      "Farishte Dilli Ke"
    ],
    "dakEmpanelled": false,
    "freeSurgeryEmpanelled": true,
    "freeDiagnosticsAvailable": true,
    "cghsEmpanelled": true,
    "danEmpanelled": false,
    "jsyAvailable": false,
    "echsEmpanelled": true,
    "generalBedsUsed": 308,
    "icuBedsUsed": 43,
    "privateRoomsUsed": 43,
    "doctors": [],
    "equipment": [
      {
        "name": "CT Scanner",
        "status": "AVAILABLE",
        "count": 1
      },
      {
        "name": "MRI Scanner",
        "status": "AVAILABLE",
        "count": 1
      },
      {
        "name": "ICU Ventilators",
        "status": "AVAILABLE",
        "count": 40
      },
      {
        "name": "Dialysis Machines",
        "status": "AVAILABLE",
        "count": 7
      },
      {
        "name": "Emergency Trauma OT",
        "status": "AVAILABLE",
        "count": 2
      }
    ],
    "specialists": [
      "Cardiology",
      "Orthopaedics",
      "Oncology",
      "IVF & Fertility",
      "Gastroenterology",
      "Nephrology"
    ],
    "bloodStock": {
      "O+": 21,
      "O-": 5,
      "A+": 16,
      "A-": 4,
      "B+": 22,
      "B-": 5,
      "AB+": 11,
      "AB-": 2
    },
    "pmjayEmpanelled": true,
    "emergencyAvailable": true
  },
  {
    "id": "hosp-primus-chanakyapuri",
    "name": "Primus Super Speciality Hospital",
    "type": "Tertiary",
    "district": "New Delhi",
    "state": "Delhi",
    "lat": 28.598,
    "lng": 77.185,
    "generalBeds": 250,
    "icuBeds": 40,
    "privateRooms": 35,
    "phone": "011-66206640",
    "city": "Delhi",
    "area": "Chanakyapuri Diplomatic Enclave",
    "address": "Chandragupta Marg Chanakyapuri New Delhi 110021",
    "rating": 4.5,
    "specialties": [
      "Joint Replacement",
      "Spine Surgery",
      "Cardiology",
      "Neurosurgery",
      "Renal Transplant",
      "IVF"
    ],
    "schemes": [
      "PM-JAY",
      "CGHS",
      "ECHS",
      "Farishte Dilli Ke"
    ],
    "dakEmpanelled": false,
    "freeSurgeryEmpanelled": true,
    "freeDiagnosticsAvailable": true,
    "cghsEmpanelled": true,
    "danEmpanelled": false,
    "jsyAvailable": false,
    "echsEmpanelled": true,
    "generalBedsUsed": 217,
    "icuBedsUsed": 34,
    "privateRoomsUsed": 29,
    "doctors": [],
    "equipment": [
      {
        "name": "CT Scanner",
        "status": "AVAILABLE",
        "count": 1
      },
      {
        "name": "MRI Scanner",
        "status": "AVAILABLE",
        "count": 1
      },
      {
        "name": "ICU Ventilators",
        "status": "AVAILABLE",
        "count": 32
      },
      {
        "name": "Dialysis Machines",
        "status": "AVAILABLE",
        "count": 5
      },
      {
        "name": "Emergency Trauma OT",
        "status": "AVAILABLE",
        "count": 2
      }
    ],
    "specialists": [
      "Joint Replacement",
      "Spine Surgery",
      "Cardiology",
      "Neurosurgery",
      "Renal Transplant",
      "IVF"
    ],
    "bloodStock": {
      "O+": 15,
      "O-": 4,
      "A+": 12,
      "A-": 3,
      "B+": 16,
      "B-": 4,
      "AB+": 8,
      "AB-": 2
    },
    "pmjayEmpanelled": true,
    "emergencyAvailable": true
  },
  {
    "id": "hosp-agrasen-punjabibagh",
    "name": "Maharaja Agrasen Hospital",
    "type": "Tertiary",
    "district": "West Delhi",
    "state": "Delhi",
    "lat": 28.668,
    "lng": 77.129,
    "generalBeds": 400,
    "icuBeds": 60,
    "privateRooms": 50,
    "phone": "011-40777777",
    "city": "Delhi",
    "area": "Punjabi Bagh",
    "address": "Rohtak Road West Punjabi Bagh New Delhi 110026",
    "rating": 4.4,
    "specialties": [
      "Cardiology",
      "Neurosurgery",
      "Oncology",
      "Gastroenterology",
      "Orthopaedics",
      "Critical Care"
    ],
    "schemes": [
      "PM-JAY",
      "CGHS",
      "ECHS",
      "Delhi Free Surgery Scheme",
      "Farishte Dilli Ke"
    ],
    "dakEmpanelled": false,
    "freeSurgeryEmpanelled": true,
    "freeDiagnosticsAvailable": true,
    "cghsEmpanelled": true,
    "danEmpanelled": false,
    "jsyAvailable": false,
    "echsEmpanelled": true,
    "generalBedsUsed": 344,
    "icuBedsUsed": 52,
    "privateRoomsUsed": 40,
    "doctors": [],
    "equipment": [
      {
        "name": "CT Scanner",
        "status": "AVAILABLE",
        "count": 2
      },
      {
        "name": "MRI Scanner",
        "status": "AVAILABLE",
        "count": 1
      },
      {
        "name": "ICU Ventilators",
        "status": "AVAILABLE",
        "count": 48
      },
      {
        "name": "Dialysis Machines",
        "status": "AVAILABLE",
        "count": 8
      },
      {
        "name": "Emergency Trauma OT",
        "status": "AVAILABLE",
        "count": 2
      }
    ],
    "specialists": [
      "Cardiology",
      "Neurosurgery",
      "Oncology",
      "Gastroenterology",
      "Orthopaedics",
      "Critical Care"
    ],
    "bloodStock": {
      "O+": 24,
      "O-": 6,
      "A+": 19,
      "A-": 4,
      "B+": 25,
      "B-": 6,
      "AB+": 12,
      "AB-": 3
    },
    "pmjayEmpanelled": true,
    "emergencyAvailable": true
  },
  {
    "id": "hosp-jaipurgolden-rohini",
    "name": "Jaipur Golden Hospital",
    "type": "Tertiary",
    "district": "North West Delhi",
    "state": "Delhi",
    "lat": 28.699,
    "lng": 77.108,
    "generalBeds": 250,
    "icuBeds": 40,
    "privateRooms": 30,
    "phone": "011-27907000",
    "city": "Delhi",
    "area": "Rohini Sector 3",
    "address": "2 Institutional Area Sector 3 Rohini Delhi 110085",
    "rating": 4.3,
    "specialties": [
      "Cardiology",
      "Nephrology",
      "General Surgery",
      "Orthopaedics",
      "Pediatrics",
      "Obstetrics & Gynaecology"
    ],
    "schemes": [
      "Delhi Free Surgery Scheme",
      "PM-JAY",
      "CGHS",
      "ECHS",
      "Farishte Dilli Ke"
    ],
    "dakEmpanelled": false,
    "freeSurgeryEmpanelled": true,
    "freeDiagnosticsAvailable": true,
    "cghsEmpanelled": true,
    "danEmpanelled": false,
    "jsyAvailable": false,
    "echsEmpanelled": true,
    "generalBedsUsed": 212,
    "icuBedsUsed": 35,
    "privateRoomsUsed": 25,
    "doctors": [],
    "equipment": [
      {
        "name": "CT Scanner",
        "status": "AVAILABLE",
        "count": 1
      },
      {
        "name": "MRI Scanner",
        "status": "AVAILABLE",
        "count": 1
      },
      {
        "name": "ICU Ventilators",
        "status": "AVAILABLE",
        "count": 32
      },
      {
        "name": "Dialysis Machines",
        "status": "AVAILABLE",
        "count": 5
      },
      {
        "name": "Emergency Trauma OT",
        "status": "AVAILABLE",
        "count": 2
      }
    ],
    "specialists": [
      "Cardiology",
      "Nephrology",
      "General Surgery",
      "Orthopaedics",
      "Pediatrics",
      "Obstetrics & Gynaecology"
    ],
    "bloodStock": {
      "O+": 15,
      "O-": 4,
      "A+": 12,
      "A-": 3,
      "B+": 16,
      "B-": 4,
      "AB+": 8,
      "AB-": 2
    },
    "pmjayEmpanelled": true,
    "emergencyAvailable": true
  },
  {
    "id": "hosp-action-paschimvihar",
    "name": "Sri Balaji Action Medical Institute",
    "type": "Tertiary",
    "district": "West Delhi",
    "state": "Delhi",
    "lat": 28.674,
    "lng": 77.098,
    "generalBeds": 350,
    "icuBeds": 50,
    "privateRooms": 40,
    "phone": "011-42888888",
    "city": "Delhi",
    "area": "Paschim Vihar",
    "address": "A-4 Paschim Vihar New Delhi 110063",
    "rating": 4.5,
    "specialties": [
      "Cardiology",
      "Oncology",
      "Neurosurgery",
      "Renal Sciences",
      "Orthopaedics",
      "Gastroenterology"
    ],
    "schemes": [
      "Delhi Free Surgery Scheme",
      "PM-JAY",
      "CGHS",
      "ECHS",
      "Farishte Dilli Ke"
    ],
    "dakEmpanelled": false,
    "freeSurgeryEmpanelled": true,
    "freeDiagnosticsAvailable": true,
    "cghsEmpanelled": true,
    "danEmpanelled": false,
    "jsyAvailable": false,
    "echsEmpanelled": true,
    "generalBedsUsed": 294,
    "icuBedsUsed": 44,
    "privateRoomsUsed": 33,
    "doctors": [],
    "equipment": [
      {
        "name": "CT Scanner",
        "status": "AVAILABLE",
        "count": 1
      },
      {
        "name": "MRI Scanner",
        "status": "AVAILABLE",
        "count": 1
      },
      {
        "name": "ICU Ventilators",
        "status": "AVAILABLE",
        "count": 40
      },
      {
        "name": "Dialysis Machines",
        "status": "AVAILABLE",
        "count": 7
      },
      {
        "name": "Emergency Trauma OT",
        "status": "AVAILABLE",
        "count": 2
      }
    ],
    "specialists": [
      "Cardiology",
      "Oncology",
      "Neurosurgery",
      "Renal Sciences",
      "Orthopaedics",
      "Gastroenterology"
    ],
    "bloodStock": {
      "O+": 21,
      "O-": 5,
      "A+": 16,
      "A-": 4,
      "B+": 22,
      "B-": 5,
      "AB+": 11,
      "AB-": 2
    },
    "pmjayEmpanelled": true,
    "emergencyAvailable": true
  },
  {
    "id": "hosp-psri-sheikhsarai",
    "name": "Pushpawati Singhania Hospital & Research Institute (PSRI)",
    "type": "Tertiary",
    "district": "South Delhi",
    "state": "Delhi",
    "lat": 28.535,
    "lng": 77.231,
    "generalBeds": 210,
    "icuBeds": 35,
    "privateRooms": 30,
    "phone": "011-30611700",
    "city": "Delhi",
    "area": "Sheikh Sarai Phase II",
    "address": "Press Enclave Marg Sheikh Sarai II New Delhi 110017",
    "rating": 4.5,
    "specialties": [
      "Gastroenterology",
      "Liver Transplant",
      "Cardiology",
      "Renal Sciences",
      "Orthopaedics",
      "Pulmonology"
    ],
    "schemes": [
      "PM-JAY",
      "CGHS",
      "ECHS",
      "Farishte Dilli Ke"
    ],
    "dakEmpanelled": false,
    "freeSurgeryEmpanelled": true,
    "freeDiagnosticsAvailable": true,
    "cghsEmpanelled": true,
    "danEmpanelled": false,
    "jsyAvailable": false,
    "echsEmpanelled": true,
    "generalBedsUsed": 193,
    "icuBedsUsed": 31,
    "privateRoomsUsed": 24,
    "doctors": [],
    "equipment": [
      {
        "name": "CT Scanner",
        "status": "AVAILABLE",
        "count": 1
      },
      {
        "name": "MRI Scanner",
        "status": "AVAILABLE",
        "count": 1
      },
      {
        "name": "ICU Ventilators",
        "status": "AVAILABLE",
        "count": 28
      },
      {
        "name": "Dialysis Machines",
        "status": "AVAILABLE",
        "count": 4
      },
      {
        "name": "Emergency Trauma OT",
        "status": "AVAILABLE",
        "count": 2
      }
    ],
    "specialists": [
      "Gastroenterology",
      "Liver Transplant",
      "Cardiology",
      "Renal Sciences",
      "Orthopaedics",
      "Pulmonology"
    ],
    "bloodStock": {
      "O+": 12,
      "O-": 3,
      "A+": 9,
      "A-": 2,
      "B+": 12,
      "B-": 3,
      "AB+": 6,
      "AB-": 1
    },
    "pmjayEmpanelled": true,
    "emergencyAvailable": true
  },
  {
    "id": "hosp-district-noida",
    "name": "District Combined Hospital Noida",
    "type": "Government",
    "district": "Gautam Budh Nagar",
    "state": "Uttar Pradesh",
    "lat": 28.5658,
    "lng": 77.3524,
    "generalBeds": 300,
    "icuBeds": 25,
    "privateRooms": 15,
    "phone": "0120-2502100",
    "city": "Noida",
    "area": "Sector 39",
    "address": "Sector 39 Noida Uttar Pradesh 201301",
    "rating": 4,
    "specialties": [
      "General Medicine",
      "Emergency",
      "Obstetrics & Gynaecology",
      "Paediatrics",
      "Surgery",
      "Orthopaedics"
    ],
    "schemes": [
      "PM-JAY (Ayushman Bharat)",
      "UP Mukhyamantri Jan Arogya Yojana",
      "Janani Suraksha Yojana",
      "NTEP"
    ],
    "dakEmpanelled": false,
    "freeSurgeryEmpanelled": false,
    "freeDiagnosticsAvailable": false,
    "cghsEmpanelled": true,
    "danEmpanelled": false,
    "jsyAvailable": true,
    "echsEmpanelled": true,
    "generalBedsUsed": 273,
    "icuBedsUsed": 23,
    "privateRoomsUsed": 12,
    "doctors": [],
    "equipment": [
      {
        "name": "CT Scanner",
        "status": "AVAILABLE",
        "count": 1
      },
      {
        "name": "MRI Scanner",
        "status": "AVAILABLE",
        "count": 1
      },
      {
        "name": "ICU Ventilators",
        "status": "AVAILABLE",
        "count": 20
      },
      {
        "name": "Dialysis Machines",
        "status": "AVAILABLE",
        "count": 6
      },
      {
        "name": "Emergency Trauma OT",
        "status": "AVAILABLE",
        "count": 2
      }
    ],
    "specialists": [
      "General Medicine",
      "Emergency",
      "Obstetrics & Gynaecology",
      "Paediatrics",
      "Surgery",
      "Orthopaedics"
    ],
    "bloodStock": {
      "O+": 18,
      "O-": 4,
      "A+": 14,
      "A-": 3,
      "B+": 19,
      "B-": 4,
      "AB+": 9,
      "AB-": 2
    },
    "pmjayEmpanelled": true,
    "emergencyAvailable": true
  },
  {
    "id": "hosp-gims-grnoida",
    "name": "Government Institute of Medical Sciences (GIMS)",
    "type": "Government",
    "district": "Gautam Budh Nagar",
    "state": "Uttar Pradesh",
    "lat": 28.4682,
    "lng": 77.5028,
    "generalBeds": 500,
    "icuBeds": 50,
    "privateRooms": 20,
    "phone": "0120-2341700",
    "city": "Greater Noida",
    "area": "Knowledge Park II",
    "address": "Knowledge Park II Greater Noida Uttar Pradesh 201310",
    "rating": 4.3,
    "specialties": [
      "General Medicine",
      "Surgery",
      "Orthopaedics",
      "Paediatrics",
      "Pulmonology",
      "Emergency",
      "Cardiology"
    ],
    "schemes": [
      "PM-JAY (Ayushman Bharat)",
      "UP Mukhyamantri Jan Arogya",
      "CGHS",
      "ECHS",
      "JSY"
    ],
    "dakEmpanelled": false,
    "freeSurgeryEmpanelled": false,
    "freeDiagnosticsAvailable": false,
    "cghsEmpanelled": true,
    "danEmpanelled": false,
    "jsyAvailable": true,
    "echsEmpanelled": true,
    "generalBedsUsed": 449,
    "icuBedsUsed": 41,
    "privateRoomsUsed": 16,
    "doctors": [],
    "equipment": [
      {
        "name": "CT Scanner",
        "status": "AVAILABLE",
        "count": 2
      },
      {
        "name": "MRI Scanner",
        "status": "AVAILABLE",
        "count": 1
      },
      {
        "name": "ICU Ventilators",
        "status": "AVAILABLE",
        "count": 40
      },
      {
        "name": "Dialysis Machines",
        "status": "AVAILABLE",
        "count": 10
      },
      {
        "name": "Emergency Trauma OT",
        "status": "AVAILABLE",
        "count": 3
      }
    ],
    "specialists": [
      "General Medicine",
      "Surgery",
      "Orthopaedics",
      "Paediatrics",
      "Pulmonology",
      "Emergency",
      "Cardiology"
    ],
    "bloodStock": {
      "O+": 30,
      "O-": 8,
      "A+": 24,
      "A-": 6,
      "B+": 32,
      "B-": 8,
      "AB+": 16,
      "AB-": 4
    },
    "pmjayEmpanelled": true,
    "emergencyAvailable": true
  },
  {
    "id": "hosp-jaypee-noida",
    "name": "Jaypee Hospital Noida Sector 128",
    "type": "Tertiary",
    "district": "Gautam Budh Nagar",
    "state": "Uttar Pradesh",
    "lat": 28.5135,
    "lng": 77.3758,
    "generalBeds": 525,
    "icuBeds": 70,
    "privateRooms": 75,
    "phone": "0120-4122222",
    "city": "Noida",
    "area": "Sector 128",
    "address": "Sector 128 Wish Town Noida Uttar Pradesh 201304",
    "rating": 4.7,
    "specialties": [
      "Cardiology",
      "Neurosurgery",
      "Oncology",
      "Organ Transplant",
      "Gastroenterology",
      "Pediatric Surgery"
    ],
    "schemes": [
      "PM-JAY",
      "CGHS",
      "ECHS",
      "Ayushman Bharat Golden Card",
      "National Health Insurance"
    ],
    "dakEmpanelled": false,
    "freeSurgeryEmpanelled": false,
    "freeDiagnosticsAvailable": false,
    "cghsEmpanelled": true,
    "danEmpanelled": false,
    "jsyAvailable": false,
    "echsEmpanelled": true,
    "generalBedsUsed": 467,
    "icuBedsUsed": 58,
    "privateRoomsUsed": 65,
    "doctors": [],
    "equipment": [
      {
        "name": "CT Scanner",
        "status": "AVAILABLE",
        "count": 2
      },
      {
        "name": "MRI Scanner",
        "status": "AVAILABLE",
        "count": 1
      },
      {
        "name": "ICU Ventilators",
        "status": "AVAILABLE",
        "count": 56
      },
      {
        "name": "Dialysis Machines",
        "status": "AVAILABLE",
        "count": 10
      },
      {
        "name": "Emergency Trauma OT",
        "status": "AVAILABLE",
        "count": 3
      }
    ],
    "specialists": [
      "Cardiology",
      "Neurosurgery",
      "Oncology",
      "Organ Transplant",
      "Gastroenterology",
      "Pediatric Surgery"
    ],
    "bloodStock": {
      "O+": 31,
      "O-": 8,
      "A+": 25,
      "A-": 6,
      "B+": 33,
      "B-": 8,
      "AB+": 16,
      "AB-": 4
    },
    "pmjayEmpanelled": true,
    "emergencyAvailable": true
  },
  {
    "id": "hosp-fortis-noida",
    "name": "Fortis Hospital Noida Sector 62",
    "type": "Tertiary",
    "district": "Gautam Budh Nagar",
    "state": "Uttar Pradesh",
    "lat": 28.6189,
    "lng": 77.3725,
    "generalBeds": 200,
    "icuBeds": 40,
    "privateRooms": 35,
    "phone": "0120-4300222",
    "city": "Noida",
    "area": "Sector 62",
    "address": "B-22 Sector 62 Noida Uttar Pradesh 201301",
    "rating": 4.6,
    "specialties": [
      "Cardiology",
      "Neurology",
      "Orthopaedics",
      "Oncology",
      "Critical Care",
      "Kidney Transplant"
    ],
    "schemes": [
      "PM-JAY",
      "CGHS",
      "ECHS",
      "UP Ayushman Golden Card"
    ],
    "dakEmpanelled": false,
    "freeSurgeryEmpanelled": false,
    "freeDiagnosticsAvailable": false,
    "cghsEmpanelled": true,
    "danEmpanelled": false,
    "jsyAvailable": false,
    "echsEmpanelled": true,
    "generalBedsUsed": 176,
    "icuBedsUsed": 33,
    "privateRoomsUsed": 29,
    "doctors": [],
    "equipment": [
      {
        "name": "CT Scanner",
        "status": "AVAILABLE",
        "count": 1
      },
      {
        "name": "MRI Scanner",
        "status": "AVAILABLE",
        "count": 1
      },
      {
        "name": "ICU Ventilators",
        "status": "AVAILABLE",
        "count": 32
      },
      {
        "name": "Dialysis Machines",
        "status": "AVAILABLE",
        "count": 4
      },
      {
        "name": "Emergency Trauma OT",
        "status": "AVAILABLE",
        "count": 2
      }
    ],
    "specialists": [
      "Cardiology",
      "Neurology",
      "Orthopaedics",
      "Oncology",
      "Critical Care",
      "Kidney Transplant"
    ],
    "bloodStock": {
      "O+": 12,
      "O-": 3,
      "A+": 9,
      "A-": 2,
      "B+": 12,
      "B-": 3,
      "AB+": 6,
      "AB-": 1
    },
    "pmjayEmpanelled": true,
    "emergencyAvailable": true
  },
  {
    "id": "hosp-kailash-noida",
    "name": "Kailash Hospital & Heart Institute",
    "type": "Tertiary",
    "district": "Gautam Budh Nagar",
    "state": "Uttar Pradesh",
    "lat": 28.578,
    "lng": 77.329,
    "generalBeds": 350,
    "icuBeds": 50,
    "privateRooms": 40,
    "phone": "0120-2444444",
    "city": "Noida",
    "area": "Sector 27",
    "address": "H-33 Sector 27 Noida Uttar Pradesh 201301",
    "rating": 4.4,
    "specialties": [
      "Cardiology",
      "Cardiothoracic Surgery",
      "Neurosurgery",
      "Orthopaedics",
      "Pediatrics",
      "Critical Care"
    ],
    "schemes": [
      "PM-JAY",
      "CGHS",
      "ECHS",
      "UP Ayushman Card"
    ],
    "dakEmpanelled": false,
    "freeSurgeryEmpanelled": false,
    "freeDiagnosticsAvailable": false,
    "cghsEmpanelled": true,
    "danEmpanelled": false,
    "jsyAvailable": false,
    "echsEmpanelled": true,
    "generalBedsUsed": 304,
    "icuBedsUsed": 42,
    "privateRoomsUsed": 32,
    "doctors": [],
    "equipment": [
      {
        "name": "CT Scanner",
        "status": "AVAILABLE",
        "count": 1
      },
      {
        "name": "MRI Scanner",
        "status": "AVAILABLE",
        "count": 1
      },
      {
        "name": "ICU Ventilators",
        "status": "AVAILABLE",
        "count": 40
      },
      {
        "name": "Dialysis Machines",
        "status": "AVAILABLE",
        "count": 7
      },
      {
        "name": "Emergency Trauma OT",
        "status": "AVAILABLE",
        "count": 2
      }
    ],
    "specialists": [
      "Cardiology",
      "Cardiothoracic Surgery",
      "Neurosurgery",
      "Orthopaedics",
      "Pediatrics",
      "Critical Care"
    ],
    "bloodStock": {
      "O+": 21,
      "O-": 5,
      "A+": 16,
      "A-": 4,
      "B+": 22,
      "B-": 5,
      "AB+": 11,
      "AB-": 2
    },
    "pmjayEmpanelled": true,
    "emergencyAvailable": true
  },
  {
    "id": "hosp-felix-noida",
    "name": "Felix Hospital Noida Sector 137",
    "type": "Specialized",
    "district": "Gautam Budh Nagar",
    "state": "Uttar Pradesh",
    "lat": 28.508,
    "lng": 77.408,
    "generalBeds": 150,
    "icuBeds": 25,
    "privateRooms": 20,
    "phone": "0120-4888888",
    "city": "Noida",
    "area": "Sector 137",
    "address": "Sector 137 Express Highway Noida Uttar Pradesh 201305",
    "rating": 4.3,
    "specialties": [
      "General Medicine",
      "Emergency",
      "Paediatrics",
      "Obstetrics & Gynaecology",
      "Cardiology",
      "Orthopaedics"
    ],
    "schemes": [
      "PM-JAY",
      "CGHS",
      "ECHS",
      "UP State Health Scheme"
    ],
    "dakEmpanelled": false,
    "freeSurgeryEmpanelled": false,
    "freeDiagnosticsAvailable": false,
    "cghsEmpanelled": true,
    "danEmpanelled": false,
    "jsyAvailable": true,
    "echsEmpanelled": true,
    "generalBedsUsed": 129,
    "icuBedsUsed": 21,
    "privateRoomsUsed": 17,
    "doctors": [],
    "equipment": [
      {
        "name": "CT Scanner",
        "status": "AVAILABLE",
        "count": 1
      },
      {
        "name": "MRI Scanner",
        "status": "AVAILABLE",
        "count": 1
      },
      {
        "name": "ICU Ventilators",
        "status": "AVAILABLE",
        "count": 20
      },
      {
        "name": "Dialysis Machines",
        "status": "AVAILABLE",
        "count": 4
      },
      {
        "name": "Emergency Trauma OT",
        "status": "AVAILABLE",
        "count": 2
      }
    ],
    "specialists": [
      "General Medicine",
      "Emergency",
      "Paediatrics",
      "Obstetrics & Gynaecology",
      "Cardiology",
      "Orthopaedics"
    ],
    "bloodStock": {
      "O+": 9,
      "O-": 2,
      "A+": 7,
      "A-": 2,
      "B+": 9,
      "B-": 2,
      "AB+": 4,
      "AB-": 1
    },
    "pmjayEmpanelled": true,
    "emergencyAvailable": true
  },
  {
    "id": "hosp-yatharth-noida110",
    "name": "Yatharth Super Speciality Hospital Noida",
    "type": "Specialized",
    "district": "Gautam Budh Nagar",
    "state": "Uttar Pradesh",
    "lat": 28.532,
    "lng": 77.389,
    "generalBeds": 300,
    "icuBeds": 45,
    "privateRooms": 35,
    "phone": "0120-4857000",
    "city": "Noida",
    "area": "Sector 110",
    "address": "Sector 110 Noida Uttar Pradesh 201304",
    "rating": 4.4,
    "specialties": [
      "Cardiology",
      "Orthopaedics",
      "Neurosurgery",
      "Gastroenterology",
      "Critical Care",
      "Oncology"
    ],
    "schemes": [
      "PM-JAY",
      "CGHS",
      "ECHS",
      "UP Ayushman Golden Card"
    ],
    "dakEmpanelled": false,
    "freeSurgeryEmpanelled": false,
    "freeDiagnosticsAvailable": false,
    "cghsEmpanelled": true,
    "danEmpanelled": false,
    "jsyAvailable": false,
    "echsEmpanelled": true,
    "generalBedsUsed": 255,
    "icuBedsUsed": 39,
    "privateRoomsUsed": 29,
    "doctors": [],
    "equipment": [
      {
        "name": "CT Scanner",
        "status": "AVAILABLE",
        "count": 1
      },
      {
        "name": "MRI Scanner",
        "status": "AVAILABLE",
        "count": 1
      },
      {
        "name": "ICU Ventilators",
        "status": "AVAILABLE",
        "count": 36
      },
      {
        "name": "Dialysis Machines",
        "status": "AVAILABLE",
        "count": 6
      },
      {
        "name": "Emergency Trauma OT",
        "status": "AVAILABLE",
        "count": 2
      }
    ],
    "specialists": [
      "Cardiology",
      "Orthopaedics",
      "Neurosurgery",
      "Gastroenterology",
      "Critical Care",
      "Oncology"
    ],
    "bloodStock": {
      "O+": 18,
      "O-": 4,
      "A+": 14,
      "A-": 3,
      "B+": 19,
      "B-": 4,
      "AB+": 9,
      "AB-": 2
    },
    "pmjayEmpanelled": true,
    "emergencyAvailable": true
  },
  {
    "id": "hosp-yatharth-grnoida",
    "name": "Yatharth Super Speciality Hospital Greater Noida",
    "type": "Specialized",
    "district": "Gautam Budh Nagar",
    "state": "Uttar Pradesh",
    "lat": 28.4715,
    "lng": 77.5142,
    "generalBeds": 400,
    "icuBeds": 50,
    "privateRooms": 40,
    "phone": "0120-4857000",
    "city": "Greater Noida",
    "area": "Omega 1 / Pari Chowk",
    "address": "Plot No 1 Omega 1 Near Pari Chowk Greater Noida Uttar Pradesh 201310",
    "rating": 4.4,
    "specialties": [
      "Cardiology",
      "Orthopaedics",
      "Neurosurgery",
      "Oncology",
      "Critical Care",
      "Gastroenterology"
    ],
    "schemes": [
      "PM-JAY",
      "CGHS",
      "ECHS",
      "UP Ayushman Bharat"
    ],
    "dakEmpanelled": false,
    "freeSurgeryEmpanelled": false,
    "freeDiagnosticsAvailable": false,
    "cghsEmpanelled": true,
    "danEmpanelled": false,
    "jsyAvailable": false,
    "echsEmpanelled": true,
    "generalBedsUsed": 336,
    "icuBedsUsed": 43,
    "privateRoomsUsed": 32,
    "doctors": [],
    "equipment": [
      {
        "name": "CT Scanner",
        "status": "AVAILABLE",
        "count": 2
      },
      {
        "name": "MRI Scanner",
        "status": "AVAILABLE",
        "count": 1
      },
      {
        "name": "ICU Ventilators",
        "status": "AVAILABLE",
        "count": 40
      },
      {
        "name": "Dialysis Machines",
        "status": "AVAILABLE",
        "count": 8
      },
      {
        "name": "Emergency Trauma OT",
        "status": "AVAILABLE",
        "count": 2
      }
    ],
    "specialists": [
      "Cardiology",
      "Orthopaedics",
      "Neurosurgery",
      "Oncology",
      "Critical Care",
      "Gastroenterology"
    ],
    "bloodStock": {
      "O+": 24,
      "O-": 6,
      "A+": 19,
      "A-": 4,
      "B+": 25,
      "B-": 6,
      "AB+": 12,
      "AB-": 3
    },
    "pmjayEmpanelled": true,
    "emergencyAvailable": true
  },
  {
    "id": "hosp-sharda-grnoida",
    "name": "Sharda Hospital & Medical College",
    "type": "Specialized",
    "district": "Gautam Budh Nagar",
    "state": "Uttar Pradesh",
    "lat": 28.4735,
    "lng": 77.4831,
    "generalBeds": 900,
    "icuBeds": 90,
    "privateRooms": 50,
    "phone": "0120-4590300",
    "city": "Greater Noida",
    "area": "Knowledge Park III",
    "address": "Plot No 32-34 Knowledge Park III Greater Noida Uttar Pradesh 201306",
    "rating": 4.3,
    "specialties": [
      "Cardiology",
      "Neurology",
      "Nephrology",
      "General Medicine",
      "Surgery",
      "Emergency",
      "Orthopaedics"
    ],
    "schemes": [
      "PM-JAY (Ayushman Bharat)",
      "CGHS",
      "ECHS",
      "UP Ayushman Golden Card"
    ],
    "dakEmpanelled": false,
    "freeSurgeryEmpanelled": false,
    "freeDiagnosticsAvailable": false,
    "cghsEmpanelled": true,
    "danEmpanelled": false,
    "jsyAvailable": true,
    "echsEmpanelled": true,
    "generalBedsUsed": 827,
    "icuBedsUsed": 80,
    "privateRoomsUsed": 42,
    "doctors": [],
    "equipment": [
      {
        "name": "CT Scanner",
        "status": "AVAILABLE",
        "count": 4
      },
      {
        "name": "MRI Scanner",
        "status": "AVAILABLE",
        "count": 3
      },
      {
        "name": "ICU Ventilators",
        "status": "AVAILABLE",
        "count": 72
      },
      {
        "name": "Dialysis Machines",
        "status": "AVAILABLE",
        "count": 18
      },
      {
        "name": "Emergency Trauma OT",
        "status": "AVAILABLE",
        "count": 6
      }
    ],
    "specialists": [
      "Cardiology",
      "Neurology",
      "Nephrology",
      "General Medicine",
      "Surgery",
      "Emergency",
      "Orthopaedics"
    ],
    "bloodStock": {
      "O+": 54,
      "O-": 14,
      "A+": 43,
      "A-": 10,
      "B+": 57,
      "B-": 14,
      "AB+": 28,
      "AB-": 7
    },
    "pmjayEmpanelled": true,
    "emergencyAvailable": true
  },
  {
    "id": "hosp-metro-noida",
    "name": "Metro Hospital & Heart Institute Noida",
    "type": "Specialized",
    "district": "Gautam Budh Nagar",
    "state": "Uttar Pradesh",
    "lat": 28.598,
    "lng": 77.332,
    "generalBeds": 317,
    "icuBeds": 55,
    "privateRooms": 40,
    "phone": "0120-4366666",
    "city": "Noida",
    "area": "Sector 11",
    "address": "L-94 Sector 11 Noida Uttar Pradesh 201301",
    "rating": 4.3,
    "specialties": [
      "Interventional Cardiology",
      "Cardiothoracic Surgery",
      "Pulmonology",
      "Gastroenterology",
      "Critical Care"
    ],
    "schemes": [
      "PM-JAY",
      "CGHS",
      "ECHS",
      "UP Health Scheme"
    ],
    "dakEmpanelled": false,
    "freeSurgeryEmpanelled": false,
    "freeDiagnosticsAvailable": false,
    "cghsEmpanelled": true,
    "danEmpanelled": false,
    "jsyAvailable": false,
    "echsEmpanelled": true,
    "generalBedsUsed": 288,
    "icuBedsUsed": 49,
    "privateRoomsUsed": 32,
    "doctors": [],
    "equipment": [
      {
        "name": "CT Scanner",
        "status": "AVAILABLE",
        "count": 1
      },
      {
        "name": "MRI Scanner",
        "status": "AVAILABLE",
        "count": 1
      },
      {
        "name": "ICU Ventilators",
        "status": "AVAILABLE",
        "count": 44
      },
      {
        "name": "Dialysis Machines",
        "status": "AVAILABLE",
        "count": 6
      },
      {
        "name": "Emergency Trauma OT",
        "status": "AVAILABLE",
        "count": 2
      }
    ],
    "specialists": [
      "Interventional Cardiology",
      "Cardiothoracic Surgery",
      "Pulmonology",
      "Gastroenterology",
      "Critical Care"
    ],
    "bloodStock": {
      "O+": 18,
      "O-": 4,
      "A+": 14,
      "A-": 3,
      "B+": 19,
      "B-": 4,
      "AB+": 9,
      "AB-": 2
    },
    "pmjayEmpanelled": true,
    "emergencyAvailable": true
  },
  {
    "id": "hosp-mmg-ghaziabad",
    "name": "MMG District Hospital Ghaziabad",
    "type": "Government",
    "district": "Ghaziabad",
    "state": "Uttar Pradesh",
    "lat": 28.6882,
    "lng": 77.4428,
    "generalBeds": 250,
    "icuBeds": 20,
    "privateRooms": 10,
    "phone": "0120-2793506",
    "city": "Ghaziabad",
    "area": "GT Road / Sanjay Nagar",
    "address": "Near Old Bus Stand GT Road Ghaziabad Uttar Pradesh 201001",
    "rating": 3.9,
    "specialties": [
      "General Medicine",
      "Surgery",
      "Emergency Trauma",
      "Orthopaedics",
      "Obstetrics & Gynaecology"
    ],
    "schemes": [
      "PM-JAY",
      "UP Mukhyamantri Jan Arogya",
      "Janani Suraksha Yojana",
      "NTEP"
    ],
    "dakEmpanelled": false,
    "freeSurgeryEmpanelled": false,
    "freeDiagnosticsAvailable": false,
    "cghsEmpanelled": true,
    "danEmpanelled": false,
    "jsyAvailable": true,
    "echsEmpanelled": true,
    "generalBedsUsed": 224,
    "icuBedsUsed": 18,
    "privateRoomsUsed": 8,
    "doctors": [],
    "equipment": [
      {
        "name": "CT Scanner",
        "status": "AVAILABLE",
        "count": 1
      },
      {
        "name": "MRI Scanner",
        "status": "AVAILABLE",
        "count": 1
      },
      {
        "name": "ICU Ventilators",
        "status": "AVAILABLE",
        "count": 16
      },
      {
        "name": "Dialysis Machines",
        "status": "AVAILABLE",
        "count": 5
      },
      {
        "name": "Emergency Trauma OT",
        "status": "AVAILABLE",
        "count": 2
      }
    ],
    "specialists": [
      "General Medicine",
      "Surgery",
      "Emergency Trauma",
      "Orthopaedics",
      "Obstetrics & Gynaecology"
    ],
    "bloodStock": {
      "O+": 15,
      "O-": 4,
      "A+": 12,
      "A-": 3,
      "B+": 16,
      "B-": 4,
      "AB+": 8,
      "AB-": 2
    },
    "pmjayEmpanelled": true,
    "emergencyAvailable": true
  },
  {
    "id": "hosp-sanjaynagar-ghaziabad",
    "name": "Combined District Hospital Sanjay Nagar",
    "type": "Government",
    "district": "Ghaziabad",
    "state": "Uttar Pradesh",
    "lat": 28.689,
    "lng": 77.452,
    "generalBeds": 300,
    "icuBeds": 25,
    "privateRooms": 10,
    "phone": "0120-2782100",
    "city": "Ghaziabad",
    "area": "Sector 23 Sanjay Nagar",
    "address": "Sector 23 Sanjay Nagar Ghaziabad Uttar Pradesh 201002",
    "rating": 4,
    "specialties": [
      "General Medicine",
      "Pediatrics",
      "Obstetrics & Gynaecology",
      "Orthopaedics",
      "Emergency Trauma"
    ],
    "schemes": [
      "PM-JAY",
      "UP Ayushman Bharat",
      "JSY",
      "NTEP"
    ],
    "dakEmpanelled": false,
    "freeSurgeryEmpanelled": false,
    "freeDiagnosticsAvailable": false,
    "cghsEmpanelled": true,
    "danEmpanelled": false,
    "jsyAvailable": true,
    "echsEmpanelled": true,
    "generalBedsUsed": 267,
    "icuBedsUsed": 23,
    "privateRoomsUsed": 8,
    "doctors": [],
    "equipment": [
      {
        "name": "CT Scanner",
        "status": "AVAILABLE",
        "count": 1
      },
      {
        "name": "MRI Scanner",
        "status": "AVAILABLE",
        "count": 1
      },
      {
        "name": "ICU Ventilators",
        "status": "AVAILABLE",
        "count": 20
      },
      {
        "name": "Dialysis Machines",
        "status": "AVAILABLE",
        "count": 6
      },
      {
        "name": "Emergency Trauma OT",
        "status": "AVAILABLE",
        "count": 2
      }
    ],
    "specialists": [
      "General Medicine",
      "Pediatrics",
      "Obstetrics & Gynaecology",
      "Orthopaedics",
      "Emergency Trauma"
    ],
    "bloodStock": {
      "O+": 18,
      "O-": 4,
      "A+": 14,
      "A-": 3,
      "B+": 19,
      "B-": 4,
      "AB+": 9,
      "AB-": 2
    },
    "pmjayEmpanelled": true,
    "emergencyAvailable": true
  },
  {
    "id": "hosp-max-vaishali",
    "name": "Max Super Speciality Hospital Vaishali",
    "type": "Tertiary",
    "district": "Ghaziabad",
    "state": "Uttar Pradesh",
    "lat": 28.6438,
    "lng": 77.3385,
    "generalBeds": 370,
    "icuBeds": 60,
    "privateRooms": 50,
    "phone": "0120-4016000",
    "city": "Ghaziabad",
    "area": "Vaishali Sector 1",
    "address": "W-3 Sector 1 Vaishali Ghaziabad Uttar Pradesh 201010",
    "rating": 4.6,
    "specialties": [
      "Cardiology",
      "Oncology",
      "Neurology",
      "Orthopaedics",
      "Gastroenterology",
      "Critical Care",
      "Kidney Transplant"
    ],
    "schemes": [
      "PM-JAY",
      "CGHS",
      "ECHS",
      "Ayushman Golden Card",
      "Private Cashless Health Cover"
    ],
    "dakEmpanelled": false,
    "freeSurgeryEmpanelled": false,
    "freeDiagnosticsAvailable": false,
    "cghsEmpanelled": true,
    "danEmpanelled": false,
    "jsyAvailable": false,
    "echsEmpanelled": true,
    "generalBedsUsed": 325,
    "icuBedsUsed": 49,
    "privateRoomsUsed": 40,
    "doctors": [],
    "equipment": [
      {
        "name": "CT Scanner",
        "status": "AVAILABLE",
        "count": 1
      },
      {
        "name": "MRI Scanner",
        "status": "AVAILABLE",
        "count": 1
      },
      {
        "name": "ICU Ventilators",
        "status": "AVAILABLE",
        "count": 48
      },
      {
        "name": "Dialysis Machines",
        "status": "AVAILABLE",
        "count": 7
      },
      {
        "name": "Emergency Trauma OT",
        "status": "AVAILABLE",
        "count": 2
      }
    ],
    "specialists": [
      "Cardiology",
      "Oncology",
      "Neurology",
      "Orthopaedics",
      "Gastroenterology",
      "Critical Care",
      "Kidney Transplant"
    ],
    "bloodStock": {
      "O+": 21,
      "O-": 5,
      "A+": 16,
      "A-": 4,
      "B+": 22,
      "B-": 5,
      "AB+": 11,
      "AB-": 2
    },
    "pmjayEmpanelled": true,
    "emergencyAvailable": true
  },
  {
    "id": "hosp-yashoda-kaushambi",
    "name": "Yashoda Super Speciality Hospital Kaushambi",
    "type": "Specialized",
    "district": "Ghaziabad",
    "state": "Uttar Pradesh",
    "lat": 28.6445,
    "lng": 77.3218,
    "generalBeds": 350,
    "icuBeds": 45,
    "privateRooms": 40,
    "phone": "0120-4182000",
    "city": "Ghaziabad",
    "area": "Kaushambi",
    "address": "Kaushambi Near Anand Vihar Ghaziabad Uttar Pradesh 201010",
    "rating": 4.5,
    "specialties": [
      "Cardiology",
      "Neurology",
      "Nephrology",
      "Urology",
      "Gastroenterology",
      "Orthopaedics",
      "Pulmonology"
    ],
    "schemes": [
      "PM-JAY",
      "CGHS",
      "ECHS",
      "UP Ayushman Bharat"
    ],
    "dakEmpanelled": false,
    "freeSurgeryEmpanelled": false,
    "freeDiagnosticsAvailable": false,
    "cghsEmpanelled": true,
    "danEmpanelled": false,
    "jsyAvailable": false,
    "echsEmpanelled": true,
    "generalBedsUsed": 304,
    "icuBedsUsed": 37,
    "privateRoomsUsed": 34,
    "doctors": [],
    "equipment": [
      {
        "name": "CT Scanner",
        "status": "AVAILABLE",
        "count": 1
      },
      {
        "name": "MRI Scanner",
        "status": "AVAILABLE",
        "count": 1
      },
      {
        "name": "ICU Ventilators",
        "status": "AVAILABLE",
        "count": 36
      },
      {
        "name": "Dialysis Machines",
        "status": "AVAILABLE",
        "count": 7
      },
      {
        "name": "Emergency Trauma OT",
        "status": "AVAILABLE",
        "count": 2
      }
    ],
    "specialists": [
      "Cardiology",
      "Neurology",
      "Nephrology",
      "Urology",
      "Gastroenterology",
      "Orthopaedics",
      "Pulmonology"
    ],
    "bloodStock": {
      "O+": 21,
      "O-": 5,
      "A+": 16,
      "A-": 4,
      "B+": 22,
      "B-": 5,
      "AB+": 11,
      "AB-": 2
    },
    "pmjayEmpanelled": true,
    "emergencyAvailable": true
  },
  {
    "id": "hosp-yashoda-nehrunagar",
    "name": "Yashoda Hospital & Research Centre Nehru Nagar",
    "type": "Specialized",
    "district": "Ghaziabad",
    "state": "Uttar Pradesh",
    "lat": 28.665,
    "lng": 77.435,
    "generalBeds": 300,
    "icuBeds": 40,
    "privateRooms": 35,
    "phone": "0120-4555555",
    "city": "Ghaziabad",
    "area": "Nehru Nagar III",
    "address": "III M Nehru Nagar Ghaziabad Uttar Pradesh 201001",
    "rating": 4.4,
    "specialties": [
      "Cardiology",
      "Neurosurgery",
      "Orthopaedics",
      "Oncology",
      "Gastroenterology",
      "Critical Care"
    ],
    "schemes": [
      "PM-JAY",
      "CGHS",
      "ECHS",
      "UP Ayushman Card"
    ],
    "dakEmpanelled": false,
    "freeSurgeryEmpanelled": false,
    "freeDiagnosticsAvailable": false,
    "cghsEmpanelled": true,
    "danEmpanelled": false,
    "jsyAvailable": false,
    "echsEmpanelled": true,
    "generalBedsUsed": 258,
    "icuBedsUsed": 33,
    "privateRoomsUsed": 29,
    "doctors": [],
    "equipment": [
      {
        "name": "CT Scanner",
        "status": "AVAILABLE",
        "count": 1
      },
      {
        "name": "MRI Scanner",
        "status": "AVAILABLE",
        "count": 1
      },
      {
        "name": "ICU Ventilators",
        "status": "AVAILABLE",
        "count": 32
      },
      {
        "name": "Dialysis Machines",
        "status": "AVAILABLE",
        "count": 6
      },
      {
        "name": "Emergency Trauma OT",
        "status": "AVAILABLE",
        "count": 2
      }
    ],
    "specialists": [
      "Cardiology",
      "Neurosurgery",
      "Orthopaedics",
      "Oncology",
      "Gastroenterology",
      "Critical Care"
    ],
    "bloodStock": {
      "O+": 18,
      "O-": 4,
      "A+": 14,
      "A-": 3,
      "B+": 19,
      "B-": 4,
      "AB+": 9,
      "AB-": 2
    },
    "pmjayEmpanelled": true,
    "emergencyAvailable": true
  },
  {
    "id": "hosp-manipal-ghaziabad",
    "name": "Manipal Hospital Ghaziabad (NH-24)",
    "type": "Tertiary",
    "district": "Ghaziabad",
    "state": "Uttar Pradesh",
    "lat": 28.632,
    "lng": 77.412,
    "generalBeds": 250,
    "icuBeds": 40,
    "privateRooms": 30,
    "phone": "0120-4766666",
    "city": "Ghaziabad",
    "area": "Pandav Nagar / NH-24",
    "address": "NH-24 Hapur Road Near LandCraft GolfLinks Ghaziabad Uttar Pradesh 201002",
    "rating": 4.4,
    "specialties": [
      "Cardiology",
      "Orthopaedics",
      "Neurology",
      "Gastroenterology",
      "Oncology",
      "Critical Care"
    ],
    "schemes": [
      "PM-JAY",
      "CGHS",
      "ECHS",
      "UP Ayushman Golden Card"
    ],
    "dakEmpanelled": false,
    "freeSurgeryEmpanelled": false,
    "freeDiagnosticsAvailable": false,
    "cghsEmpanelled": true,
    "danEmpanelled": false,
    "jsyAvailable": false,
    "echsEmpanelled": true,
    "generalBedsUsed": 212,
    "icuBedsUsed": 34,
    "privateRoomsUsed": 24,
    "doctors": [],
    "equipment": [
      {
        "name": "CT Scanner",
        "status": "AVAILABLE",
        "count": 1
      },
      {
        "name": "MRI Scanner",
        "status": "AVAILABLE",
        "count": 1
      },
      {
        "name": "ICU Ventilators",
        "status": "AVAILABLE",
        "count": 32
      },
      {
        "name": "Dialysis Machines",
        "status": "AVAILABLE",
        "count": 5
      },
      {
        "name": "Emergency Trauma OT",
        "status": "AVAILABLE",
        "count": 2
      }
    ],
    "specialists": [
      "Cardiology",
      "Orthopaedics",
      "Neurology",
      "Gastroenterology",
      "Oncology",
      "Critical Care"
    ],
    "bloodStock": {
      "O+": 15,
      "O-": 4,
      "A+": 12,
      "A-": 3,
      "B+": 16,
      "B-": 4,
      "AB+": 8,
      "AB-": 2
    },
    "pmjayEmpanelled": true,
    "emergencyAvailable": true
  },
  {
    "id": "hosp-santosh-ghaziabad",
    "name": "Santosh Hospital & Medical College",
    "type": "Specialized",
    "district": "Ghaziabad",
    "state": "Uttar Pradesh",
    "lat": 28.658,
    "lng": 77.422,
    "generalBeds": 700,
    "icuBeds": 70,
    "privateRooms": 30,
    "phone": "0120-2741141",
    "city": "Ghaziabad",
    "area": "Pratap Vihar",
    "address": "1 Santosh Nagar Pratap Vihar Ghaziabad Uttar Pradesh 201009",
    "rating": 4.2,
    "specialties": [
      "General Medicine",
      "General Surgery",
      "Orthopaedics",
      "Pediatrics",
      "Obstetrics & Gynaecology",
      "Cardiology"
    ],
    "schemes": [
      "PM-JAY",
      "UP Mukhyamantri Jan Arogya",
      "CGHS",
      "ECHS",
      "JSY"
    ],
    "dakEmpanelled": false,
    "freeSurgeryEmpanelled": false,
    "freeDiagnosticsAvailable": false,
    "cghsEmpanelled": true,
    "danEmpanelled": false,
    "jsyAvailable": true,
    "echsEmpanelled": true,
    "generalBedsUsed": 588,
    "icuBedsUsed": 60,
    "privateRoomsUsed": 25,
    "doctors": [],
    "equipment": [
      {
        "name": "CT Scanner",
        "status": "AVAILABLE",
        "count": 3
      },
      {
        "name": "MRI Scanner",
        "status": "AVAILABLE",
        "count": 2
      },
      {
        "name": "ICU Ventilators",
        "status": "AVAILABLE",
        "count": 56
      },
      {
        "name": "Dialysis Machines",
        "status": "AVAILABLE",
        "count": 14
      },
      {
        "name": "Emergency Trauma OT",
        "status": "AVAILABLE",
        "count": 4
      }
    ],
    "specialists": [
      "General Medicine",
      "General Surgery",
      "Orthopaedics",
      "Pediatrics",
      "Obstetrics & Gynaecology",
      "Cardiology"
    ],
    "bloodStock": {
      "O+": 42,
      "O-": 11,
      "A+": 33,
      "A-": 8,
      "B+": 44,
      "B-": 11,
      "AB+": 22,
      "AB-": 5
    },
    "pmjayEmpanelled": true,
    "emergencyAvailable": true
  },
  {
    "id": "hosp-medanta-gurugram",
    "name": "Medanta — The Medicity Gurugram",
    "type": "Tertiary",
    "district": "Gurugram",
    "state": "Haryana",
    "lat": 28.4398,
    "lng": 77.0425,
    "generalBeds": 1250,
    "icuBeds": 150,
    "privateRooms": 200,
    "phone": "0124-4141414",
    "city": "Gurugram",
    "area": "Sector 38",
    "address": "CH Bakhtawar Singh Road Sector 38 Near Rajiv Chowk Gurugram Haryana 122001",
    "rating": 4.8,
    "specialties": [
      "Cardiology",
      "Neurosurgery",
      "Oncology",
      "Organ Transplant",
      "Liver Transplant",
      "Robotics Surgery",
      "Gastroenterology"
    ],
    "schemes": [
      "PM-JAY (Ayushman Bharat)",
      "CGHS",
      "ECHS",
      "Haryana Ayushman Golden Card",
      "National Organ Transplant Subsidy"
    ],
    "dakEmpanelled": false,
    "freeSurgeryEmpanelled": false,
    "freeDiagnosticsAvailable": false,
    "cghsEmpanelled": true,
    "danEmpanelled": false,
    "jsyAvailable": false,
    "echsEmpanelled": true,
    "generalBedsUsed": 1150,
    "icuBedsUsed": 130,
    "privateRoomsUsed": 164,
    "doctors": [],
    "equipment": [
      {
        "name": "CT Scanner",
        "status": "AVAILABLE",
        "count": 6
      },
      {
        "name": "MRI Scanner",
        "status": "AVAILABLE",
        "count": 4
      },
      {
        "name": "ICU Ventilators",
        "status": "AVAILABLE",
        "count": 120
      },
      {
        "name": "Dialysis Machines",
        "status": "AVAILABLE",
        "count": 25
      },
      {
        "name": "Emergency Trauma OT",
        "status": "AVAILABLE",
        "count": 8
      }
    ],
    "specialists": [
      "Cardiology",
      "Neurosurgery",
      "Oncology",
      "Organ Transplant",
      "Liver Transplant",
      "Robotics Surgery",
      "Gastroenterology"
    ],
    "bloodStock": {
      "O+": 75,
      "O-": 20,
      "A+": 60,
      "A-": 15,
      "B+": 80,
      "B-": 20,
      "AB+": 40,
      "AB-": 10
    },
    "pmjayEmpanelled": true,
    "emergencyAvailable": true
  },
  {
    "id": "hosp-fortis-gurugram",
    "name": "Fortis Memorial Research Institute (FMRI)",
    "type": "Tertiary",
    "district": "Gurugram",
    "state": "Haryana",
    "lat": 28.4595,
    "lng": 77.0725,
    "generalBeds": 310,
    "icuBeds": 70,
    "privateRooms": 60,
    "phone": "0124-4962200",
    "city": "Gurugram",
    "area": "Sector 44",
    "address": "Sector 44 Opposite HUDA City Centre Metro Station Gurugram Haryana 122002",
    "rating": 4.7,
    "specialties": [
      "Oncology",
      "Cardiology",
      "Orthopaedics",
      "Neurology",
      "Urology",
      "Critical Care",
      "Bone Marrow Transplant"
    ],
    "schemes": [
      "PM-JAY",
      "CGHS",
      "ECHS",
      "Haryana Ayushman Card"
    ],
    "dakEmpanelled": false,
    "freeSurgeryEmpanelled": false,
    "freeDiagnosticsAvailable": false,
    "cghsEmpanelled": true,
    "danEmpanelled": false,
    "jsyAvailable": false,
    "echsEmpanelled": true,
    "generalBedsUsed": 282,
    "icuBedsUsed": 61,
    "privateRoomsUsed": 52,
    "doctors": [],
    "equipment": [
      {
        "name": "CT Scanner",
        "status": "AVAILABLE",
        "count": 1
      },
      {
        "name": "MRI Scanner",
        "status": "AVAILABLE",
        "count": 1
      },
      {
        "name": "ICU Ventilators",
        "status": "AVAILABLE",
        "count": 56
      },
      {
        "name": "Dialysis Machines",
        "status": "AVAILABLE",
        "count": 6
      },
      {
        "name": "Emergency Trauma OT",
        "status": "AVAILABLE",
        "count": 2
      }
    ],
    "specialists": [
      "Oncology",
      "Cardiology",
      "Orthopaedics",
      "Neurology",
      "Urology",
      "Critical Care",
      "Bone Marrow Transplant"
    ],
    "bloodStock": {
      "O+": 18,
      "O-": 4,
      "A+": 14,
      "A-": 3,
      "B+": 19,
      "B-": 4,
      "AB+": 9,
      "AB-": 2
    },
    "pmjayEmpanelled": true,
    "emergencyAvailable": true
  },
  {
    "id": "hosp-artemis-gurugram",
    "name": "Artemis Hospital Gurugram",
    "type": "Tertiary",
    "district": "Gurugram",
    "state": "Haryana",
    "lat": 28.431,
    "lng": 77.079,
    "generalBeds": 400,
    "icuBeds": 75,
    "privateRooms": 80,
    "phone": "0124-4511111",
    "city": "Gurugram",
    "area": "Sector 51",
    "address": "Sector 51 Near Mayfield Garden Gurugram Haryana 122001",
    "rating": 4.7,
    "specialties": [
      "Cardiology",
      "Cardiovascular Surgery",
      "Oncology",
      "Neurosurgery",
      "Orthopaedics",
      "Kidney Transplant"
    ],
    "schemes": [
      "PM-JAY",
      "CGHS",
      "ECHS",
      "Haryana Chirayu Card"
    ],
    "dakEmpanelled": false,
    "freeSurgeryEmpanelled": false,
    "freeDiagnosticsAvailable": false,
    "cghsEmpanelled": true,
    "danEmpanelled": false,
    "jsyAvailable": false,
    "echsEmpanelled": true,
    "generalBedsUsed": 359,
    "icuBedsUsed": 66,
    "privateRoomsUsed": 67,
    "doctors": [],
    "equipment": [
      {
        "name": "CT Scanner",
        "status": "AVAILABLE",
        "count": 2
      },
      {
        "name": "MRI Scanner",
        "status": "AVAILABLE",
        "count": 1
      },
      {
        "name": "ICU Ventilators",
        "status": "AVAILABLE",
        "count": 60
      },
      {
        "name": "Dialysis Machines",
        "status": "AVAILABLE",
        "count": 8
      },
      {
        "name": "Emergency Trauma OT",
        "status": "AVAILABLE",
        "count": 2
      }
    ],
    "specialists": [
      "Cardiology",
      "Cardiovascular Surgery",
      "Oncology",
      "Neurosurgery",
      "Orthopaedics",
      "Kidney Transplant"
    ],
    "bloodStock": {
      "O+": 24,
      "O-": 6,
      "A+": 19,
      "A-": 4,
      "B+": 25,
      "B-": 6,
      "AB+": 12,
      "AB-": 3
    },
    "pmjayEmpanelled": true,
    "emergencyAvailable": true
  },
  {
    "id": "hosp-civil-gurugram",
    "name": "Civil Hospital Gurugram",
    "type": "Government",
    "district": "Gurugram",
    "state": "Haryana",
    "lat": 28.4602,
    "lng": 77.0325,
    "generalBeds": 450,
    "icuBeds": 40,
    "privateRooms": 15,
    "phone": "0124-2322412",
    "city": "Gurugram",
    "area": "Sector 10A",
    "address": "Sector 10A Gurugram Haryana 122001",
    "rating": 4.1,
    "specialties": [
      "General Medicine",
      "Emergency Trauma",
      "Surgery",
      "Orthopaedics",
      "Obstetrics & Gynaecology",
      "Paediatrics"
    ],
    "schemes": [
      "PM-JAY",
      "Haryana Chirayu Yojana",
      "Janani Suraksha Yojana",
      "NTEP"
    ],
    "dakEmpanelled": false,
    "freeSurgeryEmpanelled": false,
    "freeDiagnosticsAvailable": false,
    "cghsEmpanelled": true,
    "danEmpanelled": false,
    "jsyAvailable": true,
    "echsEmpanelled": true,
    "generalBedsUsed": 400,
    "icuBedsUsed": 36,
    "privateRoomsUsed": 12,
    "doctors": [],
    "equipment": [
      {
        "name": "CT Scanner",
        "status": "AVAILABLE",
        "count": 2
      },
      {
        "name": "MRI Scanner",
        "status": "AVAILABLE",
        "count": 1
      },
      {
        "name": "ICU Ventilators",
        "status": "AVAILABLE",
        "count": 32
      },
      {
        "name": "Dialysis Machines",
        "status": "AVAILABLE",
        "count": 9
      },
      {
        "name": "Emergency Trauma OT",
        "status": "AVAILABLE",
        "count": 3
      }
    ],
    "specialists": [
      "General Medicine",
      "Emergency Trauma",
      "Surgery",
      "Orthopaedics",
      "Obstetrics & Gynaecology",
      "Paediatrics"
    ],
    "bloodStock": {
      "O+": 27,
      "O-": 7,
      "A+": 21,
      "A-": 5,
      "B+": 28,
      "B-": 7,
      "AB+": 14,
      "AB-": 3
    },
    "pmjayEmpanelled": true,
    "emergencyAvailable": true
  },
  {
    "id": "hosp-paras-gurugram",
    "name": "Paras Health Gurugram",
    "type": "Tertiary",
    "district": "Gurugram",
    "state": "Haryana",
    "lat": 28.448,
    "lng": 77.091,
    "generalBeds": 250,
    "icuBeds": 45,
    "privateRooms": 40,
    "phone": "0124-4585555",
    "city": "Gurugram",
    "area": "Sector 43",
    "address": "C-1 Sushant Lok Phase I Sector 43 Gurugram Haryana 122002",
    "rating": 4.5,
    "specialties": [
      "Neurosciences",
      "Cardiology",
      "Orthopaedics",
      "Oncology",
      "Gastroenterology",
      "Kidney Transplant"
    ],
    "schemes": [
      "PM-JAY",
      "CGHS",
      "ECHS",
      "Haryana Ayushman Card"
    ],
    "dakEmpanelled": false,
    "freeSurgeryEmpanelled": false,
    "freeDiagnosticsAvailable": false,
    "cghsEmpanelled": true,
    "danEmpanelled": false,
    "jsyAvailable": false,
    "echsEmpanelled": true,
    "generalBedsUsed": 220,
    "icuBedsUsed": 40,
    "privateRoomsUsed": 34,
    "doctors": [],
    "equipment": [
      {
        "name": "CT Scanner",
        "status": "AVAILABLE",
        "count": 1
      },
      {
        "name": "MRI Scanner",
        "status": "AVAILABLE",
        "count": 1
      },
      {
        "name": "ICU Ventilators",
        "status": "AVAILABLE",
        "count": 36
      },
      {
        "name": "Dialysis Machines",
        "status": "AVAILABLE",
        "count": 5
      },
      {
        "name": "Emergency Trauma OT",
        "status": "AVAILABLE",
        "count": 2
      }
    ],
    "specialists": [
      "Neurosciences",
      "Cardiology",
      "Orthopaedics",
      "Oncology",
      "Gastroenterology",
      "Kidney Transplant"
    ],
    "bloodStock": {
      "O+": 15,
      "O-": 4,
      "A+": 12,
      "A-": 3,
      "B+": 16,
      "B-": 4,
      "AB+": 8,
      "AB-": 2
    },
    "pmjayEmpanelled": true,
    "emergencyAvailable": true
  },
  {
    "id": "hosp-manipal-gurugram",
    "name": "Manipal Hospital Gurugram",
    "type": "Tertiary",
    "district": "Gurugram",
    "state": "Haryana",
    "lat": 28.508,
    "lng": 77.039,
    "generalBeds": 250,
    "icuBeds": 40,
    "privateRooms": 35,
    "phone": "0124-6165666",
    "city": "Gurugram",
    "area": "Palam Vihar",
    "address": "Block F Palam Vihar Gurugram Haryana 122017",
    "rating": 4.5,
    "specialties": [
      "Cardiology",
      "Orthopaedics",
      "Oncology",
      "Neurology",
      "Gastroenterology",
      "Critical Care"
    ],
    "schemes": [
      "PM-JAY",
      "CGHS",
      "ECHS",
      "Haryana Health Insurance"
    ],
    "dakEmpanelled": false,
    "freeSurgeryEmpanelled": false,
    "freeDiagnosticsAvailable": false,
    "cghsEmpanelled": true,
    "danEmpanelled": false,
    "jsyAvailable": false,
    "echsEmpanelled": true,
    "generalBedsUsed": 217,
    "icuBedsUsed": 36,
    "privateRoomsUsed": 29,
    "doctors": [],
    "equipment": [
      {
        "name": "CT Scanner",
        "status": "AVAILABLE",
        "count": 1
      },
      {
        "name": "MRI Scanner",
        "status": "AVAILABLE",
        "count": 1
      },
      {
        "name": "ICU Ventilators",
        "status": "AVAILABLE",
        "count": 32
      },
      {
        "name": "Dialysis Machines",
        "status": "AVAILABLE",
        "count": 5
      },
      {
        "name": "Emergency Trauma OT",
        "status": "AVAILABLE",
        "count": 2
      }
    ],
    "specialists": [
      "Cardiology",
      "Orthopaedics",
      "Oncology",
      "Neurology",
      "Gastroenterology",
      "Critical Care"
    ],
    "bloodStock": {
      "O+": 15,
      "O-": 4,
      "A+": 12,
      "A-": 3,
      "B+": 16,
      "B-": 4,
      "AB+": 8,
      "AB-": 2
    },
    "pmjayEmpanelled": true,
    "emergencyAvailable": true
  },
  {
    "id": "hosp-ckbirla-gurugram",
    "name": "CK Birla Hospital Gurugram",
    "type": "Specialized",
    "district": "Gurugram",
    "state": "Haryana",
    "lat": 28.428,
    "lng": 77.072,
    "generalBeds": 150,
    "icuBeds": 25,
    "privateRooms": 30,
    "phone": "0124-4882200",
    "city": "Gurugram",
    "area": "Sector 51",
    "address": "Block J Mayfield Garden Sector 51 Gurugram Haryana 122018",
    "rating": 4.6,
    "specialties": [
      "Obstetrics & Gynaecology",
      "Advanced Mother & Child Care",
      "Orthopaedics",
      "Oncology",
      "General Surgery"
    ],
    "schemes": [
      "PM-JAY",
      "CGHS",
      "ECHS"
    ],
    "dakEmpanelled": false,
    "freeSurgeryEmpanelled": false,
    "freeDiagnosticsAvailable": false,
    "cghsEmpanelled": true,
    "danEmpanelled": false,
    "jsyAvailable": true,
    "echsEmpanelled": true,
    "generalBedsUsed": 129,
    "icuBedsUsed": 20,
    "privateRoomsUsed": 24,
    "doctors": [],
    "equipment": [
      {
        "name": "CT Scanner",
        "status": "AVAILABLE",
        "count": 1
      },
      {
        "name": "MRI Scanner",
        "status": "AVAILABLE",
        "count": 1
      },
      {
        "name": "ICU Ventilators",
        "status": "AVAILABLE",
        "count": 20
      },
      {
        "name": "Dialysis Machines",
        "status": "AVAILABLE",
        "count": 4
      },
      {
        "name": "Emergency Trauma OT",
        "status": "AVAILABLE",
        "count": 2
      }
    ],
    "specialists": [
      "Obstetrics & Gynaecology",
      "Advanced Mother & Child Care",
      "Orthopaedics",
      "Oncology",
      "General Surgery"
    ],
    "bloodStock": {
      "O+": 9,
      "O-": 2,
      "A+": 7,
      "A-": 2,
      "B+": 9,
      "B-": 2,
      "AB+": 4,
      "AB-": 1
    },
    "pmjayEmpanelled": true,
    "emergencyAvailable": true
  },
  {
    "id": "hosp-sgt-gurugram",
    "name": "SGT Medical College Hospital & Research Institute",
    "type": "Specialized",
    "district": "Gurugram",
    "state": "Haryana",
    "lat": 28.489,
    "lng": 76.901,
    "generalBeds": 800,
    "icuBeds": 80,
    "privateRooms": 30,
    "phone": "0124-2278183",
    "city": "Gurugram",
    "area": "Budhera",
    "address": "Chandu-Budhera Gurgaon-Farrukh Nagar Road Gurugram Haryana 122505",
    "rating": 4.3,
    "specialties": [
      "General Medicine",
      "General Surgery",
      "Orthopaedics",
      "Obstetrics & Gynaecology",
      "Cardiology",
      "Trauma"
    ],
    "schemes": [
      "PM-JAY (Ayushman Bharat)",
      "Haryana Chirayu",
      "CGHS",
      "ECHS",
      "JSY"
    ],
    "dakEmpanelled": false,
    "freeSurgeryEmpanelled": false,
    "freeDiagnosticsAvailable": false,
    "cghsEmpanelled": true,
    "danEmpanelled": false,
    "jsyAvailable": true,
    "echsEmpanelled": true,
    "generalBedsUsed": 680,
    "icuBedsUsed": 66,
    "privateRoomsUsed": 25,
    "doctors": [],
    "equipment": [
      {
        "name": "CT Scanner",
        "status": "AVAILABLE",
        "count": 4
      },
      {
        "name": "MRI Scanner",
        "status": "AVAILABLE",
        "count": 2
      },
      {
        "name": "ICU Ventilators",
        "status": "AVAILABLE",
        "count": 64
      },
      {
        "name": "Dialysis Machines",
        "status": "AVAILABLE",
        "count": 16
      },
      {
        "name": "Emergency Trauma OT",
        "status": "AVAILABLE",
        "count": 5
      }
    ],
    "specialists": [
      "General Medicine",
      "General Surgery",
      "Orthopaedics",
      "Obstetrics & Gynaecology",
      "Cardiology",
      "Trauma"
    ],
    "bloodStock": {
      "O+": 48,
      "O-": 12,
      "A+": 38,
      "A-": 9,
      "B+": 51,
      "B-": 12,
      "AB+": 25,
      "AB-": 6
    },
    "pmjayEmpanelled": true,
    "emergencyAvailable": true
  },
  {
    "id": "hosp-amrita-faridabad",
    "name": "Amrita Hospital Faridabad Sector 88",
    "type": "Tertiary",
    "district": "Faridabad",
    "state": "Haryana",
    "lat": 28.4215,
    "lng": 77.3685,
    "generalBeds": 2400,
    "icuBeds": 200,
    "privateRooms": 250,
    "phone": "0129-2854000",
    "city": "Faridabad",
    "area": "Sector 88 Greater Faridabad",
    "address": "Mata Amritanandamayi Marg Sector 88 Faridabad Haryana 121002",
    "rating": 4.8,
    "specialties": [
      "Cardiology",
      "Neurology",
      "Oncology",
      "Organ Transplant",
      "Gastroenterology",
      "Nephrology",
      "Pulmonology",
      "Robotics"
    ],
    "schemes": [
      "PM-JAY (Ayushman Bharat)",
      "CGHS",
      "ECHS",
      "Haryana Ayushman Golden Card",
      "National Organ Transplant Subsidies"
    ],
    "dakEmpanelled": false,
    "freeSurgeryEmpanelled": false,
    "freeDiagnosticsAvailable": false,
    "cghsEmpanelled": true,
    "danEmpanelled": false,
    "jsyAvailable": false,
    "echsEmpanelled": true,
    "generalBedsUsed": 2016,
    "icuBedsUsed": 168,
    "privateRoomsUsed": 205,
    "doctors": [],
    "equipment": [
      {
        "name": "CT Scanner",
        "status": "AVAILABLE",
        "count": 12
      },
      {
        "name": "MRI Scanner",
        "status": "AVAILABLE",
        "count": 8
      },
      {
        "name": "ICU Ventilators",
        "status": "AVAILABLE",
        "count": 160
      },
      {
        "name": "Dialysis Machines",
        "status": "AVAILABLE",
        "count": 48
      },
      {
        "name": "Emergency Trauma OT",
        "status": "AVAILABLE",
        "count": 16
      }
    ],
    "specialists": [
      "Cardiology",
      "Neurology",
      "Oncology",
      "Organ Transplant",
      "Gastroenterology",
      "Nephrology",
      "Pulmonology",
      "Robotics"
    ],
    "bloodStock": {
      "O+": 144,
      "O-": 38,
      "A+": 115,
      "A-": 28,
      "B+": 153,
      "B-": 38,
      "AB+": 76,
      "AB-": 19
    },
    "pmjayEmpanelled": true,
    "emergencyAvailable": true
  },
  {
    "id": "hosp-bk-faridabad",
    "name": "B.K. Civil Hospital Faridabad",
    "type": "Government",
    "district": "Faridabad",
    "state": "Haryana",
    "lat": 28.3985,
    "lng": 77.3045,
    "generalBeds": 400,
    "icuBeds": 35,
    "privateRooms": 15,
    "phone": "0129-2418183",
    "city": "Faridabad",
    "area": "NIT Faridabad",
    "address": "Near BK Chowk NIT Faridabad Haryana 121001",
    "rating": 4,
    "specialties": [
      "General Medicine",
      "Emergency Trauma",
      "Surgery",
      "Orthopaedics",
      "Paediatrics",
      "Obstetrics & Gynaecology"
    ],
    "schemes": [
      "PM-JAY",
      "Haryana Chirayu",
      "Janani Suraksha Yojana",
      "NTEP"
    ],
    "dakEmpanelled": false,
    "freeSurgeryEmpanelled": false,
    "freeDiagnosticsAvailable": false,
    "cghsEmpanelled": true,
    "danEmpanelled": false,
    "jsyAvailable": true,
    "echsEmpanelled": true,
    "generalBedsUsed": 368,
    "icuBedsUsed": 29,
    "privateRoomsUsed": 13,
    "doctors": [],
    "equipment": [
      {
        "name": "CT Scanner",
        "status": "AVAILABLE",
        "count": 2
      },
      {
        "name": "MRI Scanner",
        "status": "AVAILABLE",
        "count": 1
      },
      {
        "name": "ICU Ventilators",
        "status": "AVAILABLE",
        "count": 28
      },
      {
        "name": "Dialysis Machines",
        "status": "AVAILABLE",
        "count": 8
      },
      {
        "name": "Emergency Trauma OT",
        "status": "AVAILABLE",
        "count": 2
      }
    ],
    "specialists": [
      "General Medicine",
      "Emergency Trauma",
      "Surgery",
      "Orthopaedics",
      "Paediatrics",
      "Obstetrics & Gynaecology"
    ],
    "bloodStock": {
      "O+": 24,
      "O-": 6,
      "A+": 19,
      "A-": 4,
      "B+": 25,
      "B-": 6,
      "AB+": 12,
      "AB-": 3
    },
    "pmjayEmpanelled": true,
    "emergencyAvailable": true
  },
  {
    "id": "hosp-fortis-faridabad",
    "name": "Fortis Escorts Hospital Faridabad",
    "type": "Tertiary",
    "district": "Faridabad",
    "state": "Haryana",
    "lat": 28.405,
    "lng": 77.315,
    "generalBeds": 210,
    "icuBeds": 40,
    "privateRooms": 35,
    "phone": "0129-2466000",
    "city": "Faridabad",
    "area": "Neelam Bata Road",
    "address": "Neelam Bata Road NIT Faridabad Haryana 121001",
    "rating": 4.5,
    "specialties": [
      "Cardiology",
      "Cardiothoracic Surgery",
      "Orthopaedics",
      "Neurosurgery",
      "Critical Care",
      "Gastroenterology"
    ],
    "schemes": [
      "PM-JAY",
      "CGHS",
      "ECHS",
      "Haryana Ayushman Card"
    ],
    "dakEmpanelled": false,
    "freeSurgeryEmpanelled": false,
    "freeDiagnosticsAvailable": false,
    "cghsEmpanelled": true,
    "danEmpanelled": false,
    "jsyAvailable": false,
    "echsEmpanelled": true,
    "generalBedsUsed": 191,
    "icuBedsUsed": 34,
    "privateRoomsUsed": 29,
    "doctors": [],
    "equipment": [
      {
        "name": "CT Scanner",
        "status": "AVAILABLE",
        "count": 1
      },
      {
        "name": "MRI Scanner",
        "status": "AVAILABLE",
        "count": 1
      },
      {
        "name": "ICU Ventilators",
        "status": "AVAILABLE",
        "count": 32
      },
      {
        "name": "Dialysis Machines",
        "status": "AVAILABLE",
        "count": 4
      },
      {
        "name": "Emergency Trauma OT",
        "status": "AVAILABLE",
        "count": 2
      }
    ],
    "specialists": [
      "Cardiology",
      "Cardiothoracic Surgery",
      "Orthopaedics",
      "Neurosurgery",
      "Critical Care",
      "Gastroenterology"
    ],
    "bloodStock": {
      "O+": 12,
      "O-": 3,
      "A+": 9,
      "A-": 2,
      "B+": 12,
      "B-": 3,
      "AB+": 6,
      "AB-": 1
    },
    "pmjayEmpanelled": true,
    "emergencyAvailable": true
  },
  {
    "id": "hosp-sarvodaya-faridabad8",
    "name": "Sarvodaya Hospital & Research Centre Sector 8",
    "type": "Tertiary",
    "district": "Faridabad",
    "state": "Haryana",
    "lat": 28.375,
    "lng": 77.332,
    "generalBeds": 450,
    "icuBeds": 60,
    "privateRooms": 50,
    "phone": "0129-4194444",
    "city": "Faridabad",
    "area": "Sector 8",
    "address": "YMCA Road Sector 8 Faridabad Haryana 121006",
    "rating": 4.6,
    "specialties": [
      "Cardiology",
      "Cardiothoracic Surgery",
      "Oncology",
      "Robotics",
      "Neurosurgery",
      "Renal Transplant"
    ],
    "schemes": [
      "PM-JAY",
      "CGHS",
      "ECHS",
      "Haryana Chirayu"
    ],
    "dakEmpanelled": false,
    "freeSurgeryEmpanelled": false,
    "freeDiagnosticsAvailable": false,
    "cghsEmpanelled": true,
    "danEmpanelled": false,
    "jsyAvailable": false,
    "echsEmpanelled": true,
    "generalBedsUsed": 404,
    "icuBedsUsed": 52,
    "privateRoomsUsed": 40,
    "doctors": [],
    "equipment": [
      {
        "name": "CT Scanner",
        "status": "AVAILABLE",
        "count": 2
      },
      {
        "name": "MRI Scanner",
        "status": "AVAILABLE",
        "count": 1
      },
      {
        "name": "ICU Ventilators",
        "status": "AVAILABLE",
        "count": 48
      },
      {
        "name": "Dialysis Machines",
        "status": "AVAILABLE",
        "count": 9
      },
      {
        "name": "Emergency Trauma OT",
        "status": "AVAILABLE",
        "count": 3
      }
    ],
    "specialists": [
      "Cardiology",
      "Cardiothoracic Surgery",
      "Oncology",
      "Robotics",
      "Neurosurgery",
      "Renal Transplant"
    ],
    "bloodStock": {
      "O+": 27,
      "O-": 7,
      "A+": 21,
      "A-": 5,
      "B+": 28,
      "B-": 7,
      "AB+": 14,
      "AB-": 3
    },
    "pmjayEmpanelled": true,
    "emergencyAvailable": true
  },
  {
    "id": "hosp-qrg-faridabad",
    "name": "Marengo Asia Hospital (Formerly QRG)",
    "type": "Tertiary",
    "district": "Faridabad",
    "state": "Haryana",
    "lat": 28.412,
    "lng": 77.321,
    "generalBeds": 450,
    "icuBeds": 65,
    "privateRooms": 50,
    "phone": "0129-4330000",
    "city": "Faridabad",
    "area": "Sector 16",
    "address": "Plot No 1 Sector 16 Faridabad Haryana 121002",
    "rating": 4.6,
    "specialties": [
      "Cardiology",
      "Neurosurgery",
      "Orthopaedics",
      "Oncology",
      "Organ Transplant",
      "Critical Care"
    ],
    "schemes": [
      "PM-JAY",
      "CGHS",
      "ECHS",
      "Haryana Ayushman Card"
    ],
    "dakEmpanelled": false,
    "freeSurgeryEmpanelled": false,
    "freeDiagnosticsAvailable": false,
    "cghsEmpanelled": true,
    "danEmpanelled": false,
    "jsyAvailable": false,
    "echsEmpanelled": true,
    "generalBedsUsed": 400,
    "icuBedsUsed": 57,
    "privateRoomsUsed": 43,
    "doctors": [],
    "equipment": [
      {
        "name": "CT Scanner",
        "status": "AVAILABLE",
        "count": 2
      },
      {
        "name": "MRI Scanner",
        "status": "AVAILABLE",
        "count": 1
      },
      {
        "name": "ICU Ventilators",
        "status": "AVAILABLE",
        "count": 52
      },
      {
        "name": "Dialysis Machines",
        "status": "AVAILABLE",
        "count": 9
      },
      {
        "name": "Emergency Trauma OT",
        "status": "AVAILABLE",
        "count": 3
      }
    ],
    "specialists": [
      "Cardiology",
      "Neurosurgery",
      "Orthopaedics",
      "Oncology",
      "Organ Transplant",
      "Critical Care"
    ],
    "bloodStock": {
      "O+": 27,
      "O-": 7,
      "A+": 21,
      "A-": 5,
      "B+": 28,
      "B-": 7,
      "AB+": 14,
      "AB-": 3
    },
    "pmjayEmpanelled": true,
    "emergencyAvailable": true
  },
  {
    "id": "hosp-accord-faridabad",
    "name": "Accord Superspeciality Hospital",
    "type": "Tertiary",
    "district": "Faridabad",
    "state": "Haryana",
    "lat": 28.418,
    "lng": 77.359,
    "generalBeds": 380,
    "icuBeds": 50,
    "privateRooms": 40,
    "phone": "0129-7155555",
    "city": "Faridabad",
    "area": "Sector 86 Greater Faridabad",
    "address": "Sector 86 Greater Faridabad Haryana 121002",
    "rating": 4.5,
    "specialties": [
      "Cardiology",
      "Oncology",
      "Neurosurgery",
      "Liver & Kidney Transplant",
      "Orthopaedics",
      "Gastroenterology"
    ],
    "schemes": [
      "PM-JAY",
      "CGHS",
      "ECHS",
      "Haryana Chirayu Card"
    ],
    "dakEmpanelled": false,
    "freeSurgeryEmpanelled": false,
    "freeDiagnosticsAvailable": false,
    "cghsEmpanelled": true,
    "danEmpanelled": false,
    "jsyAvailable": false,
    "echsEmpanelled": true,
    "generalBedsUsed": 334,
    "icuBedsUsed": 44,
    "privateRoomsUsed": 33,
    "doctors": [],
    "equipment": [
      {
        "name": "CT Scanner",
        "status": "AVAILABLE",
        "count": 1
      },
      {
        "name": "MRI Scanner",
        "status": "AVAILABLE",
        "count": 1
      },
      {
        "name": "ICU Ventilators",
        "status": "AVAILABLE",
        "count": 40
      },
      {
        "name": "Dialysis Machines",
        "status": "AVAILABLE",
        "count": 7
      },
      {
        "name": "Emergency Trauma OT",
        "status": "AVAILABLE",
        "count": 2
      }
    ],
    "specialists": [
      "Cardiology",
      "Oncology",
      "Neurosurgery",
      "Liver & Kidney Transplant",
      "Orthopaedics",
      "Gastroenterology"
    ],
    "bloodStock": {
      "O+": 22,
      "O-": 6,
      "A+": 18,
      "A-": 4,
      "B+": 24,
      "B-": 6,
      "AB+": 12,
      "AB-": 3
    },
    "pmjayEmpanelled": true,
    "emergencyAvailable": true
  },
  {
    "id": "hosp-aims-faridabad",
    "name": "Asian Institute of Medical Sciences (AIMS)",
    "type": "Tertiary",
    "district": "Faridabad",
    "state": "Haryana",
    "lat": 28.431,
    "lng": 77.298,
    "generalBeds": 300,
    "icuBeds": 50,
    "privateRooms": 40,
    "phone": "0129-4253000",
    "city": "Faridabad",
    "area": "Sector 21A",
    "address": "Badkal Flyover Road Sector 21A Faridabad Haryana 121001",
    "rating": 4.5,
    "specialties": [
      "Cardiology",
      "Cardiovascular Surgery",
      "Oncology",
      "Neurosurgery",
      "Bone Marrow Transplant",
      "Kidney Transplant"
    ],
    "schemes": [
      "PM-JAY",
      "CGHS",
      "ECHS",
      "Haryana Ayushman Card"
    ],
    "dakEmpanelled": false,
    "freeSurgeryEmpanelled": false,
    "freeDiagnosticsAvailable": false,
    "cghsEmpanelled": true,
    "danEmpanelled": false,
    "jsyAvailable": false,
    "echsEmpanelled": true,
    "generalBedsUsed": 261,
    "icuBedsUsed": 44,
    "privateRoomsUsed": 32,
    "doctors": [],
    "equipment": [
      {
        "name": "CT Scanner",
        "status": "AVAILABLE",
        "count": 1
      },
      {
        "name": "MRI Scanner",
        "status": "AVAILABLE",
        "count": 1
      },
      {
        "name": "ICU Ventilators",
        "status": "AVAILABLE",
        "count": 40
      },
      {
        "name": "Dialysis Machines",
        "status": "AVAILABLE",
        "count": 6
      },
      {
        "name": "Emergency Trauma OT",
        "status": "AVAILABLE",
        "count": 2
      }
    ],
    "specialists": [
      "Cardiology",
      "Cardiovascular Surgery",
      "Oncology",
      "Neurosurgery",
      "Bone Marrow Transplant",
      "Kidney Transplant"
    ],
    "bloodStock": {
      "O+": 18,
      "O-": 4,
      "A+": 14,
      "A-": 3,
      "B+": 19,
      "B-": 4,
      "AB+": 9,
      "AB-": 2
    },
    "pmjayEmpanelled": true,
    "emergencyAvailable": true
  },
  {
    "id": "hosp-tirathram-civillines",
    "name": "Tirath Ram Shah Hospital",
    "type": "Tertiary",
    "district": "North Delhi",
    "state": "Delhi",
    "lat": 28.678,
    "lng": 77.225,
    "generalBeds": 200,
    "icuBeds": 25,
    "privateRooms": 30,
    "phone": "011-23972425",
    "city": "Delhi",
    "area": "Civil Lines / Battery Lane",
    "address": "2A Battery Lane Rajpur Road Civil Lines Delhi 110054",
    "rating": 4.3,
    "specialties": [
      "General Medicine",
      "General Surgery",
      "Orthopaedics",
      "Obstetrics & Gynaecology",
      "Pediatrics",
      "Cardiology"
    ],
    "schemes": [
      "PM-JAY",
      "CGHS",
      "ECHS",
      "Farishte Dilli Ke"
    ],
    "dakEmpanelled": false,
    "freeSurgeryEmpanelled": true,
    "freeDiagnosticsAvailable": true,
    "cghsEmpanelled": true,
    "danEmpanelled": false,
    "jsyAvailable": false,
    "echsEmpanelled": true,
    "generalBedsUsed": 172,
    "icuBedsUsed": 22,
    "privateRoomsUsed": 25,
    "doctors": [],
    "equipment": [
      {
        "name": "CT Scanner",
        "status": "AVAILABLE",
        "count": 1
      },
      {
        "name": "MRI Scanner",
        "status": "AVAILABLE",
        "count": 1
      },
      {
        "name": "ICU Ventilators",
        "status": "AVAILABLE",
        "count": 20
      },
      {
        "name": "Dialysis Machines",
        "status": "AVAILABLE",
        "count": 4
      },
      {
        "name": "Emergency Trauma OT",
        "status": "AVAILABLE",
        "count": 2
      }
    ],
    "specialists": [
      "General Medicine",
      "General Surgery",
      "Orthopaedics",
      "Obstetrics & Gynaecology",
      "Pediatrics",
      "Cardiology"
    ],
    "bloodStock": {
      "O+": 12,
      "O-": 3,
      "A+": 9,
      "A-": 2,
      "B+": 12,
      "B-": 3,
      "AB+": 6,
      "AB-": 1
    },
    "pmjayEmpanelled": true,
    "emergencyAvailable": true
  },
  {
    "id": "hosp-sunderlal-ashokvihar",
    "name": "Sunder Lal Jain Hospital",
    "type": "Tertiary",
    "district": "North Delhi",
    "state": "Delhi",
    "lat": 28.685,
    "lng": 77.178,
    "generalBeds": 250,
    "icuBeds": 35,
    "privateRooms": 30,
    "phone": "011-47030900",
    "city": "Delhi",
    "area": "Ashok Vihar Phase III",
    "address": "Ashok Vihar Phase III Delhi 110052",
    "rating": 4.3,
    "specialties": [
      "Cardiology",
      "Orthopaedics",
      "Nephrology",
      "General Surgery",
      "Pediatrics",
      "Neurology"
    ],
    "schemes": [
      "PM-JAY",
      "CGHS",
      "ECHS",
      "Delhi Free Surgery Scheme",
      "Farishte Dilli Ke"
    ],
    "dakEmpanelled": false,
    "freeSurgeryEmpanelled": true,
    "freeDiagnosticsAvailable": true,
    "cghsEmpanelled": true,
    "danEmpanelled": false,
    "jsyAvailable": false,
    "echsEmpanelled": true,
    "generalBedsUsed": 212,
    "icuBedsUsed": 32,
    "privateRoomsUsed": 24,
    "doctors": [],
    "equipment": [
      {
        "name": "CT Scanner",
        "status": "AVAILABLE",
        "count": 1
      },
      {
        "name": "MRI Scanner",
        "status": "AVAILABLE",
        "count": 1
      },
      {
        "name": "ICU Ventilators",
        "status": "AVAILABLE",
        "count": 28
      },
      {
        "name": "Dialysis Machines",
        "status": "AVAILABLE",
        "count": 5
      },
      {
        "name": "Emergency Trauma OT",
        "status": "AVAILABLE",
        "count": 2
      }
    ],
    "specialists": [
      "Cardiology",
      "Orthopaedics",
      "Nephrology",
      "General Surgery",
      "Pediatrics",
      "Neurology"
    ],
    "bloodStock": {
      "O+": 15,
      "O-": 4,
      "A+": 12,
      "A-": 3,
      "B+": 16,
      "B-": 4,
      "AB+": 8,
      "AB-": 2
    },
    "pmjayEmpanelled": true,
    "emergencyAvailable": true
  },
  {
    "id": "hosp-jeewanmala-karolbagh",
    "name": "Jeewan Mala Hospital",
    "type": "Tertiary",
    "district": "Central Delhi",
    "state": "Delhi",
    "lat": 28.651,
    "lng": 77.195,
    "generalBeds": 150,
    "icuBeds": 20,
    "privateRooms": 25,
    "phone": "011-47774141",
    "city": "Delhi",
    "area": "Karol Bagh / New Rohtak Road",
    "address": "67/1 New Rohtak Road Karol Bagh New Delhi 110005",
    "rating": 4.2,
    "specialties": [
      "General Medicine",
      "General Surgery",
      "Orthopaedics",
      "Gynecology",
      "ENT",
      "Laparoscopy"
    ],
    "schemes": [
      "PM-JAY",
      "CGHS",
      "ECHS",
      "Farishte Dilli Ke"
    ],
    "dakEmpanelled": false,
    "freeSurgeryEmpanelled": true,
    "freeDiagnosticsAvailable": true,
    "cghsEmpanelled": true,
    "danEmpanelled": false,
    "jsyAvailable": false,
    "echsEmpanelled": true,
    "generalBedsUsed": 126,
    "icuBedsUsed": 16,
    "privateRoomsUsed": 21,
    "doctors": [],
    "equipment": [
      {
        "name": "CT Scanner",
        "status": "AVAILABLE",
        "count": 1
      },
      {
        "name": "MRI Scanner",
        "status": "AVAILABLE",
        "count": 1
      },
      {
        "name": "ICU Ventilators",
        "status": "AVAILABLE",
        "count": 16
      },
      {
        "name": "Dialysis Machines",
        "status": "AVAILABLE",
        "count": 4
      },
      {
        "name": "Emergency Trauma OT",
        "status": "AVAILABLE",
        "count": 2
      }
    ],
    "specialists": [
      "General Medicine",
      "General Surgery",
      "Orthopaedics",
      "Gynecology",
      "ENT",
      "Laparoscopy"
    ],
    "bloodStock": {
      "O+": 9,
      "O-": 2,
      "A+": 7,
      "A-": 2,
      "B+": 9,
      "B-": 2,
      "AB+": 4,
      "AB-": 1
    },
    "pmjayEmpanelled": true,
    "emergencyAvailable": true
  },
  {
    "id": "hosp-matachanan-janakpuri",
    "name": "Mata Chanan Devi Hospital",
    "type": "Tertiary",
    "district": "West Delhi",
    "state": "Delhi",
    "lat": 28.625,
    "lng": 77.089,
    "generalBeds": 210,
    "icuBeds": 35,
    "privateRooms": 30,
    "phone": "011-25554492",
    "city": "Delhi",
    "area": "Janakpuri C-1",
    "address": "C-1 Janakpuri New Delhi 110058",
    "rating": 4.4,
    "specialties": [
      "Cardiology",
      "Neurology",
      "Orthopaedics",
      "Gastroenterology",
      "Pediatrics",
      "Critical Care"
    ],
    "schemes": [
      "PM-JAY",
      "CGHS",
      "ECHS",
      "Delhi Free Surgery Scheme",
      "Farishte Dilli Ke"
    ],
    "dakEmpanelled": false,
    "freeSurgeryEmpanelled": true,
    "freeDiagnosticsAvailable": true,
    "cghsEmpanelled": true,
    "danEmpanelled": false,
    "jsyAvailable": false,
    "echsEmpanelled": true,
    "generalBedsUsed": 193,
    "icuBedsUsed": 29,
    "privateRoomsUsed": 25,
    "doctors": [],
    "equipment": [
      {
        "name": "CT Scanner",
        "status": "AVAILABLE",
        "count": 1
      },
      {
        "name": "MRI Scanner",
        "status": "AVAILABLE",
        "count": 1
      },
      {
        "name": "ICU Ventilators",
        "status": "AVAILABLE",
        "count": 28
      },
      {
        "name": "Dialysis Machines",
        "status": "AVAILABLE",
        "count": 4
      },
      {
        "name": "Emergency Trauma OT",
        "status": "AVAILABLE",
        "count": 2
      }
    ],
    "specialists": [
      "Cardiology",
      "Neurology",
      "Orthopaedics",
      "Gastroenterology",
      "Pediatrics",
      "Critical Care"
    ],
    "bloodStock": {
      "O+": 12,
      "O-": 3,
      "A+": 9,
      "A-": 2,
      "B+": 12,
      "B-": 3,
      "AB+": 6,
      "AB-": 1
    },
    "pmjayEmpanelled": true,
    "emergencyAvailable": true
  },
  {
    "id": "hosp-sehgal-paschimvihar",
    "name": "Sehgal Neo Hospital",
    "type": "Tertiary",
    "district": "West Delhi",
    "state": "Delhi",
    "lat": 28.665,
    "lng": 77.102,
    "generalBeds": 100,
    "icuBeds": 20,
    "privateRooms": 20,
    "phone": "011-45565656",
    "city": "Delhi",
    "area": "Paschim Vihar Outer Ring Road",
    "address": "B-362 Outer Ring Road Meera Bagh Paschim Vihar New Delhi 110063",
    "rating": 4.4,
    "specialties": [
      "Orthopaedics",
      "Cardiology",
      "General Surgery",
      "Urology",
      "Gastroenterology"
    ],
    "schemes": [
      "PM-JAY",
      "CGHS",
      "ECHS",
      "Delhi Free Surgery Scheme",
      "Farishte Dilli Ke"
    ],
    "dakEmpanelled": false,
    "freeSurgeryEmpanelled": true,
    "freeDiagnosticsAvailable": true,
    "cghsEmpanelled": true,
    "danEmpanelled": false,
    "jsyAvailable": false,
    "echsEmpanelled": true,
    "generalBedsUsed": 90,
    "icuBedsUsed": 16,
    "privateRoomsUsed": 16,
    "doctors": [],
    "equipment": [
      {
        "name": "CT Scanner",
        "status": "AVAILABLE",
        "count": 1
      },
      {
        "name": "MRI Scanner",
        "status": "AVAILABLE",
        "count": 1
      },
      {
        "name": "ICU Ventilators",
        "status": "AVAILABLE",
        "count": 16
      },
      {
        "name": "Dialysis Machines",
        "status": "AVAILABLE",
        "count": 4
      },
      {
        "name": "Emergency Trauma OT",
        "status": "AVAILABLE",
        "count": 2
      }
    ],
    "specialists": [
      "Orthopaedics",
      "Cardiology",
      "General Surgery",
      "Urology",
      "Gastroenterology"
    ],
    "bloodStock": {
      "O+": 6,
      "O-": 2,
      "A+": 5,
      "A-": 2,
      "B+": 7,
      "B-": 2,
      "AB+": 4,
      "AB-": 1
    },
    "pmjayEmpanelled": true,
    "emergencyAvailable": true
  },
  {
    "id": "hosp-batra-tughlakabad",
    "name": "Batra Hospital & Medical Research Centre",
    "type": "Tertiary",
    "district": "South Delhi",
    "state": "Delhi",
    "lat": 28.514,
    "lng": 77.248,
    "generalBeds": 495,
    "icuBeds": 70,
    "privateRooms": 60,
    "phone": "011-29958747",
    "city": "Delhi",
    "area": "Tughlakabad Institutional Area",
    "address": "1 Tughlakabad Institutional Area Mehrauli Badarpur Road New Delhi 110062",
    "rating": 4.4,
    "specialties": [
      "Cardiology",
      "Cardiothoracic Surgery",
      "Oncology",
      "Nephrology",
      "Neurology",
      "Gastroenterology"
    ],
    "schemes": [
      "PM-JAY",
      "CGHS",
      "ECHS",
      "Delhi Free Surgery Scheme",
      "Farishte Dilli Ke"
    ],
    "dakEmpanelled": false,
    "freeSurgeryEmpanelled": true,
    "freeDiagnosticsAvailable": true,
    "cghsEmpanelled": true,
    "danEmpanelled": false,
    "jsyAvailable": false,
    "echsEmpanelled": true,
    "generalBedsUsed": 445,
    "icuBedsUsed": 59,
    "privateRoomsUsed": 51,
    "doctors": [],
    "equipment": [
      {
        "name": "CT Scanner",
        "status": "AVAILABLE",
        "count": 2
      },
      {
        "name": "MRI Scanner",
        "status": "AVAILABLE",
        "count": 1
      },
      {
        "name": "ICU Ventilators",
        "status": "AVAILABLE",
        "count": 56
      },
      {
        "name": "Dialysis Machines",
        "status": "AVAILABLE",
        "count": 9
      },
      {
        "name": "Emergency Trauma OT",
        "status": "AVAILABLE",
        "count": 3
      }
    ],
    "specialists": [
      "Cardiology",
      "Cardiothoracic Surgery",
      "Oncology",
      "Nephrology",
      "Neurology",
      "Gastroenterology"
    ],
    "bloodStock": {
      "O+": 28,
      "O-": 7,
      "A+": 22,
      "A-": 5,
      "B+": 30,
      "B-": 7,
      "AB+": 15,
      "AB-": 3
    },
    "pmjayEmpanelled": true,
    "emergencyAvailable": true
  },
  {
    "id": "hosp-nhi-eastkailash",
    "name": "National Heart Institute (NHI)",
    "type": "Specialized",
    "district": "South East Delhi",
    "state": "Delhi",
    "lat": 28.558,
    "lng": 77.242,
    "generalBeds": 100,
    "icuBeds": 30,
    "privateRooms": 20,
    "phone": "011-46600700",
    "city": "Delhi",
    "area": "East of Kailash",
    "address": "49-50 Community Centre East of Kailash New Delhi 110065",
    "rating": 4.6,
    "specialties": [
      "Interventional Cardiology",
      "Cardiac Surgery",
      "Pediatric Cardiology",
      "Electrophysiology",
      "Vascular Surgery"
    ],
    "schemes": [
      "PM-JAY",
      "CGHS",
      "ECHS",
      "Delhi Free Surgery Scheme",
      "Farishte Dilli Ke"
    ],
    "dakEmpanelled": false,
    "freeSurgeryEmpanelled": true,
    "freeDiagnosticsAvailable": true,
    "cghsEmpanelled": true,
    "danEmpanelled": false,
    "jsyAvailable": false,
    "echsEmpanelled": true,
    "generalBedsUsed": 89,
    "icuBedsUsed": 25,
    "privateRoomsUsed": 16,
    "doctors": [],
    "equipment": [
      {
        "name": "CT Scanner",
        "status": "AVAILABLE",
        "count": 1
      },
      {
        "name": "MRI Scanner",
        "status": "AVAILABLE",
        "count": 1
      },
      {
        "name": "ICU Ventilators",
        "status": "AVAILABLE",
        "count": 24
      },
      {
        "name": "Dialysis Machines",
        "status": "AVAILABLE",
        "count": 4
      },
      {
        "name": "Emergency Trauma OT",
        "status": "AVAILABLE",
        "count": 2
      }
    ],
    "specialists": [
      "Interventional Cardiology",
      "Cardiac Surgery",
      "Pediatric Cardiology",
      "Electrophysiology",
      "Vascular Surgery"
    ],
    "bloodStock": {
      "O+": 6,
      "O-": 2,
      "A+": 5,
      "A-": 2,
      "B+": 7,
      "B-": 2,
      "AB+": 4,
      "AB-": 1
    },
    "pmjayEmpanelled": true,
    "emergencyAvailable": true
  },
  {
    "id": "hosp-dharamshila-vasundhara",
    "name": "Dharamshila Narayana Superspeciality Hospital",
    "type": "Tertiary",
    "district": "East Delhi",
    "state": "Delhi",
    "lat": 28.604,
    "lng": 77.325,
    "generalBeds": 350,
    "icuBeds": 60,
    "privateRooms": 40,
    "phone": "011-43066666",
    "city": "Delhi",
    "area": "Vasundhara Enclave",
    "address": "Metro Station Dharamshila Marg Vasundhara Enclave New Delhi 110096",
    "rating": 4.6,
    "specialties": [
      "Oncology",
      "Bone Marrow Transplant",
      "Cardiology",
      "Neurosurgery",
      "Orthopaedics",
      "Gastroenterology"
    ],
    "schemes": [
      "PM-JAY",
      "CGHS",
      "ECHS",
      "Delhi Free Surgery Scheme",
      "Farishte Dilli Ke"
    ],
    "dakEmpanelled": false,
    "freeSurgeryEmpanelled": true,
    "freeDiagnosticsAvailable": true,
    "cghsEmpanelled": true,
    "danEmpanelled": false,
    "jsyAvailable": false,
    "echsEmpanelled": true,
    "generalBedsUsed": 308,
    "icuBedsUsed": 52,
    "privateRoomsUsed": 32,
    "doctors": [],
    "equipment": [
      {
        "name": "CT Scanner",
        "status": "AVAILABLE",
        "count": 1
      },
      {
        "name": "MRI Scanner",
        "status": "AVAILABLE",
        "count": 1
      },
      {
        "name": "ICU Ventilators",
        "status": "AVAILABLE",
        "count": 48
      },
      {
        "name": "Dialysis Machines",
        "status": "AVAILABLE",
        "count": 7
      },
      {
        "name": "Emergency Trauma OT",
        "status": "AVAILABLE",
        "count": 2
      }
    ],
    "specialists": [
      "Oncology",
      "Bone Marrow Transplant",
      "Cardiology",
      "Neurosurgery",
      "Orthopaedics",
      "Gastroenterology"
    ],
    "bloodStock": {
      "O+": 21,
      "O-": 5,
      "A+": 16,
      "A-": 4,
      "B+": 22,
      "B-": 5,
      "AB+": 11,
      "AB-": 2
    },
    "pmjayEmpanelled": true,
    "emergencyAvailable": true
  },
  {
    "id": "hosp-actioncancer-paschimvihar",
    "name": "Action Cancer Hospital",
    "type": "Specialized",
    "district": "West Delhi",
    "state": "Delhi",
    "lat": 28.675,
    "lng": 77.099,
    "generalBeds": 150,
    "icuBeds": 30,
    "privateRooms": 30,
    "phone": "011-49222222",
    "city": "Delhi",
    "area": "Paschim Vihar",
    "address": "FC-34 A-4 Paschim Vihar New Delhi 110063",
    "rating": 4.7,
    "specialties": [
      "Radiation Oncology",
      "Medical Oncology",
      "Surgical Oncology",
      "PET-CT",
      "Bone Marrow Transplant"
    ],
    "schemes": [
      "PM-JAY Cancer Scheme",
      "CGHS",
      "ECHS",
      "Delhi Free Surgery Scheme",
      "RAN Cancer Aid"
    ],
    "dakEmpanelled": false,
    "freeSurgeryEmpanelled": true,
    "freeDiagnosticsAvailable": true,
    "cghsEmpanelled": true,
    "danEmpanelled": false,
    "jsyAvailable": false,
    "echsEmpanelled": true,
    "generalBedsUsed": 130,
    "icuBedsUsed": 26,
    "privateRoomsUsed": 25,
    "doctors": [],
    "equipment": [
      {
        "name": "CT Scanner",
        "status": "AVAILABLE",
        "count": 1
      },
      {
        "name": "MRI Scanner",
        "status": "AVAILABLE",
        "count": 1
      },
      {
        "name": "ICU Ventilators",
        "status": "AVAILABLE",
        "count": 24
      },
      {
        "name": "Dialysis Machines",
        "status": "AVAILABLE",
        "count": 4
      },
      {
        "name": "Emergency Trauma OT",
        "status": "AVAILABLE",
        "count": 2
      }
    ],
    "specialists": [
      "Radiation Oncology",
      "Medical Oncology",
      "Surgical Oncology",
      "PET-CT",
      "Bone Marrow Transplant"
    ],
    "bloodStock": {
      "O+": 9,
      "O-": 2,
      "A+": 7,
      "A-": 2,
      "B+": 9,
      "B-": 2,
      "AB+": 4,
      "AB-": 1
    },
    "pmjayEmpanelled": true,
    "emergencyAvailable": true
  },
  {
    "id": "hosp-kailash-grnoida",
    "name": "Kailash Hospital Greater Noida",
    "type": "Tertiary",
    "district": "Gautam Budh Nagar",
    "state": "Uttar Pradesh",
    "lat": 28.472,
    "lng": 77.508,
    "generalBeds": 250,
    "icuBeds": 40,
    "privateRooms": 30,
    "phone": "0120-2327777",
    "city": "Greater Noida",
    "area": "Knowledge Park I",
    "address": "Plot No 23 Knowledge Park I Greater Noida Uttar Pradesh 201308",
    "rating": 4.4,
    "specialties": [
      "Cardiology",
      "Orthopaedics",
      "Neurosurgery",
      "General Surgery",
      "Pediatrics",
      "Emergency Trauma"
    ],
    "schemes": [
      "PM-JAY",
      "CGHS",
      "ECHS",
      "UP Ayushman Golden Card"
    ],
    "dakEmpanelled": false,
    "freeSurgeryEmpanelled": false,
    "freeDiagnosticsAvailable": false,
    "cghsEmpanelled": true,
    "danEmpanelled": false,
    "jsyAvailable": false,
    "echsEmpanelled": true,
    "generalBedsUsed": 215,
    "icuBedsUsed": 35,
    "privateRoomsUsed": 24,
    "doctors": [],
    "equipment": [
      {
        "name": "CT Scanner",
        "status": "AVAILABLE",
        "count": 1
      },
      {
        "name": "MRI Scanner",
        "status": "AVAILABLE",
        "count": 1
      },
      {
        "name": "ICU Ventilators",
        "status": "AVAILABLE",
        "count": 32
      },
      {
        "name": "Dialysis Machines",
        "status": "AVAILABLE",
        "count": 5
      },
      {
        "name": "Emergency Trauma OT",
        "status": "AVAILABLE",
        "count": 2
      }
    ],
    "specialists": [
      "Cardiology",
      "Orthopaedics",
      "Neurosurgery",
      "General Surgery",
      "Pediatrics",
      "Emergency Trauma"
    ],
    "bloodStock": {
      "O+": 15,
      "O-": 4,
      "A+": 12,
      "A-": 3,
      "B+": 16,
      "B-": 4,
      "AB+": 8,
      "AB-": 2
    },
    "pmjayEmpanelled": true,
    "emergencyAvailable": true
  },
  {
    "id": "hosp-yatharth-noidaext",
    "name": "Yatharth Super Speciality Hospital Noida Extension",
    "type": "Specialized",
    "district": "Gautam Budh Nagar",
    "state": "Uttar Pradesh",
    "lat": 28.608,
    "lng": 77.442,
    "generalBeds": 450,
    "icuBeds": 60,
    "privateRooms": 50,
    "phone": "0120-4857000",
    "city": "Greater Noida",
    "area": "Sector 1 Greater Noida West",
    "address": "Plot No 1 Sector 1 Greater Noida West Uttar Pradesh 201306",
    "rating": 4.5,
    "specialties": [
      "Cardiology",
      "Orthopaedics",
      "Neurosurgery",
      "Oncology",
      "Gastroenterology",
      "Critical Care"
    ],
    "schemes": [
      "PM-JAY",
      "CGHS",
      "ECHS",
      "UP Ayushman Card"
    ],
    "dakEmpanelled": false,
    "freeSurgeryEmpanelled": false,
    "freeDiagnosticsAvailable": false,
    "cghsEmpanelled": true,
    "danEmpanelled": false,
    "jsyAvailable": false,
    "echsEmpanelled": true,
    "generalBedsUsed": 382,
    "icuBedsUsed": 53,
    "privateRoomsUsed": 43,
    "doctors": [],
    "equipment": [
      {
        "name": "CT Scanner",
        "status": "AVAILABLE",
        "count": 2
      },
      {
        "name": "MRI Scanner",
        "status": "AVAILABLE",
        "count": 1
      },
      {
        "name": "ICU Ventilators",
        "status": "AVAILABLE",
        "count": 48
      },
      {
        "name": "Dialysis Machines",
        "status": "AVAILABLE",
        "count": 9
      },
      {
        "name": "Emergency Trauma OT",
        "status": "AVAILABLE",
        "count": 3
      }
    ],
    "specialists": [
      "Cardiology",
      "Orthopaedics",
      "Neurosurgery",
      "Oncology",
      "Gastroenterology",
      "Critical Care"
    ],
    "bloodStock": {
      "O+": 27,
      "O-": 7,
      "A+": 21,
      "A-": 5,
      "B+": 28,
      "B-": 7,
      "AB+": 14,
      "AB-": 3
    },
    "pmjayEmpanelled": true,
    "emergencyAvailable": true
  },
  {
    "id": "hosp-prakash-noida",
    "name": "Prakash Hospital Noida Sector 33",
    "type": "Specialized",
    "district": "Gautam Budh Nagar",
    "state": "Uttar Pradesh",
    "lat": 28.582,
    "lng": 77.351,
    "generalBeds": 100,
    "icuBeds": 20,
    "privateRooms": 20,
    "phone": "0120-2505500",
    "city": "Noida",
    "area": "Sector 33",
    "address": "D-12 Sector 33 Noida Uttar Pradesh 201301",
    "rating": 4.2,
    "specialties": [
      "Orthopaedics",
      "General Surgery",
      "Cardiology",
      "Pediatrics",
      "Emergency Care"
    ],
    "schemes": [
      "PM-JAY",
      "CGHS",
      "ECHS",
      "UP State Health Scheme"
    ],
    "dakEmpanelled": false,
    "freeSurgeryEmpanelled": false,
    "freeDiagnosticsAvailable": false,
    "cghsEmpanelled": true,
    "danEmpanelled": false,
    "jsyAvailable": false,
    "echsEmpanelled": true,
    "generalBedsUsed": 84,
    "icuBedsUsed": 18,
    "privateRoomsUsed": 16,
    "doctors": [],
    "equipment": [
      {
        "name": "CT Scanner",
        "status": "AVAILABLE",
        "count": 1
      },
      {
        "name": "MRI Scanner",
        "status": "AVAILABLE",
        "count": 1
      },
      {
        "name": "ICU Ventilators",
        "status": "AVAILABLE",
        "count": 16
      },
      {
        "name": "Dialysis Machines",
        "status": "AVAILABLE",
        "count": 4
      },
      {
        "name": "Emergency Trauma OT",
        "status": "AVAILABLE",
        "count": 2
      }
    ],
    "specialists": [
      "Orthopaedics",
      "General Surgery",
      "Cardiology",
      "Pediatrics",
      "Emergency Care"
    ],
    "bloodStock": {
      "O+": 6,
      "O-": 2,
      "A+": 5,
      "A-": 2,
      "B+": 7,
      "B-": 2,
      "AB+": 4,
      "AB-": 1
    },
    "pmjayEmpanelled": true,
    "emergencyAvailable": true
  },
  {
    "id": "hosp-neo-noida",
    "name": "Neo Hospital Noida Sector 50",
    "type": "Specialized",
    "district": "Gautam Budh Nagar",
    "state": "Uttar Pradesh",
    "lat": 28.572,
    "lng": 77.368,
    "generalBeds": 150,
    "icuBeds": 25,
    "privateRooms": 25,
    "phone": "0120-4880000",
    "city": "Noida",
    "area": "Sector 50",
    "address": "D-170A Sector 50 Noida Uttar Pradesh 201301",
    "rating": 4.3,
    "specialties": [
      "Cardiology",
      "Orthopaedics",
      "Gastroenterology",
      "Nephrology",
      "Critical Care",
      "Gynecology"
    ],
    "schemes": [
      "PM-JAY",
      "CGHS",
      "ECHS",
      "UP Health Scheme"
    ],
    "dakEmpanelled": false,
    "freeSurgeryEmpanelled": false,
    "freeDiagnosticsAvailable": false,
    "cghsEmpanelled": true,
    "danEmpanelled": false,
    "jsyAvailable": false,
    "echsEmpanelled": true,
    "generalBedsUsed": 138,
    "icuBedsUsed": 23,
    "privateRoomsUsed": 20,
    "doctors": [],
    "equipment": [
      {
        "name": "CT Scanner",
        "status": "AVAILABLE",
        "count": 1
      },
      {
        "name": "MRI Scanner",
        "status": "AVAILABLE",
        "count": 1
      },
      {
        "name": "ICU Ventilators",
        "status": "AVAILABLE",
        "count": 20
      },
      {
        "name": "Dialysis Machines",
        "status": "AVAILABLE",
        "count": 4
      },
      {
        "name": "Emergency Trauma OT",
        "status": "AVAILABLE",
        "count": 2
      }
    ],
    "specialists": [
      "Cardiology",
      "Orthopaedics",
      "Gastroenterology",
      "Nephrology",
      "Critical Care",
      "Gynecology"
    ],
    "bloodStock": {
      "O+": 9,
      "O-": 2,
      "A+": 7,
      "A-": 2,
      "B+": 9,
      "B-": 2,
      "AB+": 4,
      "AB-": 1
    },
    "pmjayEmpanelled": true,
    "emergencyAvailable": true
  },
  {
    "id": "hosp-shantigopal-indirapuram",
    "name": "Shanti Gopal Hospital Indirapuram",
    "type": "Specialized",
    "district": "Ghaziabad",
    "state": "Uttar Pradesh",
    "lat": 28.638,
    "lng": 77.375,
    "generalBeds": 150,
    "icuBeds": 25,
    "privateRooms": 25,
    "phone": "0120-4777000",
    "city": "Ghaziabad",
    "area": "Ahinsa Khand 2 Indirapuram",
    "address": "Mall Road Ahinsa Khand 2 Indirapuram Ghaziabad Uttar Pradesh 201014",
    "rating": 4.3,
    "specialties": [
      "Cardiology",
      "Orthopaedics",
      "General Surgery",
      "Pediatrics",
      "Gynecology",
      "Critical Care"
    ],
    "schemes": [
      "PM-JAY",
      "CGHS",
      "ECHS",
      "UP Health Scheme"
    ],
    "dakEmpanelled": false,
    "freeSurgeryEmpanelled": false,
    "freeDiagnosticsAvailable": false,
    "cghsEmpanelled": true,
    "danEmpanelled": false,
    "jsyAvailable": false,
    "echsEmpanelled": true,
    "generalBedsUsed": 136,
    "icuBedsUsed": 20,
    "privateRoomsUsed": 21,
    "doctors": [],
    "equipment": [
      {
        "name": "CT Scanner",
        "status": "AVAILABLE",
        "count": 1
      },
      {
        "name": "MRI Scanner",
        "status": "AVAILABLE",
        "count": 1
      },
      {
        "name": "ICU Ventilators",
        "status": "AVAILABLE",
        "count": 20
      },
      {
        "name": "Dialysis Machines",
        "status": "AVAILABLE",
        "count": 4
      },
      {
        "name": "Emergency Trauma OT",
        "status": "AVAILABLE",
        "count": 2
      }
    ],
    "specialists": [
      "Cardiology",
      "Orthopaedics",
      "General Surgery",
      "Pediatrics",
      "Gynecology",
      "Critical Care"
    ],
    "bloodStock": {
      "O+": 9,
      "O-": 2,
      "A+": 7,
      "A-": 2,
      "B+": 9,
      "B-": 2,
      "AB+": 4,
      "AB-": 1
    },
    "pmjayEmpanelled": true,
    "emergencyAvailable": true
  },
  {
    "id": "hosp-sarvodaya-kavinagar",
    "name": "Sarvodaya Hospital Ghaziabad",
    "type": "Specialized",
    "district": "Ghaziabad",
    "state": "Uttar Pradesh",
    "lat": 28.672,
    "lng": 77.448,
    "generalBeds": 120,
    "icuBeds": 20,
    "privateRooms": 20,
    "phone": "0120-2700000",
    "city": "Ghaziabad",
    "area": "Kavi Nagar",
    "address": "C-1 Kavi Nagar Ghaziabad Uttar Pradesh 201002",
    "rating": 4.2,
    "specialties": [
      "General Medicine",
      "Surgery",
      "Orthopaedics",
      "Pediatrics",
      "Obstetrics & Gynaecology"
    ],
    "schemes": [
      "PM-JAY",
      "CGHS",
      "ECHS",
      "UP State Health"
    ],
    "dakEmpanelled": false,
    "freeSurgeryEmpanelled": false,
    "freeDiagnosticsAvailable": false,
    "cghsEmpanelled": true,
    "danEmpanelled": false,
    "jsyAvailable": false,
    "echsEmpanelled": true,
    "generalBedsUsed": 107,
    "icuBedsUsed": 16,
    "privateRoomsUsed": 16,
    "doctors": [],
    "equipment": [
      {
        "name": "CT Scanner",
        "status": "AVAILABLE",
        "count": 1
      },
      {
        "name": "MRI Scanner",
        "status": "AVAILABLE",
        "count": 1
      },
      {
        "name": "ICU Ventilators",
        "status": "AVAILABLE",
        "count": 16
      },
      {
        "name": "Dialysis Machines",
        "status": "AVAILABLE",
        "count": 4
      },
      {
        "name": "Emergency Trauma OT",
        "status": "AVAILABLE",
        "count": 2
      }
    ],
    "specialists": [
      "General Medicine",
      "Surgery",
      "Orthopaedics",
      "Pediatrics",
      "Obstetrics & Gynaecology"
    ],
    "bloodStock": {
      "O+": 6,
      "O-": 2,
      "A+": 5,
      "A-": 2,
      "B+": 7,
      "B-": 2,
      "AB+": 4,
      "AB-": 1
    },
    "pmjayEmpanelled": true,
    "emergencyAvailable": true
  },
  {
    "id": "hosp-narayana-gurugram",
    "name": "Narayana Superspeciality Hospital Gurugram",
    "type": "Tertiary",
    "district": "Gurugram",
    "state": "Haryana",
    "lat": 28.489,
    "lng": 77.089,
    "generalBeds": 215,
    "icuBeds": 40,
    "privateRooms": 35,
    "phone": "0124-6767676",
    "city": "Gurugram",
    "area": "DLF Phase 3",
    "address": "Plot 3201 Block V DLF Phase 3 Gurugram Haryana 122002",
    "rating": 4.6,
    "specialties": [
      "Cardiology",
      "Cardiothoracic Surgery",
      "Oncology",
      "Neurology",
      "Orthopaedics",
      "Gastroenterology"
    ],
    "schemes": [
      "PM-JAY",
      "CGHS",
      "ECHS",
      "Haryana Chirayu Card"
    ],
    "dakEmpanelled": false,
    "freeSurgeryEmpanelled": false,
    "freeDiagnosticsAvailable": false,
    "cghsEmpanelled": true,
    "danEmpanelled": false,
    "jsyAvailable": false,
    "echsEmpanelled": true,
    "generalBedsUsed": 191,
    "icuBedsUsed": 33,
    "privateRoomsUsed": 28,
    "doctors": [],
    "equipment": [
      {
        "name": "CT Scanner",
        "status": "AVAILABLE",
        "count": 1
      },
      {
        "name": "MRI Scanner",
        "status": "AVAILABLE",
        "count": 1
      },
      {
        "name": "ICU Ventilators",
        "status": "AVAILABLE",
        "count": 32
      },
      {
        "name": "Dialysis Machines",
        "status": "AVAILABLE",
        "count": 4
      },
      {
        "name": "Emergency Trauma OT",
        "status": "AVAILABLE",
        "count": 2
      }
    ],
    "specialists": [
      "Cardiology",
      "Cardiothoracic Surgery",
      "Oncology",
      "Neurology",
      "Orthopaedics",
      "Gastroenterology"
    ],
    "bloodStock": {
      "O+": 12,
      "O-": 3,
      "A+": 9,
      "A-": 2,
      "B+": 12,
      "B-": 3,
      "AB+": 6,
      "AB-": 1
    },
    "pmjayEmpanelled": true,
    "emergencyAvailable": true
  },
  {
    "id": "hosp-marengo-gurugram",
    "name": "Marengo Asia Hospitals Gurugram",
    "type": "Tertiary",
    "district": "Gurugram",
    "state": "Haryana",
    "lat": 28.425,
    "lng": 77.098,
    "generalBeds": 250,
    "icuBeds": 45,
    "privateRooms": 40,
    "phone": "0124-4131091",
    "city": "Gurugram",
    "area": "Sector 56",
    "address": "Golf Course Extension Road Sector 56 Gurugram Haryana 122011",
    "rating": 4.6,
    "specialties": [
      "Cardiology",
      "Neurosurgery",
      "Organ Transplant",
      "Oncology",
      "Orthopaedics",
      "Critical Care"
    ],
    "schemes": [
      "PM-JAY",
      "CGHS",
      "ECHS",
      "Haryana Ayushman Card"
    ],
    "dakEmpanelled": false,
    "freeSurgeryEmpanelled": false,
    "freeDiagnosticsAvailable": false,
    "cghsEmpanelled": true,
    "danEmpanelled": false,
    "jsyAvailable": false,
    "echsEmpanelled": true,
    "generalBedsUsed": 220,
    "icuBedsUsed": 38,
    "privateRoomsUsed": 34,
    "doctors": [],
    "equipment": [
      {
        "name": "CT Scanner",
        "status": "AVAILABLE",
        "count": 1
      },
      {
        "name": "MRI Scanner",
        "status": "AVAILABLE",
        "count": 1
      },
      {
        "name": "ICU Ventilators",
        "status": "AVAILABLE",
        "count": 36
      },
      {
        "name": "Dialysis Machines",
        "status": "AVAILABLE",
        "count": 5
      },
      {
        "name": "Emergency Trauma OT",
        "status": "AVAILABLE",
        "count": 2
      }
    ],
    "specialists": [
      "Cardiology",
      "Neurosurgery",
      "Organ Transplant",
      "Oncology",
      "Orthopaedics",
      "Critical Care"
    ],
    "bloodStock": {
      "O+": 15,
      "O-": 4,
      "A+": 12,
      "A-": 3,
      "B+": 16,
      "B-": 4,
      "AB+": 8,
      "AB-": 2
    },
    "pmjayEmpanelled": true,
    "emergencyAvailable": true
  },
  {
    "id": "hosp-park-gurugram",
    "name": "Park Hospital Gurugram Sector 47",
    "type": "Tertiary",
    "district": "Gurugram",
    "state": "Haryana",
    "lat": 28.435,
    "lng": 77.052,
    "generalBeds": 250,
    "icuBeds": 40,
    "privateRooms": 35,
    "phone": "0124-4599999",
    "city": "Gurugram",
    "area": "Sector 47",
    "address": "Q-Block South City II Sector 47 Main Sohna Road Gurugram Haryana 122018",
    "rating": 4.4,
    "specialties": [
      "Cardiology",
      "Orthopaedics",
      "Oncology",
      "Neurosurgery",
      "Gastroenterology",
      "Critical Care"
    ],
    "schemes": [
      "PM-JAY",
      "CGHS",
      "ECHS",
      "Haryana Chirayu"
    ],
    "dakEmpanelled": false,
    "freeSurgeryEmpanelled": false,
    "freeDiagnosticsAvailable": false,
    "cghsEmpanelled": true,
    "danEmpanelled": false,
    "jsyAvailable": false,
    "echsEmpanelled": true,
    "generalBedsUsed": 217,
    "icuBedsUsed": 34,
    "privateRoomsUsed": 28,
    "doctors": [],
    "equipment": [
      {
        "name": "CT Scanner",
        "status": "AVAILABLE",
        "count": 1
      },
      {
        "name": "MRI Scanner",
        "status": "AVAILABLE",
        "count": 1
      },
      {
        "name": "ICU Ventilators",
        "status": "AVAILABLE",
        "count": 32
      },
      {
        "name": "Dialysis Machines",
        "status": "AVAILABLE",
        "count": 5
      },
      {
        "name": "Emergency Trauma OT",
        "status": "AVAILABLE",
        "count": 2
      }
    ],
    "specialists": [
      "Cardiology",
      "Orthopaedics",
      "Oncology",
      "Neurosurgery",
      "Gastroenterology",
      "Critical Care"
    ],
    "bloodStock": {
      "O+": 15,
      "O-": 4,
      "A+": 12,
      "A-": 3,
      "B+": 16,
      "B-": 4,
      "AB+": 8,
      "AB-": 2
    },
    "pmjayEmpanelled": true,
    "emergencyAvailable": true
  },
  {
    "id": "hosp-signature-gurugram",
    "name": "Signature Hospital Gurugram Sector 37D",
    "type": "Tertiary",
    "district": "Gurugram",
    "state": "Haryana",
    "lat": 28.472,
    "lng": 76.972,
    "generalBeds": 300,
    "icuBeds": 45,
    "privateRooms": 40,
    "phone": "0124-5252525",
    "city": "Gurugram",
    "area": "Sector 37D Dwarka Expressway",
    "address": "Sector 37D Dwarka Expressway Gurugram Haryana 122001",
    "rating": 4.5,
    "specialties": [
      "Cardiology",
      "Neurosurgery",
      "Orthopaedics",
      "Oncology",
      "Gastroenterology",
      "Critical Care"
    ],
    "schemes": [
      "PM-JAY",
      "CGHS",
      "ECHS",
      "Haryana Ayushman Card"
    ],
    "dakEmpanelled": false,
    "freeSurgeryEmpanelled": false,
    "freeDiagnosticsAvailable": false,
    "cghsEmpanelled": true,
    "danEmpanelled": false,
    "jsyAvailable": false,
    "echsEmpanelled": true,
    "generalBedsUsed": 258,
    "icuBedsUsed": 39,
    "privateRoomsUsed": 34,
    "doctors": [],
    "equipment": [
      {
        "name": "CT Scanner",
        "status": "AVAILABLE",
        "count": 1
      },
      {
        "name": "MRI Scanner",
        "status": "AVAILABLE",
        "count": 1
      },
      {
        "name": "ICU Ventilators",
        "status": "AVAILABLE",
        "count": 36
      },
      {
        "name": "Dialysis Machines",
        "status": "AVAILABLE",
        "count": 6
      },
      {
        "name": "Emergency Trauma OT",
        "status": "AVAILABLE",
        "count": 2
      }
    ],
    "specialists": [
      "Cardiology",
      "Neurosurgery",
      "Orthopaedics",
      "Oncology",
      "Gastroenterology",
      "Critical Care"
    ],
    "bloodStock": {
      "O+": 18,
      "O-": 4,
      "A+": 14,
      "A-": 3,
      "B+": 19,
      "B-": 4,
      "AB+": 9,
      "AB-": 2
    },
    "pmjayEmpanelled": true,
    "emergencyAvailable": true
  },
  {
    "id": "hosp-sarvodaya-faridabad19",
    "name": "Sarvodaya Hospital Greater Faridabad Sector 19",
    "type": "Tertiary",
    "district": "Faridabad",
    "state": "Haryana",
    "lat": 28.411,
    "lng": 77.345,
    "generalBeds": 300,
    "icuBeds": 45,
    "privateRooms": 35,
    "phone": "0129-4194444",
    "city": "Faridabad",
    "area": "Sector 19",
    "address": "Sector 19 Near Old Faridabad Metro Station Faridabad Haryana 121002",
    "rating": 4.5,
    "specialties": [
      "Cardiology",
      "Neurosurgery",
      "Oncology",
      "Orthopaedics",
      "Kidney Transplant",
      "Gastroenterology"
    ],
    "schemes": [
      "PM-JAY",
      "CGHS",
      "ECHS",
      "Haryana Chirayu"
    ],
    "dakEmpanelled": false,
    "freeSurgeryEmpanelled": false,
    "freeDiagnosticsAvailable": false,
    "cghsEmpanelled": true,
    "danEmpanelled": false,
    "jsyAvailable": false,
    "echsEmpanelled": true,
    "generalBedsUsed": 255,
    "icuBedsUsed": 39,
    "privateRoomsUsed": 29,
    "doctors": [],
    "equipment": [
      {
        "name": "CT Scanner",
        "status": "AVAILABLE",
        "count": 1
      },
      {
        "name": "MRI Scanner",
        "status": "AVAILABLE",
        "count": 1
      },
      {
        "name": "ICU Ventilators",
        "status": "AVAILABLE",
        "count": 36
      },
      {
        "name": "Dialysis Machines",
        "status": "AVAILABLE",
        "count": 6
      },
      {
        "name": "Emergency Trauma OT",
        "status": "AVAILABLE",
        "count": 2
      }
    ],
    "specialists": [
      "Cardiology",
      "Neurosurgery",
      "Oncology",
      "Orthopaedics",
      "Kidney Transplant",
      "Gastroenterology"
    ],
    "bloodStock": {
      "O+": 18,
      "O-": 4,
      "A+": 14,
      "A-": 3,
      "B+": 19,
      "B-": 4,
      "AB+": 9,
      "AB-": 2
    },
    "pmjayEmpanelled": true,
    "emergencyAvailable": true
  },
  {
    "id": "hosp-metro-faridabad",
    "name": "Metro Hospital & Heart Institute Faridabad",
    "type": "Specialized",
    "district": "Faridabad",
    "state": "Haryana",
    "lat": 28.415,
    "lng": 77.318,
    "generalBeds": 250,
    "icuBeds": 40,
    "privateRooms": 30,
    "phone": "0129-4277777",
    "city": "Faridabad",
    "area": "Sector 16A",
    "address": "Sector 16A Faridabad Haryana 121002",
    "rating": 4.4,
    "specialties": [
      "Interventional Cardiology",
      "Cardiothoracic Surgery",
      "Nephrology",
      "Pulmonology",
      "Critical Care"
    ],
    "schemes": [
      "PM-JAY",
      "CGHS",
      "ECHS",
      "Haryana Ayushman Card"
    ],
    "dakEmpanelled": false,
    "freeSurgeryEmpanelled": false,
    "freeDiagnosticsAvailable": false,
    "cghsEmpanelled": true,
    "danEmpanelled": false,
    "jsyAvailable": false,
    "echsEmpanelled": true,
    "generalBedsUsed": 210,
    "icuBedsUsed": 35,
    "privateRoomsUsed": 24,
    "doctors": [],
    "equipment": [
      {
        "name": "CT Scanner",
        "status": "AVAILABLE",
        "count": 1
      },
      {
        "name": "MRI Scanner",
        "status": "AVAILABLE",
        "count": 1
      },
      {
        "name": "ICU Ventilators",
        "status": "AVAILABLE",
        "count": 32
      },
      {
        "name": "Dialysis Machines",
        "status": "AVAILABLE",
        "count": 5
      },
      {
        "name": "Emergency Trauma OT",
        "status": "AVAILABLE",
        "count": 2
      }
    ],
    "specialists": [
      "Interventional Cardiology",
      "Cardiothoracic Surgery",
      "Nephrology",
      "Pulmonology",
      "Critical Care"
    ],
    "bloodStock": {
      "O+": 15,
      "O-": 4,
      "A+": 12,
      "A-": 3,
      "B+": 16,
      "B-": 4,
      "AB+": 8,
      "AB-": 2
    },
    "pmjayEmpanelled": true,
    "emergencyAvailable": true
  }
];

export const MASTER_DELHI_108_DATASET: Facility[] = DELHI_NCR_108_HOSPITALS;
