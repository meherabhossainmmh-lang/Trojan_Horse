import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const data = await req.formData();
    const socketId = data.get("socket_id") as string;
    const channelName = data.get("channel_name") as string;

    // Simple auth response for hackathon demo channels
    return NextResponse.json({
      auth: "pusher-demo-auth-signature",
      channel_data: JSON.stringify({ user_id: "demo-city-corp", user_info: { name: "City Corp Control Room" } }),
    });
  } catch (err) {
    return NextResponse.json({ error: "Pusher auth failed" }, { status: 400 });
  }
}
