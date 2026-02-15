'use client';

import { useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { URLS } from '@/lib/constants/Urls';

export default function OAuthSuccess() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const hasFetched = useRef(false);

  useEffect(() => {
    const finalizeLogin = async () => {
      const token = searchParams.get('token');

      if (!token) {
        router.push('/login?error=OAuth failed');
        return;
      }
      if (hasFetched.current) return;
      hasFetched.current = true;

      try {
        localStorage.setItem('token', token);

        const response = await fetch('http://localhost:8080/user/me', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error('Failed to fetch user profile');

        const result = await response.json();

        if (!result.success) {
          throw new Error(result.message);
        }

        localStorage.setItem('user', JSON.stringify(result.data));


        router.push(URLS.DASHBOARD);
      } catch (error) {
        console.error("Auth Finalization Error:", error);
        router.push('/login?error=Profile fetch failed');
      }
    };

    finalizeLogin();
  }, [searchParams, router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl flex flex-col items-center">
        {/* <Loader2 className="w-12 h-12 animate-spin text-indigo-600 mb-4" /> */}
        <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Syncing Profile</h2>
        <p className="text-gray-500 dark:text-gray-400 text-center">
          We're setting up your game master dashboard...
        </p>
      </div>
    </div>
  );
}