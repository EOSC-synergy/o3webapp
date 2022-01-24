import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import store from './store/store'
import { Provider } from 'react-redux'
import "./index.css"
import { fetchModels, fetchPlotData, fetchPlotTypes } from './services/API/apiSlice';

const reloadInitialData = () => {
    store.dispatch(fetchPlotData({
        plotId: "tco3_return",
        latMin: "-90", 
        latMax: "90", 
        months: [1, 2, 3], 
        startYear: 1960, 
        endYear: 2100, 
        modelList: store.getState().api.models.data.slice(0, 5), // not all models for faster testing!
        refYear: 1980,
        refModel: "SBUV_GSFC_merged-SAT-ozone",
    }));

    store.dispatch(fetchPlotData({
        plotId: "tco3_zm",
        latMin: "-90", 
        latMax: "90", 
        months: [1, 2, 3], 
        startYear: 1960, 
        endYear: 2100, 
        modelList: store.getState().api.models.data.slice(0, 5), // not all models for faster testing!
        refYear: 1980,
        refModel: "SBUV_GSFC_merged-SAT-ozone",
    }));
}

// on "startup" of the app: request default values for all models
store.dispatch(fetchModels())
    .then(() => {
        if (store.getState().api.models.error === null) {
            reloadInitialData(); // after fetching models fetch some data for the plot     
        }
    });
store.dispatch(fetchPlotTypes());

ReactDOM.render(
<React.StrictMode>
    <Provider store={store}>
        <App />
    </Provider>
</React.StrictMode>,
document.getElementById('root')
);
