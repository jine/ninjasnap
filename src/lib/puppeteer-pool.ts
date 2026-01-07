import puppeteer from 'puppeteer-extra';
import { Browser } from 'puppeteer';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';

interface PooledBrowser {
  browser: Browser;
  lastUsed: number;
  inUse: boolean;
}

export class PuppeteerPool {
  private pool: PooledBrowser[] = [];
  private maxPoolSize: number;
  private browserTimeout: number;
  private cleanupInterval: NodeJS.Timeout | null = null;

  constructor(maxPoolSize = 3, browserTimeout = 300000) { // 5 minutes default
    this.maxPoolSize = maxPoolSize;
    this.browserTimeout = browserTimeout;
    this.startCleanupInterval();
  }

  /**
   * Acquire a browser instance from the pool
   */
  async acquire(): Promise<Browser> {
    // Try to find an available browser
    let pooledBrowser = this.pool.find(b => !b.inUse);

    if (pooledBrowser) {
      pooledBrowser.inUse = true;
      pooledBrowser.lastUsed = Date.now();
      return pooledBrowser.browser;
    }

    // If pool is not full, create a new browser
    if (this.pool.length < this.maxPoolSize) {
      const browser = await this.createBrowser();
      pooledBrowser = {
        browser,
        lastUsed: Date.now(),
        inUse: true,
      };
      this.pool.push(pooledBrowser);
      return browser;
    }

    // Wait for an available browser (simple implementation)
    return new Promise((resolve, reject) => {
      const checkAvailable = () => {
        const available = this.pool.find(b => !b.inUse);
        if (available) {
          available.inUse = true;
          available.lastUsed = Date.now();
          resolve(available.browser);
        } else if (Date.now() - startTime > 10000) { // 10 second timeout
          reject(new Error('No browser available in pool'));
        } else {
          setTimeout(checkAvailable, 100);
        }
      };

      const startTime = Date.now();
      checkAvailable();
    });
  }

  /**
   * Release a browser instance back to the pool
   */
  async release(browser: Browser): Promise<void> {
    const pooledBrowser = this.pool.find(b => b.browser === browser);
    if (pooledBrowser) {
      pooledBrowser.inUse = false;
      pooledBrowser.lastUsed = Date.now();
    }
  }

  /**
   * Create a new browser instance
   */
  private async createBrowser(): Promise<Browser> {
    puppeteer.use(StealthPlugin());

    const launchArgs = [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--no-first-run',
      '--no-zygote',
      '--single-process', // for Docker
      '--disable-gpu',
      '--disable-web-security', // Allow cross-origin requests
      '--disable-features=VizDisplayCompositor',
    ];

    return await puppeteer.launch({
      headless: true,
      args: launchArgs,
      timeout: 60000, // 60 second launch timeout
    });
  }

  /**
   * Close all browsers in the pool
   */
  async closeAll(): Promise<void> {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
    }

    await Promise.all(
      this.pool.map(async (pooledBrowser) => {
        try {
          await pooledBrowser.browser.close();
        } catch (error) {
          console.error('Error closing browser:', error);
        }
      })
    );

    this.pool = [];
  }

  /**
   * Get pool statistics
   */
  getStats() {
    return {
      total: this.pool.length,
      inUse: this.pool.filter(b => b.inUse).length,
      available: this.pool.filter(b => !b.inUse).length,
    };
  }

  /**
   * Start cleanup interval to remove idle browsers
   */
  private startCleanupInterval(): void {
    this.cleanupInterval = setInterval(() => {
      const now = Date.now();
      this.pool = this.pool.filter(async (pooledBrowser) => {
        if (!pooledBrowser.inUse && now - pooledBrowser.lastUsed > this.browserTimeout) {
          try {
            await pooledBrowser.browser.close();
            return false; // Remove from pool
          } catch (error) {
            console.error('Error closing idle browser:', error);
          }
        }
        return true; // Keep in pool
      });
    }, 60000); // Check every minute
  }
}

// Global pool instance
export const puppeteerPool = new PuppeteerPool();

// Graceful shutdown
if (typeof process !== 'undefined') {
  process.on('SIGINT', async () => {
    console.log('Shutting down Puppeteer pool...');
    await puppeteerPool.closeAll();
    process.exit(0);
  });

  process.on('SIGTERM', async () => {
    console.log('Shutting down Puppeteer pool...');
    await puppeteerPool.closeAll();
    process.exit(0);
  });
}