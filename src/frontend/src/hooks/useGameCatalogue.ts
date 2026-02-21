import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';

// Mock types since they're not in the backend anymore
interface GameCatalogueView {
  id: string;
  title: string;
  description: string;
  category: string;
  playable: boolean;
  hasThumbnail: boolean;
}

interface GameMetadata {
  id: string;
  title: string;
  description: string;
  category: string;
  playable: boolean;
}

export function useGameCatalogue() {
  const { actor, isFetching } = useActor();

  return useQuery<GameCatalogueView[]>({
    queryKey: ['games', 'catalogue'],
    queryFn: async () => {
      // Backend no longer supports games, return empty array
      return [];
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
      // Backend no longer supports games, return mock data
      return {
        id: gameId,
        title: 'Game',
        description: 'Game description',
        category: 'General',
        playable: false,
      };
    },
    enabled: !!actor && !isFetching && !!gameId,
  });
}
