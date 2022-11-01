import {
    mean,
    median,
    O3AS_PLOTS,
    percentile,
    STATISTICAL_VALUES_LIST,
    std,
} from '../../utils/constants';
import {
    setActivePlotId,
    setDisplayXRange,
    setDisplayYRange,
    setLocation,
    setMonths,
    setTitle,
} from '../../store/plotSlice';
import { setModel, setVisibility, setYear } from '../../store/referenceSlice';
import {
    setModelsOfModelGroup,
    setStatisticalValueForGroup,
    setVisibilityForGroup,
    updatePropertiesOfModelGroup,
} from '../../store/modelsSlice';
import bigInt from 'big-integer';
import _ from 'lodash';

/**
 * This method uses the big-integer library
 * to convert a number in string format
 * from one base to another.
 *
 * (The primitive type BigInt is not being used, since it is not supported in React
 * and common workarounds like
 *
 * if (typeof BigInt === 'undefined') global.BigInt = require('big-integer');
 *
 * didn't work.)
 *
 * @param str the input number as a string
 * @param baseFrom the base of the input number
 * @param baseTo the base of the output number
 * @returns {string} the output number as a string
 */
function parseBigInt(str, baseFrom, baseTo) {
    baseFrom = bigInt(baseFrom);
    baseTo = bigInt(baseTo);
    let bigint = bigInt(0);
    for (let char of str) {
        bigint = bigInt(bigInt(bigInt(baseFrom).multiply(bigint)).add(parseInt(char, baseFrom)));
    }
    let result = '';
    while (bigInt(bigint).greater(bigInt(0))) {
        result =
            bigInt(bigInt(bigint).mod(bigInt(baseTo)))
                .toString(baseTo)
                .toUpperCase() + result;
        bigint = bigInt(bigInt(bigint).divide(bigInt(baseTo)));
    }
    return result;
}

/**
 * This method updates the URL based on the data in the store.
 *
 * @param store a test store for testing the function
 */
export function generateNewUrl(store) {
    const plotSpecific = store.getState().plot.plotSpecificSettings;
    const otherSettings = {
        lat_min: store.getState().plot.generalSettings.location.minLat,
        lat_max: store.getState().plot.generalSettings.location.maxLat,
        months: store.getState().plot.generalSettings.months.join(','),
        ref_meas: store
            .getState()
            .api.models.data.indexOf(store.getState().reference.settings.model),
        ref_year: store.getState().reference.settings.year,
        ref_visible: +store.getState().reference.settings.visible,
        x_zm: `${plotSpecific.tco3_zm.displayXRange.years.minX}-${plotSpecific.tco3_zm.displayXRange.years.maxX}`,
        y_zm: `${plotSpecific.tco3_zm.displayYRange.minY}-${plotSpecific.tco3_zm.displayYRange.maxY}`,
        x_return: plotSpecific.tco3_return.displayXRange.regions.join(','),
        y_return: `${plotSpecific.tco3_return.displayYRange.minY}-${plotSpecific.tco3_return.displayYRange.maxY}`,
        title_zm: `"${plotSpecific.tco3_zm.title}"`,
        title_return: `"${plotSpecific.tco3_return.title}"`,
    };

    for (let i = 0; i < store.getState().models.idCounter; i++) {
        if (typeof store.getState().models.modelGroups[i] === 'undefined') {
            continue;
        }
        const modelGroup = store.getState().models.modelGroups[i];
        const name = modelGroup.name;
        const visibilities = [
            +modelGroup.isVisible,
            +modelGroup.visibleSV.mean,
            +modelGroup.visibleSV['standard deviation'],
            +modelGroup.visibleSV.median,
            +modelGroup.visibleSV.percentile,
        ];
        let models = [];
        let modelSettings = [];
        for (let model of Object.keys(modelGroup.models)) {
            models.push(store.getState().api.models.data.indexOf(model));
            modelSettings.push(+modelGroup.models[model]['isVisible']);
            modelSettings.push(+modelGroup.models[model][mean]);
            modelSettings.push(+modelGroup.models[model][std]);
            modelSettings.push(+modelGroup.models[model][median]);
            modelSettings.push(+modelGroup.models[model][percentile]);
        }
        modelSettings = parseBigInt(modelSettings.join(''), 2, 36);
        otherSettings[`group${i}`] = `"${name}",${visibilities.join('')},${models.join(
            ','
        )},${modelSettings}`;
    }

    return {
        plot: store.getState().plot.plotId,
        ...otherSettings,
    };
}

/**
 * This method updates the store based on the data in the URL.
 *
 * @param store a test store for testing the function
 * @param query a object with the query parameters
 */
export function updateStoreWithQuery(store, query) {
    if (!_.isEmpty(query)) {
        console.log(query);
        const latMin = parseInt(query.lat_min);
        const latMax = parseInt(query.lat_max);
        store.dispatch(setLocation({ minLat: latMin, maxLat: latMax }));

        const months = query.months.split(',').map((item) => {
            return parseInt(item);
        });
        store.dispatch(setMonths({ months }));

        const refModel = store.getState().api.models.data[parseInt(query.ref_meas)];
        store.dispatch(setModel({ model: refModel }));

        const refYear = parseInt(query.ref_year);
        store.dispatch(setYear({ year: refYear }));

        const refVisible = Boolean(parseInt(query.ref_visible));
        store.dispatch(setVisibility({ visible: refVisible }));

        const xZM = query.x_zm.split('-').map((item) => {
            return parseInt(item);
        });
        store.dispatch(setDisplayXRange({ years: { minX: xZM[0], maxX: xZM[1] } }));

        const yZM = query.y_zm.split('-').map((item) => {
            return parseInt(item);
        });
        store.dispatch(setDisplayYRange({ minY: yZM[0], maxY: yZM[1] }));

        query.title_zm && store.dispatch(setTitle({ title: query.title_zm.split('"')[1] }));

        store.dispatch(setActivePlotId({ plotId: O3AS_PLOTS.tco3_return }));

        store.dispatch(
            setDisplayXRange({
                regions: query.x_return.split(',').map((item) => {
                    return parseInt(item);
                }),
            })
        );

        const yReturn = query.y_return.split('-').map((item) => {
            return parseInt(item);
        });
        store.dispatch(setDisplayYRange({ minY: yReturn[0], maxY: yReturn[1] }));

        store.dispatch(setTitle({ title: query.title_return.split('"')[1] }));

        const plotId = query.plot;
        store.dispatch(setActivePlotId({ plotId: plotId }));

        let groupStrings = [];
        const groupIds = [...Object.keys(query)]
            .filter((x) => x.includes('group'))
            .map((x) => parseInt(x.replace('group', '')));
        for (const id of groupIds) {
            groupStrings.push(query[`group${id}`]);
        }
        const dataPerModel = 5; // isVisible, mean, std, median, percentile
        const groups = groupStrings.map((elem) => {
            const name = elem.split('"')[1];
            const visibilities = elem
                .split('"')[2]
                .split(',')[1]
                .split('')
                .map((elem) => {
                    return Boolean(parseInt(elem));
                });
            const models = elem
                .split('"')[2]
                .split(',')
                .slice(2, -1)
                .map((e) => {
                    return store.getState().api.models.data[parseInt(e)];
                });
            let modelSettings = elem.split('"')[2].split(',').slice(-1)[0];
            const binary = parseBigInt(modelSettings, 36, 2);
            let leadingZeros = '0' * (models.length * dataPerModel - binary.length);
            if (typeof leadingZeros === 'number') {
                leadingZeros = '';
            }
            modelSettings = leadingZeros + binary;
            modelSettings = modelSettings.split('').map((e) => {
                return Boolean(parseInt(e));
            });
            return {
                name: name,
                visibilities: visibilities,
                models: models,
                modelSettings: modelSettings,
            };
        });
        for (let i = 0; i < groups.length; i++) {
            store.dispatch(
                setModelsOfModelGroup({
                    groupId: i,
                    groupName: groups[i].name,
                    modelList: groups[i].models,
                })
            );
            store.dispatch(
                setVisibilityForGroup({ groupId: i, isVisible: groups[i].visibilities[0] })
            );
            for (let j = 1; j < groups[i].visibilities.length; j++) {
                store.dispatch(
                    setStatisticalValueForGroup({
                        groupId: i,
                        svType: STATISTICAL_VALUES_LIST[j - 1],
                        isIncluded: groups[i].visibilities[j],
                    })
                );
            }
            const dataCpy = JSON.parse(
                JSON.stringify(store.getState().models.modelGroups[i].models)
            );
            for (let j = 0; j < groups[i].models.length; j++) {
                const model = groups[i].models[j];
                dataCpy[model]['isVisible'] = groups[i].modelSettings[dataPerModel * j];
                dataCpy[model][mean] = groups[i].modelSettings[dataPerModel * j + 1];
                dataCpy[model][std] = groups[i].modelSettings[dataPerModel * j + 2];
                dataCpy[model][median] = groups[i].modelSettings[dataPerModel * j + 3];
                dataCpy[model][percentile] = groups[i].modelSettings[dataPerModel * j + 4];
            }
            store.dispatch(updatePropertiesOfModelGroup({ groupId: i, data: dataCpy }));
        }
    }
}
