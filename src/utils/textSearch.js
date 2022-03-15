/** @module TextSearch */

/**
 * Performs a simple full text search on the given element and looks
 * for the given search string.
 * 
 * @param {object|string} elem single nested object or a string
 * @param {string} searchStr what shall be searched for
 * @returns {boolean} whether the search string was found
 * @constant {function}
 */
export const fullTextSearch = (elem, searchStr) => {
    if (typeof elem === "object") {
        const elemValues = Object.values(elem);
        
        for (let value of elemValues) {
            if (String(value).toLowerCase().includes(searchStr.toLowerCase())) {
                return true;
            }
        }
        return false;

    } else if (typeof elem === "string") {
        return elem.toLowerCase().includes(searchStr.toLowerCase());
    } else {
        throw new Error("fullTextSearch only supports objects and string to search in");
    }
};

/**
 * Searches for occurrences of a string in an array. Searches either
 * the strings in the array or the values of given objects.
 * Each item in the array that has the searchString as a substring is a valid search result.
 * 
 * @param {Array.<String, Object>} array holds the items that are searched
 * @param {String} searchString specifies what should be searched for
 * @param {boolean} shouldReturnValues specifies whether performSearch returns values or indices of
 *          found matches
 * @returns {array} containing the indices of all elements in the array where the searchString matched
 * @constant {function}
 * @category Utils
 */
 export const performSearch = (array, searchString, shouldReturnValues) => {
    let arrayMappedToIndices = array.map(
        (elem, index) => ({index, value: elem})
    )
    arrayMappedToIndices = arrayMappedToIndices.filter(
        ({index, value}) => fullTextSearch(value, searchString)
    )
    
    return arrayMappedToIndices.map(({index, value}) => shouldReturnValues ? value : index)
}