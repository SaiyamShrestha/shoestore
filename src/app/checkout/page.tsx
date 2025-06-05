"use client";

import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { useEffect } from 'react';
import Image from 'next/image';
import { CreditCard, ShieldCheck } from 'lucide-react';

const shippingSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  address: z.string().min(5, "Address is required"),
  city: z.string().min(2, "City is required"),
  postalCode: z.string().min(4, "Postal code is required"),
  country: z.string().min(2, "Country is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
});

const paymentSchema = z.object({
  cardNumber: z.string().length(16, "Card number must be 16 digits").regex(/^\d+$/, "Invalid card number"),
  expiryDate: z.string().regex(/^(0[1-9]|1[0-2])\/\d{2}$/, "MM/YY format required"),
  cvv: z.string().length(3, "CVV must be 3 digits").regex(/^\d+$/, "Invalid CVV"),
  cardHolderName: z.string().min(2, "Cardholder name is required"),
});

const checkoutSchema = shippingSchema.merge(paymentSchema);

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
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    console.log("Checkout Data:", data);
    toast({
      title: "Order Placed!",
      description: "Thank you for your purchase. Your order is being processed.",
    });
    clearCart();
    router.push('/order-confirmation'); // Mock confirmation page
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
            <CardTitle className="text-2xl font-headline text-primary">Payment Information</CardTitle>
            <CardDescription className="flex items-center gap-2 text-muted-foreground">
              <ShieldCheck className="h-5 w-5 text-green-500" /> Secure Payment
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="cardHolderName">Cardholder Name</Label>
              <Input id="cardHolderName" {...register("cardHolderName")} />
              {errors.cardHolderName && <p className="text-sm text-destructive mt-1">{errors.cardHolderName.message}</p>}
            </div>
            <div>
              <Label htmlFor="cardNumber">Card Number</Label>
              <div className="relative">
                <Input id="cardNumber" placeholder="•••• •••• •••• ••••" {...register("cardNumber")} className="pl-10"/>
                <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              </div>
              {errors.cardNumber && <p className="text-sm text-destructive mt-1">{errors.cardNumber.message}</p>}
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="expiryDate">Expiry Date (MM/YY)</Label>
                <Input id="expiryDate" placeholder="MM/YY" {...register("expiryDate")} />
                {errors.expiryDate && <p className="text-sm text-destructive mt-1">{errors.expiryDate.message}</p>}
              </div>
              <div>
                <Label htmlFor="cvv">CVV</Label>
                <Input id="cvv" placeholder="•••" {...register("cvv")} />
                {errors.cvv && <p className="text-sm text-destructive mt-1">{errors.cvv.message}</p>}
              </div>
            </div>
          </CardContent>
        </Card>

        <Button type="submit" size="lg" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" disabled={isSubmitting}>
          {isSubmitting ? "Processing..." : `Pay $${cartTotal.toFixed(2)}`}
        </Button>
      </form>
    </div>
  );
};

export default CheckoutPage;
