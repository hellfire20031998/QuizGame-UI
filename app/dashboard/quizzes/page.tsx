'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, User, Calendar, ArrowRight, Loader2 } from 'lucide-react';

export default function AllQuizzesPage() {
  const [quizzes, setQuizzes] = useState([]);
  const [activeTab, setActiveTab] = useState('all'); 
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [userRole, setUserRole] = useState(null); 
  const itemsPerPage = 6;

  useEffect(() => {
    try {
      const userDataString = localStorage.getItem('user'); 
      if (userDataString) {
        const userData = JSON.parse(userDataString);
        setUserRole(userData.role); 
      }
    } catch (error) {
      console.error("Error reading user data from localStorage:", error);
    }
  }, []);

  useEffect(() => {
    const fetchQuizzes = async () => {
      setIsLoading(true);
      setCurrentPage(1);
      
      try {
        const endpoint = activeTab === 'all' 
          ? 'http://localhost:8080/quiz/get-all' 
          : 'http://localhost:8080/quiz/get-all-my';

        const token = localStorage.getItem('token');
        const response = await fetch(endpoint, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        const result = await response.json();

        if (result.success && result.data && result.data.content) {
          setQuizzes(result.data.content);
        } else {
          console.error("Failed to fetch quizzes:", result.message);
          setQuizzes([]);
        }
      } catch (error) {
        console.error("Error fetching quizzes:", error);
        setQuizzes([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuizzes();
  }, [activeTab]);

  const filteredQuizzes = quizzes.filter(q => {
    const titleMatch = q.title?.toLowerCase().includes(searchTerm.toLowerCase());
    const creatorMatch = q.createdBy?.username?.toLowerCase().includes(searchTerm.toLowerCase());
    return titleMatch || creatorMatch;
  });

  const totalPages = Math.max(1, Math.ceil(filteredQuizzes.length / itemsPerPage));
  const currentQuizzes = filteredQuizzes.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <main className="max-w-7xl mx-auto px-4 py-8">
        
        {/* Header & Search */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Quizzes</h1>
          
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search by title or creator..." 
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1); // Reset pagination on search
              }}
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 dark:border-gray-700 mb-8">
          <button
            onClick={() => setActiveTab('all')}
            className={`py-3 px-6 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'all'
                ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            All Quizzes
          </button>
          
          {/* Conditionally render "My Quizzes" tab based on userRole */}
          {userRole === 'GAME_MASTER' && (
            <button
              onClick={() => setActiveTab('my')}
              className={`py-3 px-6 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'my'
                  ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              My Quizzes
            </button>
          )}
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mb-4" />
            <p className="text-gray-500 dark:text-gray-400">Loading quizzes...</p>
          </div>
        ) : filteredQuizzes.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
            <p className="text-gray-500 dark:text-gray-400">No quizzes found matching your criteria.</p>
          </div>
        ) : (
          <>
            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentQuizzes.map((quiz) => (
                <div key={quiz.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 dark:border-gray-700 overflow-hidden flex flex-col">
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-2">
                      <span className="bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300 px-2 py-1 text-xs rounded-full">
                        {quiz.questions?.length || 0} Questions
                      </span>
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> {formatDate(quiz.createdAt)}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white line-clamp-1" title={quiz.title}>
                      {quiz.title}
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                      {quiz.description || "No description provided."}
                    </p>
                    
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 mt-auto">
                      <User className="w-4 h-4" />
                      <span className="truncate">By {quiz.createdBy?.username || 'Unknown'}</span>
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
            {totalPages > 1 && (
              <div className="flex justify-center mt-10 gap-2">
                <button 
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => prev - 1)}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-100 disabled:opacity-50 dark:border-gray-700 dark:text-white dark:hover:bg-gray-800 transition-colors"
                >
                  Previous
                </button>
                <span className="px-4 py-2 text-gray-600 dark:text-gray-300 font-medium">
                  Page {currentPage} of {totalPages}
                </span>
                <button 
                   disabled={currentPage === totalPages}
                   onClick={() => setCurrentPage(prev => prev + 1)}
                   className="px-4 py-2 border rounded-lg hover:bg-gray-100 disabled:opacity-50 dark:border-gray-700 dark:text-white dark:hover:bg-gray-800 transition-colors"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}