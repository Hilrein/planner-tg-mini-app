import { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus, LogOut } from "lucide-react";
import { APP_TITLE } from "@/const";
import { trpc } from "@/lib/trpc";
import Calendar from "@/components/Calendar";
import TaskForm from "@/components/TaskForm";
import TaskList from "@/components/TaskList";
import { Loader2 } from "lucide-react";
import { useTelegramAuth } from "@/hooks/useTelegramAuth";

export default function Home() {
  const { user, loading: authLoading, logout } = useTelegramAuth();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [taskFormOpen, setTaskFormOpen] = useState(false);
  const [animateIn, setAnimateIn] = useState(false);

  // Trigger animation on mount
  useEffect(() => {
    setAnimateIn(true);
  }, []);

  // Fetch tasks
  const { data: tasks = [], isLoading: tasksLoading, refetch: refetchTasks } = trpc.tasks.list.useQuery(
    undefined,
    { enabled: !!user }
  );

  // Create task mutation
  const createTaskMutation = trpc.tasks.create.useMutation({
    onSuccess: () => {
      refetchTasks();
      setTaskFormOpen(false);
    },
  });

  // Delete task mutation
  const deleteTaskMutation = trpc.tasks.delete.useMutation({
    onSuccess: () => {
      refetchTasks();
    },
  });

  // Calculate task counts by date
  const tasksByDate = useMemo(() => {
    const counts: Record<string, number> = {};
    tasks.forEach((task) => {
      const dateKey = new Date(task.scheduledAt).toISOString().split("T")[0];
      counts[dateKey] = (counts[dateKey] || 0) + 1;
    });
    return counts;
  }, [tasks]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  const filteredTasks = selectedDate
    ? tasks.filter((task) => {
        const taskDate = new Date(task.scheduledAt).toISOString().split("T")[0];
        const selectedDateStr = selectedDate.toISOString().split("T")[0];
        return taskDate === selectedDateStr;
      })
    : tasks;

  return (
    <div className={`min-h-screen bg-gradient-to-br from-primary/5 via-background to-primary/10 transition-all duration-1000 ${
      animateIn ? "opacity-100" : "opacity-0"
    }`}>
      {/* Header */}
      <div className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-4 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl font-bold">{APP_TITLE}</h1>
            <p className="text-sm text-muted-foreground">Welcome, @{user?.telegramUsername}</p>
          </div>
          <div className="flex gap-2 sm:gap-3">
            <Button
              onClick={() => setTaskFormOpen(true)}
              size="sm"
              className="gap-2 flex-1 sm:flex-none"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">New Task</span>
              <span className="sm:hidden">New</span>
            </Button>
            <Button
              onClick={() => logout()}
              variant="outline"
              size="sm"
              className="gap-2"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Sign Out</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="container mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-1">
          <Calendar
            tasksOnDate={tasksByDate}
            selectedDate={selectedDate}
            onDateSelect={setSelectedDate}
          />
        </div>

        {/* Tasks */}
        <div className="lg:col-span-2">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">
                {selectedDate
                  ? `Tasks for ${selectedDate.toLocaleDateString()}`
                  : "All Tasks"}
              </h2>
              {selectedDate && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedDate(undefined)}
                >
                  Clear filter
                </Button>
              )}
            </div>

            {tasksLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin" />
              </div>
            ) : (
              <TaskList
                tasks={filteredTasks}
                onDelete={(taskId) => deleteTaskMutation.mutate({ id: taskId })}
              />
            )}
          </div>
        </div>
      </div>

      {/* Task form dialog */}
      <TaskForm
        open={taskFormOpen}
        onOpenChange={setTaskFormOpen}
        onSubmit={(data) => {
          createTaskMutation.mutate({
            title: data.title,
            description: data.description,
            scheduledAt: data.scheduledAt,
            timezone: data.timezone,
          });
        }}
        isLoading={createTaskMutation.isPending}
      />

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
