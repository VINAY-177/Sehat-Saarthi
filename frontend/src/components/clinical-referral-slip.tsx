"use client";

import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Printer, HeartPulse, Building2 } from "lucide-react";
import { Referral, Patient, Facility, Urgency } from "@/lib/types";

interface ClinicalReferralSlipModalProps {
  isOpen: boolean;
  onClose: () => void;
  referral: Referral;
  patient?: Patient;
  facility?: Facility;
}

export function ClinicalReferralSlipModal({
  isOpen,
  onClose,
  referral,
  patient,
  facility,
}: ClinicalReferralSlipModalProps) {
  const handlePrint = () => {
    window.print();
  };

  const getUrgencyColor = (u: Urgency) => {
    switch (u) {
      case Urgency.EMERGENCY: return "bg-rose-600 text-white";
      case Urgency.HIGH: return "bg-orange-600 text-white";
      case Urgency.MODERATE: return "bg-amber-600 text-white";
      case Urgency.LOW: return "bg-emerald-600 text-white";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto print:p-0 print:border-none print:shadow-none">
        <DialogHeader className="print:hidden">
          <DialogTitle className="flex items-center gap-2">
            <HeartPulse className="h-5 w-5 text-primary" />
            Official Clinical Referral Slip
          </DialogTitle>
        </DialogHeader>

        {/* Printable Referral Slip Document */}
        <div className="border-2 border-primary/30 rounded-lg p-6 bg-card space-y-6 text-foreground print:border-black print:p-8">
          {/* Slip Header */}
          <div className="border-b pb-4 flex justify-between items-start">
            <div>
              <div className="text-xs uppercase tracking-widest font-bold text-primary">
                National Health Mission (NHM) • Government of India
              </div>
              <h2 className="text-xl font-extrabold mt-0.5">INTER-FACILITY CLINICAL REFERRAL FORM</h2>
              <div className="text-xs text-muted-foreground mt-0.5">
                Sehat Saarthi AI Verified Digital Triage Slip
              </div>
            </div>
            <div className="text-right">
              <span className={`px-2.5 py-1 rounded text-xs font-bold uppercase inline-block ${getUrgencyColor(referral.urgency)}`}>
                {referral.urgency} TRIAGE
              </span>
              <div className="text-[11px] text-muted-foreground mt-1.5 font-mono">
                REF #{referral.id.toUpperCase()}
              </div>
            </div>
          </div>

          {/* Patient Details Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs bg-muted/40 p-3 rounded-md">
            <div>
              <span className="text-muted-foreground block text-[10px] uppercase font-semibold">Patient Name</span>
              <span className="font-bold text-sm">{patient?.name || referral.patientName}</span>
            </div>
            <div>
              <span className="text-muted-foreground block text-[10px] uppercase font-semibold">Age / Gender</span>
              <span className="font-bold">{patient?.age || "N/A"} yrs / {patient?.gender || "N/A"}</span>
            </div>
            <div>
              <span className="text-muted-foreground block text-[10px] uppercase font-semibold">Blood Group</span>
              <span className="font-bold">{patient?.bloodGroup || "Unknown"}</span>
            </div>
            <div>
              <span className="text-muted-foreground block text-[10px] uppercase font-semibold">Category / ABHA</span>
              <span className="font-bold">{patient?.incomeCategory || "BPL"} • {patient?.abhaLinked ? "ABHA Linked" : "Not Linked"}</span>
            </div>
          </div>

          {/* Origin & Destination Routing */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs border p-3 rounded-md">
            <div>
              <span className="text-muted-foreground block text-[10px] uppercase font-semibold mb-1 flex items-center gap-1">
                <Building2 className="h-3.5 w-3.5 text-primary" /> Referring Center
              </span>
              <p className="font-semibold text-sm">Community Health Intake / Field ASHA</p>
              <p className="text-muted-foreground">{patient?.village || "Varanasi Block"}, {patient?.district || "Uttar Pradesh"}</p>
            </div>
            <div>
              <span className="text-muted-foreground block text-[10px] uppercase font-semibold mb-1 flex items-center gap-1">
                <Building2 className="h-3.5 w-3.5 text-emerald-600" /> Destination Hospital
              </span>
              <p className="font-semibold text-sm">{facility?.name || referral.toFacilityName}</p>
              <p className="text-muted-foreground">{facility?.district || "Varanasi"}, {facility?.state || "Uttar Pradesh"}</p>
              <p className="text-[11px] font-medium text-emerald-600 mt-0.5">Emergency Desk Contact: {facility?.phone || "+91 542 2367568"}</p>
            </div>
          </div>

          {/* Clinical Reason & Findings */}
          <div className="space-y-2 text-xs">
            <span className="text-muted-foreground block text-[10px] uppercase font-semibold">
              Clinical Assessment &amp; Reason for Inter-Facility Transfer
            </span>
            <div className="p-3 bg-secondary/30 rounded border text-sm font-medium">
              {referral.reason}
            </div>
          </div>

          {/* Protocol Signatures */}
          <div className="pt-6 border-t grid grid-cols-2 gap-8 text-xs text-muted-foreground">
            <div>
              <div className="h-8 border-b border-dashed"></div>
              <span className="block mt-1">Authorized ASHA / Medical Officer Signature</span>
            </div>
            <div>
              <div className="h-8 border-b border-dashed"></div>
              <span className="block mt-1">Receiving Emergency Duty Officer Signature</span>
            </div>
          </div>

          <div className="text-[10px] text-muted-foreground text-center pt-2">
            Generated via Sehat Saarthi AI Integrated Rural Health Navigation System • Timestamp: {new Date(referral.createdAt).toLocaleString()}
          </div>
        </div>

        <DialogFooter className="print:hidden flex gap-2 sm:justify-between">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <div className="flex gap-2">
            <Button onClick={handlePrint} className="flex items-center gap-1.5">
              <Printer className="h-4 w-4" /> Print / Save PDF Slip
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
