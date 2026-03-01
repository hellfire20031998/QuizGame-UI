'use client';

import { useState, useRef, useEffect } from 'react';
import { Plus, Trash2, Save, FileText, X, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { createQuiz, CreateQuizPayload } from '@/lib/api/quiz';
import {
  Domain,
  fetchLatestDomains,
  searchDomains as searchDomainsApi,
} from '@/lib/api/domain';
import { URLS } from '@/lib/constants/Urls';

interface Question {
  id: number;
  text: string;
  options: string[];
  correctOption: number;
}

export default function CreateQuizPage() {
  const router = useRouter();
  
  // --- Form State ---
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
   // total time given to solve quiz (seconds)
  const [timeLimitSeconds, setTimeLimitSeconds] = useState<number>(600);
  const [questions, setQuestions] = useState<Question[]>([
    { id: 1, text: '', options: ['', '', '', ''], correctOption: 0 }
  ]);

  // --- Domain Selector State ---
  const [selectedDomains, setSelectedDomains] = useState<Domain[]>([]); 
  const [availableDomains, setAvailableDomains] = useState<Domain[]>([]); 
  const [domainSearch, setDomainSearch] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
   
  const dropdownRef = useRef<HTMLDivElement>(null);

  // --- API Fetching Logic ---

  const loadLatestDomains = async () => {
    setIsLoading(true);
    try {
      const data = await fetchLatestDomains();
      if (data.success) {
        setAvailableDomains(data.data);
      }
    } catch (error) {
      console.error("Error fetching latest domains:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const searchDomains = async (query: string) => {
    setIsLoading(true);
    try {
      const data = await searchDomainsApi(query);
      if (data.success) {
        setAvailableDomains(data.data);
      }
    } catch (error) {
      console.error("Error searching domains:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadLatestDomains();
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (domainSearch.trim()) {
        searchDomains(domainSearch);
      } else {
        loadLatestDomains();
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [domainSearch]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredAvailableDomains = availableDomains.filter(
    domain => !selectedDomains.some(sd => sd.id === domain.id)
  );

  // --- Domain Handlers ---
  const addDomain = (domain: Domain) => {
    setSelectedDomains([...selectedDomains, domain]);
    setDomainSearch(''); 
    loadLatestDomains(); 
  };

  const removeDomain = (domainId: number) => {
    setSelectedDomains(selectedDomains.filter(d => d.id !== domainId));
  };

  // --- Question Handlers ---
  const addQuestion = () => {
    setQuestions([
      ...questions,
      { id: Date.now(), text: '', options: ['', '', '', ''], correctOption: 0 }
    ]);
  };

  const removeQuestion = (id: number) => {
    if (questions.length === 1) return;
    setQuestions(questions.filter(q => q.id !== id));
  };

  const updateQuestion = (id: number, field: string, value: any) => {
    setQuestions(questions.map(q => q.id === id ? { ...q, [field]: value } : q));
  };

  const updateOption = (qId: number, optionIdx: number, value: string) => {
    setQuestions(questions.map(q => {
      if (q.id === qId) {
        const newOptions = [...q.options];
        newOptions[optionIdx] = value;
        return { ...q, options: newOptions };
      }
      return q;
    }));
  };

  // --- Handle Save / Publish ---
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    // 1. Transform state to API Payload structure
    const payload: CreateQuizPayload = { 
      title, 
      description,
      totalTimeInSeconds: timeLimitSeconds,
      domains: selectedDomains.map(d => d.id),
      questionRequests: questions.map(q => ({
        text: q.text,
        optionRequests: q.options.map((optText, index) => ({
          text: optText,
          correct: index === q.correctOption,
        })),
      })),
    };

    try {
      await createQuiz(payload);
      alert('Quiz Published Successfully!');
      router.push(URLS.QUIZZES);
    } catch (error) {
      console.error("Failed to save quiz:", error);
      alert('Failed to save quiz. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">      
      <main className="mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">Create New Quiz</h1>

        <form onSubmit={handleSave} className="space-y-8">
          
          {/* Quiz Basic Info Section */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 space-y-6">
            <h2 className="text-xl font-semibold flex items-center gap-2 text-gray-900 dark:text-white">
              <FileText className="w-5 h-5 text-indigo-600" /> Basic Info
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
                {/* Left Col: Title, Desc & Time */}
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Quiz Title *</label>
                        <input 
                        type="text" 
                        required
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" 
                        placeholder="e.g., Advanced Physics 101"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Description</label>
                        <textarea 
                        rows={3}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        placeholder="What is this quiz about?"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                          Time Limit (seconds)
                        </label>
                        <input
                          type="number"
                          min={30}
                          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                          value={timeLimitSeconds}
                          onChange={(e) =>
                            setTimeLimitSeconds(
                              Number.isNaN(Number(e.target.value))
                                ? 0
                                : Number(e.target.value),
                            )
                          }
                        />
                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                          This is the total time given to solve the quiz.
                        </p>
                    </div>
                </div>

                {/* Right Col: Domain Selector (Multi-Select) */}
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Related Domains (Tags)
                    </label>
                    
                    <div className="relative" ref={dropdownRef}>
                        {/* Input Area */}
                        <div 
                            className="w-full min-h-[42px] px-3 py-2 border rounded-lg focus-within:ring-2 focus-within:ring-indigo-500 bg-white dark:bg-gray-700 dark:border-gray-600 flex flex-wrap gap-2 items-center cursor-text"
                            onClick={() => setIsDropdownOpen(true)}
                        >
                            {/* Selected Tags */}
                            {selectedDomains.map(domain => (
                                <span key={domain.id} className="bg-indigo-100 text-indigo-800 text-xs font-semibold px-2 py-1 rounded-full flex items-center gap-1">
                                    {domain.name}
                                    <button 
                                        type="button"
                                        onClick={(e) => { e.stopPropagation(); removeDomain(domain.id); }}
                                        className="hover:text-indigo-900 focus:outline-none"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                </span>
                            ))}

                            {/* Search Input */}
                            <input 
                                type="text"
                                className="flex-1 min-w-[120px] outline-none bg-transparent text-sm dark:text-white"
                                placeholder={selectedDomains.length === 0 ? "Select domains..." : ""}
                                value={domainSearch}
                                onChange={(e) => {
                                    setDomainSearch(e.target.value);
                                    setIsDropdownOpen(true);
                                }}
                                onFocus={() => setIsDropdownOpen(true)}
                            />
                            {isLoading && <Loader2 className="w-4 h-4 animate-spin text-gray-400" />}
                        </div>

                        {/* Dropdown Menu */}
                        {isDropdownOpen && (
                            <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                                {filteredAvailableDomains.length > 0 ? (
                                    filteredAvailableDomains.map(domain => (
                                        <button
                                            key={domain.id}
                                            type="button"
                                            onClick={() => addDomain(domain)}
                                            className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-200 flex items-center justify-between group"
                                        >
                                            {domain.name}
                                            <Plus className="w-4 h-4 opacity-0 group-hover:opacity-100 text-indigo-500" />
                                        </button>
                                    ))
                                ) : (
                                    <div className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
                                        {isLoading ? "Loading..." : "No matching domains found."}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                        Search and select multiple domains to categorize your quiz.
                    </p>
                </div>
            </div>
          </div>

          {/* Questions Editor */}
          <div className="space-y-6">
            {questions.map((q, index) => (
              <div key={q.id} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 relative group transition-all hover:shadow-md">
                
                <div className="flex justify-between items-start mb-4">
                  <span className="text-sm font-bold text-gray-400 uppercase tracking-wide">
                    Question {index + 1}
                  </span>
                  <button 
                    type="button" 
                    onClick={() => removeQuestion(q.id)}
                    className="text-gray-400 hover:text-red-500 p-2 transition-colors"
                    title="Remove Question"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>

                <div className="mb-6">
                  <input 
                    type="text" 
                    placeholder="Type your question here..."
                    className="w-full text-lg font-medium border-b-2 border-gray-200 dark:border-gray-600 focus:border-indigo-500 outline-none py-2 bg-transparent dark:text-white transition-colors placeholder:text-gray-400"
                    value={q.text}
                    onChange={(e) => updateQuestion(q.id, 'text', e.target.value)}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {q.options.map((opt, optIdx) => (
                    <div key={optIdx} className="relative flex items-center">
                      <div className="absolute left-3">
                         <input 
                            type="radio" 
                            name={`correct-${q.id}`} 
                            checked={q.correctOption === optIdx}
                            onChange={() => updateQuestion(q.id, 'correctOption', optIdx)}
                            className="w-4 h-4 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                            title="Mark as correct answer"
                          />
                      </div>
                      <input 
                        type="text"
                        placeholder={`Option ${optIdx + 1}`}
                        className={`w-full pl-10 pr-4 py-2 border rounded-lg outline-none transition-all dark:bg-gray-700 dark:text-white ${
                            q.correctOption === optIdx 
                            ? 'border-indigo-500 ring-1 ring-indigo-500 bg-indigo-50 dark:bg-indigo-900/20' 
                            : 'border-gray-200 dark:border-gray-600 focus:border-indigo-500'
                        }`}
                        value={opt}
                        onChange={(e) => updateOption(q.id, optIdx, e.target.value)}
                        required
                      />
                      {q.correctOption === optIdx && (
                          <span className="absolute right-3 text-xs font-bold text-indigo-600 bg-white dark:bg-gray-800 px-2 py-0.5 rounded shadow-sm pointer-events-none">
                              Correct
                          </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center pt-4">
            <button 
              type="button"
              onClick={addQuestion}
              className="flex items-center gap-2 text-indigo-600 font-semibold hover:bg-indigo-50 dark:hover:bg-indigo-900/30 px-6 py-3 rounded-lg transition-colors"
            >
              <Plus className="w-5 h-5" /> Add Question
            </button>

            <button 
              type="submit"
              disabled={isSaving}
              className={`flex items-center gap-2 bg-indigo-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-500/30 transition-all transform hover:-translate-y-1 active:scale-95 ${isSaving ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" /> Publishing...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" /> Publish Quiz
                </>
              )}
            </button>
          </div>

        </form>
      </main>
    </div>
  );
}