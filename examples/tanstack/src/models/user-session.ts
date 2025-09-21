import { z } from "zod";

/**
 * User Session model for managing authenticated user state
 * Stored in DynamoDB Sessions table
 */
export const UserSessionSchema = z
  .object({
    sessionId: z.string().uuid("Session ID must be a valid UUID"),
    userId: z.string().min(1, "User ID is required"),
    createdAt: z.date().or(z.string().datetime()),
    expiresAt: z.date().or(z.string().datetime()),
    isActive: z.boolean().default(true),
    metadata: z
      .object({
        device: z.string().optional(),
        location: z.string().optional(),
        userAgent: z.string().optional(),
        ipAddress: z.string().optional(), // Anonymized
      })
      .optional(),
  })
  .refine(
    (data) => {
      const createdAt = new Date(data.createdAt);
      const expiresAt = new Date(data.expiresAt);
      return expiresAt > createdAt;
    },
    {
      message: "expiresAt must be after createdAt",
      path: ["expiresAt"],
    },
  );

export type UserSession = z.infer<typeof UserSessionSchema>;

/**
 * State transitions for user sessions
 */
export enum SessionState {
  CREATED = "created",
  ACTIVE = "active",
  EXPIRED = "expired",
  DELETED = "deleted",
}

/**
 * Session creation data (without computed fields)
 */
export const CreateUserSessionSchema = UserSessionSchema.omit({
  sessionId: true,
  createdAt: true,
  isActive: true,
}).extend({
  expiresAt: z.date().or(z.string().datetime()),
});

export type CreateUserSession = z.infer<typeof CreateUserSessionSchema>;

/**
 * Session update data (partial updates allowed)
 */
export const UpdateUserSessionSchema = UserSessionSchema.partial().omit({
  sessionId: true,
  userId: true,
  createdAt: true,
});

export type UpdateUserSession = z.infer<typeof UpdateUserSessionSchema>;

/**
 * Utility functions for session management
 */
export class UserSessionUtils {
  /**
   * Generate a new session ID
   */
  static generateSessionId(): string {
    return crypto.randomUUID();
  }

  /**
   * Create default session expiration (24 hours from now)
   */
  static getDefaultExpiration(): Date {
    const now = new Date();
    return new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24 hours
  }

  /**
   * Create extended session expiration (30 days for "remember me")
   */
  static getExtendedExpiration(): Date {
    const now = new Date();
    return new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days
  }

  /**
   * Check if session is expired
   */
  static isExpired(session: UserSession): boolean {
    const expiresAt = new Date(session.expiresAt);
    return expiresAt < new Date();
  }

  /**
   * Check if session is valid (active and not expired)
   */
  static isValid(session: UserSession): boolean {
    return session.isActive && !this.isExpired(session);
  }

  /**
   * Sanitize session metadata (remove sensitive information)
   */
  static sanitizeMetadata(
    metadata?: UserSession["metadata"],
  ): UserSession["metadata"] {
    if (!metadata) return undefined;

    return {
      device: metadata.device,
      location: metadata.location,
      // Remove or anonymize sensitive data
      userAgent: metadata.userAgent?.substring(0, 100), // Truncate
      ipAddress: metadata.ipAddress
        ? this.anonymizeIP(metadata.ipAddress)
        : undefined,
    };
  }

  /**
   * Anonymize IP address for privacy
   */
  private static anonymizeIP(ip: string): string {
    const parts = ip.split(".");
    if (parts.length === 4) {
      // IPv4: Replace last octet with 0
      return `${parts[0]}.${parts[1]}.${parts[2]}.0`;
    }
    // IPv6: Replace last 64 bits with zeros
    const ipv6Parts = ip.split(":");
    if (ipv6Parts.length >= 4) {
      return ipv6Parts.slice(0, 4).join(":") + "::";
    }
    return ip; // Return original if format not recognized
  }
}
