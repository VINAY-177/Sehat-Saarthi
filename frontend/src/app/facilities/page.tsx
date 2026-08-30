"use client";

import React, { useState, useMemo } from 'react';
import { useStore } from '@/lib/store';
import FacilityMapWrapper from '@/components/facility-map-wrapper';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import Link from 'next/link';
import { MapPin, Phone, ShieldCheck, Hospital, Edit2, Bed, Filter as FilterIcon, Search, Star, Ambulance } from 'lucide-react';
import { toast } from 'sonner';

// Region definitions for filtering
const REGIONS = [
  { value: 'All', label: 'All Regions', labelHi: 'सभी क्षेत्र' },
  { value: 'Delhi', label: 'Delhi', labelHi: 'दिल्ली' },
  { value: 'Noida', label: 'Noida', labelHi: 'नोएडा' },
  { value: 'Greater Noida', label: 'Greater Noida', labelHi: 'ग्रेटर नोएडा' },
  { value: 'Ghaziabad', label: 'Ghaziabad', labelHi: 'गाजियाबाद' },
  { value: 'Gurugram', label: 'Gurugram', labelHi: 'गुरुग्राम' },
  { value: 'Faridabad', label: 'Faridabad', labelHi: 'फरीदाबाद' },
] as const;

const HEALTHCARE_SCHEMES = [
  { value: 'All', label: 'All Healthcare Schemes', labelHi: 'सभी स्वास्थ्य योजनाएं' },
  { value: 'DAK', label: 'Delhi Arogya Kosh (DAK)', labelHi: 'दिल्ली आरोग्य कोष (DAK)' },
  { value: 'DFSS', label: 'Delhi Free Surgery Scheme', labelHi: 'दिल्ली मुफ्त सर्जरी योजना' },
  { value: 'DIAG', label: 'Delhi Free Diagnostics (450+ Tests)', labelHi: 'दिल्ली मुफ्त जांच (450+ टेस्ट)' },
  { value: 'DAN', label: 'Delhi Arogya Nidhi (DAN)', labelHi: 'दिल्ली आरोग्य निधि (DAN)' },
  { value: 'PMJAY', label: 'Ayushman Bharat PM-JAY', labelHi: 'आयुष्मान भारत PM-JAY' },
  { value: 'CGHS', label: 'CGHS / ECHS', labelHi: 'CGHS / ECHS' },
  { value: 'JSY', label: 'Janani Suraksha Yojana (JSY)', labelHi: 'जननी सुरक्षा योजना (JSY)' },
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
  const { facilities, updateFacility, language } = useStore();
  const isHindi = language === 'hi';

  const [selectedType, setSelectedType] = useState<string>('All');
  const [selectedRegion, setSelectedRegion] = useState<string>('All');
  const [selectedScheme, setSelectedScheme] = useState<string>('All');
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

      // Scheme filter
      if (selectedScheme !== 'All') {
        if (selectedScheme === 'DAK' && !f.dakEmpanelled && !f.schemes?.some(s => s.includes('DAK') || s.includes('Arogya Kosh'))) return false;
        if (selectedScheme === 'DFSS' && !f.freeSurgeryEmpanelled && !f.schemes?.some(s => s.includes('Free Surgery') || s.includes('DFSS'))) return false;
        if (selectedScheme === 'DIAG' && !f.freeDiagnosticsAvailable && !f.schemes?.some(s => s.includes('Diagnostic') || s.includes('Mohalla') || s.includes('Free Diagnostics'))) return false;
        if (selectedScheme === 'DAN' && !f.danEmpanelled && !f.schemes?.some(s => s.includes('DAN') || s.includes('Arogya Nidhi'))) return false;
        if (selectedScheme === 'PMJAY' && !f.pmjayEmpanelled && !f.schemes?.some(s => s.includes('PM-JAY') || s.includes('Ayushman'))) return false;
        if (selectedScheme === 'CGHS' && !f.cghsEmpanelled && !f.echsEmpanelled && !f.schemes?.some(s => s.includes('CGHS') || s.includes('ECHS'))) return false;
        if (selectedScheme === 'JSY' && !f.jsyAvailable && !f.schemes?.some(s => s.includes('Janani') || s.includes('JSY') || s.includes('Maternity'))) return false;
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
          ...(f.schemes || []),
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
  }, [facilities, selectedType, selectedRegion, selectedScheme, pmjayOnly, hasIcuOnly, searchQuery]);

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
    
    toast.success(isHindi ? "बेड क्षमता सफलतापूर्वक अपडेट की गई" : "Bed capacity updated successfully");
    setEditFacilityId(null);
  };

  const FacilityList = () => (
    <div className="flex flex-col h-full space-y-4">
      {/* Search bar */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <Input
          type="text"
          placeholder={isHindi ? "नाम, शहर, क्षेत्र, विशेषज्ञता से खोजें..." : "Search by name, city, area, specialty..."}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 h-12 rounded-2xl bg-white/95 backdrop-blur-xl border-white/80 shadow-md focus:ring-teal-500 font-medium text-xs text-slate-800"
        />
      </div>

      <div className="glass-panel shadow-xl rounded-[24px] bg-white/92 backdrop-blur-2xl border border-white/80 overflow-hidden">
        <div className="bg-slate-50/80 p-4 border-b border-slate-200/80 flex items-center gap-2">
          <FilterIcon className="h-4 w-4 text-teal-600" />
          <h3 className="font-black text-xs text-slate-800 uppercase tracking-wider">
            {isHindi ? "नेटवर्क फ़िल्टर" : "Filter Network"}
          </h3>
          <Badge variant="outline" className="ml-auto text-xs bg-teal-100/80 text-teal-800 border-teal-300 font-bold">
            {filteredFacilities.length} / {facilities.length}
          </Badge>
        </div>
        <div className="p-4 space-y-3.5">
          {/* Region filter */}
          <div className="space-y-1.5">
            <Label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">{isHindi ? "क्षेत्र" : "Region"}</Label>
            <Select value={selectedRegion} onValueChange={(val) => val && setSelectedRegion(val)}>
              <SelectTrigger className="h-10 w-full rounded-xl bg-white border-slate-200 text-xs font-semibold">
                <SelectValue placeholder={isHindi ? "सभी क्षेत्र" : "All Regions"} />
              </SelectTrigger>
              <SelectContent>
                {REGIONS.map((r) => (
                  <SelectItem key={r.value} value={r.value} className="text-xs font-medium">
                    {isHindi ? r.labelHi : r.label} ({regionCounts[r.value] || 0})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">{isHindi ? "अस्पताल प्रकार" : "Facility Type"}</Label>
            <Select value={selectedType} onValueChange={(val) => val && setSelectedType(val)}>
              <SelectTrigger className="h-10 w-full rounded-xl bg-white border-slate-200 text-xs font-semibold">
                <SelectValue placeholder={isHindi ? "सभी प्रकार" : "All Types"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All" className="text-xs font-medium">{isHindi ? "सभी प्रकार" : "All Types"}</SelectItem>
                <SelectItem value="Tertiary" className="text-xs font-medium">{isHindi ? "तृतीयक / सुपर-स्पेशियलिटी" : "Tertiary / Super-Specialty"}</SelectItem>
                <SelectItem value="Government" className="text-xs font-medium">{isHindi ? "सरकारी अस्पताल" : "Government General"}</SelectItem>
                <SelectItem value="District" className="text-xs font-medium">{isHindi ? "जिला अस्पताल" : "District Hospital"}</SelectItem>
                <SelectItem value="Specialized" className="text-xs font-medium">{isHindi ? "विशिष्ट अस्पताल" : "Specialized Hospital"}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Healthcare Scheme filter */}
          <div className="space-y-1.5">
            <Label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">{isHindi ? "स्वास्थ्य योजना" : "Healthcare Scheme"}</Label>
            <Select value={selectedScheme} onValueChange={(val) => val && setSelectedScheme(val)}>
              <SelectTrigger className="h-10 w-full rounded-xl bg-white border-slate-200 text-xs font-semibold">
                <SelectValue placeholder={isHindi ? "सभी स्वास्थ्य योजनाएं" : "All Healthcare Schemes"} />
              </SelectTrigger>
              <SelectContent>
                {HEALTHCARE_SCHEMES.map((s) => (
                  <SelectItem key={s.value} value={s.value} className="text-xs font-medium">
                    {isHindi ? s.labelHi : s.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
            <div className="flex items-center space-x-2.5 bg-slate-50/80 p-2.5 rounded-xl border border-slate-200/80 min-h-[40px]">
              <Checkbox 
                id="pmjay" 
                checked={pmjayOnly} 
                onCheckedChange={(checked) => setPmjayOnly(!!checked)} 
                className="data-[state=checked]:bg-teal-600 data-[state=checked]:border-teal-600"
              />
              <Label htmlFor="pmjay" className="text-xs font-bold cursor-pointer text-slate-800 leading-tight">PM-JAY</Label>
            </div>
            <div className="flex items-center space-x-2.5 bg-slate-50/80 p-2.5 rounded-xl border border-slate-200/80 min-h-[40px]">
              <Checkbox 
                id="icu" 
                checked={hasIcuOnly} 
                onCheckedChange={(checked) => setHasIcuOnly(!!checked)} 
                className="data-[state=checked]:bg-teal-600 data-[state=checked]:border-teal-600" 
              />
              <Label htmlFor="icu" className="text-xs font-bold cursor-pointer text-slate-800 leading-tight">{isHindi ? "आईसीयू उपलब्ध" : "ICU Avail"}</Label>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4 overflow-y-auto flex-1 pr-1 max-h-[600px] scrollbar-hide">
        {filteredFacilities.length === 0 ? (
          <div className="text-slate-500 text-center py-12 glass-panel rounded-[24px] bg-white/90 font-bold text-xs">
            <Hospital className="h-8 w-8 mx-auto text-slate-400 mb-3" />
            {isHindi ? "फ़िल्टर से मेल खाने वाला कोई अस्पताल नहीं मिला।" : "No facilities match your active filters."}
          </div>
        ) : (
          filteredFacilities.map((f) => {
            const isSelected = selectedFacilityId === f.id;
            const icuAvail = f.icuBeds - f.icuBedsUsed;
            const genAvail = f.generalBeds - f.generalBedsUsed;
            const icuPct = f.icuBeds > 0 ? (f.icuBedsUsed / f.icuBeds) * 100 : 0;
            const genPct = f.generalBeds > 0 ? (f.generalBedsUsed / f.generalBeds) * 100 : 0;
            const region = getRegion(f);

            return (
              <div
                key={f.id}
                onClick={() => setSelectedFacilityId(f.id)}
                className={`glass-panel cursor-pointer transition-all duration-300 rounded-[24px] border overflow-hidden bg-white/92 backdrop-blur-2xl ${
                  isSelected 
                    ? 'border-teal-500 ring-2 ring-teal-500/30 shadow-xl' 
                    : 'border-white/80 hover:border-teal-200 hover:shadow-xl'
                }`}
              >
                <div className="p-5">
                  <div className="flex justify-between items-start mb-2 gap-2">
                    <div>
                      <Link href={`/facilities/${f.id}`}>
                        <h4 className="font-black text-slate-900 text-base hover:text-teal-700 transition-colors leading-tight">
                          {f.name}
                        </h4>
                      </Link>
                      <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-1 font-semibold">
                        <MapPin className="h-3.5 w-3.5 text-teal-600 shrink-0" />
                        <span className="truncate">{f.address || f.location || `${f.district}, ${f.state}`}</span>
                      </p>
                      {f.phone && (
                        <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5 font-semibold">
                          <Phone className="h-3.5 w-3.5 text-teal-600 shrink-0" />
                          <span>{f.phone}</span>
                        </p>
                      )}
                    </div>
                    {f.rating && (
                      <Badge variant="outline" className="bg-amber-50 text-amber-800 border-amber-300 text-xs font-black gap-1 shrink-0 shadow-2xs">
                        <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                        {f.rating.toFixed(1)}
                      </Badge>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-1.5 mb-3">
                    <Badge variant="outline" className="text-[10px] font-bold bg-teal-50 text-teal-800 border-teal-200">
                      {f.type}
                    </Badge>
                    <Badge variant="outline" className="text-[10px] font-bold bg-blue-50 text-blue-700 border-blue-200">
                      {region}
                    </Badge>
                    {f.emergencyAvailable !== false && (
                      <Badge className="bg-red-50 text-red-600 border border-red-200 text-[10px] gap-1">
                        <Ambulance className="h-3 w-3" /> {isHindi ? "24/7 आपातकाल" : "Emergency"}
                      </Badge>
                    )}
                  </div>
                  
                  <div className="bg-slate-50/80 rounded-xl p-4 mb-4 border border-slate-100">
                    <div className="flex justify-between items-center mb-3">
                      <h5 className="text-sm font-semibold flex items-center gap-1.5 text-slate-700">
                        <Bed className="h-4 w-4 text-teal-600" /> {isHindi ? "बेड उपलब्धता" : "Bed Availability"}
                      </h5>
                      <Dialog open={editFacilityId === f.id} onOpenChange={(open) => !open && setEditFacilityId(null)}>
                        <Button variant="ghost" size="sm" className="h-7 text-xs px-2 text-teal-600 hover:text-teal-700 hover:bg-teal-50" onClick={() => setEditFacilityId(f.id)}>
                            <Edit2 className="h-3 w-3 mr-1" /> {isHindi ? "संपादित करें" : "Edit"}
                          </Button>
                        <DialogContent className="sm:max-w-[425px] rounded-2xl">
                          <DialogHeader>
                            <DialogTitle className="text-xl">{isHindi ? "बेड क्षमता अपडेट करें" : "Update Bed Capacity"}</DialogTitle>
                          </DialogHeader>
                          <form onSubmit={handleUpdateBeds} className="space-y-4 pt-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor="icuUsed" className="text-sm font-medium">
                                  {isHindi ? `आईसीयू बेड उपयोग (कुल: ${f.icuBeds})` : `ICU Beds Used (Total: ${f.icuBeds})`}
                                </Label>
                                <Input id="icuUsed" name="icuUsed" type="number" min="0" max={f.icuBeds} defaultValue={f.icuBedsUsed} className="h-11 rounded-lg" required />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="genUsed" className="text-sm font-medium">
                                  {isHindi ? `सामान्य बेड उपयोग (कुल: ${f.generalBeds})` : `General Beds Used (Total: ${f.generalBeds})`}
                                </Label>
                                <Input id="genUsed" name="genUsed" type="number" min="0" max={f.generalBeds} defaultValue={f.generalBedsUsed} className="h-11 rounded-lg" required />
                              </div>
                            </div>
                            <Button type="submit" className="w-full h-11 rounded-xl bg-teal-600 hover:bg-teal-700 mt-2">
                              {isHindi ? "बदलाव सहेजें" : "Save Changes"}
                            </Button>
                          </form>
                        </DialogContent>
                      </Dialog>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-xs mb-1 font-medium">
                          <span className="text-slate-600">{isHindi ? "आईसीयू बेड" : "ICU Beds"}</span>
                          <span className={icuAvail > 0 ? "text-emerald-600" : "text-rose-600"}>
                            {icuAvail} {isHindi ? "उपलब्ध" : "free"} / {f.icuBeds} {isHindi ? "कुल" : "total"}
                          </span>
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
                          <span className="text-slate-600">{isHindi ? "सामान्य बेड" : "General Beds"}</span>
                          <span className={genAvail > 0 ? "text-blue-600" : "text-rose-600"}>
                            {genAvail} {isHindi ? "उपलब्ध" : "free"} / {f.generalBeds} {isHindi ? "कुल" : "total"}
                          </span>
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
                    <div className="flex flex-wrap gap-1.5 mb-2.5">
                      {(f.specialties || f.specialists).slice(0, 5).map((spec) => (
                        <span key={spec} className="text-[10px] bg-blue-50 text-blue-700 border border-blue-100 rounded-full px-2 py-0.5 font-medium">
                          {spec}
                        </span>
                      ))}
                      {(f.specialties || f.specialists).length > 5 && (
                        <span className="text-[10px] text-slate-400 font-medium py-0.5">
                          +{(f.specialties || f.specialists).length - 5} {isHindi ? "अन्य" : "more"}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Delhi & National Healthcare Schemes */}
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {f.dakEmpanelled && (
                      <span className="inline-flex items-center text-[10px] font-black bg-amber-50 text-amber-900 border border-amber-300 rounded-lg px-2 py-0.5 shadow-2xs">
                        ⭐ DAK (₹5L)
                      </span>
                    )}
                    {f.freeSurgeryEmpanelled && (
                      <span className="inline-flex items-center text-[10px] font-black bg-emerald-50 text-emerald-800 border border-emerald-300 rounded-lg px-2 py-0.5 shadow-2xs">
                        ✂️ {isHindi ? "मुफ्त सर्जरी" : "Free Surgery"}
                      </span>
                    )}
                    {f.freeDiagnosticsAvailable && (
                      <span className="inline-flex items-center text-[10px] font-black bg-sky-50 text-sky-800 border border-sky-300 rounded-lg px-2 py-0.5 shadow-2xs">
                        🧪 {isHindi ? "मुफ्त जांच" : "Free Diagnostics"}
                      </span>
                    )}
                    {f.danEmpanelled && (
                      <span className="inline-flex items-center text-[10px] font-bold bg-orange-50 text-orange-800 border border-orange-200 rounded-lg px-2 py-0.5">
                        DAN (₹1.5L)
                      </span>
                    )}
                    {f.cghsEmpanelled && (
                      <span className="inline-flex items-center text-[10px] font-bold bg-purple-50 text-purple-800 border border-purple-200 rounded-lg px-2 py-0.5">
                        CGHS / ECHS
                      </span>
                    )}
                    {f.jsyAvailable && (
                      <span className="inline-flex items-center text-[10px] font-bold bg-pink-50 text-pink-800 border border-pink-200 rounded-lg px-2 py-0.5">
                        JSY
                      </span>
                    )}
                  </div>
                  
                  <div className="flex flex-wrap gap-2 items-center">
                    {f.pmjayEmpanelled && (
                      <Badge className="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs px-2.5 py-0.5 gap-1.5 font-bold shadow-2xs">
                        <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" /> PM-JAY
                      </Badge>
                    )}
                    <Link href={`/scheduling?facilityId=${f.id}`} className="ml-auto">
                      <button type="button" className="btn-3d-primary h-8 text-xs px-3.5 rounded-xl font-bold">
                        {isHindi ? "अपॉइंटमेंट बुक करें" : "Book Appointment"}
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto page-enter pb-16">
      {/* Header Glass Card */}
      <div className="glass-card-auth p-6 sm:p-7 rounded-[28px] border border-white/80 shadow-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white/92 backdrop-blur-2xl section-enter">
        <div className="flex items-center gap-4">
          <div className="p-3.5 bg-gradient-to-br from-teal-500 to-emerald-600 text-white rounded-2xl shadow-md shadow-teal-500/20">
            <Hospital className="h-7 w-7" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
              {isHindi ? "दिल्ली-एनसीआर अस्पताल नेटवर्क" : "Delhi-NCR Hospital Network"}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-semibold mt-1">
              {isHindi
                ? "दिल्ली-एनसीआर क्षेत्र में वास्तविक समय पर बेड उपलब्धता एवं अस्पताल खोज।"
                : "Real-time bed availability and hospital discovery across the Delhi-NCR region."}
            </p>
          </div>
        </div>
        <Badge variant="outline" className="bg-teal-100/80 text-teal-800 border-teal-300 font-extrabold px-3.5 py-1 text-xs gap-1.5 shadow-2xs">
          <span className="w-2.5 h-2.5 rounded-full bg-teal-600 animate-pulse" />
          {facilities.length} {isHindi ? "अस्पताल" : "Hospitals"}
        </Badge>
      </div>

      {/* Desktop Split View */}
      <div className="hidden md:grid md:grid-cols-12 gap-6 min-h-[700px]">
        <div className="md:col-span-5 lg:col-span-4 flex flex-col min-h-0">
          <FacilityList />
        </div>
        <div className="md:col-span-7 lg:col-span-8 glass-panel border border-white/80 rounded-[28px] overflow-hidden relative shadow-2xl bg-white/92 backdrop-blur-2xl">
          <FacilityMapWrapper 
            facilities={filteredFacilities} 
            selectedFacilityId={selectedFacilityId}
          />
        </div>
      </div>

      {/* Mobile Tabbed Layout */}
      <div className="md:hidden">
        <Tabs defaultValue="list" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4 bg-white/90 p-1.5 rounded-2xl border border-white/80 shadow-md">
            <TabsTrigger value="list" className="rounded-xl font-bold text-xs data-[state=active]:bg-teal-600 data-[state=active]:text-white">
              {isHindi ? "सूची दृश्य" : "List View"} ({filteredFacilities.length})
            </TabsTrigger>
            <TabsTrigger value="map" className="rounded-xl font-bold text-xs data-[state=active]:bg-teal-600 data-[state=active]:text-white">
              {isHindi ? "नक्शा दृश्य" : "Map View"}
            </TabsTrigger>
          </TabsList>
          <TabsContent value="list" className="mt-0">
            <FacilityList />
          </TabsContent>
          <TabsContent value="map" className="min-h-[500px] glass-panel border border-white/80 rounded-[28px] overflow-hidden shadow-2xl mt-0 bg-white/92">
             <FacilityMapWrapper facilities={filteredFacilities} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
