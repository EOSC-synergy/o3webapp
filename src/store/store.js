import { configureStore } from '@reduxjs/toolkit';
import plotReducer from './plotSlice/plotSlice';
import modelsReducer, { setModelsOfModelGroup } from './modelsSlice/modelsSlice';
import referenceReducer from './referenceSlice/referenceSlice';
import apiReducer from '../services/API/apiSlice/apiSlice';
import { DEFAULT_MODEL_GROUP } from '../utils/constants';

export default configureStore({
    reducer: {
        plot: plotReducer,
        models: modelsReducer,
        reference: referenceReducer,
        api: apiReducer,
    }
});

export function createTestStore() {
    const store = configureStore({
        reducer: {
            plot: plotReducer,
            models: modelsReducer,
            reference: referenceReducer,
            api: apiReducer,
        }
    });
    store.dispatch(setModelsOfModelGroup(DEFAULT_MODEL_GROUP)); // fill with default group
    return store;
}
