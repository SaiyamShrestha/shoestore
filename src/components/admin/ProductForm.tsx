
"use client";

import type { Product } from '@/lib/types';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { useEffect } from 'react';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';

// Schema for form validation
const productFormSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  brand: z.string().min(2, "Brand is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  price: z.coerce.number().min(0.01, "Price must be positive"),
  stock: z.coerce.number().int().min(0, "Stock cannot be negative"),
  category: z.string().min(2, "Category is required"),
  images: z.string().min(1, "At least one image URL is required (comma-separated if multiple)"), // Comma-separated string for simplicity
  sizes: z.string().min(1, "At least one size is required (comma-separated)"), // Comma-separated
  availableColors: z.string().min(1, "At least one color is required (comma-separated)"), // Comma-separated
  tags: z.string().optional(), // Comma-separated
  dataAiHint: z.string().optional(),
});

type ProductFormValues = z.infer<typeof productFormSchema>;

interface ProductFormProps {
  initialData?: Product | null; // Product type for editing, null for creating
  onSubmitForm: (data: Omit<Product, 'id' | 'slug' | 'reviews'>, id?: string) => Promise<void>;
  isSubmitting: boolean;
}

const ProductForm = ({ initialData, onSubmitForm, isSubmitting }: ProductFormProps) => {
  const router = useRouter();
  const { toast } = useToast();

  const { register, handleSubmit, reset, control, formState: { errors } } = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: initialData ? {
      ...initialData,
      price: initialData.price,
      stock: initialData.stock,
      images: initialData.images.join(', '),
      sizes: initialData.sizes.join(', '),
      availableColors: initialData.availableColors.join(', '),
      tags: initialData.tags?.join(', ') || '',
    } : {
      name: '',
      brand: '',
      description: '',
      price: 0,
      stock: 0,
      category: '',
      images: '',
      sizes: '',
      availableColors: '',
      tags: '',
      dataAiHint: '',
    },
  });

  useEffect(() => {
    if (initialData) {
      reset({
        ...initialData,
        price: initialData.price,
        stock: initialData.stock,
        images: initialData.images.join(', '),
        sizes: initialData.sizes.join(', '),
        availableColors: initialData.availableColors.join(', '),
        tags: initialData.tags?.join(', ') || '',
      });
    } else {
      reset({
        name: '', brand: '', description: '', price: 0, stock: 0, category: '',
        images: '', sizes: '', availableColors: '', tags: '', dataAiHint: '',
      });
    }
  }, [initialData, reset]);

  const processSubmit: SubmitHandler<ProductFormValues> = async (data) => {
    const productDataToSubmit = {
      ...data,
      images: data.images.split(',').map(s => s.trim()).filter(s => s),
      sizes: data.sizes.split(',').map(s => s.trim()).filter(s => s),
      availableColors: data.availableColors.split(',').map(s => s.trim()).filter(s => s),
      tags: data.tags ? data.tags.split(',').map(s => s.trim()).filter(s => s) : [],
    };
    
    try {
      await onSubmitForm(productDataToSubmit, initialData?.id);
    } catch (error) {
       toast({
        title: `Error ${initialData ? 'updating' : 'creating'} product`,
        description: (error as Error).message || "An unexpected error occurred.",
        variant: 'destructive',
      });
    }
  };

  return (
    <Card className="shadow-xl">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-2xl font-headline text-primary">
            {initialData ? 'Edit Product' : 'Add New Product'}
          </CardTitle>
          <Button variant="outline" onClick={() => router.push('/admin/products')} size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Products
          </Button>
        </div>
        <CardDescription>
          {initialData ? 'Modify the details of this product.' : 'Fill in the details to create a new product.'}
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(processSubmit)}>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Column 1 */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Product Name</Label>
              <Input id="name" {...register("name")} disabled={isSubmitting} />
              {errors.name && <p className="text-sm text-destructive mt-1">{errors.name.message}</p>}
            </div>
            <div>
              <Label htmlFor="brand">Brand</Label>
              <Input id="brand" {...register("brand")} disabled={isSubmitting} />
              {errors.brand && <p className="text-sm text-destructive mt-1">{errors.brand.message}</p>}
            </div>
            <div>
              <Label htmlFor="category">Category</Label>
              <Input id="category" {...register("category")} disabled={isSubmitting} />
              {errors.category && <p className="text-sm text-destructive mt-1">{errors.category.message}</p>}
            </div>
             <div>
              <Label htmlFor="price">Price</Label>
              <Input id="price" type="number" step="0.01" {...register("price")} disabled={isSubmitting} />
              {errors.price && <p className="text-sm text-destructive mt-1">{errors.price.message}</p>}
            </div>
            <div>
              <Label htmlFor="stock">Stock Quantity</Label>
              <Input id="stock" type="number" {...register("stock")} disabled={isSubmitting} />
              {errors.stock && <p className="text-sm text-destructive mt-1">{errors.stock.message}</p>}
            </div>
          </div>
          
          {/* Column 2 */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" {...register("description")} rows={5} disabled={isSubmitting} />
              {errors.description && <p className="text-sm text-destructive mt-1">{errors.description.message}</p>}
            </div>
            <div>
              <Label htmlFor="images">Image URLs (comma-separated)</Label>
              <Input id="images" {...register("images")} placeholder="e.g., url1.png, url2.jpg" disabled={isSubmitting} />
              {errors.images && <p className="text-sm text-destructive mt-1">{errors.images.message}</p>}
            </div>
            <div>
              <Label htmlFor="sizes">Sizes (comma-separated)</Label>
              <Input id="sizes" {...register("sizes")} placeholder="e.g., 7, 8, 9.5, 10" disabled={isSubmitting} />
              {errors.sizes && <p className="text-sm text-destructive mt-1">{errors.sizes.message}</p>}
            </div>
            <div>
              <Label htmlFor="availableColors">Colors (comma-separated)</Label>
              <Input id="availableColors" {...register("availableColors")} placeholder="e.g., Black, White, Navy Blue" disabled={isSubmitting} />
              {errors.availableColors && <p className="text-sm text-destructive mt-1">{errors.availableColors.message}</p>}
            </div>
            <div>
              <Label htmlFor="tags">Tags (comma-separated, optional)</Label>
              <Input id="tags" {...register("tags")} placeholder="e.g., casual, running, comfort" disabled={isSubmitting} />
            </div>
            <div>
              <Label htmlFor="dataAiHint">AI Image Hint (optional, 1-2 words)</Label>
              <Input id="dataAiHint" {...register("dataAiHint")} placeholder="e.g., sneaker shoe" disabled={isSubmitting} />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground" disabled={isSubmitting}>
            {isSubmitting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            {isSubmitting ? 'Saving...' : (initialData ? 'Save Changes' : 'Create Product')}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default ProductForm;
