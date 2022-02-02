import { IMPLICIT_YEAR_LIST, O3AS_PLOTS, START_YEAR } from "./constants";
import { colorNameToHex, convertToStrokeStyle, generateSeries, getIncludedModels, getOptions, normalizeArray, preTransformApiData, default_TCO3_return } from "./optionsFormatter";

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

    it('extracts all models which should be included', () => {
        const modelSlice = {
            idCounter: 1,
            modelGroups: {
                0: { 
                    modelList: ["modelA", "modelB", "modelC"],
                    models: {
                        "modelA": {
                            isVisible: true,
                        },
                        "modelB": {
                            isVisible: false,
                        },
                        "modelC": {
                            isVisible: true,
                        },
                    },
                    isVisible: true,
                }
            },
        };

        expect(getIncludedModels(modelSlice)).toEqual(new Set(["modelA", "modelC"]));
    });

    it('throws an error if a provided plotId is not correct', () => {
        expect(
            () => generateSeries({plotId: "no valid id", data: {}, modelsSlice: { modelGroups: {}}})
        ).toThrow("the given plot id \"no valid id\" is not defined");
    });


    it('returns the correct options formatted correctly', () => {
        const expected = Object.assign({}, default_TCO3_return);
        expected.title.text = "title";
        expect(
            getOptions({plotId: O3AS_PLOTS.tco3_return, styling: {colors:[]}, plotTitle: "title"})
        ).toEqual(
            expected
        );
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

});