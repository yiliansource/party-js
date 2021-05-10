---
title: Design Principles
---

-   **Quick Setup**: The library is meant to be plug-and-play; no complicated installation setup, no huge config files, just quick effects to get the users started. The implementation of the library is meant to seamlessly and unobtrusively integrate into various web environments, for example SPAs.
-   **Customizability**: Users of the library should be able to fully customize the effects that they want to use. For simple customizations, this involves feeding a configuration object into a template, but for more complex ones this means that most of the API is exposed and can thusly be used.

## How the library works

The library tries it's best to seperate logical systems from each other. The core components include **particles**, **emitters**, the **scene** and the **renderer**, which we will look at in the following paragraphs.

:::note

This section is just meant for users that want to get a better understanding of what happens under the hood. If you just want to know _how_ to use the library, check out the [quick start](./) guide, or the other guides.

:::

### Particles

Particles are essentially just data containers. They do not know how to render themselves, they just know what they consist of, like their position, color or lifetime.

### Emitters

Emitters create particles - it's as straightforward as that. They have an internal store of all particles that they created and are responsible for, as well as emission options that define how and when they emit said particles.

The emission behaviour can be customized by specifying the amount of emitted particles per seconds, as well as bursts, which define an instantaneous emission of multiple particles.

Additionally, emitters are also responsible for updating (ticking) the particles, updating their values. This means applying the pseudo-physics to displace them, as well as applying any particle modifier modules that are registered on the emitter. These modules change the properties of particles over their lifetime, or are driven by other particle properties, such as their size.

### The Scene

Scenes contain emitters, and are responsible for updating them. Tick events are scheduled through them and passed down to the emitters, where they are handled appropriately.

### The Renderer

The behaviour above has been purely data-driven so far. No actual DOM modifications or canvas drawing has occurred yet. This is where the renderer comes in. It has the very important job of displaying the particles that the emitters are taking care of to the actual user.

The procedure is as follows:

1. We start a new rendering block. This is done to ensure that we can record certain metadata, such as the list of particles that were actually rendered in the frame.
2. We iterate through every emitter and every particle, sequentially telling the renderer to draw each particle. If no HTMLElement for a particle exists yet, the renderer uses a factory to generate one, and applies it to the DOM, inside of a container object. Options for rendering said particles can be defined through the emitter itself, but the defaults are meant to operative as well as they can on the standard HTML elements:
    - Color is applied adaptively through the particle's HTML tag. `div`s have their background color set, while `svg`s have their fill and foreground colors set.
    - Opacity is applied through the opacity CSS style.
    - Lighting is calculated using the simple "n-dot-l"-model, meaning that we calculate the lighting coefficient as the dot product of the particles surface normal and the direction of the light. The normal direction of the particle is inferred through its rotation.
    - Transformations, such as location and rotation, are applied as CSS transforms.
3. After we're done rendering an individual particle, we push its ID onto a stack of rendered particles. Internally, we are keeping track of every HTMLElement we rendered, and the corresponding particle ID.
4. After we end the rendering block we started at the beginning we look through the list of rendered particles, to find out which particles we did **not** render. These are the ones that apparently no longer exist inside any emitters in the scene, and can therefore be removed from the DOM.
