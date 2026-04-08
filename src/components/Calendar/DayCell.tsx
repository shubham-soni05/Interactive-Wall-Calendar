import React from 'react';
import { 
  format, 
  isSameMonth, 
  isSameDay, 
  isToday, 
  isWithinInterval, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval,
  isBefore,
  isAfter,
  parseISO,
  isWeekend
} from 'date-fns';
import { cn } from '@/src/utils/cn';
import { motion, AnimatePresence } from 'motion/react';
import { StickyNote } from 'lucide-react';

import { type Note, type NoteCategory, type Holiday } from '@/src/App';

const CATEGORY_COLORS: Record<NoteCategory, string> = {
  personal: '#3b82f6', // blue-500
  work: '#f59e0b',     // amber-500
  event: '#10b981',    // emerald-500
  important: '#f43f5e', // rose-500
};

interface DayCellProps {
  key?: string;
  date: Date;
  currentMonth: Date;
  rangeStart: Date | null;
  rangeEnd: Date | null;
  hoverDate: Date | null;
  onDateClick: (date: Date) => void;
  onMouseEnter: (date: Date) => void;
  holiday?: Holiday;
  notes: Note[];
  isDarkMode: boolean;
}

export function DayCell({
  date,
  currentMonth,
  rangeStart,
  rangeEnd,
  hoverDate,
  onDateClick,
  onMouseEnter,
  holiday,
  notes,
  isDarkMode
}: DayCellProps) {
  const [showMobileTooltip, setShowMobileTooltip] = React.useState(false);
  const [isHovered, setIsHovered] = React.useState(false);

  const isCurrentMonth = isSameMonth(date, currentMonth);
  const isTodayDate = isToday(date);
  const isStart = rangeStart && isSameDay(date, rangeStart);
  const isEnd = rangeEnd && isSameDay(date, rangeEnd);
  
  const dateStr = format(date, 'yyyy-MM-dd');
  const dayNotes = notes.filter(note => {
    if (note.type === 'day') return note.date === dateStr;
    if (note.type === 'range' && note.range) {
      return dateStr >= note.range.start && dateStr <= note.range.end;
    }
    return false;
  });

  const hasNote = dayNotes.length > 0;
  let isInRange = false;
  if (rangeStart && rangeEnd) {
    const start = isBefore(rangeStart, rangeEnd) ? rangeStart : rangeEnd;
    const end = isAfter(rangeEnd, rangeStart) ? rangeEnd : rangeStart;
    isInRange = isWithinInterval(date, { start, end });
  } else if (rangeStart && hoverDate) {
    const start = isBefore(rangeStart, hoverDate) ? rangeStart : hoverDate;
    const end = isAfter(hoverDate, rangeStart) ? hoverDate : rangeStart;
    isInRange = isWithinInterval(date, { start, end });
  }

  const handleInteraction = (e: React.MouseEvent | React.TouchEvent) => {
    if ('touches' in e) {
      if (holiday || hasNote) {
        setShowMobileTooltip(!showMobileTooltip);
      }
    }
    onDateClick(date);
  };

  return (
    <div
      className={cn(
        "relative h-16 md:h-24 flex flex-col p-2 transition-all duration-300 group cursor-pointer rounded-2xl",
        isDarkMode 
          ? cn(
              !isCurrentMonth && "opacity-20",
              isInRange && "bg-calendar-primary/10",
              (isStart || isEnd) && "bg-calendar-primary text-calendar-contrast z-10 shadow-lg shadow-calendar-primary/20"
            )
          : cn(
              !isCurrentMonth && "opacity-20",
              isInRange && "bg-calendar-primary/15",
              (isStart || isEnd) && "bg-calendar-primary text-calendar-contrast z-10 shadow-lg shadow-calendar-primary/20"
            ),
        isTodayDate && !isStart && !isEnd && (
          isDarkMode 
            ? "border-2 border-zinc-700 bg-zinc-900/50" 
            : "border-2 border-zinc-200 bg-white shadow-sm"
        )
      )}
      onClick={handleInteraction}
      onMouseEnter={() => {
        onMouseEnter(date);
        setIsHovered(true);
      }}
      onMouseLeave={() => {
        setIsHovered(false);
        setShowMobileTooltip(false);
      }}
    >
      <div className="flex justify-between items-start">
        <span className={cn(
          "text-sm md:text-lg font-bold",
          isTodayDate && !isStart && !isEnd && (isDarkMode ? "text-zinc-100" : "text-zinc-900"),
          (isStart || isEnd) && "text-calendar-contrast",
          isWeekend(date) && !isStart && !isEnd && !isTodayDate && "text-calendar-primary"
        )}>
          {format(date, 'd')}
        </span>
        
        <div className="flex flex-col items-end gap-1">
          {holiday && isCurrentMonth && (
            <div 
              className={cn(
                "w-1.5 h-1.5 rounded-full shadow-sm",
                holiday.type === 'festival' ? "bg-amber-500" : "bg-calendar-primary"
              )} 
            />
          )}
          {hasNote && isCurrentMonth && (
            <div className="grid grid-cols-2 gap-0.5 justify-items-end">
              {dayNotes.slice(0, 4).map((note) => (
                <div 
                  key={note.id}
                  className={cn(
                    "w-2 h-2 rounded-full ring-1 shadow-sm",
                    isDarkMode ? "ring-zinc-950" : "ring-white"
                  )}
                  style={{ backgroundColor: note.color || CATEGORY_COLORS[note.category] }}
                />
              ))}
              {dayNotes.length > 4 && (
                <div className={cn("text-[8px] font-bold leading-none flex items-center justify-center", isDarkMode ? "text-zinc-500" : "text-zinc-400")}>
                  +{dayNotes.length - 4}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      
      {/* Tooltip Preview (Desktop Hover & Mobile Tap) */}
      <AnimatePresence>
        {(isHovered || showMobileTooltip) && (hasNote || holiday) && isCurrentMonth && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-64 z-50 pointer-events-none"
          >
            <div className={cn(
              "p-4 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.2)] border backdrop-blur-xl",
              isDarkMode ? "bg-zinc-900/95 border-zinc-800" : "bg-white/95 border-zinc-200"
            )}>
              <div className="space-y-4">
                {holiday && (
                  <div className={cn("pb-3 border-b", isDarkMode ? "border-zinc-800" : "border-zinc-100")}>
                    <div className="flex items-center gap-2 mb-1">
                      <div className={cn("w-2 h-2 rounded-full", holiday.type === 'festival' ? "bg-amber-500" : "bg-calendar-primary")} />
                      <span className={cn("text-xs font-black uppercase tracking-wider", isDarkMode ? "text-zinc-100" : "text-zinc-900")}>
                        {holiday.name}
                      </span>
                    </div>
                    <span className="text-[9px] font-bold uppercase tracking-[0.2em] opacity-40">
                      {holiday.type} Holiday
                    </span>
                  </div>
                )}
                
                {hasNote && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className={cn("text-[9px] font-bold uppercase tracking-[0.2em] opacity-40", isDarkMode ? "text-zinc-500" : "text-zinc-400")}>
                        Events & Notes
                      </span>
                      <StickyNote className={cn("w-3 h-3 opacity-20", isDarkMode ? "text-zinc-100" : "text-zinc-900")} />
                    </div>
                    <div className="space-y-3">
                      {dayNotes.slice(0, 3).map((note) => (
                        <div key={note.id} className="space-y-1">
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-1.5 h-1.5 rounded-full" 
                              style={{ backgroundColor: note.color || CATEGORY_COLORS[note.category] }} 
                            />
                            {note.title && (
                              <span className={cn("text-xs font-bold truncate", isDarkMode ? "text-zinc-200" : "text-zinc-900")}>
                                {note.title}
                              </span>
                            )}
                          </div>
                          <p className={cn("text-[11px] line-clamp-2 leading-relaxed pl-3.5", isDarkMode ? "text-zinc-400" : "text-zinc-500")}>
                            {note.text}
                          </p>
                        </div>
                      ))}
                    </div>
                    {dayNotes.length > 3 && (
                      <p className={cn("text-[9px] font-bold uppercase tracking-widest text-center pt-2 border-t", isDarkMode ? "border-zinc-800 text-zinc-600" : "border-zinc-100 text-zinc-400")}>
                        + {dayNotes.length - 3} more events
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
