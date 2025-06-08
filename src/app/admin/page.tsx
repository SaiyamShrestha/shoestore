
"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// This page primarily serves as a redirector or a basic welcome.
// The actual auth check and redirect logic is in AdminLayout.
export default function AdminPage() {
  const router = useRouter();

  useEffect(() => {
    // If AdminLayout determines user is authenticated,
    // they might land here. Redirect them to a more specific admin page.
    router.replace('/admin/products');
  }, [router]);

  return (
    <div className="flex flex-col justify-center items-center h-[calc(100vh-10rem)]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
      <p className="text-lg text-muted-foreground">Loading Admin Dashboard...</p>
    </div>
  );
}
