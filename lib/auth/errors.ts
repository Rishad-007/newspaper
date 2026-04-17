/**
 * Centralized error types and handlers for auth and database operations.
 */

export enum AppErrorType {
  AUTH_REQUIRED = "AUTH_REQUIRED",
  UNAUTHORIZED = "UNAUTHORIZED",
  NOT_FOUND = "NOT_FOUND",
  VALIDATION_ERROR = "VALIDATION_ERROR",
  DATABASE_ERROR = "DATABASE_ERROR",
  UNKNOWN = "UNKNOWN",
}

export interface AppError {
  type: AppErrorType;
  message: string;
  statusCode: number;
  originalError?: Error;
}

export function isAppError(error: unknown): error is AppError {
  return (
    typeof error === "object" &&
    error !== null &&
    "type" in error &&
    "message" in error &&
    "statusCode" in error
  );
}

export function createAuthError(
  message: string,
  originalError?: Error,
): AppError {
  return {
    type: AppErrorType.AUTH_REQUIRED,
    message,
    statusCode: 401,
    originalError,
  };
}

export function createUnauthorizedError(
  message: string,
  originalError?: Error,
): AppError {
  return {
    type: AppErrorType.UNAUTHORIZED,
    message,
    statusCode: 403,
    originalError,
  };
}

export function createNotFoundError(
  message: string,
  originalError?: Error,
): AppError {
  return {
    type: AppErrorType.NOT_FOUND,
    message,
    statusCode: 404,
    originalError,
  };
}

export function createValidationError(
  message: string,
  originalError?: Error,
): AppError {
  return {
    type: AppErrorType.VALIDATION_ERROR,
    message,
    statusCode: 400,
    originalError,
  };
}

export function createDatabaseError(
  message: string,
  originalError?: Error,
): AppError {
  return {
    type: AppErrorType.DATABASE_ERROR,
    message,
    statusCode: 500,
    originalError,
  };
}

export function createUnknownError(
  message: string,
  originalError?: Error,
): AppError {
  return {
    type: AppErrorType.UNKNOWN,
    message,
    statusCode: 500,
    originalError,
  };
}

/**
 * Extracts useful error message from unknown errors.
 */
export function getErrorMessage(error: unknown): string {
  if (isAppError(error)) {
    return error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return String(error);
}

/**
 * Logs error with context (safe for both client and server).
 */
export function logError(context: string, error: unknown): void {
  const message = getErrorMessage(error);
  console.error(`[${context}]`, message);
  if (isAppError(error) && error.originalError) {
    console.error("Original:", error.originalError);
  }
}
