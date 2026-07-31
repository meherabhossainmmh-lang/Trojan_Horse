import PusherServer from "pusher";
import PusherClient from "pusher-js";

const appId = process.env.PUSHER_APP_ID;
const key = process.env.NEXT_PUBLIC_PUSHER_KEY;
const secret = process.env.NEXT_PUBLIC_PUSHER_SECRET;
const cluster = process.env.NEXT_PUBLIC_PUSHER_CLUSTER || "ap2";

let pusherServerInstance: PusherServer | null = null;
if (appId && key && secret) {
  pusherServerInstance = new PusherServer({
    appId,
    key,
    secret,
    cluster,
    useTLS: true,
  });
}

export async function triggerPusherEvent(
  channel: string,
  event: string,
  data: any
) {
  if (pusherServerInstance) {
    try {
      await pusherServerInstance.trigger(channel, event, data);
    } catch (err) {
      console.warn("[Pusher Server] Failed to trigger event:", err);
    }
  } else {
    console.log(`[Pusher Mock Server] Event triggered on '${channel}': ${event}`, data);
  }
}

export function getPusherClient(): PusherClient | null {
  if (typeof window === "undefined") return null;
  if (key && key.trim() !== "") {
    return new PusherClient(key, {
      cluster,
    });
  }
  return null;
}
