import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';

// Mock types since they're not in the backend anymore
interface Message {
  id: string;
  content: string;
  timestamp: bigint;
}

interface SessionView {
  id: string;
  messages: Message[];
  lastActive: bigint;
}

// Local storage key for sessions
const SESSIONS_STORAGE_KEY = 'neroxa-chat-sessions';

// Helper functions for localStorage
function getStoredSessions(): SessionView[] {
  try {
    const stored = localStorage.getItem(SESSIONS_STORAGE_KEY);
    if (!stored) return [];
    const parsed = JSON.parse(stored);
    // Convert timestamp strings back to bigints
    return parsed.map((session: any) => ({
      ...session,
      lastActive: BigInt(session.lastActive),
      messages: session.messages.map((msg: any) => ({
        ...msg,
        timestamp: BigInt(msg.timestamp),
      })),
    }));
  } catch (error) {
    console.error('Failed to load sessions from localStorage:', error);
    return [];
  }
}

function saveStoredSessions(sessions: SessionView[]): void {
  try {
    // Convert bigints to strings for JSON serialization
    const serializable = sessions.map((session) => ({
      ...session,
      lastActive: session.lastActive.toString(),
      messages: session.messages.map((msg) => ({
        ...msg,
        timestamp: msg.timestamp.toString(),
      })),
    }));
    localStorage.setItem(SESSIONS_STORAGE_KEY, JSON.stringify(serializable));
  } catch (error) {
    console.error('Failed to save sessions to localStorage:', error);
  }
}

export function useChatSessions() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  const sessionsQuery = useQuery<SessionView[]>({
    queryKey: ['sessions'],
    queryFn: async () => {
      // Load sessions from localStorage
      return getStoredSessions();
    },
    enabled: !!actor,
  });

  const addMessageMutation = useMutation({
    mutationFn: async ({ sessionId, content }: { sessionId: string; content: string }) => {
      if (!actor) throw new Error('Actor not initialized');

      const message: Message = {
        id: `${Date.now()}-${Math.random()}`,
        content,
        timestamp: BigInt(Date.now() * 1_000_000),
      };

      // Update localStorage
      const sessions = getStoredSessions();
      const sessionIndex = sessions.findIndex((s) => s.id === sessionId);
      
      if (sessionIndex >= 0) {
        sessions[sessionIndex].messages.push(message);
        sessions[sessionIndex].lastActive = BigInt(Date.now() * 1_000_000);
      } else {
        // Create new session if it doesn't exist
        sessions.push({
          id: sessionId,
          messages: [message],
          lastActive: BigInt(Date.now() * 1_000_000),
        });
      }
      
      saveStoredSessions(sessions);
      return message;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['session', variables.sessionId] });
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
    },
  });

  const createNewSession = async (): Promise<string | null> => {
    if (!actor) return null;

    try {
      // Create a new session ID
      const sessionId = `session-${Date.now()}`;
      
      // Add to localStorage
      const sessions = getStoredSessions();
      sessions.push({
        id: sessionId,
        messages: [],
        lastActive: BigInt(Date.now() * 1_000_000),
      });
      saveStoredSessions(sessions);
      
      // Invalidate queries to refresh the session list
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
      
      return sessionId;
    } catch (error) {
      console.error('Failed to create session:', error);
      return null;
    }
  };

  return {
    sessions: sessionsQuery.data || [],
    isLoading: sessionsQuery.isLoading,
    addMessage: (sessionId: string, content: string) =>
      addMessageMutation.mutateAsync({ sessionId, content }),
    isAddingMessage: addMessageMutation.isPending,
    createNewSession,
  };
}

export function useSession(sessionId: string) {
  const { actor } = useActor();

  return useQuery<SessionView>({
    queryKey: ['session', sessionId],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not initialized');
      
      // Load from localStorage
      const sessions = getStoredSessions();
      const session = sessions.find((s) => s.id === sessionId);
      
      if (session) {
        return session;
      }
      
      // Return empty session if not found
      return {
        id: sessionId,
        messages: [],
        lastActive: BigInt(Date.now() * 1_000_000),
      };
    },
    enabled: !!actor && !!sessionId,
  });
}
