export interface JiraSprint {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
}

export interface JiraTask {
  id: string;
  key: string;
  title: string;
  assignee: string;
  storyPoints: number;
  priority: "high" | "medium" | "low";
  status: "todo" | "inprogress" | "inreview" | "done";
  sprintId: string;
  commitsCount?: number;
  pullRequestsCount?: number;
  branch?: string;
}

export const DEFAULT_SPRINTS: JiraSprint[] = [
  { id: "sprint-1", name: "Sprint 1 — Core Setup", startDate: "2026-06-01", endDate: "2026-06-14", isActive: false },
  { id: "sprint-2", name: "Sprint 2 — Database Design", startDate: "2026-06-15", endDate: "2026-06-28", isActive: false },
  { id: "sprint-3", name: "Sprint 3 — Auth Integration", startDate: "2026-06-29", endDate: "2026-07-12", isActive: true },
];

export const DEFAULT_TASKS: JiraTask[] = [
  { id: "task-1", key: "SAGA-10", title: "Cấu hình Next.js Router & Tailwind v4", assignee: "Trần Thị Bình", storyPoints: 3, priority: "high", status: "done", sprintId: "sprint-1", commitsCount: 4, pullRequestsCount: 1, branch: "feat/saga-10" },
  { id: "task-2", key: "SAGA-11", title: "Tạo Mock Database Schema cho Lớp Học", assignee: "Nguyễn Văn An", storyPoints: 5, priority: "high", status: "done", sprintId: "sprint-2", commitsCount: 2 },
  { id: "task-3", key: "SAGA-12", title: "Tích hợp Context Auth Provider & Login State", assignee: "Lê Văn Cường", storyPoints: 5, priority: "high", status: "inprogress", sprintId: "sprint-3", commitsCount: 3, pullRequestsCount: 1, branch: "feat/auth" },
  { id: "task-4", key: "SAGA-13", title: "Thiết kế giao diện Bảng Kanban của sinh viên", assignee: "Trần Thị Bình", storyPoints: 3, priority: "medium", status: "inprogress", sprintId: "sprint-3", commitsCount: 1 },
  { id: "task-5", key: "SAGA-14", title: "Viết Unit Tests cho bộ lọc xếp nhóm", assignee: "Phạm Thị Dung", storyPoints: 2, priority: "low", status: "todo", sprintId: "sprint-3" },
  { id: "task-6", key: "SAGA-15", title: "Đồng bộ hóa API Webhooks từ GitHub", assignee: "Hoàng Văn Em", storyPoints: 8, priority: "high", status: "todo", sprintId: "sprint-3", branch: "feat/webhooks" },
];

export const TEAM_MEMBERS = [
  "Nguyễn Văn An",
  "Trần Thị Bình",
  "Lê Văn Cường",
  "Phạm Thị Dung",
  "Hoàng Văn Em",
  "Nguyễn Tuấn Anh"
];
