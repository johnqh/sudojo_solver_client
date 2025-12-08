/**
 * Sudoku Solver API Types
 *
 * These types match the response structure from the Sudoku Solver REST API.
 */

/**
 * Area type for highlighting regions on the board
 */
export type AreaType = 'row' | 'column' | 'block';

/**
 * Color used for highlighting cells and areas
 */
export type CellColor =
	| 'none'
	| 'clear'
	| 'gray'
	| 'blue'
	| 'green'
	| 'yellow'
	| 'orange'
	| 'red'
	| 'white'
	| 'black';

/**
 * Error codes returned by the API
 */
export enum ErrorCode {
	Unknown = 'unknown_error',
	AutoPencilmarksRequired = 'auto_pencilmarks_required',
	CannotSolve = 'cannot_solve',
	MultipleSolutions = 'multiple_solutions',
}

/**
 * Highlighted area (row, column, or block) in a hint
 */
export interface Area {
	/** Type of area: row, column, or block */
	type: AreaType;
	/** Color to highlight the area */
	color: CellColor;
	/** Index of the area (0-8) */
	index: number;
}

/**
 * Actions to perform on a cell's candidates/value
 */
export interface CellActions {
	/** Digit to select as the cell's value (1-9) */
	select: string;
	/** Digit that is wrong and should be unselected */
	unselect: string;
	/** Digits to add as pencilmarks */
	add: string;
	/** Digits to remove from pencilmarks */
	remove: string;
	/** Digits to highlight in pencilmarks */
	highlight: string;
}

/**
 * Cell display information in a hint
 */
export interface Cell {
	/** Row index (0-8) */
	row: number;
	/** Column index (0-8) */
	column: number;
	/** Color to highlight the cell */
	color: CellColor;
	/** Whether to fill the cell with a value */
	fill: boolean;
	/** Actions to perform on this cell */
	actions: CellActions;
}

/**
 * Pencilmark data for the board
 */
export interface Pencilmark {
	/** Whether auto-pencilmarks are enabled */
	auto: boolean;
	/** Comma-separated string of 81 pencilmark entries */
	pencilmarks: string;
}

/**
 * Board state
 */
export interface Board {
	/** 81-character puzzle string (0 = empty, 1-9 = filled) */
	original: string;
	/** 81-character user input string (null if not applicable) */
	user: string | null;
	/** 81-character solution string (null if not computed) */
	solution: string | null;
	/** Pencilmark data (null if not applicable) */
	pencilmarks: Pencilmark | null;
}

/**
 * Board payload with difficulty information
 */
export interface BoardPayload {
	/** Difficulty level of the puzzle (1-12) */
	level: number;
	/** Bitmask of techniques used/required */
	techniques: number;
	/** Board state */
	board: Board;
}

/**
 * A single hint step with explanation and highlights
 */
export interface HintStep {
	/** Name of the solving technique */
	title: string;
	/** Explanation of the hint */
	text: string;
	/** Areas to highlight (rows, columns, blocks) */
	areas: Area[] | null;
	/** Cells to highlight with actions */
	cells: Cell[] | null;
}

/**
 * Hints payload containing multiple hint steps
 */
export interface HintsPayload {
	/** Difficulty level */
	level: number;
	/** Techniques bitmask */
	techniques: number;
	/** Array of hint steps */
	steps: HintStep[];
}

/**
 * Error payload returned when an operation fails
 */
export interface ErrorPayload {
	/** Error code */
	code: ErrorCode;
	/** Human-readable error message */
	message: string;
}

/**
 * Data payload for board-only responses (validate, generate)
 */
export interface BoardDataPayload {
	/** Board information */
	board: BoardPayload;
}

/**
 * Data payload for hint responses
 */
export interface HintDataPayload extends BoardDataPayload {
	/** Hints (null if not applicable) */
	hints: HintsPayload | null;
}

/**
 * Base API response structure
 */
export interface SudokuResult<T extends BoardDataPayload = BoardDataPayload> {
	/** Whether the operation succeeded */
	success: boolean;
	/** Error information (null if success) */
	error: ErrorPayload | null;
	/** Response data (null if error) */
	data: T | null;
}

/**
 * Response type for solve endpoint
 */
export type SolveResponse = SudokuResult<HintDataPayload>;

/**
 * Response type for validate endpoint
 */
export type ValidateResponse = SudokuResult<BoardDataPayload>;

/**
 * Response type for generate endpoint
 */
export type GenerateResponse = SudokuResult<BoardDataPayload>;

/**
 * Options for the solve API call
 */
export interface SolveOptions {
	/** 81-character puzzle string */
	original: string;
	/** 81-character user input string */
	user: string;
	/** Whether auto-pencilmarks are enabled */
	autoPencilmarks?: boolean;
	/** Comma-separated pencilmarks string */
	pencilmarks?: string;
	/** Optional technique filters */
	filters?: string;
}

/**
 * Options for the validate API call
 */
export interface ValidateOptions {
	/** 81-character puzzle string */
	original: string;
}

/**
 * Options for the generate API call
 */
export interface GenerateOptions {
	/** Whether to generate a symmetrical puzzle */
	symmetrical?: boolean;
}

/**
 * Client configuration options
 */
export interface ClientConfig {
	/** Base URL of the API (e.g., "http://localhost:5000") */
	baseUrl: string;
	/** Request timeout in milliseconds */
	timeout?: number;
}
