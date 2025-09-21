import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb";
import type {
  APIGatewayProxyHandler,
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
} from "aws-lambda";

// Initialize DynamoDB client
const dynamoClient = new DynamoDBClient({
  region: process.env.AWS_REGION || "us-east-1",
});
const docClient = DynamoDBDocumentClient.from(dynamoClient);

// Environment variables
const SESSIONS_TABLE = process.env.SESSIONS_TABLE || "";
const REQUEST_LOGS_TABLE = process.env.REQUEST_LOGS_TABLE || "";

/**
 * API Lambda handler for serverless endpoints
 *
 * This function handles API requests with tRPC integration,
 * session management, and request logging.
 */
export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  const requestId = event.requestContext.requestId;
  const timestamp = new Date().toISOString();
  const path = event.path;
  const method = event.httpMethod;
  const userAgent = event.headers["User-Agent"] || "";
  const sourceIp = event.requestContext.identity.sourceIp;

  try {
    // Log the incoming request
    await logRequest({
      id: requestId,
      timestamp,
      path,
      method,
      userAgent,
      sourceIp,
      headers: event.headers,
      queryParameters: event.queryStringParameters,
    });

    // Route handling
    const response = await routeRequest(event);

    // Log the response
    await logResponse(requestId, {
      statusCode: response.statusCode,
      responseTime: Date.now() - new Date(timestamp).getTime(),
    });

    return response;
  } catch (error) {
    console.error("API Lambda error:", error);

    // Log the error
    await logError(requestId, {
      error: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
    });

    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
      body: JSON.stringify({
        error: "Internal Server Error",
        requestId,
      }),
    };
  }
};

/**
 * Route the request to appropriate handlers
 */
async function routeRequest(
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> {
  const path = event.path;
  const method = event.httpMethod;

  // Health check endpoint
  if (path === "/health" && method === "GET") {
    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        status: "healthy",
        timestamp: new Date().toISOString(),
        service: "tanstack-api",
      }),
    };
  }

  // Session management endpoints
  if (path.startsWith("/api/auth/")) {
    return handleAuthRequest(event);
  }

  // tRPC endpoints
  if (path.startsWith("/api/trpc/")) {
    return handleTRPCRequest(event);
  }

  // Default 404 response
  return {
    statusCode: 404,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      error: "Not Found",
      path,
      method,
    }),
  };
}

/**
 * Handle authentication requests
 */
async function handleAuthRequest(
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> {
  const path = event.path;
  const method = event.httpMethod;

  // Session validation
  if (path === "/api/auth/session" && method === "GET") {
    const sessionId = extractSessionId(event);
    if (!sessionId) {
      return {
        statusCode: 401,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ error: "No session found" }),
      };
    }

    const session = await getSession(sessionId);
    if (!session || isSessionExpired(session)) {
      return {
        statusCode: 401,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ error: "Session expired" }),
      };
    }

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        session: {
          userId: session.userId,
          email: session.email,
          isAuthenticated: true,
        },
      }),
    };
  }

  // Session creation (login)
  if (path === "/api/auth/login" && method === "POST") {
    const body = JSON.parse(event.body || "{}");
    const { email, password } = body;

    // Basic validation (in real app, implement proper auth)
    if (!email || !password) {
      return {
        statusCode: 400,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ error: "Email and password required" }),
      };
    }

    // Create session
    const sessionId = generateSessionId();
    const userId = generateUserId();
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(); // 24 hours

    const session = {
      sessionId,
      userId,
      email,
      isAuthenticated: true,
      createdAt: new Date().toISOString(),
      expiresAt,
      lastActivityAt: new Date().toISOString(),
    };

    await createSession(session);

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Set-Cookie": `sessionId=${sessionId}; HttpOnly; Secure; SameSite=Strict; Max-Age=86400`,
      },
      body: JSON.stringify({
        success: true,
        session: {
          userId,
          email,
          isAuthenticated: true,
        },
      }),
    };
  }

  return {
    statusCode: 404,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ error: "Auth endpoint not found" }),
  };
}

/**
 * Handle tRPC requests (placeholder for future implementation)
 */
async function handleTRPCRequest(
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> {
  // This would integrate with tRPC router in a real implementation
  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      message: "tRPC endpoint - implementation pending",
      path: event.path,
    }),
  };
}

// Database operations
async function getSession(sessionId: string) {
  try {
    const result = await docClient.send(
      new GetCommand({
        TableName: SESSIONS_TABLE,
        Key: { sessionId },
      }),
    );
    return result.Item;
  } catch (error) {
    console.error("Error getting session:", error);
    return null;
  }
}

async function createSession(session: any) {
  try {
    await docClient.send(
      new PutCommand({
        TableName: SESSIONS_TABLE,
        Item: session,
      }),
    );
  } catch (error) {
    console.error("Error creating session:", error);
    throw error;
  }
}

async function logRequest(logData: any) {
  try {
    const ttl = Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60; // 30 days TTL
    await docClient.send(
      new PutCommand({
        TableName: REQUEST_LOGS_TABLE,
        Item: {
          ...logData,
          ttl,
        },
      }),
    );
  } catch (error) {
    console.error("Error logging request:", error);
    // Don't throw - logging failures shouldn't break the request
  }
}

async function logResponse(requestId: string, responseData: any) {
  try {
    await docClient.send(
      new UpdateCommand({
        TableName: REQUEST_LOGS_TABLE,
        Key: {
          id: requestId,
          timestamp: responseData.timestamp || new Date().toISOString(),
        },
        UpdateExpression:
          "SET statusCode = :statusCode, responseTime = :responseTime",
        ExpressionAttributeValues: {
          ":statusCode": responseData.statusCode,
          ":responseTime": responseData.responseTime,
        },
      }),
    );
  } catch (error) {
    console.error("Error logging response:", error);
  }
}

async function logError(requestId: string, errorData: any) {
  try {
    await docClient.send(
      new UpdateCommand({
        TableName: REQUEST_LOGS_TABLE,
        Key: { id: requestId, timestamp: new Date().toISOString() },
        UpdateExpression: "SET #error = :error, #stack = :stack",
        ExpressionAttributeNames: {
          "#error": "error",
          "#stack": "stack",
        },
        ExpressionAttributeValues: {
          ":error": errorData.error,
          ":stack": errorData.stack || null,
        },
      }),
    );
  } catch (error) {
    console.error("Error logging error:", error);
  }
}

// Utility functions
function extractSessionId(event: APIGatewayProxyEvent): string | null {
  const cookies = event.headers.Cookie || event.headers.cookie || "";
  const sessionMatch = cookies.match(/sessionId=([^;]+)/);
  return sessionMatch?.[1] ?? null;
}

function isSessionExpired(session: any): boolean {
  return new Date(session.expiresAt) < new Date();
}

function generateSessionId(): string {
  return `sess_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

function generateUserId(): string {
  return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}
