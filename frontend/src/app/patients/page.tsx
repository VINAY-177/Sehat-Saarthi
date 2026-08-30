"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  UserPlus,
  Users,
  ChevronRight,
  SlidersHorizontal,
  X,
  Stethoscope,
  MapPin,
  Fingerprint,
  AlertTriangle,
  RefreshCw,
} from "lucide-react";
import { Patient, Urgency } from "@/lib/types";
import { UrgencyBadge } from "@/components/urgency-badge";
import { Card, CardContent } from "@/components/ui/card";

import { apiGet } from "@/lib/api";
import { useStore } from "@/lib/store";

export default function PatientsPage() {
  const { patients: storePatients, language } = useStore();
  const isHindi = language === "hi";
  const [patients, setPatients] = useState<Patient[]>(storePatients || []);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRisk, setFilterRisk] = useState<string>("ALL");
  const [filterDistrict, setFilterDistrict] = useState<string>("ALL");
  const [filterGender, setFilterGender] = useState<string>("ALL");
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  const fetchPatients = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchQuery.trim()) params.append("search", searchQuery.trim());
      if (filterRisk !== "ALL") params.append("riskLevel", filterRisk);
      if (filterDistrict !== "ALL") params.append("district", filterDistrict);
      if (filterGender !== "ALL") params.append("gender", filterGender);

      const qs = params.toString();
      const path = qs ? `/api/patients?${qs}` : "/api/patients";
      const data = await apiGet<Patient[]>(path);
      if (Array.isArray(data)) {
        setPatients(data);
      }
    } catch (err) {
      console.error("Failed to fetch patients from API:", err);
      if (storePatients && storePatients.length > 0) {
        setPatients(storePatients);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchPatients();
    }, 250);
    return () => clearTimeout(delayDebounce);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, filterRisk, filterDistrict, filterGender]);

  const clearAllFilters = () => {
    setSearchQuery("");
    setFilterRisk("ALL");
    setFilterDistrict("ALL");
    setFilterGender("ALL");
  };

  // Metrics
  const totalCount = patients.length;
  const emergencyCount = patients.filter((p) => p.riskLevel === "EMERGENCY" || p.riskLevel === "HIGH").length;
  const stableCount = patients.filter((p) => p.riskLevel === "LOW" || p.riskLevel === "MODERATE" || !p.riskLevel).length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-20 page-enter">
      {/* Header */}
      <div className="glass-card-auth p-6 sm:p-7 rounded-[28px] border border-white/80 shadow-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white/92 backdrop-blur-2xl section-enter">
        <div className="flex items-center gap-4">
          <div className="p-3.5 bg-gradient-to-br from-teal-500 to-emerald-600 text-white rounded-2xl shadow-md shadow-teal-500/20">
            <Users className="h-8 w-8" />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
                {isHindi ? "रोगी रजिस्टर" : "Patient Registry"}
              </h1>
              <Badge variant="outline" className="bg-teal-50 text-teal-800 border-teal-200 font-extrabold px-2.5 py-0.5">
                {isHindi ? "लाइव रिकॉर्ड" : "Live Records"}
              </Badge>
            </div>
            <p className="text-slate-500 mt-1 text-xs sm:text-sm font-semibold">
              {isHindi
                ? "केंद्रीकृत क्लिनिकल डेटा, जोखिम वर्गीकरण एवं दीर्घकालिक स्वास्थ्य रिकॉर्ड।"
                : "Centralized clinical intake, risk stratification & longitudinal records."}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <button
            type="button"
            onClick={fetchPatients}
            className="btn-3d-glass h-11 px-4 text-xs font-extrabold text-slate-800 border-slate-200 gap-2 rounded-2xl"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            <span className="hidden sm:inline">{isHindi ? "रिफ्रेश" : "Refresh"}</span>
          </button>

          <Link href="/register" className="w-full sm:w-auto">
            <button type="button" className="btn-3d-primary w-full sm:w-auto h-11 px-5 rounded-2xl text-xs font-black gap-2">
              <UserPlus className="h-4 w-4" />
              <span>{isHindi ? "रोगी पंजीकृत करें" : "Register Patient"}</span>
            </button>
          </Link>
        </div>
      </div>

      {/* Metrics Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-panel p-5 card-hover bg-white/92 border-white/80 rounded-[24px]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">
                {isHindi ? "कुल पंजीकृत मरीज" : "Total Registered"}
              </p>
              <p className="text-3xl font-black text-slate-900 mt-1">{totalCount}</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-teal-100/80 text-teal-800 flex items-center justify-center font-bold shadow-2xs border border-teal-200">
              <Users className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="glass-panel p-5 card-hover bg-white/92 border-white/80 rounded-[24px]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-extrabold text-rose-500 uppercase tracking-wider">
                {isHindi ? "उच्च जोखिम व आपातकाल" : "High Risk & Emergency"}
              </p>
              <p className="text-3xl font-black text-rose-600 mt-1">{emergencyCount}</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-rose-100/80 text-rose-700 flex items-center justify-center font-bold shadow-2xs border border-rose-200">
              <AlertTriangle className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="glass-panel p-5 card-hover bg-white/92 border-white/80 rounded-[24px]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-extrabold text-emerald-700 uppercase tracking-wider">
                {isHindi ? "स्थिर व सामान्य देखभाल" : "Stable & Regular Care"}
              </p>
              <p className="text-3xl font-black text-emerald-700 mt-1">
                {stableCount} <span className="text-xs font-semibold text-slate-400">({totalCount > 0 ? Math.round((stableCount / totalCount) * 100) : 0}%)</span>
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-100/80 text-emerald-800 flex items-center justify-center font-bold shadow-2xs border border-emerald-200">
              <Stethoscope className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="glass-panel p-4 rounded-[24px] shadow-xl border border-white/80 space-y-4 bg-white/90 backdrop-blur-2xl">
        <div className="flex flex-col md:flex-row gap-3 items-center">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <Input
              type="search"
              placeholder={isHindi ? "मरीज का नाम, एमआरएन, आभा आईडी, मोबाइल या जिले से खोजें..." : "Search by Patient Name, MRN, ABHA ID, Mobile or District..."}
              className="pl-11 h-12 rounded-xl border-slate-200 bg-white/80 focus:bg-white text-sm font-semibold shadow-none focus-visible:ring-teal-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <button
              type="button"
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className={`h-12 px-4 rounded-xl font-bold flex items-center gap-2 text-xs transition-all ${
                showAdvancedFilters ? "bg-teal-700 text-white shadow-xs" : "btn-3d-glass text-slate-700"
              }`}
            >
              <SlidersHorizontal className="h-4 w-4" />
              <span>{isHindi ? "फ़िल्टर" : "Filters"}</span>
              {(filterRisk !== "ALL" || filterDistrict !== "ALL" || filterGender !== "ALL") && (
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
              )}
            </button>
          </div>
        </div>

        {/* Expandable Advanced Filters Bar */}
        {showAdvancedFilters && (
          <div className="pt-3 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-3 animate-in fade-in duration-200">
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">{isHindi ? "जोखिम स्तर" : "Risk Level"}</label>
              <select
                value={filterRisk}
                onChange={(e) => setFilterRisk(e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-white text-sm font-medium focus:ring-2 focus:ring-teal-500 outline-none"
              >
                <option value="ALL">{isHindi ? "सभी जोखिम स्तर" : "All Risk Levels"}</option>
                <option value="EMERGENCY">{isHindi ? "आपातकाल" : "Emergency"}</option>
                <option value="HIGH">{isHindi ? "उच्च जोखिम" : "High Risk"}</option>
                <option value="MODERATE">{isHindi ? "मध्यम जोखिम" : "Moderate Risk"}</option>
                <option value="LOW">{isHindi ? "कम जोखिम" : "Low Risk"}</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">District / Region</label>
              <select
                value={filterDistrict}
                onChange={(e) => setFilterDistrict(e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-white text-sm font-medium focus:ring-2 focus:ring-teal-500 outline-none"
              >
                <option value="ALL">All Districts</option>
                <option value="New Delhi">New Delhi</option>
                <option value="South Delhi">South Delhi</option>
                <option value="East Delhi">East Delhi</option>
                <option value="North West Delhi">North West Delhi</option>
                <option value="South West Delhi">South West Delhi</option>
                <option value="Gautam Buddh Nagar">Gautam Buddh Nagar (Noida)</option>
                <option value="Gurugram">Gurugram</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Gender</label>
              <select
                value={filterGender}
                onChange={(e) => setFilterGender(e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-white text-sm font-medium focus:ring-2 focus:ring-teal-500 outline-none"
              >
                <option value="ALL">All Genders</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="sm:col-span-3 flex justify-end">
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllFilters}
                className="text-xs text-slate-400 hover:text-slate-700 font-semibold"
              >
                Reset All Filters
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Patient Table */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center space-y-3">
          <RefreshCw className="h-8 w-8 text-teal-600 animate-spin" />
          <p className="text-white font-bold drop-shadow-md">Loading patient directory...</p>
        </div>
      ) : patients.length === 0 ? (
        <Card className="glass-panel border-dashed border-2 border-white/80 shadow-xl bg-white/90 rounded-[28px]">
          <CardContent className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
              <Users className="h-8 w-8 text-slate-400" />
            </div>
            <h3 className="text-xl font-black text-slate-800 mb-2">No patients found</h3>
            <p className="text-slate-500 max-w-sm mb-6 text-xs font-medium">
              No records match your search or filter parameters. Try clearing your filters or add a new patient.
            </p>
            <button type="button" onClick={clearAllFilters} className="btn-3d-primary h-11 px-6 text-xs font-extrabold rounded-xl">
              Clear Filters
            </button>
          </CardContent>
        </Card>
      ) : (
        <div className="glass-panel rounded-[28px] shadow-2xl border border-white/80 overflow-hidden bg-white/92 backdrop-blur-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/90 border-b border-slate-200/80 text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">
                  <th className="py-4 px-5">MRN & Patient</th>
                  <th className="py-4 px-4">Demographics</th>
                  <th className="py-4 px-4">Location</th>
                  <th className="py-4 px-4">ABHA ID</th>
                  <th className="py-4 px-4">Active Conditions</th>
                  <th className="py-4 px-4">Clinical Urgency</th>
                  <th className="py-4 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {patients.map((patient) => {
                  const hasConditions = patient.conditions && patient.conditions.length > 0;
                  const latestVital = patient.vitals && patient.vitals.length > 0 ? patient.vitals[0] : null;

                  return (
                    <tr
                      key={patient.id}
                      className="hover:bg-teal-50/30 transition-colors group cursor-pointer"
                    >
                      {/* Name & MRN */}
                      <td className="py-4 px-5">
                        <Link href={`/patients/${patient.id}`} className="block">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-teal-100/80 text-teal-800 font-bold flex items-center justify-center border border-teal-200/60 shrink-0">
                              {patient.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <span className="font-bold text-slate-900 group-hover:text-teal-700 transition-colors block">
                                {patient.name}
                              </span>
                              <span className="text-xs font-mono font-medium text-slate-400">
                                {patient.mrn || `ID: ${patient.id.slice(0, 8)}`}
                              </span>
                            </div>
                          </div>
                        </Link>
                      </td>

                      {/* Demographics */}
                      <td className="py-4 px-4 text-slate-600">
                        <div className="flex flex-col">
                          <span className="font-semibold text-slate-800">
                            {patient.age} yrs • {patient.gender}
                          </span>
                          {patient.bloodGroup ? (
                            <span className="text-xs text-rose-600 font-medium">Blood: {patient.bloodGroup}</span>
                          ) : (
                            <span className="text-xs text-slate-400">No blood group</span>
                          )}
                        </div>
                      </td>

                      {/* Location */}
                      <td className="py-4 px-4 text-slate-600">
                        <div className="flex items-center gap-1.5 text-xs text-slate-700 font-medium">
                          <MapPin className="w-3.5 h-3.5 text-teal-500 shrink-0" />
                          <span className="truncate max-w-[140px]">
                            {patient.village ? `${patient.village}, ` : ""}{patient.district}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-400 ml-5">{patient.state}</div>
                      </td>

                      {/* ABHA */}
                      <td className="py-4 px-4">
                        {patient.abhaLinked ? (
                          <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 font-medium gap-1 text-xs">
                            <Fingerprint className="w-3 h-3 text-emerald-600" />
                            Linked
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="bg-slate-100 text-slate-500 font-normal text-xs">
                            Unlinked
                          </Badge>
                        )}
                      </td>

                      {/* Conditions */}
                      <td className="py-4 px-4">
                        {hasConditions ? (
                          <div className="flex flex-wrap gap-1 max-w-[180px]">
                            {patient.conditions!.slice(0, 2).map((c) => (
                              <Badge key={c.id} variant="secondary" className="text-[11px] font-medium bg-slate-100 text-slate-700 py-0">
                                {c.name}
                              </Badge>
                            ))}
                            {patient.conditions!.length > 2 && (
                              <span className="text-[10px] text-slate-400 font-bold self-center">
                                +{patient.conditions!.length - 2} more
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-xs text-slate-400 italic">None recorded</span>
                        )}
                      </td>

                      {/* Clinical Urgency */}
                      <td className="py-4 px-4">
                        <div className="flex flex-col gap-1">
                          <UrgencyBadge
                            urgency={(patient.riskLevel?.toUpperCase() as Urgency) || Urgency.LOW}
                            size="sm"
                          />
                          {latestVital && latestVital.bpSystolic && (
                            <span className="text-[10px] text-slate-400 font-medium">
                              BP: {latestVital.bpSystolic}/{latestVital.bpDiastolic} mmHg
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Action buttons */}
                      <td className="py-4 px-5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link href={`/patients/${patient.id}/encounter`}>
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-9 px-3 text-xs font-bold text-teal-700 border-teal-200 bg-teal-50/50 hover:bg-teal-100 hover:text-teal-800 rounded-xl"
                            >
                              <Stethoscope className="w-3.5 h-3.5 mr-1" />
                              Encounter
                            </Button>
                          </Link>

                          <Link href={`/patients/${patient.id}`}>
                            <Button
                              size="sm"
                              className="h-9 px-3 text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white rounded-xl"
                            >
                              360° Profile
                              <ChevronRight className="w-3.5 h-3.5 ml-1" />
                            </Button>
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
