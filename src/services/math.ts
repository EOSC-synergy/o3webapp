/** @module Math */ // used for auto generation of JSDocs with better-docs

/**
 * This functions accepts an array, sorts it in-place and returns a reference to the same array.
 *
 * @function
 * @param arr Array of numbers
 * @returns The array sorted ascending
 */
export const asc = (arr: number[]) => arr.sort((a, b) => a - b);

/**
 * This function accepts an array of numbers and sums over its elements.
 *
 * @function
 * @param arr Array of numbers
 * @returns The sum of all elements
 */
export const sum = (arr: number[]) => arr.reduce((a, b) => a + b, 0);

/**
 * This function calculates the mean of a given array of numbers
 *
 * @function
 * @param arr Array of numbers
 * @returns The mean of all elements in the given array
 */
export const mean = (arr: number[]) => sum(arr) / arr.length;

/**
 * This function calculates the standard deviation of a given array.
 *
 * @function
 * @param arr Array of numbers
 * @returns The standard deviation of the given array
 */
export const std = (arr: number[]) => {
    const mu = mean(arr);
    const diffArr = arr.map((a) => (a - mu) ** 2);
    return Math.sqrt(sum(diffArr) / arr.length);
};

/**
 * Calculate quantiles so, that the calculation of quartiles are based on method 1:
 * {@link https://en.wikipedia.org/wiki/Quartile}
 *
 * @function
 * @param arr The array to calculate the quantile of
 * @param q The quantile
 * @returns The number corresponding to the given quantile
 */
export const quantile = (arr: number[], q: number) => {
    const sorted = asc(arr);
    const pos = sorted.length * q - 1;
    if (sorted[pos] !== undefined) {
        return (sorted[pos] + sorted[pos + 1]) / 2;
    } else {
        return sorted[Math.floor(pos) + 1];
    }
};

/**
 * Returns the lower quartile of the given array
 *
 * @function
 * @param arr The given array
 * @returns The lower quartile
 */
export const q25 = (arr: number[]) => quantile(arr, 0.25);

/**
 * Returns the middle quartile of the given array
 *
 * @function
 * @param arr The given array
 * @returns The middle quartile
 */
const q50 = (arr: number[]) => quantile(arr, 0.5);

/**
 * Returns the upper quartile of the given array
 *
 * @function
 * @param arr The given array
 * @returns The upper quartile
 */
export const q75 = (arr: number[]) => quantile(arr, 0.75);

/**
 * Returns the median of the given array
 *
 * @function
 * @param arr The given array
 * @returns The median
 */
export const median = (arr: number[]) => q50(arr);
