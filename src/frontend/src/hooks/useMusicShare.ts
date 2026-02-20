import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { ExternalBlob } from '../backend';

interface ShareMusicParams {
  audioBlob: Blob;
}

export function useMusicShare() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  const shareMusicMutation = useMutation({
    mutationFn: async ({ audioBlob }: ShareMusicParams) => {
      if (!actor) {
        throw new Error('Actor not available');
      }

      // Convert blob to Uint8Array
      const arrayBuffer = await audioBlob.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);

      // Generate unique music ID
      const musicId = `music-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      // Create ExternalBlob and upload
      const externalBlob = ExternalBlob.fromBytes(uint8Array);
      
      await actor.shareMusic(musicId, externalBlob);

      return musicId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['music'] });
    },
  });

  const copyShareUrl = (musicId: string) => {
    const shareUrl = `${window.location.origin}/shared/music/${musicId}`;
    navigator.clipboard.writeText(shareUrl);
  };

  return {
    shareMusic: shareMusicMutation.mutate,
    isSharing: shareMusicMutation.isPending,
    shareError: shareMusicMutation.error,
    shareSuccess: shareMusicMutation.isSuccess,
    sharedMusicId: shareMusicMutation.data,
    copyShareUrl,
    reset: shareMusicMutation.reset,
  };
}
