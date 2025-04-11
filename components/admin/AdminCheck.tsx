'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@clerk/nextjs';

export default function AdminCheck({ children }: { children: React.ReactNode }) {
  const { userId, isLoaded } = useAuth();
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    async function checkAdminAccess() {
      if (!isLoaded || !userId) {
        return;
      }

      try {
        const response = await fetch('/api/auth/check-admin');
        
        if (response.ok) {
          setIsAdmin(true);
        } else {
          console.error('User is not an admin');
          router.push('/');
        }
      } catch (error) {
        console.error('Error checking admin access:', error);
        router.push('/');
      } finally {
        setIsChecking(false);
      }
    }

    checkAdminAccess();
  }, [userId, isLoaded, router]);

  if (isChecking) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!isAdmin) {
    return null;
  }

  return <>{children}</>;
} 