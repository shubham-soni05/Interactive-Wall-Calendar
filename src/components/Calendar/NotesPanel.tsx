import React, { useState, useMemo } from 'react';
import { format, isSameDay, isWithinInterval, isBefore, isAfter } from 'date-fns';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Trash2, StickyNote, Edit2, X, Check, Palette } from 'lucide-react';
import { cn } from '@/src/utils/cn';
import { type Note, type NoteCategory } from '@/src/App';
import { generatePalette } from '@/src/utils/theme';

interface NotesPanelProps {
  currentDate: Date;
  rangeStart: Date | null;
  rangeEnd: Date | null;
  notes: Note[];
  onAddNote: (text: string, title?: string, category?: NoteCategory, color?: string) => void;
  onUpdateNote: (id: string, updates: Partial<Note>) => void;
  onDeleteNote: (id: string) => void;
  isDarkMode: boolean;
  theme: any;
  className?: string;
}

const CATEGORIES: { value: NoteCategory; label: string; color: string }[] = [
  { value: 'personal', label: 'Personal', color: '#3b82f6' },
  { value: 'work', label: 'Work', color: '#f59e0b' },
  { value: 'event', label: 'Event', color: '#10b981' },
  { value: 'important', label: 'Important', color: '#f43f5e' },
];

export function NotesPanel({
  currentDate,
  rangeStart,
  rangeEnd,
  notes,
  onAddNote,
  onUpdateNote,
  onDeleteNote,
  isDarkMode,
  theme,
  className
}: NotesPanelProps) {
  const [newNote, setNewNote] = useState('');
  const [noteTitle, setNoteTitle] = useState('');
  const [category, setCategory] = useState<NoteCategory>('personal');
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  const palette = useMemo(() => generatePalette(theme.primary), [theme.primary]);

  const filteredNotes = notes.filter(note => {
    const monthStr = format(currentDate, 'yyyy-MM');
    if (note.type === 'month') {
      return note.date.startsWith(monthStr);
    }
    if (note.type === 'day') {
      return note.date.startsWith(monthStr);
    }
    if (note.type === 'range' && note.range) {
      return note.range.start.startsWith(monthStr) || note.range.end.startsWith(monthStr);
    }
    return false;
  }).sort((a, b) => {
    // Month notes first
    if (a.type === 'month' && b.type !== 'month') return -1;
    if (a.type !== 'month' && b.type === 'month') return 1;
    
    // Then sort by date
    const dateA = a.type === 'range' ? a.range!.start : a.date;
    const dateB = b.type === 'range' ? b.range!.start : b.date;
    return dateA.localeCompare(dateB);
  });

  const getNoteLabel = (note: Note) => {
    if (note.type === 'month') return 'Month Note';
    if (note.type === 'day') return format(new Date(note.date), 'MMM d');
    if (note.type === 'range' && note.range) {
      return `${format(new Date(note.range.start), 'MMM d')} - ${format(new Date(note.range.end), 'MMM d')}`;
    }
    return '';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newNote.trim()) {
      if (editingId) {
        onUpdateNote(editingId, { 
          text: newNote, 
          title: noteTitle || undefined, 
          category,
          color: selectedColor || undefined
        });
        setEditingId(null);
      } else {
        onAddNote(newNote, noteTitle || undefined, category, selectedColor || undefined);
      }
      setNewNote('');
      setNoteTitle('');
      setCategory('personal');
      setSelectedColor(null);
    }
  };

  const startEditing = (note: Note) => {
    setEditingId(note.id);
    setNewNote(note.text);
    setNoteTitle(note.title || '');
    setCategory(note.category);
    setSelectedColor(note.color || null);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setNewNote('');
    setNoteTitle('');
    setCategory('personal');
    setSelectedColor(null);
  };

  return (
    <div className={cn(
      "w-full lg:w-80 border-l flex flex-col h-full",
      isDarkMode ? "border-zinc-800 bg-zinc-950" : "border-zinc-200/50 bg-white",
      className
    )}>
      <div className={cn("p-8 border-b", isDarkMode ? "border-zinc-800" : "border-zinc-200/50")}>
        <h2 className={cn("font-serif text-3xl font-black flex items-center gap-3 tracking-tighter", isDarkMode ? "text-zinc-100" : "text-zinc-900")}>
          <StickyNote className="w-6 h-6 text-calendar-primary" />
          Notes
        </h2>
        <p className={cn("text-[9px] mt-2 uppercase tracking-[0.4em] font-bold opacity-40", isDarkMode ? "text-zinc-100" : "text-zinc-900")}>
          {rangeStart && rangeEnd 
            ? `Range: ${format(rangeStart, 'MMM d')} - ${format(rangeEnd, 'MMM d')}`
            : rangeStart 
            ? `Date: ${format(rangeStart, 'MMMM d')}`
            : `Month: ${format(currentDate, 'MMMM yyyy')}`
          }
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        <AnimatePresence mode="popLayout">
          {filteredNotes.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <div className={cn("w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-dashed", isDarkMode ? "bg-zinc-900/50 border-zinc-800" : "bg-zinc-50/50 border-zinc-200/50")}>
                <Plus className={cn("w-8 h-8", isDarkMode ? "text-zinc-700" : "text-zinc-300")} />
              </div>
              <p className={cn("text-xs italic font-serif", isDarkMode ? "text-zinc-600" : "text-zinc-400")}>No notes for this selection yet.</p>
            </motion.div>
          ) : (
            filteredNotes.map((note) => {
              const isSelected = (
                (note.type === 'month' && !rangeStart) ||
                (note.type === 'day' && rangeStart && !rangeEnd && note.date === format(rangeStart, 'yyyy-MM-dd')) ||
                (note.type === 'range' && rangeStart && rangeEnd && note.range?.start === format(isBefore(rangeStart, rangeEnd) ? rangeStart : rangeEnd, 'yyyy-MM-dd') && note.range?.end === format(isAfter(rangeEnd, rangeStart) ? rangeEnd : rangeStart, 'yyyy-MM-dd'))
              );

              return (
                <motion.div
                  key={note.id}
                  layout
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className={cn(
                    "group relative p-4 rounded-xl paper-shadow border transition-all duration-300",
                    isDarkMode 
                      ? cn("bg-zinc-800 border-zinc-700", isSelected && "ring-2 ring-calendar-primary/20 border-calendar-primary/50") 
                      : cn("bg-white border-zinc-100", isSelected && "ring-2 ring-calendar-primary/5 border-calendar-medium")
                  )}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-2 h-2 rounded-full" 
                        style={{ backgroundColor: note.color || CATEGORIES.find(c => c.value === note.category)?.color }} 
                      />
                      <span className={cn(
                        "text-[10px] font-bold uppercase tracking-widest",
                        isDarkMode ? "text-zinc-500" : "text-zinc-400"
                      )}>
                        {getNoteLabel(note)}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => startEditing(note)}
                        className={cn(
                          "p-1 rounded transition-colors",
                          isDarkMode ? "text-zinc-600 hover:text-zinc-300" : "text-zinc-300 hover:text-zinc-600"
                        )}
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onDeleteNote(note.id)}
                        className={cn(
                          "p-1 rounded transition-colors",
                          isDarkMode ? "text-zinc-600 hover:text-red-400" : "text-zinc-300 hover:text-red-500"
                        )}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  {note.title && (
                    <h4 className={cn("text-sm font-bold mb-1", isDarkMode ? "text-zinc-200" : "text-zinc-900")}>
                      {note.title}
                    </h4>
                  )}
                  <p className={cn("text-sm leading-relaxed", isDarkMode ? "text-zinc-300" : "text-zinc-600")}>{note.text}</p>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>

      <form onSubmit={handleSubmit} className={cn("p-8 border-t space-y-6", isDarkMode ? "border-zinc-800" : "border-zinc-200/50")}>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className={cn("text-[9px] font-bold uppercase tracking-[0.2em] opacity-40 flex items-center gap-2", isDarkMode ? "text-zinc-100" : "text-zinc-900")}>
              <Palette className="w-3 h-3" />
              Select Color
            </span>
            {editingId && (
              <button
                type="button"
                onClick={cancelEditing}
                className={cn(
                  "text-[10px] font-bold uppercase tracking-widest flex items-center gap-1",
                  isDarkMode ? "text-zinc-500 hover:text-zinc-300" : "text-zinc-400 hover:text-zinc-600"
                )}
              >
                <X className="w-3 h-3" /> Cancel
              </button>
            )}
          </div>
          
          <div className="flex flex-wrap gap-2">
            {palette.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => setSelectedColor(color)}
                className={cn(
                  "w-6 h-6 rounded-full transition-all hover:scale-110 flex items-center justify-center",
                  selectedColor === color ? "ring-2 ring-offset-2 ring-calendar-primary scale-110" : "opacity-60"
                )}
                style={{ backgroundColor: color }}
              >
                {selectedColor === color && <Check className="w-3 h-3 text-white" />}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <input
            type="text"
            value={noteTitle}
            onChange={(e) => setNoteTitle(e.target.value)}
            placeholder="Title (optional)"
            className={cn(
              "w-full border-0 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 transition-all",
              isDarkMode 
                ? "bg-zinc-900/50 text-zinc-100 focus:ring-zinc-100/5" 
                : "bg-zinc-50/50 text-zinc-900 focus:ring-zinc-900/5"
            )}
          />
          <div className="relative">
            <textarea
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              placeholder={editingId ? "Update note..." : "Add a note..."}
              className={cn(
                "w-full border-0 rounded-2xl p-4 pr-14 text-sm focus:outline-none focus:ring-2 transition-all resize-none h-32",
                isDarkMode 
                  ? "bg-zinc-900/50 text-zinc-100 focus:ring-zinc-100/5" 
                  : "bg-zinc-50/50 text-zinc-900 focus:ring-zinc-900/5"
              )}
            />
            <button
              type="submit"
              disabled={!newNote.trim()}
              className={cn(
                "absolute bottom-0 right-0 w-10 h-10 rounded-xl transition-all hover:scale-105 active:scale-95 shadow-lg flex items-center justify-center",
                "bg-calendar-primary text-calendar-contrast hover:bg-calendar-dark disabled:opacity-50 disabled:scale-100 disabled:shadow-none"
              )}
            >
              {editingId ? <Check className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
