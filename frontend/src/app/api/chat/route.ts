import { NextResponse } from "next/server";

const GROQ_API_KEY = process.env.GROQ_API_KEY;

const SYSTEM_PROMPT = `You are "Connect to Care AI" (सेहत साथी), a friendly, highly intelligent, compassionate bilingual healthcare assistant for Delhi-NCR hospitals.
You guide patients smoothly through booking an OPD doctor consultation without displaying robotic step numbers.

CRITICAL RULES:
1. NO MECHANICAL STEP LABELS: Never output robotic prefixes like "[Step 1/10]" or "[चरण 1/10]". Talk completely naturally and warmly.
2. STRICT INPUT VALIDATION:
   - Name: Must be a genuine human name (at least 2 letters, vowels required, reject random consonant spam like "yxjhgcj", "asdfgh").
   - Phone: Must be a valid 10-digit Indian phone number starting with 6, 7, 8, 9.
   - Symptoms: Must be a plausible health complaint or reason for visit (e.g. fever, headache, chest pain, checkup, knee pain). Reject gibberish or spam.
   - If invalid: Set "isValid": false and in "reply" explain politely what is needed.
3. FLOW & TRANSITIONS:
   - If at NAME step and name is valid -> reply warmly and ask for 10-digit phone number. Set nextStep: "PHONE".
   - If at PHONE step and phone is valid -> acknowledge and ask what health issues/symptoms they have. Set nextStep: "SYMPTOMS", widgetType: "symptom_selector".
   - If at SYMPTOMS step -> ask how long they have had these symptoms. Set nextStep: "DURATION".
   - If at DURATION step -> recommend specialty and ask to select Delhi-NCR hospital. Set nextStep: "HOSPITAL", widgetType: "hospital_cards".
   - If at HOSPITAL step -> present specialist doctors. Set nextStep: "DOCTOR_SELECTION", widgetType: "doctor_cards".
   - If at DOCTOR_SELECTION step -> ask for preferred time slot. Set nextStep: "TIMING", widgetType: "time_matrix".
   - If at TIMING step -> show appointment summary and ask for confirmation. Set nextStep: "CONFIRM_APPOINTMENT", isSummary: true.
4. LANGUAGE:
   - Hindi/Hinglish if user speaks Hindi/Hinglish or language='hi'.
   - English if user speaks English or language='en'.

You MUST return strictly valid JSON matching this schema:
{
  "reply": "Friendly conversational message (NEVER empty, NO step numbers)",
  "isValid": true,
  "validationError": "",
  "nextStep": "NAME" | "PHONE" | "SYMPTOMS" | "DURATION" | "HOSPITAL" | "SUGGESTION" | "DOCTOR_SELECTION" | "TIMING" | "DOCTOR_AVAILABILITY" | "CONFIRM_APPOINTMENT" | "BOOKED",
  "options": ["Quick Option 1"],
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
  "widgetType": "symptom_selector" | "hospital_cards" | "doctor_cards" | "time_matrix" | null
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
        if (content && content.trim().startsWith("{")) return content;
      }
    } catch (e) {
      console.warn(`Groq ${model} error:`, e);
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

    const isHindi = language === "hi";
    const historyPayload = conversationHistory.slice(-6);
    const contextualMessage = `[Language: ${language} | Active Step: ${currentStep} | Current State: ${JSON.stringify(bookingDetails)}]\nUser Input: ${message}`;

    // 1. Run ultra-fast Groq LPU engine (Sub-200ms)
    const rawJson = await callGroq(historyPayload, contextualMessage);

    if (rawJson) {
      try {
        const parsed = JSON.parse(rawJson);
        if (parsed && parsed.reply) {
          return NextResponse.json(parsed);
        }
      } catch (parseErr) {
        console.warn("AI JSON parse error:", parseErr);
      }
    }

    // 2. Structured fallback if AI is momentarily unreachable
    let fallbackReply = "";
    let fallbackNextStep = currentStep;
    let widgetType: string | null = null;

    if (currentStep === "NAME") {
      fallbackReply = isHindi
        ? `आपसे मिलकर खुशी हुई, ${message}! कृपया अपॉइंटमेंट पुष्टि के लिए अपना 10 अंकों का मोबाइल नंबर दर्ज करें:`
        : `Nice to meet you, ${message}! Please share your 10-digit mobile number for appointment confirmation:`;
      fallbackNextStep = "PHONE";
    } else if (currentStep === "PHONE") {
      fallbackReply = isHindi
        ? "धन्यवाद! अब कृपया बताएं कि आप किस प्रकार की स्वास्थ्य समस्या या लक्षण महसूस कर रहे हैं:"
        : "Thank you! What health symptoms or concerns are you experiencing today?";
      fallbackNextStep = "SYMPTOMS";
      widgetType = "symptom_selector";
    } else if (currentStep === "SYMPTOMS") {
      fallbackReply = isHindi
        ? `लक्षण नोट कर लिए गए हैं (${message})। आप इन लक्षणों को कितने समय से महसूस कर रहे हैं?`
        : `Got it. How long have you been experiencing these symptoms (${message})?`;
      fallbackNextStep = "DURATION";
    } else if (currentStep === "DURATION") {
      fallbackReply = isHindi
        ? "आपके लक्षणों के आधार पर, हम जनरल फिजिशियन या विशेषज्ञ डॉक्टर की सलाह देते हैं। कृपया अपना पसंदीदा दिल्ली-एनसीआर अस्पताल चुनें:"
        : "Based on your symptoms, we recommend consulting a specialist. Please select your preferred Delhi-NCR hospital:";
      fallbackNextStep = "HOSPITAL";
      widgetType = "hospital_cards";
    } else if (currentStep === "HOSPITAL") {
      fallbackReply = isHindi
        ? `अस्पताल चुन लिया गया है। कृपया नीचे उपलब्ध विशेषज्ञ डॉक्टरों में से चुनें:`
        : `Great facility choice. Please select from the available specialist doctors below:`;
      fallbackNextStep = "DOCTOR_SELECTION";
      widgetType = "doctor_cards";
    } else if (currentStep === "DOCTOR_SELECTION") {
      fallbackReply = isHindi
        ? `डॉक्टर चुन लिए गए हैं। कृपया अपना पसंदीदा परामर्श समय चुनें:`
        : `Doctor selected. Please select your preferred consultation time slot:`;
      fallbackNextStep = "TIMING";
      widgetType = "time_matrix";
    } else {
      fallbackReply = isHindi
        ? `कृपया अपने अपॉइंटमेंट विवरण की पुष्टि करें:`
        : `Please confirm your OPD consultation booking details:`;
      fallbackNextStep = "CONFIRM_APPOINTMENT";
    }

    return NextResponse.json({
      reply: fallbackReply,
      isValid: true,
      validationError: "",
      nextStep: fallbackNextStep,
      options: [],
      extracted: {},
      widgetType,
    });

  } catch (error: unknown) {
    console.error("Chat route error:", error);
    const msg = error instanceof Error ? error.message : "Server error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
