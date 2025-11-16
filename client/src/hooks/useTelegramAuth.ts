import { useEffect, useState } from "react";
import { trpc } from "@/lib/trpc";

export interface TelegramUser {
  id: number;
  telegramUsername: string;
}

export function useTelegramAuth() {
  const [user, setUser] = useState<TelegramUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check if user is already authenticated
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Try to fetch user info via tRPC
        const response = await fetch("/api/trpc/auth.me");
        if (response.ok) {
          const data = await response.json();
          if (data.result?.data) {
            setUser(data.result.data);
          }
        }
      } catch (err) {
        console.error("[Auth] Check failed:", err);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (telegramUsername: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/telegram/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ telegramUsername }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Login failed");
      }

      const data = await response.json();
      setUser(data.user);
      return data.user;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Login failed";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await fetch("/api/telegram/logout", { method: "POST" });
      setUser(null);
    } catch (err) {
      console.error("[Auth] Logout failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    login,
    logout,
  };
}
