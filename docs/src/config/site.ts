import { type SimpleIcon, siGithub, siNpm } from "simple-icons";

export const site = {
	name: "party.js",
	tagline:
		"Out-of-the-box confetti and sparkles — and the particle engine behind them.",
	url: "https://party-js-v3.pages.dev/",
	repo: "https://github.com/yiliansource/party-js",
	npm: "https://www.npmjs.com/package/party-js",
} as const;

interface SocialLink {
	icon: "github" | "npm";
	label: string;
	href: string;
	brand: SimpleIcon;
}

export const socials = [
	{
		icon: "github",
		label: "GitHub",
		href: site.repo,
		brand: siGithub,
	},
	{
		icon: "npm",
		label: "npm",
		href: site.npm,
		brand: siNpm,
	},
] as const satisfies readonly SocialLink[];

export const starlightSocial = socials.map(({ icon, label, href }) => ({
	icon,
	label,
	href,
}));

interface HeaderLink {
	label: string;
	href: string;
	isActive: (pathname: string) => boolean;
}

export const headerLinks = [
	{
		label: "Docs",
		href: "/introduction/",
		isActive: (p) =>
			p !== "/" && p !== "/404" && !p.startsWith("/playgrounds"),
	},
	{
		label: "Playground",
		href: "/playgrounds/effects/",
		isActive: () => false,
	},
] as const satisfies readonly HeaderLink[];
