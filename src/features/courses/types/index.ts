export interface Course {
  id: string; // UUID
  courseCode: string;
  name: string;
  subject: {
    id: string;
    subjectCode: string;
    name: string;
  };
  clazz: {
    id: string;
    classCode: string;
    name: string;
  };
  semester: {
    id: string;
    code: string;
    name: string;
  };
  instructor: {
    id: string; // Wait, we don't have full instructor object structure defined, assuming it returns just ID or some details
  };
  createdAt: string; // LocalDateTime string
  updatedAt: string; // LocalDateTime string
}

export interface CourseRequest {
  courseCode: string;
  name: string;
  subjectId: string;
  classId: string;
  semesterId: string;
  instructorId: string;
}
