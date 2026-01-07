import { describe, it, expect, beforeEach } from '@jest/globals';
import { ScreenshotQueue } from './screenshot-queue';

describe('ScreenshotQueue', () => {
  let queue: ScreenshotQueue;

  beforeEach(() => {
    queue = new ScreenshotQueue(2); // Max 2 concurrent
  });

  describe('constructor', () => {
    it('should create queue with specified concurrency limit', () => {
      const customQueue = new ScreenshotQueue(5);
      expect(customQueue).toBeInstanceOf(ScreenshotQueue);
    });
  });

  describe('add', () => {
    it('should add and execute tasks', async () => {
      const mockTask = jest.fn().mockResolvedValue('result');
      const result = await queue.add('task1', mockTask);

      expect(result).toBe('result');
      expect(mockTask).toHaveBeenCalledTimes(1);
    });

    it('should handle task errors', async () => {
      const error = new Error('Task failed');
      const mockTask = jest.fn().mockRejectedValue(error);

      await expect(queue.add('failing-task', mockTask)).rejects.toThrow(
        'Task failed',
      );
    });

    it('should limit concurrent execution', async () => {
      let running = 0;
      let maxRunning = 0;

      const createTask = (id: string, delay: number) => async () => {
        running++;
        maxRunning = Math.max(maxRunning, running);
        await new Promise((resolve) => setTimeout(resolve, delay));
        running--;
        return id;
      };

      const promises = [
        queue.add('task1', createTask('task1', 50)),
        queue.add('task2', createTask('task2', 50)),
        queue.add('task3', createTask('task3', 10)),
      ];

      const results = await Promise.all(promises);

      expect(results.sort()).toEqual(['task1', 'task2', 'task3']);
      expect(maxRunning).toBe(2); // Should not exceed concurrency limit
    });
  });

  describe('cancel', () => {
    it('should return false for non-existent tasks', () => {
      const cancelled = queue.cancel('non-existent');
      expect(cancelled).toBe(false);
    });
  });

  describe('getStats', () => {
    it('should return queue statistics', () => {
      const stats = queue.getStats();

      expect(stats).toEqual({
        queued: 0,
        processing: 0,
        maxConcurrent: 2,
        processingIds: [],
      });
    });
  });

  describe('clear', () => {
    it('should clear the queue', () => {
      queue.clear();
      const stats = queue.getStats();
      expect(stats.queued).toBe(0);
    });
  });
});
