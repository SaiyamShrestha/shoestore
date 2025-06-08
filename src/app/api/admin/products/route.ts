
import { NextRequest, NextResponse } from 'next/server';
import { products as productsData } from '@/lib/mock-data'; // Import as productsData to avoid conflict
import type { Product } from '@/lib/types';

// GET all products
export async function GET() {
  try {
    return NextResponse.json(productsData, { status: 200 });
  } catch (error) {
    console.error('Failed to fetch products:', error);
    return NextResponse.json({ message: 'Failed to fetch products' }, { status: 500 });
  }
}

// POST a new product
export async function POST(request: NextRequest) {
  try {
    const newProductData = await request.json() as Omit<Product, 'id' | 'slug' | 'reviews'>; // Assuming reviews and slug are auto-generated or optional initially

    if (!newProductData.name || !newProductData.price || !newProductData.category || !newProductData.brand) {
      return NextResponse.json({ message: 'Missing required product fields' }, { status: 400 });
    }
    
    const newId = (Math.max(0, ...productsData.map(p => parseInt(p.id))) + 1).toString();
    const newSlug = newProductData.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');

    const newProduct: Product = {
      ...newProductData,
      id: newId,
      slug: `${newSlug}-${newId}`, // Ensure unique slug
      reviews: [], // Initialize with empty reviews
      images: newProductData.images || ['https://placehold.co/800x600.png'],
      stock: newProductData.stock || 0,
      tags: newProductData.tags || [],
      availableColors: newProductData.availableColors || [],
      sizes: newProductData.sizes || [],
    };

    productsData.push(newProduct); // Mutate the in-memory array
    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    console.error('Failed to create product:', error);
    return NextResponse.json({ message: 'Failed to create product', error: (error as Error).message }, { status: 500 });
  }
}
