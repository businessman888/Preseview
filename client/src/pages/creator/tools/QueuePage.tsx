import { useState } from "react";
import { CreatorLayout } from "@/components/creator/CreatorLayout";
import { CalendarLegend } from "@/components/creator/queue/CalendarLegend";
import { CalendarGrid } from "@/components/creator/queue/CalendarGrid";
import { DayModal } from "@/components/creator/queue/DayModal";
import { SchedulePostModal } from "@/components/creator/queue/SchedulePostModal";
import { ReminderModal } from "@/components/creator/queue/ReminderModal";
import { useCalendarData, useDayDetails } from "@/hooks/use-queue";
import type { ScheduledPost, Reminder } from "@shared/schema";

export function QueuePage() {
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1);
  
  // Modal states
  const [isDayModalOpen, setIsDayModalOpen] = useState(false);
  const [isSchedulePostModalOpen, setIsSchedulePostModalOpen] = useState(false);
  const [isReminderModalOpen, setIsReminderModalOpen] = useState(false);
  
  // Selected data
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedScheduledPost, setSelectedScheduledPost] = useState<ScheduledPost | null>(null);
  const [selectedReminder, setSelectedReminder] = useState<Reminder | null>(null);

  // Fetch calendar data for current month
  const { data: calendarData, isLoading: isCalendarLoading } = useCalendarData(currentYear, currentMonth);
  
  // Fetch day details when a day is selected
  const { data: dayDetails, isLoading: isDayDetailsLoading } = useDayDetails(selectedDate || new Date());

  const handleDayClick = (date: Date) => {
    setSelectedDate(date);
    setIsDayModalOpen(true);
  };

  const handleMonthChange = (year: number, month: number) => {
    setCurrentYear(year);
    setCurrentMonth(month);
  };

  const handleSchedulePost = () => {
    setIsDayModalOpen(false);
    setIsSchedulePostModalOpen(true);
  };

  const handleCreateReminder = () => {
    setIsDayModalOpen(false);
    setIsReminderModalOpen(true);
  };

  const handleEditScheduledPost = (post: ScheduledPost) => {
    setSelectedScheduledPost(post);
    setIsDayModalOpen(false);
    setIsSchedulePostModalOpen(true);
  };

  const handleEditReminder = (reminder: Reminder) => {
    setSelectedReminder(reminder);
    setIsDayModalOpen(false);
    setIsReminderModalOpen(true);
  };

  const handleCloseDayModal = () => {
    setIsDayModalOpen(false);
    setSelectedDate(null);
  };

  const handleCloseSchedulePostModal = () => {
    setIsSchedulePostModalOpen(false);
    setSelectedScheduledPost(null);
  };

  const handleCloseReminderModal = () => {
    setIsReminderModalOpen(false);
    setSelectedReminder(null);
  };

  // Get items for selected date
  const getItemsForSelectedDate = () => {
    if (!selectedDate || !calendarData) {
      return { scheduledPosts: [], reminders: [], publishedPosts: [] };
    }

    const dateStr = selectedDate.toISOString().split('T')[0];
    
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

  const dayItems = getItemsForSelectedDate();

  return (
    <CreatorLayout>
      <div className="min-h-screen bg-gray-50 dark:bg-black">
        <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-6 py-4">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Fila
          </h1>
        </header>
        
        <main className="max-w-7xl mx-auto px-6 py-8 space-y-6">
          {/* Calendar Legend */}
          <CalendarLegend />
          
          {/* Calendar Grid */}
          <CalendarGrid
            year={currentYear}
            month={currentMonth}
            onDayClick={handleDayClick}
            calendarData={calendarData || { scheduledPosts: [], reminders: [], publishedPosts: [] }}
            isLoading={isCalendarLoading}
            onMonthChange={handleMonthChange}
          />
          
          {/* Day Modal */}
          <DayModal
            isOpen={isDayModalOpen}
            onClose={handleCloseDayModal}
            date={selectedDate}
            scheduledPosts={dayItems.scheduledPosts}
            reminders={dayItems.reminders}
            publishedPosts={dayItems.publishedPosts}
            onSchedulePost={handleSchedulePost}
            onCreateReminder={handleCreateReminder}
            onEditScheduledPost={handleEditScheduledPost}
            onEditReminder={handleEditReminder}
          />
          
          {/* Schedule Post Modal */}
          <SchedulePostModal
            isOpen={isSchedulePostModalOpen}
            onClose={handleCloseSchedulePostModal}
            selectedDate={selectedDate || undefined}
            scheduledPost={selectedScheduledPost}
            onEdit={handleCloseSchedulePostModal}
          />
          
          {/* Reminder Modal */}
          <ReminderModal
            isOpen={isReminderModalOpen}
            onClose={handleCloseReminderModal}
            selectedDate={selectedDate || undefined}
            reminder={selectedReminder}
          />
        </main>
      </div>
    </CreatorLayout>
  );
}

