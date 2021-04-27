---
title: Custom Effects
---

## Introduction

As we've seen before, [templates](/docs/templates) are powerful tools, but sometimes you might want more control over the effects you create than what the library offers pre-made. This chapter will break down how a template is built, and how you can use that knowledge to create your own effects using emitters, variations and modules.

## Example

To understand how custom effects work, let's break down the [confetti](/docs/templates#confetti) template we saw before. Note that some parts are omitted for the sake of brevity.

```ts
function confetti(
    source: Source,
    options?: Partial<ConfettiConfiguration>
): Emitter {
    const config = party.util.overrideDefaults(
        {
            /* ... */
        },
        options
    );
    const rect = party.util.sourceToRect(source);
    const emitter = party.scene.current.createEmitter({
        emitterOptions: {
            // ...
            initialSpeed: config.speed,
            initialLifetime: party.variation.range(6, 8),
        },
        emissionOptions: {
            rate: 0,
            bursts: [{ time: 0, count: config.count }],
        },
        shapeOptions: {
            angle: party.variation.skew(
                -90,
                party.variation.evaluateVariation(config.spread)
            ),
            source: rect,
        },
        rendererOptions: {
            shapeFactory: config.shapes,
        },
    });

    const rotationModule = emitter.addModule(party.modules.RotationModifier);
    rotationModule.rotation = config.rotationOverLifetime;

    // ...

    return emitter;
}
```

### Breakdown

Let's break down the effect bit by bit. First, we provide fill in values that the user potentially omitted, to ensure that all the configuration we need has a proper value.

```ts
const config = party.util.overrideDefaults(
    {
        /* ... */
    },
    options
);
```

Next up, we determine the actual area that the particles will be emitted from. This is done by converting the `Source` parameter to a `Rect` using a utility method.

```ts
const rect = party.util.sourceToRect(source);
```

After we've prepared all the objects we need, it's time to finally create the `Emitter` object. This is the instance that will ultimately be responsible for spawning our confetti-particles.

We use the fact that we can pass every configuration option that we need directly into the method that creates a new emitter in the scene.

```ts
const emitter = party.scene.current.createEmitter({
    emitterOptions: {
        // ...
        initialSpeed: config.speed,
        initialLifetime: party.variation.range(6, 8),
    },
    emissionOptions: {
        rate: 0,
        bursts: [{ time: 0, count: config.count }],
    },
    shapeOptions: {
        angle: party.variation.skew(
            -90,
            party.variation.evaluateVariation(config.spread)
        ),
        source: rect,
    },
    rendererOptions: {
        shapeFactory: config.shapes,
    },
});
```

Note that we're passing [variations](/docs/variations) to some of the options. This is to - as the name might suggest - allow variety in the way that particles are emitted. You can learn more about variations on their documentation page.

The **emitter options** control what properties the emitted particle are given after they are spawned, things like colour, velocity or rotation.

The **emission options** control the speed at which particles are emitted. The `rate` option specifies how many particles should be emitted per second, while the `bursts` option can be used to specify points in time at which groups of particles should be spawned. For the confetti effect, we only want particles to be emitted all at once, so this is fitting.

The **shape options** specify the area that particles are emitted from, and the direction that they are emitted in. The source is defined by a rectangle.

The **renderer options** define the way that particles appear on the screen, and how certain properties of them are applied to their looks, for example the lighting and transform.

Finally, we want to give some variation over time to the particles. In this case, we will use a `RotationModifier` to rotate the particles over time. We use an instance method of the emitter to add the module by it's type, and then configure it.

```ts
const rotationModule = emitter.addModule(party.modules.RotationModifier);
rotationModule.rotation = config.rotationOverLifetime;
```

Note that we _could_ also add the module manually, but the above method is shorter.

```ts
const rotationModule = new party.modules.RotationModifier();
rotationModule.rotation = config.rotationOverLifetime;
emitter.modules.push(rotationModule);
```

At the end we simply return the created emitter object, but this is obviously optional.

---

That's all there is to it! If you want to learn more about how to create custom effects, check out the subsequent chapters for more details on individual aspects.
