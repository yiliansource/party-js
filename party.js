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

/**
 * Runs the initialization and exports the public functions.
 * "Private" members, such as utility functions will not be exported.
 */
const party = (function () {

    // Define the default configuration. This will be used widely throughout runtime.
    // Values defined here should only be changed with care between versions.
    const config = {
        maxParticles: 1000,
        gravityPixels: 800,
        applyLighting: true
    };

    /**
     * Represents a 3-dimensional vector with xyz components.
     * Also offers basic vector math functionality.
     */
    class Vector {
        constructor(x, y, z) {
            this.x = x || 0;
            this.y = y || 0;
            this.z = z || 0;
        }

        /**
         * Returns a new vector, which is the sum of the current vector and the supplied vector.
         * @param {Vector} vector The vector to add to the current one.
         */
        add(vector) {
            if (!(vector instanceof Vector)) {
                throw new TypeError("Invalid vector supplied to add operation.");
            }
            return new Vector(this.x + vector.x, this.y + vector.y, this.z + vector.z);
        }
        /**
         * Returns a new vector, which is the product of the current vector and the supplied scale.
         * @param {Number} scalar The value to scale the vector by.
         */
        scale(scalar) {
            if (typeof scalar !== 'number') {
                throw new TypeError("Invalid scale supplied to scale operation.");
            }
            return new Vector(this.x * scalar, this.y * scalar, this.z * scalar);
        }

        static get zero() {
            return new Vector();
        }
        static get one() {
            return new Vector(1, 1, 1);
        }

        /**
         * Generates a new vector from the specified factory method.
         * This can be, for example, used to generate random vectors.
         * @param {function} factory The method to use for component generation.
         */
        static generate(factory) {
            if (typeof factory !== 'function') {
                return new TypeError("Invalid factory function for generated vector.");
            }
            return new Vector(factory(), factory(), factory());
        }
    }
    /**
     * Represents a transform, which holds position, rotation and scale, all in the form of vectors.
     */
    class Transform {
        constructor(position, rotation, scale) {
            this.position = position || Vector.zero;
            this.rotation = rotation || Vector.zero;
            this.scale = scale || Vector.zero;
        }

        /**
         * Applies the specified transform to the current one, scaled by the specified delta.
         * @param {Transform} transform The transform to apply.
         * @param {Number} delta The delta to scale the transform by.
         */
        applyDelta(transform, delta) {
            if (!(transform instanceof Transform)) {
                throw new TypeError("Invalid transform.");
            }
            if (typeof delta !== "number") {
                throw new TypeError("Invalid delta supplied to transformation.");
            }
            return new Transform(
                this.position.add(transform.position.scale(delta)),
                this.rotation.add(transform.rotation.scale(delta)),
                this.scale.add(transform.scale.scale(delta))
            );
        }
    }

    class Shape {
        applyTransform(transform) {
            throw new Error("The shape object needs to implement the applyTransform method.");
        }
        draw(context) {
            throw new Error("The shape object needs to implement the draw method.");
        }

        static transformPoints(points, transform) {
            if (!Array.isArray(points)) {
                throw new TypeError("Non-array was supplied as points array.");
            }
            if (!(transform instanceof Transform)) {
                throw new TypeError("Invalid transform supplied to transformation");
            }
            return points.map(p => {
                let x = p.x * transform.scale.x,
                    y = p.y * transform.scale.y;
                return new Vector(
                    // Basic orthographic transformation
                    transform.position.x + (x * Math.cos(transform.rotation.z) - y * Math.sin(transform.rotation.z)) * Math.cos(transform.rotation.y),
                    transform.position.y + (x * Math.sin(transform.rotation.z) + y * Math.cos(transform.rotation.z)) * Math.cos(transform.rotation.x)
                );
            });
        }
    }
    /**
     * Represents a closed polygon from a specified array of points.
     */
    class Polygon extends Shape {
        constructor(points) {
            super();
            if (!Array.isArray(points)) {
                throw new TypeError("Invalid points definition.");
            }
            this.points = points;
        }

        /**
         * Transforms the polygon using the specified transform.
         * @param {Transform} transform The transformation to apply to the polygon.
         */
        applyTransform(transform) {
            return new Polygon(Shape.transformPoints(this.points, transform));
        }
        /**
         * Draws the polygon to the specified canvas context.
         * @param {CanvasRenderingContext2D} context The context to draw the points to.
         */
        draw(context) {
            if (!(context instanceof CanvasRenderingContext2D)) {
                throw new TypeError("Invalid rendering context.");
            }

            ctx.beginPath();
            for (let i = 0; i < this.points.length; i++) {
                let x = this.points[i].x - window.scrollX,
                    y = this.points[i].y - window.scrollY;

                (i == 0 ? context.moveTo : context.lineTo).apply(context, [x, y]);
            }
            ctx.closePath();
            ctx.fill();
        }
    }

    // Create the canvas element and align it with the screen.
    const canvas = document.createElement("canvas");
    canvas.id = "party-js-canvas";
    canvas.style = "position: fixed; left: 0; top: 0; pointer-events: none;";
    // The context used for drawing on the canvas.
    const ctx = canvas.getContext("2d");

    // Attach it to the DOM when the document body is ready.
    document.body ? document.body.appendChild(canvas) : window.addEventListener("load", () => document.body.appendChild(canvas));

    // Stores the particles needed throughout runtime.
    var particles = [];

    // Stores the shapes the particles can take.
    const shapes = {
        square: new Polygon([new Vector(-0.5, 0.5), new Vector(0.5, 0.5), new Vector(0.5, -0.5), new Vector(-0.5, -0.5)]),
        rectangle: new Polygon([new Vector(-0.3, 1), new Vector(0.3, 1), new Vector(0.3, -1), new Vector(-0.3, -1)])
    };

    // Define conversions between radians and degrees
    const rad2deg = (180 / Math.PI);
    const deg2rad = (Math.PI / 180);
    /**
     * Returns a random number from 0 to 1.
     */
    function rand() {
        return Math.random();
    }
    /**
     * Returns a random value from a to b, both inclusive.
     */
    function randRange(a, b) {
        return lerp(a, b, rand());
    }
    /**
     * Linearly interpolates from a to b by t. Unclamped.
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
        function d2h(d) {
            return d.toString(16);
        }
        function h2d(h) {
            return parseInt(h, 16);
        }

        weight = weight != undefined ? weight : 0.5;

        var color = "#";

        for (var i = 1; i <= 5; i += 2) {
            var v1 = h2d(color1.substr(i, 2)),
                v2 = h2d(color2.substr(i, 2)),

                val = d2h(Math.floor(lerp(v1, v2, weight)));

            while (val.length < 2) {
                val = '0' + val;
            }

            color += val;
        }

        return color;
    }

    /**
     * Calculates the lighting for a surface with a specified transformation.
     * 1 means fully lit, 0 is fully in shadow.
     * @param {Transform} transform The transformation of the object.
     */
    function calculateLighting(transform) {
        if (!(transform instanceof Transform)) {
            throw new TypeError("Invalid transform supplied to lighting calculation.");
        }
        return Math.abs(Math.cos(transform.rotation.x) * Math.cos(transform.rotation.y));
    }

    /**
     * Returns an option by its key from the specified set.
     * Defaults to the specified value if the key does not exist.
     * @param {object} options The set of options.
     * @param {string} key The key to look up.
     * @param {any} def The default value to use in case of an undefined option.
     */
    function getOption(options, key, def) {
        return (options && options[key] != undefined) ? options[key] : def;
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
            if (overrides.hasOwnProperty(key)) {
                overrideUndefinedOption(options, key, overrides[key]);
            }
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

        let rotationVelocityLimit = getOption(options, "rotationVelocityLimit", 0);

        let scaleVariation = getOption(options, "scaleVariation", 0);

        for (let i = 0; i < count; i++) {
            let angle = applyAbsoluteVariation(0, angleSpan) * deg2rad;
            let initialVelocityY = applyRelativeVariation(getOption(options, "yVelocity", 0), getOption(options, "yVelocityVariation", 0));
            let size = applyRelativeVariation(getOption(options, "size", 8), scaleVariation);

            createParticle({
                shape: getOption(options, "shape", "square"),
                acceleration: new Transform(
                    new Vector(0, getOption(options, "gravity", true) * config.gravityPixels),
                    Vector.zero
                ),
                velocity: new Transform(
                    new Vector(Math.sin(angle) * initialVelocityY, Math.cos(angle) * initialVelocityY),
                    Vector.generate(() => rotationVelocityLimit * rand())
                ),
                transform: new Transform(
                    new Vector(
                        (area.left || 0) + applyRelativeVariation((area.width || 0) / 2, getOption(options, "randomizePosition", true) * 2) + (useScroll ? window.scrollX : 0),
                        (area.top || 0) + applyRelativeVariation((area.height || 0) / 2, getOption(options, "randomizePosition", true) * 2) + (useScroll ? window.scrollY : 0)
                    ),
                    Vector.generate(() => Math.PI * getOption(options, "randomizeRotation", true) * rand()),
                    Vector.one.scale(size)
                ),
                color: getOption(options, "color", getOption(options, "colorFunction", () => hslToHex(rand() * 360, 100, 70))()),
                lifetime: 0,

                /**
                 * Renders the particle to the global canvas context.
                 */
                draw: function (context) {
                    // Apply lighting to the color, if enabled.
                    context.fillStyle = config.applyLighting ?
                        mix('#000000', this.color, 0.25 + 0.75 * calculateLighting(this.transform)) :
                        this.color;

                    // Lets the particle grow to its size over time, so it doesn't spawn out of nowhere.
                    const maxSizeAt = 0.2;
                    let sm = this.lifetime > maxSizeAt ? 1 : this.lifetime / maxSizeAt;

                    let definedShape = shapes[this.shape];
                    if (!definedShape) {
                        throw Error(`Unknown shape '${this.shape}'.`);
                    }

                    // Transform the quad to fit the transform of the particle.
                    definedShape
                        .applyTransform(new Transform(0, 0, Vector.one.scale(sm)))
                        .applyTransform(this.transform)
                        .draw(context);
                },
                /**
                 * Apply the physics transformations to the particle.
                 * @param {number} delta The time in seconds that has elapsed since the last update.
                 */
                update: function (delta) {
                    this.velocity = this.velocity.applyDelta(this.acceleration, delta);
                    this.transform = this.transform.applyDelta(this.velocity, delta);
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
        particles = particles.filter(p => p.transform.position.y <= despawnY);
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

        particles.forEach(p => p.draw(ctx));
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
                yVelocity: -300,
                yVelocityVariation: 1,
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
            let event = window.event;
            if (event.clientX == undefined || event.clientY == undefined) {
                return console.error("Calling 'party.cursor()' with no current mouse event is not allowed.");
            }
            this.position(window.event.clientX, window.event.clientY, options);
        },
        /**
         * Spawns particles from the top of the screen.
         * @param {object} options The set of options for spawning the particles.
         */
        screen: function (options) {
            options = options || {};
            overrideUndefinedOptions(options, {
                count: 500 * (window.innerWidth / 1980),
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
        },

        /**
         * Registers a new shape under a given name.
         * @param {string} name The name of the new shape.
         * @param {any} shape The shape to add. This can be either an array of vectors, or an SVG document.
         */
        registerShape: function (name, shape) {
            // Arrays are interpreted as point collections
            if (Array.isArray(shape)) {
                shapes[name] = new Polygon(shape);
            }
            // Strings are interpreted as SVG graphics
            else if (typeof shape === 'string') {
                let parser = new DOMParser();
                let doc = parser.parseFromString(shape, "application/xml");

                let polygon = doc.getElementsByTagName("polygon")[0];
                if (polygon != undefined) {
                    let pointData = polygon.getAttribute("points");
                    let pointExtractor = /(\d+(\.\d+)?)/g;
                    let matches = pointData.match(pointExtractor);

                    let points = [];
                    for (let i = 0; i < matches.length; i += 2) {
                        points.push(new Vector(parseFloat(matches[i]), parseFloat(matches[i + 1])));
                    }

                    function findExtrema(arr, att, isMin) {
                        return arr.reduce(function (prev, curr) {
                            return (isMin ? prev[att] < curr[att] : prev[att] > curr[att]) ? prev : curr;
                        })
                    }

                    let viewBox = {
                        xmin: findExtrema(points, 'x', true).x,
                        xmax: findExtrema(points, 'x', false).x,
                        ymin: findExtrema(points, 'y', true).y,
                        ymax: findExtrema(points, 'y', false).y
                    };
                    viewBox.width = viewBox.xmax - viewBox.xmin;
                    viewBox.height = viewBox.ymax - viewBox.ymin;

                    points = points.map(p => {
                        return new Vector((p.x - viewBox.xmin - viewBox.width / 2) / viewBox.width, (p.y - viewBox.ymin - viewBox.height / 2) / viewBox.height);
                    })

                    shapes[name] = new Polygon(points);
                }
            }
        }
    };
})();