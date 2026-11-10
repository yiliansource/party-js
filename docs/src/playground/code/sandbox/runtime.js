(() => {
	const host = window.parent;
	const send = (message) => host.postMessage(message, "*");

	const files = new Map();
	let codeUrl = "";

	const target = document.createElement("button");
	target.type = "button";
	target.id = "target";
	target.tabIndex = -1;
	target.setAttribute("aria-hidden", "true");
	document.body.append(target);

	let resolveLoaded;
	// resolves to the module's `run` export, or `undefined` if it has none or failed to load.
	const loaded = new Promise((resolve) => {
		resolveLoaded = resolve;
	});

	function escapeRegExp(text) {
		return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
	}

	/**
	 * Replaces blob URLs with file names and drops the frames of this runtime.
	 */
	function cleanStack(stack) {
		let cleaned = stack
			.split("\n")
			.filter((line) => !line.includes("about:srcdoc"))
			.join("\n");
		for (const [url, name] of files) {
			cleaned = cleaned.replace(new RegExp(escapeRegExp(url), "g"), name);
		}
		return cleaned;
	}

	/**
	 * Finds the first position in the user's code that a stack trace points to.
	 */
	function locate(stack) {
		if (!stack || !codeUrl) return undefined;
		const match = new RegExp(`${escapeRegExp(codeUrl)}:(\\d+):(\\d+)`).exec(
			stack,
		);
		if (!match) return undefined;
		return { line: Number(match[1]), column: Number(match[2]) };
	}

	const MAX_ITEMS = 20;
	const MAX_DEPTH = 3;

	/**
	 * Formats a value for the console, roughly like the browser's devtools do.
	 */
	function inspect(value, depth = 0, seen = new Set()) {
		if (typeof value === "string")
			return depth === 0 ? value : JSON.stringify(value);
		if (typeof value === "function")
			return `ƒ ${value.name || "anonymous"}()`;
		if (typeof value === "bigint") return `${value}n`;
		if (typeof value !== "object" || value === null) return String(value);
		if (value instanceof Error)
			return value.stack
				? cleanStack(value.stack)
				: `${value.name}: ${value.message}`;
		if (value instanceof Element) {
			const id = value.id ? `#${value.id}` : "";
			const classes = [...value.classList]
				.map((name) => `.${name}`)
				.join("");
			return `<${value.localName}${id}${classes}>`;
		}
		if (seen.has(value)) return "[Circular]";
		if (depth >= MAX_DEPTH) return Array.isArray(value) ? "[…]" : "{…}";

		seen.add(value);
		const items = (entries, total) => {
			const shown = entries.slice(0, MAX_ITEMS);
			if (total > MAX_ITEMS) shown.push(`… ${total - MAX_ITEMS} more`);
			return shown.join(", ");
		};
		const next = (item) => inspect(item, depth + 1, seen);

		let text;
		if (Array.isArray(value)) {
			text = `[${items(value.slice(0, MAX_ITEMS).map(next), value.length)}]`;
		} else if (value instanceof Map) {
			const entries = [...value].slice(0, MAX_ITEMS);
			text = `Map(${value.size}) {${items(
				entries.map(([key, item]) => `${next(key)} => ${next(item)}`),
				value.size,
			)}}`;
		} else if (value instanceof Set) {
			const entries = [...value].slice(0, MAX_ITEMS);
			text = `Set(${value.size}) {${items(entries.map(next), value.size)}}`;
		} else {
			const keys = Object.keys(value);
			const name = value.constructor?.name;
			const prefix = name && name !== "Object" ? `${name} ` : "";
			const entries = keys
				.slice(0, MAX_ITEMS)
				.map((key) => `${key}: ${next(value[key])}`);
			text =
				keys.length === 0
					? `${prefix}{}`
					: `${prefix}{ ${items(entries, keys.length)} }`;
		}
		seen.delete(value);
		return text;
	}

	function format(args) {
		return args.map((arg) => inspect(arg)).join(" ");
	}

	for (const level of ["log", "info", "warn", "error", "debug"]) {
		const original = console[level].bind(console);
		console[level] = (...args) => {
			original(...args);
			send({
				type: "log",
				level,
				text: format(args),
				location: locate(new Error().stack),
			});
		};
	}

	function reportError(error) {
		if (error instanceof Error) {
			send({
				type: "error",
				text: error.stack
					? cleanStack(error.stack)
					: `${error.name}: ${error.message}`,
				location: locate(error.stack),
			});
		} else {
			send({ type: "error", text: `Uncaught ${inspect(error, 1)}` });
		}
	}

	window.addEventListener("error", (event) => {
		reportError(event.error ?? event.message);
	});
	window.addEventListener("unhandledrejection", (event) => {
		reportError(event.reason);
	});

	function place(rect) {
		target.style.left = `${rect.x}px`;
		target.style.top = `${rect.y}px`;
		target.style.width = `${rect.width}px`;
		target.style.height = `${rect.height}px`;
	}

	async function load({ library, code, fileName }) {
		const moduleUrl = (source) =>
			URL.createObjectURL(
				new Blob([source], { type: "text/javascript" }),
			);

		const libraryUrl = moduleUrl(library);
		codeUrl = moduleUrl(code);
		files.set(libraryUrl, "party-js");
		files.set(codeUrl, fileName);

		// Has to be in place before the first module loads, which is why this is a classic script.
		const importMap = document.createElement("script");
		importMap.type = "importmap";
		importMap.textContent = JSON.stringify({
			imports: { "party-js": libraryUrl },
		});
		document.head.append(importMap);

		try {
			const module = await import(codeUrl);
			const run =
				typeof module.run === "function" ? module.run : undefined;
			send({ type: "loaded", ok: true, hasRun: run !== undefined });
			resolveLoaded(run);
		} catch (error) {
			reportError(error);
			send({ type: "loaded", ok: false, hasRun: false });
			resolveLoaded(undefined);
		}
	}

	async function click({ rect, init }) {
		place(rect);
		const run = await loaded;
		if (!run) return;

		target.addEventListener(
			"click",
			(event) => {
				try {
					const result = run({ target, event });
					if (result && typeof result.then === "function") {
						result.then(undefined, reportError);
					}
				} catch (error) {
					reportError(error);
				}
			},
			{ once: true },
		);
		target.dispatchEvent(
			new MouseEvent("click", {
				...init,
				bubbles: true,
				cancelable: true,
				view: window,
			}),
		);
	}

	window.addEventListener("message", (event) => {
		if (event.source !== host) return;
		const message = event.data;
		if (message?.type === "load") load(message);
		else if (message?.type === "click") click(message);
		else if (message?.type === "layout") place(message.rect);
	});

	send({ type: "ready" });
})();
