import React from 'react';
import { format } from 'date-fns';
import { Note } from '../../App';
import { cn } from '../../utils/cn';

interface GlanceProps {
  currentDate: Date;
  notes: Note[];
  isDarkMode: boolean;
}

export function Glance({ currentDate, notes, isDarkMode }: GlanceProps) {
  const todayStr = format(currentDate, 'yyyy-MM-dd');
  const todayNotes = notes.filter(note => note.date === todayStr);

  return (
    <div className={cn(
      "p-4 rounded-2xl backdrop-blur-md border shadow-lg",
      isDarkMode 
        ? "bg-zinc-900/60 border-zinc-800 text-zinc-100" 
        : "bg-white/60 border-white/50 text-zinc-800"
    )}>
      <h2 className="text-sm font-bold uppercase tracking-widest opacity-60 mb-2">Today at a Glance</h2>
      <p className="text-2xl font-serif font-bold">{format(currentDate, 'EEEE, MMMM d')}</p>
      
      {todayNotes.length > 0 ? (
        <ul className="mt-3 space-y-2">
          {todayNotes.map(note => (
            <li key={note.id} className="text-sm flex items-center gap-2">
              <div className={cn("w-2 h-2 rounded-full", note.category === 'important' ? 'bg-red-500' : 'bg-blue-500')} />
              {note.title || note.text}
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-3 text-sm opacity-50 italic">No events today.</p>
      )}
    </div>
  );
}
