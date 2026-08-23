"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, Baby, HeartPulse, Users, Accessibility, ArrowRight } from "lucide-react";
import { SchemeResult } from "@/lib/types";

interface GovtScheme {
  id: string;
  schemeName: string;
  description: string;
  eligibility: string;
  coverageAmount: string;
  officialLink: string;
  stateApplicable: string;
}

export default function SchemesPage() {
  const [incomeCategory, setIncomeCategory] = useState<string>("");
  const [age, setAge] = useState<number | "">("");
  const [gender, setGender] = useState<string>("");
  const [stateName, setStateName] = useState<string>("");
  const [hasDisability, setHasDisability] = useState<boolean>(false);
  const [isPregnant, setIsPregnant] = useState<boolean>(false);
  const [results, setResults] = useState<SchemeResult[] | null>(null);

  const [schemesDb, setSchemesDb] = useState<GovtScheme[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5000/api/schemes")
      .then((res) => res.json())
      .then((data) => {
        setSchemesDb(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch schemes", err);
        setLoading(false);
      });
  }, []);

  const checkEligibility = () => {
    const newResults: SchemeResult[] = [];

    schemesDb.forEach((scheme) => {
      // Very basic rule-matching based on the DB records
      let status: "POTENTIALLY_ELIGIBLE" | "NEEDS_VERIFICATION" = "NEEDS_VERIFICATION";
      
      if (scheme.schemeName.includes("PM-JAY")) {
        if (incomeCategory === "BPL" || incomeCategory === "EWS") status = "POTENTIALLY_ELIGIBLE";
      } else if (scheme.schemeName.includes("SEHAT Kosh") && stateName === "Delhi") {
        status = "POTENTIALLY_ELIGIBLE";
      } else if (scheme.schemeName.includes("Mohalla")) {
        status = "POTENTIALLY_ELIGIBLE";
      }

      // Add to results
      newResults.push({
        schemeName: scheme.schemeName,
        status,
        reason: `${scheme.description} Eligibility: ${scheme.eligibility}. Coverage: ${scheme.coverageAmount}.`,
        officialLink: scheme.officialLink
      });
    });

    setResults(newResults);
  };

  const getSchemeIcon = (name: string) => {
    if (name.includes("Maternal") || name.includes("Janani")) return <Baby className="h-6 w-6 text-pink-500" />;
    if (name.includes("Elderly") || name.includes("NPHCE")) return <Users className="h-6 w-6 text-purple-500" />;
    if (name.includes("Disability")) return <Accessibility className="h-6 w-6 text-blue-500" />;
    return <HeartPulse className="h-6 w-6 text-emerald-500" />;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "POTENTIALLY_ELIGIBLE":
        return <Badge className="bg-emerald-500 hover:bg-emerald-600">Potentially Eligible</Badge>;
      case "NEEDS_VERIFICATION":
        return <Badge variant="secondary" className="bg-amber-100 text-amber-800 hover:bg-amber-200">Needs Verification</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-16 animate-in fade-in duration-300">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200/80 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-br from-teal-500 to-emerald-600 text-white rounded-2xl shadow-sm">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900">Government Health Schemes</h1>
            <p className="text-xs text-slate-500 font-medium">
              Discover national and state-specific healthcare benefits and check eligibility.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 font-bold px-3 py-1 text-xs gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            PM-JAY &amp; State Schemes Active
          </Badge>
        </div>
      </div>

      <Card className="border border-slate-200/80 shadow-sm rounded-3xl overflow-hidden bg-white">
        <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-6">
          <CardTitle className="text-lg font-bold text-slate-900">Citizen Demographic &amp; Household Profile</CardTitle>
          <CardDescription className="text-xs text-slate-500 font-medium">Enter household details to run automated scheme qualification rules.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
            <div className="space-y-2">
              <Label htmlFor="income" className="text-xs font-semibold text-slate-700">Income / Socio-Economic Category *</Label>
              <Select value={incomeCategory} onValueChange={(val) => val && setIncomeCategory(val)}>
                <SelectTrigger id="income" className="h-11 w-full rounded-lg border-slate-200 focus:ring-teal-500">
                  <SelectValue placeholder="Select income category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="BPL">BPL (Below Poverty Line)</SelectItem>
                  <SelectItem value="EWS">EWS (Economically Weaker Section)</SelectItem>
                  <SelectItem value="APL">APL (Above Poverty Line)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="age" className="text-slate-700 font-medium">Age (Years) *</Label>
              <Input
                id="age"
                type="number"
                min={0}
                max={120}
                placeholder="e.g. 45"
                value={age}
                onChange={(e) => setAge(e.target.value ? Number(e.target.value) : "")}
                className="h-11 w-full rounded-lg border-slate-200 focus-visible:ring-teal-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="gender" className="text-slate-700 font-medium">Gender</Label>
              <Select value={gender} onValueChange={(val) => val && setGender(val)}>
                <SelectTrigger id="gender" className="h-11 w-full rounded-lg border-slate-200 focus:ring-teal-500">
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="state" className="text-slate-700 font-medium">State of Residence</Label>
              <Select value={stateName} onValueChange={(val) => val && setStateName(val)}>
                <SelectTrigger id="state" className="h-11 w-full rounded-lg border-slate-200 focus:ring-teal-500">
                  <SelectValue placeholder="Select state" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Delhi">Delhi / NCR</SelectItem>
                  <SelectItem value="Uttar Pradesh">Uttar Pradesh</SelectItem>
                  <SelectItem value="Rajasthan">Rajasthan</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex flex-col gap-4 pt-4 border-t border-slate-100">
            <label className="flex items-center space-x-3 text-sm cursor-pointer p-3 rounded-lg hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
              <Checkbox
                id="disability"
                checked={hasDisability}
                onCheckedChange={(checked) => setHasDisability(!!checked)}
                className="data-[state=checked]:bg-teal-600 data-[state=checked]:border-teal-600 w-5 h-5"
              />
              <span className="font-medium text-slate-700">
                Citizen has a recognized disability (UDID card or medical certificate)
              </span>
            </label>
            <label className="flex items-center space-x-3 text-sm cursor-pointer p-3 rounded-lg hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
              <Checkbox
                id="pregnancy"
                checked={isPregnant}
                onCheckedChange={(checked) => setIsPregnant(!!checked)}
                className="data-[state=checked]:bg-teal-600 data-[state=checked]:border-teal-600 w-5 h-5"
              />
              <span className="font-medium text-slate-700">
                Citizen is currently pregnant / requiring antenatal care
              </span>
            </label>
          </div>
        </CardContent>
        <CardFooter className="bg-slate-50/50 pt-6 pb-6 border-t border-slate-100">
          <Button 
            onClick={checkEligibility} 
            disabled={loading}
            className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white shadow-md rounded-xl transition-all hover:shadow-lg disabled:opacity-50"
          >
            <ShieldCheck className="w-5 h-5 mr-2" />
            {loading ? "Loading Schemes..." : "Evaluate Scheme Eligibility"}
          </Button>
        </CardFooter>
      </Card>

      {results && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="flex items-center justify-between mt-10 mb-4 px-2">
            <h2 className="text-2xl font-bold text-slate-800">Identified Benefit Programs <span className="text-teal-600">({results.length})</span></h2>
            <Badge variant="outline" className="text-sm bg-teal-50 text-teal-700 border-teal-200 px-3 py-1">Rule Engine Evaluated</Badge>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {results.map((res, idx) => (
              <Card key={idx} className="hover:border-teal-300 hover:shadow-lg transition-all duration-300 rounded-xl overflow-hidden border-slate-200">
                <CardContent className="p-6 flex flex-col md:flex-row gap-6 items-start md:items-center justify-between bg-white">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-slate-50 rounded-xl shrink-0 shadow-sm border border-slate-100">
                      {getSchemeIcon(res.schemeName)}
                    </div>
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-3">
                        <h3 className="font-bold text-lg text-slate-900">{res.schemeName}</h3>
                        {getStatusBadge(res.status)}
                      </div>
                      <p className="text-sm text-slate-600 leading-relaxed max-w-2xl">{res.reason}</p>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => window.open(res.officialLink, '_blank')} 
                    className="shrink-0 group text-sm h-10 px-4 rounded-lg border-slate-200 hover:bg-slate-50 hover:text-teal-700"
                  >
                    Official Portal
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200 mt-8 rounded-xl shadow-sm">
            <CardContent className="p-5 flex items-start gap-3">
              <div className="shrink-0 mt-0.5 text-amber-500">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <p className="text-sm text-amber-900 leading-relaxed">
                <strong className="font-semibold">Disclaimer:</strong> This navigator provides informational guidance based on government rules. Final verification and e-card issuance require biometric Aadhaar KYC at your local Ayushman SEHAT Mandir, CSC Kiosk, or Empanelled Hospital.
              </p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
