import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import { fileURLToPath } from 'url';
import { takeScreenshot } from '../../../../lib/screenshot';
import { v4 as uuidv4 } from 'uuid';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ALLOWED_RESOLUTIONS = [
  '1920x1080',
  '1366x768',
  '1280x720',
  '1024x768',
  '768x1024',
  '375x667'
];

const ALLOWED_USER_AGENTS = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_1) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Safari/605.1.15',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Edg/120.0.0.0',
  'Mozilla/5.0 (iPhone; CPU iPhone OS 17_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Mobile/15E148 Safari/604.1',
  'Mozilla/5.0 (Linux; Android 10; SM-G973F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36',
  'Mozilla/5.0 (Linux; Android 10; SM-G973F) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/18.0 Chrome/120.0.0.0 Mobile Safari/537.36'
];

export async function POST(request: NextRequest) {
  try {
    const { url, resolution = '1280x720', userAgent, enableAdblock = false } = await request.json();

    // Sanitize inputs
    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    if (!ALLOWED_RESOLUTIONS.includes(resolution)) {
      return NextResponse.json({ error: 'Invalid resolution' }, { status: 400 });
    }

    if (userAgent && !ALLOWED_USER_AGENTS.includes(userAgent)) {
      return NextResponse.json({ error: 'Invalid user agent' }, { status: 400 });
    }

    if (typeof enableAdblock !== 'boolean') {
      return NextResponse.json({ error: 'Invalid adblock setting' }, { status: 400 });
    }

    const id = uuidv4();
    const outputPath = path.join(__dirname, '../../../../../public/screenshots', `${id}.png`);

    console.log(`Taking screenshot of ${url} with resolution ${resolution}...`);
    await takeScreenshot(url, outputPath, { resolution, userAgent, enableAdblock });

    return NextResponse.json({ id });
  } catch (error) {
    console.error('Error taking screenshot:', error);
    return NextResponse.json(
      { error: 'Failed to take screenshot' },
      { status: 500 }
    );
  }
}