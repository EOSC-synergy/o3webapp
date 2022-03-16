import {createSlice, createAsyncThunk, createAction} from "@reduxjs/toolkit";
import {getModels, getPlotTypes, getPlotData} from "../client/client";
import {getSuggestedValues, preTransformApiData} from "../../../utils/optionsFormatter/optionsFormatter";
import {START_YEAR, END_YEAR, O3AS_PLOTS} from "../../../utils/constants";
import {setDisplayXRangeForPlot, setDisplayYRangeForPlot} from "../../../store/plotSlice/plotSlice";

export let cacheKey = '';

/**
 * This object models an "enum" in JavaScript. Each of the values is used
 * to determine the state of an async request in the redux store. By accessing
 * the stored status components can render differently e.g. displaying a spinner,
 * displaying the fetched data on success or report an error.
 * @constant {object}
 * @category apiSlice
 */
export const REQUEST_STATE = {
    idle: "idle",
    loading: "loading",
    success: "success",
    error: "error",
};

/**
 * This thunk action creator is created via redux toolkit. It allows dispatching
 * asynchronous requests to the store. Internally a start action is dispatched
 * to the store that contains some information e.g. the request is currently loading
 * after the async request has been resolved it either returns the data or the error message
 *
 * This action creator is dispatched against the store at the beginning of the app
 * to fetch the models from the api. 
 * @function
 * @category apiSlice
 */
export const fetchModels = createAsyncThunk('api/fetchModels', async () => {
    const response = await getModels();
    return response.data;
});

/**
 * The description of fetchModels applies to this thunk action creator as well.
 *
 * This action creator is dispatched against the store at the beginning of the app
 * to fetch the plot types from the api.
 * @function
 * @category apiSlice
 */
export const fetchPlotTypes = createAsyncThunk('api/fetchPlotTypes', async () => {
    const response = await getPlotTypes();
    return response.data;
});

/**
 * This function concatenates all given information into a string serving as an identifier
 * for cached requests in the store.
 *
 * @param {int} latMin specifies the minimum latitude
 * @param {int} latMax specifies the maximum latitude
 * @param {array} months represents the selected months
 * @param {string} refModel the reference model to "normalize the data"
 * @param {int} refYear the reference year to "normalize the data"
 * @returns the generated string
 * @function
 * @category apiSlice
 */
export const generateCacheKey = ({latMin, latMax, months, refModel, refYear}) => {
    return `lat_min=${latMin}&lat_max=${latMax}&months=${months.join(',')}&ref_meas=${refModel}&ref_year=${refYear}`;
}

/**
 * This action creator generates an action that is dispatched against the store
 * when the request of the data is initially started. The payload contains the plotId and the cacheKey.
 *
 * This differs from the refetching action because the reducer has to handle the initialization of the
 * object that caches this specific request.
 * @function
 * @category apiSlice
 */
const fetchPlotDataInitiallyPending = createAction("api/fetchPlotData/initiallyPending");

/**
 * This action creator generates an action that is dispatched against the store
 * when a request of existing settings is re-fetched with other models.
 *
 * This differs from the initially fetching action because the existing data structure which stores
 * the cached values only needs to be updated.
 * @function
 * @category apiSlice
 */
const fetchPlotDataRefetching = createAction("api/fetchPlotData/refetching");

/**
 * This action creator generates an action that is dispatched against the store
 * when the request of the data succeeded. The payload object contains the data, the cacheKey and
 * the plotId.
 * @function
 * @category apiSlice
 */
const fetchPlotDataSuccess = createAction("api/fetchPlotData/success");
/**
 * This action creator generates an action that is dispatched against the store
 * when the request of the data failed. The payload object contains the
 * error message, the cacheKey and the plotId.
 * @function
 * @category apiSlice
 */
const fetchPlotDataRejected = createAction("api/fetchPlotData/rejected");
/**
 * This action creator generates an action that is dispatched against the store
 * when the requested data is already in the cache and only needs to be selected.
 * The payload contains the plotId and the cacheKey.
 * @function
 * @category apiSlice
 */
const selectExistingPlotData = createAction("api/selectPlotData");

/**
 * This action encapsulates the operation of fetching the data, unpacking the calculated min and max values of the
 * fetched data which are then used to update the plot with the "suggestions". They are named suggestions because
 * the y-axis of the plot axis is initially set to these values. The user can change them ofcourse. 
 * 
 * @function
 * @category apiSlice
 * @param {string} obj.plotId the name for which the data is fetched
 * @param {string} obj.cacheKey the cache key specifying the settings for the fetched data and where the data is fetched
 * @param {object} obj.data the fetched data from the api
 * @returns the async thunk action that is dispatched against the store.
 */
export const updateDataAndDisplaySuggestions = ({plotId, cacheKey, data, suggest}) => {

    return (dispatch, getState) => {
        dispatch(fetchPlotDataSuccess({data, plotId, cacheKey}));
        if (suggest) {
            const requestData = getState().api.plotSpecific[plotId].cachedRequests[cacheKey].data;


            const {minX, maxX, minY, maxY} = getSuggestedValues(requestData, getState().models);

            dispatch(setDisplayYRangeForPlot({
                plotId,
                minY: Math.floor(minY / 10) * 10,
                maxY: Math.ceil(maxY / 10) * 10
            }));
            if (plotId === O3AS_PLOTS.tco3_zm) {
                dispatch(setDisplayXRangeForPlot({plotId, years: {minX, maxX}}));
            }
        }
    }
}


/**
 * This action serves as the interface the components use to dispatch a fetching request for all current models.
 * It simplifies the interface for the components as they don't need to access the store before and calculate
 * which models should be fetched.
 * 
 * @function
 * @category apiSlice
 * @param {boolean} suggest whether the suggestions should be calculated or not
 * @returns the async thunk function that is dispatched against the store.
 */
export const fetchPlotDataForCurrentModels = (suggest) => {
    if (typeof suggest === "undefined") suggest = true;

    return (dispatch, getState) => {
        dispatch(
            fetchPlotData({plotId: O3AS_PLOTS.tco3_zm, models: getAllSelectedModels(getState), suggest})
        );
        dispatch(
            fetchPlotData({plotId: O3AS_PLOTS.tco3_return, models: getAllSelectedModels(getState), suggest})
        );
    }
}

/**
 * This async thunk creator allows to generate a data fetching action that can be dispatched
 * against the store to start fetching new plot data from the api.
 *
 * @param {String} plotId the plotId
 * @param {Array.<string>} models all selected models
 * @param {boolean} suggest whether the suggestions should be calculated or not
 *
 * @returns the async thunk action
 * @function
 * @category apiSlice
 */
export const fetchPlotData = ({plotId, models, suggest}) => {
    return (dispatch, getState) => {
        if (typeof plotId === "undefined") plotId = getState().plot.plotId; // backwards compatible
        const latMin = getState().plot.generalSettings.location.minLat;
        const latMax = getState().plot.generalSettings.location.maxLat;
        const months = getState().plot.generalSettings.months;
        const startYear = START_YEAR;
        const endYear = END_YEAR;
        const refModel = getState().reference.settings.model;
        const refYear = getState().reference.settings.year;

        cacheKey = generateCacheKey({latMin, latMax, months, refModel, refYear});
        // it shouldn't reload the same request if the data is already present (previous successful request) or 
        // if the request is already loading
        const cachedRequest = getState().api.plotSpecific[plotId].cachedRequests[cacheKey];

        let toBeFetched;

        if (typeof cachedRequest === "undefined") {
            // Initial action dispatched
            toBeFetched = models;
            dispatch(fetchPlotDataInitiallyPending({plotId, cacheKey, loadingModels: toBeFetched}));

        } else {
            const allSelected = getAllSelectedModels(getState);
            const loaded = cachedRequest.loadedModels;   // models that are already loaded
            const loading = cachedRequest.loadingModels; // models that are beeing loaded at the moment

            const required = allSelected.filter(model => !loaded.includes(model) && !loading.includes(model)); // keep only models that are not loaded and currently not loading
            if (required.length === 0) { // fetched data already satisfies users needs
                // old: status == success
                dispatch(selectExistingPlotData({plotId, cacheKey}));
                if (cachedRequest.status === REQUEST_STATE.success) {


                    const {minX, maxX, minY, maxY} = getSuggestedValues(cachedRequest.data, getState().models);

                    dispatch(setDisplayYRangeForPlot({plotId, minY: Math.floor(minY / 10) * 10, maxY: Math.ceil(maxY / 10) * 10}));
                    if (plotId === O3AS_PLOTS.tco3_zm) {
                        dispatch(setDisplayXRangeForPlot({plotId, years: {minX, maxX}}));
                    }

                }
                return Promise.resolve(); // request is already satisfied

            }
            // new fetch is required
            toBeFetched = required;
            dispatch(fetchPlotDataRefetching({plotId, cacheKey, loadingModels: toBeFetched}));
        }

        // Return promise with success and failure actions
        return getPlotData({
            plotId,
            latMin,
            latMax,
            months,
            modelList: toBeFetched,
            startYear,
            endYear,
            refModel,
            refYear
        })
            .then(
                response => dispatch(updateDataAndDisplaySuggestions({
                    plotId,
                    cacheKey,
                    data: response.data,
                    suggest,
                })),
                error => {
                    let errorMessage = error.message;
                    if (error?.response?.data) errorMessage += ": " + error.response.data[0]?.message;
                    dispatch(fetchPlotDataRejected({error: errorMessage, plotId, cacheKey}));
                }
            );


    };
};

/**
 * Gets all selected models from the models slice.
 * 
 * @function
 * @category apiSlice
 * @param {function} getState a function to get the state of the store
 * @returns {Array.<string>} all selected models from the store
 */
export function getAllSelectedModels(getState) {
    let allModels = [];
    const modelGroups = getState().models.modelGroups;
    for (const groupId in modelGroups) {
        const models = Object.keys(modelGroups[groupId].models);
        const filteredModels = models.filter((item) => !allModels.includes(item));
        allModels.push(...allModels, ...filteredModels);
    }
    return Array.from(new Set(allModels));
}

/**
 * This initial state describes how the data fetched from the api is stored in this
 * slice of the redux store.
 *
 * It should be noted that each additional data piece (models/plotTypes) follows the
 * same structure which is very useful to indicate the current status and store
 * potential errors or the returned data.
 * @category API
 * @constant {object}
 * @category apiSlice
 */
const initialState = {
    models: {
        status: REQUEST_STATE.idle,
        error: null,
        data: [],
    },
    plotTypes: {
        status: REQUEST_STATE.idle,
        error: null,
        data: [],
    },
    plotSpecific: {
        tco3_zm: {
            active: null,
            cachedRequests: { // we need to cache: min,max, months, reference year and model

            }
        },
        tco3_return: {
            active: null,
            cachedRequests: {}
        },
    },
};

/**
 * The apiSlice is generated by the redux toolkit. This piece of the
 * store is responsible for storing all data fetched from the api.
 * @function
 * @category apiSlice
 */
const apiSlice = createSlice({
    name: "api",
    initialState,
    reducers: {},
    /**
     * This interface is used to connect the redux thunk action which are returned
     * from the defined thunk action creators (fetchModels, fetchPlotTypes) to
     * this slice of the store.
     * 
     * @category apiSlice
     * @param {object} builder an object handed by the redux toolkit to add these
     *                         "external" reducers to this slice
     */
    extraReducers(builder) {
        builder
            // fetch models
            .addCase(fetchModels.pending, (state) => {
                state.models.status = REQUEST_STATE.loading;
            })
            .addCase(fetchModels.fulfilled, (state, action) => {
                state.models.status = REQUEST_STATE.success;
                state.models.data = action.payload;
            })
            .addCase(fetchModels.rejected, (state, action) => {
                state.models.status = REQUEST_STATE.error;
                state.models.error = action.error.message;
            })

            // fetch plotTypes
            .addCase(fetchPlotTypes.pending, (state) => {
                state.plotTypes.status = REQUEST_STATE.loading;
            })
            .addCase(fetchPlotTypes.fulfilled, (state, action) => {
                state.plotTypes.status = REQUEST_STATE.success;
                state.plotTypes.data = action.payload;
            })
            .addCase(fetchPlotTypes.rejected, (state, action) => {
                state.plotTypes.status = REQUEST_STATE.error;
                state.plotTypes.error = action.error.message;
            })

            // fetch plot data
            .addCase(fetchPlotDataInitiallyPending, (state, action) => {
                const {plotId, cacheKey, loadingModels} = action.payload;
                const plotSpecificSection = state.plotSpecific[plotId];

                plotSpecificSection.cachedRequests[cacheKey] = {
                    status: REQUEST_STATE.loading,
                    loadingModels: [...loadingModels], // models that are currently beeing fetched
                    loadedModels: [],
                    error: null,
                    data: {},
                };
                plotSpecificSection.active = cacheKey; // select this request after dispatching it
            })
            .addCase(fetchPlotDataRefetching, (state, action) => {
                const {plotId, cacheKey, loadingModels} = action.payload;
                const plotSpecificSection = state.plotSpecific[plotId];
                const cachedRequest = plotSpecificSection.cachedRequests[cacheKey];
                cachedRequest.status = REQUEST_STATE.loading;
                cachedRequest.loadingModels.push(...loadingModels);

                plotSpecificSection.active = cacheKey; // select this request after dispatching it
            })
            .addCase(fetchPlotDataSuccess, (state, action) => {
                const { data, plotId, cacheKey } = action.payload;
                const storage = state.plotSpecific[plotId].cachedRequests[cacheKey];

                const { lookUpTable } = preTransformApiData({plotId, data});
                Object.assign(storage.data, lookUpTable); // copy over new values

                // update loaded / loading
                const fetchedModels = Object.keys(lookUpTable)
                storage.loadingModels = storage.loadingModels.filter(model => !fetchedModels.includes(model)); // remove all models that are now fetched
                storage.loadedModels = [...storage.loadedModels, ...fetchedModels];

                if (storage.loadingModels.length === 0) {
                    storage.status = REQUEST_STATE.success; // display models
                }

            })
            .addCase(fetchPlotDataRejected, (state, action) => {
                const {error, plotId, cacheKey} = action.payload;
                const storage = state.plotSpecific[plotId].cachedRequests[cacheKey];
                storage.status = REQUEST_STATE.error;
                storage.error = error;
                storage.loadedModels = []; // everything should be refetched if an error occurred
                storage.loadingModels = []; // loading failed, reset all, otherwise re-loading wouldn't be possible
            })

            // select existing data from cache
            .addCase(selectExistingPlotData, (state, action) => {
                const {plotId, cacheKey} = action.payload;
                state.plotSpecific[plotId].active = cacheKey; // update by chaining the active value to the existing cacheKey
            })
    },
});

/**
 * The reducer combining all reducers defined in the plot slice.
 * This has to be included in the redux store, otherwise dispatching
 * the above defined actions wouldn't trigger state updates.
 * @categroy Services
 * @subcategory API
 * @constant {object}
 * @category apiSlice
 */
export default apiSlice.reducer;

/**
 * This selector allows components (=> {@link Graph}) to "listen" for the active plot data
 * of the current selected plot. That means whenever this data is about to change, e.g. because
 * a new fetch request is dispatched, the component re-renders.
 *
 * @param {object} state the state, handed by redux
 * @param {string} plotId identifies the plot
 * @returns the current active data for the active plot
 * @function
 * @category apiSlice
 */
export const selectActivePlotData = (state, plotId) => {
    const plotSpecificSection = state.api.plotSpecific[plotId];
    const activeCacheKey = plotSpecificSection.active;
    if (activeCacheKey === null) { // no data is present yet, return dummy to indicate loading!
        return {
            status: REQUEST_STATE.loading,
        };
    }

    return plotSpecificSection.cachedRequests[activeCacheKey];
}