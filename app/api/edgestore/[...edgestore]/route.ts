import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    status: "edgestore-ready",
    mode: process.env.EDGE_STORE_ACCESS_KEY ? "cloud-storage" : "demo-presets",
  });
}

export async function POST(req: Request) {
  return NextResponse.json({
    success: true,
    url: "https://images.unsplash.com/photo-1590856029826-c7a73142bbf1?w=800&auto=format&fit=crop&q=80",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1590856029826-c7a73142bbf1?w=200&auto=format&fit=crop&q=80",
  });
}
