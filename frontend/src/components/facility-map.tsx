'use client';
// Note: This component should ONLY be imported via dynamic(() => import('./facility-map'), { ssr: false }) in parent components.

import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import 'leaflet-defaulticon-compatibility';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

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
}

interface FacilityMapProps {
  facilities: FacilityMapItem[];
  onFacilityClick?: (id: string) => void;
  selectedFacilityId?: string;
  className?: string;
}

export default function FacilityMap({ facilities, onFacilityClick, selectedFacilityId, className }: FacilityMapProps) {
  // Default to Delhi Center
  const defaultCenter: [number, number] = [28.6139, 77.2090];
  const center = facilities.length > 0 && selectedFacilityId
    ? (() => {
        const found = facilities.find(f => f.id === selectedFacilityId);
        return (found && found.lat && found.lng) ? [found.lat, found.lng] as [number, number] : defaultCenter;
      })()
    : defaultCenter;

  return (
    <div className={`w-full h-full min-h-[420px] z-0 rounded-2xl overflow-hidden border border-slate-200 shadow-inner ${className || ''}`}>
      <MapContainer center={center} zoom={11} style={{ height: '100%', width: '100%', minHeight: '420px' }} scrollWheelZoom={true}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {facilities.map((facility, idx) => {
          const lat = facility.lat || (28.6139 + (idx % 4 - 2) * 0.04);
          const lng = facility.lng || (77.2090 + (Math.floor(idx / 4) - 1) * 0.04);
          const icuAvail = facility.availableIcu !== undefined ? facility.availableIcu : Math.max(0, (facility.icuBeds || 0) - (facility.generalBedsUsed || 0));
          const genAvail = facility.availableBeds !== undefined ? facility.availableBeds : Math.max(0, (facility.generalBeds || 0) - (facility.generalBedsUsed || 0));

          return (
            <Marker 
              key={facility.id || `marker-${idx}`} 
              position={[lat, lng]}
              eventHandlers={{
                click: () => onFacilityClick?.(facility.id)
              }}
            >
              <Popup>
                <div className="flex flex-col gap-2 p-1 min-w-[220px]">
                  <span className="font-bold text-sm text-slate-900 leading-snug">{facility.name}</span>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <Badge variant="outline" className="text-[10px] font-bold bg-teal-50 text-teal-800 border-teal-200">
                      {facility.type}
                    </Badge>
                    <Badge className="bg-emerald-600 text-white text-[10px] px-1.5 py-0">
                      PM-JAY
                    </Badge>
                  </div>
                  <div className="text-xs text-slate-600 space-y-1 mt-1">
                    <div>{facility.location || `${facility.district}, ${facility.state || "Delhi"}`}</div>
                    <div className="pt-1 font-bold text-slate-800 flex justify-between border-t border-slate-100">
                      <span>ICU: <strong className="text-red-600">{icuAvail}</strong> free</span>
                      <span>Gen: <strong className="text-emerald-600">{genAvail}</strong> free</span>
                    </div>
                  </div>
                  {facility.phone && (
                    <a href={`tel:${facility.phone}`} className="mt-1">
                      <Button size="sm" variant="outline" className="w-full h-7 text-xs font-bold border-teal-300 text-teal-700 hover:bg-teal-50">
                        📞 Call {facility.phone}
                      </Button>
                    </a>
                  )}
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
