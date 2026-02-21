import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const HIGH_SCORE_PREFIX = 'highscore_';

export function useGetHighScore(gameId: string) {
  return useQuery<number>({
    queryKey: ['highScore', gameId],
    queryFn: () => {
      const stored = localStorage.getItem(`${HIGH_SCORE_PREFIX}${gameId}`);
      return stored ? parseInt(stored, 10) : 0;
    },
    staleTime: Infinity,
  });
}

export function useUpdateHighScore() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ gameId, score }: { gameId: string; score: number }) => {
      const currentHighScore = localStorage.getItem(`${HIGH_SCORE_PREFIX}${gameId}`);
      const current = currentHighScore ? parseInt(currentHighScore, 10) : 0;
      
      if (score > current) {
        localStorage.setItem(`${HIGH_SCORE_PREFIX}${gameId}`, score.toString());
        return score;
      }
      return current;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['highScore', variables.gameId] });
    },
  });
}
