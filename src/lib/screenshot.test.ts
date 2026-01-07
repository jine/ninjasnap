import { describe, it, expect } from '@jest/globals';

describe('Screenshot Types', () => {
  it('should compile with valid ScreenshotOptions', () => {
    // Type-only test - this will fail at compile time if interface changes
    // We create a properly typed object to ensure the interface is valid
    const options: import('./screenshot').ScreenshotOptions = {
      url: 'https://example.com',
      outputPath: '/tmp/test.png',
      resolution: '1920x1080',
      userAgent:
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    };
    expect(options).toBeDefined();
    expect(options.url).toBe('https://example.com');
  });

  it('should accept all valid UserAgent values', () => {
    // Test all valid user agent strings
    const userAgents: import('./screenshot').UserAgent[] = [
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0',
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_1) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Safari/605.1.15',
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Edg/120.0.0.0',
      'Mozilla/5.0 (iPhone; CPU iPhone OS 17_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Mobile/15E148 Safari/604.1',
      'Mozilla/5.0 (Linux; Android 10; SM-G973F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36',
      'Mozilla/5.0 (Linux; Android 10; SM-G973F) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/18.0 Chrome/120.0.0.0 Mobile Safari/537.36',
    ];

    userAgents.forEach((userAgent) => {
      const options: import('./screenshot').ScreenshotOptions = {
        url: 'https://example.com',
        outputPath: '/tmp/test.png',
        resolution: '1920x1080',
        userAgent: userAgent,
      };
      expect(options.userAgent).toBe(userAgent);
    });
  });
});
