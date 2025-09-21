import { describe, it, expect, beforeAll } from "vitest";
import { z } from "zod";

// Login request/response schemas based on api.yaml contract
const LoginRequestSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  rememberMe: z.boolean().optional().default(false),
});

const UserSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  name: z.string(),
  createdAt: z.string().datetime(),
  lastLoginAt: z.string().datetime().optional(),
});

const LoginResponseSchema = z.object({
  user: UserSchema,
  sessionId: z.string().uuid(),
});

const ErrorResponseSchema = z.object({
  error: z.string(),
  message: z.string(),
  code: z.string(),
  timestamp: z.string().datetime(),
  requestId: z.string().uuid(),
});

describe("Contract Test: POST /api/auth/login", () => {
  let apiBaseUrl: string;

  beforeAll(() => {
    apiBaseUrl = process.env.API_BASE_URL || "http://localhost:3000";
  });

  it("should accept valid login credentials and return user data", async () => {
    const validLoginData = {
      email: "test@example.com",
      password: "validpassword123",
      rememberMe: false,
    };

    // Validate request schema
    const validatedRequest = LoginRequestSchema.parse(validLoginData);

    const response = await fetch(`${apiBaseUrl}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(validatedRequest),
    });

    // This will fail until authentication is implemented
    expect(response.status).toBe(200);

    // Verify content type
    const contentType = response.headers.get("content-type");
    expect(contentType).toContain("application/json");

    // Verify session cookie is set
    const setCookieHeader = response.headers.get("set-cookie");
    expect(setCookieHeader).toBeTruthy();
    expect(setCookieHeader).toContain("session-token");

    // Parse and validate response body
    const body = await response.json();
    const validatedResponse = LoginResponseSchema.parse(body);

    expect(validatedResponse.user.email).toBe(validLoginData.email);
    expect(validatedResponse.sessionId).toBeTruthy();
  });

  it("should reject invalid credentials with 401 status", async () => {
    const invalidLoginData = {
      email: "test@example.com",
      password: "wrongpassword",
      rememberMe: false,
    };

    const response = await fetch(`${apiBaseUrl}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(invalidLoginData),
    });

    expect(response.status).toBe(401);

    const body = await response.json();
    const validatedError = ErrorResponseSchema.parse(body);

    expect(validatedError.error).toBeTruthy();
    expect(validatedError.message).toBeTruthy();
    expect(validatedError.requestId).toBeTruthy();
  });

  it("should validate email format", async () => {
    const invalidEmailData = {
      email: "invalid-email",
      password: "validpassword123",
    };

    const response = await fetch(`${apiBaseUrl}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(invalidEmailData),
    });

    expect(response.status).toBe(400);

    const body = await response.json();
    const validatedError = ErrorResponseSchema.parse(body);
    expect(validatedError.error).toBeTruthy();
  });

  it("should validate password length", async () => {
    const shortPasswordData = {
      email: "test@example.com",
      password: "short",
    };

    const response = await fetch(`${apiBaseUrl}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(shortPasswordData),
    });

    expect(response.status).toBe(400);

    const body = await response.json();
    const validatedError = ErrorResponseSchema.parse(body);
    expect(validatedError.error).toBeTruthy();
  });
});
