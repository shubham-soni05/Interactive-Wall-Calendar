import React, { useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { format } from 'date-fns';
import { Camera, Edit2 } from 'lucide-react';

interface HeroSectionProps {
  currentDate: Date;
  imageUrl: string;
  onImageUpload?: (url: string) => void;
}

export function HeroSection({ currentDate, imageUrl, onImageUpload }: HeroSectionProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onImageUpload) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onImageUpload(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="relative h-64 md:h-80 overflow-hidden rounded-t-lg group">
      <AnimatePresence mode="wait">
        <motion.div
          key={format(currentDate, 'yyyy-MM')}
          initial={{ rotateX: -90, originY: 0, opacity: 0 }}
          animate={{ rotateX: 0, originY: 0, opacity: 1 }}
          exit={{ rotateX: 90, originY: 1, opacity: 0 }}
          transition={{ type: 'spring', damping: 20, stiffness: 100 }}
          className="absolute inset-0"
        >
          <img
            src={imageUrl}
            alt={format(currentDate, 'MMMM yyyy')}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          
          <div className="absolute bottom-6 left-8 text-white">
            <motion.h1 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="font-serif text-6xl md:text-8xl font-black tracking-tighter leading-none"
            >
              {format(currentDate, 'MMMM')}
            </motion.h1>
            <motion.p 
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="font-sans text-xl md:text-2xl font-medium tracking-widest uppercase opacity-80 mt-2"
            >
              {format(currentDate, 'yyyy')}
            </motion.p>
          </div>

          {/* Image Upload Button */}
          <div className="absolute bottom-6 right-8">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => fileInputRef.current?.click()}
              className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white hover:bg-white/30 transition-colors shadow-lg"
              title="Change Month Image"
            >
              <Camera className="w-5 h-5" />
            </motion.button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
