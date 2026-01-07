# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Initial setup with TypeScript, Puppeteer, and development tools (ESLint, Prettier, Jest)
- Docker containerization with Chromium for screenshot functionality
- Puppeteer-extra with stealth plugin for undetectable browsing

### Changed
- Refactored from CLI tool to Express web server
- Migrated to Next.js with React and Tailwind CSS
- Updated Docker configuration for Next.js standalone build

### Fixed
- TypeScript configuration for modern ES modules and React
- Build and linting issues during refactoring

## [1.0.0] - 2026-01-07

### Added
- Basic screenshot functionality using Puppeteer and Chromium
- CLI interface for taking screenshots
- Project initialization with npm and TypeScript
- Basic testing and linting setup

### Technical
- Node.js 18+ support
- ES modules throughout
- Docker support with Alpine Linux and Chromium