'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { useStore } from '@/lib/store';
import { Role } from '@/lib/types';
import Link from 'next/link';
import { ArrowLeft, Phone, MapPin, ShieldCheck, Stethoscope } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BedDashboard } from '@/components/bed-dashboard';
import { BloodStockGrid } from '@/components/blood-stock-grid';
import FacilityMapWrapper from '@/components/facility-map-wrapper';
import { Card, CardContent } from '@/components/ui/card';
import { UrgencyBadge } from '@/components/urgency-badge';

export default function FacilityDetailPage() {
  const params = useParams();
  const id = params.id as string;
  
  const { facilities, role, updateFacility, referrals, patients } = useStore();
  const facility = facilities.find((f) => f.id === id);
  
  if (!facility) {
    return (
      <div className="py-12 text-center space-y-4">
        <h2 className="text-2xl font-bold">Facility not found</h2>
        <p className="text-muted-foreground">The requested healthcare center is not registered in the system.</p>
        <Link href="/facilities">
          <Button variant="outline"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Facilities</Button>
        </Link>
      </div>
    );
  }

  const isStaff = role === Role.HOSPITAL_STAFF;
  const facilityReferrals = referrals.filter((r) => r.toFacilityId === id);

  return (
    <div className="space-y-6 max-w-6xl">
      {isStaff && (
        <div className="bg-primary/10 border border-primary/20 text-primary px-4 py-3 rounded-lg text-sm font-medium flex items-center justify-between">
          <span className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Staff Admin Mode Active — You can adjust bed counts and blood bank stock in real-time.
          </span>
          <Badge variant="outline" className="text-xs bg-background">Live Editing</Badge>
        </div>
      )}

      <div>
        <Link 
          href="/facilities" 
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-3"
        >
          <ArrowLeft className="mr-1 h-4 w-4" /> Back to facility list
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <h1 className="text-3xl font-bold tracking-tight">{facility.name}</h1>
              <Badge variant="outline" className="text-sm">{facility.type.replace('_', ' ')}</Badge>
              {facility.pmjayEmpanelled && (
                <Badge className="bg-emerald-600 text-white text-xs gap-1">
                  <ShieldCheck className="h-3 w-3" /> PM-JAY Empanelled
                </Badge>
              )}
            </div>
            <div className="flex flex-wrap items-center text-sm text-muted-foreground gap-4">
              <span className="flex items-center"><MapPin className="h-4 w-4 mr-1 text-primary" /> {facility.district}, {facility.state}</span>
              <span className="flex items-center"><Phone className="h-4 w-4 mr-1" /> {facility.phone}</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link href={`/scheduling?facilityId=${facility.id}`}>
              <Button className="bg-teal-600 hover:bg-teal-700 text-white font-semibold">
                Book Appointment
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full sm:w-auto grid-cols-3 max-w-md">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="resources">Beds &amp; Resources</TabsTrigger>
          <TabsTrigger value="referrals">Referrals ({facilityReferrals.length})</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6 mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardContent className="p-6 space-y-5">
                <div>
                  <h3 className="font-semibold text-sm uppercase text-muted-foreground tracking-wider mb-3 flex items-center gap-1.5">
                    <Stethoscope className="h-4 w-4 text-primary" />
                    Specialists &amp; Medical Staff
                  </h3>
                  {facility.specialists.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {facility.specialists.map((spec) => (
                        <Badge key={spec} variant="secondary" className="py-1 px-2.5 text-xs">
                          {spec}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">General duty staff on call.</p>
                  )}
                </div>

                <div className="pt-4 border-t space-y-2 text-sm">
                  <h4 className="font-semibold text-slate-900">Supported Healthcare Schemes</h4>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {(facility.schemes || ["PM-JAY (Ayushman Bharat)", "Free Essential Diagnostics", "Janani Suraksha Yojana"]).map((sc) => (
                      <Badge key={sc} variant="outline" className="bg-teal-50/80 text-teal-900 border-teal-300 text-xs font-bold py-1 px-2.5">
                        {sc}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t space-y-2 text-sm">
                  <h4 className="font-semibold text-slate-900">Facility Highlights</h4>
                  <ul className="space-y-1 text-xs text-muted-foreground">
                    <li>• Emergency triage capabilities and direct referral intake</li>
                    <li>• 100% Cashless emergency trauma under Farishte Dilli Ke &amp; DAK</li>
                    <li>• Connected to 108 Emergency Ambulance dispatch network</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <div className="border rounded-lg overflow-hidden h-[300px] lg:h-auto min-h-[300px]">
              <FacilityMapWrapper facilities={[facility]} selectedFacilityId={facility.id} />
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="resources" className="space-y-8 mt-4">
          <section>
            <BedDashboard 
              facility={facility} 
              editable={isStaff} 
              onUpdate={(updates) => updateFacility(facility.id, updates)} 
            />
          </section>
          
          <section>
            <BloodStockGrid 
              bloodStock={facility.bloodStock} 
              editable={isStaff} 
              onUpdate={(newStock) => updateFacility(facility.id, { bloodStock: newStock })}
            />
          </section>
        </TabsContent>
        
        <TabsContent value="referrals" className="mt-4">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Incoming Patient Referrals</h3>
              {facilityReferrals.length === 0 ? (
                <p className="text-muted-foreground text-center py-10">No incoming referrals currently routed to this facility.</p>
              ) : (
                <div className="space-y-3">
                  {facilityReferrals.map((ref) => {
                    const patient = patients.find((p) => p.id === ref.patientId);
                    return (
                      <div key={ref.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 border rounded-lg bg-card gap-3">
                        <div>
                          <div className="font-semibold text-base">{patient?.name || ref.patientName}</div>
                          <div className="text-xs text-muted-foreground mt-0.5">Reason: {ref.reason}</div>
                          <div className="text-xs text-muted-foreground mt-0.5">
                            Created: {new Date(ref.createdAt).toLocaleString()}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <UrgencyBadge urgency={ref.urgency} size="sm" />
                          <Badge variant="outline">{ref.status}</Badge>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
