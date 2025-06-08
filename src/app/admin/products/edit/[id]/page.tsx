
"use client";

import ProductForm from '@/components/admin/ProductForm';
import type { Product } from '@/lib/types';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { Loader2, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface EditProductPageProps {
  params: {
    id: string;
  };
}

const EditProductPage = ({ params }: EditProductPageProps) => {
  const { id } = params;
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const fetchProduct = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/admin/products/${id}`);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || `Failed to fetch product: ${response.statusText}`);
        }
        const data: Product = await response.json();
        setProduct(data);
      } catch (err) {
        console.error(err);
        const errorMessage = (err as Error).message || "An unexpected error occurred.";
        setError(errorMessage);
        toast({ title: "Error Fetching Product", description: errorMessage, variant: "destructive" });
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id, toast]);

  const handleEditProduct = async (data: Omit<Product, 'id' | 'slug' | 'reviews'>, productId?: string) => {
    if (!productId) return;
    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/admin/products/${productId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
         const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update product');
      }
      
      const updatedProduct = await response.json();
      toast({
        title: 'Product Updated',
        description: `${updatedProduct.name} has been successfully updated.`,
      });
      router.push('/admin/products');
    } catch (error) {
      console.error('Failed to update product:', error);
       toast({
        title: 'Error Updating Product',
        description: (error as Error).message || "An unexpected error occurred.",
        variant: 'destructive',
      });
      // throw error; // Propagate error if ProductForm needs to know
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-12rem)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-lg text-muted-foreground">Loading Product Details...</p>
      </div>
    );
  }

  if (error) {
     return (
      <Card className="shadow-lg border-destructive">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive"><AlertTriangle /> Error Loading Product</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{error}</p>
        </CardContent>
      </Card>
    );
  }

  if (!product) {
    return (
        <Card className="shadow-lg border-destructive">
            <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive"><AlertTriangle /> Product Not Found</CardTitle>
            </CardHeader>
            <CardContent>
            <p>The product you are trying to edit could not be found.</p>
            </CardContent>
        </Card>
    );
  }

  return (
    <ProductForm initialData={product} onSubmitForm={handleEditProduct} isSubmitting={isSubmitting} />
  );
};

export default EditProductPage;
