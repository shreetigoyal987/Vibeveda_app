import React, { useState } from 'react';
import { 
  Plus, 
  Trash2, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  Tag,
  Search,
  SlidersHorizontal,
  X
} from 'lucide-react';
import { Task, Priority } from '../types.ts';

interface TaskBoardProps {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
}

const COLUMNS: { id: Task['status']; title: string; color: string; dotColor: string }[] = [
  { id: 'todo', title: 'To Do', color: 'border-zinc-200 dark:border-zinc-800', dotColor: 'bg-zinc-400' },
  { id: 'in_progress', title: 'In Progress', color: 'border-indigo-200 dark:border-indigo-900/60', dotColor: 'bg-indigo-500' },
  { id: 'review', title: 'In Review', color: 'border-amber-200 dark:border-amber-900/60', dotColor: 'bg-amber-500' },
  { id: 'done', title: 'Completed', color: 'border-emerald-200 dark:border-emerald-900/60', dotColor: 'bg-emerald-500' },
];

export const TaskBoard: React.FC<TaskBoardProps> = ({ tasks, setTasks }) => {
  const [search, setSearch] = useState('');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');
  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newPriority, setNewPriority] = useState<Priority>('medium');
  const [newTags, setNewTags] = useState('Feature');
  const [targetColumn, setTargetColumn] = useState<Task['status']>('todo');

  const filteredTasks = tasks.filter((t) => {
    const matchesSearch =
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.description?.toLowerCase().includes(search.toLowerCase()) ||
      t.tags.some((tag) => tag.toLowerCase().includes(search.toLowerCase()));
    const matchesPriority =
      selectedPriority === 'all' || t.priority === selectedPriority;
    return matchesSearch && matchesPriority;
  });

  const moveTask = (taskId: string, direction: 'forward' | 'backward') => {
    const statusOrder: Task['status'][] = ['todo', 'in_progress', 'review', 'done'];
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== taskId) return t;
        const currentIndex = statusOrder.indexOf(t.status);
        const nextIndex =
          direction === 'forward'
            ? Math.min(currentIndex + 1, statusOrder.length - 1)
            : Math.max(currentIndex - 1, 0);
        return { ...t, status: statusOrder[nextIndex] };
      })
    );
  };

  const deleteTask = (taskId: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const task: Task = {
      id: `task-${Date.now()}`,
      title: newTitle.trim(),
      description: newDesc.trim() || undefined,
      status: targetColumn,
      priority: newPriority,
      tags: newTags
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      createdAt: Date.now(),
    };

    setTasks((prev) => [task, ...prev]);
    setNewTitle('');
    setNewDesc('');
    setIsAdding(false);
  };

  const getPriorityBadge = (priority: Priority) => {
    switch (priority) {
      case 'urgent':
        return (
          <span className="flex items-center gap-1 rounded bg-rose-100 dark:bg-rose-950/70 text-rose-700 dark:text-rose-300 text-[10px] font-bold px-1.5 py-0.5">
            <AlertCircle className="h-2.5 w-2.5" /> Urgent
          </span>
        );
      case 'high':
        return (
          <span className="flex items-center gap-1 rounded bg-orange-100 dark:bg-orange-950/70 text-orange-700 dark:text-orange-300 text-[10px] font-bold px-1.5 py-0.5">
            High
          </span>
        );
      case 'medium':
        return (
          <span className="flex items-center gap-1 rounded bg-blue-100 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 text-[10px] font-semibold px-1.5 py-0.5">
            Medium
          </span>
        );
      case 'low':
        return (
          <span className="flex items-center gap-1 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 text-[10px] font-medium px-1.5 py-0.5">
            Low
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Top action bar: Search & Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tasks by title, description or tag..."
            className="w-full pl-9 pr-4 py-2 text-sm bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-zinc-900 dark:text-zinc-100"
          />
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400">
            <SlidersHorizontal className="h-3.5 w-3.5" />
            <span>Priority:</span>
          </div>
          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="px-2.5 py-1.5 text-xs font-medium bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-zinc-800 dark:text-zinc-200 focus:outline-none"
          >
            <option value="all">All Priorities</option>
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>

          <button
            onClick={() => {
              setTargetColumn('todo');
              setIsAdding(true);
            }}
            className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-3.5 py-2 text-xs font-semibold text-white shadow hover:bg-indigo-700 transition-colors whitespace-nowrap"
          >
            <Plus className="h-4 w-4" />
            <span>Add Task</span>
          </button>
        </div>
      </div>

      {/* New Task Modal */}
      {isAdding && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
              <h3 className="text-base font-bold text-zinc-900 dark:text-white">
                Create New Task
              </h3>
              <button
                onClick={() => setIsAdding(false)}
                className="rounded-lg p-1 text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  Task Title *
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Implement checkout analytics"
                  className="w-full px-3 py-2 text-sm bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-zinc-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Additional context or acceptance criteria..."
                  className="w-full px-3 py-2 text-sm bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-zinc-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                    Priority
                  </label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as Priority)}
                    className="w-full px-3 py-2 text-xs bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-zinc-900 dark:text-white outline-none"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                    Initial Column
                  </label>
                  <select
                    value={targetColumn}
                    onChange={(e) => setTargetColumn(e.target.value as Task['status'])}
                    className="w-full px-3 py-2 text-xs bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-zinc-900 dark:text-white outline-none"
                  >
                    <option value="todo">To Do</option>
                    <option value="in_progress">In Progress</option>
                    <option value="review">In Review</option>
                    <option value="done">Completed</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  value={newTags}
                  onChange={(e) => setNewTags(e.target.value)}
                  placeholder="UI, Frontend, Performance"
                  className="w-full px-3 py-2 text-sm bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-zinc-900 dark:text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="px-4 py-2 text-xs font-medium rounded-xl text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 shadow"
                >
                  Add Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Kanban Board Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {COLUMNS.map((col) => {
          const colTasks = filteredTasks.filter((t) => t.status === col.id);

          return (
            <div
              key={col.id}
              className={`flex flex-col rounded-2xl border ${col.color} bg-zinc-50/70 dark:bg-zinc-900/50 p-3 min-h-[480px]`}
            >
              {/* Column Header */}
              <div className="flex items-center justify-between pb-3 px-1">
                <div className="flex items-center gap-2">
                  <span className={`h-2.5 w-2.5 rounded-full ${col.dotColor}`} />
                  <h4 className="text-sm font-bold text-zinc-800 dark:text-zinc-100">
                    {col.title}
                  </h4>
                  <span className="rounded-full bg-zinc-200/80 dark:bg-zinc-800 px-2 py-0.5 text-[11px] font-semibold text-zinc-700 dark:text-zinc-300">
                    {colTasks.length}
                  </span>
                </div>
                <button
                  onClick={() => {
                    setTargetColumn(col.id);
                    setIsAdding(true);
                  }}
                  className="rounded-lg p-1 text-zinc-400 hover:bg-zinc-200/60 dark:hover:bg-zinc-800 hover:text-zinc-700 dark:hover:text-zinc-200"
                  title={`Add task to ${col.title}`}
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>

              {/* Task Cards List */}
              <div className="flex-1 space-y-3 overflow-y-auto">
                {colTasks.length === 0 ? (
                  <div className="flex h-36 flex-col items-center justify-center rounded-xl border border-dashed border-zinc-200 dark:border-zinc-800 text-center p-3">
                    <p className="text-xs text-zinc-400 dark:text-zinc-500">
                      No tasks in this lane
                    </p>
                  </div>
                ) : (
                  colTasks.map((task) => (
                    <div
                      key={task.id}
                      className="group relative rounded-xl border border-zinc-200/90 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-3.5 shadow-sm hover:shadow-md transition-all"
                    >
                      {/* Priority & Delete */}
                      <div className="flex items-center justify-between gap-2 mb-2">
                        {getPriorityBadge(task.priority)}
                        <button
                          onClick={() => deleteTask(task.id)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-zinc-400 hover:text-rose-600 rounded"
                          title="Delete task"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>

                      {/* Title */}
                      <h5 className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 leading-snug">
                        {task.title}
                      </h5>

                      {/* Description */}
                      {task.description && (
                        <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2">
                          {task.description}
                        </p>
                      )}

                      {/* Tags */}
                      {task.tags.length > 0 && (
                        <div className="mt-2.5 flex flex-wrap gap-1">
                          {task.tags.map((tag, i) => (
                            <span
                              key={i}
                              className="rounded-md bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 text-[10px] font-medium text-zinc-600 dark:text-zinc-400"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Move Controls */}
                      <div className="mt-3 pt-2.5 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between">
                        <button
                          disabled={task.status === 'todo'}
                          onClick={() => moveTask(task.id, 'backward')}
                          className={`flex items-center gap-1 text-[11px] font-medium ${
                            task.status === 'todo'
                              ? 'text-zinc-300 dark:text-zinc-700 cursor-not-allowed'
                              : 'text-zinc-500 hover:text-indigo-600 dark:text-zinc-400 dark:hover:text-indigo-400'
                          }`}
                        >
                          <ArrowLeft className="h-3 w-3" /> Prev
                        </button>

                        <button
                          disabled={task.status === 'done'}
                          onClick={() => moveTask(task.id, 'forward')}
                          className={`flex items-center gap-1 text-[11px] font-medium ${
                            task.status === 'done'
                              ? 'text-zinc-300 dark:text-zinc-700 cursor-not-allowed'
                              : 'text-zinc-500 hover:text-indigo-600 dark:text-zinc-400 dark:hover:text-indigo-400'
                          }`}
                        >
                          Next <ArrowRight className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
