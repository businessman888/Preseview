import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CalendarDayCell } from "./CalendarDayCell";
import { Skeleton } from "@/components/ui/skeleton";
import type { ScheduledPost, Reminder, Post } from "@shared/schema";

interface CalendarGridProps {
  year: number;
  month: number;
  onDayClick: (date: Date) => void;
  calendarData: {
    scheduledPosts: ScheduledPost[];
    reminders: Reminder[];
    publishedPosts: Post[];
  };
  isLoading?: boolean;
  onMonthChange: (year: number, month: number) => void;
}

const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function CalendarGrid({
  year,
  month,
  onDayClick,
  calendarData,
  isLoading = false,
  onMonthChange,
}: CalendarGridProps) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const handlePreviousMonth = () => {
    if (month === 1) {
      onMonthChange(year - 1, 12);
    } else {
      onMonthChange(year, month - 1);
    }
  };

  const handleNextMonth = () => {
    if (month === 12) {
      onMonthChange(year + 1, 1);
    } else {
      onMonthChange(year, month + 1);
    }
  };

  const handleDayClick = (date: Date) => {
    setSelectedDate(date);
    onDayClick(date);
  };

  // Get first day of month and number of days
  const firstDayOfMonth = new Date(year, month - 1, 1);
  const lastDayOfMonth = new Date(year, month, 0);
  const daysInMonth = lastDayOfMonth.getDate();
  
  // Get starting day of week (0 = Sunday, 1 = Monday, etc.)
  const startingDayOfWeek = firstDayOfMonth.getDay();

  // Generate calendar days
  const calendarDays = [];
  
  // Add empty cells for days before the first day of the month
  for (let i = 0; i < startingDayOfWeek; i++) {
    const date = new Date(year, month - 1, -startingDayOfWeek + i + 1);
    calendarDays.push(date);
  }
  
  // Add days of the current month
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month - 1, day);
    calendarDays.push(date);
  }
  
  // Fill remaining cells to complete the grid (42 cells = 6 weeks)
  const remainingCells = 42 - calendarDays.length;
  for (let i = 1; i <= remainingCells; i++) {
    const date = new Date(year, month, i);
    calendarDays.push(date);
  }

  // Helper function to get items for a specific date
  const getItemsForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    
    const scheduledPosts = calendarData.scheduledPosts.filter(post => {
      const postDate = new Date(post.scheduledDate).toISOString().split('T')[0];
      return postDate === dateStr;
    });
    
    const reminders = calendarData.reminders.filter(reminder => {
      const reminderDate = new Date(reminder.reminderDate).toISOString().split('T')[0];
      return reminderDate === dateStr;
    });
    
    const publishedPosts = calendarData.publishedPosts.filter(post => {
      const postDate = new Date(post.createdAt).toISOString().split('T')[0];
      return postDate === dateStr;
    });
    
    return { scheduledPosts, reminders, publishedPosts };
  };

  // Check if date is today
  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  // Check if date is in current month
  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === month - 1 && date.getFullYear() === year;
  };

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
        <div className="flex items-center justify-between mb-6">
          <Skeleton className="h-8 w-32" />
          <div className="flex gap-2">
            <Skeleton className="h-8 w-8" />
            <Skeleton className="h-8 w-8" />
          </div>
        </div>
        
        <div className="grid grid-cols-7 gap-1">
          {dayNames.map((day) => (
            <div key={day} className="text-center py-2">
              <Skeleton className="h-4 w-8 mx-auto" />
            </div>
          ))}
          {Array.from({ length: 42 }).map((_, index) => (
            <Skeleton key={index} className="h-20 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
      {/* Header with month/year and navigation */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          {monthNames[month - 1]} {year}
        </h2>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={handlePreviousMonth}
            className="h-8 w-8"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={handleNextMonth}
            className="h-8 w-8"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {/* Day headers */}
        {dayNames.map((day) => (
          <div key={day} className="text-center py-2">
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
              {day}
            </span>
          </div>
        ))}
        
        {/* Calendar days */}
        {calendarDays.map((date, index) => {
          const items = getItemsForDate(date);
          
          return (
            <CalendarDayCell
              key={index}
              date={date}
              isCurrentMonth={isCurrentMonth(date)}
              isToday={isToday(date)}
              isSelected={selectedDate?.getTime() === date.getTime()}
              scheduledPosts={items.scheduledPosts}
              reminders={items.reminders}
              publishedPosts={items.publishedPosts}
              onClick={handleDayClick}
            />
          );
        })}
      </div>
    </div>
  );
}
