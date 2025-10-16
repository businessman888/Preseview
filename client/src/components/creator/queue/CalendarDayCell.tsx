import { useState } from "react";
import { cn } from "@/lib/utils";
import type { ScheduledPost, Reminder, Post } from "@shared/schema";

interface CalendarDayCellProps {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
  scheduledPosts: ScheduledPost[];
  reminders: Reminder[];
  publishedPosts: Post[];
  onClick: (date: Date) => void;
}

export function CalendarDayCell({
  date,
  isCurrentMonth,
  isToday,
  isSelected,
  scheduledPosts,
  reminders,
  publishedPosts,
  onClick,
}: CalendarDayCellProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  const dayNumber = date.getDate();
  const hasScheduledPosts = scheduledPosts.length > 0;
  const hasReminders = reminders.length > 0;
  const hasPublishedPosts = publishedPosts.length > 0;
  const totalItems = scheduledPosts.length + reminders.length + publishedPosts.length;

  const handleClick = () => {
    onClick(date);
  };

  return (
    <div className="relative">
      <button
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={cn(
          "w-full h-20 flex flex-col items-center justify-start p-2 text-sm font-medium transition-colors",
          "hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg",
          isCurrentMonth
            ? "text-gray-900 dark:text-gray-100"
            : "text-gray-400 dark:text-gray-600",
          isToday && "bg-pink-50 dark:bg-pink-900/20",
          isSelected && "bg-pink-100 dark:bg-pink-900/40"
        )}
      >
        {/* Day number */}
        <span
          className={cn(
            "mb-1",
            isToday && "text-pink-600 dark:text-pink-400 font-bold",
            isSelected && "text-pink-700 dark:text-pink-300"
          )}
        >
          {dayNumber}
        </span>

        {/* Indicators */}
        <div className="flex flex-wrap gap-1 justify-center">
          {/* Scheduled Posts Indicator */}
          {hasScheduledPosts && (
            <div className="w-2 h-2 rounded-full bg-pink-500" title={`${scheduledPosts.length} post(s) agendado(s)`} />
          )}
          
          {/* Reminders Indicator */}
          {hasReminders && (
            <div className="w-2 h-2 rounded-full bg-green-500" title={`${reminders.length} lembrete(s)`} />
          )}
          
          {/* Published Posts Indicator */}
          {hasPublishedPosts && (
            <div className="w-2 h-2 rounded-full bg-blue-500" title={`${publishedPosts.length} post(s) publicado(s)`} />
          )}
        </div>
      </button>

      {/* Hover tooltip */}
      {isHovered && totalItems > 0 && (
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 z-10">
          <div className="bg-gray-900 text-white text-xs rounded-lg px-3 py-2 shadow-lg">
            <div className="whitespace-nowrap">
              {hasScheduledPosts && (
                <div>🟣 {scheduledPosts.length} post(s) agendado(s)</div>
              )}
              {hasReminders && (
                <div>🟢 {reminders.length} lembrete(s)</div>
              )}
              {hasPublishedPosts && (
                <div>🔵 {publishedPosts.length} post(s) publicado(s)</div>
              )}
            </div>
            <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45"></div>
          </div>
        </div>
      )}
    </div>
  );
}
