import reducer, { fetchModels, fetchPlotTypes, REQUEST_STATE } from "./apiSlice";
import axios from 'axios';
import { configureStore } from "@reduxjs/toolkit";

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
})