<p align="center">
	<a href="https://party.js.org">
		<picture>
    		<source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/yiliansource/party-js/main/.github/assets/lockup-stacked-dark.svg">
			<img alt="party.js" src="https://raw.githubusercontent.com/yiliansource/party-js/main/.github/assets/lockup-stacked.svg" width="300">
		</picture>
	</a>
</p>

<p align="center">
  Out-of-the-box confetti and sparkles — and the particle engine behind them.
</p>

<p align="center">
	<a href="https://www.npmjs.com/package/party-js"><img alt="npm version" src="https://img.shields.io/npm/v/party-js?style=flat-square&color=FF5A5F&labelColor=1A1A1A"></a>
	<a href="https://www.npmjs.com/package/party-js"><img alt="npm downloads" src="https://img.shields.io/npm/dm/party-js?style=flat-square&color=FFB400&labelColor=1A1A1A"></a>
	<a href="https://github.com/yiliansource/party-js/actions/workflows/ci.yml"><img alt="CI status" src="https://img.shields.io/github/actions/workflow/status/yiliansource/party-js/ci.yml?branch=main&style=flat-square&label=ci&color=00A699&labelColor=1A1A1A"></a>
	<a href="https://bundlejs.com/?q=party-js"><img alt="minzipped size" src="https://img.shields.io/bundlejs/size/party-js?format=minzip&style=flat-square&label=size&color=7B61FF&labelColor=1A1A1A"></a>
	<a href="./LICENSE"><img alt="MIT license" src="https://img.shields.io/github/license/yiliansource/party-js?style=flat-square&color=6B6B73&labelColor=1A1A1A"></a>
</p>

<p align="center">
	<a href="https://party.js.org/quickstart/"><b>Quickstart</b></a>
	&nbsp;·&nbsp;
	<a href="https://party.js.org">Documentation</a>
	&nbsp;·&nbsp;
	<a href="https://party.js.org/playgrounds/effects/">Playground</a>
	&nbsp;·&nbsp;
	<a href="https://party.js.org/migrating-from-v2/">Migrating from v2</a>
</p>

---

party.js allows you to add various particle effects to your website, such as confetti or sparkles. With just a few lines of code, clicking a button can produce a rain of confetti, rewarding your users with visual feedback to a successful action. Effects have plenty of randomization options, so no two button presses are alike.

If the built-in effects are not enough, the library exposes everything you need from the underlying particle engine to build your own effects!

## Installation

Using your favorite package manager:

```sh
npm install party-js
```

Alternatively you can use a script tag, which exposes everything on a global `party` object:

```html
<script src="https://cdn.jsdelivr.net/npm/party-js@3/bundle/party.min.js"></script>
```

## Usage

```js
import { confetti } from "party-js";

const button = document.querySelector("#my-button");
button.addEventListener("click", () => {
    confetti(button);
});
```

That's it! If you want to customize the visuals, every effect takes an options object, and most options accept either a fixed value or a sampler:

```js
import { confetti, range } from "party-js";

confetti(button, {
    count: range(40, 60),
    spread: 70,
    colors: ["#FF5A5F", "#FFB400", "#00A699", "#7B61FF"],
});
```

Effects start playing once you call them and clean up themselves once they are done. If you need further control over their lifecycle, just keep the handler:

```js
const effect = confetti(button);
effect.stop(); // or .pause(), or .resume()
```

### Built-in effects

| Effect                                               | Description                                         |
| ---------------------------------------------------- | --------------------------------------------------- |
| [`confetti`](https://party.js.org/effects/confetti/) | Paper-like confetti that bursts in an upwards cone. |
| [`sparkles`](https://party.js.org/effects/sparkles/) | Golden sparkles that burst outwards and glint.      |

Still not customizable enough? [`createEffect`](https://party.js.org/guides/custom-effects/) allows you to configure the emitter, particle setup and behaviors directly (it's what the built-in effects are built on). The [playgrounds](https://party.js.org/playgrounds/effects/) let you try shapes and effects live in the browser.

## Contributing

Bug reports, ideas and pull requests are welcome! See [CONTRIBUTING.md](./CONTRIBUTING.md) for how to set up the repository, how to work with it and the contribution guidelines.

## License

[MIT](./LICENSE) © Ian Hornik
