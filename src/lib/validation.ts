import { z } from 'zod';
import { URL } from 'url';
import type { ScreenshotResolution, UserAgent } from '../../lib/screenshot';

/**
 * Validates if a URL is safe to access (blocks localhost, private IPs, etc.)
 */
export function isSafeUrl(url: string): boolean {
  try {
    const parsedUrl = new URL(url);

    // Block localhost and common local development domains
    const blockedHosts = [
      'localhost',
      '127.0.0.1',
      '0.0.0.0',
      '::1',
      'local',
      'internal',
    ];

    // Check for blocked hostnames
    if (blockedHosts.includes(parsedUrl.hostname.toLowerCase())) {
      return false;
    }

    // Block private IP ranges
    const hostname = parsedUrl.hostname;
    const ipRegex = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/;
    const match = hostname.match(ipRegex);

    if (match) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const [_, a, b] = match.map(Number);

      // Block private IPv4 ranges
      if (
        // 10.0.0.0/8
        a === 10 ||
        // 172.16.0.0/12
        (a === 172 && b !== undefined && b >= 16 && b <= 31) ||
        // 192.168.0.0/16
        (a === 192 && b === 168) ||
        // 127.0.0.0/8 (loopback)
        a === 127 ||
        // 0.0.0.0/8
        a === 0
      ) {
        return false;
      }
    }

    // Block link-local and other special ranges
    if (hostname.startsWith('169.254.') || hostname.startsWith('fe80::')) {
      return false;
    }

    // Only allow HTTP/HTTPS protocols
    if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
      return false;
    }

    return true;
  } catch {
    return false;
  }
}

/**
 * Enhanced URL schema with security validation
 */
export const SafeUrlSchema = z.string().url().refine(isSafeUrl, {
  message:
    'URL contains blocked hostname or IP address (localhost, private networks not allowed)',
});

/**
 * Enhanced screenshot request schema with better validation
 */
export const EnhancedScreenshotRequestSchema = z.object({
  url: SafeUrlSchema,
  resolution: z
    .enum([
      '3840x2160',
      '3440x1440',
      '1920x1080',
      '1366x768',
      '1280x720',
      '1024x768',
      '768x1024',
      '375x667',
    ] as const satisfies readonly ScreenshotResolution[])
    .optional(),
  userAgent: z
    .enum([
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0',
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_1) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Safari/605.1.15',
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Edg/120.0.0.0',
      'Mozilla/5.0 (iPhone; CPU iPhone OS 17_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Mobile/15E148 Safari/604.1',
      'Mozilla/5.0 (Linux; Android 10; SM-G973F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36',
      'Mozilla/5.0 (Linux; Android 10; SM-G973F) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/18.0 Chrome/120.0.0.0 Mobile Safari/537.36',
    ] as const satisfies readonly UserAgent[])
    .optional(),
});
