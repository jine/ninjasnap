# NinjaSnap Agents Documentation

This document outlines the available tools and agents for NinjaSnap development and debugging.

## Available Tools

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

## Development Workflow

### Bug Fixing Process

1. **Reproduce Issue**: Use web interface or API testing
2. **Analyze Logs**: Check container logs with `docker compose logs`
3. **Debug Code**: Read relevant files and search for patterns
4. **Test Fixes**: Rebuild and restart containers
5. **Update Documentation**: Modify CHANGELOG and README as needed
6. **Commit Changes**: Bump version, add changelog, commit, tag, push

### Common Debugging Commands

```bash
# Check container status
docker compose ps

# View logs
docker compose logs -f

# Test API (use github.com for testing as example.com may cause issues)
curl -X POST http://localhost:42069/api/screenshot \
  -H "Content-Type: application/json" \
  -d '{"url":"https://github.com","resolution":"1280x720","userAgent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36","enableAdblock":false}'

# Rebuild and restart (use cache for faster builds)
docker compose down && docker compose build && docker compose up -d

# For clean rebuilds (when dependencies change), use --no-cache
docker compose down && docker compose build --no-cache && docker compose up -d
```

## Agent Guidelines

- Always git pull before starting work
- Use detached mode for docker compose up (-d)
- Test fixes thoroughly before committing
- Update version and changelog for releases
- Push all changes after fixes
