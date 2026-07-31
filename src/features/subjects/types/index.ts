export interface Subject {
  id: string; // UUID
  subjectCode: string;
  name: string;
  createdAt: string; // LocalDateTime string
  updatedAt: string; // LocalDateTime string
}

export interface SubjectRequest {
  subjectCode: string;
  name: string;
}
