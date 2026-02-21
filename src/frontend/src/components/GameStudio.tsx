import { useState } from 'react';
import { useCreateGame } from '../hooks/useGames';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Save, Eye } from 'lucide-react';
import { toast } from 'sonner';
import { Alert, AlertDescription } from '@/components/ui/alert';

export function GameStudio() {
  const { identity } = useInternetIdentity();
  const navigate = useNavigate();
  const createGameMutation = useCreateGame();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [gameCode, setGameCode] = useState('');

  const handleSave = async () => {
    if (!identity) {
      toast.error('Please log in to create games');
      return;
    }

    if (!title.trim()) {
      toast.error('Please enter a game title');
      return;
    }

    if (!description.trim()) {
      toast.error('Please enter a game description');
      return;
    }

    if (!gameCode.trim()) {
      toast.error('Please enter game code');
      return;
    }

    try {
      await createGameMutation.mutateAsync({
        title: title.trim(),
        description: description.trim(),
        gameCode: gameCode.trim(),
      });
      toast.success('Game created successfully!');
      
      // Reset form
      setTitle('');
      setDescription('');
      setGameCode('');
      
      // Navigate to browser after a short delay
      setTimeout(() => {
        navigate({ to: '/games/browse' });
      }, 1500);
    } catch (error) {
      toast.error('Failed to create game');
      console.error('Game creation error:', error);
    }
  };

  if (!identity) {
    return (
      <div className="flex items-center justify-center h-96">
        <Alert className="max-w-md">
          <AlertDescription>
            Please log in to create games
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl sm:text-3xl font-display font-bold text-foreground">
          Game Studio
        </h2>
        <p className="text-sm sm:text-base text-muted-foreground">
          Create your own game with HTML, CSS, and JavaScript
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Game Details</CardTitle>
          <CardDescription>
            Enter the basic information about your game
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Game Title</Label>
            <Input
              id="title"
              placeholder="My Awesome Game"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="min-h-[44px]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="A fun and exciting game where..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="resize-none"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="gameCode">Game Code (HTML/CSS/JavaScript)</Label>
            <Textarea
              id="gameCode"
              placeholder="<!DOCTYPE html>
<html>
<head>
  <title>My Game</title>
  <style>
    /* Your CSS here */
  </style>
</head>
<body>
  <canvas id='game'></canvas>
  <script>
    // Your JavaScript here
  </script>
</body>
</html>"
              value={gameCode}
              onChange={(e) => setGameCode(e.target.value)}
              rows={15}
              className="font-mono text-sm resize-none"
            />
            <p className="text-xs text-muted-foreground">
              Enter complete HTML with inline CSS and JavaScript. Use postMessage to send scores: 
              <code className="ml-1 px-1 py-0.5 bg-muted rounded">window.parent.postMessage({`{ type: 'gameScore', score: 100 }`}, '*')</code>
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              onClick={handleSave}
              disabled={createGameMutation.isPending}
              className="flex-1 sm:flex-none"
            >
              {createGameMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Game
                </>
              )}
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate({ to: '/games/browse' })}
              className="flex-1 sm:flex-none"
            >
              <Eye className="h-4 w-4 mr-2" />
              View All Games
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
