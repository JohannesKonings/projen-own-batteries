import { createServerFileRoute } from "@tanstack/react-start/server";

import { auth } from "../lib/auth";
import { json } from "@tanstack/react-start";

export const ServerRoute = createServerFileRoute("/api/name").methods({
  GET: async ({ request, params }) => {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });
    }

    return json({ name: session.user?.name });
  },
});
