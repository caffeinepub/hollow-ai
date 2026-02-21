import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Game } from '../backend';
import { toast } from 'sonner';

export function useGetAllGames() {
  const { actor, isFetching } = useActor();

  return useQuery<Game[]>({
    queryKey: ['games', 'all'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.getAllGames();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetGame(id: string) {
  const { actor, isFetching } = useActor();

  return useQuery<Game | null>({
    queryKey: ['games', 'single', id],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.getGame(id);
    },
    enabled: !!actor && !isFetching && !!id,
  });
}

export function useCreateGame() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ title, description, gameCode }: { title: string; description: string; gameCode: string }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.createGame(title, description, gameCode);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['games'] });
    },
    onError: (error) => {
      console.error('Failed to create game:', error);
    },
  });
}

export function useDeleteGame() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.deleteGame(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['games'] });
    },
    onError: (error) => {
      console.error('Failed to delete game:', error);
    },
  });
}
