"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  Swords,
  BarChart3,
  GitBranch,
  Activity,
  FileText,
  Zap,
  Play,
  LogOut,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/store/useAppStore";

const navItems = [
  { to: "/muse", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/muse/council", icon: Users, label: "Agent Council" },
  { to: "/muse/debate", icon: Swords, label: "Debate Engine" },
  { to: "/muse/scenarios", icon: BarChart3, label: "Scenarios" },
  { to: "/muse/reasoning", icon: GitBranch, label: "Reasoning Graph" },
  { to: "/muse/activity", icon: Activity, label: "Activity Log" },
  { to: "/muse/export", icon: FileText, label: "Decision Export" },
  { to: "/simulations", icon: BarChart3, label: "Simulations" },
  { to: "/research", icon: Play, label: "Research Agent" },
  { to: "/documents", icon: FileText, label: "Knowledge Base" },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { mode } = useAppStore();

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 border-r border-border bg-sidebar flex flex-col shadow-[6px_0_22px_rgba(10,10,10,0.08)]">
        {/* Logo */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center shadow-sm">
              <Zap className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-sm font-bold tracking-tight text-foreground">OmniMind AI</h1>
              <p className="text-[10px] font-mono text-muted-foreground tracking-wider uppercase">The Council of Five</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.to;
            return (
              <Link
                key={item.to}
                href={item.to}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-all duration-150",
                  isActive
                    ? "sidebar-active"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent/55"
                )}
              >
                <item.icon className="w-4 h-4 flex-shrink-0" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-border space-y-4">
          <div className="px-3">
             <Link 
               href="/mode-selection"
               className="flex items-center gap-2 group mb-2 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground hover:text-primary transition-all"
             >
               <Zap className="w-3 h-3 group-hover:animate-pulse" />
               Switch Mode
             </Link>
          </div>
          <button
            onClick={() => {
              localStorage.removeItem("user");
              window.location.href = "/";
            }}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-md text-sm text-red-500 hover:bg-red-500/10 transition-all font-bold uppercase tracking-widest"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
          <div className="flex items-center justify-between px-3">
            <div className="flex items-center gap-2 text-[10px] font-mono text-muted-foreground uppercase tracking-wider">
              {mode === 'live' ? (
                <div className="flex items-center gap-2 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 font-black">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  LIVE LINK
                </div>
              ) : (
                <div className="flex items-center gap-2 px-2 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-500 font-black">
                  <Play className="w-2.5 h-2.5" />
                  DEMO MODE
                </div>
              )}
            </div>
            <span className="text-[10px] font-mono text-muted-foreground uppercase opacity-40">H-V4.3</span>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-y-auto bg-[hsl(var(--background))]">
        {children}
      </main>
    </div>
  );
}
