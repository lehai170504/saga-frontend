/**
 * Shared date formatting utilities for Student features.
 * All dates displayed to users should go through these helpers
 * to ensure consistent dd-mm-yyyy format.
 */

/**
 * Format a date string or Date to dd-mm-yyyy.
 * @param dateStr - ISO date string, datetime string, or null/undefined
 * @returns Formatted string like "10-08-2026", or "Không xác định" if invalid
 */
export function formatDate(dateStr?: string | null | Date): string {
  if (!dateStr) return "Không xác định";
  try {
    const d = typeof dateStr === "string" ? new Date(dateStr) : dateStr;
    if (isNaN(d.getTime())) return String(dateStr);
    const dd = String(d.getDate()).padStart(2, "0");
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const yyyy = d.getFullYear();
    return `${dd}-${mm}-${yyyy}`;
  } catch {
    return String(dateStr);
  }
}

/**
 * Format a datetime string to dd-mm-yyyy HH:MM.
 * Used for commit timestamps, Jira update times, etc.
 * @param dateStr - ISO datetime string or null/undefined
 * @returns Formatted string like "10-08-2026 14:30", or "Không xác định" if invalid
 */
export function formatDateTime(dateStr?: string | null): string {
  if (!dateStr) return "Không xác định";
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    const dd = String(d.getDate()).padStart(2, "0");
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const yyyy = d.getFullYear();
    const hh = String(d.getHours()).padStart(2, "0");
    const min = String(d.getMinutes()).padStart(2, "0");
    return `${dd}-${mm}-${yyyy} ${hh}:${min}`;
  } catch {
    return dateStr;
  }
}

/**
 * Format a sprint date range to "dd-mm-yyyy – dd-mm-yyyy".
 * @returns Formatted range string, or "Chưa thiết lập thời gian" if either date is missing
 */
export function formatSprintDateRange(startStr?: string | null, endStr?: string | null): string {
  if (!startStr || !endStr) return "Chưa thiết lập thời gian";
  try {
    return `${formatDate(startStr)} – ${formatDate(endStr)}`;
  } catch {
    return "Lỗi định dạng ngày";
  }
}
