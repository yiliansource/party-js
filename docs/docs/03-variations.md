---
title: Variations
---

## Introduction

The library makes heavy use of so-called _variations_ to allow the variation/customization of individual values. Variations are generic - in theory they can take any value, no matter if it's a number, Vector or Color. A variation can be represented by a _constant_, an _array_, or a _function returning a value_.

```ts
type Variation<T> = T | T[] | (() => T);
```

Variations can be evaluated by an internal helper method, so produce a raw value from it. This means that either:

-   The primitive value is returned.
-   A random element from the array is picked.
-   The function is evaluated and returned.

This makes variations a powerful tool to customize properties of emitters.

```ts {5}
party.confetti(myElement, {
    // We want to randomize the amount of confetti that is emitted, so we
    // create a range from 20 to 40. When the particles are created, this
    // variation is evaluated, randomizing the amount of spawned particles.
    count: party.variation.range(20, 40),
});
```

## Helper Methods

To assist in creating variations aside from constants and arrays, the library offers pre-made helper methods - these return a valid variation that can be evaluated.

-   `party.variation.range(min, max)`: Creates a variation that returns a random number from min to max.
-   `party.variation.skew(value, amount)`: Creates a variation that skews the specified value by a specified, absolute amount. This means that instead of the value itself, a random number that deviates at most by the specified amount is returned.
-   `party.variation.skewRelative(value, percentage)`: Creates a variation that skews the specified value by a specified percentage. This means that instead of the value itself, a random number that deviates by a maximum of the specified percentage is returned.
-   `party.variation.splineSample(spline)`: Creates a variation that returns a random sample from the given spline.
-   `party.variation.gradientSample(gradient)`: Creates a variation that returns a random color sample from the given gradient.
