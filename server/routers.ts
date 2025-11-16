import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { telegramRouter } from "./routers/telegramRouter";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  telegram: telegramRouter,

  terms: router({
    list: publicProcedure.query(async () => {
      const { getActiveTerms } = await import("./db");
      return getActiveTerms();
    }),
    acceptAll: protectedProcedure
      .input((val: any) => ({
        termsIds: Array.isArray(val.termsIds) ? val.termsIds : [],
      }))
      .mutation(async ({ ctx, input }) => {
        const { recordUserAcceptance } = await import("./db");
        for (const termsId of input.termsIds) {
          await recordUserAcceptance(ctx.user.id, termsId);
        }
        return { success: true };
      }),
    checkAccepted: protectedProcedure.query(async ({ ctx }) => {
      const { hasUserAcceptedAllTerms } = await import("./db");
      return hasUserAcceptedAllTerms(ctx.user.id);
    }),
  }),

  tasks: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      const { getUserTasksList } = await import("./db");
      return getUserTasksList(ctx.user.id);
    }),
    create: protectedProcedure
      .input((val: any) => ({
        title: typeof val.title === "string" ? val.title : "",
        description: typeof val.description === "string" ? val.description : undefined,
        scheduledAt: val.scheduledAt instanceof Date ? val.scheduledAt : new Date(val.scheduledAt),
        timezone: typeof val.timezone === "string" ? val.timezone : "UTC",
      }))
      .mutation(async ({ ctx, input }) => {
        const { createTask, createReminders } = await import("./db");
        const task = await createTask({
          userId: ctx.user.id,
          title: input.title,
          description: input.description,
          scheduledAt: input.scheduledAt,
          timezone: input.timezone,
        });

        // Calculate reminder times
        const remindersToCreate = [
          { offset: 24 * 60 * 60 * 1000, type: "1day" as const },
          { offset: 3 * 60 * 60 * 1000, type: "3hours" as const },
          { offset: 2 * 60 * 60 * 1000, type: "2hours" as const },
          { offset: 1 * 60 * 60 * 1000, type: "1hour" as const },
        ].map((reminder) => ({
          taskId: (task as any).insertId,
          userId: ctx.user.id,
          reminderType: reminder.type,
          scheduledFor: new Date(input.scheduledAt.getTime() - reminder.offset),
          sent: 0,
        }));

        await createReminders(remindersToCreate);
        return task;
      }),
    update: protectedProcedure
      .input((val: any) => ({
        id: typeof val.id === "number" ? val.id : 0,
        title: typeof val.title === "string" ? val.title : "",
        description: typeof val.description === "string" ? val.description : undefined,
        scheduledAt: val.scheduledAt instanceof Date ? val.scheduledAt : new Date(val.scheduledAt),
        timezone: typeof val.timezone === "string" ? val.timezone : "UTC",
      }))
      .mutation(async ({ ctx, input }) => {
        const { updateTask } = await import("./db");
        return updateTask(input.id, {
          title: input.title,
          description: input.description,
          scheduledAt: input.scheduledAt,
          timezone: input.timezone,
        });
      }),
    delete: protectedProcedure
      .input((val: any) => ({ id: typeof val.id === "number" ? val.id : 0 }))
      .mutation(async ({ ctx, input }) => {
        const { deleteTask } = await import("./db");
        return deleteTask(input.id);
      }),
  }),
});

export type AppRouter = typeof appRouter;
