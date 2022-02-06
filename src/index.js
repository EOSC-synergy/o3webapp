import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import store from './store/store';
import {Provider, useSelector} from 'react-redux';
import "./index.css";
import { fetchModels, fetchPlotData, fetchPlotTypes } from './services/API/apiSlice';
import {modelListBegin, modelListEnd} from "./utils/constants";
import {setActivePlotId} from "./store/plotSlice/plotSlice";

const reloadInitialData = () => {
    store.getState().api.plotTypes.data.map((name) => {
        store.dispatch(setActivePlotId({plotId: name}));
        store.dispatch(fetchPlotData(modelListBegin, modelListEnd));
    });
    store.dispatch(setActivePlotId({plotId: store.getState().api.plotTypes.data[0]}));
}

// on "startup" of the app: request default values for all models
store.dispatch(fetchPlotTypes());
store.dispatch(fetchModels())
    .then(() => {
        if (store.getState().api.models.error === null) {
            reloadInitialData(); // after fetching models fetch the data for the plot
        }
    });

ReactDOM.render(
<React.StrictMode>
    <Provider store={store}>
        <App />
    </Provider>
</React.StrictMode>,
document.getElementById('root')
);
