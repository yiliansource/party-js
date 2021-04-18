<h1 align="center">
    <img src="./.github/banner.svg"/>
</h1>

<p align="center">
    <a href="#installation">Installation</a> •
    <a href="#usage">Usage</a> •
    <a href="#contributing">Contributing</a>
</p>

<p align="center">
    <a href="https://www.npmjs.com/package/party-js"><img alt="npm" src="https://img.shields.io/npm/v/party-js?style=flat"/></a>
    <img alt="GitHub Repo stars" src="https://img.shields.io/github/stars/yiliansource/party-js?style=flat">
    <img alt="GitHub Build Status" src="https://img.shields.io/github/workflow/status/yiliansource/party-js/Node.js%20CI?style=flat&logo=Node.js">
    <a href="https://partyjs.yiliansource.dev"><img alt="GitHub Docs Status" src="https://img.shields.io/github/workflow/status/yiliansource/party-js/Deploy%20documentation?color=blue&label=docs&logo=Read%20the%20Docs&logoColor=white"></a>
    <img alt="npm downloads" src="https://img.shields.io/npm/dm/party-js?style=flat">
    <img alt="License" src="https://img.shields.io/github/license/yiliansource/party-js?style=flat"/>
</p>

## Installation

The library is written in TypeScript and compiled to an UMD module to allow integration into different environments.

### Browsers

You can grab the latest version from [jsdelivr](https://www.jsdelivr.com/).

```html
<script src="https://cdn.jsdelivr.net/npm/party-js@latest/bundle/party.min.js"></script>
```

The library instance is loaded into the global `party` object.

### Node.JS

If you are using a package-managed environment, you can also install the latest version via [npm].

```sh
npm install party-js
yarn add party-js
```

To use it, simply `require` or `import` it.

```ts
const party = require("party-js");
import party from "party-js";
```

## Usage

The library essentially offers a fully customizeable particle-system implementation into HTML documents. Users of the library have the ability to create and fine-tune effects to their individual liking. The library offers a few simple effects right out-of-the-box, so you don't have to waste time re-creating simple effects.

```js
document.querySelector(".button").addEventListener("click", function(e) {
    party.confetti(this, {
        count: party.range(20, 40)
    });
});
```

If you want to learn more, check out the [quick start][quick-start] guide!

## How it works

In general the library consists of emitters and particles. Emitters are structures located at a specific position that emit particles, and particles themselves are small graphical elements that float around the screen. Both entities are highly customizeable.

The library core spawns, updates and renders entities inside an animation frame loop. Entities are despawned when they leave the lower bound of the document, or their lifetime expires.

## Contributing

First of all, thank you so much for wanting to contribute to the project! ❤  
Please refer to the [contribution guidelines][contributing] when opening issues or creating pull requests.

[contributing]: ./.github/CONTRIBUTING.md
[npm]: https://www.npmjs.com/package/party-js
[issues]: https://github.com/YilianSource/party-js/issues
[quick-start]: https://partyjs.yiliansource.dev/docs/
