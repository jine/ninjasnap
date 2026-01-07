import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { logger } from '../../../lib/logger';

export async function GET() {
  try {
    const screenshotsDir = path.join(process.cwd(), 'public', 'screenshots');

    logger.debug('Reading screenshots from: ' + screenshotsDir);

    // Ensure directory exists
    if (!fs.existsSync(screenshotsDir)) {
      logger.warn('Screenshots directory does not exist: ' + screenshotsDir);
      return NextResponse.json([]);
    }

    const allFiles = fs.readdirSync(screenshotsDir);
    logger.debug('All files in directory: ' + allFiles.join(', '));

    const files = allFiles
      .filter((file) => file.endsWith('.png'))
      .map((file) => {
        const filePath = path.join(screenshotsDir, file);
        const stats = fs.statSync(filePath);
        return {
          id: file.replace('.png', ''),
          url: `/screenshots/${file}`,
          createdAt: stats.mtime.toISOString(),
        };
      })
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      ); // Newest first

    logger.info(
      'Screenshots found: ' +
        files.length +
        ' [' +
        files.map((f) => f.id).join(', ') +
        ']',
    );

    return NextResponse.json(files);
  } catch (error) {
    logger.error('Error reading screenshots', error as Error);
    return NextResponse.json(
      { error: 'Failed to read screenshots' },
      { status: 500 },
    );
  }
}
