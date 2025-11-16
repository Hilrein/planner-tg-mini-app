import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CalendarProps {
  onDateSelect: (date: Date) => void;
  selectedDate?: Date;
  tasksOnDate?: Record<string, number>; // date string -> count
}

export default function Calendar({ onDateSelect, selectedDate, tasksOnDate = {} }: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const formatDateKey = (date: Date) => {
    return date.toISOString().split("T")[0];
  };

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);
  const days = [];

  // Empty cells for days before month starts
  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }

  // Days of the month
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(new Date(currentDate.getFullYear(), currentDate.getMonth(), i));
  }

  const monthName = currentDate.toLocaleString("default", { month: "long", year: "numeric" });

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const handleDateClick = (date: Date) => {
    onDateSelect(date);
  };

  return (
    <div className="w-full bg-white rounded-lg shadow-sm border border-border p-3 sm:p-4">
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <h2 className="text-base sm:text-lg font-semibold">{monthName}</h2>
        <div className="flex gap-1 sm:gap-2">
          <Button variant="ghost" size="sm" onClick={handlePrevMonth} className="h-8 w-8 sm:h-9 sm:w-9 p-0">
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={handleNextMonth} className="h-8 w-8 sm:h-9 sm:w-9 p-0">
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-0.5 sm:gap-1 mb-2">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="text-center text-xs sm:text-sm font-medium text-muted-foreground py-1 sm:py-2">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-0.5 sm:gap-1">
        {days.map((date, index) => {
          if (!date) {
            return <div key={`empty-${index}`} className="aspect-square" />;
          }

          const dateKey = formatDateKey(date);
          const taskCount = tasksOnDate[dateKey] || 0;
          const isSelected = selectedDate && formatDateKey(selectedDate) === dateKey;
          const isToday = formatDateKey(new Date()) === dateKey;

          return (
            <button
              key={dateKey}
              onClick={() => handleDateClick(date)}
              className={`
                aspect-square p-0.5 sm:p-1 rounded-md text-xs sm:text-sm font-medium transition-colors
                ${isSelected ? "bg-primary text-primary-foreground" : ""}
                ${isToday && !isSelected ? "bg-accent text-accent-foreground" : ""}
                ${!isSelected && !isToday ? "hover:bg-muted" : ""}
                ${taskCount > 0 ? "ring-1 ring-primary" : ""}
              `}
            >
              <div className="flex flex-col items-center justify-center h-full">
                <span className="text-xs sm:text-sm">{date.getDate()}</span>
                {taskCount > 0 && <span className="text-xs">{taskCount}</span>}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
