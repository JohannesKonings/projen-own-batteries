import { createAuthClient } from "better-auth/react";

// For production builds, prioritize BETTER_AUTH_URL
// For development, fall back to localhost
const getBaseURL = () => {
  // In production, BETTER_AUTH_URL should be set
  if (import.meta.env.VITE_BETTER_AUTH_URL) {
    return import.meta.env.VITE_BETTER_AUTH_URL;
  }

  // Fallback to process.env for server-side or build-time access
  if (process.env.BETTER_AUTH_URL) {
    return process.env.BETTER_AUTH_URL;
  }

  // Development fallback
  return "http://localhost:3000";
};

const baseURL = getBaseURL();
console.log("Using Better Auth URL:", baseURL);

export const { useSession, signIn, signOut, signUp, getSession } =
  createAuthClient({
    baseURL,
    redirectTo: "/",
  });
