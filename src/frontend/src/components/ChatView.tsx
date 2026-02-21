import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Send, Loader2, Bot, User, X } from 'lucide-react';
import { useSession, useChatSessions, generateAIResponse } from '../hooks/useChatSessions';
import { cn } from '@/lib/utils';

interface ChatViewProps {
  sessionId: string;
  onClose: () => void;
}

export function ChatView({ sessionId, onClose }: ChatViewProps) {
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const sessionQuery = useSession(sessionId);
  const { addMessage } = useChatSessions();

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input;
    setInput('');
    
    await addMessage(sessionId, `User: ${userMessage}`);
    
    setIsTyping(true);
    
    // Simulate typing delay (500-1500ms based on message length)
    const typingDelay = Math.min(1500, Math.max(500, userMessage.length * 20));
    
    setTimeout(async () => {
      // Get conversation history for context
      const conversationHistory = sessionQuery.data?.messages || [];
      
      // Generate contextual AI response
      const aiResponse = generateAIResponse(userMessage, conversationHistory);
      
      await addMessage(sessionId, `Assistant: ${aiResponse}`);
      setIsTyping(false);
    }, typingDelay);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [sessionQuery.data?.messages, isTyping]);

  if (sessionQuery.isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-background">
      <div className="border-b border-border p-3 sm:p-4 flex items-center justify-between">
        <div>
          <h2 className="text-base sm:text-lg font-semibold text-foreground">Chat Session</h2>
          <p className="text-xs sm:text-sm text-muted-foreground">
            {sessionQuery.data?.messages.length || 0} messages
          </p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="shrink-0 min-h-[44px] min-w-[44px]"
          title="Close chat"
        >
          <X className="h-5 w-5" />
        </Button>
      </div>

      <ScrollArea className="flex-1 p-3 sm:p-4" ref={scrollRef}>
        <div className="space-y-3 sm:space-y-4 max-w-3xl mx-auto">
          {sessionQuery.data?.messages.map((message) => {
            const isUser = message.content.startsWith('User:');
            const content = message.content.replace(/^(User:|Assistant:)\s*/, '');

            return (
              <div
                key={message.id}
                className={cn(
                  'flex gap-2 sm:gap-3',
                  isUser ? 'justify-end' : 'justify-start'
                )}
              >
                {!isUser && (
                  <Avatar className="h-7 w-7 sm:h-8 sm:w-8 shrink-0">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      <Bot className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={cn(
                    'max-w-[85%] sm:max-w-[80%] rounded-lg p-2 sm:p-3',
                    isUser
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-foreground'
                  )}
                >
                  <p className="text-xs sm:text-sm break-words whitespace-pre-wrap">{content}</p>
                </div>
                {isUser && (
                  <Avatar className="h-7 w-7 sm:h-8 sm:w-8 shrink-0">
                    <AvatarFallback className="bg-secondary text-secondary-foreground">
                      <User className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            );
          })}

          {isTyping && (
            <div className="flex gap-2 sm:gap-3 justify-start">
              <Avatar className="h-7 w-7 sm:h-8 sm:w-8 shrink-0">
                <AvatarFallback className="bg-primary text-primary-foreground">
                  <Bot className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
              <div className="bg-muted rounded-lg p-2 sm:p-3">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      <div className="border-t border-border p-3 sm:p-4">
        <div className="flex gap-2 max-w-3xl mx-auto">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            className="min-h-[44px] max-h-32 resize-none text-sm sm:text-base"
            rows={2}
          />
          <Button
            onClick={handleSend}
            disabled={!input.trim()}
            size="icon"
            className="shrink-0 min-h-[44px] min-w-[44px]"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-[10px] sm:text-xs text-muted-foreground mt-2 text-center">
          Press Enter to send, Shift+Enter for new line
        </p>
      </div>
    </div>
  );
}
