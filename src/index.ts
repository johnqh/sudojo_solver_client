/**
 * Sudojo Solver Client
 *
 * TypeScript client for the Sudoku Solver REST API
 *
 * @packageDocumentation
 */

// Main client exports
export { createSudojoSolverClient, SudojoApiError, SudojoSolverClient } from './SudojoSolverClient';

// React hooks
export {
	// Query utilities
	createQueryKey,
	getServiceKeys,
	queryKeys,
	STALE_TIMES,
	// Hooks
	useSolverGenerate,
	useSolverSolve,
	useSolverValidate,
} from './hooks';
export type { QueryKey } from './hooks';

// Export enum as value (can be used at runtime)
export { ErrorCode } from './types';

// Type exports
export type {
	// Configuration
	ClientConfig,
	// Request options
	GenerateOptions,
	SolveOptions,
	ValidateOptions,
	// Response types
	GenerateResponse,
	SolveResponse,
	SudokuResult,
	ValidateResponse,
	// Data types
	Area,
	AreaType,
	Board,
	BoardDataPayload,
	BoardPayload,
	Cell,
	CellActions,
	CellColor,
	ErrorPayload,
	HintDataPayload,
	HintStep,
	HintsPayload,
	Pencilmark,
} from './types';
