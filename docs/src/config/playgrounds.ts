export const playgroundInformation = {
	effects: {
		slug: "playgrounds/effects",
		title: "Effects",
		description:
			"Tune an effect to your liking before you copy it into your application.",
	},
	shapes: {
		slug: "playgrounds/shapes",
		title: "Shapes",
		description:
			"See how a particle shape looks before you copy it into your application.",
	},
} as const;

export type PlaygroundKey = keyof typeof playgroundInformation;
