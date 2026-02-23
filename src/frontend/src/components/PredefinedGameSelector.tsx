import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Gamepad2, Crown } from 'lucide-react';
import { useGetCallerUserProfile, useIsOwner } from '@/hooks/useUserProfile';

interface PredefinedGame {
  id: string;
  title: string;
  description: string;
  emoji: string;
  proOnly?: boolean;
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
  },
  {
    id: 'minecraft',
    title: 'Minegions',
    description: 'Mine blocks and build your world',
    emoji: '⛏️'
  },
  {
    id: 'roblox',
    title: 'Jumper Blox',
    description: 'Jump and collect coins in this platformer',
    emoji: '🎮'
  },
  {
    id: 'fortnite',
    title: 'Shooter Royale',
    description: 'Shoot targets and survive the battle',
    emoji: '🎯'
  },
  {
    id: 'spaceshooter3d',
    title: '3D Space Shooter',
    description: 'Blast through space in this immersive 3D shooter',
    emoji: '🚀',
    proOnly: true
  },
  {
    id: 'racing3d',
    title: '3D Racing',
    description: 'Race at high speeds in stunning 3D environments',
    emoji: '🏎️',
    proOnly: true
  }
];

interface PredefinedGameSelectorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onGameSelect: (gameId: string) => void;
}

export function PredefinedGameSelector({ open, onOpenChange, onGameSelect }: PredefinedGameSelectorProps) {
  const { data: userProfile } = useGetCallerUserProfile();
  const { data: isOwner } = useIsOwner();
  const hasPro = userProfile?.isPro || false;

  const handleGameClick = (game: PredefinedGame) => {
    // Owner has access to all games
    if (game.proOnly && !hasPro && !isOwner) {
      return; // Don't allow selection of Pro games without subscription
    }
    onGameSelect(game.id);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-display flex items-center gap-2">
            <Gamepad2 className="h-6 w-6" />
            Playable Games
          </DialogTitle>
          <DialogDescription>
            Select a game to play instantly. Pro games require a Pro subscription.
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          {PREDEFINED_GAMES.map((game) => {
            const isLocked = game.proOnly && !hasPro && !isOwner;
            return (
              <Card 
                key={game.id}
                className={`cursor-pointer transition-all ${
                  isLocked 
                    ? 'opacity-60 hover:border-warning/50' 
                    : 'hover:border-primary hover:shadow-lg'
                }`}
                onClick={() => handleGameClick(game)}
              >
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span className="text-3xl">{game.emoji}</span>
                    <span className="flex-1">{game.title}</span>
                    {game.proOnly && (
                      <Badge variant="outline" className="text-warning border-warning">
                        <Crown className="h-3 w-3 mr-1" />
                        Pro
                      </Badge>
                    )}
                  </CardTitle>
                  <CardDescription>{game.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    className="w-full" 
                    variant={isLocked ? "outline" : "secondary"}
                    disabled={isLocked}
                  >
                    {isLocked ? (
                      <>
                        <Crown className="h-4 w-4 mr-2" />
                        Upgrade to Play
                      </>
                    ) : (
                      <>
                        <Gamepad2 className="h-4 w-4 mr-2" />
                        Play Now
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}
