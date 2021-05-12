import { Vector } from "../components";
import { Spline } from "../components/spline";
import { Particle } from "../particles/particle";

type ValueOf<T> = T[keyof T];

/**
 * Represents a value that can be used to drive a particle module.
 */
export type ModuleDriverValue<T> =
    | T
    | Spline<T>
    | ((factor: number, particle?: Particle) => T);
/**
 * Represents a value that can be used to modify the properties of a particle over it's lifetime.
 */
export type ModuleFunction = (particle: Particle) => void;

/**
 * Represents the properties of a particle that are drivable through modules.
 */
export type DrivableProperties = Pick<
    Particle,
    "color" | "opacity" | "rotation" | "size"
>;

/**
 * Represents the possible, drivable keys of a particle.
 */
export type DrivableKey = keyof DrivableProperties;
/**
 * Represents the possible types of drivable keys.
 */
export type DrivableType = ValueOf<DrivableProperties>;
/**
 * Represents the possible factors of drivable values.
 */
export type DrivableFactor = "lifetime" | "relativeLifetime" | "size";

/**
 * Represents a builder for particle modules. Returns an evaluatable module
 * function, that can be consumed by emitters.
 *
 * @remarks
 * Not all properties can be driven. TypeScript will validate this at compile time,
 * but no internal validation is performed due to performance reasons. Also, note
 * that the driving factor is "lifetime" by default.
 *
 * @example
 * ```ts
 * new ModuleBuilder()
 *     .drive("size")
 *     .by((t) => t * 2)
 *     .through("lifetime")
 *     .build();
 * ```
 */
export class ModuleBuilder {
    /**
     * The specified key of the builder.
     */
    protected driverKey?: DrivableKey;
    /**
     * The value to drive the property with.
     */
    protected driverValue?: ModuleDriverValue<DrivableType>;

    /**
     * The factor driving the built function.
     *
     * @defaultValue "lifetime"
     */
    protected factor: DrivableFactor = "lifetime";

    protected isRelative = false;

    /**
     * Specifies the key in the particle that should be driven.
     *
     * @remarks
     * Note that not all of a particle's properties are drivable through modules. If you
     * need full control of a particle inside of a module, you can use a module function directly.
     *
     * @returns The chained builder instance.
     */
    public drive<TKey extends DrivableKey>(key: TKey): ModuleBuilder {
        this.driverKey = key;
        return this;
    }

    /**
     * Specifies the factor to drive the evaluated value by. Supports "lifetime" and "size".
     *
     * @returns The chained builder instance.
     */
    public through(factor: DrivableFactor): ModuleBuilder {
        this.factor = factor;
        return this;
    }

    /**
     * Specifies the value to drive the module behaviour by. This can be a constant,
     * a spline or an evaluable function. Note that in the last case, the driving
     * factor is passed as a parameter.
     *
     * @returns The chained builder instance.
     */
    public by<TDriver extends DrivableType>(
        driver: ModuleDriverValue<TDriver>
    ): ModuleBuilder {
        this.driverValue = driver;
        return this;
    }

    public relative(isRelative = true): ModuleBuilder {
        this.isRelative = isRelative;
        return this;
    }

    /**
     * Consumes the builder and returns an evaluatable module function.
     *
     * @remarks
     * Note that you need to specify the driving key and value, otherwise an error
     * will be thrown.
     */
    public build(): ModuleFunction {
        if (typeof this.driverKey === "undefined") {
            throw new Error(
                "No driving key was provided in the module builder. Did you forget a '.drive()' call?"
            );
        }
        if (typeof this.driverValue === "undefined") {
            throw new Error(
                "No driving value was provided in the module builder. Did you forget a '.through()' call?"
            );
        }

        return (particle: Particle) => {
            updateDrivenProperty(
                particle,
                this.driverKey,
                evaluateModuleDriver(
                    this.driverValue,
                    calculateModuleFactor(this.factor, particle),
                    particle
                ),
                this.isRelative
            );
        };
    }
}

/**
 * Evaluates the module driver using a specified factor.
 */
function evaluateModuleDriver<T>(
    driver: ModuleDriverValue<T>,
    factor: number,
    particle: Particle
): T {
    if (typeof driver === "object" && "evaluate" in driver) {
        return driver.evaluate(factor);
    }
    if (typeof driver === "function") {
        return (driver as (factor: number, particle: Particle) => T)(
            factor,
            particle
        );
    }
    return driver;
}

/**
 * Calculates a module factor using a specified particle as context.
 */
function calculateModuleFactor(
    factor: DrivableFactor,
    particle: Particle
): number {
    switch (factor) {
        case "lifetime":
            return particle.initialLifetime - particle.lifetime;
        case "relativeLifetime":
            return (
                (particle.initialLifetime - particle.lifetime) /
                particle.initialLifetime
            );
        case "size":
            return particle.size;
        default:
            throw new Error(`Invalid driving factor '${factor}'.`);
    }
}

function updateDrivenProperty(
    particle: Particle,
    key: DrivableKey,
    value: DrivableType,
    relative = false
): void {
    if (!relative) {
        particle[key] = value as never;
    } else {
        const initial = particle[
            "initial" + key[0].toUpperCase() + key.substr(1)
        ] as DrivableType;

        if (typeof initial === "undefined") {
            throw new Error(
                `Unable to use relative chaining with key '${key}'; no initial value exists.`
            );
        }

        if (value instanceof Vector) {
            updateDrivenProperty(particle, key, (initial as Vector).add(value));
        } else if (typeof value === "number") {
            updateDrivenProperty(particle, key, (initial as number) + value);
        } else {
            throw new Error(
                `Unable to use relative chaining with particle key '${key}'; no relative operation for '${value}' could be inferred.`
            );
        }
    }
}
