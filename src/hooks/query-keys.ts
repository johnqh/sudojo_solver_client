/**
 * Query Key Factory for Sudojo Solver TanStack Query
 *
 * Provides type-safe, consistent query keys for Solver API endpoints.
 * Following TanStack Query best practices for key structure.
 */

const solverBase = (): readonly ['sudojo-solver'] => ['sudojo-solver'] as const;

export const queryKeys = {
	solver: {
		all: solverBase,

		// Solve endpoint
		solve: (options: {
			original: string;
			user: string;
			autoPencilmarks?: boolean | undefined;
			pencilmarks?: string | undefined;
			filters?: string | undefined;
		}) => [...solverBase(), 'solve', options] as const,

		// Validate endpoint
		validate: (original: string) => [...solverBase(), 'validate', original] as const,

		// Generate endpoint
		generate: (options?: { symmetrical?: boolean | undefined }) =>
			[...solverBase(), 'generate', options] as const,
	},
} as const;

/**
 * Utility type to extract query key from the factory
 */
export type QueryKey = readonly unknown[];

/**
 * Helper function to create a query key for custom endpoints
 */
export const createQueryKey = (
	service: string,
	...parts: (string | number | object)[]
): readonly unknown[] => {
	return [service, ...parts] as const;
};

/**
 * Helper to get all keys for solver service (useful for invalidation)
 */
export const getServiceKeys = (): readonly ['sudojo-solver'] => {
	return queryKeys.solver.all();
};
