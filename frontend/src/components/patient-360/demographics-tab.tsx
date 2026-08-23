"use client";

import { Patient } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, MapPin, Phone, Mail, Fingerprint, Heart } from "lucide-react";

interface Props {
  patient: Patient;
}

export function DemographicsTab({ patient }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Personal Identity */}
      <Card className="border border-slate-200/80 shadow-sm rounded-2xl">
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
            <div className="p-2.5 bg-teal-50 text-teal-600 rounded-xl">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-base">Personal Identification</h4>
              <p className="text-xs text-slate-400">Demographic details and registration ID</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-0.5">Full Name</span>
              <span className="font-bold text-slate-800">{patient.name}</span>
            </div>
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-0.5">Medical Record #</span>
              <span className="font-mono font-bold text-teal-700">{patient.mrn || "Pending"}</span>
            </div>
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-0.5">Date of Birth</span>
              <span className="font-medium text-slate-800">{patient.dateOfBirth || "—"}</span>
            </div>
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-0.5">Age & Gender</span>
              <span className="font-medium text-slate-800">{patient.age} yrs • {patient.gender}</span>
            </div>
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-0.5">Blood Group</span>
              <span className="font-bold text-rose-600">{patient.bloodGroup || "Unknown"}</span>
            </div>
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-0.5">Economic Category</span>
              <Badge variant="outline" className="font-bold text-slate-700 bg-slate-50">
                {patient.incomeCategory || "General (APL)"}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ABHA & National Health Stack */}
      <Card className="border border-slate-200/80 shadow-sm rounded-2xl">
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
            <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
              <Fingerprint className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-base">ABHA / ABDM Digital Health ID</h4>
              <p className="text-xs text-slate-400">National Health Authority integration status</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-gradient-to-br from-blue-900 to-indigo-950 text-white shadow-md">
              <div className="flex justify-between items-start mb-3">
                <span className="text-xs font-mono tracking-wider opacity-80">NATIONAL HEALTH ID (ABHA)</span>
                <Badge className="bg-emerald-500 text-white border-0 text-[10px] uppercase font-bold">
                  {patient.abhaLinked ? "Verified" : "Unverified"}
                </Badge>
              </div>
              <p className="text-xl font-mono tracking-widest font-bold mb-1">
                {patient.abhaId || "ABHA NOT LINKED"}
              </p>
              <p className="text-xs text-blue-200">{patient.name}</p>
            </div>

            <div className="text-xs text-slate-500 space-y-1">
              <p>• Consent Manager: Active for interoperable electronic health records (EHR).</p>
              <p>• PM-JAY integration enabled for direct scheme claims submission.</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact & Location */}
      <Card className="border border-slate-200/80 shadow-sm rounded-2xl">
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
            <div className="p-2.5 bg-purple-50 text-purple-600 rounded-xl">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-base">Contact & Geographic Location</h4>
              <p className="text-xs text-slate-400">Residential address and contact details</p>
            </div>
          </div>

          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-3">
              <Phone className="w-4 h-4 text-slate-400 shrink-0" />
              <span className="font-medium text-slate-800">{patient.phone || "No phone registered"}</span>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-slate-400 shrink-0" />
              <span className="font-medium text-slate-800">{patient.email || "No email registered"}</span>
            </div>
            <div className="flex items-start gap-3 pt-2 border-t border-slate-100">
              <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-slate-800">{patient.address || patient.village || "Address not recorded"}</p>
                <p className="text-xs text-slate-500">{patient.district}, {patient.state} {patient.pincode ? `— ${patient.pincode}` : ""}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Emergency Contact */}
      <Card className="border border-slate-200/80 shadow-sm rounded-2xl">
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
            <div className="p-2.5 bg-rose-50 text-rose-600 rounded-xl">
              <Heart className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-base">Emergency Contact</h4>
              <p className="text-xs text-slate-400">Primary point of contact for emergency triage</p>
            </div>
          </div>

          <div className="space-y-3 text-sm">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-0.5">Contact Name</span>
              <span className="font-bold text-slate-800">{patient.emergencyContactName || "Not assigned"}</span>
            </div>
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-0.5">Relationship</span>
              <span className="font-medium text-slate-700">{patient.emergencyContactRelation || "—"}</span>
            </div>
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-0.5">Emergency Phone Number</span>
              <span className="font-bold text-rose-600">{patient.emergencyContactPhone || "—"}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
