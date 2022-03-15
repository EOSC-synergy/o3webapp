/** @module ModelNameConverter */

/**
 * This function parses a given string like the structure of the
 * models were described by Valentin and Tobias (aka der Betreuer-Gang):
 * 
 * Project_Institute_Modelname (whereas modelname can contain underscores)
 * 
 * @param {string} name of the model
 * @returns the regex match object
 * @constant {function}
 */
export const convertModelName = (name) => {
    if (typeof name !== 'string') {
        throw new Error("provided name that is not of type string");
    }
    const regex = new RegExp("^([^_]+)_([^_]+)_(.*)$");
    const info = name.match(regex);

    if (info === null) return {
        project: "",
        institute: "",
        name,
    };
    return {
        project: info[1],
        institute: info[2],
        name: info[3],
    }
}