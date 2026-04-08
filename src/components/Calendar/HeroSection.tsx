import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { format } from 'date-fns';
import { Camera, Palette } from 'lucide-react';

const THEMES = ['nature', 'space', 'music', 'architecture', 'abstract', 'minimal', 'food', 'travel', 'cars', 'animals'];

interface HeroSectionProps {
  currentDate: Date;
  imageUrl: string;
  onImageUpload?: (url: string) => void;
}

export function HeroSection({ currentDate, imageUrl, onImageUpload }: HeroSectionProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsThemeMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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

const THEME_IMAGES: Record<string, string[]> = {
  nature: [
    '1472214103451-9374bd1c798e', '1441974231531-c6227db76b6e', '1470071459604-3b5ec3a7fe05', '1447752809965-926f80b829ce', '1465146344425-f00d5f5c8f07'
  ],
  space: [
    '1462331940025-496dfbfc7564', '1451187580459-43490279c0fa', '1446776811953-b23d5734c106', '1464802686167-b9e5098034a5', '1419242902214-272b3f66ee7a'
  ],
  music: [
    '1511671782779-c97d3d27a1d4', '1470225620780-dba8ba36b745', '1514320291840-2e0a9ca2a47c', '1459749411175-04bf5292ceea', '1468164016595-6108e4c60c8b'
  ],
  architecture: [
    '1486406146926-c627a92ad1ab', '1479839672679-a46483c0e7c8', '1480714378408-67cf0d13bc1b', '1481026469463-66327c86e544', '1470722214140-b53884e99656'
  ],
  abstract: [
    '1541701494587-cb58502866ab', '1550684848-fac1c5b4e853', '1518640467708-62f14038bce6', '1557672172-298e090bd0f1', '1574169208507-84376144848b'
  ],
  minimal: [
    '1494438639946-1ebd1d20bf85', '1480796927426-f609979314bd', '1490818387583-1b0ba689a074', '1449247666642-264389f8f5b2', '1434030216411-0b793f4b4173'
  ],
  food: [
    '1476224203463-3a141c459946', '1493770348161-369560ae357d', '1482049149908-2e474b308d6d', '1484723091781-41f5ab4c19af', '1473093295043-cdd812d0e601'
  ],
  travel: [
    '1488085061387-422e15b40b18', '1469854523086-cc02fe5d8800', '1476514525535-07fb3b4ae5f1', '1452421822248-d4c2b47f0c81', '1493976040374-85c8e12f0c0e'
  ],
  cars: [
    '1492144534655-ae79c964c9d7', '1503376711615-155160914006', '1494976388531-d1058494cdd8', '1485291571150-772bcfc10da5', '1514316454349-750a7fd3da3a'
  ],
  animals: [
    '1474511320723-9a56873864b5', '1456926631375-92c8ce872def', '1437681115384-79ddf44b7ee6', '1475809914058-62bd54f50839', '1456642315140-c045b1c2b311'
  ]
};

  const handleThemeSelect = (theme: string) => {
    if (onImageUpload) {
      const images = THEME_IMAGES[theme];
      if (images && images.length > 0) {
        const randomImageId = images[Math.floor(Math.random() * images.length)];
        onImageUpload(`https://images.unsplash.com/photo-${randomImageId}?auto=format&fit=crop&q=80&w=1920`);
      } else {
        onImageUpload(`https://picsum.photos/seed/${theme}-${Math.random()}/1920/1080`);
      }
    }
    setIsThemeMenuOpen(false);
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
          className="absolute inset-0 bg-zinc-800"
        >
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={format(currentDate, 'MMMM yyyy')}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="w-full h-full bg-zinc-800" />
          )}
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

          {/* Image Upload & Theme Button */}
          <div className="absolute bottom-6 right-8 flex items-center gap-3">
            <div className="relative" ref={menuRef}>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsThemeMenuOpen(!isThemeMenuOpen)}
                className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white hover:bg-white/30 transition-colors shadow-lg"
                title="Choose Theme"
              >
                <Palette className="w-5 h-5" />
              </motion.button>

              <AnimatePresence>
                {isThemeMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute bottom-full right-0 mb-4 w-56 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl overflow-hidden z-50"
                  >
                    <div className="p-2">
                      <div className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-2 px-3 pt-2">
                        Image Theme
                      </div>
                      <div className="grid grid-cols-2 gap-1">
                        {THEMES.map((theme) => (
                          <button
                            key={theme}
                            onClick={() => handleThemeSelect(theme)}
                            className="text-left px-3 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors capitalize"
                          >
                            {theme}
                          </button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

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
              title="Upload Custom Image"
            >
              <Camera className="w-5 h-5" />
            </motion.button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
