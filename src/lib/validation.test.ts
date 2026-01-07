import { describe, it, expect } from '@jest/globals';
import {
  isSafeUrl,
  SafeUrlSchema,
  EnhancedScreenshotRequestSchema,
} from './validation';

describe('URL Validation', () => {
  describe('isSafeUrl', () => {
    it('should accept valid HTTP URLs', () => {
      expect(isSafeUrl('http://example.com')).toBe(true);
      expect(isSafeUrl('https://example.com')).toBe(true);
      expect(isSafeUrl('http://sub.example.com/path')).toBe(true);
    });

    it('should accept valid URLs with ports', () => {
      expect(isSafeUrl('http://example.com:8080')).toBe(true);
      expect(isSafeUrl('https://example.com:443')).toBe(true);
    });

    it('should reject invalid URLs', () => {
      expect(isSafeUrl('')).toBe(false);
      expect(isSafeUrl('not-a-url')).toBe(false);
      expect(isSafeUrl('ftp://example.com')).toBe(false);
    });

    it('should reject URLs with private IPs', () => {
      expect(isSafeUrl('http://127.0.0.1')).toBe(false);
      expect(isSafeUrl('http://192.168.1.1')).toBe(false);
      expect(isSafeUrl('http://10.0.0.1')).toBe(false);
      expect(isSafeUrl('http://172.16.0.1')).toBe(false);
    });

    it('should reject localhost URLs', () => {
      expect(isSafeUrl('http://localhost')).toBe(false);
      expect(isSafeUrl('http://localhost:3000')).toBe(false);
      expect(isSafeUrl('http://0.0.0.0')).toBe(false);
    });

    it('should reject link-local addresses', () => {
      expect(isSafeUrl('http://169.254.1.1')).toBe(false);
    });
  });

  describe('SafeUrlSchema', () => {
    it('should validate safe URLs', () => {
      expect(() => SafeUrlSchema.parse('https://example.com')).not.toThrow();
      expect(() => SafeUrlSchema.parse('http://google.com')).not.toThrow();
    });

    it('should reject unsafe URLs', () => {
      expect(() => SafeUrlSchema.parse('http://localhost')).toThrow();
      expect(() => SafeUrlSchema.parse('http://127.0.0.1')).toThrow();
      expect(() => SafeUrlSchema.parse('ftp://example.com')).toThrow();
    });
  });

  describe('EnhancedScreenshotRequestSchema', () => {
    it('should validate complete valid requests', () => {
      const validRequest = {
        url: 'https://example.com',
        resolution: '1920x1080' as const,
        userAgent:
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36' as const,
        enableAdblock: true,
      };

      expect(() =>
        EnhancedScreenshotRequestSchema.parse(validRequest),
      ).not.toThrow();
    });

    it('should validate minimal valid requests', () => {
      const minimalRequest = {
        url: 'https://example.com',
      };

      expect(() =>
        EnhancedScreenshotRequestSchema.parse(minimalRequest),
      ).not.toThrow();
    });

    it('should reject invalid URLs', () => {
      const invalidRequest = {
        url: 'http://localhost',
      };

      expect(() =>
        EnhancedScreenshotRequestSchema.parse(invalidRequest),
      ).toThrow();
    });

    it('should reject invalid resolutions', () => {
      const invalidRequest = {
        url: 'https://example.com',
        resolution: '999x999', // Invalid resolution
      };

      expect(() =>
        EnhancedScreenshotRequestSchema.parse(invalidRequest),
      ).toThrow();
    });

    it('should validate 4K UHD resolution', () => {
      const request = {
        url: 'https://example.com',
        resolution: '3840x2160' as const,
      };

      expect(() =>
        EnhancedScreenshotRequestSchema.parse(request),
      ).not.toThrow();
    });

    it('should validate ultrawide resolution', () => {
      const request = {
        url: 'https://example.com',
        resolution: '3440x1440' as const,
      };

      expect(() =>
        EnhancedScreenshotRequestSchema.parse(request),
      ).not.toThrow();
    });

    it('should reject invalid user agents', () => {
      const invalidRequest = {
        url: 'https://example.com',
        userAgent: 'Invalid User Agent',
      };

      expect(() =>
        EnhancedScreenshotRequestSchema.parse(invalidRequest),
      ).toThrow();
    });
  });
});
