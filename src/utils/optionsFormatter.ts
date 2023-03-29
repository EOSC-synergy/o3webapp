import {
    mean as calculateMean,
    median as calculateMedian,
    median,
    q25,
    q75,
    quantile as calculatePercentile,
    std as calculateStd,
} from '../services/math';
import {
    END_YEAR,
    Latitude,
    latitudeBands,
    lowerPercentile,
    months,
    NUM_MONTHS,
    O3AS_PLOTS,
    percentile,
    PROCESS_SV,
    PROCESS_SV_WITH_PERCENTILE,
    PROCESSED_SV,
    START_YEAR,
    STATISTICAL_VALUES,
    std,
    stdMean,
    upperPercentile,
    USER_REGION,
} from './constants';
import { convertModelName } from './ModelNameConverter';
import { AppState } from 'store';
import { LEGAL_PLOT_ID } from 'services/API/client';
import { O3Data } from 'services/API/generated-client';
import { RegionBasedXRange, YearsBasedXRange, YRange } from 'store/plotSlice';
import { GlobalModelState, ModelGroup } from 'store/modelsSlice';
import { Entry, EntryPlotStyle, ProcessedO3Data, ZmData } from 'services/API/apiSlice';
import { merge, zipWith } from 'lodash';
import { ApexOptions } from 'apexcharts';

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
    [lowerPercentile]: (arr: number[]) => calculatePercentile(arr, 0.1587),
    [upperPercentile]: (arr: number[]) => calculatePercentile(arr, 0.8413),
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
 * @param state redux store state
 * @returns The subtitle created based on the data stored in the redux store
 * @function
 */
function createSubtitle(state: AppState): string {
    let stLocationText = findLatitudeBandByLocation(state);

    if (stLocationText === 'Custom') {
        stLocationText = formatLatitude(state.plot.generalSettings.location);
    }

    let stMonths: string[] = [];
    state.plot.generalSettings.months.map((month) => stMonths.push(months[month - 1].description!));
    if (stMonths.length === NUM_MONTHS) {
        stMonths = ['All year'];
    }

    if (state.plot.plotId === 'tco3_zm') {
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
export const defaultTCO3_zm: ApexOptions = {
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
    /*colors: undefined, //styling.colors
    stroke: {
        width: undefined, // styling.width,
        dashArray: undefined //styling.dashArray,
    },*/
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
 * @param seriesName the name of the series
 * @param minY the minimum y value (to adjust to the zoom)
 * @param maxY the maximum y value (to adjust to the zoom)
 * @param show whether the y-axis should be hidden (default is false)
 * @param opposite whether to show the y-axis on the right side (default is false)
 * @param offsetX how many px the y-axis should be adjusted
 * @param tickAmount how many ticks (on the y-axis) should be displayed (should be calculated by functions to provide a nice formatting)
 * @returns The defaults for the YAxis of Tco3Zm plot
 * @function
 */
export function getDefaultYAxisTco3Zm(
    seriesName: string | undefined,
    minY: number,
    maxY: number,
    show = false,
    opposite = false,
    offsetX = -1,
    tickAmount = 0
): ApexYAxis {
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
 * @param seriesName the name of the series
 * @param minY the minimum y value (to adjust to the zoom)
 * @param maxY the maximum y value (to adjust to the zoom)
 * @param show whether the y-axis should be hidden (default is false)
 * @param opposite whether to show the y-axis on the right side (default is false)
 * @param offsetX how many px the y-axis should be adjusted
 * @param tickAmount how many ticks (on the y-axis) should be displayed (should be calculated by functions to provide a nice formatting)
 * @returns The defaults for the YAxis of Tco3Zm return
 * @function
 */
export function getDefaultYAxisTco3Return(
    seriesName: string | undefined,
    minY: number,
    maxY: number,
    show = false,
    opposite = false,
    offsetX = -1,
    tickAmount = 0
): ApexYAxis {
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

export type Styling = {
    colors: string[];
    // see ApexStroke['width']
    width: number[];
    dashArray: number[];

    // only zm?
    points?: [number, number | null][];
};

/**
 * The default settings for the tco3_return plot.
 *
 * colors have to be filled.
 *
 * This gigantic object allows us to communicate with the apexcharts library.
 * More can be found here: {@link https://apexcharts.com/docs/installation/}
 * @constant {Object}
 */
export const default_TCO3_return: ApexOptions = {
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
        colors: undefined, // ...styling.colors
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

type OptionsParams = {
    plotId: LEGAL_PLOT_ID;
    styling: Styling;
    plotTitle: string;
    xAxisRange: YearsBasedXRange;
    yAxisRange: YRange;
    seriesNames: string[];
    state: AppState;
};

/**
 * The interface the graph component accesses to generate the options for the plot
 * given the plot id, the styling (depends on plot type) and the plot title.
 *
 * @param plotId an element of O3AS_PLOTS
 * @param styling the styling
 * @param styling.colors an array of strings with hex code. Has to match the length of the given series
 * @param styling.width (tco3_zm only!): array of integer defining the line width
 * @param styling.dashArray (tco3_zm only!): array of integer defining if the line is solid or dashed
 * @param plotTitle contains the plot title
 * @param xAxisRange the range of the x-axis
 * @param yAxisRange the range of the y-axis
 * @param seriesNames the names of the series
 * @param getState store.getState
 * @returns An default_TCO3_plotId object formatted with the given data
 * @function
 */
export function getOptions({
    plotId,
    styling,
    plotTitle,
    xAxisRange,
    yAxisRange,
    seriesNames,
    state,
}: OptionsParams): ApexOptions {
    const minY = roundDownToMultipleOfTen(yAxisRange.minY);
    const maxY = roundUpToMultipleOfTen(yAxisRange.maxY);

    const tickAmount = getTickAmountYAxis(minY, maxY);

    switch (plotId) {
        case O3AS_PLOTS.tco3_zm: {
            // dirt simple and not overly horrible
            const xAxisMin = roundDownToMultipleOfTen(xAxisRange.years.minX);
            const xAxisMax = roundUpToMultipleOfTen(xAxisRange.years.maxX);
            return merge(
                { ...defaultTCO3_zm },
                {
                    yaxis: [
                        ...seriesNames.map((name) =>
                            getDefaultYAxisTco3Zm(name, minY, maxY, false, false, 0, tickAmount)
                        ),
                        // on left side
                        getDefaultYAxisTco3Zm(undefined, minY, maxY, true, false, -1, tickAmount),
                        // on right side
                        getDefaultYAxisTco3Zm(undefined, minY, maxY, true, true, 0, tickAmount),
                    ],
                    xaxis: {
                        min: xAxisMin,
                        max: xAxisMax,
                        tickAmount: getOptimalTickAmount(xAxisMin, xAxisMax),
                    },
                    // TODO: no corresponding points are generated in generateSeries, what's up with this?

                    annotations: {
                        points: styling.points?.map((point) => ({
                            x: point[0],
                            y: point[1],
                            marker: {
                                size: 4,
                            },
                            // label: {text: point[xIdx]}
                        })),
                    },

                    colors: styling.colors,
                    stroke: {
                        width: styling.width,
                        dashArray: styling.dashArray,
                    },
                    title: {
                        text: plotTitle,
                    },
                    subtitle: {
                        text: createSubtitle(state),
                    },
                    tooltip: {
                        custom: customTooltipFormatter,
                    },
                    legend: {
                        markers: {
                            width: 0,
                        },
                        customLegendItems: seriesNames.map((name, i) => {
                            const color = styling.colors[i];
                            const dashing = styling.dashArray[i];
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
                            return `
                    <span style='color:${color};font-family:Consolas, monaco, monospace;font-size:${fontSize}px;'>
                        ${linePattern}
                    </span>
                    <span style='font-size: 16px'>${name}</span>`;
                        }),
                    },
                }
            );
        }
        case O3AS_PLOTS.tco3_return: {
            return merge(
                {
                    ...default_TCO3_return,
                },
                {
                    colors: styling.colors,
                    title: {
                        text: plotTitle,
                    },
                    subtitle: {
                        text: createSubtitle(state),
                    },
                    yaxis: [
                        ...seriesNames.map((name) =>
                            getDefaultYAxisTco3Return(name, minY, maxY, false, false, 0, tickAmount)
                        ),
                        // on left side
                        getDefaultYAxisTco3Return(
                            undefined,
                            minY,
                            maxY,
                            true,
                            false,
                            3,
                            tickAmount
                        ),
                        // on right side
                        getDefaultYAxisTco3Return(
                            undefined,
                            minY,
                            maxY,
                            true,
                            true,
                            -3,
                            tickAmount
                        ),
                    ],
                }
            );
        }
    }
    // tco3_return
}

type GenerateSeriesParams = {
    plotId: LEGAL_PLOT_ID;
    data: ProcessedO3Data;
    modelsSlice: GlobalModelState['models'];
    yAxisRange: YRange;
    refLineVisible: boolean;
    state: AppState;
    // ignored for tco3_zm
    xAxisRange: RegionBasedXRange;
};

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
 * @param plotId the id of the currently selected plot
 * @param data the raw data from the api for the current options
 * @param modelsSlice the slice of the store containing information about the model groups
 * @param xAxisRange the range of the x-axis
 * @param yAxisRange the range of the y-axis
 * @param refLineVisible visibility status of the reference line
 * @param getState function to access the redux store
 * @returns series object which includes a subdivision into a data and a styling object.
 * @function
 */
export function generateSeries({
    plotId,
    data,
    modelsSlice,
    xAxisRange,
    yAxisRange,
    refLineVisible,
    state,
}: GenerateSeriesParams) {
    switch (plotId) {
        case 'tco3_return':
            return generateTco3_ReturnSeries({
                data,
                modelsSlice,
                xAxisRange,
                yAxisRange,
                state,
            });
        case 'tco3_zm':
            return generateTco3_ZmSeries({
                data,
                modelsSlice,
                refLineVisible,
                state,
            });
    }
}

type ReturnSeriesFirst = { name: ''; type: 'boxPlot'; data: { x: string; y: number[] }[] };
type ReturnSeriesRest = Array<{
    name: string;
    data: { x: string; y: number | null }[];
    type: 'scatter';
}>;
type ReturnSeriesData = [ReturnSeriesFirst, ...ReturnSeriesRest];

type ZmSeriesData = {
    name?: string;
    data: [number, number][];
    type?: 'scatter' | 'boxPlot';
}[];
export type Series<SeriesData extends ApexAxisChartSeries> = {
    data: SeriesData;

    styling: Styling;
};

const NO_COLOR = '#000000';
const NO_LINESTYLE = 0;

/**
 * This method generates the data series for tco3_zm for all models that should be displayed (specified via groups).
 * It furthermore adds the statistical values also as series at the end.
 *
 * @param data the raw data from the api for the current options
 * @param modelsSlice the slice of the store containing information about the model groups
 * @param refLineVisible visibility status of the reference line
 * @returns A combination of data and statistical values series
 * @param state redux store state
 * @function
 */
function generateTco3_ZmSeries({
    data,
    modelsSlice,
    refLineVisible,
    state,
}: {
    data: ProcessedO3Data;
    modelsSlice: GlobalModelState['models'];
    refLineVisible: boolean;
    state: AppState;
}): Series<ZmSeriesData> {
    const series: Series<ZmSeriesData> = {
        data: [],
        styling: {
            colors: [],
            width: [],
            dashArray: [],
            points: [],
        },
    };
    if (refLineVisible) {
        // TODO: see Entry["data"] in apiSlice.ts
        const zmRefData = data.reference_value.data as number[];
        series.data.push({
            name: data.reference_value.plotStyle?.label,

            data: zmRefData.map((e, idx) => [START_YEAR + idx, e]),
        });
        // TODO: better way to handle no color?
        series.styling.colors.push(
            colorNameToHex(data.reference_value.plotStyle?.color ?? NO_COLOR) || '#000000'
        );
        // TODO: better way to handle no line style?
        series.styling.dashArray.push(
            convertToStrokeStyle(data.reference_value.plotStyle?.linestyle ?? '') || NO_LINESTYLE
        );
        series.styling.width.push(MODEL_LINE_THICKNESS);
    }

    // iterate over model groups  // don't remove 'id'
    for (const groupData of Object.values(modelsSlice.modelGroups)) {
        // skip hidden groups
        if (!groupData.isVisible) {
            continue;
        }
        for (const [model, modelInfo] of Object.entries(groupData.models)) {
            // skip hidden models
            if (!modelInfo.isVisible) {
                continue;
            }
            // retrieve data (api)
            const modelData = data[model];
            // skip model if it is not available
            if (typeof modelData === 'undefined') {
                continue;
            }
            // TODO: see Entry["data"] in apiSlice.ts
            const zmData = modelData.data as number[];
            series.data.push({
                name: model,
                data: zmData.map((e, idx) => [START_YEAR + idx, e]),
            });

            series.styling.colors.push(
                colorNameToHex(modelData.plotStyle?.color ?? '') || NO_COLOR
            );
            series.styling.dashArray.push(
                convertToStrokeStyle(modelData.plotStyle?.linestyle ?? '') || NO_LINESTYLE
            ); // default line thickness
            series.styling.width.push(MODEL_LINE_THICKNESS);
        }
    }

    // generate SV!
    const svSeries = buildStatisticalSeries<ZmSeriesData>(
        data,
        modelsSlice,
        buildSvMatrixTco3Zm,
        generateSingleTco3ZmSeries,
        state
    );

    return merge(combineSeries<ZmSeriesData>(series, svSeries), {
        styling: {
            points: refLineVisible ? calcRecoveryPoints(state, data.reference_value, svSeries) : [],
        },
    });
}

/**
 * This plugin-method is used to specify how series for tco3_zm should be build inside
 * the buildStatisticalValues-function.
 *
 * @param name   of the series
 * @param svData array of plaint numbers
 * @returns A series matching the tco3_zm style for apexcharts.
 * @function
 */
function generateSingleTco3ZmSeries(name: string, svData: (number | null)[]) {
    return {
        name: name,
        data: svData.map((e, idx) => [START_YEAR + idx, e] satisfies [number, number | null]),
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
 * @param modelList list of models of a group that should be included
 * @param data an object holding all the data from the api
 * @returns A 2D array containing all the data (transpose matrix of given data)
 * @function
 */
function buildSvMatrixTco3Zm({ modelList, data }: { modelList: string[]; data: ProcessedO3Data }) {
    const SERIES_LENGTH = data[modelList[0]].data.length; // grab length of first model, should all be same

    const matrix = create2dArray<number>(SERIES_LENGTH); // for arr of matrix: mean(arr), etc.

    for (let i = 0; i < SERIES_LENGTH; ++i) {
        for (const model of modelList) {
            const modelData = data[model];
            if (typeof modelData === 'undefined') {
                continue;
            }
            // TODO: see Entry["data"] in apiSlice.ts
            const zmData = modelData.data as number[];
            matrix[i].push(
                zmData[i] // add null anyway to remain index mapping (null is filtered out later)
            );
        }
    }
    return matrix;
}

/**
 * This method generates the data series for the tco3_return for all models that should be displayed (specified via groups).
 * It furthermore adds the statistical values also as series at the end.
 *
 * @param data the raw data from the api for the current options
 * @param modelsSlice the slice of the store containing information about the model groups
 * @param xAxisRange the range of the x-axis
 * @param yAxisRange the range of the y-axis
 * @returns A combination of data and statistical values series
 * @function
 */
function generateTco3_ReturnSeries({
    data,
    modelsSlice,
    xAxisRange,
    yAxisRange,
    state,
}: {
    data: ProcessedO3Data;
    modelsSlice: GlobalModelState['models'];
    xAxisRange: RegionBasedXRange;
    yAxisRange: YRange;
    state: AppState;
}): Series<ReturnSeriesData> {
    // grab first key to extract regions from api response
    const firstKey = Object.keys(data)[0];
    const regions: string[] = firstKey ? Object.keys(data[firstKey].data) : [];
    // 1. build boxplot
    const boxPlotValues = calculateBoxPlotValues(data, modelsSlice, regions);
    const regionData = regions.map((region) => ({
        x: region.toString(),
        y: boxPlotValues[region],
    }));
    regionData.pop();
    regionData.push({
        // generate title according to custom min-max values
        x: formatLatitude(state.plot.generalSettings.location),
        y: boxPlotValues[USER_REGION],
    });

    const boxPlot = {
        // removed name of box, so it doesn't show up in the legend!
        name: '',
        type: 'boxPlot',
        data: regionData,
    } as const;

    const series: Series<ReturnSeriesRest> = {
        data: [],
        styling: {
            colors: [],
            width: [],
            dashArray: [],
        },
    };

    // 2. build scatter plot
    const minY = yAxisRange.minY;
    const maxY = yAxisRange.maxY;
    // iterate over model groups
    for (const groupData of Object.values(modelsSlice.modelGroups)) {
        // skip hidden groups
        if (!groupData.isVisible) {
            continue;
        }
        for (const [model, modelInfo] of Object.entries(groupData.models)) {
            // skip hidden models
            if (!modelInfo.isVisible) {
                continue;
            }
            const modelData = data[model];
            // skip model if it is not available
            if (typeof modelData === 'undefined') {
                continue;
            }
            // TODO: see Entry["data"] in apiSlice.ts
            const returnData = modelData.data as Record<string, number>;
            const sortedData = regions.map((region) => ({
                x: region.toString(),
                // null as default if data is missing
                y: filterOutOfRange(returnData[region], minY, maxY),
            }));
            sortedData.pop();
            sortedData.push({
                x: formatLatitude(state.plot.generalSettings.location),
                // null as default if data is missing
                y:
                    returnData[USER_REGION] !== undefined
                        ? filterOutOfRange(returnData[USER_REGION], minY, maxY)
                        : null,
            });

            series.data.push({
                name: model,
                data: sortedData,
                type: 'scatter',
            });
            // TODO: better way to handle no color?
            series.styling.colors.push(
                colorNameToHex(modelData.plotStyle?.color ?? '') || NO_COLOR
            );
        }
    }

    // 3. generate statistical values
    const svSeries = buildStatisticalSeries<ReturnSeriesRest>(
        data,
        modelsSlice,
        //yAxisRange,
        buildSvMatrixTco3Return,
        generateSingleTco3ReturnSeries,
        state,
        regions
    );

    // clear out data points which are outside min-max display range (scatter points are displayed in the legend otherwise)
    for (const series of svSeries.data) {
        for (const regionData of series.data) {
            if (regionData.y !== null) {
                regionData.y = filterOutOfRange(regionData.y, minY, maxY);
            }
        }
    }

    const combined = combineSeries<ReturnSeriesRest>(series, svSeries);

    for (const series of combined.data) {
        // select chosen regions
        series.data = series.data.filter((value, idx) => xAxisRange.regions.includes(idx));
    }

    return {
        data: [boxPlot, ...combined.data],
        styling: combined.styling,
    };
}

/**
 * This plugin-method is used to specify how series for tco3_return should be build inside
 * the buildStatisticalValues-function.
 *
 * @param name of the series
 * @param svData array of plaint numbers
 * @param state redux store state
 * @param regions tco3_return regions
 * @returns a series matching the tco3_return style for apexcharts.
 * @function
 */
function generateSingleTco3ReturnSeries(
    name: string,
    svData: number[],
    state: AppState,
    regions: string[]
) {
    const transformedData = regions.map((region, index) => {
        if (index !== regions.length - 1) {
            return {
                x: region,
                y: svData[index],
            };
        } else {
            return {
                x: formatLatitude(state.plot.generalSettings.location),
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
 * @param modelList list of models of a group that should be included
 * @param data an object holding all the data from the api
 * @returns A 2D array containing all the data (transpose matrix of given data)
 * @function
 */
function buildSvMatrixTco3Return({
    modelList,
    data,
    regions,
}: {
    modelList: string[];
    data: ProcessedO3Data;
    regions: string[];
}) {
    const matrix = create2dArray<number>(regions.length);

    for (const index in regions) {
        const region = regions[index]; // iterate over regions
        for (const model of modelList) {
            const modelData = data[model];
            if (typeof modelData === 'undefined') {
                continue;
            }
            // TODO: see Entry["data"] in apiSlice.ts
            const returnData = modelData.data as Record<string, number>;
            matrix[index].push(returnData[region]);
        }
    }
    return matrix;
}

/**
 * This method calculates the boxplot values for the tco3_return plot.
 * For each region an array of 5 values is calculated: min, q1, median, q3, max
 * which is sufficient to render the desired box plot.
 *
 * @param data contains the region data from the api
 * @param modelsSlice the slice of the store containing information about the model groups
 * @param regions
 * @returns Object holding an array of 5 values (min, q1, median, q3, max) for each region
 * @function
 */
function calculateBoxPlotValues(
    data: ProcessedO3Data,
    modelsSlice: GlobalModelState['models'],
    regions: string[]
) {
    const boxPlotHolder: Record<string, number[]> = {};
    for (const region of regions) {
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

    const boxPlotValues: Record<string, number[]> = {};
    for (const region of regions) {
        boxPlotHolder[region].sort();
        const arr = boxPlotHolder[region];
        boxPlotValues[region] = [arr[0], q25(arr), median(arr), q75(arr), arr[arr.length - 1]];
    }
    return boxPlotValues;
}

/**
 * This method builds the statistical series using the passed buildMatrix method
 * that brings the data into the desired format and uses the
 * passed generateSingleSvSeries function to transform each generated series into
 * the correct format.
 *
 * @param data the raw data from the api for the current options
 * @param modelsSlice the slice of the store containing information about the model groups
 * @param buildMatrix either buildSvMatrixTco3Zm | buildSvMatrixTco3Return, specifies how the data should be transformed
 * @param generateSingleSvSeries either generateSingleTco3ZmSeries | generateSingleTco3ReturnSeries, specifies how the series should be generated
 * @param state redux store state
 * @param regions
 * @returns {Array} An array holding all statistical series for the given modelSlice
 * @function
 */
function buildStatisticalSeries<SeriesDataT extends ApexAxisChartSeries>(
    data: ProcessedO3Data,
    modelsSlice: GlobalModelState['models'],
    buildMatrix: typeof buildSvMatrixTco3Return | typeof buildSvMatrixTco3Zm,
    generateSingleSvSeries:
        | typeof generateSingleTco3ReturnSeries
        | typeof generateSingleTco3ZmSeries,
    state: AppState,
    regions: string[] = []
): Series<SeriesDataT> {
    const svSeries: Series<SeriesDataT> = {
        data: [] as unknown as SeriesDataT,
        styling: {
            colors: [],
            width: [],
            dashArray: [],
        },
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

        for (const [sv, svData] of Object.entries(svHolder) as [
            PROCESSED_SV,
            //STATISTICAL_VALUES,
            number[]
        ][]) {
            // skip for now
            if (sv === std) {
                continue;
            }

            if (
                // @ts-expect-error TODO: this is a hack for percentiles, fix it
                !groupData.visibleSV[sv] && // mean und median
                !(sv.includes('std') && groupData.visibleSV[std]) &&
                !(sv.toLowerCase().includes(percentile) && groupData.visibleSV[percentile])
            ) {
                continue;
            }
            svSeries.data.push(
                generateSingleSvSeries(
                    `${SV_DISPLAY_NAME[sv]} (${groupData.name})`,
                    svData,
                    state,
                    regions
                )
            );
            if (!Object.hasOwn(SV_COLORING, sv) || SV_COLORING[sv] === undefined) {
                throw new Error(`${sv} does not have a color`);
            }
            svSeries.styling.colors.push(SV_COLORING[sv]);
            svSeries.styling.width.push(STATISTICAL_VALUE_LINE_THICKNESS);
            svSeries.styling.dashArray.push(SV_DASHING[sv]);
        }
    }
    return svSeries;
}

/**
 * Calculates the statistical values for the given modelList (from a certain model group).
 * Takes into account the groupData object which stores information about the models.
 *
 * @param modelList a list of all models of a specific model group.
 * @param data the raw data from the api for the current options
 * @param groupData the modelsSlice data narrowed down for a specific model group
 * @param buildMatrix either buildSvMatrixTco3Zm | buildSvMatrixTco3Return, specifies how the data should be transformed
 * @param regions
 * @returns An object containing the calculated values for the statistical values
 * @function
 */
function calculateSvForModels(
    modelList: string[],
    data: ProcessedO3Data,
    groupData: ModelGroup,
    buildMatrix: typeof buildSvMatrixTco3Return | typeof buildSvMatrixTco3Zm,
    regions: string[]
): Record<PROCESSED_SV, (number | null)[]> {
    // pass group data
    // only mean at beginning

    const matrix = buildMatrix({ modelList, data, regions }); // function supplied by caller

    const svHolder: Record<PROCESSED_SV | typeof stdMean, (number | null)[]> = {
        lowerPercentile: [],
        upperPercentile: [],
        mean: [],
        [STATISTICAL_VALUES['standard deviation']]: [],
        median: [],
        'mean+std': [],
        'mean-std': [],

        // gets removed
        [stdMean]: [],
    };

    for (const arr of matrix) {
        // fill with calculated sv
        for (const sv of PROCESS_SV) {
            // filter out values from not included models or null values
            const filtered = arr.filter(
                (value, idx) => value !== null && isIncludedInSv(modelList[idx], groupData, sv)
            );

            // null as default if NaN or undefined
            const value: number | undefined =
                filtered != null ? SV_CALCULATION[sv](filtered) : undefined;
            if (value === undefined || isNaN(value)) {
                svHolder[sv].push(null); //apexcharts default "missing" value placeholder
            } else {
                svHolder[sv].push(value);
            }
        }
    }

    // TODO: this data is trivial, why are we calculating this
    svHolder['mean+std'] = [];
    svHolder['mean-std'] = [];
    for (let i = 0; i < svHolder[std].length; ++i) {
        if (svHolder[stdMean][i] == null || svHolder[std][i] == null) {
            svHolder['mean+std'].push(null);
            svHolder['mean-std'].push(null);
        } else {
            // @ts-expect-error TODO: find out how to tell typescript this is not null since we checked
            svHolder['mean+std'].push(svHolder[stdMean][i] + svHolder[std][i]);
            // @ts-expect-error TODO: find out how to tell typescript this is not null since we checked
            svHolder['mean-std'].push(svHolder[stdMean][i] - svHolder[std][i]);
        }
    }

    // @ts-expect-error TODO: intentionally delete this, reflect this in type somehow (stdMean should not be returned because Object.entries gets called)
    delete svHolder[stdMean];
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
export function normalizeArray(xValues: string[], yValues: number[]): number[] {
    const values: [string, number][] = zipWith(xValues, yValues, (x, y) => [x, y]);

    // @ts-expect-error TODO: will have to live with these nulls for now, makes rest of the typing much worse :(
    return IMPLICIT_YEAR_LIST.map((year) => {
        const value = values.find(([x]) => x === year);
        return value !== undefined ? value[1] : null;
    });
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
 * @param plotId A string specifying the plot (to perform different transformations, according to the data format)
 * @param data An object holding the data as it was returned from the API
 * @returns The pre transformed API data
 * @function
 */
export const preTransformApiData = (plotId: LEGAL_PLOT_ID, data: O3Data[]): ProcessedO3Data => {
    const lookUpTable: ProcessedO3Data = {} as ProcessedO3Data;

    switch (plotId) {
        case O3AS_PLOTS.tco3_zm:
            for (const datum of data) {
                // top structure
                let normalizedArray: number[];
                if (datum.model === 'reference_value') {
                    //
                    normalizedArray = Array(END_YEAR - START_YEAR + 1).fill(datum.y[0]); // always stretch reference line from START_YEAR to END_YEAR
                } else {
                    normalizedArray = normalizeArray(datum.x, datum.y);
                }
                lookUpTable[datum.model] = {
                    plotStyle: datum.plotstyle as EntryPlotStyle | undefined,
                    data: normalizedArray, // this should speed up the calculation of the statistical values later
                    suggested: {
                        minX: Math.min(...datum.x.map((x) => parseInt(x))),
                        maxX: Math.max(...datum.x.map((x) => parseInt(x))),
                        minY: Math.min(...(normalizedArray.filter((x) => x !== null) as number[])),
                        maxY: Math.max(...(normalizedArray.filter((x) => x !== null) as number[])),
                    },
                };
            }
            break;
        case O3AS_PLOTS.tco3_return:
            for (const datum of data) {
                // fill data
                const yArray = [];
                const data: Record<string, number> = {};
                for (const i in datum.x) {
                    yArray.push(datum.y[i]);
                    data[datum.x[i]] = datum.y[i];
                }

                // top structure
                lookUpTable[datum.model] = {
                    // TODO: fix this typing
                    plotStyle: datum.plotstyle as EntryPlotStyle | undefined,
                    data: data,
                    suggested: {
                        minY: Math.min(...yArray.filter((x) => x !== null)),
                        maxY: Math.max(...yArray),
                    },
                };
            }
            break;
    }

    return lookUpTable;
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
export function getSuggestedValues(data: ProcessedO3Data, modelSlice: GlobalModelState['models']) {
    const visibleModels = getIncludedModels(modelSlice);

    const suggested = {
        minX: Infinity,
        maxX: -Infinity,
        minY: Infinity,
        maxY: -Infinity,
    };

    for (const model of visibleModels) {
        const { minX, maxX, minY, maxY } = data[model].suggested;
        suggested.minX = Math.min(suggested.minX, minX ?? 0);
        suggested.maxX = Math.max(suggested.maxX, maxX ?? 0);
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
export function colorNameToHex(color: string) {
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
    } as const;

    if (typeof colors[color.toLowerCase() as keyof typeof colors] != 'undefined') {
        if (colors[color.toLowerCase() as keyof typeof colors] == undefined) {
            throw new Error(`Color ${color} is not supported`);
        }
        return colors[color.toLowerCase() as keyof typeof colors];
    }

    // TODO: sane default?
    return false;
}

/**
 * Converts the stroke style given by the API into the format supported by apexcharts.
 *
 * @param apiStyle     The stroke style specified by the API
 * @returns            The stroke style for the apexcharts library
 * @function
 */
export function convertToStrokeStyle(apiStyle: string) {
    const styles = {
        solid: 0,
        dotted: 1,
        dashed: 3,
    } as const;

    if (typeof styles[apiStyle.toLowerCase() as keyof typeof styles] != 'undefined') {
        return styles[apiStyle.toLowerCase() as keyof typeof styles];
    }
    // TODO: is there a sane fallback?
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
function combineSeries<DataT extends ApexAxisChartSeries>(
    series1: Series<DataT>,
    series2: Series<DataT>
): Series<DataT> {
    return {
        data: [...series1.data, ...series2.data] as DataT,
        styling: {
            colors: [...series1.styling.colors, ...series2.styling.colors],
            width: [...series1.styling.width, ...series2.styling.width],
            dashArray: [...series1.styling.dashArray, ...series2.styling.dashArray],
        },
    };
}

/**
 * Utility function to create an array of size i with empty arrays inside it.
 *
 * @param length    The size of the array containing the empty arrays
 * @returns        The array of size 'length' containing empty arrays
 * @function
 */
function create2dArray<T>(length: T): T[][] {
    return Array.from(Array(length), () => []);
}

/**
 * Checks if a model is included in the statistical value calculation of a given SV-Type by using the groupData as the reference data.
 *
 * @param model        The model that should be checked
 * @param groupData    The data of the group which will be used as reference for the check
 * @param svType       The statistical value type that should be checked for
 * @returns            True if the given model should be included in the SV calculation of the given SV-Type
 * @function
 */
function isIncludedInSv(model: string, groupData: ModelGroup, svType: PROCESS_SV_WITH_PERCENTILE) {
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
 * @param min      The selected min. year of the plot
 * @param max      The selected max. year of the plot
 * @returns        The optimal tick amount according to those values
 * @function
 */
export function getOptimalTickAmount(min: number, max: number) {
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
 * @param min      The selected min. year of the plot
 * @param max      The selected max. year of the plot
 * @returns        The optimal tick amount according to those values
 * @function
 */
export function getTickAmountYAxis(min: number, max: number) {
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
 * @param min  The minY value that will be rounded to a multiple of 10
 * @returns    Number rounded down to a multiple of ten
 * @function
 */
export function roundDownToMultipleOfTen(min: number) {
    return min - (min % 10);
}

/**
 * Rounds a number up to a multiple of ten. If the number already is a multiple of
 * ten the number stays the same.
 *
 * @param max   The maxY value that will be rounded to a multiple of 10
 * @returns     Number rounded up to a multiple of ten
 * @function
 */
export function roundUpToMultipleOfTen(max: number) {
    return max % 10 ? max + (10 - (max % 10)) : max;
}

/**
 * This function aims to filter out values that are outside the provided range.
 * If the value is outside of range it is replaced with null.
 *
 * @param value The value that could be filtered out
 * @param min   The minimum allowed value
 * @param max   The maximum allowed value
 * @returns     The value or null if the value is outside the allowed range
 * @function
 */
export function filterOutOfRange(value: number, min: number, max: number) {
    return min <= value && value <= max ? value : null;
}

/**
 * Function to format the labels on the y-axis nicely.
 * It hides all labels that are not a multiple of ten (i.e. all multiples of five and NOT ten).
 *
 * @param value    The label value
 * @returns       The value if it is a multiple of ten or an empty string to hide the label
 * @function
 */
export const formatYLabelsNicely = (value: number): string => (value % 10 ? '' : value.toString());

/**
 * This function parses the auto-generated sv names to separate
 * them into the sv type (e.g. mean, median) and the group.
 *
 * @param name The name of the data series (e.g. mean+std(Example Group))
 * @returns An object holding the sv type and the group name
 * @function
 */
export function parseSvName(name: string) {
    const regex = new RegExp('([^(]+)([^)]+)');
    const info = name.match(regex);
    return {
        sv: info![1],
        groupName: info![2].substring(1),
    };
}

/**
 * A plugin-method for apexcharts to provide a custom tooltip.
 * In this case the tooltip is for the OCTS line chart. It provides
 * a richer tooltip and shows the data points correctly.
 *
 * @param series An array of series
 * @param seriesIndex The index of the hovered data series
 * @param dataPointIndex The index of the data point in the hovered data series
 * @param w    Global apexcharts object
 * @returns          The desired html tooltip formatted with the correct information
 * @function
 */
export function customTooltipFormatter({
    series,
    seriesIndex,
    dataPointIndex,
    w,
}: {
    series: Series<ApexAxisChartSeries>[];
    seriesIndex: number;
    dataPointIndex: number;
    w: { globals: { seriesNames: string[]; seriesX: number[][] } };
}) {
    const modelName = w.globals.seriesNames[seriesIndex];
    const numDecimalsInDatapoint = 2;
    if (modelName.startsWith('Reference')) {
        const displayName = modelName.split('value');

        return `
                <div>
                    <div style='margin:2px'><strong>${
                        w.globals.seriesX[seriesIndex][dataPointIndex]
                    }</strong></div>
                    <div>Reference ${displayName[1]}: <strong>${
            // @ts-expect-error TODO: type this somehow?
            series[seriesIndex][dataPointIndex].toFixed(numDecimalsInDatapoint)
        }}</strong></div>
                </div>
            `;
    }

    for (const svName in SV_DISPLAY_NAME) {
        if (modelName.startsWith(SV_DISPLAY_NAME[svName as keyof typeof SV_DISPLAY_NAME])) {
            // parse sv
            const { sv, groupName } = parseSvName(modelName);
            return `
                <div>
                    <div style='margin:2px'><strong>${
                        w.globals.seriesX[seriesIndex][dataPointIndex]
                    }</strong></div>
                    
                    <div>${sv}: <strong>${
                // @ts-expect-error TODO: type this somehow?
                series[seriesIndex][dataPointIndex].toFixed(numDecimalsInDatapoint)
            }}</strong></div>
                    <div>Group: ${groupName}</div>
                </div>
                `;
        }
    }

    const { project, institute, name } = convertModelName(modelName);
    return `
        <div>
            <div style='margin:2px'><strong>${
                w.globals.seriesX[seriesIndex][dataPointIndex]
            }</strong></div>
            <div>${name}: <strong>${
        // @ts-expect-error TODO: type this somehow?
        series[seriesIndex][dataPointIndex].toFixed(numDecimalsInDatapoint)
    }</strong></div>
            <div>Project: ${project}</div>
            <div>Institue: ${institute}</div>
        </div>
        `;
}

/**
 * Gets all included models from the modelsSlice.
 *
 * @param  modelsSlice The modelsSlice needed to get the models from the model groups
 * @returns            All included models from all model groups
 * @function
 */
export function getIncludedModels(modelsSlice: GlobalModelState['models']) {
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
 * @param state redux store state
 * @param referenceValue an object with an array with the values for the reference line among other things
 * @param svSeries an object with an array with the values for the statistical values lines among other things
 */
function calcRecoveryPoints(
    state: AppState,
    referenceValue: Entry,
    svSeries: Series<ZmSeriesData>
) {
    const points = [];

    const refYear = state.reference.settings.year;
    const maxYear = state.plot.plotSpecificSettings.tco3_zm.displayXRange.years.maxX;
    // TODO: see Entry["data"] in apiSlice.ts
    const refValue = Math.max(...(referenceValue.data as ZmData));

    const dataName = [
        SV_DISPLAY_NAME.mean,
        SV_DISPLAY_NAME['mean+std'],
        SV_DISPLAY_NAME['mean-std'],
    ];

    const yearIdx = 0;
    const valIdx = 1;

    for (let idx = 0; idx < svSeries.data.length; idx++) {
        if (!dataName.includes((svSeries.data[idx].name ?? '').split('(')[0].slice(0, -1))) {
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
 * @param locationValue The minLat and maxLat values
 * @return              The formatted latitude band
 * @function
 */
export const formatLatitude = (locationValue: Latitude) => {
    const hemisphereExtensionMin = locationValue.minLat < 0 && locationValue.maxLat > 0 ? '°S' : '';
    const hemisphereExtensionMax = locationValue.maxLat <= 0 ? '°S' : '°N';
    return `${Math.abs(locationValue.minLat)}${hemisphereExtensionMin}-${Math.abs(
        locationValue.maxLat
    )}${hemisphereExtensionMax}`;
};

/**
 * Finds the latitude band by the currently selected location
 * @param state redux state
 * @returns The found Latitude Band
 * @function
 */
const findLatitudeBandByLocation = (state: AppState): string | undefined | null => {
    const selectedLocation = state.plot.generalSettings.location;
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
