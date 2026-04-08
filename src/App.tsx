import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Moon, Sun } from 'lucide-react';
import { 
  format, 
  addMonths, 
  subMonths, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  isSameMonth, 
  isToday,
  isSameDay,
  isWithinInterval,
  isBefore,
  isAfter
} from 'date-fns';
import { cn } from './utils/cn';
import { NotesPanel } from './components/Calendar/NotesPanel';
import { HeroSection } from './components/Calendar/HeroSection';
import { useLocalStorage } from './hooks/useLocalStorage';
import { extractThemeFromImage, applyThemeToCSS, DEFAULT_THEME, type CalendarTheme } from './utils/theme';

export type NoteCategory = 'personal' | 'work' | 'event' | 'important';

export interface Holiday {
  date: string;
  name: string;
  type: 'festival' | 'public';
}

export interface Note {
  id: string;
  date: string;
  title?: string;
  text: string;
  category: NoteCategory;
  color?: string; // Hex color
  type: 'day' | 'range' | 'month';
  range?: { start: string; end: string };
}

export default function App() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [notes, setNotes] = useState<Note[]>([]);
  const [rangeStart, setRangeStart] = useState<Date | null>(null);
  const [rangeEnd, setRangeEnd] = useState<Date | null>(null);

  const [isDarkMode, setIsDarkMode] = useLocalStorage('calendar-dark-mode', false);
  const [theme, setTheme] = useLocalStorage<CalendarTheme>('calendar-theme', DEFAULT_THEME);
  const [customImage, setCustomImage] = useLocalStorage<string | null>('calendar-image', null);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
    applyThemeToCSS(theme);
  }, [isDarkMode, theme]);

  const handleImageUpload = async (imageUrl: string) => {
    setCustomImage(imageUrl);
    try {
      const newTheme = await extractThemeFromImage(imageUrl);
      setTheme(newTheme);
    } catch (error) {
      console.error('Failed to extract theme:', error);
    }
  };

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

  const handleDateClick = (date: Date) => {
    if (!rangeStart || (rangeStart && rangeEnd)) {
      setRangeStart(date);
      setRangeEnd(null);
    } else {
      if (isSameDay(date, rangeStart)) {
        setRangeStart(null);
        setRangeEnd(null);
      } else {
        setRangeEnd(date);
      }
    }
  };

  const handleAddNote = (text: string, title?: string, category: NoteCategory = 'personal', color?: string) => {
    const newNote: Note = {
      id: Math.random().toString(36).substr(2, 9),
      date: format(rangeStart || currentDate, 'yyyy-MM-dd'),
      title,
      text,
      category,
      color,
      type: rangeStart && rangeEnd ? 'range' : rangeStart ? 'day' : 'month',
      range: rangeStart && rangeEnd ? {
        start: format(isBefore(rangeStart, rangeEnd) ? rangeStart : rangeEnd, 'yyyy-MM-dd'),
        end: format(isAfter(rangeEnd, rangeStart) ? rangeEnd : rangeStart, 'yyyy-MM-dd')
      } : undefined
    };
    setNotes([...notes, newNote]);
  };

  const handleUpdateNote = (id: string, updates: Partial<Note>) => {
    setNotes(notes.map(n => n.id === id ? { ...n, ...updates } : n));
  };

  const handleDeleteNote = (id: string) => {
    setNotes(notes.filter(n => n.id !== id));
  };

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 1 }); // Start on Monday
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const days = eachDayOfInterval({
    start: startDate,
    end: endDate
  });

  const weekDays = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

  return (
    <div className="min-h-screen flex items-center justify-center p-4 md:p-8 transition-colors duration-500">
      <div className="w-full max-w-6xl relative">
        
        {/* Main Calendar Container */}
        <div className="rounded-xl paper-shadow overflow-hidden flex flex-col md:flex-row h-full min-h-[800px] border bg-white dark:bg-zinc-900 border-zinc-200/50 dark:border-zinc-800/50 transition-colors duration-500">
          
          <div className="flex-1 flex flex-col">
            <HeroSection 
              currentDate={currentDate}
              imageUrl={customImage || ''}
              onImageUpload={handleImageUpload}
            />
            
            <div className="p-3 sm:p-6 md:p-8 flex-1 flex flex-col">
              {/* Header Controls */}
              <div className="flex flex-col sm:flex-row items-center justify-between mb-4 md:mb-8 gap-4">
                <div className="flex items-center gap-3 w-full sm:w-auto justify-start">
                  <div className="p-2 md:p-3 rounded-xl bg-calendar-primary flex-shrink-0">
                    <CalendarIcon className="w-5 h-5 md:w-6 md:h-6 text-calendar-contrast" />
                  </div>
                  <div>
                    <h2 className="text-[8px] md:text-[10px] font-bold uppercase tracking-widest md:tracking-[0.4em] opacity-40 leading-tight">
                      Interactive<br/>Wall Calendar
                    </h2>
                  </div>
                </div>
                
                <div className="flex items-center justify-between w-full sm:w-auto gap-2 md:gap-4">
                  <button 
                    onClick={() => setIsDarkMode(!isDarkMode)}
                    className="p-2 md:p-3 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400 transition-colors"
                    title="Toggle dark mode"
                  >
                    {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                  </button>
                  <div className="flex items-center gap-1 w-full justify-between sm:justify-end">
                    <button onClick={prevMonth} className="p-2 rounded-lg hover:bg-calendar-primary/15 text-zinc-600 dark:text-zinc-400 transition-colors">
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <div className="px-2 md:px-4 py-2 flex flex-col items-center justify-center min-w-[100px] md:min-w-[120px]">
                      <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest md:tracking-[0.3em] leading-none mb-1">
                        {format(currentDate, 'MMMM')}
                      </span>
                      <span className="text-[8px] md:text-[9px] font-medium opacity-40 tracking-widest md:tracking-[0.4em] leading-none">
                        {format(currentDate, 'yyyy')}
                      </span>
                    </div>
                    <button onClick={nextMonth} className="p-2 rounded-lg hover:bg-calendar-primary/15 text-zinc-600 dark:text-zinc-400 transition-colors">
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Dynamic Calendar Grid */}
              <div className="flex-1 flex flex-col">
                {/* Days of Week */}
                <div className="grid grid-cols-7 mb-4">
                  {weekDays.map(day => (
                    <div key={day} className="text-center text-[8px] sm:text-[10px] font-bold tracking-widest sm:tracking-[0.3em] text-zinc-400">
                      {day}
                    </div>
                  ))}
                </div>
                
                {/* Days Grid */}
                <div className="grid grid-cols-7 gap-1 sm:gap-2 flex-1">
                  {days.map((day, dayIdx) => {
                    const isCurrentMonth = isSameMonth(day, currentDate);
                    const isTodayDate = isToday(day);
                    const isSelected = rangeStart && isSameDay(day, rangeStart) || rangeEnd && isSameDay(day, rangeEnd);
                    const isWithinSelection = rangeStart && rangeEnd && isWithinInterval(day, {
                      start: isBefore(rangeStart, rangeEnd) ? rangeStart : rangeEnd,
                      end: isAfter(rangeEnd, rangeStart) ? rangeEnd : rangeStart
                    });
                    
                    return (
                      <div 
                        key={day.toString()}
                        onClick={() => handleDateClick(day)}
                        className={cn(
                          "relative flex items-center justify-center rounded-xl sm:rounded-2xl text-sm sm:text-lg font-medium transition-all cursor-pointer",
                          "min-h-[40px] sm:min-h-[60px] md:min-h-[80px]",
                          !isCurrentMonth && "text-zinc-300 dark:text-zinc-700",
                          isCurrentMonth && !isTodayDate && !isSelected && !isWithinSelection && "text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800/50",
                          isTodayDate && !isSelected && "bg-calendar-primary/20 text-calendar-primary font-bold",
                          isSelected && "bg-calendar-primary text-calendar-contrast font-bold shadow-md scale-105 z-10",
                          isWithinSelection && !isSelected && "bg-calendar-primary/10 text-calendar-primary"
                        )}
                      >
                        <span className="relative z-10">{format(day, 'd')}</span>
                        {/* Note Indicators */}
                        <div className="absolute bottom-1 sm:bottom-2 left-0 right-0 flex justify-center gap-1">
                          {notes.filter(n => n.date === format(day, 'yyyy-MM-dd')).slice(0, 3).map((note, i) => (
                            <div key={i} className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full" style={{ backgroundColor: note.color || DEFAULT_THEME.primary }} />
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Notes Sidebar */}
          <div className="w-full md:w-80 border-l border-zinc-200/50 bg-zinc-50/50 flex flex-col">
            <NotesPanel 
              currentDate={currentDate}
              rangeStart={rangeStart}
              rangeEnd={rangeEnd}
              notes={notes}
              onAddNote={handleAddNote}
              onUpdateNote={handleUpdateNote}
              onDeleteNote={handleDeleteNote}
              isDarkMode={isDarkMode}
              theme={theme}
              className="flex-1"
            />
          </div>

        </div>
      </div>
    </div>
  );
}
