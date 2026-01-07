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
  } = options;

  let browser: Browser | null = null;
  let page: Page | null = null;

  try {
    browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--single-process', // for Docker
        '--disable-gpu',
      ],
    });

    page = await browser.newPage();

    await page.setViewport({ width, height });

    await page.goto(url, { waitUntil });

    await page.screenshot({
      path: outputPath,
      fullPage,
    });
  } finally {
    if (page) await page.close();
    if (browser) await browser.close();
  }
}
