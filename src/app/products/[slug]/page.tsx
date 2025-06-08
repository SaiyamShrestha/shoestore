
"use client";

import type { Product } from '@/lib/types';
import { getProductBySlug } from '@/lib/mock-data';
import Image from 'next/image';
import { useState, useEffect, use } from 'react'; // Added 'use'
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCart } from '@/contexts/CartContext';
import ReviewStars from '@/components/products/ReviewStars';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShoppingCart, MessageSquare, ThumbsUp, Minus, Plus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

interface ProductDetailsPageProps {
  params: { // This is the prop Next.js might treat as Promise-like
    slug: string;
  };
}

const ProductDetailsPage = ({ params: paramsProp }: ProductDetailsPageProps) => {
  const params = use(paramsProp); // Unwrap the params prop

  const [product, setProduct] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const { addToCart } = useCart();

  useEffect(() => {
    if (params && params.slug) { // Use the unwrapped params
      const fetchedProduct = getProductBySlug(params.slug);
      if (fetchedProduct) {
        setProduct(fetchedProduct);
        setSelectedSize(fetchedProduct.sizes[0] || '');
        setSelectedImage(fetchedProduct.images[0] || '');
      }
    }
  }, [params?.slug]); // Depend on the unwrapped params.slug

  if (!product) {
    return <div className="text-center py-10">Loading product details...</div>;
  }

  const handleAddToCart = () => {
    if (!selectedSize) {
      // Potentially show a toast message here
      alert("Please select a size.");
      return;
    }
    addToCart(product, quantity);
  };

  return (
    <div className="container mx-auto py-8">
      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        {/* Image Gallery */}
        <div className="space-y-4">
          <div className="aspect-square relative rounded-lg overflow-hidden shadow-xl bg-card">
            <Image
              src={selectedImage}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-contain p-4"
              priority
              data-ai-hint={product.dataAiHint || 'shoe product detail'}
            />
          </div>
          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(img)}
                  className={`aspect-square relative rounded-md overflow-hidden border-2 transition-all ${selectedImage === img ? 'border-primary ring-2 ring-primary ring-offset-2' : 'border-border hover:border-primary/50'}`}
                >
                  <Image src={img} alt={`${product.name} thumbnail ${index + 1}`} fill className="object-cover" data-ai-hint={product.dataAiHint || 'shoe product thumbnail'} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <h1 className="text-4xl font-bold font-headline text-primary">{product.name}</h1>
          <p className="text-lg text-muted-foreground">{product.brand}</p>
          
          <div className="flex items-center gap-2">
            <ReviewStars rating={product.reviews.reduce((acc, r) => acc + r.rating, 0) / (product.reviews.length || 1)} />
            <span className="text-sm text-muted-foreground">({product.reviews.length} reviews)</span>
          </div>

          <p className="text-3xl font-semibold text-accent">${product.price.toFixed(2)}</p>
          
          {product.stock < 10 && product.stock > 0 && (
            <p className="text-sm text-destructive">Only {product.stock} left in stock!</p>
          )}
          {product.stock === 0 && (
            <p className="text-sm text-destructive font-semibold">Out of stock</p>
          )}

          <div className="space-y-2">
            <label htmlFor="size-select" className="block text-sm font-medium text-foreground">Select Size:</label>
            <Select value={selectedSize} onValueChange={setSelectedSize} disabled={product.stock === 0}>
              <SelectTrigger id="size-select" className="w-full md:w-1/2">
                <SelectValue placeholder="Select a size" />
              </SelectTrigger>
              <SelectContent>
                {product.sizes.map(size => (
                  <SelectItem key={size} value={size}>{size}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="quantity" className="block text-sm font-medium text-foreground">Quantity:</label>
            <div className="flex items-center w-full md:w-1/2">
              <Button variant="outline" size="icon" onClick={() => setQuantity(Math.max(1, quantity - 1))} disabled={product.stock === 0}>
                <Minus className="h-4 w-4" />
              </Button>
              <Input 
                id="quantity" 
                type="number" 
                value={quantity} 
                readOnly 
                className="w-16 h-10 text-center mx-2 appearance-none"
                disabled={product.stock === 0} 
              />
              <Button variant="outline" size="icon" onClick={() => setQuantity(Math.min(product.stock, quantity + 1))} disabled={product.stock === 0 || quantity >= product.stock}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <Button 
            size="lg" 
            className="w-full md:w-auto bg-accent hover:bg-accent/90 text-accent-foreground" 
            onClick={handleAddToCart}
            disabled={product.stock === 0 || !selectedSize}
          >
            <ShoppingCart className="mr-2 h-5 w-5" />
            {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
          </Button>
        </div>
      </div>

      {/* Product Details & Reviews Tabs */}
      <Tabs defaultValue="description" className="mt-12">
        <TabsList className="grid w-full grid-cols-2 md:w-1/2">
          <TabsTrigger value="description"><MessageSquare className="mr-2 h-4 w-4" />Description</TabsTrigger>
          <TabsTrigger value="reviews"><ThumbsUp className="mr-2 h-4 w-4" />Reviews ({product.reviews.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="description" className="mt-6 bg-card p-6 rounded-lg shadow">
          <p className="text-foreground/90 leading-relaxed whitespace-pre-line">{product.description}</p>
          {product.tags && product.tags.length > 0 && (
            <div className="mt-4">
              <h3 className="font-semibold mb-1">Tags:</h3>
              <div className="flex flex-wrap gap-2">
                {product.tags.map(tag => (
                  <span key={tag} className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded-full">{tag}</span>
                ))}
              </div>
            </div>
          )}
        </TabsContent>
        <TabsContent value="reviews" className="mt-6 bg-card p-6 rounded-lg shadow">
          {product.reviews.length > 0 ? (
            <ul className="space-y-6">
              {product.reviews.map(review => (
                <li key={review.id} className="border-b border-border pb-4 last:border-b-0 last:pb-0">
                  <div className="flex justify-between items-center mb-1">
                    <p className="font-semibold text-secondary-foreground">{review.author}</p>
                    <span className="text-xs text-muted-foreground">{new Date(review.date).toLocaleDateString()}</span>
                  </div>
                  <ReviewStars rating={review.rating} size={18} />
                  <p className="mt-2 text-foreground/80">{review.comment}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted-foreground">No reviews yet for this product.</p>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProductDetailsPage;
