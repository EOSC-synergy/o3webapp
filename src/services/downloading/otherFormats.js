import { O3AS_PLOTS } from '../../utils/constants';
import { generateCsv } from '../csvParser';

/**
 * This module is responsible for providing functions to download the plot as png, svg or csv.
 *
 * @module DownloadNotPdf
 * @see [PdfCreator]{@link module:PdfCreator} for pdf download
 */ // used for auto generation of JSDocs with better-docs

/**
 * Downloads the graph as a PNG file.
 *
 * @function
 * @param {string} fileName The file name of the PNG
 * @returns A promise which provides the user to download the PNG file, if it was successful.
 */
export const downloadGraphAsPNG = (fileName) => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        const svgElement = document.querySelector('.apexcharts-svg');
        const imageBlobURL =
            'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgElement.outerHTML);

        img.onload = () => {
            let canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
            const dataURL = canvas.toDataURL('image/png');
            downloadBase64File(dataURL, fileName);
            resolve(dataURL);
        };
        img.onerror = (error) => {
            reject(error);
        };
        img.src = imageBlobURL;
    });
};

/**
 * Downloads the graph as an SVG file.
 *
 * @function
 * @param {string} fileName The File name of the SVG
 * @returns A promise which provides the user to download the SVG file, if it was successful.
 */
export const downloadGraphAsSVG = (fileName) => {
    return new Promise((resolve) => {
        const svgElement = document.querySelector('.apexcharts-svg');
        const imageBlobURL =
            'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgElement.outerHTML);
        downloadBase64File(imageBlobURL, fileName);
        resolve(imageBlobURL);
    });
};

/**
 * Downloads the graph as a CSV file.
 *
 * @function
 * @param {string} plotTitle - The title of the plot
 * @param {string} plotId - The current id of the plot
 */
export const downloadGraphAsCSV = (plotTitle, plotId, reportError) => {
    let series, seriesX, categoryLabels, seriesNames;
    try {
        const global = window.ApexCharts.getChartByID(plotId).w.globals;
        series = global.series;
        seriesX = global.seriesX;
        categoryLabels = global.categoryLabels;
        seriesNames = global.seriesNames;
    } catch (TypeError) {
        reportError("Can't download the chart if it hasn't been fully loaded.");
        return;
    }

    const csvData = [];
    if (plotId === O3AS_PLOTS.tco3_zm) {
        // ### tco3_zm ###
        const LENGTH = Math.max(...seriesX.map((series) => series.length));
        for (let lineIndex = 0; lineIndex < LENGTH; ++lineIndex) {
            const line = {
                category: seriesX[0][lineIndex],
            };
            for (let index in seriesNames) {
                const value = series[index][lineIndex];
                line[seriesNames[index]] = value ? value.toFixed(2) : value;
            }
            csvData.push(line);
        }
    } else if (plotId === O3AS_PLOTS.tco3_return) {
        for (let regionIndex in categoryLabels) {
            const line = {
                category: categoryLabels[regionIndex],
            };
            for (let seriesIndex in seriesNames) {
                if (!seriesNames[seriesIndex]) {
                    continue;
                } // skip "box" which is empty
                const value = series[seriesIndex][regionIndex];
                line[seriesNames[seriesIndex]] = value ? value.toFixed(2) : value;
            }
            csvData.push(line);
        }
    } else {
        throw new Error(`The given plotId: "${plotId} has not csv support (yet)!"`);
    }

    downloadCsvFile({ fileName: plotTitle + '.csv', csvString: generateCsv(csvData) }); // download data with title
};

/**
 * Downloads a given string interpreted as CSV.
 *
 * @function
 * @param {string} fileName Name of the downloadable file
 * @param {string} csvString The content of this file
 */
const downloadCsvFile = ({ fileName, csvString }) => {
    const blob = new Blob([csvString]);
    const a = window.document.createElement('a');

    a.href = window.URL.createObjectURL(blob, {
        type: 'text/csv',
    });
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
};

/**
 * Downloads the Base64 file to the specified Base64 data.
 *
 * @function
 * @param {string} base64Data The given Base64 data
 * @param {string} fileName The file name
 */
const downloadBase64File = (base64Data, fileName) => {
    const downloadLink = document.createElement('a');
    downloadLink.href = base64Data;
    downloadLink.download = fileName;
    downloadLink.click();
};
