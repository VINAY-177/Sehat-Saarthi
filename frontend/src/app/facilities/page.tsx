"use client";

import React, { useState, useMemo } from 'react';
import { useStore } from '@/lib/store';
import FacilityMapWrapper from '@/components/facility-map-wrapper';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import Link from 'next/link';
import { MapPin, Phone, ShieldCheck, Hospital, Edit2, Bed, Filter as FilterIcon, Search, Star, Ambulance } from 'lucide-react';
import { toast } from 'sonner';

// Region definitions for filtering
const REGIONS = [
  { value: 'All', label: 'All Regions' },
  { value: 'Delhi', label: 'Delhi' },
  { value: 'Noida', label: 'Noida' },
  { value: 'Greater Noida', label: 'Greater Noida' },
  { value: 'Ghaziabad', label: 'Ghaziabad' },
  { value: 'Gurugram', label: 'Gurugram' },
  { value: 'Faridabad', label: 'Faridabad' },
] as const;

function getRegion(facility: { district: string; state: string; city?: string; area?: string }): string {
  const city = (facility.city || '').toLowerCase();
  const district = (facility.district || '').toLowerCase();
  const state = (facility.state || '').toLowerCase();
  
  if (city === 'greater noida' || (city === 'noida' && (facility.area || '').toLowerCase().includes('greater'))) return 'Greater Noida';
  if (city === 'noida') return 'Noida';
  if (city === 'ghaziabad' || district === 'ghaziabad') return 'Ghaziabad';
  if (city === 'gurugram' || district === 'gurugram' || city === 'gurgaon' || district === 'gurgaon') return 'Gurugram';
  if (city === 'faridabad' || district === 'faridabad') return 'Faridabad';
  if (state === 'delhi' || district.includes('delhi') || district === 'new delhi' || district === 'shahdara') return 'Delhi';
  // Fallback: check state
  if (state === 'uttar pradesh') {
    if (district.includes('gautam')) return 'Noida';
    if (district.includes('ghaziabad')) return 'Ghaziabad';
  }
  if (state === 'haryana') {
    if (district.includes('gurugram') || district.includes('gurgaon')) return 'Gurugram';
    if (district.includes('faridabad')) return 'Faridabad';
  }
  return 'Delhi';
}

export default function FacilitiesPage() {
  const { facilities, updateFacility } = useStore();
  const [selectedType, setSelectedType] = useState<string>('All');
  const [selectedRegion, setSelectedRegion] = useState<string>('All');
  const [pmjayOnly, setPmjayOnly] = useState(false);
  const [hasIcuOnly, setHasIcuOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFacilityId, setSelectedFacilityId] = useState<string | undefined>();
  const [editFacilityId, setEditFacilityId] = useState<string | null>(null);

  const filteredFacilities = useMemo(() => {
    return facilities.filter((f) => {
      if (selectedType !== 'All' && f.type !== selectedType) return false;
      if (pmjayOnly && !f.pmjayEmpanelled) return false;
      if (hasIcuOnly && (f.icuBeds - f.icuBedsUsed) <= 0) return false;
      
      // Region filter
      if (selectedRegion !== 'All') {
        const region = getRegion(f);
        if (region !== selectedRegion) return false;
      }
      
      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const searchable = [
          f.name,
          f.district,
          f.state,
          f.phone,
          ...(f.specialists || []),
          ...(f.specialties || []),
          f.type,
          f.city || '',
          f.area || '',
          f.address || '',
          f.location || '',
        ].join(' ').toLowerCase();
        if (!searchable.includes(q)) return false;
      }
      
      return true;
    });
  }, [facilities, selectedType, selectedRegion, pmjayOnly, hasIcuOnly, searchQuery]);

  // Count facilities per region
  const regionCounts = useMemo(() => {
    const counts: Record<string, number> = { All: facilities.length };
    for (const f of facilities) {
      const r = getRegion(f);
      counts[r] = (counts[r] || 0) + 1;
    }
    return counts;
  }, [facilities]);

  const handleUpdateBeds = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editFacilityId) return;
    
    const formData = new FormData(e.currentTarget);
    const icuUsed = parseInt(formData.get('icuUsed') as string);
    const genUsed = parseInt(formData.get('genUsed') as string);
    
    updateFacility(editFacilityId, {
      icuBedsUsed: icuUsed,
      generalBedsUsed: genUsed
    });
    
    toast.success("Bed capacity updated successfully");
    setEditFacilityId(null);
  };

  const FacilityList = () => (
    <div className="flex flex-col h-full space-y-4">
      {/* Search bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <Input
          type="text"
          placeholder="Search by name, city, area, specialty..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9 h-11 rounded-xl bg-white border-slate-200 focus:ring-teal-500"
        />
      </div>

      <Card className="border-none shadow-sm rounded-2xl bg-white border border-slate-200/60 overflow-hidden">
        <div className="bg-slate-50/80 p-4 border-b border-slate-100 flex items-center gap-2">
          <FilterIcon className="h-4 w-4 text-slate-500" />
          <h3 className="font-semibold text-sm text-slate-700">Filter Network</h3>
          <Badge variant="outline" className="ml-auto text-xs bg-teal-50 text-teal-700 border-teal-200">
            {filteredFacilities.length} of {facilities.length}
          </Badge>
        </div>
        <CardContent className="p-4 space-y-3">
          {/* Region filter */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-slate-500 uppercase">Region</Label>
            <Select value={selectedRegion} onValueChange={(val) => val && setSelectedRegion(val)}>
              <SelectTrigger className="h-10 w-full rounded-xl bg-slate-50/50 border-slate-200">
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

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-slate-500 uppercase">Facility Type</Label>
            <Select value={selectedType} onValueChange={(val) => val && setSelectedType(val)}>
              <SelectTrigger className="h-10 w-full rounded-xl bg-slate-50/50 border-slate-200">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Types</SelectItem>
                <SelectItem value="Tertiary">Tertiary / Super-Specialty</SelectItem>
                <SelectItem value="Government">Government General</SelectItem>
                <SelectItem value="District">District Hospital</SelectItem>
                <SelectItem value="Specialized">Specialized Hospital</SelectItem>
                <SelectItem value="PHC">PHC / Dispensary</SelectItem>
                <SelectItem value="CHC">CHC / Sub-district</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
            <div className="flex items-center space-x-2.5 bg-slate-50/70 p-2.5 rounded-xl border border-slate-100 min-h-[40px]">
              <Checkbox 
                id="pmjay" 
                checked={pmjayOnly} 
                onCheckedChange={(checked) => setPmjayOnly(!!checked)} 
                className="data-[state=checked]:bg-teal-600 data-[state=checked]:border-teal-600"
              />
              <Label htmlFor="pmjay" className="text-xs font-medium cursor-pointer text-slate-700 leading-tight">PM-JAY</Label>
            </div>
            <div className="flex items-center space-x-2.5 bg-slate-50/70 p-2.5 rounded-xl border border-slate-100 min-h-[40px]">
              <Checkbox 
                id="icu" 
                checked={hasIcuOnly} 
                onCheckedChange={(checked) => setHasIcuOnly(!!checked)}
                className="data-[state=checked]:bg-teal-600 data-[state=checked]:border-teal-600" 
              />
              <Label htmlFor="icu" className="text-xs font-medium cursor-pointer text-slate-700 leading-tight">ICU Avail</Label>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4 overflow-y-auto flex-1 pr-1 max-h-[600px] scrollbar-hide">
        {filteredFacilities.length === 0 ? (
          <div className="text-slate-500 text-center py-12 border-2 border-dashed rounded-2xl bg-slate-50/50">
            <Hospital className="h-8 w-8 mx-auto text-slate-400 mb-3" />
            No facilities match your active filters.
          </div>
        ) : (
          filteredFacilities.map((f) => {
            const icuAvail = Math.max(0, f.icuBeds - f.icuBedsUsed);
            const genAvail = Math.max(0, f.generalBeds - f.generalBedsUsed);
            
            const icuPct = f.icuBeds > 0 ? (f.icuBedsUsed / f.icuBeds) * 100 : 0;
            const genPct = f.generalBeds > 0 ? (f.generalBedsUsed / f.generalBeds) * 100 : 0;
            const region = getRegion(f);

            return (
              <Card 
                key={f.id} 
                className={`group shadow-sm hover:shadow-md transition-all duration-200 border-slate-200/60 rounded-2xl bg-white overflow-hidden relative
                  ${selectedFacilityId === f.id ? 'border-teal-400 shadow-md ring-1 ring-teal-400' : ''}`}
                onMouseEnter={() => setSelectedFacilityId(f.id)} 
                onMouseLeave={() => setSelectedFacilityId(undefined)}
              >
                <div className="absolute top-0 bottom-0 left-0 w-1.5 bg-gradient-to-b from-teal-400 to-emerald-600" />
                <CardContent className="p-5 pl-6">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <Link href={`/facilities/${f.id}`}>
                        <h4 className="font-bold text-lg text-slate-900 group-hover:text-teal-700 transition-colors leading-tight mb-1">{f.name}</h4>
                      </Link>
                      <div className="flex items-center text-xs text-slate-500 gap-1.5 flex-wrap">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                        <span>{f.area ? `${f.area}, ` : ''}{f.city || f.district}{f.state !== 'Delhi' ? `, ${f.state}` : ''}</span>
                        <span className="mx-1 text-slate-300">•</span>
                        <Phone className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                        <span>{f.phone}</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <Badge variant="secondary" className="bg-slate-100 text-slate-600 font-medium px-2.5 py-1 whitespace-nowrap">
                        {f.type.replace('_', ' ')}
                      </Badge>
                      {f.rating && (
                        <div className="flex items-center gap-1 text-xs text-amber-600 font-medium">
                          <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                          {f.rating.toFixed(1)}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Region badge + emergency */}
                  <div className="flex items-center gap-1.5 mb-3 flex-wrap">
                    <Badge variant="outline" className="text-[10px] bg-blue-50 text-blue-700 border-blue-200 font-medium">
                      {region}
                    </Badge>
                    {f.emergencyAvailable !== false && (
                      <Badge className="bg-red-50 text-red-600 border border-red-200 text-[10px] gap-1">
                        <Ambulance className="h-3 w-3" /> Emergency
                      </Badge>
                    )}
                  </div>
                  
                  <div className="bg-slate-50/80 rounded-xl p-4 mb-4 border border-slate-100">
                    <div className="flex justify-between items-center mb-3">
                      <h5 className="text-sm font-semibold flex items-center gap-1.5 text-slate-700">
                        <Bed className="h-4 w-4 text-teal-600" /> Bed Availability
                      </h5>
                      <Dialog open={editFacilityId === f.id} onOpenChange={(open) => !open && setEditFacilityId(null)}>
                        <Button variant="ghost" size="sm" className="h-7 text-xs px-2 text-teal-600 hover:text-teal-700 hover:bg-teal-50" onClick={() => setEditFacilityId(f.id)}>
                            <Edit2 className="h-3 w-3 mr-1" /> Edit
                          </Button>
                        <DialogContent className="sm:max-w-[425px] rounded-2xl">
                          <DialogHeader>
                            <DialogTitle className="text-xl">Update Bed Capacity</DialogTitle>
                          </DialogHeader>
                          <form onSubmit={handleUpdateBeds} className="space-y-4 pt-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor="icuUsed" className="text-sm font-medium">ICU Beds Used (Total: {f.icuBeds})</Label>
                                <Input id="icuUsed" name="icuUsed" type="number" min="0" max={f.icuBeds} defaultValue={f.icuBedsUsed} className="h-11 rounded-lg" required />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="genUsed" className="text-sm font-medium">General Beds Used (Total: {f.generalBeds})</Label>
                                <Input id="genUsed" name="genUsed" type="number" min="0" max={f.generalBeds} defaultValue={f.generalBedsUsed} className="h-11 rounded-lg" required />
                              </div>
                            </div>
                            <Button type="submit" className="w-full h-11 rounded-xl bg-teal-600 hover:bg-teal-700 mt-2">
                              Save Changes
                            </Button>
                          </form>
                        </DialogContent>
                      </Dialog>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-xs mb-1 font-medium">
                          <span className="text-slate-600">ICU Beds</span>
                          <span className={icuAvail > 0 ? "text-emerald-600" : "text-rose-600"}>{icuAvail} free / {f.icuBeds} total</span>
                        </div>
                        <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${icuPct > 90 ? 'bg-rose-500' : icuPct > 70 ? 'bg-amber-500' : 'bg-emerald-500'}`} 
                            style={{ width: `${Math.min(100, icuPct)}%` }}
                          />
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-xs mb-1 font-medium">
                          <span className="text-slate-600">General Beds</span>
                          <span className={genAvail > 0 ? "text-blue-600" : "text-rose-600"}>{genAvail} free / {f.generalBeds} total</span>
                        </div>
                        <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${genPct > 90 ? 'bg-rose-500' : genPct > 70 ? 'bg-amber-500' : 'bg-blue-500'}`} 
                            style={{ width: `${Math.min(100, genPct)}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Specialties pills */}
                  {(f.specialties || f.specialists).length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {(f.specialties || f.specialists).slice(0, 5).map((spec) => (
                        <span key={spec} className="text-[10px] bg-blue-50 text-blue-700 border border-blue-100 rounded-full px-2 py-0.5 font-medium">
                          {spec}
                        </span>
                      ))}
                      {(f.specialties || f.specialists).length > 5 && (
                        <span className="text-[10px] text-slate-400 font-medium py-0.5">
                          +{(f.specialties || f.specialists).length - 5} more
                        </span>
                      )}
                    </div>
                  )}
                  
                  <div className="flex flex-wrap gap-2 items-center">
                    {f.pmjayEmpanelled && (
                      <Badge className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs px-2.5 py-0.5 gap-1.5 font-medium shadow-sm">
                        <ShieldCheck className="h-3.5 w-3.5" /> PM-JAY Empanelled
                      </Badge>
                    )}
                    <Link href={`/scheduling?facilityId=${f.id}`} className="ml-auto">
                      <Button size="sm" className="h-7 text-xs bg-teal-600 hover:bg-teal-700 text-white rounded-lg px-3">
                        Book Appointment
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto animate-in fade-in duration-500 pb-12">
      <div className="flex items-center gap-4 border-b pb-6">
        <div className="p-3 bg-teal-100/50 text-teal-600 rounded-xl shadow-sm">
          <Hospital className="h-8 w-8" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Delhi-NCR Hospital Network</h1>
          <p className="text-slate-500 mt-1">Real-time bed availability and hospital discovery across the Delhi-NCR region.</p>
        </div>
        <Badge className="ml-auto bg-teal-600 text-white text-sm px-3 py-1.5 hidden sm:flex">
          {facilities.length} Hospitals
        </Badge>
      </div>

      {/* Desktop Split View */}
      <div className="hidden md:grid md:grid-cols-12 gap-6 min-h-[700px]">
        <div className="md:col-span-5 lg:col-span-4 flex flex-col min-h-0">
          <FacilityList />
        </div>
        <div className="md:col-span-7 lg:col-span-8 border border-slate-200/60 rounded-2xl overflow-hidden relative shadow-sm bg-white">
          <FacilityMapWrapper 
            facilities={filteredFacilities} 
            selectedFacilityId={selectedFacilityId}
          />
        </div>
      </div>

      {/* Mobile Tabbed Layout */}
      <div className="md:hidden">
        <Tabs defaultValue="list" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4 bg-slate-100 p-1 rounded-xl">
            <TabsTrigger value="list" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">List View ({filteredFacilities.length})</TabsTrigger>
            <TabsTrigger value="map" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">Map View</TabsTrigger>
          </TabsList>
          <TabsContent value="list" className="mt-0">
            <FacilityList />
          </TabsContent>
          <TabsContent value="map" className="min-h-[500px] border border-slate-200/60 rounded-2xl overflow-hidden shadow-sm mt-0">
             <FacilityMapWrapper facilities={filteredFacilities} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
