---
title: Migrating to v2
---

v2 of the library comes with a few API changes, which developers will have to adapt to. Below you can find references to methods shipped in v1, and how to mimic their functionality in v2.

## Utility

-   `party.init()`

Since components in the library are now lazily initialized, and re-created whenever they are deemed missing, there is no need to re-initialize it, since it's done internally. However, if you do not want the components to be lazily initialized, you can call `party.forceInitialization()` to manually initialize the library's components.

---

## Effects

-   `party.area(area, options)`

This function is replaced by the _confetti_ template. For the new set of options, refer to the [documentation](/docs/ref/templates) of the template.

```ts
party.confetti(area);
```

---

-   `party.element(element, options)`

This function is replaced by the _confetti_ template. For the new set of options, refer to the [documentation](/docs/ref/templates) of the template.

```ts
party.confetti(element);
```

---

-   `party.position(x, y, options)`

This function is replaced by the _confetti_ template. For the new set of options, refer to the [documentation](/docs/ref/templates) of the template.

```ts
party.confetti(new party.Rect(x, y));
```

---

-   `party.cursor(options)`

This function is replaced by the _confetti_ template. For the new set of options, refer to the [documentation](/docs/ref/templates) of the template. Note that in order to retrieve the mouse position from `window.event`, this has to be called inside the callback of a mouse event, such as `onclick`.

```ts
party.confetti(window.event);
```

---

-   `party.screen(options)`

This function is replaced by the _confetti_ template, although it looks slightly different in v2. For the new set of options, refer to the [documentation](/docs/ref/templates) of the template. Note that this function no longer adapts to the screen's dimensions, you may need to modify the amount of emitted particles through `options.count`.

```ts
party.confetti(party.Rect.fromScreen());
```

---

## Shapes

-   `party.registerShape(name, shapeDefinition)`

v2 [leverages the power of shapes](/docs/ref/shapes), no longer only supporting primitive SVG shapes and polygons. You can now use **any** HTML string as a shape.

```ts
party.resolvableShapes["myNewShape"] = "<div></div>";
// You can now use "myNewShape" as the identifier of a shape to use in an effect.
```

---

## Variations

Variations are no longer exported at top level, and are located under `party.variations.*` instead.

-   `party.constant(value)`

This utility function has been **removed**. You can directly pass a constant value to a variation instead.

---

-   `party.array(array)`

This utility function has been **removed**. You can directly pass an array to a variation instead, and a random element from it will be picked when evaluating it.

---

-   `party.variation(value, variation, isAbsolute)`

To prevent confusion, this function has been renamed to `party.skew(value, amount)` and `party.skewRelative(value, percentage)` respectively.

---

-   `party.minmax(min, max)`

This variation function has been renamed to `party.variation.range(min, max)`.

---

-   `party.linearGradient(...colors)`

This method is now a _component_. New gradients can be created via `new party.Gradient(...colors)`. To pass the gradient to a variation, one can use the `gradientSample` method:

```ts
const myGradient = new party.Gradient(...colors);
const myVariation = party.variations.gradientSample(myGradient);
```
