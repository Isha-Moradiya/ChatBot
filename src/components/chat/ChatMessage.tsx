import { Message } from '../../types/chat.types';
import { cn } from '../../lib/utils';
import { Bot, User, FileText } from 'lucide-react';
import { format } from 'date-fns';

interface ChatMessageProps {
  message: Message;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === 'user';
  const isSystem = message.role === 'system';

  if (isSystem) {
    return (
      <div className="flex justify-center my-4">
        <div className="bg-muted px-4 py-2 rounded-full text-xs text-muted-foreground">
          {message.content}
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'flex gap-3 mb-4 animate-in fade-in-50 slide-in-from-bottom-2',
        isUser ? 'flex-row-reverse' : 'flex-row'
      )}
    >
      <div
        className={cn(
          'flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-full',
          isUser ? 'bg-primary text-primary-foreground' : 'bg-muted'
        )}
      >
        {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
      </div>

      <div className={cn('flex flex-col gap-1', isUser ? 'items-end' : 'items-start', 'max-w-[80%]')}>
        <div
          className={cn(
            'rounded-2xl px-4 py-2',
            isUser
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted'
          )}
        >
          <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>

          {message.metadata?.documents && message.metadata.documents.length > 0 && (
            <div className="mt-2 space-y-1">
              {message.metadata.documents.map((doc) => (
                <div
                  key={doc.id}
                  className={cn(
                    'flex items-center gap-2 p-2 rounded-lg text-xs',
                    isUser ? 'bg-primary-foreground/10' : 'bg-background'
                  )}
                >
                  <FileText className="h-3 w-3" />
                  <span className="truncate flex-1">{doc.name}</span>
                  <span
                    className={cn(
                      'px-2 py-0.5 rounded text-[10px]',
                      doc.status === 'verified'
                        ? 'bg-green-100 text-green-700'
                        : doc.status === 'rejected'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-yellow-100 text-yellow-700'
                    )}
                  >
                    {doc.status}
                  </span>
                </div>
              ))}
            </div>
          )}

          {message.metadata?.companyNames && message.metadata.companyNames.length > 0 && (
            <div className="mt-2 space-y-1">
              <p className="text-xs opacity-70">Suggested names:</p>
              {message.metadata.companyNames.map((name, idx) => (
                <div
                  key={idx}
                  className={cn(
                    'px-2 py-1 rounded text-xs',
                    isUser ? 'bg-primary-foreground/10' : 'bg-background'
                  )}
                >
                  {name}
                </div>
              ))}
            </div>
          )}
        </div>

        <span className="text-[10px] text-muted-foreground px-2">
          {format(new Date(message.timestamp), 'HH:mm')}
        </span>
      </div>
    </div>
  );
};
