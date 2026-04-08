import React from 'react';
import { 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval,
  format
} from 'date-fns';
import { DayCell } from './DayCell';

import { cn } from '@/src/utils/cn';

import { type Note, type Holiday } from '@/src/App';

interface CalendarGridProps {
  currentDate: Date;
  rangeStart: Date | null;
  rangeEnd: Date | null;
  hoverDate: Date | null;
  onDateClick: (date: Date) => void;
  onMouseEnter: (date: Date) => void;
  holidays: Holiday[];
  notes: Note[];
  isDarkMode: boolean;
}

export function CalendarGrid({
  currentDate,
  rangeStart,
  rangeEnd,
  hoverDate,
  onDateClick,
  onMouseEnter,
  holidays,
  notes,
  isDarkMode
}: CalendarGridProps) {
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const days = eachDayOfInterval({
    start: startDate,
    end: endDate,
  });

  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <div className="flex-1 p-4">
      <div className="grid grid-cols-7 mb-2">
        {weekDays.map((day) => (
          <div 
            key={day} 
            className={cn(
              "h-10 flex items-center justify-center text-[9px] font-bold uppercase tracking-[0.4em]",
              (day === 'Sat' || day === 'Sun') ? "text-calendar-primary opacity-80" : (isDarkMode ? "text-zinc-100 opacity-40" : "text-zinc-900 opacity-40")
            )}
          >
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {days.map((day) => {
          const dateStr = format(day, 'yyyy-MM-dd');
          const holiday = holidays.find(h => h.date === dateStr);
          
          return (
            <DayCell
              key={day.toISOString()}
              date={day}
              currentMonth={currentDate}
              rangeStart={rangeStart}
              rangeEnd={rangeEnd}
              hoverDate={hoverDate}
              onDateClick={onDateClick}
              onMouseEnter={onMouseEnter}
              holiday={holiday}
              notes={notes}
              isDarkMode={isDarkMode}
            />
          );
        })}
      </div>
    </div>
  );
}
