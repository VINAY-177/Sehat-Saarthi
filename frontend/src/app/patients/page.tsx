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
  const { patients: storePatients } = useStore();
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
    <div className="space-y-8 animate-in fade-in duration-500 max-w-7xl mx-auto pb-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-slate-200/80 pb-6">
        <div className="flex items-center gap-4">
          <div className="p-3.5 bg-gradient-to-br from-teal-500 to-emerald-600 text-white rounded-2xl shadow-md shadow-teal-500/20">
            <Users className="h-8 w-8" />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Patient Registry</h1>
              <Badge variant="outline" className="bg-teal-50 text-teal-700 border-teal-200 font-bold px-2.5 py-0.5">
                Live Records
              </Badge>
            </div>
            <p className="text-slate-500 mt-1 font-medium">
              Centralized clinical intake, risk stratification &amp; longitudinal records.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <Button
            variant="outline"
            onClick={fetchPatients}
            className="h-11 rounded-xl border-slate-200 text-slate-600 hover:bg-slate-50 gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            <span className="hidden sm:inline">Refresh</span>
          </Button>

          <Link href="/register" className="w-full sm:w-auto">
            <Button className="w-full sm:w-auto h-11 px-5 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white shadow-md hover:shadow-lg transition-all flex items-center gap-2 font-bold">
              <UserPlus className="h-4 w-4" />
              <span>Register Patient</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Metrics Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-0 shadow-sm bg-gradient-to-br from-white to-slate-50 border border-slate-100 rounded-2xl">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Registered</p>
              <p className="text-3xl font-black text-slate-900 mt-1">{totalCount}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold">
              <Users className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-gradient-to-br from-white to-rose-50/40 border border-rose-100/60 rounded-2xl">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-rose-500 uppercase tracking-wider">High Risk &amp; Emergency</p>
              <p className="text-3xl font-black text-rose-600 mt-1">{emergencyCount}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center font-bold">
              <AlertTriangle className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-gradient-to-br from-white to-blue-50/40 border border-blue-100/60 rounded-2xl">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Stable &amp; Regular Care</p>
              <p className="text-3xl font-black text-emerald-700 mt-1">
                {stableCount} <span className="text-sm font-normal text-slate-400">({totalCount > 0 ? Math.round((stableCount / totalCount) * 100) : 0}%)</span>
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              <Stethoscope className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200/80 space-y-4">
        <div className="flex flex-col md:flex-row gap-3 items-center">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <Input
              type="search"
              placeholder="Search by Patient Name, MRN, ABHA ID, Mobile or District..."
              className="pl-11 h-12 rounded-xl border-slate-200 bg-slate-50/50 focus:bg-white text-base shadow-none focus-visible:ring-teal-500"
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
            <Button
              variant={showAdvancedFilters ? "default" : "outline"}
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className={`h-12 px-4 rounded-xl font-bold flex items-center gap-2 ${
                showAdvancedFilters ? "bg-teal-600 hover:bg-teal-700 text-white" : "border-slate-200 text-slate-700"
              }`}
            >
              <SlidersHorizontal className="h-4 w-4" />
              <span>Filters</span>
              {(filterRisk !== "ALL" || filterDistrict !== "ALL" || filterGender !== "ALL") && (
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
              )}
            </Button>
          </div>
        </div>

        {/* Expandable Advanced Filters Bar */}
        {showAdvancedFilters && (
          <div className="pt-3 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-3 animate-in fade-in duration-200">
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Risk Level</label>
              <select
                value={filterRisk}
                onChange={(e) => setFilterRisk(e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-slate-50 text-sm font-medium focus:ring-2 focus:ring-teal-500 outline-none"
              >
                <option value="ALL">All Risk Levels</option>
                <option value="EMERGENCY">Emergency</option>
                <option value="HIGH">High Risk</option>
                <option value="MODERATE">Moderate Risk</option>
                <option value="LOW">Low Risk</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">District / Region</label>
              <select
                value={filterDistrict}
                onChange={(e) => setFilterDistrict(e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-slate-50 text-sm font-medium focus:ring-2 focus:ring-teal-500 outline-none"
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
                className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-slate-50 text-sm font-medium focus:ring-2 focus:ring-teal-500 outline-none"
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
          <p className="text-slate-500 font-medium">Loading patient directory...</p>
        </div>
      ) : patients.length === 0 ? (
        <Card className="border-dashed border-2 border-slate-200 shadow-sm bg-slate-50/50 rounded-2xl">
          <CardContent className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
              <Users className="h-8 w-8 text-slate-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">No patients found</h3>
            <p className="text-slate-500 max-w-sm mb-6">
              No records match your search or filter parameters. Try clearing your filters or add a new patient.
            </p>
            <Button onClick={clearAllFilters} className="h-11 px-6 rounded-xl bg-teal-600 hover:bg-teal-700">
              Clear Filters
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
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
