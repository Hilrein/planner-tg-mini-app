import { Request, Response } from "express";
import { createOrUpdateUser, getUserByUsername } from "../db";
import { User } from "../../drizzle/schema";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./cookies";
import crypto from "crypto";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export interface TelegramUserData {
  telegramUsername: string;
}

/**
 * Create a simple JWT token for session management
 */
function createSessionToken(telegramUsername: string): string {
  const payload = {
    telegramUsername,
    iat: Math.floor(Date.now() / 1000),
  };

  // Simple JWT encoding (header.payload.signature)
  const header = Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString("base64url");
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = crypto
    .createHmac("sha256", JWT_SECRET)
    .update(`${header}.${body}`)
    .digest("base64url");

  return `${header}.${body}.${signature}`;
}

/**
 * Verify and decode JWT token
 */
function verifySessionToken(token: string): TelegramUserData | null {
  try {
    const [header, body, signature] = token.split(".");
    
    // Verify signature
    const expectedSignature = crypto
      .createHmac("sha256", JWT_SECRET)
      .update(`${header}.${body}`)
      .digest("base64url");

    if (signature !== expectedSignature) {
      return null;
    }

    // Decode payload
    const payload = JSON.parse(Buffer.from(body, "base64url").toString("utf-8"));
    return {
      telegramUsername: payload.telegramUsername,
    };
  } catch (error) {
    console.error("[TelegramAuth] Token verification failed:", error);
    return null;
  }
}

/**
 * Authenticate a request by checking the session cookie
 */
export async function authenticateTelegramRequest(req: Request): Promise<User | null> {
  try {
    const cookies = req.headers.cookie || "";
    const cookieMatch = cookies.match(new RegExp(`${COOKIE_NAME}=([^;]+)`));
    
    if (!cookieMatch) {
      return null;
    }

    const token = cookieMatch[1];
    const userData = verifySessionToken(token);

    if (!userData) {
      return null;
    }

    const user = await getUserByUsername(userData.telegramUsername);
    return user || null;
  } catch (error) {
    console.error("[TelegramAuth] Authentication failed:", error);
    return null;
  }
}

/**
 * Create a login session for a Telegram user
 */
export async function createTelegramSession(
  req: Request,
  res: Response,
  telegramUsername: string
): Promise<User> {
  try {
    // Create or update user in database
    const user = await createOrUpdateUser(telegramUsername);
    
    if (!user) {
      throw new Error("Failed to create user");
    }

    // Create session token
    const token = createSessionToken(telegramUsername);

    // Set session cookie
    const cookieOptions = getSessionCookieOptions(req);
    res.cookie(COOKIE_NAME, token, cookieOptions);

    return user;
  } catch (error) {
    console.error("[TelegramAuth] Failed to create session:", error);
    throw error;
  }
}

/**
 * Logout user by clearing session cookie
 */
export function logoutTelegramUser(req: Request, res: Response): void {
  const cookieOptions = getSessionCookieOptions(req);
  res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
}
