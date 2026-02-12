'use client';

import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  LayoutDashboard, 
  PlusCircle, 
  Gamepad2, 
  LogOut, 
  Settings,
  Search,
  Bell,
  User as UserIcon, 
  Brain
} from 'lucide-react';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  // Hide navigation on Auth and Success pages
  const isAuthPage = ['/login', '/signup', '/oauth-success'].includes(pathname);

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  return (
    <html lang="en">
      <body className="bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        <div className="flex min-h-screen">
          {!isAuthPage && (
            <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 hidden md:flex flex-col sticky top-0 h-screen">
              <div className="p-6 flex items-center gap-3">
                <Brain className="w-8 h-8 text-indigo-600" />
                <Link href="/" className="text-2xl font-bold text-indigo-600">QuizGame</Link>
              </div>
              
              <nav className="flex-1 px-4 space-y-2">
                {/* Updated hrefs to match folder nesting inside /dashboard */}
                <SidebarLink 
                  href="/dashboard" 
                  icon={<LayoutDashboard size={20}/>} 
                  label="Dashboard" 
                  active={pathname === '/dashboard'} 
                />
                <SidebarLink 
                  href="/dashboard/create-quiz" 
                  icon={<PlusCircle size={20}/>} 
                  label="Create Quiz" 
                  active={pathname === '/dashboard/create-quiz'} 
                />
                <SidebarLink 
                  href="/dashboard/quizzes" 
                  icon={<Gamepad2 size={20}/>} 
                  label="Browse Quizzes" 
                  active={pathname.startsWith('/dashboard/quizzes')} 
                />
                {/* Keep this as is if settings is a separate top-level or update if moved */}
                <SidebarLink 
                  href="/dashboard/settings" 
                  icon={<Settings size={20}/>} 
                  label="Settings" 
                  active={pathname === '/dashboard/settings'} 
                />
              </nav>

              <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                <button onClick={handleLogout} className="flex items-center gap-3 w-full px-4 py-2 text-gray-500 hover:text-red-600 transition-colors">
                  <LogOut size={20} />
                  <span className="font-medium">Logout</span>
                </button>
              </div>
            </aside>
          )}

          <div className="flex-1 flex flex-col min-w-0">
            {!isAuthPage && (
              <header className="h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-8 sticky top-0 z-10">
                <div className="relative w-64 hidden sm:block">
                  {/* <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                  <input 
                    type="text" 
                    placeholder="Search quizzes..." 
                    className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                  /> */}
                </div>

                <div className="flex items-center gap-4">
                  <button className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">
                    <Bell size={20}/>
                  </button>
                  <div className="flex items-center gap-3 pl-4 border-l border-gray-200 dark:border-gray-700">
                    <div className="w-8 h-8 bg-indigo-100 dark:bg-indigo-900/40 rounded-full flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                      <UserIcon size={18} />
                    </div>
                  </div>
                </div>
              </header>
            )}
            <main className="flex-1">{children}</main>
          </div>
        </div>
      </body>
    </html>
  );
}

function SidebarLink({ href, icon, label, active }: { href: string, icon: any, label: string, active: boolean }) {
  return (
    <Link 
      href={href} 
      className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${
        active 
          ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400' 
          : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700/50'
      }`}
    >
      {icon}
      {label}
    </Link>
  );
}