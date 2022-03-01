import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import store from './store/store';
import {Provider} from 'react-redux';
import {cacheKey, fetchModels, fetchPlotDataForCurrentModels, fetchPlotTypes} from './services/API/apiSlice';
import {setModelsOfModelGroup} from "./store/modelsSlice/modelsSlice";
import {DEFAULT_MODEL_GROUP, O3AS_PLOTS} from './utils/constants';
import {setLocation, setMonths} from "./store/plotSlice/plotSlice";
import {setModel, setYear} from "./store/referenceSlice/referenceSlice";

export const updateURL = () => {
    const plotSpecific = store.getState().plot.plotSpecificSettings;
    const otherSettings = [];
    otherSettings.push(`ref_visible=${+store.getState().reference.settings.visible}`);
    otherSettings.push(`x_zm=${plotSpecific.tco3_zm.displayXRange.years.minX}-${plotSpecific.tco3_zm.displayXRange.years.maxX}`);
    otherSettings.push(`y_zm=${plotSpecific.tco3_zm.displayYRange.minY}-${plotSpecific.tco3_zm.displayYRange.maxY}`);
    otherSettings.push(`x_return=${plotSpecific.tco3_return.displayXRange.regions.join(",")}`);
    otherSettings.push(`y_return=${plotSpecific.tco3_return.displayYRange.minY}-${plotSpecific.tco3_return.displayYRange.maxY}`);
    otherSettings.push(`title_zm=${plotSpecific.tco3_zm.title}`);
    otherSettings.push(`title_return=${plotSpecific.tco3_return.title}`);

    window.history.pushState('', '', `?plot=${store.getState().plot.plotId}&${cacheKey}&${otherSettings.join("&")}`);
}

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
updateURL();

ReactDOM.render(
    <React.StrictMode>
        <Provider store={store}>
            <App/>
        </Provider>
    </React.StrictMode>,
    document.getElementById('root')
);
