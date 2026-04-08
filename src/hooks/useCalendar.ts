import { useState, useCallback } from 'react';
import { addMonths, subMonths, isSameDay, isBefore, isAfter } from 'date-fns';

export function useCalendar(initialDate: Date = new Date()) {
  const [currentDate, setCurrentDate] = useState(initialDate);
  const [rangeStart, setRangeStart] = useState<Date | null>(null);
  const [rangeEnd, setRangeEnd] = useState<Date | null>(null);
  const [hoverDate, setHoverDate] = useState<Date | null>(null);
  const [isDraggingRange, setIsDraggingRange] = useState(false);

  const handlePrevMonth = useCallback(() => setCurrentDate(subMonths(currentDate, 1)), [currentDate]);
  const handleNextMonth = useCallback(() => setCurrentDate(addMonths(currentDate, 1)), [currentDate]);

  const handleDateClick = useCallback((date: Date) => {
    if (isDraggingRange) return;
    if (!rangeStart || (rangeStart && rangeEnd)) {
      setRangeStart(date);
      setRangeEnd(null);
    } else {
      if (isSameDay(date, rangeStart)) {
        setRangeStart(null);
        setRangeEnd(null);
      } else {
        setRangeEnd(date);
      }
    }
  }, [rangeStart, rangeEnd, isDraggingRange]);

  const handleLongPress = useCallback((date: Date) => {
    setRangeStart(date);
    setRangeEnd(null);
    setHoverDate(date);
    setIsDraggingRange(true);
  }, []);

  const handleRangeDragEnd = useCallback(() => {
    if (isDraggingRange) {
      setIsDraggingRange(false);
      if (hoverDate && rangeStart && hoverDate.getTime() !== rangeStart.getTime()) {
        if (isBefore(hoverDate, rangeStart)) {
          setRangeEnd(rangeStart);
          setRangeStart(hoverDate);
        } else {
          setRangeEnd(hoverDate);
        }
      }
    }
  }, [isDraggingRange, hoverDate, rangeStart]);

  return {
    currentDate,
    setCurrentDate,
    rangeStart,
    rangeEnd,
    hoverDate,
    setHoverDate,
    isDraggingRange,
    handlePrevMonth,
    handleNextMonth,
    handleDateClick,
    handleLongPress,
    handleRangeDragEnd,
  };
}
