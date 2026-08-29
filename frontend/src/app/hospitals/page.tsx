"use client";

import { useState, useEffect, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, ShieldCheck, Search, Activity, Stethoscope, Building2, Phone, Map as MapIcon, Star, Ambulance } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import FacilityMapWrapper from "@/components/facility-map-wrapper";
import type { FacilityMapItem } from "@/components/facility-map";
import { DEFAULT_DELHI_HOSPITALS } from "@/lib/store";
import Link from "next/link";

interface HospitalDb extends FacilityMapItem {
  id: string;
  name: string;
  type: string;
  district: string;
  state: string;
  location: string;
  phone?: string | null;
  lat?: number;
  lng?: number;
  totalBeds: number;
  availableBeds: number;
  icuBeds: number;
  availableIcu: number;
  specialties: string;
  city?: string;
  area?: string;
  rating?: number;
  emergencyAvailable?: boolean;
}

// Region definitions for filtering
const REGIONS = [
  { value: "ALL", label: "All Regions" },
  { value: "Delhi", label: "Delhi" },
  { value: "Noida", label: "Noida" },
  { value: "Greater Noida", label: "Greater Noida" },
  { value: "Ghaziabad", label: "Ghaziabad" },
  { value: "Gurugram", label: "Gurugram" },
  { value: "Faridabad", label: "Faridabad" },
] as const;

function getHospitalRegion(facility: { district?: string; state?: string; city?: string; area?: string; location?: string }): string {
  const city = (facility.city || "").toLowerCase();
  const district = (facility.district || "").toLowerCase();
  const state = (facility.state || "").toLowerCase();
  const area = (facility.area || "").toLowerCase();
  const location = (facility.location || "").toLowerCase();

  if (city === "greater noida" || area.includes("greater noida") || location.includes("greater noida")) return "Greater Noida";
  if (city === "noida" || district.includes("gautam") || location.includes("noida")) {
    if (area.includes("greater noida") || location.includes("greater noida") || location.includes("pari chowk") || location.includes("knowledge park")) {
      return "Greater Noida";
    }
    return "Noida";
  }
  if (city === "ghaziabad" || district === "ghaziabad" || location.includes("ghaziabad") || location.includes("indirapuram") || location.includes("vaishali") || location.includes("kaushambi")) return "Ghaziabad";
  if (city === "gurugram" || district === "gurugram" || city === "gurgaon" || district === "gurgaon" || location.includes("gurugram") || location.includes("gurgaon")) return "Gurugram";
  if (city === "faridabad" || district === "faridabad" || location.includes("faridabad")) return "Faridabad";
  if (state === "delhi" || district.includes("delhi") || district === "new delhi" || district === "shahdara") return "Delhi";
  if (state === "uttar pradesh") {
    if (district.includes("gautam")) return "Noida";
    if (district.includes("ghaziabad")) return "Ghaziabad";
  }
  if (state === "haryana") {
    if (district.includes("gurugram") || district.includes("gurgaon")) return "Gurugram";
    if (district.includes("faridabad")) return "Faridabad";
  }
  return "Delhi";
}

// Helper component for progress bar
function ProgressBar({ available, total, type }: { available: number; total: number; type: "icu" | "general" | "private" }) {
  const percentage = total > 0 ? (available / total) * 100 : 0;

  let color = "bg-rose-500";
  if (percentage > 50) color = "bg-emerald-500";
  else if (percentage > 20) color = "bg-amber-500";

  return (
    <div className="space-y-1.5 w-full">
      <div className="flex justify-between text-xs font-semibold text-slate-700">
        <span className="capitalize">{type === "private" ? "Private" : type.toUpperCase()} Beds</span>
        <span className={`${percentage > 50 ? "text-emerald-700" : percentage > 20 ? "text-amber-700" : "text-rose-700"} font-bold`}>
          {available}
          <span className="text-slate-400 font-normal">/{total} free</span>
        </span>
      </div>
      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden shadow-inner">
        <div className={`h-full ${color} rounded-full transition-all duration-500`} style={{ width: `${percentage}%` }} />
      </div>
    </div>
  );
}

const FALLBACK_HOSPITALS: HospitalDb[] = DEFAULT_DELHI_HOSPITALS.map((f) => ({
  id: f.id,
  name: f.name,
  type: f.type,
  district: f.district,
  state: f.state,
  location: f.address || f.location || `${f.district}, ${f.state}`,
  phone: f.phone,
  lat: f.lat,
  lng: f.lng,
  totalBeds: f.generalBeds + f.icuBeds,
  availableBeds: f.generalBeds - f.generalBedsUsed,
  icuBeds: f.icuBeds,
  availableIcu: f.icuBeds - f.icuBedsUsed,
  specialties: (f.specialties || f.specialists || []).join(", "),
  city: f.city,
  area: f.area,
  rating: f.rating,
  emergencyAvailable: f.emergencyAvailable,
  pmjayEmpanelled: f.pmjayEmpanelled,
}));

export default function HospitalsPage() {
  const [facilities, setFacilities] = useState<HospitalDb[]>(FALLBACK_HOSPITALS);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("ALL");
  const [regionFilter, setRegionFilter] = useState<string>("ALL");
  const [selectedFacilityId, setSelectedFacilityId] = useState<string | undefined>();
  const [showMap, setShowMap] = useState(true);

  useEffect(() => {
    const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
    fetch(`${API}/api/hospitals`)
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          const mapped: HospitalDb[] = data.map((item: Record<string, unknown>) => ({
            id: String(item.id || ""),
            name: String(item.name || ""),
            type: String(item.type || "Government"),
            district: String(item.district || ""),
            state: String(item.state || "Delhi"),
            location: String(item.location || `${item.district || ""}, ${item.state || "Delhi"}`),
            phone: item.phone ? String(item.phone) : null,
            lat: typeof item.lat === "number" ? item.lat : undefined,
            lng: typeof item.lng === "number" ? item.lng : undefined,
            totalBeds: typeof item.totalBeds === "number" ? item.totalBeds : typeof item.generalBeds === "number" ? item.generalBeds + (typeof item.icuBeds === "number" ? item.icuBeds : 0) : 100,
            availableBeds: typeof item.availableBeds === "number" ? item.availableBeds : 20,
            icuBeds: typeof item.icuBeds === "number" ? item.icuBeds : 20,
            availableIcu: typeof item.availableIcu === "number" ? item.availableIcu : 4,
            specialties: typeof item.specialties === "string" ? item.specialties : Array.isArray(item.specialties) ? item.specialties.join(", ") : "",
            city: typeof item.city === "string" ? item.city : undefined,
            area: typeof item.area === "string" ? item.area : undefined,
            rating: typeof item.rating === "number" ? item.rating : undefined,
            emergencyAvailable: typeof item.emergencyAvailable === "boolean" ? item.emergencyAvailable : undefined,
            pmjayEmpanelled: item.pmjayEmpanelled !== false,
          }));

          // Merge by ID with fallback 32 hospitals so no hospitals are lost
          const apiMap = new Map(mapped.map((h) => [h.id, h]));
          const merged = FALLBACK_HOSPITALS.map((fb) => apiMap.get(fb.id) || fb);
          // Add any new hospitals from API not in fallback
          mapped.forEach((h) => {
            if (!FALLBACK_HOSPITALS.some((fb) => fb.id === h.id)) {
              merged.push(h);
            }
          });

          setFacilities(merged);
        }
      })
      .catch(() => {});
  }, []);

  const filteredFacilities = useMemo(() => {
    return facilities.filter((facility) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        facility.name.toLowerCase().includes(q) ||
        facility.district.toLowerCase().includes(q) ||
        facility.location.toLowerCase().includes(q) ||
        (facility.city && facility.city.toLowerCase().includes(q)) ||
        (facility.area && facility.area.toLowerCase().includes(q)) ||
        (facility.specialties && facility.specialties.toLowerCase().includes(q));

      const matchesType =
        typeFilter === "ALL" ||
        facility.type.toLowerCase() === typeFilter.toLowerCase() ||
        (typeFilter === "Government" && facility.type === "Government") ||
        (typeFilter === "Private" && (facility.type === "Tertiary" || facility.type === "Specialized" || facility.type === "Private"));

      const region = getHospitalRegion(facility);
      const matchesRegion = regionFilter === "ALL" || region === regionFilter;

      return matchesSearch && matchesType && matchesRegion;
    });
  }, [facilities, searchQuery, typeFilter, regionFilter]);

  // Region counts
  const regionCounts = useMemo(() => {
    const counts: Record<string, number> = { ALL: facilities.length };
    for (const f of facilities) {
      const r = getHospitalRegion(f);
      counts[r] = (counts[r] || 0) + 1;
    }
    return counts;
  }, [facilities]);

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-16 page-enter">
      {/* Header */}
      <div className="glass-card-auth p-6 sm:p-7 rounded-[28px] border border-white/80 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-5 backdrop-blur-2xl bg-white/92 section-enter">
        <div className="flex items-center gap-4">
          <div className="bg-gradient-to-br from-teal-500 to-emerald-600 p-3.5 rounded-2xl text-white shadow-md shadow-teal-500/20 shrink-0">
            <Building2 size={30} />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">Delhi-NCR Hospital Network</h1>
            <p className="text-xs sm:text-sm text-slate-500 font-semibold mt-1">Real-time facility capacity, doctor specialties, ER/ICU telemetry, and direct appointments across Delhi-NCR.</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Badge variant="outline" className="bg-teal-100/80 text-teal-800 border-teal-300 font-extrabold px-3.5 py-1 text-xs gap-1.5 shadow-2xs">
            <span className="w-2.5 h-2.5 rounded-full bg-teal-600 animate-pulse" />
            {facilities.length} Hospitals in Network
          </Badge>
          <button
            type="button"
            onClick={() => setShowMap(!showMap)}
            className={`btn-3d-glass font-bold text-xs gap-2 h-10 px-4 rounded-xl ${
              showMap ? "bg-teal-50 text-teal-900 border-teal-300" : ""
            }`}
          >
            <MapIcon className="w-4 h-4 text-teal-600 inline mr-1" />
            <span>{showMap ? "Hide Map" : "Show Map"}</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-panel p-3 shadow-xl rounded-[24px] border border-white/80 bg-white/92 backdrop-blur-2xl">
        <div className="flex flex-col md:flex-row gap-3 p-2">
          <div className="relative flex-1 group">
            <Search className="absolute left-4 top-3.5 h-4 w-4 text-slate-400 group-focus-within:text-teal-600 transition-colors" />
            <Input
              placeholder="Search by hospital name, district, area, or specialty (e.g. AIIMS, Medanta, Noida, Cardiology)..."
              className="pl-11 h-11 text-xs rounded-xl border-slate-200 focus-visible:ring-teal-500 bg-white font-medium"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="w-full md:w-56">
            <Select value={regionFilter} onValueChange={(val) => val && setRegionFilter(val)}>
              <SelectTrigger className="h-11 text-xs rounded-xl border-slate-200 focus:ring-teal-500 bg-white font-semibold">
                <SelectValue placeholder="All Regions" />
              </SelectTrigger>
              <SelectContent>
                {REGIONS.map((r) => (
                  <SelectItem key={r.value} value={r.value} className="text-xs font-medium">
                    {r.label} ({regionCounts[r.value] || 0})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="w-full md:w-56">
            <Select value={typeFilter} onValueChange={(val) => val && setTypeFilter(val)}>
              <SelectTrigger className="h-11 text-xs rounded-xl border-slate-200 focus:ring-teal-500 bg-white font-semibold">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL" className="text-xs font-medium">All Types</SelectItem>
                <SelectItem value="Government" className="text-xs font-medium">Government Hospitals</SelectItem>
                <SelectItem value="Private" className="text-xs font-medium">Private / Tertiary</SelectItem>
                <SelectItem value="Tertiary" className="text-xs font-medium">Tertiary Only</SelectItem>
                <SelectItem value="District" className="text-xs font-medium">District Only</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Map Section */}
      {showMap && (
        <div className="glass-panel shadow-2xl border border-white/80 overflow-hidden rounded-[28px] bg-white/92 backdrop-blur-2xl">
          <div className="p-4 sm:p-5 border-b border-slate-200/80 bg-slate-50/80 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <MapIcon className="w-4 h-4 text-teal-600" />
              <h2 className="font-black text-sm text-slate-900">
                Interactive Delhi-NCR Healthcare Map ({filteredFacilities.length} Facilities)
              </h2>
            </div>
            <span className="text-xs text-slate-500 font-semibold">Click markers for details &amp; online booking</span>
          </div>
          <div className="p-0 h-[480px]">
            <FacilityMapWrapper
              facilities={filteredFacilities}
              selectedFacilityId={selectedFacilityId}
              onFacilityClick={(id) => setSelectedFacilityId(id)}
              className="h-full border-none rounded-none"
            />
          </div>
        </div>
      )}

      {/* Hospital Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredFacilities.map((facility) => {
          const specialists = facility.specialties ? facility.specialties.split(",") : [];
          const isSelected = selectedFacilityId === facility.id;
          const region = getHospitalRegion(facility);

          return (
            <div
              key={facility.id}
              className={`glass-panel overflow-hidden group hover:shadow-2xl transition-all duration-300 rounded-[28px] border border-white/80 bg-white/92 backdrop-blur-2xl flex flex-col ${
                isSelected ? "ring-2 ring-teal-500 shadow-2xl" : ""
              }`}
            >
              <div className="p-6 bg-slate-50/80 border-b border-slate-200/80">
                <div className="flex flex-col gap-3">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <Link href={`/facilities/${facility.id}`}>
                      <h2 className="text-base font-black text-slate-900 leading-snug group-hover:text-teal-700 transition-colors">
                        {facility.name}
                      </h2>
                    </Link>
                    {facility.rating && (
                      <Badge variant="outline" className="bg-amber-50 text-amber-800 border-amber-300 text-xs font-black gap-1 shrink-0 shadow-2xs">
                        <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                        {facility.rating.toFixed(1)}
                      </Badge>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2 items-center">
                    <Badge variant="outline" className="bg-teal-50 text-teal-800 border-teal-200 uppercase tracking-wider text-[10px] font-bold">
                      {facility.type}
                    </Badge>
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-[10px] font-bold">
                      {region}
                    </Badge>
                    {facility.emergencyAvailable !== false && (
                      <Badge className="bg-rose-50 text-rose-700 border border-rose-200 text-[10px] font-bold gap-1">
                        <Ambulance className="h-3 w-3" /> 24/7 ER
                      </Badge>
                    )}
                    {facility.pmjayEmpanelled && (
                      <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 uppercase tracking-wider text-[10px] font-bold flex items-center gap-1">
                        <ShieldCheck className="h-3 w-3 text-emerald-600" /> PM-JAY
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center text-xs text-slate-500 font-semibold mt-1">
                    <MapPin className="h-3.5 w-3.5 mr-1.5 text-teal-600 shrink-0" />
                    <span className="truncate">{facility.location || `${facility.district}, ${facility.state}`}</span>
                  </div>
                </div>
              </div>

              <div className="p-0 flex-1 flex flex-col">
                <div className="divide-y divide-slate-100 flex-1">
                  {/* Beds Section */}
                  <div className="p-5 space-y-3.5 bg-white">
                    <h3 className="font-black text-xs text-slate-800 flex items-center uppercase tracking-wider">
                      <Activity className="h-3.5 w-3.5 mr-1.5 text-teal-600" /> Bed Telemetry
                    </h3>
                    <div className="space-y-3">
                      <ProgressBar available={facility.availableIcu} total={facility.icuBeds} type="icu" />
                      <ProgressBar available={facility.availableBeds} total={facility.totalBeds} type="general" />
                    </div>
                  </div>

                  {/* Doctors Summary */}
                  <div className="p-5 bg-slate-50/50 space-y-2.5 flex-1">
                    <h3 className="font-black text-xs text-slate-800 flex items-center uppercase tracking-wider">
                      <Stethoscope className="h-3.5 w-3.5 mr-1.5 text-teal-600" />
                      Departments &amp; Specialties
                    </h3>
                    {specialists.length > 0 ? (
                      <div className="flex flex-wrap gap-1.5">
                        {specialists.slice(0, 4).map((spec: string, i: number) => (
                          <Badge key={i} variant="secondary" className="bg-white border border-slate-200 text-slate-700 font-semibold text-[11px]">
                            {spec.trim()}
                          </Badge>
                        ))}
                        {specialists.length > 4 && (
                          <Badge variant="secondary" className="bg-slate-100 text-slate-500 border-dashed border-slate-300 text-[11px] font-bold">
                            +{specialists.length - 4} more
                          </Badge>
                        )}
                      </div>
                    ) : (
                      <p className="text-xs text-slate-400 italic">General OPD &amp; Emergency services</p>
                    )}
                  </div>
                </div>

                {/* Direct Contact & Booking Footer */}
                <div className="p-4 bg-slate-50/80 border-t border-slate-200/80 flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    {facility.phone ? (
                      <a href={`tel:${facility.phone}`} className="flex-1">
                        <button type="button" className="btn-3d-glass w-full h-9 rounded-xl text-slate-700 font-bold text-xs gap-1.5">
                          <Phone className="h-3.5 w-3.5 inline mr-1 text-teal-600" />
                          <span>{facility.phone}</span>
                        </button>
                      </a>
                    ) : (
                      <button type="button" disabled className="btn-3d-glass opacity-50 flex-1 h-9 rounded-xl text-xs font-semibold">
                        Emergency 108
                      </button>
                    )}
                    <Link href={`/scheduling?facilityId=${facility.id}`} className="flex-1">
                      <button type="button" className="btn-3d-primary w-full h-9 rounded-xl text-xs font-black">
                        Book Appt
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {filteredFacilities.length === 0 && (
          <div className="col-span-full py-16 text-center glass-panel rounded-[28px] bg-white/90 border border-white/80">
            <Building2 className="mx-auto h-12 w-12 text-slate-400 mb-3" />
            <h3 className="text-base font-black text-slate-900">No facilities match your search</h3>
            <p className="text-slate-500 text-xs font-semibold mt-1">Try adjusting your search criteria, region, or type filter.</p>
          </div>
        )}
      </div>
    </div>
  );
}
