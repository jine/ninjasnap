import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';
import { EnhancedScreenshotRequestSchema } from '../../../lib/validation';
import { config } from '../../../lib/config';
import { logger, generateCorrelationId } from '../../../lib/logger';
import {
  createErrorResponse,
  createSuccessResponse,
  ErrorCode,
  HttpStatus,
} from '../../../lib/api-response';
import { screenshotQueue } from '../../../lib/screenshot-queue';
import { performanceMonitor } from '../../../lib/performance-monitor';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Simple in-memory rate limiting (for demo - use Redis in production)
const rateLimit = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const userLimit = rateLimit.get(ip);

  if (!userLimit || now > userLimit.resetTime) {
    rateLimit.set(ip, {
      count: 1,
      resetTime: now + config.RATE_LIMIT_WINDOW_MS,
    });
    return true;
  }

  if (userLimit.count >= config.RATE_LIMIT_MAX) {
    return false;
  }

  userLimit.count++;
  return true;
}

export async function POST(request: NextRequest) {
  const correlationId = generateCorrelationId();
  const requestLogger = logger.withCorrelationId(correlationId);
  const startTime = Date.now();

  // Rate limiting
  const ip =
    request.headers.get('x-forwarded-for') ||
    request.headers.get('x-real-ip') ||
    'unknown';

  requestLogger.info('Screenshot request received', {
    ip,
    url: request.url,
  });

  if (!checkRateLimit(ip)) {
    requestLogger.warn('Rate limit exceeded', { ip });
    const { response, status } = createErrorResponse(
      ErrorCode.RATE_LIMIT_EXCEEDED,
      'Rate limit exceeded. Try again later.',
      HttpStatus.TOO_MANY_REQUESTS,
      undefined,
      correlationId,
    );
    return NextResponse.json(response, { status });
  }

  try {
    const body = await request.json();
    const validatedData = EnhancedScreenshotRequestSchema.parse(body);

    const {
      url,
      resolution = '1280x720',
      userAgent,
      enableAdblock = false,
    } = validatedData;

    const id = uuidv4();
    const outputPath = path.join(
      __dirname,
      '../../../../../public/screenshots',
      `${id}.png`,
    );

    requestLogger.info('Adding screenshot to queue', {
      url,
      resolution,
      userAgent,
      enableAdblock,
      screenshotId: id,
    });

    // Add to queue with priority based on user type (could be enhanced)
    const queueStartTime = Date.now();
    await screenshotQueue.add(id, async () => {
      const screenshotStartTime = Date.now();
      const queueWaitTime = screenshotStartTime - queueStartTime;

      try {
        const { takeScreenshot } = await import('../../../../lib/screenshot');

        const screenshotOptions: any = {
          resolution,
          enableAdblock,
          timeout: config.SCREENSHOT_TIMEOUT,
        };
        if (userAgent) {
          screenshotOptions.userAgent = userAgent;
        }

        await takeScreenshot(url, outputPath, screenshotOptions);

        const duration = Date.now() - screenshotStartTime;
        performanceMonitor.recordScreenshot({
          duration,
          resolution,
          userAgent,
          success: true,
          queueWaitTime,
        });

        return id;
      } catch (error) {
        const duration = Date.now() - screenshotStartTime;
        performanceMonitor.recordScreenshot({
          duration,
          resolution,
          userAgent,
          success: false,
          queueWaitTime,
          error: (error as Error).message,
        });
        throw error;
      }
    });

    const duration = Date.now() - startTime;
    requestLogger.info('Screenshot completed successfully', {
      screenshotId: id,
      duration,
    });

    const { response, status } = createSuccessResponse({ id });
    return NextResponse.json(response, { status });
  } catch (error) {
    const duration = Date.now() - startTime;

    if (error instanceof z.ZodError) {
      requestLogger.error('Validation error', error, {
        validationErrors: error.issues,
        duration,
      });
      const { response, status } = createErrorResponse(
        ErrorCode.VALIDATION_ERROR,
        error.issues[0]?.message || 'Invalid input',
        HttpStatus.BAD_REQUEST,
        { validationErrors: error.issues },
        correlationId,
      );
      return NextResponse.json(response, { status });
    }

    requestLogger.error('Screenshot capture failed', error as Error, {
      duration,
    });
    requestLogger.error('Screenshot capture failed', error as Error, {
      duration,
    });
    const { response, status } = createErrorResponse(
      ErrorCode.SCREENSHOT_FAILED,
      'Failed to take screenshot',
      HttpStatus.INTERNAL_SERVER_ERROR,
      undefined,
      correlationId,
    );
    return NextResponse.json(response, { status });
  }
}
