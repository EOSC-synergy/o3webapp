import axios from 'axios';

const baseURL = "https://api.o3as.fedcloud.eu/api/v1";

const timeoutVal = 5000;


const getFromAPI = (endpoint) => {
    return axios.get(baseURL + endpoint, { timeout: timeoutVal });
}

const postAtAPI = (endpoint, data) => {
    return axios.post(baseURL + endpoint, { data }, { timeout: timeoutVal });
}

export const getPlotTypes = () => {
  return getFromAPI("/data");
};

export const postData = (plotType, data) => { // TODO: remove?
    return postAtAPI(
        `/data/${plotType}`,
        { data }
    );
}

export const getModels = (plotType, select) => {
    const hasPlotType = typeof plotType !== "undefined";
    const hasSelect = typeof select !== "undefined";
    const hasOne = hasPlotType || hasSelect;
    const hasBoth = hasPlotType && hasSelect;
    
    return getFromAPI(
        `/models${hasOne ? "?" : ""}${hasPlotType ? `ptype=${plotType}` : ""}${hasBoth ? "&" : ""}${hasSelect ? `select=${select}` : ""}`);
}

export const postModelsPlotStyle = (plotType) => {
    return postAtAPI(
        '/models/plotstyle',
        {
            ptype: plotType
        }
    );
}

/**
 * 
 * @param {*} plotType 
 * @param {*} latMin 
 * @param {*} latMax 
 * @param {*} months 
 * @param {*} startYear 
 * @param {*} endYear 
 * @param {*} modelList 
 * @returns 
 */
export const getRawData = (plotType, latMin, latMax, months, startYear, endYear, modelList) => {
    return postAtAPI(
        `/data/${plotType}?begin=${startYear}&end=${endYear}&month=${months.join(",")}&lat_min=${latMin}&lat_max=${latMax}`,
        { modelList }
    );
}