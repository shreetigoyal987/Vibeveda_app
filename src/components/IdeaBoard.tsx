import React, { useState } from 'react';
import { 
  Lightbulb, 
  ThumbsUp, 
  Plus, 
  Trash2, 
  Filter, 
  Sparkles,
  Send
} from 'lucide-react';
import { StickyIdea } from '../types.ts';

interface IdeaBoardProps {
  ideas: StickyIdea[];
  setIdeas: React.Dispatch<React.SetStateAction<StickyIdea[]>>;
}

const STICKY_COLORS = [
  {
    name: 'Amber',
    class: 'bg-amber-100 text-amber-950 dark:bg-amber-950/40 dark:text-amber-200 border-amber-300 dark:border-amber-700/50',
    dot: 'bg-amber-400',
  },
  {
    name: 'Emerald',
    class: 'bg-emerald-100 text-emerald-950 dark:bg-emerald-950/40 dark:text-emerald-200 border-emerald-300 dark:border-emerald-700/50',
    dot: 'bg-emerald-400',
  },
  {
    name: 'Violet',
    class: 'bg-purple-100 text-purple-950 dark:bg-purple-950/40 dark:text-purple-200 border-purple-300 dark:border-purple-700/50',
    dot: 'bg-purple-400',
  },
  {
    name: 'Sky',
    class: 'bg-sky-100 text-sky-950 dark:bg-sky-950/40 dark:text-sky-200 border-sky-300 dark:border-sky-700/50',
    dot: 'bg-sky-400',
  },
  {
    name: 'Rose',
    class: 'bg-rose-100 text-rose-950 dark:bg-rose-950/40 dark:text-rose-200 border-rose-300 dark:border-rose-700/50',
    dot: 'bg-rose-400',
  },
];

export const IdeaBoard: React.FC<IdeaBoardProps> = ({ ideas, setIdeas }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [newIdeaText, setNewIdeaText] = useState('');
  const [newCategory, setNewCategory] = useState('Product Feature');
  const [selectedColorIdx, setSelectedColorIdx] = useState(0);

  const categories = Array.from(new Set(ideas.map((i) => i.category)));

  const filteredIdeas = ideas.filter(
    (i) => selectedCategory === 'all' || i.category === selectedCategory
  );

  const handleVote = (id: string) => {
    setIdeas((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, votes: item.votes + 1 } : item
      )
    );
  };

  const handleDelete = (id: string) => {
    setIdeas((prev) => prev.filter((item) => item.id !== id));
  };

  const handleAddIdea = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newIdeaText.trim()) return;

    const newSticky: StickyIdea = {
      id: `idea-${Date.now()}`,
      content: newIdeaText.trim(),
      author: 'You',
      color: STICKY_COLORS[selectedColorIdx].class,
      votes: 1,
      category: newCategory.trim() || 'General',
      createdAt: Date.now(),
    };

    setIdeas((prev) => [newSticky, ...prev]);
    setNewIdeaText('');
  };

  return (
    <div className="space-y-6">
      {/* Category filter bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-zinc-400" />
          <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
            Categories:
          </span>
          <div className="flex items-center gap-1.5 overflow-x-auto">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1 rounded-xl text-xs font-medium whitespace-nowrap transition-colors ${
                selectedCategory === 'all'
                  ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900'
                  : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400'
              }`}
            >
              All ({ideas.length})
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-xl text-xs font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === cat
                    ? 'bg-indigo-600 text-white'
                    : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="text-xs text-zinc-500 dark:text-zinc-400 flex items-center gap-1">
          <Sparkles className="h-3.5 w-3.5 text-amber-500" />
          <span>Click upvote on ideas you love</span>
        </div>
      </div>

      {/* Post new sticky input bar */}
      <form
        onSubmit={handleAddIdea}
        className="rounded-2xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900 p-4 shadow-sm"
      >
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={newIdeaText}
            onChange={(e) => setNewIdeaText(e.target.value)}
            placeholder="Post a quick brainstorm concept, hypothesis, or feature spark..."
            className="flex-1 px-4 py-2.5 text-sm bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-zinc-900 dark:text-white"
          />

          <input
            type="text"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder="Category tag"
            className="w-full sm:w-44 px-3 py-2.5 text-xs bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-zinc-900 dark:text-white outline-none"
          />

          {/* Color picker */}
          <div className="flex items-center gap-1.5 self-center sm:self-auto">
            {STICKY_COLORS.map((c, i) => (
              <button
                key={c.name}
                type="button"
                onClick={() => setSelectedColorIdx(i)}
                className={`h-7 w-7 rounded-full ${c.dot} transition-transform ${
                  selectedColorIdx === i
                    ? 'ring-2 ring-offset-2 ring-indigo-500 scale-110'
                    : 'opacity-70 hover:opacity-100'
                }`}
                title={c.name}
              />
            ))}
          </div>

          <button
            type="submit"
            className="flex items-center justify-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-semibold text-white shadow hover:bg-indigo-700 transition-colors whitespace-nowrap"
          >
            <Send className="h-3.5 w-3.5" />
            <span>Pin Idea</span>
          </button>
        </div>
      </form>

      {/* Sticky Notes Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredIdeas.map((idea) => (
          <div
            key={idea.id}
            className={`group flex flex-col justify-between rounded-2xl border p-4 shadow-sm hover:shadow-md transition-all rotate-[-0.5deg] hover:rotate-0 duration-200 ${idea.color}`}
          >
            <div>
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-black/10 dark:border-white/10 text-xs">
                <span className="font-semibold uppercase tracking-wider text-[10px] opacity-75">
                  {idea.category}
                </span>
                <button
                  onClick={() => handleDelete(idea.id)}
                  className="opacity-0 group-hover:opacity-100 p-0.5 rounded text-current hover:text-rose-600 transition-opacity"
                  title="Remove sticky"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>

              <p className="text-xs sm:text-sm font-medium leading-relaxed">
                "{idea.content}"
              </p>
            </div>

            <div className="mt-4 pt-2.5 border-t border-black/10 dark:border-white/10 flex items-center justify-between text-xs">
              <span className="opacity-75 text-[11px]">By {idea.author}</span>

              <button
                onClick={() => handleVote(idea.id)}
                className="flex items-center gap-1.5 rounded-lg bg-black/5 dark:bg-white/10 px-2 py-1 font-semibold hover:bg-black/10 dark:hover:bg-white/20 transition-all text-xs"
                title="Upvote idea"
              >
                <ThumbsUp className="h-3 w-3" />
                <span>{idea.votes}</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
