import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider, createRouter, createRoute, createRootRoute, Outlet } from '@tanstack/react-router';
import { InternetIdentityProvider } from './hooks/useInternetIdentity';
import { Header } from './components/Header';
import { ChatPage } from './components/ChatPage';
import { MathProblemSolver } from './components/MathProblemSolver';
import { MediaDisplay } from './components/MediaDisplay';
import { TranslatorChat } from './components/TranslatorChat';
import { MusicGenerator } from './components/MusicGenerator';
import { ArtCanvas } from './components/ArtCanvas';
import { Scripter } from './components/Scripter';
import { GamesView } from './components/GamesView';
import { SharedContentViewer } from './components/SharedContentViewer';
import { GameModeModal } from './components/GameModeModal';
import { PredefinedGameSelector } from './components/PredefinedGameSelector';
import { GameBrowser } from './components/GameBrowser';
import { GameStudio } from './components/GameStudio';
import GamePlayer from './components/GamePlayer';
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from 'next-themes';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
    },
  },
});

function Layout() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}

const rootRoute = createRootRoute({
  component: Layout,
});

// Wrapper component for SharedContentViewer that extracts params from route
function SharedContentViewerWrapper() {
  // For now, we'll default to 'art' type and extract ID from URL
  // In a real app, you'd parse the contentId to determine type
  const contentId = window.location.pathname.split('/').pop() || '';
  const type = contentId.startsWith('art-') ? 'art' : 'music';
  const id = contentId.replace(/^(art-|music-)/, '');
  
  return <SharedContentViewer type={type} id={id} />;
}

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: MathProblemSolver,
});

const chatRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/chat',
  component: ChatPage,
});

const chatSessionRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/chat/$sessionId',
  component: ChatPage,
});

const mathRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/math',
  component: MathProblemSolver,
});

const mediaRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/media',
  component: MediaDisplay,
});

const translatorRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/translator',
  component: TranslatorChat,
});

const musicRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/music',
  component: MusicGenerator,
});

const artRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/art',
  component: ArtCanvas,
});

const codeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/code',
  component: Scripter,
});

const gamesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/games',
  component: GamesView,
});

const gameBrowseRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/games/browse',
  component: GameBrowser,
});

const gameStudioRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/games/studio',
  component: GameStudio,
});

const sharedRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/shared/$contentId',
  component: SharedContentViewerWrapper,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  chatRoute,
  chatSessionRoute,
  mathRoute,
  mediaRoute,
  translatorRoute,
  musicRoute,
  artRoute,
  codeRoute,
  gamesRoute,
  gameBrowseRoute,
  gameStudioRoute,
  sharedRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

function App() {
  const [gameModeModalOpen, setGameModeModalOpen] = useState(false);
  const [predefinedGameSelectorOpen, setPredefinedGameSelectorOpen] = useState(false);
  const [selectedGameId, setSelectedGameId] = useState<string | null>(null);

  const handleGameModeOpen = () => {
    setGameModeModalOpen(true);
  };

  const handlePlayClick = () => {
    setGameModeModalOpen(false);
    router.navigate({ to: '/games/browse' });
  };

  const handleCreateClick = () => {
    setGameModeModalOpen(false);
    router.navigate({ to: '/games/studio' });
  };

  const handleBuiltInGamesClick = () => {
    setGameModeModalOpen(false);
    setPredefinedGameSelectorOpen(true);
  };

  const handlePredefinedGameSelect = (gameId: string) => {
    setSelectedGameId(gameId);
  };

  const handleCloseGamePlayer = () => {
    setSelectedGameId(null);
  };

  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <QueryClientProvider client={queryClient}>
        <InternetIdentityProvider>
          <RouterProvider router={router} context={{ onGameModeOpen: handleGameModeOpen }} />
          <GameModeModal
            open={gameModeModalOpen}
            onOpenChange={setGameModeModalOpen}
            onPlayClick={handlePlayClick}
            onCreateClick={handleCreateClick}
            onBuiltInGamesClick={handleBuiltInGamesClick}
          />
          <PredefinedGameSelector
            open={predefinedGameSelectorOpen}
            onOpenChange={setPredefinedGameSelectorOpen}
            onGameSelect={handlePredefinedGameSelect}
          />
          {selectedGameId && (
            <GamePlayer
              gameId={selectedGameId}
              onClose={handleCloseGamePlayer}
            />
          )}
          <Toaster />
        </InternetIdentityProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
