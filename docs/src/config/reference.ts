export const referenceGroups = [
	"Effects",
	"Custom effects",
	"Samplers",
	"Particles",
	"Behaviors",
	"Utilities",
] as const;
export type ReferenceGroup = (typeof referenceGroups)[number];

export const kindLabel = {
	Function: "Function",
	Class: "Class",
	Interface: "Interface",
	TypeAlias: "Type",
	Variable: "Constant",
	Enum: "Enum",
	Namespace: "Namespace",
} as const;

export const groupDirectory = (group: string): string =>
	group.replace(/[^\p{L}\p{N}()+,\-._]/gu, "_");

export const referenceGroupOf = (entryId: string): string | undefined =>
	referenceGroups.find(
		(group) =>
			groupDirectory(group).toLowerCase() === entryId.split("/")[1],
	);

export const referenceGroupInfo: Record<
	ReferenceGroup,
	{ description: string; featured: string[] }
> = {
	Effects: {
		description:
			"Ready-made effects you can use with a single function call.",
		featured: ["confetti", "sparkles", "Effect"],
	},
	"Custom effects": {
		description:
			"Build your own effects: control where particles come from, when they are emitted and how they look.",
		featured: ["createEffect", "emitFrom", "createLighting"],
	},
	Samplers: {
		description:
			"Pick values for each particle: random numbers, directions, colors and gradients.",
		featured: ["range", "pick", "gradient", "cone"],
	},
	Particles: {
		description: "The particle itself, and the shapes it can be drawn as.",
		featured: ["Particle", "ParticleShape"],
	},
	Behaviors: {
		description:
			"Modify particles while they are alive: gravity, drag, fading and scaling, with easings to smoothen transitions.",
		featured: ["gravity", "drag", "fade", "scale"],
	},
	Utilities: {
		description: "Colors, vectors, rotations and errors.",
		featured: ["color", "Vec3", "Quat", "PartyJSError"],
	},
};
