import axios from 'axios';
import { NO_MONTH_SELECTED } from 'utils/constants';

/**
 * This module is responsible for the communication with the [API]{@link https://api.o3as.fedcloud.eu/api/v1/ui/} and
 * it handles the fetching of the relevant data.
 * The fetched data is then applied to the corresponding element in the redux store.
 * It sets up and implements all relevant reducers for the interchange with the API and
 * manages the request state of the webapp.
 *
 * @module API
 * */ // used for auto generation of JSDocs with better-docs

/**
 * The base URL of the API.
 * It is used as the destination address for all API requests.
 * @constant {string}
 */
const baseURL = 'https://api.o3as.fedcloud.eu/api/v1';

/**
 * The timeout value at which an error is thrown and fetching data stops in milliseconds
 * @constant {number}
 */
const timeoutVal = 5 * 60 * 1000; // 5 min at least (fetching the models took 29s)

/**
 * Makes a GET request to a specified endpoint of the API.
 *
 * @param endpoint the endpoint of the URL
 * @returns the request promise from axios
 * @function
 * @example getFromAPI("/plots")
 */
const getFromAPI = (endpoint: string) => {
    return axios.get(baseURL + endpoint, { timeout: timeoutVal });
};

/**
 * Makes a POST request to a specified endpoint of the API with the given data.
 *
 * @param endpoint the endpoint of the URL
 * @param data the data for the params of the post request
 * @returns the request promise from axios
 * @function
 * @example postAtAPI("/models/plotstyle", {ptype: "tco3_zm"})
 */
const postAtAPI = (endpoint: string, data: unknown) => {
    // don't pack "data" in an object, the api accepts only an array of values (e.g. model list)
    return axios.post(baseURL + endpoint, data, { timeout: timeoutVal });
};

/**
 * Gets the plot types from the API.
 *
 * @returns the request promise from axios
 * @function
 */
export const getPlotTypes = () => {
    return getFromAPI('/plots');
};

/**
 * Gets the models from the API.
 *
 * @param plotType the plot type for which the models should be fetched
 * @param select a selection of specific models
 * @returns the request promise from axios
 * @function
 * @example getModels("tco3_zm", "refC2")
 */
export const getModels = (
    plotType: string | undefined = undefined,
    select: string | undefined = undefined
) => {
    const hasPlotType = plotType != undefined;
    const hasSelect = select != undefined;
    const hasOne = hasPlotType || hasSelect;
    const hasBoth = hasPlotType && hasSelect;

    return getFromAPI(
        `/models${hasOne ? '?' : ''}${hasPlotType ? `ptype=${plotType}` : ''}${hasBoth ? '&' : ''}${
            hasSelect ? `select=${select}` : ''
        }`
    );
};

/**
 * Gets the plot style via a post request.
 *
 * @param plotType the plot type for which the plot style should be fetched
 * @returns the request promise from axios
 * @function
 * @example postModelsPlotStyle("tco3_zm")
 */
export const postModelsPlotStyle = (plotType: string) => {
    return postAtAPI('/models/plotstyle', {
        ptype: plotType,
    });
};

/**
 * Performs a request to /plots/plotId to fetch the plot data from the API formatted with the given parameters.
 *
 * @param plotId a string describing the plot - has to be the official plot name (e.g. tco3_zm)
 * @param latMin specifies the minimum latitude
 * @param latMax specifies specifying the maximum latitude
 * @param months represents the selected months
 * @param modelList lists the desired models
 * @param startYear from which point the data should start
 * @param endYear until which point the data is required
 * @param refModel the reference model to "normalize the data"
 * @param refYear the reference year to "normalize the data"
 * @returns the request promise from axios
 * @function
 * @example getPlotData({
 *              plotId: "tco3_zm",
 *              latMin: -90,
 *              latMax: 90,
 *              months: [1],
 *              modelList: ["CCMI-1_ACCESS_ACCESS-CCM-refC2"],
 *              startYear: 1960,
 *              endYear: 2100,
 *              refModel: "CCMI-1_ACCESS_ACCESS-CCM-refC2",
 *              refYear: 1980
 *          })
 */
export const getPlotData = ({
    plotId,
    latMin,
    latMax,
    months,
    modelList,
    startYear,
    endYear,
    refModel,
    refYear,
}: {
    plotId: string;
    latMin: number;
    latMax: number;
    months: number[];
    modelList: string[];
    startYear: number;
    endYear: number;
    refModel: string;
    refYear: number;
}) => {
    if (months.length === 0) {
        return Promise.reject(new Error(NO_MONTH_SELECTED));
    }
    if (modelList.length === 0) {
        return Promise.resolve({ data: [] });
    }

    if (plotId === 'tco3_zm') {
        return postAtAPI(
            `/plots/${plotId}?begin=${startYear}&end=${endYear}&month=${months.join(
                ','
            )}&lat_min=${latMin}&lat_max=${latMax}&ref_meas=${refModel}&ref_year=${refYear}`,
            modelList
        );
    } else if (plotId === 'tco3_return') {
        return postAtAPI(
            `/plots/${plotId}?month=${months.join(
                ','
            )}&lat_min=${latMin}&lat_max=${latMax}&ref_meas=${refModel}&ref_year=${refYear}`,
            modelList
        );
    }
};
