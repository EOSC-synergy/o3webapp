import reducer, { fetchModels, fetchPlotTypes, REQUEST_STATE } from "./apiSlice";
import axios from 'axios';
import { configureStore } from "@reduxjs/toolkit";

jest.mock('axios');

describe("fetchModels thunk", () => {
    it('creates the action types', () => {
        const thunkActionCreator = fetchModels;
    
        expect(thunkActionCreator.pending.type).toBe('api/fetchModels/pending')
        expect(thunkActionCreator.fulfilled.type).toBe('api/fetchModels/fulfilled')
        expect(thunkActionCreator.rejected.type).toBe('api/fetchModels/rejected')
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
            },
        };

        axios.get.mockResolvedValue({data: mockedReturnedData});
        
        await store.dispatch(fetchModels());

        expect(store.getState(state => state.api)).toEqual(expected);
    });    
    
});
