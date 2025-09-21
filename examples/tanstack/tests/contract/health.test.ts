import { describe, it, expect, beforeAll } from "vitest";
import { z } from "zod";

// Health endpoint response schema based on api.yaml contract
const HealthResponseSchema = z.object({
  status: z.literal("healthy"),
  timestamp: z.string().datetime(),
  version: z.string(),
});

describe("Contract Test: GET /api/health", () => {
  let apiBaseUrl: string;

  beforeAll(() => {
    // This will be set from environment variables during actual testing
    apiBaseUrl = process.env.API_BASE_URL || "http://localhost:3000";
  });

  it("should return health status with correct schema", async () => {
    // This test MUST fail initially (no implementation yet)
    const response = await fetch(`${apiBaseUrl}/api/health`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });

    // Verify HTTP status
    expect(response.status).toBe(200);

    // Verify content type
    const contentType = response.headers.get("content-type");
    expect(contentType).toContain("application/json");

    // Parse and validate response body
    const body = await response.json();

    // This will fail until implementation exists
    const validatedResponse = HealthResponseSchema.parse(body);

    // Additional contract validations
    expect(validatedResponse.status).toBe("healthy");
    expect(validatedResponse.timestamp).toBeTruthy();
    expect(validatedResponse.version).toBeTruthy();

    // Verify timestamp is valid ISO string
    const timestamp = new Date(validatedResponse.timestamp);
    expect(timestamp).toBeInstanceOf(Date);
    expect(!isNaN(timestamp.getTime())).toBe(true);
  });

  it("should respond within acceptable time limits", async () => {
    const startTime = Date.now();

    const response = await fetch(`${apiBaseUrl}/api/health`);

    const endTime = Date.now();
    const responseTime = endTime - startTime;

    // Health check should respond quickly (< 1 second)
    expect(responseTime).toBeLessThan(1000);
    expect(response.status).toBe(200);
  });

  it("should include security headers", async () => {
    const response = await fetch(`${apiBaseUrl}/api/health`);

    // Verify security headers are present
    expect(response.headers.get("x-content-type-options")).toBeTruthy();
    expect(response.headers.get("x-frame-options")).toBeTruthy();

    // These will be implemented in security phase
    // expect(response.headers.get('content-security-policy')).toBeTruthy();
    // expect(response.headers.get('strict-transport-security')).toBeTruthy();
  });
});
