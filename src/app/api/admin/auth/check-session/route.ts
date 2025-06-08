
import { NextRequest, NextResponse } from 'next/server';

// This route is protected by the main middleware in `src/middleware.ts`.
// If the middleware allows the request to pass, it means the session is valid.
export async function GET(request: NextRequest) {
  // If the request reaches here, the admin session cookie was valid (checked by middleware)
  return NextResponse.json({ authenticated: true, message: "Session is active." }, { status: 200 });
}
