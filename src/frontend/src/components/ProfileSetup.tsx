import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, User } from 'lucide-react';
import { useSaveCallerUserProfile } from '@/hooks/useUserProfile';

interface ProfileSetupProps {
  open: boolean;
  onComplete: () => void;
}

export function ProfileSetup({ open, onComplete }: ProfileSetupProps) {
  const [name, setName] = useState('');
  const saveProfile = useSaveCallerUserProfile();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      saveProfile.mutate({
        name: name.trim(),
        gamesPlayed: BigInt(0),
        totalScore: BigInt(0),
        hasProSubscription: false,
      });
    }
  };

  // Close dialog when profile is saved successfully
  if (saveProfile.isSuccess) {
    onComplete();
  }

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md" onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Welcome to Neroxa AI!
          </DialogTitle>
          <DialogDescription>
            Please enter your name to get started with your personalized experience.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Your Name</Label>
            <Input
              id="name"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={saveProfile.isPending}
              autoFocus
            />
          </div>
          <Button
            type="submit"
            className="w-full"
            disabled={!name.trim() || saveProfile.isPending}
          >
            {saveProfile.isPending ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              'Continue'
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
