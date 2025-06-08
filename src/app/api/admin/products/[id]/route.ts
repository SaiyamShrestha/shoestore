
import { NextRequest, NextResponse } from 'next/server';
import { products as productsData } from '@/lib/mock-data'; // Import as productsData
import type { Product } from '@/lib/types';

interface RouteParams {
  params: {
    id: string;
  };
}

// GET a single product by ID
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = params;
    const product = productsData.find(p => p.id === id);

    if (!product) {
      return NextResponse.json({ message: 'Product not found' }, { status: 404 });
    }
    return NextResponse.json(product, { status: 200 });
  } catch (error) {
    console.error(`Failed to fetch product ${params.id}:`, error);
    return NextResponse.json({ message: 'Failed to fetch product' }, { status: 500 });
  }
}

// PUT (update) a product by ID
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = params;
    const updates = await request.json() as Partial<Omit<Product, 'id'>>;
    
    const productIndex = productsData.findIndex(p => p.id === id);

    if (productIndex === -1) {
      return NextResponse.json({ message: 'Product not found' }, { status: 404 });
    }

    // Update slug if name changes
    if (updates.name && updates.name !== productsData[productIndex].name) {
        updates.slug = `${updates.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '')}-${id}`;
    }

    const updatedProduct = { ...productsData[productIndex], ...updates };
    productsData[productIndex] = updatedProduct; // Mutate the in-memory array

    return NextResponse.json(updatedProduct, { status: 200 });
  } catch (error) {
    console.error(`Failed to update product ${params.id}:`, error);
    return NextResponse.json({ message: 'Failed to update product', error: (error as Error).message }, { status: 500 });
  }
}

// DELETE a product by ID
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = params;
    const productIndex = productsData.findIndex(p => p.id === id);

    if (productIndex === -1) {
      return NextResponse.json({ message: 'Product not found' }, { status: 404 });
    }

    productsData.splice(productIndex, 1); // Mutate the in-memory array
    return NextResponse.json({ message: 'Product deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error(`Failed to delete product ${params.id}:`, error);
    return NextResponse.json({ message: 'Failed to delete product' }, { status: 500 });
  }
}
