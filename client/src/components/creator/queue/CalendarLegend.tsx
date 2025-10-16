import { Calendar, Clock, CheckCircle } from "lucide-react";

export function CalendarLegend() {
  return (
    <div className="flex items-center gap-6 px-4 py-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 rounded-full bg-pink-500"></div>
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Posts Agendados
        </span>
      </div>
      
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 rounded-full bg-green-500"></div>
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Lembretes
        </span>
      </div>
      
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 rounded-full bg-blue-500"></div>
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Posts Publicados
        </span>
      </div>
    </div>
  );
}
