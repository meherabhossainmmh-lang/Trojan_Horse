import { initEdgeStore } from "@edgestore/server";

if (!process.env.EDGE_STORE_ACCESS_KEY) {
  process.env.EDGE_STORE_ACCESS_KEY = "demo_access_key_hackathon_12345";
}
if (!process.env.EDGE_STORE_SECRET_KEY) {
  process.env.EDGE_STORE_SECRET_KEY = "demo_secret_key_hackathon_12345";
}

const es = initEdgeStore.create();

export const edgeStoreRouter = es.router({
  publicFiles: es.fileBucket({
    maxSize: 1024 * 1024 * 10, // 10MB
  }),
});

export type EdgeStoreRouter = typeof edgeStoreRouter;
