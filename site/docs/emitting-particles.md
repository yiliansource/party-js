---
id: emitting-particles
title: Emitting Particles
---

### Emit from an area

```js
party.area(area, options, useScroll);
```

The general-purpose function to emit confetti from a certain area. This method does not contain any default option overrides, so all configuration must be done manually.

- _`area`_ - The object defining the area to emit particles from. Uses the properties _left, top, width_ and _height_ (as, for example, returned by `Element.getBoundingClientRect()`).
- _`options`_ - The set of [options] defining the particle properties.
- _`useScroll`_ - Whether or not to position the area relative to the viewport.

### Emit from an element

```js
party.element(element, options);
```

Emits particles from the bounding box of an element.

- _`element`_ - The HTML element to emit the particles from.
- _`options`_ - The set of [options] defining the particle properties.

### Emit from a position

```js
party.position(x, y, options);
```

Emits particles from the specified position, relative to the viewport.

- _`x`_ & _`y`_ - The coordinates of the desired position, relative to the viewport.
- _`options`_ - The set of [options] defining the particle properties.

### Emit from the cursor

```js
party.cursor(options);
```

:::note
Due to JavaScript's way of detecting the current mouse position, this method can only be called inside mouse/cursor events, such as `onmousedown`, `onclick`, etc.
:::

Emits particles from the current cursor position. Internally uses `party.position(x, y, options);`.

- _`options`_ - The set of [options] defining the particle properties.

### Emit from the top of the screen

```js
party.screen(options);
```

Rains down particles from the top of the screen. The default implementions is device width aware, so that narrower screens will contain less particles.

- _`options`_ - The set of [options] defining the particle properties.

[Customization]: customization
[options]: customization#options
