import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Gamepad2, Pencil, Sparkles } from 'lucide-react';

interface GameModeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPlayClick: () => void;
  onCreateClick: () => void;
  onBuiltInGamesClick: () => void;
}

export function GameModeModal({ open, onOpenChange, onPlayClick, onCreateClick, onBuiltInGamesClick }: GameModeModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-display">Choose Your Adventure</DialogTitle>
          <DialogDescription>
            Play classic games, browse community creations, or build your own masterpiece
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
          <Button
            onClick={onBuiltInGamesClick}
            size="lg"
            className="h-32 flex flex-col gap-3 text-lg"
            variant="default"
          >
            <Sparkles className="h-10 w-10" />
            <span>Play Built-in Games</span>
          </Button>
          <Button
            onClick={onPlayClick}
            size="lg"
            className="h-32 flex flex-col gap-3 text-lg"
            variant="secondary"
          >
            <Gamepad2 className="h-10 w-10" />
            <span>Browse Games</span>
          </Button>
          <Button
            onClick={onCreateClick}
            size="lg"
            className="h-32 flex flex-col gap-3 text-lg"
            variant="outline"
          >
            <Pencil className="h-10 w-10" />
            <span>Create Game</span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
