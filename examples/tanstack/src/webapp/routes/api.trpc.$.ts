import { createServerFileRoute } from "@tanstack/react-start/server";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { trpcRouter } from "~/integrations/trpc/router";

import { createContext } from "~/integrations/trpc/init";

function handler({ request }: { request: Request }) {
  return fetchRequestHandler({
    req: request,
    router: trpcRouter,
    endpoint: "/api/trpc",
    createContext: async (opts) => {
      return createContext({
        ...opts,
        req: request,
        res: undefined,
      });
    },
  });
}

export const ServerRoute = createServerFileRoute("/api/trpc/$").methods({
  GET: handler,
  POST: handler,
  OPTIONS: async ({ request }) => {
    const origin = request.headers.get("origin") ?? "*";
    const allowedOrigins = [
      process.env.BETTER_AUTH_URL,
      process.env.VITE_BETTER_AUTH_URL,
      "http://localhost:3000",
      "https://localhost:3000",
    ].filter(Boolean) as string[];

    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin":
          origin && allowedOrigins.includes(origin) ? origin : "*",
        "Access-Control-Allow-Credentials": "true",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization, Cookie",
      },
    });
  },
});
