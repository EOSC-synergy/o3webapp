import {
    mean,
    median,
    O3AS_PLOTS,
    percentile,
    STATISTICAL_VALUES_LIST,
    std,
} from 'utils/constants';
import {
    setActivePlotId,
    setDisplayXRange,
    setDisplayYRange,
    setLocation,
    setMonths,
    setTitle,
} from 'store/plotSlice';
import { setModel, setVisibility, setYear } from 'store/referenceSlice';
import {
    setModelsOfModelGroup,
    setStatisticalValueForGroup,
    setVisibilityForGroup,
    updatePropertiesOfModelGroup,
} from 'store/modelsSlice';
import bigInt from 'big-integer';
import { isEmpty } from 'lodash';
import { AppDispatch, AppState } from 'store';

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
function parseBigInt(str: string, baseFrom: number, baseTo: number) {
    let bigint = bigInt(0);
    const _baseFrom = bigInt(baseFrom);
    const _baseTo = bigInt(baseTo);
    for (const char of str) {
        bigint = _baseFrom.multiply(bigint).add(parseInt(char, baseFrom));
    }
    let result = '';
    while (bigint.greater(bigInt(0))) {
        result = bigint.mod(bigInt(baseTo)).toString(baseTo).toUpperCase() + result;
        bigint = bigint.divide(_baseTo);
    }
    return result;
}

/**
 * This method updates the URL based on the data in the store.
 *
 * @param state
 */
export function generateNewUrl(state: AppState) {
    const plotSpecific = state.plot.plotSpecificSettings;
    const _otherSettings = {
        lat_min: state.plot.generalSettings.location.minLat,
        lat_max: state.plot.generalSettings.location.maxLat,
        months: state.plot.generalSettings.months.join(','),
        ref_meas: state.api.models.data.indexOf(state.reference.settings.model),
        ref_year: state.reference.settings.year,
        ref_visible: +state.reference.settings.visible,
        x_zm: `${plotSpecific.tco3_zm.displayXRange.years.minX}-${plotSpecific.tco3_zm.displayXRange.years.maxX}`,
        y_zm: `${plotSpecific.tco3_zm.displayYRange.minY}-${plotSpecific.tco3_zm.displayYRange.maxY}`,
        x_return: plotSpecific.tco3_return.displayXRange.regions.join(','),
        y_return: `${plotSpecific.tco3_return.displayYRange.minY}-${plotSpecific.tco3_return.displayYRange.maxY}`,
        title_zm: `"${plotSpecific.tco3_zm.title}"`,
        title_return: `"${plotSpecific.tco3_return.title}"`,
    };
    const otherSettings: typeof _otherSettings & {
        // Intersection type to ensure all keys start with 'group'
        [key in `group${string}`]: string | number | undefined | null;
    } = _otherSettings;

    for (let i = 0; i < state.models.idCounter; i++) {
        if (typeof state.models.modelGroups[i] === 'undefined') {
            continue;
        }
        const modelGroup = state.models.modelGroups[i];
        const name = modelGroup.name;
        const visibilities = [
            +modelGroup.isVisible,
            +modelGroup.visibleSV.mean,
            +modelGroup.visibleSV['standard deviation'],
            +modelGroup.visibleSV.median,
            +modelGroup.visibleSV.percentile,
        ];
        const models = [];
        const modelSettings: number[] = [];
        for (const model of Object.keys(modelGroup.models)) {
            models.push(state.api.models.data.indexOf(model));
            modelSettings.push(+modelGroup.models[model]['isVisible']);
            modelSettings.push(+modelGroup.models[model][mean]);
            modelSettings.push(+modelGroup.models[model][std]);
            modelSettings.push(+modelGroup.models[model][median]);
            modelSettings.push(+modelGroup.models[model][percentile]);
        }
        const modelSettings2 = parseBigInt(modelSettings.join(''), 2, 36);
        otherSettings[`group${i}`] = `"${name}",${visibilities.join('')},${models.join(
            ','
        )},${modelSettings2}`;
    }

    return {
        plot: state.plot.plotId,
        ...otherSettings,
    };
}

/**
 * This method updates the store based on the data in the URL.
 *
 * @param dispatch
 * @param state
 * @param query a object with the query parameters
 */
export function updateStoreWithQuery(
    dispatch: AppDispatch,
    state: AppState,
    query: Record<string, string>
) {
    if (!isEmpty(query)) {
        console.log(query);
        const latMin = parseInt(query.lat_min);
        const latMax = parseInt(query.lat_max);
        dispatch(setLocation({ minLat: latMin, maxLat: latMax }));

        const months = query.months.split(',').map((item) => {
            return parseInt(item);
        });
        dispatch(setMonths({ months }));

        const refModel = state.api.models.data[parseInt(query.ref_meas)];
        dispatch(setModel({ model: refModel }));

        const refYear = parseInt(query.ref_year);
        dispatch(setYear({ year: refYear }));

        const refVisible = Boolean(parseInt(query.ref_visible));
        dispatch(setVisibility({ visible: refVisible }));

        const xZM = query.x_zm.split('-').map((item) => {
            return parseInt(item);
        });
        dispatch(setDisplayXRange({ years: { minX: xZM[0], maxX: xZM[1] } }));

        const yZM = query.y_zm.split('-').map((item) => {
            return parseInt(item);
        });
        dispatch(setDisplayYRange({ minY: yZM[0], maxY: yZM[1] }));

        query.title_zm && dispatch(setTitle({ title: query.title_zm.split('"')[1] }));

        dispatch(setActivePlotId({ plotId: O3AS_PLOTS.tco3_return }));

        dispatch(
            setDisplayXRange({
                regions: query.x_return.split(',').map((item) => {
                    return parseInt(item);
                }),
            })
        );

        const yReturn = query.y_return.split('-').map((item) => {
            return parseInt(item);
        });
        dispatch(setDisplayYRange({ minY: yReturn[0], maxY: yReturn[1] }));

        dispatch(setTitle({ title: query.title_return.split('"')[1] }));

        const plotId = query.plot as O3AS_PLOTS;
        dispatch(setActivePlotId({ plotId: plotId }));

        const groupStrings = [];
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
                    return state.api.models.data[parseInt(e)];
                });
            const modelSettings = elem.split('"')[2].split(',').slice(-1)[0];
            const binary = parseBigInt(modelSettings, 36, 2);
            const modelSettings2 = binary
                .padStart(models.length * dataPerModel, '0')
                .split('')
                .map((e) => {
                    return Boolean(parseInt(e));
                });
            return {
                name: name,
                visibilities: visibilities,
                models: models,
                modelSettings: modelSettings2,
            };
        });
        for (let i = 0; i < groups.length; i++) {
            dispatch(
                setModelsOfModelGroup({
                    groupId: i,
                    groupName: groups[i].name,
                    modelList: groups[i].models,
                })
            );
            dispatch(setVisibilityForGroup({ groupId: i, isVisible: groups[i].visibilities[0] }));
            for (let j = 1; j < groups[i].visibilities.length; j++) {
                dispatch(
                    setStatisticalValueForGroup({
                        groupId: i,
                        svType: STATISTICAL_VALUES_LIST[j - 1],
                        isIncluded: groups[i].visibilities[j],
                    })
                );
            }
            const dataCpy = JSON.parse(JSON.stringify(state.models.modelGroups[i].models));
            for (let j = 0; j < groups[i].models.length; j++) {
                const model = groups[i].models[j];
                dataCpy[model]['isVisible'] = groups[i].modelSettings[dataPerModel * j];
                dataCpy[model][mean] = groups[i].modelSettings[dataPerModel * j + 1];
                dataCpy[model][std] = groups[i].modelSettings[dataPerModel * j + 2];
                dataCpy[model][median] = groups[i].modelSettings[dataPerModel * j + 3];
                dataCpy[model][percentile] = groups[i].modelSettings[dataPerModel * j + 4];
            }
            dispatch(updatePropertiesOfModelGroup({ groupId: i, data: dataCpy }));
        }
    }
}
