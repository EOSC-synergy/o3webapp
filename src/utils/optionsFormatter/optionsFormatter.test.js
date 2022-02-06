import { createTestStore } from "../../store/store";
import { IMPLICIT_YEAR_LIST, O3AS_PLOTS, START_YEAR, MODEL_LINE_THICKNESS } from "../constants";
import { 
    colorNameToHex, 
    convertToStrokeStyle, 
    generateSeries, 
    getOptions, 
    normalizeArray, 
    preTransformApiData, 
    default_TCO3_return, 
    getDefaultYAxisTco3Return, 
    getOptimalTickAmount, 
    getTickAmountYAxisTco3Zm, 
    getTickAmountYAxisTco3Return, 
    roundUpToMultipleOfTen, 
    roundDownToMultipleOfTen, 
    formatYLabelsNicely,
    parseSvName
} from "./optionsFormatter";

describe("testing optionsFormatter functionality", () => {
    const spacedYearArray = [...Array(10).keys()].map(number => `${START_YEAR + 2 * number}`);
    const valueArray = [...Array(10).keys()] // arbitrary values 0...9
    const expectedNormalize = []
    for (let year of IMPLICIT_YEAR_LIST) {
        const idx = spacedYearArray.indexOf(year)
        if (idx !== -1) {
            expectedNormalize.push(valueArray[idx]);
        } else {
            expectedNormalize.push(null);
        }
    }

    it('should normalize arrays as expected', () => {
        // generate an array of years describing the valid datapoints. 
        // the normalized array should contain the valid datapoints at
        // the index of where the implicit year list lists this year.
        
        expect(normalizeArray(spacedYearArray, valueArray)).toEqual(expectedNormalize);
    });

    
    describe("preTransform for all plot types", () => {
        it('should pre-tranform the api data for tco3_zm correctly', () => {
            const apiData = [{
                model: "modelA",
                plotstyle: "plotstyleData",
                x: spacedYearArray,
                y: valueArray,
            }];
    
            expect(
                preTransformApiData({plotId: O3AS_PLOTS.tco3_zm, data: apiData})
            ).toEqual({
                modelA: {
                    plotStyle: "plotstyleData",
                    data: expectedNormalize,
                }
            });
    
        });

        it('should pre-transform the api data for tco3_return correctly', () => {
            const apiData = [{
                model: "modelA",
                plotstyle: "plotstyleData",
                x: ["regionA", "regionB"],
                y: [2010, 2022],
            }];

            expect(
                preTransformApiData({plotId: O3AS_PLOTS.tco3_return, data: apiData})
            ).toEqual({
                modelA: {
                    plotStyle: "plotstyleData",
                    data: {
                        "regionA": 2010,
                        "regionB": 2022,

                    } // a direct lookup table might be faster (to consider if boxplot calculation becomes to slow!)
                }
            });
        });
    })


    describe("tests the generation of a series", () => {
        let store;
        let modelsSlice;
        const testArray = Array(141).fill(0).map((e, i) => [START_YEAR + i, e]);;
        beforeEach(() => {
            store = createTestStore();
            modelsSlice = store.getState().models;
        })

        const dataExpected = {
            data: [
              {
                name: 'CCMI-1_ACCESS_ACCESS-CCM-refC2',
                data: testArray
              },
              {
                name: 'CCMI-1_ACCESS_ACCESS-CCM-senC2fGHG',
                data: testArray
              },
              { name: 'CCMI-1_CCCma_CMAM-refC2', data: testArray},
              { name: 'mean(Example Group)', data: testArray},
              { name: 'median(Example Group)', data: testArray},
              { name: 'mean+std(Example Group)', data: testArray},
              { name: 'mean-std(Example Group)', data: testArray}
            ],
            styling: {
              colors: [
                '#000000', '#000000',
                '#000000', '#000',
                '#000',    '#000',
                '#000'
              ],
              dashArray: [
                0, 0, 0, 0,
                2, 8, 8
              ],
              width: [
                MODEL_LINE_THICKNESS, MODEL_LINE_THICKNESS, MODEL_LINE_THICKNESS, MODEL_LINE_THICKNESS,
                MODEL_LINE_THICKNESS, MODEL_LINE_THICKNESS, MODEL_LINE_THICKNESS
              ]
            }
          }

        it("generates the series correctly", () => {
            const data = {}
            Object.keys(modelsSlice.modelGroups[0].models).forEach(key => {
                data[key] = {};
                data[key]["plotStyle"] = {};
                data[key].plotStyle.color = "black";
                data[key].plotStyle.linestyle = "solid";
                data[key].data = Array(141).fill(0);
            })
            const series = generateSeries({plotId: O3AS_PLOTS.tco3_zm, data: data, modelsSlice: modelsSlice})
            expect(series).toEqual(dataExpected);
        });
    });


    it('returns the correct options formatted correctly for tco3_return', () => {
        const expected = JSON.parse(JSON.stringify(default_TCO3_return));
        const yaxis = [getDefaultYAxisTco3Return(undefined, 0, 10, true, false, 3, 2), getDefaultYAxisTco3Return(undefined, 0, 10, true, true, -3, 2),]
        expected.title.text = "title";
        
        expected.yaxis.push(...yaxis);

        const xAxisRange = {minX: 0, maxY: 10};
        const yAxisRange = {minY: 0, maxY: 10};
        const result = getOptions({plotId: O3AS_PLOTS.tco3_return, styling: {colors:[]}, plotTitle: "title", xAxisRange, yAxisRange, seriesNames: []});
        expect(result).toEqual(expected);
    });

    it('converts the color name to hex codes', () => {
        const colorName = "lime";
        const colorHex = "#00ff00";
        expect(colorNameToHex(colorName)).toEqual(colorHex);

        expect(colorNameToHex("no color")).toEqual(false);
    });
    
    it('converts the stroke style to to apexcharts syntax', () => {
        const lineStyle = "solid";
        const apexChartsLineStyle = 0;
        expect(convertToStrokeStyle(lineStyle)).toEqual(apexChartsLineStyle);
        expect(convertToStrokeStyle("no valid line style")).toEqual(false);
    });

    it('should calculate the optimal tick amount for the x-axis for the tco3_zm', () => {
        const max = 200;
        const factor = 10;
        expect(getOptimalTickAmount(0, max)).toEqual(max / factor);
    });

    it('should calculate the optimal tick amount for the y-axis for the tco3_zm', () => {
        expect(getTickAmountYAxisTco3Zm(0, 100)).toEqual(21);
    });

    it('should calculate the optimal tick amount for the y-axis for the tco3_return', () => {
        expect(getTickAmountYAxisTco3Return(0, 100)).toEqual(20);
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
        expect(formatYLabelsNicely(30)).toEqual(30);
        expect(formatYLabelsNicely(5)).toEqual("");
        expect(formatYLabelsNicely(7)).toEqual("");
    });

    it('should parse the sv name accordingly', () => {
        expect(parseSvName("mean+std(Example Group)")).toEqual({
            sv: "mean+std",
            groupName: "Example Group",
        });
    });
});