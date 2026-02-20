import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { SessionView, Message } from '../backend';

export function useChatSessions() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  const sessionsQuery = useQuery<SessionView[]>({
    queryKey: ['sessions'],
    queryFn: async () => {
      if (!actor) return [];
      try {
        return await actor.getUserSessions();
      } catch (error) {
        // If user doesn't exist, register them
        if (error instanceof Error && error.message.includes('User does not exist')) {
          await actor.registerUser();
          return [];
        }
        throw error;
      }
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

      await actor.addMessageToSession(sessionId, message);
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
      // Register user if not already registered
      try {
        await actor.registerUser();
      } catch (error) {
        // User might already be registered, continue
      }

      // Create a new session ID
      const sessionId = `session-${Date.now()}`;
      
      // Add an initial message to create the session
      const initialMessage: Message = {
        id: `${Date.now()}-init`,
        content: 'Welcome to Hollow AI! How can I help you today?',
        timestamp: BigInt(Date.now() * 1_000_000),
      };

      await actor.addMessageToSession(sessionId, initialMessage);
      
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
      return await actor.getSession(sessionId);
    },
    enabled: !!actor && !!sessionId,
  });
}

