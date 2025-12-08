/**
 * Sudojo Solver React Hooks
 *
 * TanStack Query hooks for the Solver API
 */

// Query utilities
export { createQueryKey, getServiceKeys, queryKeys } from './query-keys';
export type { QueryKey } from './query-keys';

// Query configuration
export { STALE_TIMES } from './query-config';

// React hooks
export { useSolverGenerate, useSolverSolve, useSolverValidate } from './use-solver';
