import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Gamepad2 } from 'lucide-react';

interface PredefinedGame {
  id: string;
  title: string;
  description: string;
  emoji: string;
}

const PREDEFINED_GAMES: PredefinedGame[] = [
  {
    id: 'flappy-bird',
    title: 'Flappy Bird',
    description: 'Navigate the bird through pipes by tapping to flap',
    emoji: '🐦'
  },
  {
    id: 'snake',
    title: 'Snake',
    description: 'Classic snake game - eat apples and grow longer',
    emoji: '🐍'
  },
  {
    id: 'pong',
    title: 'Pong',
    description: 'Classic paddle game - beat the AI opponent',
    emoji: '🏓'
  },
  {
    id: 'breakout',
    title: 'Breakout',
    description: 'Break all the bricks with the ball',
    emoji: '🧱'
  }
];

interface PredefinedGameSelectorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onGameSelect: (gameId: string) => void;
}

export function PredefinedGameSelector({ open, onOpenChange, onGameSelect }: PredefinedGameSelectorProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-display flex items-center gap-2">
            <Gamepad2 className="h-6 w-6" />
            Choose a Game
          </DialogTitle>
          <DialogDescription>
            Select a classic game to play instantly
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          {PREDEFINED_GAMES.map((game) => (
            <Card 
              key={game.id}
              className="cursor-pointer hover:border-primary transition-all hover:shadow-lg"
              onClick={() => {
                onGameSelect(game.id);
                onOpenChange(false);
              }}
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="text-3xl">{game.emoji}</span>
                  <span>{game.title}</span>
                </CardTitle>
                <CardDescription>{game.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" variant="secondary">
                  <Gamepad2 className="h-4 w-4 mr-2" />
                  Play Now
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
