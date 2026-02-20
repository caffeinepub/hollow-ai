import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { GameCatalogueView, GameMetadata } from '../backend';

export function useGameCatalogue() {
  const { actor, isFetching } = useActor();

  return useQuery<GameCatalogueView[]>({
    queryKey: ['games', 'catalogue'],
    queryFn: async () => {
      if (!actor) return [];
      return await actor.getGameCatalogue();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGameMetadata(gameId: string) {
  const { actor, isFetching } = useActor();

  return useQuery<GameMetadata>({
    queryKey: ['games', 'metadata', gameId],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not initialized');
      return await actor.getGameMetadata(gameId);
    },
    enabled: !!actor && !isFetching && !!gameId,
  });
}
