'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Trophy } from 'lucide-react';
import { URLS } from '@/lib/constants/Urls';

interface DashboardUser {
  username: string;
  role?: string;
}

export default function DashboardPage() {
  const [user, setUser] = useState<DashboardUser | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        setUser(null);
      }
    }
  }, []);

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold">
          Welcome back{user?.username ? `, ${user.username}!` : '!'}
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard title="Overall Score" value="1,240" color="bg-blue-500" />
        <StatCard title="Quizzes Taken" value="8" color="bg-purple-500" />
        <StatCard title="Wins" value="3" color="bg-emerald-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="text-lg font-bold mb-4">Recent Quizzes</h3>
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
                    <Trophy size={18} />
                  </div>
                  <p className="font-semibold">History 101</p>
                </div>
                <Link href={URLS.PLAY_QUIZ(i)} className="text-sm font-bold text-indigo-600">
                  Play Now →
                </Link>
              </div>
            ))}
          </div>
        </div>

        {user?.role === 'GAME_MASTER' && (
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-bold mb-4">Your Creations</h3>
            <div className="flex flex-col items-center justify-center h-40 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg">
              <p className="text-gray-500 text-sm mb-4">You haven't created any quizzes yet.</p>
              <Link href={URLS.CREATE_QUIZ} className="text-indigo-600 text-sm font-semibold hover:underline">
                Start Creating
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ title, value, color }: { title: string; value: string; color: string }) {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
      <p className="text-sm text-gray-500 font-medium mb-1">{title}</p>
      <div className="flex items-end justify-between">
        <h4 className="text-2xl font-bold">{value}</h4>
        <div className={`w-2 h-8 rounded-full ${color}`}></div>
      </div>
    </div>
  );
}