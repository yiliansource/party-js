export interface FixedTimestepOptions {
	fixedDt: number;
	maxStepsPerAdvance?: number;
	onStep: (fixedDt: number) => void;
}

export interface FixedTimestepLoop {
	advance(elapsedSeconds: number): number;
}

export function createFixedTimestepLoop(
	options: FixedTimestepOptions,
): FixedTimestepLoop {
	const maxSteps = options.maxStepsPerAdvance ?? 8;
	let accumulator = 0;

	return {
		advance(elapsedSeconds) {
			accumulator += elapsedSeconds;
			let steps = 0;
			while (accumulator >= options.fixedDt && steps < maxSteps) {
				options.onStep(options.fixedDt);
				accumulator -= options.fixedDt;
				steps++;
			}
			if (steps === maxSteps) {
				accumulator = 0;
			}
			return steps;
		},
	};
}
