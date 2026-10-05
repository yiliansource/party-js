export const glyphs = {
	star: {
		viewBox: "-1 -1 2 2",
		shape: {
			type: "polygon",
			props: {
				points: "0,-1 0.2645,-0.3641 0.9511,-0.309 0.428,0.1391 0.5878,0.809 0,0.45 -0.5878,0.809 -0.428,0.1391 -0.9511,-0.309 -0.2645,-0.3641",
				fill: "#FF5A5F",
			},
		},
	},
	square: {
		viewBox: "0 0 24 24",
		shape: {
			type: "rect",
			props: {
				x: 3,
				y: 3,
				width: 18,
				height: 18,
				rx: 4,
				fill: "#FFB400",
				transform: "rotate(-9 12 12)",
			},
		},
	},
	circle: {
		viewBox: "0 0 24 24",
		shape: {
			type: "circle",
			props: { cx: 12, cy: 12, r: 9, fill: "#7B61FF" },
		},
	},
	strip: {
		viewBox: "0 0 24 24",
		shape: {
			type: "rect",
			props: {
				x: 8,
				y: 1,
				width: 8,
				height: 22,
				rx: 4,
				fill: "#00A699",
				transform: "rotate(35 12 12)",
			},
		},
	},
	tile: {
		viewBox: "0 0 24 24",
		shape: {
			type: "rect",
			props: {
				x: 3,
				y: 3,
				width: 18,
				height: 18,
				rx: 4,
				fill: "#A3A3AD",
			},
		},
	},
} as const;

export type GlyphKey = keyof typeof glyphs;
