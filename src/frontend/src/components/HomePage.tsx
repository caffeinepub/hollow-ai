import { Link } from '@tanstack/react-router';
import { 
  Calculator, 
  MessageSquare, 
  Languages, 
  Code, 
  Music, 
  Palette, 
  Image, 
  Gamepad2 
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

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
  return (
    <div className="container mx-auto px-4 py-8 sm:py-12">
      <div className="max-w-6xl mx-auto">
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
    </div>
  );
}
