# NinjaSnap Changelog

All notable changes to NinjaSnap will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-01-07

### Added
- **🔒 Phase 1: Critical Security & Type Safety Improvements**
- Comprehensive Content Security Policy (CSP) headers with security policies
- Enhanced input validation blocking localhost and private IP ranges (SSRF protection)
- Structured JSON logging with correlation IDs for request tracing
- React error boundaries with graceful error handling and user-friendly UI
- Standardized API error responses with proper HTTP status codes
- Type-safe environment configuration with Zod validation
- Complete removal of `any` types with strict TypeScript interfaces
- Discriminated unions for user agents and screenshot resolutions
- Security headers (X-Frame-Options, X-Content-Type-Options, X-XSS-Protection, etc.)

### Security
- SSRF attack prevention through URL validation
- Private network access blocking (localhost, 10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16)
- CSP implementation preventing XSS attacks
- Rate limiting with configurable thresholds
- Input sanitization for all user-provided data

### Technical
- Enterprise-grade error handling and logging infrastructure
- Type-safe configuration management with environment validation
- Correlation ID tracking for distributed debugging
- Production-ready error boundaries and fallback UI
- Comprehensive type definitions for all modules

## [1.0.0-beta] - 2026-01-07

### Added
- Initial NinjaSnap setup with TypeScript, Puppeteer, and development tools (ESLint, Prettier, Jest)
- Docker containerization with Chromium for stealthy screenshot functionality
- Puppeteer-extra with stealth plugin for undetectable browsing 🥷
- Dark ninja-themed React frontend with Next.js and Tailwind CSS
- Web interface for submitting URLs and viewing screenshots
- Unique link generation for screenshot sharing
- **Resolution selection** with 6 predefined options (desktop to mobile)
- **User agent customization** with 7 browser options and auto-switching for mobile
- **Adblock option** with uBlock Origin integration
- Input sanitization and 30-second timeout for security and performance

### Changed
- Renamed project to NinjaSnap with ninja-themed branding
- Refactored from CLI tool to Express web server
- Migrated to Next.js with React and dark Tailwind CSS theme
- Updated Docker configuration for Next.js standalone build

### Fixed
- TypeScript configuration for modern ES modules and React
- Build and linting issues during refactoring

### Technical
- Node.js 18+ support
- ES modules throughout
- Docker support with Alpine Linux and Chromium

## [Unreleased]