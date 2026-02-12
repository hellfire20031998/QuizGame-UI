'use client';

import { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { Search, User, Calendar, ArrowRight } from 'lucide-react';

// Mock Data
const MOCK_QUIZZES = Array.from({ length: 12 }).map((_, i) => ({
  id: i + 1,
  title: `Quiz Topic ${i + 1}: ${['Java Basics', 'React Hooks', 'History', 'Space'][i % 4]}`,
  description: 'Test your knowledge on this subject with 10 challenging questions.',
  createdBy: `GameMaster_${i + 1}`,
  questionsCount: 10,
  createdAt: '2023-10-15',
  difficulty: ['Easy', 'Medium', 'Hard'][i % 3],
}));

export default function AllQuizzesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Filter Logic
  const filteredQuizzes = MOCK_QUIZZES.filter(q => 
    q.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    q.createdBy.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination Logic
  const totalPages = Math.ceil(filteredQuizzes.length / itemsPerPage);
  const currentQuizzes = filteredQuizzes.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Available Quizzes</h1>
          
          {/* Search Bar */}
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search by title or creator..." 
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:border-gray-700"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentQuizzes.map((quiz) => (
            <div key={quiz.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 dark:border-gray-700 overflow-hidden flex flex-col">
              <div className="p-6 flex-1">
                <div className="flex justify-between items-start mb-2">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    quiz.difficulty === 'Easy' ? 'bg-green-100 text-green-700' : 
                    quiz.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700' : 
                    'bg-red-100 text-red-700'
                  }`}>
                    {quiz.difficulty}
                  </span>
                  <span className="text-xs text-gray-500 flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> {quiz.createdAt}
                  </span>
                </div>
                <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">{quiz.title}</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-4 line-clamp-2">{quiz.description}</p>
                
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 mt-auto">
                  <User className="w-4 h-4" />
                  <span>By {quiz.createdBy}</span>
                </div>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-700/50 px-6 py-4 border-t border-gray-100 dark:border-gray-700">
                <Link 
                  href={`/quizzes/${quiz.id}/play`}
                  className="flex items-center justify-center w-full gap-2 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                >
                  Start Quiz <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination Controls */}
        <div className="flex justify-center mt-10 gap-2">
          <button 
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => prev - 1)}
            className="px-4 py-2 border rounded hover:bg-gray-100 disabled:opacity-50 dark:border-gray-700 dark:text-white"
          >
            Previous
          </button>
          <span className="px-4 py-2 text-gray-600 dark:text-gray-300">
            Page {currentPage} of {totalPages}
          </span>
          <button 
             disabled={currentPage === totalPages}
             onClick={() => setCurrentPage(prev => prev + 1)}
             className="px-4 py-2 border rounded hover:bg-gray-100 disabled:opacity-50 dark:border-gray-700 dark:text-white"
          >
            Next
          </button>
        </div>
      </main>
    </div>
  );
}