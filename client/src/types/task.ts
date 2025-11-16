export interface Task {
  id: number;
  userId: number;
  title: string;
  description?: string | null;
  scheduledAt: Date | string;
  timezone: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface Reminder {
  id: number;
  taskId: number;
  userId: number;
  reminderType: "1day" | "3hours" | "2hours" | "1hour";
  scheduledFor: Date | string;
  sent: number;
  sentAt?: Date | string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
}
