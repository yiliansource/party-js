/*
    Copyright 2020 YilianSource

    Permission is hereby granted, free of charge, to any person obtaining a copy of this
    software and associated documentation files (the "Software"), to deal in the Software
    without restriction, including without limitation the rights to use, copy, modify, merge,
    publish, distribute, sublicense, and/or sell copies of the Software, and to permit
    persons to whom the Software is furnished to do so, subject to the following conditions:

    The above copyright notice and this permission notice shall be included in all copies or
    substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, 
    INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR 
    PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE 
    FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR 
    OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER 
    DEALINGS IN THE SOFTWARE.
*/

// Runs the initialization and exports the public functions.
// "Private" members, such as utility functions will not be exported.
const party = (function () {
    // Define the default configuration. This will be used widely throughout runtime.
    // Values defined here should only be changed with care between versions.
    const config = {
        maxParticles: 3000,
        gravityPixels: 800,
        applyLighting: true
    };

    // Create the canvas element and align it with the screen.
    const canvas = document.createElement("canvas");
    canvas.id = "party-js-canvas";
    canvas.style = "position: fixed; left: 0; top: 0; pointer-events: none;";
    const ctx = canvas.getContext("2d");

    // Uniform quad, with the origin (0, 0) as a center.
    const quad = [
        { x: -0.5, y: 0.5 },
        { x: 0.5, y: 0.5 },
        { x: 0.5, y: -0.5 },
        { x: -0.5, y: -0.5 }
    ];

    // Attach it to the DOM on load.
    window.addEventListener("load", () => document.body.appendChild(canvas));

    // Stores the particles needed throughout runtime.
    var particles = [];

    /**
     * Returns a random number from 0 to 1.
     */
    function rand() {
        return Math.random();
    }
    /**
     * Returns a random value from a to b.
     * @param {number} a The lower bound of the range (inclusive).
     * @param {number} b The upper bound of the range (inclusive).
     */
    function randRange(a, b) {
        return lerp(a, b, rand());
    }
    /**
     * Linearly interpolates from a to b by t. Unclamped.
     * @param {number} a The "start" of the interpolation.
     * @param {number} b The "end" of the interpolation.
     * @param {number} t The percentage of interpolation.
     */
    function lerp(a, b, t) {
        return (1 - t) * a + t * b;
    }
    /**
     * Applies a relative variation to the specified value, reducing or increasing it proportionally to itself.
     * @param {number} value The value to apply the relative variation to.
     * @param {number} variation The percentage to vary buy. This is halved and distributed to both sides (+ and -) of the value.
     */
    function applyRelativeVariation(value, variation) {
        return value * randRange(1 - variation / 2, 1 + variation / 2);
    }
    /**
     * Applies an absolute variation to the specified value, reducing or increasing it by (at maximum) half of the supplied variation.
     * @param {number} value The value to apply the absolute variation to.
     * @param {number} variation The absolute value to vary buy. This is halved and distributed to both sides (+ and -) of the value.
     */
    function applyAbsoluteVariation(value, variation) {
        return value + randRange(-variation / 2, variation / 2);
    }

    /**
     * Converts the hue, saturation and luminance component into a 6-digit hex color prefixed with #.
     * @param {number} h The hue component.
     * @param {number} s The saturation component.
     * @param {number} l The luminance component.
     * @see https://stackoverflow.com/questions/36721830/convert-hsl-to-rgb-and-hex
     */
    function hslToHex(h, s, l) {
        h /= 360;
        s /= 100;
        l /= 100;
        let r, g, b;
        if (s === 0) {
            r = g = b = l; // achromatic
        } else {
            const hue2rgb = (p, q, t) => {
                if (t < 0) t += 1;
                if (t > 1) t -= 1;
                if (t < 1 / 6) return p + (q - p) * 6 * t;
                if (t < 1 / 2) return q;
                if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
                return p;
            };
            const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            const p = 2 * l - q;
            r = hue2rgb(p, q, h + 1 / 3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1 / 3);
        }
        const toHex = x => {
            const hex = Math.round(x * 255).toString(16);
            return hex.length === 1 ? '0' + hex : hex;
        };
        return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
    }
    /**
     * Mixes the specified colors together using the specified weight.
     * If not supplied, the are mixed with same amounts.
     * @param {string} color1 The first color, as a 6-digit hex string prefixed with '#'.
     * @param {string} color1 The second color, as a 6-digit hex string prefixed with '#'.
     * @param {number} weight The percentage to mix by.
     * @see https://gist.github.com/jedfoster/7939513
     */
    function mix(color1, color2, weight) {
        function d2h(d) { return d.toString(16); }
        function h2d(h) { return parseInt(h, 16); }

        weight = weight != undefined ? weight : .5;

        var color = "#";

        for (var i = 1; i <= 5; i += 2) {
            var v1 = h2d(color1.substr(i, 2)),
                v2 = h2d(color2.substr(i, 2)),

                val = d2h(Math.floor(lerp(v1, v2, weight)));

            while (val.length < 2) { val = '0' + val; }

            color += val;
        }

        return color;
    };

    /**
     * Returns an option by its key from the specified set.
     * Defaults to the specified value if the key does not exist.
     * @param {object} options The set of options.
     * @param {string} key The key to look up.
     * @param {any} def The default value to use in case of an undefined option.
     */
    function getOption(options, key, def) {
        return (options && options[key] != undefined)
            ? options[key]
            : def;
    }
    /**
     * Overrides an undefined option by its key in the specified set.
     * @param {object} options The set of options.
     * @param {string} key The key to conditionally override.
     * @param {any} value The value to conditionally use to override.
     */
    function overrideUndefinedOption(options, key, value) {
        if (options && options[key] == undefined) {
            options[key] = value;
        }
    }
    /**
     * Overrides a collection of undefined options in the specified set, using the provided set.
     * @param {object} options The set of options.
     * @param {object} overrides The set of overrides.
     */
    function overrideUndefinedOptions(options, overrides) {
        for (var key in overrides) {
            overrideUndefinedOption(options, key, overrides[key]);
        }
    }

    /**
     * Calculates the lighting for a surface with a specified transformation.
     * 1 means fully lit, 0 is fully in shadow.
     * @param {*} t The transformation of the object.
     */
    function calculateLighting(t) {
        return Math.abs(Math.cos(t.rx) * Math.cos(t.ry));
    }
    /**
     * Transforms the specified point using location, rotation and scale.
     * @param {object} p The point to transform, with specified x and y components.
     * @param {object} s The scale to transform the point by.
     * @param {object} t The transform to use on the point.
     */
    function transformPoint(p, s, t) {
        let x = p.x * s.w, y = p.y * s.h;
        return {
            x: t.px + (x * Math.cos(t.rz) - y * Math.sin(t.rz)) * Math.cos(t.ry),//x * Math.cos(t.rz) - y * Math.sin(t.rz) + x * Math.cos(t.ry),
            y: t.py + (x * Math.sin(t.rz) + y * Math.cos(t.rz)) * Math.cos(t.rx)//x * Math.sin(t.rz) + y * Math.cos(t.rz) + y * Math.cos(t.rx)
        };
    }
    /**
     * Draws the polygon made of the specified points to the canvas.
     * @param {Array} points The points to draw, in viewport space.
     */
    function drawPolygon(points) {
        for (let i = 0; i < points.length; i++) {
            let x = points[i].x + window.scrollX,
                y = points[i].y - window.scrollY;

            i == 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
    }

    /**
     * Emits particles from the specified area.
     * @param {object} area The area to emit from, using left, top, width and height components.
     * @param {boolean} useScroll Whether to position the area relative to the screen scroll.
     * @param {object} options The set of options to use to spawn the particles.
     */
    function emitFromArea(area, useScroll, options) {
        let count = applyRelativeVariation(getOption(options, "count", 1), getOption(options, "countVariation", 0));

        let angleSpan = getOption(options, "angleSpan", 0);

        let yVelocity = getOption(options, "yVelocity", 0);
        let yYelocityVariation = getOption(options, "yVelocityVariation", 0);
        let rotationVelocityLimit = getOption(options, "rotationVelocityLimit", 0);

        let scaleVariation = getOption(options, "scaleVariation", 0);

        for (let i = 0; i < count; i++) {
            let angle = applyAbsoluteVariation(0, angleSpan) * (Math.PI / 180);
            let initialVelocityY = applyRelativeVariation(yVelocity, yYelocityVariation);
            let width = applyRelativeVariation(5, scaleVariation);

            createParticle({
                a: {
                    px: 0, py: config.gravityPixels,
                    rx: 0, ry: 0, rz: 0
                },
                v: {
                    px: Math.sin(angle) * initialVelocityY, py: Math.cos(angle) * initialVelocityY,
                    rx: rotationVelocityLimit * rand(), ry: rotationVelocityLimit * rand(), rz: rotationVelocityLimit * rand()
                },
                t: {
                    px: (area.left || 0) + applyRelativeVariation((area.width || 0) / 2, getOption(options, "randomizePosition", true) ? 2 : 0) + (useScroll ? window.scrollX : 0),
                    py: (area.top || 0) + applyRelativeVariation((area.height || 0) / 2, getOption(options, "randomizePosition", true) ? 2 : 0) + (useScroll ? window.scrollY : 0),
                    rx: Math.PI * (getOption(options, "randomizeRotation", true) ? 1 : 0) * rand(),
                    ry: Math.PI * (getOption(options, "randomizeRotation", true) ? 1 : 0) * rand(),
                    rz: Math.PI * (getOption(options, "randomizeRotation", true) ? 1 : 0) * rand()
                },
                s: { w: width, h: width * 3 },
                lifetime: 0,
                color: getOption(options, "color", getOption(options, "colorFunction", () => hslToHex(rand() * 360, 100, 70))()),

                /**
                 * Renders the particle to the global canvas context.
                 */
                draw: function () {
                    ctx.beginPath();
                    // Apply lighting to the color, if enabled.
                    ctx.fillStyle = config.applyLighting
                        ? mix('#000000', this.color, 1 - 0.5 * calculateLighting(this.t))
                        : this.color;

                    // Lets the particle grow to its size over time, so it doesn't spawn out of nowhere.
                    const maxSizeAt = 0.2;
                    let sm = this.lifetime > maxSizeAt ? 1 : this.lifetime / maxSizeAt;
                    let s = { w: this.s.w * sm, h: this.s.h * sm };

                    // Transform the quad to fit the transform of the particle.
                    points = quad.map(pt => transformPoint(pt, s, this.t));

                    drawPolygon(points);

                    ctx.closePath();
                    ctx.fill();
                },
                /**
                 * Apply the physics transformations to the particle.
                 * @param {number} delta The time in seconds that has elapsed since the last update.
                 */
                update: function(delta) {
                    function applyDelta(source, dest, delta) {
                        return {
                            px: dest.px + source.px * delta,
                            py: dest.py + source.py * delta,
                            rx: dest.rx + source.rx * delta,
                            ry: dest.ry + source.ry * delta,
                            rz: dest.rz + source.rz * delta
                        };
                    }
        
                    this.v = applyDelta(this.a, this.v, delta);
                    this.t = applyDelta(this.v, this.t, delta);
                    this.lifetime += delta;
                }
            });
        }
    }
    /**
     * Creates a new particle from the specified configuration and adds it to the existing particles.
     * Also ensures that no more than the configured maximum amount of particles exist.
     * @param {object} particle The particle configuration.
     */
    function createParticle(particle) {
        while (particles.length >= config.maxParticles) {
            particles.shift();
        }
        particles.push(particle);
    }

    /**
     * Advances the particle simulation by the specified delta time in seconds.
     */
    function update(delta) {
        particles.forEach(p => p.update(delta));
        // Filter out the particles that are no longer in the document.
        let despawnY = Math.max(document.documentElement.offsetHeight, window.innerHeight);
        particles = particles.filter(p => p.t.py <= despawnY);
    }
    /**
     * Renders all particles to the canvas.
     */
    function draw() {
        // Resize the canvas to ensure its always fullscreen.
        ctx.canvas.width = window.innerWidth;
        ctx.canvas.height = window.innerHeight;

        // Clear the canvas.
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);



        particles.forEach(p => p.draw());
    }
    /**
     * Processes an animation frame.
     * @param {number} timestamp The current timestamp of the animation.
     */
    function loop(timestamp) {
        let delta = (timestamp - lastUpdate) / 1000;

        if (particles.length > 0) {
            update(delta);
            draw();
        }

        lastUpdate = timestamp;
        window.requestAnimationFrame(loop);
    }
    var lastUpdate = 0;
    window.requestAnimationFrame(loop);

    return {
        /**
         * Spawns particles from the specified HTML element.
         * @param {object} element The HTML element to spawn the particles from.
         * @param {object} options The set of options for spawning the particles.
         */
        element: function (element, options) {
            options = options || {};
            overrideUndefinedOptions(options, {
                count: 40,
                countVariation: 0.5,
                angleSpan: 80,
                yVelocity: -200,
                yVelocityVariation: 0.4,
                rotationVelocityLimit: 6,
                scaleVariation: 0.8
            });
            emitFromArea(element.getBoundingClientRect(), true, options);
        },
        /**
         * Spawns particles from the specified position, relative to the viewport.
         * @param {number} x The x position to spawn the particles at.
         * @param {number} y The y position to spawn the particles at.
         * @param {object} options The set of options for spawning the particles.
         */
        position: function (x, y, options) {
            options = options || {};
            overrideUndefinedOptions(options, {
                count: 40,
                countVariation: 0.5,
                angleSpan: 80,
                yVelocity: -300,
                yVelocityVariation: 1,
                rotationVelocityLimit: 6,
                scaleVariation: 0.8
            });
            let area = {
                left: x,
                top: y
            };
            emitFromArea(area, true, options);
        },
        /**
         * Spawns particles from the mouse position retrieved from the current cursor event.
         * Note that this function HAS to be called inside a cursor event handler (mouseover, etc.) to work.
         * @param {object} options The set of options for spawning the particles.
         */
        cursor: function (options) {
            this.position(window.event.clientX, window.event.clientY, options);
        },
        /**
         * Spawns particles from the top of the screen.
         * @param {object} options The set of options for spawning the particles.
         */
        screen: function (options) {
            options = options || {};
            overrideUndefinedOptions(options, {
                count: 500,
                countVariation: 0.5,
                angleSpan: 0,
                yVelocity: -100,
                yVelocityVariation: 2,
                rotationVelocityLimit: 6,
                scaleVariation: 0.8
            });
            let area = {
                width: window.innerWidth,
                height: -window.innerHeight
            };
            emitFromArea(area, true, options);
        }
    }
})();