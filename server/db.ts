import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, Task, InsertTask, Reminder, InsertReminder, reminders, tasks, telegramUsers, terms, userAcceptances } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function getUserByUsername(telegramUsername: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.telegramUsername, telegramUsername)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function createOrUpdateUser(telegramUsername: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot create user: database not available");
    return;
  }

  try {
    const existing = await getUserByUsername(telegramUsername);
    
    if (existing) {
      // Update lastSignedIn
      await db.update(users).set({ lastSignedIn: new Date() }).where(eq(users.telegramUsername, telegramUsername));
      return existing;
    }

    // Create new user
    const result = await db.insert(users).values({
      telegramUsername,
      lastSignedIn: new Date(),
    });

    return await getUserByUsername(telegramUsername);
  } catch (error) {
    console.error("[Database] Failed to create/update user:", error);
    throw error;
  }
}

// Task queries
export async function getTaskById(taskId: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(tasks).where(eq(tasks.id, taskId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getUserTasksList(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(tasks).where(eq(tasks.userId, userId)).orderBy(tasks.scheduledAt);
}

export async function createTask(task: InsertTask) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(tasks).values(task);
  return result;
}

export async function updateTask(taskId: number, updates: Partial<InsertTask>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.update(tasks).set(updates).where(eq(tasks.id, taskId));
}

export async function deleteTask(taskId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.delete(tasks).where(eq(tasks.id, taskId));
}

// Reminder queries
export async function createReminders(remindersList: InsertReminder[]) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(reminders).values(remindersList);
}

export async function getUnsentReminders() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(reminders).where(eq(reminders.sent, 0));
}

export async function markReminderAsSent(reminderId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.update(reminders).set({ sent: 1, sentAt: new Date() }).where(eq(reminders.id, reminderId));
}

export async function getRemindersByTaskId(taskId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(reminders).where(eq(reminders.taskId, taskId));
}

// Telegram user queries
export async function getTelegramUser(userId: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(telegramUsers).where(eq(telegramUsers.userId, userId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createOrUpdateTelegramUser(userId: number, telegramChatId: string, telegramUserId: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const existing = await getTelegramUser(userId);
  if (existing) {
    return db.update(telegramUsers).set({ telegramChatId, telegramUserId }).where(eq(telegramUsers.userId, userId));
  }
  return db.insert(telegramUsers).values({ userId, telegramChatId, telegramUserId });
}

// Terms queries
export async function getActiveTerms() {
  const db = await getDb();
  if (!db) return [];

  return db
    .select()
    .from(terms)
    .where(eq(terms.active, 1))
    .orderBy(terms.order);
}

export async function getUserAcceptancesList(userId: number) {
  const db = await getDb();
  if (!db) return [];

  return db.select().from(userAcceptances).where(eq(userAcceptances.userId, userId));
}

export async function hasUserAcceptedAllTerms(userId: number) {
  const db = await getDb();
  if (!db) return false;

  const activeTermsList = await getActiveTerms();
  if (activeTermsList.length === 0) return true;

  const acceptances = await getUserAcceptancesList(userId);
  const acceptedTermIds = new Set(acceptances.map((a) => a.termsId));

  return activeTermsList.every((term) => acceptedTermIds.has(term.id));
}

export async function recordUserAcceptance(userId: number, termsId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.insert(userAcceptances).values({
    userId,
    termsId,
  });
}
