import { useState } from 'react';
import { useParams } from '@tanstack/react-router';
import { ChatView } from './ChatView';
import { ChatSidebar } from './ChatSidebar';
import { useNavigate } from '@tanstack/react-router';

export function ChatPage() {
  const params = useParams({ strict: false });
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  
  // Get sessionId from URL params, or null if not present
  const sessionId = (params as any)?.sessionId || null;

  const handleSelectSession = (newSessionId: string | null) => {
    if (newSessionId) {
      navigate({ to: `/chat/${newSessionId}` });
    } else {
      navigate({ to: '/chat' });
    }
  };

  const handleToggleCollapse = () => {
    setCollapsed(!collapsed);
  };

  return (
    <div className="h-[calc(100vh-4rem)] flex">
      <ChatSidebar
        selectedSessionId={sessionId}
        onSelectSession={handleSelectSession}
        collapsed={collapsed}
        onToggleCollapse={handleToggleCollapse}
      />
      <div className="flex-1 overflow-hidden">
        {sessionId ? (
          <ChatView sessionId={sessionId} onClose={() => handleSelectSession(null)} />
        ) : (
          <div className="h-full flex items-center justify-center bg-background">
            <div className="text-center space-y-4 p-8">
              <h2 className="text-2xl font-bold text-foreground">Welcome to Neroxa AI Chat</h2>
              <p className="text-muted-foreground max-w-md">
                Select a conversation from the sidebar or create a new chat to get started.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
