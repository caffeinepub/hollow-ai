import { useState } from 'react';
import { useGameMetadata } from '../hooks/useGameCatalogue';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Loader2, X, Maximize2, Minimize2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface GamePlayerProps {
  gameId: string;
  onClose: () => void;
}

export function GamePlayer({ gameId, onClose }: GamePlayerProps) {
  const { data: game, isLoading, error } = useGameMetadata(gameId);
  const [isFullscreen, setIsFullscreen] = useState(false);

  if (isLoading) {
    return (
      <Dialog open onOpenChange={onClose}>
        <DialogContent className="max-w-4xl h-[80vh]">
          <div className="flex items-center justify-center h-full">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (error || !game) {
    return (
      <Dialog open onOpenChange={onClose}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Error Loading Game</DialogTitle>
            <DialogDescription>
              Failed to load game data. Please try again later.
            </DialogDescription>
          </DialogHeader>
          <Button onClick={onClose} className="w-full">Close</Button>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className={`${isFullscreen ? 'max-w-full h-screen' : 'max-w-4xl h-[80vh]'} p-0 gap-0`}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex-1 min-w-0">
            <DialogTitle className="text-lg sm:text-xl truncate">{game.title}</DialogTitle>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="secondary" className="text-xs">{game.category}</Badge>
            </div>
          </div>
          <div className="flex items-center gap-2 ml-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="shrink-0"
            >
              {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="shrink-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Game Content */}
        <div className="flex-1 overflow-hidden bg-muted/30">
          <div className="h-full flex items-center justify-center p-4">
            <div className="text-center space-y-4 max-w-md">
              <div className="text-6xl mb-4">🎮</div>
              <h3 className="text-xl font-semibold text-foreground">{game.title}</h3>
              <p className="text-sm text-muted-foreground">{game.description}</p>
              <div className="pt-4">
                <p className="text-xs text-muted-foreground italic">
                  Game player interface would be rendered here
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border bg-background/50 backdrop-blur-sm">
          <p className="text-xs text-muted-foreground text-center">
            Use arrow keys or on-screen controls to play • Press ESC to exit
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
