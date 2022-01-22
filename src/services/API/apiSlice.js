import { createSlice, createAsyncThunk, createAction } from "@reduxjs/toolkit";
import { getModels, getPlotTypes, getPlotData } from "./client";

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
 * This thunk action creator generates an action on call that can be dispatched
 * against the store to start a fetch of the required raw plot data.
 */
export const fetchRawPlotData = createAsyncThunk('api/fetchRawPlotData', 
    // dispatch loading action?

    async ({ plotType, latMin, latMax, months, startYear, endYear, modelList }, thunkAPI) => {
    const plotId = thunkAPI.getState().plot.plotId; // store current calling plotId
    const response = await getPlotData(plotType, latMin, latMax, months, startYear, endYear, modelList);
    return {data: response.data, plotId: plotId};
});

/**
 * This function concatenates all given information into a string serving as an identifier
 * for cached requests in the store.
 * 
 * @param {int} obj.latMin specifies the minimum latitude
 * @param {int} obj.latMax specifies the maximum latitude
 * @param {array of int} obj.months represents the selected months
 * @param {string} obj.refModel the reference model to "normalize the data"
 * @param {int} obj.refYear the reference year to "normalize the data"
 * @returns the generated string
 */
const generateCacheKey = ({ latMin, latMax, months, refModel, refYear }) => {
    return `lat_min=${latMin}&lat_min=${latMax}&months=${months.join(',')}&ref_meas=${refModel}&ref_year=${refYear}`;
}

/**
 * This action creator generates an action that is dispatched against the store 
 * when the request of the data is started. The payload contains the plotId.
 */
const fetchPlotDataPending =  createAction("api/fetchPlotData/pending");
/**
 * This action creator generates an action that is dispatched against the store 
 * when the request of the data succeded. The payload object contains the data and 
 * the plotId.
 */
const fetchPlotDataSuccess =  createAction("api/fetchPlotData/success");
/**
 * This action creator generates an action that is dispatched against the store 
 * when the request of the data failed. The playload object contains the 
 * error message and the plotId.
 */
const fetchPlotDataRejected = createAction("api/fetchPlotData/rejected");

/**
 * This async thunk creator allows to generate a data fetching action that can be dispatched 
 * against the store to start fetching new plot data from the api. 
 * 
 * @param {string} obj.plotType a string describing the plot - has to be the offical plot name (e.g. tco3_zm)
 * @param {int} obj.latMin specifies the minimum latitude
 * @param {int} obj.latMax specifies the maximum latitude
 * @param {array of int} obj.months represents the selected months
 * @param {array of string} obj.modelList lists the desired models
 * @param {int} obj.startYear from which point the data should start
 * @param {int} obj.endYear until which point the data is required
 * @param {string} obj.refModel the reference model to "normalize the data"
 * @param {int} obj.refYear the reference year to "normalize the data"
 * @returns the async thunk action
 */
export const fetchPlotData = ({ plotId, latMin, latMax, months, startYear, endYear, modelList, refModel, refYear }) => {
    const cacheKey = generateCacheKey({ latMin, latMax, months, refModel, refYear });

    return (dispatch) => {     
      // Initial action dispatched
      dispatch(fetchPlotDataPending({plotId, cacheKey}));

      // Return promise with success and failure actions
      
      return getPlotData({plotId, latMin, latMax, months, modelList, startYear, endYear, refModel, refYear}).then(  
        response => dispatch(fetchPlotDataSuccess({data: response.data, plotId, cacheKey})),
        error => dispatch(fetchPlotDataRejected({error: error.message, plotId, cacheKey}))
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
            cachedRequests: {

            }
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
    reducers: {

    },
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
            .addCase(fetchModels.pending, (state, action) => {
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
            .addCase(fetchPlotTypes.pending, (state, action) => {
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
                const { plotId, cacheKey } = action.payload;
                const plotSpecificSection = state.plotSpecific[plotId];
                
                plotSpecificSection.cachedRequests[cacheKey] = {
                    status: REQUEST_STATE.loading,
                    error: null,
                    data: [],
                };
                plotSpecificSection.active = cacheKey; // select this request after dispatching it
            })
            .addCase(fetchPlotDataSuccess, (state, action) => {
                const { data, plotId, cacheKey } = action.payload;
                const storage = state.plotSpecific[plotId].cachedRequests[cacheKey];
                storage.status = REQUEST_STATE.success;
                storage.data = data; // Consider for later: transforming might optimize performance
            })
            .addCase(fetchPlotDataRejected, (state, action) => {
                const { error, plotId, cacheKey } = action.payload;
                const storage = state.plotSpecific[plotId].cachedRequests[cacheKey];
                storage.status = REQUEST_STATE.error;
                storage.error = error;
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
 * @returns the current active data for the 
 */
export const selectActivePlotData = (state, plotId) => {
    const plotSpecificSection = state.api.plotSpecific[plotId];
    const activeCacheKey = plotSpecificSection.active;
    if (activeCacheKey === null) { // no data is present yet, return dummy to indicate loading!
        return {
            status: REQUEST_STATE.loading,
        };
    };

    return plotSpecificSection.cachedRequests[activeCacheKey];
}