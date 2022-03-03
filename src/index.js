import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import store from './store/store';
import {Provider} from 'react-redux';
import {cacheKey, fetchModels, fetchPlotDataForCurrentModels, fetchPlotTypes} from './services/API/apiSlice';
import {setModelsOfModelGroup} from "./store/modelsSlice/modelsSlice";
import {DEFAULT_MODEL_GROUP, O3AS_PLOTS} from './utils/constants';
import {setActivePlotId, setLocation, setMonths} from "./store/plotSlice/plotSlice";
import {setModel, setVisibility, setYear} from "./store/referenceSlice/referenceSlice";

export const updateURL = () => {
    const plotSpecific = store.getState().plot.plotSpecificSettings;
    const otherSettings = [];

    otherSettings.push(`ref_visible=${+store.getState().reference.settings.visible}`);
    otherSettings.push(`x_zm=${plotSpecific.tco3_zm.displayXRange.years.minX}-${plotSpecific.tco3_zm.displayXRange.years.maxX}`);
    otherSettings.push(`y_zm=${plotSpecific.tco3_zm.displayYRange.minY}-${plotSpecific.tco3_zm.displayYRange.maxY}`);
    otherSettings.push(`x_return=${plotSpecific.tco3_return.displayXRange.regions.join(",")}`);
    otherSettings.push(`y_return=${plotSpecific.tco3_return.displayYRange.minY}-${plotSpecific.tco3_return.displayYRange.maxY}`);
    otherSettings.push(`title_zm=${encodeURI(plotSpecific.tco3_zm.title)}`);
    otherSettings.push(`title_return=${encodeURI(plotSpecific.tco3_return.title)}`);
    /*
    let modelGroups = [];
    for (let i = 0; i < store.getState().models.idCounter; i++) {
        modelGroups.push(store.getState().models.modelGroups[i].name);
    }
    otherSettings.push(`groups=${modelGroups.join(",")}`);
     */

    window.history.pushState('', '', `?plot=${store.getState().plot.plotId}&${cacheKey}&${otherSettings.join("&")}`);
}

const queryString = window.location.search;
if (queryString !== '') {
    const urlParams = new URLSearchParams(queryString);

    const plotId = urlParams.get('plot');
    store.dispatch(setActivePlotId({plotId: plotId}))

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

    const refVisible = Boolean(parseInt(urlParams.get('ref_visible')));
    store.dispatch(setVisibility({visible: refVisible}));

    const xZM = urlParams.get('x_zm').split("-").map((item) => {
        return parseInt(item)
    });
    const {minX, maxX} = {minX: xZM[0], maxX: xZM[1]};
    store.getState().plot.plotSpecificSettings.tco3_zm.displayXRange.years.minX = minX;
    store.getState().plot.plotSpecificSettings.tco3_zm.displayXRange.years.maxX = maxX;

    const yZM = urlParams.get('y_zm').split("-").map((item) => {
        return parseInt(item)
    });
    const {minY_zm, maxY_zm} = {minY_zm: yZM[0], maxY_zm: yZM[1]};
    store.getState().plot.plotSpecificSettings.tco3_zm.displayYRange.minY = minY_zm;
    store.getState().plot.plotSpecificSettings.tco3_zm.displayYRange.maxY = maxY_zm;

    store.getState().plot.plotSpecificSettings.tco3_return.displayXRange.regions =
        urlParams.get('x_return').split(",").map((item) => {
            return parseInt(item)
        })
    ;

    const yReturn = urlParams.get('y_return').split("-").map((item) => {
        return parseInt(item)
    });
    const {minY_return, maxY_return} = {minY_return: yReturn[0], maxY_return: yReturn[1]};
    store.getState().plot.plotSpecificSettings.tco3_zm.displayYRange.minY = minY_return;
    store.getState().plot.plotSpecificSettings.tco3_zm.displayYRange.maxY = maxY_return;

    store.getState().plot.plotSpecificSettings.tco3_zm.title = decodeURI(urlParams.get('title_zm'));

    store.getState().plot.plotSpecificSettings.tco3_return.title = decodeURI(urlParams.get('title_return'));
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
