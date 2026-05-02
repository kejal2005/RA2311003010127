/**
 * Logging Middleware - Reusable Log() function for frontend applications
 * This module provides a centralized logging system that sends logs to a remote server.
 */

export type LogLevel = "debug" | "info" | "warn" | "error" | "fatal";
export type FrontendPackage =
  | "api"
  | "component"
  | "hook"
  | "page"
  | "state"
  | "style"
  | "auth"
  | "config"
  | "middleware"
  | "utils";

export interface LogEntry {
  stack: string;
  level: LogLevel;
  package: FrontendPackage;
  message: string;
}

/**
 * Log - Sends structured logs to the evaluation service
 *
 * @param stack - Always "frontend" for frontend applications
 * @param level - Log level: debug, info, warn, error, fatal
 * @param packageName - Package/module name where log originates
 * @param message - Detailed descriptive message
 *
 * @example
 * Log("frontend", "info", "api", "Notifications fetched successfully, count: 25");
 * Log("frontend", "error", "component", "Failed to render NotificationCard - Error: Invalid props");
 */
export async function Log(
  stack: string,
  level: LogLevel,
  packageName: FrontendPackage,
  message: string
): Promise<void> {
  try {
    // Read Bearer token from environment variable
    const token = process.env.NEXT_PUBLIC_AUTH_TOKEN;

    if (!token) {
      // Silently handle missing token - don't crash the app
      return;
    }

    const logEntry: LogEntry = {
      stack,
      level,
      package: packageName,
      message,
    };

    // Make POST request to logging endpoint
    const response = await fetch(
      "http://20.207.122.201/evaluation-service/logs",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(logEntry),
      }
    );

    // Silently handle any errors - never crash the app
    if (!response.ok) {
      // Log endpoint errors are swallowed to prevent cascading failures
      return;
    }
  } catch (error) {
    // Catch all errors silently - network issues, parsing errors, etc.
    // We don't want logging to ever crash or interrupt the application
    return;
  }
}

// Default export as well as named export for flexibility
export default Log;
