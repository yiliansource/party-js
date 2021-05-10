---
title: Utilities
---

The library provides various utility methods to build it's features on.

## Math

Since there is a lot of calculation done under the hood, the library defines required mathematical operations that are commonly used.

```ts
party.math.deg2rad; // π / 180
party.math.rad2deg; // 180 / π
party.math.epsilon; // a small value to compare against

party.math.lerp(a, b, t); // linear interpolation from a to b by t
party.math.slerp(a, b, t); // lerp with easing applied
party.math.invlerp(a, b, v); // inverse lerp
party.math.clamp(value, min, max); // clamps the specified value between min and max
party.math.approximately(a, b); // a ≈ b
```

## Randomization

Common "random" operations in the library as helper methods.

```ts
party.random.randomRange(min, max); // random number from min to max
party.random.pick(array); // random element in array
party.random.randomUnitVector(); // random 3d vector
party.random.randomInsideRect(rect); // random point inside a given rectangle
```

:::note
The actual randomization implementation is still up to the underlying JavaScript implementation.
:::

## Others

### Despawning Rules

To allow variety in the way that particles disappear, the particle has the default despawning rules saved in a lookup under `party.despawningRules`. These are functions that take a particle as a parameter, and check whether the particle is ready to be despawned. By default, these rules include:

-   `lifetime`: The particle is despawned once it's lifetime is over.
-   `bounds`: The particle is despawned once it's position goes below the lower edge of the document.

### Methods

```ts
// overrides the defaults specified in A with the partial object B.
party.util.overrideDefaults(a, b);
// converts euler angles (in degrees) to a normal vector.
party.util.rotationToNormal(rotation);
```
