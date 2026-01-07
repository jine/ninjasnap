interface QueuedTask<T = any> {
  id: string;
  execute: () => Promise<T>;
  resolve: (value: T) => void;
  reject: (error: Error) => void;
  priority: number;
  createdAt: number;
}

/**
 * Queue for managing screenshot processing with concurrency limits
 */
export class ScreenshotQueue {
  private queue: QueuedTask[] = [];
  private processing = new Set<string>();
  private maxConcurrent: number;
  private processingCount = 0;

  constructor(maxConcurrent = 2) {
    this.maxConcurrent = maxConcurrent;
  }

  /**
   * Add a screenshot task to the queue
   */
  async add<T>(
    id: string,
    task: () => Promise<T>,
    priority = 0
  ): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      const queuedTask: QueuedTask<T> = {
        id,
        execute: task,
        resolve,
        reject,
        priority,
        createdAt: Date.now(),
      };

      // Insert based on priority (higher priority first)
      const insertIndex = this.queue.findIndex(
        (task) => task.priority < priority
      );

      if (insertIndex === -1) {
        this.queue.push(queuedTask);
      } else {
        this.queue.splice(insertIndex, 0, queuedTask);
      }

      this.processQueue();
    });
  }

  /**
   * Process the queue
   */
  private async processQueue(): Promise<void> {
    if (this.processingCount >= this.maxConcurrent || this.queue.length === 0) {
      return;
    }

    const task = this.queue.shift();
    if (!task) return;

    this.processingCount++;
    this.processing.add(task.id);

    try {
      const result = await task.execute();
      task.resolve(result);
    } catch (error) {
      task.reject(error as Error);
    } finally {
      this.processingCount--;
      this.processing.delete(task.id);
      // Process next item in queue
      this.processQueue();
    }
  }

  /**
   * Cancel a queued task
   */
  cancel(id: string): boolean {
    const index = this.queue.findIndex((task) => task.id === id);
    if (index !== -1) {
      const task = this.queue[index];
      this.queue.splice(index, 1);
      task.reject(new Error('Task cancelled'));
      return true;
    }
    return false;
  }

  /**
   * Get queue statistics
   */
  getStats() {
    return {
      queued: this.queue.length,
      processing: this.processingCount,
      maxConcurrent: this.maxConcurrent,
      processingIds: Array.from(this.processing),
    };
  }

  /**
   * Clear all queued tasks
   */
  clear(): void {
    const tasks = [...this.queue];
    this.queue = [];

    tasks.forEach((task) => {
      task.reject(new Error('Queue cleared'));
    });
  }
}

// Global screenshot queue instance
export const screenshotQueue = new ScreenshotQueue(2); // Allow 2 concurrent screenshots