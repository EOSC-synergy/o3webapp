import { createAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getModels, getFormattedPlotData, getPlotTypes, LEGAL_PLOT_ID } from './client';
import { getSuggestedValues, preTransformApiData } from 'utils/optionsFormatter';
import { END_YEAR, O3AS_PLOTS, START_YEAR, USER_REGION } from 'utils/constants';
import { setDisplayXRangeForPlot, setDisplayYRangeForPlot } from 'store/plotSlice';
import { AppDispatch, AppState, AppStore } from 'store';
import { O3Data } from './generated-client';
import { ModelId } from 'store/modelsSlice';

export const REQUEST_STATE = {
    idle: 'idle',
    loading: 'loading',
    success: 'success',
    error: 'error',
} as const;
export type REQUEST_STATE = (typeof REQUEST_STATE)[keyof typeof REQUEST_STATE];

export const fetchModels = createAsyncThunk(
    'api/fetchModels',
    async () => (await getModels()).data
);

export const fetchPlotTypes = createAsyncThunk(
    'api/fetchPlotTypes',
    async () => (await getPlotTypes()).data
);

/**
 * This function concatenates all given information into a string serving as an identifier for
 * cached requests in the store.
 *
 * @category ApiSlice
 * @function
 * @param latMin Specifies the minimum latitude
 * @param latMax Specifies the maximum latitude
 * @param months Represents the selected months
 * @param refModel The reference model to "normalize the data"
 * @param refYear The reference year to "normalize the data"
 * @returns The generated string
 */
export const generateCacheKey = (
    latMin: number,
    latMax: number,
    months: number[],
    refModel: string,
    refYear: number
) => {
    return `lat_min=${latMin}&lat_max=${latMax}&months=${months.join(
        ','
    )}&ref_meas=${refModel}&ref_year=${refYear}`;
};

type FetchPlotData = {
    plotId: LEGAL_PLOT_ID;
    cacheKey: string;
    loadingModels: string[];
    loadedModels: string[];
};

export type EntryPlotStyle = {
    label: string;
    color: string;
    linestyle: string;
};

export type ZmData = number[];
export type ReturnData = { [USER_REGION]?: number } & Record<string, number>;

// TODO: taken from optionsFormatter
export type Entry = {
    plotStyle?: /*?*/ EntryPlotStyle;
    // TODO: better typing, move strings elsewhere? get rid of USER_REGION
    data:
        | ZmData // zm
        | ReturnData; // return
    suggested: {
        minX?: number;
        maxX?: number;
        minY: number;
        maxY: number;
    };
};

type IdleResponse = {
    status: 'idle';
};
type LoadingResponse = {
    status: 'loading';
};
export type ProcessedO3Data = { reference_value: Entry } & Record<string, Entry>;
type SuccessfulResponse = {
    status: 'success';
    data: ProcessedO3Data;
};
type ErrorResponse = {
    status: 'error';
    error: string;
};

type RequestCache = FetchPlotData &
    (IdleResponse | LoadingResponse | SuccessfulResponse | ErrorResponse);

type InitiallyPendingPayload = {
    plotId: LEGAL_PLOT_ID;
    cacheKey: string;
    loadingModels: string[];
};

type RefetchingPayload = {
    plotId: LEGAL_PLOT_ID;
    cacheKey: string;
    loadingModels: string[];
};

type SuccessPayload = {
    plotId: LEGAL_PLOT_ID;
    cacheKey: string;
    data: O3Data[];
};

type RejectedPayload = {
    error: string;
    plotId: LEGAL_PLOT_ID;
    cacheKey: string;
};

type SelectExistingPayload = {
    plotId: LEGAL_PLOT_ID;
    cacheKey: string;
};

/**
 * This action creator generates an action that is dispatched against the store when the request of
 * the data is initially started. The payload contains the plotId and the cacheKey.
 *
 * This differs from the refetching action because the reducer has to handle the initialization of
 * the object that caches this specific request.
 *
 * @category ApiSlice
 * @function
 */
const fetchPlotDataInitiallyPending = createAction<InitiallyPendingPayload>(
    'api/fetchPlotData/initiallyPending'
);

/**
 * This action creator generates an action that is dispatched against the store when a request of
 * existing settings is re-fetched with other models.
 *
 * This differs from the initially fetching action because the existing data structure which stores
 * the cached values only needs to be updated.
 *
 * @category ApiSlice
 * @function
 */
const fetchPlotDataRefetching = createAction<RefetchingPayload>('api/fetchPlotData/refetching');

/**
 * This action creator generates an action that is dispatched against the store when the request of
 * the data succeeded. The payload object contains the data, the cacheKey and the plotId.
 *
 * @category ApiSlice
 * @function
 */
const fetchPlotDataSuccess = createAction<SuccessPayload>('api/fetchPlotData/success');
/**
 * This action creator generates an action that is dispatched against the store when the request of
 * the data failed. The payload object contains the error message, the cacheKey and the plotId.
 *
 * @category ApiSlice
 * @function
 */
const fetchPlotDataRejected = createAction<RejectedPayload>('api/fetchPlotData/rejected');
/**
 * This action creator generates an action that is dispatched against the store when the requested
 * data is already in the cache and only needs to be selected. The payload contains the plotId and
 * the cacheKey.
 *
 * @category ApiSlice
 * @function
 */
const selectExistingPlotData = createAction<SelectExistingPayload>('api/selectPlotData');

/**
 * This action encapsulates the operation of fetching the data, unpacking the calculated min and max
 * values of the fetched data which are then used to update the plot with the "suggestions". They
 * are named suggestions because the y-axis of the plot axis is initially set to these values. The
 * user can change them ofcourse.
 *
 * @category ApiSlice
 * @function
 * @param plotId The name for which the data is fetched
 * @param cacheKey The cache key specifying the settings for the fetched data and where the data is
 *   fetched
 * @param data The fetched data from the api
 * @param suggest
 */
export const updateDataAndDisplaySuggestions = (
    plotId: LEGAL_PLOT_ID,
    cacheKey: string,
    data: O3Data[],
    suggest: boolean
) => {
    return (dispatch: AppDispatch, getState: AppStore['getState']) => {
        dispatch(fetchPlotDataSuccess({ data, plotId, cacheKey }));
        const cachedRequest = getState().api.plotSpecific[plotId].cachedRequests[cacheKey];
        if (suggest && cachedRequest.status === 'success') {
            const requestData = cachedRequest.data;

            const { minX, maxX, minY, maxY } = getSuggestedValues(requestData, getState().models);

            dispatch(
                setDisplayYRangeForPlot({
                    plotId,
                    displayYRange: {
                        minY: Math.floor(minY / 10) * 10,
                        maxY: Math.ceil(maxY / 10) * 10,
                    },
                })
            );
            if (plotId === O3AS_PLOTS.tco3_zm) {
                dispatch(
                    setDisplayXRangeForPlot({ plotId, displayXRange: { years: { minX, maxX } } })
                );
            }
        }
    };
};

/**
 * This action serves as the interface the components use to dispatch a fetching request for all
 * current models. It simplifies the interface for the components as they don't need to access the
 * store before and calculate which models should be fetched.
 *
 * @category ApiSlice
 * @function
 * @param suggest Whether the suggestions should be calculated or not
 * @returns The async thunk function that is dispatched against the store.
 */
export const fetchPlotDataForCurrentModels = (suggest = true) => {
    return (dispatch: AppDispatch, getState: AppStore['getState']) => {
        const state = getState();
        return Promise.all([
            dispatch(fetchPlotData(O3AS_PLOTS.tco3_zm, getAllSelectedModels(state), suggest)),
            dispatch(fetchPlotData(O3AS_PLOTS.tco3_return, getAllSelectedModels(state), suggest)),
        ]);
    };
};

/**
 * This async thunk creator allows to generate a data fetching action that can be dispatched against
 * the store to start fetching new plot data from the api.
 *
 * @category ApiSlice
 * @param plotId The plotId
 * @param models All selected models
 * @param suggest Whether the suggestions should be calculated or not
 * @returns The async thunk action
 */
export const fetchPlotData = (plotId: LEGAL_PLOT_ID, models: ModelId[], suggest = false) => {
    return (dispatch: AppDispatch, getState: AppStore['getState']) => {
        const state = getState();
        const { minLat: latMin, maxLat: latMax } = state.plot.generalSettings.location;
        const months = state.plot.generalSettings.months;
        const { model: refModel, year: refYear } = state.reference.settings;

        const cacheKey = generateCacheKey(latMin, latMax, months, refModel, refYear);

        const cachedRequest = state.api.plotSpecific[plotId].cachedRequests[cacheKey];

        let toBeFetched;

        if (typeof cachedRequest === 'undefined') {
            // Initial action dispatched
            toBeFetched = models;
            dispatch(
                fetchPlotDataInitiallyPending({ plotId, cacheKey, loadingModels: toBeFetched })
            );
        } else {
            const allSelected = getAllSelectedModels(state);
            const loaded = cachedRequest.loadedModels; // models that are already loaded
            const loading = cachedRequest.loadingModels; // models that are beeing loaded at the moment

            // keep only models that are not loaded and currently not loading
            toBeFetched = allSelected.filter(
                (model) => !loaded.includes(model) && !loading.includes(model)
            );
            if (toBeFetched.length === 0) {
                // fetched data already satisfies users needs
                // old: status == success
                dispatch(selectExistingPlotData({ plotId, cacheKey }));
                if (cachedRequest.status === REQUEST_STATE.success) {
                    const { minX, maxX, minY, maxY } = getSuggestedValues(
                        cachedRequest.data,
                        getState().models
                    );

                    dispatch(
                        setDisplayYRangeForPlot({
                            plotId,
                            displayYRange: {
                                minY: Math.floor(minY / 10) * 10,
                                maxY: Math.ceil(maxY / 10) * 10,
                            },
                        })
                    );
                    if (plotId === O3AS_PLOTS.tco3_zm) {
                        dispatch(
                            setDisplayXRangeForPlot({
                                plotId,
                                displayXRange: { years: { minX, maxX } },
                            })
                        );
                    }
                }
                return Promise.resolve(); // request is already satisfied
            } else {
                dispatch(fetchPlotDataRefetching({ plotId, cacheKey, loadingModels: toBeFetched }));
            }
        }

        // Return promise with success and failure actions
        return getFormattedPlotData(
            plotId,
            latMin,
            latMax,
            months,
            toBeFetched,
            START_YEAR,
            END_YEAR,
            refModel,
            refYear
        ).then(
            ({ data }) =>
                dispatch(updateDataAndDisplaySuggestions(plotId, cacheKey, data, suggest)),
            (error) => {
                const errorMessage = `${error.message}${
                    error.response?.data ? `: ${error.response.data[0]?.message}` : 'Unknown error'
                }`;
                dispatch(fetchPlotDataRejected({ error: errorMessage, plotId, cacheKey }));
            }
        );
    };
};

/**
 * Gets all selected models from the models slice.
 *
 * @category ApiSlice
 * @param state The state of the store
 * @returns All selected models from the store
 */
export const getAllSelectedModels = (state: AppState) => {
    const allModels: string[] = [];
    for (const group of Object.values(state.models.modelGroups)) {
        allModels.push(...allModels, ...Object.keys(group.models));
    }
    return [...new Set(allModels)];
};

type APIState = {
    models: {
        status: REQUEST_STATE;
        error?: string;
        data: string[];
    };
    plotTypes: {
        status: REQUEST_STATE;
        error?: string;
        data: string[];
    };
    plotSpecific: {
        [ID in LEGAL_PLOT_ID]: {
            active: string | null;
            cachedRequests: Record<string, RequestCache>;
        };
    };
};

export type GlobalAPIState = {
    api: APIState;
};

/**
 * This initial state describes how the data fetched from the api is stored in this slice of the
 * redux store.
 *
 * It should be noted that each additional data piece (models/plotTypes) follows the same structure
 * which is very useful to indicate the current status and store potential errors or the returned
 * data.
 *
 * @category API
 * @category ApiSlice
 * @constant {object}
 */
const initialState: APIState = {
    models: {
        status: REQUEST_STATE.idle,
        data: [],
    },
    plotTypes: {
        status: REQUEST_STATE.idle,
        data: [],
    },
    plotSpecific: {
        tco3_zm: {
            active: null,
            cachedRequests: {
                // we need to cache: min,max, months, reference year and model
            },
        },
        tco3_return: {
            active: null,
            cachedRequests: {},
        },
    },
};

/**
 * The apiSlice is generated by the redux toolkit. This piece of the store is responsible for
 * storing all data fetched from the api.
 *
 * @category ApiSlice
 * @function
 */
const apiSlice = createSlice({
    name: 'api',
    initialState,
    reducers: {},
    /**
     * This interface is used to connect the redux thunk action which are returned from the defined
     * thunk action creators (fetchModels, fetchPlotTypes) to this slice of the store.
     *
     * @category ApiSlice
     * @param builder An object handed by the redux toolkit to add these "external" reducers to this
     *   slice
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
            .addCase(
                fetchPlotDataInitiallyPending,
                (state, { payload: { plotId, cacheKey, loadingModels } }) => {
                    const plotSpecificSection = state.plotSpecific[plotId];

                    plotSpecificSection.cachedRequests[cacheKey] = {
                        plotId,
                        cacheKey,
                        status: REQUEST_STATE.loading,
                        loadingModels: [...loadingModels], // models that are currently beeing fetched
                        loadedModels: [],
                    };
                    plotSpecificSection.active = cacheKey; // select this request after dispatching it
                }
            )
            .addCase(
                fetchPlotDataRefetching,
                (state, { payload: { plotId, cacheKey, loadingModels } }) => {
                    const plotSpecificSection = state.plotSpecific[plotId];
                    const cachedRequest = plotSpecificSection.cachedRequests[cacheKey];
                    cachedRequest.status = REQUEST_STATE.loading;
                    if (cachedRequest.loadingModels !== undefined) {
                        cachedRequest.loadingModels?.push(...loadingModels);
                    } else {
                        cachedRequest.loadingModels = loadingModels;
                    }

                    plotSpecificSection.active = cacheKey; // select this request after dispatching it
                }
            )
            .addCase(fetchPlotDataSuccess, (state, { payload: { data, plotId, cacheKey } }) => {
                const storageOrig = state.plotSpecific[plotId].cachedRequests[cacheKey];
                const lookUpTable = preTransformApiData(plotId, data);
                const storage = (state.plotSpecific[plotId].cachedRequests[cacheKey] = {
                    ...storageOrig,
                    status: 'success',
                    data: {
                        ...(storageOrig !== undefined && storageOrig.status === 'success'
                            ? storageOrig.data
                            : undefined),
                        ...lookUpTable,
                    },
                });

                // update loaded / loading
                const fetchedModels = Object.keys(lookUpTable);
                storage.loadingModels =
                    storage.loadingModels?.filter((model) => !fetchedModels.includes(model)) ?? []; // remove all models that are now fetched
                storage.loadedModels = [
                    ...(storage.loadedModels !== undefined ? storage.loadedModels : []),
                    ...fetchedModels,
                ];

                if (storage.loadingModels.length === 0) {
                    storage.status = REQUEST_STATE.success; // display models
                }
            })
            .addCase(fetchPlotDataRejected, (state, action) => {
                const { error, plotId, cacheKey } = action.payload;
                state.plotSpecific[plotId].cachedRequests[cacheKey] = {
                    ...state.plotSpecific[plotId].cachedRequests[cacheKey],
                    status: REQUEST_STATE.error,
                    error: error,
                    loadedModels: [], // everything should be refetched if an error occurred
                    loadingModels: [], // loading failed, reset all, otherwise re-loading wouldn't be possible
                };
            })

            // select existing data from cache
            .addCase(selectExistingPlotData, (state, action) => {
                const { plotId, cacheKey } = action.payload;
                state.plotSpecific[plotId].active = cacheKey; // update by chaining the active value to the existing cacheKey
            });
    },
});

export default apiSlice.reducer;

/**
 * This selector allows components (=> {@link Graph}) to "listen" for the active plot data of the
 * current selected plot. That means whenever this data is about to change, e.g. because a new fetch
 * request is dispatched, the component re-renders.
 *
 * @param state The state, handed by redux
 * @param plotId Identifies the plot
 */
export const selectActivePlotData = (state: AppState, plotId: LEGAL_PLOT_ID) => {
    const plotSpecificSection = state.api.plotSpecific[plotId];
    const activeCacheKey = plotSpecificSection.active;
    if (activeCacheKey === null) {
        // no data is present yet, return dummy to indicate loading!
        return {
            status: REQUEST_STATE.loading,
        };
    }

    return plotSpecificSection.cachedRequests[activeCacheKey];
};
