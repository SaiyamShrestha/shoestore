"use client";

import type { CartItem, Product } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getItemCount: () => number;
  isCartOpen: boolean;
  setIsCartOpen: (isOpen: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const storedCart = localStorage.getItem('soleMateCart');
    if (storedCart) {
      setCartItems(JSON.parse(storedCart));
    }
  }, []);

  useEffect(() => {
    if (cartItems.length > 0 || localStorage.getItem('soleMateCart')) {
      localStorage.setItem('soleMateCart', JSON.stringify(cartItems));
    }
  }, [cartItems]);

  const addToCart = (product: Product, quantity: number = 1) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      if (existingItem) {
        if (existingItem.quantity + quantity > product.stock) {
          toast({
            title: "Stock limit reached",
            description: `Cannot add more ${product.name}. Only ${product.stock - existingItem.quantity} left.`,
            variant: "destructive",
          });
          return prevItems.map(item =>
            item.id === product.id ? { ...item, quantity: product.stock } : item
          );
        }
        return prevItems.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      if (quantity > product.stock) {
         toast({
            title: "Stock limit reached",
            description: `Cannot add ${quantity} of ${product.name}. Only ${product.stock} available.`,
            variant: "destructive",
          });
        return [...prevItems, { ...product, quantity: product.stock }];
      }
      return [...prevItems, { ...product, quantity }];
    });
    toast({
      title: "Item added to cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  const removeFromCart = (productId: string) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
    toast({
      title: "Item removed",
      description: "Item has been removed from your cart.",
      variant: "destructive"
    });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    setCartItems(prevItems =>
      prevItems.map(item => {
        if (item.id === productId) {
          if (quantity <= 0) {
            removeFromCart(productId); // This will show its own toast
            return item; // This item will be filtered out by removeFromCart's effect
          }
          if (quantity > item.stock) {
            toast({
              title: "Stock limit reached",
              description: `Only ${item.stock} units of ${item.name} available.`,
              variant: "destructive",
            });
            return { ...item, quantity: item.stock };
          }
          return { ...item, quantity };
        }
        return item;
      }).filter(item => item.quantity > 0) // Ensure items removed by setting quantity to 0 are gone
    );
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('soleMateCart');
    toast({
      title: "Cart cleared",
      description: "Your shopping cart has been emptied.",
    });
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getItemCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };
  
  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart, getCartTotal, getItemCount, isCartOpen, setIsCartOpen }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
