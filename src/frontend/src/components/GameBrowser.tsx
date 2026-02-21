import { useState, useMemo } from 'react';
import { useGetAllGames } from '../hooks/useGames';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import GamePlayer from './GamePlayer';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Search, Play, User, Bot, Trash2 } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useDeleteGame } from '../hooks/useGames';
import { toast } from 'sonner';

export function GameBrowser() {
  const { data: games, isLoading, error } = useGetAllGames();
  const { identity } = useInternetIdentity();
  const deleteGameMutation = useDeleteGame();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGameId, setSelectedGameId] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<'all' | 'user' | 'ai'>('all');

  const filteredGames = useMemo(() => {
    if (!games) return [];
    
    let filtered = games.filter(game => {
      const matchesSearch = game.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           game.description.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSearch;
    });

    // Filter by creator type
    if (filterType === 'user') {
      filtered = filtered.filter(game => game.creator.toString() !== '2vxsx-fae');
    } else if (filterType === 'ai') {
      filtered = filtered.filter(game => game.creator.toString() === '2vxsx-fae');
    }

    return filtered;
  }, [games, searchTerm, filterType]);

  const handleDelete = async (gameId: string) => {
    if (!confirm('Are you sure you want to delete this game?')) return;
    
    try {
      await deleteGameMutation.mutateAsync(gameId);
      toast.success('Game deleted successfully');
    } catch (error) {
      toast.error('Failed to delete game');
    }
  };

  const isGameOwner = (creatorPrincipal: string) => {
    if (!identity) return false;
    return creatorPrincipal === identity.getPrincipal().toString();
  };

  const isAICreated = (creatorPrincipal: string) => {
    return creatorPrincipal === '2vxsx-fae';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center space-y-2">
          <p className="text-destructive font-semibold">Failed to load games</p>
          <p className="text-sm text-muted-foreground">Please try again later</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        <div className="space-y-2">
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-foreground">
            Game Library
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground">
            Browse and play games created by the community and AI • {games?.length || 0} games available
          </p>
        </div>

        <Tabs value={filterType} onValueChange={(v) => setFilterType(v as 'all' | 'user' | 'ai')}>
          <TabsList className="grid w-full grid-cols-3 max-w-md">
            <TabsTrigger value="all">All Games</TabsTrigger>
            <TabsTrigger value="user">User Made</TabsTrigger>
            <TabsTrigger value="ai">AI Made</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search games..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 min-h-[44px]"
          />
        </div>

        <div className="text-sm text-muted-foreground">
          Showing {filteredGames.length} games
        </div>

        <ScrollArea className="h-[calc(100vh-24rem)]">
          {filteredGames.length === 0 ? (
            <div className="flex items-center justify-center h-64">
              <p className="text-muted-foreground">No games found matching your criteria</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pb-4">
              {filteredGames.map(game => (
                <Card key={game.id} className="flex flex-col">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="text-lg line-clamp-1">{game.title}</CardTitle>
                      <Badge variant={isAICreated(game.creator.toString()) ? 'default' : 'secondary'} className="shrink-0">
                        {isAICreated(game.creator.toString()) ? (
                          <><Bot className="h-3 w-3 mr-1" /> AI</>
                        ) : (
                          <><User className="h-3 w-3 mr-1" /> User</>
                        )}
                      </Badge>
                    </div>
                    <CardDescription className="line-clamp-2">{game.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <p className="text-xs text-muted-foreground">
                      Created: {new Date(Number(game.creationTime)).toLocaleDateString()}
                    </p>
                  </CardContent>
                  <CardFooter className="flex gap-2">
                    <Button
                      onClick={() => setSelectedGameId(game.id)}
                      className="flex-1"
                      size="sm"
                    >
                      <Play className="h-4 w-4 mr-2" />
                      Play
                    </Button>
                    {isGameOwner(game.creator.toString()) && (
                      <Button
                        onClick={() => handleDelete(game.id)}
                        variant="destructive"
                        size="sm"
                        disabled={deleteGameMutation.isPending}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </ScrollArea>
      </div>

      {selectedGameId && (
        <GamePlayer
          gameId={selectedGameId}
          onClose={() => setSelectedGameId(null)}
        />
      )}
    </>
  );
}
