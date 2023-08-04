<img src="https://raw.githubusercontent.com/yiliansource/party-js/main/.github/banner.svg" height="200px" align="right"/>

# party.js

![npm](https://img.shields.io/npm/v/party-js)
![GitHub Repo stars](https://img.shields.io/github/stars/yiliansource/party-js)
![npm](https://img.shields.io/npm/dm/party-js)

_A JavaScript library to brighten up your user's site experience with visual effects!_

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

```bash
npm install party-js
```

To use it, simply `require` or `import` it.

```ts
import party from "party-js";
// or
const party = require("party-js");
```

## Usage

The library essentially offers a fully customizable particle-system implementation into HTML documents. Developers have the ability to create and fine-tune effects to their individual liking. The library offers a few simple effects right out-of-the-box, so you don't have to waste time re-creating simple effects.

```js
document.querySelector(".button").addEventListener("click", function (e) {
    party.confetti(this, {
        count: party.variation.range(20, 40),
    });
});
```

If you want to learn more, check out the [quick start](https://party.js.org/docs/) guide!

## Contributing

First of all, thank you so much for wanting to contribute to the project! ❤  
Please refer to the [contribution guidelines](./.github/CONTRIBUTING.md) when opening issues or creating pull requests.

[npm]: https://www.npmjs.com/package/party-js
