'use client';

import Navbar from '@/components/Navbar';
import { Trophy, Medal, User } from 'lucide-react';

const MOCK_LEADERBOARD = [
  { rank: 1, name: "Alice", score: 90, time: "2:30" },
  { rank: 2, name: "Bob", score: 85, time: "3:10" },
  { rank: 3, name: "Charlie", score: 80, time: "2:45" },
  { rank: 4, name: "You", score: 75, time: "3:00" }, // Current User
  { rank: 5, name: "Dave", score: 70, time: "4:00" },
];

export default function ResultsPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      
      <main className="max-w-4xl mx-auto px-4 py-10">
        
        {/* Your Result Banner */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white text-center shadow-xl mb-10">
          <Trophy className="w-16 h-16 mx-auto mb-4 text-yellow-300" />
          <h1 className="text-4xl font-extrabold mb-2">Quiz Completed!</h1>
          <p className="text-indigo-100 text-lg mb-6">You scored <span className="font-bold text-white text-2xl">75/100</span></p>
          
          <div className="flex justify-center gap-4">
             <button className="bg-white/20 backdrop-blur-sm border border-white/30 px-6 py-2 rounded-full hover:bg-white/30 transition">
                Review Answers
             </button>
             <button className="bg-white text-indigo-600 font-bold px-6 py-2 rounded-full hover:bg-gray-100 transition shadow-lg">
                Play Another Quiz
             </button>
          </div>
        </div>

        {/* Leaderboard Table */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Medal className="w-5 h-5 text-indigo-500" /> Leaderboard
            </h2>
            <span className="text-sm text-gray-500">245 Participants</span>
          </div>

          <table className="w-full text-left">
            <thead className="bg-gray-50 dark:bg-gray-700/50 text-gray-500 text-sm uppercase">
              <tr>
                <th className="px-6 py-3">Rank</th>
                <th className="px-6 py-3">Player</th>
                <th className="px-6 py-3">Time</th>
                <th className="px-6 py-3 text-right">Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {MOCK_LEADERBOARD.map((user) => (
                <tr key={user.rank} className={`hover:bg-gray-50 dark:hover:bg-gray-700/30 ${user.name === 'You' ? 'bg-indigo-50 dark:bg-indigo-900/10' : ''}`}>
                  <td className="px-6 py-4 font-medium">
                    {user.rank === 1 ? '🥇' : user.rank === 2 ? '🥈' : user.rank === 3 ? '🥉' : `#${user.rank}`}
                  </td>
                  <td className="px-6 py-4 flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-gray-600" />
                    </div>
                    <span className={`font-medium ${user.name === 'You' ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-900 dark:text-white'}`}>
                        {user.name}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-500">{user.time}</td>
                  <td className="px-6 py-4 text-right font-bold text-gray-900 dark:text-white">{user.score} pts</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}