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
import { SharedContentViewer } from './components/SharedContentViewer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useInternetIdentity } from './hooks/useInternetIdentity';
import { Button } from '@/components/ui/button';
import { LogIn, Calculator, Image, Languages, Music2, Palette, Code2 } from 'lucide-react';
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
        <main className="flex-1 flex items-center justify-center p-6">
          <div className="max-w-md w-full text-center space-y-6">
            <div className="space-y-2">
              <h1 className="text-4xl font-display font-bold text-foreground">Welcome to Axora AI</h1>
              <p className="text-lg text-muted-foreground">
                Your AI-powered learning companion for math, media, translation, and more
              </p>
            </div>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Sign in to access your personalized learning experience, chat history, and saved content.
              </p>
              <Button 
                onClick={login} 
                size="lg" 
                className="w-full"
                disabled={!isLoginIdle}
              >
                <LogIn className="mr-2 h-5 w-5" />
                Sign In to Get Started
              </Button>
            </div>
          </div>
        </main>
        <footer className="border-t border-border py-6 px-6 text-center text-sm text-muted-foreground">
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
            <div className="h-full p-6 overflow-auto">
              <div className="max-w-5xl mx-auto space-y-6">
                <div className="space-y-2">
                  <h1 className="text-3xl font-display font-bold text-foreground">
                    What would you like to learn today?
                  </h1>
                  <p className="text-muted-foreground">
                    Solve math problems, translate languages, generate AI media, create music, draw art, generate scripts, or start a new conversation
                  </p>
                </div>
                
                <Tabs defaultValue="math" className="w-full">
                  <TabsList className="grid w-full grid-cols-6 max-w-5xl">
                    <TabsTrigger value="math" className="gap-2">
                      <Calculator className="h-4 w-4" />
                      Math Solver
                    </TabsTrigger>
                    <TabsTrigger value="translator" className="gap-2">
                      <Languages className="h-4 w-4" />
                      Translator
                    </TabsTrigger>
                    <TabsTrigger value="scripter" className="gap-2">
                      <Code2 className="h-4 w-4" />
                      Scripter
                    </TabsTrigger>
                    <TabsTrigger value="media" className="gap-2">
                      <Image className="h-4 w-4" />
                      Media Gallery
                    </TabsTrigger>
                    <TabsTrigger value="music" className="gap-2">
                      <Music2 className="h-4 w-4" />
                      Music Generator
                    </TabsTrigger>
                    <TabsTrigger value="art" className="gap-2">
                      <Palette className="h-4 w-4" />
                      Art
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="math" className="mt-6">
                    <MathProblemSolver />
                  </TabsContent>
                  
                  <TabsContent value="translator" className="mt-6 h-[calc(100vh-16rem)]">
                    <div className="h-full border border-border rounded-lg overflow-hidden">
                      <TranslatorChat />
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="scripter" className="mt-6 h-[calc(100vh-16rem)]">
                    <div className="h-full border border-border rounded-lg overflow-hidden">
                      <Scripter />
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="media" className="mt-6">
                    <MediaDisplay />
                  </TabsContent>
                  
                  <TabsContent value="music" className="mt-6">
                    <MusicGenerator />
                  </TabsContent>
                  
                  <TabsContent value="art" className="mt-6 h-[calc(100vh-16rem)]">
                    <ArtCanvas />
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
