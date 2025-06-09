
"use client";

import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { useEffect, useState } from 'react'; 
import Image from 'next/image';
import { ShieldCheck, ExternalLink, Loader2 } from 'lucide-react'; 
import { loadStripe, type Stripe } from '@stripe/stripe-js';

const shippingSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  address: z.string().min(5, "Address is required"),
  city: z.string().min(2, "City is required"),
  postalCode: z.string().min(4, "Postal code is required"),
  country: z.string().min(2, "Country is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
});

const checkoutSchema = shippingSchema;
type CheckoutFormValues = z.infer<typeof checkoutSchema>;

// Initialize Stripe.js with your publishable key
const stripePromise = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
  ? loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
  : null;


const CheckoutPage = () => {
  const { cartItems, getCartTotal, clearCart, getItemCount } = useCart();
  const router = useRouter();
  const { toast } = useToast();
  const cartTotal = getCartTotal();
  const itemCount = getItemCount();
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  const { register, handleSubmit, formState: { errors, isSubmitting: isFormSubmitting } } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
  });

  useEffect(() => {
    if (itemCount === 0 && !isProcessingPayment) { 
      toast({
        title: "Your cart is empty",
        description: "Redirecting to products page...",
        variant: "destructive",
      });
      router.push('/products');
    }
  }, [itemCount, router, toast, isProcessingPayment]);

  const onSubmit: SubmitHandler<CheckoutFormValues> = async (data) => {
    if (!stripePromise) {
      toast({
        title: "Stripe Error",
        description: "Stripe.js has not loaded. Please check your configuration.",
        variant: "destructive",
      });
      return;
    }
    setIsProcessingPayment(true);

    try {
      // 1. Create a Checkout Session on your server
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cartItems, shippingDetails: data }), 
      });

      if (!response.ok) {
        const errorData = await response.json();
        // Prioritize specific error from server (errorData.error), then general message from server (errorData.message), then a fallback.
        const displayError = errorData.error || errorData.message || 'Failed to create Stripe session.';
        throw new Error(displayError);
      }

      const { sessionId } = await response.json();

      // 2. Redirect to Stripe Checkout
      const stripe = await stripePromise;
      if (stripe && sessionId) {
        const { error } = await stripe.redirectToCheckout({ sessionId });
        if (error) {
          console.error('Stripe redirectToCheckout error:', error);
          toast({
            title: 'Payment Error',
            description: error.message || 'Could not redirect to Stripe. Please try again.',
            variant: 'destructive',
          });
        }
      } else {
         throw new Error('Stripe or Session ID missing.');
      }

    } catch (error) {
      console.error('Checkout process error:', error);
      toast({
        title: 'Checkout Error',
        description: (error as Error).message || 'An unexpected error occurred. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsProcessingPayment(false);
    }
  };
  
  const isButtonDisabled = isFormSubmitting || isProcessingPayment;

  if (itemCount === 0 && !isProcessingPayment) { 
    return <div className="text-center py-10">Your cart is empty. Redirecting...</div>;
  }
  
  if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
     return (
        <div className="flex flex-col items-center justify-center h-screen">
            <Card className="p-8 shadow-xl border-destructive">
                <CardHeader>
                    <CardTitle className="text-2xl text-destructive">Configuration Error</CardTitle>
                </CardHeader>
                <CardContent>
                    <p>Stripe Publishable Key is not configured.</p>
                    <p>Please set <code className="bg-muted px-1 py-0.5 rounded">NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY</code> in your environment variables.</p>
                </CardContent>
            </Card>
        </div>
     );
  }


  return (
    <div className="grid lg:grid-cols-2 gap-12">
      {/* Order Summary */}
      <div className="lg:order-last">
        <Card className="shadow-xl sticky top-24">
          <CardHeader>
            <CardTitle className="text-xl font-headline text-primary">Your Order</CardTitle>
          </CardHeader>
          <CardContent>
            {cartItems.map(item => (
              <div key={item.id} className="flex items-center gap-4 py-3 border-b last:border-b-0">
                <Image src={item.images[0]} alt={item.name} width={64} height={64} className="rounded-md object-cover bg-secondary" data-ai-hint={item.dataAiHint || 'checkout item shoe'}/>
                <div className="flex-grow">
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                </div>
                <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
              </div>
            ))}
            <hr className="my-4" />
            <div className="flex justify-between text-lg font-semibold">
              <span>Total:</span>
              <span>${cartTotal.toFixed(2)}</span>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Checkout Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl font-headline text-primary">Shipping Details</CardTitle>
            <CardDescription>Enter your shipping address.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="fullName">Full Name</Label>
              <Input id="fullName" {...register("fullName")} disabled={isButtonDisabled} />
              {errors.fullName && <p className="text-sm text-destructive mt-1">{errors.fullName.message}</p>}
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" {...register("email")} disabled={isButtonDisabled} />
              {errors.email && <p className="text-sm text-destructive mt-1">{errors.email.message}</p>}
            </div>
            <div>
              <Label htmlFor="address">Address</Label>
              <Input id="address" {...register("address")} disabled={isButtonDisabled} />
              {errors.address && <p className="text-sm text-destructive mt-1">{errors.address.message}</p>}
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="city">City</Label>
                <Input id="city" {...register("city")} disabled={isButtonDisabled} />
                {errors.city && <p className="text-sm text-destructive mt-1">{errors.city.message}</p>}
              </div>
              <div>
                <Label htmlFor="postalCode">Postal Code</Label>
                <Input id="postalCode" {...register("postalCode")} disabled={isButtonDisabled} />
                {errors.postalCode && <p className="text-sm text-destructive mt-1">{errors.postalCode.message}</p>}
              </div>
            </div>
            <div>
              <Label htmlFor="country">Country</Label>
              <Input id="country" {...register("country")} disabled={isButtonDisabled} />
              {errors.country && <p className="text-sm text-destructive mt-1">{errors.country.message}</p>}
            </div>
            <div>
              <Label htmlFor="phone">Phone (Optional)</Label>
              <Input id="phone" type="tel" {...register("phone")} disabled={isButtonDisabled} />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl font-headline text-primary">Payment</CardTitle>
            <CardDescription className="flex items-center gap-2 text-muted-foreground">
              <ShieldCheck className="h-5 w-5 text-green-500" /> You will be redirected to Stripe for secure payment.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-foreground">
              After confirming your shipping details, you will be redirected to Stripe's secure payment gateway to complete your purchase. 
              We do not store your payment information on our servers.
            </p>
          </CardContent>
        </Card>

        <Button type="submit" size="lg" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" disabled={isButtonDisabled}>
          {isProcessingPayment ? (
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          ) : (
            <ExternalLink className="mr-2 h-5 w-5" />
          )}
          {isProcessingPayment ? 'Processing...' : `Confirm & Proceed to Pay $${cartTotal.toFixed(2)}`} 
        </Button>
      </form>
    </div>
  );
};

export default CheckoutPage;
