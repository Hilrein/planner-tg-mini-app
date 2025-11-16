import { Task } from "@/types/task";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, Edit2, Clock } from "lucide-react";

interface TaskListProps {
  tasks: Task[];
  selectedDate?: Date;
  onEdit?: (task: Task) => void;
  onDelete?: (taskId: number) => void;
  isLoading?: boolean;
}

export default function TaskList({ tasks, selectedDate, onEdit, onDelete, isLoading }: TaskListProps) {
  // Filter tasks by selected date if provided
  let filteredTasks = tasks;
  if (selectedDate) {
    const dateKey = selectedDate.toISOString().split("T")[0];
    filteredTasks = tasks.filter((task) => {
      const taskDateKey = new Date(task.scheduledAt).toISOString().split("T")[0];
      return taskDateKey === dateKey;
    });
  }

  // Sort tasks by scheduled time
  filteredTasks = [...filteredTasks].sort((a, b) => {
    return new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime();
  });

  const formatTime = (date: Date | string) => {
    return new Date(date).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  const getTimeUntil = (date: Date | string) => {
    const now = new Date();
    const diff = new Date(date).getTime() - now.getTime();

    if (diff < 0) return "Overdue";
    if (diff < 60 * 60 * 1000) return `${Math.round(diff / (60 * 1000))}m away`;
    if (diff < 24 * 60 * 60 * 1000) return `${Math.round(diff / (60 * 60 * 1000))}h away`;
    return `${Math.round(diff / (24 * 60 * 60 * 1000))}d away`;
  };

  if (filteredTasks.length === 0) {
    return (
      <div className="text-center py-8 sm:py-12 text-muted-foreground">
        <Clock className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-2 opacity-50" />
        <p className="text-sm sm:text-base">No tasks scheduled</p>
        {selectedDate && <p className="text-xs sm:text-sm">for {formatDate(selectedDate)}</p>}
      </div>
    );
  }

  return (
    <div className="space-y-2 sm:space-y-3">
      {filteredTasks.map((task) => (
        <Card key={task.id} className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-2 sm:pb-3 px-3 sm:px-6 pt-3 sm:pt-4">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
              <div className="flex-1 min-w-0">
                <CardTitle className="text-base sm:text-lg break-words">{task.title}</CardTitle>
                <CardDescription className="mt-1 text-xs sm:text-sm">
                  {formatDate(task.scheduledAt)} at {formatTime(task.scheduledAt)}
                </CardDescription>
              </div>
              <div className="text-right text-sm font-medium text-primary whitespace-nowrap">
                {getTimeUntil(task.scheduledAt)}
              </div>
            </div>
          </CardHeader>

          {task.description && (
            <CardContent className="pb-2 sm:pb-3 px-3 sm:px-6">
              <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2">{task.description}</p>
            </CardContent>
          )}

          <CardContent className="flex gap-1 sm:gap-2 justify-end px-3 sm:px-6 pb-3 sm:pb-4">
            {onEdit && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEdit(task)}
                disabled={isLoading}
                className="h-8 sm:h-9 text-xs sm:text-sm"
              >
                <Edit2 className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="ml-1 hidden sm:inline">Edit</span>
              </Button>
            )}
            {onDelete && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onDelete(task.id)}
                disabled={isLoading}
                className="h-8 sm:h-9 text-xs sm:text-sm text-destructive hover:text-destructive"
              >
                <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="ml-1 hidden sm:inline">Delete</span>
              </Button>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
