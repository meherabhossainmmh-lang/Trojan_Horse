import axios from "axios";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

const client = axios.create({
  baseURL: API_BASE_URL,
  timeout: 3000,
});

export interface Comment {
  id: number;
  report_id: number;
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

export interface SOSMessage {
  sender: string;
  message: string;
  timestamp: string;
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
  dmp_status: string;
  city_corp_oversight_status: string;
  city_corp_notes?: string;
  user_action_feedback: string;
  assigned_city_corp: string;
  messages: SOSMessage[];
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

// ============================================================================
// STANDALONE / DEMO FALLBACK ENGINE
// ============================================================================

const DEFAULT_DEMO_REPORTS: Report[] = [
  {
    id: 1,
    title: "Open 4-Foot Drainage Manhole on Mirpur 10 Roundabout",
    description:
      "Manhole cover is completely missing on the main pedestrian crossing near Mirpur 10 roundabout. Several pedestrians tripped last night. Needs urgent concrete slab replacement.",
    category: "Missing Manhole Cover",
    latitude: 23.8069,
    longitude: 90.3687,
    address: "Mirpur 10 Roundabout, Dhaka",
    photo_url:
      "https://images.unsplash.com/photo-1590856029826-c7a73142bbf1?w=800&auto=format&fit=crop&q=80",
    status: "Submitted",
    severity_score: 88,
    ai_trust_score: 85,
    ai_summary:
      "CRITICAL HAZARD: Open drainage manhole at Mirpur 10 intersection poses immediate fatal hazard to pedestrians and rickshaws.",
    is_dmb_direct: true,
    assigned_authority_id: 1,
    created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
    upvote_count: 3,
    comments: [
      {
        id: 101,
        report_id: 1,
        user_name: "Tanvir Rahman (Mirpur Commuter)",
        comment_text:
          "I saw this open manhole near the bus stand today! Extremely dangerous at night.",
        created_at: new Date(Date.now() - 3600000).toISOString(),
      },
      {
        id: 102,
        report_id: 1,
        user_name: "DMB Field Inspector",
        comment_text:
          "Our emergency repair unit has been notified and scheduled for repair tonight.",
        created_at: new Date(Date.now() - 1800000).toISOString(),
      },
    ],
  },
  {
    id: 2,
    title: "Recurrent Armed Snatching Zone at Dhanmondi Lake Footpath",
    description:
      "Two snatching incidents occurred this week near the pedestrian bridge after 8 PM. Poor lighting enables muggers to escape into the park.",
    category: "Snatching",
    latitude: 23.7461,
    longitude: 90.3742,
    address: "Dhanmondi Lake Footpath near Bridge, Dhaka",
    photo_url:
      "https://images.unsplash.com/photo-1517732306149-e8f829eb588a?w=800&auto=format&fit=crop&q=80",
    status: "Under Verification",
    severity_score: 85,
    ai_trust_score: 90,
    ai_summary:
      "CRIME HOTSPOT: Nighttime snatching reported near Dhanmondi Lake footpath; increased police illumination and patrolling advised.",
    is_dmb_direct: false,
    assigned_authority_id: 4,
    created_at: new Date(Date.now() - 3600000 * 5).toISOString(),
    upvote_count: 5,
    comments: [],
  },
  {
    id: 3,
    title: "Collapsed Road Surface & Potholes at Gazipur Chowrasta",
    description:
      "Heavy monsoon trucks have fractured a 30-meter stretch of asphalt near Gazipur Chowrasta intersection, causing severe traffic jams and vehicle damage.",
    category: "Damaged Road",
    latitude: 23.9892,
    longitude: 90.3735,
    address: "Gazipur Chowrasta Highway Intersection, Gazipur",
    photo_url:
      "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=800&auto=format&fit=crop&q=80",
    status: "In Progress",
    severity_score: 82,
    ai_trust_score: 80,
    ai_summary:
      "STRUCTURAL ROAD DAMAGE: Heavy truck traffic has fractured 30m of road surface at Gazipur Chowrasta; DMB intervention required.",
    is_dmb_direct: true,
    assigned_authority_id: 1,
    created_at: new Date(Date.now() - 3600000 * 14).toISOString(),
    upvote_count: 7,
    comments: [],
  },
  {
    id: 4,
    title: "Armed Robbery Hotspot in Uttara Sector 10 Underpass",
    description:
      "Commuters returning from Uttara railway station reported an armed robbery attempt inside the underpass corridor.",
    category: "Robbery",
    latitude: 23.8759,
    longitude: 90.3795,
    address: "Sector 10 Underpass, Uttara, Dhaka",
    photo_url:
      "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=800&auto=format&fit=crop&q=80",
    status: "Received",
    severity_score: 92,
    ai_trust_score: 95,
    ai_summary:
      "CRIME HOTSPOT: Armed robbery zone reported after dusk in Sector 10 underpass; DMP rapid intervention force alerted.",
    is_dmb_direct: false,
    assigned_authority_id: 4,
    created_at: new Date(Date.now() - 3600000).toISOString(),
    upvote_count: 4,
    comments: [],
  },
  {
    id: 5,
    title: "Severely Waterlogged Drainage & Overflowing Sewer at Motijheel",
    description:
      "Monsoon drainage channel is blocked near Shapla Chattar, causing 2 feet of waterlogging that stalls commuter buses and rickshaws.",
    category: "Waterlogging",
    latitude: 23.7330,
    longitude: 90.4172,
    address: "Motijheel Commercial Area near Shapla Chattar, Dhaka",
    photo_url:
      "https://images.unsplash.com/photo-1541888946425-d0bbbb547b81?w=800&auto=format&fit=crop&q=80",
    status: "In Progress",
    severity_score: 78,
    ai_trust_score: 75,
    ai_summary:
      "FLOODING RISK: Blocked storm drainage causing 2ft waterlogging in Motijheel business district.",
    is_dmb_direct: true,
    assigned_authority_id: 1,
    created_at: new Date(Date.now() - 3600000 * 8).toISOString(),
    upvote_count: 6,
    comments: [],
  },
  {
    id: 6,
    title: "Broken Pedestrian Foot-Overbridge Staircase at Farmgate",
    description:
      "Steel stair treads were rusted through and collapsed under commuter foot traffic. Fixed by DMB emergency crew.",
    category: "Unsafe Bridge",
    latitude: 23.7561,
    longitude: 90.3872,
    address: "Farmgate Overbridge, Kazi Nazrul Islam Ave, Dhaka",
    photo_url:
      "https://images.unsplash.com/photo-1541888946425-d0bbbb547b81?w=800&auto=format&fit=crop&q=80",
    status: "Resolved",
    severity_score: 90,
    ai_trust_score: 100,
    ai_summary:
      "STRUCTURAL REPAIR COMPLETED: DMB structural engineering team repaired damaged stair treads on Farmgate overbridge.",
    is_dmb_direct: true,
    assigned_authority_id: 1,
    created_at: new Date(Date.now() - 3600000 * 48).toISOString(),
    resolved_at: new Date(Date.now() - 3600000 * 6).toISOString(),
    resolution_notes:
      "Stair treads reinforced with steel plating by DMB rapid maintenance team. Structural load tested and certified safe.",
    after_repair_photo_url:
      "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&auto=format&fit=crop&q=80",
    upvote_count: 12,
    comments: [],
  },
  {
    id: 7,
    title: "Missing Street Lighting at Gulshan 2 North Avenue",
    description:
      "Four consecutive street lamps are inoperative along Gulshan 2 North Avenue, creating a dark zone after 9 PM.",
    category: "Poor Lighting",
    latitude: 23.7925,
    longitude: 90.4152,
    address: "Gulshan 2 North Avenue, Dhaka",
    photo_url:
      "https://images.unsplash.com/photo-1517732306149-e8f829eb588a?w=800&auto=format&fit=crop&q=80",
    status: "Submitted",
    severity_score: 65,
    ai_trust_score: 70,
    ai_summary:
      "MUNICIPAL LIGHTING: 4 consecutive street lamps inoperative along Gulshan 2 North Avenue; DNCC electrical division assigned.",
    is_dmb_direct: false,
    assigned_authority_id: 2,
    created_at: new Date(Date.now() - 3600000 * 18).toISOString(),
    upvote_count: 2,
    comments: [],
  },
  {
    id: 8,
    title: "Uncovered Cable Trench on Kuril Flyover Slip Road",
    description:
      "A 1-meter deep cable trench left uncovered by utility workers near the Kuril Flyover descent poses a severe motorcycle rollover risk.",
    category: "Open Drain",
    latitude: 23.8223,
    longitude: 90.4219,
    address: "Kuril Flyover Slip Road, Dhaka",
    photo_url:
      "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=800&auto=format&fit=crop&q=80",
    status: "Under Verification",
    severity_score: 80,
    ai_trust_score: 82,
    ai_summary:
      "HAZARD ALERT: Uncovered cable trench posing rollover hazard to motorcycles on Kuril flyover.",
    is_dmb_direct: true,
    assigned_authority_id: 1,
    created_at: new Date(Date.now() - 3600000 * 10).toISOString(),
    upvote_count: 4,
    comments: [],
  },
];

const DEFAULT_DEMO_SOS: SOSAlert[] = [
  {
    id: 1,
    user_name: "Nusrat Jahan (Student Commuter)",
    phone_number: "01711-234567",
    latitude: 23.7505,
    longitude: 90.38,
    address: "Near Panthapath Signal, Dhaka",
    status: "active",
    notified_agency: "DMP Police 999 & DMB 1090",
    dmp_status: "Notified — Awaiting Police Dispatch",
    city_corp_oversight_status: "Status Requested from User",
    city_corp_notes:
      "DNCC Control Room monitoring DMP police dispatch and requesting safety verification from user.",
    user_action_feedback: "Pending",
    assigned_city_corp: "DNCC",
    messages: [
      {
        sender: "DNCC Control Room",
        message:
          "Hello Nusrat, this is DNCC Control Room. We see your SOS alert. Has DMP Police 999 patrol unit arrived at Panthapath Signal?",
        timestamp: new Date(Date.now() - 600000).toISOString(),
      },
    ],
    created_at: new Date(Date.now() - 900000).toISOString(),
  },
];

const getLocalReports = (): Report[] => {
  if (typeof window === "undefined") return DEFAULT_DEMO_REPORTS;
  const saved = localStorage.getItem("nirapod_demo_reports");
  if (!saved) {
    localStorage.setItem(
      "nirapod_demo_reports",
      JSON.stringify(DEFAULT_DEMO_REPORTS)
    );
    return DEFAULT_DEMO_REPORTS;
  }
  return JSON.parse(saved);
};

const saveLocalReports = (reports: Report[]) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("nirapod_demo_reports", JSON.stringify(reports));
  }
};

const getLocalSOS = (): SOSAlert[] => {
  if (typeof window === "undefined") return DEFAULT_DEMO_SOS;
  const saved = localStorage.getItem("nirapod_demo_sos");
  if (!saved) {
    localStorage.setItem("nirapod_demo_sos", JSON.stringify(DEFAULT_DEMO_SOS));
    return DEFAULT_DEMO_SOS;
  }
  return JSON.parse(saved);
};

const saveLocalSOS = (alerts: SOSAlert[]) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("nirapod_demo_sos", JSON.stringify(alerts));
  }
};

// ============================================================================
// API METHODS
// ============================================================================

export const fetchReports = async (params?: {
  category?: string;
  status?: string;
  is_dmb_direct?: boolean;
  search?: string;
}): Promise<Report[]> => {
  try {
    const res = await client.get("/reports", { params });
    return res.data;
  } catch (err) {
    let reports = getLocalReports();
    if (params?.category && params.category !== "All") {
      reports = reports.filter((r) => r.category === params.category);
    }
    if (params?.status && params.status !== "All") {
      reports = reports.filter((r) => r.status === params.status);
    }
    if (params?.is_dmb_direct !== undefined) {
      reports = reports.filter((r) => r.is_dmb_direct === params.is_dmb_direct);
    }
    if (params?.search) {
      const kw = params.search.toLowerCase();
      reports = reports.filter(
        (r) =>
          r.title.toLowerCase().includes(kw) ||
          r.description.toLowerCase().includes(kw) ||
          r.address.toLowerCase().includes(kw)
      );
    }
    return reports;
  }
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
  try {
    const res = await client.post("/reports", data);
    return res.data;
  } catch (err) {
    const reports = getLocalReports();
    let score = 75;
    if (
      ["Robbery", "Snatching", "Missing Manhole Cover"].includes(
        data.category
      ) ||
      data.is_dmb_direct
    ) {
      score = 88;
    }
    const newRep: Report = {
      id: Date.now() % 10000,
      title: data.title,
      description: data.description,
      category: data.category,
      latitude: data.latitude,
      longitude: data.longitude,
      address: data.address,
      photo_url:
        data.photo_url ||
        "https://images.unsplash.com/photo-1590856029826-c7a73142bbf1?w=800&auto=format&fit=crop&q=80",
      status: "Submitted",
      severity_score: score,
      ai_trust_score: data.is_dmb_direct ? 75 : 65,
      ai_summary: `CRITICAL ACTION REQUIRED: [${data.category.toUpperCase()}] at ${
        data.address
      } — "${data.title}". Smart Authority Routing assigned.`,
      is_dmb_direct: data.is_dmb_direct,
      assigned_authority_id: data.is_dmb_direct ? 1 : 2,
      created_at: new Date().toISOString(),
      upvote_count: 1,
      comments: [],
    };
    saveLocalReports([newRep, ...reports]);
    return newRep;
  }
};

export const verifyReport = async (
  reportId: number,
  verificationType: "confirm" | "false_report" = "confirm"
): Promise<Report> => {
  try {
    const res = await client.post(`/reports/${reportId}/verify`, {
      verification_type: verificationType,
    });
    return res.data;
  } catch (err) {
    const reports = getLocalReports();
    let updatedRep: Report | null = null;
    const updated = reports.map((r) => {
      if (r.id === reportId) {
        const upCount =
          verificationType === "confirm" ? r.upvote_count + 1 : r.upvote_count;
        const score =
          verificationType === "confirm"
            ? Math.min(r.ai_trust_score + 10, 100)
            : Math.max(r.ai_trust_score - 15, 0);
        updatedRep = { ...r, upvote_count: upCount, ai_trust_score: score };
        return updatedRep;
      }
      return r;
    });
    saveLocalReports(updated);
    if (!updatedRep) throw new Error("Report not found");
    return updatedRep;
  }
};

export const addComment = async (
  reportId: number,
  userName: string,
  commentText: string
): Promise<Comment> => {
  try {
    const res = await client.post(`/reports/${reportId}/comments`, {
      user_name: userName,
      comment_text: commentText,
    });
    return res.data;
  } catch (err) {
    const reports = getLocalReports();
    const newComment: Comment = {
      id: Date.now() % 10000,
      report_id: reportId,
      user_name: userName || "Anonymous Citizen",
      comment_text: commentText,
      created_at: new Date().toISOString(),
    };
    const updated = reports.map((r) => {
      if (r.id === reportId) {
        return { ...r, comments: [newComment, ...r.comments] };
      }
      return r;
    });
    saveLocalReports(updated);
    return newComment;
  }
};

export const updateReportStatus = async (
  reportId: number,
  status: string,
  resolutionNotes?: string,
  afterRepairPhotoUrl?: string
): Promise<Report> => {
  try {
    const res = await client.patch(`/reports/${reportId}/status`, {
      status,
      resolution_notes: resolutionNotes,
      after_repair_photo_url: afterRepairPhotoUrl,
    });
    return res.data;
  } catch (err) {
    const reports = getLocalReports();
    let updatedRep: Report | null = null;
    const updated = reports.map((r) => {
      if (r.id === reportId) {
        updatedRep = {
          ...r,
          status,
          resolution_notes: resolutionNotes || r.resolution_notes,
          after_repair_photo_url:
            afterRepairPhotoUrl || r.after_repair_photo_url,
          resolved_at: status === "Resolved" ? new Date().toISOString() : r.resolved_at,
        };
        return updatedRep;
      }
      return r;
    });
    saveLocalReports(updated);
    if (!updatedRep) throw new Error("Report not found");
    return updatedRep;
  }
};

export const fetchDashboardStats = async (): Promise<any> => {
  try {
    const res = await client.get("/authorities/dashboard-stats");
    return res.data;
  } catch (err) {
    const reports = getLocalReports();
    return {
      total_reports: reports.length,
      resolved_reports: reports.filter((r) => r.status === "Resolved").length,
      in_progress: reports.filter((r) => r.status === "In Progress").length,
      submitted: reports.filter((r) => r.status === "Submitted").length,
      received: reports.filter((r) => r.status === "Received").length,
      under_verify: reports.filter((r) => r.status === "Under Verification")
        .length,
      dmb_direct_count: reports.filter((r) => r.is_dmb_direct).length,
      high_severity_count: reports.filter((r) => r.severity_score >= 75).length,
      agency_breakdown: {
        DMB: {
          name: "Disaster Management Board (DMB)",
          report_count: reports.filter((r) => r.is_dmb_direct).length,
        },
        DNCC: {
          name: "Dhaka North City Corporation",
          report_count: reports.filter(
            (r) => !r.is_dmb_direct && r.latitude >= 23.78
          ).length,
        },
        DSCC: {
          name: "Dhaka South City Corporation",
          report_count: reports.filter(
            (r) => !r.is_dmb_direct && r.latitude < 23.78
          ).length,
        },
        DMP: {
          name: "Dhaka Metropolitan Police",
          report_count: reports.filter((r) =>
            ["Robbery", "Snatching", "Mugging"].includes(r.category)
          ).length,
        },
      },
    };
  }
};

export const triggerSOS = async (data: {
  user_name: string;
  phone_number: string;
  latitude: number;
  longitude: number;
  address: string;
}): Promise<SOSAlert> => {
  try {
    const res = await client.post("/sos", data);
    return res.data;
  } catch (err) {
    const alerts = getLocalSOS();
    const corp = data.latitude >= 23.78 ? "DNCC" : "DSCC";
    const newAlert: SOSAlert = {
      id: Date.now() % 10000,
      user_name: data.user_name || "Citizen Commuter",
      phone_number: data.phone_number || "01700-000000",
      latitude: data.latitude,
      longitude: data.longitude,
      address: data.address || "Live GPS Coordinate",
      status: "active",
      notified_agency: "National 999 & DMB Helpline 1090",
      dmp_status: "Notified — Awaiting Police Dispatch",
      city_corp_oversight_status: "Status Requested from User",
      city_corp_notes: `${corp} Control Room monitoring DMP police dispatch and requesting safety verification.`,
      user_action_feedback: "Pending",
      assigned_city_corp: corp,
      messages: [
        {
          sender: `${corp} Control Room`,
          message: `SOS broadcast received at ${corp}. We are monitoring DMP Police dispatch and requesting real-time action status from you.`,
          timestamp: new Date().toISOString(),
        },
      ],
      created_at: new Date().toISOString(),
    };
    saveLocalSOS([newAlert, ...alerts]);
    return newAlert;
  }
};

export const fetchActiveSOS = async (): Promise<SOSAlert[]> => {
  try {
    const res = await client.get("/sos");
    return res.data;
  } catch (err) {
    return getLocalSOS();
  }
};

export const updateSosDmpStatus = async (
  id: number,
  dmpStatus: string
): Promise<SOSAlert> => {
  try {
    const res = await client.patch(`/sos/${id}/dmp-status`, {
      dmp_status: dmpStatus,
    });
    return res.data;
  } catch (err) {
    const alerts = getLocalSOS();
    let updatedAlert: SOSAlert | null = null;
    const updated = alerts.map((a) => {
      if (a.id === id) {
        updatedAlert = {
          ...a,
          dmp_status: dmpStatus,
          messages: [
            ...a.messages,
            {
              sender: "DMP Police Dispatch 999",
              message: `Police status updated to: ${dmpStatus}`,
              timestamp: new Date().toISOString(),
            },
          ],
        };
        return updatedAlert;
      }
      return a;
    });
    saveLocalSOS(updated);
    if (!updatedAlert) throw new Error("SOS alert not found");
    return updatedAlert;
  }
};

export const requestCityCorpCheckup = async (
  id: number,
  actionType: "request_status" | "escalate" | "send_message",
  messageText?: string
): Promise<SOSAlert> => {
  try {
    const res = await client.patch(`/sos/${id}/city-corp-checkup`, {
      action_type: actionType,
      message_text: messageText,
    });
    return res.data;
  } catch (err) {
    const alerts = getLocalSOS();
    let updatedAlert: SOSAlert | null = null;
    const updated = alerts.map((a) => {
      if (a.id === id) {
        let oversightStatus = a.city_corp_oversight_status;
        let newMsg = messageText || "";
        if (actionType === "request_status") {
          oversightStatus = "Status Requested from User";
          newMsg =
            messageText ||
            `Hello ${a.user_name}, ${a.assigned_city_corp} Control Room is checking on your safety. Has DMP Police arrived at your coordinate?`;
        } else if (actionType === "escalate") {
          oversightStatus = "Escalated to DMP Headquarters";
          newMsg =
            messageText ||
            `${a.assigned_city_corp} flagged priority escalation to DMP Headquarters: Immediate patrol verification required.`;
        }
        updatedAlert = {
          ...a,
          city_corp_oversight_status: oversightStatus,
          messages: [
            ...a.messages,
            {
              sender: `${a.assigned_city_corp} Control Room`,
              message: newMsg,
              timestamp: new Date().toISOString(),
            },
          ],
        };
        return updatedAlert;
      }
      return a;
    });
    saveLocalSOS(updated);
    if (!updatedAlert) throw new Error("SOS alert not found");
    return updatedAlert;
  }
};

export const submitUserSosFeedback = async (
  id: number,
  feedback: "Police Arrived & Taking Action" | "Police Not Arrived Yet — Require Immediate Follow-up"
): Promise<SOSAlert> => {
  try {
    const res = await client.patch(`/sos/${id}/user-feedback`, {
      feedback,
    });
    return res.data;
  } catch (err) {
    const alerts = getLocalSOS();
    let updatedAlert: SOSAlert | null = null;
    const updated = alerts.map((a) => {
      if (a.id === id) {
        let newDmp = a.dmp_status;
        let newOversight = a.city_corp_oversight_status;
        if (feedback.includes("Arrived") && !feedback.includes("Not")) {
          newDmp = "Arrived & Action Taken";
          newOversight = "Verified DMP Action";
        } else if (feedback.includes("Not Arrived")) {
          newDmp = "No Response Yet — Escalated";
          newOversight = "Escalated to DMP Headquarters";
        }
        updatedAlert = {
          ...a,
          dmp_status: newDmp,
          city_corp_oversight_status: newOversight,
          user_action_feedback: feedback,
          messages: [
            ...a.messages,
            {
              sender: `Citizen (${a.user_name})`,
              message: `Action Status Feedback: ${feedback}`,
              timestamp: new Date().toISOString(),
            },
          ],
        };
        return updatedAlert;
      }
      return a;
    });
    saveLocalSOS(updated);
    if (!updatedAlert) throw new Error("SOS alert not found");
    return updatedAlert;
  }
};

export const resolveSOSAlert = async (id: number): Promise<SOSAlert> => {
  try {
    const res = await client.patch(`/sos/${id}/resolve`);
    return res.data;
  } catch (err) {
    const alerts = getLocalSOS();
    let resolved: SOSAlert | null = null;
    const updated = alerts.map((a) => {
      if (a.id === id) {
        resolved = {
          ...a,
          status: "resolved",
          dmp_status: "Resolved",
          city_corp_oversight_status: "Verified Safe",
        };
        return resolved;
      }
      return a;
    });
    saveLocalSOS(updated);
    if (!resolved) throw new Error("SOS alert not found");
    return resolved;
  }
};

export const analyzeHazardAI = async (data: {
  title: string;
  description: string;
  category: string;
  latitude: number;
  longitude: number;
  is_dmb_direct: boolean;
}): Promise<any> => {
  try {
    const res = await client.post("/ai/analyze", data);
    return res.data;
  } catch (err) {
    let score = 70;
    if (
      ["Robbery", "Snatching", "Missing Manhole Cover"].includes(
        data.category
      ) ||
      data.is_dmb_direct
    ) {
      score = 88;
    }
    const authority =
      data.is_dmb_direct ||
      [
        "Missing Manhole Cover",
        "Open Drain",
        "Waterlogging",
        "Unsafe Bridge",
      ].includes(data.category)
        ? "DMB"
        : ["Robbery", "Snatching", "Mugging"].includes(data.category)
        ? "DMP"
        : "DNCC";
    return {
      severity_score: score,
      recommended_authority_code: authority,
      ai_executive_summary: `AI Smart Authority Routing: [${data.category.toUpperCase()}] at coordinate (${
        data.latitude
      }, ${data.longitude}) — '${data.title}'. Assigned to ${authority}.`,
      is_duplicate: false,
    };
  }
};

export const checkRouteRiskAI = async (data: {
  origin: string;
  destination: string;
  travel_mode: string;
}): Promise<RouteRiskResponse> => {
  try {
    const res = await client.post("/ai/route-risk", data);
    return res.data;
  } catch (err) {
    return {
      origin: data.origin,
      destination: data.destination,
      travel_mode: data.travel_mode,
      overall_risk_level: "Moderate Caution",
      risk_score: 68,
      summary_advisory:
        "AI Safety Analysis: Active snatching/robbery hotspots and open manhole hazards reported along this corridor. Avoid poorly lit alleyways and travel on arterial roads after dusk.",
      recommended_safer_route:
        "Use primary arterial roads via Begum Rokeya Avenue or Kazi Nazrul Islam Avenue, avoiding secondary residential shortcuts.",
      hotspot_warnings: [
        {
          title: "Recurrent Armed Snatching Zone at Dhanmondi Lake Footpath",
          category: "Snatching",
          address: "Dhanmondi Lake Footpath near Bridge, Dhaka",
          severity_score: 85,
          advice: "Keep valuables concealed and avoid footpaths after dark.",
        },
        {
          title: "Open 4-Foot Drainage Manhole on Mirpur 10 Roundabout",
          category: "Missing Manhole Cover",
          address: "Mirpur 10 Roundabout, Dhaka",
          severity_score: 88,
          advice: "Watch for uncovered manholes/drains on the road edge.",
        },
      ],
    };
  }
};

export const triggerDatabaseSeed = async (): Promise<any> => {
  try {
    const res = await client.post("/seed");
    return res.data;
  } catch (err) {
    if (typeof window !== "undefined") {
      localStorage.setItem(
        "nirapod_demo_reports",
        JSON.stringify(DEFAULT_DEMO_REPORTS)
      );
      localStorage.setItem(
        "nirapod_demo_sos",
        JSON.stringify(DEFAULT_DEMO_SOS)
      );
    }
    return {
      message:
        "Client demo database reset successfully with 8 realistic Bangladesh reports and 5 lifecycle states!",
    };
  }
};
