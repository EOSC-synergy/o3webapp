export const convertModelName = (name) => {
    if (typeof name !== 'string') {
        throw("provided name that is not of type string");
    }
    const regex= /([a-z]|[A-Z]|[0-9]|-)*/g;
    const info = name.match(regex);
    if (info.length < 4) { 
        return {
            project: "",
            institute: "",
            name: name
        }
    }
    return {
        project: info[0],
        institute: info[2],
        name: info[4]
    }
}