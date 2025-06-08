
"use client";

import ProductForm from '@/components/admin/ProductForm';
import type { Product } from '@/lib/types';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

const AddProductPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleAddProduct = async (data: Omit<Product, 'id' | 'slug' | 'reviews'>) => {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create product');
      }
      
      const newProduct = await response.json();
      toast({
        title: 'Product Created',
        description: `${newProduct.name} has been successfully added.`,
      });
      router.push('/admin/products');
    } catch (error) {
      console.error('Failed to create product:', error);
      toast({
        title: 'Error Creating Product',
        description: (error as Error).message || "An unexpected error occurred.",
        variant: 'destructive',
      });
      // Rethrow to let ProductForm know submission failed (optional)
      // throw error; 
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ProductForm onSubmitForm={handleAddProduct} isSubmitting={isSubmitting} />
  );
};

export default AddProductPage;
