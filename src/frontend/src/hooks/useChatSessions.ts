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

export function useChatSessions() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  const sessionsQuery = useQuery<SessionView[]>({
    queryKey: ['sessions'],
    queryFn: async () => {
      // Backend no longer supports sessions, return empty array
      return [];
    },
    enabled: !!actor,
  });

  const addMessageMutation = useMutation({
    mutationFn: async ({ sessionId, content, isAI }: { sessionId: string; content: string; isAI?: boolean }) => {
      if (!actor) throw new Error('Actor not initialized');

      const message: Message = {
        id: `${Date.now()}-${Math.random()}`,
        content,
        timestamp: BigInt(Date.now() * 1_000_000),
      };

      // Backend no longer supports this functionality
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
      // Create a new session ID (local only, not persisted)
      const sessionId = `session-${Date.now()}`;
      
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
    addMessage: (sessionId: string, content: string, isAI = false) =>
      addMessageMutation.mutateAsync({ sessionId, content, isAI }),
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
      // Backend no longer supports sessions, return mock data
      return {
        id: sessionId,
        messages: [],
        lastActive: BigInt(Date.now() * 1_000_000),
      };
    },
    enabled: !!actor && !!sessionId,
  });
}
