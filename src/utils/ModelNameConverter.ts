/**
 * A module for converting the name of a given model to an object containing the model description (project, insitute, name)
 * @module ModelNameConverter */ // used for auto generation of JSDocs with better-docs

/**
 * This function parses a given string representing a model name into a structure of the following form: {project, institute, name}
 *
 * Project_Institute_Modelname (whereas modelname can contain underscores)
 *
 * @param name of the model
 * @returns the regex match object
 * @function
 */
export const convertModelName = (name: string) => {
    const regex = new RegExp('^([^_]+)_([^_]+)_(.*)$');
    const info = name.match(regex);

    if (info === null) {
        return {
            project: '',
            institute: '',
            name,
        };
    }
    return {
        project: info[1],
        institute: info[2],
        name: info[3],
    };
};
