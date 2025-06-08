
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const ADMIN_SESSION_COOKIE_NAME = 'admin-session';

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    const adminUsername = process.env.ADMIN_USERNAME;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminUsername || !adminPassword) {
      console.error('Admin credentials are not set in environment variables.');
      return NextResponse.json({ message: 'Server configuration error.' }, { status: 500 });
    }

    if (username === adminUsername && password === adminPassword) {
      // In a real app, use a secure token (e.g., JWT)
      cookies().set(ADMIN_SESSION_COOKIE_NAME, 'true', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: 60 * 60 * 24, // 1 day
      });
      return NextResponse.json({ message: 'Login successful' }, { status: 200 });
    } else {
      return NextResponse.json({ message: 'Invalid username or password' }, { status: 401 });
    }
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ message: 'An error occurred during login.' }, { status: 500 });
  }
}

export async function GET() {
    return NextResponse.json({ message: "Use POST to login." }, { status: 405 });
}
