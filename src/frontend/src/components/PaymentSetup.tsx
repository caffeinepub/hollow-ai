import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { CreditCard, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { useActor } from '@/hooks/useActor';
import { toast } from 'sonner';
import type { StripeConfiguration } from '@/backend';

export function PaymentSetup() {
  const { actor } = useActor();
  const [isConfigured, setIsConfigured] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [secretKey, setSecretKey] = useState('');
  const [countries, setCountries] = useState('US,CA,GB,DE,FR,ES,IT,AU,NZ,JP');

  useEffect(() => {
    checkConfiguration();
  }, [actor]);

  const checkConfiguration = async () => {
    if (!actor) return;
    
    try {
      const configured = await actor.isStripeConfigured();
      setIsConfigured(configured);
    } catch (error) {
      console.error('Failed to check Stripe configuration:', error);
      setIsConfigured(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveConfiguration = async () => {
    if (!actor || !secretKey.trim()) {
      toast.error('Please enter a valid Stripe secret key');
      return;
    }

    setIsSaving(true);
    try {
      const allowedCountries = countries.split(',').map(c => c.trim()).filter(c => c.length > 0);
      
      const config: StripeConfiguration = {
        secretKey: secretKey.trim(),
        allowedCountries,
      };

      await actor.setStripeConfiguration(config);
      setIsConfigured(true);
      toast.success('Stripe configuration saved successfully!');
      setSecretKey('');
    } catch (error) {
      console.error('Failed to save Stripe configuration:', error);
      toast.error('Failed to save Stripe configuration');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <Card className="border-primary/20">
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  if (isConfigured) {
    return (
      <Card className="border-success/20 bg-success/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-success">
            <CheckCircle2 className="h-5 w-5" />
            Stripe Payment Configured
          </CardTitle>
          <CardDescription>
            Payment processing is active and ready to accept Pro subscriptions
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="border-warning/20 bg-warning/5">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-warning" />
          Configure Stripe Payment
        </CardTitle>
        <CardDescription>
          Set up Stripe to enable Pro tier subscriptions ($20 USD)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="stripe-key">Stripe Secret Key</Label>
          <Input
            id="stripe-key"
            type="password"
            placeholder="sk_test_..."
            value={secretKey}
            onChange={(e) => setSecretKey(e.target.value)}
            className="font-mono text-sm"
          />
          <p className="text-xs text-muted-foreground">
            Your Stripe secret key (starts with sk_test_ or sk_live_)
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="countries">Allowed Countries</Label>
          <Input
            id="countries"
            placeholder="US,CA,GB,DE,FR"
            value={countries}
            onChange={(e) => setCountries(e.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            Comma-separated country codes (e.g., US, CA, GB)
          </p>
        </div>

        <Button
          onClick={handleSaveConfiguration}
          disabled={isSaving || !secretKey.trim()}
          className="w-full"
        >
          {isSaving ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Saving Configuration...
            </>
          ) : (
            <>
              <CreditCard className="h-4 w-4 mr-2" />
              Save Stripe Configuration
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
