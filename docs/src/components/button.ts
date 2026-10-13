export type ButtonVariant =
	| "primary"
	| "secondary"
	| "accent"
	| "ghost"
	| "raised";
export type ButtonSize = "sm" | "md" | "lg";

const base =
	"inline-flex items-center justify-center gap-2 font-semibold no-underline " +
	"cursor-pointer select-none transition-[background-color,opacity] duration-150 " +
	"focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-600 " +
	"disabled:pointer-events-none disabled:opacity-50";

const variants: Record<ButtonVariant, string> = {
	primary: "bg-primary text-primary-fg hover:opacity-90",
	secondary:
		"bg-page text-fg ring-1 ring-inset ring-line-strong hover:bg-hover",
	accent: "bg-coral text-ink hover:bg-accent-400",
	ghost: "bg-surface text-muted hover:bg-hover hover:text-fg",
	raised: "bg-raised text-fg hover:bg-hover",
};

const sizes: Record<ButtonSize, string> = {
	sm: "h-10 px-3 text-sm rounded-[9px] [&_svg]:size-4",
	md: "h-12 px-5 text-base rounded-xl [&_svg]:size-[18px]",
	lg: "h-13 px-6 text-base rounded-xl [&_svg]:size-[18px]",
};

export const buttonClass = (
	variant: ButtonVariant = "primary",
	size: ButtonSize = "md",
) => [base, variants[variant], sizes[size]].join(" ");
