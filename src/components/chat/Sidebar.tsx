import { useState } from 'react';
import { ChatSession } from '../../types/chat.types';
import { Button } from '../ui/button';
import { ScrollArea } from '../ui/scroll-area';
import { Plus, MessageSquare, Trash2, PanelLeftClose } from 'lucide-react';
import { cn } from '../../lib/utils';
import { isToday, isYesterday, isThisWeek } from 'date-fns';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../ui/alert-dialog';

interface SidebarProps {
  sessions: ChatSession[];
  activeSessionId: string | null;
  onSessionSelect: (session: ChatSession) => void;
  onNewChat: () => void;
  onDeleteSession: (sessionId: string) => void;
  onClose?: () => void;
  isLoading?: boolean;
  onToggle?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  sessions,
  activeSessionId,
  onSessionSelect,
  onNewChat,
  onDeleteSession,
  onClose,
  isLoading = false,
  onToggle
}) => {
  const [deleteSessionId, setDeleteSessionId] = useState<string | null>(null);

  const groupedSessions = {
    today: sessions.filter((s) => isToday(new Date(s.createdAt))),
    yesterday: sessions.filter((s) => isYesterday(new Date(s.createdAt))),
    thisWeek: sessions.filter((s) => {
      const date = new Date(s.createdAt);
      return !isToday(date) && !isYesterday(date) && isThisWeek(date);
    }),
    older: sessions.filter((s) => {
      const date = new Date(s.createdAt);
      return !isToday(date) && !isYesterday(date) && !isThisWeek(date);
    }),
  };

  const handleDelete = (e: React.MouseEvent, sessionId: string) => {
    e.stopPropagation();
    setDeleteSessionId(sessionId);
  };

  const confirmDelete = () => {
    if (deleteSessionId) {
      onDeleteSession(deleteSessionId);
      setDeleteSessionId(null);
    }
  };

  const renderSessionGroup = (title: string, sessionsList: ChatSession[]) => {
    if (sessionsList.length === 0) return null;

    return (
      <div className="mb-4">
        <h3 className="text-xs font-semibold text-muted-foreground mb-2 px-2">{title}</h3>
        <div className="space-y-1">
          {sessionsList.map((session) => (
            <button
              key={session.id}
              onClick={() => onSessionSelect(session)}
              className={cn(
                'w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors group',
                activeSessionId === session.id
                  ? 'bg-primary/10 text-primary'
                  : 'hover:bg-accent text-muted-foreground hover:text-foreground'
              )}
            >
              <MessageSquare className="h-4 w-4 shrink-0" />
              <span className="flex-1 truncate text-left">{session.title}</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => handleDelete(e, session.id)}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </button>
          ))}
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="flex flex-col h-full bg-background border-r">
        <div className="p-4 border-b flex items-center justify-between">
          <h2 className="font-semibold">Chat Sessions</h2>

          {onToggle && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggle}
              // className="lg:hidden"
            >
              <PanelLeftClose className="h-4 w-4" />
            </Button>
          )}
        </div>

        <div className="p-4">
          <Button onClick={onNewChat} className="w-full" disabled={isLoading}>
            <Plus className="mr-2 h-4 w-4" />
            New Chat
          </Button>
        </div>

        <ScrollArea className="flex-1 px-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-sm text-muted-foreground">Loading sessions...</div>
            </div>
          ) : sessions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <MessageSquare className="h-12 w-12 text-muted-foreground/50 mb-2" />
              <p className="text-sm text-muted-foreground">No chat sessions yet</p>
              <p className="text-xs text-muted-foreground mt-1">Start a new conversation</p>
            </div>
          ) : (
            <>
              {renderSessionGroup('Today', groupedSessions.today)}
              {renderSessionGroup('Yesterday', groupedSessions.yesterday)}
              {renderSessionGroup('This Week', groupedSessions.thisWeek)}
              {renderSessionGroup('Older', groupedSessions.older)}
            </>
          )}
        </ScrollArea>
      </div>

      <AlertDialog open={!!deleteSessionId} onOpenChange={() => setDeleteSessionId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Chat Session</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this chat session? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
