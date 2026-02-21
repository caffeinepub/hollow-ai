import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { GameMetadata } from '../backend';

export function useGameCatalogue() {
  const { actor, isFetching } = useActor();

  return useQuery<GameMetadata[]>({
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

  return useQuery<GameMetadata | null>({
    queryKey: ['games', 'metadata', gameId],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.getGame(gameId);
    },
    enabled: !!actor && !isFetching && !!gameId,
  });
}

export function useGameTemplates() {
  const { actor, isFetching } = useActor();

  return useQuery<string[]>({
    queryKey: ['games', 'templates'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.listTemplateNames();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGameTemplate(templateName: string) {
  const { actor, isFetching } = useActor();

  return useQuery<string>({
    queryKey: ['games', 'template', templateName],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.getTemplate(templateName);
    },
    enabled: !!actor && !isFetching && !!templateName,
  });
}

export function useGamesByCategory(category: string) {
  const { actor, isFetching } = useActor();

  return useQuery<GameMetadata[]>({
    queryKey: ['games', 'category', category],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.searchGamesByCategory(category);
    },
    enabled: !!actor && !isFetching && !!category && category !== 'all',
  });
}

export function useCategories() {
  const { actor, isFetching } = useActor();

  return useQuery<string[]>({
    queryKey: ['games', 'categories'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.getCategories();
    },
    enabled: !!actor && !isFetching,
  });
}
