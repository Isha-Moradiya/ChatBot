import { useState, useRef, KeyboardEvent } from 'react';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { Send, Paperclip, Loader2 } from 'lucide-react';

interface ChatInputProps {
  onSend: (message: string) => void;
  onUpload?: (file: File) => void;
  disabled?: boolean;
  isSending?: boolean;
  placeholder?: string;
  showUpload?: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSend,
  onUpload,
  disabled = false,
  isSending = false,
  placeholder = 'Type your message...',
  showUpload = false,
}) => {
  const [message, setMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSend = () => {
    if (message.trim() && !isSending) {
      onSend(message.trim());
      setMessage('');
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onUpload) {
      onUpload(file);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="bg-slate-50 p-4">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-end gap-2">
          {showUpload && onUpload && (
            <>
              <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileChange}
                className="hidden"
                disabled={disabled || isSending}
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => fileInputRef.current?.click()}
                disabled={disabled || isSending}
                className="shrink-0"
              >
                <Paperclip className="h-4 w-4" />
              </Button>
            </>
          )}
          <div className="flex flex-row w-full justify-between items-center gap-2 rounded-2xl bg-zinc-800 py-2 px-4 border border-zinc-800 focus-within:ring-2 focus-within:ring-primary/40">
            {/* Input */}
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="How can I help you today?"
              rows={1}
              className="w-full h-full resize-none bg-transparent text-zinc-100 placeholder-zinc-500 text-base focus:outline-none overflow-y-auto focus-visible:outline-none focus-visible:ring-0 hide-scrollbar"
            />

            <Button
              onClick={handleSend}
              disabled={!message.trim() || disabled || isSending}
              size="icon"
              className="shrink-0 h-10 w-10 flex items-center justify-center rounded-xl bg-zinc-600 hover:bg-zinc-500 text-white"
            >
              {isSending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>

        </div>
        {/* <p className="text-xs text-muted-foreground mt-2 text-center">
          Press Enter to send, Shift + Enter for new line
        </p> */}
      </div>
    </div>
  );
};
