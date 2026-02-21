import { Button } from '@/components/ui/button';
import { Moon, Sun, LogOut } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCallerUserProfile } from '../hooks/useUserProfile';
import { useQueryClient } from '@tanstack/react-query';
import { ProfileSetup } from './ProfileSetup';

export function Header() {
  const { theme, setTheme } = useTheme();
  const { identity, clear, loginStatus } = useInternetIdentity();
  const queryClient = useQueryClient();
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();

  const isAuthenticated = !!identity;
  const showProfileSetup = isAuthenticated && !profileLoading && isFetched && userProfile === null;

  const handleSignOut = async () => {
    await clear();
    queryClient.clear();
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <img 
              src="/assets/generated/hollow-ai-logo.dim_200x200.png" 
              alt="Neroxa AI" 
              className="h-10 w-10 sm:h-12 sm:w-12"
            />
            <h1 className="text-xl sm:text-2xl font-display font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              <span className="hidden sm:inline">Neroxa AI</span>
              <span className="sm:hidden">Neroxa</span>
            </h1>
          </div>

          <div className="flex items-center gap-2">
            {isAuthenticated && userProfile && (
              <span className="hidden sm:inline text-sm text-muted-foreground mr-2">
                {userProfile.name}
              </span>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="min-h-[44px] min-w-[44px]"
            >
              <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
            {isAuthenticated && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleSignOut}
                disabled={loginStatus === 'logging-in'}
                className="min-h-[44px] min-w-[44px]"
              >
                <LogOut className="h-5 w-5" />
                <span className="sr-only">Sign out</span>
              </Button>
            )}
          </div>
        </div>
      </header>

      <ProfileSetup open={showProfileSetup} />
    </>
  );
}
