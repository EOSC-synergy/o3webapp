import {createSlice, createAsyncThunk, createAction} from "@reduxjs/toolkit";
import {getModels, getPlotTypes, getPlotData} from "./client";
import {preTransformApiData} from "../../utils/optionsFormatter/optionsFormatter";
import {START_YEAR, END_YEAR} from "../../utils/constants";
import {setDisplayYRange, setDisplayYRangeForPlot} from "../../store/plotSlice/plotSlice";

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
const fetchPlotDataPending = createAction("api/fetchPlotData/pending");
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
        dispatch(fetchPlotDataSuccess({data, plotId, cacheKey, modelsSlice}))
        const {min, max} = getState().api.plotSpecific[plotId].cachedRequests[cacheKey].suggested; // suggested min/max is availabe
        dispatch(setDisplayYRangeForPlot({plotId, minY: Math.floor(min / 10) * 10, maxY: Math.ceil(max / 10) * 10}));
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
export const fetchPlotData = ({plotId, modelListBegin, modelListEnd}) => {

    return (dispatch, getState) => {
        if (typeof plotId === "undefined") plotId = getState().plot.plotId; // backwards compatible
        const latMin = getState().plot.generalSettings.location.minLat;
        const latMax = getState().plot.generalSettings.location.maxLat;
        const months = getState().plot.generalSettings.months;
        let modelList = getState().api.models.data.filter(modelName => modelName.includes("refC2") || modelName.includes("ACCESS"));
        /*
        if (typeof modelListBegin !== 'undefined' && typeof modelListEnd !== 'undefined') {
            modelList = modelList.slice(modelListBegin, modelListEnd);
        }
        */
        const startYear = START_YEAR;
        const endYear = END_YEAR;
        const refModel = getState().reference.settings.model;
        const refYear = getState().reference.settings.year;

        const cacheKey = generateCacheKey({latMin, latMax, months, refModel, refYear});
        // it shouldn't reload the same request if the data is already present (previous successful request) or 
        // if the request is already loading
        const cachedRequest = getState().api.plotSpecific[plotId].cachedRequests[cacheKey];

        if (typeof cachedRequest === "undefined") {
            // do nothing
        } else if (cachedRequest.status === REQUEST_STATE.loading) {
            // just select the current data obj (=> display loading spinner accordingly)
            dispatch(selectExistingPlotData({plotId, cacheKey}));
            return;
        } else if (cachedRequest.status === REQUEST_STATE.success) {
            dispatch(selectExistingPlotData({plotId, cacheKey}));
            const {min, max} = getState().api.plotSpecific[plotId].cachedRequests[cacheKey].suggested; // suggested min/max is availabe
            dispatch(setDisplayYRangeForPlot({plotId, minY: Math.floor(min), maxY: Math.floor(max)}));
            return Promise.resolve(); // request is already satisfied
        }

        // Initial action dispatched
        dispatch(fetchPlotDataPending({plotId, cacheKey}));

        // Return promise with success and failure actions

        return getPlotData({plotId, latMin, latMax, months, modelList, startYear, endYear, refModel, refYear})
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
            .addCase(fetchPlotDataPending, (state, action) => {
                const {plotId, cacheKey} = action.payload;
                const plotSpecificSection = state.plotSpecific[plotId];

                plotSpecificSection.cachedRequests[cacheKey] = {
                    status: REQUEST_STATE.loading,
                    error: null,
                    data: [],
                    suggested: null, // this holds the suggested min / max values
                };
                plotSpecificSection.active = cacheKey; // select this request after dispatching it
            })
            .addCase(fetchPlotDataSuccess, (state, action) => {
                const {data, plotId, cacheKey, modelsSlice} = action.payload;
                const storage = state.plotSpecific[plotId].cachedRequests[cacheKey];
                storage.status = REQUEST_STATE.success;
                const {lookUpTable, min, max} = preTransformApiData({plotId, data, modelsSlice});
                storage.data = lookUpTable;
                storage.suggested = {min, max};

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