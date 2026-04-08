import LZString from 'lz-string';
import { type Note } from '../App';

export interface ShareState {
  rangeStart: string | null;
  rangeEnd: string | null;
  notes: Note[];
}

export function encodeState(state: ShareState): string {
  try {
    const json = JSON.stringify(state);
    // Compress the JSON string to make it shorter for the URL
    return LZString.compressToEncodedURIComponent(json);
  } catch (e) {
    console.error('Failed to encode state', e);
    return '';
  }
}

export function decodeState(encoded: string): ShareState | null {
  try {
    // Decompress the string from the URL
    const json = LZString.decompressFromEncodedURIComponent(encoded);
    if (!json) return null;
    return JSON.parse(json);
  } catch (e) {
    console.error('Failed to decode state', e);
    return null;
  }
}

export function generateShortId(): string {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

export function saveSharedState(id: string, state: ShareState) {
  try {
    const sharedData = JSON.parse(localStorage.getItem('mock-shared-links') || '{}');
    sharedData[id] = state;
    localStorage.setItem('mock-shared-links', JSON.stringify(sharedData));
  } catch (e) {
    console.error('Failed to save shared state', e);
  }
}

export function getSharedState(id: string): ShareState | null {
  try {
    const sharedData = JSON.parse(localStorage.getItem('mock-shared-links') || '{}');
    return sharedData[id] || null;
  } catch (e) {
    console.error('Failed to get shared state', e);
    return null;
  }
}
