import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2 } from 'lucide-react';
import { cn } from '@/src/utils/cn';

interface ToastProps {
  message: string;
  isVisible: boolean;
  onClose: () => void;
  isDarkMode: boolean;
}

export function Toast({ message, isVisible, onClose, isDarkMode }: ToastProps) {
  React.useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(onClose, 3000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50, x: '-50%' }}
          animate={{ opacity: 1, y: 0, x: '-50%' }}
          exit={{ opacity: 0, y: 20, x: '-50%' }}
          className={cn(
            "fixed bottom-8 left-1/2 z-[200] px-6 py-3 rounded-2xl shadow-2xl border flex items-center gap-3",
            isDarkMode 
              ? "bg-zinc-900 border-zinc-800 text-zinc-100" 
              : "bg-white border-zinc-200 text-zinc-900"
          )}
        >
          <CheckCircle2 className="w-5 h-5 text-emerald-500" />
          <span className="text-sm font-bold tracking-tight">{message}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
