"use server";

import { db } from "@/db";
import * as schema from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { triggerPusherEvent } from "@/lib/pusher";

export async function triggerSosAction(data: {
  user_id?: number;
  city_corporation_id: number;
  lat: number;
  lng: number;
  user_name?: string;
  phone?: string;
}) {
  const alertPayload = {
    id: Date.now() % 10000,
    user_id: data.user_id || null,
    city_corporation_id: data.city_corporation_id,
    lat: data.lat,
    lng: data.lng,
    status: "active",
    dmp_status: "Notified — Awaiting Police Dispatch",
    city_corp_oversight_status: "Status Requested from User",
    messages_json: JSON.stringify([
      {
        sender: `City Corporation #${data.city_corporation_id} Control Room`,
        message: "SOS alert received. We are monitoring Police 999 response and checking on your safety.",
        timestamp: new Date().toISOString(),
      },
    ]),
    created_at: new Date().toISOString(),
    user_name: data.user_name || "Citizen Commuter",
    phone: data.phone || "01700-000000",
  };

  // 1. Trigger Pusher Realtime Event to City Corporation dashboard
  const channelName = `city-corp-${data.city_corporation_id}-alerts`;
  await triggerPusherEvent(channelName, "sos-triggered", alertPayload);

  if (!db) {
    return { success: true, alert: alertPayload };
  }

  try {
    const inserted = await db
      .insert(schema.sos_alerts)
      .values({
        user_id: data.user_id || null,
        city_corporation_id: data.city_corporation_id,
        lat: data.lat,
        lng: data.lng,
        status: "active",
        dmp_status: "Notified — Awaiting Police Dispatch",
        city_corp_oversight_status: "Status Requested from User",
        messages_json: alertPayload.messages_json,
      })
      .returning();

    return { success: true, alert: inserted[0] };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to create SOS alert." };
  }
}

export async function getActiveSosAction(city_corporation_id?: number) {
  if (!db) return [];
  try {
    let query: any = db.select().from(schema.sos_alerts).orderBy(desc(schema.sos_alerts.created_at));
    const all = await query;
    if (city_corporation_id) {
      return all.filter((a: any) => a.city_corporation_id === city_corporation_id);
    }
    return all;
  } catch (err) {
    return [];
  }
}

export async function updateSosStatusAction(
  sosId: number,
  dmpStatus?: string,
  oversightStatus?: string
) {
  if (!db) return { success: true };
  try {
    const updates: any = {};
    if (dmpStatus) updates.dmp_status = dmpStatus;
    if (oversightStatus) updates.city_corp_oversight_status = oversightStatus;
    await db
      .update(schema.sos_alerts)
      .set(updates)
      .where(eq(schema.sos_alerts.id, sosId));
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}
