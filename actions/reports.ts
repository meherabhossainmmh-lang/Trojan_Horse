"use server";

import { db } from "@/db";
import * as schema from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { analyzeHazardAI } from "@/lib/ai";

export async function createReportAction(data: {
  user_id?: number;
  city_corporation_id: number;
  type: "hazard" | "crime_hotspot";
  title: string;
  description: string;
  category: string;
  lat: number;
  lng: number;
  photo_url?: string;
  is_dmb_direct?: boolean;
}) {
  const aiResult = analyzeHazardAI({
    title: data.title,
    description: data.description,
    category: data.category,
    lat: data.lat,
    lng: data.lng,
    is_dmb_direct: data.is_dmb_direct,
  });

  if (!db) {
    // Fallback demo row
    return {
      success: true,
      report: {
        id: Date.now() % 10000,
        ...data,
        status: "under_review",
        severity_score: aiResult.severity_score,
        ai_summary: aiResult.ai_executive_summary,
        created_at: new Date().toISOString(),
        upvote_count: 1,
      },
    };
  }

  try {
    const inserted = await db
      .insert(schema.reports)
      .values({
        user_id: data.user_id || null,
        city_corporation_id: data.city_corporation_id,
        type: data.type,
        status: "under_review",
        photo_url:
          data.photo_url ||
          "https://images.unsplash.com/photo-1590856029826-c7a73142bbf1?w=800&auto=format&fit=crop&q=80",
        lat: data.lat,
        lng: data.lng,
        description: data.description,
        title: data.title,
        category: data.category,
        severity_score: aiResult.severity_score,
        ai_summary: aiResult.ai_executive_summary,
        is_dmb_direct: data.is_dmb_direct || false,
      })
      .returning();

    const newReport = inserted[0];
    if (data.user_id) {
      await db
        .insert(schema.report_votes)
        .values({
          report_id: newReport.id,
          user_id: data.user_id,
        })
        .catch(() => {});
    }

    return { success: true, report: newReport };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to create report." };
  }
}

export async function getReportsAction(params?: {
  city_corporation_id?: number;
  type?: string;
  status?: string;
}) {
  if (!db) {
    return [];
  }

  try {
    let query: any = db.select().from(schema.reports).orderBy(desc(schema.reports.created_at));
    const allReports = await query;
    let filtered = allReports;
    if (params?.city_corporation_id) {
      filtered = filtered.filter(
        (r: any) => r.city_corporation_id === params.city_corporation_id
      );
    }
    if (params?.type && params.type !== "all") {
      filtered = filtered.filter((r: any) => r.type === params.type);
    }
    if (params?.status && params.status !== "all") {
      filtered = filtered.filter((r: any) => r.status === params.status);
    }
    return filtered;
  } catch (err) {
    console.error("Failed to fetch reports:", err);
    return [];
  }
}

export async function voteReportAction(reportId: number, userId?: number) {
  if (!db) return { success: true };
  try {
    await db
      .insert(schema.report_votes)
      .values({
        report_id: reportId,
        user_id: userId || null,
      })
      .catch(() => {});
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}
