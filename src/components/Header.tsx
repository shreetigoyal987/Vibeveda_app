import React, { useEffect, useState } from 'react';
import { 
  Sparkles, 
  CheckSquare, 
  FileText, 
  Lightbulb, 
  Compass, 
  Timer, 
  Sun, 
  Moon,
  Laptop
} from 'lucide-react';

interface HeaderProps {
  activeTab: 'launchpad' | 'tasks' | 'notes' | 'ideas';
  setActiveTab: (tab: 'launchpad' | 'tasks' | 'notes' | 'ideas') => void;
  isTimerOpen: boolean;
  setIsTimerOpen: (open: boolean) => void;
  theme: 'dark' | 'light';
  setTheme: (theme: 'dark' | 'light') => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  isTimerOpen,
  setIsTimerOpen,
  theme,
  setTheme,
}) => {
  const [time, setTime] = useState<string>('');
  const [greeting, setGreeting] = useState<string>('Hello');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      );
      const hours = now.getHours();
      if (hours < 12) setGreeting('Good morning');
      else if (hours < 18) setGreeting('Good afternoon');
      else setGreeting('Good evening');
    };

    updateTime();
    const interval = setInterval(updateTime, 1000 * 30);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="sticky top-0 z-30 border-b border-zinc-200/80 bg-white/80 backdrop-blur-md dark:border-zinc-800/80 dark:bg-zinc-950/80 transition-colors">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        {/* Brand & Greeting */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-amber-400 text-white shadow-md shadow-indigo-500/20">
            <Sparkles className="h-5 w-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold tracking-tight text-zinc-900 dark:text-white">
                IdeaForge
              </span>
              <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-semibold text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300">
                Studio
              </span>
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              {greeting} • {time}
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="hidden md:flex items-center gap-1 rounded-xl bg-zinc-100/80 p-1 dark:bg-zinc-900/80 border border-zinc-200/50 dark:border-zinc-800/60">
          <button
            onClick={() => setActiveTab('launchpad')}
            className={`flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-sm font-medium transition-all ${
              activeTab === 'launchpad'
                ? 'bg-white text-zinc-900 shadow-sm dark:bg-zinc-800 dark:text-white'
                : 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200'
            }`}
          >
            <Compass className="h-4 w-4" />
            <span>Launchpad</span>
          </button>

          <button
            onClick={() => setActiveTab('tasks')}
            className={`flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-sm font-medium transition-all ${
              activeTab === 'tasks'
                ? 'bg-white text-zinc-900 shadow-sm dark:bg-zinc-800 dark:text-white'
                : 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200'
            }`}
          >
            <CheckSquare className="h-4 w-4" />
            <span>Tasks</span>
          </button>

          <button
            onClick={() => setActiveTab('notes')}
            className={`flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-sm font-medium transition-all ${
              activeTab === 'notes'
                ? 'bg-white text-zinc-900 shadow-sm dark:bg-zinc-800 dark:text-white'
                : 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200'
            }`}
          >
            <FileText className="h-4 w-4" />
            <span>Scratchpad</span>
          </button>

          <button
            onClick={() => setActiveTab('ideas')}
            className={`flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-sm font-medium transition-all ${
              activeTab === 'ideas'
                ? 'bg-white text-zinc-900 shadow-sm dark:bg-zinc-800 dark:text-white'
                : 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200'
            }`}
          >
            <Lightbulb className="h-4 w-4" />
            <span>Idea Board</span>
          </button>
        </nav>

        {/* Right utility buttons */}
        <div className="flex items-center gap-2">
          {/* Focus Timer Button */}
          <button
            onClick={() => setIsTimerOpen(!isTimerOpen)}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all border ${
              isTimerOpen
                ? 'bg-amber-50 text-amber-700 border-amber-300 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800'
                : 'bg-zinc-100 text-zinc-700 border-zinc-200 hover:bg-zinc-200 dark:bg-zinc-900 dark:text-zinc-300 dark:border-zinc-800 dark:hover:bg-zinc-800'
            }`}
            title="Toggle Focus Timer"
          >
            <Timer className="h-4 w-4 text-amber-500" />
            <span className="hidden sm:inline">Focus Timer</span>
          </button>

          {/* Theme switcher */}
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-200 bg-zinc-100 text-zinc-600 hover:text-zinc-900 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? (
              <Sun className="h-4 w-4 text-amber-400" />
            ) : (
              <Moon className="h-4 w-4 text-zinc-700" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile nav bar */}
      <div className="flex md:hidden border-t border-zinc-200 dark:border-zinc-800 px-4 py-2 gap-1 overflow-x-auto">
        <button
          onClick={() => setActiveTab('launchpad')}
          className={`flex items-center gap-1.5 rounded-lg px-3 py-1 text-xs font-medium whitespace-nowrap ${
            activeTab === 'launchpad'
              ? 'bg-indigo-600 text-white'
              : 'text-zinc-600 dark:text-zinc-400'
          }`}
        >
          <Compass className="h-3.5 w-3.5" /> Launchpad
        </button>
        <button
          onClick={() => setActiveTab('tasks')}
          className={`flex items-center gap-1.5 rounded-lg px-3 py-1 text-xs font-medium whitespace-nowrap ${
            activeTab === 'tasks'
              ? 'bg-indigo-600 text-white'
              : 'text-zinc-600 dark:text-zinc-400'
          }`}
        >
          <CheckSquare className="h-3.5 w-3.5" /> Tasks
        </button>
        <button
          onClick={() => setActiveTab('notes')}
          className={`flex items-center gap-1.5 rounded-lg px-3 py-1 text-xs font-medium whitespace-nowrap ${
            activeTab === 'notes'
              ? 'bg-indigo-600 text-white'
              : 'text-zinc-600 dark:text-zinc-400'
          }`}
        >
          <FileText className="h-3.5 w-3.5" /> Scratchpad
        </button>
        <button
          onClick={() => setActiveTab('ideas')}
          className={`flex items-center gap-1.5 rounded-lg px-3 py-1 text-xs font-medium whitespace-nowrap ${
            activeTab === 'ideas'
              ? 'bg-indigo-600 text-white'
              : 'text-zinc-600 dark:text-zinc-400'
          }`}
        >
          <Lightbulb className="h-3.5 w-3.5" /> Ideas
        </button>
      </div>
    </header>
  );
};
