import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { AppLayout } from '../components/layout/AppLayout';
import { Button } from '../components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, Sparkles, Shield } from 'lucide-react';

export const HomePage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAuth();
  const [message, setMessage] = useState('');
  const [messageCount, setMessageCount] = useState(0);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  // useEffect(() => {
  //   if (isAuthenticated) {
  //     navigate('/chat');
  //   }
  // }, [isAuthenticated, navigate]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();

    if (!message.trim()) return;

    if (messageCount >= 3) {
      setShowLoginPrompt(true);
      return;
    }

    setMessageCount(messageCount + 1);
    setMessage('');

    if (messageCount + 1 >= 3) {
      setTimeout(() => {
        setShowLoginPrompt(true);
      }, 1000);
    }

    navigate("/chat")
  };

  if (isLoading) {
    return null;
  }

  return (
    <AppLayout
      variant="home"
      showAuthButtons={!isAuthenticated}
    >
      <div className="min-h-[calc(100vh-180px)] flex flex-col justify-center">

        {/* Hero Section */}
        <div className="text-center mb-12 space-y-5">
          <div
            className="inline-flex items-center gap-2 px-4 py-2 
    bg-gradient-to-r from-primary/10 via-primary/15 to-primary/10 
    text-primary rounded-full text-sm
    relative overflow-hidden group"
          >
            {/* Subtle animated shine effect */}
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full 
      transition-transform duration-1000 ease-in-out 
      bg-gradient-to-r from-transparent via-white/20 to-transparent" />

            <Sparkles className="h-4 w-4 animate-spin-slow" />
            <span className="tracking-wide font-medium">AI for Government Services</span>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold tracking-normal text-zinc-800 dark:text-zinc-100">
            Smart Company Registration with AI
          </h1>
        </div>

        {/* Chat Input or Login Prompt */}
        <div>
          {showLoginPrompt ? (
            <div className="text-center py-8 space-y-4">
              <div className="p-4 bg-primary/10 rounded-full w-16 h-16 mx-auto flex items-center justify-center mb-4">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-2xl font-bold">Continue Your Journey</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                Please login or register to continue your conversation and access
                full features including document upload and session history.
              </p>
              <div className="flex gap-3 justify-center pt-4">
                <Button size="lg" onClick={() => navigate('/login')}>
                  Login
                </Button>
                <Button size="lg" variant="outline" onClick={() => navigate('/register')}>
                  Register
                </Button>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setShowLoginPrompt(false);
                  setMessageCount(0);
                }}
              >
                Start Over
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSendMessage} className="w-full">
              <div className="flex flex-col justify-between gap-1 h-40 rounded-2xl bg-zinc-800 p-4 border border-zinc-800 focus-within:ring-2 focus-within:ring-primary/40">
                {/* Input */}
                <Textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="How can I help you today?"
                  rows={1}
                  className="w-full h-full resize-none bg-transparent text-zinc-100 placeholder-zinc-500 text-base focus:outline-none px-4 pb-12 overflow-y-auto focus-visible:outline-none focus-visible:ring-0 hide-scrollbar"
                />

                <div className='flex flex-row gap-2 justify-end items-end pt-2'>
                  {/* Model selector */}
                  <Button
                    type="button"
                    variant="ghost"
                    className="text-sm text-zinc-400 hover:text-zinc-200 px-2"
                  >
                    Sonnet 4.5 ▾
                  </Button>

                  {/* Send */}
                  <Button
                    size="icon"
                    type="submit"
                    className="h-10 w-10 flex items-center justify-center rounded-xl bg-zinc-600 hover:bg-zinc-500 text-white"
                  >
                    <Send className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </AppLayout>
  );
};