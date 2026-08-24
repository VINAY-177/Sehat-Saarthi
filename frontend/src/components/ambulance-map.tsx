"use client";

import { useEffect } from "react";
import L from "leaflet";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";
import { Ambulance, AmbulanceStatus } from "@/lib/types";

// Custom icons based on status
const createIcon = (color: string) => {
  return new L.DivIcon({
    className: "custom-ambulance-icon",
    html: `<div style="background-color: ${color}; width: 22px; height: 22px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 5px rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; color: white; font-size: 10px; font-weight: bold;">+</div>`,
    iconSize: [22, 22],
    iconAnchor: [11, 11],
  });
};

const iconAvailable = createIcon("#10b981"); // Emerald
const iconDispatched = createIcon("#f59e0b"); // Amber
const iconEnRoute = createIcon("#ef4444"); // Red

function MapEffect({ ambulances }: { ambulances: Ambulance[] }) {
  const map = useMap();
  useEffect(() => {
    if (ambulances.length > 0) {
      const bounds = L.latLngBounds(ambulances.map((a) => [a.lat, a.lng]));
      map.fitBounds(bounds, { padding: [40, 40] });
    }
  }, [map, ambulances]);
  return null;
}

interface AmbulanceMapProps {
  ambulances: Ambulance[];
}

export default function AmbulanceMap({ ambulances }: AmbulanceMapProps) {
  return (
    <div className="h-[400px] w-full rounded-2xl border border-slate-200 overflow-hidden shadow-inner">
      <MapContainer
        center={[28.6139, 77.2090]} // Delhi center
        zoom={12}
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {ambulances.map((amb) => {
          let icon = iconAvailable;
          if (amb.status === AmbulanceStatus.DISPATCHED) {
            icon = iconDispatched;
          } else if (amb.status === AmbulanceStatus.EN_ROUTE) {
            icon = iconEnRoute;
          }

          return (
            <Marker key={amb.id} position={[amb.lat, amb.lng]} icon={icon}>
              <Popup>
                <div className="p-1 min-w-[150px]">
                  <div className="font-bold text-sm">{amb.vehicleNo}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    Status: <span className="font-semibold text-foreground">{amb.status}</span>
                  </div>
                  <div className="text-[11px] text-muted-foreground mt-1">
                    GPS: {amb.lat.toFixed(4)}, {amb.lng.toFixed(4)}
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
        <MapEffect ambulances={ambulances} />
      </MapContainer>
    </div>
  );
}
