'use client';

import { useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { URLS } from '@/lib/constants/Urls';
import { fetchCurrentUser } from '@/lib/api/user';

export default function OAuthSuccess() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const hasFetched = useRef(false);

  useEffect(() => {
    const finalizeLogin = async () => {
      const token = searchParams.get('token');

      if (!token) {
        router.push(`${URLS.LOGIN}?error=OAuth failed`);
        return;
      }
      if (hasFetched.current) return;
      hasFetched.current = true;

      try {
        localStorage.setItem('token', token);

        const result = await fetchCurrentUser();

        if (!result.success) {
          throw new Error(result.message);
        }

        localStorage.setItem('user', JSON.stringify(result.data));
        window.dispatchEvent(new Event('user-data-ready'));

        router.push(URLS.DASHBOARD);
      } catch (error) {
        console.error("Auth Finalization Error:", error);
        router.push(`${URLS.LOGIN}?error=Profile fetch failed`);
      }
    };

    finalizeLogin();
  }, [searchParams, router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl flex flex-col items-center gap-4">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
        <h2 className="text-xl font-bold text-gray-800 dark:text-white">
          Finishing sign in...
        </h2>
        <p className="text-gray-500 dark:text-gray-400 text-center text-sm">
          Please wait a moment while we prepare your dashboard.
        </p>
      </div>
    </div>
  );
}