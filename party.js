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
        gravityPixels: 800
    };

    // Define re-usable errors the library can produce.
    const errors = {
        typeCheckFailed: "The supplied parameter must be of type '{0}'.",
        abstractMethodNotImplemented: "The type is required to implement the '{0}' method.",
        invalidPathNode: "Invalid node '{0}' detected in SVG path.",
        malformedPathNode: "Malformed node '{0}' detected in SVG path."
    };

    /**
     * Provides functionality to iterate over a collection.
     */
    class Iterator {
        constructor(items) {
            this.index = 0;
            this.items = items;
        }

        /**
         * Resets the iterator and returns the first item.
         */
        first() {
            this.reset();
            return this.next();
        }
        /**
         * Returns the next item and moves the index forward.
         */
        next() {
            return this.items[this.index++];
        }
        /**
         * Checks if the iterator has a next item.
         */
        hasNext() {
            return this.index < this.items.length;
        }
        /**
         * Resets the internal index of the iterator.
         */
        reset() {
            this.index = 0;
        }
        /**
         * Iterates over all elements, applying the specified callback to each element.
         * @param {function} callback The function to apply to each element.
         */
        each(callback) {
            for (let item = this.first(); this.hasNext(); item = this.next()) {
                callback(item);
            }
        }
    }

    /**
     * Represents an RGB color, with components ranging from 0 to 1.
     */
    class Color {
        constructor(r, g, b) {
            this.r = r;
            this.g = g;
            this.b = b;
        }

        /**
         * Mixes the current color together with the specified color.
         * Also provides the ability to specify the weight, which defaults to 0.5.
         * @param {Color} color The color to mix with.
         * @param {Number} weight The weight to mix by. Defaults to 0.5.
         */
        mix(color, weight) {
            if (!(color instanceof Color)) {
                throw new TypeError(errors.typeCheckFailed.format("Color"));
            }
            if (weight == undefined) {
                weight = 0.5;
            }
            return new Color(
                lerp(this.r, color.r, weight),
                lerp(this.g, color.g, weight),
                lerp(this.b, color.b, weight)
            );
        }

        /**
         * Returns a 6-digit hex string representation of the color, prefixed by #.
         */
        toString() {
            function toHex(v) {
                return Math.round(v * 255).toString(16).padStart(2, '0');
            }
            return `#${toHex(this.r)}${toHex(this.g)}${toHex(this.b)}`
        }

        /**
         * Creates a new color from the specified hex string.
         * The string can optionally be prefixed with #.
         */
        static fromHex(hex) {
            if (hex.startsWith('#')) {
                hex = hex.substring(1);
            }
            return new Color(
                parseInt(hex.substring(0, 2), 16) / 255,
                parseInt(hex.substring(2, 4), 16) / 255,
                parseInt(hex.substring(4, 6), 16) / 255
            );
        }
        /**
         * Creates a new color from the specified hue, saturation and luminance values.
         */
        static fromHsl(h, s, l) {
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
            return new Color(r, g, b);
        }
    }

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
                throw new TypeError(errors.typeCheckFailed.format("Vector"));
            }
            return new Vector(this.x + vector.x, this.y + vector.y, this.z + vector.z);
        }
        /**
         * Returns a new vector, which is scaled by either a supplied scalar or another vector.
         * @param {Number} scalar The number or vector to scale by.
         */
        scale(s) {
            if (typeof s === 'number') {
                return new Vector(this.x * s, this.y * s, this.z * s);
            } else if (s instanceof Vector) {
                return new Vector(this.x * s.x, this.y * s.y, this.z * s.z);
            } else {
                throw new TypeError(errors.typeCheckFailed.format("Number/Vector"));
            }
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
                throw new TypeError(errors.typeCheckFailed.format("Function"));
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
                throw new TypeError(errors.typeCheckFailed.format("Transform"));
            }
            if (typeof delta !== "number") {
                throw new TypeError(errors.typeCheckFailed.format("Number"));
            }
            return new Transform(
                this.position.add(transform.position.scale(delta)),
                this.rotation.add(transform.rotation.scale(delta)),
                this.scale.add(transform.scale.scale(delta))
            );
        }
        apply(point) {
            if (!(point instanceof Vector)) {
                throw new TypeError(errors.typeCheckFailed.format("Vector"));
            }
            let x = point.x * this.scale.x,
                y = point.y * this.scale.y;
            return new Vector(
                // Basic orthographic transformation
                this.position.x + (x * Math.cos(this.rotation.z) - y * Math.sin(this.rotation.z)) * Math.cos(this.rotation.y),
                this.position.y + (x * Math.sin(this.rotation.z) + y * Math.cos(this.rotation.z)) * Math.cos(this.rotation.x)
            );
        }
    }
    /**
     * Represents the bounds of a shape.
     */
    class Bounds {
        constructor(xmin, ymin, xmax, ymax) {
            this.xmin = xmin;
            this.ymin = ymin;
            this.xmax = xmax;
            this.ymax = ymax;
        }

        /**
         * Calculates the bounds from a set of vertices. Assumes atleast one contained element.
         * @param {Vector[]} vertices The vertices to use for the bounds calculation.
         */
        static fromVertices(vertices) {
            let bounds = new Bounds(Infinity, Infinity, 0, 0);
            for (let i = 0; i < vertices.length; i++) {
                let p = vertices[i];
                bounds.xmin = Math.min(p.x, bounds.xmin);
                bounds.ymin = Math.min(p.y, bounds.ymin);
                bounds.xmax = Math.max(p.x, bounds.xmax);
                bounds.ymax = Math.max(p.y, bounds.ymax);
            }
            return bounds;
        }
    }
    /**
     * Represents a viewbox used for normalizing objects.
     */
    class ViewBox {
        /**
         * Creates a new viewbox with the specified dimensions.
         * Also allows to specify if the viewbox should be square-shaped or not.
         */
        constructor(xmin, ymin, width, height, isNonSquare) {
            this.xmin = xmin;
            this.ymin = ymin;
            this.width = isNonSquare ? width : Math.max(width, height);
            this.height = isNonSquare ? height : Math.max(width, height);
        }

        /**
         * Normalizes the specified X coordinate using the current viewbox.
         */
        transformX(x) {
            return (x - this.xmin - this.width / 2) / this.width;
        }
        /**
         * Normalizes the specified Y coordinate using the current viewbox.
         */
        transformY(y) {
            return (y - this.ymin - this.height / 2) / this.height;
        }
        /**
         * Normalizes the specified point using the current viewbox.
         */
        transformPoint(p) {
            return new Vector(this.transformX(p.x), this.transformY(p.y));
        }

        /**
         * Calculates a viewbox from the given bounds.
         * @param {Bounds} bounds The bounds to use for the viewbox.
         */
        static fromBounds(bounds) {
            return new ViewBox(bounds.xmin, bounds.ymin, bounds.xmax - bounds.xmin, bounds.ymax - bounds.ymin);
        }
    }

    /**
     * Represents a shape that can be rendered to the canvas.
     */
    class Shape {
        /**
         * Assigns the specified transform to the shape, using it for rendering.
         */
        withTransform(transform) {
            if (!(transform instanceof Transform)) {
                throw new TypeError(errors.typeCheckFailed.format("Transform"));
            }
            this.transform = transform;
            return this;
        }

        /**
         * Abstract; returns the bounds of the shape.
         */
        getBounds() {
            throw new Error(errors.abstractMethodNotImplemented.format("getBounds()"));
        }
        /**
         * Abstract; normalizes the shape using the specified viewbox.
         */
        normalize(viewBox) {
            throw new Error(errors.abstractMethodNotImplemented.format("normalize(viewBox)"));
        }
        /**
         * Abstract; renders the specified shape to the given context.
         */
        draw(context) {
            throw new Error(errors.abstractMethodNotImplemented.format("draw(context)"));
        }
    }
    /**
     * Represents a closed polygon from a specified array of points.
     */
    class Polygon extends Shape {
        constructor(points) {
            super();
            if (!Array.isArray(points)) {
                throw new TypeError(errors.typeCheckFailed.format("Array"));
            }
            this.points = points;
        }

        /**
         * Returns the bounds for the polygon.
         */
        getBounds() {
            return Bounds.fromVertices(this.points);
        }
        /**
         * Normalizes the polygon's vertices using the given viewbox.
         */
        normalize(viewBox) {
            viewBox = viewBox || ViewBox.fromBounds(this.getBounds());
            if (!(viewBox instanceof ViewBox)) {
                throw new TypeError(errors.typeCheckFailed.format("ViewBox"));
            }
            this.points = this.points.map(p => viewBox.transformPoint(p));
        }

        /**
         * Draws the polygon to the specified canvas context.
         * @param {CanvasRenderingContext2D} context The context to draw the points to.
         */
        draw(context) {
            if (!(context instanceof CanvasRenderingContext2D)) {
                throw new TypeError(errors.typeCheckFailed.format("CanvasRenderingContext2D"));
            }

            context.beginPath();
            for (let i = 0; i < this.points.length; i++) {
                let p = this.transform ? this.transform.apply(this.points[i]) : this.points[i];
                (i == 0 ? context.moveTo : context.lineTo).apply(context, [p.x - window.scrollX, p.y - window.scrollY]);
            }
            context.closePath();
            context.fill();
        }
    }
    /**
     * Represents an SVG path.
     */
    class Path extends Shape {
        constructor(nodes) {
            super();
            this.nodes = [];

            // In order to reduce rendering complexity, transform the SVG commands into a more distinct format.
            let cursor = new Vector();
            let iterator = new Iterator(nodes);
            while (iterator.hasNext()) {
                let node = iterator.next();
                if (typeof node != "string") {
                    /** 
                     * If the node is not a command, interpret it as the same type as the last processed command, unless its a move command.
                     * @see https://www.w3.org/TR/SVG/paths.html
                     */
                    node = nodes.slice(0, iterator.index).reverse().find(n => typeof n == "string");
                    if (node.toLowerCase() == "m") {
                        node = (node.toLowerCase() == node) ? "l" : "L";
                    }
                    iterator.index--;
                }

                let isRelative = node.toLowerCase() == node;
                let offset = isRelative ? new Vector(cursor.x, cursor.y) : new Vector();
                let type, args;
                switch (node.toLowerCase()) {
                    case "m":
                        type = "move";
                        args = [offset.x + iterator.next(), offset.y + iterator.next()];
                        cursor.x = args[0];
                        cursor.y = args[1];
                        break;
                    case "l":
                        type = "line";
                        args = [offset.x + iterator.next(), offset.y + iterator.next()];
                        cursor.x = args[0];
                        cursor.y = args[1];
                        break;
                    case "h":
                        type = "line";
                        args = [offset.x + iterator.next(), cursor.y];
                        cursor.x = args[0];
                        break;
                    case "v":
                        type = "line";
                        args = [cursor.x, offset.y + iterator.next()];
                        cursor.y = args[1];
                        break;
                    case "z":
                        type = "line";
                        let origin = this.nodes.find(n => n.type == "move").getResultingCursor();
                        args = [origin.x, origin.y];
                        cursor.x = origin.x;
                        cursor.y = origin.y;
                        break;
                    case "c":
                        type = "bezier";
                        args = [];
                        for (let i = 0; i < 3; i++) {
                            args.push(offset.x + iterator.next());
                            args.push(offset.y + iterator.next());
                        }
                        cursor.x = args[args.length - 2];
                        cursor.y = args[args.length - 1];
                        break;
                    case "s":
                        type = "bezier";

                        let previousNode = this.nodes[this.nodes.length - 1];
                        if (previousNode.type != "bezier") {
                            throw new Error(errors.malformedPathNode.format(node));
                        }

                        // This command infers its first control point from the previous bezier curve.
                        let x1 = cursor.x + (previousNode.args[4] - previousNode.args[2]);
                        let x2 = cursor.y + (previousNode.args[5] - previousNode.args[3]);
                        args = [x1, x2];

                        for (let i = 0; i < 2; i++) {
                            args.push(offset.x + iterator.next());
                            args.push(offset.y + iterator.next());
                        }
                        cursor.x = args[args.length - 2];
                        cursor.y = args[args.length - 1];
                        break;

                    default:
                        break;
                }
                this.nodes.push(new PathNode(type, args));
            }

            if (this.nodes.length > 50) {
                console.warn("Complex shape registered, high usage may impact framerate.");
            }
        }

        /**
         * Returns the bounds for this path shape.
         */
        getBounds() {
            return Bounds.fromVertices(this.nodes.map(n => n.getResultingCursor()));
        }
        /**
         * Normalizes the path's vertices using the given viewbox.
         */
        normalize(viewBox) {
            viewBox = viewBox || ViewBox.fromBounds(this.getBounds());
            if (!(viewBox instanceof ViewBox)) {
                throw new TypeError(errors.typeCheckFailed.format("ViewBox"));
            }
            let iterator = new Iterator(this.nodes);
            while (iterator.hasNext()) {
                let node = iterator.next();
                for (let i = 0; i < node.args.length; i += 2) {
                    node.args[i] = viewBox.transformX(node.args[i]);
                    node.args[i + 1] = viewBox.transformY(node.args[i + 1]);
                }
            }
        }
        /**
         * Renders the path to the given canvas context.
         */
        draw(context) {
            if (!(context instanceof CanvasRenderingContext2D)) {
                throw new TypeError(errors.typeCheckFailed.format("CanvasRenderingContext2D"));
            }

            context.beginPath();
            new Iterator(this.nodes).each(n => n.run(context, this.transform));
            context.fill();
        }
    }
    /**
     * Represents a node on a path.
     */
    class PathNode {
        constructor(type, args) {
            this.type = type;
            this.args = args;
        }

        /**
         * Returns the cursor position for AFTER the node was executed.
         */
        getResultingCursor() {
            return new Vector(this.args[this.args.length - 2], this.args[this.args.length - 1]);
        }
        /**
         * Executes the operation of the node on the given context.
         */
        run(context, transform) {
            let fun;
            switch (this.type) {
                case "move":
                    fun = context.moveTo;
                    break;
                case "line":
                    fun = context.lineTo;
                    break;
                case "bezier":
                    fun = context.bezierCurveTo;
            }

            let transformedArgs = [];
            for (let i = 0; i < this.args.length; i += 2) {
                let t = new Vector(this.args[i], this.args[i + 1]);
                if (transform) {
                    t = transform.apply(t);
                }
                transformedArgs.push(t.x - window.scrollX);
                transformedArgs.push(t.y - window.scrollY);
            }

            fun.apply(context, transformedArgs);
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

    String.prototype.format = function () {
        var a = this;
        for (var k in arguments) {
            a = a.replace(new RegExp("\\{" + k + "\\}", 'g'), arguments[k]);
        }
        return a;
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
     * Returns the randomized version of the given value.
     * If the value is a number, string or boolean the result is the initial value.
     * If the value is an array, a random array element is picked.
     * If the value is a function, the result is the return value of the function.
     * @param {any} value The provided randomizeable value.
     */
    function getRandomizedValue(value) {
        if (["number", "string", "bigint", "boolean", "undefined"].includes(typeof value)) {
            return value;
        }
        if (typeof value === "function") {
            return value();
        }
        if (Array.isArray(value)) {
            return value[Math.floor(rand() * value.length)];
        }
        throw new Error("Invalid randomized value");
    }

    /**
     * Emits particles from the specified area.
     * @param {object} area The area to emit from, using left, top, width and height components.
     * @param {boolean} useScroll Whether to position the area relative to the screen scroll.
     * @param {object} options The set of options to use to spawn the particles.
     */
    function emitFromArea(area, options, useScroll) {
        let count = getRandomizedValue(getOption(options, "count", 1));
        let spread = getRandomizedValue(getOption(options, "spread", 0));
        let baseAngle = getRandomizedValue(getOption(options, "angle", 0));

        for (let i = 0; i < count; i++) {
            let angle = applyAbsoluteVariation(baseAngle, spread) * deg2rad;
            let initialVelocity = getRandomizedValue(getOption(options, "velocity", 0));
            let angularVelocity = getRandomizedValue(getOption(options, "angularVelocity", 0));
            let size = getRandomizedValue(getOption(options, "size", 8));

            createParticle({
                shape: getRandomizedValue(getOption(options, "shape", "rectangle")),
                acceleration: new Transform(
                    new Vector(0, getOption(options, "gravity", true) * config.gravityPixels)
                ),
                velocity: new Transform(
                    new Vector(Math.sin(angle), Math.cos(angle)).scale(initialVelocity),
                    Vector.generate(() => getRandomizedValue(angularVelocity))
                ),
                transform: new Transform(
                    new Vector(
                        (area.left || 0) + applyRelativeVariation((area.width || 0) / 2, getOption(options, "randomizePosition", true) * 2) + (useScroll ? window.scrollX : 0),
                        (area.top || 0) + applyRelativeVariation((area.height || 0) / 2, getOption(options, "randomizePosition", true) * 2) + (useScroll ? window.scrollY : 0)
                    ),
                    Vector.generate(() => Math.PI * getOption(options, "randomizeRotation", true) * rand()),
                    Vector.one.scale(size)
                ),
                color: getRandomizedValue(getOption(options, "color", () => Color.fromHsl(rand() * 360, 100, 70).toString())),
                lighting: getOption(options, "lighting", true),
                lifetime: 0,

                /**
                 * Renders the particle to the global canvas context.
                 */
                draw: function (context) {
                    // Apply lighting to the color, if enabled.
                    context.fillStyle = this.lighting ?
                        new Color(0, 0, 0).mix(Color.fromHex(this.color), 0.25 + 0.75 * calculateLighting(this.transform)).toString() :
                        this.color;

                    // Lets the particle grow to its size over time, so it doesn't spawn out of nowhere.
                    const maxSizeAt = 0.2;
                    let sm = this.lifetime > maxSizeAt ? 1 : this.lifetime / maxSizeAt;

                    let definedShape = shapes[this.shape];
                    if (!definedShape) {
                        throw Error(`Unknown shape '${this.shape}'.`);
                    }

                    // Transform the quad to fit the transform of the particle.
                    let transform = new Transform(this.transform.position, this.transform.rotation, this.transform.scale.scale(sm));
                    definedShape
                        .withTransform(transform)
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
         * Emits particles from the specified area (read from the properties 'left', 'top', 'width' and 'height').
         * @param {object} area The area to emit the particles from.
         * @param {boolean} useScroll Whether or not to position the area relative to the viewport.
         * @param {object} options The set of options for spawning the particles.
         */
        area: function (area, options, useScroll) {
            emitFromArea(area, options, useScroll == undefined ? true : useScroll);
        },
        /**
         * Spawns particles from the specified HTML element.
         * @param {object} element The HTML element to spawn the particles from.
         * @param {object} options The set of options for spawning the particles.
         */
        element: function (element, options) {
            options = options || {};
            overrideUndefinedOptions(options, {
                shape: party.array(["square", "rectangle"]),
                count: party.variation(40, 0.5),
                spread: party.constant(80),
                size: party.variation(10, 0.8),
                velocity: party.variation(-300, 1),
                angularVelocity: party.minmax(1, 6)
            });
            this.area(element.getBoundingClientRect(), options);
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
                shape: party.array(["square", "rectangle"]),
                count: party.variation(40, 0.5),
                spread: party.constant(80),
                size: party.variation(10, 0.8),
                velocity: party.variation(-300, 1),
                angularVelocity: party.minmax(1, 6),
            });
            this.area({
                left: x,
                top: y
            }, options);
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
            this.position(event.clientX, event.clientY, options);
        },
        /**
         * Spawns particles from the top of the screen.
         * @param {object} options The set of options for spawning the particles.
         */
        screen: function (options) {
            options = options || {};
            overrideUndefinedOptions(options, {
                shape: party.array(["square", "rectangle"]),
                count: party.variation(500 * (window.innerWidth / 1980), 0.5),
                size: party.variation(10, 0.8),
                velocity: party.variation(-100, 2),
                angularVelocity: party.minmax(1, 6),
            });
            this.area({
                width: window.innerWidth,
                height: -window.innerHeight
            }, options);
        },

        /**
         * Registers a new shape under a given name.
         * @param {string} name The name of the new shape.
         * @param {any} shape The shape to add. This can be either an array of vectors, or an SVG document.
         */
        registerShape: function (name, shapeDefinition) {
            // Arrays are interpreted as point collections
            if (Array.isArray(shapeDefinition)) {
                shapes[name] = new Polygon(shapeDefinition);
            }
            // Strings are interpreted as SVG graphics
            else if (typeof shapeDefinition === 'string') {
                let parser = new DOMParser();
                let doc = parser.parseFromString(shapeDefinition, "application/xml");

                // Catch if an error has occurred.
                let error = doc.getElementsByTagName("parsererror")[0];
                if (error) {
                    throw new Error("Invalid SVG shape.");
                }

                // If an SVG viewbox was passed, parse it.
                var viewBox;
                let svg = doc.getElementsByTagName("svg")[0];
                if (svg && svg.hasAttribute("viewBox")) {
                    viewBox = ViewBox.fromBounds(svg.getAttribute("viewBox").split(' ').map(n => parseFloat(n)));
                }

                // Locate the potential shapes
                let polygon = doc.getElementsByTagName("polygon")[0];
                let path = doc.getElementsByTagName("path")[0];

                // Provide a storage for the created shape.
                let shape;

                if (polygon) {
                    // Extract the points from the polygon.
                    let pointData = polygon.getAttribute("points");
                    let pointExtractor = /(-?\d*\.\d+|-?\d+)/g;
                    let matches = pointData.match(pointExtractor);

                    // Parse the point collection into vectors.
                    let points = [];
                    for (let i = 0; i < matches.length; i += 2) {
                        points.push(new Vector(parseFloat(matches[i]), parseFloat(matches[i + 1])));
                    }

                    // Create the resulting polygon.
                    shape = new Polygon(points);
                } else if (path) {
                    // Extract the nodes from the path definition.
                    let pathData = path.getAttribute("d");
                    let nodeExtractor = /([A-Za-z]|-?\d*\.\d+|-?\d+)/g;
                    let matches = pathData.match(nodeExtractor);

                    // Process the nodes into their correct form.
                    let nodes = [];
                    for (let i = 0; i < matches.length; i++) {
                        let string = matches[i];
                        let numeric = parseFloat(string);
                        nodes.push(isNaN(numeric) ? string : numeric);
                    }

                    // Create a new path using the given nodes.
                    shape = new Path(nodes);
                }

                // Ensure that a shape was created.
                if (!shape) {
                    throw new Error("No shape was determined from the SVG.");
                }

                // Normalize the shape using the viewbox.
                shape.normalize(viewBox);
                shapes[name] = shape;
            }
        },

        /**
         * Creates a constant value. This is purely for syntax convenience, the given value is simply returned.
         */
        constant: function (value) {
            return value;
        },
        /**
         * Creates a function that calculates a variation on a specific value.
         * Allows specification if the variation should be relative (default) or absolute. 
         */
        variation: function (value, variation, isAbsolute) {
            if (typeof value !== "number" || typeof variation !== "number") {
                throw new TypeError(errors.typeCheckFailed.format("Number"));
            }
            return () => (isAbsolute ? applyAbsoluteVariation : applyRelativeVariation)(value, variation);
        },
        /**
         * Creates a function that returns a random value between min and max.
         */
        minmax: function (min, max) {
            if (typeof min !== "number" || typeof max !== "number") {
                throw new TypeError(errors.typeCheckFailed.format("Number"));
            }
            return () => randRange(min, max);
        },
        /**
         * Creates an array. This is purely for syntax convenience, the given value is simply returned.
         */
        array: function (array) {
            if (!Array.isArray(array)) {
                throw new TypeError(errors.typeCheckFailed.format("Array"));
            }
            return array;
        },

        linearGradient: function () {
            if (!arguments || arguments.length == 0) {
                throw new Error();
            }
            if (arguments.length == 1) {
                return arguments[0];
            }
            var colors = [...arguments].map(arg => Color.fromHex(arg));
            return () => {
                let position = randRange(0, colors.length - 1);
                let index = Math.floor(position), sample = position % 1;
                return colors[index].mix(colors[index + 1], sample).toString();
            }
        }
    };
})();

party.registerShape('circle', '<path d="M0,1 C0.551915024494,1 1,0.551915024494 1,0 C1,-0.551915024494 0.551915024494,-1 0,-1 C-0.551915024494,-1 -1,-0.551915024494 -1,0 C-1,0.551915024494 -0.551915024494,1 0,1 Z"/>');
party.registerShape('ellipse', '<path d="M0,0.5 C0.5,0.5 1,0.4 1,0 C1,-0.4 0.5,-0.5 0,-0.5 C-0.5,-0.5 -1,-0.4 -1,0 C-1,0.4 -0.5,0.5 0,0.5Z"/>');
party.registerShape('rounded-square', '<path d="M-0.5,1 L0.5,1 C0.75,1 1,0.75 1,0.5 L1,-0.5 C1,-0.75 0.75,-1 0.5,-1 L-0.5,-1 C-0.75,-1 -1,-0.75 -1,-0.5 L-1,0.5 C-1,0.75 -0.75,1 -0.5,1 Z"/>');
party.registerShape('rounded-rectangle', '<path d="M-0.6,0.5 L0.6,0.5 C0.8,0.5 1,0.3 1,0.1 L1,-0.1 C1,-0.3 0.8,-0.5 0.6,-0.5 L-0.6,-0.5 C-0.8,-0.5 -1,-0.3 -1,-0.1 L-1,0.1 C-1,0.3 -0.8,0.5 -0.6,0.5 Z"/>');
party.registerShape('star', '<polygon points="512,197.816 325.961,185.585 255.898,9.569 185.835,185.585 0,197.816 142.534,318.842 95.762,502.431 255.898,401.21 416.035,502.431 369.263,318.842"/>');