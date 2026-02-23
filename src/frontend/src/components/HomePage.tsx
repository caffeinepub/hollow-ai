import { useEffect, useState } from 'react';
import { Link } from '@tanstack/react-router';
import { 
  Calculator, 
  MessageSquare, 
  Languages, 
  Code, 
  Music, 
  Palette, 
  Image, 
  Gamepad2,
  Crown
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PaymentSetup } from './PaymentSetup';
import { ProFeaturesModal } from './ProFeaturesModal';
import { useActor } from '@/hooks/useActor';
import { useInternetIdentity } from '@/hooks/useInternetIdentity';

interface NavBox {
  title: string;
  description: string;
  icon: React.ReactNode;
  path: string;
  gradient: string;
}

const navBoxes: NavBox[] = [
  {
    title: 'Math Solver',
    description: 'Solve math problems with step-by-step explanations',
    icon: <Calculator className="h-8 w-8" />,
    path: '/math',
    gradient: 'from-primary to-primary/70',
  },
  {
    title: 'Chat',
    description: 'Have conversations with AI assistant',
    icon: <MessageSquare className="h-8 w-8" />,
    path: '/chat',
    gradient: 'from-secondary to-secondary/70',
  },
  {
    title: 'Translator',
    description: 'Translate text between languages',
    icon: <Languages className="h-8 w-8" />,
    path: '/translator',
    gradient: 'from-accent to-accent/70',
  },
  {
    title: 'Script Writer',
    description: 'Generate code and scripts with AI',
    icon: <Code className="h-8 w-8" />,
    path: '/code',
    gradient: 'from-success to-success/70',
  },
  {
    title: 'Music Maker',
    description: 'Create music and beats',
    icon: <Music className="h-8 w-8" />,
    path: '/music',
    gradient: 'from-warning to-warning/70',
  },
  {
    title: 'Art Creator',
    description: 'Draw and create digital art',
    icon: <Palette className="h-8 w-8" />,
    path: '/art',
    gradient: 'from-destructive to-destructive/70',
  },
  {
    title: 'Media Generator',
    description: 'Generate images and videos',
    icon: <Image className="h-8 w-8" />,
    path: '/media',
    gradient: 'from-primary to-secondary',
  },
  {
    title: 'Games',
    description: 'Play, browse, and create games',
    icon: <Gamepad2 className="h-8 w-8" />,
    path: '/games',
    gradient: 'from-accent to-primary',
  },
];

export function HomePage() {
  const { actor } = useActor();
  const { identity } = useInternetIdentity();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isProModalOpen, setIsProModalOpen] = useState(false);

  useEffect(() => {
    const checkAdmin = async () => {
      if (actor && identity) {
        try {
          const adminStatus = await actor.isCallerAdmin();
          setIsAdmin(adminStatus);
        } catch (error) {
          console.error('Failed to check admin status:', error);
        }
      }
    };
    checkAdmin();
  }, [actor, identity]);

  return (
    <div className="container mx-auto px-4 py-8 sm:py-12 relative">
      <div className="max-w-6xl mx-auto">
        {/* Pro Badge Button */}
        <div className="absolute top-4 right-4 sm:top-8 sm:right-8 z-10">
          <Button
            onClick={() => setIsProModalOpen(true)}
            className="bg-gradient-to-r from-warning to-warning/80 hover:from-warning/90 hover:to-warning/70 text-white font-semibold px-4 py-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
          >
            <Crown className="h-4 w-4" />
            <span>Pro</span>
          </Button>
        </div>

        {isAdmin && (
          <div className="mb-8">
            <PaymentSetup />
          </div>
        )}

        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold mb-3 sm:mb-4 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            Welcome to Neroxa AI
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
            Your all-in-one AI-powered learning and creativity platform. Choose a tool to get started.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {navBoxes.map((box) => (
            <Link
              key={box.path}
              to={box.path}
              className="group"
            >
              <Card className="h-full transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-primary/20 border-2 hover:border-primary/50 cursor-pointer">
                <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
                  <div className={`p-4 rounded-2xl bg-gradient-to-br ${box.gradient} text-white shadow-lg group-hover:shadow-xl transition-shadow`}>
                    {box.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                      {box.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {box.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Pro Features Modal */}
      <ProFeaturesModal 
        isOpen={isProModalOpen} 
        onClose={() => setIsProModalOpen(false)} 
      />
    </div>
  );
}
