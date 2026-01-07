import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const screenshotsDir = path.join(process.cwd(), 'public', 'screenshots');

    console.log('Reading screenshots from:', screenshotsDir);

    // Ensure directory exists
    if (!fs.existsSync(screenshotsDir)) {
      console.log('Screenshots directory does not exist:', screenshotsDir);
      return NextResponse.json([]);
    }

    const allFiles = fs.readdirSync(screenshotsDir);
    console.log('All files in directory:', allFiles);

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

    console.log(
      'Screenshots found:',
      files.length,
      files.map((f) => f.id),
    );

    return NextResponse.json(files);
  } catch (error) {
    console.error('Error reading screenshots:', error);
    return NextResponse.json(
      { error: 'Failed to read screenshots' },
      { status: 500 },
    );
  }
}
