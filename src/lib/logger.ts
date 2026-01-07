import crypto from 'crypto';

/**
 * Log levels
 */
export enum LogLevel {
  ERROR = 'error',
  WARN = 'warn',
  INFO = 'info',
  DEBUG = 'debug',
}

/**
 * Structured log entry interface
 */
export interface LogEntry {
  level: LogLevel;
  message: string;
  correlationId?: string;
  url?: string;
  userAgent?: string;
  ip?: string;
  duration?: number;
  screenshotId?: string;
  validationErrors?: unknown[];
  componentStack?: string;
  errorBoundary?: string;
  resolution?: string;
  enableAdblock?: boolean;
  error?: {
    name: string;
    message: string;
    stack?: string | undefined;
  };
  timestamp: string;
  service: string;
}

/**
 * Logger class for structured logging
 */
export class Logger {
  private service: string;

  constructor(service: string = 'ninjasnap') {
    this.service = service;
  }

  /**
   * Create a logger instance with correlation ID
   */
  withCorrelationId(correlationId: string): LoggerWithCorrelationId {
    return new LoggerWithCorrelationId(this.service, correlationId);
  }

  protected log(
    level: LogLevel,
    message: string,
    extra: Partial<LogEntry> = {},
  ): void {
    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      service: this.service,
      ...extra,
    };

    // In production, you might want to use a proper logging service
    console.log(JSON.stringify(entry));
  }

  info(message: string, extra?: Partial<LogEntry>): void {
    this.log(LogLevel.INFO, message, extra);
  }

  warn(message: string, extra?: Partial<LogEntry>): void {
    this.log(LogLevel.WARN, message, extra);
  }

  error(message: string, error?: Error, extra?: Partial<LogEntry>): void {
    const errorInfo = error
      ? {
          error: {
            name: error.name,
            message: error.message,
            stack: error.stack,
          },
        }
      : {};

    this.log(LogLevel.ERROR, message, { ...extra, ...errorInfo });
  }

  debug(message: string, extra?: Partial<LogEntry>): void {
    if (process.env.NODE_ENV === 'development') {
      this.log(LogLevel.DEBUG, message, extra);
    }
  }
}

/**
 * Logger with correlation ID attached
 */
export class LoggerWithCorrelationId extends Logger {
  constructor(
    service: string,
    private correlationId: string,
  ) {
    super(service);
  }

  protected override log(
    level: LogLevel,
    message: string,
    extra: Partial<LogEntry> = {},
  ): void {
    super.log(level, message, { correlationId: this.correlationId, ...extra });
  }

  getCorrelationId(): string {
    return this.correlationId;
  }
}

/**
 * Global logger instance
 */
export const logger = new Logger();

/**
 * Generate a correlation ID
 */
export function generateCorrelationId(): string {
  return crypto.randomUUID();
}
