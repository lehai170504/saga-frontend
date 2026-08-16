export function isCourseEnded(
  courseOrEndDate?: { semester?: { endDate?: string | null }; courseStatus?: string } | string | null
): boolean {
  if (!courseOrEndDate) return false;

  if (typeof courseOrEndDate === "string") {
    const end = new Date(courseOrEndDate);
    if (isNaN(end.getTime())) return false;
    end.setHours(23, 59, 59, 999);
    return new Date() > end;
  }

  if (courseOrEndDate.courseStatus && courseOrEndDate.courseStatus.toUpperCase() !== "OPEN") {
    return true;
  }

  if (courseOrEndDate.semester?.endDate) {
    const end = new Date(courseOrEndDate.semester.endDate);
    if (!isNaN(end.getTime())) {
      end.setHours(23, 59, 59, 999);
      if (new Date() > end) return true;
    }
  }

  return false;
}
