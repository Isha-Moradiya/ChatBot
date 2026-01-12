import { api } from '../lib/api-client';
import {
  SendMessageRequest,
  SendMessageResponse,
  CreateSessionRequest,
  CreateSessionResponse,
  GetSessionsResponse,
  GetMessagesRequest,
  GetMessagesResponse,
  UploadDocumentRequest,
  UploadDocumentResponse,
} from '../types/chat.types';

export const sendMessage = async (data: SendMessageRequest): Promise<SendMessageResponse> => {
  const response = await api.post('/chat/messages', data);
  return response.data;
};

export const createSession = async (data: CreateSessionRequest): Promise<CreateSessionResponse> => {
  const response = await api.post('/chat/sessions', data);
  return response.data;
};

export const getSessions = async (): Promise<GetSessionsResponse> => {
  const response = await api.get('/chat/sessions');
  return response.data;
};

export const getMessages = async (params: GetMessagesRequest): Promise<GetMessagesResponse> => {
  const response = await api.get(`/chat/sessions/${params.sessionId}/messages`, {
    params: {
      limit: params.limit,
      offset: params.offset,
    },
  });
  return response.data;
};

export const uploadDocument = async (data: UploadDocumentRequest): Promise<UploadDocumentResponse> => {
  const formData = new FormData();
  formData.append('file', data.file);
  formData.append('sessionId', data.sessionId);
  if (data.documentType) {
    formData.append('documentType', data.documentType);
  }

  const response = await api.post('/chat/documents', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const deleteSession = async (sessionId: string): Promise<void> => {
  await api.delete(`/chat/sessions/${sessionId}`);
};

export const updateSessionTitle = async (sessionId: string, title: string): Promise<void> => {
  await api.patch(`/chat/sessions/${sessionId}`, { title });
};
