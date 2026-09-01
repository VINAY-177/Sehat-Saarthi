import { NextResponse } from "next/server";

const GROQ_API_KEY = process.env.GROQ_API_KEY;

const SYSTEM_PROMPT = `You are "Sehat Saarthi AI" (सेहत सारथी), a friendly, highly intelligent, compassionate bilingual healthcare assistant for Delhi-NCR hospitals.
You guide patients smoothly through booking an OPD doctor consultation without displaying robotic step numbers.

CRITICAL RULES:
1. NO MECHANICAL STEP LABELS: Never output robotic prefixes like "[Step 1/10]" or "[चरण 1/10]". Talk completely naturally and warmly.
2. STRICT INPUT VALIDATION:
   - Name: Must be a genuine human name (at least 2 letters, vowels required, reject random consonant spam like "yxjhgcj", "asdfgh").
   - Phone: Must be a valid 10-digit Indian phone number starting with 6, 7, 8, 9.
   - Symptoms: Must be a plausible health complaint or reason for visit (e.g. fever, headache, chest pain, checkup, knee pain). Reject gibberish or spam.
   - If invalid: Set "isValid": false and in "reply" explain politely what is needed.
3. CONVERSATION FLOW & TRANSITIONS:
   - Step 1 (NAME): If name is valid -> reply warmly and ask for 10-digit phone number. Set nextStep: "PHONE".
   - Step 2 (PHONE): If phone is valid -> acknowledge and ask what health issues/symptoms they have. Set nextStep: "SYMPTOMS", widgetType: "symptom_selector".
   - Step 3 (SYMPTOMS): Analyze symptoms, give an intelligent recommendation for the doctor specialty (e.g. "Based on your chest discomfort, I strongly recommend a Cardiologist. Which doctor type would you prefer?"). Set nextStep: "SPECIALTY_CHOICE", widgetType: "specialty_selector".
   - Step 4 (SPECIALTY_CHOICE): Acknowledge chosen doctor specialty and ask to select Delhi-NCR hospital or use GPS. Set nextStep: "HOSPITAL", widgetType: "hospital_cards".
   - Step 5 (HOSPITAL): Present specialist doctors from that hospital. Set nextStep: "DOCTOR_SELECTION", widgetType: "doctor_cards".
   - Step 6 (DOCTOR_SELECTION): Ask for preferred time slot within 72 hours (Today, Tomorrow, Day After Tomorrow). Set nextStep: "TIMING", widgetType: "time_matrix".
   - Step 7 (TIMING): 
     * If user asks for date > 72 hours (3 days): Explain that OPD appointments are only open up to 72 hours in advance, or offer the Urgent Staff Approval request option.
     * If valid slot selected within 72 hours: Show appointment summary and ask for confirmation. Set nextStep: "CONFIRM_APPOINTMENT", isSummary: true.
     * If urgent case: Offer priority staff approval ticket.
4. LANGUAGE:
   - Hindi/Hinglish if user speaks Hindi/Hinglish or language='hi'.
   - English if user speaks English or language='en'.

You MUST return strictly valid JSON matching this schema:
{
  "reply": "Friendly conversational message (NEVER empty, NO step numbers)",
  "isValid": true,
  "validationError": "",
  "nextStep": "NAME" | "PHONE" | "SYMPTOMS" | "SPECIALTY_CHOICE" | "HOSPITAL" | "DOCTOR_SELECTION" | "TIMING" | "DOCTOR_AVAILABILITY" | "CONFIRM_APPOINTMENT" | "BOOKED",
  "options": ["Option 1", "Option 2"],
  "extracted": {
    "fullName": "",
    "phone": "",
    "symptoms": "",
    "doctorSpecialty": "",
    "suggestion": "",
    "hospital": "",
    "doctorName": "",
    "date": "",
    "time": ""
  },
  "widgetType": "symptom_selector" | "specialty_selector" | "hospital_cards" | "doctor_cards" | "time_matrix" | null
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
      const lower = (message || "").toLowerCase();
      let suggestedSpec = "General Physician";
      let suggestedSpecHi = "सामान्य चिकित्सक (General Physician)";
      if (lower.includes("chest") || lower.includes("heart") || lower.includes("दिल") || lower.includes("छाती")) {
        suggestedSpec = "Cardiologist";
        suggestedSpecHi = "हृदय रोग विशेषज्ञ (Cardiologist)";
      } else if (lower.includes("bone") || lower.includes("knee") || lower.includes("joint") || lower.includes("हड्डी") || lower.includes("जोड़")) {
        suggestedSpec = "Orthopedic Surgeon";
        suggestedSpecHi = "हड्डी व जोड़ विशेषज्ञ (Orthopedic)";
      } else if (lower.includes("breath") || lower.includes("cough") || lower.includes("सांस") || lower.includes("खांसी")) {
        suggestedSpec = "Pulmonologist";
        suggestedSpecHi = "श्वसन व फेफड़ा रोग विशेषज्ञ (Pulmonologist)";
      } else if (lower.includes("head") || lower.includes("neuro") || lower.includes("सिर") || lower.includes("चक्कर")) {
        suggestedSpec = "Neurologist";
        suggestedSpecHi = "मस्तिष्क व तंत्रिका विशेषज्ञ (Neurologist)";
      } else if (lower.includes("child") || lower.includes("baby") || lower.includes("बच्चे") || lower.includes("शिशु")) {
        suggestedSpec = "Pediatrician";
        suggestedSpecHi = "बाल व शिशु रोग विशेषज्ञ (Pediatrician)";
      } else if (lower.includes("preg") || lower.includes("women") || lower.includes("गर्भवती") || lower.includes("महिला")) {
        suggestedSpec = "Gynecologist";
        suggestedSpecHi = "स्त्री एवं प्रसूति रोग विशेषज्ञ (Gynecologist)";
      }

      fallbackReply = isHindi
        ? `आपके लक्षणों (${message}) के आधार पर, हम **${suggestedSpecHi}** से परामर्श की सिफारिश करते हैं। आप किस प्रकार के डॉक्टर को दिखाना चाहते हैं? नीचे से चुनें:`
        : `Based on your symptoms (${message}), we recommend consulting a **${suggestedSpec}**. Which type of specialist doctor would you like to consult? Please select below:`;
      fallbackNextStep = "SPECIALTY_CHOICE";
      widgetType = "specialty_selector";
    } else if (currentStep === "SPECIALTY_CHOICE") {
      fallbackReply = isHindi
        ? `विशेषज्ञता चुन ली गई है (${message})। दिल्ली-एनसीआर में आप किस अस्पताल में जाना चाहते हैं? आप निकटतम अस्पताल खोजने के लिए जीपीएस का भी उपयोग कर सकते हैं:`
        : `Specialty noted (${message}). Which Delhi-NCR hospital facility would you like to visit? You can also use GPS to find the closest hospital:`;
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
        ? `डॉक्टर चुन लिए गए हैं। ओपीडी अपॉइंटमेंट अगले 72 घंटों (3 दिन) के लिए उपलब्ध हैं। कृपया अपना पसंदीदा दिन व समय चुनें:`
        : `Doctor selected. OPD appointments are open for the next 72 hours (3 days). Please select your preferred day and time slot:`;
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
