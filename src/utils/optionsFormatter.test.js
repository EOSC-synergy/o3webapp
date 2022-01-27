import { IMPLICIT_YEAR_LIST, START_YEAR } from "./constants";
import { normalizeArray } from "./optionsFormatter";

describe("testing optionsFormatter functionality", () => {

    it('should normalize arrays as expected', () => {
        // generate an array of years describing the valid datapoints. 
        // the normalized array should contain the valid datapoints at
        // the index of where the implicit year list lists this year.
        const spacedYearArray = [...Array(10).keys()].map(number => `${START_YEAR + 2 * number}`);
        const valueArray = [...Array(10).keys()] // arbitrary values 0...9
        const expected = []
        for (let year of IMPLICIT_YEAR_LIST) {
            const idx = spacedYearArray.indexOf(year)
            if (idx !== -1) {
                expected.push(valueArray[idx]);
            } else {
                expected.push(null);
            }
        }
        expect(normalizeArray(spacedYearArray, valueArray)).toEqual(expected);
    });

    
    it('should preTranform the api data correctly', () => {

    });

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