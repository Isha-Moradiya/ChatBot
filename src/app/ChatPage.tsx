import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useChat } from '../contexts/ChatContext';
import { ChatMessage } from '../components/chat/ChatMessage';
import { ChatInput } from '../components/chat/ChatInput';
import { AppLayout } from '../components/layout/AppLayout';
import { DocumentUpload } from '../components/chat/DocumentUpload';
import { Button } from '../components/ui/button';
import { ScrollArea } from '../components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Loader2, FileText, Building2 } from 'lucide-react';
import { WorkflowType } from '../types/chat.types';

export const ChatPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const {
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
    deleteSession,
  } = useChat();

  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [workflowDialogOpen, setWorkflowDialogOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // useEffect(() => {
  //   if (!authLoading && !isAuthenticated) {
  //     navigate('/');
  //   }
  // }, [isAuthenticated, authLoading, navigate]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleNewChat = () => {
    setWorkflowDialogOpen(true);
  };

  const handleSelectWorkflow = async (workflowType: WorkflowType) => {
    setWorkflowDialogOpen(false);
    const title =
      workflowType === 'company_registration'
        ? 'Company Registration'
        : workflowType === 'company_incorporation'
        ? 'Company Incorporation'
        : 'General Chat';

    await createNewSession(workflowType, title);
  };

  const handleSendMessage = async (content: string) => {
    try {
      if (!activeSession) {
        await handleSelectWorkflow('general');
      }
      await sendMessage(content);
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const handleUpload = async (file: File) => {
    try {
      await uploadDocument(file);
      setUploadDialogOpen(false);
    } catch (error) {
      console.error('Failed to upload document:', error);
      throw error;
    }
  };

  const showUploadButton =
    activeSession?.workflowType === 'company_registration' ||
    activeSession?.workflowType === 'company_incorporation';

  if (authLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <AppLayout
      variant="chat"
      sessions={sessions}
      activeSessionId={activeSession?.id || null}
      onSessionSelect={setActiveSession}
      onNewChat={handleNewChat}
      onDeleteSession={deleteSession}
      isLoadingSessions={isLoadingSessions}
      headerTitle={activeSession?.title || 'Company Registration Assistant'}
      headerActions={
        showUploadButton ? (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setUploadDialogOpen(true)}
          >
            <FileText className="mr-2 h-4 w-4" />
            Upload Document
          </Button>
        ) : undefined
      }
    >
      <ScrollArea className="flex-1">
        <div className="max-w-4xl mx-auto p-4 space-y-4">
          {!activeSession ? (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
              <div className="p-6 bg-primary/5 rounded-full mb-6">
                <Building2 className="h-16 w-16 text-primary" />
              </div>
              <h2 className="text-2xl font-bold mb-2">
                Company Registration Assistant
              </h2>
              <p className="text-muted-foreground mb-8 max-w-md">
                Government-reference chatbot for company name registration and
                incorporation. Start a new conversation or select an existing one.
              </p>
              <Button onClick={handleNewChat} size="lg">
                Start New Chat
              </Button>
            </div>
          ) : isLoadingMessages ? (
            <div className="flex items-center justify-center min-h-[60vh]">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
              <p className="text-muted-foreground mb-4">
                No messages yet. Start the conversation!
              </p>
            </div>
          ) : (
            <>
              {messages.map((message) => (
                <ChatMessage key={message.id} message={message} />
              ))}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>
      </ScrollArea>

      <ChatInput
        onSend={handleSendMessage}
        disabled={!activeSession}
        isSending={isSending}
        placeholder={
          activeSession
            ? 'Type your message...'
            : 'Start a new chat to begin...'
        }
        showUpload={showUploadButton}
        onUpload={showUploadButton ? () => setUploadDialogOpen(true) : undefined}
      />

      <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload Document</DialogTitle>
          </DialogHeader>
          <DocumentUpload onUpload={handleUpload} />
        </DialogContent>
      </Dialog>

      <Dialog open={workflowDialogOpen} onOpenChange={setWorkflowDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Select Workflow Type</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <Button
              variant="outline"
              className="w-full h-auto py-4 flex flex-col items-start"
              onClick={() => handleSelectWorkflow('company_registration')}
            >
              <span className="font-semibold mb-1">Company Name Registration</span>
              <span className="text-xs text-muted-foreground text-left">
                Register and verify company name availability
              </span>
            </Button>
            <Button
              variant="outline"
              className="w-full h-auto py-4 flex flex-col items-start"
              onClick={() => handleSelectWorkflow('company_incorporation')}
            >
              <span className="font-semibold mb-1">Company Incorporation</span>
              <span className="text-xs text-muted-foreground text-left">
                Complete company incorporation process
              </span>
            </Button>
            <Button
              variant="outline"
              className="w-full h-auto py-4 flex flex-col items-start"
              onClick={() => handleSelectWorkflow('general')}
            >
              <span className="font-semibold mb-1">General Inquiry</span>
              <span className="text-xs text-muted-foreground text-left">
                Ask questions about the registration process
              </span>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
};