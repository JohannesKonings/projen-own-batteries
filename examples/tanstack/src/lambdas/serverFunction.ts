import type { Handler } from "aws-lambda";

// This will be the actual handler function after the build process
let serverHandler: any;

try {
  // Try to import the built server handler
  const serverModule: any = await import("../../.output/server/index.mjs");
  serverHandler = serverModule.handler || serverModule.default || serverModule;
} catch (error) {
  console.warn(
    "Could not import built server handler, this is expected during build:",
    error,
  );
  // Fallback handler for build time
  serverHandler = async () => ({
    statusCode: 500,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      error: "Server handler not available during build",
    }),
  });
}

export const handler: Handler = async (event: any, _context: any) => {
  console.log("Lambda Function URL Event:", JSON.stringify(event, null, 2));

  try {
    // Pass through the original event so Nitro's aws-lambda preset can parse it correctly
    const result = await serverHandler(event);

    // Ensure proper response format for Lambda Function URL
    return {
      statusCode: result.statusCode || 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization, Cookie",
        "Access-Control-Allow-Credentials": "true",
        ...result.headers,
      },
      body: result.body || JSON.stringify({ message: "OK" }),
      isBase64Encoded: result.isBase64Encoded || false,
    };
  } catch (error) {
    console.error("Error in Lambda handler:", error);
    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": "true",
      },
      body: JSON.stringify({
        error: "Internal Server Error",
        message: error instanceof Error ? error.message : "Unknown error",
      }),
    };
  }
};
