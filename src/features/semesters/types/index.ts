export interface Semester {
  id: string; // UUID
  code: string;
  name: string;
  startDate: string; // LocalDateTime string
  endDate: string; // LocalDateTime string
  createdAt: string; // LocalDateTime string
  updatedAt: string; // LocalDateTime string
}

export interface SemesterRequest {
  code: string;
  name: string;
  startDate: string; // LocalDateTime string
  endDate: string; // LocalDateTime string
}
