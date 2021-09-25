<h1 align="center">
    <img src="https://raw.githubusercontent.com/yiliansource/party-js/main/.github/banner.svg"/>
</h1>

<p align="center">
    <a href="#installation">Installation</a> &bull;
    <a href="#usage">Usage</a> &bull;
    <a href="#contributing">Contributing</a>
</p>

<p align="center">
    <a href="https://www.npmjs.com/package/party-js"><img alt="npm" src="https://img.shields.io/npm/v/party-js?style=flat"/></a>
    <img alt="GitHub Repo stars" src="https://img.shields.io/github/stars/yiliansource/party-js?style=flat">
    <img alt="GitHub Build Status" src="https://img.shields.io/github/workflow/status/yiliansource/party-js/Node.js%20CI?style=flat&logo=Node.js">
    <a href="https://party.js.org/"><img alt="GitHub Docs Status" src="https://img.shields.io/github/workflow/status/yiliansource/party-js/Deploy%20documentation?color=blue&label=docs&logo=Read%20the%20Docs&logoColor=white"></a>
    <img alt="npm downloads" src="https://img.shields.io/npm/dm/party-js?style=flat">
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

```bash
npm install party-js
# or
yarn add party-js
```

To use it, simply `require` or `import` it.

```ts
import party from "party-js";
// or
const party = require("party-js");
```

## Usage

The library essentially offers a fully customizeable particle-system implementation into HTML documents. Users of the library have the ability to create and fine-tune effects to their individual liking. The library offers a few simple effects right out-of-the-box, so you don't have to waste time re-creating simple effects.

```js
document.querySelector(".button").addEventListener("click", function (e) {
    party.confetti(this, {
        count: party.variation.range(20, 40),
    });
});
```

If you want to learn more, check out the [quick start](https://party.js.org/docs/) guide!

## Known Issues

-   _"The particles are getting cut off inside the screen!"_  
    When creating the particle container, the library calculates the document `<body>`'s size _once_. If your document size changes during the lifetime of your application you can either:

    1. Remove the `#party-js-container`. This forces the library to re-initialize the container and will re-calculate the size. All particles will remain in memory, so nothing will be lost.
    2. Manually calculate the needed container size and update it yourself. The library does **not** do this on a per-frame basis, in order not to unvoluntarily slow down older devices with timeout polling, and watching for document size changes is an expensive task, as of writing.

## Contributing

First of all, thank you so much for wanting to contribute to the project! ❤  
Please refer to the [contribution guidelines](./.github/CONTRIBUTING.md) when opening issues or creating pull requests.

[npm]: https://www.npmjs.com/package/party-js
