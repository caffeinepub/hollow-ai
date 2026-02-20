import { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, AlertCircle, ArrowLeft, Image as ImageIcon, Music } from 'lucide-react';
import { useSharedArtwork, useSharedMusic } from '../hooks/useSharedContent';
import { useNavigate } from '@tanstack/react-router';

interface SharedContentViewerProps {
  type: 'art' | 'music';
  id: string;
}

export function SharedContentViewer({ type, id }: SharedContentViewerProps) {
  const navigate = useNavigate();
  const artworkQuery = useSharedArtwork(type === 'art' ? id : '');
  const musicQuery = useSharedMusic(type === 'music' ? id : '');

  const isLoading = type === 'art' ? artworkQuery.isLoading : musicQuery.isLoading;
  const error = type === 'art' ? artworkQuery.error : musicQuery.error;
  const artwork = type === 'art' ? artworkQuery.data?.url : undefined;
  const music = type === 'music' ? musicQuery.data?.url : undefined;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="text-center space-y-4">
          <Loader2 className="h-10 w-10 sm:h-12 sm:w-12 animate-spin text-primary mx-auto" />
          <p className="text-sm sm:text-base text-muted-foreground">Loading shared content...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive text-lg sm:text-xl">
              <AlertCircle className="h-5 w-5" />
              Content Not Found
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-xs sm:text-sm text-muted-foreground">
              The shared {type === 'art' ? 'artwork' : 'music'} you're looking for doesn't exist or has been removed.
            </p>
            <Button onClick={() => navigate({ to: '/' })} className="w-full min-h-[44px]">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-3 sm:p-4 md:p-6">
      <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">
        <Button
          onClick={() => navigate({ to: '/' })}
          variant="outline"
          size="sm"
          className="min-h-[44px]"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Button>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
              {type === 'art' ? (
                <>
                  <ImageIcon className="h-5 w-5 text-primary" />
                  Shared Artwork
                </>
              ) : (
                <>
                  <Music className="h-5 w-5 text-primary" />
                  Shared Music
                </>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {type === 'art' && artwork && (
              <div className="space-y-4">
                <div className="bg-muted rounded-lg overflow-hidden">
                  <img
                    src={artwork}
                    alt="Shared artwork"
                    className="w-full h-auto max-h-[70vh] object-contain"
                  />
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground text-center">
                  Created with Neroxa AI Art Canvas
                </p>
              </div>
            )}

            {type === 'music' && music && (
              <div className="space-y-4">
                <div className="p-4 sm:p-6 bg-muted rounded-lg">
                  <audio src={music} controls className="w-full" />
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground text-center">
                  Created with Neroxa AI Music Generator
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <footer className="text-center text-xs sm:text-sm text-muted-foreground py-4">
          <p>
            © {new Date().getFullYear()} Neroxa AI • Built with ❤️ using{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              caffeine.ai
            </a>
          </p>
        </footer>
      </div>
    </div>
  );
}
