import { Browser, Page } from 'puppeteer';
import { puppeteerPool } from '../src/lib/puppeteer-pool';

/**
 * Supported screenshot resolutions
 */
export type ScreenshotResolution =
  | '1920x1080'
  | '1366x768'
  | '1280x720'
  | '1024x768'
  | '768x1024'
  | '375x667';

/**
 * Supported user agents
 */
export type UserAgent =
  | 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  | 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0'
  | 'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_1) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Safari/605.1.15'
  | 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Edg/120.0.0.0'
  | 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Mobile/15E148 Safari/604.1'
  | 'Mozilla/5.0 (Linux; Android 10; SM-G973F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36'
  | 'Mozilla/5.0 (Linux; Android 10; SM-G973F) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/18.0 Chrome/120.0.0.0 Mobile Safari/537.36';

export interface ScreenshotOptions {
  url: string;
  outputPath: string;
  width?: number;
  height?: number;
  fullPage?: boolean;
  waitUntil?: 'load' | 'domcontentloaded' | 'networkidle0' | 'networkidle2';
  resolution?: ScreenshotResolution;
  userAgent?: UserAgent;
  timeout?: number;
}

export async function takeScreenshot(
  url: string,
  outputPath: string,
  options: Omit<ScreenshotOptions, 'url' | 'outputPath'> = {},
): Promise<void> {
  const {
    width = 1280,
    height = 720,
    fullPage = true,
    waitUntil = 'networkidle2',
    resolution,
    userAgent,
    timeout = 30000,
  } = options;

  // Parse resolution if provided
  let finalWidth = width;
  let finalHeight = height;
  if (resolution) {
    const [w, h] = resolution.split('x').map(Number);
    if (w && h) {
      finalWidth = w;
      finalHeight = h;
    }
  }

  let browser: Browser | null = null;
  let page: Page | null = null;

  try {
    // Get browser from pool
    browser = await puppeteerPool.acquire();
    if (!browser) {
      throw new Error('Failed to acquire browser from pool');
    }
    page = await browser.newPage();

    // Set user agent if provided
    if (userAgent) {
      await page.setUserAgent(userAgent);
    }

    await page.setViewport({ width: finalWidth, height: finalHeight });

    await page.goto(url, { waitUntil, timeout });

    await page.screenshot({
      path: outputPath,
      fullPage,
    });
  } finally {
    if (page) {
      try {
        await page.close();
      } catch (error) {
        console.error('Error closing page:', error);
      }
    }
    if (browser) {
      try {
        await puppeteerPool.release(browser);
      } catch (error) {
        console.error('Error releasing browser to pool:', error);
      }
    }
  }
}
