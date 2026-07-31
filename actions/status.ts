"use server";

import { db } from "@/db";
import * as schema from "@/db/schema";
import { eq } from "drizzle-orm";
import { SessionUser } from "./auth";

export async function updateReportStatusAction(
  reportId: number,
  newStatus: "under_review" | "resolved" | "verified",
  user: SessionUser,
  statusComment?: string
) {
  if (!user || (user.role !== "management" && user.role !== "city_corp" && user.role !== "super_admin")) {
    return { success: false, error: "Unauthorized role for status lifecycle update." };
  }

  // Key rule from README.md: Management can only push under_review -> resolved.
  if (user.role === "management") {
    if (newStatus !== "resolved") {
      return {
        success: false,
        error: "Management accounts can only move status from 'under_review' to 'resolved'. Cannot mark as verified or revert.",
      };
    }
  }

  if (!db) {
    return {
      success: true,
      message: `Demo status updated to '${newStatus}' by ${user.role}.`,
    };
  }

  try {
    const updateData: any = {
      status: newStatus,
      updated_at: new Date(),
    };

    // Only City Corp can attach/overwrite status_comment
    if (user.role === "city_corp" || user.role === "super_admin") {
      if (statusComment !== undefined) {
        updateData.status_comment = statusComment;
      }
    }

    const updated = await db
      .update(schema.reports)
      .set(updateData)
      .where(eq(schema.reports.id, reportId))
      .returning();

    if (!updated || updated.length === 0) {
      return { success: false, error: "Report not found." };
    }

    return {
      success: true,
      report: updated[0],
      message: `Status updated to '${newStatus}'.`,
    };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to update report status." };
  }
}
