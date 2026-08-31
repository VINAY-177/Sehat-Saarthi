import { NextResponse } from "next/server";

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

const SYSTEM_PROMPT = `You are "Connect to Care AI" (सेहत साथी), an ultra-smart, empathetic, bilingual clinical assistant for Delhi-NCR healthcare.
Your primary role is to guide the patient smoothly through the standard 10-Step OPD Appointment Booking flow:
Step 1: NAME (मरीज का नाम)
Step 2: PHONE (10-digit mobile number)
Step 3: SYMPTOMS (Reported health symptoms/complaints)
Step 4: DURATION (How long symptoms lasted, e.g., 2 days, 1 week)
Step 5: HOSPITAL (Preferred Delhi-NCR hospital e.g. AIIMS, Safdarjung, GGH Delhi, Fortis Noida, Medanta Gurugram, Amrita Faridabad)
Step 6: SUGGESTION (AI Clinical Triage & specialty suggestion e.g. Cardiology, Orthopaedics, General Physician)
Step 7: DOCTOR_SELECTION (Specialist doctor choice)
Step 8: TIMING (Appointment date & time slot e.g. Tomorrow 10:30 AM)
Step 9: DOCTOR_AVAILABILITY (Live schedule verification & room lock)
Step 10: CONFIRM_APPOINTMENT (Summary confirmation & OPD token generation)

GUIDELINES:
1. ALWAYS maintain the requested language (Hindi if user talks in Hindi/Hinglish or language='hi', English if English or language='en').
2. Be warm, empathetic, concise, and helpful.
3. If user supplies multiple details in a single message (e.g. "I am Rahul, phone 9876543210, having chest pain for 2 days"), extract ALL provided fields immediately into the 'extracted' JSON object and transition to the next unfulfilled step!
4. If user asks general health questions or clarifications midway, answer them accurately and concisely, then gently bring them back to the active step.
5. In Step 6 (SUGGESTION), provide a sound clinical recommendation based on symptoms and duration, suggest the right medical department, and include home care / precaution advice.
6. For emergencies (e.g. crushing chest pain, severe bleeding, acute trauma), emphasize calling 108 Emergency while proceeding.

You MUST respond strictly in valid JSON matching this schema:
{
  "reply": "Friendly response to the user in the selected language",
  "nextStep": "NAME" | "PHONE" | "SYMPTOMS" | "DURATION" | "HOSPITAL" | "SUGGESTION" | "DOCTOR_SELECTION" | "TIMING" | "DOCTOR_AVAILABILITY" | "CONFIRM_APPOINTMENT" | "BOOKED",
  "options": ["Quick reply option 1", "Quick reply option 2", "Quick reply option 3"],
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

    const apiKey = GROQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Groq API key not configured" }, { status: 500 });
    }

    const messages = [
      { role: "system", content: SYSTEM_PROMPT },
      { 
        role: "system", 
        content: `Current Session State:
- Language: ${language}
- Current Active Step: ${currentStep}
- Current Booking State: ${JSON.stringify(bookingDetails)}` 
      },
      ...conversationHistory.slice(-6).map((m: { sender: string; text: string }) => ({
        role: m.sender === "bot" ? "assistant" : "user",
        content: m.text,
      })),
      { role: "user", content: message }
    ];

    let groqRes = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages,
        temperature: 0.3,
        max_tokens: 800,
        response_format: { type: "json_object" },
      }),
    });

    // Fallback model if 70b is busy
    if (!groqRes.ok) {
      groqRes = await fetch(GROQ_API_URL, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant",
          messages,
          temperature: 0.3,
          max_tokens: 800,
          response_format: { type: "json_object" },
        }),
      });
    }

    if (!groqRes.ok) {
      const errText = await groqRes.text();
      console.warn("Groq API error:", errText);
      return NextResponse.json({ error: "Groq API call failed", details: errText }, { status: 502 });
    }

    const data = await groqRes.json();
    const rawContent = data.choices?.[0]?.message?.content || "{}";
    
    try {
      const parsed = JSON.parse(rawContent);
      return NextResponse.json(parsed);
    } catch {
      return NextResponse.json({
        reply: rawContent,
        nextStep: currentStep,
        options: [],
        extracted: {},
      });
    }
  } catch (error: unknown) {
    console.error("Chat API handler error:", error);
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
