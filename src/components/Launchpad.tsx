import React, { useState } from 'react';
import { 
  Sparkles, 
  Copy, 
  Check, 
  ArrowRight, 
  CheckCircle2, 
  FolderKanban, 
  FileText, 
  Lightbulb, 
  Compass,
  LineChart,
  Utensils,
  ShoppingBag,
  Music,
  Palette,
  Terminal,
  Zap,
  CheckSquare
} from 'lucide-react';
import { PROJECT_TEMPLATES } from '../data/initialData.ts';
import { Task, Note, StickyIdea } from '../types.ts';

interface LaunchpadProps {
  tasks: Task[];
  notes: Note[];
  ideas: StickyIdea[];
  setActiveTab: (tab: 'launchpad' | 'tasks' | 'notes' | 'ideas') => void;
  setIsTimerOpen: (open: boolean) => void;
}

export const Launchpad: React.FC<LaunchpadProps> = ({
  tasks,
  notes,
  ideas,
  setActiveTab,
  setIsTimerOpen,
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [customGoal, setCustomGoal] = useState('');
  const [customType, setCustomType] = useState('Full-Stack Web App');
  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [copiedCustom, setCopiedCustom] = useState(false);

  // Quick stats
  const activeTasks = tasks.filter((t) => t.status !== 'done').length;
  const completedTasks = tasks.filter((t) => t.status === 'done').length;
  const totalNotes = notes.length;
  const totalVotes = ideas.reduce((acc, i) => acc + i.votes, 0);

  const categories = ['All', 'Productivity', 'Analytics', 'E-Commerce', 'Games & Tools', 'Design & Media'];

  const filteredTemplates = PROJECT_TEMPLATES.filter(
    (t) => selectedCategory === 'All' || t.category === selectedCategory
  );

  const copyTemplatePrompt = (id: string, prompt: string) => {
    navigator.clipboard.writeText(prompt);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const getTemplateIcon = (iconName: string) => {
    switch (iconName) {
      case 'LineChart':
        return <LineChart className="h-5 w-5 text-indigo-500" />;
      case 'Utensils':
        return <Utensils className="h-5 w-5 text-emerald-500" />;
      case 'ShoppingBag':
        return <ShoppingBag className="h-5 w-5 text-amber-500" />;
      case 'Music':
        return <Music className="h-5 w-5 text-rose-500" />;
      case 'Palette':
        return <Palette className="h-5 w-5 text-purple-500" />;
      default:
        return <FolderKanban className="h-5 w-5 text-blue-500" />;
    }
  };

  const handleGeneratePrompt = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customGoal.trim()) return;

    const prompt = `Build a high-performance, polished ${customType} focused on: "${customGoal.trim()}". Include comprehensive interactive workflows, responsive UI design, rich filtering/search, local state persistence, and clean typography.`;
    setGeneratedPrompt(prompt);
  };

  const copyCustomPrompt = () => {
    if (!generatedPrompt) return;
    navigator.clipboard.writeText(generatedPrompt);
    setCopiedCustom(true);
    setTimeout(() => setCopiedCustom(false), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Welcome Hero Card */}
      <div className="relative overflow-hidden rounded-3xl border border-indigo-100 dark:border-indigo-950 bg-gradient-to-br from-indigo-900 via-indigo-950 to-zinc-950 p-6 sm:p-8 text-white shadow-xl">
        <div className="absolute -right-10 -top-10 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl" />
        <div className="absolute right-20 -bottom-10 h-64 w-64 rounded-full bg-amber-500/10 blur-3xl" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-400/30 bg-indigo-500/20 px-3 py-1 text-xs font-semibold text-indigo-200 backdrop-blur-md">
            <Sparkles className="h-3.5 w-3.5 text-amber-300" />
            <span>IdeaForge Studio • Creative Launchpad</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
            Hi there! What shall we create together today?
          </h1>

          <p className="text-sm sm:text-base text-zinc-300 leading-relaxed max-w-2xl">
            Welcome to your project workspace. Organize your ideas on the{' '}
            <strong className="text-indigo-300 font-semibold">Kanban Board</strong>, jot down notes in the{' '}
            <strong className="text-amber-300 font-semibold">Scratchpad</strong>, or browse the{' '}
            <strong className="text-emerald-300 font-semibold">Project Blueprints</strong> below to inspire your next build.
          </p>

          {/* Quick Action Navigation Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => setActiveTab('tasks')}
              className="flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-xs sm:text-sm font-semibold text-zinc-950 shadow-md hover:bg-zinc-100 transition-all"
            >
              <CheckSquare className="h-4 w-4 text-indigo-600" />
              <span>Open Task Board ({activeTasks} active)</span>
            </button>

            <button
              onClick={() => setActiveTab('notes')}
              className="flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-xs sm:text-sm font-medium text-white hover:bg-white/20 transition-all backdrop-blur-md"
            >
              <FileText className="h-4 w-4 text-amber-300" />
              <span>Scratchpad Notes ({totalNotes})</span>
            </button>

            <button
              onClick={() => setIsTimerOpen(true)}
              className="flex items-center gap-2 rounded-xl border border-amber-400/30 bg-amber-400/10 px-4 py-2.5 text-xs sm:text-sm font-medium text-amber-200 hover:bg-amber-400/20 transition-all backdrop-blur-md"
            >
              <Zap className="h-4 w-4 text-amber-300" />
              <span>Start Focus Session</span>
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div 
          onClick={() => setActiveTab('tasks')}
          className="cursor-pointer rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 shadow-sm hover:border-indigo-400 dark:hover:border-indigo-600 transition-all"
        >
          <div className="flex items-center justify-between text-zinc-500 dark:text-zinc-400 text-xs font-semibold">
            <span>ACTIVE TASKS</span>
            <FolderKanban className="h-4 w-4 text-indigo-500" />
          </div>
          <div className="mt-2 text-2xl font-bold text-zinc-900 dark:text-white">
            {activeTasks}
          </div>
          <div className="mt-1 text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-medium">
            <CheckCircle2 className="h-3 w-3" /> {completedTasks} completed
          </div>
        </div>

        <div 
          onClick={() => setActiveTab('notes')}
          className="cursor-pointer rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 shadow-sm hover:border-amber-400 dark:hover:border-amber-600 transition-all"
        >
          <div className="flex items-center justify-between text-zinc-500 dark:text-zinc-400 text-xs font-semibold">
            <span>SCRATCHPAD</span>
            <FileText className="h-4 w-4 text-amber-500" />
          </div>
          <div className="mt-2 text-2xl font-bold text-zinc-900 dark:text-white">
            {totalNotes}
          </div>
          <div className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
            Jotted notes & guides
          </div>
        </div>

        <div 
          onClick={() => setActiveTab('ideas')}
          className="cursor-pointer rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 shadow-sm hover:border-purple-400 dark:hover:border-purple-600 transition-all"
        >
          <div className="flex items-center justify-between text-zinc-500 dark:text-zinc-400 text-xs font-semibold">
            <span>STICKY IDEAS</span>
            <Lightbulb className="h-4 w-4 text-purple-500" />
          </div>
          <div className="mt-2 text-2xl font-bold text-zinc-900 dark:text-white">
            {ideas.length}
          </div>
          <div className="mt-1 text-xs text-purple-600 dark:text-purple-400 font-medium">
            {totalVotes} community upvotes
          </div>
        </div>

        <div 
          onClick={() => setIsTimerOpen(true)}
          className="cursor-pointer rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 shadow-sm hover:border-emerald-400 dark:hover:border-emerald-600 transition-all"
        >
          <div className="flex items-center justify-between text-zinc-500 dark:text-zinc-400 text-xs font-semibold">
            <span>FOCUS MODE</span>
            <Zap className="h-4 w-4 text-emerald-500" />
          </div>
          <div className="mt-2 text-2xl font-bold text-zinc-900 dark:text-white">
            25m
          </div>
          <div className="mt-1 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
            Pomodoro ready
          </div>
        </div>
      </div>

      {/* Interactive Project Blueprints Gallery */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-zinc-900 dark:text-white flex items-center gap-2">
              <Compass className="h-5 w-5 text-indigo-500" />
              Project Blueprints & Prompts
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Need inspiration? Copy any pre-engineered prompt to transform this app into whatever you need.
            </p>
          </div>

          {/* Category filter pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-xl px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === cat
                    ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900'
                    : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Blueprint Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTemplates.map((template) => (
            <div
              key={template.id}
              className="flex flex-col justify-between rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 shadow-sm hover:shadow-md hover:border-zinc-300 dark:hover:border-zinc-700 transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-100 dark:bg-zinc-800">
                    {getTemplateIcon(template.icon)}
                  </div>
                  <span className="rounded-full bg-zinc-100 dark:bg-zinc-800 px-2.5 py-1 text-[10px] font-semibold text-zinc-600 dark:text-zinc-300">
                    {template.category}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-zinc-900 dark:text-white">
                  {template.title}
                </h3>
                <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                  {template.description}
                </p>

                <div className="mt-3 flex flex-wrap gap-1">
                  {template.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded bg-zinc-100 dark:bg-zinc-800/80 px-1.5 py-0.5 text-[10px] font-medium text-zinc-600 dark:text-zinc-400"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-5 pt-3 border-t border-zinc-100 dark:border-zinc-800">
                <button
                  onClick={() => copyTemplatePrompt(template.id, template.prompt)}
                  className={`flex w-full items-center justify-center gap-1.5 rounded-xl py-2 text-xs font-semibold transition-all ${
                    copiedId === template.id
                      ? 'bg-emerald-600 text-white'
                      : 'bg-zinc-100 text-zinc-800 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700'
                  }`}
                >
                  {copiedId === template.id ? (
                    <>
                      <Check className="h-3.5 w-3.5" /> Prompt Copied to Clipboard!
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" /> Copy Prompt for AI Studio
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Custom Prompt Composer */}
      <div className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-gradient-to-r from-zinc-50 to-indigo-50/30 dark:from-zinc-900 dark:to-zinc-900/60 p-6 shadow-sm">
        <div className="max-w-2xl">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            <Terminal className="h-4 w-4" />
            <span>Interactive Prompt Architect</span>
          </div>
          <h3 className="mt-1 text-base sm:text-lg font-bold text-zinc-900 dark:text-white">
            Have a custom idea in mind? Craft your prompt here.
          </h3>
          <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
            Type your concept, and this tool will compose a structured instruction prompt you can send in the chat to build it.
          </p>

          <form onSubmit={handleGeneratePrompt} className="mt-4 space-y-3">
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={customGoal}
                onChange={(e) => setCustomGoal(e.target.value)}
                placeholder="e.g. Budget calculator with visual spending breakdown and goal progress..."
                className="flex-1 px-4 py-2.5 text-sm bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-zinc-900 dark:text-white shadow-sm"
              />

              <select
                value={customType}
                onChange={(e) => setCustomType(e.target.value)}
                className="px-3 py-2.5 text-xs bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-zinc-900 dark:text-white outline-none shadow-sm"
              >
                <option value="Full-Stack Web App">Full-Stack App</option>
                <option value="Interactive Dashboard">Dashboard</option>
                <option value="Productivity Tool">Productivity Tool</option>
                <option value="Browser Game">Browser Game</option>
                <option value="Creative Showcase">Creative Showcase</option>
              </select>

              <button
                type="submit"
                className="flex items-center justify-center gap-1.5 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-semibold text-white shadow hover:bg-indigo-700 transition-colors whitespace-nowrap"
              >
                Generate Prompt
              </button>
            </div>
          </form>

          {/* Generated Result Box */}
          {generatedPrompt && (
            <div className="mt-4 rounded-2xl border border-indigo-200 dark:border-indigo-900 bg-white dark:bg-zinc-950 p-4 space-y-3 shadow-md">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                  Ready to copy & send to AI Studio:
                </span>
                <button
                  onClick={copyCustomPrompt}
                  className="flex items-center gap-1 text-xs font-bold text-zinc-700 dark:text-zinc-200 hover:text-indigo-600"
                >
                  {copiedCustom ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-600" /> Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" /> Copy Prompt
                    </>
                  )}
                </button>
              </div>

              <p className="text-xs text-zinc-700 dark:text-zinc-300 bg-zinc-50 dark:bg-zinc-900/90 p-3 rounded-xl border border-zinc-200/80 dark:border-zinc-800 font-mono leading-relaxed">
                {generatedPrompt}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
