# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0-beta] - 2026-01-07

### Added
- Initial setup with TypeScript, Puppeteer, and development tools (ESLint, Prettier, Jest)
- Docker containerization with Chromium for screenshot functionality
- Puppeteer-extra with stealth plugin for undetectable browsing
- React frontend with Next.js and Tailwind CSS
- Web interface for submitting URLs and viewing screenshots
- Unique link generation for screenshot sharing

### Changed
- Refactored from CLI tool to Express web server
- Migrated to Next.js with React and Tailwind CSS
- Updated Docker configuration for Next.js standalone build

### Fixed
- TypeScript configuration for modern ES modules and React
- Build and linting issues during refactoring

### Technical
- Node.js 18+ support
- ES modules throughout
- Docker support with Alpine Linux and Chromium

## [Unreleased]