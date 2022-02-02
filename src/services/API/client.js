import axios from 'axios';

/** The base URL */
const baseURL = "https://api.o3as.fedcloud.eu/api/v1";

/** The timeout value at which an error is thrown and fetching data stops in milliseconds */
const timeoutVal = 2 * 60 * 1000; // 1 min at least (fetching the models took 29s)

/**
 * Makes a GET request.
 *
 * @param {string} endpoint the endpoint of the URL
 * @returns the request promise from axios
 */
const getFromAPI = (endpoint) => {
    return axios.get(baseURL + endpoint, { timeout: timeoutVal });
}

/**
 * Makes a POST request.
 *
 * @param {string} endpoint the endpoint of the URL
 * @param {Array.<Object>} data the data for the params of the post request
 * @returns the request promise from axios
 */
const postAtAPI = (endpoint, data) => {
    // don't pack "data" in an object, the api accepts only an array of values (e.g. model list)
    return axios.post(baseURL + endpoint, data, { timeout: timeoutVal }); 
}

/**
 * Gets the plot types.
 *
 * @returns the request promise from axios
 */
export const getPlotTypes = () => {
  return getFromAPI("/plots");
};

/**
 * Gets the models.
 *
 * @param {string} plotType the plot type for which the models should be fetched
 * @param {string} select a selection of specific models
 * @returns the request promise from axios
 */
export const getModels = (plotType, select) => {
    const hasPlotType = typeof plotType !== "undefined";
    const hasSelect = typeof select !== "undefined";
    const hasOne = hasPlotType || hasSelect;
    const hasBoth = hasPlotType && hasSelect;
    
    return getFromAPI(
        `/models${hasOne ? "?" : ""}${hasPlotType ? `ptype=${plotType}` : ""}${hasBoth ? "&" : ""}${hasSelect ? `select=${select}` : ""}`);
}

/**
 * Gets the plot style via a post request.
 *
 * @param {string} plotType the plot type for which the plot style should be fetched
 * @returns the request promise from axios
 */
export const postModelsPlotStyle = (plotType) => {
    return postAtAPI(
        '/models/plotstyle',
        {
            ptype: plotType
        }
    );
}

/**
 * Performs a request to /plots/plotId to fetch the plot data from the api formatted with the given parameters.
 * 
 * @param {string} plotId a string describing the plot - has to be the offical plot name (e.g. tco3_zm)
 * @param {int} latMin specifies the minimum latitude
 * @param {int} latMax specifies specifying the maximum latitude
 * @param {Array.<int>} months represents the selected months
 * @param {Array.<String>} modelList lists the desired models
 * @param {int} startYear from which point the data should start
 * @param {int} endYear until which point the data is required
 * @param {string} refModel the reference model to "normalize the data"
 * @param {int} refYear the reference year to "normalize the data"
 * @returns the request promise from axios
 */
export const getPlotData = ({plotId, latMin, latMax, months, modelList, startYear, endYear, refModel, refYear}) => {
    if (months.length === 0) {
        throw new Error("requesting with an empty array will be rejected by the api");
    }
    return postAtAPI(
        `/plots/${plotId}?begin=${startYear}&end=${endYear}&month=${months.join(",")}&lat_min=${latMin}&lat_max=${latMax}&ref_meas=${refModel}&ref_year=${refYear}`,
        modelList
    );
}