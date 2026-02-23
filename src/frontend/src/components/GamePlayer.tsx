import { useState, useEffect, useRef } from 'react';
import { useGetGame } from '../hooks/useGames';
import { useGetHighScore, useUpdateHighScore } from '../hooks/useGameState';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Loader2, X, Maximize2, Minimize2, Trophy, User, Bot } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { toast } from 'sonner';
import { flappyBirdTemplate } from '../templates/flappyBirdTemplate';
import { snakeTemplate } from '../templates/snakeTemplate';
import { pongTemplate } from '../templates/pongTemplate';
import { breakoutTemplate } from '../templates/breakoutTemplate';
import { minecraftTemplate } from '../templates/minecraftTemplate';
import { robloxTemplate } from '../templates/robloxTemplate';
import { fortniteTemplate } from '../templates/fortniteTemplate';

interface GamePlayerProps {
  gameId: string;
  onClose: () => void;
}

// Fully playable game templates with complete HTML/CSS/JavaScript
const GAME_TEMPLATES: Record<string, string> = {
  'flappy-bird': flappyBirdTemplate,
  'snake': snakeTemplate,
  'pong': pongTemplate,
  'breakout': breakoutTemplate,
  'minecraft': minecraftTemplate,
  'roblox': robloxTemplate,
  'fortnite': fortniteTemplate
};

export default function GamePlayer({ gameId, onClose }: GamePlayerProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentScore, setCurrentScore] = useState(0);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const { identity } = useInternetIdentity();

  // Check if it's a predefined game or user-created game
  const isPredefinedGame = gameId in GAME_TEMPLATES;
  
  // Only fetch game data if it's not a predefined game
  // Pass empty string to avoid fetching when it's a predefined game
  const { data: game, isLoading: isLoadingGame } = useGetGame(isPredefinedGame ? '' : gameId);
  const { data: highScore } = useGetHighScore(gameId);
  const updateHighScore = useUpdateHighScore();

  // Get game content
  const gameContent = isPredefinedGame ? GAME_TEMPLATES[gameId] : game?.gameCode;
  const gameTitle = isPredefinedGame 
    ? gameId.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
    : game?.title;
  const gameDescription = isPredefinedGame
    ? `Play the classic ${gameTitle} game!`
    : game?.description;

  // Listen for score updates from the game
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === 'gameScore') {
        const newScore = event.data.score;
        setCurrentScore(newScore);
        
        // Update high score if new score is higher
        if (!highScore || newScore > highScore) {
          updateHighScore.mutate({ gameId, score: newScore });
          toast.success(`New High Score: ${newScore}!`);
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [gameId, highScore, updateHighScore]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      iframeRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const isLoading = !isPredefinedGame && isLoadingGame;

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl h-[90vh] flex flex-col p-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <DialogTitle className="text-2xl font-display mb-2">
                {gameTitle || 'Loading...'}
              </DialogTitle>
              {gameDescription && (
                <p className="text-sm text-muted-foreground">{gameDescription}</p>
              )}
              <div className="flex items-center gap-4 mt-3">
                {!isPredefinedGame && game && (
                  <Badge variant={identity?.getPrincipal().toString() === game.creator.toString() ? 'default' : 'secondary'}>
                    {identity?.getPrincipal().toString() === game.creator.toString() ? (
                      <>
                        <User className="h-3 w-3 mr-1" />
                        Your Game
                      </>
                    ) : (
                      <>
                        <Bot className="h-3 w-3 mr-1" />
                        Community
                      </>
                    )}
                  </Badge>
                )}
                {highScore !== undefined && highScore > 0 && (
                  <div className="flex items-center gap-2 text-sm">
                    <Trophy className="h-4 w-4 text-yellow-500" />
                    <span className="font-semibold">High Score: {highScore}</span>
                  </div>
                )}
                {currentScore > 0 && (
                  <div className="text-sm">
                    <span className="text-muted-foreground">Current: </span>
                    <span className="font-semibold">{currentScore}</span>
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={toggleFullscreen}
                title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
              >
                {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={onClose}
                title="Close"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 relative bg-muted/20">
          {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : gameContent ? (
            <iframe
              ref={iframeRef}
              srcDoc={gameContent}
              className="w-full h-full border-0"
              title={gameTitle}
              sandbox="allow-scripts allow-same-origin"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-muted-foreground">Game not found</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
