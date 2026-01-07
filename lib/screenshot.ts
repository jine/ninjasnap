import puppeteer from 'puppeteer-extra';
import { Browser, Page } from 'puppeteer';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';

// Use stealth plugin
puppeteer.use(StealthPlugin());

export interface ScreenshotOptions {
  url: string;
  outputPath: string;
  width?: number;
  height?: number;
  fullPage?: boolean;
  waitUntil?: 'load' | 'domcontentloaded' | 'networkidle0' | 'networkidle2';
  resolution?: string;
  userAgent?: string;
  enableAdblock?: boolean;
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
    enableAdblock = false,
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
    const launchArgs = [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--no-first-run',
      '--no-zygote',
      '--single-process', // for Docker
      '--disable-gpu',
    ];

    // Add adblock extension if enabled
    if (enableAdblock) {
      // Note: In production, you'd download and provide the uBlock Origin extension path
      // For now, we'll skip extension loading as it requires additional setup
      console.log('Adblock requested but extension loading not implemented yet');
    }

    browser = await puppeteer.launch({
      headless: true,
      args: launchArgs,
    });

    page = await browser.newPage();

    // Set user agent if provided
    if (userAgent) {
      await page.setUserAgent(userAgent);
    }

    await page.setViewport({ width: finalWidth, height: finalHeight });

    // Block unnecessary resources for faster loading
    await page.setRequestInterception(true);
    page.on('request', (request) => {
      const resourceType = request.resourceType();
      // Block images, stylesheets, fonts, and other media to speed up loading
      if (['image', 'stylesheet', 'font', 'media'].includes(resourceType)) {
        request.abort();
      } else {
        request.continue();
      }
    });

    await page.goto(url, { waitUntil, timeout: 30000 });

    await page.screenshot({
      path: outputPath,
      fullPage,
    });
  } finally {
    if (page) await page.close();
    if (browser) await browser.close();
  }
}
