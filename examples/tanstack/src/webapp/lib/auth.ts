import { betterAuth } from "better-auth";
import { reactStartCookies } from "better-auth/react-start";

// Fail-fast env accessor for required variables (spec: required error throwing)
const env = (key: string): string => {
  const val = process.env[key];
  if (!val) throw new Error(`${key} required`);
  return val;
};

const isProd = process.env.NODE_ENV === "production";

// Normalize baseURL once; prefer BETTER_AUTH_URL then VITE_BETTER_AUTH_URL then localhost
const rawBaseURL =
  process.env.BETTER_AUTH_URL ||
  process.env.VITE_BETTER_AUTH_URL ||
  "http://localhost:3000";

// Strip trailing slash for consistency
const baseURL = new URL(rawBaseURL).toString().replace(/\/$/, "");

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
      // Example hardening toggles (optional):
      // disableImplicitSignUp: true,
      // overrideUserInfoOnSignIn: true,
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
