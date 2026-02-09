import Link from 'next/link';
import { ArrowRight, CheckCircle, Shield, Brain } from 'lucide-react'; // Optional icons

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-gray-100 font-sans selection:bg-indigo-500 selection:text-white">
      
      {/* --- Navigation Bar --- */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-2">
          <Brain className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
          <span className="text-2xl font-bold tracking-tight text-indigo-700 dark:text-indigo-300">
            QuizApp
          </span>
        </div>
        
        <div className="flex items-center gap-4">
          <Link 
            href="/login" 
            className="px-5 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
          >
            Login
          </Link>
          <Link 
            href="/signup" 
            className="px-5 py-2.5 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 shadow-md hover:shadow-lg transition-all transform active:scale-95"
          >
            Sign Up
          </Link>
        </div>
      </nav>

      {/* --- Hero Section --- */}
      <main className="max-w-7xl mx-auto px-6 py-16 lg:py-24 flex flex-col items-center text-center">
        
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-sm font-semibold mb-6">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
          </span>
          Full Stack Quiz Platform
        </div>

        {/* Main Headline */}
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6 max-w-4xl leading-tight">
          Master Your Knowledge or <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
            Create the Challenge.
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
          Join <strong>QuizApp</strong> to test your skills across various topics, or become a <strong>GameMaster</strong> to craft quizzes and challenge the community.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
          <Link 
            href="/signup" 
            className="inline-flex items-center justify-center gap-2 px-8 py-4 text-lg font-bold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 shadow-lg hover:shadow-indigo-500/30 transition-all transform hover:-translate-y-1"
          >
            Get Started
            <ArrowRight className="w-5 h-5" />
          </Link>
          <Link 
            href="/login" 
            className="inline-flex items-center justify-center gap-2 px-8 py-4 text-lg font-bold text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 shadow-sm transition-all"
          >
            I already have an account
          </Link>
        </div>

        {/* --- Feature Roles Grid --- */}
        <div className="grid md:grid-cols-2 gap-8 mt-20 w-full max-w-4xl text-left">
          
          {/* Player Card */}
          <div className="p-8 rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-xl shadow-gray-200/50 dark:shadow-none hover:border-indigo-100 dark:hover:border-indigo-900 transition-colors">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mb-6 text-green-600 dark:text-green-400">
              <CheckCircle className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-3">For Players</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              Dive into a library of quizzes. Track your progress on the leaderboard and earn badges for your achievements.
            </p>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
              <li className="flex gap-2"><span className="text-green-500">✓</span> Take unlimited quizzes</li>
              <li className="flex gap-2"><span className="text-green-500">✓</span> View instant results</li>
              <li className="flex gap-2"><span className="text-green-500">✓</span> Compete on Leaderboards</li>
            </ul>
          </div>

          {/* GameMaster Card */}
          <div className="p-8 rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-xl shadow-gray-200/50 dark:shadow-none hover:border-purple-100 dark:hover:border-purple-900 transition-colors">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mb-6 text-purple-600 dark:text-purple-400">
              <Shield className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-3">For GameMasters</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              Take control of the game. Create complex questions, manage quiz categories, and analyze player statistics.
            </p>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
              <li className="flex gap-2"><span className="text-purple-500">✓</span> Create & Edit Quizzes</li>
              <li className="flex gap-2"><span className="text-purple-500">✓</span> Manage Categories</li>
              <li className="flex gap-2"><span className="text-purple-500">✓</span> View Admin Analytics</li>
            </ul>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 text-center text-gray-400 text-sm">
        © {new Date().getFullYear()} QuizApp. All rights reserved.
      </footer>
    </div>
  );
}