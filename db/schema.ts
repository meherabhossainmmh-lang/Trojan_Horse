import {
  pgTable,
  serial,
  text,
  integer,
  timestamp,
  doublePrecision,
  boolean,
} from "drizzle-orm/pg-core";

export const city_corporations = pgTable("city_corporations", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(), // e.g. "Dhaka North City Corporation"
  created_at: timestamp("created_at").defaultNow().notNull(),
});

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  role: text("role").notNull().default("user"), // 'user' | 'management' | 'city_corp' | 'super_admin'
  city_corporation_id: integer("city_corporation_id").references(
    () => city_corporations.id
  ),
  email: text("email").notNull().unique(),
  password_hash: text("password_hash").notNull(),
  full_name: text("full_name").notNull(),
  phone_number: text("phone_number").default("01700-000000"),
  created_at: timestamp("created_at").defaultNow().notNull(),
});

export const reports = pgTable("reports", {
  id: serial("id").primaryKey(),
  user_id: integer("user_id").references(() => users.id),
  city_corporation_id: integer("city_corporation_id")
    .references(() => city_corporations.id)
    .notNull(),
  type: text("type").notNull().default("hazard"), // 'hazard' | 'crime_hotspot'
  status: text("status").notNull().default("under_review"), // 'under_review' | 'resolved' | 'verified'
  status_comment: text("status_comment"), // City Corp remark
  photo_url: text("photo_url"),
  lat: doublePrecision("lat").notNull(),
  lng: doublePrecision("lng").notNull(),
  description: text("description").notNull(),
  title: text("title").notNull().default("Public Safety Report"),
  category: text("category").notNull().default("Missing Manhole Cover"),
  severity_score: integer("severity_score").notNull().default(50),
  ai_summary: text("ai_summary"),
  is_dmb_direct: boolean("is_dmb_direct").notNull().default(false),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

export const report_votes = pgTable("report_votes", {
  id: serial("id").primaryKey(),
  report_id: integer("report_id")
    .references(() => reports.id)
    .notNull(),
  user_id: integer("user_id").references(() => users.id),
  created_at: timestamp("created_at").defaultNow().notNull(),
});

export const sos_alerts = pgTable("sos_alerts", {
  id: serial("id").primaryKey(),
  user_id: integer("user_id").references(() => users.id),
  city_corporation_id: integer("city_corporation_id")
    .references(() => city_corporations.id)
    .notNull(),
  lat: doublePrecision("lat").notNull(),
  lng: doublePrecision("lng").notNull(),
  status: text("status").notNull().default("active"),
  dmp_status: text("dmp_status").notNull().default("Notified — Awaiting Police Dispatch"),
  city_corp_oversight_status: text("city_corp_oversight_status")
    .notNull()
    .default("Status Requested from User"),
  messages_json: text("messages_json").notNull().default("[]"),
  created_at: timestamp("created_at").defaultNow().notNull(),
});
