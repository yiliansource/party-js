import { GroupRouter, ReflectionKind } from "typedoc";

const idealBaseName = GroupRouter.prototype.getIdealBaseName;

GroupRouter.prototype.getIdealBaseName = function (reflection) {
	const base = idealBaseName.call(this, reflection);
	if (reflection.kindOf(ReflectionKind.Function)) return base;

	const name = reflection.name.toLowerCase();
	const hasFunctionTwin = reflection.parent?.children?.some(
		(sibling) =>
			sibling !== reflection &&
			sibling.kindOf(ReflectionKind.Function) &&
			sibling.name.toLowerCase() === name,
	);
	return hasFunctionTwin ? `${base}-type` : base;
};

/** @param {import('typedoc').Application} _app */
export function load(_app) {}
