import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { CheckCircle2 } from 'lucide-react';

export default function OrderConfirmationPage() {
  return (
    <div className="text-center py-20">
      <CheckCircle2 className="mx-auto h-24 w-24 text-green-500 mb-6" />
      <h1 className="text-4xl font-bold font-headline text-primary mb-4">Thank You for Your Order!</h1>
      <p className="text-lg text-muted-foreground mb-8 max-w-md mx-auto">
        Your order has been placed successfully. You will receive an email confirmation shortly.
      </p>
      <div className="space-x-4">
        <Link href="/products" passHref>
          <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary/10">
            Continue Shopping
          </Button>
        </Link>
        <Link href="/" passHref>
          <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
            Back to Home
          </Button>
        </Link>
      </div>
    </div>
  );
}
