import { useState } from 'react';
import { RouterProvider, createRouter, createRoute, createRootRoute, Outlet } from '@tanstack/react-router';
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
import { SharedContentViewer } from './components/SharedContentViewer';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calculator, Image, Languages, Music2, Palette, Code2, Gamepad2 } from 'lucide-react';
import { Toaster } from '@/components/ui/sonner';

function MainApp() {
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <ErrorBoundary>
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
                      Solve math problems, translate languages, generate AI media, create music, draw art, generate scripts, play games, or start a new conversation
                    </p>
                  </div>
                  
                  <Tabs defaultValue="math" className="w-full">
                    <TabsList className="grid w-full grid-cols-4 sm:grid-cols-7 max-w-5xl h-auto gap-1 p-1">
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
                    </TabsList>
                    
                    <TabsContent value="math" className="mt-4 sm:mt-6">
                      <ErrorBoundary>
                        <MathProblemSolver />
                      </ErrorBoundary>
                    </TabsContent>
                    
                    <TabsContent value="translator" className="mt-4 sm:mt-6 h-[calc(100vh-12rem)] sm:h-[calc(100vh-16rem)]">
                      <div className="h-full border border-border rounded-lg overflow-hidden">
                        <ErrorBoundary>
                          <TranslatorChat />
                        </ErrorBoundary>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="scripter" className="mt-4 sm:mt-6 h-[calc(100vh-12rem)] sm:h-[calc(100vh-16rem)]">
                      <div className="h-full border border-border rounded-lg overflow-hidden">
                        <ErrorBoundary>
                          <Scripter />
                        </ErrorBoundary>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="media" className="mt-4 sm:mt-6">
                      <ErrorBoundary>
                        <MediaDisplay />
                      </ErrorBoundary>
                    </TabsContent>
                    
                    <TabsContent value="music" className="mt-4 sm:mt-6">
                      <ErrorBoundary>
                        <MusicGenerator />
                      </ErrorBoundary>
                    </TabsContent>
                    
                    <TabsContent value="art" className="mt-4 sm:mt-6 h-[calc(100vh-12rem)] sm:h-[calc(100vh-16rem)]">
                      <ErrorBoundary>
                        <ArtCanvas />
                      </ErrorBoundary>
                    </TabsContent>
                    
                    <TabsContent value="games" className="mt-4 sm:mt-6">
                      <ErrorBoundary>
                        <GamesView />
                      </ErrorBoundary>
                    </TabsContent>
                  </Tabs>
                </div>
              </div>
            )}
          </main>
        </div>
        <footer className="border-t border-border py-4 sm:py-6 px-4 sm:px-6 text-center text-sm text-muted-foreground">
          <p>
            © {new Date().getFullYear()} Neroxa AI • Built with ❤️ using{' '}
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
    </ErrorBoundary>
  );
}

// Layout component for routes that need the standard app shell
function RootLayout() {
  return (
    <ErrorBoundary>
      <Outlet />
      <Toaster />
    </ErrorBoundary>
  );
}

// Router setup
const rootRoute = createRootRoute({
  component: RootLayout,
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
    return (
      <ErrorBoundary>
        <SharedContentViewer type="art" id={artworkId} />
      </ErrorBoundary>
    );
  },
});

const sharedMusicRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/shared/music/$musicId',
  component: () => {
    const { musicId } = sharedMusicRoute.useParams();
    return (
      <ErrorBoundary>
        <SharedContentViewer type="music" id={musicId} />
      </ErrorBoundary>
    );
  },
});

const routeTree = rootRoute.addChildren([indexRoute, sharedArtRoute, sharedMusicRoute]);

const router = createRouter({ 
  routeTree,
  defaultPreload: 'intent',
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

function App() {
  return <RouterProvider router={router} />;
}

export default App;
