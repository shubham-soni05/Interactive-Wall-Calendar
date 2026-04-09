import { useState, useEffect, useRef } from 'react';
import { format, isBefore, isAfter } from 'date-fns';
import { Moon, Sun } from 'lucide-react';
import { motion } from 'motion/react';
import { SpiralBinding } from './components/Calendar/SpiralBinding';
import { HeroSection } from './components/Calendar/HeroSection';
import { CalendarGrid } from './components/Calendar/CalendarGrid';
import { NotesPanel } from './components/Calendar/NotesPanel';
import { ShareModal } from './components/Calendar/ShareModal';
import { Toast } from './components/Calendar/Toast';
import { CalendarHeader } from './components/Calendar/CalendarHeader';
import { YearlyView } from './components/Calendar/YearlyView';
import { CalendarActions } from './components/Calendar/CalendarActions';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useCalendar } from './hooks/useCalendar';
import { cn } from './utils/cn';
import { extractThemeFromImage, applyThemeToCSS, DEFAULT_THEME, type CalendarTheme } from './utils/theme';
import { exportComponentAsImage } from './utils/export';
import { encodeState, decodeState, type ShareState } from './utils/share';

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

const HOLIDAYS: Holiday[] = [
  { date: '2026-01-26', name: 'Republic Day', type: 'public' },
  { date: '2026-03-03', name: 'Holi', type: 'festival' },
  { date: '2026-03-26', name: 'Ram Navami', type: 'festival' },
  { date: '2026-04-03', name: 'Good Friday', type: 'public' },
  { date: '2026-05-01', name: 'Buddha Purnima', type: 'festival' },
  { date: '2026-05-27', name: 'Id-ul-Zuha (Bakrid)', type: 'festival' },
  { date: '2026-06-26', name: 'Muharram', type: 'festival' },
  { date: '2026-08-15', name: 'Independence Day', type: 'public' },
  { date: '2026-08-26', name: 'Milad-un-Nabi/Id-e-Milad', type: 'festival' },
  { date: '2026-10-02', name: "Mahatma Gandhi's Birthday", type: 'public' },
  { date: '2026-10-20', name: 'Dussehra (Vijay Dashmi)', type: 'festival' },
  { date: '2026-11-08', name: 'Diwali (Deepavali)', type: 'festival' },
  { date: '2026-11-24', name: "Guru Nanak's Birthday", type: 'festival' },
  { date: '2026-12-25', name: 'Christmas Day', type: 'public' },
];

const HERO_IMAGES: Record<string, string> = {
  '01': 'https://images.unsplash.com/photo-1483921020237-2ff51e8e4b22?auto=format&fit=crop&q=80&w=1920',
  '02': 'https://images.unsplash.com/photo-1516533075015-a3838414c3ca?auto=format&fit=crop&q=80&w=1920',
  '03': 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&q=80&w=1920',
  '04': 'https://images.unsplash.com/photo-1462275646964-a0e3386b89fa?auto=format&fit=crop&q=80&w=1920',
  '05': 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&q=80&w=1920',
  '06': 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=1920',
  '07': 'https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&q=80&w=1920',
  '08': 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&q=80&w=1920',
  '09': 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&q=80&w=1920',
  '10': 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80&w=1920',
  '11': 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&q=80&w=1920',
  '12': 'https://images.unsplash.com/photo-1477601263568-184e2c65358b?auto=format&fit=crop&q=80&w=1920',
};

// Interactive Wall Calendar - Main Application Entry Point
// Updated breakpoints for better consistency across environments
export default function App() {
  const {
    currentDate,
    setCurrentDate,
    rangeStart,
    rangeEnd,
    hoverDate,
    setHoverDate,
    isDraggingRange,
    handlePrevMonth,
    handleNextMonth,
    handleDateClick,
    handleLongPress,
    handleRangeDragEnd,
  } = useCalendar(new Date(2026, 3, 1));
  const [viewMode, setViewMode] = useState<'monthly' | 'yearly'>('monthly');
  const [notes, setNotes] = useLocalStorage<Note[]>('calendar-notes', []);
  const [isDarkMode, setIsDarkMode] = useLocalStorage('dark-mode', false);
  const [theme, setTheme] = useState<CalendarTheme>(DEFAULT_THEME);
  const [isExporting, setIsExporting] = useState(false);
  const [includeNotes, setIncludeNotes] = useState(true);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [customImages, setCustomImages] = useLocalStorage<Record<string, string>>('calendar-custom-images', {});
  const calendarRef = useRef<HTMLDivElement>(null);

  const monthKey = format(currentDate, 'MM');
  const imageUrl = customImages[monthKey] || HERO_IMAGES[monthKey] || HERO_IMAGES['04'];

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  useEffect(() => {
    async function updateTheme() {
      const newTheme = await extractThemeFromImage(imageUrl);
      setTheme(newTheme);
      applyThemeToCSS(newTheme);
    }
    updateTheme();
  }, [imageUrl]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const data = params.get('data');
    
    let decoded: ShareState | null = null;
    
    if (data) {
      decoded = decodeState(data);
    }

    if (decoded) {
      // ... (rest of the logic)
    }
  }, []);

  const handleImageUpload = (url: string) => {
    setCustomImages({ ...customImages, [monthKey]: url });
    setToastMessage('Month image updated!');
    setShowToast(true);
  };

  const handleDragEnd = (event: any, info: any) => {
    if (isDraggingRange) return;
    const swipeThreshold = 50;
    const velocityThreshold = 500;

    if (info.offset.x < -swipeThreshold || info.velocity.x < -velocityThreshold) {
      handleNextMonth();
    } else if (info.offset.x > swipeThreshold || info.velocity.x > velocityThreshold) {
      handlePrevMonth();
    }
  };

  const handleAddNote = (text: string, title?: string, category: NoteCategory = 'personal', color?: string) => {
    const newNote: Note = {
      id: crypto.randomUUID(),
      text,
      title,
      category,
      color,
      date: rangeStart ? format(rangeStart, 'yyyy-MM-dd') : format(currentDate, 'yyyy-MM-dd'),
      type: rangeStart && rangeEnd ? 'range' : rangeStart ? 'day' : 'month',
      range: rangeStart && rangeEnd ? {
        start: format(isBefore(rangeStart, rangeEnd) ? rangeStart : rangeEnd, 'yyyy-MM-dd'),
        end: format(isAfter(rangeEnd, rangeStart) ? rangeEnd : rangeStart, 'yyyy-MM-dd')
      } : undefined
    };
    setNotes([...notes, newNote]);
    setToastMessage('Note added!');
    setShowToast(true);
  };

  const handleUpdateNote = (id: string, updates: Partial<Note>) => {
    setNotes(notes.map(n => n.id === id ? { ...n, ...updates } : n));
  };

  const handleDeleteNote = (id: string) => {
    setNotes(notes.filter(n => n.id !== id));
  };

  const handleExport = async () => {
    if (!calendarRef.current) return;
    setIsExporting(true);
    try {
      const filename = `calendar-${format(currentDate, 'MMMM-yyyy').toLowerCase()}`;
      await exportComponentAsImage(calendarRef.current, filename, {
        backgroundColor: isDarkMode ? '#000000' : '#F5F5F0',
        padding: 40
      });
      setToastMessage('Calendar exported as image!');
      setShowToast(true);
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleShare = () => {
    const state: ShareState = {
      rangeStart: rangeStart ? rangeStart.toISOString() : null,
      rangeEnd: rangeEnd ? rangeEnd.toISOString() : null,
      notes: notes
    };
    
    const encoded = encodeState(state);
    const url = `${window.location.origin}${window.location.pathname}?data=${encoded}`;
    
    setShareUrl(url);
    setIsShareModalOpen(true);
  };

  return (
    <div className={cn(
      "min-h-screen flex items-center justify-center p-4 md:p-8 transition-colors duration-500",
      isDarkMode ? "bg-black" : "bg-[#F5F5F0]"
    )}>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-6xl relative"
      >
        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          className={cn(
            "absolute top-6 right-6 p-4 rounded-[1.5rem] backdrop-blur-md transition-all duration-500 z-50 hover:scale-105 active:scale-95",
            isDarkMode 
              ? "bg-zinc-900/80 border border-zinc-800 text-zinc-400 shadow-2xl shadow-black" 
              : "bg-white/90 border border-zinc-100 text-zinc-500 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)]"
          )}
        >
          {isDarkMode ? <Sun className="w-6 h-6" strokeWidth={1.5} /> : <Moon className="w-6 h-6" strokeWidth={1.5} />}
        </button>

        <SpiralBinding />
        
        <div 
          ref={calendarRef}
          className={cn(
            "rounded-xl paper-shadow overflow-hidden flex flex-row h-full min-h-[800px] border",
            isDarkMode ? "bg-zinc-950 border-zinc-800" : "bg-white border-zinc-200/50"
          )}
        >
          <div className="flex-[3] flex flex-col min-w-0">
            <HeroSection 
              currentDate={currentDate} 
              imageUrl={imageUrl} 
              onImageUpload={handleImageUpload}
            />
            
            <div className="p-3 sm:p-6 md:p-8 flex-1 flex flex-col min-w-0">
              <CalendarHeader
                currentDate={currentDate}
                onPrevMonth={handlePrevMonth}
                onNextMonth={handleNextMonth}
                onResetDate={() => setCurrentDate(new Date())}
                isDarkMode={isDarkMode}
                viewMode={viewMode}
                onViewModeChange={setViewMode}
              />

              <motion.div
                drag={isDraggingRange || viewMode === 'yearly' ? false : "x"}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.2}
                onDragEnd={handleDragEnd}
                className="flex-1 flex flex-col min-w-0"
              >
                {viewMode === 'monthly' ? (
                  <CalendarGrid 
                    currentDate={currentDate}
                    rangeStart={rangeStart}
                    rangeEnd={rangeEnd}
                    hoverDate={hoverDate}
                    onDateClick={handleDateClick}
                    onMouseEnter={setHoverDate}
                    onLongPress={handleLongPress}
                    isDraggingRange={isDraggingRange}
                    onRangeDragEnd={handleRangeDragEnd}
                    holidays={HOLIDAYS}
                    notes={notes}
                    isDarkMode={isDarkMode}
                  />
                ) : (
                  <YearlyView 
                    currentDate={currentDate}
                    onMonthClick={(date) => {
                      setCurrentDate(date);
                      setViewMode('monthly');
                    }}
                    isDarkMode={isDarkMode}
                    notes={notes}
                  />
                )}
              </motion.div>
            </div>
          </div>

          <div className="flex-1 flex flex-col h-full border-l border-zinc-200/50 dark:border-zinc-800">
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
              className={cn("w-full flex-1", !includeNotes && "hidden")}
            />
            
            <CalendarActions
              isExporting={isExporting}
              includeNotes={includeNotes}
              isDarkMode={isDarkMode}
              onExport={handleExport}
              onShare={handleShare}
              onToggleNotes={() => setIncludeNotes(!includeNotes)}
            />
          </div>
        </div>

        <div className="mt-8 flex flex-col md:flex-row justify-between items-center px-4 gap-4">
          <div className="flex flex-col items-center md:items-start gap-1">
            <p className={cn(
              "text-[10px] font-bold uppercase tracking-[0.3em]",
              isDarkMode ? "text-zinc-600" : "text-zinc-400"
            )}>
              Interactive Wall Calendar &copy; 2026
            </p>
            <p className={cn(
              "text-[9px] font-medium uppercase tracking-[0.2em]",
              isDarkMode ? "text-zinc-800" : "text-zinc-300"
            )}>
              Handcrafted with precision and care
            </p>
          </div>
          <div className="flex gap-6 items-center">
            <div className="flex flex-col items-center md:items-end gap-1">
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] opacity-40">Built with React & Motion</span>
              <span className="text-[9px] font-medium opacity-20 uppercase tracking-[0.2em]">High Performance SPA</span>
            </div>
          </div>
        </div>
      </motion.div>

      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        shareUrl={shareUrl}
        selectedDates={rangeStart && rangeEnd 
          ? `${format(rangeStart, 'MMM d')} - ${format(rangeEnd, 'MMM d')}`
          : rangeStart 
          ? format(rangeStart, 'MMMM d, yyyy')
          : 'Full Month View'
        }
        notesCount={notes.length}
        isDarkMode={isDarkMode}
      />

      <Toast
        message={toastMessage}
        isVisible={showToast}
        onClose={() => setShowToast(false)}
        isDarkMode={isDarkMode}
      />
    </div>
  );
}
