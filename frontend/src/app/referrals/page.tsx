'use client';

import React, { useState } from 'react';
import { useStore } from '@/lib/store';
import { Role, ReferralStatus, Urgency, Referral } from '@/lib/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowRight, Plus, FileText, Ambulance, CheckCircle2, Clock, AlertCircle, Building2 } from 'lucide-react';
import Link from 'next/link';
import { UrgencyBadge } from '@/components/urgency-badge';
import { ClinicalReferralSlipModal } from '@/components/clinical-referral-slip';
import { toast } from 'sonner';

export default function ReferralsPage() {
  const { referrals, updateReferralStatus, patients, facilities, role, addReferral } = useStore();
  const isStaff = role === Role.HOSPITAL_STAFF;

  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [selectedPatientId, setSelectedPatientId] = useState<string>('');
  const [selectedFacilityId, setSelectedFacilityId] = useState<string>('');
  const [urgency, setUrgency] = useState<Urgency>(Urgency.HIGH);
  const [reason, setReason] = useState<string>('');
  
  // Slip Modal state
  const [selectedReferralForSlip, setSelectedReferralForSlip] = useState<Referral | null>(null);

  const activeReferrals = referrals.filter(r => 
    [ReferralStatus.PENDING, ReferralStatus.ACCEPTED, ReferralStatus.EN_ROUTE].includes(r.status)
  );
  const completedReferrals = referrals.filter(r => r.status === ReferralStatus.ARRIVED);

  const getStatusBadge = (status: ReferralStatus) => {
    switch (status) {
      case ReferralStatus.PENDING: 
        return <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200 border-none px-3 py-1 font-medium"><Clock className="w-3 h-3 mr-1"/> Pending</Badge>;
      case ReferralStatus.ACCEPTED: 
        return <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border-none px-3 py-1 font-medium"><CheckCircle2 className="w-3 h-3 mr-1"/> Accepted</Badge>;
      case ReferralStatus.EN_ROUTE: 
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200 border-none px-3 py-1 font-medium"><Ambulance className="w-3 h-3 mr-1"/> En Route</Badge>;
      case ReferralStatus.ARRIVED: 
        return <Badge className="bg-teal-100 text-teal-800 hover:bg-teal-200 border-none px-3 py-1 font-medium"><Building2 className="w-3 h-3 mr-1"/> Arrived</Badge>;
      default: 
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const handleCreateReferral = async () => {
    if (!selectedPatientId || !selectedFacilityId || !reason.trim()) {
      toast.error('Please select patient, destination facility, and state referral reason.');
      return;
    }

    const patient = patients.find(p => p.id === selectedPatientId);
    const toFac = facilities.find(f => f.id === selectedFacilityId);

    const newRef = await addReferral({
      patientId: selectedPatientId,
      patientName: patient?.name || 'Unknown Patient',
      fromFacilityId: null,
      toFacilityId: selectedFacilityId,
      toFacilityName: toFac?.name || 'Unknown Facility',
      status: ReferralStatus.PENDING,
      urgency,
      ambulanceId: null,
      reason,
    });

    toast.success('Referral created successfully.');
    setCreateDialogOpen(false);
    setSelectedPatientId('');
    setSelectedFacilityId('');
    setReason('');
    
    // Automatically preview slip
    if (newRef) {
      setSelectedReferralForSlip(newRef);
    }
  };

  const renderActionButtons = (referralId: string, currentStatus: ReferralStatus) => {
    if (!isStaff) return null;

    if (currentStatus === ReferralStatus.PENDING) {
      return (
        <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm" onClick={() => updateReferralStatus(referralId, ReferralStatus.ACCEPTED)}>
          Accept Referral
        </Button>
      );
    }
    if (currentStatus === ReferralStatus.ACCEPTED) {
      return (
        <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm" onClick={() => updateReferralStatus(referralId, ReferralStatus.EN_ROUTE)}>
          Mark En Route
        </Button>
      );
    }
    if (currentStatus === ReferralStatus.EN_ROUTE) {
      return (
        <Button size="sm" className="bg-teal-600 hover:bg-teal-700 text-white shadow-sm" onClick={() => updateReferralStatus(referralId, ReferralStatus.ARRIVED)}>
          Mark Arrived
        </Button>
      );
    }
    return null;
  };

  const ReferralList = ({ items, emptyMsg }: { items: typeof referrals, emptyMsg: string }) => {
    if (items.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-16 text-center border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
          <div className="bg-white p-4 rounded-full shadow-sm mb-4">
            <AlertCircle className="h-8 w-8 text-slate-300" />
          </div>
          <p className="text-slate-500 font-medium">{emptyMsg}</p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {items.map(ref => {
          const patient = patients.find(p => p.id === ref.patientId);
          const fromFacility = facilities.find(f => f.id === ref.fromFacilityId);
          const toFacility = facilities.find(f => f.id === ref.toFacilityId);

          return (
            <div key={ref.id} className="glass-panel overflow-hidden shadow-xl border border-white/80 rounded-[24px] bg-white/92 backdrop-blur-2xl card-hover">
              <div className="p-0">
                <div className="flex flex-col md:flex-row">
                  <div className="p-6 flex-1 space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <Link href={`/patients/${ref.patientId}`} className="text-xl font-black hover:text-teal-700 transition-colors text-slate-900">
                          {patient?.name || ref.patientName}
                        </Link>
                        <UrgencyBadge urgency={ref.urgency} size="sm" />
                      </div>
                      {getStatusBadge(ref.status)}
                    </div>
                    
                    <div className="flex items-center flex-wrap gap-3 bg-slate-50/80 p-3 rounded-xl border border-slate-200/80">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-slate-400" />
                        <span className="text-xs font-bold text-slate-700">
                          {fromFacility ? fromFacility.name : 'Community Intake'}
                        </span>
                      </div>
                      <ArrowRight className="h-4 w-4 text-teal-600" />
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-teal-600" />
                        <span className="font-extrabold text-xs text-teal-800">
                          {toFacility?.name || ref.toFacilityName}
                        </span>
                      </div>
                    </div>

                    <div className="text-xs text-slate-700 bg-white/90 border border-slate-200/80 p-3.5 rounded-xl font-medium">
                      <span className="font-extrabold text-slate-900 mb-1 block text-[11px] uppercase tracking-wider">Clinical Reason</span>
                      {ref.reason}
                    </div>
                  </div>
                  
                  <div className="bg-slate-50/80 border-t md:border-t-0 md:border-l border-slate-200/80 p-6 flex flex-row md:flex-col items-center md:justify-center gap-3 shrink-0 md:w-48">
                    <button 
                      type="button"
                      className="btn-3d-glass w-full h-10 text-xs font-bold text-slate-800 rounded-xl"
                      onClick={() => setSelectedReferralForSlip(ref)}
                    >
                      <FileText className="h-4 w-4 mr-1.5 text-teal-600 inline" />
                      View Slip
                    </button>
                    <div className="w-full">
                      {renderActionButtons(ref.id, ref.status)}
                    </div>
                    <div className="text-[11px] text-slate-400 font-bold text-center mt-auto md:mt-4">
                      {new Date(ref.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const activeSlipPatient = selectedReferralForSlip ? patients.find(p => p.id === selectedReferralForSlip.patientId) : undefined;
  const activeSlipFacility = selectedReferralForSlip ? facilities.find(f => f.id === selectedReferralForSlip.toFacilityId) : undefined;

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16 page-enter">
      {/* Header section */}
      <div className="glass-card-auth p-6 sm:p-7 rounded-[28px] border border-white/80 shadow-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white/92 backdrop-blur-2xl section-enter">
        <div className="flex items-center gap-4">
          <div className="p-3.5 bg-gradient-to-br from-teal-500 to-emerald-600 text-white rounded-2xl shadow-md shadow-teal-500/20">
            <Ambulance size={32} strokeWidth={2} />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">Referral Management</h1>
            <p className="text-slate-500 mt-1 text-xs sm:text-sm font-semibold">Coordinate inter-facility transfers and triage</p>
          </div>
        </div>
        <button 
          type="button"
          onClick={() => setCreateDialogOpen(true)} 
          className="btn-3d-primary h-11 px-5 rounded-2xl text-xs font-black gap-2"
        >
          <Plus className="h-4 w-4" /> <span>New Referral</span>
        </button>
      </div>

      <div className="w-full">
        <Tabs defaultValue="active" className="w-full">
          <div className="flex items-center justify-between mb-4">
            <TabsList className="glass-panel p-1 rounded-2xl border border-white/80 bg-white/90 shadow-md h-auto">
              <TabsTrigger value="active" className="rounded-xl px-5 py-2 text-xs font-bold data-[state=active]:bg-teal-700 data-[state=active]:text-white transition-all">
                Active Referrals
                <Badge variant="secondary" className="ml-2 bg-white/90 text-teal-800 font-extrabold">{activeReferrals.length}</Badge>
              </TabsTrigger>
              <TabsTrigger value="completed" className="rounded-xl px-5 py-2 text-xs font-bold data-[state=active]:bg-teal-700 data-[state=active]:text-white transition-all">
                Completed
                <Badge variant="secondary" className="ml-2 bg-white/90 text-teal-800 font-extrabold">{completedReferrals.length}</Badge>
              </TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="active" className="m-0 focus-visible:outline-none focus-visible:ring-0">
            <ReferralList items={activeReferrals} emptyMsg="No active referrals currently in progress." />
          </TabsContent>
          
          <TabsContent value="completed" className="m-0 focus-visible:outline-none focus-visible:ring-0">
            <ReferralList items={completedReferrals} emptyMsg="No completed referrals recorded yet." />
          </TabsContent>
        </Tabs>
      </div>

      {/* Create Referral Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="max-w-md sm:max-w-lg rounded-2xl overflow-hidden p-0 border-0 shadow-2xl">
          <div className="bg-gradient-to-r from-teal-600 to-emerald-600 p-6 text-white">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-white flex items-center gap-2">
                <Plus className="h-6 w-6 opacity-80" />
                Initiate Referral
              </DialogTitle>
              <DialogDescription className="text-teal-50">
                Create a new inter-facility patient transfer request.
              </DialogDescription>
            </DialogHeader>
          </div>

          <div className="p-6 space-y-5 bg-slate-50">
            <div className="space-y-2">
              <Label className="text-slate-700 font-semibold">Select Patient</Label>
              <Select value={selectedPatientId} onValueChange={(val) => val && setSelectedPatientId(val)}>
                <SelectTrigger className="bg-white border-slate-200 shadow-sm h-11">
                  <SelectValue placeholder="Choose a registered patient" />
                </SelectTrigger>
                <SelectContent>
                  {patients.map(p => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.name} ({p.age}y, {p.village})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-slate-700 font-semibold">Destination Facility</Label>
              <Select value={selectedFacilityId} onValueChange={(val) => val && setSelectedFacilityId(val)}>
                <SelectTrigger className="bg-white border-slate-200 shadow-sm h-11">
                  <SelectValue placeholder="Choose hospital or CHC" />
                </SelectTrigger>
                <SelectContent className="max-h-72">
                  {facilities.map(f => {
                    const icuFree = Math.max(0, f.icuBeds - f.icuBedsUsed);
                    const genFree = Math.max(0, f.generalBeds - f.generalBedsUsed);
                    return (
                      <SelectItem key={f.id} value={f.id}>
                        <div className="flex flex-col text-left py-0.5">
                          <span className="font-semibold text-slate-900 leading-snug">{f.name}</span>
                          <span className="text-[11px] text-slate-500 font-medium">
                            {f.district} • ICU: {icuFree} beds free • Gen: {genFree} beds free
                          </span>
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-slate-700 font-semibold">Triage Urgency</Label>
              <Select value={urgency} onValueChange={(val) => setUrgency(val as Urgency)}>
                <SelectTrigger className="bg-white border-slate-200 shadow-sm h-11">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={Urgency.EMERGENCY}>Emergency</SelectItem>
                  <SelectItem value={Urgency.HIGH}>High Urgency</SelectItem>
                  <SelectItem value={Urgency.MODERATE}>Moderate</SelectItem>
                  <SelectItem value={Urgency.LOW}>Low</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-slate-700 font-semibold">Clinical Transfer Reason</Label>
              <Textarea 
                placeholder="E.g. Acute chest pain, SpO2 88%, requiring immediate ICU admission and cardiology consult."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={4}
                className="bg-white border-slate-200 shadow-sm resize-none"
              />
            </div>
          </div>

          <DialogFooter className="p-6 bg-white border-t border-slate-100">
            <Button variant="outline" onClick={() => setCreateDialogOpen(false)} className="border-slate-200 text-slate-600 hover:bg-slate-50">
              Cancel
            </Button>
            <Button onClick={handleCreateReferral} className="bg-teal-600 hover:bg-teal-700 text-white shadow-md">
              Confirm Referral
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Clinical Referral Slip Modal */}
      {selectedReferralForSlip && (
        <ClinicalReferralSlipModal
          isOpen={!!selectedReferralForSlip}
          onClose={() => setSelectedReferralForSlip(null)}
          referral={selectedReferralForSlip}
          patient={activeSlipPatient}
          facility={activeSlipFacility}
        />
      )}
    </div>
  );
}
