import { assert } from "joi";
import { getAdjusting } from "./pdfCreator";
import '@testing-library/jest-dom/extend-expect';
import '@testing-library/jest-dom';
/** 
jest.mock('react-apexcharts', () => {
    return {
        __esModule: true,
        default: () => {
            return <div/>
        },
    }
})

describe('testing pdf downloads correctly.', () => {

    it('adjusts the svg correctly', () => {
    
        const svgElementExpected = document.querySelector(".apexcharts-svg");
        let bBox = svgElementExpected.getBBox();
        let viewBoxParameters = "0 0 " + bBox.width + " " + bBox.height;
        svgElementExpected.setAttribute("viewBox", viewBoxParameters);

        expect(getAdjusting(document.querySelector(".apexcharts-svg"))).toEqual(svgElementExpected.outerHTML) 

    })
} ) */