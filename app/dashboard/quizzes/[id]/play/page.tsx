'use client';

import { use, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Clock, CheckCircle } from 'lucide-react';
import { URLS } from '@/lib/constants/Urls';
import { fetchQuizById, QuizDetail } from '@/lib/api/quiz';
import { submitQuiz } from '@/lib/api/submission';

export default function PlayQuizPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params); // ✔ correctly unwrap params
  const router = useRouter();

  const [quiz, setQuiz] = useState<QuizDetail | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number | null>>({});
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [totalTime, setTotalTime] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isOwner, setIsOwner] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  // ---------------------------------------------------------
  // Load Quiz
  // ---------------------------------------------------------
  useEffect(() => {
    const loadQuiz = async () => {
      try {
        const result = await fetchQuizById(id);

        if (!result.success || !result.data) {
          setError('Quiz not found.');
          return;
        }

        const loadedQuiz = result.data;
        setQuiz(loadedQuiz);

        const configuredTime =
          loadedQuiz.totalTimeInSeconds && loadedQuiz.totalTimeInSeconds > 0
            ? loadedQuiz.totalTimeInSeconds
            : 600;

        setTotalTime(configuredTime);
        setTimeLeft(configuredTime);

        // Check if current user is creator
        try {
          const storedUser = localStorage.getItem('user');
          if (storedUser) {
            const user = JSON.parse(storedUser);

            if (
              (loadedQuiz.createdBy?.email &&
                loadedQuiz.createdBy.email === user.email) ||
              (loadedQuiz.createdBy?.username &&
                loadedQuiz.createdBy.username === user.username)
            ) {
              setIsOwner(true);
            }
          }
        } catch {}
      } catch (e) {
        console.error('Failed to load quiz', e);
        setError('Failed to load quiz. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    loadQuiz();
  }, [id]); // ✔ dependency fixed

  // ---------------------------------------------------------
  // Timer Handling
  // ---------------------------------------------------------
  useEffect(() => {
    if (timeLeft === null || totalTime === null || isOwner || hasSubmitted) {
      return;
    }

    if (timeLeft <= 0) {
      handleSubmit();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev !== null ? prev - 1 : prev));
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, totalTime, isOwner, hasSubmitted]);

  // ---------------------------------------------------------
  // Handlers
  // ---------------------------------------------------------

  const handleOptionSelect = (questionId: number, optionId: number) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: optionId,
    }));
  };

  const handleNext = () => {
    if (!quiz) return;
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handleSubmit = async () => {
    if (hasSubmitted) return;

    setHasSubmitted(true);

    if (!quiz || totalTime === null || timeLeft === null) {
      router.push(URLS.QUIZ_RESULT(id));
      return;
    }

    const timeUsed = Math.max(totalTime - Math.max(timeLeft, 0), 0);

    try {
      await submitQuiz({
        quizId: quiz.id,
        totalTimeInSeconds: timeUsed,
        answers: quiz.questions
          .map((q) => {
            const selectedOptionId = answers[q.id];
            if (selectedOptionId == null) return null;

            return {
              questionId: q.id,
              selectedOptionId,
            };
          })
          .filter(Boolean) as { questionId: number; selectedOptionId: number }[],
      });
    } catch (e) {
      console.error('Failed to submit quiz', e);
    }

    router.push(URLS.QUIZ_RESULT(id));
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const currentQuestion = useMemo(() => {
    if (!quiz) return null;
    return quiz.questions[currentQuestionIndex] ?? null;
  }, [quiz, currentQuestionIndex]);

  // ---------------------------------------------------------
  // UI
  // ---------------------------------------------------------

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading quiz...
      </div>
    );
  }

  if (error || !quiz) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        {error || 'Quiz could not be loaded.'}
      </div>
    );
  }

  if (isOwner) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        You created this quiz and cannot play it.
      </div>
    );
  }

  if (!currentQuestion) return null;

  const progress =
    ((currentQuestionIndex + 1) / quiz.questions.length) * 100;

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-3xl bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-indigo-600 px-6 py-4 flex justify-between items-center text-white">
          <h2 className="text-xl font-bold">{quiz.title}</h2>
          <div className="flex items-center gap-2 font-mono text-lg bg-indigo-700 px-3 py-1 rounded-lg">
            <Clock className="w-5 h-5" />
            {timeLeft !== null ? formatTime(timeLeft) : '--:--'}
          </div>
        </div>

        <div className="w-full bg-gray-200 h-2">
          <div
            className="bg-green-500 h-2"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="p-8">
          <div className="mb-6">
            <span className="text-sm font-bold text-gray-400 uppercase">
              Question {currentQuestionIndex + 1} of {quiz.questions.length}
            </span>
            <h3 className="text-2xl font-bold mt-2 text-gray-900 dark:text-white">
              {currentQuestion.text}
            </h3>
          </div>

          <div className="space-y-3">
            {currentQuestion.options.map((option) => (
              <button
                key={option.id}
                onClick={() => handleOptionSelect(currentQuestion.id, option.id)}
                className={`w-full text-left px-6 py-4 rounded-xl border-2 transition-all flex items-center justify-between ${
                  answers[currentQuestion.id] === option.id
                    ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/30'
                    : 'border-gray-200 dark:border-gray-700'
                }`}
              >
                <span className="text-lg">{option.text}</span>
                {answers[currentQuestion.id] === option.id && (
                  <CheckCircle className="w-5 h-5 text-indigo-600" />
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-700/50 px-8 py-4 flex justify-between items-center">
          <button
            disabled={currentQuestionIndex === 0}
            onClick={() =>
              setCurrentQuestionIndex((prev) => Math.max(prev - 1, 0))
            }
            className="text-gray-500 hover:text-gray-800 disabled:opacity-50"
          >
            Previous
          </button>

          {currentQuestionIndex === quiz.questions.length - 1 ? (
            <button
              onClick={handleSubmit}
              className="bg-green-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-green-700"
            >
              Submit Quiz
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-indigo-700"
            >
              Next Question
            </button>
          )}
        </div>
      </div>
    </div>
  );
}