import {createSlice, createAsyncThunk, createAction} from "@reduxjs/toolkit";
import {getModels, getPlotTypes, getPlotData} from "./client";
import {preTransformApiData} from "../../utils/optionsFormatter/optionsFormatter";
import {START_YEAR, END_YEAR, O3AS_PLOTS} from "../../utils/constants";
import {setDisplayYRangeForPlot} from "../../store/plotSlice/plotSlice";

/**
 * This object models an "enum" in JavaScript. Each of the values is used
 * to determine the state of an async request in the redux store. By accessing
 * the stored status components can render differently e.g. displaying a spinner,
 * displaying the fetched data on success or report an error.
 */
export const REQUEST_STATE = {
    idle: "idle",
    loading: "loading",
    success: "success",
    error: "error",
};

/**
 * This thunk action creater is created via redux toolkit. It allows to dispatch
 * asynchronous requests to the store. Internally a start action is dispatched
 * to the store that contains some information e.g. the request is currently loading
 * after the async request has been resolved it either returns the data or the error message
 *
 * This action creater is dispatched against the store at the beginning of the app
 * to fetch the models from the api.
 */
export const fetchModels = createAsyncThunk('api/fetchModels', async () => {
    const response = await getModels();
    return response.data;
});

/**
 * The description of fetchModels applies to this thunk action creater as well.
 *
 * This action creater is dispatched against the store at the beginning of the app
 * to fetch the plot types from the api.
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
 * @param {Array.<int>} months represents the selected months
 * @param {string} refModel the reference model to "normalize the data"
 * @param {int} refYear the reference year to "normalize the data"
 * @returns the generated string
 */
export const generateCacheKey = ({latMin, latMax, months, refModel, refYear}) => {
    return `lat_min=${latMin}&lat_min=${latMax}&months=${months.join(',')}&ref_meas=${refModel}&ref_year=${refYear}`;
}

/**
 * This action creator generates an action that is dispatched against the store
 * when the request of the data is started. The payload contains the plotId and the cacheKey.
 */
const fetchPlotDataInitiallyPending = createAction("api/fetchPlotData/initiallyPending");

const fetchPlotDataRefetching = createAction("api/fetchPlotData/refetching");

/**
 * This action creator generates an action that is dispatched against the store
 * when the request of the data succeded. The payload object contains the data, the cacheKey and
 * the plotId.
 */
const fetchPlotDataSuccess = createAction("api/fetchPlotData/success");
/**
 * This action creator generates an action that is dispatched against the store
 * when the request of the data failed. The playload object contains the
 * error message, the cacheKey and the plotId.
 */
const fetchPlotDataRejected = createAction("api/fetchPlotData/rejected");
/**
 * This action creator generates an action that is dispatched against the store
 * when the requested data is already in the cache and only needs to be selected.
 * The payload contains the plotId and the cacheKey.
 */
const selectExistingPlotData = createAction("api/selectPlotData");


export const updateDataAndDisplaySuggestions = ({plotId, cacheKey, data, modelsSlice}) => {
    
    return (dispatch, getState) => {
        dispatch(fetchPlotDataSuccess({data, plotId, cacheKey, modelsSlice}));
        const {min, max} = getState().api.plotSpecific[plotId].cachedRequests[cacheKey].suggested; // suggested min/max is availabe
        dispatch(setDisplayYRangeForPlot({plotId, minY: Math.floor(min / 10) * 10, maxY: Math.ceil(max / 10) * 10}));
    }
}



export const fetchPlotDataForCurrentModels = () => {
    return (dispatch, getState) => {
        dispatch(
            
            fetchPlotData({plotId: O3AS_PLOTS.tco3_zm, models: getAllSelectedModels(getState)})
        );
        dispatch(
            fetchPlotData({plotId:  O3AS_PLOTS.tco3_return, models: getAllSelectedModels(getState)})
        )
    } 
}

/**
 * This async thunk creator allows to generate a data fetching action that can be dispatched
 * against the store to start fetching new plot data from the api.
 *
 * @param {number} modelListBegin for faster testing limit fetching of model list
 * @param {number} modelListEnd for faster testing limit fetching of model list
 * @returns the async thunk action
 */
export const fetchPlotData = ({plotId, models}) => {

    return (dispatch, getState) => {
        if (typeof plotId === "undefined") plotId = getState().plot.plotId; // backwards compatible
        const latMin = getState().plot.generalSettings.location.minLat;
        const latMax = getState().plot.generalSettings.location.maxLat;
        const months = getState().plot.generalSettings.months;
        const startYear = START_YEAR;
        const endYear = END_YEAR;
        const refModel = getState().reference.settings.model;
        const refYear = getState().reference.settings.year;

        const cacheKey = generateCacheKey({latMin, latMax, months, refModel, refYear});
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
            console.log(allSelected);

            if (required.length === 0) { // fetched data already satisfies users needs
                // old: status == success
                dispatch(selectExistingPlotData({plotId, cacheKey}));
                if (cachedRequest.status === REQUEST_STATE.success) {
                    const {min, max} = cachedRequest.suggested; // suggested min/max is availabe
                    dispatch(setDisplayYRangeForPlot({plotId, minY: Math.floor(min), maxY: Math.floor(max)}));
                }
                return Promise.resolve(); // request is already satisfied

            } 
            // new fetch is required
            toBeFetched = required;
            dispatch(fetchPlotDataRefetching({plotId, cacheKey, loadingModels: toBeFetched}));
        }

        // Return promise with success and failure actions
        return getPlotData({plotId, latMin, latMax, months, modelList: toBeFetched, startYear, endYear, refModel, refYear})
            .then(
                response => dispatch(updateDataAndDisplaySuggestions({
                    plotId,
                    cacheKey,
                    data: response.data,
                    modelsSlice: getState().models
                })),
                error => dispatch(fetchPlotDataRejected({error: error.message, plotId, cacheKey})),
            );
        

    };
};

/**
 * Get's all selected models from the models slice.
 * 
 * @param {function} getState a function to get the state of the store
 * @returns all selected models from the store
 */
export function getAllSelectedModels(getState) {
    let allModels = [];
    const modelGroups = getState().models.modelGroups;
    for (const groupId in modelGroups) {
        const models = Object.keys(modelGroups[groupId].models);
        const filteredModels = models.filter((item) => !allModels.includes(item));
        allModels = [...allModels, ...filteredModels];
    }
    return allModels;
}

/**
 * This initial state describes how the data fetched from the api is stored in this
 * slice of the redux store.
 *
 * It should be noted that each additional data piece (models/plotTypes) follows the
 * same structure which is very useful to indicate the current status and store
 * potential errors or the returned data.
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
                    suggested: null, // this holds the suggested min / max values
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
                const {data, plotId, cacheKey, modelsSlice} = action.payload;
                const storage = state.plotSpecific[plotId].cachedRequests[cacheKey];
                console.log(storage.status)
                const {lookUpTable, min, max} = preTransformApiData({plotId, data, modelsSlice});
                Object.assign(storage.data, lookUpTable); // copy over new values

                // update loaded / loading
                const fetchedModels = Object.keys(lookUpTable)
                storage.loadingModels = storage.loadingModels.filter(model => !fetchedModels.includes(model)); // remove all models that are now fetched
                storage.loadedModels = [...storage.loadedModels, ...fetchedModels];

                storage.status = REQUEST_STATE.success; // display models

                // update suggestions
                if (storage.suggested) {
                    const {min: oldMin, max: oldMax} = storage.suggested;
                    storage.suggested = {
                        min: Math.min(min, oldMin), 
                        max: Math.max(max, oldMax)
                    };
                } else {
                    storage.suggested = {min, max};
                }
            })
            .addCase(fetchPlotDataRejected, (state, action) => {
                const {error, plotId, cacheKey} = action.payload;
                const storage = state.plotSpecific[plotId].cachedRequests[cacheKey];
                storage.status = REQUEST_STATE.error;
                storage.error = error;
            })

            // select existing data from cache
            .addCase(selectExistingPlotData, (state, action) => {
                const {plotId, cacheKey} = action.payload;
                state.plotSpecific[plotId].active = cacheKey; // update by chaning the active value to the existing cachekey
            })
    },
});

/**
 * The reducer combining all reducers defined in the plot slice.
 * This has to be included in the redux store, otherwise dispatching
 * the above defined actions wouldn't trigger state updates.
 */
export default apiSlice.reducer;

/**
 * This selectors allows components (=> the graph) to "listen" for the active plot data
 * of the current selected plot. That means whenever this data is about to change, e.g. because
 * a new fetch request is dispatched, the component rerenders.
 *
 * @param {object} state the state, handed by redux
 * @param {string} plotId identifies the plot
 * @returns the current active data for the active plot
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