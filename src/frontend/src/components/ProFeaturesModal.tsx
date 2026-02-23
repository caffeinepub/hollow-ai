import { useState } from 'react';
import { X, Crown, Loader2, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCreateCheckoutSession } from '@/hooks/useCheckout';
import { useInternetIdentity } from '@/hooks/useInternetIdentity';
import { useGetCallerUserProfile, useIsOwner } from '@/hooks/useUserProfile';
import { toast } from 'sonner';
import type { ShoppingItem } from '@/backend';

interface ProFeaturesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PRO_FEATURES = [
  'Unlimited AI chat conversations',
  'Advanced math problem solving',
  'Premium 3D games (Space Shooter & Racing)',
  'High-quality media generation',
  'Priority support',
  'Ad-free experience',
  'Custom gold theme',
  'Offline mode access',
  'Collaboration tools',
  'Cloud storage',
  'API access',
  'Early access to new features',
];

export function ProFeaturesModal({ isOpen, onClose }: ProFeaturesModalProps) {
  const { identity } = useInternetIdentity();
  const { data: userProfile } = useGetCallerUserProfile();
  const { data: isOwner } = useIsOwner();
  const createCheckoutSession = useCreateCheckoutSession();
  const [isProcessing, setIsProcessing] = useState(false);

  const isAuthenticated = !!identity;
  const hasPro = userProfile?.isPro || false;

  const handleBuyClick = async () => {
    if (!isAuthenticated) {
      toast.error('Please log in to upgrade to Pro');
      return;
    }

    if (hasPro || isOwner) {
      toast.info('You already have Pro access!');
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

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div 
        className="relative bg-background border-2 border-warning/30 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-muted transition-colors z-10"
          aria-label="Close modal"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header */}
        <div className="text-center pt-8 pb-6 px-6 border-b border-border">
          <div className="inline-flex items-center justify-center p-3 bg-gradient-to-br from-warning to-warning/70 rounded-full mb-4">
            <Crown className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-3xl font-display font-bold mb-2 bg-gradient-to-r from-warning via-warning/80 to-warning/60 bg-clip-text text-transparent">
            {isOwner ? 'Pro Features' : 'Upgrade to Pro'}
          </h2>
          {!isOwner && (
            <>
              <div className="flex items-baseline justify-center gap-2 mb-2">
                <span className="text-4xl font-bold text-warning">$20</span>
                <span className="text-lg text-muted-foreground">USD</span>
              </div>
              <Badge variant="outline" className="text-warning border-warning">
                One-time payment • Lifetime access
              </Badge>
            </>
          )}
        </div>

        {/* Pro subscription status */}
        {(hasPro || isOwner) && (
          <div className="mx-6 mt-6 p-4 rounded-lg border border-success/20 bg-success/5 flex items-center gap-3">
            <CheckCircle2 className="h-5 w-5 text-success flex-shrink-0" />
            <p className="text-sm font-semibold text-success">
              {isOwner ? 'You have Pro access as the owner!' : 'You already have Pro! Enjoy all premium features.'}
            </p>
          </div>
        )}

        {/* Features list */}
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">What's included:</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {PRO_FEATURES.map((feature, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-3 rounded-lg border border-border hover:border-warning/50 transition-colors"
              >
                <CheckCircle2 className="h-5 w-5 text-warning flex-shrink-0 mt-0.5" />
                <span className="text-sm">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Buy button - hidden for owner */}
        {!isOwner && (
          <div className="p-6 pt-0">
            <Button
              onClick={handleBuyClick}
              disabled={isProcessing || !isAuthenticated || hasPro}
              className="w-full h-12 text-lg bg-gradient-to-r from-warning to-warning/80 hover:from-warning/90 hover:to-warning/70"
              size="lg"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Processing...
                </>
              ) : hasPro ? (
                <>
                  <CheckCircle2 className="h-5 w-5 mr-2" />
                  Already Subscribed
                </>
              ) : !isAuthenticated ? (
                'Pay $20 to Upgrade'
              ) : (
                <>
                  <Crown className="h-5 w-5 mr-2" />
                  Pay $20 to Upgrade
                </>
              )}
            </Button>

            {!isAuthenticated && (
              <p className="text-xs text-center text-muted-foreground mt-3">
                You need to be logged in to purchase a Pro subscription
              </p>
            )}
          </div>
        )}

        {/* Footer */}
        {!isOwner && (
          <div className="px-6 pb-6 text-center text-xs text-muted-foreground">
            <p>Secure payment processing powered by Stripe</p>
          </div>
        )}
      </div>
    </div>
  );
}
