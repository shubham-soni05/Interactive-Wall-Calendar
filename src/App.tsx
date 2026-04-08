import React from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from './utils/cn';

export default function App() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 md:p-8 bg-[#F5F5F0]">
      <div className="w-full max-w-6xl relative">
        
        {/* Main Calendar Container */}
        <div className="rounded-xl paper-shadow overflow-hidden flex flex-col md:flex-row h-full min-h-[800px] border bg-white border-zinc-200/50">
          
          <div className="flex-1 flex flex-col">
            {/* Placeholder Hero Section */}
            <div className="h-48 md:h-64 bg-zinc-800 relative overflow-hidden flex items-end p-8">
              <h1 className="text-5xl md:text-7xl font-serif font-bold text-white tracking-tighter z-10">
                April <br/>
                <span className="text-2xl md:text-3xl font-sans tracking-widest opacity-80">2026</span>
              </h1>
            </div>
            
            <div className="p-3 sm:p-6 md:p-8 flex-1 flex flex-col">
              {/* Header Controls */}
              <div className="flex flex-col sm:flex-row items-center justify-between mb-4 md:mb-8 gap-4">
                <div className="flex items-center gap-3 w-full sm:w-auto justify-start">
                  <div className="p-2 md:p-3 rounded-xl bg-calendar-primary flex-shrink-0">
                    <CalendarIcon className="w-5 h-5 md:w-6 md:h-6 text-calendar-contrast" />
                  </div>
                  <div>
                    <h2 className="text-[8px] md:text-[10px] font-bold uppercase tracking-widest md:tracking-[0.4em] opacity-40 leading-tight">
                      Interactive<br/>Wall Calendar
                    </h2>
                  </div>
                </div>
                
                <div className="flex items-center justify-between w-full sm:w-auto gap-2 md:gap-4">
                  <div className="flex items-center gap-1 w-full justify-between sm:justify-end">
                    <button className="p-2 rounded-lg hover:bg-calendar-primary/15 text-zinc-600">
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <div className="px-2 md:px-4 py-2 flex flex-col items-center justify-center min-w-[100px] md:min-w-[120px]">
                      <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest md:tracking-[0.3em] leading-none mb-1">
                        APRIL
                      </span>
                      <span className="text-[8px] md:text-[9px] font-medium opacity-40 tracking-widest md:tracking-[0.4em] leading-none">
                        2026
                      </span>
                    </div>
                    <button className="p-2 rounded-lg hover:bg-calendar-primary/15 text-zinc-600">
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Static Grid Placeholder */}
              <div className="flex-1 p-1 sm:p-4 flex items-center justify-center border-2 border-dashed border-zinc-200 rounded-xl">
                <p className="text-zinc-400 font-medium uppercase tracking-widest text-sm">Calendar Grid Goes Here</p>
              </div>
            </div>
          </div>

          {/* Static Sidebar Placeholder */}
          <div className="w-full md:w-80 border-l border-zinc-200/50 bg-zinc-50/50 flex flex-col items-center justify-center p-8">
            <p className="text-zinc-400 font-medium uppercase tracking-widest text-sm text-center">Notes Panel<br/>Goes Here</p>
          </div>

        </div>
      </div>
    </div>
  );
}
