import { createServerFileRoute } from "@tanstack/react-start/server";

import { auth } from "../lib/auth";

// export const APIRoute = createServerFileRoute("/hello").methods((api) => ({
//   GET: async ({ request }) => {
//     return await auth.handler(request);
//   },
//   POST: async ({ request }) => {
//     return await auth.handler(request);
//   },
// }));

export const ServerRoute = createServerFileRoute("/api/auth/$").methods({
  GET: async ({ request }) => {
    return await auth.handler(request);
  },
  POST: async ({ request }) => {
    return await auth.handler(request);
  },
});
