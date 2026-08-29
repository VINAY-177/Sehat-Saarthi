"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { 
  ShieldCheck, Baby, HeartPulse, Users, Accessibility, 
  Briefcase, IndianRupee, Sparkles, Building2,
  CheckCircle2, AlertCircle, FileCheck, Search, ExternalLink
} from "lucide-react";
import { SchemeResult } from "@/lib/types";
import { useStore } from "@/lib/store";
import { MASTER_HEALTHCARE_SCHEMES_110, GovtScheme } from "@/lib/schemes-dataset";

const CATEGORY_FILTERS = [
  { id: "ALL", label: "All Schemes (110)", labelHi: "सभी 110 योजनाएं" },
  { id: "DELHI_FLAGSHIP", label: "Delhi Flagship (20+)", labelHi: "दिल्ली सरकार प्रमुख योजनाएं" },
  { id: "NATIONAL", label: "National & PM-JAY", labelHi: "राष्ट्रीय एवं आयुष्मान भारत" },
  { id: "MATERNAL", label: "Maternal & Pregnancy", labelHi: "मातृत्व एवं गर्भावस्था" },
  { id: "CHILD_HEALTH", label: "Child & Newborn", labelHi: "शिशु एवं बाल स्वास्थ्य" },
  { id: "COMMUNICABLE_DISEASE", label: "TB, Dengue & Infections", labelHi: "टीबी, संक्रमण व संचारी रोग" },
  { id: "CHRONIC_CARE", label: "NCD, Eye & Chronic", labelHi: "बीपी, शुगर, नेत्र व डायलिसिस" },
  { id: "CRITICAL_CARE", label: "Cancer, Trauma & Organ", labelHi: "कैंसर, ट्रॉमा व अंग प्रत्यारोपण" },
  { id: "DISABILITY", label: "Disability & Rehab", labelHi: "दिव्यांगजन पुनर्वास" },
  { id: "ELDERLY_CARE", label: "Elderly & Geriatric", labelHi: "वरिष्ठ नागरिक देखभाल" },
  { id: "STATE_SCHEME", label: "State Health Covers", labelHi: "अन्य राज्य स्वास्थ्य योजनाएं" },
] as const;

export default function SchemesPage() {
  const { t, language } = useStore();
  const isHindi = language === "hi";

  const [incomeCategory, setIncomeCategory] = useState<string>("BPL");
  const [occupationCategory, setOccupationCategory] = useState<string>("UNORGANIZED");
  const [age, setAge] = useState<number | "">(45);
  const [gender, setGender] = useState<string>("Male");
  const [stateName, setStateName] = useState<string>("Delhi");
  const [hasDisability, setHasDisability] = useState<boolean>(false);
  const [isPregnant, setIsPregnant] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [results, setResults] = useState<SchemeResult[] | null>(null);

  // Multi-Factor Clinical & Social Rule Engine across 110+ Schemes
  const checkEligibility = useCallback(() => {
    const evaluatedResults: SchemeResult[] = [];
    const numAge = typeof age === "number" ? age : 40;

    MASTER_HEALTHCARE_SCHEMES_110.forEach((scheme: GovtScheme) => {
      let isEligible = false;
      let matchScore = 0;
      const reasons: string[] = [];

      // State matching check
      const isDelhi = stateName.toLowerCase().includes("delhi");
      const isStateMatch = scheme.stateApplicable === "ALL" || scheme.stateApplicable.toLowerCase() === stateName.toLowerCase() || (isDelhi && scheme.stateApplicable === "Delhi");

      // 1. Delhi Flagship Healthcare Schemes
      if (scheme.category === "DELHI_FLAGSHIP") {
        if (isDelhi) {
          isEligible = true;
          matchScore += 45;
          reasons.push(isHindi 
            ? "निवास मिलान: दिल्ली निवासी के रूप में आप दिल्ली सरकार की स्वास्थ्य योजनाओं के पात्र हैं।" 
            : "Residency Match: Eligible as a Delhi resident under Delhi Healthcare initiatives.");
          
          if (scheme.id === "sch-dan" && (incomeCategory === "BPL" || incomeCategory === "EWS")) {
            matchScore += 35;
            reasons.push(isHindi ? "बीपीएल/ईडब्ल्यूएस दिल्ली आरोग्य निधि (₹1.5 लाख) हेतु पूर्ण पात्र।" : "BPL/EWS eligible for Delhi Arogya Nidhi direct aid.");
          }
          if (scheme.id === "sch-dak" || scheme.id === "sch-dfss" || scheme.id === "sch-diag" || scheme.id === "sch-mohalla") {
            matchScore += 35;
            reasons.push(isHindi ? "दिल्ली अस्पताल एवं मोहल्ला क्लिनिक नेटवर्क के तहत 100% कैशलेस सेवाएं उपलब्ध।" : "100% cashless diagnostics, surgery, and consultations across Delhi network.");
          }
        } else {
          // Non-Delhi
          if (scheme.id === "sch-farishte") {
            isEligible = true;
            matchScore = 80;
            reasons.push(isHindi ? "फ़रिश्ते योजना दिल्ली में किसी भी व्यक्ति के दुर्घटनाग्रस्त होने पर लागू होती है।" : "Farishte Dilli Ke covers any person injured within Delhi territory.");
          }
        }
      }

      // 2. National Schemes & Ayushman Bharat PM-JAY
      if (scheme.id === "sch-pmjay") {
        if (incomeCategory === "BPL" || incomeCategory === "EWS" || occupationCategory === "UNORGANIZED" || occupationCategory === "FARMER" || occupationCategory === "UNEMPLOYED") {
          isEligible = true;
          matchScore += 85;
          reasons.push(isHindi 
            ? "आय एवं सामाजिक श्रेणी मिलान: ₹5 लाख कैशलेस आयुष्मान भारत कार्ड हेतु पात्र।" 
            : "Socio-economic criteria met for ₹5 Lakh PM-JAY Ayushman Card.");
        }
      }

      if (scheme.id === "sch-pmjay-senior" && numAge >= 70) {
        isEligible = true;
        matchScore = 95;
        reasons.push(isHindi 
          ? "आयु मिलान: 70 वर्ष से अधिक आयु के वरिष्ठ नागरिकों के लिए ₹5 लाख का अलग से आयुष्मान कवर।" 
          : "Age Match: Senior citizens aged 70+ receive dedicated ₹5L Ayushman health cover.");
      }

      // 3. Occupation-Specific Rules
      if (occupationCategory === "UNORGANIZED") {
        if (scheme.category === "UNORGANIZED_WORKER" || scheme.id === "sch-eshram" || scheme.id === "sch-pm-svanidhi" || scheme.id === "sch-pm-vishwakarma") {
          isEligible = true;
          matchScore += 50;
          reasons.push(isHindi 
            ? "व्यवसाय मिलान: असंगठित श्रमिक स्वास्थ्य एवं दुर्घटना सुरक्षा शील्ड के पात्र हैं।" 
            : "Occupation match: Unorganized sector workers qualify for worker health shields.");
        }
      } else if (occupationCategory === "FARMER") {
        if (scheme.category === "FARMER" || scheme.id === "sch-kisan") {
          isEligible = true;
          matchScore += 50;
          reasons.push(isHindi 
            ? "व्यवसाय मिलान: किसान एवं कृषि श्रमिक पीएम-किसान स्वास्थ्य लाभों के पात्र हैं।" 
            : "Occupation match: Farmers qualify for PM-KISAN health and trauma benefits.");
        }
      } else if (occupationCategory === "GOVERNMENT") {
        if (scheme.category === "GOVERNMENT" || scheme.id === "sch-cghs" || scheme.id === "sch-echs") {
          isEligible = true;
          matchScore += 55;
          reasons.push(isHindi 
            ? "व्यवसाय मिलान: सेवारत व सेवानिवृत्त सरकारी कर्मचारी सीजीएचएस के पात्र हैं।" 
            : "Direct match: Government employees and pensioners are eligible for CGHS.");
        }
      } else if (occupationCategory === "SALARIED") {
        if (scheme.category === "SALARIED" || scheme.id === "sch-esic") {
          isEligible = true;
          matchScore += 50;
          reasons.push(isHindi 
            ? "व्यवसाय मिलान: संगठित क्षेत्र के वेतनभोगी कर्मचारी ईएसआईसी के पात्र हैं।" 
            : "Direct match: Organized salaried employees qualify for ESIC hospital network.");
        }
      }

      // 4. Maternal & Pregnancy Rules
      if (isPregnant) {
        if (scheme.category === "MATERNAL" || scheme.id === "sch-pmmvy" || scheme.id === "sch-jsy" || scheme.id === "sch-jssk" || scheme.id === "sch-suman" || scheme.id === "sch-pmsma") {
          isEligible = true;
          matchScore += 55;
          reasons.push(isHindi 
            ? "मातृत्व लाभ: गर्भवती महिलाओं हेतु नकद प्रोत्साहन, मुफ्त पोषण व शत-प्रतिशत कैशलेस प्रसव।" 
            : "Maternal Benefit: Pregnant women receive DBT cash incentives & zero-expense delivery.");
        }
      }

      // 5. Disability Specific Rules
      if (hasDisability) {
        if (scheme.category === "DISABILITY" || scheme.id === "sch-niramaya" || scheme.id === "sch-swavlamban-pwd" || scheme.id === "sch-adip" || scheme.id === "sch-ddrs") {
          isEligible = true;
          matchScore += 55;
          reasons.push(isHindi 
            ? "दिव्यांगता लाभ: विशेष स्वास्थ्य बीमा, मुफ्त सहायक उपकरण और पुनर्वास सेवाएं।" 
            : "Disability Coverage: Comprehensive health insurance, free aids, and rehab services.");
        }
      }

      // 6. Senior Citizen Rules (60+ Years)
      if (numAge >= 60) {
        if (scheme.category === "ELDERLY_CARE" || scheme.id === "sch-nphce-elderly" || scheme.id === "sch-rashtriya-vayoshri" || scheme.id === "sch-delhi-elderly") {
          isEligible = true;
          matchScore += 50;
          reasons.push(isHindi 
            ? "वरिष्ठ नागरिक लाभ: समर्पित जेरियाट्रिक वार्ड, मुफ्त उपकरण व प्राथमिकता स्वास्थ्य देखभाल।" 
            : "Geriatric Benefit: Senior citizen OPD priority, free assistive aids & home care.");
        }
      }

      // 7. Child & Pediatric Health Rules (0-18 Years)
      if (numAge <= 18) {
        if (scheme.category === "CHILD_HEALTH" || scheme.id === "sch-rbsk" || scheme.id === "sch-mission-indradhanush" || scheme.id === "sch-poshan" || scheme.id === "sch-delhi-school") {
          isEligible = true;
          matchScore += 50;
          reasons.push(isHindi 
            ? "बाल स्वास्थ्य: मुफ्त टीकाकरण, 4D स्क्रीनिंग व जन्मजात विकृति सर्जरी।" 
            : "Pediatric Health: Free universal immunization, 4D screening & corrective surgeries.");
        }
      }

      // 8. Universal Communicable Disease & Chronic Health Programs
      if (scheme.category === "COMMUNICABLE_DISEASE" || scheme.category === "CHRONIC_CARE" || scheme.category === "COMMUNITY_HEALTH" || scheme.category === "DIGITAL_HEALTH" || scheme.id === "sch-jan-aushadhi" || scheme.id === "sch-emergency-108" || scheme.id === "sch-abdm" || scheme.id === "sch-ab-hwc") {
        isEligible = true;
        matchScore += 40;
        reasons.push(isHindi 
          ? "सार्वभौमिक राष्ट्रीय स्वास्थ्य मिशन: सभी नागरिकों के लिए मुफ्त प्राथमिक जांच व दवाएं।" 
          : "Universal Health Mission: Free primary diagnosis, essential generics & emergency services.");
      }

      // 9. Super-specialty & Critical Illness Programs
      if (scheme.category === "CRITICAL_CARE" || scheme.category === "CANCER_CARE") {
        if (incomeCategory === "BPL" || incomeCategory === "EWS") {
          isEligible = true;
          matchScore += 45;
          reasons.push(isHindi 
            ? "गंभीर बीमारी सहायता: बीपीएल/ईडब्ल्यूएस मरीजों हेतु ₹15 लाख तक का सरकारी अनुदान।" 
            : "Critical Care Grant: BPL/EWS eligible for up to ₹15L super-specialty grant.");
        } else {
          isEligible = true;
          matchScore += 30;
          reasons.push(isHindi 
            ? "मूल्य नियंत्रण व रियायती पैकेज: सभी नागरिकों के लिए रियायती प्रत्यारोपण व स्टेंट दरें।" 
            : "Statutory Price Cap: Capped rates for implants, dialysis & emergency thrombolysis.");
        }
      }

      // 10. State Specific Scheme Rules
      if (scheme.category === "STATE_SCHEME") {
        if (scheme.stateApplicable.toLowerCase() === stateName.toLowerCase()) {
          isEligible = true;
          matchScore += 60;
          reasons.push(isHindi 
            ? `राज्य योजना मिलान: ${stateName} के निवासियों के लिए राज्य-स्तरीय स्वास्थ्य कवर।` 
            : `State Match: Universal state-level health assurance for ${stateName} residents.`);
        }
      }

      // Final qualification mapping
      if (isEligible && isStateMatch) {
        const finalScore = Math.min(98, Math.max(35, matchScore));
        const status = finalScore >= 60 ? "POTENTIALLY_ELIGIBLE" : "NEEDS_VERIFICATION";

        evaluatedResults.push({
          schemeId: scheme.id,
          schemeName: isHindi ? (scheme.schemeNameHi || scheme.schemeName) : scheme.schemeName,
          status: status,
          matchScore: finalScore,
          reasons: reasons.length > 0 ? reasons : [isHindi ? "राष्ट्रीय स्वास्थ्य सुरक्षा मानदंड पूर्ण।" : "Standard national health assurance criteria met."],
          coverageAmount: isHindi ? (scheme.coverageAmountHi || scheme.coverageAmount) : scheme.coverageAmount,
          applicationUrl: scheme.officialLink,
          description: isHindi ? (scheme.descriptionHi || scheme.description) : scheme.description,
          eligibilityCriteria: isHindi ? (scheme.eligibilityHi || scheme.eligibility) : scheme.eligibility,
        });
      }
    });

    // Sort by match score descending
    evaluatedResults.sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));
    setResults(evaluatedResults);
  }, [age, incomeCategory, occupationCategory, stateName, isPregnant, hasDisability, isHindi]);

  // Run initial evaluation on demographic change
  useEffect(() => {
    checkEligibility();
  }, [checkEligibility]);

  // Filter results by search query and category
  const displayedSchemes = useMemo(() => {
    if (!results) return [];

    return results.filter((res) => {
      // Find raw scheme for category check
      const rawScheme = MASTER_HEALTHCARE_SCHEMES_110.find((s) => s.id === res.schemeId);
      if (selectedCategory !== "ALL" && rawScheme && rawScheme.category !== selectedCategory) {
        return false;
      }

      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase().trim();
      const name = res.schemeName.toLowerCase();
      const desc = (res.description || "").toLowerCase();
      const crit = (res.eligibilityCriteria || "").toLowerCase();
      const cov = (res.coverageAmount || "").toLowerCase();

      return name.includes(q) || desc.includes(q) || crit.includes(q) || cov.includes(q);
    });
  }, [results, selectedCategory, searchQuery]);

  const getSchemeIcon = (name: string) => {
    if (name.includes("Maternal") || name.includes("Matru") || name.includes("JSY") || name.includes("मातृ")) return <Baby className="h-6 w-6 text-pink-500" />;
    if (name.includes("Elderly") || name.includes("NPHCE") || name.includes("वृद्ध") || name.includes("Vayoshri")) return <Users className="h-6 w-6 text-purple-600" />;
    if (name.includes("Disability") || name.includes("Niramaya") || name.includes("दिव्यांग") || name.includes("ADIP")) return <Accessibility className="h-6 w-6 text-blue-600" />;
    if (name.includes("Farmer") || name.includes("KISAN") || name.includes("किसान")) return <HeartPulse className="h-6 w-6 text-emerald-600" />;
    if (name.includes("Shram") || name.includes("Worker") || name.includes("श्रम") || name.includes("Vishwakarma")) return <Briefcase className="h-6 w-6 text-amber-600" />;
    if (name.includes("Government") || name.includes("CGHS") || name.includes("ECHS") || name.includes("केंद्रीय")) return <Building2 className="h-6 w-6 text-indigo-600" />;
    if (name.includes("Delhi") || name.includes("DAK") || name.includes("Farishte") || name.includes("Mohalla") || name.includes("दिल्ली")) return <Building2 className="h-6 w-6 text-teal-600" />;
    return <ShieldCheck className="h-6 w-6 text-teal-600" />;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "POTENTIALLY_ELIGIBLE":
        return (
          <Badge className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs gap-1 py-0.5">
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
    <div className="max-w-6xl mx-auto space-y-6 pb-20 page-enter">
      {/* Page Header */}
      <div className="glass-card-auth p-6 sm:p-7 rounded-[28px] border border-white/80 shadow-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/92 backdrop-blur-2xl section-enter">
        <div className="flex items-center gap-4">
          <div className="p-3.5 bg-gradient-to-br from-teal-500 to-emerald-600 text-white rounded-2xl shadow-md shadow-teal-500/20 shrink-0">
            <ShieldCheck className="h-7 w-7" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">{t("govSchemes")}</h1>
            <p className="text-xs sm:text-sm text-slate-500 font-semibold mt-1">
              {isHindi
                ? "110+ राष्ट्रीय एवं दिल्ली सरकारी स्वास्थ्य योजनाओं हेतु स्वचालित एआई पात्रता मूल्यांकन।"
                : "Automated AI rule engine evaluating eligibility across 110+ national, Delhi Government, and state healthcare programs."}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-emerald-100/80 text-emerald-800 border-emerald-300 font-extrabold px-3.5 py-1 text-xs gap-1.5 shadow-2xs">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            {isHindi ? `${MASTER_HEALTHCARE_SCHEMES_110.length} योजनाएं सक्रिय` : `${MASTER_HEALTHCARE_SCHEMES_110.length} Schemes Synced`}
          </Badge>
        </div>
      </div>

      {/* Citizen Demographic & Occupation Profile Input Card */}
      <div className="glass-panel border border-white/80 shadow-2xl rounded-[28px] overflow-hidden bg-white/92 backdrop-blur-2xl">
        <div className="bg-slate-50/80 border-b border-slate-200/80 p-6">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-teal-600" />
            <h2 className="text-base font-black text-slate-900">
              {isHindi ? "नागरिक जनसांख्यिकी एवं व्यवसाय प्रोफ़ाइल" : "Citizen Demographic & Household Profile"}
            </h2>
          </div>
          <p className="text-xs text-slate-500 font-semibold mt-1">
            {isHindi
              ? "पात्रता नियमों का मूल्यांकन करने के लिए अपनी सामाजिक-आर्थिक श्रेणी, व्यवसाय और राज्य का चयन करें।"
              : "Select your socio-economic category, occupation, and state to run automated qualification rules."}
          </p>
        </div>
        
        <div className="space-y-6 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* 1. Occupation Category Dropdown */}
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

            {/* 2. Income Category Dropdown */}
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
                  <SelectItem value="BPL">BPL (Below Poverty Line / अंत्योदय)</SelectItem>
                  <SelectItem value="EWS">EWS (Economically Weaker / वार्षिक आय &lt; ₹3 लाख)</SelectItem>
                  <SelectItem value="LIG">LIG (Low Income / वार्षिक आय ₹3-6 लाख)</SelectItem>
                  <SelectItem value="MIG_HIG">MIG / HIG (मध्यम एवं उच्च आय वर्ग)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 3. Age Input */}
            <div className="space-y-2">
              <Label htmlFor="age" className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-teal-600" />
                {isHindi ? "आयु (वर्ष)" : "Age (Years)"} *
              </Label>
              <Input 
                id="age"
                type="number"
                min="0"
                max="120"
                value={age}
                onChange={(e) => setAge(e.target.value === "" ? "" : parseInt(e.target.value))}
                className="h-11 rounded-xl border-slate-200 focus-visible:ring-teal-500 bg-slate-50/50 font-medium text-xs"
              />
            </div>

            {/* 4. Gender Select */}
            <div className="space-y-2">
              <Label htmlFor="gender" className="text-xs font-bold text-slate-800">
                {isHindi ? "लिंग" : "Gender"}
              </Label>
              <Select value={gender} onValueChange={(val) => val && setGender(val)}>
                <SelectTrigger id="gender" className="h-11 w-full rounded-xl border-slate-200 focus:ring-teal-500 bg-slate-50/50 font-medium text-xs">
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Male">{isHindi ? "पुरुष" : "Male"}</SelectItem>
                  <SelectItem value="Female">{isHindi ? "महिला" : "Female"}</SelectItem>
                  <SelectItem value="Other">{isHindi ? "अन्य" : "Other"}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 5. State Selector */}
            <div className="space-y-2">
              <Label htmlFor="state" className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-teal-600" />
                {isHindi ? "राज्य" : "State"}
              </Label>
              <Select value={stateName} onValueChange={(val) => val && setStateName(val)}>
                <SelectTrigger id="state" className="h-11 w-full rounded-xl border-slate-200 focus:ring-teal-500 bg-slate-50/50 font-medium text-xs">
                  <SelectValue placeholder="Select state" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Delhi">Delhi NCT (दिल्ली)</SelectItem>
                  <SelectItem value="Uttar Pradesh">Uttar Pradesh (Noida/Ghaziabad/UP)</SelectItem>
                  <SelectItem value="Haryana">Haryana (Gurugram/Faridabad/HR)</SelectItem>
                  <SelectItem value="Rajasthan">Rajasthan</SelectItem>
                  <SelectItem value="Maharashtra">Maharashtra</SelectItem>
                  <SelectItem value="Tamil Nadu">Tamil Nadu</SelectItem>
                  <SelectItem value="Karnataka">Karnataka</SelectItem>
                  <SelectItem value="West Bengal">West Bengal</SelectItem>
                  <SelectItem value="Bihar">Bihar</SelectItem>
                  <SelectItem value="Odisha">Odisha</SelectItem>
                  <SelectItem value="Kerala">Kerala</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 6. Disability & Pregnancy Checkboxes */}
            <div className="flex flex-col justify-center space-y-3 pt-2">
              <div className="flex items-center space-x-2.5 bg-slate-50/80 p-2.5 rounded-xl border border-slate-200/80">
                <Checkbox 
                  id="disability" 
                  checked={hasDisability} 
                  onCheckedChange={(checked) => setHasDisability(!!checked)} 
                  className="data-[state=checked]:bg-teal-600 data-[state=checked]:border-teal-600"
                />
                <Label htmlFor="disability" className="text-xs font-bold cursor-pointer text-slate-800">
                  {isHindi ? "दिव्यांगजन (PwD)" : "Person with Disability (PwD)"}
                </Label>
              </div>

              {gender === "Female" && (
                <div className="flex items-center space-x-2.5 bg-pink-50/80 p-2.5 rounded-xl border border-pink-200/80">
                  <Checkbox 
                    id="pregnant" 
                    checked={isPregnant} 
                    onCheckedChange={(checked) => setIsPregnant(!!checked)}
                    className="data-[state=checked]:bg-pink-600 data-[state=checked]:border-pink-600" 
                  />
                  <Label htmlFor="pregnant" className="text-xs font-bold cursor-pointer text-pink-900">
                    {isHindi ? "वर्तमान में गर्भवती" : "Currently Pregnant"}
                  </Label>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>

      {/* Scheme Search & Category Filter Toolbar */}
      <div className="glass-panel p-4 rounded-[24px] border border-white/80 bg-white/92 backdrop-blur-2xl shadow-xl space-y-3">
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
            <Input
              placeholder={isHindi ? "योजना का नाम, बीमारी, लाभ या कवरेज खोजें (उदा. DAK, सर्जरी, कैंसर, डायलिसिस, PM-JAY)..." : "Search 110+ schemes by name, condition, or benefit (e.g. DAK, Surgery, Cancer, Dialysis, PM-JAY)..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-11 text-xs rounded-xl bg-white border-slate-200 font-semibold focus-visible:ring-teal-500"
            />
          </div>
          <div className="w-full sm:w-72 shrink-0">
            <Select value={selectedCategory} onValueChange={(val) => val && setSelectedCategory(val)}>
              <SelectTrigger className="h-11 text-xs rounded-xl border-slate-200 bg-white font-semibold focus:ring-teal-500">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORY_FILTERS.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id} className="text-xs font-medium">
                    {isHindi ? cat.labelHi : cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Quick Category Chips */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
          {CATEGORY_FILTERS.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`h-7 px-3 text-[11px] font-bold rounded-lg whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? "bg-teal-700 text-white shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200/80"
              }`}
            >
              {isHindi ? cat.labelHi : cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Evaluated Scheme Results List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <FileCheck className="w-4 h-4 text-teal-600" />
            {isHindi ? "पात्रता परिणाम एवं योजना सूची" : "Evaluated Schemes & Benefit Programs"}
          </h3>
          <span className="text-xs text-slate-500 font-bold">
            {displayedSchemes.length} {isHindi ? "योजनाएं प्रदर्शित" : "Schemes Shown"} (Total 110 Synced)
          </span>
        </div>

        {displayedSchemes.length === 0 ? (
          <div className="glass-panel p-12 text-center rounded-[28px] bg-white/90 border border-white/80">
            <ShieldCheck className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h4 className="text-base font-bold text-slate-800">
              {isHindi ? "कोई योजना नहीं मिली" : "No Schemes Match Your Active Search / Category"}
            </h4>
            <p className="text-xs text-slate-500 font-medium mt-1">
              {isHindi ? "कृपया अपनी खोज या श्रेणी फ़िल्टर को बदलकर देखें।" : "Try clearing the search query or selecting 'All Schemes' category."}
            </p>
          </div>
        ) : (
          displayedSchemes.map((res) => (
            <div 
              key={res.schemeId || res.schemeName}
              className="glass-panel group hover:shadow-2xl transition-all duration-300 rounded-[28px] border border-white/80 bg-white/92 backdrop-blur-2xl p-6 relative overflow-hidden"
            >
              <div className="absolute top-0 bottom-0 left-0 w-1.5 bg-gradient-to-b from-teal-500 to-emerald-600" />
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                
                <div className="space-y-3 flex-1 pl-1">
                  <div className="flex items-start gap-3">
                    <div className="p-2.5 rounded-xl bg-teal-50/80 border border-teal-100 shrink-0 mt-0.5">
                      {getSchemeIcon(res.schemeName)}
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <h4 className="text-base sm:text-lg font-black text-slate-900 group-hover:text-teal-700 transition-colors">
                          {res.schemeName}
                        </h4>
                        {getStatusBadge(res.status)}
                      </div>
                      <p className="text-xs text-slate-600 font-medium leading-relaxed">
                        {res.description}
                      </p>
                    </div>
                  </div>

                  {/* Coverage Amount Banner */}
                  <div className="bg-slate-50/90 rounded-xl p-3 border border-slate-200/70 flex flex-wrap items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-700">{isHindi ? "कवरेज एवं सहायता राशि:" : "Coverage & Benefits:"}</span>
                      <span className="font-extrabold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                        {res.coverageAmount}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 font-semibold">
                      {isHindi ? "पात्रता स्कोर:" : "AI Match Score:"} <strong className="text-teal-700 font-black">{res.matchScore || 75}%</strong>
                    </div>
                  </div>

                  {/* Qualification Reasons */}
                  {res.reasons && res.reasons.length > 0 && (
                    <div className="space-y-1 text-xs">
                      <span className="font-bold text-slate-700">{isHindi ? "पात्रता एवं मिलान कारण:" : "Eligibility Reasons:"}</span>
                      <ul className="list-disc pl-4 space-y-0.5 text-slate-600 text-[11px] font-medium">
                        {res.reasons.map((reason: string, idx: number) => (
                          <li key={idx}>{reason}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Criteria Note */}
                  {res.eligibilityCriteria && (
                    <p className="text-[11px] text-slate-500 font-medium italic">
                      <strong>{isHindi ? "आवश्यक दस्तावेज / मापदंड:" : "Criteria & Documents:"}</strong> {res.eligibilityCriteria}
                    </p>
                  )}
                </div>

                {/* Right Action */}
                <div className="shrink-0 flex md:flex-col items-center md:items-end justify-between md:justify-start gap-2 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
                  <a 
                    href={res.applicationUrl || res.officialLink || "#"} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto"
                  >
                    <button type="button" className="btn-3d-primary h-9 px-4 rounded-xl text-xs font-bold gap-1.5 w-full">
                      <span>{isHindi ? "आधिकारिक पोर्टल" : "Apply / Portal"}</span>
                      <ExternalLink className="w-3.5 h-3.5 inline" />
                    </button>
                  </a>
                </div>

              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
