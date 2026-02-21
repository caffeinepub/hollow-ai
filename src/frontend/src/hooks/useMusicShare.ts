import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';

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

      // Generate unique music ID (local only, not persisted)
      const musicId = `music-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      // Backend no longer supports music sharing
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
