# Contributing to Exa Search Agent

Thanks for your interest in contributing! 🎉

## Getting Started

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/YOUR_USERNAME/exa-search-agent.git
   cd exa-search-agent
   ```
3. Install dependencies:
   ```bash
   bun install
   ```
4. Create a `.env` file with your Exa API key:
   ```bash
   cp .env.example .env
   # Add your key to .env
   ```

## Development

```bash
# Run in development mode
bun run dev <command>

# Type check
bun run typecheck

# Build
bun run build
```

## Making Changes

1. Create a new branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```
2. Make your changes
3. Test your changes:
   ```bash
   bun run dev search "test query"
   ```
4. Commit with a descriptive message:
   ```bash
   git commit -m "feat: add new feature"
   ```
5. Push and create a Pull Request

## Commit Convention

We use [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `chore:` Maintenance tasks
- `refactor:` Code refactoring
- `test:` Adding tests

## Code Style

- Use TypeScript
- Use ES modules (`import`/`export`)
- Add types for all function parameters and returns
- Keep functions focused and small

## Questions?

Open an issue or start a discussion. We're happy to help!
