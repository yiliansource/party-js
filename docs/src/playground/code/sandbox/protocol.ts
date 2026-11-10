export type SourceLocation = { line: number; column: number };
export type LogLevel = "log" | "info" | "warn" | "error" | "debug";

export type Rect = { x: number; y: number; width: number; height: number };

export type ClickInit = Pick<
	MouseEventInit,
	| "clientX"
	| "clientY"
	| "screenX"
	| "screenY"
	| "button"
	| "buttons"
	| "detail"
	| "altKey"
	| "ctrlKey"
	| "metaKey"
	| "shiftKey"
>;

export type HostMessage =
	| { type: "load"; library: string; code: string; fileName: string }
	| { type: "click"; rect: Rect; init: ClickInit }
	| { type: "layout"; rect: Rect };

export type SandboxMessage =
	| { type: "ready" }
	| { type: "loaded"; ok: boolean; hasRun: boolean }
	| {
			type: "log";
			level: LogLevel;
			text: string;
			location?: SourceLocation;
	  }
	| { type: "error"; text: string; location?: SourceLocation };
