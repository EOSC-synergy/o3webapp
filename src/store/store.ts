import { Action, combineReducers, configureStore, ThunkAction } from '@reduxjs/toolkit';
import plotReducer, { GlobalPlotState } from './plotSlice';
import modelsReducer, { GlobalModelState, setModelsOfModelGroup } from './modelsSlice';
import referenceReducer, { GlobalReferenceState } from './referenceSlice';
import apiReducer from '../services/API/apiSlice/apiSlice';
import { DEFAULT_MODEL_GROUP } from '../utils/constants';
import { createWrapper, HYDRATE } from 'next-redux-wrapper';
import thunkMiddleware from 'redux-thunk';
import { useDispatch, useStore } from 'react-redux';

type GlobalState =
    | undefined
    | (GlobalPlotState & GlobalModelState & GlobalReferenceState & { api: any });

const combinedReducer = combineReducers({
    plot: plotReducer,
    models: modelsReducer,
    reference: referenceReducer,
    api: apiReducer,
});

const reducer = (state: GlobalState, action: { type: string; payload: any }) => {
    if (action.type === HYDRATE) {
        // if (state.count.count) nextState.count.count = state.count.count; // preserve count value on client side navigation
        return {
            ...state, // use previous state
            ...action.payload, // apply delta from hydration
        };
    } else {
        return combinedReducer(state, action);
    }
};

//let store: ReturnType<typeof configureStore<GlobalState, >>;

const initStore = () => {
    //store = createStore(reducer, bindMiddleware([thunkMiddleware]));
    return configureStore({
        reducer,
        devTools: process.env.NODE_ENV !== 'production',
        middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunkMiddleware),
    });
};

export type AppStore = ReturnType<typeof initStore>;
export type AppState = ReturnType<AppStore['getState']>;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, AppState, unknown, Action>;

export type AppDispatch = AppStore['dispatch'];
export const useAppDispatch = () => useDispatch<AppDispatch>(); // Export a hook that can be reused to resolve types

export const useAppStore = () => useStore<AppState>();

export const wrapper = createWrapper(initStore);

export function createTestStore() {
    const store = initStore();
    store.dispatch(setModelsOfModelGroup(DEFAULT_MODEL_GROUP)); // fill with default group
    return store;
}
