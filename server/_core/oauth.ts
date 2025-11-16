import type { Express, Request, Response } from "express";
import { createTelegramSession, logoutTelegramUser } from "./telegramAuth";

function getQueryParam(req: Request, key: string): string | undefined {
  const value = req.query[key];
  return typeof value === "string" ? value : undefined;
}

export function registerOAuthRoutes(app: Express) {
  /**
   * Telegram login endpoint
   * Expects: POST /api/telegram/login with { telegramUsername: string }
   */
  app.post("/api/telegram/login", async (req: Request, res: Response) => {
    try {
      const { telegramUsername } = req.body;

      if (!telegramUsername || typeof telegramUsername !== "string") {
        res.status(400).json({ error: "telegramUsername is required" });
        return;
      }

      // Validate username format (Telegram usernames are alphanumeric and underscore)
      if (!/^[a-zA-Z0-9_]{5,32}$/.test(telegramUsername)) {
        res.status(400).json({ error: "Invalid Telegram username format" });
        return;
      }

      const user = await createTelegramSession(req, res, telegramUsername);
      res.json({ success: true, user: { id: user.id, telegramUsername: user.telegramUsername } });
    } catch (error) {
      console.error("[TelegramAuth] Login failed:", error);
      res.status(500).json({ error: "Login failed" });
    }
  });

  /**
   * Telegram logout endpoint
   * Expects: POST /api/telegram/logout
   */
  app.post("/api/telegram/logout", (req: Request, res: Response) => {
    try {
      logoutTelegramUser(req, res);
      res.json({ success: true });
    } catch (error) {
      console.error("[TelegramAuth] Logout failed:", error);
      res.status(500).json({ error: "Logout failed" });
    }
  });
}
