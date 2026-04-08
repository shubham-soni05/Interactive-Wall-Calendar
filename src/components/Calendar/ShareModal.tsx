import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Check, Copy, Calendar, StickyNote } from 'lucide-react';
import { cn } from '@/src/utils/cn';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  shareUrl: string;
  selectedDates: string;
  notesCount: number;
  isDarkMode: boolean;
}

export function ShareModal({ isOpen, onClose, shareUrl, selectedDates, notesCount, isDarkMode }: ShareModalProps) {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className={cn(
              "relative w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border",
              isDarkMode ? "bg-zinc-900 border-zinc-800" : "bg-white border-zinc-200"
            )}
          >
            <div className="p-8 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className={cn("font-serif text-2xl font-black tracking-tight", isDarkMode ? "text-zinc-100" : "text-zinc-900")}>
                  Share Calendar
                </h3>
                <button onClick={onClose} className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className={cn("p-6 rounded-2xl space-y-4", isDarkMode ? "bg-zinc-950" : "bg-zinc-50")}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-calendar-primary/10 flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-calendar-primary" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest opacity-40">Selected Dates</p>
                    <p className={cn("text-sm font-bold", isDarkMode ? "text-zinc-200" : "text-zinc-900")}>{selectedDates}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-calendar-primary/10 flex items-center justify-center">
                    <StickyNote className="w-5 h-5 text-calendar-primary" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest opacity-40">Notes Included</p>
                    <p className={cn("text-sm font-bold", isDarkMode ? "text-zinc-200" : "text-zinc-900")}>{notesCount} notes</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-[10px] font-bold uppercase tracking-widest opacity-40">Shareable Link</p>
                <div className="flex gap-2">
                  <div className={cn(
                    "flex-1 px-4 py-3 rounded-xl text-xs font-mono truncate border",
                    isDarkMode ? "bg-zinc-950 border-zinc-800 text-zinc-400" : "bg-zinc-50 border-zinc-200 text-zinc-500"
                  )}>
                    {shareUrl}
                  </div>
                  <button
                    onClick={handleCopy}
                    className={cn(
                      "px-6 rounded-xl font-bold text-xs uppercase tracking-widest transition-all flex items-center gap-2",
                      copied 
                        ? "bg-emerald-500 text-white" 
                        : "bg-calendar-primary text-calendar-contrast hover:scale-105 active:scale-95"
                    )}
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    {copied ? "Copied" : "Copy"}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
