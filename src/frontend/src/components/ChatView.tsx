import { useState, useEffect, useRef } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Send, Loader2, Bot, User } from 'lucide-react';
import { useChatSessions, useSession } from '../hooks/useChatSessions';
import { cn } from '@/lib/utils';

interface ChatViewProps {
  sessionId: string;
}

export function ChatView({ sessionId }: ChatViewProps) {
  const [input, setInput] = useState('');
  const { addMessage, isAddingMessage } = useChatSessions();
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const sessionQuery = useSession(sessionId);
  const session = sessionQuery.data;

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [session?.messages]);

  const handleSend = async () => {
    if (!input.trim() || isAddingMessage) return;

    const userMessage = input.trim();
    setInput('');

    await addMessage(sessionId, userMessage);
    
    // Simulate AI response
    setTimeout(async () => {
      const aiResponse = generateAIResponse(userMessage);
      await addMessage(sessionId, aiResponse, true);
    }, 1000);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatTimestamp = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1_000_000);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (sessionQuery.isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="border-b border-border p-4">
        <h2 className="text-lg font-semibold text-foreground">Chat Session</h2>
        <p className="text-sm text-muted-foreground">Ask me anything about math, learning, or more!</p>
      </div>

      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        <div className="max-w-3xl mx-auto space-y-4">
          {!session?.messages || session.messages.length === 0 ? (
            <div className="text-center py-12">
              <Bot className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">
                Start the conversation by sending a message below
              </p>
            </div>
          ) : (
            session.messages.map((message, index) => {
              const isAI = index % 2 === 1;
              return (
                <div
                  key={message.id}
                  className={cn('flex gap-3', isAI ? 'justify-start' : 'justify-end')}
                >
                  {isAI && (
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0">
                      <Bot className="h-5 w-5 text-primary-foreground" />
                    </div>
                  )}
                  <Card className={cn('p-4 max-w-[80%]', isAI ? 'bg-card' : 'bg-primary text-primary-foreground')}>
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    <p className={cn('text-xs mt-2', isAI ? 'text-muted-foreground' : 'text-primary-foreground/70')}>
                      {formatTimestamp(message.timestamp)}
                    </p>
                  </Card>
                  {!isAI && (
                    <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center shrink-0">
                      <User className="h-5 w-5 text-accent-foreground" />
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </ScrollArea>

      <div className="border-t border-border p-4">
        <div className="max-w-3xl mx-auto flex gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            className="min-h-[60px] max-h-[200px] resize-none"
            disabled={isAddingMessage}
          />
          <Button
            onClick={handleSend}
            disabled={!input.trim() || isAddingMessage}
            size="icon"
            className="h-[60px] w-[60px] shrink-0"
          >
            {isAddingMessage ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Send className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

function generateAIResponse(userMessage: string): string {
  const lowerMessage = userMessage.toLowerCase();
  
  if (lowerMessage.includes('math') || lowerMessage.includes('solve') || /\d+[\+\-\*\/]\d+/.test(lowerMessage)) {
    return "I'd be happy to help with math! You can use the Math Solver tab to solve problems from kindergarten through 12th grade. Just enter your expression and I'll provide step-by-step solutions.";
  }
  
  if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
    return "Hello! I'm Axora AI, your learning companion. I can help you with math problems, show you educational media, and answer your questions. What would you like to learn today?";
  }
  
  if (lowerMessage.includes('help')) {
    return "I'm here to help! I can:\n• Solve math problems from basic arithmetic to calculus\n• Display educational images and videos\n• Answer questions about various topics\n• Keep track of our conversation history\n\nWhat would you like to explore?";
  }
  
  return "That's an interesting question! I'm designed to help with math problems and educational content. Feel free to ask me about math, or use the Math Solver and Media Gallery tabs to explore more features.";
}

