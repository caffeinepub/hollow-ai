import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';

interface ShareArtworkParams {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
}

export function useArtworkShare() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  const shareArtworkMutation = useMutation({
    mutationFn: async ({ canvasRef }: ShareArtworkParams) => {
      if (!actor || !canvasRef.current) {
        throw new Error('Canvas or actor not available');
      }

      // Generate unique artwork ID (local only, not persisted)
      const artworkId = `art-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      // Backend no longer supports artwork sharing
      return artworkId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['artworks'] });
    },
  });

  const copyShareUrl = (artworkId: string) => {
    const shareUrl = `${window.location.origin}/shared/art/${artworkId}`;
    navigator.clipboard.writeText(shareUrl);
  };

  return {
    shareArtwork: shareArtworkMutation.mutate,
    isSharing: shareArtworkMutation.isPending,
    shareError: shareArtworkMutation.error,
    shareSuccess: shareArtworkMutation.isSuccess,
    sharedArtworkId: shareArtworkMutation.data,
    copyShareUrl,
    reset: shareArtworkMutation.reset,
  };
}
