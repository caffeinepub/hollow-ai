import { useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Home, Sparkles } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';

export function PaymentSuccess() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  useEffect(() => {
    // Invalidate user profile to refresh Pro status
    queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
  }, [queryClient]);

  return (
    <div className="container mx-auto px-4 py-16 max-w-2xl">
      <Card className="border-success/20 bg-success/5">
        <CardHeader className="text-center pb-4">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-success/20 rounded-full">
              <CheckCircle2 className="h-16 w-16 text-success" />
            </div>
          </div>
          <CardTitle className="text-3xl font-display text-success mb-2">
            Payment Successful!
          </CardTitle>
          <CardDescription className="text-base">
            Welcome to Neroxa AI Pro! Your subscription is now active.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="p-4 bg-background rounded-lg border border-border">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-warning" />
              You now have access to:
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                <span>Enhanced AI chat with comprehensive understanding</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                <span>Two new 3D games (Space Shooter & Racing)</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                <span>AI-powered art generation from text prompts</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                <span>Enhanced music studio with voice recording</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                <span>Advanced calculator and extended translator</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                <span>Exclusive gold theme and priority support</span>
              </li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={() => navigate({ to: '/' })}
              className="flex-1"
              size="lg"
            >
              <Home className="h-5 w-5 mr-2" />
              Go to Home
            </Button>
            <Button
              onClick={() => navigate({ to: '/chat' })}
              variant="outline"
              className="flex-1"
              size="lg"
            >
              <Sparkles className="h-5 w-5 mr-2" />
              Try Pro Features
            </Button>
          </div>

          <p className="text-xs text-center text-muted-foreground">
            A confirmation email has been sent to your registered email address
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
