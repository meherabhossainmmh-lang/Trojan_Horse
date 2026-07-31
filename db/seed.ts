import bcrypt from "bcryptjs";
import { db } from "./index";
import * as schema from "./schema";

async function runSeed() {
  console.log("=== Nirapod Path Database Seeder ===");
  if (!db) {
    console.log("[Nirapod Path DB] DATABASE_URL is not configured. Seeding demo data into standalone storage mode.");
    return;
  }

  const defaultHash = bcrypt.hashSync("password123", 10);

  // 1. City Corporations
  const corps = [
    { id: 1, name: "Dhaka North City Corporation" },
    { id: 2, name: "Dhaka South City Corporation" },
    { id: 3, name: "Disaster Management Board (DMB)" },
  ];

  for (const c of corps) {
    await db
      .insert(schema.city_corporations)
      .values(c)
      .onConflictDoNothing()
      .catch(() => {});
  }

  // 2. Seeded Users (per README.md: "Management and City Corporation accounts are seeded in bulk via script")
  const usersToSeed = [
    {
      id: 1,
      role: "super_admin",
      city_corporation_id: 1,
      email: "superadmin@nirapod.bd",
      password_hash: defaultHash,
      full_name: "Nirapod Super Admin",
      phone_number: "01700-000000",
    },
    {
      id: 2,
      role: "user",
      city_corporation_id: 1,
      email: "user@nirapod.bd",
      password_hash: defaultHash,
      full_name: "Tanvir Rahman (Citizen)",
      phone_number: "01711-234567",
    },
    {
      id: 3,
      role: "management",
      city_corporation_id: 1,
      email: "management.dncc@nirapod.bd",
      password_hash: defaultHash,
      full_name: "DNCC Management Panel",
      phone_number: "01711-161060",
    },
    {
      id: 4,
      role: "management",
      city_corporation_id: 2,
      email: "management.dscc@nirapod.bd",
      password_hash: defaultHash,
      full_name: "DSCC Management Panel",
      phone_number: "01711-161070",
    },
    {
      id: 5,
      role: "city_corp",
      city_corporation_id: 1,
      email: "citycorp.dncc@nirapod.bd",
      password_hash: defaultHash,
      full_name: "DNCC City Corporation Panel",
      phone_number: "01711-161061",
    },
    {
      id: 6,
      role: "city_corp",
      city_corporation_id: 2,
      email: "citycorp.dscc@nirapod.bd",
      password_hash: defaultHash,
      full_name: "DSCC City Corporation Panel",
      phone_number: "01711-161071",
    },
    {
      id: 7,
      role: "city_corp",
      city_corporation_id: 3,
      email: "citycorp.dmb@nirapod.bd",
      password_hash: defaultHash,
      full_name: "Disaster Management Board Panel",
      phone_number: "01711-109000",
    },
  ];

  for (const u of usersToSeed) {
    await db
      .insert(schema.users)
      .values(u)
      .onConflictDoNothing()
      .catch(() => {});
  }

  // 3. Reports
  const reportsToSeed = [
    {
      id: 1,
      user_id: 2,
      city_corporation_id: 1,
      type: "hazard",
      status: "under_review",
      photo_url: "https://images.unsplash.com/photo-1590856029826-c7a73142bbf1?w=800&auto=format&fit=crop&q=80",
      lat: 23.8069,
      lng: 90.3687,
      title: "Open 4-Foot Drainage Manhole on Mirpur 10 Roundabout",
      description: "Manhole cover is completely missing on the main pedestrian crossing near Mirpur 10 roundabout. Needs urgent slab replacement.",
      category: "Missing Manhole Cover",
      severity_score: 88,
      ai_summary: "CRITICAL HAZARD: Open drainage manhole at Mirpur 10 intersection poses immediate fatal hazard to pedestrians and rickshaws.",
      is_dmb_direct: true,
    },
    {
      id: 2,
      user_id: 2,
      city_corporation_id: 2,
      type: "crime_hotspot",
      status: "under_review",
      photo_url: "https://images.unsplash.com/photo-1517732306149-e8f829eb588a?w=800&auto=format&fit=crop&q=80",
      lat: 23.7461,
      lng: 90.3742,
      title: "Recurrent Armed Snatching Zone at Dhanmondi Lake Footpath",
      description: "Two snatching incidents occurred this week near the pedestrian bridge after 8 PM. Poor lighting enables muggers to escape into the park.",
      category: "Snatching",
      severity_score: 85,
      ai_summary: "CRIME HOTSPOT: Nighttime snatching reported near Dhanmondi Lake footpath; increased police illumination and patrolling advised.",
      is_dmb_direct: false,
    },
    {
      id: 3,
      user_id: 2,
      city_corporation_id: 1,
      type: "hazard",
      status: "resolved",
      photo_url: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=800&auto=format&fit=crop&q=80",
      lat: 23.9892,
      lng: 90.3735,
      title: "Collapsed Road Surface & Potholes at Gazipur Chowrasta",
      description: "Heavy monsoon trucks fractured a 30m stretch of asphalt near Gazipur Chowrasta intersection, causing severe traffic jams and vehicle damage.",
      category: "Damaged Road",
      severity_score: 82,
      ai_summary: "STRUCTURAL ROAD DAMAGE: Heavy truck traffic has fractured 30m of road surface at Gazipur Chowrasta; DMB intervention required.",
      is_dmb_direct: true,
    },
    {
      id: 4,
      user_id: 2,
      city_corporation_id: 1,
      type: "crime_hotspot",
      status: "under_review",
      photo_url: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=800&auto=format&fit=crop&q=80",
      lat: 23.8759,
      lng: 90.3795,
      title: "Armed Robbery Hotspot in Uttara Sector 10 Underpass",
      description: "Commuters returning from Uttara railway station reported an armed robbery attempt inside the underpass corridor.",
      category: "Robbery",
      severity_score: 92,
      ai_summary: "CRIME HOTSPOT: Armed robbery zone reported after dusk in Sector 10 underpass; DMP rapid intervention force alerted.",
      is_dmb_direct: false,
    },
    {
      id: 5,
      user_id: 2,
      city_corporation_id: 2,
      type: "hazard",
      status: "resolved",
      photo_url: "https://images.unsplash.com/photo-1541888946425-d0bbbb547b81?w=800&auto=format&fit=crop&q=80",
      lat: 23.7330,
      lng: 90.4172,
      title: "Severely Waterlogged Drainage & Overflowing Sewer at Motijheel",
      description: "Monsoon drainage channel is blocked near Shapla Chattar, causing 2 feet of waterlogging that stalls commuter buses.",
      category: "Waterlogging",
      severity_score: 78,
      ai_summary: "FLOODING RISK: Blocked storm drainage causing 2ft waterlogging in Motijheel business district.",
      is_dmb_direct: true,
    },
    {
      id: 6,
      user_id: 2,
      city_corporation_id: 1,
      type: "hazard",
      status: "verified",
      status_comment: "Good work — steel stair treads reinforced and load tested by DMB structural team. Official verified stamp issued.",
      photo_url: "https://images.unsplash.com/photo-1541888946425-d0bbbb547b81?w=800&auto=format&fit=crop&q=80",
      lat: 23.7561,
      lng: 90.3872,
      title: "Broken Pedestrian Foot-Overbridge Staircase at Farmgate",
      description: "Steel stair treads were rusted through and collapsed under commuter foot traffic. Fixed by DMB emergency crew.",
      category: "Unsafe Bridge",
      severity_score: 90,
      ai_summary: "STRUCTURAL REPAIR COMPLETED: DMB structural engineering team repaired damaged stair treads on Farmgate overbridge.",
      is_dmb_direct: true,
    },
    {
      id: 7,
      user_id: 2,
      city_corporation_id: 1,
      type: "hazard",
      status: "under_review",
      photo_url: "https://images.unsplash.com/photo-1517732306149-e8f829eb588a?w=800&auto=format&fit=crop&q=80",
      lat: 23.7925,
      lng: 90.4152,
      title: "Missing Street Lighting at Gulshan 2 North Avenue",
      description: "Four consecutive street lamps are inoperative along Gulshan 2 North Avenue, creating a dark zone after 9 PM.",
      category: "Poor Lighting",
      severity_score: 65,
      ai_summary: "MUNICIPAL LIGHTING: 4 consecutive street lamps inoperative along Gulshan 2 North Avenue; DNCC electrical division assigned.",
      is_dmb_direct: false,
    },
    {
      id: 8,
      user_id: 2,
      city_corporation_id: 1,
      type: "hazard",
      status: "under_review",
      photo_url: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=800&auto=format&fit=crop&q=80",
      lat: 23.8223,
      lng: 90.4219,
      title: "Uncovered Cable Trench on Kuril Flyover Slip Road",
      description: "A 1-meter deep cable trench left uncovered by utility workers near the Kuril Flyover descent poses a severe motorcycle rollover risk.",
      category: "Open Drain",
      severity_score: 80,
      ai_summary: "HAZARD ALERT: Uncovered cable trench posing rollover hazard to motorcycles on Kuril flyover.",
      is_dmb_direct: true,
    },
  ];

  for (const r of reportsToSeed) {
    await db
      .insert(schema.reports)
      .values(r)
      .onConflictDoNothing()
      .catch(() => {});
  }

  console.log("=== Seeding completed successfully ===");
}

runSeed().catch((err) => {
  console.error("Seeding failed:", err);
});
