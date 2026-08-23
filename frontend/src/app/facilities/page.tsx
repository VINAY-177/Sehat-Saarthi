"use client";

import React, { useState } from 'react';
import { useStore } from '@/lib/store';
import { FacilityType } from '@/lib/types';
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
import { MapPin, Phone, ShieldCheck, Hospital, Edit2, Bed } from 'lucide-react';
import { toast } from 'sonner';

export default function FacilitiesPage() {
  const { facilities, updateFacility } = useStore();
  const [selectedType, setSelectedType] = useState<string>('All');
  const [pmjayOnly, setPmjayOnly] = useState(false);
  const [hasIcuOnly, setHasIcuOnly] = useState(false);
  const [selectedFacilityId, setSelectedFacilityId] = useState<string | undefined>();
  const [editFacilityId, setEditFacilityId] = useState<string | null>(null);

  const filteredFacilities = facilities.filter((f) => {
    if (selectedType !== 'All' && f.type !== selectedType) return false;
    if (pmjayOnly && !f.pmjayEmpanelled) return false;
    if (hasIcuOnly && (f.icuBeds - f.icuBedsUsed) <= 0) return false;
    return true;
  });

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
      <Card className="border-none shadow-sm rounded-2xl bg-white border border-slate-200/60 overflow-hidden">
        <div className="bg-slate-50/80 p-4 border-b border-slate-100 flex items-center gap-2">
          <FilterIcon className="h-4 w-4 text-slate-500" />
          <h3 className="font-semibold text-sm text-slate-700">Filter Network</h3>
        </div>
        <CardContent className="p-4 grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
          <div className="space-y-2">
            <Label className="text-xs font-semibold text-slate-500 uppercase">Facility Type</Label>
            <Select value={selectedType} onValueChange={(val) => val && setSelectedType(val)}>
              <SelectTrigger className="h-10 rounded-xl bg-slate-50/50 border-slate-200">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Types</SelectItem>
                <SelectItem value={FacilityType.SEHAT_MANDIR}>SEHAT Mandir</SelectItem>
                <SelectItem value={FacilityType.PHC}>PHC</SelectItem>
                <SelectItem value={FacilityType.CHC}>CHC</SelectItem>
                <SelectItem value={FacilityType.DISTRICT_HOSPITAL}>District Hospital</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center space-x-2 pb-2.5 bg-slate-50/50 p-2.5 rounded-xl border border-slate-100 h-10">
            <Checkbox 
              id="pmjay" 
              checked={pmjayOnly} 
              onCheckedChange={(checked) => setPmjayOnly(!!checked)} 
              className="data-[state=checked]:bg-teal-600 data-[state=checked]:border-teal-600"
            />
            <Label htmlFor="pmjay" className="text-sm font-medium cursor-pointer text-slate-700 flex-1">PM-JAY Empanelled</Label>
          </div>
          <div className="flex items-center space-x-2 pb-2.5 bg-slate-50/50 p-2.5 rounded-xl border border-slate-100 h-10">
            <Checkbox 
              id="icu" 
              checked={hasIcuOnly} 
              onCheckedChange={(checked) => setHasIcuOnly(!!checked)}
              className="data-[state=checked]:bg-teal-600 data-[state=checked]:border-teal-600" 
            />
            <Label htmlFor="icu" className="text-sm font-medium cursor-pointer text-slate-700 flex-1">ICU Beds Available</Label>
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
                      <div className="flex items-center text-xs text-slate-500 gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span>{f.district}, {f.state}</span>
                        <span className="mx-1 text-slate-300">•</span>
                        <Phone className="w-3.5 h-3.5 text-slate-400" />
                        <span>{f.phone}</span>
                      </div>
                    </div>
                    <Badge variant="secondary" className="bg-slate-100 text-slate-600 font-medium px-2.5 py-1 whitespace-nowrap">
                      {f.type.replace('_', ' ')}
                    </Badge>
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
                  
                  <div className="flex flex-wrap gap-2 items-center">
                    {f.pmjayEmpanelled && (
                      <Badge className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs px-2.5 py-0.5 gap-1.5 font-medium shadow-sm">
                        <ShieldCheck className="h-3.5 w-3.5" /> PM-JAY Empanelled
                      </Badge>
                    )}
                    {f.specialists.length > 0 && (
                      <Badge variant="outline" className="text-xs bg-white text-slate-600 border-slate-200 shadow-sm px-2.5">
                        {f.specialists.length} Specialists
                      </Badge>
                    )}
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
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Facilities & Bed Management</h1>
          <p className="text-slate-500 mt-1">Real-time bed availability and intelligence across network.</p>
        </div>
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

// Simple Filter Icon for UI
function FilterIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
    </svg>
  )
}
