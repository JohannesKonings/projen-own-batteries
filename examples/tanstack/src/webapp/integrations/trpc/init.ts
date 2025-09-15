import { initTRPC } from "@trpc/server";
import superjson from "superjson";
import type { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";
import { auth } from "~/lib/auth";
import { TRPCError } from "@trpc/server";

export const createContext = async (opts: FetchCreateContextFnOptions) => {
  try {
    const session = await auth.api.getSession({
      // opts.req is a standard Web Fetch Request
      headers: opts.req.headers,
    });
    return { session };
  } catch (error) {
    console.error("Error creating tRPC context:", error);
    return { session: null };
  }
};

const t = initTRPC.context<typeof createContext>().create({
  transformer: superjson,
});

export const createTRPCRouter = t.router;

export const publicProcedure = t.procedure;

export const protectedProcedure = t.procedure.use(async ({ ctx, next }) => {
  if (!ctx.session) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return next();
});
