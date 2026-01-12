export type WorkflowType = 'company_registration' | 'company_incorporation' | 'general';

export type MessageRole = 'user' | 'assistant' | 'system';

export interface Message {
  id: string;
  sessionId: string;
  role: MessageRole;
  content: string;
  timestamp: string;
  metadata?: {
    documents?: Document[];
    companyNames?: string[];
    isVerification?: boolean;
    requiresReupload?: boolean;
  };
}

export interface Document {
  id: string;
  name: string;
  size: number;
  type: string;
  url?: string;
  uploadedAt: string;
  status: 'pending' | 'verified' | 'rejected';
}

export interface ChatSession {
  id: string;
  userId: string;
  workflowType: WorkflowType;
  title: string;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  metadata?: {
    currentStep?: string;
    companyNames?: string[];
    documentStatus?: string;
  };
}

export interface SendMessageRequest {
  sessionId: string;
  content: string;
  metadata?: Record<string, any>;
}

export interface SendMessageResponse {
  success: boolean;
  data: {
    message: Message;
    session: ChatSession;
  };
}

export interface CreateSessionRequest {
  workflowType: WorkflowType;
  title?: string;
}

export interface CreateSessionResponse {
  success: boolean;
  data: {
    session: ChatSession;
  };
}

export interface GetSessionsResponse {
  success: boolean;
  data: {
    sessions: ChatSession[];
  };
}

export interface GetMessagesRequest {
  sessionId: string;
  limit?: number;
  offset?: number;
}

export interface GetMessagesResponse {
  success: boolean;
  data: {
    messages: Message[];
    hasMore: boolean;
  };
}

export interface UploadDocumentRequest {
  sessionId: string;
  file: File;
  documentType?: string;
}

export interface UploadDocumentResponse {
  success: boolean;
  data: {
    document: Document;
  };
}
