import { useParams, useNavigate } from '@tanstack/react-router';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useSharedArtwork, useSharedMusic } from '@/hooks/useSharedContent';
import { ArrowLeft, Palette, Music2, Loader2, AlertCircle } from 'lucide-react';
import { useState } from 'react';

interface SharedContentViewerProps {
  type: 'art' | 'music';
  id: string;
}

export function SharedContentViewer({ type, id }: SharedContentViewerProps) {
  const navigate = useNavigate();
  const [isPlaying, setIsPlaying] = useState(false);

  const artworkQuery = useSharedArtwork(type === 'art' ? id : '');
  const musicQuery = useSharedMusic(type === 'music' ? id : '');

  const query = type === 'art' ? artworkQuery : musicQuery;
  const { data, isLoading, error } = query;

  const handleBack = () => {
    navigate({ to: '/' });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <header className="border-b border-border py-4 px-6">
          <div className="max-w-5xl mx-auto flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={handleBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <h1 className="text-xl font-semibold text-foreground flex items-center gap-2">
              {type === 'art' ? (
                <>
                  <Palette className="h-5 w-5 text-primary" />
                  Shared Artwork
                </>
              ) : (
                <>
                  <Music2 className="h-5 w-5 text-primary" />
                  Shared Music
                </>
              )}
            </h1>
          </div>
        </header>
        <main className="flex-1 flex items-center justify-center p-6">
          <div className="text-center space-y-4">
            <Loader2 className="h-12 w-12 mx-auto animate-spin text-primary" />
            <p className="text-muted-foreground">Loading {type === 'art' ? 'artwork' : 'music'}...</p>
          </div>
        </main>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <header className="border-b border-border py-4 px-6">
          <div className="max-w-5xl mx-auto flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={handleBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <h1 className="text-xl font-semibold text-foreground flex items-center gap-2">
              {type === 'art' ? (
                <>
                  <Palette className="h-5 w-5 text-primary" />
                  Shared Artwork
                </>
              ) : (
                <>
                  <Music2 className="h-5 w-5 text-primary" />
                  Shared Music
                </>
              )}
            </h1>
          </div>
        </header>
        <main className="flex-1 flex items-center justify-center p-6">
          <Card className="max-w-md w-full">
            <CardContent className="pt-6 text-center space-y-4">
              <AlertCircle className="h-12 w-12 mx-auto text-destructive" />
              <div className="space-y-2">
                <h2 className="text-lg font-semibold text-foreground">Content Not Found</h2>
                <p className="text-sm text-muted-foreground">
                  The {type === 'art' ? 'artwork' : 'music'} you're looking for doesn't exist or has been removed.
                </p>
              </div>
              <Button onClick={handleBack} className="w-full">
                Go Back Home
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="border-b border-border py-4 px-6">
        <div className="max-w-5xl mx-auto flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={handleBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-xl font-semibold text-foreground flex items-center gap-2">
            {type === 'art' ? (
              <>
                <Palette className="h-5 w-5 text-primary" />
                Shared Artwork
              </>
            ) : (
              <>
                <Music2 className="h-5 w-5 text-primary" />
                Shared Music
              </>
            )}
          </h1>
        </div>
      </header>
      <main className="flex-1 flex items-center justify-center p-6">
        <Card className="max-w-4xl w-full">
          <CardHeader>
            <CardTitle>
              {type === 'art' ? 'Artwork' : 'Music'} by Axora AI User
            </CardTitle>
          </CardHeader>
          <CardContent>
            {type === 'art' ? (
              <div className="rounded-lg overflow-hidden border border-border bg-white">
                <img
                  src={data.url}
                  alt="Shared artwork"
                  className="w-full h-auto"
                />
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-6 bg-accent/10 border border-accent/20 rounded-lg">
                  <audio
                    src={data.url}
                    controls
                    className="w-full"
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                    onEnded={() => setIsPlaying(false)}
                  />
                </div>
                <p className="text-sm text-muted-foreground text-center">
                  {isPlaying ? 'Now playing...' : 'Click play to listen'}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
      <footer className="border-t border-border py-6 px-6 text-center text-sm text-muted-foreground">
        <p>
          © {new Date().getFullYear()} Axora AI • Built with ❤️ using{' '}
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
  );
}
