import { Facility, FacilityMatch, Urgency, BloodGroup } from "@/lib/types";

// ============================================================
// Sehat Saathi AI — Referral & Facility Matching Engine
// Ranks facilities by distance, capability, and availability
// ============================================================

interface MatchInput {
  urgency: Urgency;
  specialistNeeds: string[];
  bloodGroup: string | null;
  patientLat: number;
  patientLng: number;
  needsICU?: boolean;
}

/**
 * Haversine distance between two coordinates in kilometres.
 */
function haversineDistance(
  lat1: number, lng1: number,
  lat2: number, lng2: number,
): number {
  const R = 6371; // Earth radius in km
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

/**
 * Match and rank facilities for a patient referral.
 * Returns facilities sorted by composite score (lower is better).
 */
export function matchFacilities(
  facilities: Facility[],
  input: MatchInput,
): FacilityMatch[] {
  const needsICU = input.needsICU ??
    (input.urgency === Urgency.EMERGENCY || input.urgency === Urgency.HIGH);

  const results: FacilityMatch[] = [];

  for (const facility of facilities) {
    const reasons: string[] = [];
    let capabilityScore = 0;

    // --- Hard filters ---

    // ICU requirement
    if (needsICU) {
      const icuAvailable = facility.icuBeds - facility.icuBedsUsed;
      if (icuAvailable <= 0) {
        // For EMERGENCY, skip facilities with no ICU
        if (input.urgency === Urgency.EMERGENCY) {
          continue;
        }
        // For HIGH, penalise but don't exclude
        capabilityScore -= 20;
        reasons.push("No ICU beds available");
      } else {
        capabilityScore += 20;
        reasons.push(`${icuAvailable} ICU bed${icuAvailable > 1 ? "s" : ""} available`);
      }
    }

    // General bed availability
    const generalAvailable = facility.generalBeds - facility.generalBedsUsed;
    if (generalAvailable <= 0) {
      capabilityScore -= 10;
      reasons.push("No general beds available");
    } else {
      const bedRatio = generalAvailable / facility.generalBeds;
      capabilityScore += Math.round(bedRatio * 10);
      reasons.push(`${generalAvailable} general bed${generalAvailable > 1 ? "s" : ""} available`);
    }

    // --- Specialist matching ---
    const matchedSpecs: string[] = [];
    const missingSpecs: string[] = [];

    for (const need of input.specialistNeeds) {
      if (facility.specialists.includes(need)) {
        matchedSpecs.push(need);
        capabilityScore += 10;
      } else {
        missingSpecs.push(need);
        capabilityScore -= 5;
      }
    }

    if (matchedSpecs.length > 0) {
      reasons.push(`Has ${matchedSpecs.join(", ")}`);
    }
    if (missingSpecs.length > 0) {
      reasons.push(`Missing ${missingSpecs.join(", ")}`);
    }

    // --- Blood stock ---
    if (input.bloodGroup) {
      const bg = input.bloodGroup as BloodGroup;
      const stock = facility.bloodStock[bg] || 0;
      if (stock > 0) {
        capabilityScore += 10;
        reasons.push(`${stock} units of ${bg} blood available`);
      } else {
        capabilityScore -= 5;
        reasons.push(`No ${bg} blood in stock`);
      }
    }

    // --- PM-JAY empanelment bonus ---
    if (facility.pmjayEmpanelled) {
      capabilityScore += 5;
      reasons.push("PM-JAY empanelled");
    }

    // --- Distance ---
    const distance = haversineDistance(
      input.patientLat, input.patientLng,
      facility.lat, facility.lng,
    );

    // Distance penalty: closer is better
    // Within 10km = full score, 10-50km = moderate penalty, >50km = heavy penalty
    let distanceScore: number;
    if (distance <= 10) {
      distanceScore = 30;
    } else if (distance <= 30) {
      distanceScore = 20;
    } else if (distance <= 50) {
      distanceScore = 10;
    } else {
      distanceScore = 0;
    }

    reasons.push(`${distance.toFixed(1)} km away`);

    // --- Composite score ---
    const compositeScore = capabilityScore + distanceScore;

    results.push({
      facility,
      score: compositeScore,
      distance: Math.round(distance * 10) / 10,
      reasons,
    });
  }

  // Sort by composite score descending (higher is better)
  results.sort((a, b) => b.score - a.score);

  return results;
}

/**
 * Get default patient coordinates based on village/district.
 * Falls back to Varanasi city centre.
 */
export function getPatientCoordinates(
  village: string,
  district: string,
): { lat: number; lng: number } {
  const locations: Record<string, { lat: number; lng: number }> = {
    "varanasi": { lat: 25.3176, lng: 82.9739 },
    "chandauli": { lat: 25.2581, lng: 83.2680 },
    "jaunpur": { lat: 25.7464, lng: 82.6837 },
    "bharatpur": { lat: 27.2152, lng: 77.4890 },
    "dausa": { lat: 26.8868, lng: 76.3377 },
    "sarnath": { lat: 25.3815, lng: 83.0246 },
    "ramnagar": { lat: 25.2727, lng: 83.0302 },
    "mughalsarai": { lat: 25.2832, lng: 83.1188 },
    "pindra": { lat: 25.3429, lng: 82.8812 },
    "kashi vidyapeeth": { lat: 25.2900, lng: 82.9900 },
    "chandpur": { lat: 25.2700, lng: 83.2500 },
  };

  const villageLower = village.toLowerCase();
  const districtLower = district.toLowerCase();

  return locations[villageLower] || locations[districtLower] || { lat: 25.3176, lng: 82.9739 };
}
