/**
 * A module implementing different search algorithms for text search in an object.
 *
 * @module TextSearch
 */ // used for auto generation of JSDocs with better-docs

// TODO: get rid of object?
type SomethingSearchable = string | Record<string | number | symbol, unknown> | object;

/**
 * Performs a simple full text search on the given element and looks for the given search string.
 *
 * @category Utils
 * @param elem Single nested object or a string
 * @param searchStr What shall be searched for
 * @returns Whether the search string was found
 */
export function fullTextSearch<T extends SomethingSearchable>(elem: T, searchStr: string) {
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
 * Searches for occurrences of a string in an array. Searches either the strings in the array or the
 * values of given objects. Each item in the array that has the searchString as a substring is a
 * valid search result.
 *
 * @category Utils
 * @function
 * @param array Holds the items that are searched
 * @param searchString Specifies what should be searched for
 * @param shouldReturnValues Specifies whether performSearch returns values or indices of found
 *   matches
 * @returns {Array} Containing the indices of all elements in the array where the searchString
 *   matched
 */
export function performSearch<T extends SomethingSearchable>(
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
