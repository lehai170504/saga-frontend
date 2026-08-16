export function isCourseEnded(endDate?: string | null): boolean {
  if (!endDate) return false;
  const end = new Date(endDate);
  // Set end time to the very end of the day to be inclusive
  end.setHours(23, 59, 59, 999);
  return new Date() > end;
}
