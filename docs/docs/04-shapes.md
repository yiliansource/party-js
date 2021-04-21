---
title: Shapes
---

## Introduction

Shapes define the way that particles are rendered in the DOM. They are essentially just an HTML string, that can be converted to a valid element and attached to a particle.

The library provides various shapes out-of-the-box:

-   `square`
-   `rectangle`
-   `circle`
-   `roundedSquare`
-   `roundedRectangle`
-   `star`

These are contained in the lookup `party.resolvableShapes`, where you can easily add new ones yourself, for example:

```ts
party.resolvableShapes["myImage"] = `<img src="myImage.png"/>`;
```

Shapes are used by the renderer to determine which kind of HTMLElement to spawn for a particular particle. [Templates](/docs/templates) usually expose this to the user in the form of a `shapes` field. Note that this usually is a [variation](/docs/variations), in this case of a resolvable `string` and an `HTMLElement`, so you can use a constant string or element, an array of either, or a function that returns either.

```ts {2}
party.confetti(myButton, {
    shapes: ["square", "circle"],
});
```
