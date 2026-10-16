export function decimalsOf(v: number): number {
	const [mantissa, exponent = "0"] = String(Math.abs(v)).split("e");
	const fraction = mantissa.split(".")[1] ?? "";
	return Math.max(0, fraction.length - Number(exponent));
}

function toDecimals(v: number, decimals: number): number {
	return Number(v.toFixed(decimals)) + 0;
}

export function cleanToStep(v: number, step: number): number {
	return toDecimals(v, decimalsOf(step));
}

export interface StepBounds {
	min: number;
	max: number;
	step: number;
}

export function snapToStep(v: number, { min, max, step }: StepBounds): number {
	if (!(step > 0))
		throw new RangeError(`step must be greater than 0, got ${step}`);
	if (!(max >= min))
		throw new RangeError(`max (${max}) must not be less than min (${min})`);

	const lastStep = Math.floor((max - min) / step + 1e-9); // allow for float error in the division
	const steps = Number.isNaN(v) ? 0 : Math.round((v - min) / step);
	const clamped = Math.min(lastStep, Math.max(0, steps));

	return toDecimals(
		min + clamped * step,
		Math.max(decimalsOf(step), decimalsOf(min)),
	);
}
