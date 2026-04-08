# Lumina Calendar - Interactive Wall Calendar

A production-level, visually stunning interactive wall calendar built with React, TypeScript, and Tailwind CSS. This project was designed to bridge the gap between physical aesthetics and digital functionality.

## 🚀 Features

- **Wall Calendar Aesthetic**: Mimics a physical wall calendar with spiral binding, paper textures, and high-quality hero imagery.
- **Date Range Selection**: Intuitive start-and-end date selection with smooth range highlighting and hover previews.
- **Persistent Notes**: Add notes for specific days, date ranges, or the entire month. Data is persisted via `localStorage`.
- **Responsive Design**: Flawless transition from a side-by-side desktop layout to a stacked mobile view.
- **Advanced Animations**: Page-flip transitions for month changes and subtle hover effects using `motion`.
- **Dark Mode**: Fully themed dark mode support with a smooth transition.
- **Holiday Markers**: Integrated holiday data with visual indicators and tooltips.

## 🛠️ Tech Stack

- **Framework**: React (Vite)
- **Styling**: Tailwind CSS
- **Animations**: motion (formerly Framer Motion)
- **Date Manipulation**: date-fns
- **Icons**: Lucide React
- **Type Safety**: TypeScript

## 📦 Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Run the development server**:
   ```bash
   npm run dev
   ```

3. **Build for production**:
   ```bash
   npm run build
   ```

## 🏗️ Folder Structure

- `src/components/Calendar/`: Core UI components (Grid, DayCell, Hero, Notes, Spiral).
- `src/hooks/`: Custom hooks (e.g., `useLocalStorage`).
- `src/utils/`: Utility functions (e.g., `cn` for Tailwind class merging).
- `src/App.tsx`: Main layout and state orchestration.
- `src/index.css`: Global styles, fonts, and custom Tailwind layers.

## 📝 Key Logic

- **Range Selection**: Managed via three state variables (`rangeStart`, `rangeEnd`, `hoverDate`). The `DayCell` component calculates its state (isStart, isEnd, isInRange) based on these.
- **Persistence**: A custom `useLocalStorage` hook wraps `useState` to sync state with the browser's storage automatically.
- **Animations**: `AnimatePresence` and `motion` are used to create the "page flip" effect when changing months, providing a tactile feel.

## 🚀 Deployment

This project is ready to be deployed on platforms like [Vercel](https://vercel.com) or [Netlify](https://netlify.com). Simply connect your repository and the build settings will be automatically detected.

## 🎥 Project Showcase

*"I built this project to explore how we can translate physical objects into digital interfaces. I focused on a 'Wall Calendar' aesthetic, using spiral binding and paper textures to give it a tactile feel. The core feature is the range selection, which I implemented with a focus on visual feedback—smooth highlighting as you hover. I also integrated a notes system that persists in localStorage, allowing users to jot down plans for specific dates or ranges. Technically, I used React with TypeScript for type safety, and motion for those tactile page-flip animations. It's fully responsive and even includes a dark mode for better accessibility."*
