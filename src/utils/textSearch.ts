/**
 * A module implementing different search algorithms for text search in an object.
 *
 * @module TextSearch */ // used for auto generation of JSDocs with better-docs

/**
 * Performs a simple full text search on the given element and looks
 * for the given search string.
 *
 * @param elem single nested object or a string
 * @param searchStr what shall be searched for
 * @returns whether the search string was found
 * @category Utils
 */
export function fullTextSearch<T>(elem: T, searchStr: string) {
    const lowerSearchStr = searchStr.toLowerCase();
    if (typeof elem === 'string') {
        return elem.toLowerCase().includes(lowerSearchStr);
    } else {
        const elemValues = Object.values(elem);

        for (const value of elemValues) {
            if (String(value).toLowerCase().includes(lowerSearchStr)) {
                return true;
            }
        }
        return false;
    }
}

/**
 * Searches for occurrences of a string in an array. Searches either
 * the strings in the array or the values of given objects.
 * Each item in the array that has the searchString as a substring is a valid search result.
 *
 * @param array holds the items that are searched
 * @param searchString specifies what should be searched for
 * @param shouldReturnValues specifies whether performSearch returns values or indices of
 *          found matches
 * @returns {Array} containing the indices of all elements in the array where the searchString matched
 * @function
 * @category Utils
 */
export function performSearch<T>(
    array: T[],
    searchString: string,
    shouldReturnValues = false
): (T | number)[] {
    let arrayMappedToIndices = array.map((elem, index) => ({ index, value: elem }));
    arrayMappedToIndices = arrayMappedToIndices.filter(({ value }) =>
        fullTextSearch(value, searchString)
    );

    return arrayMappedToIndices.map(({ index, value }) => (shouldReturnValues ? value : index));
}
