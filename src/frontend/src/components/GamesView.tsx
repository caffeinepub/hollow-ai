import { useState, useMemo } from 'react';
import { useGameCatalogue } from '../hooks/useGameCatalogue';
import { GameCard } from './GameCard';
import GamePlayer from './GamePlayer';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const ITEMS_PER_PAGE = 24;

export function GamesView() {
  const { data: games, isLoading, error } = useGameCatalogue();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'user' | 'ai'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedGameId, setSelectedGameId] = useState<string | null>(null);

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

  const paginatedGames = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredGames.slice(startIndex, endIndex);
  }, [filteredGames, currentPage]);

  const totalPages = Math.ceil(filteredGames.length / ITEMS_PER_PAGE);

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleFilterChange = (value: string) => {
    setFilterType(value as 'all' | 'user' | 'ai');
    setCurrentPage(1);
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
            Game Catalogue
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground">
            Play games created by AI and the community • {games?.length || 0} games available
          </p>
        </div>

        <Tabs value={filterType} onValueChange={handleFilterChange}>
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
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-9 min-h-[44px]"
          />
        </div>

        <div className="text-sm text-muted-foreground">
          Showing {paginatedGames.length} of {filteredGames.length} games
          {(searchTerm || filterType !== 'all') && ` (filtered from ${games?.length})`}
        </div>

        <ScrollArea className="h-[calc(100vh-28rem)] sm:h-[calc(100vh-24rem)]">
          {paginatedGames.length === 0 ? (
            <div className="flex items-center justify-center h-64">
              <p className="text-muted-foreground">No games found matching your criteria</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pb-4">
              {paginatedGames.map(game => (
                <GameCard
                  key={game.id}
                  game={game}
                  onPlay={() => setSelectedGameId(game.id)}
                />
              ))}
            </div>
          )}
        </ScrollArea>

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 pt-4 border-t border-border">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="min-h-[44px] min-w-[44px]"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm text-muted-foreground min-w-[100px] text-center">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="min-h-[44px] min-w-[44px]"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
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
