'use client';

import { useState, useEffect, useCallback } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  LayoutDashboard, 
  PlusCircle, 
  Gamepad2, 
  LogOut, 
  Settings,
  Bell,
  User as UserIcon, 
  Brain,
  ChevronLeft,
  Menu,
  ShieldCheck,
  Lock
} from 'lucide-react';
import { URLS } from '@/lib/constants/Urls';

interface UserData {
  email: string;
  role: string;
  username: string;
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  // State for user data
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const isAuthPage = [URLS.LOGIN, URLS.SIGNUP, URLS.OAUTH_SUCCESS].includes(pathname);

  // --- NEW: Sync Function to read from LocalStorage ---
  const syncUser = useCallback(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (!token || !storedUser) {
      setUser(null);
      setIsLoaded(true);
      router.replace(URLS.LOGIN);
      return;
    }

    try {
      const parsedUser: UserData = JSON.parse(storedUser);
      setUser(parsedUser);

      // Role-based security for create quiz
      if (pathname === URLS.CREATE_QUIZ && parsedUser.role !== 'GAME_MASTER') {
        router.replace(URLS.DASHBOARD);
      }
    } catch (error) {
      console.error("Failed to parse user data", error);
    } finally {
      setIsLoaded(true);
    }
  }, [pathname, router]);

  // --- NEW: Event Listeners for Live Updates ---
  useEffect(() => {
    // 1. Initial Load
    syncUser();

    // 2. Listen for 'storage' events (Standard browser event)
    window.addEventListener('storage', syncUser);
    
    // 3. Listen for custom event (For same-tab updates)
    window.addEventListener('user-data-ready', syncUser);

    return () => {
      window.removeEventListener('storage', syncUser);
      window.removeEventListener('user-data-ready', syncUser);
    };
  }, [syncUser]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    router.push(URLS.LOGIN);
  };

  const isGameMaster = user?.role === 'GAME_MASTER';
  const displayUsername = user?.username ? user.username.split('@')[0] : 'Guest';

  if (!isLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-200">
        <span className="text-sm font-medium">Loading your dashboard...</span>
      </div>
    );
  }

  if (isAuthPage) return <>{children}</>;

  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 overflow-hidden">
      
      {/* 1. Header */}
      <header className="h-16 w-full bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-4 md:px-8 shrink-0 z-50 shadow-sm">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-gray-500 transition-colors"
          >
            {isCollapsed ? <Menu size={20} /> : <ChevronLeft size={20} />}
          </button>

          <div className="flex items-center gap-3">
            <Brain className="w-8 h-8 text-indigo-600" />
            <Link href={URLS.DASHBOARD} className="text-2xl font-bold text-indigo-600 tracking-tight hidden sm:block">
              QuizGame
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 pl-4 border-l border-gray-200 dark:border-gray-700">
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-sm font-semibold truncate max-w-[150px]">
                {displayUsername}
              </span>
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1 uppercase tracking-wider ${
                isGameMaster 
                  ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400' 
                  : 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-400'
              }`}>
                {isGameMaster ? <ShieldCheck size={10} /> : <UserIcon size={10} />}
                {user?.role ? user.role.replace('_', ' ') : 'USER'}
              </span>
            </div>
            
            <div className="w-10 h-10 bg-linear-to-tr from-indigo-600 to-violet-500 rounded-full flex items-center justify-center text-white border-2 border-white dark:border-gray-800 shadow-sm font-bold">
              {displayUsername[0].toUpperCase()}
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1 min-h-0 overflow-hidden">
        {/* 2. Sidebar */}
        <aside className={`bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 hidden md:flex flex-col transition-all duration-300 shrink-0 ${isCollapsed ? 'w-20' : 'w-64'}`}>
          <nav className="flex-1 px-3 py-6 space-y-2 overflow-y-auto">
            <SidebarLink 
              href={URLS.DASHBOARD} 
              icon={<LayoutDashboard size={22}/>} 
              label="Dashboard" 
              active={pathname === URLS.DASHBOARD} 
              isCollapsed={isCollapsed} 
            />

            {/* Restricted Sidebar Item */}
            {isGameMaster && (
              <SidebarLink 
                href={URLS.CREATE_QUIZ} 
                icon={<PlusCircle size={22}/>} 
                label="Create Quiz" 
                active={pathname === URLS.CREATE_QUIZ} 
                isCollapsed={isCollapsed} 
              />
            )}

            <SidebarLink 
              href={URLS.QUIZZES} 
              icon={<Gamepad2 size={22}/>} 
              label="Browse Quizzes" 
              active={pathname.startsWith(URLS.QUIZZES)} 
              isCollapsed={isCollapsed} 
            />
          </nav>

          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <button onClick={handleLogout} className={`flex items-center text-gray-500 hover:text-red-600 transition-colors w-full px-3 py-2 ${isCollapsed ? 'justify-center' : 'gap-3'}`}>
              <LogOut size={22} />
              {!isCollapsed && <span className="font-medium">Logout</span>}
            </button>
          </div>
        </aside>

        {/* 3. Main Content */}
        <main className="flex-1 min-w-0 overflow-y-auto bg-gray-50 dark:bg-gray-900 scroll-smooth">
          {pathname === URLS.CREATE_QUIZ && !isGameMaster && isLoaded ? (
            <div className="flex flex-col items-center justify-center h-full">
               <Lock size={48} className="text-gray-300 mb-4" />
               <h2 className="text-xl font-bold">Access Denied</h2>
            </div>
          ) : (
            children
          )}
        </main>
      </div>
    </div>
  );
}

function SidebarLink({ href, icon, label, active, isCollapsed }: any) {
  return (
    <Link 
      href={href} 
      className={`flex items-center rounded-xl font-medium transition-all duration-200 ${
        isCollapsed ? 'justify-center px-0 py-3' : 'gap-3 px-4 py-3'
      } ${
        active 
          ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200 dark:shadow-none' 
          : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700/50 hover:text-indigo-600'
      }`}
    >
      <div className="shrink-0">{icon}</div>
      {!isCollapsed && <span className="whitespace-nowrap">{label}</span>}
    </Link>
  );
}