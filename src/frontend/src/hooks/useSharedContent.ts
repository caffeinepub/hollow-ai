import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { ArtworkId, MusicId } from '../backend';

export function useSharedArtwork(artworkId: ArtworkId) {
  const { actor, isFetching } = useActor();

  return useQuery({
    queryKey: ['shared-artwork', artworkId],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      const externalBlob = await actor.retrieveArtwork(artworkId);
      return {
        id: artworkId,
        url: externalBlob.getDirectURL(),
        blob: externalBlob,
      };
    },
    enabled: !!actor && !isFetching && !!artworkId,
    retry: 1,
  });
}

export function useSharedMusic(musicId: MusicId) {
  const { actor, isFetching } = useActor();

  return useQuery({
    queryKey: ['shared-music', musicId],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      const externalBlob = await actor.retrieveMusic(musicId);
      return {
        id: musicId,
        url: externalBlob.getDirectURL(),
        blob: externalBlob,
      };
    },
    enabled: !!actor && !isFetching && !!musicId,
    retry: 1,
  });
}
