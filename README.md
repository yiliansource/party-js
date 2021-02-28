<h1 align="center">
    <img src="./branding/banner.svg">
</h1>

<p align="center">
    <a href="#installation">Installation</a> •
    <a href="#usage">Usage</a> •
    <a href="#contributing">Contributing</a>
</p>

<p align="center">
    <a href="https://www.npmjs.com/package/party-js"><img alt="npm" src="https://img.shields.io/npm/v/party-js"/></a>
    <img alt="GitHub" src="https://img.shields.io/github/license/yiliansource/party-js">
    <a href="https://deepscan.io/dashboard#view=project&tid=11458&pid=14332&bid=265225"><img src="https://deepscan.io/api/teams/11458/projects/14332/branches/265225/badge/grade.svg" alt="DeepScan grade"></a>
    <img alt="npm bundle size" src="https://img.shields.io/bundlephobia/min/party-js">
</p>

## Installation

The library is written as an UMD module to allow integration into different environments.

### Browsers

You can grab the latest version from [jsdelivr](https://www.jsdelivr.com/).

```html
<script src="https://cdn.jsdelivr.net/npm/party-js@latest/bundle/party.min.js"></script>
```

The library instance is loaded into the global `party` object.

### Node.JS

You can install the library via `npm`:

```sh
npm install party-js
```

To use it, simply `require` or `import` it.

```js
const party = require("party-js");
// or ...
import party from "party-js";
```

## Usage

The library essentially offers a fully customizeable particle-system implementation into HTML documents. Users of the library have the ability to create and fine-tune effects to their individual liking. The library offers a few simple effects right out-of-the-box, so you don't have to waste time re-creating simple effects.

For a complete guide on how to customize effects, take a look at the [guides]!

Here's an example on how to emit confetti when a button is clicked:

```js
let myButton = document.getElementById("myButton");
myButton.addEventListener("click", function () {
    party.confettiCannon(this, {
        amount: party.range(40, 60),
    });
});
```

If you want to get a bit more advanced with your effects, you can create a new emitter instead:

```js
let myButton = document.getElementById("myButton");
let myEmitter = party.createEmitter({
    duration: 2,
    loop: true,
    rate: 10,
    bursts: [
        {
            time: 0,
            count: 50,
            probability: 0.5,
        },
    ],
    particleSettings: {
        shape: "star",
        gravity: false,
        // add more customization here ...
    },
});
```

## How it works

In general the library consists of emitters and particles. Emitters are structures located at a specific position that emit particles, and particles themselves are small graphical elements that float around the screen. Both entities are highly customizeable.

The library core spawns, updates and renders entities inside an animation frame loop. Entities are despawned when the leave the lower bound of the document.

## Contributing

Contributions are highly welcome! Please check out the [contribution guidelines][contributing] when creating pull requests. Also, please consider [opening an issue][issues] to discuss your proposed changes first.

If you have a feature request, feel free to [open an issue][issues]!

[contributing]: ./.github/CONTRIBUTING.md
[issues]: https://github.com/YilianSource/party-js/issues
[guides]: https://partyjs.yiliansource.dev/guides
