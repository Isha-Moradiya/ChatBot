import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ChatSession, Message, WorkflowType } from '../types/chat.types';
import * as chatService from '../api/chat.service';
import { useAuth } from './AuthContext';

interface ChatContextType {
  sessions: ChatSession[];
  activeSession: ChatSession | null;
  messages: Message[];
  isLoadingSessions: boolean;
  isLoadingMessages: boolean;
  isSending: boolean;
  createNewSession: (workflowType: WorkflowType, title?: string) => Promise<ChatSession>;
  setActiveSession: (session: ChatSession | null) => void;
  sendMessage: (content: string, metadata?: Record<string, any>) => Promise<void>;
  uploadDocument: (file: File, documentType?: string) => Promise<void>;
  loadSessions: () => Promise<void>;
  loadMessages: (sessionId: string) => Promise<void>;
  deleteSession: (sessionId: string) => Promise<void>;
  updateSessionTitle: (sessionId: string, title: string) => Promise<void>;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within ChatProvider');
  }
  return context;
};

interface ChatProviderProps {
  children: ReactNode;
}

export const ChatProvider: React.FC<ChatProviderProps> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSession, setActiveSessionState] = useState<ChatSession | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoadingSessions, setIsLoadingSessions] = useState(false);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      loadSessions();
    } else {
      setSessions([]);
      setActiveSessionState(null);
      setMessages([]);
    }
  }, [isAuthenticated]);

  const loadSessions = async () => {
    try {
      setIsLoadingSessions(true);
      const response = await chatService.getSessions();
      setSessions(response.data.sessions);
    } catch (error) {
      console.error('Failed to load sessions:', error);
    } finally {
      setIsLoadingSessions(false);
    }
  };

  const loadMessages = async (sessionId: string) => {
    try {
      setIsLoadingMessages(true);
      const response = await chatService.getMessages({ sessionId });
      setMessages(response.data.messages);
    } catch (error) {
      console.error('Failed to load messages:', error);
    } finally {
      setIsLoadingMessages(false);
    }
  };

  const createNewSession = async (workflowType: WorkflowType, title?: string): Promise<ChatSession> => {
    const response = await chatService.createSession({
      workflowType,
      title: title || `New ${workflowType.replace('_', ' ')}`,
    });

    const newSession = response.data.session;
    setSessions((prev) => [newSession, ...prev]);
    setActiveSessionState(newSession);
    setMessages([]);

    return newSession;
  };

  const setActiveSession = (session: ChatSession | null) => {
    setActiveSessionState(session);
    if (session) {
      loadMessages(session.id);
    } else {
      setMessages([]);
    }
  };

  const sendMessage = async (content: string, metadata?: Record<string, any>) => {
    if (!activeSession) {
      throw new Error('No active session');
    }

    try {
      setIsSending(true);

      const userMessage: Message = {
        id: `temp-${Date.now()}`,
        sessionId: activeSession.id,
        role: 'user',
        content,
        timestamp: new Date().toISOString(),
        metadata,
      };

      setMessages((prev) => [...prev, userMessage]);

      const response = await chatService.sendMessage({
        sessionId: activeSession.id,
        content,
        metadata,
      });

      setMessages((prev) => {
        const filtered = prev.filter((m) => m.id !== userMessage.id);
        return [...filtered, response.data.message];
      });

      setSessions((prev) =>
        prev.map((s) => (s.id === activeSession.id ? response.data.session : s))
      );
    } catch (error) {
      console.error('Failed to send message:', error);
      throw error;
    } finally {
      setIsSending(false);
    }
  };

  const uploadDocument = async (file: File, documentType?: string) => {
    if (!activeSession) {
      throw new Error('No active session');
    }

    try {
      const response = await chatService.uploadDocument({
        sessionId: activeSession.id,
        file,
        documentType,
      });

      const documentMessage: Message = {
        id: `doc-${Date.now()}`,
        sessionId: activeSession.id,
        role: 'user',
        content: `Uploaded document: ${file.name}`,
        timestamp: new Date().toISOString(),
        metadata: {
          documents: [response.data.document],
        },
      };

      setMessages((prev) => [...prev, documentMessage]);
    } catch (error) {
      console.error('Failed to upload document:', error);
      throw error;
    }
  };

  const deleteSession = async (sessionId: string) => {
    await chatService.deleteSession(sessionId);
    setSessions((prev) => prev.filter((s) => s.id !== sessionId));
    if (activeSession?.id === sessionId) {
      setActiveSessionState(null);
      setMessages([]);
    }
  };

  const updateSessionTitle = async (sessionId: string, title: string) => {
    await chatService.updateSessionTitle(sessionId, title);
    setSessions((prev) =>
      prev.map((s) => (s.id === sessionId ? { ...s, title } : s))
    );
  };

  const value: ChatContextType = {
    sessions,
    activeSession,
    messages,
    isLoadingSessions,
    isLoadingMessages,
    isSending,
    createNewSession,
    setActiveSession,
    sendMessage,
    uploadDocument,
    loadSessions,
    loadMessages,
    deleteSession,
    updateSessionTitle,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};
