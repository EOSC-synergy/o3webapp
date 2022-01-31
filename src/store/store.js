import { configureStore } from '@reduxjs/toolkit';
import plotReducer from './plotSlice/plotSlice';
import modelsReducer from './modelsSlice/modelsSlice';
import referenceReducer from './referenceSlice';
import apiReducer from '../services/API/apiSlice';

export default configureStore({
    reducer: {
        plot: plotReducer,
        models: modelsReducer,
        reference: referenceReducer,
        api: apiReducer,
    }
});

export function createTestStore() {
    return configureStore({
        reducer: {
            plot: plotReducer,
            models: modelsReducer,
            reference: referenceReducer,
            api: apiReducer,
        }
    });
}
