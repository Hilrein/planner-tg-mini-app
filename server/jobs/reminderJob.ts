import { getUnsentReminders, markReminderAsSent, getTelegramUser, getTaskById } from "../db";

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_API_URL = "https://api.telegram.org/bot";

/**
 * Send a message to Telegram user via bot
 */
async function sendTelegramMessage(chatId: string, message: string): Promise<boolean> {
  if (!TELEGRAM_BOT_TOKEN) {
    console.warn("[Reminder Job] Telegram bot token not configured");
    return false;
  }

  try {
    const response = await fetch(`${TELEGRAM_API_URL}${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: "HTML",
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error("[Reminder Job] Failed to send Telegram message:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("[Reminder Job] Error sending Telegram message:", error);
    return false;
  }
}

/**
 * Format reminder message based on reminder type
 */
function formatReminderMessage(taskTitle: string, reminderType: string): string {
  const reminderTexts: Record<string, string> = {
    "1day": "⏰ Reminder: Your task is scheduled for tomorrow!",
    "3hours": "⏰ Reminder: Your task is in 3 hours!",
    "2hours": "⏰ Reminder: Your task is in 2 hours!",
    "1hour": "⏰ Reminder: Your task is in 1 hour!",
  };

  const reminderText = reminderTexts[reminderType] || "⏰ Reminder: Your task is coming up!";
  return `${reminderText}\\n\\n<b>${taskTitle}</b>`;
}

/**
 * Process and send pending reminders
 * This function should be called periodically (e.g., every minute)
 */
export async function processPendingReminders() {
  try {
    const now = new Date();
    const reminders = await getUnsentReminders();

    for (const reminder of reminders) {
      // Check if it's time to send this reminder
      if (reminder.scheduledFor > now) {
        continue;
      }

      try {
        // Get task details
        const task = await getTaskById(reminder.taskId);
        if (!task) {
          console.warn(`[Reminder Job] Task ${reminder.taskId} not found`);
          continue;
        }

        // Get user's Telegram chat ID
        const telegramUser = await getTelegramUser(reminder.userId);
        if (!telegramUser) {
          console.warn(`[Reminder Job] Telegram user not found for user ${reminder.userId}`);
          continue;
        }

        // Format and send message
        const message = formatReminderMessage(task.title, reminder.reminderType);
        const sent = await sendTelegramMessage(telegramUser.telegramChatId, message);

        if (sent) {
          // Mark reminder as sent
          await markReminderAsSent(reminder.id);
          console.log(`[Reminder Job] Reminder sent for task ${reminder.taskId}`);
        }
      } catch (error) {
        console.error(`[Reminder Job] Error processing reminder ${reminder.id}:`, error);
      }
    }
  } catch (error) {
    console.error("[Reminder Job] Error in processPendingReminders:", error);
  }
}

/**
 * Start the reminder job scheduler
 * Runs every minute to check for pending reminders
 */
export function startReminderJob() {
  // Run immediately on startup
  processPendingReminders().catch(console.error);

  // Then run every minute
  const intervalId = setInterval(() => {
    processPendingReminders().catch(console.error);
  }, 60 * 1000); // 60 seconds

  console.log("[Reminder Job] Reminder job scheduler started");

  return intervalId;
}
