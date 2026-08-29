'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import type { FacilityMapItem } from './facility-map';

interface FacilityMapProps {
  facilities: FacilityMapItem[];
  onFacilityClick?: (id: string) => void;
  selectedFacilityId?: string;
  userLocation?: { lat: number; lng: number } | null;
  className?: string;
}

const FacilityMap = dynamic(() => import('./facility-map'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[400px] bg-muted animate-pulse flex items-center justify-center">
      <span className="text-muted-foreground">Loading Map...</span>
    </div>
  ),
});

export default function FacilityMapWrapper(props: FacilityMapProps) {
  return <FacilityMap {...props} />;
}
