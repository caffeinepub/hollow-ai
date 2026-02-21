import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';

interface SharedContent {
  id: string;
  url: string;
}

export function useSharedArtwork(artworkId: string) {
  const { actor, isFetching } = useActor();

  return useQuery<SharedContent>({
    queryKey: ['shared-artwork', artworkId],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      // Backend no longer supports artwork retrieval
      throw new Error('Artwork sharing is not available');
    },
    enabled: !!actor && !isFetching && !!artworkId,
    retry: 1,
  });
}

export function useSharedMusic(musicId: string) {
  const { actor, isFetching } = useActor();

  return useQuery<SharedContent>({
    queryKey: ['shared-music', musicId],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      // Backend no longer supports music retrieval
      throw new Error('Music sharing is not available');
    },
    enabled: !!actor && !isFetching && !!musicId,
    retry: 1,
  });
}
