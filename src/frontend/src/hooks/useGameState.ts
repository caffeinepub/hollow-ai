import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { toast } from 'sonner';

export function useGetHighScore(gameId: string) {
  const { actor, isFetching } = useActor();

  return useQuery<bigint>({
    queryKey: ['games', 'highscore', gameId],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.getHighScore(gameId);
    },
    enabled: !!actor && !isFetching && !!gameId,
  });
}

export function useUpdateHighScore() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ gameId, score }: { gameId: string; score: number }) => {
      if (!actor) throw new Error('Actor not initialized');
      await actor.updateHighScore(gameId, BigInt(score));
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['games', 'highscore', variables.gameId] });
      queryClient.invalidateQueries({ queryKey: ['games', 'metadata', variables.gameId] });
      toast.success('New high score! 🎉');
    },
    onError: (error) => {
      console.error('Failed to update high score:', error);
      toast.error('Failed to save high score');
    },
  });
}
