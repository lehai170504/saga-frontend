export interface AiConversation {
  id: string;
  title: string;
  courseId?: string | null;
  applicationRoleSnapshot?: string;
  archived?: boolean;
  createdAt: string;
  updatedAt: string;
  messages?: AiMessage[];
}

export interface AiPendingAction {
  id: string;
  actionType: string;
  description: string;
  status: 'PENDING' | 'CONFIRMED' | 'REJECTED';
  payload?: Record<string, unknown>;
}

export interface AiJobReference {
  id?: string;
  status: 'PENDING' | 'RUNNING' | 'WAITING_RETRY' | 'COMPLETED' | 'FAILED';
  description?: string;
}

export interface GeneratedArtifact {
  id: string;
  conversationId?: string;
  artifactType:
    | "SRS_DOCX"
    | "LECTURER_PROGRESS_REPORT"
    | "ADMIN_SYSTEM_REPORT"
    | "LEADER_TEAM_PROGRESS_REPORT";
  scopeType: "PROJECT" | "COURSE" | "SYSTEM" | "TEAM";
  scopeId: string;
  filename: string;
  mediaType: string;
}

export interface AiMessage {
  id: string;
  conversationId?: string;
  role: 'USER' | 'ASSISTANT' | 'SYSTEM';
  content?: string; // Kept for backwards compatibility
  text?: string;
  createdAt: string;
  pendingAction?: AiPendingAction | null;
  generatedArtifact?: GeneratedArtifact | string | null;
  artifactId?: string | null; // Kept for backwards compatibility
  jobReference?: AiJobReference | null;
  citations?: Array<{ tool: string; status: string }> | string[];
  suggestedFollowups?: string[];
}

export function getArtifactButtonLabel(artifactType?: string): string {
  switch (artifactType) {
    case "SRS_DOCX":
      return "Tải SRS";
    case "LECTURER_PROGRESS_REPORT":
      return "Tải báo cáo lớp";
    case "ADMIN_SYSTEM_REPORT":
      return "Tải báo cáo hệ thống";
    case "LEADER_TEAM_PROGRESS_REPORT":
      return "Tải báo cáo nhóm";
    default:
      return "Tải báo cáo";
  }
}
