import { Page } from "@/types/pagination";

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
    id: string;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CourseRequest {
  courseCode: string;
  name: string;
  subjectId: string;
  classId: string;
  semesterId: string;
  instructorId: string;
}

export interface TeamMemberResponse {
  id: string;
  teamId: string;
  studentId: string;
  roleInTeam: string;
  student: {
    id: string;
    studentCode: string;
    name: string;
  };
}

export interface CourseStudent {
  studentId: string;
  fullName: string;
  studentCode: string;
  email: string;
  team: {
    teamId: string;
    teamName: string;
    projectId: string;
    projectName: string;
    teamMembers: {
      studentId: string;
      fullName: string;
      studentCode: string;
      roleInTeam: string;
    }[];
  } | null;
}

export interface CourseStudentsResponse {
  studentsWithTeam: Page<CourseStudent>;
  studentsWithoutTeam: Page<CourseStudent>;
}

export interface MyTeamMembersResponse {
  courseId: string;
  teamId: string;
  teamName: string;
  roleInTeam: string;
  project: {
    projectId: string;
    name: string;
  } | null;
  members: Page<{
    studentId: string;
    fullName: string;
    studentCode: string;
    roleInTeam: string;
  }>;
}

