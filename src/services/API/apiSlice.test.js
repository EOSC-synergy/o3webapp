import reducer, { fetchModels, fetchPlotData, fetchPlotTypes, generateCacheKey, REQUEST_STATE, selectActivePlotData, getAllSelectedModels } from "./apiSlice";
import axios from 'axios';
import { configureStore } from "@reduxjs/toolkit";
import { createTestStore } from "../../store/store";
import * as optionsFormatter from "../../utils/optionsFormatter/optionsFormatter";

/*
const spy = jest.spyOn(optionsFormatter, 'preTransformApiData');
spy.mockImplementation(x => {
    return {lookUpTable: x, min: 0, max: 0}
});*/


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
describe('tests fetchPlotData thunk action creator', () => {
    const exampleRequestData = {
        plotId: "tco3_zm",
        latMin: -90, 
        latMax: 90, 
        months: [12, 1, 2], 
        startYear: 1959, 
        endYear: 2100, 
        modelList: ["CCMI-1_ACCESS_ACCESS-CCM-refC2"], 
        refModel: "SBUV_GSFC_merged-SAT-ozone", 
        refYear: 1980,
    };
    const exampleCacheKey = generateCacheKey(exampleRequestData);

    beforeEach(() => {
        store = createTestStore();
    });

    it('should generate the correct cacheKey', () => {
        expect(
            generateCacheKey({latMin: -90, latMax: 90, months: [1,2], refModel: "modelRef", refYear: 420})
        ).toEqual("lat_min=-90&lat_min=90&months=1,2&ref_meas=modelRef&ref_year=420");
    })

    it('should dispatch a loading status', () => {
        axios.post.mockResolvedValue({data: [
            {
              "legalinfo": "https://o3as.data.kit.edu/policies/terms-of-use.html",
              "model": "CCMI-1_ACCESS_ACCESS-CCM-refC2",
              "plotstyle": {
                "color": "purple",
                "linestyle": "solid",
                "marker": ""
              },
              "x": [],
              "y": [],
            }]});
        store.dispatch(fetchPlotData(exampleRequestData));
        
        const plotSpecificSection = store.getState().api.plotSpecific["tco3_zm"];
        expect(plotSpecificSection.active).toEqual(exampleCacheKey);
        expect(plotSpecificSection.cachedRequests[exampleCacheKey]).toEqual({
            data: [],
            error: null,
            status: REQUEST_STATE.loading,
            suggested: null,
        });
        
    });

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