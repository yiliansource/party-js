---
title: Particle Modules
---

## Introduction

Static particles can look pretty boring. Particle modules allow certain particle properties to change over time, for example rotation or colour. These modules are registered at emitter creation, and are executed on a per-tick basis for each particle. They receive the particles themselves as a parameter, so they can alter the particle according to, for example, the particle's lifetime.

They are implemented as class instances, using a single method override to drive their impact on the particles.

```ts
abstract class ParticleModifierModule {
    abstract apply(particle: Particle): void;
}
```

Modules are commonly used in [templates](/docs/templates), and examples on how to use them yourself can be found on the [customization](/docs/custom-effects) page. Usually, the changes these modules apply are driven through _particle modifiers_, which are similar to [variations](/docs/variations). A particle modifier can be represented by either a constant, a [spline](/docs/utilities#splines) or a function taking a particle as a parameter and producing a value.

## Pre-made Modules

The pre-made modules include:

-   `CustomModifier`: A powerful, universal module, that allows a developer to implement the `apply` method seen above themselves, via the `modifier` property of the class instance.
-   `RotationOverLifetime`: Allows you to control the rotation of the particles according to their lifetime, using a specified particle modifier.
-   `SizeOverLifetime`: Allows you to control the size (scale) of the particles according to their lifetime, using a specified particle modifier.

## Example

As an example on the usage, this is how the [sparkles](/docs/templates#sparkles) template drives the particle's sizes:

```ts
const sizeModule = emitter.addModule(modules.SizeOverLifetime);
sizeModule.size = new NumericSpline(
    { time: 0, value: 0 },
    { time: 0.3, value: 1 },
    { time: 0.7, value: 1 },
    { time: 1, value: 0 }
);
```
