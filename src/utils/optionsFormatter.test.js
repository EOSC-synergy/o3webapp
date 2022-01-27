import { IMPLICIT_YEAR_LIST, O3AS_PLOTS, START_YEAR } from "./constants";
import { normalizeArray, preTransformApiData } from "./optionsFormatter";

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
                plotstyle: "plotstyle",
                x: spacedYearArray,
                y: valueArray,
            }];
    
            expect(
                preTransformApiData({plotId: O3AS_PLOTS.tco3_zm, data: apiData})
            ).toEqual({
                modelA: {
                    plotStyle: "plotstyle",
                    data: expectedNormalize,
                }
            });
    
        });

        it('should pre-transform the api data for tco3_return correctly', () => {
            
        });
    })

    it('calculates the correct boxplot values', () => {

    });

    it('generates the the tco3_zm series', () => {

    });

    it('generates the tco3_return series', () => {

    });

    it('extracts all models which should be included', () => {

    });

    it('generates the series accordingly', () => {

    });


    it('returns the correct options formatted correctly', () => {

    });

    it('converts the color name to hex codes', () => {

    });
    
    it('converts the stroke style to to apexcharts syntax', () => {

    });



});