'use client';
// Note: This component should ONLY be imported via dynamic(() => import('./facility-map'), { ssr: false }) in parent components.

import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import 'leaflet-defaulticon-compatibility';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

export interface FacilityMapItem {
  id: string;
  name: string;
  type: string;
  district: string;
  state?: string;
  location?: string;
  phone?: string | null;
  lat?: number;
  lng?: number;
  totalBeds?: number;
  availableBeds?: number;
  icuBeds?: number;
  availableIcu?: number;
  generalBeds?: number;
  generalBedsUsed?: number;
  pmjayEmpanelled?: boolean;
  // Phase 4 NCR fields
  city?: string;
  area?: string;
  address?: string;
  rating?: number;
  emergencyAvailable?: boolean;
  specialists?: string[];
  specialties?: string[] | string;
}

interface FacilityMapProps {
  facilities: FacilityMapItem[];
  onFacilityClick?: (id: string) => void;
  selectedFacilityId?: string;
  className?: string;
}

export default function FacilityMap({ facilities, onFacilityClick, selectedFacilityId, className }: FacilityMapProps) {
  // Center on Delhi-NCR region to show the full network
  const defaultCenter: [number, number] = [28.57, 77.25];
  const center = facilities.length > 0 && selectedFacilityId
    ? (() => {
        const found = facilities.find(f => f.id === selectedFacilityId);
        return (found && found.lat && found.lng) ? [found.lat, found.lng] as [number, number] : defaultCenter;
      })()
    : defaultCenter;

  const defaultZoom = selectedFacilityId ? 13 : 10;

  return (
    <div className={`w-full h-full min-h-[420px] z-0 rounded-2xl overflow-hidden border border-slate-200 shadow-inner ${className || ''}`}>
      <MapContainer center={center} zoom={defaultZoom} style={{ height: '100%', width: '100%', minHeight: '420px' }} scrollWheelZoom={true}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {facilities.map((facility, idx) => {
          const lat = facility.lat || (28.6139 + (idx % 4 - 2) * 0.04);
          const lng = facility.lng || (77.2090 + (Math.floor(idx / 4) - 1) * 0.04);
          const icuAvail = facility.availableIcu !== undefined ? facility.availableIcu : Math.max(0, (facility.icuBeds || 0) - (facility.generalBedsUsed || 0));
          const genAvail = facility.availableBeds !== undefined ? facility.availableBeds : Math.max(0, (facility.generalBeds || 0) - (facility.generalBedsUsed || 0));
          const rawSpecs = facility.specialties || facility.specialists || [];
          const specList = Array.isArray(rawSpecs) ? rawSpecs : typeof rawSpecs === 'string' ? (rawSpecs as string).split(',') : [];
          const displayCity = facility.city || facility.district || '';
          const displayArea = facility.area || '';
          const hasEmergency = facility.emergencyAvailable !== false;

          return (
            <Marker 
              key={facility.id || `marker-${idx}`} 
              position={[lat, lng]}
              eventHandlers={{
                click: () => onFacilityClick?.(facility.id)
              }}
            >
              <Popup maxWidth={320} minWidth={260}>
                <div className="flex flex-col gap-2 p-1 min-w-[240px]">
                  {/* Header */}
                  <span className="font-bold text-sm text-slate-900 leading-snug">{facility.name}</span>
                  
                  {/* Type + Emergency + Rating badges */}
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <Badge variant="outline" className="text-[10px] font-bold bg-teal-50 text-teal-800 border-teal-200">
                      {facility.type}
                    </Badge>
                    {hasEmergency && (
                      <Badge className="bg-red-500 text-white text-[10px] px-1.5 py-0">
                        🚨 Emergency
                      </Badge>
                    )}
                    {facility.pmjayEmpanelled && (
                      <Badge className="bg-emerald-600 text-white text-[10px] px-1.5 py-0">
                        PM-JAY
                      </Badge>
                    )}
                    {facility.rating && (
                      <Badge variant="outline" className="text-[10px] font-bold bg-amber-50 text-amber-700 border-amber-200">
                        ⭐ {facility.rating.toFixed(1)}
                      </Badge>
                    )}
                  </div>

                  {/* Location info */}
                  <div className="text-xs text-slate-600 space-y-0.5">
                    {(displayArea || displayCity) && (
                      <div className="font-medium text-slate-700">
                        📍 {displayArea}{displayArea && displayCity ? ', ' : ''}{displayCity}{facility.state && facility.state !== 'Delhi' ? `, ${facility.state}` : ''}
                      </div>
                    )}
                    <div className="text-slate-500">
                      {facility.address || facility.location || `${facility.district}, ${facility.state || 'Delhi'}`}
                    </div>
                  </div>
                  
                  {/* Bed availability */}
                  <div className="pt-1 font-bold text-slate-800 flex justify-between border-t border-slate-100 text-xs">
                    <span>ICU: <strong className="text-red-600">{icuAvail}</strong> free</span>
                    <span>Gen: <strong className="text-emerald-600">{genAvail}</strong> free</span>
                  </div>

                  {/* Specialties pills */}
                  {specList.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {specList.slice(0, 4).map((spec) => (
                        <span key={spec} className="text-[9px] bg-blue-50 text-blue-700 border border-blue-100 rounded-full px-1.5 py-0.5 font-medium">
                          {spec}
                        </span>
                      ))}
                      {specList.length > 4 && (
                        <span className="text-[9px] text-slate-500 font-medium py-0.5">
                          +{specList.length - 4} more
                        </span>
                      )}
                    </div>
                  )}

                  {/* Contact + Action buttons */}
                  <div className="flex gap-1.5 mt-1">
                    {facility.phone && (
                      <a href={`tel:${facility.phone}`} className="flex-1">
                        <Button size="sm" variant="outline" className="w-full h-7 text-[10px] font-bold border-slate-200 text-slate-600 hover:bg-slate-50">
                          📞 {facility.phone}
                        </Button>
                      </a>
                    )}
                  </div>
                  <div className="flex gap-1.5">
                    <Link href={`/facilities/${facility.id}`} className="flex-1">
                      <Button size="sm" variant="outline" className="w-full h-7 text-[10px] font-bold border-teal-300 text-teal-700 hover:bg-teal-50">
                        View Hospital
                      </Button>
                    </Link>
                    <Link href={`/scheduling?facilityId=${facility.id}`} className="flex-1">
                      <Button size="sm" className="w-full h-7 text-[10px] font-bold bg-teal-600 hover:bg-teal-700 text-white">
                        Book Appointment
                      </Button>
                    </Link>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
