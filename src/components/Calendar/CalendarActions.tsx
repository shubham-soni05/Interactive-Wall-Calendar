import React from 'react';
import { Download, Loader2, CheckSquare, Square, Share2 } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../../utils/cn';

interface CalendarActionsProps {
  isExporting: boolean;
  includeNotes: boolean;
  isDarkMode: boolean;
  onExport: () => void;
  onShare: () => void;
  onToggleNotes: () => void;
}

export const CalendarActions: React.FC<CalendarActionsProps> = ({
  isExporting,
  includeNotes,
  isDarkMode,
  onExport,
  onShare,
  onToggleNotes,
}) => {
  return (
    <div className={cn(
      "p-6 md:p-8 flex flex-row lg:flex-col-reverse gap-6 md:gap-6 items-center lg:items-end justify-center lg:justify-start border-t transition-colors duration-500",
      isDarkMode ? "bg-zinc-950 border-zinc-800" : "bg-white border-zinc-200/50",
      !includeNotes && "flex-1"
    )}>
      <div className="flex flex-col items-center md:items-end gap-2 group">
        <button
          onClick={onExport}
          disabled={isExporting}
          className={cn(
            "w-10 h-10 rounded-xl flex items-center justify-center transition-all shadow-lg relative overflow-hidden",
            "bg-calendar-primary text-calendar-contrast hover:scale-105 active:scale-95"
          )}
        >
          {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
          <motion.div 
            className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity"
            initial={false}
          />
        </button>
        <span className={cn(
          "text-[8px] font-bold uppercase tracking-[0.3em] transition-colors",
          isDarkMode ? "text-zinc-500 group-hover:text-zinc-300" : "text-zinc-400 group-hover:text-zinc-700"
        )}>
          Download
        </span>
      </div>

      <div className="flex flex-col items-center md:items-end gap-2 group">
        <button
          onClick={onShare}
          className={cn(
            "w-10 h-10 rounded-xl flex items-center justify-center transition-all shadow-lg relative overflow-hidden",
            "bg-calendar-primary text-calendar-contrast hover:scale-105 active:scale-95"
          )}
        >
          <Share2 className="w-4 h-4" />
          <motion.div 
            className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity"
            initial={false}
          />
        </button>
        <span className={cn(
          "text-[8px] font-bold uppercase tracking-[0.3em] transition-colors",
          isDarkMode ? "text-zinc-500 group-hover:text-zinc-300" : "text-zinc-400 group-hover:text-zinc-700"
        )}>
          Share
        </span>
      </div>

      <div className="flex flex-col items-center md:items-end gap-2 group">
        <button
          onClick={onToggleNotes}
          className={cn(
            "w-10 h-10 rounded-xl flex items-center justify-center transition-all shadow-lg relative overflow-hidden",
            includeNotes 
              ? "bg-calendar-primary text-calendar-contrast" 
              : (isDarkMode ? "bg-zinc-800 text-zinc-400 hover:bg-zinc-700" : "bg-white text-zinc-400 hover:bg-zinc-50 border border-zinc-200/50"),
            "hover:scale-105 active:scale-95"
          )}
        >
          {includeNotes ? (
            <CheckSquare className="w-4 h-4" />
          ) : (
            <Square className="w-4 h-4" />
          )}
          <motion.div 
            className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"
            initial={false}
          />
        </button>
        <span className={cn(
          "text-[8px] font-bold uppercase tracking-[0.3em] transition-colors",
          isDarkMode ? "text-zinc-500 group-hover:text-zinc-300" : "text-zinc-400 group-hover:text-zinc-700"
        )}>
          {includeNotes ? "Hide Notes" : "Show Notes"}
        </span>
      </div>

      {!includeNotes && (
        <div className={cn(
          "hidden md:block text-[9px] font-bold uppercase tracking-[0.5em] rotate-180 [writing-mode:vertical-lr] opacity-20 mb-4 py-4",
          isDarkMode ? "text-zinc-100" : "text-zinc-900"
        )}>
          Quick Actions
        </div>
      )}
    </div>
  );
};
