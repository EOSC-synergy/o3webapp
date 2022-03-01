import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import store from './store/store';
import {Provider} from 'react-redux';
import {fetchModels, fetchPlotDataForCurrentModels, fetchPlotTypes} from './services/API/apiSlice';
import {setModelsOfModelGroup} from "./store/modelsSlice/modelsSlice";
import {DEFAULT_MODEL_GROUP, O3AS_PLOTS} from './utils/constants';
import {setLocation, setMonths} from "./store/plotSlice/plotSlice";
import {setModel, setYear} from "./store/referenceSlice/referenceSlice";

const queryString = window.location.search;
if (queryString !== '') {
    const urlParams = new URLSearchParams(queryString);

    const latMin = parseInt(urlParams.get('lat_min'));
    const latMax = parseInt(urlParams.get('lat_max'));
    store.dispatch(setLocation({minLat: latMin, maxLat: latMax}));

    const months = urlParams.get('months').split(",").map((item) => {
        return parseInt(item)
    });
    store.dispatch(setMonths({months}));

    const refModel = urlParams.get('ref_meas');
    store.dispatch(setModel({model: refModel}));

    const refYear = parseInt(urlParams.get('ref_year'));
    store.dispatch(setYear({year: refYear}));
}

// add default model group
store.dispatch(setModelsOfModelGroup(DEFAULT_MODEL_GROUP));

// on "startup" of the app: load plot types, models and data for default group set above
store.dispatch(fetchPlotTypes());
store.dispatch(fetchModels());
store.dispatch(fetchPlotDataForCurrentModels({plotId: O3AS_PLOTS.tco3_zm}));
store.dispatch(fetchPlotDataForCurrentModels({plotId: O3AS_PLOTS.tco3_return}));

ReactDOM.render(
    <React.StrictMode>
        <Provider store={store}>
            <App/>
        </Provider>
    </React.StrictMode>,
    document.getElementById('root')
);
