'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Loader2, Clock, User, FileText } from 'lucide-react';
import { fetchQuizById, QuizDetail } from '@/lib/api/quiz';

export default function QuizDetailsPage() {
  const params = useParams<{ id: string }>();
  const [quiz, setQuiz] = useState<QuizDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const result = await fetchQuizById(params.id);
        if (!result.success || !result.data) {
          setError('Quiz not found.');
          return;
        }
        setQuiz(result.data);
      } catch (e) {
        console.error('Failed to load quiz', e);
        setError('Failed to load quiz. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, [params.id]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full py-10">
        <Loader2 className="w-6 h-6 text-indigo-600 animate-spin" />
      </div>
    );
  }

  if (error || !quiz) {
    return (
      <div className="flex items-center justify-center h-full py-10">
        <p className="text-sm text-red-600 dark:text-red-400">{error ?? 'Quiz not found.'}</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 space-y-4">
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {quiz.title}
          </h1>
          <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300">
              <Clock className="w-4 h-4" />
              {quiz.totalTimeInSeconds} sec
            </span>
            {quiz.createdBy && (
              <span className="inline-flex items-center gap-1">
                <User className="w-4 h-4" />
                {quiz.createdBy.username ?? quiz.createdBy.email ?? 'Unknown'}
              </span>
            )}
          </div>
        </div>
        {quiz.description && (
          <p className="text-gray-600 dark:text-gray-300 text-sm">
            {quiz.description}
          </p>
        )}
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <FileText className="w-5 h-5 text-indigo-600" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Questions ({quiz.questions.length})
          </h2>
        </div>
        <div className="space-y-4">
          {quiz.questions.map((q, index) => (
            <div
              key={q.id}
              className="border border-gray-100 dark:border-gray-700 rounded-lg p-4 space-y-3"
            >
              <p className="font-medium text-gray-900 dark:text-white">
                {index + 1}. {q.text}
              </p>
              <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
                {q.options.map((opt) => (
                  <li key={opt.id} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                    <span>{opt.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

