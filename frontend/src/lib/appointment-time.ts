/**
 * Appointments are scheduled at Sehat Saarthi facilities in India. Persist the
 * selected India Standard Time (IST) as a UTC ISO instant, and always render
 * appointment times in IST. This avoids browser-local timezone shifts.
 */
export const APPOINTMENT_TIME_ZONE = "Asia/Kolkata";

const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000;

function validDate(dateTime: string): Date | null {
  const date = new Date(dateTime);
  return Number.isNaN(date.getTime()) ? null : date;
}

function dateParts(date: Date) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: APPOINTMENT_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);

  return Object.fromEntries(parts.map((part) => [part.type, part.value]));
}

/** Convert a datetime-local input into the UTC instant for the selected IST time. */
export function appointmentDateTimeInputToIso(value: string): string {
  const match = value.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/);
  if (!match) {
    throw new Error("Please select a valid appointment date and time.");
  }

  const [, year, month, day, hour, minute] = match;
  const utcTimestamp = Date.UTC(
    Number(year),
    Number(month) - 1,
    Number(day),
    Number(hour),
    Number(minute)
  ) - IST_OFFSET_MS;

  return new Date(utcTimestamp).toISOString();
}

export function getAppointmentDateKey(dateTime: string | Date): string {
  const date = typeof dateTime === "string" ? validDate(dateTime) : dateTime;
  if (!date) return "";

  const parts = dateParts(date);
  return `${parts.year}-${parts.month}-${parts.day}`;
}

export function getAppointmentDateParts(dateTime: string): { year: number; month: number; day: number } | null {
  const date = validDate(dateTime);
  if (!date) return null;

  const parts = dateParts(date);
  return {
    year: Number(parts.year),
    month: Number(parts.month) - 1,
    day: Number(parts.day),
  };
}

export function formatAppointmentDate(dateTime: string, options: Intl.DateTimeFormatOptions = {}): string {
  const date = validDate(dateTime);
  if (!date) return "Invalid date";

  return new Intl.DateTimeFormat("en-IN", {
    timeZone: APPOINTMENT_TIME_ZONE,
    month: "short",
    day: "numeric",
    year: "numeric",
    ...options,
  }).format(date);
}

export function formatAppointmentTime(dateTime: string, options: Intl.DateTimeFormatOptions = {}): string {
  const date = validDate(dateTime);
  if (!date) return "Invalid time";

  return new Intl.DateTimeFormat("en-IN", {
    timeZone: APPOINTMENT_TIME_ZONE,
    hour: "2-digit",
    minute: "2-digit",
    ...options,
  }).format(date);
}

export function formatAppointmentDateTime(dateTime: string): string {
  const date = validDate(dateTime);
  if (!date) return "Invalid date/time";

  return new Intl.DateTimeFormat("en-IN", {
    timeZone: APPOINTMENT_TIME_ZONE,
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

/** Return a datetime-local value for tomorrow at the supplied IST wall-clock time. */
export function getDefaultAppointmentDateTime(hour = 10, minute = 30): string {
  const today = getAppointmentDateKey(new Date());
  const tomorrow = new Date(`${today}T00:00:00.000Z`);
  tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);

  return `${tomorrow.toISOString().slice(0, 10)}T${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
}
