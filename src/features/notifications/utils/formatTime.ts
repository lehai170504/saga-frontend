import { formatDistanceToNow, format } from "date-fns";
import { vi } from "date-fns/locale";

/**
 * Parse an ISO date string safely ensuring UTC+7 handling.
 * If backend returns an ISO string without timezone or 'Z' suffix, append 'Z'
 * to ensure JavaScript parses it as UTC and automatically displays in UTC+7 (Asia/Ho_Chi_Minh).
 */
export function parseNotificationDate(dateInput?: string | Date | null): Date {
  if (!dateInput) return new Date();
  if (dateInput instanceof Date) return dateInput;

  let str = dateInput.trim();
  // If ISO string lacks 'Z' or offset like +07:00, append 'Z' so browser parses UTC correctly
  if (str.includes("T") && !str.endsWith("Z") && !/[+-]\d{2}:\d{2}$/.test(str)) {
    str += "Z";
  }

  const d = new Date(str);
  return isNaN(d.getTime()) ? new Date() : d;
}

export function formatNotificationRelativeTime(dateInput?: string | Date | null): string {
  const date = parseNotificationDate(dateInput);
  return formatDistanceToNow(date, { addSuffix: true, locale: vi });
}

export function formatNotificationFullTime(dateInput?: string | Date | null): string {
  const date = parseNotificationDate(dateInput);
  return format(date, "dd/MM/yyyy HH:mm", { locale: vi });
}
