// Global type definitions for the NinjaSnap application

// Screenshot related types
import type {
  ScreenshotOptions,
  ScreenshotResolution,
  UserAgent,
} from '../lib/screenshot';

export type { ScreenshotOptions, ScreenshotResolution, UserAgent };

// API related types
export type { ApiErrorResponse, ApiSuccessResponse } from '../lib/api-response';

export {
  ErrorCode,
  HttpStatus,
  createErrorResponse,
  createSuccessResponse,
} from '../lib/api-response';

// Validation schemas
export {
  SafeUrlSchema,
  EnhancedScreenshotRequestSchema,
} from '../lib/validation';

// Logging types
export type { LogEntry } from '../lib/logger';

export {
  LogLevel,
  Logger,
  LoggerWithCorrelationId,
  logger,
  generateCorrelationId,
} from '../lib/logger';

// Configuration types
export type { Config } from '../lib/config';

export { config } from '../lib/config';

// React component props types
export interface ScreenshotFormData {
  url: string;
  resolution: ScreenshotResolution;
  userAgent: UserAgent;
  enableAdblock: boolean;
}

export interface ScreenshotResult {
  id: string;
  url: string;
  timestamp: string;
}
