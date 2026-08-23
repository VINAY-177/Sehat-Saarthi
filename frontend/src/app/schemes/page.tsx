"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { 
  ShieldCheck, Baby, HeartPulse, Users, Accessibility, 
  ArrowRight, Briefcase, IndianRupee, Sparkles, Building2,
  CheckCircle2, AlertCircle, FileCheck
} from "lucide-react";
import { SchemeResult } from "@/lib/types";
import { useStore } from "@/lib/store";

interface GovtScheme {
  id: string;
  schemeName: string;
  category: string;
  description: string;
  eligibility: string;
  coverageAmount: string;
  officialLink: string;
  stateApplicable: string;
}

export default function SchemesPage() {
  const { t, language } = useStore();
  const [incomeCategory, setIncomeCategory] = useState<string>("BPL");
  const [occupationCategory, setOccupationCategory] = useState<string>("UNORGANIZED");
  const [age, setAge] = useState<number | "">(45);
  const [gender, setGender] = useState<string>("Male");
  const [stateName, setStateName] = useState<string>("Delhi");
  const [hasDisability, setHasDisability] = useState<boolean>(false);
  const [isPregnant, setIsPregnant] = useState<boolean>(false);
  const [results, setResults] = useState<SchemeResult[] | null>(null);

  // Multi-Factor Clinical & Social Rule Engine
  const checkEligibility = useCallback(() => {
    const isHindi = language === "hi";

    const schemesList: GovtScheme[] = [
      {
        id: "sch-pmjay",
        schemeName: isHindi ? "आयुष्मान भारत पीएम-जय (राष्ट्रीय स्वास्थ्य सुरक्षा)" : "Ayushman Bharat PM-JAY (National Health Cover)",
        category: "NATIONAL",
        description: isHindi 
          ? "28,000+ सूचीबद्ध अस्पतालों में द्वितीयक और तृतीयक अस्पताल में भर्ती के लिए ₹5 लाख प्रति परिवार निःशुल्क स्वास्थ्य सुरक्षा।"
          : "World’s largest government health assurance scheme offering cashless secondary and tertiary hospitalization across 28,000+ empanelled hospitals.",
        eligibility: isHindi
          ? "बीपीएल / ईडब्ल्यूएस परिवार, असंगठित क्षेत्र के श्रमिक, और ग्रामीण भूमिहीन किसान।"
          : "BPL / EWS households, unorganized sector workers, rural families with deprivation criteria, and landless agricultural workers under SECC database.",
        coverageAmount: "₹5,00,000 per family / year",
        officialLink: "https://pmjay.gov.in",
        stateApplicable: "ALL",
      },
      {
        id: "sch-eshram",
        schemeName: isHindi ? "ई-श्रम एवं पीएम श्रम योगी स्वास्थ्य शील्ड" : "e-Shram & PM Shram Yogi Health Shield",
        category: "UNORGANIZED_WORKER",
        description: isHindi
          ? "असंगठित क्षेत्र के श्रमिकों, निर्माण मजदूरों और गिग कामगारों के लिए दुर्घटना स्वास्थ्य बीमा एवं सामाजिक सुरक्षा।"
          : "Accidental hospitalization, critical trauma insurance, and integrated social security benefits for informal and unorganized sector workers.",
        eligibility: isHindi
          ? "18-59 वर्ष के असंगठित श्रमिक जिनकी मासिक आय ₹15,000 से कम हो।"
          : "Unorganized sector workers, construction laborers, street vendors, delivery partners, and domestic workers aged 18-59 with monthly income < ₹15,000.",
        coverageAmount: "₹2,00,000 accidental cover + cashless hospital network",
        officialLink: "https://eshram.gov.in",
        stateApplicable: "ALL",
      },
      {
        id: "sch-kisan",
        schemeName: isHindi ? "पीएम-किसान स्वास्थ्य एवं सामाजिक सुरक्षा शील्ड" : "PM-KISAN Health & Social Security Shield",
        category: "FARMER",
        description: isHindi
          ? "कृषि समुदाय और छोटे किसानों के लिए रियायती ग्रामीण स्वास्थ्य सुरक्षा एवं आपातकालीन सहायता।"
          : "Subsidized rural health assurance, critical illness support, and emergency clinical assistance tailored for the agricultural community.",
        eligibility: isHindi
          ? "2 हेक्टेयर तक खेती योग्य भूमि वाले छोटे और सीमांत किसान / कृषि श्रमिक।"
          : "Small and marginal farmers / agricultural laborers owning up to 2 hectares of cultivable land and rural farming families.",
        coverageAmount: "₹3,00,000 rural health coverage & diagnostic subsidies",
        officialLink: "https://pmkisan.gov.in",
        stateApplicable: "ALL",
      },
      {
        id: "sch-cghs",
        schemeName: isHindi ? "केंद्रीय सरकार स्वास्थ्य योजना (CGHS)" : "Central Government Health Scheme (CGHS)",
        category: "GOVERNMENT",
        description: isHindi
          ? "सरकारी कर्मचारियों और पेंशनभोगियों के लिए 100% कैशलेस ओपीडी, आईपीडी और विशेषज्ञ परामर्श सुविधा।"
          : "Comprehensive medical care facility including OPD, IPD, and specialist consultations across India for government staff and dependents.",
        eligibility: isHindi
          ? "केंद्र एवं राज्य सरकार के सेवारत और सेवानिवृत्त कर्मचारी तथा उनके आश्रित।"
          : "Serving and retired Central / State government employees, Members of Parliament, and accredited government pensioners.",
        coverageAmount: "100% cashless hospitalization & free specialist care",
        officialLink: "https://cghs.nic.in",
        stateApplicable: "ALL",
      },
      {
        id: "sch-esic",
        schemeName: isHindi ? "कर्मचारी राज्य बीमा योजना (ESIC)" : "Employees’ State Insurance Scheme (ESIC)",
        category: "SALARIED",
        description: isHindi
          ? "संगठित क्षेत्र के वेतनभोगी कर्मचारियों और उनके परिवारों के लिए ईएसआईसी औषधालयों एवं अस्पतालों के माध्यम से पूर्ण चिकित्सा सुरक्षा।"
          : "Integrated medical protection, sickness cash benefit, maternity cover, and dependent benefits through ESIC dispensaries and tie-up hospitals.",
        eligibility: isHindi
          ? "₹21,000 तक मासिक वेतन पाने वाले संगठित क्षेत्र के कर्मचारी।"
          : "Organized sector salaried / corporate employees in factories and establishments with monthly wages up to ₹21,000 (₹25,000 for persons with disability).",
        coverageAmount: "Full medical cover for employee and dependent family members",
        officialLink: "https://esic.gov.in",
        stateApplicable: "ALL",
      },
      {
        id: "sch-pmmvy",
        schemeName: isHindi ? "प्रधानमंत्री मातृ वंदना योजना (PMMVY & JSY)" : "Pradhan Mantri Matru Vandana Yojana (PMMVY & JSY)",
        category: "MATERNAL",
        description: isHindi
          ? "गर्भवती महिलाओं के लिए ₹6,000 नकद सहायता + जननी सुरक्षा योजना के तहत 100% निःशुल्क संस्थागत प्रसव एवं जांच।"
          : "Maternity benefit cash incentive for first/second living child plus 100% free antenatal checkups and institutional delivery under Janani Suraksha Yojana.",
        eligibility: isHindi
          ? "गर्भवती महिलाएं एवं स्तनपान कराने वाली माताएं।"
          : "Pregnant women and lactating mothers for institutional delivery in public and accredited private health centres.",
        coverageAmount: "₹6,000 direct cash assistance + free delivery and neonatal care",
        officialLink: "https://pmmvy.wcd.gov.in",
        stateApplicable: "ALL",
      },
      {
        id: "sch-nphce",
        schemeName: isHindi ? "राष्ट्रीय वृद्धजन स्वास्थ्य देखभाल कार्यक्रम (NPHCE)" : "National Programme for Health Care of the Elderly (NPHCE)",
        category: "SENIOR",
        description: isHindi
          ? "वरिष्ठ नागरिकों के लिए समर्पित जेरियाट्रिक ओपीडी, निःशुल्क सहायक उपकरण (श्रवण यंत्र, चश्मा, व्हीलचेयर) एवं दवाएं।"
          : "Specialized geriatric healthcare services, weekly dedicated elderly OPDs, chronic disease management, and free assistive devices.",
        eligibility: isHindi
          ? "60 वर्ष या उससे अधिक आयु के वरिष्ठ नागरिक।"
          : "Senior citizens aged 60 years and above across India.",
        coverageAmount: "Free geriatric diagnostics, specialized OPD, and assistive aids",
        officialLink: "https://main.mohfw.gov.in",
        stateApplicable: "ALL",
      },
      {
        id: "sch-niramaya",
        schemeName: isHindi ? "निरामया स्वास्थ्य बीमा योजना (दिव्यांगजन)" : "Niramaya Health Insurance for Divyangjan",
        category: "DISABILITY",
        description: isHindi
          ? "दिव्यांग व्यक्तियों के लिए ₹1 लाख तक का किफायती स्वास्थ्य बीमा (ओपीडी, फिजियोथेरेपी, सर्जरी और दवाएं शामिल)।"
          : "Affordable health insurance cover for persons with autism, cerebral palsy, mental retardation, and multiple physical or intellectual disabilities.",
        eligibility: isHindi
          ? "यूडीआईडी (UDID) कार्ड धारक या प्रमाणित दिव्यांग नागरिक।"
          : "Citizens with certified benchmark disabilities (possessing valid UDID Card or medical disability certificate).",
        coverageAmount: "₹1,00,000 per annum (includes OPD, therapy, dental & surgery)",
        officialLink: "https://thenationaltrust.gov.in",
        stateApplicable: "ALL",
      },
      {
        id: "sch-dak",
        schemeName: isHindi ? "दिल्ली आरोग्य कोष (DAK) एवं मोहल्ला क्लिनिक" : "Delhi Arogya Kosh (DAK) & Mohalla Health Clinic",
        category: "STATE",
        description: isHindi
          ? "निजी केंद्रों पर निःशुल्क एमआरआई, सीटी स्कैन, पीईटी स्कैन और ₹5 लाख तक की कैशलेस सर्जरी।"
          : "Free high-end radiodiagnostics (MRI, CT Scan, PET Scan) at 30+ top private diagnostic centres plus cashless surgery reimbursement up to ₹5 Lakhs.",
        eligibility: isHindi
          ? "दिल्ली के निवासी जिनकी वार्षिक पारिवारिक आय ₹3 लाख से कम हो, एवं सभी मोहल्ला क्लिनिक लाभार्थी।"
          : "Residents of Delhi/NCR with valid voter ID/Aadhaar and annual family income < ₹3,00,000, plus universal free OPD at all Aam Aadmi Mohalla Clinics.",
        coverageAmount: "₹5,00,000 cashless diagnostic & surgery package",
        officialLink: "https://delhi.gov.in",
        stateApplicable: "Delhi",
      },
      {
        id: "sch-up-mmjay",
        schemeName: isHindi ? "यूपी मुख्यमंत्री जन आरोग्य योजना (MMJAY)" : "UP Mukhyamantri Jan Arogya Yojana (MMJAY)",
        category: "STATE",
        description: isHindi
          ? "उत्तर प्रदेश में अंत्योदय कार्डधारकों और असंगठित कामगारों के लिए ₹5 लाख प्रति परिवार कैशलेस स्वास्थ्य बीमा।"
          : "State health insurance extension for families left out of the SECC list, Antyodaya Anna cardholders, and unorganized rural households in Uttar Pradesh.",
        eligibility: isHindi
          ? "उत्तर प्रदेश के अंत्योदय/बीपीएल कार्डधारक एवं पंजीकृत असंगठित श्रमिक।"
          : "Permanent residents of Uttar Pradesh holding Antyodaya/BPL ration cards or registered under unorganized worker boards.",
        coverageAmount: "₹5,00,000 per family / year cashless cover",
        officialLink: "https://ayushmanup.in",
        stateApplicable: "Uttar Pradesh",
      },
      {
        id: "sch-chiranjeevi",
        schemeName: isHindi ? "मुख्यमंत्री आयुष्मान राजस्थान (चिरंजीवी योजना)" : "Mukhyamantri Ayushman Rajasthan (Chiranjeevi Yojana)",
        category: "STATE",
        description: isHindi
          ? "राजस्थान के सभी परिवारों के लिए ₹25 लाख तक का सार्वभौमिक कैशलेस स्वास्थ्य बीमा।"
          : "Universal cashless health assurance providing comprehensive package cover for general and critical specialty care in Rajasthan.",
        eligibility: isHindi
          ? "राजस्थान के समस्त परिवार (बीपीएल/किसानों के लिए पूर्णतः निःशुल्क)।"
          : "Residents of Rajasthan (100% free for BPL, NFSA, small farmers, contractual workers, and nominal premium for APL families).",
        coverageAmount: "₹25,00,000 universal annual family health cover",
        officialLink: "https://chiranjeevi.rajasthan.gov.in",
        stateApplicable: "Rajasthan",
      },
    ];

    const evaluatedResults: SchemeResult[] = [];
    const numAge = typeof age === "number" ? age : 40;

    schemesList.forEach((scheme) => {
      let isEligible = false;
      let matchScore = 0;
      const reasons: string[] = [];

      // 1. Occupation-Specific Rules
      if (occupationCategory === "UNORGANIZED") {
        if (scheme.category === "UNORGANIZED_WORKER" || scheme.id === "sch-eshram") {
          isEligible = true;
          matchScore += 40;
          reasons.push(isHindi 
            ? "सीधा मिलान: असंगठित क्षेत्र के श्रमिक ई-श्रम स्वास्थ्य शील्ड के पात्र हैं।"
            : "Direct match: Unorganized sector workers qualify for e-Shram health shield.");
        }
        if (scheme.id === "sch-pmjay" && (incomeCategory === "BPL" || incomeCategory === "EWS")) {
          isEligible = true;
          matchScore += 35;
          reasons.push(isHindi
            ? "आय एवं व्यवसाय मानदंड: आयुष्मान भारत कार्ड हेतु पात्र।"
            : "Income & occupation criteria met for PM-JAY Ayushman Bharat card.");
        }
      } else if (occupationCategory === "FARMER") {
        if (scheme.category === "FARMER" || scheme.id === "sch-kisan") {
          isEligible = true;
          matchScore += 40;
          reasons.push(isHindi
            ? "सीधा मिलान: किसान एवं कृषि श्रमिक पीएम-किसान स्वास्थ्य लाभों के पात्र हैं।"
            : "Direct match: Farmers and agricultural workers qualify for PM-KISAN health benefits.");
        }
        if (scheme.id === "sch-pmjay") {
          isEligible = true;
          matchScore += 30;
          reasons.push(isHindi
            ? "ग्रामीण कृषि परिवार एसईसीसी मानदंड के तहत पात्र हैं।"
            : "Rural agricultural households qualify under SECC occupational deprivation.");
        }
      } else if (occupationCategory === "GOVERNMENT") {
        if (scheme.category === "GOVERNMENT" || scheme.id === "sch-cghs") {
          isEligible = true;
          matchScore += 50;
          reasons.push(isHindi
            ? "सीधा मिलान: सरकारी कर्मचारी और पेंशनभोगी सीजीएचएस के पात्र हैं।"
            : "Direct match: Government employees and pensioners are eligible for CGHS.");
        }
      } else if (occupationCategory === "SALARIED") {
        if (scheme.category === "SALARIED" || scheme.id === "sch-esic") {
          isEligible = true;
          matchScore += 45;
          reasons.push(isHindi
            ? "सीधा मिलान: संगठित क्षेत्र के वेतनभोगी कर्मचारी ईएसआईसी के पात्र हैं।"
            : "Direct match: Organized sector salaried employees qualify for ESIC benefits.");
        }
      } else if (occupationCategory === "UNEMPLOYED") {
        if (scheme.id === "sch-pmjay" && (incomeCategory === "BPL" || incomeCategory === "EWS")) {
          isEligible = true;
          matchScore += 40;
          reasons.push(isHindi
            ? "बीपीएल/ईडब्ल्यूएस बेरोजगार नागरिक 100% कैशलेस पीएम-जय के पात्र हैं।"
            : "BPL/EWS unemployed citizens qualify for 100% cashless PM-JAY cover.");
        }
      }

      // 2. Maternal & Antenatal Care Rules
      if (isPregnant) {
        if (scheme.category === "MATERNAL" || scheme.id === "sch-pmmvy") {
          isEligible = true;
          matchScore += 50;
          reasons.push(isHindi
            ? "मातृत्व लाभ: गर्भवती महिलाओं को ₹6,000 नकद प्रोत्साहन एवं निःशुल्क प्रसव।"
            : "Maternal Benefit: Pregnant women receive ₹6,000 cash assistance and free delivery.");
        }
      }

      // 3. Disability Specific Rules
      if (hasDisability) {
        if (scheme.category === "DISABILITY" || scheme.id === "sch-niramaya") {
          isEligible = true;
          matchScore += 50;
          reasons.push(isHindi
            ? "दिव्यांगजन प्रमाण पत्र: निरामया ₹1 लाख व्यापक चिकित्सा सुरक्षा हेतु पात्र।"
            : "Disability Certificate: Eligible for Niramaya ₹1 Lakh comprehensive medical coverage.");
        }
      }

      // 4. Senior Citizen Geriatric Rules
      if (numAge >= 60) {
        if (scheme.category === "SENIOR" || scheme.id === "sch-nphce") {
          isEligible = true;
          matchScore += 40;
          reasons.push(isHindi
            ? "वरिष्ठ नागरिक: एनपीएचसीई के तहत निःशुल्क जेरियाट्रिक ओपीडी एवं सहायक उपकरण।"
            : "Senior Citizen: Free specialized geriatric OPD and assistive devices under NPHCE.");
        }
      }

      // 5. State-Specific Schemes
      if (scheme.stateApplicable === "Delhi" && stateName === "Delhi") {
        isEligible = true;
        matchScore += 30;
        reasons.push(isHindi
          ? "राज्य निवासी: निःशुल्क एमआरआई/सीटी स्कैन एवं मोहल्ला क्लिनिक उपचार।"
          : "State Resident: Eligible for free high-end diagnostics (MRI/CT) and Mohalla Clinic care.");
      } else if (scheme.stateApplicable === "Uttar Pradesh" && stateName === "Uttar Pradesh") {
        if (incomeCategory === "BPL" || incomeCategory === "EWS" || occupationCategory === "UNORGANIZED") {
          isEligible = true;
          matchScore += 35;
          reasons.push(isHindi
            ? "राज्य निवासी: यूपी मुख्यमंत्री जन आरोग्य योजना ₹5 लाख कवर हेतु पात्र।"
            : "State Resident: Eligible for UP Mukhyamantri Jan Arogya Yojana ₹5 Lakh cover.");
        }
      } else if (scheme.stateApplicable === "Rajasthan" && stateName === "Rajasthan") {
        isEligible = true;
        matchScore += 40;
        reasons.push(isHindi
          ? "राज्य निवासी: ₹25 लाख चिरंजीवी स्वास्थ्य सुरक्षा का सार्वभौमिक अधिकार।"
          : "State Resident: Universal entitlement to ₹25 Lakh Chiranjeevi health cover.");
      }

      // Universal National Baseline for BPL / EWS
      if ((incomeCategory === "BPL" || incomeCategory === "EWS") && scheme.id === "sch-pmjay") {
        isEligible = true;
        matchScore += 30;
      }

      // Format final eligibility status
      let status: "POTENTIALLY_ELIGIBLE" | "NEEDS_VERIFICATION" = "NEEDS_VERIFICATION";
      if (isEligible && matchScore >= 30) {
        status = "POTENTIALLY_ELIGIBLE";
      }

      // Construct detailed reason text
      const reasonText = reasons.length > 0
        ? reasons.join(" ")
        : `${scheme.description} Eligibility: ${scheme.eligibility}. Coverage: ${scheme.coverageAmount}.`;

      evaluatedResults.push({
        schemeName: scheme.schemeName,
        status,
        reason: `${reasonText} [Coverage: ${scheme.coverageAmount}]`,
        officialLink: scheme.officialLink,
      });
    });

    // Sort so POTENTIALLY_ELIGIBLE appears at the top
    evaluatedResults.sort((a, b) => {
      if (a.status === "POTENTIALLY_ELIGIBLE" && b.status !== "POTENTIALLY_ELIGIBLE") return -1;
      if (a.status !== "POTENTIALLY_ELIGIBLE" && b.status === "POTENTIALLY_ELIGIBLE") return 1;
      return 0;
    });

    setResults(evaluatedResults);
  }, [age, incomeCategory, occupationCategory, stateName, isPregnant, hasDisability, language]);

  // Run initial check on load & language change
  useEffect(() => {
    checkEligibility();
  }, [checkEligibility]);

  const getSchemeIcon = (name: string) => {
    if (name.includes("Maternal") || name.includes("Matru") || name.includes("JSY") || name.includes("मातृ")) return <Baby className="h-6 w-6 text-pink-500" />;
    if (name.includes("Elderly") || name.includes("NPHCE") || name.includes("वृद्धजन")) return <Users className="h-6 w-6 text-purple-600" />;
    if (name.includes("Disability") || name.includes("Niramaya") || name.includes("दिव्यांग")) return <Accessibility className="h-6 w-6 text-blue-600" />;
    if (name.includes("Farmer") || name.includes("KISAN") || name.includes("किसान")) return <HeartPulse className="h-6 w-6 text-emerald-600" />;
    if (name.includes("Shram") || name.includes("Worker") || name.includes("श्रम")) return <Briefcase className="h-6 w-6 text-amber-600" />;
    if (name.includes("Government") || name.includes("CGHS") || name.includes("केंद्रीय")) return <Building2 className="h-6 w-6 text-indigo-600" />;
    return <ShieldCheck className="h-6 w-6 text-teal-600" />;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "POTENTIALLY_ELIGIBLE":
        return (
          <Badge className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs gap-1 py-0.5">
            <CheckCircle2 className="w-3.5 h-3.5" /> {t("highMatchEligible")}
          </Badge>
        );
      case "NEEDS_VERIFICATION":
        return (
          <Badge variant="secondary" className="bg-amber-100 text-amber-900 border border-amber-200 text-xs font-semibold gap-1 py-0.5">
            <AlertCircle className="w-3.5 h-3.5 text-amber-700" /> {t("documentVerificationNeeded")}
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20 animate-in fade-in duration-300">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200/80 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-br from-teal-600 to-emerald-600 text-white rounded-2xl shadow-sm">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900">{t("govSchemes")}</h1>
            <p className="text-xs text-slate-500 font-medium">
              {language === "hi"
                ? "राष्ट्रीय एवं राज्य-स्तरीय सरकारी स्वास्थ्य योजनाओं हेतु स्वचालित पात्रता मूल्यांकन।"
                : "Automated AI rule engine evaluating eligibility for national and state-specific healthcare assurance programs."}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 font-bold px-3 py-1 text-xs gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            {language === "hi" ? "11 योजनाएं सक्रिय" : "11 Schemes Synced"}
          </Badge>
        </div>
      </div>

      {/* Citizen Demographic & Occupation Profile Input Card */}
      <Card className="border border-slate-200/80 shadow-sm rounded-3xl overflow-hidden bg-white">
        <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-6">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-teal-600" />
            <CardTitle className="text-lg font-bold text-slate-900">
              {language === "hi" ? "नागरिक जनसांख्यिकी एवं व्यवसाय प्रोफ़ाइल" : "Citizen Demographic & Household Profile"}
            </CardTitle>
          </div>
          <CardDescription className="text-xs text-slate-500 font-medium">
            {language === "hi"
              ? "पात्रता नियमों का मूल्यांकन करने के लिए अपनी सामाजिक-आर्थिक श्रेणी, व्यवसाय और राज्य का चयन करें।"
              : "Select your socio-economic category, occupation, and state to run automated qualification rules."}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* 1. Occupation Category Dropdown (Requested by User) */}
            <div className="space-y-2">
              <Label htmlFor="occupation" className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-teal-600" />
                {t("occupationCategory")} *
              </Label>
              <Select value={occupationCategory} onValueChange={(val) => val && setOccupationCategory(val)}>
                <SelectTrigger id="occupation" className="h-11 w-full rounded-xl border-slate-200 focus:ring-teal-500 bg-slate-50/50 font-medium text-xs">
                  <SelectValue placeholder="Select occupation" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="UNORGANIZED">{t("unorganizedWorker")}</SelectItem>
                  <SelectItem value="SALARIED">{t("salariedWorker")}</SelectItem>
                  <SelectItem value="FARMER">{t("farmerWorker")}</SelectItem>
                  <SelectItem value="UNEMPLOYED">{t("unemployedWorker")}</SelectItem>
                  <SelectItem value="GOVERNMENT">{t("govEmployee")}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 2. Income / Socio-Economic Category */}
            <div className="space-y-2">
              <Label htmlFor="income" className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <IndianRupee className="w-3.5 h-3.5 text-teal-600" />
                {t("incomeCategory")} *
              </Label>
              <Select value={incomeCategory} onValueChange={(val) => val && setIncomeCategory(val)}>
                <SelectTrigger id="income" className="h-11 w-full rounded-xl border-slate-200 focus:ring-teal-500 bg-slate-50/50 font-medium text-xs">
                  <SelectValue placeholder="Select income category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="BPL">{language === "hi" ? "बीपीएल (गरीबी रेखा से नीचे / अंत्योदय)" : "BPL (Below Poverty Line / Antyodaya)"}</SelectItem>
                  <SelectItem value="EWS">{language === "hi" ? "ईडब्ल्यूएस (आर्थिक रूप से कमजोर वर्ग < ₹3 लाख)" : "EWS (Economically Weaker Section < ₹3L)"}</SelectItem>
                  <SelectItem value="APL">{language === "hi" ? "एपीएल (गरीबी रेखा से ऊपर / मध्यम आय)" : "APL (Above Poverty Line / Middle Income)"}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 3. Age */}
            <div className="space-y-2">
              <Label htmlFor="age" className="text-xs font-bold text-slate-800">
                {language === "hi" ? "आयु (वर्ष) *" : "Age (Years) *"}
              </Label>
              <Input
                id="age"
                type="number"
                min={0}
                max={120}
                placeholder="e.g. 45"
                value={age}
                onChange={(e) => setAge(e.target.value ? Number(e.target.value) : "")}
                className="h-11 w-full rounded-xl border-slate-200 focus-visible:ring-teal-500 bg-slate-50/50 text-xs font-medium"
              />
            </div>

            {/* 4. Gender */}
            <div className="space-y-2">
              <Label htmlFor="gender" className="text-xs font-bold text-slate-800">
                {language === "hi" ? "लिंग (Gender)" : "Gender"}
              </Label>
              <Select value={gender} onValueChange={(val) => val && setGender(val)}>
                <SelectTrigger id="gender" className="h-11 w-full rounded-xl border-slate-200 focus:ring-teal-500 bg-slate-50/50 font-medium text-xs">
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Male">{language === "hi" ? "पुरुष (Male)" : "Male"}</SelectItem>
                  <SelectItem value="Female">{language === "hi" ? "महिला (Female)" : "Female"}</SelectItem>
                  <SelectItem value="Other">{language === "hi" ? "अन्य (Other)" : "Other"}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 5. State of Residence */}
            <div className="space-y-2">
              <Label htmlFor="state" className="text-xs font-bold text-slate-800">
                {language === "hi" ? "निवास राज्य (State) *" : "State of Residence *"}
              </Label>
              <Select value={stateName} onValueChange={(val) => val && setStateName(val)}>
                <SelectTrigger id="state" className="h-11 w-full rounded-xl border-slate-200 focus:ring-teal-500 bg-slate-50/50 font-medium text-xs">
                  <SelectValue placeholder="Select state" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Delhi">{language === "hi" ? "दिल्ली / एनसीआर" : "Delhi / NCR"}</SelectItem>
                  <SelectItem value="Uttar Pradesh">{language === "hi" ? "उत्तर प्रदेश" : "Uttar Pradesh"}</SelectItem>
                  <SelectItem value="Rajasthan">{language === "hi" ? "राजस्थान" : "Rajasthan"}</SelectItem>
                  <SelectItem value="Bihar">{language === "hi" ? "बिहार" : "Bihar"}</SelectItem>
                  <SelectItem value="Maharashtra">{language === "hi" ? "महाराष्ट्र" : "Maharashtra"}</SelectItem>
                  <SelectItem value="Madhya Pradesh">{language === "hi" ? "मध्य प्रदेश" : "Madhya Pradesh"}</SelectItem>
                  <SelectItem value="Other">{language === "hi" ? "अन्य राज्य एवं केंद्र शासित प्रदेश" : "Other States & UTs"}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Special Entitlement Checkboxes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-100">
            <label className="flex items-center space-x-3 text-xs cursor-pointer p-3.5 rounded-2xl bg-slate-50/70 hover:bg-slate-100/80 transition-colors border border-slate-100">
              <Checkbox
                id="disability"
                checked={hasDisability}
                onCheckedChange={(checked) => setHasDisability(!!checked)}
                className="data-[state=checked]:bg-teal-600 data-[state=checked]:border-teal-600 w-4 h-4 rounded"
              />
              <span className="font-semibold text-slate-800">
                {language === "hi"
                  ? "नागरिक के पास दिव्यांगता प्रमाण पत्र / यूडीआईडी (UDID) कार्ड है"
                  : "Citizen has a recognized disability (Possesses UDID card or benchmark medical certificate)"}
              </span>
            </label>

            <label className="flex items-center space-x-3 text-xs cursor-pointer p-3.5 rounded-2xl bg-slate-50/70 hover:bg-slate-100/80 transition-colors border border-slate-100">
              <Checkbox
                id="pregnancy"
                checked={isPregnant}
                onCheckedChange={(checked) => setIsPregnant(!!checked)}
                className="data-[state=checked]:bg-teal-600 data-[state=checked]:border-teal-600 w-4 h-4 rounded"
              />
              <span className="font-semibold text-slate-800">
                {language === "hi"
                  ? "नागरिक वर्तमान में गर्भवती हैं / प्रसव पूर्व एवं संस्थागत प्रसव सहायता की आवश्यकता है"
                  : "Citizen is currently pregnant / requiring antenatal & institutional delivery assistance"}
              </span>
            </label>
          </div>
        </CardContent>

        <CardFooter className="bg-slate-50/50 p-6 border-t border-slate-100 flex justify-between items-center">
          <Button 
            onClick={checkEligibility} 
            className="w-full h-12 text-sm font-bold bg-teal-600 hover:bg-teal-700 text-white shadow-md rounded-2xl transition-all hover:shadow-lg gap-2"
          >
            <ShieldCheck className="w-4 h-4" />
            {t("evaluateEligibility")}
          </Button>
        </CardFooter>
      </Card>

      {/* Evaluated Scheme Results */}
      {results && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-6 duration-500">
          <div className="flex items-center justify-between px-2">
            <div>
              <h2 className="text-xl font-black text-slate-900">
                {language === "hi" ? "पहचानी गई सरकारी लाभ योजनाएं" : "Identified Government Benefit Programs"} <span className="text-teal-600">({results.length})</span>
              </h2>
              <p className="text-xs text-slate-500">
                {language === "hi"
                  ? `व्यवसाय (${occupationCategory}), आय श्रेणी (${incomeCategory}), आयु (${age || 40}), और राज्य (${stateName}) के आधार पर मूल्यांकित।`
                  : `Matched based on occupation (${occupationCategory}), income tier (${incomeCategory}), age (${age || 40}), and state (${stateName}).`}
              </p>
            </div>
            <Badge variant="outline" className="text-xs bg-teal-50 text-teal-700 border-teal-200 px-3 py-1 font-bold">
              {language === "hi" ? "AI नियम इंजन सक्रिय" : "AI Rule Engine Active"}
            </Badge>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {results.map((res, idx) => (
              <Card 
                key={idx} 
                className={`transition-all duration-300 rounded-3xl overflow-hidden border ${
                  res.status === "POTENTIALLY_ELIGIBLE" 
                    ? "border-emerald-200 bg-white shadow-sm hover:shadow-md hover:border-emerald-300" 
                    : "border-slate-200 bg-slate-50/40"
                }`}
              >
                <CardContent className="p-6 flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
                  <div className="flex items-start gap-4">
                    <div className="p-3.5 bg-slate-50 rounded-2xl shrink-0 shadow-sm border border-slate-100">
                      {getSchemeIcon(res.schemeName)}
                    </div>
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-3">
                        <h3 className="font-extrabold text-base text-slate-900">{res.schemeName}</h3>
                        {getStatusBadge(res.status)}
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed max-w-2xl font-medium">{res.reason}</p>
                    </div>
                  </div>

                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => window.open(res.officialLink, '_blank')} 
                    className="shrink-0 group text-xs h-10 px-4 rounded-xl border-slate-200 hover:bg-slate-50 hover:text-teal-700 font-bold gap-1"
                  >
                    {t("officialPortal")}
                    <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Official Disclaimer */}
          <Card className="bg-amber-50/80 border-amber-200 rounded-3xl shadow-sm">
            <CardContent className="p-5 flex items-start gap-3.5">
              <div className="shrink-0 mt-0.5 text-amber-600">
                <FileCheck className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-amber-950">
                  {language === "hi" ? "आधिकारिक सत्यापन एवं ई-कार्ड जारी करना" : "Official Verification & e-Card Issuance"}
                </h4>
                <p className="text-xs text-amber-900/90 leading-relaxed font-medium">
                  {language === "hi"
                    ? "यह नेविगेटर राष्ट्रीय स्वास्थ्य स्टैक मानकों के अनुसार मार्गदर्शन प्रदान करता है। अंतिम सत्यापन और आयुष्मान गोल्डन कार्ड जारी करने के लिए अपने नजदीकी आयुष्मान आरोग्य मंदिर, सीएससी केंद्र या अस्पताल में बायोमेट्रिक ई-केवाईसी करवाएं।"
                    : "This navigator provides automated rule-based guidance in compliance with National Health Stack standards. Final verification and Ayushman golden card issuance can be completed with biometric Aadhaar e-KYC at any Ayushman Arogya Mandir, CSC Kiosk, or Empanelled Public/Private Hospital."}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
