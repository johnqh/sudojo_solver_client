# CLAUDE.md

This file provides context for AI assistants working on this codebase.

## Project Overview

`@sudobility/sudojo_solver_client` is a TypeScript client library for the Sudoku Solver API (the C++ engine's REST interface). It provides:
- Typed client for solve, validate, and generate endpoints
- React Query hooks for solver integration
- Type definitions for solver request/response shapes
- DI integration via `@sudobility/di`

## Runtime & Package Manager

**This project uses Bun.** Do not use npm, yarn, or pnpm.

```bash
bun install           # Install dependencies
bun run build         # Build to dist/ (tsc)
bun run test          # Run tests (vitest)
bun run test:run      # Run tests once
bun run test:watch    # Run tests in watch mode
bun run test:coverage # Run tests with coverage
bun run lint          # Run ESLint
bun run lint:fix      # ESLint with auto-fix
bun run typecheck     # Type-check without emitting
bun run format        # Format with Prettier
bun run format:check  # Check formatting
bun run clean         # Remove dist/
bun run check-all     # Run lint + typecheck + tests
```

## Tech Stack

- **Language**: TypeScript (ESM, strict mode)
- **Testing**: Vitest + @testing-library/react + happy-dom
- **Data Fetching**: @tanstack/react-query (peer dep)
- **DI**: @sudobility/di (peer dep)
- **Linting**: ESLint
- **Formatting**: Prettier

## Project Structure

```
src/
├── index.ts                    # Main exports
├── types.ts                    # Solver API types (hints, cells, areas, links)
├── SudojoSolverClient.ts       # HTTP client for solver endpoints
└── hooks/                      # React Query hooks for solver
dist/                           # Build output (git-ignored)
tests/                          # Vitest test files
```

## API Types

The solver returns structured hint data:
- **Areas**: Highlighted rows/columns/blocks with colors
- **Cells**: Individual cell highlights with actions (select, unselect, add, remove)
- **Links**: Connections between cells (for chain techniques)
- **Steps**: Multi-step hint explanation

## Solver Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/solve` | Get next hint for a puzzle state |
| GET | `/api/validate` | Validate puzzle (solution, level, techniques) |
| GET | `/api/generate` | Generate random puzzle |

## Peer Dependencies

- `@sudobility/di` - Dependency injection
- `@sudobility/types` - Common types
- `@tanstack/react-query` >= 5.0.0
- `react` >= 18.0.0

## Code Conventions

- TypeScript strict mode
- ESLint + Prettier
- Export all public APIs from `src/index.ts`
- Use types from `@sudobility/types`

## Common Tasks

### Add New Solver Endpoint
1. Add method to `SudojoSolverClient.ts`
2. Define request/response types in `types.ts`
3. Create React Query hook in `hooks/`
4. Export from `index.ts`
5. Add tests
