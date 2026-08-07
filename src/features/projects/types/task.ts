export interface TaskAssignee {
  studentId: string;
  fullName: string;
  studentCode: string;
  avatarUrl?: string | null;
}

export interface TaskComponent {
  id: string;
  name: string;
}

export interface TaskReadResponse {
  taskId: string;
  externalKey: string;
  title: string;
  description: string | null;
  status: string;
  priority: string;
  storyPoint: number | null;
  dueDate: string | null;
  assignee: TaskAssignee | null;
  sprintId: string | null;
  components: TaskComponent[];
  labels: string[];
  externalUpdatedAt: string | null;
}

export interface TaskListResponse {
  content: TaskReadResponse[];
  pageable: {
    pageNumber: number;
    pageSize: number;
  };
  totalElements: number;
  totalPages: number;
}

export interface TaskQueryFilters {
  keyword?: string;
  sprintId?: string;
  assigneeId?: string;
  status?: string;
  sortBy?: "externalKey" | "title" | "status" | "priority" | "storyPoint" | "dueDate" | "externalUpdatedAt";
  sortDirection?: "asc" | "desc";
  page?: number;
  size?: number;
}
