import React from 'react';
import { format, startOfYear, addMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, isSameDay } from 'date-fns';
import { motion } from 'motion/react';
import { cn } from '../../utils/cn';
import { type Note } from '../../App';

interface YearlyViewProps {
  currentDate: Date;
  onMonthClick: (date: Date) => void;
  isDarkMode: boolean;
  notes: Note[];
}

export const YearlyView: React.FC<YearlyViewProps> = ({ currentDate, onMonthClick, isDarkMode, notes }) => {
  const yearStart = startOfYear(currentDate);
  const months = Array.from({ length: 12 }, (_, i) => addMonths(yearStart, i));

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4">
      {months.map((month) => (
        <motion.div
          key={month.toISOString()}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.02 }}
          onClick={() => onMonthClick(month)}
          className={cn(
            "p-4 rounded-xl border cursor-pointer transition-all duration-300",
            isDarkMode 
              ? "bg-zinc-900/50 border-zinc-800 hover:border-calendar-primary/50" 
              : "bg-white border-zinc-100 hover:border-calendar-primary/30 shadow-sm hover:shadow-md",
            isSameMonth(month, currentDate) && (isDarkMode ? "ring-1 ring-calendar-primary/50" : "ring-1 ring-calendar-primary/30")
          )}
        >
          <h3 className={cn(
            "text-xs font-bold uppercase tracking-widest mb-3 text-center",
            isDarkMode ? "text-zinc-100" : "text-zinc-900",
            isSameMonth(month, currentDate) && "text-calendar-primary"
          )}>
            {format(month, 'MMMM')}
          </h3>
          
          <div className="grid grid-cols-7 gap-1">
            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => (
              <div key={`${day}-${i}`} className="text-[8px] font-bold opacity-30 text-center">
                {day}
              </div>
            ))}
            {renderMiniDays(month, notes)}
          </div>
        </motion.div>
      ))}
    </div>
  );
};

function renderMiniDays(month: Date, notes: Note[]) {
  const start = startOfMonth(month);
  const end = endOfMonth(month);
  const days = eachDayOfInterval({ start, end });
  
  // Padding for start of month (Monday start)
  const startDay = start.getDay();
  const paddingCount = (startDay + 6) % 7;
  const padding = Array.from({ length: paddingCount }, (_, i) => <div key={`pad-${i}`} />);

  return [
    ...padding,
    ...days.map((day) => {
      const dayStr = format(day, 'yyyy-MM-dd');
      const hasNote = notes.some(note => 
        note.date === dayStr || 
        (note.type === 'range' && note.range && 
          dayStr >= note.range.start && dayStr <= note.range.end)
      );

      return (
        <div
          key={day.toISOString()}
          className={cn(
            "text-[8px] flex flex-col items-center justify-center w-4 h-4 rounded-full mx-auto relative",
            isToday(day) ? "bg-calendar-primary text-white font-bold" : "opacity-60"
          )}
        >
          {format(day, 'd')}
          {hasNote && !isToday(day) && (
            <div className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-0.5 h-0.5 rounded-full bg-calendar-primary" />
          )}
        </div>
      );
    })
  ];
}
