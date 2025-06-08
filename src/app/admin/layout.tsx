
"use client";
import React, { useEffect, useState, type ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Home, Package, LogOut } from 'lucide-react'; // Added icons

const ADMIN_SESSION_COOKIE_NAME = 'admin-session';

// Helper function to clear a cookie by name
const clearCookie = (name: string) => {
    document.cookie = name + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT; SameSite=Lax;';
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isVerified, setIsVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const verifySession = async () => {
      setIsLoading(true);
      // Allow access to login page regardless of session status initially
      if (pathname === '/admin/login') {
        try {
          // Check if already logged in to redirect away from login page
          const res = await fetch('/api/admin/auth/check-session');
          if (res.ok) {
            setIsVerified(true);
            router.replace('/admin/products');
            return; // Early return to avoid further checks
          } else {
             setIsVerified(false); // Not logged in, so allow to stay on login page
          }
        } catch (error) {
          console.error("Error checking session on login page:", error);
          setIsVerified(false); // Error, assume not logged in
        }
      } else {
        // For all other admin pages, session must be valid
        try {
          const res = await fetch('/api/admin/auth/check-session');
          if (!res.ok) {
            if (res.status === 401) { // Explicitly check for 401
              router.replace('/admin/login');
            }
            setIsVerified(false);
          } else {
            setIsVerified(true);
          }
        } catch (error) {
          console.error("Error checking session:", error);
          router.replace('/admin/login');
          setIsVerified(false);
        }
      }
      setIsLoading(false);
    };

    verifySession();
  }, [pathname, router]);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/admin/logout', { method: 'POST' });
    } catch (error) {
      console.error("Logout API call failed:", error);
    }
    // Clear the cookie client-side as a fallback, though HttpOnly is preferred
    clearCookie(ADMIN_SESSION_COOKIE_NAME); 
    setIsVerified(false); // Update state
    router.push('/admin/login'); // Redirect to login
  };

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-background text-foreground">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
        <p className="text-lg">Loading Admin Area...</p>
      </div>
    );
  }

  // If not verified and not on login page, redirect (or show minimal content until redirect happens)
  if (!isVerified && pathname !== '/admin/login') {
     return (
      <div className="flex flex-col justify-center items-center h-screen bg-background text-foreground">
        <p className="text-lg">Redirecting to login...</p>
      </div>
    );
  }
  
  // If verified and on login page (e.g. navigating back), redirect to dashboard
  if (isVerified && pathname === '/admin/login') {
    // This state should ideally be caught by the useEffect redirect, but as a safeguard:
    router.replace('/admin/products');
    return (
        <div className="flex flex-col justify-center items-center h-screen bg-background text-foreground">
            <p className="text-lg">Redirecting to dashboard...</p>
        </div>
    );
  }


  return (
    <div className="min-h-screen bg-muted/30 text-foreground flex flex-col">
      {pathname !== '/admin/login' && isVerified && (
        <header className="bg-card border-b border-border shadow-sm sticky top-0 z-40">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <Link href="/admin/products" className="flex items-center gap-2 text-xl font-bold text-primary hover:text-primary/90 transition-colors">
              <Home className="h-6 w-6" />
              <span>Sole Mate Admin</span>
            </Link>
            <nav className="flex items-center gap-2 sm:gap-4">
              <Link href="/admin/products" passHref>
                <Button variant={pathname.startsWith('/admin/products') ? "secondary" : "ghost"} className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Products
                </Button>
              </Link>
              {/* Add more admin nav links here as needed */}
              <Button variant="outline" onClick={handleLogout} className="flex items-center gap-2">
                <LogOut className="h-5 w-5" />
                Logout
              </Button>
            </nav>
          </div>
        </header>
      )}
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Render children only if verified or on login page (and not loading) */}
        { (isVerified || pathname === '/admin/login') ? children : null }
      </main>
      {pathname !== '/admin/login' && isVerified && (
         <footer className="bg-card border-t border-border py-4 text-center text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Sole Mate Admin Panel
        </footer>
      )}
    </div>
  );
}
