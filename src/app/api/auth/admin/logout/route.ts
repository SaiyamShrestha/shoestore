
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const ADMIN_SESSION_COOKIE_NAME = 'admin-session';

export async function POST() {
  try {
    // Set the cookie with a past expiry date to remove it
    cookies().set(ADMIN_SESSION_COOKIE_NAME, '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: -1, // Or expires: new Date(0)
      sameSite: 'lax', // Recommended for security
    });
    return NextResponse.json({ message: 'Logout successful' }, { status: 200 });
  } catch (error) {
    console.error('Logout error:', error);
    // It's unlikely cookies().set would throw here unless headers are already sent,
    // but good practice to have error handling.
    return NextResponse.json({ message: 'An error occurred during logout.' }, { status: 500 });
  }
}
