import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Play } from 'lucide-react';

// Mock type since it's not in the backend anymore
interface GameCatalogueView {
  id: string;
  title: string;
  description: string;
  category: string;
  playable: boolean;
  hasThumbnail: boolean;
}

interface GameCardProps {
  game: GameCatalogueView;
  onPlay: () => void;
}

export function GameCard({ game, onPlay }: GameCardProps) {
  return (
    <Card className="group hover:shadow-lg transition-all duration-200 hover:border-primary/50 cursor-pointer overflow-hidden">
      <div 
        className="relative aspect-video bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20 flex items-center justify-center overflow-hidden"
        onClick={onPlay}
      >
        {game.hasThumbnail ? (
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10" />
        ) : (
          <div className="text-6xl opacity-20">🎮</div>
        )}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-200 flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <div className="bg-primary text-primary-foreground rounded-full p-4">
              <Play className="h-8 w-8 fill-current" />
            </div>
          </div>
        </div>
      </div>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-base sm:text-lg line-clamp-1">{game.title}</CardTitle>
          <Badge variant="secondary" className="shrink-0 text-xs">
            {game.category}
          </Badge>
        </div>
        <CardDescription className="line-clamp-2 text-xs sm:text-sm">
          {game.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <Button 
          onClick={onPlay} 
          className="w-full min-h-[44px]"
          disabled={!game.playable}
        >
          <Play className="mr-2 h-4 w-4" />
          {game.playable ? 'Play Now' : 'Coming Soon'}
        </Button>
      </CardContent>
    </Card>
  );
}
