import { createServerFileRoute } from "@tanstack/react-start/server";

import { auth } from "../lib/auth";

async function handler({ request }: { request: Request }) {
  console.log("Auth handler called:", request.method, request.url);
  const res = await auth.handler(request);
  console.log(
    "Auth handler response:",
    res.status,
    res.headers.get("location") || res.headers.get("Location"),
  );
  return res;
}

export const ServerRoute = createServerFileRoute("/api/auth/$").methods({
  GET: handler,
  POST: handler,
});
