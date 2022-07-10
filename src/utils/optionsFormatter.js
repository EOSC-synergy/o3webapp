import {
    mean as calculateMean,
    median as calculateMedian,
    median,
    q25,
    q75,
    quantile as calculatePercentile,
    std as calculateStd,
} from '../services/math/math';
import {
    END_YEAR,
    EXTENDED_SV_LIST,
    months,
    NUM_MONTHS,
    O3AS_PLOTS,
    percentile,
    START_YEAR,
    STATISTICAL_VALUES,
    STATISTICAL_VALUES_LIST,
    std,
    stdMean,
    USER_REGION,
    latitudeBands,
    lowerPercentile,
    upperPercentile,
} from './constants';
import { convertModelName } from './ModelNameConverter';

/**
 * A module containing functions to format the data given or stored in the redux store into a format
 * that is used and accepted by the corresponding target library/module/function (e.g. apexcharts).
 *
 *
 * @module OptionsFormatter */ // used for auto generation of JSDocs with better-docs

/**
 * This array provides a list from start to end year with each year as a string
 * @constant {Array}
 */
export const IMPLICIT_YEAR_LIST = [...Array(END_YEAR - START_YEAR + 1).keys()].map(
    (number) => `${START_YEAR + number}`
);

/**
 * This parameter specifies how thick the line of plotted models should appear.
 * @constant {number}
 */
export const MODEL_LINE_THICKNESS = 2;

/**
 * This parameter specifies how thick the line of plotted statistical values should appear.
 * @constant {number}
 */
const STATISTICAL_VALUE_LINE_THICKNESS = 2;

/**
 * This object maps each statistical value that should be calculated
 * to a corresponding function describing HOW it should be calculated.
 * @constant {Object}
 */
const SV_CALCULATION = {
    mean: calculateMean,
    median: calculateMedian,
    percentile: calculatePercentile,
    //stdMean: calculateMean, // mean for std+-
    [std]: calculateStd,
    [lowerPercentile]: (arr) => calculatePercentile(arr, 0.1587),
    [upperPercentile]: (arr) => calculatePercentile(arr, 0.8413),
    [stdMean]: calculateMean,
};

/**
 * This object maps each statistical value that should be calculated
 * to a color it should appear in.
 * @constant {Object}
 */
const SV_COLORING = {
    mean: '#696969',
    'standard deviation': '#0e4e78', //"#000",
    median: '#000',
    percentile: '#000',
    lowerPercentile: '#1e8509',
    upperPercentile: '#1e8509',
    'mean+std': '#0e4e78',
    'mean-std': '#0e4e78',
};

/**
 * This object maps each statistical value that should be calculated
 * to its line dashing allowing an easy customization if e.g. the
 * mean should be dashed too.
 *
 * The integer values correspond to the dashing format that is
 * expected by apexcharts.
 * @constant {Object}
 */
const SV_DASHING = {
    mean: 0,
    median: 2,
    percentile: 0,
    'mean+std': 8,
    'mean-std': 8,
    lowerPercentile: 4,
    upperPercentile: 4,
};

/**
 * This object maps each statistical value to its corresponding name that
 * should be displayed in the legend of the plot and inside the tooltip when
 * hovering over a datapoint.
 * @constant {Object}
 */
const SV_DISPLAY_NAME = {
    mean: 'Mean',
    median: 'Median',
    percentile: 'Percentile',
    'mean+std': 'μ + σ',
    'mean-std': 'μ - σ',
    lowerPercentile: 'Lower %',
    upperPercentile: 'Upper %',
};

/**
 * Maps the plotId to a function that describes how the series are going
 * to be generated in order to make the generateSeries Function (interface) more
 * generic.
 * @constant {Object}
 */
const SERIES_GENERATION = {
    [O3AS_PLOTS.tco3_zm]: generateTco3_ZmSeries,
    [O3AS_PLOTS.tco3_return]: generateTco3_ReturnSeries,
}; // Map plotId to corresponding generation function

/**
 * A string containing a list of used font families seperated by a comma.
 *
 * @constant {string}
 */
export const FONT_FAMILY = [
    '-apple-system',
    'BlinkMacSystemFont',
    '"Segoe UI"',
    'Roboto',
    '"Helvetica Neue"',
    'Arial',
    'sans-serif',
    '"Apple Color Emoji"',
    '"Segoe UI Emoji"',
    '"Segoe UI Symbol"',
].join(',');

/**
 * Creates the subtitle based on location and time.
 *
 * @param {function} getState A function to get the state of the redux store
 * @returns {string} The subtitle created based on the data stored in the redux store
 * @function
 */
function createSubtitle(getState) {
    let stLocationText = findLatitudeBandByLocation(getState);

    if (stLocationText === 'Custom') {
        stLocationText = formatLatitude(getState().plot.generalSettings.location);
    }

    let stMonths = [];
    getState().plot.generalSettings.months.map((month) =>
        stMonths.push(months[month - 1].description)
    );
    if (stMonths.length === NUM_MONTHS) {
        stMonths = ['All year'];
    }

    if (getState().plot.plotId === 'tco3_zm') {
        return `${stLocationText} | ${stMonths.join(', ')}`;
    } else {
        return stMonths.join(', ');
    }
}

/**
 * The default settings for the tco3_zm plot.
 *
 * colors, width, dashArray have to be filled.
 *
 * This gigantic object allows us to communicate with the apexcharts library.
 * More can be found here: {@link https://apexcharts.com/docs/installation/}
 * @constant {Object}
 */
export const defaultTCO3_zm = {
    xaxis: {
        type: 'numeric',
        min: START_YEAR,
        max: END_YEAR,
        decimalsInFloat: 0,
        labels: {
            rotate: 0,
        },
        title: {
            text: 'Year',
            style: {
                fontSize: '1rem',
                fontFamily: FONT_FAMILY,
            },
        },
    },
    yaxis: [],
    annotations: {
        points: [],
    },
    grid: {
        show: false,
    },
    chart: {
        id: O3AS_PLOTS.tco3_zm,
        animations: {
            enabled: false,
            easing: 'linear',
        },
        toolbar: {
            show: false,
            offsetX: -60,
            offsetY: 10,
            tools: {
                download: false,
                pan: false,
                zoomin: false,
                zoomout: false,
                zoom: false,
            },
        },
        zoom: {
            enabled: false,
        },
        width: '100%',
    },
    legend: {
        show: true,
        onItemClick: {
            toggleDataSeries: false,
        },
        markers: {},
        height: 80,
    },
    dataLabels: {
        enabled: false,
    },
    tooltip: {
        shared: false,
    },
    colors: null, //styling.colors
    stroke: {
        width: null, // styling.width,
        dashArray: null, //styling.dashArray,
    },
    title: {
        text: '[title]', // title can only be changed in store/plotSlice.js
        align: 'center',
        floating: false,
        style: {
            fontSize: '30px',
            fontWeight: 'bold',
            fontFamily: FONT_FAMILY,
            color: '#000000',
        },
    },
    subtitle: {
        text: '[subtitle]', // subtitle can only be changed in createSubtitle function
        align: 'center',
        floating: false,
        offsetY: 40,
        style: {
            fontSize: '20px',
            fontFamily: FONT_FAMILY,
            color: '#000000',
        },
    },
};

/**
 * This function is a factory method to provide objects that are fitted in the y-axis of the tco3_zm plot to
 * show another y-axis on the right side.
 *
 * @param {string} seriesName the name of the series
 * @param {number} minY the minimum y value (to adjust to the zoom)
 * @param {number} maxY the maximum y value (to adjust to the zoom)
 * @param {boolean} show whether the y-axis should be hidden (default is false)
 * @param {boolean} opposite whether to show the y-axis on the right side (default is false)
 * @param {number} offsetX how many px the y-axis should be adjusted
 * @param {number} tickAmount how many ticks (on the y-axis) should be displayed (should be calculated by functions to provide a nice formatting)
 * @returns {Object} The defaults for the YAxis of Tco3Zm plot
 * @function
 */
export function getDefaultYAxisTco3Zm(
    seriesName,
    minY,
    maxY,
    show = false,
    opposite = false,
    offsetX = -1,
    tickAmount = 0
) {
    return {
        show,
        opposite,
        seriesName,
        min: minY,
        max: maxY,
        decimalsInFloat: 0,
        axisBorder: {
            show: true,
            offsetX,
        },
        axisTicks: {
            show: true,
        },
        tickAmount,
        title: {
            text: opposite ? '' : 'TCO(DU)', // don't show description on right side
            style: {
                fontSize: '1rem',
                fontFamily: FONT_FAMILY,
            },
        },
        labels: {
            formatter: opposite ? () => '' : formatYLabelsNicely, // hide labels with function that always returns empty strings
        },
        /*
        tooltip: {
          enabled: true, // => kinda messy
        }
        */
    };
}

/**
 * This function is a factory method to provide objects that are fitted in the y-axis of the tco3_return plot to
 * show another y-axis on the right side.
 *
 * @param {string} seriesName the name of the series
 * @param {number} minY the minimum y value (to adjust to the zoom)
 * @param {number} maxY the maximum y value (to adjust to the zoom)
 * @param {boolean} show whether the y-axis should be hidden (default is false)
 * @param {boolean} opposite whether to show the y-axis on the right side (default is false)
 * @param {number} offsetX how many px the y-axis should be adjusted
 * @param {number} tickAmount how many ticks (on the y-axis) should be displayed (should be calculated by functions to provide a nice formatting)
 * @returns {Object} The defaults for the YAxis of Tco3Zm return
 * @function
 */
export function getDefaultYAxisTco3Return(
    seriesName,
    minY,
    maxY,
    show = false,
    opposite = false,
    offsetX = -1,
    tickAmount = 0
) {
    return {
        show,
        opposite,
        seriesName,
        min: minY,
        max: maxY,
        forceNiceScale: false,
        decimalsInFloat: 0,
        axisBorder: {
            show: true,
            offsetX,
        },
        axisTicks: {
            show: true,
        },
        tickAmount,
        title: {
            text: opposite ? '' : 'Year', // don't show description on right side
            style: {
                fontSize: '1rem',
                fontFamily: FONT_FAMILY,
            },
        },
        labels: {
            formatter: opposite ? () => '' : formatYLabelsNicely, // hide labels with function that always returns empty strings
        },
    };
}

/**
 * The default settings for the tco3_return plot.
 *
 * colors have to be filled.
 *
 * This gigantic object allows us to communicate with the apexcharts library.
 * More can be found here: {@link https://apexcharts.com/docs/installation/}
 * @constant {Object}
 */
export const default_TCO3_return = {
    xaxis: {
        title: {
            text: 'Region',
            style: {
                fontSize: '1rem',
                fontFamily: FONT_FAMILY,
            },
        },
    },
    yaxis: [],
    grid: {
        show: false,
    },
    chart: {
        id: O3AS_PLOTS.tco3_return,
        type: 'boxPlot',
        animations: {
            enabled: false, // disable animations
        },
        zoom: {
            enabled: false,
        },
        toolbar: {
            show: false,
        },
    },
    colors: [undefined], // , ...styling.colors
    title: {
        text: '[title]', // title can only be changed in store/plotSlice.js
        align: 'center',
        floating: false,
        style: {
            fontSize: '30px',
            fontWeight: 'bold',
            fontFamily: FONT_FAMILY,
            color: '#000000',
        },
    },
    subtitle: {
        text: '[subtitle]', // subtitle can only be changed in createSubtitle function
        align: 'center',
        floating: false,
        offsetY: 40,
        style: {
            fontSize: '20px',
            fontFamily: FONT_FAMILY,
            color: '#000000',
        },
    },
    tooltip: {
        shared: false,
        intersect: true,
    },
    plotOptions: {
        boxPlot: {
            colors: {
                upper: '#8def4e', //'#5C4742',
                lower: '#63badb', //'#A5978B'
            },
        },
    },
    legend: {
        show: true,
        height: 80,
        fontSize: '16px',
    },

    markers: {
        size: 5,
        colors: [undefined], // ...styling.colors
        strokeColors: '#000',
        strokeWidth: 0,
        strokeOpacity: 0.2, //?
        strokeDashArray: 0, //?
        fillOpacity: 0.7,
        discrete: [],
        //shape: [undefined, "circle", "square"], // circle or square
        radius: 1,
        offsetX: 0, // interesting
        offsetY: 0,
        onDblClick: undefined,
        showNullDataPoints: true,
        hover: {
            size: 10,
            sizeOffset: 10,
        },
    },
};

/**
 * The interface the graph component accesses to generate the options for the plot
 * given the plot id, the styling (depends on plot type) and the plot title.
 *
 * @param {string} plotId an element of O3AS_PLOTS
 * @param {Object} styling the styling
 * @param {Array} styling.colors an array of strings with hex code. Has to match the length of the given series
 * @param {Array} styling.width (tco3_zm only!): array of integer defining the line width
 * @param {Array} styling.dashArray (tco3_zm only!): array of integer defining if the line is solid or dashed
 * @param {string} plotTitle contains the plot title
 * @param {Object} xAxisRange the range of the x-axis
 * @param {Object} yAxisRange the range of the y-axis
 * @param {Object} seriesNames the names of the series
 * @param {function} getState store.getState
 * @returns {Object} An default_TCO3_plotId object formatted with the given data
 * @function
 */
export function getOptions({
    plotId,
    styling,
    plotTitle,
    xAxisRange,
    yAxisRange,
    seriesNames,
    getState,
}) {
    const minY = roundDownToMultipleOfTen(yAxisRange.minY);
    const maxY = roundUpToMultipleOfTen(yAxisRange.maxY);

    const tickAmount = getTickAmountYAxis(minY, maxY);

    if (plotId === O3AS_PLOTS.tco3_zm) {
        const newOptions = JSON.parse(JSON.stringify(defaultTCO3_zm)); // dirt simple and not overly horrible

        newOptions.yaxis.push(
            ...seriesNames.map((name) =>
                getDefaultYAxisTco3Zm(name, minY, maxY, false, false, 0, tickAmount)
            )
        );
        newOptions.yaxis.push(
            getDefaultYAxisTco3Zm(undefined, minY, maxY, true, false, -1, tickAmount)
        ); // on left side
        newOptions.yaxis.push(
            getDefaultYAxisTco3Zm(undefined, minY, maxY, true, true, 0, tickAmount)
        ); // on right side

        newOptions.xaxis.min = roundDownToMultipleOfTen(xAxisRange.years.minX);
        newOptions.xaxis.max = roundUpToMultipleOfTen(xAxisRange.years.maxX);
        newOptions.xaxis.tickAmount = getOptimalTickAmount(
            newOptions.xaxis.min,
            newOptions.xaxis.max
        );

        const xIdx = 0;
        const yIdx = 1;
        for (let point of styling.points) {
            newOptions.annotations.points.push({
                x: point[xIdx],
                y: point[yIdx],
                marker: { size: 4 } /*, label: {text: point[xIdx]}*/,
            });
        }

        newOptions.colors = styling.colors;

        newOptions.stroke.width = styling.width;
        newOptions.stroke.dashArray = styling.dashArray;
        newOptions.title = JSON.parse(JSON.stringify(newOptions.title)); // this is necessary in order for apexcharts to update the title
        newOptions.title.text = plotTitle;
        newOptions.subtitle = JSON.parse(JSON.stringify(newOptions.subtitle)); // this is necessary in order for apexcharts to update the subtitle
        newOptions.subtitle.text = createSubtitle(getState);
        newOptions.tooltip.custom = customTooltipFormatter;

        const legendItems = [];
        for (let idx in seriesNames) {
            const name = seriesNames[idx];
            const color = styling.colors[idx];
            const dashing = styling.dashArray[idx];
            let linePattern;
            let fontSize = 20;
            if (dashing <= 0) {
                linePattern = '<b>───</b>';
            } else if (dashing <= 2) {
                linePattern = '••••';
                fontSize = 12;
            } else {
                linePattern = '<b>---</b>';
            }
            legendItems.push(
                `<span style="color:${color};font-family:Consolas, monaco, monospace;font-size:${fontSize}px;">${linePattern}</span> <span style="font-size: 16px">${name}</span> `
            );
        }

        newOptions.legend.customLegendItems = legendItems;
        newOptions.legend.markers.width = 0;
        return newOptions;
    } else if (plotId === O3AS_PLOTS.tco3_return) {
        const newOptions = JSON.parse(JSON.stringify(default_TCO3_return));
        newOptions.colors.push(...styling.colors); // for the legend!
        newOptions.title = JSON.parse(JSON.stringify(newOptions.title)); // this is necessary in order for apexcharts to update the title
        newOptions.title.text = plotTitle;
        newOptions.subtitle = JSON.parse(JSON.stringify(newOptions.subtitle)); // this is necessary in order for apexcharts to update the subtitle
        newOptions.subtitle.text = createSubtitle(getState);

        const minY = roundDownToMultipleOfTen(yAxisRange.minY);
        const maxY = roundUpToMultipleOfTen(yAxisRange.maxY);
        newOptions.yaxis.push(
            ...seriesNames.map((name) =>
                getDefaultYAxisTco3Return(name, minY, maxY, false, false, 0, tickAmount)
            )
        );
        newOptions.yaxis.push(
            getDefaultYAxisTco3Return(undefined, minY, maxY, true, false, 3, tickAmount)
        ); // on left side
        newOptions.yaxis.push(
            getDefaultYAxisTco3Return(undefined, minY, maxY, true, true, -3, tickAmount)
        ); // on right side

        return newOptions;
    }
}

/**
 * The interface the graph component accesses to generate the series for the plot.
 *
 * This function generates data structures that can directly be passed to apexcharts.
 * It accepts the plotId because series are generated according to the type of plot.
 * Furthermore, the data object holds all plot data for the selected options
 * and modelsSlice is a slice from the redux store which contains information
 * about what model groups exist, which of them are visible or should be included in the
 * statistical value calculation.
 *
 * It additionally generates a styling object which contains colors (and width/dashArray for tco3_zm).
 *
 * @param {string} plotId the id of the currently selected plot
 * @param {Object} data the raw data from the api for the current options
 * @param {Object} modelsSlice the slice of the store containing information about the model groups
 * @param {Object} xAxisRange the range of the x-axis
 * @param {Object} yAxisRange the range of the y-axis
 * @param {Object} refLineVisible visibility status of the reference line
 * @returns {Object} series object which includes a subdivision into a data and a styling object.
 * @function
 */
export function generateSeries({
    plotId,
    data,
    modelsSlice,
    xAxisRange,
    yAxisRange,
    refLineVisible,
    getState,
}) {
    const series = SERIES_GENERATION[plotId]({
        data,
        modelsSlice,
        xAxisRange,
        yAxisRange,
        refLineVisible,
        getState,
    }); // execute correct function based on mapping
    return {
        data: series.data,
        styling: {
            colors: series.colors,
            dashArray: series.dashArray,
            width: series.width,
            points: series.points,
        },
    }; // return generated series with styling to pass to apexcharts chart
}

/**
 * This method generates the data series for tco3_zm for all models that should be displayed (specified via groups).
 * It furthermore adds the statistical values also as series at the end.
 *
 * @param {Object} data the raw data from the api for the current options
 * @param {Object} modelsSlice the slice of the store containing information about the model groups
 * @param {boolean} refLineVisible visibility status of the reference line
 * @returns {Object} A combination of data and statistical values series
 * @param {function} getState store.getState
 * @function
 */
function generateTco3_ZmSeries({ data, modelsSlice, refLineVisible, getState }) {
    const series = {
        data: [],
        colors: [],
        width: [],
        dashArray: [],
    };
    if (refLineVisible) {
        series.data.push({
            name: data.reference_value.plotStyle.label,
            data: data.reference_value.data.map((e, idx) => [START_YEAR + idx, e]),
        });
        series.colors.push(colorNameToHex(data.reference_value.plotStyle.color));
        series.width.push(MODEL_LINE_THICKNESS);
        series.dashArray.push(convertToStrokeStyle(data.reference_value.plotStyle.linestyle));
    }

    for (const groupData of Object.values(modelsSlice.modelGroups)) {
        // iterate over model groups  // don't remove 'id'
        if (!groupData.isVisible) {
            continue;
        } // skip hidden groups
        for (const [model, modelInfo] of Object.entries(groupData.models)) {
            if (!modelInfo.isVisible) {
                continue;
            } // skip hidden models
            const modelData = data[model]; // retrieve data (api)
            if (typeof modelData === 'undefined') {
                continue;
            } // skip model if it is not available
            series.data.push({
                name: model,
                data: modelData.data.map((e, idx) => [START_YEAR + idx, e]),
            });

            series.colors.push(colorNameToHex(modelData.plotStyle.color));
            series.width.push(MODEL_LINE_THICKNESS);
            series.dashArray.push(convertToStrokeStyle(modelData.plotStyle.linestyle)); // default line thickness
        }
    }

    // generate SV!
    const svSeries = buildStatisticalSeries({
        data,
        modelsSlice,
        buildMatrix: buildSvMatrixTco3Zm,
        generateSingleSvSeries: generateSingleTco3ZmSeries,
    });

    return Object.assign(combineSeries(series, svSeries), {
        points: refLineVisible ? calcRecoveryPoints(getState, data.reference_value, svSeries) : [],
    });
}

/**
 * This plugin-method is used to specify how series for tco3_zm should be build inside
 * the buildStatisticalValues-function.
 *
 * @param {string} name of the series
 * @param {Array} svData array of plaint numbers
 * @returns {Object} A series matching the tco3_zm style for apexcharts.
 * @function
 */
function generateSingleTco3ZmSeries(name, svData) {
    return {
        name: name,
        data: svData.map((e, idx) => [START_YEAR + idx, e]),
    };
}

/**
 * This plug-in method is used to specify how the data should be parsed and
 * arranged so that the generic buildStatisticalValues-Function can
 * take care of the calculation.
 *
 * The data arrangement is basically a transposition.
 * The first datapoint of each model ist grouped into the first array.
 * and so on...
 *
 * @param {Array} modelList list of models of a group that should be included
 * @param {Object} data an object holding all the data from the api
 * @returns {Array} A 2D array containing all the data (transpose matrix of given data)
 * @function
 */
function buildSvMatrixTco3Zm({ modelList, data }) {
    const SERIES_LENGTH = data[modelList[0]].data.length; // grab length of first model, should all be same

    const matrix = create2dArray(SERIES_LENGTH); // for arr of matrix: mean(arr), etc.

    for (let i = 0; i < SERIES_LENGTH; ++i) {
        for (const model of modelList) {
            const modelData = data[model];
            if (typeof modelData === 'undefined') {
                continue;
            }
            matrix[i].push(
                modelData.data[i] // add null anyway to remain index mapping (null is filtered out later)
            );
        }
    }
    return matrix;
}

/**
 * This method generates the data series for the tco3_return for all models that should be displayed (specified via groups).
 * It furthermore adds the statistical values also as series at the end.
 *
 * @param {object} data the raw data from the api for the current options
 * @param {object} modelsSlice the slice of the store containing information about the model groups
 * @param {object} xAxisRange the range of the x-axis
 * @param {object} yAxisRange the range of the y-axis
 * @returns {Object} A combination of data and statistical values series
 * @function
 */
function generateTco3_ReturnSeries({ data, modelsSlice, xAxisRange, yAxisRange, getState }) {
    const series = {
        data: [],
        colors: [],
        width: [],
        dashArray: [],
    };

    const firstKey = Object.keys(data)[0]; // grab first key to extract regions from api response
    let regions = firstKey ? Object.keys(data[firstKey].data) : [];
    // 1. build boxplot
    const boxPlotValues = calculateBoxPlotValues({ data, modelsSlice, regions });
    let regionData = regions.map((region) => ({
        x: region,
        y: boxPlotValues[region],
    }));
    regionData.pop();
    regionData.push({
        x: formatLatitude(getState().plot.generalSettings.location), // generate title according to custom min-max values
        y: boxPlotValues[USER_REGION],
    });
    series.data.push({
        name: '', // removed name of box, so it doesn't show up in the legend!
        type: 'boxPlot',

        data: regionData,
    });

    // 2. build scatter plot
    const minY = yAxisRange.minY;
    const maxY = yAxisRange.maxY;
    for (const groupData of Object.values(modelsSlice.modelGroups)) {
        // iterate over model groups
        if (!groupData.isVisible) {
            continue;
        } // skip hidden groups
        for (const [model, modelInfo] of Object.entries(groupData.models)) {
            if (!modelInfo.isVisible) {
                continue;
            } // skip hidden models
            const modelData = data[model];
            if (typeof modelData === 'undefined') {
                continue;
            } // skip model if it is not available
            const sortedData = regions.map((region) => ({
                x: region,
                y: filterOutOfRange(modelData.data[region], minY, maxY) || null, // null as default if data is missing
            }));
            sortedData.pop();
            sortedData.push({
                x: formatLatitude(getState().plot.generalSettings.location),
                y: filterOutOfRange(modelData.data[USER_REGION], minY, maxY) || null, // null as default if data is missing
            });

            series.data.push({
                name: model,
                data: sortedData,
                type: 'scatter',
            });
            series.colors.push(colorNameToHex(modelData.plotStyle.color));
        }
    }

    // 3. generate statistical values
    const svSeries = buildStatisticalSeries({
        data,
        modelsSlice,
        yAxisRange,
        buildMatrix: buildSvMatrixTco3Return,
        generateSingleSvSeries: generateSingleTco3ReturnSeries,
        getState,
        regions,
    });

    // clear out data points which are outside min-max display range (scatter points are displayed in the legend otherwise)
    for (const series of svSeries.data) {
        for (const regionData of series.data) {
            regionData.y = filterOutOfRange(regionData.y, minY, maxY);
        }
    }

    const combined = combineSeries(series, svSeries);

    for (const series of combined.data) {
        // select chosen regions
        series.data = series.data.filter((value, idx) => xAxisRange.regions.includes(idx));
    }

    return combined;
}

/**
 * This plugin-method is used to specify how series for tco3_return should be build inside
 * the buildStatisticalValues-function.
 *
 * @param {string} name of the series
 * @param {Array} svData array of plaint numbers
 * @returns {Object} a series matching the tco3_return style for apexcharts.
 * @function
 */
function generateSingleTco3ReturnSeries(name, svData, getState, regions) {
    const transformedData = regions.map((region, index) => {
        if (index !== regions.length - 1) {
            return {
                x: region,
                y: svData[index],
            };
        } else {
            return {
                x: formatLatitude(getState().plot.generalSettings.location),
                y: svData[index],
            };
        }
    });

    return {
        name: name,
        data: transformedData,
        type: 'scatter',
    };
}

/**
 * This plug-in method is used to specify how the data should be parsed and
 * arranged so that the generic buildStatisticalValues-Function can
 * take care of the calculation.
 *
 * The data arrangement is basically a transposition.
 * The first datapoint of each model ist grouped into the first array.
 * and so on...
 *
 * @param {Array} modelList list of models of a group that should be included
 * @param {Object} data an object holding all the data from the api
 * @returns {Array} A 2D array containing all the data (transpose matrix of given data)
 * @function
 */
function buildSvMatrixTco3Return({ modelList, data, regions }) {
    const matrix = create2dArray(regions.length);

    for (const index in regions) {
        const region = regions[index]; // iterate over regions
        for (const model of modelList) {
            const modelData = data[model];
            if (typeof modelData === 'undefined') {
                continue;
            }
            matrix[index].push(modelData.data[region] || null);
        }
    }
    return matrix;
}

/**
 * This method calculates the boxplot values for the tco3_return plot.
 * For each region an array of 5 values is calculated: min, q1, median, q3, max
 * which is sufficient to render the desired box plot.
 *
 * @param {Object} data contains the region data from the api
 * @param {Object} modelsSlice the slice of the store containing information about the model groups
 * @returns {Object} Object holding an array of 5 values (min, q1, median, q3, max) for each region
 * @function
 */
function calculateBoxPlotValues({ data, modelsSlice, regions }) {
    const boxPlotHolder = {};
    for (let region of regions) {
        boxPlotHolder[region] = [];
    }

    for (const groupData of Object.values(modelsSlice.modelGroups)) {
        // iterate over model groups  // don't remove 'id'
        if (!groupData.isVisible) {
            continue;
        } // skip hidden groups
        for (const [model, modelInfo] of Object.entries(groupData.models)) {
            if (!modelInfo.isVisible) {
                continue;
            } // skip hidden models
            const modelData = data[model];
            if (typeof modelData === 'undefined') {
                continue;
            } // skip model if it is not available
            for (const [region, year] of Object.entries(modelData.data)) {
                if (year || year === 0) {
                    // allow 0 but not null | undefined
                    boxPlotHolder[region].push(year);
                }
            }
        }
    }

    const boxPlotValues = {};
    for (let region of regions) {
        boxPlotHolder[region].sort();
        const arr = boxPlotHolder[region];
        boxPlotValues[region] = [];
        boxPlotValues[region].push(arr[0], q25(arr), median(arr), q75(arr), arr[arr.length - 1]);
    }
    return boxPlotValues;
}

/**
 * This method builds the statistical series using the passed buildMatrix method
 * that brings the data into the desired format and uses the
 * passed generateSingleSvSeries function to transform each generated series into
 * the correct format.
 *
 * @param {Object} data the raw data from the api for the current options
 * @param {Object} modelsSlice the slice of the store containing information about the model groups
 * @param {function} buildMatrix either buildSvMatrixTco3Zm | buildSvMatrixTco3Return, specifies how the data should be transformed
 * @param {function} generateSingleSvSeries either generateSingleTco3ZmSeries | generateSingleTco3ReturnSeries, specifies how the series should be generated
 * @returns {Array} An array holding all statistical series for the given modelSlice
 * @function
 */
function buildStatisticalSeries({
    data,
    modelsSlice,
    buildMatrix,
    generateSingleSvSeries,
    getState,
    regions,
}) {
    const svSeries = {
        data: [],
        colors: [],
        width: [],
        dashArray: [],
    };

    const modelGroups = modelsSlice.modelGroups;
    for (const groupData of Object.values(modelGroups)) {
        const svHolder = calculateSvForModels(
            Object.keys(groupData.models),
            data,
            groupData,
            buildMatrix,
            regions
        );

        for (const [sv, svData] of Object.entries(svHolder)) {
            if (sv === std || sv === percentile) {
                continue;
            } // skip for now

            if (
                !(
                    groupData.visibleSV[sv] || // mean und median
                    (sv.includes('std') && groupData.visibleSV[std]) ||
                    (sv.toLowerCase().includes(percentile) && groupData.visibleSV[percentile])
                )
            ) {
                continue;
            }
            svSeries.data.push(
                generateSingleSvSeries(
                    `${SV_DISPLAY_NAME[sv]} (${groupData.name})`,
                    svData,
                    getState,
                    regions
                )
            );
            svSeries.colors.push(SV_COLORING[sv]);
            svSeries.width.push(STATISTICAL_VALUE_LINE_THICKNESS);
            svSeries.dashArray.push(SV_DASHING[sv]);
        }
    }
    return svSeries;
}

/**
 * Calculates the statistical values for the given modelList (from a certain model group).
 * Takes into account the groupData object which stores information about the models.
 *
 * @param {array} modelList a list of all models of a specific model group.
 * @param {object} data the raw data from the api for the current options
 * @param {object} groupData the modelsSlice data narrowed down for a specific model group
 * @param {function} buildMatrix either buildSvMatrixTco3Zm | buildSvMatrixTco3Return, specifies how the data should be transformed
 * @returns {Object} An object containing the calculated values for the statistical values
 * @function
 */
function calculateSvForModels(modelList, data, groupData, buildMatrix, regions) {
    // pass group data
    // only mean at beginning

    const matrix = buildMatrix({ modelList, data, regions }); // function supplied by caller

    const PROCESS_SV = [
        ...STATISTICAL_VALUES_LIST.filter((x) => x !== STATISTICAL_VALUES.percentile),
        ...EXTENDED_SV_LIST,
    ];

    const svHolder = {};
    PROCESS_SV.forEach(
        (sv) => (svHolder[sv] = []) // init with empty array
    );

    for (const arr of matrix) {
        // fill with calculated sv
        for (const sv of PROCESS_SV) {
            // filter out values from not included models or null values
            const filtered = arr.filter(
                (value, idx) => value !== null && isIncludedInSv(modelList[idx], groupData, sv)
            );

            const value = SV_CALCULATION[sv](filtered); // null as default if NaN or undefined
            if (isNaN(value) || typeof value === 'undefined') {
                svHolder[sv].push(null); //apexcharts default "missing" value placeholder
            } else {
                svHolder[sv].push(value);
            }
        }
    }

    svHolder['mean+std'] = [];
    svHolder['mean-std'] = [];
    for (let i = 0; i < svHolder[std].length; ++i) {
        if (svHolder[stdMean][i] === null || svHolder[std][i] === null) {
            svHolder['mean+std'].push(null);
            svHolder['mean-std'].push(null);
        } else {
            svHolder['mean+std'].push(svHolder[stdMean][i] + svHolder[std][i]);
            svHolder['mean-std'].push(svHolder[stdMean][i] - svHolder[std][i]);
        }
    }
    delete svHolder['stdMean'];
    return svHolder;
}

// API FORMATTING:

/**
 * Iterates through the x and y data returned from the api for the tco3_zm and fills the corresponding years with
 * either data points, if they are present or with `null`. The first index corresponds to START_YEAR
 *
 * @param {Array} xValues an array holding the years
 * @param {Array} yValues an array of the same length holding the data points for the corresponding years
 * @returns {Array} The normalized array
 * @function
 */
export function normalizeArray(xValues, yValues) {
    const result = [];
    let currentValueIndex = 0;

    for (let year of IMPLICIT_YEAR_LIST) {
        if (xValues[currentValueIndex] === year) {
            result.push(yValues[currentValueIndex]);
            currentValueIndex++;
        } else {
            result.push(null);
        }
    }
    return result;
}

/**
 * This function is called only once when the data from the API is fetched. It transforms the data
 * into a format that (hopefully) speeds up the computation of certain things.
 *
 * The TCO3_ZM data is transformed from an x and y array into one single array whose first index
 * represents the START_YEAR. It contains either data points or null.
 * x = ['1960', '1963', '1965', '1966']
 * y = [0, 1, 2, 3]
 * normalized: [0, null (1961), null (1962), 1, null (1964), 2, 3, null (1967), ...]
 *
 * The TCO3_RETURN data is transformed from an x and y array into a lookup table with the given region:
 *
 *   "x": [
 *     "Antarctic(Oct)",
 *     "SH mid-lat",
 *     "Tropics",
 *     "Arctic(Mar)",              {
 *     "Near global",               "Antarctic(Oct)": 2064,
 *     "Global",                    "SH mid-lat": 2051,
 *     "User region"                "Tropics": 2060,
 *   ],                     =>      "Tropics": 2041,
 *   "y": [                             ...
 *     2064,                       }
 *     2051,
 *     2060,
 *     2041,
 *     2040,
 *     2049,
 *     2052,
 *     2052
 *   ]
 *
 * @param {string} plotId A string specifying the plot (to perform different transformations, according to the data format)
 * @param {Object} data An object holding the data as it was returned from the API
 * @returns {Object} The pre transformed API data
 * @function
 */
export const preTransformApiData = ({ plotId, data }) => {
    const lookUpTable = {};

    if (plotId === O3AS_PLOTS.tco3_zm) {
        for (let datum of data) {
            // top structure
            let normalizedArray;
            if (datum.model === 'reference_value') {
                //
                normalizedArray = Array(END_YEAR - START_YEAR + 1).fill(datum.y[0]); // always stretch reference line from START_YEAR to END_YEAR
            } else {
                normalizedArray = normalizeArray(datum.x, datum.y);
            }
            lookUpTable[datum.model] = {
                plotStyle: datum.plotstyle,
                data: normalizedArray, // this should speed up the calculation of the statistical values later
                suggested: {
                    minX: Math.min(...datum.x),
                    maxX: Math.max(...datum.x),
                    minY: Math.min(...normalizedArray.filter((x) => x !== null)),
                    maxY: Math.max(...normalizedArray),
                },
            };
        }
    } else if (plotId === O3AS_PLOTS.tco3_return) {
        for (let datum of data) {
            // top structure
            lookUpTable[datum.model] = {
                plotStyle: datum.plotstyle,
                data: {},
                suggested: null,
            };

            // fill data
            const temp = [];
            for (let index in datum.x) {
                temp.push(datum.y[index]);
                lookUpTable[datum.model].data[datum.x[index]] = datum.y[index];
            }

            lookUpTable[datum.model].suggested = {
                minY: Math.min(...temp.filter((x) => x !== null)),
                maxY: Math.max(...temp),
            };
        }
    }
    return { lookUpTable };
};

/**
 * Gets the suggested values for the y-axis and x-axis so that the displayed models are all
 * visible in the resulting range and the scaling of the x-axis is properly formatted.
 *
 * @param {Object} data The data for all models displayed
 * @param {Object} modelSlice The modelSlice object
 * @returns {Object} An object containing the suggested values for the x- and y-axis
 * @function
 */
export function getSuggestedValues(data, modelSlice) {
    const visibleModels = getIncludedModels(modelSlice);

    const suggested = {
        minX: Infinity,
        maxX: -Infinity,
        minY: Infinity,
        maxY: -Infinity,
    };

    for (let model of visibleModels) {
        const { minX, maxX, minY, maxY } = data[model].suggested;
        suggested.minX = Math.min(suggested.minX, minX);
        suggested.maxX = Math.max(suggested.maxX, maxX);
        suggested.minY = Math.min(suggested.minY, minY);
        suggested.maxY = Math.max(suggested.maxY, maxY);
    }

    return suggested;
}

// UTILITY:

/**
 * Converts the given color name to its corresponding hex code.
 *
 * @param {string} color    The name of the color as a string
 * @returns {Object}        The hex code corresponding to the given color name
 * @function
 */
export function colorNameToHex(color) {
    const colors = {
        aliceblue: '#f0f8ff',
        antiquewhite: '#faebd7',
        aqua: '#00ffff',
        aquamarine: '#7fffd4',
        azure: '#f0ffff',
        beige: '#f5f5dc',
        bisque: '#ffe4c4',
        black: '#000000',
        blanchedalmond: '#ffebcd',
        blue: '#0000ff',
        blueviolet: '#8a2be2',
        brown: '#a52a2a',
        burlywood: '#deb887',
        cadetblue: '#5f9ea0',
        chartreuse: '#7fff00',
        chocolate: '#d2691e',
        coral: '#ff7f50',
        cornflowerblue: '#6495ed',
        cornsilk: '#fff8dc',
        crimson: '#dc143c',
        cyan: '#00ffff',
        darkblue: '#00008b',
        darkcyan: '#008b8b',
        darkgoldenrod: '#b8860b',
        darkgray: '#a9a9a9',
        darkgreen: '#006400',
        darkkhaki: '#bdb76b',
        darkmagenta: '#8b008b',
        darkolivegreen: '#556b2f',
        darkorange: '#ff8c00',
        darkorchid: '#9932cc',
        darkred: '#8b0000',
        darksalmon: '#e9967a',
        darkseagreen: '#8fbc8f',
        darkslateblue: '#483d8b',
        darkslategray: '#2f4f4f',
        darkturquoise: '#00ced1',
        darkviolet: '#9400d3',
        deeppink: '#ff1493',
        deepskyblue: '#00bfff',
        dimgray: '#696969',
        dodgerblue: '#1e90ff',
        firebrick: '#b22222',
        floralwhite: '#fffaf0',
        forestgreen: '#228b22',
        fuchsia: '#ff00ff',
        gainsboro: '#dcdcdc',
        ghostwhite: '#f8f8ff',
        gold: '#ffd700',
        goldenrod: '#daa520',
        gray: '#808080',
        green: '#008000',
        greenyellow: '#adff2f',
        honeydew: '#f0fff0',
        hotpink: '#ff69b4',
        'indianred ': '#cd5c5c',
        indigo: '#4b0082',
        ivory: '#fffff0',
        khaki: '#f0e68c',
        lavender: '#e6e6fa',
        lavenderblush: '#fff0f5',
        lawngreen: '#7cfc00',
        lemonchiffon: '#fffacd',
        lightblue: '#add8e6',
        lightcoral: '#f08080',
        lightcyan: '#e0ffff',
        lightgoldenrodyellow: '#fafad2',
        lightgrey: '#d3d3d3',
        lightgreen: '#90ee90',
        lightpink: '#ffb6c1',
        lightsalmon: '#ffa07a',
        lightseagreen: '#20b2aa',
        lightskyblue: '#87cefa',
        lightslategray: '#778899',
        lightsteelblue: '#b0c4de',
        lightyellow: '#ffffe0',
        lime: '#00ff00',
        limegreen: '#32cd32',
        linen: '#faf0e6',
        magenta: '#ff00ff',
        maroon: '#800000',
        mediumaquamarine: '#66cdaa',
        mediumblue: '#0000cd',
        mediumorchid: '#ba55d3',
        mediumpurple: '#9370d8',
        mediumseagreen: '#3cb371',
        mediumslateblue: '#7b68ee',
        mediumspringgreen: '#00fa9a',
        mediumturquoise: '#48d1cc',
        mediumvioletred: '#c71585',
        midnightblue: '#191970',
        mintcream: '#f5fffa',
        mistyrose: '#ffe4e1',
        moccasin: '#ffe4b5',
        navajowhite: '#ffdead',
        navy: '#000080',
        oldlace: '#fdf5e6',
        olive: '#808000',
        olivedrab: '#6b8e23',
        orange: '#ffa500',
        orangered: '#ff4500',
        orchid: '#da70d6',
        palegoldenrod: '#eee8aa',
        palegreen: '#98fb98',
        paleturquoise: '#afeeee',
        palevioletred: '#d87093',
        papayawhip: '#ffefd5',
        peachpuff: '#ffdab9',
        peru: '#cd853f',
        pink: '#ffc0cb',
        plum: '#dda0dd',
        powderblue: '#b0e0e6',
        purple: '#800080',
        rebeccapurple: '#663399',
        red: '#ff0000',
        rosybrown: '#bc8f8f',
        royalblue: '#4169e1',
        saddlebrown: '#8b4513',
        salmon: '#fa8072',
        sandybrown: '#f4a460',
        seagreen: '#2e8b57',
        seashell: '#fff5ee',
        sienna: '#a0522d',
        silver: '#c0c0c0',
        skyblue: '#87ceeb',
        slateblue: '#6a5acd',
        slategray: '#708090',
        snow: '#fffafa',
        springgreen: '#00ff7f',
        steelblue: '#4682b4',
        tan: '#d2b48c',
        teal: '#008080',
        thistle: '#d8bfd8',
        tomato: '#ff6347',
        turquoise: '#40e0d0',
        violet: '#ee82ee',
        wheat: '#f5deb3',
        white: '#ffffff',
        whitesmoke: '#f5f5f5',
        yellow: '#ffff00',
        yellowgreen: '#9acd32',
    };

    if (typeof colors[color.toLowerCase()] != 'undefined') {
        return colors[color.toLowerCase()];
    }

    return false;
}

/**
 * Converts the stroke style given by the API into the format supported by apexcharts.
 *
 * @param {number} apiStyle     The stroke style specified by the API
 * @returns {number}            The stroke style for the apexcharts library
 * @function
 */
export function convertToStrokeStyle(apiStyle) {
    const styles = {
        solid: 0,
        dotted: 1,
        dashed: 3,
    };

    if (typeof styles[apiStyle.toLowerCase()] != 'undefined') {
        return styles[apiStyle.toLowerCase()];
    }
    return false;
}

/**
 * Combines 2 data series objects into a new one.
 * The copied elements of series2 get appended to a copy of series1.
 * A series object has the following structure: { data: Array, colors: Array, width: Array, dashArray: Array}
 *
 * @param {Object} series1     The first data series object
 * @param {Object} series2     The second data series object
 * @returns {Object}            New series containing series1 and series2
 * @function
 */
function combineSeries(series1, series2) {
    const newSeries = {};
    newSeries.data = [...series1.data, ...series2.data];
    newSeries.colors = [...series1.colors, ...series2.colors];
    newSeries.width = [...series1.width, ...series2.width];
    newSeries.dashArray = [...series1.dashArray, ...series2.dashArray];
    return newSeries;
}

/**
 * Utility function to create an array of size i with empty arrays inside it.
 *
 * @param {number} i    The size of the array containing the empty arrays
 * @returns {Array}     The array of size 'i' containing empty arrays
 * @function
 */
function create2dArray(i) {
    return Array.from(Array(i), () => []);
}

/**
 * Checks if a model is included in the statistical value calculation of a given SV-Type by using the groupData as the reference data.
 *
 * @param {string} model        The model that should be checked
 * @param {Object} groupData    The data of the group which will be used as reference for the check
 * @param {string} svType       The statistical value type that should be checked for
 * @returns {Object}            True if the given model should be included in the SV calculation of the given SV-Type
 * @function
 */
function isIncludedInSv(model, groupData, svType) {
    if (svType === 'stdMean') {
        return groupData.models[model][std];
    } // the std mean should only be calculated if the std is necessary
    if (svType.toLowerCase().includes(percentile)) {
        return groupData.models[model][percentile];
    }
    return groupData.models[model][svType];
}

/**
 * Determines the optimal tick amount for a given max and min year for the x-axis.
 * Takes into account the current screen width, uses a heuristic approach
 * (all values are determined through experimentation).
 *
 * @param {number} min      The selected min. year of the plot
 * @param {number} max      The selected max. year of the plot
 * @returns {number}        The optimal tick amount according to those values
 * @function
 */
export function getOptimalTickAmount(min, max) {
    const width =
        window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    const height =
        window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;

    if (width <= height || width <= 700) {
        // is mobile in portrait
        return 4;
    }

    let divider = 1;
    if (width <= 900) {
        divider = 2;
    } else if (width <= 1100) {
        divider = 3;
    }

    const diff = max - min;

    let rv;
    if (diff <= 40) {
        rv = diff / 2 / divider;
    } else if (diff <= 120) {
        rv = diff / 5 / divider;
    } else {
        rv = diff / 10 / divider;
    }

    let rvRounded = Math.floor(rv);
    rvRounded += rvRounded % 2; // never odd value
    return Math.max(rvRounded, 4); // smallest possible tick number
}

/**
 * Determines the optimal tick amount for a given max and min year for the y-axis.
 *
 * @param {number} min      The selected min. year of the plot
 * @param {number} max      The selected max. year of the plot
 * @returns {number}        The optimal tick amount according to those values
 * @function
 */
export function getTickAmountYAxis(min, max) {
    const diff = max - min;
    if (diff <= 200) {
        return Math.floor(diff / 5);
    } else if (diff <= 400) {
        if (diff % 20 === 0) {
            return Math.floor(diff / 20);
        } else if (diff % 30 === 0) {
            return Math.floor(diff / 30);
        }

        return Math.floor(diff / 10);
    }
}

/**
 * Rounds a number up to a multiple of ten. If the number already is a multiple of
 * ten the number stays the same.
 *
 * @param {number} min     The minY value that will be rounded to a multiple of 10
 * @returns {number}        Number rounded down to a multiple of ten
 * @function
 */
export function roundDownToMultipleOfTen(min) {
    return min - (min % 10);
}

/**
 * Rounds a number up to a multiple of ten. If the number already is a multiple of
 * ten the number stays the same.
 *
 * @param {number} max     The maxY value that will be rounded to a multiple of 10
 * @returns {number}        Number rounded up to a multiple of ten
 * @function
 */
export function roundUpToMultipleOfTen(max) {
    return max % 10 ? max + (10 - (max % 10)) : max;
}

/**
 * This function aims to filter out values that are outside the provided range.
 * If the value is outside of range it is replaced with null.
 *
 * @param {number} value The value that could be filtered out
 * @param {number} min  The minimum allowed value
 * @param {number} max  The maximum allowed value
 * @returns {number}    The value or null if the value is outside the allowed range
 * @function
 */
export function filterOutOfRange(value, min, max) {
    return min <= value && value <= max ? value : null;
}

/**
 * Function to format the labels on the y-axis nicely.
 * It hides all labels that are not a multiple of ten (i.e. all multiples of five and NOT ten).
 *
 * @param {number} value    The label value
 * @returns {number}        The value if it is a multiple of ten or an empty string to hide the label
 * @function
 */
export const formatYLabelsNicely = (value) => (value % 10 ? '' : value);

/**
 * This function parses the auto-generated sv names to separate
 * them into the sv type (e.g. mean, median) and the group.
 *
 * @param {string} name The name of the data series (e.g. mean+std(Example Group))
 * @returns {Object}    An object holding the sv type and the group name
 * @function
 */
export function parseSvName(name) {
    const regex = new RegExp('([^(]+)(([^)]+))');
    const info = name.match(regex);
    return {
        sv: info[1],
        groupName: info[2].substring(1),
    };
}

/**
 * A plugin-method for apexcharts to provide a custom tooltip.
 * In this case the tooltip is for the OCTS line chart. It provides
 * a richer tooltip and shows the data points correctly.
 *
 * @param {Array} series An array of series
 * @param {number} seriesIndex The index of the hovered data series
 * @param {number} dataPointIndex The index of the data point in the hovered data series
 * @param {Object} w    Global apexcharts object
 * @returns {string}          The desired html tooltip formatted with the correct information
 * @function
 */
export function customTooltipFormatter({ series, seriesIndex, dataPointIndex, w }) {
    const modelName = w.globals.seriesNames[seriesIndex];
    const numDecimalsInDatapoint = 2;
    if (modelName.startsWith('Reference')) {
        let displayName = modelName.split('value');

        return `
                <div>
                    <div style="margin:2px"><strong>${
                        w.globals.seriesX[seriesIndex][dataPointIndex]
                    }</strong></div>
                    <div>Reference ${displayName[1]}: <strong>${series[seriesIndex][
            dataPointIndex
        ].toFixed(numDecimalsInDatapoint)}</strong></div>
                </div>
            `;
    }

    for (const svName in SV_DISPLAY_NAME) {
        if (modelName.startsWith(SV_DISPLAY_NAME[svName])) {
            // parse sv
            const { sv, groupName } = parseSvName(modelName);
            return `
                <div>
                    <div style="margin:2px"><strong>${
                        w.globals.seriesX[seriesIndex][dataPointIndex]
                    }</strong></div>
                    <div>${sv}: <strong>${series[seriesIndex][dataPointIndex].toFixed(
                numDecimalsInDatapoint
            )}</strong></div>
                    <div>Group: ${groupName}</div>
                </div>
                `;
        }
    }

    let { project, institute, name } = convertModelName(modelName);
    return `
        <div>
            <div style="margin:2px"><strong>${
                w.globals.seriesX[seriesIndex][dataPointIndex]
            }</strong></div>
            <div>${name}: <strong>${series[seriesIndex][dataPointIndex].toFixed(
        numDecimalsInDatapoint
    )}</strong></div>
            <div>Project: ${project}</div>
            <div>Institue: ${institute}</div>
        </div>
        `;
}

/**
 * Gets all included models from the modelsSlice.
 *
 * @param {Object} modelsSlice  The modelsSlice needed to get the models from the model groups
 * @returns {Array} All included models from all model groups
 * @function
 */
export function getIncludedModels(modelsSlice) {
    const visible = [];

    for (const modelGroup of Object.values(modelsSlice.modelGroups)) {
        for (const model of Object.keys(modelGroup.models)) {
            visible.push(model);
        }
    }

    return visible;
}

/**
 * Calculates the points when the mean, mean+std, mean-std reach the value of the reference year.
 *
 * @param {function} getState store.getState
 * @param {Object} referenceValue an object with an array with the values for the reference line among other things
 * @param {Object} svSeries an object with an array with the values for the statistical values lines among other things
 */
function calcRecoveryPoints(getState, referenceValue, svSeries) {
    const points = [];

    const refYear = getState().reference.settings.year;
    const maxYear = getState().plot.plotSpecificSettings.tco3_zm.displayXRange.years.maxX;
    const refValue = Math.max(...referenceValue.data);

    const dataName = [
        SV_DISPLAY_NAME.mean,
        SV_DISPLAY_NAME['mean+std'],
        SV_DISPLAY_NAME['mean-std'],
    ];

    const yearIdx = 0;
    const valIdx = 1;

    for (let idx = 0; idx < svSeries.data.length; idx++) {
        if (!dataName.includes(svSeries.data[idx].name.split('(')[0].slice(0, -1))) {
            points.push([null, null]);
            continue;
        }
        for (let i = 0; i < svSeries.data[idx].data.length; i++) {
            if (svSeries.data[idx].data[i][yearIdx] <= refYear) {
                continue;
            }
            if (svSeries.data[idx].data[i][yearIdx] > maxYear) {
                break;
            }
            if (svSeries.data[idx].data[i][valIdx] >= refValue) {
                points.push([
                    svSeries.data[idx].data[i][yearIdx],
                    svSeries.data[idx].data[i][valIdx],
                ]);
                break;
            }
        }
        if (points.length < idx + 1) {
            points.push([null, null]);
        }
    }
    return points;
}

/**
 * This method formats a latitude object into a good-looking string.
 * E.g. {minLat: -20, maxLat: 20} ==> '(20°S-20°N)'
 *
 * @example formatLatitude({minLat: -20, maxLat: 20});
 *
 * @param {Object} locationValue    The minLat and maxLat values
 * @return {string}                 The formatted latitude band
 * @function
 */
export const formatLatitude = (locationValue) => {
    const hemisphereExtensionMin = locationValue.minLat < 0 && locationValue.maxLat > 0 ? '°S' : '';
    const hemisphereExtensionMax = locationValue.maxLat <= 0 ? '°S' : '°N';
    return `${Math.abs(locationValue.minLat)}${hemisphereExtensionMin}-${Math.abs(
        locationValue.maxLat
    )}${hemisphereExtensionMax}`;
};

/**
 * Finds the latitude band by the currently selected location
 * @param {function} getState   A function to get the state
 * @returns {String} The found Latitude Band
 * @function
 */
const findLatitudeBandByLocation = (getState) => {
    const selectedLocation = getState().plot.generalSettings.location;
    if (typeof selectedLocation === 'undefined') {
        return null;
    }

    for (let i = 0; i < latitudeBands.length - 1; i++) {
        if (
            latitudeBands[i].value.minLat === selectedLocation.minLat &&
            latitudeBands[i].value.maxLat === selectedLocation.maxLat
        ) {
            return latitudeBands[i].text.description;
        }
    }

    return latitudeBands[latitudeBands.length - 1].text.description; // Custom (fallback, has to be custom if none of the predefined regions matched)
};
