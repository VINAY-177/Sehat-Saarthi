"use client";

import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { MapPin, ShieldCheck, Search, Activity, Stethoscope, Building2, Phone, Map, Star, Ambulance } from "lucide-react";
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

export default function HospitalsPage() {
  const fallbackHospitals: HospitalDb[] = DEFAULT_DELHI_HOSPITALS.map((f) => ({
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

  const [facilities, setFacilities] = useState<HospitalDb[]>(fallbackHospitals);
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
          setFacilities(mapped);
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
    <div className="max-w-7xl mx-auto space-y-8 pb-16 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-8 rounded-3xl shadow-sm border border-slate-200/80">
        <div className="flex items-center gap-5">
          <div className="bg-gradient-to-br from-teal-500 to-emerald-600 p-4 rounded-2xl text-white shadow-lg shrink-0">
            <Building2 size={36} />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Delhi-NCR Hospital Network</h1>
            <p className="text-slate-500 text-sm mt-1.5 font-medium">Real-time facility capacity, doctor specialties, ER/ICU telemetry, and direct appointments across Delhi-NCR.</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Badge className="bg-teal-600 text-white text-sm px-3.5 py-1.5 font-bold shadow-sm">
            {facilities.length} Hospitals in Network
          </Badge>
          <Button
            variant={showMap ? "default" : "outline"}
            onClick={() => setShowMap(!showMap)}
            className={`rounded-2xl font-bold text-xs gap-2 h-11 px-4 ${
              showMap ? "bg-teal-600 hover:bg-teal-700 text-white shadow-md shadow-teal-600/20" : "border-slate-200"
            }`}
          >
            <Map className="w-4 h-4" />
            {showMap ? "Hide Map" : "Show Map"}
          </Button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <Card className="p-2 shadow-sm rounded-2xl border-slate-200/80 bg-white">
        <div className="flex flex-col md:flex-row gap-3 p-3">
          <div className="relative flex-1 group">
            <Search className="absolute left-4 top-3.5 h-5 w-5 text-slate-400 group-focus-within:text-teal-500 transition-colors" />
            <Input
              placeholder="Search by hospital name, district, area, or specialty (e.g. AIIMS, Medanta, Noida, Cardiology)..."
              className="pl-12 h-12 text-sm rounded-xl border-slate-200 focus-visible:ring-teal-500 bg-slate-50 focus-visible:bg-white transition-colors font-medium"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="w-full md:w-56">
            <Select value={regionFilter} onValueChange={(val) => val && setRegionFilter(val)}>
              <SelectTrigger className="h-12 text-sm rounded-xl border-slate-200 focus:ring-teal-500 bg-slate-50 font-medium">
                <SelectValue placeholder="All Regions" />
              </SelectTrigger>
              <SelectContent>
                {REGIONS.map((r) => (
                  <SelectItem key={r.value} value={r.value}>
                    {r.label} ({regionCounts[r.value] || 0})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="w-full md:w-56">
            <Select value={typeFilter} onValueChange={(val) => val && setTypeFilter(val)}>
              <SelectTrigger className="h-12 text-sm rounded-xl border-slate-200 focus:ring-teal-500 bg-slate-50 font-medium">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Facility Types</SelectItem>
                <SelectItem value="Government">Government Hospitals</SelectItem>
                <SelectItem value="Tertiary">Tertiary / Super-Specialty</SelectItem>
                <SelectItem value="District">District Hospitals</SelectItem>
                <SelectItem value="Specialized">Specialized Centers</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Interactive Map Section */}
      {showMap && (
        <Card className="shadow-sm rounded-3xl border-slate-200/80 overflow-hidden bg-white">
          <CardHeader className="py-4 px-6 bg-slate-50/70 border-b border-slate-100 flex flex-row items-center justify-between">
            <div className="flex items-center gap-2">
              <Map className="h-4 w-4 text-teal-600" />
              <h2 className="text-sm font-bold text-slate-800">
                Interactive Delhi-NCR Healthcare Map ({filteredFacilities.length} Facilities)
              </h2>
            </div>
            <span className="text-xs text-slate-400 font-medium">Click markers for details, emergency contacts &amp; online booking</span>
          </CardHeader>
          <CardContent className="p-0 h-[480px]">
            <FacilityMapWrapper
              facilities={filteredFacilities}
              selectedFacilityId={selectedFacilityId}
              onFacilityClick={(id) => setSelectedFacilityId(id)}
              className="h-full border-none rounded-none"
            />
          </CardContent>
        </Card>
      )}

      {/* Hospital Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredFacilities.map((facility) => {
          const specialists = facility.specialties ? facility.specialties.split(",") : [];
          const isSelected = selectedFacilityId === facility.id;
          const region = getHospitalRegion(facility);

          return (
            <Card
              key={facility.id}
              className={`overflow-hidden group hover:shadow-xl transition-all duration-300 rounded-3xl border bg-white flex flex-col ${
                isSelected ? "ring-2 ring-teal-500 border-teal-300 shadow-lg" : "border-slate-200/80"
              }`}
            >
              <CardHeader className="p-6 bg-gradient-to-b from-slate-50/80 to-white border-b border-slate-100">
                <div className="flex flex-col gap-3">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <Link href={`/facilities/${facility.id}`}>
                      <h2 className="text-lg font-bold text-slate-900 leading-snug group-hover:text-teal-700 transition-colors">
                        {facility.name}
                      </h2>
                    </Link>
                    {facility.rating && (
                      <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 text-xs font-bold gap-1 shrink-0">
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
                        <ShieldCheck className="h-3 w-3" /> PM-JAY
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center text-xs text-slate-500 mt-1">
                    <MapPin className="h-3.5 w-3.5 mr-1.5 text-teal-600 shrink-0" />
                    <span className="truncate">{facility.location || `${facility.district}, ${facility.state}`}</span>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-0 flex-1 flex flex-col">
                <div className="divide-y divide-slate-100 flex-1">
                  {/* Beds Section */}
                  <div className="p-5 space-y-3.5 bg-white">
                    <h3 className="font-bold text-xs text-slate-700 flex items-center uppercase tracking-wider">
                      <Activity className="h-3.5 w-3.5 mr-1.5 text-teal-500" /> Bed Telemetry
                    </h3>
                    <div className="space-y-3">
                      <ProgressBar available={facility.availableIcu} total={facility.icuBeds} type="icu" />
                      <ProgressBar available={facility.availableBeds} total={facility.totalBeds} type="general" />
                    </div>
                  </div>

                  {/* Doctors Summary */}
                  <div className="p-5 bg-slate-50/50 space-y-2.5 flex-1">
                    <h3 className="font-bold text-xs text-slate-700 flex items-center uppercase tracking-wider">
                      <Stethoscope className="h-3.5 w-3.5 mr-1.5 text-teal-500" />
                      Departments &amp; Specialties
                    </h3>
                    {specialists.length > 0 ? (
                      <div className="flex flex-wrap gap-1.5">
                        {specialists.slice(0, 4).map((spec: string, i: number) => (
                          <Badge key={i} variant="secondary" className="bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 font-medium text-[11px]">
                            {spec.trim()}
                          </Badge>
                        ))}
                        {specialists.length > 4 && (
                          <Badge variant="secondary" className="bg-slate-100 text-slate-500 border-dashed border-slate-300 text-[11px]">
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
                <div className="p-4 bg-white border-t border-slate-100 flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    {facility.phone ? (
                      <a href={`tel:${facility.phone}`} className="flex-1">
                        <Button variant="outline" size="sm" className="w-full h-9 rounded-xl border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-xs gap-1.5">
                          <Phone className="h-3.5 w-3.5" />
                          {facility.phone}
                        </Button>
                      </a>
                    ) : (
                      <Button variant="outline" size="sm" disabled className="flex-1 h-9 rounded-xl text-xs">
                        Emergency 108
                      </Button>
                    )}
                    <Link href={`/scheduling?facilityId=${facility.id}`} className="flex-1">
                      <Button size="sm" className="w-full h-9 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs">
                        Book Appt
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}

        {filteredFacilities.length === 0 && (
          <div className="col-span-full py-16 text-center bg-white rounded-3xl border border-slate-200/80 border-dashed">
            <Building2 className="mx-auto h-12 w-12 text-slate-300 mb-3" />
            <h3 className="text-lg font-bold text-slate-900">No facilities match your search</h3>
            <p className="text-slate-500 text-sm mt-1">Try adjusting your search criteria, region, or type filter.</p>
          </div>
        )}
      </div>
    </div>
  );
}
