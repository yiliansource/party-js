// just enough of a browser for effects to run: a fake canvas that records nothing, a requestAnimationFrame that only
// fires when a test calls runFrame(), and a switch for the user's reduced motion preference.

const globals = globalThis as Record<string, unknown>;
const STUBBED = [
	"window",
	"document",
	"HTMLElement",
	"matchMedia",
	"ResizeObserver",
	"requestAnimationFrame",
	"cancelAnimationFrame",
	"reportError",
] as const;

export interface FakeBrowser {
	prefersReducedMotion: boolean;
	/**
	 * How many canvases were created.
	 */
	readonly canvasesCreated: number;
	/**
	 * How many particles were drawn, summed over all frames.
	 */
	readonly particlesDrawn: number;
	/**
	 * Errors passed to `reportError`, such as from an effect that threw while running.
	 */
	readonly reportedErrors: unknown[];
	/**
	 * Runs every queued animation frame at the given timestamp (in milliseconds).
	 */
	runFrame(time: number): void;
	/**
	 * Runs frames 16ms apart for the given duration (in milliseconds), starting at 0.
	 */
	runFor(duration: number): void;
	/**
	 * Puts the real globals back.
	 */
	restore(): void;
}

export function stubBrowser(): FakeBrowser {
	const saved = Object.fromEntries(
		STUBBED.map((name) => [name, globals[name]]),
	);
	let frames = new Map<number, (time: number) => void>();
	let nextId = 0;
	let canvasesCreated = 0;
	let particlesDrawn = 0;
	const reportedErrors: unknown[] = [];

	const noop = () => {};
	const ctx = {
		fillStyle: "",
		setTransform: noop,
		clearRect: noop,
		save: noop,
		restore: noop,
		transform: noop,
		fill: () => {
			particlesDrawn++;
		},
	};

	const browser: FakeBrowser = {
		prefersReducedMotion: false,
		get canvasesCreated() {
			return canvasesCreated;
		},
		get particlesDrawn() {
			return particlesDrawn;
		},
		reportedErrors,
		runFrame(time) {
			const queued = frames;
			frames = new Map();
			for (const callback of queued.values()) callback(time);
		},
		runFor(duration) {
			for (let time = 0; time <= duration; time += 16)
				browser.runFrame(time);
		},
		restore() {
			for (const name of STUBBED) globals[name] = saved[name];
		},
	};

	globals.window = {
		devicePixelRatio: 1,
		innerWidth: 800,
		innerHeight: 600,
		scrollX: 0,
		scrollY: 0,
		addEventListener: noop,
		removeEventListener: noop,
	};
	globals.document = {
		createElement: () => {
			canvasesCreated++;
			return {
				style: {},
				clientWidth: 800,
				clientHeight: 600,
				setAttribute: noop,
				getContext: () => ctx,
				remove: noop,
			};
		},
		body: { appendChild: noop },
		addEventListener: noop,
		removeEventListener: noop,
	};
	globals.HTMLElement = class {};
	globals.matchMedia = (query: string) => ({
		matches:
			browser.prefersReducedMotion &&
			query === "(prefers-reduced-motion: reduce)",
	});
	globals.ResizeObserver = class {
		observe() {}
		disconnect() {}
	};
	globals.requestAnimationFrame = (callback: (time: number) => void) => {
		frames.set(++nextId, callback);
		return nextId;
	};
	globals.cancelAnimationFrame = (id: number) => {
		frames.delete(id);
	};
	globals.reportError = (error: unknown) => {
		reportedErrors.push(error);
	};

	return browser;
}
