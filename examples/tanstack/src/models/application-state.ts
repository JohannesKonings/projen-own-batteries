import { z } from "zod";

/**
 * Application State model for client-side state management
 * Stored in browser localStorage and synchronized with server
 */
export const ApplicationStateSchema = z.object({
  theme: z.enum(["light", "dark", "system"]).default("system"),
  language: z
    .string()
    .regex(/^[a-z]{2}$/, "Language must be a valid ISO 639-1 code")
    .default("en"),
  lastRoute: z.string().min(1, "Last route cannot be empty").optional(),
  preferences: z.object({
    compactMode: z.boolean().default(false),
    sidebarCollapsed: z.boolean().default(false),
    notifications: z.object({
      email: z.boolean().default(true),
      push: z.boolean().default(false),
      desktop: z.boolean().default(false),
    }),
    accessibility: z
      .object({
        reduceMotion: z.boolean().default(false),
        highContrast: z.boolean().default(false),
        fontSize: z.enum(["small", "medium", "large"]).default("medium"),
      })
      .optional(),
  }),
  cacheTimestamp: z.date().or(z.string().datetime()).optional(),
});

export type ApplicationState = z.infer<typeof ApplicationStateSchema>;

/**
 * Theme type for type safety
 */
export type Theme = ApplicationState["theme"];

/**
 * Language type for type safety
 */
export type Language = ApplicationState["language"];

/**
 * Preferences update schema (partial updates allowed)
 */
export const UpdateApplicationStateSchema = ApplicationStateSchema.partial();
export type UpdateApplicationState = z.infer<
  typeof UpdateApplicationStateSchema
>;

/**
 * Default application state
 */
export const DEFAULT_APPLICATION_STATE: ApplicationState = {
  theme: "system",
  language: "en",
  preferences: {
    compactMode: false,
    sidebarCollapsed: false,
    notifications: {
      email: true,
      push: false,
      desktop: false,
    },
  },
};

/**
 * Utility functions for application state management
 */
export class ApplicationStateUtils {
  /**
   * Get default application state
   */
  static getDefault(): ApplicationState {
    return { ...DEFAULT_APPLICATION_STATE };
  }

  /**
   * Validate and sanitize application state
   */
  static validate(state: unknown): ApplicationState {
    try {
      return ApplicationStateSchema.parse(state);
    } catch {
      // Return default state if validation fails
      return this.getDefault();
    }
  }

  /**
   * Merge state updates with existing state
   */
  static mergeUpdates(
    currentState: ApplicationState,
    updates: UpdateApplicationState,
  ): ApplicationState {
    const validatedUpdates = UpdateApplicationStateSchema.parse(updates);

    return {
      ...currentState,
      ...validatedUpdates,
      preferences: {
        ...currentState.preferences,
        ...validatedUpdates.preferences,
        notifications: {
          ...currentState.preferences.notifications,
          ...validatedUpdates.preferences?.notifications,
        },
        accessibility:
          currentState.preferences.accessibility &&
          validatedUpdates.preferences?.accessibility
            ? {
                ...currentState.preferences.accessibility,
                ...validatedUpdates.preferences.accessibility,
              }
            : validatedUpdates.preferences?.accessibility ||
              currentState.preferences.accessibility,
      },
      cacheTimestamp: new Date(),
    };
  }

  /**
   * Check if state is stale (older than specified minutes)
   */
  static isStale(state: ApplicationState, maxAgeMinutes: number = 60): boolean {
    if (!state.cacheTimestamp) return true;

    const cacheTime = new Date(state.cacheTimestamp);
    const now = new Date();
    const ageMinutes = (now.getTime() - cacheTime.getTime()) / (1000 * 60);

    return ageMinutes > maxAgeMinutes;
  }

  /**
   * Serialize state for localStorage
   */
  static serialize(state: ApplicationState): string {
    return JSON.stringify(state);
  }

  /**
   * Deserialize state from localStorage
   */
  static deserialize(serialized: string): ApplicationState {
    try {
      const parsed = JSON.parse(serialized);
      return this.validate(parsed);
    } catch {
      return this.getDefault();
    }
  }

  /**
   * Get browser's preferred theme
   */
  static getBrowserTheme(): "light" | "dark" {
    if (typeof window !== "undefined" && window.matchMedia) {
      return window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    }
    return "light";
  }

  /**
   * Get browser's preferred language
   */
  static getBrowserLanguage(): string {
    if (typeof navigator !== "undefined") {
      const lang = navigator.language?.split("-")[0];
      return lang && /^[a-z]{2}$/.test(lang) ? lang : "en";
    }
    return "en";
  }

  /**
   * Resolve theme based on preference
   */
  static resolveTheme(theme: Theme): "light" | "dark" {
    if (theme === "system") {
      return this.getBrowserTheme();
    }
    return theme;
  }

  /**
   * Check if route is valid application route
   */
  static isValidRoute(route: string): boolean {
    // Basic validation - should be expanded based on actual app routes
    return (
      route.startsWith("/") &&
      route.length > 1 &&
      !route.includes("..") &&
      !route.includes("//")
    );
  }

  /**
   * Sanitize route for security
   */
  static sanitizeRoute(route: string): string | undefined {
    if (!this.isValidRoute(route)) return undefined;

    // Remove query parameters and fragments for privacy
    const url = new URL(route, "https://example.com");
    return url.pathname;
  }
}
