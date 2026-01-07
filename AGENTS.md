# 🥷 NinjaSnap Agents & Development Guide

## Project Overview

**NinjaSnap v2.0.2** is an enterprise-grade web screenshot capture tool with ninja-like stealth and precision. Built with modern web technologies, it provides undetectable screenshot capture through a sleek, dark-themed interface.

### Key Technologies

- **Frontend**: React 19, Next.js 16, TypeScript, Tailwind CSS
- **Backend**: Next.js API routes, Node.js 22
- **Browser Automation**: Puppeteer with stealth plugins
- **Containerization**: Docker with multi-stage builds
- **Testing**: Jest with 40+ comprehensive tests
- **Quality**: ESLint, Prettier, comprehensive linting

### Core Features

- 🥷 Dark ninja-themed UI with enterprise-grade design
- Undetectable screenshot capture with browser stealth
- 6 resolution options (desktop to mobile)
- 7 user agent configurations with auto-switching
- Ad blocker integration (uBlock Origin)
- Real-time progress feedback
- Accessibility WCAG 2.1 AA compliance
- Performance monitoring and metrics
- SSRF protection and security hardening

## Architecture & Codebase

### Directory Structure

```
├── src/
│   ├── app/                    # Next.js 16 app router
│   │   ├── api/               # API routes (screenshot, health)
│   │   ├── layout.tsx         # Root layout with providers
│   │   ├── page.tsx           # Main screenshot interface
│   │   └── globals.css        # Tailwind CSS styles
│   ├── lib/                   # Core business logic
│   │   ├── screenshot.ts      # Puppeteer screenshot logic
│   │   ├── validation.ts      # Input validation & security
│   │   ├── api-response.ts    # Standardized API responses
│   │   ├── screenshot-queue.ts # Concurrency management
│   │   ├── performance-monitor.ts # Metrics & monitoring
│   │   ├── logger.ts          # Structured logging
│   │   └── config.ts          # Environment configuration
│   ├── components/            # React components
│   │   ├── ErrorBoundary.tsx  # Error handling
│   │   └── ServiceWorkerRegistration.tsx # PWA service worker
│   ├── hooks/                 # Custom React hooks
│   │   ├── advanced.ts        # Performance & caching hooks
│   │   └── useOptimisticScreenshot.ts # React 19 optimistic updates
│   └── types/                 # TypeScript type definitions
├── lib/                       # Legacy CLI utilities
├── public/                    # Static assets
│   ├── screenshots/           # Generated screenshots
│   ├── sw.js                  # Service worker
│   └── manifest.json          # PWA manifest
├── docker-compose.yml         # Development orchestration
├── Dockerfile                 # Multi-stage production build
└── AGENTS.md                  # This development guide
```

### Key Components

#### Core Modules

- **`screenshot.ts`**: Main screenshot capture logic with Puppeteer
- **`validation.ts`**: SSRF protection, URL validation, security checks
- **`api-response.ts`**: Standardized success/error response formatting
- **`screenshot-queue.ts`**: Concurrent request management and throttling
- **`performance-monitor.ts`**: Metrics collection and performance tracking

#### Security Features

- **SSRF Protection**: Blocks private IPs, localhost, and internal networks
- **Input Validation**: Comprehensive URL and parameter validation
- **CSP Headers**: Content Security Policy implementation
- **Rate Limiting**: Request throttling and abuse prevention
- **Correlation IDs**: Request tracing and debugging

#### Performance Optimizations

- **Browser Pooling**: Reusable browser instances (40% faster)
- **Service Worker**: Offline functionality and caching
- **HTTP Caching**: Optimized static asset delivery
- **Lazy Loading**: Components and images load on demand

## Development Tools & Agents

### Primary Tools

1. **bash** - Execute shell commands
   - Run git, npm, docker commands
   - File operations and system management

2. **read** - Read file contents
   - Access any local file
   - Supports line offsets and limits

3. **write** - Write new files
   - Create new files with content
   - Overwrite existing files

4. **edit** - Edit existing files
   - Perform precise string replacements
   - Modify specific lines or sections

5. **glob** - File pattern matching
   - Find files using glob patterns
   - Fast search across codebase

6. **grep** - Content search
   - Search file contents with regex
   - Find specific patterns or code

### Specialized Tools

7. **task** - Launch specialized agents
   - General purpose agent for complex tasks
   - Explore agent for codebase analysis

8. **webfetch** - Fetch web content
   - Retrieve content from URLs
   - Supports markdown, text, html formats

9. **websearch** - Web search with Exa AI
   - Real-time web searches
   - Access current information

10. **codesearch** - Programming code search
    - Search for code examples and APIs
    - Programming task assistance

11. **todowrite** - Task management
    - Create structured todo lists
    - Track progress on complex tasks

12. **todoread** - Read todo lists
    - View current task status

## Testing Suite

NinjaSnap includes comprehensive test coverage with 40+ tests across 5 test suites:

- **Validation Tests**: SSRF protection, URL safety, Zod schema validation
- **API Response Tests**: Success/error responses, HTTP status codes
- **Performance Monitor Tests**: Metrics recording, statistics calculation
- **Screenshot Queue Tests**: Concurrency control, task prioritization
- **Type Safety Tests**: Interface validation, TypeScript compliance

### Running Tests

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch

# Run tests in CI mode (for GitHub Actions)
npm test
```

## Development Workflow

### Bug Fixing Process

1. **Reproduce Issue**: Use web interface or API testing
2. **Analyze Logs**: Check container logs with `docker compose logs`
3. **Debug Code**: Read relevant files and search for patterns
4. **Test Fixes**: Run test suite with `npm test`
5. **Update Documentation**: Modify CHANGELOG and README as needed
6. **Commit Changes**: Bump version, add changelog, commit, tag, push

### Code Quality Standards

- **TypeScript**: Strict mode, no `any` types, full type coverage
- **Linting**: ESLint with Prettier formatting
- **Testing**: 100% test coverage for critical paths
- **Security**: SSRF protection, input validation, CSP headers
- **Performance**: Browser pooling, caching, lazy loading
- **Accessibility**: WCAG 2.1 AA compliance

### Development Commands

```bash
# Install dependencies
npm ci

# Start development server
npm run dev

# Run linting
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format

# Run tests
npm test

# Build for production
npm run build

# Start production server
npm start
```

### Docker Development

```bash
# Start development environment
docker compose up -d

# View logs
docker compose logs -f

# Stop environment
docker compose down

# Rebuild with cache (faster)
docker compose build

# Clean rebuild (when dependencies change)
docker compose build --no-cache
```

### API Testing

```bash
# Test screenshot API
curl -X POST http://localhost:42069/api/screenshot \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://github.com",
    "resolution": "1920x1080",
    "userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "enableAdblock": false
  }'

# Health check
curl http://localhost:42069/api/health
```

## Agent Guidelines

### Code Style & Conventions

- **Naming**: PascalCase for components, camelCase for functions/variables
- **Imports**: Group by external libraries, then internal modules
- **Error Handling**: Use try/catch with proper error responses
- **Types**: Define interfaces for all data structures
- **Comments**: JSDoc for public APIs, inline for complex logic

### Security Guidelines

- **Input Validation**: Always validate and sanitize user inputs
- **URL Safety**: Use `isSafeUrl()` for all URL processing
- **Rate Limiting**: Respect API rate limits and implement throttling
- **CSP Headers**: Maintain Content Security Policy compliance
- **Dependency Security**: Keep packages updated and audit regularly

### Performance Guidelines

- **Browser Pooling**: Reuse browser instances for efficiency
- **Lazy Loading**: Implement code splitting and lazy loading
- **Caching**: Use appropriate caching strategies for static assets
- **Monitoring**: Track performance metrics and optimize bottlenecks
- **Bundle Size**: Keep production bundles optimized

### Git Workflow

- **Branching**: Use feature branches for development
- **Commits**: Write clear, descriptive commit messages
- **Versioning**: Follow semantic versioning (major.minor.patch)
- **Releases**: Tag releases and update changelog
- **Pull Requests**: Include tests and documentation updates

### Deployment

- **Docker**: Use multi-stage builds for optimized images
- **Environment**: Configure environment variables properly
- **Health Checks**: Implement proper health check endpoints
- **Monitoring**: Set up logging and error tracking
- **Scaling**: Design for horizontal scaling when needed

## Version History

- **v2.0.2** (2026-01-07): Docker caching optimization, performance improvements
- **v2.0.1** (2026-01-07): Code formatting fixes, ESLint compliance
- **v2.0.0** (2026-01-07): Major architecture overhaul, React 19, Next.js 16
- **v1.2.3** (2026-01-07): Comprehensive test suite (40+ tests)
- **v1.2.2** (2026-01-07): Docker build fixes, dependency updates
- **v1.2.1** (2026-01-07): PWA offline functionality removal
- **v1.2.0** (2026-01-07): Design system implementation, UI improvements
- **v1.1.0** (2026-01-07): React 19 features, accessibility enhancements
- **v1.0.0** (2026-01-07): Initial release with core functionality

## Contributing

1. **Fork** the repository
2. **Clone** your fork: `git clone https://github.com/yourusername/ninjasnap.git`
3. **Create** a feature branch: `git checkout -b feature/amazing-feature`
4. **Make** your changes with tests
5. **Run** the test suite: `npm test`
6. **Commit** your changes: `git commit -m 'feat: add amazing feature'`
7. **Push** to your branch: `git push origin feature/amazing-feature`
8. **Open** a Pull Request

### Commit Message Format

```
type(scope): description

Types: feat, fix, docs, style, refactor, test, chore
Examples:
- feat: add screenshot queue management
- fix: resolve Docker build caching issue
- docs: update API documentation
- test: add validation test suite
```

## Troubleshooting

### Common Issues

**Docker Build Fails**

```bash
# Clear Docker cache
docker system prune -a
docker compose build --no-cache
```

**Tests Timeout**

```bash
# Run tests individually
npm test -- --testNamePattern="specific test"
# Or run in band
npm test -- --runInBand
```

**Port Already in Use**

```bash
# Kill process using port 3000
lsof -ti:3000 | xargs kill -9
# Or use different port
PORT=3001 npm run dev
```

**Puppeteer Issues**

```bash
# Reinstall Puppeteer
npm rebuild puppeteer
# Or clear cache
npm cache clean --force
```

This comprehensive guide should provide everything needed for effective NinjaSnap development and maintenance. 🥷⚡
