import { ReactNode, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import { PanelLeft, Building2 } from 'lucide-react';
import { Sidebar } from '../chat/Sidebar';
import { UserProfile } from '../chat/UserProfile';
import { ChatSession } from '../../types/chat.types';

type LayoutVariant = 'home' | 'chat';

interface AppLayoutProps {
  children: ReactNode;
  variant?: LayoutVariant;

  // Home layout props
  showAuthButtons?: boolean;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | 'full';
  centered?: boolean;

  // Chat layout props
  sessions?: ChatSession[];
  activeSessionId?: string | null;
  onSessionSelect?: (session: ChatSession) => void;
  onNewChat?: () => void;
  onDeleteSession?: (sessionId: string) => void;
  isLoadingSessions?: boolean;
  headerTitle?: string;
  headerActions?: ReactNode;
}

const maxWidthClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  '2xl': 'max-w-2xl',
  '3xl': 'max-w-3xl',
  '4xl': 'max-w-4xl',
  full: 'max-w-full',
};

export const AppLayout = ({
  children,
  variant = 'home',
  showAuthButtons = true,
  maxWidth = '4xl',
  centered = true,
  sessions = [],
  activeSessionId = null,
  onSessionSelect,
  onNewChat,
  onDeleteSession,
  isLoadingSessions = false,
  headerTitle = 'Company Registration Assistant',
  headerActions,
}: AppLayoutProps) => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    if (variant === 'chat') {
      const handleResize = () => {
        setSidebarOpen(window.innerWidth >= 1024);
      };

      handleResize();
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, [variant]);

  // Home layout
  if (variant === 'home') {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <header className="flex items-center justify-between">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
              <div className="p-2 bg-primary rounded-lg">
                <Building2 className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">Gov Registration</span>
            </div>
            {showAuthButtons && (
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => navigate('/login')}>
                  Login
                </Button>
                <Button onClick={() => navigate('/register')}>Register</Button>
              </div>
            )}
          </header>

          {/* Main Content */}
          <main className={`${maxWidthClasses[maxWidth]} ${centered ? 'm-auto' : ''} h-full`}>
            {children}
          </main>
        </div>
      </div>
    );
  }

  // Chat layout
  return (
    <div className="h-screen flex overflow-hidden bg-slate-50">
      {/* Desktop Sidebar */}
      {sidebarOpen && onSessionSelect && onNewChat && onDeleteSession && (
        <div className="w-80 shrink-0 hidden lg:block">
          <div className="h-full flex flex-col">
            <Sidebar
              sessions={sessions}
              activeSessionId={activeSessionId}
              onSessionSelect={onSessionSelect}
              onNewChat={onNewChat}
              onDeleteSession={onDeleteSession}
              isLoading={isLoadingSessions}
              onToggle={() => setSidebarOpen(false)}
            />
            <UserProfile />
          </div>
        </div>
      )}

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && onSessionSelect && onNewChat && onDeleteSession && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        >
          <div
            className="w-80 h-full bg-background"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="h-full flex flex-col">
              <Sidebar
                sessions={sessions}
                activeSessionId={activeSessionId}
                onSessionSelect={(session) => {
                  onSessionSelect(session);
                  setSidebarOpen(false);
                }}
                onNewChat={() => {
                  onNewChat();
                  setSidebarOpen(false);
                }}
                onDeleteSession={onDeleteSession}
                onClose={() => setSidebarOpen(false)}
                isLoading={isLoadingSessions}
                onToggle={() => setSidebarOpen(false)}
              />
              <UserProfile />
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="p-4 flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="shrink-0 lg:hidden"
          >
            <PanelLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
            <div className="p-2 bg-primary rounded-lg">
              <Building2 className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">Gov Registration</span>
          </div>
        </header>

        {/* Content */}
        {children}
      </div>
    </div>
  );
};