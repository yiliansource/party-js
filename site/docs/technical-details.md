---
id: technical-details
title: Technical Details
---

## Transforms

The library uses simplified orthographic transforms, to add a certain sense of dimension to the particles.

When a particle is rendered, the library attempts to fetch the _shape_ of the particle. This shape contains the information
how to render the particle and is responsible for calculating bounds, applying transformations and similar operations.

Considering a vertex with vertex position $v$ being relative to the object's origin, an object position $p$, a rotation $r$ (with euler angles $\alpha$, $\beta$ and $\gamma$) and a scale $s$, the transformed location of the vertex is calculated as:

$$
T(v,p,r,s) =
\begin{bmatrix} p_x \\ p_y \end{bmatrix} +
\begin{bmatrix} v_x s_x \cos{r_\gamma} - v_y s_y \sin{r_\gamma} \\ v_x s_x \sin{r_\gamma} + v_y s_y \cos{r_\gamma} \end{bmatrix}
\begin{bmatrix} \cos{r_\beta} \\ \cos{r_\alpha} \end{bmatrix}
$$

Note that, as previously mentioned, the applied transformation is of a purely orthographic nature, so we do not need to account for perspective. Additionally, note that we only calculate the result $x$ and $y$ coordinates, since we do not need a $z$ component to draw the vertex to the screen.

## Colors

In order to handle particle colors, a few utilities are defined here in the library.

Creating colors of equal luminance and saturation is a challenge with the standard RGB format. Hence, the standard color generation algorithm utilizes a HSL to RGB conversion, with the exact math being described in [this StackOverflow answer](https://stackoverflow.com/a/9493060/5507624).

Mixing colors is done by linearly interpolating between the components of two colors by a specified weight.
