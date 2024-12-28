/**
 * Custom error types for different scenarios in the application
 */

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(message: string, statusCode: number = 500, isOperational: boolean = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 400);
    this.name = 'ValidationError';
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string) {
    super(`${resource} not found`, 404);
    this.name = 'NotFoundError';
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string = 'Authentication failed') {
    super(message, 401);
    this.name = 'AuthenticationError';
  }
}

export class AuthorizationError extends AppError {
  constructor(message: string = 'Not authorized') {
    super(message, 403);
    this.name = 'AuthorizationError';
  }
}

/**
 * Error handling utilities
 */
export class ErrorHandler {
  public static handle(error: Error): { 
    statusCode: number;
    message: string;
    stack?: string;
  } {
    if (error instanceof AppError) {
      return {
        statusCode: error.statusCode,
        message: error.message,
        ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
      };
    }

    // Handle unknown errors
    console.error('Unhandled error:', error);
    return {
      statusCode: 500,
      message: 'Internal server error',
      ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
    };
  }

  public static isTrustedError(error: Error): boolean {
    if (error instanceof AppError) {
      return error.isOperational;
    }
    return false;
  }
}

// Utility function to wrap async route handlers
export const asyncHandler = (fn: Function) => {
  return (req: any, res: any, next: any) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
