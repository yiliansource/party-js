export const playgroundInformation = {
	shapes: {
		slug: "playgrounds/shapes",
		title: "Shapes",
		description:
			"See how a particle shape looks before you copy it into your application.",
	},
	effects: {
		slug: "playgrounds/effects",
		title: "Effects",
		description:
			"Tune an effect to your liking before you copy it into your application.",
	},
	code: {
		slug: "playgrounds/code",
		title: "Code",
		description:
			"Write party.js code and try it out, without ever installing anything.",
	},
} as const;

export type PlaygroundKey = keyof typeof playgroundInformation;
