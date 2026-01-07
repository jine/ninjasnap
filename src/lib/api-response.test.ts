import { describe, it, expect } from '@jest/globals';
import {
  createSuccessResponse,
  createErrorResponse,
  ErrorCode,
  HttpStatus,
} from './api-response';

describe('API Response Utilities', () => {
  describe('createSuccessResponse', () => {
    it('should create a success response with data', () => {
      const data = { id: '123', url: 'https://example.com' };
      const result = createSuccessResponse(data);

      expect(result.status).toBe(HttpStatus.OK);
      expect(result.response).toEqual({
        success: true,
        data,
        timestamp: expect.any(String),
      });
    });

    it('should create a success response with custom status', () => {
      const data = { id: '123' };
      const result = createSuccessResponse(data, HttpStatus.OK);

      expect(result.status).toBe(HttpStatus.OK);
      expect(result.response.success).toBe(true);
      expect(result.response.data).toEqual(data);
    });

    it('should include timestamp in ISO format', () => {
      const result = createSuccessResponse({ test: true });
      expect(result.response.timestamp).toMatch(
        /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/,
      );
    });
  });

  describe('createErrorResponse', () => {
    it('should create an error response with error code and message', () => {
      const result = createErrorResponse(
        ErrorCode.VALIDATION_ERROR,
        'Invalid URL provided',
        HttpStatus.BAD_REQUEST,
      );

      expect(result.status).toBe(HttpStatus.BAD_REQUEST);
      expect(result.response).toEqual({
        success: false,
        error: {
          code: ErrorCode.VALIDATION_ERROR,
          message: 'Invalid URL provided',
        },
        timestamp: expect.any(String),
      });
    });

    it('should create error response with default status code', () => {
      const result = createErrorResponse(
        ErrorCode.INTERNAL_ERROR,
        'Something went wrong',
      );

      expect(result.status).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
    });

    it('should include additional error details when provided', () => {
      const result = createErrorResponse(
        ErrorCode.INVALID_URL,
        'Blocked private IP access',
        HttpStatus.FORBIDDEN,
        { attemptedUrl: 'http://127.0.0.1' },
      );

      expect(result.response.error.details).toEqual({
        attemptedUrl: 'http://127.0.0.1',
      });
    });

    it('should include correlation ID when provided', () => {
      const result = createErrorResponse(
        ErrorCode.TIMEOUT_ERROR,
        'Request timed out',
        HttpStatus.GATEWAY_TIMEOUT,
        undefined,
        'corr-123',
      );

      expect(result.response.error.correlationId).toBe('corr-123');
    });
  });

  describe('ErrorCode enum', () => {
    it('should have all expected error codes', () => {
      expect(ErrorCode.VALIDATION_ERROR).toBe('VALIDATION_ERROR');
      expect(ErrorCode.RATE_LIMIT_EXCEEDED).toBe('RATE_LIMIT_EXCEEDED');
      expect(ErrorCode.SCREENSHOT_FAILED).toBe('SCREENSHOT_FAILED');
      expect(ErrorCode.INVALID_URL).toBe('INVALID_URL');
      expect(ErrorCode.TIMEOUT_ERROR).toBe('TIMEOUT_ERROR');
      expect(ErrorCode.INTERNAL_ERROR).toBe('INTERNAL_ERROR');
    });
  });

  describe('HttpStatus enum', () => {
    it('should have all expected HTTP status codes', () => {
      expect(HttpStatus.OK).toBe(200);
      expect(HttpStatus.BAD_REQUEST).toBe(400);
      expect(HttpStatus.UNAUTHORIZED).toBe(401);
      expect(HttpStatus.FORBIDDEN).toBe(403);
      expect(HttpStatus.NOT_FOUND).toBe(404);
      expect(HttpStatus.TOO_MANY_REQUESTS).toBe(429);
      expect(HttpStatus.INTERNAL_SERVER_ERROR).toBe(500);
      expect(HttpStatus.BAD_GATEWAY).toBe(502);
      expect(HttpStatus.SERVICE_UNAVAILABLE).toBe(503);
      expect(HttpStatus.GATEWAY_TIMEOUT).toBe(504);
    });
  });
});
