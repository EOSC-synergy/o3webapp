import { configureStore } from '@reduxjs/toolkit'
import { createStore, combineReducers } from 'react-redux'
import plotReducer from './plotSlice/plotSlice'
import modelsReducer from './modelsSlice/modelsSlice'
import referenceReducer from './referenceSlice/referenceSlice'
import apiReducer from '../services/API/apiSlice'

export default configureStore({
    reducer: {
        plot: plotReducer,
        models: modelsReducer,
        reference: referenceReducer,
        api: apiReducer,
    }
})

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
