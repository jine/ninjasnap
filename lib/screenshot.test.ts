import { describe, it, expect } from '@jest/globals';

describe('takeScreenshot', () => {
  it('should be a function', () => {
    // Basic smoke test - just verify the module can be imported
    expect(typeof require('./screenshot').takeScreenshot).toBe('function');
  });

  it('should validate ScreenshotOptions interface', () => {
    // Type-only test - this will fail at compile time if interface changes
    const options: import('./screenshot').ScreenshotOptions = {
      url: 'https://example.com',
      outputPath: '/tmp/test.png',
      resolution: '1920x1080',
      userAgent: 'test-agent',
      enableAdblock: true,
    };
    expect(options).toBeDefined();
  });
});