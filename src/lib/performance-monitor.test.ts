import { describe, it, expect, beforeEach } from '@jest/globals';
import { PerformanceMonitor } from './performance-monitor';

describe('PerformanceMonitor', () => {
  let monitor: PerformanceMonitor;

  beforeEach(() => {
    monitor = new PerformanceMonitor();
  });

  describe('record', () => {
    it('should record a metric with name and value', () => {
      monitor.record('test.metric', 100, { success: 'true' });

      const recentMetrics = monitor.getRecentMetrics();
      const metric = recentMetrics.find((m) => m.name === 'test.metric');
      expect(metric).toBeDefined();
      expect(metric?.value).toBe(100);
      expect(metric?.tags?.success).toBe('true');
    });

    it('should record metrics without tags', () => {
      monitor.record('simple.metric', 42);

      const recentMetrics = monitor.getRecentMetrics();
      const metric = recentMetrics.find((m) => m.name === 'simple.metric');
      expect(metric?.tags).toBeUndefined();
    });
  });

  describe('recordScreenshot', () => {
    it('should record screenshot metrics', () => {
      const screenshotMetrics = {
        duration: 1500,
        resolution: '1920x1080',
        userAgent: 'Chrome',
        success: true,
        queueWaitTime: 100,
      };

      monitor.recordScreenshot(screenshotMetrics);

      const recentMetrics = monitor.getRecentMetrics();
      const durationMetric = recentMetrics.find(
        (m) => m.name === 'screenshot.duration',
      );
      const queueMetric = recentMetrics.find(
        (m) => m.name === 'screenshot.queue_wait',
      );

      expect(durationMetric).toBeDefined();
      expect(durationMetric!.value).toBe(1500);
      expect(durationMetric!.tags!.resolution).toBe('1920x1080');
      expect(durationMetric!.tags!.userAgent).toBe('Chrome');
      expect(durationMetric!.tags!.success).toBe('true');

      expect(queueMetric).toBeDefined();
      expect(queueMetric!.value).toBe(100);
    });

    it('should record error metrics when screenshot fails', () => {
      const failedMetrics = {
        duration: 500,
        resolution: '1920x1080',
        success: false,
        error: 'Timeout',
      };

      monitor.recordScreenshot(failedMetrics);

      const recentMetrics = monitor.getRecentMetrics();
      const errorMetric = recentMetrics.find(
        (m) => m.name === 'screenshot.error',
      );

      expect(errorMetric?.value).toBe(1); // Error count
      expect(errorMetric?.tags?.error).toBe('Timeout');
    });
  });

  describe('getStats', () => {
    it('should return performance statistics', () => {
      // Record some test metrics
      monitor.record('screenshot.duration', 1000, { success: 'true' });
      monitor.record('screenshot.duration', 2000, { success: 'true' });
      monitor.record('screenshot.duration', 1500, { success: 'false' });
      monitor.record('screenshot.error', 1, { error: 'timeout' });

      const stats = monitor.getStats();

      expect(stats.totalOperations).toBe(3);
      expect(stats.successRate).toBe(66.66666666666666); // 2/3 * 100
      expect(stats.errorRate).toBe(33.33333333333333); // 1/3 * 100
      expect(stats.averageDuration).toBe(1500); // (1000 + 2000 + 1500) / 3
    });

    it('should handle empty metrics gracefully', () => {
      const stats = monitor.getStats();

      expect(stats.totalOperations).toBe(0);
      expect(stats.averageDuration).toBe(0);
      expect(stats.successRate).toBe(0);
      expect(stats.errorRate).toBe(0);
      expect(stats.p95Duration).toBe(0);
    });
  });

  describe('getRecentMetrics', () => {
    it('should return recent metrics with default limit', () => {
      monitor.record('test1', 100);
      monitor.record('test2', 200);
      monitor.record('test3', 300);

      const metrics = monitor.getRecentMetrics();

      expect(metrics).toHaveLength(3);
      expect(metrics[0]?.value).toBe(100); // Oldest first
      expect(metrics[2]?.value).toBe(300); // Most recent last
    });

    it('should respect limit parameter', () => {
      for (let i = 0; i < 10; i++) {
        monitor.record(`metric${i}`, i * 100);
      }

      const metrics = monitor.getRecentMetrics(5);
      expect(metrics).toHaveLength(5);
      expect(metrics[0]?.value).toBe(500); // Oldest in recent batch (5 * 100)
      expect(metrics[4]?.value).toBe(900); // Most recent (9 * 100)
    });
  });

  describe('clear', () => {
    it('should clear all metrics', () => {
      monitor.record('test1', 100);
      monitor.record('test2', 200);

      expect(monitor.getRecentMetrics()).toHaveLength(2);

      monitor.clear();

      expect(monitor.getRecentMetrics()).toHaveLength(0);
    });
  });
});
