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

export interface AiMessage {
  id: string;
  role: 'USER' | 'ASSISTANT' | 'SYSTEM';
  content?: string; // Kept for backwards compatibility
  text?: string;
  createdAt: string;
  pendingAction?: AiPendingAction;
  generatedArtifact?: string;
  artifactId?: string; // Kept for backwards compatibility if needed
  jobReference?: {
    status: 'PENDING' | 'RUNNING' | 'WAITING_RETRY' | 'COMPLETED' | 'FAILED';
  };
  citations?: string[];
  suggestedFollowups?: string[];
}
