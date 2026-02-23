import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Crown, 
  Sparkles, 
  Zap, 
  Palette, 
  Music, 
  Calculator, 
  Languages, 
  MessageSquare,
  Gamepad2,
  Loader2,
  ArrowLeft,
  CheckCircle2
} from 'lucide-react';
import { useCreateCheckoutSession } from '@/hooks/useCheckout';
import { useInternetIdentity } from '@/hooks/useInternetIdentity';
import { useGetCallerUserProfile } from '@/hooks/useUserProfile';
import { toast } from 'sonner';
import type { ShoppingItem } from '@/backend';

const PRO_FEATURES = [
  {
    icon: <MessageSquare className="h-5 w-5" />,
    title: 'Enhanced AI Chat',
    description: 'Smarter AI with comprehensive understanding and expert-level assistance',
  },
  {
    icon: <Gamepad2 className="h-5 w-5" />,
    title: 'Two New 3D Games',
    description: '3D Space Shooter and 3D Racing games with immersive gameplay',
  },
  {
    icon: <Palette className="h-5 w-5" />,
    title: 'AI Art Generation',
    description: 'Create stunning artwork from text prompts with AI',
  },
  {
    icon: <Music className="h-5 w-5" />,
    title: 'Enhanced Music Studio',
    description: 'Longer tracks and voice recording for custom songs',
  },
  {
    icon: <Calculator className="h-5 w-5" />,
    title: 'Advanced Calculator',
    description: 'Full-featured calculator with scientific functions',
  },
  {
    icon: <Languages className="h-5 w-5" />,
    title: 'Extended Translator',
    description: 'More languages plus built-in dictionary definitions',
  },
  {
    icon: <Sparkles className="h-5 w-5" />,
    title: 'Premium Gold Theme',
    description: 'Exclusive gold background theme across the entire app',
  },
  {
    icon: <Zap className="h-5 w-5" />,
    title: 'Priority Support',
    description: 'Get faster responses and dedicated assistance',
  },
];

export function ProUpgrade() {
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const { data: userProfile } = useGetCallerUserProfile();
  const createCheckoutSession = useCreateCheckoutSession();
  const [isProcessing, setIsProcessing] = useState(false);

  const isAuthenticated = !!identity;
  const hasProSubscription = userProfile?.hasProSubscription || false;

  const handleUpgrade = async () => {
    if (!isAuthenticated) {
      toast.error('Please log in to upgrade to Pro');
      return;
    }

    if (hasProSubscription) {
      toast.info('You already have a Pro subscription!');
      return;
    }

    setIsProcessing(true);
    try {
      const shoppingItems: ShoppingItem[] = [
        {
          productName: 'Pro Subscription',
          productDescription: 'Unlock all premium features including enhanced AI, 3D games, AI art generation, and more',
          priceInCents: BigInt(2000), // $20.00 USD
          quantity: BigInt(1),
          currency: 'usd',
        },
      ];

      const session = await createCheckoutSession.mutateAsync(shoppingItems);
      
      if (!session?.url) {
        throw new Error('Stripe session missing url');
      }

      // Redirect to Stripe checkout
      window.location.href = session.url;
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error('Failed to start checkout. Please try again.');
      setIsProcessing(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <Button
        variant="ghost"
        onClick={() => navigate({ to: '/' })}
        className="mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Home
      </Button>

      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center p-3 bg-gradient-to-br from-warning to-warning/70 rounded-full mb-4">
          <Crown className="h-8 w-8 text-white" />
        </div>
        <h1 className="text-4xl font-display font-bold mb-3 bg-gradient-to-r from-warning via-warning/80 to-warning/60 bg-clip-text text-transparent">
          Upgrade to Pro
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Unlock the full potential of Neroxa AI with premium features and exclusive content
        </p>
      </div>

      {hasProSubscription && (
        <Card className="mb-8 border-success/20 bg-success/5">
          <CardContent className="flex items-center justify-center gap-3 py-6">
            <CheckCircle2 className="h-6 w-6 text-success" />
            <p className="text-lg font-semibold text-success">
              You already have Pro! Enjoy all premium features.
            </p>
          </CardContent>
        </Card>
      )}

      <Card className="mb-8 border-warning/20">
        <CardHeader className="text-center pb-4">
          <div className="flex items-center justify-center gap-2 mb-2">
            <CardTitle className="text-3xl font-display">Pro Subscription</CardTitle>
            <Badge variant="outline" className="text-warning border-warning">
              One-time payment
            </Badge>
          </div>
          <div className="flex items-baseline justify-center gap-2">
            <span className="text-5xl font-bold text-warning">$20</span>
            <span className="text-xl text-muted-foreground">USD</span>
          </div>
          <CardDescription className="text-base mt-2">
            Lifetime access to all Pro features
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {PRO_FEATURES.map((feature, index) => (
              <div
                key={index}
                className="flex gap-3 p-4 rounded-lg border border-border hover:border-warning/50 transition-colors"
              >
                <div className="flex-shrink-0 p-2 rounded-lg bg-warning/10 text-warning">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="font-semibold mb-1">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>

          <Button
            onClick={handleUpgrade}
            disabled={isProcessing || !isAuthenticated || hasProSubscription}
            className="w-full h-14 text-lg bg-gradient-to-r from-warning to-warning/80 hover:from-warning/90 hover:to-warning/70"
            size="lg"
          >
            {isProcessing ? (
              <>
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                Processing...
              </>
            ) : hasProSubscription ? (
              <>
                <CheckCircle2 className="h-5 w-5 mr-2" />
                Already Subscribed
              </>
            ) : !isAuthenticated ? (
              'Pay $20 to Upgrade'
            ) : (
              <>
                <Crown className="h-5 w-5 mr-2" />
                Upgrade to Pro - $20 USD
              </>
            )}
          </Button>

          {!isAuthenticated && (
            <p className="text-sm text-center text-muted-foreground mt-4">
              You need to be logged in to purchase a Pro subscription
            </p>
          )}
        </CardContent>
      </Card>

      <div className="text-center text-sm text-muted-foreground">
        <p>Secure payment processing powered by Stripe</p>
        <p className="mt-2">Questions? Contact support for assistance</p>
      </div>
    </div>
  );
}
