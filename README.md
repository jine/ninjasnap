# 🥷 NinjaSnap

A stealthy web screenshot tool with ninja-like precision, built with Next.js, React, TypeScript, and Tailwind CSS. Take undetectable screenshots of any website through a dark, ninja-themed interface.

## Features

- 🥷 Dark ninja-themed UI with emerald accents
- Web interface to submit URLs and capture screenshots
- **Resolution Selection**: Choose from 6 common resolutions (1920x1080 to mobile sizes)
- **User Agent Customization**: Select from 7 predefined browser UAs with smart auto-switching
- **Adblock Option**: Enable uBlock Origin for cleaner screenshots
- Unique links for each screenshot result
- Uses puppeteer-extra with stealth plugin for undetectable browsing
- Built with Next.js 13+ app router and TypeScript
- Dockerized for easy deployment
- Optimized performance with resource blocking and 30s timeout
- Modern 2026 best practices

## Tech Stack

- **Frontend**: Next.js, React, Tailwind CSS (dark ninja theme)
- **Backend**: Next.js API routes
- **Browser Automation**: Puppeteer with stealth plugin 🥷
- **Styling**: Tailwind CSS with custom ninja color scheme
- **Language**: TypeScript
- **Containerization**: Docker

## Installation

1. Clone the NinjaSnap repository
2. Install dependencies: `npm install`

## Usage

### Local Development

```bash
# Run the development server
npm run dev
# Open http://localhost:3000
```

### Using Docker

```bash
# Build and run with Docker Compose
docker-compose up --build
# Access at http://localhost:3000
```

### Production

```bash
# Build for production
npm run build
npm start
```

## How It Works

1. Visit the ninja-themed web interface 🥷
2. Enter a URL to stealthily screenshot
3. Submit the form (client-side React)
4. API route processes the request using Puppeteer with stealth
5. Get redirected to a unique page displaying your captured screenshot

## API Routes

- `POST /api/screenshot`: Takes a screenshot with customizable options and returns a unique ID
  - Parameters: `url` (required), `resolution`, `userAgent`, `enableAdblock`
- `GET /screenshot/[id]`: Displays the screenshot by ID

## Development

```bash
# Run linting
npm run lint

# Format code
npm run format

# Run tests
npm test
```

## Docker

NinjaSnap runs in a multi-stage Docker build with Node.js Alpine and Chromium. Screenshots are stored in `public/screenshots/` and served statically through the ninja-themed interface.

## Project Structure

```
├── lib/
│   └── screenshot.ts          # Screenshot utility with Puppeteer
├── public/
│   └── screenshots/           # Stored screenshots
├── src/
│   └── app/
│       ├── api/
│       │   └── screenshot/
│       │       └── route.ts   # API route for taking screenshots
│       ├── layout.tsx         # Root layout
│       ├── page.tsx           # Home page with form
│       ├── globals.css        # Global styles with Tailwind
│       └── screenshot/
│           └── [id]/
│               └── page.tsx   # Screenshot display page
├── Dockerfile                 # Multi-stage Docker build
└── docker-compose.yml         # Docker Compose setup
```

## License

ISC