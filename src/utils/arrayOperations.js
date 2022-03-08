/**
 * Calculates and returns A\B
 * @param {Array} a the array from which to remove elements
 * @param {Array} b the array of elements that should be removed
 * @returns an array containing all elements that are in A and not in B
 */
export function not(a, b) {
    return a.filter((value) => b.indexOf(value) === -1);
}

/**
 * Calculates and returns A^B
 * @param {Array} a an array to take the intersection from
 * @param {Array} b an array to take the intersection from
 * @returns An array containing all elements that are both in A and B
 */
export function intersection(a, b) {
    return a.filter((value) => b.indexOf(value) !== -1);
}

/**
 * Calculates and returns A u B
 * @param {Array} a an array to create the union from
 * @param {Array} b an array to create the union from
 * @returns An array containing all elements that are in A or in B
 */
export function union(a, b) {
    return [...a, ...not(b, a)];
  }