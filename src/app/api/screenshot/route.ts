import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import { fileURLToPath } from 'url';
import { takeScreenshot } from '../../../../lib/screenshot';
import { v4 as uuidv4 } from 'uuid';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    const id = uuidv4();
    const outputPath = path.join(__dirname, '../../../../../public/screenshots', `${id}.png`);

    console.log(`Taking screenshot of ${url}...`);
    await takeScreenshot(url, outputPath);

    return NextResponse.json({ id });
  } catch (error) {
    console.error('Error taking screenshot:', error);
    return NextResponse.json(
      { error: 'Failed to take screenshot' },
      { status: 500 }
    );
  }
}