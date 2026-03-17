'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, 
  MessageSquare, 
  Database, 
  PlayCircle, 
  BarChart3, 
  Settings, 
  LogOut,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Sun,
  Moon,
  User,
  ShieldCheck,
  Zap,
  LayoutDashboard,
} from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

interface AppLayoutProps {
  user?: { name: string; email: string };
  onSignOut?: () => void;
  children: React.ReactNode;
  activeTab?: string;
  setActiveTab?: (tab: string) => void;
}

export default function AppLayout({ 
  user = { name: 'Guest', email: 'guest@omnimind.ai' }, 
  onSignOut = () => {}, 
  children, 
  activeTab = 'dashboard', 
  setActiveTab = () => {} 
}: AppLayoutProps) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const { theme, setTheme } = useTheme();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const isDarkTheme = theme === 'dark';

  const menuItems = [
    { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard },
    { id: 'chat', name: 'Multi Agent Chat', icon: MessageSquare },
    { id: 'rag', name: 'RAG Knowledge Base', icon: Database },
    { id: 'sim', name: 'Scenario Planner', icon: PlayCircle },
    { id: 'consensus', name: 'Strategic Insights', icon: ShieldCheck },
    { id: 'analytics', name: 'Activity Reports', icon: BarChart3 },
  ];

  return (
    <div className="flex h-screen bg-[var(--bg-main)] overflow-x-hidden overflow-y-hidden transition-colors duration-500 text-[var(--text-primary)]">
      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: isSidebarCollapsed ? 80 : 210 }}
        className="relative bg-[var(--bg-sidebar)] border-r border-blue-600/10 flex flex-col z-30 transition-colors duration-500"
      >
        {/* Toggle Button */}
        <button
          onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          className="absolute -right-3 top-20 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-zinc-950 shadow-lg border border-zinc-950 z-50 hover:scale-110 transition-transform"
        >
          {isSidebarCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>

        {/* Brand */}
        <div className="p-5 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shrink-0 shadow-sm">
            <Brain className="text-white w-5 h-5" />
          </div>
          {!isSidebarCollapsed && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-lg font-semibold tracking-tight text-[var(--text-primary)]"
            >
              OmniMind
            </motion.span>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-6 space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${
                activeTab === item.id 
                  ? 'bg-blue-600/10 text-blue-600' 
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--glass-bg)]'
              }`}
            >
              <item.icon size={18} className={activeTab === item.id ? 'text-blue-600' : 'group-hover:text-[var(--text-primary)] transition-colors'} />
              {!isSidebarCollapsed && (
                <span className="text-sm font-medium whitespace-nowrap">
                  {item.name}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-3 border-t border-[var(--border-primary)]">
          <button
            onClick={onSignOut}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-500 hover:bg-red-500/5 transition-all group"
          >
            <LogOut size={18} />
            {!isSidebarCollapsed && (
              <span className="text-sm font-medium">Sign Out</span>
            )}
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col relative overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-[var(--bg-main)] border-b border-[var(--border-primary)] px-8 flex items-center justify-between z-20">
          <div className="flex items-center gap-4">
            <h2 className="text-sm font-medium text-[var(--text-secondary)]">
              {menuItems.find(i => i.id === activeTab)?.name || 'Welcome Center'}
            </h2>
          </div>

          <div className="flex items-center gap-4">
            {/* Theme Toggle */}
            <div className="flex items-center gap-1 p-1 bg-[var(--glass-bg)] rounded-lg border border-[var(--border-primary)]">
              <button
                onClick={() => setTheme('light')}
                className={`p-1.5 rounded-md transition-all ${theme === 'light' ? 'bg-[var(--bg-sidebar)] text-blue-600 shadow-sm' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
              >
                <Sun size={14} />
              </button>
              <button
                onClick={() => setTheme('dark')}
                className={`p-1.5 rounded-md transition-all ${theme === 'dark' ? 'bg-[var(--bg-sidebar)] text-blue-600 shadow-sm' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
              >
                <Moon size={14} />
              </button>
            </div>

            {/* Profile */}
            <div className="relative flex items-center gap-3 pl-4 border-l border-[var(--border-primary)]">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-medium">{user.name}</p>
                <p className="text-[10px] text-[var(--text-secondary)]">Member</p>
              </div>
              <div 
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="relative cursor-pointer"
              >
                <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white shadow-sm hover:bg-blue-700 transition-colors">
                  {user.name.charAt(0)}
                </div>
              </div>

              <AnimatePresence>
                {isProfileOpen && (
                  <>
                    <div 
                      className="fixed inset-0 z-40 bg-transparent" 
                      onClick={() => setIsProfileOpen(false)} 
                    />
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 top-16 w-56 bg-[var(--bg-sidebar)] backdrop-blur-2xl border border-blue-600/20 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] p-2 z-50 overflow-hidden"
                    >
                      <div className="px-4 py-3 mb-2 border-b border-blue-600/10">
                        <p className="text-[10px] font-bold text-blue-600 uppercase tracking-tighter truncate">{user.name}</p>
                        <p className="text-[8px] font-medium text-[var(--text-secondary)] uppercase tracking-widest truncate">{user.email}</p>
                      </div>
                      <button 
                        className="w-full flex items-center gap-3 px-4 py-4 rounded-2xl hover:bg-blue-600/5 text-[var(--text-secondary)] hover:text-blue-600 transition-all duration-300 group"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        <Settings size={18} className="group-hover:rotate-45 transition-transform duration-500" />
                        <span className="text-[10px] font-bold uppercase tracking-widest">Profile Settings</span>
                      </button>
                      <button 
                        className="w-full flex items-center gap-3 px-4 py-4 rounded-2xl hover:bg-red-500/5 text-[var(--text-secondary)] hover:text-red-500 transition-all duration-300"
                        onClick={() => {
                          setIsProfileOpen(false);
                          onSignOut();
                        }}
                      >
                        <LogOut size={18} />
                        <span className="text-[10px] font-bold uppercase tracking-widest">Sign Out Session</span>
                      </button>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* Viewport */}
        <main className={`flex-1 relative scrollbar-hide ${activeTab === 'chat' ? 'overflow-hidden' : 'overflow-y-auto overflow-x-hidden'}`}>
          {/* Background decoration */}
          {activeTab !== 'chat' && (
            <>
              <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/5 blur-[120px] rounded-full -mr-64 -mt-64 pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-600/5 blur-[120px] rounded-full -ml-64 -mb-64 pointer-events-none" />
            </>
          )}
          
          <div className="relative z-10">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
