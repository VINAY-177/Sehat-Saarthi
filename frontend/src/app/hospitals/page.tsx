"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { MapPin, ShieldCheck, Search, Activity, Stethoscope, Building2, Phone, Map } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import FacilityMapWrapper from "@/components/facility-map-wrapper";
import type { FacilityMapItem } from "@/components/facility-map";

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
}

// Helper component for progress bar
function ProgressBar({ available, total, type }: { available: number, total: number, type: 'icu' | 'general' | 'private' }) {
  const percentage = total > 0 ? (available / total) * 100 : 0;
  
  let color = "bg-rose-500";
  if (percentage > 50) color = "bg-emerald-500";
  else if (percentage > 20) color = "bg-amber-500";

  return (
    <div className="space-y-1.5 w-full">
      <div className="flex justify-between text-xs font-semibold text-slate-700">
        <span className="capitalize">{type === 'private' ? 'Private' : type.toUpperCase()} Beds</span>
        <span className={`${percentage > 50 ? 'text-emerald-700' : percentage > 20 ? 'text-amber-700' : 'text-rose-700'} font-bold`}>
          {available}<span className="text-slate-400 font-normal">/{total} free</span>
        </span>
      </div>
      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden shadow-inner">
        <div className={`h-full ${color} rounded-full transition-all duration-500`} style={{ width: `${percentage}%` }} />
      </div>
    </div>
  );
}

export default function HospitalsPage() {
  const [facilities, setFacilities] = useState<HospitalDb[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("ALL");
  const [selectedFacilityId, setSelectedFacilityId] = useState<string | undefined>();
  const [showMap, setShowMap] = useState(true);

  useEffect(() => {
    const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
    fetch(`${API}/api/hospitals`)
      .then(res => res.json())
      .then(data => {
        setFacilities(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const filteredFacilities = facilities.filter(facility => {
    const matchesSearch = facility.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          facility.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          facility.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (facility.specialties && facility.specialties.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesType = typeFilter === "ALL" || facility.type === typeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-16 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-8 rounded-3xl shadow-sm border border-slate-200/80">
        <div className="flex items-center gap-5">
          <div className="bg-gradient-to-br from-teal-500 to-emerald-600 p-4 rounded-2xl text-white shadow-lg shrink-0">
            <Building2 size={36} />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Delhi Government &amp; Regional Hospitals</h1>
            <p className="text-slate-500 text-sm mt-1.5 font-medium">Real-time facility capacity, doctor specialties, ER/ICU telemetry, and direct contact.</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
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
              placeholder="Search by hospital name, district, or specialty (e.g. AIIMS, Cardiology, West Delhi)..." 
              className="pl-12 h-12 text-sm rounded-xl border-slate-200 focus-visible:ring-teal-500 bg-slate-50 focus-visible:bg-white transition-colors font-medium"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="w-full md:w-72">
            <Select value={typeFilter} onValueChange={(val) => val && setTypeFilter(val)}>
              <SelectTrigger className="h-12 text-sm rounded-xl border-slate-200 focus:ring-teal-500 bg-slate-50 font-medium">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Facility Types</SelectItem>
                <SelectItem value="Government">Government Hospitals</SelectItem>
                <SelectItem value="Private">Private Facilities</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Interactive Map Section */}
      {showMap && !loading && (
        <Card className="shadow-sm rounded-3xl border-slate-200/80 overflow-hidden bg-white">
          <CardHeader className="py-4 px-6 bg-slate-50/70 border-b border-slate-100 flex flex-row items-center justify-between">
            <div className="flex items-center gap-2">
              <Map className="h-4 w-4 text-teal-600" />
              <h2 className="text-sm font-bold text-slate-800">Interactive Delhi Healthcare Map ({filteredFacilities.length} Facilities)</h2>
            </div>
            <span className="text-xs text-slate-400 font-medium">Click markers for details &amp; emergency calls</span>
          </CardHeader>
          <CardContent className="p-0 h-[450px]">
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
      {loading ? (
        <div className="flex items-center justify-center py-20 text-teal-600">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
          <span className="ml-3 font-semibold">Loading facilities from database...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFacilities.map((facility) => {
            const specialists = facility.specialties ? facility.specialties.split(',') : [];
            const isSelected = selectedFacilityId === facility.id;

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
                      <h2 className="text-lg font-bold text-slate-900 leading-snug group-hover:text-teal-700 transition-colors">
                        {facility.name}
                      </h2>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline" className="bg-teal-50 text-teal-800 border-teal-200 uppercase tracking-wider text-[10px] font-bold">
                        {facility.type}
                      </Badge>
                      {facility.type === "Government" && (
                        <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 uppercase tracking-wider text-[10px] font-bold flex items-center gap-1">
                          <ShieldCheck className="h-3 w-3" /> PM-JAY Empanelled
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
                        <ProgressBar 
                          available={facility.availableIcu} 
                          total={facility.icuBeds} 
                          type="icu" 
                        />
                        <ProgressBar 
                          available={facility.availableBeds} 
                          total={facility.totalBeds} 
                          type="general" 
                        />
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

                  {/* Direct Contact Footer */}
                  <div className="p-4 bg-white border-t border-slate-100 flex items-center justify-between gap-3">
                    {facility.phone ? (
                      <a href={`tel:${facility.phone}`} className="w-full">
                        <Button variant="outline" size="sm" className="w-full h-9 rounded-xl border-teal-200 text-teal-700 hover:bg-teal-50 font-bold text-xs gap-1.5">
                          <Phone className="h-3.5 w-3.5" />
                          Call {facility.phone}
                        </Button>
                      </a>
                    ) : (
                      <Button variant="outline" size="sm" disabled className="w-full h-9 rounded-xl text-xs">
                        Emergency 108
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
          
          {filteredFacilities.length === 0 && !loading && (
            <div className="col-span-full py-16 text-center bg-white rounded-3xl border border-slate-200/80 border-dashed">
              <Building2 className="mx-auto h-12 w-12 text-slate-300 mb-3" />
              <h3 className="text-lg font-bold text-slate-900">No facilities match your search</h3>
              <p className="text-slate-500 text-sm mt-1">Try adjusting your search criteria or type filter.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
