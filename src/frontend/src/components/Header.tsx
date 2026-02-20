import { Moon, Sun, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';

export function Header() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const { identity, clear } = useInternetIdentity();
  const isAuthenticated = !!identity && !identity.getPrincipal().isAnonymous();

  useEffect(() => {
    const isDark = document.documentElement.classList.contains('dark');
    setTheme(isDark ? 'dark' : 'light');
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-3 sm:px-4 md:px-6 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <img
              src="/assets/Gemini_Generated_Image_cjqrvscjqrvscjqr-1.png"
              alt="Neroxa AI Logo"
              className="h-8 sm:h-10 md:h-12 w-auto object-contain"
            />
            <div>
              <h1 className="text-lg sm:text-xl md:text-2xl font-display font-bold text-foreground">
                neroxa ai
              </h1>
              <p className="text-[10px] sm:text-xs text-muted-foreground hidden sm:block">Your Learning Companion</p>
            </div>
          </div>
          
          <div className="flex items-center gap-1 sm:gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="min-h-[44px] min-w-[44px]"
            >
              {theme === 'light' ? (
                <Moon className="h-4 w-4 sm:h-5 sm:w-5" />
              ) : (
                <Sun className="h-4 w-4 sm:h-5 sm:w-5" />
              )}
            </Button>
            
            {isAuthenticated && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clear}
                className="gap-1 sm:gap-2 min-h-[44px] px-2 sm:px-3"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline text-sm">Sign Out</span>
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
