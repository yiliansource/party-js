---
id: shapes
title: Shapes
---

## Definition

In the context of the library, a _shape_ is a set of instructions used to draw a particle to the canvas. The exact implemenation differs between shape types, but each type needs to implement the following methods:

- _`getBounds()`_ - Returns the bounds of the object, with minimas and maximas for $x$ and $y$ coordinates.
- _`normalize(viewBox)`_ - Normalizes the shape to the given view box. This is used to ensure that shapes can be evenly sized, letting the particle's scale take full control of it's size.
- _`draw(context)`_ - Draws the shape to the screen. If the shapes `transform` property is not empty, this should also take the shape's transformation into account. Note that the color of the particle is already set, so all this method does is execute the rendering instructions.

## Default shapes

The library provides the following basic shapes for particles:

- `square` - A basic square. What more would you expect?
- `rectangle` - A rectangle with an aspect ratio of 3:10.

By default, particles use either `square`s or `rectangle`s, at random. To find out how the library randomizes the shape, check out [the section on randomization](customization#randomization).

## Registering custom shapes

You might grow bored of the default blocky shapes and want to add your own. Well, have no fear, since you can easily add your own polygon and SVG shapes with a single line of code!

```js
party.registerShape(name, shapeDefinition);
```

The `name` simply denotes the key under which the object is stored in the lookup. You will need this later to specify the shape.

The shape definition is where it gets interesting. You can either specify the shape as:

- An array containing the vertices of a polygon. A vertex is an object with both $x$ and $y$ components.
- An SVG string denoting the definition of the shape. See below for more information.

### SVG shapes

Currently, the registration process supports `<polygon>` and `<path>` SVG tags. Do note, however, that in the event of multiple tags existing simultaneously only the first occurence of a valid tag will be used and processed.

Let's take a look at a valid polygon:

```svg
<polygon points="512,197.816 325.961,185.585 255.898,9.569 185.835,185.585 0,197.816 142.534,318.842 95.762,502.431 255.898,401.21 416.035,502.431 369.263,318.842"/>
```

The library would extract the given points, normalize them into a 1x1 box and voilá! You can now use the new shape!

Paths are a bit more complex, but also mostly supported. Advanced path features, such as arcs, are planned for the future, but are currently _not_ supported.

```svg
<path d="M316.722,29.761c66.852,0,121.053,54.202,121.053,121.041c0,110.478-218.893,257.212-218.893,257.212S0,266.569,0,150.801
    C0,67.584,54.202,29.761,121.041,29.761c40.262,0,75.827,19.745,97.841,49.976C240.899,49.506,276.47,29.761,316.722,29.761z"/>
```

Note that paths will be parsed and processed internally, to reduce the complexity at draw time, so valid syntax is an absolute necessity. Refer to the [technical details](technical-details#svg-paths) for more details how paths are optimized.

:::tip
You can also pass the entire SVG document with the opening and closing `<svg>` tags into the registration! In that case, if a `viewBox` attribute is found, the SVG's view box will be used, instead of calculating it manually from the shape's bounds.
:::

### Example

Let's showcase the full process using an example. We want to register the polygon shown above as a new shape called _star_ and then let star-shaped particles rain down on the user.

```js
// The specified SVG polygon is registered under the 'star' key.
party.registerShape('star', '<polygon points="512,197.816 325.961,185.585 255.898,9.569 185.835,185.585 0,197.816 142.534,318.842 95.762,502.431 255.898,401.21 416.035,502.431 369.263,318.842"/>');

// To use it, we override the 'shape' option of a particle-emitting method.
party.screen({ shape: 'star' });
```

:::caution
Since shapes have to be transformed and drawn every frame for potentially hundreds of particles, high shape complexities will drastically decrease performance. The library will produce a warning in the console if a path with over 50 draw instructions is registered.
:::
