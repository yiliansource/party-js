import type { LogLevel, SourceLocation } from "./sandbox/protocol";

export type ConsoleEntry = {
	id: number;
	time: Date;
	level: LogLevel | "system";
	text: string;
	location?: SourceLocation;
};

export const MAX_ENTRIES = 500;

const timeFormat = new Intl.DateTimeFormat("en-GB", {
	hour: "2-digit",
	minute: "2-digit",
	second: "2-digit",
});

export function formatTime(time: Date): string {
	return timeFormat.format(time);
}
