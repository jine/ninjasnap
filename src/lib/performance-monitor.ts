interface PerformanceMetric {
  name: string;
  value: number;
  timestamp: number;
  tags?: Record<string, string>;
}

interface ScreenshotMetrics {
  duration: number;
  resolution: string;
  userAgent?: string;
  success: boolean;
  queueWaitTime?: number;
  error?: string;
}

/**
 * Performance monitoring utility for screenshot operations
 */
export class PerformanceMonitor {
  private metrics: PerformanceMetric[] = [];
  private maxMetrics = 1000; // Keep last 1000 metrics

  /**
   * Record a performance metric
   */
  record(name: string, value: number, tags?: Record<string, string>): void {
    const metric: PerformanceMetric = {
      name,
      value,
      timestamp: Date.now(),
      tags,
    };

    this.metrics.push(metric);

    // Keep only recent metrics
    if (this.metrics.length > this.maxMetrics) {
      this.metrics = this.metrics.slice(-this.maxMetrics);
    }

    // Log significant metrics
    if (value > 10000) { // Log operations taking more than 10 seconds
      console.warn(`Performance: ${name} took ${value}ms`, tags);
    }
  }

  /**
   * Record screenshot operation metrics
   */
  recordScreenshot(metrics: ScreenshotMetrics): void {
    const tags = {
      resolution: metrics.resolution,
      userAgent: metrics.userAgent || 'default',
      success: metrics.success.toString(),
    };

    this.record('screenshot.duration', metrics.duration, tags);

    if (metrics.queueWaitTime !== undefined) {
      this.record('screenshot.queue_wait', metrics.queueWaitTime, tags);
    }

    if (!metrics.success && metrics.error) {
      this.record('screenshot.error', 1, { ...tags, error: metrics.error });
    }
  }

  /**
   * Get performance statistics
   */
  getStats(timeRange = 3600000): { // Last hour by default
    averageDuration: number;
    totalOperations: number;
    successRate: number;
    p95Duration: number;
    errorRate: number;
  } {
    const now = Date.now();
    const recentMetrics = this.metrics.filter(m => now - m.timestamp < timeRange);

    const screenshotDurations = recentMetrics
      .filter(m => m.name === 'screenshot.duration')
      .map(m => m.value)
      .sort((a, b) => a - b);

    const totalOperations = screenshotDurations.length;
    const successfulOperations = recentMetrics.filter(
      m => m.name === 'screenshot.duration' && m.tags?.success === 'true'
    ).length;

    const averageDuration = totalOperations > 0
      ? screenshotDurations.reduce((sum, duration) => sum + duration, 0) / totalOperations
      : 0;

    const p95Index = Math.floor(screenshotDurations.length * 0.95);
    const p95Duration = screenshotDurations[p95Index] || 0;

    const errorCount = recentMetrics.filter(m => m.name === 'screenshot.error').length;
    const errorRate = totalOperations > 0 ? (errorCount / totalOperations) * 100 : 0;
    const successRate = totalOperations > 0 ? (successfulOperations / totalOperations) * 100 : 0;

    return {
      averageDuration,
      totalOperations,
      successRate,
      p95Duration,
      errorRate,
    };
  }

  /**
   * Get recent metrics for debugging
   */
  getRecentMetrics(limit = 50): PerformanceMetric[] {
    return this.metrics.slice(-limit);
  }

  /**
   * Clear all metrics
   */
  clear(): void {
    this.metrics = [];
  }
}

// Global performance monitor instance
export const performanceMonitor = new PerformanceMonitor();