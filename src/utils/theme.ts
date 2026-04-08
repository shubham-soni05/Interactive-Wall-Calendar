import chroma from 'chroma-js';

export interface CalendarTheme {
  primary: string;
  light: string;
  medium: string;
  dark: string;
  contrast: string;
}

export const DEFAULT_THEME: CalendarTheme = {
  primary: '#ec4899', // pink-500
  light: '#fdf2f8',   // pink-50
  medium: '#f9a8d4',  // pink-300
  dark: '#db2777',    // pink-600
  contrast: '#ffffff'
};

export async function extractThemeFromImage(imageUrl: string): Promise<CalendarTheme> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.referrerPolicy = 'no-referrer';
    img.src = imageUrl;

    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(DEFAULT_THEME);
          return;
        }

        // Draw image to a 1x1 canvas to get average color
        canvas.width = 1;
        canvas.height = 1;
        ctx.drawImage(img, 0, 0, 1, 1);
        
        const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
        const baseColor = chroma([r, g, b]);
        
        // Transform to soft pastel: low saturation, high brightness
        const softBase = baseColor
          .set('hsl.s', Math.min(baseColor.get('hsl.s'), 0.5)) // Cap saturation at 50%
          .set('hsl.l', Math.max(baseColor.get('hsl.l'), 0.5)); // Ensure it's bright enough

        resolve({
          primary: softBase.hex(),
          light: softBase.brighten(2.5).desaturate(0.5).hex(),
          medium: softBase.brighten(1).hex(),
          dark: softBase.darken(1).hex(),
          contrast: chroma.contrast(softBase, 'white') > 4.5 ? '#ffffff' : '#000000'
        });
      } catch (error) {
        // Silently fallback to default theme if canvas is tainted or other error
        resolve(DEFAULT_THEME);
      }
    };

    img.onerror = () => {
      // Silently fallback to default theme if image fails to load (e.g. CORS)
      resolve(DEFAULT_THEME);
    };
  });
}

export function generatePalette(baseColor: string): string[] {
  const color = chroma(baseColor || '#ec4899'); // Fallback to a default color if baseColor is invalid/empty
  return [
    color.hex(), // Primary
    color.set('hsl.h', (color.get('hsl.h') + 30) % 360).hex(),
    color.set('hsl.h', (color.get('hsl.h') + 60) % 360).hex(),
    color.set('hsl.h', (color.get('hsl.h') + 150) % 360).hex(),
    color.set('hsl.h', (color.get('hsl.h') + 210) % 360).hex(),
    color.set('hsl.h', (color.get('hsl.h') + 280) % 360).hex(),
  ];
}

export function applyThemeToCSS(theme: CalendarTheme) {
  const root = document.documentElement;
  root.style.setProperty('--calendar-primary', theme.primary);
  root.style.setProperty('--calendar-light', theme.light);
  root.style.setProperty('--calendar-medium', theme.medium);
  root.style.setProperty('--calendar-dark', theme.dark);
  root.style.setProperty('--calendar-contrast', theme.contrast);
}
