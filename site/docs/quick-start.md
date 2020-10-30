---
id: quick-start
title: Quick Start
slug: /
---

## Installation

To download the current latest version of the library, just choose one of the downloads below!

<div class="downloads">
    <a class="button button--primary button--download"
        href="https://raw.githubusercontent.com/YilianSource/party-js/master/party.js" download="https://raw.githubusercontent.com/YilianSource/party-js/master/party.js">
        Full
    </a>
    <a class="button button--primary button--download"
        href="https://raw.githubusercontent.com/YilianSource/party-js/master/party.min.js" download="https://raw.githubusercontent.com/YilianSource/party-js/master/party.min.js">
        Minified
    </a>
</div>

Then include the downloaded file in your HTML document:

```html
<script src="/js/lib/party.min.js"></script>
```

You can also download the library via `npm`:

```sh
npm install partyjs
```

## Usage

All functionality is contained in the global `party` object.

The library ships with a bunch of pre-configured effects. Let's take a look at how to emit confetti from an HTML element.

```html
<div id="my-button" class="button" onmousedown="party.element(this)">
    Click me!
</div>
```

It's as simple as that! The `element` function takes in the HTML element that should be used to spawn the particles, and takes care of everything else!

:::note
For a complete list of functions, head over to the [documentation](/docs/functions)!
:::

## Configuring effects

The library is written in a way that effects can be easily customized in terms of parameters. All particle-emitting functions contain an optional trailing `options` parameter, which can be used to override pre-defined settings.

Let's take the previous example, but this time, let's move the interactive part to a seperate JavaScript file, since we'll need a bit more code.

```js {4-5}
document.getElementById("my-button").addEventListener("mousedown", function(e) {
    e.preventDefault();
    party.element(this, {
        count: party.variation(30, 0.5),
        color: party.array(['#ffa68d', '#fd3a84'])
    });
});
```

The highlighted code shows an example on how to customize particle color and count. Note the helper methods used.

- `party.variation(value, variation)` generates a variation on a certain number, in this case a variation of **50%** on the number **30**.

- `party.array(array)` selects a random value from the array, in this case either **#ffa68d** or **fd3a84**.

:::tip
For constant values and arrays you don't need to use the helper methods! Just specifying the value directly is sufficient!
:::

The helper methods work on a per-particle basis, meaning that the method will not return a single value, but rather a function allowing the calculation of a single value.

Take for example the `color` property: If a single value would be immediately calculated would have the same color, right? Determining a value just upon particle creation gives us the luxury of randomizing each individual particle!

:::note
A complete list of helper methods is available in the [documentation](/)!
:::

## Feedback

Found a bug? Got a feature idea/request? Head over to the [GitHub repository](https://github.com/YilianSource/party-js) and let me know!
