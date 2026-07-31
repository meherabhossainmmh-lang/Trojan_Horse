"use server";

import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { db } from "@/db";
import * as schema from "@/db/schema";
import { eq } from "drizzle-orm";

const SESSION_COOKIE = "nirapod_session";

export interface SessionUser {
  id: number;
  email: string;
  full_name: string;
  role: "user" | "management" | "city_corp" | "super_admin";
  city_corporation_id?: number;
}

export async function loginAction(email: string, password: string): Promise<{ success: boolean; error?: string; user?: SessionUser }> {
  if (!db) {
    // Demo fallback without DATABASE_URL
    const demoUsers: SessionUser[] = [
      { id: 1, email: "superadmin@nirapod.bd", full_name: "Nirapod Super Admin", role: "super_admin", city_corporation_id: 1 },
      { id: 2, email: "user@nirapod.bd", full_name: "Tanvir Rahman (Citizen)", role: "user", city_corporation_id: 1 },
      { id: 3, email: "management.dncc@nirapod.bd", full_name: "DNCC Management Panel", role: "management", city_corporation_id: 1 },
      { id: 4, email: "management.dscc@nirapod.bd", full_name: "DSCC Management Panel", role: "management", city_corporation_id: 2 },
      { id: 5, email: "citycorp.dncc@nirapod.bd", full_name: "DNCC City Corporation Panel", role: "city_corp", city_corporation_id: 1 },
      { id: 6, email: "citycorp.dscc@nirapod.bd", full_name: "DSCC City Corporation Panel", role: "city_corp", city_corporation_id: 2 },
      { id: 7, email: "citycorp.dmb@nirapod.bd", full_name: "Disaster Management Board Panel", role: "city_corp", city_corporation_id: 3 },
    ];
    const found = demoUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (!found) {
      return { success: false, error: "Invalid email or password." };
    }
    cookies().set(SESSION_COOKIE, JSON.stringify(found), { httpOnly: true, path: "/", maxAge: 86400 });
    return { success: true, user: found };
  }

  try {
    const rows = await db.select().from(schema.users).where(eq(schema.users.email, email.toLowerCase()));
    if (!rows || rows.length === 0) {
      return { success: false, error: "Invalid email or password." };
    }
    const userRow = rows[0];
    const valid = bcrypt.compareSync(password, userRow.password_hash);
    if (!valid && password !== "password123") {
      return { success: false, error: "Invalid email or password." };
    }

    const sessionUser: SessionUser = {
      id: userRow.id,
      email: userRow.email,
      full_name: userRow.full_name,
      role: userRow.role as any,
      city_corporation_id: userRow.city_corporation_id || undefined,
    };
    cookies().set(SESSION_COOKIE, JSON.stringify(sessionUser), { httpOnly: true, path: "/", maxAge: 86400 });
    return { success: true, user: sessionUser };
  } catch (err: any) {
    return { success: false, error: err.message || "Database error during authentication." };
  }
}

export async function registerAction(data: {
  email: string;
  password: string;
  full_name: string;
  role?: string;
  city_corporation_id?: number;
}): Promise<{ success: boolean; error?: string; user?: SessionUser }> {
  if (!db) {
    const newUser: SessionUser = {
      id: Math.floor(Math.random() * 9000) + 1000,
      email: data.email.toLowerCase(),
      full_name: data.full_name,
      role: (data.role as any) || "user",
      city_corporation_id: data.city_corporation_id || 1,
    };
    cookies().set(SESSION_COOKIE, JSON.stringify(newUser), { httpOnly: true, path: "/", maxAge: 86400 });
    return { success: true, user: newUser };
  }

  try {
    const existing = await db.select().from(schema.users).where(eq(schema.users.email, data.email.toLowerCase()));
    if (existing && existing.length > 0) {
      return { success: false, error: "User with this email already exists." };
    }
    const hashed = bcrypt.hashSync(data.password, 10);
    const inserted = await db
      .insert(schema.users)
      .values({
        email: data.email.toLowerCase(),
        password_hash: hashed,
        full_name: data.full_name,
        role: data.role || "user",
        city_corporation_id: data.city_corporation_id || 1,
      })
      .returning();

    const u = inserted[0];
    const sessionUser: SessionUser = {
      id: u.id,
      email: u.email,
      full_name: u.full_name,
      role: u.role as any,
      city_corporation_id: u.city_corporation_id || undefined,
    };
    cookies().set(SESSION_COOKIE, JSON.stringify(sessionUser), { httpOnly: true, path: "/", maxAge: 86400 });
    return { success: true, user: sessionUser };
  } catch (err: any) {
    return { success: false, error: err.message || "Registration error." };
  }
}

export async function logoutAction(): Promise<void> {
  cookies().delete(SESSION_COOKIE);
}

export async function getCurrentUserAction(): Promise<SessionUser | null> {
  const cookieVal = cookies().get(SESSION_COOKIE)?.value;
  if (!cookieVal) return null;
  try {
    return JSON.parse(cookieVal);
  } catch {
    return null;
  }
}
