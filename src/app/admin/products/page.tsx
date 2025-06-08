
"use client";

import type { Product } from '@/lib/types';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { PlusCircle, Edit3, Trash2, AlertTriangle, PackageSearch, RefreshCw } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const AdminProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);


  const fetchProducts = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/admin/products');
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to fetch products: ${response.statusText}`);
      }
      const data: Product[] = await response.json();
      setProducts(data);
    } catch (err) {
      console.error(err);
      const errorMessage = (err as Error).message || "An unexpected error occurred.";
      setError(errorMessage);
      toast({ title: "Error Fetching Products", description: errorMessage, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDeleteProduct = async () => {
    if (!productToDelete) return;

    try {
      const response = await fetch(`/api/admin/products/${productToDelete.id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to delete product: ${response.statusText}`);
      }
      toast({ title: "Product Deleted", description: `${productToDelete.name} has been deleted.` });
      setProducts(prev => prev.filter(p => p.id !== productToDelete.id));
    } catch (err) {
      console.error(err);
      const errorMessage = (err as Error).message || "An unexpected error occurred.";
      toast({ title: "Error Deleting Product", description: errorMessage, variant: "destructive" });
    } finally {
        setProductToDelete(null); // Close dialog
    }
  };

  if (isLoading && products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-12rem)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-lg text-muted-foreground">Loading Products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="shadow-lg border-destructive">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive"><AlertTriangle /> Error Loading Products</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-destructive-foreground">{error}</p>
          <Button onClick={fetchProducts} variant="destructive" className="mt-4">
            <RefreshCw className="mr-2 h-4 w-4" /> Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }
  

  return (
    <Card className="shadow-xl">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle className="text-2xl font-headline text-primary">Manage Products</CardTitle>
          <CardDescription>View, add, edit, or delete products from your store.</CardDescription>
        </div>
        <Link href="/admin/products/add" passHref>
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
            <PlusCircle className="mr-2 h-5 w-5" /> Add New Product
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        {products.length === 0 && !isLoading ? (
          <div className="text-center py-12">
            <PackageSearch className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold text-secondary-foreground">No Products Found</h3>
            <p className="text-muted-foreground mb-6">Get started by adding your first product.</p>
            <Link href="/admin/products/add" passHref>
              <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">
                <PlusCircle className="mr-2 h-5 w-5" /> Add Product
              </Button>
            </Link>
          </div>
        ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">Image</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Brand</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Price</TableHead>
                <TableHead className="text-right">Stock</TableHead>
                <TableHead className="w-[150px] text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && products.length === 0 ? (
                Array.from({ length: 5 }).map((_, index) => (
                  <TableRow key={`skeleton-${index}`}>
                    <TableCell><div className="h-12 w-12 bg-muted rounded-md animate-pulse"></div></TableCell>
                    <TableCell><div className="h-4 bg-muted rounded animate-pulse w-3/4"></div></TableCell>
                    <TableCell><div className="h-4 bg-muted rounded animate-pulse w-1/2"></div></TableCell>
                    <TableCell><div className="h-4 bg-muted rounded animate-pulse w-1/2"></div></TableCell>
                    <TableCell className="text-right"><div className="h-4 bg-muted rounded animate-pulse w-1/4 ml-auto"></div></TableCell>
                    <TableCell className="text-right"><div className="h-4 bg-muted rounded animate-pulse w-1/4 ml-auto"></div></TableCell>
                    <TableCell className="text-center">
                      <div className="flex justify-center gap-2">
                        <div className="h-8 w-8 bg-muted rounded animate-pulse"></div>
                        <div className="h-8 w-8 bg-muted rounded animate-pulse"></div>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <Image 
                      src={product.images[0] || 'https://placehold.co/64x64.png'} 
                      alt={product.name} 
                      width={64} 
                      height={64} 
                      className="rounded-md object-cover bg-secondary"
                      data-ai-hint={product.dataAiHint || 'admin product shoe'}
                    />
                  </TableCell>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>{product.brand}</TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell className="text-right">${product.price.toFixed(2)}</TableCell>
                  <TableCell className="text-right">{product.stock}</TableCell>
                  <TableCell className="text-center">
                    <div className="flex justify-center gap-2">
                      <Link href={`/admin/products/edit/${product.id}`} passHref>
                        <Button variant="outline" size="icon" className="text-primary border-primary hover:bg-primary/10">
                          <Edit3 className="h-4 w-4" />
                           <span className="sr-only">Edit {product.name}</span>
                        </Button>
                      </Link>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="icon" className="text-destructive border-destructive hover:bg-destructive/10" onClick={() => setProductToDelete(product)}>
                          <Trash2 className="h-4 w-4" />
                           <span className="sr-only">Delete {product.name}</span>
                        </Button>
                      </AlertDialogTrigger>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        )}
      </CardContent>
       <AlertDialog open={!!productToDelete} onOpenChange={(open) => !open && setProductToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the product
              <strong className="px-1">{productToDelete?.name}</strong>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setProductToDelete(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteProduct}
              className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
            >
              Yes, delete product
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
};

export default AdminProductsPage;
