import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { ExternalBlob } from '../backend';

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

      // Convert canvas to PNG blob
      const blob = await new Promise<Blob>((resolve, reject) => {
        canvasRef.current!.toBlob((blob) => {
          if (blob) resolve(blob);
          else reject(new Error('Failed to convert canvas to blob'));
        }, 'image/png');
      });

      // Convert blob to Uint8Array
      const arrayBuffer = await blob.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);

      // Generate unique artwork ID
      const artworkId = `art-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      // Create ExternalBlob and upload
      const externalBlob = ExternalBlob.fromBytes(uint8Array);
      
      await actor.shareArtwork(artworkId, externalBlob);

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
