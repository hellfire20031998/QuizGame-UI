import Link from 'next/link';
import { Brain, PlusCircle, LogOut } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2">
              <Brain className="w-8 h-8 text-indigo-600" />
              <span className="text-xl font-bold text-gray-900 dark:text-white">QuizApp</span>
            </Link>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link href="/quizzes" className="text-gray-900 dark:text-gray-300 hover:text-indigo-600 px-3 py-2 text-sm font-medium">
                Browse Quizzes
              </Link>
              <Link href="/create-quiz" className="text-gray-900 dark:text-gray-300 hover:text-indigo-600 px-3 py-2 text-sm font-medium">
                Create Quiz
              </Link>
            </div>
          </div>
          <div className="flex items-center">
             <button className="p-2 text-gray-400 hover:text-gray-500">
                <LogOut className="w-5 h-5" />
             </button>
          </div>
        </div>
      </div>
    </nav>
  );
}