import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import store from './store/store';
import {Provider} from 'react-redux';
import {fetchModels, fetchPlotDataForCurrentModels, fetchPlotTypes} from './services/API/apiSlice';
import {
    setModelsOfModelGroup,
    setStatisticalValueForGroup,
    setVisibilityForGroup, updatePropertiesOfModelGroup
} from "./store/modelsSlice/modelsSlice";
import {DEFAULT_MODEL_GROUP, O3AS_PLOTS, STATISTICAL_VALUES_LIST} from './utils/constants';
import {
    setActivePlotId,
    setDisplayXRange,
    setDisplayYRange,
    setLocation,
    setMonths,
    setTitle
} from "./store/plotSlice/plotSlice";
import {setModel, setVisibility, setYear} from "./store/referenceSlice/referenceSlice";

export function updateURL() {
    const plotSpecific = store.getState().plot.plotSpecificSettings;
    const otherSettings = [];

    otherSettings.push(`lat_min=${store.getState().plot.generalSettings.location.minLat}`);
    otherSettings.push(`lat_max=${store.getState().plot.generalSettings.location.maxLat}`);
    otherSettings.push(`months=${store.getState().plot.generalSettings.months.join(',')}`);
    otherSettings.push(`ref_meas=${store.getState().api.models.data.indexOf(store.getState().reference.settings.model)}`);
    otherSettings.push(`ref_year=${store.getState().reference.settings.year}`);
    otherSettings.push(`ref_visible=${+store.getState().reference.settings.visible}`);
    otherSettings.push(`x_zm=${plotSpecific.tco3_zm.displayXRange.years.minX}-${plotSpecific.tco3_zm.displayXRange.years.maxX}`);
    otherSettings.push(`y_zm=${plotSpecific.tco3_zm.displayYRange.minY}-${plotSpecific.tco3_zm.displayYRange.maxY}`);
    otherSettings.push(`x_return=${plotSpecific.tco3_return.displayXRange.regions.join(",")}`);
    otherSettings.push(`y_return=${plotSpecific.tco3_return.displayYRange.minY}-${plotSpecific.tco3_return.displayYRange.maxY}`);
    otherSettings.push(`title_zm="${plotSpecific.tco3_zm.title}"`);
    otherSettings.push(`title_return="${plotSpecific.tco3_return.title}"`);

    for (let i = 0; i < store.getState().models.idCounter; i++) {
        const modelGroup = store.getState().models.modelGroups[i];
        const name = modelGroup.name;
        const visibilities = [
            +modelGroup.isVisible,
            +modelGroup.visibleSV.mean,
            +modelGroup.visibleSV["standard deviation"],
            +modelGroup.visibleSV.median,
            +modelGroup.visibleSV.percentile,
        ];
        let models = [];
        const modelSettings = [];
        for (let model of Object.keys(modelGroup.models)) {
            models.push(store.getState().api.models.data.indexOf(model));
            modelSettings.push(+modelGroup.models[model].isVisible);
            modelSettings.push(+modelGroup.models[model].mean);
            modelSettings.push(+modelGroup.models[model]["standard deviation"]);
            modelSettings.push(+modelGroup.models[model].median);
            modelSettings.push(+modelGroup.models[model].percentile);
        }
        otherSettings.push(`group${i}="${name}",${visibilities.join("")},${models.join(",")},${modelSettings.join("")}`);
    }

    window.history.pushState('', '', `?plot=${store.getState().plot.plotId}&${otherSettings.join("&")}`);
}

function updateStoreWithURL() {
    if (queryString !== '') {
        const urlParams = new URLSearchParams(queryString);

        const latMin = parseInt(urlParams.get('lat_min'));
        const latMax = parseInt(urlParams.get('lat_max'));
        store.dispatch(setLocation({minLat: latMin, maxLat: latMax}));

        const months = urlParams.get('months').split(",").map((item) => {
            return parseInt(item);
        });
        store.dispatch(setMonths({months}));

        const refModel = store.getState().api.models.data[parseInt(urlParams.get('ref_meas'))];
        store.dispatch(setModel({model: refModel}));

        const refYear = parseInt(urlParams.get('ref_year'));
        store.dispatch(setYear({year: refYear}));

        const refVisible = Boolean(parseInt(urlParams.get('ref_visible')));
        store.dispatch(setVisibility({visible: refVisible}));

        const xZM = urlParams.get('x_zm').split("-").map((item) => {
            return parseInt(item);
        });
        store.dispatch(setDisplayXRange({years: {minX: xZM[0], maxX: xZM[1]}}));

        const yZM = urlParams.get('y_zm').split("-").map((item) => {
            return parseInt(item);
        });
        store.dispatch(setDisplayYRange({minY: yZM[0], maxY: yZM[1]}));

        store.dispatch(setTitle({title: urlParams.get('title_zm').split('"')[1]}));

        store.dispatch(setActivePlotId({plotId: O3AS_PLOTS.tco3_return}));

        store.dispatch(setDisplayXRange({
            regions:
                urlParams.get('x_return').split(",").map((item) => {
                    return parseInt(item);
                })
        }));

        const yReturn = urlParams.get('y_return').split("-").map((item) => {
            return parseInt(item);
        });
        store.dispatch(setDisplayYRange({minY: yReturn[0], maxY: yReturn[1]}));

        store.dispatch(setTitle({title: urlParams.get('title_return').split('"')[1]}));

        const plotId = urlParams.get('plot');
        store.dispatch(setActivePlotId({plotId: plotId}));

        let groupStrings = []
        while (urlParams.get(`group${groupStrings.length}`) !== null) {
            groupStrings.push(urlParams.get(`group${groupStrings.length}`));
        }
        const groups = groupStrings.map((elem) => {
            const name = elem.split('"')[1];
            const visibilities = elem.split('"')[2].split(',')[1].split("").map((elem) => {
                return Boolean(parseInt(elem));
            });
            const models = elem.split('"')[2].split(',').slice(2, -1).map((e) => {
                return store.getState().api.models.data[parseInt(e)];
            });
            let modelSettings = elem.split('"')[2].split(',').slice(-1)[0].split("").map((e) => {
                return Boolean(parseInt(e));
            });
            return {name: name, visibilities: visibilities, models: models, modelSettings: modelSettings};
        });
        for (let i = 0; i < groups.length; i++) {
            store.dispatch(setModelsOfModelGroup({groupId: i, groupName: groups[i].name, modelList: groups[i].models}));
            store.dispatch(setVisibilityForGroup({groupId: i, isVisible: groups[i].visibilities[0]}));
            for (let j = 1; j < groups[i].visibilities.length; j++) {
                store.dispatch(setStatisticalValueForGroup(
                    {groupId: i, svType: STATISTICAL_VALUES_LIST[j - 1], isIncluded: groups[i].visibilities[j]}
                ));
            }
            const dataCpy = JSON.parse(JSON.stringify(store.getState().models.modelGroups[i].models));
            const dataPerModel = 5;
            for (let j = 0; j < groups[i].models.length; j++) {
                const model = groups[i].models[j];
                dataCpy[model].isVisible = groups[i].modelSettings[dataPerModel * j];
                dataCpy[model].mean = groups[i].modelSettings[dataPerModel * j + 1];
                dataCpy[model].std = groups[i].modelSettings[dataPerModel * j + 2];
                dataCpy[model].median = groups[i].modelSettings[dataPerModel * j + 3];
                dataCpy[model].percentile = groups[i].modelSettings[dataPerModel * j + 4];
            }
            store.dispatch(updatePropertiesOfModelGroup({groupId: i, data: dataCpy}));
        }
    }
}

store.dispatch(fetchPlotTypes());

const queryString = window.location.search;
store.dispatch(fetchModels()).then(
    () => {
        updateStoreWithURL();
        store.dispatch(fetchPlotDataForCurrentModels(queryString === ''));
        updateURL();
    }
);

if (queryString === '') {
    // add default model group
    store.dispatch(setModelsOfModelGroup(DEFAULT_MODEL_GROUP));
}


ReactDOM.render(
    <React.StrictMode>
        <Provider store={store}>
            <App/>
        </Provider>
    </React.StrictMode>,
    document.getElementById('root')
);
