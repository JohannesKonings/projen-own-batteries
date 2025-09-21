import type {
  APIGatewayProxyHandler,
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
} from "aws-lambda";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand } from "@aws-sdk/lib-dynamodb";

// Initialize DynamoDB client
const dynamoClient = new DynamoDBClient({
  region: process.env.AWS_REGION || "us-east-1",
});
const docClient = DynamoDBDocumentClient.from(dynamoClient);

// Environment variables
const SESSIONS_TABLE = process.env.SESSIONS_TABLE || "";

/**
 * SSR Lambda handler for TanStack Start server-side rendering
 *
 * This function handles server-side rendering for the TanStack Start application,
 * managing session state and routing.
 */
export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  const path = event.path;
  const method = event.httpMethod;

  try {
    // Extract session information
    const sessionId = extractSessionId(event);
    let sessionData = null;

    if (sessionId) {
      sessionData = await getSession(sessionId);
      if (sessionData && isSessionExpired(sessionData)) {
        sessionData = null; // Treat expired sessions as no session
      }
    }

    // Handle different routes
    const response = await renderPage(path, method, sessionData, event);

    return response;
  } catch (error) {
    console.error("SSR Lambda error:", error);

    // Return a basic error page
    return {
      statusCode: 500,
      headers: {
        "Content-Type": "text/html",
        "Cache-Control": "no-cache",
      },
      body: generateErrorPage("Internal Server Error"),
    };
  }
};

/**
 * Render the appropriate page based on the route
 */
async function renderPage(
  path: string,
  method: string,
  sessionData: any,
  _event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> {
  // Security headers for all responses
  const securityHeaders = {
    "Content-Security-Policy":
      "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:;",
    "X-Frame-Options": "DENY",
    "X-Content-Type-Options": "nosniff",
    "X-XSS-Protection": "1; mode=block",
    "Referrer-Policy": "strict-origin-when-cross-origin",
  };

  // Handle root route
  if (path === "/" || path === "") {
    return {
      statusCode: 200,
      headers: {
        "Content-Type": "text/html",
        "Cache-Control": "public, max-age=300", // 5 minutes cache
        ...securityHeaders,
      },
      body: generateHomePage(sessionData),
    };
  }

  // Handle dashboard route (requires authentication)
  if (path === "/dashboard") {
    if (!sessionData) {
      return {
        statusCode: 302,
        headers: {
          Location: "/login",
          "Cache-Control": "no-cache",
        },
        body: "",
      };
    }

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "text/html",
        "Cache-Control": "private, no-cache",
        ...securityHeaders,
      },
      body: generateDashboardPage(sessionData),
    };
  }

  // Handle login route
  if (path === "/login") {
    if (sessionData) {
      // Already logged in, redirect to dashboard
      return {
        statusCode: 302,
        headers: {
          Location: "/dashboard",
          "Cache-Control": "no-cache",
        },
        body: "",
      };
    }

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "text/html",
        "Cache-Control": "public, max-age=300",
        ...securityHeaders,
      },
      body: generateLoginPage(),
    };
  }

  // Handle static assets (should be served by CloudFront but fallback)
  if (
    path.startsWith("/assets/") ||
    path.endsWith(".js") ||
    path.endsWith(".css")
  ) {
    return {
      statusCode: 404,
      headers: {
        "Content-Type": "text/plain",
        "Cache-Control": "public, max-age=3600",
      },
      body: "Asset not found",
    };
  }

  // 404 for unknown routes
  return {
    statusCode: 404,
    headers: {
      "Content-Type": "text/html",
      "Cache-Control": "public, max-age=300",
      ...securityHeaders,
    },
    body: generate404Page(),
  };
}

/**
 * Generate the home page HTML
 */
function generateHomePage(sessionData: any): string {
  const userName = sessionData ? sessionData.email : null;

  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>TanStack Start App</title>
    <style>
        body { font-family: system-ui, sans-serif; margin: 0; padding: 20px; }
        .container { max-width: 800px; margin: 0 auto; }
        .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 40px; }
        .nav a { margin-left: 20px; color: #0066cc; text-decoration: none; }
        .nav a:hover { text-decoration: underline; }
        .hero { text-align: center; padding: 60px 0; }
        .hero h1 { font-size: 3em; margin-bottom: 20px; color: #333; }
        .hero p { font-size: 1.2em; color: #666; }
        .features { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 30px; margin-top: 50px; }
        .feature { padding: 20px; border: 1px solid #ddd; border-radius: 8px; }
        .feature h3 { color: #0066cc; margin-top: 0; }
    </style>
</head>
<body>
    <div class="container">
        <header class="header">
            <h2>TanStack Start</h2>
            <nav class="nav">
                ${
                  userName
                    ? `
                    <span>Hello, ${userName}</span>
                    <a href="/dashboard">Dashboard</a>
                `
                    : `
                    <a href="/login">Login</a>
                `
                }
            </nav>
        </header>
        
        <main class="hero">
            <h1>Welcome to TanStack Start</h1>
            <p>A modern React application with CloudFront, Lambda, and DynamoDB</p>
            
            <div class="features">
                <div class="feature">
                    <h3>🚀 TanStack Start</h3>
                    <p>Full-stack React framework with file-based routing and SSR</p>
                </div>
                <div class="feature">
                    <h3>☁️ AWS Lambda</h3>
                    <p>Serverless backend with DynamoDB for scalable data storage</p>
                </div>
                <div class="feature">
                    <h3>🌐 CloudFront CDN</h3>
                    <p>Global content delivery with edge caching and WAF protection</p>
                </div>
            </div>
        </main>
    </div>
</body>
</html>`;
}

/**
 * Generate the dashboard page HTML
 */
function generateDashboardPage(sessionData: any): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard - TanStack Start</title>
    <style>
        body { font-family: system-ui, sans-serif; margin: 0; padding: 20px; }
        .container { max-width: 800px; margin: 0 auto; }
        .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 40px; }
        .card { padding: 20px; border: 1px solid #ddd; border-radius: 8px; margin-bottom: 20px; }
        .card h3 { margin-top: 0; color: #0066cc; }
        .logout-btn { background: #dc3545; color: white; padding: 8px 16px; border: none; border-radius: 4px; cursor: pointer; }
        .logout-btn:hover { background: #c82333; }
    </style>
</head>
<body>
    <div class="container">
        <header class="header">
            <h2>Dashboard</h2>
            <div>
                <a href="/">Home</a>
                <button class="logout-btn" onclick="logout()">Logout</button>
            </div>
        </header>
        
        <main>
            <div class="card">
                <h3>Welcome back!</h3>
                <p>User: ${sessionData.email}</p>
                <p>Session ID: ${sessionData.sessionId}</p>
                <p>Last activity: ${new Date(sessionData.lastActivityAt).toLocaleString()}</p>
            </div>
            
            <div class="card">
                <h3>Account Information</h3>
                <p>User ID: ${sessionData.userId}</p>
                <p>Account created: ${new Date(sessionData.createdAt).toLocaleString()}</p>
                <p>Session expires: ${new Date(sessionData.expiresAt).toLocaleString()}</p>
            </div>
        </main>
    </div>
    
    <script>
        function logout() {
            fetch('/api/auth/logout', { method: 'POST' })
                .then(() => {
                    window.location.href = '/';
                })
                .catch(console.error);
        }
    </script>
</body>
</html>`;
}

/**
 * Generate the login page HTML
 */
function generateLoginPage(): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login - TanStack Start</title>
    <style>
        body { font-family: system-ui, sans-serif; margin: 0; padding: 20px; background: #f5f5f5; }
        .container { max-width: 400px; margin: 50px auto; }
        .login-form { background: white; padding: 40px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .form-group { margin-bottom: 20px; }
        label { display: block; margin-bottom: 5px; font-weight: 500; }
        input { width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px; font-size: 16px; }
        button { width: 100%; padding: 12px; background: #0066cc; color: white; border: none; border-radius: 4px; font-size: 16px; cursor: pointer; }
        button:hover { background: #0052a3; }
        .error { color: #dc3545; margin-top: 10px; display: none; }
        .header { text-align: center; margin-bottom: 30px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="login-form">
            <div class="header">
                <h2>Login to TanStack Start</h2>
                <p>Enter your credentials to continue</p>
            </div>
            
            <form id="loginForm">
                <div class="form-group">
                    <label for="email">Email:</label>
                    <input type="email" id="email" name="email" required>
                </div>
                
                <div class="form-group">
                    <label for="password">Password:</label>
                    <input type="password" id="password" name="password" required>
                </div>
                
                <button type="submit">Login</button>
                <div id="error" class="error"></div>
            </form>
            
            <p style="text-align: center; margin-top: 20px;">
                <a href="/">Back to Home</a>
            </p>
        </div>
    </div>
    
    <script>
        document.getElementById('loginForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const errorDiv = document.getElementById('error');
            
            try {
                const response = await fetch('/api/auth/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });
                
                if (response.ok) {
                    window.location.href = '/dashboard';
                } else {
                    const data = await response.json();
                    errorDiv.textContent = data.error || 'Login failed';
                    errorDiv.style.display = 'block';
                }
            } catch (error) {
                errorDiv.textContent = 'Network error occurred';
                errorDiv.style.display = 'block';
            }
        });
    </script>
</body>
</html>`;
}

/**
 * Generate a 404 page HTML
 */
function generate404Page(): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Page Not Found - TanStack Start</title>
    <style>
        body { font-family: system-ui, sans-serif; margin: 0; padding: 20px; text-align: center; }
        .container { max-width: 600px; margin: 100px auto; }
        h1 { font-size: 4em; color: #666; margin-bottom: 20px; }
        p { font-size: 1.2em; color: #888; margin-bottom: 30px; }
        a { color: #0066cc; text-decoration: none; }
        a:hover { text-decoration: underline; }
    </style>
</head>
<body>
    <div class="container">
        <h1>404</h1>
        <p>The page you're looking for doesn't exist.</p>
        <a href="/">Go back home</a>
    </div>
</body>
</html>`;
}

/**
 * Generate an error page HTML
 */
function generateErrorPage(message: string): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Error - TanStack Start</title>
    <style>
        body { font-family: system-ui, sans-serif; margin: 0; padding: 20px; text-align: center; }
        .container { max-width: 600px; margin: 100px auto; }
        h1 { color: #dc3545; }
        p { color: #666; }
        a { color: #0066cc; text-decoration: none; }
        a:hover { text-decoration: underline; }
    </style>
</head>
<body>
    <div class="container">
        <h1>Oops! Something went wrong</h1>
        <p>${message}</p>
        <a href="/">Go back home</a>
    </div>
</body>
</html>`;
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

// Utility functions
function extractSessionId(event: APIGatewayProxyEvent): string | null {
  const cookies = event.headers.Cookie || event.headers.cookie || "";
  const sessionMatch = cookies.match(/sessionId=([^;]+)/);
  return sessionMatch?.[1] ?? null;
}

function isSessionExpired(session: any): boolean {
  return new Date(session.expiresAt) < new Date();
}
