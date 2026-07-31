import axios from "axios";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

const client = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

export interface Comment {
  id: int;
  report_id: int;
  user_name: string;
  comment_text: string;
  created_at: string;
}

export interface Report {
  id: number;
  title: string;
  description: string;
  category: string;
  latitude: number;
  longitude: number;
  address: string;
  photo_url?: string;
  status: string;
  severity_score: number;
  ai_trust_score: number;
  ai_summary?: string;
  is_dmb_direct: boolean;
  assigned_authority_id?: number;
  created_at: string;
  resolved_at?: string;
  resolution_notes?: string;
  after_repair_photo_url?: string;
  upvote_count: number;
  comments: Comment[];
}

export interface SOSAlert {
  id: number;
  user_name: string;
  phone_number?: string;
  latitude: number;
  longitude: number;
  address: string;
  status: string;
  notified_agency: string;
  created_at: string;
}

export interface RouteRiskResponse {
  origin: string;
  destination: string;
  travel_mode: string;
  overall_risk_level: string;
  risk_score: number;
  summary_advisory: string;
  recommended_safer_route: string;
  hotspot_warnings: {
    title: string;
    category: string;
    address: string;
    severity_score: number;
    advice: string;
  }[];
}

export const fetchReports = async (params?: {
  category?: string;
  status?: string;
  is_dmb_direct?: boolean;
  search?: string;
}): Promise<Report[]> => {
  const res = await client.get("/reports", { params });
  return res.data;
};

export const createReport = async (data: {
  title: string;
  description: string;
  category: string;
  latitude: number;
  longitude: number;
  address: string;
  photo_url?: string;
  is_dmb_direct: boolean;
}): Promise<Report> => {
  const res = await client.post("/reports", data);
  return res.data;
};

export const verifyReport = async (
  reportId: number,
  verificationType: "confirm" | "false_report" = "confirm"
): Promise<Report> => {
  const res = await client.post(`/reports/${reportId}/verify`, {
    verification_type: verificationType,
  });
  return res.data;
};

export const addComment = async (
  reportId: number,
  userName: string,
  commentText: string
): Promise<Comment> => {
  const res = await client.post(`/reports/${reportId}/comments`, {
    user_name: userName,
    comment_text: commentText,
  });
  return res.data;
};

export const updateReportStatus = async (
  reportId: number,
  status: string,
  resolutionNotes?: string,
  afterRepairPhotoUrl?: string
): Promise<Report> => {
  const res = await client.patch(`/reports/${reportId}/status`, {
    status,
    resolution_notes: resolutionNotes,
    after_repair_photo_url: afterRepairPhotoUrl,
  });
  return res.data;
};

export const fetchDashboardStats = async (): Promise<any> => {
  const res = await client.get("/authorities/dashboard-stats");
  return res.data;
};

export const triggerSOS = async (data: {
  user_name: string;
  phone_number: string;
  latitude: number;
  longitude: number;
  address: string;
}): Promise<SOSAlert> => {
  const res = await client.post("/sos", data);
  return res.data;
};

export const fetchActiveSOS = async (): Promise<SOSAlert[]> => {
  const res = await client.get("/sos");
  return res.data;
};

export const resolveSOSAlert = async (id: number): Promise<SOSAlert> => {
  const res = await client.patch(`/sos/${id}/resolve`);
  return res.data;
};

export const analyzeHazardAI = async (data: {
  title: string;
  description: string;
  category: string;
  latitude: number;
  longitude: number;
  is_dmb_direct: boolean;
}): Promise<any> => {
  const res = await client.post("/ai/analyze", data);
  return res.data;
};

export const checkRouteRiskAI = async (data: {
  origin: string;
  destination: string;
  travel_mode: string;
}): Promise<RouteRiskResponse> => {
  const res = await client.post("/ai/route-risk", data);
  return res.data;
};

export const triggerDatabaseSeed = async (): Promise<any> => {
  const res = await client.post("/seed");
  return res.data;
};
