import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ScreenshotRequestSchema = z.object({
  url: z.string().url(),
  resolution: z
    .enum([
      '1920x1080',
      '1366x768',
      '1280x720',
      '1024x768',
      '768x1024',
      '375x667',
    ])
    .optional(),
  userAgent: z
    .enum([
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0',
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_1) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Safari/605.1.15',
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Edg/120.0.0.0',
      'Mozilla/5.0 (iPhone; CPU iPhone OS 17_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Mobile/15E148 Safari/604.1',
      'Mozilla/5.0 (Linux; Android 10; SM-G973F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36',
      'Mozilla/5.0 (Linux; Android 10; SM-G973F) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/18.0 Chrome/120.0.0.0 Mobile Safari/537.36',
    ])
    .optional(),
  enableAdblock: z.boolean().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = ScreenshotRequestSchema.parse(body);

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

    console.log(`Taking screenshot of ${url} with resolution ${resolution}...`);
    const { takeScreenshot } = await import('../../../../lib/screenshot');

    await takeScreenshot(url, outputPath, {
      resolution,
      userAgent,
      enableAdblock,
    } as any);

    return NextResponse.json({ id });
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('Validation error:', error.issues);
      return NextResponse.json(
        {
          error: error.issues[0]?.message || 'Invalid input',
          details: error.issues,
        },
        { status: 400 },
      );
    }

    console.error('Error taking screenshot:', error);
    return NextResponse.json(
      { error: 'Failed to take screenshot' },
      { status: 500 },
    );
  }
}
