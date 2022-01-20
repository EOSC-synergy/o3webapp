import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import store from './store/store'
import { Provider } from 'react-redux'
import "./index.css"
import { fetchModels, fetchPlotTypes, fetchRawData } from './services/API/apiSlice';

const getOptions = (modelList) => {
return {
    plotId: "tco3_zm",
    plotType: "tco3_zm",
    latMin: "-90", 
    latMax: "90", 
    months: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], 
    startYear: 1960, 
    endYear: 2100, 
    modelList: ["CCMI-1_ACCESS_ACCESS-CCM-refC2"], // not all models for faster testing!
}
};

const reloadInitialData = () => {
    store.dispatch(fetchRawData(
        getOptions(store.getState().api.models.data)
    )); 
}

// on "startup" of the app: request default values for all models
store.dispatch(fetchModels())
    .then(() => {
        if (store.getState().api.models.error === null) {
            reloadInitialData();       
        }
    });
store.dispatch(fetchPlotTypes());

//https://api.o3as.fedcloud.eu/api/v1/data/tco3_zm?begin=1959&end=2100&month=1,2,3&lat_min=-90&lat_max=90

ReactDOM.render(
<React.StrictMode>
    <Provider store={store}>
        <App />
    </Provider>
</React.StrictMode>,
document.getElementById('root')
);
