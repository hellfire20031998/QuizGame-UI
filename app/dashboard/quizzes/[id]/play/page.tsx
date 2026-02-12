'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Clock, CheckCircle } from 'lucide-react';

const MOCK_QUESTIONS = [
  { id: 1, text: "What is the capital of France?", options: ["Berlin", "Madrid", "Paris", "Rome"] },
  { id: 2, text: "Which language runs in a web browser?", options: ["Java", "C", "Python", "JavaScript"] },
  { id: 3, text: "What does CSS stand for?", options: ["Cascading Style Sheets", "Creative Style System", "Computer Style Sheets", "Colorful Style Sheets"] },
];

export default function PlayQuizPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds

  // Timer Logic
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleOptionSelect = (option: string) => {
    setAnswers({ ...answers, [currentQuestionIndex]: option });
  };

  const handleNext = () => {
    if (currentQuestionIndex < MOCK_QUESTIONS.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handleSubmit = () => {
    // TODO: Send 'answers' to Backend via POST API
    console.log("Submitting Answers:", answers);
    router.push(`/quizzes/${params.id}/results`);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const currentQuestion = MOCK_QUESTIONS[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / MOCK_QUESTIONS.length) * 100;

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-3xl bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
        
        {/* Header */}
        <div className="bg-indigo-600 px-6 py-4 flex justify-between items-center text-white">
          <h2 className="text-xl font-bold">Quiz #{params.id}</h2>
          <div className="flex items-center gap-2 font-mono text-lg bg-indigo-700 px-3 py-1 rounded-lg">
            <Clock className="w-5 h-5" />
            {formatTime(timeLeft)}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 h-2">
          <div className="bg-green-500 h-2 transition-all duration-300" style={{ width: `${progress}%` }}></div>
        </div>

        {/* Question Area */}
        <div className="p-8">
          <div className="mb-6">
            <span className="text-sm font-bold text-gray-400 uppercase tracking-wide">
              Question {currentQuestionIndex + 1} of {MOCK_QUESTIONS.length}
            </span>
            <h3 className="text-2xl font-bold mt-2 text-gray-900 dark:text-white">
              {currentQuestion.text}
            </h3>
          </div>

          <div className="space-y-3">
            {currentQuestion.options.map((option, idx) => (
              <button
                key={idx}
                onClick={() => handleOptionSelect(option)}
                className={`w-full text-left px-6 py-4 rounded-xl border-2 transition-all flex items-center justify-between ${
                  answers[currentQuestionIndex] === option 
                    ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300' 
                    : 'border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:text-gray-300'
                }`}
              >
                <span className="font-medium text-lg">{option}</span>
                {answers[currentQuestionIndex] === option && <CheckCircle className="w-5 h-5 text-indigo-600" />}
              </button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 dark:bg-gray-700/50 px-8 py-4 flex justify-between items-center border-t border-gray-100 dark:border-gray-700">
           <button 
             disabled={currentQuestionIndex === 0}
             onClick={() => setCurrentQuestionIndex(prev => prev - 1)}
             className="text-gray-500 font-medium hover:text-gray-700 disabled:opacity-50"
           >
             Previous
           </button>

           {currentQuestionIndex === MOCK_QUESTIONS.length - 1 ? (
             <button 
               onClick={handleSubmit}
               className="bg-green-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-green-700 transition-colors shadow-lg shadow-green-500/30"
             >
               Submit Quiz
             </button>
           ) : (
             <button 
               onClick={handleNext}
               className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-indigo-700 transition-colors"
             >
               Next Question
             </button>
           )}
        </div>
      </div>
    </div>
  );
}