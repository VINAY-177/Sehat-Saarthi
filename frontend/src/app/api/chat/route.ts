import { NextResponse } from "next/server";

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const SYSTEM_PROMPT = `You are "Connect to Care AI" (सेहत साथी), a friendly, highly intelligent, compassionate bilingual healthcare assistant for Delhi-NCR hospitals.
You guide patients smoothly through booking an OPD doctor consultation without displaying robotic step numbers.

CRITICAL INSTRUCTIONS:
1. NO MECHANICAL STEP LABELS: Never output robotic prefixes like "[Step 1/10]" or "[चरण 1/10]". Talk completely naturally and warmly.
2. STRICT INPUT VALIDATION:
   - Name: Must be a genuine name (>= 2 letters, alphabetic). Reject random keys like "asdfgh", "12345", single letters.
   - Phone: Must be a valid 10-digit Indian phone number starting with 6, 7, 8, 9.
   - Symptoms: Must be a plausible health complaint or reason for visit (e.g. fever, headache, chest pain, checkup, knee pain). Reject gibberish or non-medical spam.
   - Duration: Must indicate a timeframe (e.g. 2 days, 1 week, since morning).
   - If invalid: Set "isValid": false and explain politely in the selected language what information is needed.
3. ENTITY EXTRACTION:
   - Extract any provided details: fullName, phone, symptoms, duration, hospital, doctorSpecialty, doctorName, date, time.
4. CLINICAL SUGGESTION:
   - Recommend the right medical specialty (Cardiology, Orthopaedics, General Physician, Pulmonology, Pediatrics, Neurology, etc.).
   - Give safe, reassuring home care precautions and red-flag advice (call 108 for acute emergencies).
5. LANGUAGE:
   - Hindi/Hinglish if user speaks Hindi/Hinglish or language='hi'.
   - English if user speaks English or language='en'.

You MUST return strictly valid JSON matching this schema:
{
  "reply": "Friendly conversational message (NO step numbers)",
  "isValid": true,
  "validationError": "",
  "nextStep": "NAME" | "PHONE" | "SYMPTOMS" | "DURATION" | "HOSPITAL" | "SUGGESTION" | "DOCTOR_SELECTION" | "TIMING" | "DOCTOR_AVAILABILITY" | "CONFIRM_APPOINTMENT" | "BOOKED",
  "options": ["Quick option 1", "Quick option 2"],
  "extracted": {
    "fullName": "",
    "phone": "",
    "symptoms": "",
    "duration": "",
    "hospital": "",
    "doctorSpecialty": "",
    "suggestion": "",
    "doctorName": "",
    "date": "",
    "time": ""
  },
  "isSuggestionCard": false,
  "isAvailabilityCard": false,
  "isSummary": false,
  "widgetType": "symptom_selector" | "hospital_cards" | "doctor_cards" | "time_matrix" | "confirmation_card" | null
}`;

interface ChatHistoryItem {
  sender?: string;
  text?: string;
  [key: string]: unknown;
}

// Call Groq with ultra-fast models
async function callGroq(messages: ChatHistoryItem[], userMessage: string): Promise<string | null> {
  if (!GROQ_API_KEY) return null;
  const models = ["openai/gpt-oss-120b", "qwen/qwen3.8-27b", "openai/gpt-oss-20b"];

  const groqMessages = [
    { role: "system", content: SYSTEM_PROMPT },
    ...messages.map((m: ChatHistoryItem) => ({
      role: m.sender === "bot" ? "assistant" : "user",
      content: m.text || "",
    })),
    { role: "user", content: userMessage }
  ];

  for (const model of models) {
    try {
      const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model,
          messages: groqMessages,
          temperature: 0.2,
          max_tokens: 800,
          response_format: { type: "json_object" },
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const content = data.choices?.[0]?.message?.content;
        if (content) return content;
      }
    } catch (e) {
      console.warn(`Groq ${model} error:`, e);
    }
  }
  return null;
}

// Call Gemini as additional AI verification engine
async function callGemini(messages: ChatHistoryItem[], promptText: string): Promise<string | null> {
  if (!GEMINI_API_KEY) return null;
  const models = ["gemini-flash-latest", "gemini-pro-latest"];

  for (const model of models) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`;
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: `${SYSTEM_PROMPT}\n\nContext History: ${JSON.stringify(messages)}\n\nUser Input: ${promptText}\n\nReturn valid JSON.` }]
            }
          ],
          generationConfig: {
            temperature: 0.2,
            responseMimeType: "application/json"
          }
        })
      });

      if (res.ok) {
        const data = await res.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) return text;
      }
    } catch (e) {
      console.warn(`Gemini ${model} error:`, e);
    }
  }
  return null;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { 
      message, 
      currentStep = "NAME", 
      language = "en", 
      bookingDetails = {}, 
      conversationHistory = [] 
    } = body;

    const historyPayload = conversationHistory.slice(-6);
    const contextualMessage = `[Language: ${language} | Active Step: ${currentStep} | Current State: ${JSON.stringify(bookingDetails)}]\nUser Input: ${message}`;

    // 1. Run ultra-fast Groq LPU engine first (Sub-200ms)
    let rawJson = await callGroq(historyPayload, contextualMessage);

    // 2. If Groq unavailable, call Gemini AI engine
    if (!rawJson) {
      rawJson = await callGemini(historyPayload, contextualMessage);
    }

    if (rawJson) {
      try {
        const parsed = JSON.parse(rawJson);
        return NextResponse.json(parsed);
      } catch (parseErr) {
        console.warn("AI JSON parse error:", parseErr);
      }
    }

    // 3. Fallback to client-side engine if external APIs are unreachable
    return NextResponse.json({
      fallback: true,
      message,
      currentStep,
      language
    });

  } catch (error: unknown) {
    console.error("Chat route error:", error);
    const msg = error instanceof Error ? error.message : "Server error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
