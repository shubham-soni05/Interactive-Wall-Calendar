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
              "relative w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border grain",
              isDarkMode ? "bg-zinc-900 border-zinc-800" : "bg-white border-zinc-200"
            )}
          >
            <div className="p-10 space-y-8">
              <div className="flex items-center justify-between">
                <h3 className={cn("font-serif text-3xl font-black tracking-tighter", isDarkMode ? "text-zinc-100" : "text-zinc-900")}>
                  Share Calendar
                </h3>
                <button onClick={onClose} className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className={cn("p-8 rounded-2xl space-y-6", isDarkMode ? "bg-zinc-950" : "bg-zinc-50/50")}>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-calendar-primary/10 flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-calendar-primary" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.3em] opacity-40 mb-1">Selected Dates</p>
                    <p className={cn("text-sm font-bold", isDarkMode ? "text-zinc-200" : "text-zinc-900")}>{selectedDates}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-calendar-primary/10 flex items-center justify-center">
                    <StickyNote className="w-6 h-6 text-calendar-primary" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.3em] opacity-40 mb-1">Notes Included</p>
                    <p className={cn("text-sm font-bold", isDarkMode ? "text-zinc-200" : "text-zinc-900")}>{notesCount} notes</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] opacity-40">Shareable Link</p>
                <div className="flex flex-col gap-3">
                  <div className={cn(
                    "px-5 py-4 rounded-2xl text-xs font-mono truncate border",
                    isDarkMode ? "bg-zinc-950 border-zinc-800 text-zinc-400" : "bg-zinc-50/50 border-zinc-200 text-zinc-500"
                  )}>
                    {shareUrl}
                  </div>
                  <button
                    onClick={handleCopy}
                    className={cn(
                      "w-full py-4 rounded-2xl font-black text-xs uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-3 shadow-lg",
                      copied 
                        ? "bg-emerald-500 text-white" 
                        : "bg-calendar-primary text-calendar-contrast hover:scale-[1.02] active:scale-[0.98]"
                    )}
                  >
                    {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                    {copied ? "Copied" : "Copy Link"}
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
