
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import type { CartItem } from '@/lib/types';

if (!process.env.STRIPE_SECRET_KEY) {
  console.error("CRITICAL: STRIPE_SECRET_KEY is not set in environment variables.");
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20', // Use the latest API version
});

export async function POST(request: NextRequest) {
  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json({ message: 'Configuration error: Stripe secret key not set on server.' }, { status: 500 });
  }

  try {
    const { cartItems: originalCartItems } = await request.json() as { cartItems: CartItem[] };

    if (!originalCartItems || originalCartItems.length === 0) {
      return NextResponse.json({ message: 'Cart is empty' }, { status: 400 });
    }

    // Filter cart items to ensure they are valid for Stripe (positive price and quantity)
    const validCartItems = originalCartItems.filter(item => item.price > 0 && item.quantity > 0);

    if (validCartItems.length === 0) {
      return NextResponse.json({ message: 'No valid items in cart for checkout (e.g., items with zero price or quantity).' }, { status: 400 });
    }

    const line_items = validCartItems.map((item) => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.name,
          // You can add more product details here, like description or images
          // images: [item.images[0]], // Requires images to be publicly accessible URLs
        },
        unit_amount: Math.round(item.price * 100), // Price in cents
      },
      quantity: item.quantity,
    }));

    // Ensure the base URL is correctly determined for deployment environments
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || request.nextUrl.origin;
    const success_url = `${baseUrl}/order-confirmation`;
    const cancel_url = `${baseUrl}/cart`;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items,
      mode: 'payment',
      success_url,
      cancel_url,
      // automatic_tax: { enabled: true }, // Enable if you use Stripe Tax
    });

    return NextResponse.json({ sessionId: session.id });

  } catch (error) {
    console.error('Error creating Stripe session:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    // Return the error message from Stripe if available, otherwise a generic one.
    return NextResponse.json({ message: 'Failed to create Stripe session on server.', error: errorMessage }, { status: 500 });
  }
}

