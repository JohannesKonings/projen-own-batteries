import { betterAuth } from "better-auth";
import { reactStartCookies } from "better-auth/react-start";

// Fail-fast env accessor for required variables (evaluated at runtime)
const env = (key: string): string => {
  const val = (globalThis as any)?.process?.env?.[key];
  if (!val) throw new Error(`${key} required`);
  return val as string;
};

const isProd = process.env.NODE_ENV === "production";

// Resolve baseURL at runtime to avoid build-time env inlining
const resolveBaseURL = () => {
  const raw =
    (globalThis as any)?.process?.env?.["BETTER_AUTH_URL"] ||
    (globalThis as any)?.process?.env?.["VITE_BETTER_AUTH_URL"] ||
    "http://localhost:3000";
  const url = new URL(raw).toString().replace(/\/$/, "");
  return url;
};
const baseURL = resolveBaseURL();
console.log("Using Better Auth URL:", baseURL);

// Guard: enforce HTTPS in production
if (isProd && !baseURL.startsWith("https://")) {
  throw new Error("BETTER_AUTH_URL must be https in production");
}

export const auth = betterAuth({
  // Base URL and path
  baseURL,
  basePath: "/api/auth",

  // Secret for encryption and signing
  secret: env("BETTER_AUTH_SECRET"),

  // Trust the CloudFront domain and localhost for development
  trustedOrigins: Array.from(
    new Set([baseURL, "http://localhost:3000", "https://localhost:3000"]),
  ),

  socialProviders: {
    github: {
      clientId: env("GITHUB_CLIENT_ID"),
      clientSecret: env("GITHUB_CLIENT_SECRET"),
      // Ensure callback URL points to exact domain and path
      redirectURI: new URL("/api/auth/callback/github", baseURL).toString(),
      // Allow implicit sign up for social login
      disableImplicitSignUp: false,
    },
  },

  // Advanced configuration for production
  advanced: {
    // Force secure cookies in production
    useSecureCookies: isProd,
    // Namespace cookies to avoid collisions (optional but recommended)
    cookiePrefix: "tanstack",
    // Default cookie attributes for cross-domain support
    defaultCookieAttributes: {
      sameSite: isProd ? "none" : "lax",
      secure: isProd,
      httpOnly: true,
      // Modern browsers require partitioned for "foreign" cookies when cross-site
      ...(isProd ? { partitioned: true as unknown as boolean } : {}),
    },
    // Ensure correct client IP is recognized behind CloudFront
    ipAddress: {
      ipAddressHeaders: [
        "x-forwarded-for",
        "x-real-ip",
        "cf-connecting-ip",
        "x-client-ip",
      ],
      disableIpTracking: false,
    },
  },

  // Ensure cookies are set correctly in TanStack Start SSR/actions
  plugins: [reactStartCookies()],
});
