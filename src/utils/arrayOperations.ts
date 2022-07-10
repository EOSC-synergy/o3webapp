/**
 * A module implementing commonly used operations on Arrays.
 *
 * @module ArrayOperations */ // used for auto generation of JSDocs with better-docs

/**
 * Calculates and returns A\B (A without the elements in B)
 *
 * @param {Array} a the array from which to remove elements
 * @param {Array} b the array of elements that should be removed
 * @returns an array containing all elements that are in A and not in B
 * @function
 * @example
 * //returns [1]
 * not([1, 2], [2])
 */
export function not<T>(a: T[], b: T[]): T[] {
    return a.filter((value) => !b.includes(value));
}

/**
 * Calculates and returns A^B (The intersection of the sets A and B)
 * @param {Array} a an array to take the intersection from
 * @param {Array} b an array to take the intersection from
 * @returns An array containing all elements that are both in A and B
 * @function
 * @example
 * //returns [3]
 * intersection([1, 2, 3], [3, 4, 5])
 */
export function intersection<T>(a: T[], b: T[]): T[] {
    return a.filter((value) => b.includes(value));
}

/**
 * Calculates and returns A u B (The union of the sets A and B)
 * @param {Array} a an array to create the union from
 * @param {Array} b an array to create the union from
 * @returns An array containing all elements that are in A or in B
 * @function
 * @example
 * //returns [1, 2, 3, 4]
 * union([1, 2], [3, 4])
 */
export function union<T>(a: T[], b: T[]): T[] {
    return [...a, ...not(b, a)];
}

/**
 * Compares to arrays based on their elements (shallow equality compare).
 * @param {Array} a an array to compare
 * @param {Array} b an array to compare
 * @returns whether a equals b
 * @function
 * @category Utils
 */
export function arraysEqual<T>(a: T[], b: T[]): boolean {
    if (a === b) {
        return true;
    }
    if (a == null || b == null) {
        return false;
    }
    if (a.length !== b.length) {
        return false;
    }

    for (let i = 0; i < a.length; ++i) {
        if (a[i] !== b[i]) {
            return false;
        }
    }
    return true;
}
