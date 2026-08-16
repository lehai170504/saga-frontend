export interface AiConversation {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
}

export interface AiPendingAction {
  id: string;
  actionType: string;
  description: string;
  status: 'PENDING' | 'CONFIRMED' | 'REJECTED';
  payload?: Record<string, any>;
}

export interface AiJobReference {
  id?: string;
  status: 'PENDING' | 'RUNNING' | 'WAITING_RETRY' | 'COMPLETED' | 'FAILED';
  description?: string;
}

export interface AiMessage {
  id: string;
  role: 'USER' | 'ASSISTANT' | 'SYSTEM';
  content: string;
  createdAt: string;
  pendingAction?: AiPendingAction;
  artifactId?: string;
  jobReference?: AiJobReference;
}
