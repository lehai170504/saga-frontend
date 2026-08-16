import axiosInstance from "@/lib/axios";
import { ProjectTasksResponse, JiraTask } from "../types";

export type GetTasksParams = {
  keyword?: string;
  sprintId?: string;
  assigneeId?: string;
  status?: string;
  page?: number;
  size?: number;
};

export type CreateTaskRequest = {
  title: string;
  type: string; // e.g. "TASK", "BUG", "STORY", "FEATURE", "EPIC", "SUBTASK"
  priority?: string; // e.g. "LOW", "MEDIUM", "HIGH", "CRITICAL"
  description?: string;
  dueDate?: string | null;
  labels?: string[];
  componentIds?: string[];
  assigneeId?: string;
  issueTypeId?: string;
  priorityId?: string;
};

export type UpdateTaskRequest = {
  title?: string;
  type?: string; // e.g. "TASK", "BUG", "STORY", "FEATURE", "EPIC", "SUBTASK"
  priority?: string; // e.g. "LOW", "MEDIUM", "HIGH", "CRITICAL"
  priorityId?: string;
  priorityName?: string;
  description?: string;
  dueDate?: string | null;
  labels?: string[];
  componentIds?: string[];
  assigneeId?: string;
  issueTypeId?: string;
};

export type TaskTransition = {
  transitionId: string;
  name: string;
  targetStatusId: string;
  targetStatusName: string;
};

export type AttachTaskEvidenceRequest = {
  files?: File[];
  link?: string;
};

export interface TaskAttachmentItem {
  id: string;
  externalId: string;
  filename: string;
  mimeType: string;
  sizeBytes: number;
}

export interface TaskWebLinkItem {
  id: string;
  url: string;
  remoteLinkId: string | null;
}

export interface TaskAttachmentResponse {
  taskId: string;
  attachments: TaskAttachmentItem[];
  links: TaskWebLinkItem[];
}

export const taskApi = {
  getProjectTasks: async (projectId: string, params?: GetTasksParams) => {
    const res = await axiosInstance.get<never, ProjectTasksResponse>(`/api/v1/projects/${projectId}/tasks`, {
      params
    });
    if (res && Array.isArray(res.content)) {
      res.content = res.content.map((task: JiraTask) => ({
        ...task,
        storyPoint: task.storyPoint ?? task.storyPoints ?? task.story_point ?? task.estimation ?? 0,
      }));
    }
    return res;
  },

  getTaskById: async (projectId: string, taskId: string) => {
    const task = await axiosInstance.get<never, JiraTask>(`/api/v1/projects/${projectId}/tasks/${taskId}`);
    if (task) {
      task.storyPoint = task.storyPoint ?? task.storyPoints ?? task.story_point ?? task.estimation ?? 0;
    }
    return task;
  },

  createTask: async (projectId: string, data: CreateTaskRequest, idempotencyKey: string) => {
    return axiosInstance.post<never, JiraTask>(`/api/v1/projects/${projectId}/tasks`, data, {
      headers: {
        "Idempotency-Key": idempotencyKey
      }
    });
  },

  updateTask: async (projectId: string, taskId: string, data: UpdateTaskRequest, idempotencyKey: string) => {
    return axiosInstance.put<never, JiraTask>(`/api/v1/projects/${projectId}/tasks/${taskId}`, data, {
      headers: {
        "Idempotency-Key": idempotencyKey
      }
    });
  },

  assignTaskToSprint: async (projectId: string, taskId: string, sprintId: string | null, idempotencyKey: string) => {
    const payload: { sprintId?: string; backlog?: boolean } = {};
    if (sprintId) {
      payload.sprintId = sprintId;
    } else {
      payload.backlog = true;
    }
    return axiosInstance.put<never, unknown>(`/api/v1/projects/${projectId}/tasks/${taskId}/sprint`, payload, {
      headers: {
        "Idempotency-Key": idempotencyKey
      }
    });
  },

  updateTaskAssignee: async (projectId: string, taskId: string, assigneeId: string | null, idempotencyKey: string) => {
    const payload: { assigneeId?: string; unassign?: boolean } = {};
    if (assigneeId) {
      payload.assigneeId = assigneeId;
      payload.unassign = false;
    } else {
      payload.unassign = true;
    }
    return axiosInstance.put<never, unknown>(`/api/v1/projects/${projectId}/tasks/${taskId}/assignee`, payload, {
      headers: {
        "Idempotency-Key": idempotencyKey
      }
    });
  },

  updateTaskEstimation: async (projectId: string, taskId: string, storyPoint: number | null, idempotencyKey: string) => {
    return axiosInstance.put<never, unknown>(`/api/v1/projects/${projectId}/tasks/${taskId}/estimation`, {
      value: storyPoint
    }, {
      headers: {
        "Idempotency-Key": idempotencyKey
      }
    });
  },

  getTaskTransitions: async (projectId: string, taskId: string) => {
    return axiosInstance.get<never, TaskTransition[]>(`/api/v1/projects/${projectId}/tasks/${taskId}/transitions`);
  },

  transitionTask: async (projectId: string, taskId: string, transitionId: string, idempotencyKey: string) => {
    return axiosInstance.post<never, unknown>(`/api/v1/projects/${projectId}/tasks/${taskId}/transitions`, {
      transitionId
    }, {
      headers: {
        "Idempotency-Key": idempotencyKey
      }
    });
  },

  attachTaskEvidence: async (
    projectId: string,
    taskId: string,
    data: AttachTaskEvidenceRequest,
    idempotencyKey: string
  ) => {
    const formData = new FormData();
    if (data.files && data.files.length > 0) {
      data.files.forEach((file) => {
        formData.append("files", file);
      });
    }
    if (data.link && data.link.trim()) {
      formData.append("link", data.link.trim());
    }

    return axiosInstance.post<never, TaskAttachmentResponse>(
      `/api/v1/projects/${projectId}/tasks/${taskId}/attachments`,
      formData,
      {
        headers: {
          "Idempotency-Key": idempotencyKey,
        },
      }
    );
  },

  deleteTask: async (projectId: string, taskId: string, idempotencyKey: string) => {
    return axiosInstance.delete(`/api/v1/projects/${projectId}/tasks/${taskId}`, {
      headers: {
        "Idempotency-Key": idempotencyKey
      }
    });
  }
};
