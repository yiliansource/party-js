---
id: customization
title: Customization
---

## Options

The following options can be applied to the particles when spawning them. They can be passed via the optional `options` object.

| Option Name | Default Value | Description |
|:------------|:--------------|:------------|
| count       | 1             | The amount of particles to spawn. |
| spread      | 0             | The amount of spread applied to the spawn angle (in degrees). |
| angle       | 0             | The angle to emit the particles at, with zero pointing upwards (in degrees). |
| velocity    | 0             | The velocity to apply to the particles, in the direction of the angle. |
| angularVelocity | 0         | The angular velocity to apply to the particles, allowing them to spin and twirl. |
| size        | 8             | The size to scale particles up to. |
| shape       | `'rectangle'` | The shape the particles should take. |
| gravity     | true          | Whether or not to apply gravitational acceleration to the particles. |
| randomizePosition | true    | If true, this randomizes the position inside the spawn area. Otherwise spawns from the center of the area. |
| randomizeRotation | true    | If true, this randomizes the initial rotation of the particle. |
| color       | `() => hsl(rnd() * 360, 100, 70)` | The color to apply to particles. |
| lighting    | true          | Whether or not the particles should be affected by lighting. |

Do you have a property that is not exposed here, but you wish to configure? Feel free to [open an issue](https://github.com/yiliansource/party-js/issues) and let me know!

## Randomization

To enable the possibility of variation in the particles, the library allows three types of objects to be passed into the properties.

- Constants: Return their own value.
- Arrays: Return a random element inside them.
- Functions: Execute the function and return the result.

:::note
Type checking is kept to a minimum during the process of randomization, if at all. This makes it possible to create invalid configurations, which will either cause errors at spawn or during lifetime.
:::

### Example

Let's take the `count` option as an example. The following JavaScript values would all be valid:

| Constant | Array | Function |
|:--|:--|:--|
| `30` | `[10, 20, 30, 40]` | `() => Math.floor(30 * Math.sin(new Date().getTime()))` |

### Helper Methods

The library offers the convenience of a couple of helper methods, to allow easy randomization and variation of values. Most of them return a function that creates a randomized result.

#### Constants

```js
party.constant(value);
```

This is purely a convenience method for readability. The function does not actually modify the value, it just returns it.

#### Arrays

```js
party.array(array);
```

As with the constant, this is purely for convenience and readability, the array is not modified.

#### Variation

```js
party.variation(value, variation, [isAbsolute = false]);
```

This method generates a randomization function that applies the specified degree of variation to the specified numeric value. This produces a _relative_ variation by default, but can be specified to produe and _absolute_ variation instead.

The formula to produce a relative variation on the value $v$ using a percentage $p$ is as follows:

$$
v * \text{rand}\left(1 - \frac{p}{2}, 1 + \frac{p}{2}\right)
$$

where $\text{rand}$ is a function that returns a random value between the two specified values. For example, a variation of 0.5 (or 50%) on the value 20 would produce a result from 15 to 25.

An absolute variation is calculated similarly:

$$
v + \text{rand}\left(-\frac{p}{2}, \frac{p}{2}\right)
$$

#### Min Max

```js
party.minmax(min, max);
```

You can also be more distinct with the randomization range. This method produces a function that returns a random number from `min` to `max`.

#### Linear Gradient

```js
party.linearGradient(colors);
```

Since colors are not easily randomizeable like numbers, this method generates a linear gradient from an array of hex-encoded RGB colors by evenly interpolating between them. During the randomization process a random point on the gradient is then sampled and returned. Note that if only one color is passed the method will simply return that color as a constant.

If $c$ is the set of colors on the gradient and $s$ the random index to sample from, we can calculate the result as:

$$
\text{mix}(c_{\lfloor s \rfloor}, c_{\lfloor s + 1 \rfloor}, s \text{ mod } 1)
$$

:::tip
If you do not want to interpolate between the colors of the gradient, use `party.array(...)` instead, passing the colors you want to pick from as an array!
:::

Do you have a method of randomization that could be commonly used but not listed here? Feel free to [open an issue](https://github.com/yiliansource/party-js/issues) and let me know!
