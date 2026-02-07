# CLAUDE.md

This file provides context for AI assistants working on this codebase.

## Project Overview

`@sudobility/sudojo_solver_client` is a TypeScript client library for the Sudoku Solver API. It provides typed interfaces and methods for interacting with the solver endpoints.

## Runtime & Package Manager

**This project uses Bun.** Do not use npm, yarn, or pnpm.

```bash
bun install           # Install dependencies
bun run build         # Build to dist/
bun run test          # Run tests (vitest)
bun run test:run      # Run tests once
bun run test:watch    # Run tests in watch mode
bun run lint          # Run ESLint
bun run lint:fix      # Run ESLint with auto-fix
bun run typecheck     # Type-check without emitting
bun run format        # Format with Prettier
bun run format:check  # Check formatting
bun run clean         # Remove dist/
```

## Tech Stack

- **Language**: TypeScript
- **Testing**: Vitest
- **Linting**: ESLint
- **Formatting**: Prettier

## Project Structure

```
src/
  index.ts            # Main exports and client implementation
dist/                 # Build output
tests/                # Test files
```

## Code Conventions

- TypeScript strict mode
- ESLint for code quality
- Prettier for formatting
- Vitest for testing
- Export types and client functions from index.ts
