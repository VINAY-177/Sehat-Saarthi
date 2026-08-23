import { Vitals, Comorbidities, RiskFactor, RiskResult, Urgency } from "@/lib/types";

// ============================================================
// Sehat Saathi AI — Rule-Based Risk Scoring Engine
// Pure TypeScript, zero dependencies, fully deterministic
// ============================================================

interface ScoringInput {
  symptoms: string[];
  vitals: Vitals;
  age: number;
  gender: string;
  comorbidities: Comorbidities;
}

// ---------- Symptom Severity Weights ----------

const SYMPTOM_WEIGHTS: Record<string, number> = {
  "Chest pain": 25,
  "Breathlessness": 20,
  "High fever (>39°C)": 15,
  "Seizures": 25,
  "Loss of consciousness": 30,
  "Bleeding (unexplained)": 20,
  "Severe headache": 12,
  "Persistent cough": 8,
  "Abdominal pain": 10,
  "Dizziness": 8,
  "Nausea / vomiting": 6,
  "Diarrhoea": 7,
  "Weakness / fatigue": 5,
  "Joint pain": 4,
  "Skin rash": 3,
  "Difficulty swallowing": 10,
  "Blurred vision": 10,
  "Swelling (limbs/face)": 8,
  "Urinary problems": 5,
  "Weight loss (unexplained)": 6,
};

// ---------- Core Scoring Function ----------

export function calculateRiskScore(input: ScoringInput): RiskResult {
  const factors: RiskFactor[] = [];
  let rawScore = 0;

  // 1. Symptom scoring
  for (const symptom of input.symptoms) {
    const weight = SYMPTOM_WEIGHTS[symptom] || 5;
    rawScore += weight;
    factors.push({
      factor: symptom,
      contribution: weight,
      detail: getSymptomDetail(symptom),
    });
  }

  // 2. Vital sign deviations
  const vitalFactors = scoreVitals(input.vitals);
  for (const vf of vitalFactors) {
    rawScore += vf.contribution;
    factors.push(vf);
  }

  // 3. Age modifier
  const ageFactor = scoreAge(input.age);
  if (ageFactor) {
    rawScore += ageFactor.contribution;
    factors.push(ageFactor);
  }

  // 4. Comorbidity modifiers
  const comorbs = scoreComorbidities(input.comorbidities, input.symptoms);
  for (const cf of comorbs) {
    rawScore += cf.contribution;
    factors.push(cf);
  }

  // Cap score at 100
  const score = Math.min(100, Math.max(0, rawScore));

  // Map to urgency band
  const urgency = scoreToUrgency(score);

  // Sort factors by contribution (highest first)
  factors.sort((a, b) => b.contribution - a.contribution);

  // Generate natural language summary
  const summary = generateSummary(score, urgency, factors);

  return {
    score,
    urgency,
    factors: factors.slice(0, 5), // Top 5 factors
    summary,
  };
}

// ---------- Vital Sign Scoring ----------

function scoreVitals(vitals: Vitals): RiskFactor[] {
  const factors: RiskFactor[] = [];

  // SpO2
  if (vitals.spO2 < 88) {
    factors.push({
      factor: "Dangerously low SpO2",
      contribution: 35,
      detail: `SpO2 at ${vitals.spO2}% is dangerously below 88% — immediate oxygen support needed`,
    });
  } else if (vitals.spO2 < 92) {
    factors.push({
      factor: "Critical SpO2",
      contribution: 30,
      detail: `SpO2 at ${vitals.spO2}% is below the critical threshold of 92%`,
    });
  } else if (vitals.spO2 < 95) {
    factors.push({
      factor: "Low SpO2",
      contribution: 15,
      detail: `SpO2 at ${vitals.spO2}% is below normal range (95-100%)`,
    });
  }

  // Blood Pressure — Systolic
  if (vitals.bpSystolic >= 180) {
    factors.push({
      factor: "Hypertensive crisis",
      contribution: 20,
      detail: `Systolic BP ${vitals.bpSystolic} mmHg indicates hypertensive crisis (≥180)`,
    });
  } else if (vitals.bpSystolic >= 160) {
    factors.push({
      factor: "Severe hypertension",
      contribution: 12,
      detail: `Systolic BP ${vitals.bpSystolic} mmHg is in Stage 2 hypertension range`,
    });
  } else if (vitals.bpSystolic >= 140) {
    factors.push({
      factor: "Hypertension",
      contribution: 8,
      detail: `Systolic BP ${vitals.bpSystolic} mmHg is above normal (≥140)`,
    });
  } else if (vitals.bpSystolic < 90) {
    factors.push({
      factor: "Hypotension",
      contribution: 15,
      detail: `Systolic BP ${vitals.bpSystolic} mmHg indicates possible hypotension or shock`,
    });
  }

  // Pulse
  if (vitals.pulse > 120) {
    factors.push({
      factor: "Tachycardia",
      contribution: 15,
      detail: `Pulse ${vitals.pulse} bpm is significantly elevated (>120)`,
    });
  } else if (vitals.pulse > 100) {
    factors.push({
      factor: "Elevated pulse",
      contribution: 8,
      detail: `Pulse ${vitals.pulse} bpm is above normal resting range (>100)`,
    });
  } else if (vitals.pulse < 50) {
    factors.push({
      factor: "Bradycardia",
      contribution: 12,
      detail: `Pulse ${vitals.pulse} bpm is abnormally low (<50)`,
    });
  }

  // Temperature
  if (vitals.temperature >= 40) {
    factors.push({
      factor: "Very high fever",
      contribution: 18,
      detail: `Temperature ${vitals.temperature}°C is dangerously high (≥40°C)`,
    });
  } else if (vitals.temperature >= 39) {
    factors.push({
      factor: "High fever",
      contribution: 10,
      detail: `Temperature ${vitals.temperature}°C exceeds 39°C threshold`,
    });
  } else if (vitals.temperature >= 38) {
    factors.push({
      factor: "Fever",
      contribution: 5,
      detail: `Temperature ${vitals.temperature}°C indicates fever (≥38°C)`,
    });
  } else if (vitals.temperature < 35.5) {
    factors.push({
      factor: "Hypothermia",
      contribution: 12,
      detail: `Temperature ${vitals.temperature}°C is below normal (<35.5°C)`,
    });
  }

  return factors;
}

// ---------- Age Scoring ----------

function scoreAge(age: number): RiskFactor | null {
  if (age >= 75) {
    return {
      factor: "Very elderly patient",
      contribution: 20,
      detail: `Age ${age} significantly increases risk for complications`,
    };
  } else if (age >= 65) {
    return {
      factor: "Elderly patient",
      contribution: 15,
      detail: `Age ${age} increases risk for cardiac and respiratory complications`,
    };
  } else if (age < 5) {
    return {
      factor: "Paediatric patient",
      contribution: 10,
      detail: `Age ${age} — young children require careful monitoring`,
    };
  } else if (age < 1) {
    return {
      factor: "Infant patient",
      contribution: 15,
      detail: `Infant age requires specialised paediatric care`,
    };
  }
  return null;
}

// ---------- Comorbidity Scoring ----------

function scoreComorbidities(comorbidities: Comorbidities, symptoms: string[]): RiskFactor[] {
  const factors: RiskFactor[] = [];

  if (comorbidities.diabetes) {
    factors.push({
      factor: "Diabetes",
      contribution: 10,
      detail: "Existing diabetes increases infection risk and complicates treatment",
    });
  }

  if (comorbidities.hypertension) {
    factors.push({
      factor: "Known hypertension",
      contribution: 10,
      detail: "Pre-existing hypertension increases cardiovascular event risk",
    });
  }

  if (comorbidities.heartDisease) {
    const hasCardiacSymptom = symptoms.some(s =>
      ["Chest pain", "Breathlessness", "Dizziness"].includes(s)
    );
    factors.push({
      factor: hasCardiacSymptom ? "Heart disease + cardiac symptoms" : "Heart disease",
      contribution: hasCardiacSymptom ? 20 : 15,
      detail: hasCardiacSymptom
        ? "Existing heart disease with acute cardiac symptoms is a critical combination"
        : "Pre-existing heart disease elevates baseline risk",
    });
  }

  if (comorbidities.pregnancy) {
    const riskySymptoms = symptoms.some(s =>
      ["High fever (>39°C)", "Bleeding (unexplained)", "Seizures", "Abdominal pain"].includes(s)
    );
    factors.push({
      factor: riskySymptoms ? "Pregnancy with concerning symptoms" : "Pregnancy",
      contribution: riskySymptoms ? 15 : 10,
      detail: riskySymptoms
        ? "Pregnancy with these symptoms requires urgent obstetric evaluation"
        : "Pregnancy requires careful monitoring of any acute symptoms",
    });
  }

  if (comorbidities.asthma && symptoms.includes("Breathlessness")) {
    factors.push({
      factor: "Asthma exacerbation",
      contribution: 12,
      detail: "Breathlessness in a known asthmatic may indicate acute exacerbation",
    });
  }

  if (comorbidities.kidney) {
    factors.push({
      factor: "Kidney disease",
      contribution: 8,
      detail: "Existing kidney disease complicates fluid management and medication dosing",
    });
  }

  return factors;
}

// ---------- Urgency Mapping ----------

function scoreToUrgency(score: number): Urgency {
  if (score >= 76) return Urgency.EMERGENCY;
  if (score >= 51) return Urgency.HIGH;
  if (score >= 26) return Urgency.MODERATE;
  return Urgency.LOW;
}

// ---------- Natural Language Summary Generator ----------

function generateSummary(
  score: number,
  urgency: Urgency,
  factors: RiskFactor[]
): string {
  const urgencyLabel = urgency.charAt(0) + urgency.slice(1).toLowerCase();
  const topFactors = factors.slice(0, 3);

  const factorDescriptions = topFactors.map((f, i) => {
    if (i === topFactors.length - 1 && topFactors.length > 1) {
      return `and ${f.detail.toLowerCase()}`;
    }
    return f.detail.toLowerCase();
  });

  const factorText = factorDescriptions.join(", ");

  let recommendation: string;
  switch (urgency) {
    case Urgency.EMERGENCY:
      recommendation = "Immediate referral to a facility with ICU capability recommended. Consider ambulance dispatch.";
      break;
    case Urgency.HIGH:
      recommendation = "Urgent referral to CHC or District Hospital with specialist care recommended.";
      break;
    case Urgency.MODERATE:
      recommendation = "Recommend visit to PHC or CHC for evaluation and monitoring.";
      break;
    case Urgency.LOW:
      recommendation = "Routine follow-up at PHC or SEHAT Mandir recommended.";
      break;
  }

  return `${urgencyLabel} risk (score ${score}/100). Primary concerns: ${factorText}. ${recommendation}`;
}

// ---------- Symptom Detail Generator ----------

function getSymptomDetail(symptom: string): string {
  const details: Record<string, string> = {
    "Chest pain": "Chest pain is a high-severity symptom requiring immediate cardiac evaluation",
    "Breathlessness": "Acute breathlessness may indicate cardiac, pulmonary, or systemic emergency",
    "High fever (>39°C)": "High-grade fever suggests significant infection or inflammatory process",
    "Persistent cough": "Persistent cough warrants evaluation for respiratory infection or TB",
    "Abdominal pain": "Abdominal pain requires evaluation to rule out surgical emergency",
    "Severe headache": "Severe headache requires evaluation to rule out neurological emergency",
    "Weakness / fatigue": "Generalised weakness may indicate systemic illness",
    "Dizziness": "Dizziness may indicate cardiovascular or neurological compromise",
    "Nausea / vomiting": "Persistent nausea/vomiting may indicate GI or systemic illness",
    "Diarrhoea": "Diarrhoea raises concern for dehydration, especially in elderly or children",
    "Joint pain": "Joint pain is typically non-acute but warrants evaluation",
    "Skin rash": "Skin rash may indicate allergic reaction or infection",
    "Difficulty swallowing": "Difficulty swallowing requires evaluation for obstruction or infection",
    "Blurred vision": "Blurred vision may indicate neurological or vascular emergency",
    "Seizures": "Seizure activity is a neurological emergency requiring immediate care",
    "Bleeding (unexplained)": "Unexplained bleeding requires urgent haematological evaluation",
    "Swelling (limbs/face)": "Oedema may indicate cardiac, renal, or allergic process",
    "Urinary problems": "Urinary symptoms require evaluation for infection or obstruction",
    "Weight loss (unexplained)": "Unexplained weight loss warrants investigation for chronic illness",
    "Loss of consciousness": "Loss of consciousness is a critical emergency requiring immediate response",
  };
  return details[symptom] || `${symptom} reported — warrants clinical evaluation`;
}

// ---------- Specialist Inference from Symptoms ----------

export function inferSpecialistNeeds(symptoms: string[], comorbidities: Comorbidities): string[] {
  const needs: Set<string> = new Set();

  for (const symptom of symptoms) {
    switch (symptom) {
      case "Chest pain":
      case "Breathlessness":
        needs.add("Cardiologist");
        break;
      case "Seizures":
      case "Severe headache":
      case "Blurred vision":
      case "Loss of consciousness":
        needs.add("General Physician"); // Neurologist in production
        break;
      case "Abdominal pain":
      case "Difficulty swallowing":
        needs.add("Surgeon");
        break;
    }
  }

  if (comorbidities.pregnancy) {
    needs.add("OB-GYN");
  }

  if (comorbidities.kidney) {
    needs.add("General Physician");
  }

  // Always need at least a general physician
  needs.add("General Physician");

  return Array.from(needs);
}
