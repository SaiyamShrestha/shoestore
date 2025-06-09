
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
import { useEffect } from 'react';
import Image from 'next/image';
import { ShieldCheck, ExternalLink } from 'lucide-react'; // Added ExternalLink

const shippingSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  address: z.string().min(5, "Address is required"),
  city: z.string().min(2, "City is required"),
  postalCode: z.string().min(4, "Postal code is required"),
  country: z.string().min(2, "Country is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
});

// Payment schema removed as Stripe will handle payment details externally.
// const paymentSchema = z.object({
//   cardNumber: z.string().length(16, "Card number must be 16 digits").regex(/^\d+$/, "Invalid card number"),
//   expiryDate: z.string().regex(/^(0[1-9]|1[0-2])\/\d{2}$/, "MM/YY format required"),
//   cvv: z.string().length(3, "CVV must be 3 digits").regex(/^\d+$/, "Invalid CVV"),
//   cardHolderName: z.string().min(2, "Cardholder name is required"),
// });

// Checkout schema now only includes shipping details.
const checkoutSchema = shippingSchema;

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

const CheckoutPage = () => {
  const { cartItems, getCartTotal, clearCart, getItemCount } = useCart();
  const router = useRouter();
  const { toast } = useToast();
  const cartTotal = getCartTotal();
  const itemCount = getItemCount();

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
  });

  useEffect(() => {
    if (itemCount === 0) {
      toast({
        title: "Your cart is empty",
        description: "Redirecting to products page...",
        variant: "destructive",
      });
      router.push('/products');
    }
  }, [itemCount, router, toast]);

  const onSubmit: SubmitHandler<CheckoutFormValues> = async (data) => {
    // Simulate API call for order creation (without payment details)
    await new Promise(resolve => setTimeout(resolve, 1500));
    console.log("Shipping Data:", data); 
    // In a real Stripe integration, you would now redirect to Stripe Checkout
    // or use Stripe Elements to finalize the payment on the client-side,
    // after creating a PaymentIntent on your server.

    toast({
      title: "Order Confirmed!",
      description: "Thank you for your purchase. You will be redirected to payment.",
    });
    // clearCart(); // Typically clear cart after successful payment confirmation from Stripe
    // router.push('/order-confirmation'); 

    // For now, we'll simulate a redirect to a generic confirmation page.
    // In a real scenario, this would happen AFTER Stripe confirms payment.
    setTimeout(() => {
        clearCart();
        router.push('/order-confirmation'); 
    }, 2000);
  };

  if (itemCount === 0) {
    return <div className="text-center py-10">Your cart is empty. Redirecting...</div>;
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
              <Input id="fullName" {...register("fullName")} />
              {errors.fullName && <p className="text-sm text-destructive mt-1">{errors.fullName.message}</p>}
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" {...register("email")} />
              {errors.email && <p className="text-sm text-destructive mt-1">{errors.email.message}</p>}
            </div>
            <div>
              <Label htmlFor="address">Address</Label>
              <Input id="address" {...register("address")} />
              {errors.address && <p className="text-sm text-destructive mt-1">{errors.address.message}</p>}
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="city">City</Label>
                <Input id="city" {...register("city")} />
                {errors.city && <p className="text-sm text-destructive mt-1">{errors.city.message}</p>}
              </div>
              <div>
                <Label htmlFor="postalCode">Postal Code</Label>
                <Input id="postalCode" {...register("postalCode")} />
                {errors.postalCode && <p className="text-sm text-destructive mt-1">{errors.postalCode.message}</p>}
              </div>
            </div>
            <div>
              <Label htmlFor="country">Country</Label>
              <Input id="country" {...register("country")} />
              {errors.country && <p className="text-sm text-destructive mt-1">{errors.country.message}</p>}
            </div>
            <div>
              <Label htmlFor="phone">Phone (Optional)</Label>
              <Input id="phone" type="tel" {...register("phone")} />
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
              After confirming your order, you will be redirected to Stripe's secure payment gateway to complete your purchase. 
              We do not store your payment information on our servers.
            </p>
          </CardContent>
        </Card>

        <Button type="submit" size="lg" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" disabled={isSubmitting}>
          {isSubmitting ? "Processing..." : `Confirm Order & Proceed to Pay $${cartTotal.toFixed(2)}`} 
          {!isSubmitting && <ExternalLink className="ml-2 h-5 w-5" />}
        </Button>
      </form>
    </div>
  );
};

export default CheckoutPage;

    