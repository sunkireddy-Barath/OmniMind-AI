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
  LayoutDashboard
} from 'lucide-react';

interface AppLayoutProps {
  user: { name: string; email: string };
  onSignOut: () => void;
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function AppLayout({ user, onSignOut, children, activeTab, setActiveTab }: AppLayoutProps) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isDarkTheme, setIsDarkTheme] = useState(true);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  useEffect(() => {
    if (!isDarkTheme) {
      document.documentElement.classList.add('light-theme');
    } else {
      document.documentElement.classList.remove('light-theme');
    }
  }, [isDarkTheme]);

  const menuItems = [
    { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard },
    { id: 'chat', name: 'Multi Agent Chat', icon: MessageSquare },
    { id: 'rag', name: 'Resource Center', icon: Database },
    { id: 'sim', name: 'Scenario Planner', icon: PlayCircle },
    { id: 'consensus', name: 'Strategic Insights', icon: ShieldCheck },
    { id: 'analytics', name: 'Activity Reports', icon: BarChart3 },
  ];

  return (
    <div className="flex h-screen bg-royal-black overflow-x-hidden overflow-y-hidden transition-colors duration-500">
      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: isSidebarCollapsed ? 80 : 280 }}
        className="relative bg-royal-charcoal border-r border-royal-gold/10 flex flex-col z-30 transition-colors duration-500"
      >
        {/* Toggle Button */}
        <button
          onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          className="absolute -right-3 top-20 w-6 h-6 bg-royal-gold rounded-full flex items-center justify-center text-royal-black shadow-lg border border-royal-black z-50 hover:scale-110 transition-transform"
        >
          {isSidebarCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>

        {/* Brand */}
        <div className="p-6 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-royal-gold flex items-center justify-center shrink-0 shadow-3xl">
            <Brain className="text-royal-black w-6 h-6" />
          </div>
          {!isSidebarCollapsed && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xl font-black italic uppercase tracking-tighter gradient-text"
            >
              OmniMind
            </motion.span>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-8 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-4 px-4 py-4 rounded-2xl transition-all duration-300 group ${
                activeTab === item.id 
                  ? 'bg-royal-gold/10 border border-royal-gold/20 text-royal-gold shadow-inner' 
                  : 'text-royal-text-secondary hover:text-royal-gold hover:bg-royal-gold/5 border border-transparent'
              }`}
            >
              <item.icon size={20} className={activeTab === item.id ? 'text-royal-gold' : 'group-hover:text-royal-gold transition-colors'} />
              {!isSidebarCollapsed && (
                <span className="text-xs font-black uppercase tracking-widest whitespace-nowrap">
                  {item.name}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-white/5">
          <button
            onClick={onSignOut}
            className="w-full flex items-center gap-4 px-4 py-4 rounded-2xl text-red-500/60 hover:text-red-500 hover:bg-red-500/5 transition-all group"
          >
            <LogOut size={20} />
            {!isSidebarCollapsed && (
              <span className="text-xs font-black uppercase tracking-widest">Sign Out</span>
            )}
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col relative overflow-hidden">
        {/* Top Header */}
        <header className="h-20 bg-royal-black/50 backdrop-blur-xl border-b border-royal-gold/10 px-8 flex items-center justify-between z-20 transition-colors duration-500">
          <div className="flex items-center gap-4">
            <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-royal-text-secondary">
              {menuItems.find(i => i.id === activeTab)?.name || 'Welcome Center'}
            </h2>
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-royal-gold/5 border border-royal-gold/10">
              <Sparkles size={12} className="text-royal-gold" />
              <span className="text-[8px] font-bold text-royal-gold uppercase tracking-widest">System Active</span>
            </div>
          </div>

          <div className="flex items-center gap-6">
            {/* Theme Toggle */}
            <div className="flex items-center gap-1 p-1 bg-royal-gold/5 rounded-full border border-royal-gold/10">
              <button
                onClick={() => setIsDarkTheme(false)}
                className={`p-2 rounded-full transition-all ${!isDarkTheme ? 'bg-royal-gold text-[#050505] shadow-lg' : 'text-royal-text-secondary hover:text-royal-gold'}`}
              >
                <Sun size={16} />
              </button>
              <button
                onClick={() => setIsDarkTheme(true)}
                className={`p-2 rounded-full transition-all ${isDarkTheme ? 'bg-royal-gold text-[#050505] shadow-lg' : 'text-royal-text-secondary hover:text-royal-gold'}`}
              >
                <Moon size={16} />
              </button>
            </div>

            {/* Profile */}
            <div className="relative flex items-center gap-4 pl-6 border-l border-royal-gold/10">
              <div className="text-right hidden sm:block">
                <p className="text-[10px] font-bold uppercase tracking-wider">{user.name}</p>
                <p className="text-[8px] font-medium text-royal-gold/60 uppercase tracking-widest">Professional Member</p>
              </div>
              <div 
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="relative cursor-pointer"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-royal-gold to-royal-gold-dark flex items-center justify-center font-black text-royal-black shadow-3xl hover:scale-105 transition-transform">
                  {user.name.charAt(0)}
                </div>
                {/* Dropdown Indicator */}
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-royal-black rounded-full" />
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
                      className="absolute right-0 top-16 w-56 bg-royal-charcoal backdrop-blur-2xl border border-royal-gold/20 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] p-2 z-50 overflow-hidden"
                    >
                      <div className="px-4 py-3 mb-2 border-b border-royal-gold/10">
                        <p className="text-[10px] font-bold text-royal-gold uppercase tracking-tighter truncate">{user.name}</p>
                        <p className="text-[8px] font-medium text-royal-text-secondary uppercase tracking-widest truncate">{user.email}</p>
                      </div>
                      <button 
                        className="w-full flex items-center gap-3 px-4 py-4 rounded-2xl hover:bg-royal-gold/5 text-royal-text-secondary hover:text-royal-gold transition-all duration-300 group"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        <Settings size={18} className="group-hover:rotate-45 transition-transform duration-500" />
                        <span className="text-[10px] font-bold uppercase tracking-widest">Profile Settings</span>
                      </button>
                      <button 
                        className="w-full flex items-center gap-3 px-4 py-4 rounded-2xl hover:bg-red-500/5 text-royal-text-secondary hover:text-red-500 transition-all duration-300"
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
              <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-royal-gold/5 blur-[120px] rounded-full -mr-64 -mt-64 pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-royal-gold/5 blur-[120px] rounded-full -ml-64 -mb-64 pointer-events-none" />
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
