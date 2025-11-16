import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

/**
 * Core user table storing only Telegram username.
 * Extend this file with additional tables as your product grows.
 */
export const users = sqliteTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: integer("id").primaryKey({ autoIncrement: true }),
  /** Telegram username (unique identifier). */
  telegramUsername: text("telegramUsername").notNull().unique(),
  createdAt: integer("createdAt", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
  lastSignedIn: integer("lastSignedIn", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Tasks table for storing user's scheduled events/tasks
 */
export const tasks = sqliteTable("tasks", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description"),
  scheduledAt: integer("scheduledAt", { mode: "timestamp" }).notNull(),
  timezone: text("timezone").default("UTC").notNull(),
  createdAt: integer("createdAt", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
});

export type Task = typeof tasks.$inferSelect;
export type InsertTask = typeof tasks.$inferInsert;

/**
 * Reminders table to track scheduled reminder times for each task
 * Stores the 4 reminder times: 1 day, 3 hours, 2 hours, 1 hour before event
 */
export const reminders = sqliteTable("reminders", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  taskId: integer("taskId").notNull().references(() => tasks.id, { onDelete: "cascade" }),
  userId: integer("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  reminderType: text("reminderType").notNull(),
  scheduledFor: integer("scheduledFor", { mode: "timestamp" }).notNull(),
  sent: integer("sent").default(0).notNull(),
  sentAt: integer("sentAt", { mode: "timestamp" }),
  createdAt: integer("createdAt", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
});

export type Reminder = typeof reminders.$inferSelect;
export type InsertReminder = typeof reminders.$inferInsert;

/**
 * Telegram user mapping to store user's Telegram chat ID for notifications
 */
export const telegramUsers = sqliteTable("telegramUsers", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("userId").notNull().unique().references(() => users.id, { onDelete: "cascade" }),
  telegramChatId: text("telegramChatId").notNull(),
  telegramUserId: text("telegramUserId").notNull(),
  createdAt: integer("createdAt", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
});

export type TelegramUser = typeof telegramUsers.$inferSelect;
export type InsertTelegramUser = typeof telegramUsers.$inferInsert;

/**
 * Terms table to store terms and conditions content
 */
export const terms = sqliteTable("terms", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  content: text("content").notNull(),
  order: integer("order").default(0).notNull(),
  active: integer("active").default(1).notNull(),
  createdAt: integer("createdAt", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
});

export type Term = typeof terms.$inferSelect;
export type InsertTerm = typeof terms.$inferInsert;

/**
 * User acceptances table to track which users have accepted terms
 */
export const userAcceptances = sqliteTable("userAcceptances", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  termsId: integer("termsId").notNull().references(() => terms.id, { onDelete: "cascade" }),
  acceptedAt: integer("acceptedAt", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
  createdAt: integer("createdAt", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
});

export type UserAcceptance = typeof userAcceptances.$inferSelect;
export type InsertUserAcceptance = typeof userAcceptances.$inferInsert;
