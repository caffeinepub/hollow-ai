import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Gamepad2, Plus, X } from 'lucide-react';
import { GameModeModal } from './GameModeModal';
import { PredefinedGameSelector } from './PredefinedGameSelector';
import { GameBrowser } from './GameBrowser';
import { GameStudio } from './GameStudio';
import GamePlayer from './GamePlayer';
import { useInternetIdentity } from '../hooks/useInternetIdentity';

type ViewMode = 'menu' | 'predefined' | 'browse' | 'create' | 'playing';

export function GamesView() {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<ViewMode>('menu');
  const [selectedGameId, setSelectedGameId] = useState<string | null>(null);
  const [showPredefinedSelector, setShowPredefinedSelector] = useState(false);
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;

  const handlePlayPredefined = (gameId: string) => {
    setSelectedGameId(gameId);
    setViewMode('playing');
    setShowPredefinedSelector(false);
  };

  const handlePlayGame = (gameId: string) => {
    setSelectedGameId(gameId);
    setViewMode('playing');
  };

  const handleClosePlayer = () => {
    setSelectedGameId(null);
    setViewMode('menu');
  };

  const handleOpenPredefinedSelector = () => {
    setShowPredefinedSelector(true);
  };

  if (viewMode === 'playing' && selectedGameId) {
    return <GamePlayer gameId={selectedGameId} onClose={handleClosePlayer} />;
  }

  return (
    <div className="space-y-4 sm:space-y-6 relative">
      {/* Close Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => navigate({ to: '/' })}
        className="absolute top-0 right-0 z-10 h-10 w-10 rounded-full hover:bg-destructive/10 hover:text-destructive"
        aria-label="Close and return to main menu"
      >
        <X className="h-5 w-5" />
      </Button>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <Gamepad2 className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
            Games
          </CardTitle>
          <CardDescription className="text-xs sm:text-sm">
            Play built-in games, browse community creations, or create your own
          </CardDescription>
        </CardHeader>
        <CardContent>
          {viewMode === 'menu' && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              <Button
                variant="outline"
                className="h-24 sm:h-32 flex flex-col gap-2 min-h-[44px]"
                onClick={handleOpenPredefinedSelector}
              >
                <Gamepad2 className="h-6 w-6 sm:h-8 sm:w-8" />
                <span className="text-sm sm:text-base font-semibold">Play Built-in Games</span>
              </Button>
              <Button
                variant="outline"
                className="h-24 sm:h-32 flex flex-col gap-2 min-h-[44px]"
                onClick={() => setViewMode('browse')}
              >
                <Gamepad2 className="h-6 w-6 sm:h-8 sm:w-8" />
                <span className="text-sm sm:text-base font-semibold">Browse Games</span>
              </Button>
              <Button
                variant="outline"
                className="h-24 sm:h-32 flex flex-col gap-2 min-h-[44px]"
                onClick={() => setViewMode('create')}
                disabled={!isAuthenticated}
              >
                <Plus className="h-6 w-6 sm:h-8 sm:w-8" />
                <span className="text-sm sm:text-base font-semibold">Create Game</span>
              </Button>
            </div>
          )}

          {viewMode === 'browse' && (
            <div className="space-y-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setViewMode('menu')}
                className="min-h-[44px]"
              >
                ← Back to Menu
              </Button>
              <GameBrowser />
            </div>
          )}

          {viewMode === 'create' && (
            <div className="space-y-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setViewMode('menu')}
                className="min-h-[44px]"
              >
                ← Back to Menu
              </Button>
              <GameStudio />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Predefined Game Selector Dialog */}
      <PredefinedGameSelector
        open={showPredefinedSelector}
        onOpenChange={setShowPredefinedSelector}
        onGameSelect={handlePlayPredefined}
      />
    </div>
  );
}
