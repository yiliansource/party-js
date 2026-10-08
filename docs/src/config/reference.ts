export const referenceGroups = [
	"Effects",
	"Custom effects",
	"Samplers",
	"Particles",
	"Behaviors",
	"Utilities",
];

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
