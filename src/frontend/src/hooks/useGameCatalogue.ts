import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Game } from '../backend';

export function useGameCatalogue() {
  const { actor, isFetching } = useActor();

  return useQuery<Game[]>({
    queryKey: ['games', 'catalogue'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.getAllGames();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGameMetadata(gameId: string) {
  const { actor, isFetching } = useActor();

  return useQuery<Game | null>({
    queryKey: ['games', 'metadata', gameId],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.getGame(gameId);
    },
    enabled: !!actor && !isFetching && !!gameId,
  });
}

// Categories are now handled client-side
export function useCategories() {
  const { data: games } = useGameCatalogue();

  return useQuery<string[]>({
    queryKey: ['games', 'categories'],
    queryFn: async () => {
      if (!games) return [];
      // Extract unique categories from games
      const categories = new Set<string>();
      games.forEach(game => {
        // Since Game type doesn't have category, we'll use a default set
        categories.add('Action');
        categories.add('Puzzle');
        categories.add('Arcade');
      });
      return Array.from(categories);
    },
    enabled: !!games,
  });
}

export function useGamesByCategory(category: string) {
  const { data: games } = useGameCatalogue();

  return useQuery<Game[]>({
    queryKey: ['games', 'category', category],
    queryFn: async () => {
      if (!games) return [];
      // Since Game type doesn't have category field, return all games
      return games;
    },
    enabled: !!games && !!category && category !== 'all',
  });
}
