/**
 * Maps database/API errors to user-friendly messages.
 * Detailed errors are only logged in development mode.
 */
export function mapDatabaseError(error: unknown, context?: string): string {
  // Log full error details in development only
  if (import.meta.env.DEV) {
    console.error(`[${context || "Database Error"}]:`, error);
  }

  // Return generic user-friendly message
  return "An error occurred. Please try again later.";
}

/**
 * Maps specific operation errors to appropriate user messages.
 */
export function mapOperationError(
  error: unknown,
  operation: "fetch" | "create" | "update" | "delete",
  resource?: string
): string {
  // Log full error details in development only
  if (import.meta.env.DEV) {
    console.error(`[${operation.toUpperCase()} ${resource || "resource"}]:`, error);
  }

  // Return operation-specific generic messages
  switch (operation) {
    case "fetch":
      return "Unable to load data. Please refresh and try again.";
    case "create":
      return "Unable to save. Please try again.";
    case "update":
      return "Unable to update. Please try again.";
    case "delete":
      return "Unable to delete. Please try again.";
    default:
      return "An error occurred. Please try again later.";
  }
}

/**
 * Type guard to check if error is an authentication error
 */
export function isAuthError(error: unknown): boolean {
  if (error instanceof Error) {
    const message = error.message.toLowerCase();
    return (
      message.includes("not authenticated") ||
      message.includes("jwt") ||
      message.includes("unauthorized") ||
      message.includes("auth")
    );
  }
  return false;
}
