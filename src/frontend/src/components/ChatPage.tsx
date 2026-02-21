import { useState } from 'react';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { ChatSidebar } from './ChatSidebar';
import { ChatView } from './ChatView';
import { MessageSquare, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function ChatPage() {
  const navigate = useNavigate();
  const search = useSearch({ from: '/chat' });
  const sessionId = (search as any)?.sessionId;
  const [collapsed, setCollapsed] = useState(false);

  const handleSelectSession = (newSessionId: string | null) => {
    if (newSessionId) {
      navigate({ to: '/chat', search: { sessionId: newSessionId } });
    } else {
      navigate({ to: '/chat' });
    }
  };

  const handleCloseChat = () => {
    navigate({ to: '/chat' });
  };

  return (
    <div className="h-[calc(100vh-4rem)] flex relative">
      {/* Close Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => navigate({ to: '/' })}
        className="absolute top-2 right-2 z-50 h-10 w-10 rounded-full hover:bg-destructive/10 hover:text-destructive"
        aria-label="Close and return to main menu"
      >
        <X className="h-5 w-5" />
      </Button>

      <ChatSidebar
        selectedSessionId={sessionId || null}
        onSelectSession={handleSelectSession}
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed(!collapsed)}
      />
      {sessionId ? (
        <ChatView sessionId={sessionId} onClose={handleCloseChat} />
      ) : (
        <div className="flex-1 flex items-center justify-center bg-background">
          <div className="text-center space-y-4 p-4">
            <MessageSquare className="h-16 w-16 text-muted-foreground mx-auto" />
            <div>
              <h2 className="text-xl font-semibold text-foreground mb-2">Welcome to Chat</h2>
              <p className="text-sm text-muted-foreground">
                Select a conversation or start a new one to begin chatting
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
