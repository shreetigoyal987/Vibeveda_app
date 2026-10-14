import React, { useState } from 'react';
import { 
  Plus, 
  Trash2, 
  Pin, 
  Search, 
  Copy, 
  Check, 
  FileText,
  Edit3
} from 'lucide-react';
import { Note } from '../types.ts';

interface NotesPadProps {
  notes: Note[];
  setNotes: React.Dispatch<React.SetStateAction<Note[]>>;
}

const COLOR_PRESETS = [
  { label: 'Amber Warmth', value: 'from-amber-500/10 to-orange-500/10 border-amber-500/30' },
  { label: 'Indigo Focus', value: 'from-indigo-500/10 to-blue-500/10 border-indigo-500/30' },
  { label: 'Emerald Mint', value: 'from-emerald-500/10 to-teal-500/10 border-emerald-500/30' },
  { label: 'Rose Blush', value: 'from-rose-500/10 to-pink-500/10 border-rose-500/30' },
  { label: 'Violet Dream', value: 'from-purple-500/10 to-indigo-500/10 border-purple-500/30' },
];

export const NotesPad: React.FC<NotesPadProps> = ({ notes, setNotes }) => {
  const [search, setSearch] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form states
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [noteTags, setNoteTags] = useState('Ideas');
  const [noteColor, setNoteColor] = useState(COLOR_PRESETS[0].value);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Collect all unique tags
  const allTags = Array.from(new Set(notes.flatMap((n) => n.tags)));

  const filteredNotes = notes.filter((n) => {
    const matchesSearch =
      n.title.toLowerCase().includes(search.toLowerCase()) ||
      n.content.toLowerCase().includes(search.toLowerCase());
    const matchesTag = selectedTag === 'all' || n.tags.includes(selectedTag);
    return matchesSearch && matchesTag;
  });

  const sortedNotes = [...filteredNotes].sort((a, b) => {
    if (a.pinned === b.pinned) return b.updatedAt - a.updatedAt;
    return a.pinned ? -1 : 1;
  });

  const handleSaveNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteTitle.trim() && !noteContent.trim()) return;

    if (editingId) {
      setNotes((prev) =>
        prev.map((n) =>
          n.id === editingId
            ? {
                ...n,
                title: noteTitle.trim() || 'Untitled Note',
                content: noteContent,
                tags: noteTags.split(',').map((t) => t.trim()).filter(Boolean),
                color: noteColor,
                updatedAt: Date.now(),
              }
            : n
        )
      );
    } else {
      const newNote: Note = {
        id: `note-${Date.now()}`,
        title: noteTitle.trim() || 'Untitled Note',
        content: noteContent,
        color: noteColor,
        pinned: false,
        tags: noteTags.split(',').map((t) => t.trim()).filter(Boolean),
        updatedAt: Date.now(),
      };
      setNotes((prev) => [newNote, ...prev]);
    }

    resetForm();
  };

  const startEdit = (note: Note) => {
    setEditingId(note.id);
    setNoteTitle(note.title);
    setNoteContent(note.content);
    setNoteTags(note.tags.join(', '));
    setNoteColor(note.color);
    setIsCreating(true);
  };

  const resetForm = () => {
    setIsCreating(false);
    setEditingId(null);
    setNoteTitle('');
    setNoteContent('');
    setNoteTags('Ideas');
    setNoteColor(COLOR_PRESETS[0].value);
  };

  const togglePin = (id: string) => {
    setNotes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, pinned: !n.pinned } : n))
    );
  };

  const deleteNote = (id: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
  };

  const copyNoteContent = (note: Note) => {
    navigator.clipboard.writeText(`${note.title}\n\n${note.content}`);
    setCopiedId(note.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Search & Actions Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search notes by keywords..."
            className="w-full pl-9 pr-4 py-2 text-sm bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-zinc-900 dark:text-zinc-100"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setSelectedTag('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-colors ${
              selectedTag === 'all'
                ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900'
                : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400'
            }`}
          >
            All Tags
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-colors ${
                selectedTag === tag
                  ? 'bg-indigo-600 text-white'
                  : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400'
              }`}
            >
              #{tag}
            </button>
          ))}

          <button
            onClick={() => {
              resetForm();
              setIsCreating(true);
            }}
            className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-3.5 py-2 text-xs font-semibold text-white shadow hover:bg-indigo-700 transition-colors whitespace-nowrap ml-auto"
          >
            <Plus className="h-4 w-4" />
            <span>New Note</span>
          </button>
        </div>
      </div>

      {/* Create / Edit Note Form */}
      {isCreating && (
        <form
          onSubmit={handleSaveNote}
          className="rounded-2xl border border-indigo-200 bg-white dark:border-indigo-900/60 dark:bg-zinc-900 p-5 shadow-lg space-y-4"
        >
          <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3">
            <h3 className="text-sm font-bold text-zinc-900 dark:text-white flex items-center gap-2">
              <FileText className="h-4 w-4 text-indigo-500" />
              {editingId ? 'Edit Scratchpad Note' : 'Draft New Note'}
            </h3>
            <button
              type="button"
              onClick={resetForm}
              className="text-xs text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
            >
              Cancel
            </button>
          </div>

          <div className="space-y-3">
            <input
              type="text"
              value={noteTitle}
              onChange={(e) => setNoteTitle(e.target.value)}
              placeholder="Note Title..."
              className="w-full text-base font-semibold px-3 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-zinc-900 dark:text-white"
            />

            <textarea
              rows={4}
              value={noteContent}
              onChange={(e) => setNoteContent(e.target.value)}
              placeholder="Type your markdown notes, bullet points, checklists, or insights..."
              className="w-full px-3 py-2 text-sm font-sans bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-zinc-900 dark:text-white"
            />

            <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
              {/* Color style selector */}
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-zinc-500 dark:text-zinc-400 mr-1">
                  Accent:
                </span>
                {COLOR_PRESETS.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setNoteColor(preset.value)}
                    className={`h-6 w-6 rounded-full border-2 transition-transform ${
                      idx === 0
                        ? 'bg-amber-400'
                        : idx === 1
                        ? 'bg-indigo-400'
                        : idx === 2
                        ? 'bg-emerald-400'
                        : idx === 3
                        ? 'bg-rose-400'
                        : 'bg-purple-400'
                    } ${
                      noteColor === preset.value
                        ? 'scale-110 border-zinc-900 dark:border-white shadow-sm'
                        : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                    title={preset.label}
                  />
                ))}
              </div>

              {/* Tags */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-zinc-500 dark:text-zinc-400">Tags:</span>
                <input
                  type="text"
                  value={noteTags}
                  onChange={(e) => setNoteTags(e.target.value)}
                  placeholder="Design, Tech"
                  className="px-2.5 py-1 text-xs bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-white outline-none"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-zinc-100 dark:border-zinc-800">
            <button
              type="button"
              onClick={resetForm}
              className="px-4 py-2 text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 shadow"
            >
              {editingId ? 'Update Note' : 'Save to Scratchpad'}
            </button>
          </div>
        </form>
      )}

      {/* Notes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sortedNotes.length === 0 ? (
          <div className="col-span-full flex h-48 flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-200 dark:border-zinc-800 p-6 text-center">
            <FileText className="h-8 w-8 text-zinc-300 dark:text-zinc-600 mb-2" />
            <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
              No notes found
            </p>
            <p className="text-xs text-zinc-400 mt-0.5">
              Draft your first thought or idea above.
            </p>
          </div>
        ) : (
          sortedNotes.map((note) => (
            <div
              key={note.id}
              className={`group flex flex-col justify-between rounded-2xl border bg-gradient-to-br p-4 shadow-sm transition-all hover:shadow-md ${note.color} bg-white dark:bg-zinc-900`}
            >
              <div>
                {/* Note Header: Pin & Actions */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 line-clamp-1">
                    {note.title}
                  </h4>
                  <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => togglePin(note.id)}
                      className={`p-1 rounded hover:bg-black/5 dark:hover:bg-white/10 ${
                        note.pinned
                          ? 'text-amber-500 dark:text-amber-400'
                          : 'text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200'
                      }`}
                      title={note.pinned ? 'Unpin' : 'Pin to top'}
                    >
                      <Pin className="h-3.5 w-3.5 fill-current" />
                    </button>
                    <button
                      onClick={() => startEdit(note)}
                      className="p-1 rounded text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-black/5 dark:hover:bg-white/10"
                      title="Edit note"
                    >
                      <Edit3 className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => copyNoteContent(note)}
                      className="p-1 rounded text-zinc-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-black/5 dark:hover:bg-white/10"
                      title="Copy note text"
                    >
                      {copiedId === note.id ? (
                        <Check className="h-3.5 w-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                    </button>
                    <button
                      onClick={() => deleteNote(note.id)}
                      className="p-1 rounded text-zinc-400 hover:text-rose-600 hover:bg-black/5 dark:hover:bg-white/10"
                      title="Delete note"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                {/* Content */}
                <p className="text-xs text-zinc-600 dark:text-zinc-300 whitespace-pre-line leading-relaxed">
                  {note.content}
                </p>
              </div>

              {/* Footer: Tags & Time */}
              <div className="mt-4 pt-2 border-t border-black/5 dark:border-white/5 flex items-center justify-between text-[11px] text-zinc-400">
                <div className="flex flex-wrap gap-1">
                  {note.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="rounded bg-black/5 dark:bg-white/10 px-1.5 py-0.5 font-medium text-zinc-600 dark:text-zinc-300 text-[10px]"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
                <span>
                  {new Date(note.updatedAt).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
