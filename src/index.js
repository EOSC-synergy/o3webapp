import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import store from './store/store';
import {Provider} from 'react-redux';
import { fetchModels, fetchPlotData, fetchPlotTypes } from './services/API/apiSlice';
import {modelListBegin, modelListEnd} from "./utils/constants";

const reloadInitialData = () => {
    store.getState().api.plotTypes.data.map((name) => {
        store.dispatch(fetchPlotData({plotId: name, modelListBegin, modelListEnd}));
    });
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
