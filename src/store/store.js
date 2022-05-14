import { applyMiddleware, combineReducers, configureStore, createStore } from '@reduxjs/toolkit';
import plotReducer from './plotSlice/plotSlice';
import modelsReducer, { setModelsOfModelGroup } from './modelsSlice/modelsSlice';
import referenceReducer from './referenceSlice/referenceSlice';
import apiReducer from '../services/API/apiSlice/apiSlice';
import { DEFAULT_MODEL_GROUP } from '../utils/constants';
import { HYDRATE, createWrapper } from 'next-redux-wrapper';
import thunkMiddleware from 'redux-thunk';

const bindMiddleware = (middleware) => {
    if (process.env.NODE_ENV !== 'production') {
        const { composeWithDevTools } = require('redux-devtools-extension');
        return composeWithDevTools(applyMiddleware(...middleware));
    }
    return applyMiddleware(...middleware);
};

const combinedReducer = combineReducers({
    plot: plotReducer,
    models: modelsReducer,
    reference: referenceReducer,
    api: apiReducer,
});

const reducer = (state, action) => {
    if (action.type === HYDRATE) {
        const nextState = {
            ...state, // use previous state
            ...action.payload, // apply delta from hydration
        };
        // if (state.count.count) nextState.count.count = state.count.count; // preserve count value on client side navigation
        return nextState;
    } else {
        return combinedReducer(state, action);
    }
};

let store;

const initStore = () => {
    store = createStore(reducer, bindMiddleware([thunkMiddleware]));
    return store;
};

export { store };

export const wrapper = createWrapper(initStore);

export function createTestStore() {
    const store = configureStore({
        reducer: combinedReducer,
    });
    store.dispatch(setModelsOfModelGroup(DEFAULT_MODEL_GROUP)); // fill with default group
    return store;
}
