/**
 * This functions accepts an array, sorts it in-place and returns a reference to the same array.
 * 
 * @param {array} arr of numbers
 * @returns the array sorted ascendingly
 */
export const asc = arr => arr.sort((a, b) => a - b);

/**
 * This function accepts an array of numbers and sums over its elements.
 * 
 * @param {array} arr of numbers
 * @returns the sum of all elements
 */
export const sum = arr => arr.reduce((a, b) => a + b, 0);

/**
 * This function calculates the mean of a given array of numbers
 * 
 * @param {array} arr of numbers
 * @returns the mean of all elements in the given array
 */
export const mean = arr => sum(arr) / arr.length;


/**
 * This function calculates the standard deviation of a given array.
 * 
 * @param {array} arr of numberes
 * @returns the standard deviation of the given array
 */
export const std = (arr) => {
    const mu = mean(arr);
    const diffArr = arr.map(a => (a - mu) ** 2);
    return Math.sqrt(sum(diffArr) / arr.length);
};

/**
 * Calculate quantiles so, that the calculation of 
 * quartiles are based on method 2: https://en.wikipedia.org/wiki/Quartile
 * 
 * @param {array} arr the array to calculate the quantile of
 * @param {number} q the quantile 
 * @returns the number corresponding to the given quantile
 */
const quantile = (arr, q) => {
    const sorted = asc(arr);
    const pos = (sorted.length - 1) * q;
    const base = Math.floor(pos);
    const rest = pos - base;
    if (sorted[base + 1] !== undefined) {
        return sorted[base] + rest * (sorted[base + 1] - sorted[base]);
    } else {
        return sorted[base];
    }
};


/**
 * Returns the lower quartile of the given array
 * 
 * @param {array} arr the given array
 * @returns the lower quartile
 */
export const q25 = arr => quantile(arr, .25);

/**
 * Returns the middle quartile of the given array
 * 
 * @param {array} arr the given array
 * @returns the middle quartile
 */
const q50 = arr => quantile(arr, .50);

/**
 * Returns the lower quartile of the given array
 * 
 * @param {array} arr the given array
 * @returns the upper quartile
 */
export const q75 = arr => quantile(arr, .75);

/**
 * Returns the lmedian of the given array
 * 
 * @param {array} arr the given array
 * @returns the median
 */
export const median = arr => q50(arr);
