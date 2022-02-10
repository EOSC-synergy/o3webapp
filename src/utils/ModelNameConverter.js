/**
 * This function parses a given string like the structure of the
 * models were described by Valentin and Tobias (aka der Betreuer-Gang):
 * 
 * Project_Institute_Modelname (whereas modelname can contain underscores)
 * 
 * @param {string} name of the model
 * @returns the regex match object
 */
export const convertModelName = (name) => {
    if (typeof name !== 'string') {
        throw("provided name that is not of type string");
    }
    const regex = new RegExp("^([^_]+)_([^_]+)_(.*)$");
    const info = name.match(regex);
    if (info.length < 4) { 
        return {
            project: "",
            institute: "",
            name: name
        }
    }
    return {
        project: info[1],//info[0],
        institute: info[2],//info[2],
        name: info[3],//info[4]
    }
}