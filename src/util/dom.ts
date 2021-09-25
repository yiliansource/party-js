/**
 * Partially updates the style of the specified element.
 */
export function partialUpdateStyle(
    element: HTMLElement,
    style: Partial<CSSStyleDeclaration>
): void {
    Object.assign(element.style, style);
}

/**
 * Calculates the outer size (full size, including borders, paddings and margins)
 * of the specified element and returns the result as a [w, h] tuple.
 */
export function getOuterSize(el: HTMLElement): [number, number] {
    const styles = window.getComputedStyle(el);

    const mx = parseFloat(styles.marginLeft) + parseFloat(styles.marginRight);
    const my = parseFloat(styles.marginTop) + parseFloat(styles.marginBottom);

    return [el.offsetWidth + mx, el.offsetHeight + my];
}
