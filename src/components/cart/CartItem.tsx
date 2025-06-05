"use client";

import type { CartItem as CartItemType } from '@/lib/types';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCart } from '@/contexts/CartContext';
import { Trash2, Plus, Minus } from 'lucide-react';

interface CartItemProps {
  item: CartItemType;
}

const CartItem = ({ item }: CartItemProps) => {
  const { updateQuantity, removeFromCart } = useCart();

  const handleQuantityChange = (newQuantity: number) => {
    updateQuantity(item.id, newQuantity);
  };

  return (
    <div className="flex items-start gap-4 py-4 border-b border-border last:border-b-0">
      <Link href={`/products/${item.slug}`} passHref>
        <div className="relative h-24 w-24 rounded-md overflow-hidden shrink-0 bg-secondary">
          <Image
            src={item.images[0]}
            alt={item.name}
            fill
            sizes="100px"
            className="object-cover"
            data-ai-hint={item.dataAiHint || 'cart item shoe'}
          />
        </div>
      </Link>
      <div className="flex-grow">
        <Link href={`/products/${item.slug}`} passHref>
            <h3 className="font-semibold text-lg hover:text-primary transition-colors">{item.name}</h3>
        </Link>
        <p className="text-sm text-muted-foreground">Brand: {item.brand}</p>
        <p className="text-sm text-muted-foreground">Price: ${item.price.toFixed(2)}</p>
        <div className="flex items-center mt-2">
          <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => handleQuantityChange(item.quantity - 1)} disabled={item.quantity <= 1}>
            <Minus className="h-4 w-4" />
          </Button>
          <Input
            type="number"
            value={item.quantity}
            readOnly
            className="w-12 h-8 text-center mx-2 appearance-none"
            aria-label="Quantity"
          />
          <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => handleQuantityChange(item.quantity + 1)} disabled={item.quantity >= item.stock}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
         {item.quantity > item.stock && <p className="text-xs text-destructive mt-1">Max {item.stock} available</p>}
      </div>
      <div className="flex flex-col items-end justify-between h-full">
        <p className="font-semibold text-lg text-primary">${(item.price * item.quantity).toFixed(2)}</p>
        <Button variant="ghost" size="icon" onClick={() => removeFromCart(item.id)} className="text-muted-foreground hover:text-destructive">
          <Trash2 className="h-5 w-5" />
          <span className="sr-only">Remove item</span>
        </Button>
      </div>
    </div>
  );
};

export default CartItem;
