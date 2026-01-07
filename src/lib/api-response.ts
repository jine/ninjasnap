/**
 * Standard API error response interface
 */
export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
    correlationId?: string;
  };
  timestamp: string;
}

/**
 * Standard API success response interface
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface ApiSuccessResponse<T = any> {
  success: true;
  data: T;
  timestamp: string;
}

/**
 * Common error codes
 */
export enum ErrorCode {
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
  SCREENSHOT_FAILED = 'SCREENSHOT_FAILED',
  INVALID_URL = 'INVALID_URL',
  TIMEOUT_ERROR = 'TIMEOUT_ERROR',
  INTERNAL_ERROR = 'INTERNAL_ERROR',
}

/**
 * HTTP status codes
 */
export enum HttpStatus {
  OK = 200,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  TOO_MANY_REQUESTS = 429,
  INTERNAL_SERVER_ERROR = 500,
  BAD_GATEWAY = 502,
  SERVICE_UNAVAILABLE = 503,
  GATEWAY_TIMEOUT = 504,
}

/**
 * Create a standardized error response
 */
export function createErrorResponse(
  code: ErrorCode,
  message: string,
  status: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR,
  details?: Record<string, unknown>,
  correlationId?: string,
): { response: ApiErrorResponse; status: HttpStatus } {
  return {
    response: {
      success: false,
      error: {
        code,
        message,
        details,
        correlationId,
      },
      timestamp: new Date().toISOString(),
    },
    status,
  };
}

/**
 * Create a standardized success response
 */
export function createSuccessResponse<T>(
  data: T,
  status: HttpStatus = HttpStatus.OK,
): { response: ApiSuccessResponse<T>; status: HttpStatus } {
  return {
    response: {
      success: true,
      data,
      timestamp: new Date().toISOString(),
    },
    status,
  };
}
