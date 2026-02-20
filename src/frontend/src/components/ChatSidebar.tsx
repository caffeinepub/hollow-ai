import { useEffect } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { MessageSquarePlus, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { useChatSessions } from '../hooks/useChatSessions';
import { cn } from '@/lib/utils';

interface ChatSidebarProps {
  selectedSessionId: string | null;
  onSelectSession: (sessionId: string | null) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export function ChatSidebar({
  selectedSessionId,
  onSelectSession,
  collapsed,
  onToggleCollapse,
}: ChatSidebarProps) {
  const { sessions, isLoading, createNewSession } = useChatSessions();

  const handleNewChat = async () => {
    const newSessionId = await createNewSession();
    if (newSessionId) {
      onSelectSession(newSessionId);
    }
  };

  const formatTimestamp = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1_000_000);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <aside
      className={cn(
        'border-r border-sidebar-border bg-sidebar transition-all duration-300 flex flex-col',
        collapsed ? 'w-16' : 'w-80'
      )}
    >
      <div className="p-4 flex items-center justify-between gap-2">
        {!collapsed && (
          <Button
            onClick={handleNewChat}
            className="flex-1 gap-2"
            size="sm"
          >
            <MessageSquarePlus className="h-4 w-4" />
            New Chat
          </Button>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleCollapse}
          className="shrink-0"
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      {!collapsed && (
        <>
          <Separator />
          <ScrollArea className="flex-1">
            <div className="p-2 space-y-1">
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : sessions.length === 0 ? (
                <div className="text-center py-8 px-4">
                  <p className="text-sm text-muted-foreground">
                    No conversations yet. Start a new chat!
                  </p>
                </div>
              ) : (
                sessions.map((session) => {
                  const preview =
                    session.messages.length > 0
                      ? session.messages[0].content.slice(0, 50)
                      : 'New conversation';
                  const isSelected = session.id === selectedSessionId;

                  return (
                    <button
                      key={session.id}
                      onClick={() => onSelectSession(session.id)}
                      className={cn(
                        'w-full text-left p-3 rounded-lg transition-colors',
                        'hover:bg-sidebar-accent',
                        isSelected && 'bg-sidebar-accent'
                      )}
                    >
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-sidebar-foreground line-clamp-1">
                          {preview}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatTimestamp(session.lastActive)}
                        </p>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </ScrollArea>
        </>
      )}
    </aside>
  );
}

