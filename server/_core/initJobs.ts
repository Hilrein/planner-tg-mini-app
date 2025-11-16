import { startReminderJob } from "../jobs/reminderJob";

let reminderJobInterval: NodeJS.Timeout | null = null;

export function initializeJobs() {
  if (reminderJobInterval) {
    console.log("[Jobs] Jobs already initialized");
    return;
  }

  console.log("[Jobs] Initializing background jobs...");
  reminderJobInterval = startReminderJob();
}

export function stopJobs() {
  if (reminderJobInterval) {
    clearInterval(reminderJobInterval);
    reminderJobInterval = null;
    console.log("[Jobs] Background jobs stopped");
  }
}
