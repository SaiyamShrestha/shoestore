"use client";

import { useCart } from '@/contexts/CartContext';
import CartItem from '@/components/cart/CartItem';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ShoppingBag, ArrowRight } from 'lucide-react';

const CartPage = () => {
  const { cartItems, getCartTotal, clearCart, getItemCount } = useCart();
  const itemCount = getItemCount();
  const cartTotal = getCartTotal();

  if (itemCount === 0) {
    return (
      <div className="text-center py-20">
        <ShoppingBag className="mx-auto h-24 w-24 text-muted-foreground mb-6" />
        <h1 className="text-3xl font-bold font-headline text-primary mb-4">Your Cart is Empty</h1>
        <p className="text-muted-foreground mb-8">Looks like you haven't added anything to your cart yet.</p>
        <Link href="/products" passHref>
          <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
            Start Shopping
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="grid lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2">
        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl font-headline text-primary">Shopping Cart ({itemCount} {itemCount === 1 ? 'item' : 'items'})</CardTitle>
          </CardHeader>
          <CardContent className="divide-y divide-border">
            {cartItems.map(item => (
              <CartItem key={item.id} item={item} />
            ))}
          </CardContent>
        </Card>
        {cartItems.length > 0 && (
          <div className="mt-6 text-right">
            <Button variant="outline" onClick={clearCart} className="text-destructive border-destructive hover:bg-destructive/10">
              Clear Cart
            </Button>
          </div>
        )}
      </div>

      <div className="lg:col-span-1 self-start sticky top-24">
        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="text-xl font-headline text-primary">Order Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <p className="text-muted-foreground">Subtotal</p>
              <p className="font-medium">${cartTotal.toFixed(2)}</p>
            </div>
            <div className="flex justify-between">
              <p className="text-muted-foreground">Shipping</p>
              <p className="font-medium">Free</p> {/* Mocked */}
            </div>
            <hr className="my-2 border-border" />
            <div className="flex justify-between text-lg font-bold">
              <p className="text-primary">Total</p>
              <p className="text-primary">${cartTotal.toFixed(2)}</p>
            </div>
          </CardContent>
          <CardFooter>
            <Link href="/checkout" passHref className="w-full">
              <Button size="lg" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
                Proceed to Checkout <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default CartPage;
