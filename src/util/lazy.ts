/**
 * A factory method used to initialize a lazy value.
 */
type LazyFactory<T> = () => T;
/**
 * A predicate method used to check if a lazy value was already initialized.
 */
type ExistsPredicate<T> = (value: T) => boolean;

/**
 * A wrapper class to lazily initialize a value.
 * Supports custom factory and predicate methods.
 */
export class Lazy<T> {
    /**
     * The current value of the lazy object. Will be initialized, if the 'exists'
     * predicate doesn't match.
     */
    public get current(): T {
        if (!this.exists(this.value)) {
            this.value = this.factory();
        }
        return this.value;
    }

    private value?: T;

    constructor(
        private factory: LazyFactory<T>,
        private exists: ExistsPredicate<T> = Lazy.defaultExists
    ) {}

    private static defaultExists<T>(value: T): boolean {
        return typeof value !== "undefined";
    }
}
