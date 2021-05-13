---
title: Components
---

To allow structured and clean functionalities, the library offers various component types to define properties like color, positions, rotations or behaviour over time. They are all exported into the `party` object.

## Color

Allows the representation of colors through RGB components.

```ts
const a = new party.Color(12, 59, 219);
const b = party.Color.fromHex("#ffa68d");
const result = a.mix(b); // Color (#8570b4)
```

As seen above, colors can be mixed together (with an optional weight). Note that this will create a new object, instead of modifying one of the components.

Additionally, conversion from and to hexadecimal notation are supported, as well as conversion from HSL.

## Vector

Allows the representation of things like location and rotation through XYZ components.

```ts
const vectorA = new party.Vector(1, 3, 5);
const vectorB = new party.Vector(2, 3, 1);
const vectorC = vectorA.add(vectorB); // (3, 6, 6)
```

The `Vector` class has various arithmetic vector math operations defined. Note that these always return a new vector, instead of altering an existing one.

You can also create a 2D vector from a 2D angle. Note that a 90° angle will return (0, 1) correctly, but will point downwards in the DOM.

## Geometry Components

Geometry components are usually used to define [source sampler](./sources) areas.

### Rect

A simple rectangle with a position and size.

```ts
// (x, y, width, height)
new party.Rect(1, 2, 3, 4);

// Uses the window's inner height to create a screen-space rect.
party.Rect.fromScreen();
```

### Circle

A simple circle with a position and radius.

```ts
// (x, y, radius)
new party.Circle(1, 2, 3);
```

## Splines

The library provides an abstract implementation of a spline, from which more specific implemenations stem. The basic concept is that a spline consists of spline keys, with a time and a value of an arbitrary type. Splines can be created through the constructor of the specific implementation, as seen further below.

### Numeric Spline

A basic implementation of a numeric spline, with easing applied through cosine interpolation.

```ts
const mySpline = new party.NumericSpline(
    { time: 0, value: 0 },
    { time: 1, value: 1 }
);
const result = mySpline.evaluate(0.2); // 0.0955
```

### Gradient

In this implementation, the values of the spline keys consist of colors, which are mixed together to ease between them. The implementation also offers static utility methods to easily create gradients.

```ts
const a = new party.Color(12, 59, 219);
const b = party.Color.fromHex("#ffa68d");
const simpleGradient = party.Gradient.simple(a, b);
const result = simpleGradient.evaluate(0.6); // Color (#9d7bac)
```
