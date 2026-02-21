import { useState } from 'react';
import { RouterProvider, createRouter, createRoute, createRootRoute } from '@tanstack/react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Header } from './components/Header';
import { ChatSidebar } from './components/ChatSidebar';
import { ChatView } from './components/ChatView';
import { MathProblemSolver } from './components/MathProblemSolver';
import { MediaDisplay } from './components/MediaDisplay';
import { TranslatorChat } from './components/TranslatorChat';
import { MusicGenerator } from './components/MusicGenerator';
import { ArtCanvas } from './components/ArtCanvas';
import { Scripter } from './components/Scripter';
import { GamesView } from './components/GamesView';
import { DictionaryView } from './components/DictionaryView';
import { SharedContentViewer } from './components/SharedContentViewer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useInternetIdentity } from './hooks/useInternetIdentity';
import { Button } from '@/components/ui/button';
import { LogIn, Calculator, Image, Languages, Music2, Palette, Code2, Gamepad2, BookOpen } from 'lucide-react';
import { Toaster } from '@/components/ui/sonner';

const queryClient = new QueryClient();

function MainApp() {
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { identity, login, isLoginIdle } = useInternetIdentity();

  const isAuthenticated = !!identity && !identity.getPrincipal().isAnonymous();

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 flex items-center justify-center p-4 sm:p-6">
          <div className="max-w-md w-full text-center space-y-4 sm:space-y-6">
            <div className="space-y-2">
              <h1 className="text-3xl sm:text-4xl font-display font-bold text-foreground">Welcome to Axora AI</h1>
              <p className="text-base sm:text-lg text-muted-foreground px-2">
                Your AI-powered learning companion for math, media, translation, and more
              </p>
            </div>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground px-2">
                Sign in to access your personalized learning experience, chat history, and saved content.
              </p>
              <Button 
                onClick={login} 
                size="lg" 
                className="w-full min-h-[44px]"
                disabled={!isLoginIdle}
              >
                <LogIn className="mr-2 h-5 w-5" />
                Sign In to Get Started
              </Button>
            </div>
          </div>
        </main>
        <footer className="border-t border-border py-4 sm:py-6 px-4 sm:px-6 text-center text-sm text-muted-foreground">
          <p>
            © {new Date().getFullYear()} Axora AI • Built with ❤️ using{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              caffeine.ai
            </a>
          </p>
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <div className="flex-1 flex overflow-hidden">
        <ChatSidebar
          selectedSessionId={selectedSessionId}
          onSelectSession={setSelectedSessionId}
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
        <main className="flex-1 overflow-hidden">
          {selectedSessionId ? (
            <ChatView sessionId={selectedSessionId} />
          ) : (
            <div className="h-full p-3 sm:p-4 md:p-6 overflow-auto">
              <div className="max-w-5xl mx-auto space-y-4 sm:space-y-6">
                <div className="space-y-2">
                  <h1 className="text-2xl sm:text-3xl font-display font-bold text-foreground">
                    What would you like to learn today?
                  </h1>
                  <p className="text-sm sm:text-base text-muted-foreground">
                    Solve math problems, translate languages, generate AI media, create music, draw art, generate scripts, play games, explore the dictionary, or start a new conversation
                  </p>
                </div>
                
                <Tabs defaultValue="math" className="w-full">
                  <TabsList className="grid w-full grid-cols-4 sm:grid-cols-8 max-w-5xl h-auto gap-1 p-1">
                    <TabsTrigger value="math" className="gap-1 sm:gap-2 min-h-[44px] text-xs sm:text-sm">
                      <Calculator className="h-3 w-3 sm:h-4 sm:w-4" />
                      <span className="hidden sm:inline">Math Solver</span>
                      <span className="sm:hidden">Math</span>
                    </TabsTrigger>
                    <TabsTrigger value="translator" className="gap-1 sm:gap-2 min-h-[44px] text-xs sm:text-sm">
                      <Languages className="h-3 w-3 sm:h-4 sm:w-4" />
                      <span className="hidden sm:inline">Translator</span>
                      <span className="sm:hidden">Translate</span>
                    </TabsTrigger>
                    <TabsTrigger value="scripter" className="gap-1 sm:gap-2 min-h-[44px] text-xs sm:text-sm">
                      <Code2 className="h-3 w-3 sm:h-4 sm:w-4" />
                      <span className="hidden sm:inline">Scripter</span>
                      <span className="sm:hidden">Code</span>
                    </TabsTrigger>
                    <TabsTrigger value="media" className="gap-1 sm:gap-2 min-h-[44px] text-xs sm:text-sm">
                      <Image className="h-3 w-3 sm:h-4 sm:w-4" />
                      <span className="hidden sm:inline">Media Gallery</span>
                      <span className="sm:hidden">Media</span>
                    </TabsTrigger>
                    <TabsTrigger value="music" className="gap-1 sm:gap-2 min-h-[44px] text-xs sm:text-sm">
                      <Music2 className="h-3 w-3 sm:h-4 sm:w-4" />
                      <span className="hidden sm:inline">Music Generator</span>
                      <span className="sm:hidden">Music</span>
                    </TabsTrigger>
                    <TabsTrigger value="art" className="gap-1 sm:gap-2 min-h-[44px] text-xs sm:text-sm">
                      <Palette className="h-3 w-3 sm:h-4 sm:w-4" />
                      <span className="hidden sm:inline">Art</span>
                      <span className="sm:hidden">Art</span>
                    </TabsTrigger>
                    <TabsTrigger value="games" className="gap-1 sm:gap-2 min-h-[44px] text-xs sm:text-sm">
                      <Gamepad2 className="h-3 w-3 sm:h-4 sm:w-4" />
                      <span className="hidden sm:inline">Games</span>
                      <span className="sm:hidden">Games</span>
                    </TabsTrigger>
                    <TabsTrigger value="dictionary" className="gap-1 sm:gap-2 min-h-[44px] text-xs sm:text-sm">
                      <BookOpen className="h-3 w-3 sm:h-4 sm:w-4" />
                      <span className="hidden sm:inline">Dictionary</span>
                      <span className="sm:hidden">Dict</span>
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="math" className="mt-4 sm:mt-6">
                    <MathProblemSolver />
                  </TabsContent>
                  
                  <TabsContent value="translator" className="mt-4 sm:mt-6 h-[calc(100vh-12rem)] sm:h-[calc(100vh-16rem)]">
                    <div className="h-full border border-border rounded-lg overflow-hidden">
                      <TranslatorChat />
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="scripter" className="mt-4 sm:mt-6 h-[calc(100vh-12rem)] sm:h-[calc(100vh-16rem)]">
                    <div className="h-full border border-border rounded-lg overflow-hidden">
                      <Scripter />
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="media" className="mt-4 sm:mt-6">
                    <MediaDisplay />
                  </TabsContent>
                  
                  <TabsContent value="music" className="mt-4 sm:mt-6">
                    <MusicGenerator />
                  </TabsContent>
                  
                  <TabsContent value="art" className="mt-4 sm:mt-6 h-[calc(100vh-12rem)] sm:h-[calc(100vh-16rem)]">
                    <ArtCanvas />
                  </TabsContent>
                  
                  <TabsContent value="games" className="mt-4 sm:mt-6">
                    <GamesView />
                  </TabsContent>
                  
                  <TabsContent value="dictionary" className="mt-4 sm:mt-6">
                    <DictionaryView />
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

// Router setup
const rootRoute = createRootRoute({
  component: () => (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <Toaster />
    </QueryClientProvider>
  ),
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: MainApp,
});

const sharedArtRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/shared/art/$artworkId',
  component: () => {
    const { artworkId } = sharedArtRoute.useParams();
    return <SharedContentViewer type="art" id={artworkId} />;
  },
});

const sharedMusicRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/shared/music/$musicId',
  component: () => {
    const { musicId } = sharedMusicRoute.useParams();
    return <SharedContentViewer type="music" id={musicId} />;
  },
});

const routeTree = rootRoute.addChildren([indexRoute, sharedArtRoute, sharedMusicRoute]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
