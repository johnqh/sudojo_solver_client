import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import type { NetworkClient, NetworkResponse } from '@sudobility/types';
import {
	SudojoSolverClient,
	SudojoApiError,
	ErrorCode,
	type SolveResponse,
	type ValidateResponse,
	type GenerateResponse,
} from '../src';

// Create mock NetworkClient
const createMockNetworkClient = (): NetworkClient & { get: Mock } => ({
	request: vi.fn(),
	get: vi.fn(),
	post: vi.fn(),
	put: vi.fn(),
	delete: vi.fn(),
});

describe('SudojoSolverClient', () => {
	let mockNetworkClient: NetworkClient & { get: Mock };
	let client: SudojoSolverClient;

	const samplePuzzle =
		'040002008100400000080000140070105000508000602000209030069000070000006004700500090';
	const sampleUser =
		'000000000000000000000000000000000000000000000000000000000000000000000000000000000';
	const sampleSolution =
		'345672918126489753789351246237145869518763492694298137462918375951836724873524691';

	beforeEach(() => {
		mockNetworkClient = createMockNetworkClient();
		client = new SudojoSolverClient(mockNetworkClient, { baseUrl: 'http://localhost:5000' });
	});

	describe('constructor', () => {
		it('should remove trailing slashes from baseUrl', async () => {
			const client1 = new SudojoSolverClient(mockNetworkClient, {
				baseUrl: 'http://localhost:5000/',
			});
			const client2 = new SudojoSolverClient(mockNetworkClient, {
				baseUrl: 'http://localhost:5000///',
			});

			const mockResponse: NetworkResponse<ValidateResponse> = {
				ok: true,
				status: 200,
				statusText: 'OK',
				headers: {},
				data: { success: true, error: null, data: null },
			};
			mockNetworkClient.get.mockResolvedValue(mockResponse);

			await client1.validate({ original: samplePuzzle });
			expect(mockNetworkClient.get).toHaveBeenCalledWith(
				expect.stringContaining('http://localhost:5000/api/validate'),
				expect.any(Object)
			);

			mockNetworkClient.get.mockClear();
			await client2.validate({ original: samplePuzzle });
			expect(mockNetworkClient.get).toHaveBeenCalledWith(
				expect.stringContaining('http://localhost:5000/api/validate'),
				expect.any(Object)
			);
		});
	});

	describe('solve', () => {
		it('should call the solve endpoint with correct parameters', async () => {
			const mockResponse: NetworkResponse<SolveResponse> = {
				ok: true,
				status: 200,
				statusText: 'OK',
				headers: {},
				data: {
					success: true,
					error: null,
					data: {
						board: {
							level: 0,
							techniques: 0,
							board: {
								original: samplePuzzle,
								user: sampleUser,
								solution: null,
								pencilmarks: { auto: true, pencilmarks: '' },
							},
						},
						hints: {
							level: 3,
							techniques: 4,
							steps: [
								{
									title: 'Hidden Single',
									text: 'The number 5 can only go in one place in row 1',
									areas: [{ type: 'row', color: 'blue', index: 0 }],
									cells: [
										{
											row: 0,
											column: 5,
											color: 'green',
											fill: false,
											actions: {
												select: '5',
												unselect: '',
												add: '',
												remove: '',
												highlight: '',
											},
										},
									],
								},
							],
						},
					},
				},
			};

			mockNetworkClient.get.mockResolvedValueOnce(mockResponse);

			const result = await client.solve({
				original: samplePuzzle,
				user: sampleUser,
				autoPencilmarks: true,
			});

			expect(mockNetworkClient.get).toHaveBeenCalledTimes(1);
			const [url] = mockNetworkClient.get.mock.calls[0] as [string, unknown];
			expect(url).toContain('/api/solve');
			expect(url).toContain(`original=${samplePuzzle}`);
			expect(url).toContain(`user=${sampleUser}`);
			expect(url).toContain('autopencilmarks=true');

			expect(result.success).toBe(true);
			expect(result.data?.hints?.steps).toHaveLength(1);
			expect(result.data?.hints?.steps[0]?.title).toBe('Hidden Single');
		});

		it('should handle solve error response', async () => {
			const mockResponse: NetworkResponse<SolveResponse> = {
				ok: true,
				status: 200,
				statusText: 'OK',
				headers: {},
				data: {
					success: false,
					error: {
						code: ErrorCode.CannotSolve,
						message: 'Cannot solve this Sudoku puzzle',
					},
					data: null,
				},
			};

			mockNetworkClient.get.mockResolvedValueOnce(mockResponse);

			const result = await client.solve({
				original: samplePuzzle,
				user: sampleUser,
			});

			expect(result.success).toBe(false);
			expect(result.error?.code).toBe(ErrorCode.CannotSolve);
		});

		it('should include optional parameters when provided', async () => {
			const mockResponse: NetworkResponse<SolveResponse> = {
				ok: true,
				status: 200,
				statusText: 'OK',
				headers: {},
				data: { success: true, error: null, data: null },
			};
			mockNetworkClient.get.mockResolvedValueOnce(mockResponse);

			await client.solve({
				original: samplePuzzle,
				user: sampleUser,
				autoPencilmarks: false,
				pencilmarks: '123,456,789',
				filters: 'test',
			});

			const [url] = mockNetworkClient.get.mock.calls[0] as [string, unknown];
			expect(url).toContain('autopencilmarks=false');
			expect(url).toContain('pencilmarks=123%2C456%2C789');
			expect(url).toContain('filters=test');
		});
	});

	describe('validate', () => {
		it('should call the validate endpoint with correct parameters', async () => {
			const mockResponse: NetworkResponse<ValidateResponse> = {
				ok: true,
				status: 200,
				statusText: 'OK',
				headers: {},
				data: {
					success: true,
					error: null,
					data: {
						board: {
							level: 5,
							techniques: 31,
							board: {
								original: samplePuzzle,
								user: null,
								solution: sampleSolution,
								pencilmarks: null,
							},
						},
					},
				},
			};

			mockNetworkClient.get.mockResolvedValueOnce(mockResponse);

			const result = await client.validate({ original: samplePuzzle });

			expect(mockNetworkClient.get).toHaveBeenCalledTimes(1);
			const [url] = mockNetworkClient.get.mock.calls[0] as [string, unknown];
			expect(url).toContain('/api/validate');
			expect(url).toContain(`original=${samplePuzzle}`);

			expect(result.success).toBe(true);
			expect(result.data?.board.board.solution).toBe(sampleSolution);
			expect(result.data?.board.level).toBe(5);
		});

		it('should handle invalid puzzle (no solution)', async () => {
			const mockResponse: NetworkResponse<ValidateResponse> = {
				ok: true,
				status: 200,
				statusText: 'OK',
				headers: {},
				data: {
					success: false,
					error: {
						code: ErrorCode.CannotSolve,
						message: 'Invalid Sudoku puzzle',
					},
					data: null,
				},
			};

			mockNetworkClient.get.mockResolvedValueOnce(mockResponse);

			const result = await client.validate({ original: samplePuzzle });

			expect(result.success).toBe(false);
			expect(result.error?.code).toBe(ErrorCode.CannotSolve);
		});

		it('should handle puzzle with multiple solutions', async () => {
			const mockResponse: NetworkResponse<ValidateResponse> = {
				ok: true,
				status: 200,
				statusText: 'OK',
				headers: {},
				data: {
					success: false,
					error: {
						code: ErrorCode.MultipleSolutions,
						message: 'Multiple possible solutions',
					},
					data: null,
				},
			};

			mockNetworkClient.get.mockResolvedValueOnce(mockResponse);

			const result = await client.validate({ original: samplePuzzle });

			expect(result.success).toBe(false);
			expect(result.error?.code).toBe(ErrorCode.MultipleSolutions);
		});
	});

	describe('generate', () => {
		it('should call the generate endpoint with symmetrical=true', async () => {
			const mockResponse: NetworkResponse<GenerateResponse> = {
				ok: true,
				status: 200,
				statusText: 'OK',
				headers: {},
				data: {
					success: true,
					error: null,
					data: {
						board: {
							level: 5,
							techniques: 31,
							board: {
								original: samplePuzzle,
								user: null,
								solution: sampleSolution,
								pencilmarks: null,
							},
						},
					},
				},
			};

			mockNetworkClient.get.mockResolvedValueOnce(mockResponse);

			const result = await client.generate({ symmetrical: true });

			expect(mockNetworkClient.get).toHaveBeenCalledTimes(1);
			const [url] = mockNetworkClient.get.mock.calls[0] as [string, unknown];
			expect(url).toContain('/api/generate');
			expect(url).toContain('symmetrical=true');

			expect(result.success).toBe(true);
			expect(result.data?.board.board.original).toBe(samplePuzzle);
			expect(result.data?.board.board.solution).toBe(sampleSolution);
		});

		it('should call generate without symmetrical parameter by default', async () => {
			const mockResponse: NetworkResponse<GenerateResponse> = {
				ok: true,
				status: 200,
				statusText: 'OK',
				headers: {},
				data: { success: true, error: null, data: null },
			};
			mockNetworkClient.get.mockResolvedValueOnce(mockResponse);

			await client.generate();

			const [url] = mockNetworkClient.get.mock.calls[0] as [string, unknown];
			expect(url).toContain('/api/generate');
			expect(url).not.toContain('symmetrical');
		});

		it('should call generate with symmetrical=false when specified', async () => {
			const mockResponse: NetworkResponse<GenerateResponse> = {
				ok: true,
				status: 200,
				statusText: 'OK',
				headers: {},
				data: { success: true, error: null, data: null },
			};
			mockNetworkClient.get.mockResolvedValueOnce(mockResponse);

			await client.generate({ symmetrical: false });

			const [url] = mockNetworkClient.get.mock.calls[0] as [string, unknown];
			expect(url).toContain('symmetrical=false');
		});
	});

	describe('error handling', () => {
		it('should throw SudojoApiError on non-OK response', async () => {
			const mockResponse: NetworkResponse<unknown> = {
				ok: false,
				status: 500,
				statusText: 'Internal Server Error',
				headers: {},
				data: { error: 'Internal Server Error' },
			};

			mockNetworkClient.get.mockResolvedValueOnce(mockResponse);

			await expect(client.validate({ original: samplePuzzle })).rejects.toThrow(
				SudojoApiError
			);
		});

		it('should include status code in SudojoApiError', async () => {
			const mockResponse: NetworkResponse<unknown> = {
				ok: false,
				status: 404,
				statusText: 'Not Found',
				headers: {},
				data: { message: 'Not found' },
			};

			mockNetworkClient.get.mockResolvedValueOnce(mockResponse);

			try {
				await client.validate({ original: samplePuzzle });
				expect.fail('Expected error to be thrown');
			} catch (error) {
				expect(error).toBeInstanceOf(SudojoApiError);
				expect((error as SudojoApiError).statusCode).toBe(404);
			}
		});

		it('should throw error when no data received', async () => {
			const mockResponse: NetworkResponse<unknown> = {
				ok: true,
				status: 200,
				statusText: 'OK',
				headers: {},
				data: undefined,
			};

			mockNetworkClient.get.mockResolvedValueOnce(mockResponse);

			await expect(client.validate({ original: samplePuzzle })).rejects.toThrow(
				'No data received from server'
			);
		});

		it('should re-throw network errors', async () => {
			const networkError = new Error('Network error');
			mockNetworkClient.get.mockRejectedValueOnce(networkError);

			await expect(client.validate({ original: samplePuzzle })).rejects.toThrow(
				'Network error'
			);
		});
	});

	describe('request headers', () => {
		it('should send correct headers', async () => {
			const mockResponse: NetworkResponse<ValidateResponse> = {
				ok: true,
				status: 200,
				statusText: 'OK',
				headers: {},
				data: { success: true, error: null, data: null },
			};
			mockNetworkClient.get.mockResolvedValueOnce(mockResponse);

			await client.validate({ original: samplePuzzle });

			const [, options] = mockNetworkClient.get.mock.calls[0] as [
				string,
				{ headers: Record<string, string> },
			];
			expect(options.headers).toEqual({
				'Content-Type': 'application/json',
				Accept: 'application/json',
			});
		});
	});
});

describe('Type exports', () => {
	it('should export ErrorCode enum correctly', () => {
		const errorCode: typeof ErrorCode.CannotSolve = ErrorCode.CannotSolve;
		expect(errorCode).toBe('cannot_solve');
	});
});
