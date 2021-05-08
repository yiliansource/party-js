---
title: Quick Start
slug: /
---

## About

**party.js** is a JavaScript library intended to provide customizeable particle effects to browser environments. To ensure a safer development process, the library is written in TypeScript.

The main focus is to provide users a more fun experience while browsing/interacting with websites.

:::note
The library is intended to only work in browser-like environments, where a global `document` and `window` are both present. If either of those does not exist, the initialization will fail.
:::

## Installation

### Browser

You can download the latest version of the library from [jsdelivr](https://www.jsdelivr.com/package/npm/party-js). Alternatively you can include it in your document directly via the CDN.

```html
<script src="https://cdn.jsdelivr.net/npm/party-js@latest/bundle/party.min.js"></script>
```

The library instance is loaded into the global `party` object.

### Node.js

If you are using a package-managed environment, you can also install the latest version via [npm](https://www.npmjs.com/package/party-js).

```bash
npm install party-js
# or
yarn add party-js
```

You can then either `import` or `require` it.

```ts
import party from 'party-js';
// or
const party = require('party-js');
```

## Usage

### Templates

The library ships with pre-made [template](/docs/templates) effects, to ensure you can get some effects working without having to spend hours tweaking every setting yourself. If you do want to make your own effects from scratch, scroll down to the [custom effects](#custom-effects) section.

As an example, we will implement the _confetti_ effect when a button is clicked.

```html
<div class="button" onmousedown="party.confetti(this)">Click me!</div>
```

This is the simplest way to play the effect. Templated effects offer additional customizeability via option overrides, best explained in the following code snippet.

```js
document.querySelector(".button").addEventListener("click", function (e) {
    party.confetti(this, {
        count: party.variation.range(20, 40),
    });
});
```

The `party.range(...)` method is a [variation](/docs/variations) method, used to make every instance of the effect unique, in this case by varying the amount of confetti emitted.

### Custom effects

If you want to have even more control over the effects that are played, you can completely customize the emitted particles. To ensure you have a good understanding on how customization in the library works, I recommend that you look at the documentation on [variations](/docs/variations) and [shapes](/docs/shapes) first. Then, take a look at [custom effects](/docs/custom-effects) - these guide you through creating your own effects.
