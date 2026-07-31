import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL;

let dbInstance: any = null;

if (connectionString && connectionString.trim() !== "") {
  try {
    const client = postgres(connectionString, { prepare: false });
    dbInstance = drizzle(client, { schema });
  } catch (err) {
    console.warn("[Nirapod Path DB] Database connection error, switching to fallback memory mode:", err);
  }
}

export const db = dbInstance;
