export interface Notification {
  id: string;
  title: string;
  message: string;
  actionUrl: string | null;
  read: boolean;
  createdAt: string;
  readAt?: string;
  type?: string; // e.g. "JIRA", "GITHUB", "SYSTEM"
}

export interface Sort {
  empty: boolean;
  sorted: boolean;
  unsorted: boolean;
}

export interface Pageable {
  offset: number;
  paged: boolean;
  pageNumber: number;
  pageSize: number;
  sort: Sort;
  unpaged: boolean;
}

export interface NotificationResponse {
  content: Notification[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  pageable: Pageable;
  sort: Sort;
  numberOfElements: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

export interface UnreadCountResponse {
  unreadCount: number;
}

export interface AdminBroadcastRequest {
  title: string;
  message: string;
  audience: "STUDENTS" | "LECTURERS" | "ALL_USERS";
}
