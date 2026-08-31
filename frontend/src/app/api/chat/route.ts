import { NextResponse } from "next/server";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GROQ_API_KEY = process.env.GROQ_API_KEY;

const SYSTEM_PROMPT = `You are "Connect to Care AI" (सेहत साथी), a compassionate, highly accurate bilingual clinical assistant for Delhi-NCR healthcare.
You guide patients naturally through booking an OPD doctor consultation without displaying mechanical step numbers.

CRITICAL RULES:
1. NEVER include robotic prefixes like "[Step 1/10]" or "[चरण 1/10]" in your replies. Keep your tone completely natural, friendly, and human.
2. STRICT INPUT VALIDATION:
   - For Name: Reject gibberish (e.g. "asdfgh", "12345", "@#$%", single letters). Must be a genuine name.
   - For Phone: Must be a valid 10-digit Indian phone number starting with 6, 7, 8, or 9.
   - For Symptoms: Must be a medically plausible health complaint or reason for visit (e.g. fever, headache, chest pain, checkup, etc.). Reject random non-health text like "asdasd" or unrelated phrases.
   - For Duration: Must indicate a timeframe (e.g. 2 days, 1 week, since morning, chronic).
   - If the input is invalid or nonsensical for the expected field, set "isValid": false and explain politely what information is required.
3. INGESTION & EXTRACTION:
   - If a user provides multiple details in one sentence (e.g., "My name is Rohit, phone 9876543210, having bad stomach ache for 3 days"), extract ALL provided fields into 'extracted' and naturally ask for the next missing piece of information.
4. CLINICAL SUGGESTION (when symptoms + duration are known):
   - Suggest the appropriate medical department (e.g. Cardiology, Orthopaedics, General Physician, Pulmonology, Pediatrics, Neurology, Dermatology).
   - Provide safe, comforting care advice (hydration, rest, precautions).
   - Highlight red flags for emergency care (call 108) if life-threatening symptoms (e.g. severe chest pain, extreme breathlessness) are detected.
5. LANGUAGE:
   - If the user uses Hindi/Hinglish or language='hi', respond in clear, natural Hindi.
   - If English, respond in professional, friendly English.

You MUST respond strictly in valid JSON matching this schema:
{
  "reply": "Friendly, natural conversational response (NO step numbers)",
  "isValid": true | false,
  "validationError": "string explaining why input is invalid if isValid is false, else empty",
  "nextStep": "NAME" | "PHONE" | "SYMPTOMS" | "DURATION" | "HOSPITAL" | "SUGGESTION" | "DOCTOR_SELECTION" | "TIMING" | "DOCTOR_AVAILABILITY" | "CONFIRM_APPOINTMENT" | "BOOKED",
  "options": ["Option 1", "Option 2"],
  "extracted": {
    "fullName": "extracted name or empty",
    "phone": "10-digit phone or empty",
    "symptoms": "extracted symptoms or empty",
    "duration": "extracted duration or empty",
    "hospital": "extracted hospital or empty",
    "doctorSpecialty": "matched specialty or empty",
    "suggestion": "clinical advice or empty",
    "doctorName": "selected doctor or empty",
    "date": "selected date or empty",
    "time": "selected time or empty"
  },
  "isSuggestionCard": boolean,
  "isAvailabilityCard": boolean,
  "isSummary": boolean,
  "widgetType": "symptom_selector" | "hospital_cards" | "doctor_cards" | "time_matrix" | "confirmation_card" | null
}`;

interface ChatHistoryItem {
  sender?: string;
  text?: string;
  [key: string]: unknown;
}

async function callGemini(messages: ChatHistoryItem[], promptText: string): Promise<string | null> {
  if (!GEMINI_API_KEY) return null;
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;
  
  try {
    const formattedContents = [
      {
        role: "user",
        parts: [
          { text: `${SYSTEM_PROMPT}\n\nChat History & Context:\n${JSON.stringify(messages)}\n\nLatest User Input:\n${promptText}\n\nRespond strictly in valid JSON.` }
        ]
      }
    ];

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: formattedContents,
        generationConfig: {
          temperature: 0.2,
          responseMimeType: "application/json",
        }
      })
    });

    if (!res.ok) {
      console.warn("Gemini API call failed with status:", res.status);
      return null;
    }

    const data = await res.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || null;
  } catch (err) {
    console.warn("Gemini call error:", err);
    return null;
  }
}

async function callGroq(messages: ChatHistoryItem[], userMessage: string): Promise<string | null> {
  if (!GROQ_API_KEY) return null;
  const url = "https://api.groq.com/openai/v1/chat/completions";

  try {
    const groqMessages = [
      { role: "system", content: SYSTEM_PROMPT },
      ...messages.map((m: ChatHistoryItem) => ({
        role: m.sender === "bot" ? "assistant" : "user",
        content: m.text || "",
      })),
      { role: "user", content: userMessage }
    ];

    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: groqMessages,
        temperature: 0.2,
        max_tokens: 800,
        response_format: { type: "json_object" },
      }),
    });

    if (!res.ok) {
      // Fallback to llama-3.1-8b
      const resFallback = await fetch(url, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant",
          messages: groqMessages,
          temperature: 0.2,
          max_tokens: 800,
          response_format: { type: "json_object" },
        }),
      });
      if (!resFallback.ok) return null;
      const data = await resFallback.json();
      return data.choices?.[0]?.message?.content || null;
    }

    const data = await res.json();
    return data.choices?.[0]?.message?.content || null;
  } catch (err) {
    console.warn("Groq call error:", err);
    return null;
  }
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

    const contextPayload = {
      language,
      currentStep,
      bookingDetails,
      history: conversationHistory.slice(-6)
    };

    // 1. Try Gemini API first for high-precision verification & reasoning
    let rawJson = await callGemini(contextPayload.history, message);

    // 2. If Gemini fails or is unavailable, use Groq LPU engine
    if (!rawJson) {
      rawJson = await callGroq(contextPayload.history, message);
    }

    if (rawJson) {
      try {
        const parsed = JSON.parse(rawJson);
        return NextResponse.json(parsed);
      } catch (parseErr) {
        console.warn("JSON parse error from AI response:", parseErr);
      }
    }

    // 3. Fallback deterministic validation if both APIs are unreachable
    return NextResponse.json({
      fallback: true,
      message,
      currentStep
    });

  } catch (error: unknown) {
    console.error("Chat route error:", error);
    const msg = error instanceof Error ? error.message : "Server error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
