import library from "virtual:party-js-bundle";

import type { ClickInit, HostMessage, Rect, SandboxMessage } from "./protocol";
import runtime from "./runtime.js?raw";

const CONTENT_SECURITY_POLICY = [
	"default-src 'none'",
	"script-src 'unsafe-inline' blob:",
	"style-src 'unsafe-inline'",
	"img-src * data: blob:",
	"font-src * data:",
].join("; ");

const SRCDOC = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta http-equiv="Content-Security-Policy" content="${CONTENT_SECURITY_POLICY}">
<style>
html, body { margin: 0; width: 100%; height: 100%; overflow: hidden; background: transparent; }
#target { position: absolute; margin: 0; padding: 0; border: 0; opacity: 0; pointer-events: none; }
</style>
</head>
<body>
<script>${runtime}</script>
</body>
</html>`;

export type SandboxHandlers = {
	onMessage: (message: Exclude<SandboxMessage, { type: "ready" }>) => void;
};

/**
 * Runs code from the code playground in a sandboxed iframe, which has an opaque origin, so the code can't touch
 * the docs page, its storage or its cookies. Every run gets a fresh iframe, so nothing from the previous run, like
 * running effects, timers or listeners, is left behind.
 *
 * The iframe covers the preview stage but lets clicks through, so effects are drawn over the preview, while the
 * button that triggers them lives on the docs page and is forwarded to a stand-in inside the sandbox.
 */
export class CodeSandbox {
	private host: HTMLElement | undefined;
	private frame: HTMLIFrameElement | undefined;
	private pending: { code: string; fileName: string } | undefined;

	constructor(private readonly handlers: SandboxHandlers) {}

	mount(host: HTMLElement) {
		this.host = host;
		window.addEventListener("message", this.onMessage);
		if (this.pending) this.reload();
	}

	unmount() {
		window.removeEventListener("message", this.onMessage);
		this.frame?.remove();
		this.frame = undefined;
		this.host = undefined;
	}

	run(code: string, fileName: string) {
		this.pending = { code, fileName };
		this.reload();
	}

	click(element: HTMLElement, event: MouseEvent) {
		const hostRect = this.host?.getBoundingClientRect();
		if (!hostRect) return;

		const init: ClickInit = {
			clientX: event.clientX - hostRect.left,
			clientY: event.clientY - hostRect.top,
			screenX: event.screenX,
			screenY: event.screenY,
			button: event.button,
			buttons: event.buttons,
			detail: event.detail,
			altKey: event.altKey,
			ctrlKey: event.ctrlKey,
			metaKey: event.metaKey,
			shiftKey: event.shiftKey,
		};
		this.post({ type: "click", rect: this.rectOf(element), init });
	}

	layout(element: HTMLElement) {
		this.post({ type: "layout", rect: this.rectOf(element) });
	}

	private rectOf(element: HTMLElement): Rect {
		const hostRect = this.host?.getBoundingClientRect();
		const rect = element.getBoundingClientRect();
		return {
			x: rect.left - (hostRect?.left ?? 0),
			y: rect.top - (hostRect?.top ?? 0),
			width: rect.width,
			height: rect.height,
		};
	}

	private reload() {
		if (!this.host) return;

		this.frame?.remove();
		const frame = document.createElement("iframe");
		frame.sandbox.add("allow-scripts");
		frame.srcdoc = SRCDOC;
		frame.title = "Code playground preview";
		frame.tabIndex = -1;
		frame.setAttribute("aria-hidden", "true");
		frame.className =
			"absolute inset-0 size-full border-0 pointer-events-none";
		frame.style.colorScheme = "normal";
		this.host.append(frame);
		this.frame = frame;
	}

	private post(message: HostMessage) {
		this.frame?.contentWindow?.postMessage(message, "*");
	}

	private onMessage = (event: MessageEvent<SandboxMessage>) => {
		if (!this.frame || event.source !== this.frame.contentWindow) return;

		const message = event.data;
		if (message.type === "ready") {
			if (this.pending) {
				this.post({ type: "load", library, ...this.pending });
			}
			return;
		}

		this.handlers.onMessage(message);
	};
}
