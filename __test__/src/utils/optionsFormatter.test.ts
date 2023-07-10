import { AppStore, createTestStore } from 'store';
import { O3AS_PLOTS, START_YEAR } from 'utils/constants';
import {
    colorNameToHex,
    convertToStrokeStyle,
    normalizeArray,
    preTransformApiData,
    DEFAULT_TCO3_RETURN,
    getDefaultYAxisTco3Return,
    getOptimalTickAmount,
    getTickAmountYAxis,
    roundUpToMultipleOfTen,
    roundDownToMultipleOfTen,
    formatYLabelsNicely,
    parseSvName,
    getDefaultYAxisTco3Zm,
    FONT_FAMILY,
    customTooltipFormatter,
    IMPLICIT_YEAR_LIST,
    MODEL_LINE_THICKNESS,
    Styling,
    generateTco3_ZmSeries,
    generateTco3_ReturnSeries,
    getOptionsReturn,
} from 'utils/optionsFormatter';
import { GlobalModelState } from 'store/modelsSlice';
import { Entry, ProcessedO3Data } from 'services/API/apiSlice';

describe('testing optionsFormatter functionality', () => {
    const spacedYearArray = [...Array(10).keys()].map((number) => `${START_YEAR + 2 * number}`);
    const valueArray = [...Array(10).keys()]; // arbitrary values 0...9
    const expectedNormalize: (number | null)[] = [];
    for (const year of IMPLICIT_YEAR_LIST) {
        const idx = spacedYearArray.indexOf(year);
        if (idx !== -1) {
            expectedNormalize.push(valueArray[idx]);
        } else {
            expectedNormalize.push(null);
        }
    }

    it('should normalize arrays as expected', () => {
        // generate an array of years describing the valid data points.
        // the normalized array should contain the valid data points at
        // the index of where the implicit year list lists this year.

        expect(normalizeArray(spacedYearArray, valueArray)).toEqual(expectedNormalize);
    });

    describe('preTransform for all plot types', () => {
        it('should pre-tranform the api data for tco3_zm correctly', () => {
            const apiData = [
                {
                    model: 'modelA',
                    //plotstyle: 'plotstyleData',
                    x: spacedYearArray,
                    y: valueArray,
                },
            ];

            const lookUpTable = preTransformApiData(O3AS_PLOTS.tco3_zm, apiData);
            expect(lookUpTable).toEqual({
                modelA: {
                    data: expectedNormalize,
                    //plotStyle: 'plotstyleData',
                    suggested: {
                        minX: 1960,
                        maxX: 1978,
                        minY: 0,
                        maxY: 9, // from Array [0..9]
                    },
                },
            });
        });

        it('should pre-transform the api data for tco3_return correctly', () => {
            const apiData = [
                {
                    model: 'modelA',
                    //plotstyle: 'plotstyleData',
                    x: ['regionA', 'regionB'],
                    y: [2010, 2022],
                },
            ];

            const lookUpTable = preTransformApiData(O3AS_PLOTS.tco3_return, apiData);
            expect(lookUpTable).toEqual({
                modelA: {
                    //plotStyle: 'plotstyleData',
                    data: {
                        regionA: 2010,
                        regionB: 2022,
                    },
                    suggested: {
                        minY: 2010,
                        maxY: 2022,
                    },
                },
            });
        });
    });

    describe('tests the generation of plot series', () => {
        let store: AppStore;
        let modelsSlice: GlobalModelState['models'];
        const testArray = Array(141)
            .fill(0)
            .map((e, i) => [START_YEAR + i, e]);
        beforeEach(() => {
            store = createTestStore();
            modelsSlice = store.getState().models;
        });

        it('generates the tco3_zm series correctly', () => {
            const dataExpected = {
                data: [
                    { name: undefined, data: testArray }, // for the reference line
                    { name: 'CCMI-1_ACCESS_ACCESS-CCM-refC2', data: testArray },
                    { name: 'CCMI-1_ACCESS_ACCESS-CCM-senC2fGHG', data: testArray },
                    { name: 'CCMI-1_CCCma_CMAM-refC2', data: testArray },
                    { name: 'Lower % (Example Group)', data: testArray },
                    { name: 'Upper % (Example Group)', data: testArray },
                    { name: 'Mean (Example Group)', data: testArray },
                    { name: 'Median (Example Group)', data: testArray },
                    { name: 'μ + σ (Example Group)', data: testArray },
                    { name: 'μ - σ (Example Group)', data: testArray },
                ],
                styling: {
                    colors: [
                        '#000000',
                        '#000000',
                        '#000000',
                        '#000000',
                        '#1e8509',
                        '#1e8509',
                        '#696969',
                        '#000',
                        '#0e4e78',
                        '#0e4e78',
                    ],
                    dashArray: [0, 0, 0, 0, 4, 4, 0, 2, 8, 8],
                    width: Array(10).fill(MODEL_LINE_THICKNESS),
                    points: [
                        [null, null],
                        [null, null],
                        [1981, 0],
                        [null, null],
                        [1981, 0],
                        [1981, 0],
                    ],
                },
            };
            const data: ProcessedO3Data = {
                reference_value: {
                    plotStyle: {
                        color: 'black',
                        linestyle: 'solid',
                    },
                    data: Array(141).fill(0),
                } as Entry,
            };
            Object.keys(modelsSlice.modelGroups[0].models).forEach((key) => {
                data[key] = {
                    plotStyle: {
                        color: 'black',
                        linestyle: 'solid',
                    },
                    data: Array(141).fill(0),
                } as Entry;
            });
            const series = generateTco3_ZmSeries(data, modelsSlice, true, store.getState());
            expect(series).toEqual(dataExpected);
        });

        it('generates the tco3_return series correctly', () => {
            const data = {
                'CCMI-1_ACCESS_ACCESS-CCM-refC2': {
                    plotStyle: {
                        color: 'purple',
                        linestyle: 'none',
                        marker: 'o',
                    },
                    data: {
                        'SH Polar': 2064,
                        'SH mid-lat': 2051,
                        Tropics: 2060,
                        'NH mid-lat': 2041,
                        'NH Polar': 2040,
                        'Near global': 2049,
                        Global: 2052,
                        'User region': 2046,
                    },
                } as unknown as Entry,
                'CCMI-1_ACCESS_ACCESS-CCM-senC2fGHG': {
                    plotStyle: {
                        color: 'purple',
                        linestyle: 'none',
                        marker: 'o',
                    },
                    data: {
                        'SH Polar': 2071,
                        'SH mid-lat': 2071,
                        Tropics: 2046,
                        'NH mid-lat': 2066,
                        'NH Polar': 2064,
                        'Near global': 2065,
                        Global: 2066,
                        'User region': 2064,
                    },
                } as unknown as Entry,
                'CCMI-1_CCCma_CMAM-refC2': {
                    plotStyle: {
                        color: 'red',
                        linestyle: 'none',
                        marker: 'x',
                    },
                    data: {
                        'SH Polar': 2087,
                        'SH mid-lat': 2049,
                        'NH mid-lat': 1986,
                        'NH Polar': 1986,
                        'Near global': 2045,
                        Global: 2048,
                        'User region': 2046,
                    },
                } as unknown as Entry,
                // needed for typing
                reference_value: {} as Entry,
            };
            const dataExpected = {
                data: [
                    { name: '', data: [], type: 'boxPlot' },
                    { name: 'CCMI-1_ACCESS_ACCESS-CCM-refC2', data: [], type: 'scatter' },
                    { name: 'CCMI-1_ACCESS_ACCESS-CCM-senC2fGHG', data: [], type: 'scatter' },
                    { name: 'CCMI-1_CCCma_CMAM-refC2', data: [], type: 'scatter' },
                    { name: 'Lower % (Example Group)', data: [], type: 'scatter' },
                    { name: 'Upper % (Example Group)', data: [], type: 'scatter' },
                    { name: 'Mean (Example Group)', data: [], type: 'scatter' },
                    { name: 'Median (Example Group)', data: [], type: 'scatter' },
                    { name: 'μ + σ (Example Group)', data: [], type: 'scatter' },
                    { name: 'μ - σ (Example Group)', data: [], type: 'scatter' },
                ],
                styling: {
                    colors: [
                        '#800080',
                        '#800080',
                        '#ff0000',
                        '#1e8509',
                        '#1e8509',
                        '#696969',
                        '#000',
                        '#0e4e78',
                        '#0e4e78',
                    ],
                    dashArray: [4, 4, 0, 2, 8, 8],
                    width: Array(6).fill(MODEL_LINE_THICKNESS),
                },
            };

            const series = generateTco3_ReturnSeries(
                data,
                modelsSlice,
                // TODO: typing?
                { regions: ['Global' as unknown as number] },
                { minY: 270, maxY: 330 },
                store.getState()
            );
            expect(series).toEqual(dataExpected);
        });
    });

    describe('tests the generation of the plot options', () => {
        let store: AppStore;

        beforeEach(() => {
            store = createTestStore();
        });

        it('returns the correct options formatted correctly for tco3_return', () => {
            const expected = JSON.parse(JSON.stringify(DEFAULT_TCO3_RETURN));
            const yaxis = [
                getDefaultYAxisTco3Return(undefined, 0, 10, true, false, 3, 2),
                getDefaultYAxisTco3Return(undefined, 0, 10, true, true, -3, 2),
            ];
            expected.title.text = 'title';
            expected.subtitle.text = 'Global (90°S–90°N) | Jan, Feb, Dec';

            expected.yaxis.push(...yaxis);

            const yAxisRange = { minY: 0, maxY: 10 };
            const result = getOptionsReturn(
                {} as Styling,
                'title',
                yAxisRange,
                [],
                store.getState()
            );
            expect(JSON.stringify(result)).toEqual(JSON.stringify(expected)); // stringify results to not mess with anonymous functions
        });
    });

    it('converts the color name to hex codes', () => {
        const colorName = 'lime';
        const colorHex = '#00ff00';
        expect(colorNameToHex(colorName)).toEqual(colorHex);

        expect(colorNameToHex('no color')).toEqual(false);
    });

    it('converts the stroke style to to apexcharts syntax', () => {
        const lineStyle = 'solid';
        const apexChartsLineStyle = 0;
        expect(convertToStrokeStyle(lineStyle)).toEqual(apexChartsLineStyle);
        expect(convertToStrokeStyle('no valid line style')).toEqual(false);
    });

    it('should calculate the optimal tick amount for the x-axis for the tco3_zm', () => {
        const max = 200;
        expect(getOptimalTickAmount(0, max)).toEqual(6);
    });

    it('should calculate the optimal tick amount for the y-axis', () => {
        expect(getTickAmountYAxis(0, 100)).toEqual(20);
    });

    it('should round up to a multiple of ten correctly', () => {
        expect(roundUpToMultipleOfTen(13)).toEqual(20); // roundup
        expect(roundUpToMultipleOfTen(10)).toEqual(10); // no roundup required
    });

    it('should round down to a multiple of ten correctly', () => {
        expect(roundDownToMultipleOfTen(13)).toEqual(10); // round down
        expect(roundDownToMultipleOfTen(100)).toEqual(100); // no rounddown required
    });

    it('should format the y-labels nicely', () => {
        expect(formatYLabelsNicely(30)).toEqual('30');
        expect(formatYLabelsNicely(5)).toEqual('');
        expect(formatYLabelsNicely(7)).toEqual('');
    });

    it('should parse the sv name accordingly', () => {
        expect(parseSvName('mean+std(Example Group)')).toEqual({
            sv: 'mean+std',
            groupName: 'Example Group',
        });
    });

    it('should return the default y-axis config for the tco3_zm', () => {
        const expectedYAxisConfig = {
            show: true,
            opposite: false,
            seriesName: 'seriesX',
            min: 42,
            max: 420,
            decimalsInFloat: 0,
            axisBorder: {
                show: true,
                offsetX: -3,
            },
            axisTicks: {
                show: true,
            },
            tickAmount: 10,
            title: {
                text: 'TCO(DU)',
                style: {
                    fontSize: '1rem',
                    fontFamily: FONT_FAMILY,
                },
            },
            labels: {
                formatter: formatYLabelsNicely,
            },
        };

        expect(getDefaultYAxisTco3Zm('seriesX', 42, 420, true, false, -3, 10)).toEqual(
            expectedYAxisConfig
        );
    });

    it('should return a correct formatted tooltip for a normal series', () => {
        const expected = `
        <div>
            <div style='margin:2px'><strong>2021</strong></div>
            <div>MODELNAME: <strong>42.00</strong></div>
            <div>Project: PROJECT-X</div>
            <div>Institue: INSTITUTE-Y</div>
        </div>
        `;

        expect(
            customTooltipFormatter({
                series: [[42]] as unknown as Parameters<typeof customTooltipFormatter>[0]['series'],
                seriesIndex: 0,
                dataPointIndex: 0,
                w: {
                    globals: {
                        seriesX: [[2021]],
                        seriesNames: ['PROJECT-X_INSTITUTE-Y_MODELNAME'],
                    },
                },
            })
        ).toEqual(expected);
    });
});
