import { protectedProcedure, router } from "../_core/trpc";

export const telegramRouter = router({
  /**
   * Register or update user's Telegram chat ID
   * Called when user connects the mini-app to their Telegram account
   */
  registerChatId: protectedProcedure
    .input((val: any) => ({
      telegramChatId: typeof val.telegramChatId === "string" ? val.telegramChatId : "",
      telegramUserId: typeof val.telegramUserId === "string" ? val.telegramUserId : "",
    }))
    .mutation(async ({ ctx, input }) => {
      const { createOrUpdateTelegramUser } = await import("../db");
      try {
        await createOrUpdateTelegramUser(
          ctx.user.id,
          input.telegramChatId,
          input.telegramUserId
        );
        return { success: true };
      } catch (error) {
        console.error("[Telegram Router] Error registering chat ID:", error);
        throw error;
      }
    }),
});
