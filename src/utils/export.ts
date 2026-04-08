import { toPng } from 'html-to-image';

export async function exportComponentAsImage(
  element: HTMLElement,
  filename: string,
  options: { backgroundColor?: string; padding?: number } = {}
) {
  const { backgroundColor = '#F5F5F0', padding = 40 } = options;

  try {
    // We add a wrapper to provide padding in the final image
    const dataUrl = await toPng(element, {
      cacheBust: true,
      backgroundColor,
      style: {
        margin: '0',
        padding: `${padding}px`,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      },
      // Higher pixel ratio for better quality
      pixelRatio: 2,
    });

    const link = document.createElement('a');
    link.download = `${filename}.png`;
    link.href = dataUrl;
    link.click();
  } catch (err) {
    console.error('Failed to export image:', err);
    throw err;
  }
}
