import reducer, { fetchModels, fetchPlotData, fetchPlotDataPending, fetchPlotTypes, generateCacheKey, REQUEST_STATE } from "./apiSlice";
import axios from 'axios';
import { configureStore } from "@reduxjs/toolkit";
import { createTestStore } from "../../store/store";

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

/*
describe("tests the action creators of fetchPlotData", () => {
    
    console.log("a" + fetchPlotDataPending);
    expect(fetchPlotDataPending({plotId: "tco3_zm", cacheKey: "key"})).toEqual({
        type: "api/fetchPlotData/pending",
        plotId: "tco3_zm", 
        cacheKey: "key",
    });
});
*/

let store;
describe('tests fetchPlotData thunk action creator', () => {
    const exampleRequestData = {
        plotId: "tco3_zm",
        latMin: -90, 
        latMax: 90, 
        months: [1], 
        startYear: 1959, 
        endYear: 2100, 
        modelList: ["modelX", "modelY"], 
        refModel: "modelRed", 
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
        axios.post.mockResolvedValue({data: {}});
        store.dispatch(fetchPlotData(exampleRequestData));

        const plotSpecificSection = store.getState().api.plotSpecific["tco3_zm"];
        expect(plotSpecificSection.active).toEqual(exampleCacheKey);
        expect(plotSpecificSection.cachedRequests[exampleCacheKey]).toEqual({
            data: [],
            error: null,
            status: REQUEST_STATE.loading,
        });
    });

});