---
title: Templates
---

## Introduction

To allow a gentler, less complex start to the usage of the library, it defines a few templates that you can use without having to dive in deep into emitters, modules and the like. Since they are the most "common" way of using the library, they are exported directly into the global `party` object, not into a sub-object.

Before we list the templates, a quick note: Most templates support `Source`s, which denote the area where particles are emitted from. A source can be:

-   A point object ( `{ x, y }` ).
-   An `HTMLElement`.
-   A `MouseEvent`.

## Implementations

Here you can find a list of all templates that are currently implemented, together with their configurations. If you have a suggestion for a template, feel free to [open an issue](https://github.com/yiliansource/party-js/issues/new) for it!

### Confetti

The library's signature effect. Allows you to let confetti pop from any element or point in the document!

This effect supports sources.

```js
const element = document.querySelector(".confetti-sample");
const options = {
    // ...
};
party.confetti(element, options);
```

### Sparkles

Allows you to emit sparkling sparks from any element or point in the document.

This effect supports sources.

```js
const element = document.querySelector(".sparkles-sample");
const options = {
    // ...
};
party.sparkles(element, options);
```
