import { motion } from 'motion/react';

export function SpiralBinding() {
  const rings = Array.from({ length: 18 });
  
  return (
    <div className="absolute -top-4 left-0 right-0 flex justify-around px-8 z-20">
      {rings.map((_, i) => (
        <motion.div
          key={i}
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: i * 0.02 }}
          className="w-1.5 h-8 bg-zinc-300 dark:bg-zinc-700 rounded-full shadow-[inset_0_2px_4px_rgba(0,0,0,0.1),0_2px_4px_rgba(0,0,0,0.1)]"
        />
      ))}
    </div>
  );
}
