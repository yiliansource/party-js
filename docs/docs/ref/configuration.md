---
title: Configuration
---

## Global Settings

The Settings object (exported to `party.settings`) holds various values determining the global behaviour of the library. These are not read-only, so you can mess around with them to your heart's content.

<!-- prettier-ignore-start -->
| Name | Default | Description |
| :--- | :--- | :--- |
| debug | `false` | Whether the debugging mode should be enabled. |
| gravity | 800 | The amount of gravity to apply to particles in the scene, in pixels. Note that this value is positive by default, since the y-axis increases downwards in a DOM. |
| zIndex | 99999 | The z-index to place the library's DOM containers at. |
| respectReducedMotion | `true`  | Whether to respect the [`(prefers-reduced-motion)` media query](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion). Note that this setting is only read once during initialization - any configuration will have to be done beforehand. |
<!-- prettier-ignore-end -->
