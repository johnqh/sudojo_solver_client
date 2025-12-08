import { describe, it, expect } from 'vitest';
import {
	ErrorCode,
	type Area,
	type AreaType,
	type Board,
	type Cell,
	type CellActions,
	type CellColor,
	type ClientConfig,
	type ErrorPayload,
	type GenerateOptions,
	type HintStep,
	type Pencilmark,
	type SolveOptions,
	type ValidateOptions,
} from '../src';

describe('Types', () => {
	describe('AreaType', () => {
		it('should accept valid area types', () => {
			const row: AreaType = 'row';
			const column: AreaType = 'column';
			const block: AreaType = 'block';

			expect(row).toBe('row');
			expect(column).toBe('column');
			expect(block).toBe('block');
		});
	});

	describe('CellColor', () => {
		it('should accept valid colors', () => {
			const colors: CellColor[] = [
				'none',
				'clear',
				'gray',
				'blue',
				'green',
				'yellow',
				'orange',
				'red',
				'white',
				'black',
			];

			expect(colors).toHaveLength(10);
		});
	});

	describe('ErrorCode', () => {
		it('should have correct enum values', () => {
			expect(ErrorCode.Unknown).toBe('unknown_error');
			expect(ErrorCode.AutoPencilmarksRequired).toBe('auto_pencilmarks_required');
			expect(ErrorCode.CannotSolve).toBe('cannot_solve');
			expect(ErrorCode.MultipleSolutions).toBe('multiple_solutions');
		});
	});

	describe('Area', () => {
		it('should allow creating valid Area objects', () => {
			const area: Area = {
				type: 'row',
				color: 'blue',
				index: 0,
			};

			expect(area.type).toBe('row');
			expect(area.color).toBe('blue');
			expect(area.index).toBe(0);
		});
	});

	describe('CellActions', () => {
		it('should allow creating valid CellActions objects', () => {
			const actions: CellActions = {
				select: '5',
				unselect: '',
				add: '123',
				remove: '456',
				highlight: '789',
			};

			expect(actions.select).toBe('5');
			expect(actions.add).toBe('123');
		});
	});

	describe('Cell', () => {
		it('should allow creating valid Cell objects', () => {
			const cell: Cell = {
				row: 0,
				column: 5,
				color: 'green',
				fill: true,
				actions: {
					select: '5',
					unselect: '',
					add: '',
					remove: '',
					highlight: '',
				},
			};

			expect(cell.row).toBe(0);
			expect(cell.column).toBe(5);
			expect(cell.fill).toBe(true);
		});
	});

	describe('Pencilmark', () => {
		it('should allow creating valid Pencilmark objects', () => {
			const pencilmark: Pencilmark = {
				auto: true,
				pencilmarks: '123,456,789',
			};

			expect(pencilmark.auto).toBe(true);
			expect(pencilmark.pencilmarks).toBe('123,456,789');
		});
	});

	describe('Board', () => {
		it('should allow creating valid Board objects', () => {
			const board: Board = {
				original:
					'040002008100400000080000140070105000508000602000209030069000070000006004700500090',
				user: null,
				solution:
					'345672918126489753789351246237145869518763492694298137462918375951836724873524691',
				pencilmarks: null,
			};

			expect(board.original).toHaveLength(81);
			expect(board.solution).toHaveLength(81);
			expect(board.user).toBeNull();
		});

		it('should allow pencilmarks to be set', () => {
			const board: Board = {
				original:
					'040002008100400000080000140070105000508000602000209030069000070000006004700500090',
				user: '000000000000000000000000000000000000000000000000000000000000000000000000000000000',
				solution: null,
				pencilmarks: {
					auto: true,
					pencilmarks: '123,,,,,,,,,',
				},
			};

			expect(board.pencilmarks?.auto).toBe(true);
		});
	});

	describe('HintStep', () => {
		it('should allow creating valid HintStep objects', () => {
			const step: HintStep = {
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
			};

			expect(step.title).toBe('Hidden Single');
			expect(step.areas).toHaveLength(1);
			expect(step.cells).toHaveLength(1);
		});

		it('should allow null areas and cells', () => {
			const step: HintStep = {
				title: 'Pencilmarks',
				text: 'Turn on auto pencilmarks to continue.',
				areas: null,
				cells: null,
			};

			expect(step.areas).toBeNull();
			expect(step.cells).toBeNull();
		});
	});

	describe('ErrorPayload', () => {
		it('should allow creating valid ErrorPayload objects', () => {
			const error: ErrorPayload = {
				code: ErrorCode.CannotSolve,
				message: 'Cannot solve this Sudoku puzzle',
			};

			expect(error.code).toBe(ErrorCode.CannotSolve);
			expect(error.message).toBe('Cannot solve this Sudoku puzzle');
		});
	});

	describe('SolveOptions', () => {
		it('should require original and user', () => {
			const options: SolveOptions = {
				original:
					'040002008100400000080000140070105000508000602000209030069000070000006004700500090',
				user: '000000000000000000000000000000000000000000000000000000000000000000000000000000000',
			};

			expect(options.original).toHaveLength(81);
			expect(options.user).toHaveLength(81);
		});

		it('should allow optional parameters', () => {
			const options: SolveOptions = {
				original:
					'040002008100400000080000140070105000508000602000209030069000070000006004700500090',
				user: '000000000000000000000000000000000000000000000000000000000000000000000000000000000',
				autoPencilmarks: true,
				pencilmarks: '123,456,789',
				filters: 'test',
			};

			expect(options.autoPencilmarks).toBe(true);
			expect(options.pencilmarks).toBe('123,456,789');
			expect(options.filters).toBe('test');
		});
	});

	describe('ValidateOptions', () => {
		it('should require original', () => {
			const options: ValidateOptions = {
				original:
					'040002008100400000080000140070105000508000602000209030069000070000006004700500090',
			};

			expect(options.original).toHaveLength(81);
		});
	});

	describe('GenerateOptions', () => {
		it('should allow empty options', () => {
			const options: GenerateOptions = {};

			expect(options.symmetrical).toBeUndefined();
		});

		it('should allow symmetrical option', () => {
			const options: GenerateOptions = {
				symmetrical: true,
			};

			expect(options.symmetrical).toBe(true);
		});
	});

	describe('ClientConfig', () => {
		it('should require baseUrl', () => {
			const config: ClientConfig = {
				baseUrl: 'http://localhost:5000',
			};

			expect(config.baseUrl).toBe('http://localhost:5000');
		});

		it('should allow optional timeout', () => {
			const config: ClientConfig = {
				baseUrl: 'http://localhost:5000',
				timeout: 5000,
			};

			expect(config.timeout).toBe(5000);
		});
	});
});
