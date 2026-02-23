import { useNavigate } from '@tanstack/react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { XCircle, Home, RotateCcw } from 'lucide-react';

export function PaymentFailure() {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto px-4 py-16 max-w-2xl">
      <Card className="border-destructive/20 bg-destructive/5">
        <CardHeader className="text-center pb-4">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-destructive/20 rounded-full">
              <XCircle className="h-16 w-16 text-destructive" />
            </div>
          </div>
          <CardTitle className="text-3xl font-display text-destructive mb-2">
            Payment Cancelled
          </CardTitle>
          <CardDescription className="text-base">
            Your payment was not completed. No charges have been made.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="p-4 bg-background rounded-lg border border-border">
            <h3 className="font-semibold mb-2">What happened?</h3>
            <p className="text-sm text-muted-foreground">
              The payment process was cancelled or interrupted. This could happen if you closed the payment window,
              clicked the back button, or encountered an issue with your payment method.
            </p>
          </div>

          <div className="p-4 bg-muted/50 rounded-lg">
            <h3 className="font-semibold mb-2 text-sm">Need help?</h3>
            <p className="text-xs text-muted-foreground">
              If you're experiencing issues with payment, please check your payment method details or contact
              our support team for assistance.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={() => navigate({ to: '/' })}
              variant="outline"
              className="flex-1"
              size="lg"
            >
              <Home className="h-5 w-5 mr-2" />
              Go to Home
            </Button>
            <Button
              onClick={() => navigate({ to: '/pro-upgrade' })}
              className="flex-1"
              size="lg"
            >
              <RotateCcw className="h-5 w-5 mr-2" />
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
