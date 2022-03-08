import reducer, { fetchModels, fetchPlotData, fetchPlotTypes, generateCacheKey, REQUEST_STATE, selectActivePlotData, getAllSelectedModels } from "./apiSlice";
import axios from 'axios';
import { configureStore } from "@reduxjs/toolkit";
import { createTestStore } from "../../store/store";
import tco3zmResponse from "./testing/tco3zm-response.json";
import tco3returnResponse from "./testing/tco3return-response.json";
import { O3AS_PLOTS } from "../../utils/constants";
import { preTransformApiData } from "../../utils/optionsFormatter/optionsFormatter";

jest.mock('axios');

describe("tests fetchModels async thunk", () => {
    it('creates the action types', () => {
        expect(fetchModels.pending.type).toBe('api/fetchModels/pending')
        expect(fetchModels.fulfilled.type).toBe('api/fetchModels/fulfilled')
        expect(fetchModels.rejected.type).toBe('api/fetchModels/rejected')
    });
    
    it('updates store accordingly after successful request', async () => {
        const store = configureStore({
            reducer: {
                api: reducer,
            },
        });

        const mockedReturnedData = ["modelA", "modelB"];

        const expected = {
            api: {
                models: {
                    status: REQUEST_STATE.success,
                    error: null,
                    data: mockedReturnedData,
                },
                plotTypes: {
                    status: REQUEST_STATE.idle,
                    error: null,
                    data: [],
                },
                plotSpecific: {
                    tco3_zm: {
                        active: null,
                        cachedRequests: { }
                    },
                    tco3_return: {
                        active: null,
                        cachedRequests: { }
                    },
                },
            },
        };

        axios.get.mockResolvedValue({data: mockedReturnedData});
        await store.dispatch(fetchModels());
        expect(store.getState(state => state.api)).toEqual(expected);
    });

    it('updates store accordingly after rejected request', async () => {
        const store = configureStore({
            reducer: {
                api: reducer,
            },
        });

        const errorMessage = "Timeout of API";

        const expected = {
            api: {
                models: {
                    status: REQUEST_STATE.error,
                    error: errorMessage,
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
                        cachedRequests: { }
                    },
                    tco3_return: {
                        active: null,
                        cachedRequests: { }
                    },
                },
            },
        };

        axios.get.mockReturnValue(Promise.reject(errorMessage));
        await store.dispatch(fetchModels());
        expect(store.getState(state => state.api)).toEqual(expected);
    });    
});

describe("tests fetchPlotTypes async thunk", () => {
    it('creates the action types', () => {    
        expect(fetchPlotTypes.pending.type).toBe('api/fetchPlotTypes/pending')
        expect(fetchPlotTypes.fulfilled.type).toBe('api/fetchPlotTypes/fulfilled')
        expect(fetchPlotTypes.rejected.type).toBe('api/fetchPlotTypes/rejected')
    });
    
    it('updates store accordingly after successful request', async () => {
        const store = configureStore({
            reducer: {
                api: reducer,
            },
        });

        const mockedReturnedData = ["tco3_zm", "tco3_return"];

        const expected = {
            api: {
                models: {
                    status: REQUEST_STATE.idle,
                    error: null,
                    data: [],
                },
                plotTypes: {
                    status: REQUEST_STATE.success,
                    error: null,
                    data: mockedReturnedData,
                },
                plotSpecific: {
                    tco3_zm: {
                        active: null,
                        cachedRequests: { }
                    },
                    tco3_return: {
                        active: null,
                        cachedRequests: { }
                    },
                },
            },
        };

        axios.get.mockResolvedValue({data: mockedReturnedData});
        await store.dispatch(fetchPlotTypes());
        expect(store.getState(state => state.api)).toEqual(expected);
    });

    it('updates store accordingly after rejected request', async () => {
        const store = configureStore({
            reducer: {
                api: reducer,
            },
        });

        const errorMessage = "Timeout of API";

        const expected = {
            api: {
                models: {
                    status: REQUEST_STATE.idle,
                    error: null,
                    data: [],
                },
                plotTypes: {
                    status: REQUEST_STATE.error,
                    error: errorMessage,
                    data: [],
                },
                plotSpecific: {
                    tco3_zm: {
                        active: null,
                        cachedRequests: { }
                    },
                    tco3_return: {
                        active: null,
                        cachedRequests: { }
                    },
                },
            },
        };

        axios.get.mockReturnValue(Promise.reject(errorMessage));
        await store.dispatch(fetchPlotTypes());
        expect(store.getState(state => state.api)).toEqual(expected);
    });    
});

describe("tests the REQUEST_STATE enum", () => {
    expect(REQUEST_STATE.loading).toEqual("loading");
    expect(REQUEST_STATE.idle).toEqual("idle");
    expect(REQUEST_STATE.error).toEqual("error");
    expect(REQUEST_STATE.success).toEqual("success");
});

let store;
let modelsInGroup;
describe('tests fetchPlotData api interaction (integration)', () => {
    const exampleRequestData = {
        plotId: "tco3_zm",
        latMin: -90, 
        latMax: 90, 
        months: [1, 2, 12],
        startYear: 1959, 
        endYear: 2100, 
        modelList: ["CCMI-1_ACCESS_ACCESS-CCM-refC2"], 
        refModel: "SBUV_GSFC_merged-SAT-ozone", 
        refYear: 1980,
    };
    const exampleCacheKey = generateCacheKey(exampleRequestData);

    beforeEach(() => {
        store = createTestStore();
        modelsInGroup = Object.keys(store.getState().models.modelGroups[0].models);
    });

    it('should generate the correct cacheKey', () => {
        expect(
            generateCacheKey({latMin: -90, latMax: 90, months: [1,2], refModel: "modelRef", refYear: 420})
        ).toEqual("lat_min=-90&lat_max=90&months=1,2&ref_meas=modelRef&ref_year=420");
    })

    it('should dispatch a loading status and add the models to loading', () => {
        axios.post.mockResolvedValue({data: []});
        store.dispatch(fetchPlotData({plotId: O3AS_PLOTS.tco3_zm, models: modelsInGroup}));
        
        const plotSpecificSection = store.getState().api.plotSpecific[O3AS_PLOTS.tco3_zm];
        expect(plotSpecificSection.active).toEqual(exampleCacheKey); // active request gets selected

        expect(plotSpecificSection.cachedRequests[exampleCacheKey]).toEqual({
            data: {},
            error: null,
            status: REQUEST_STATE.loading,
            suggested: null,
            loadedModels: [],
            loadingModels: modelsInGroup,
        });
        
    });

    it('should handle the re-fetching correctly', async () => {
        axios.post.mockResolvedValue({data: []});
        store.dispatch(fetchPlotData({plotId: O3AS_PLOTS.tco3_zm, models: [modelsInGroup[0]]}));
        
        const plotSpecificSection = store.getState().api.plotSpecific[O3AS_PLOTS.tco3_zm];
        expect(plotSpecificSection.active).toEqual(exampleCacheKey); // active request gets selected

        expect(plotSpecificSection.cachedRequests[exampleCacheKey]).toEqual({
            data: {},
            error: null,
            status: REQUEST_STATE.loading,
            suggested: null,
            loadedModels: [],
            loadingModels: [modelsInGroup[0]],
        });

        // try to refetch exact same model
        store.dispatch(fetchPlotData({plotId: O3AS_PLOTS.tco3_zm, models: [modelsInGroup[0]]}));

        expect(plotSpecificSection.cachedRequests[exampleCacheKey]).toEqual({
            data: {},
            error: null,
            status: REQUEST_STATE.loading,
            suggested: null,
            loadedModels: [],
            loadingModels: [modelsInGroup[0]], // expect the loading list to not contain a duplicate if a re-fetch is requested
        });
        
    });

    it('should add loaded models to the list, update the status and save the transformed data for tco3_zm', async () => {
        axios.post.mockResolvedValue({data: tco3zmResponse});
        await store.dispatch(fetchPlotData({plotId: O3AS_PLOTS.tco3_zm, models: ["CCMI-1_ACCESS_ACCESS-CCM-refC2"]}));
        
        const plotSpecificSection = store.getState().api.plotSpecific["tco3_zm"];
        expect(plotSpecificSection.active).toEqual(exampleCacheKey);
        const cachedRequest = plotSpecificSection.cachedRequests[exampleCacheKey];

        const {lookUpTable: transformedData, min, max} = preTransformApiData({
            plotId: O3AS_PLOTS.tco3_zm, 
            data: tco3zmResponse,
            modelsSlice: store.getState().models,
        });        
        expect(cachedRequest).toEqual({
            data: transformedData, // expect data to be transformed
            error: null,
            status: REQUEST_STATE.success,
            suggested: {max, min},
            loadedModels: Object.values(tco3zmResponse).map(x => x.model),
            loadingModels: [],
        });
        
    });

    it('should add loaded models to the list, update the status and save the transformed data for tco3_return', async () => {
        axios.post.mockResolvedValue({data: tco3returnResponse});
        await store.dispatch(fetchPlotData({plotId: O3AS_PLOTS.tco3_return, models: modelsInGroup}));
        
        const plotSpecificSection = store.getState().api.plotSpecific[O3AS_PLOTS.tco3_return];
        expect(plotSpecificSection.active).toEqual(exampleCacheKey);
        const cachedRequest = plotSpecificSection.cachedRequests[exampleCacheKey];

        const {lookUpTable: transformedData, min, max} = preTransformApiData({
            plotId: O3AS_PLOTS.tco3_return, 
            data: tco3returnResponse,
            modelsSlice: store.getState().models,
        });

        expect(cachedRequest).toEqual({
            data: transformedData, // expect data to be transformed
            error: null,
            status: REQUEST_STATE.success,
            suggested: {max, min},
            loadedModels: Object.values(tco3returnResponse).map(x => x.model),
            loadingModels: [],
        });
        
    });

    it('should set an error accordingly', async () => {
        const errorMessage = "This is an error message [500]"
        axios.post.mockReturnValue(Promise.reject({message: errorMessage}));
        await store.dispatch(fetchPlotData({plotId: O3AS_PLOTS.tco3_return, models: modelsInGroup}));
        
        const plotSpecificSection = store.getState().api.plotSpecific[O3AS_PLOTS.tco3_return];
        expect(plotSpecificSection.active).toEqual(exampleCacheKey);
        const cachedRequest = plotSpecificSection.cachedRequests[exampleCacheKey];

        expect(cachedRequest).toEqual({
            data: {}, // expect data to be transformed
            error: errorMessage,
            status: REQUEST_STATE.error,
            suggested: null,
            loadedModels: [],
            loadingModels: [],
        });
        
    })

});

describe('testing selectors', () => {
    it('should return a dummy loading object if now active data is present', () => {
        const previousState = {
            api: {
                plotSpecific: {
                    tco3_return: {
                        active: null,
                    }
                }
            }
        }
        expect(selectActivePlotData(previousState, "tco3_return")).toEqual({status: REQUEST_STATE.loading});
    });

    it('should return the correct data from the cache if data is present', () => {
        const previousState = {
            api: {
                plotSpecific: {
                    tco3_return: {
                        active: "key",
                        cachedRequests: {
                            "key": "precious data",
                        }
                    }
                }
            }
        }
        expect(selectActivePlotData(previousState, "tco3_return")).toEqual("precious data");
    });
});

describe('testing utils functions', () => {
    beforeEach(() => {
        store = createTestStore();
    });

    test("getAllSelectedModels selects all models", () => {
        const selectedModels = getAllSelectedModels(store.getState);
        expect(selectedModels).toEqual(["CCMI-1_ACCESS_ACCESS-CCM-refC2", "CCMI-1_ACCESS_ACCESS-CCM-senC2fGHG", "CCMI-1_CCCma_CMAM-refC2"])
    });
});