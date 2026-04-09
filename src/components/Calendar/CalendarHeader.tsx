import React from 'react';
import { format } from 'date-fns';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, LayoutGrid } from 'lucide-react';
import { cn } from '../../utils/cn';

interface CalendarHeaderProps {
  currentDate: Date;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onResetDate: () => void;
  isDarkMode: boolean;
  viewMode: 'monthly' | 'yearly';
  onViewModeChange: (mode: 'monthly' | 'yearly') => void;
}

export const CalendarHeader: React.FC<CalendarHeaderProps> = ({
  currentDate,
  onPrevMonth,
  onNextMonth,
  onResetDate,
  isDarkMode,
  viewMode,
  onViewModeChange,
}) => {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between mb-4 md:mb-8 gap-4">
      <div className="flex items-center gap-3 w-full sm:w-auto justify-start">
        <button
          onClick={() => onViewModeChange(viewMode === 'monthly' ? 'yearly' : 'monthly')}
          className={cn(
            "p-2 md:p-3 rounded-xl transition-all duration-500 flex-shrink-0 hover:scale-105 active:scale-95 shadow-lg",
            viewMode === 'yearly' 
              ? "bg-calendar-primary text-calendar-contrast" 
              : (isDarkMode ? "bg-zinc-800 text-zinc-100" : "bg-white text-zinc-900 border border-zinc-200")
          )}
          title={viewMode === 'monthly' ? "Yearly View" : "Monthly View"}
        >
          {viewMode === 'monthly' ? (
            <LayoutGrid className="w-5 h-5 md:w-6 md:h-6" />
          ) : (
            <CalendarIcon className="w-5 h-5 md:w-6 md:h-6" />
          )}
        </button>

        <div>
          <h2 className={cn(
            "text-[8px] md:text-[10px] font-bold uppercase tracking-widest md:tracking-[0.4em] leading-tight",
            isDarkMode ? "text-zinc-100" : "text-zinc-900"
          )}>
            Interactive<br/>Wall Calendar
          </h2>
        </div>
      </div>
      
      <div className="flex items-center justify-between w-full sm:w-auto gap-2 md:gap-4">
        <div className="flex items-center gap-1 w-full justify-between sm:justify-end">
          <button 
            onClick={onPrevMonth}
            className={cn(
              "p-2 rounded-lg transition-colors",
              isDarkMode ? "hover:bg-calendar-primary/10 text-zinc-400" : "hover:bg-calendar-primary/15 text-zinc-600"
            )}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button 
            onClick={onResetDate}
            className={cn(
              "px-2 md:px-4 py-2 transition-all duration-300 flex flex-col items-center justify-center min-w-[100px] md:min-w-[120px] group",
              isDarkMode ? "text-zinc-100" : "text-zinc-900"
            )}
          >
            <span className={cn(
              "text-lg md:text-2xl font-bold uppercase tracking-widest md:tracking-[0.3em] leading-none mb-1 transition-colors",
              "group-hover:text-calendar-primary"
            )}>
              {format(currentDate, 'MMMM')}
            </span>
            <span className={cn(
              "text-xs md:text-sm font-medium tracking-widest md:tracking-[0.4em] leading-none",
              isDarkMode ? "text-zinc-500" : "text-zinc-400"
            )}>
              {format(currentDate, 'yyyy')}
            </span>
          </button>
          <button 
            onClick={onNextMonth}
            className={cn(
              "p-2 rounded-lg transition-colors",
              isDarkMode ? "hover:bg-calendar-primary/10 text-zinc-400" : "hover:bg-calendar-primary/15 text-zinc-600"
            )}
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
