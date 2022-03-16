import { O3AS_PLOTS } from "../../utils/constants";
import { generateCsv } from "../csv/csvParser";

/**
 * This module is responsible for providing functions to download the plot as png, svg or csv.
 * 
 * @see [PdfCreator]{@link module:PdfCreator} for pdf download
 * @module DownloadNotPdf
 * */ // used for auto generation of JSDocs with better-docs

/**
 * Downloads the graph as a PNG file.
 *
 * @param {string} fileName the file name of the PNG
 * @returns a promise which provides the user to download the PNG file, if it was successful.
 * @function
 */
export const downloadGraphAsPNG = (fileName) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const svgElement = document.querySelector(".apexcharts-svg");
      const imageBlobURL =
        "data:image/svg+xml;charset=utf-8," +
        encodeURIComponent(svgElement.outerHTML);

      img.onload = () => {
        let canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        const dataURL = canvas.toDataURL("image/png");
        downloadBase64File(dataURL, fileName);
        resolve(dataURL);
      };
      img.onerror = (error) => {
        reject(error);
      };
      img.src = imageBlobURL;
    });
}

/**
 * Downloads the graph as an SVG file.
 *
 * @param {string} fileName the File name of the SVG
 * @returns a promise which provides the user to download the SVG file, if it was successful.
 * @function
 */
export const downloadGraphAsSVG = (fileName) => {
    return new Promise(resolve => {
      const svgElement = document.querySelector(".apexcharts-svg");
      const imageBlobURL =
        "data:image/svg+xml;charset=utf-8," +
        encodeURIComponent(svgElement.outerHTML);
      downloadBase64File(imageBlobURL, fileName);
      resolve(imageBlobURL);
    });
}

/**
 * Downloads the graph as a CSV file.
 * @param {string} plotTitle - the title of the plot
 * @param {string} plotId - the current id of the plot
 * @function
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
        const LENGTH = Math.max(...seriesX.map(series => series.length));
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
                if (!seriesNames[seriesIndex]) continue; // skip "box" which is empty
                const value = series[seriesIndex][regionIndex];
                line[seriesNames[seriesIndex]] = value ? value.toFixed(2) : value;
            }
            csvData.push(line);
        }

      } else {
          throw new Error(`The given plotId: "${plotId} has not csv support (yet)!"`);
      }
      
      downloadCsvFile({fileName: plotTitle + ".csv", csvString: generateCsv(csvData)}); // download data with title

}

/**
 * Downloads a given string interpreted as CSV.
 * 
 * @param {string} fileName name of the downloadable file
 * @param {string} csvString the content of this file
 * @function
 */
const downloadCsvFile = ({fileName, csvString}) => {
    const blob = new Blob([csvString]);
    const a = window.document.createElement("a");

    a.href = window.URL.createObjectURL(blob, {
    type: "text/csv"
    });
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}


/**
 * Downloads the Base64 file to the specified Base64 data.
 * 
 * @param {string} base64Data the given Base64 data
 * @param {string} fileName the file name
 * @function
 */
const downloadBase64File = (base64Data, fileName) => {
    const downloadLink = document.createElement("a");
    downloadLink.href = base64Data;
    downloadLink.download = fileName;
    downloadLink.click();
}