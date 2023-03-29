import { NO_MONTH_SELECTED } from 'utils/constants';
import { ApiApi, Configuration, DataApi, ModelsApi, O3Data, PlotsApi } from './generated-client';

/**
 * This module is responsible for the communication with the
 * [API]{@link https://api.o3as.fedcloud.eu/api/v1/ui/} and it handles the fetching of the relevant
 * data. The fetched data is then applied to the corresponding element in the redux store. It sets
 * up and implements all relevant reducers for the interchange with the API and manages the request
 * state of the webapp.
 *
 * @module API
 */ // used for auto generation of JSDocs with better-docs

/**
 * The base URL of the API. It is used as the destination address for all API requests.
 *
 * @constant {string}
 */
const baseURL = process.env.NEXT_PUBLIC_API_HOST ?? 'https://api.o3as.fedcloud.eu/api/v1';

/**
 * The timeout value at which an error is thrown and fetching data stops in milliseconds
 *
 * @constant {number}
 */
const timeoutVal = 5 * 60 * 1000; // 5 min at least (fetching the models took 29s)

const DEFAULT_CONFIG = {
    basePath: baseURL,
    baseOptions: {
        timeout: timeoutVal,
    },
};

/*
const useModelApi = buildApi(ModelsApi);
const useDataApi = buildApi(DataApi);
const useApiApi = buildApi(ApiApi);
const usePlotsApi = buildApi(PlotsApi);
 */
const _configuration = new Configuration(DEFAULT_CONFIG);
export const modelsApi = new ModelsApi(_configuration);
export const dataApi = new DataApi(_configuration);
export const apiApi = new ApiApi(_configuration);
export const plotsApi = new PlotsApi(_configuration);

/**
 * Gets the plot types from the API.
 *
 * @function
 * @returns The request promise from axios
 */
export const getPlotTypes = () => {
    return plotsApi.o3apiApiGetPlotTypes();
};

/**
 * Gets the models from the API.
 *
 * @example
 *     getModels('tco3_zm', 'refC2');
 *
 * @function
 * @param plotType The plot type for which the models should be fetched
 * @param select A selection of specific models
 * @returns The request promise from axios
 */
export const getModels = async (plotType?: string, select?: string) => {
    return await modelsApi.o3apiApiGetModelsList({
        ptype: plotType,
        select,
    });
};

export const postModelsPlotStyle = async (plotType: string) => {
    /**
     * Gets the plot style via a post request.
     *
     * @example
     *     postModelsPlotStyle('tco3_zm');
     *
     * @function
     * @param plotType The plot type for which the plot style should be fetched
     * @returns The request promise from axios
     */
    return await modelsApi.o3apiApiGetPlotStyle({
        ptype: plotType,
    });
};

export type LEGAL_PLOT_ID = 'tco3_zm' | 'tco3_return';

/**
 * Performs a request to /plots/plotId to fetch the plot data from the API formatted with the given
 * parameters.
 *
 * @example
 *     getPlotData({
 *         plotId: 'tco3_zm',
 *         latMin: -90,
 *         latMax: 90,
 *         months: [1],
 *         modelList: ['CCMI-1_ACCESS_ACCESS-CCM-refC2'],
 *         startYear: 1960,
 *         endYear: 2100,
 *         refModel: 'CCMI-1_ACCESS_ACCESS-CCM-refC2',
 *         refYear: 1980,
 *     });
 *
 * @function
 * @param plotId A string describing the plot - has to be the official plot name (e.g. tco3_zm)
 * @param latMin Specifies the minimum latitude
 * @param latMax Specifies specifying the maximum latitude
 * @param months Represents the selected months
 * @param modelList Lists the desired models
 * @param startYear From which point the data should start
 * @param endYear Until which point the data is required
 * @param refModel The reference model to "normalize the data"
 * @param refYear The reference year to "normalize the data"
 * @returns The request promise from axios
 */
export const getPlotData = async ({
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
    plotId: LEGAL_PLOT_ID;
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
        return Promise.resolve({ data: [] as O3Data[] });
    }

    if (plotId === 'tco3_zm') {
        return await plotsApi.o3apiApiPlotTco3Zm({
            begin: startYear,
            end: endYear,
            // TODO: typing? API spec says array number, old code did string join
            month: months,
            latMin,
            latMax,
            refMeas: refModel,
            refYear: refYear,
            models: modelList,
        });
    }
    return await plotsApi.o3apiApiPlotTco3Return({
        month: months,
        latMin,
        latMax,
        refMeas: refModel,
        refYear,
        models: modelList,
    });
};
