import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { O3AS_PLOTS, legalNoticeLinks } from "../../utils/constants";
import { jsPDF } from "jspdf";

pdfMake.vfs = pdfFonts.pdfMake.vfs;

/**
 * This Method adjusts the svg element in order to scale it right in the pdf file.
 * the viewBox parameter of the svg element will be set to the width and hight
 * values of the svg element.
 * visit the following website for more details about the viewBox parameter:
 * https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/viewBox
 *
 * @param {the svgElement element.} svg
 * @returns returns the adjusted svg element.
 */
function getAdjustedSVG(svgElement) {
  let bBox = svgElement.getBBox();
  let viewBoxParameters = "0 0 " + bBox.width + " " + bBox.height;
  svgElement.setAttribute("viewBox", viewBoxParameters);
  return svgElement.outerHTML;
}

/**
 * Downloads the PDF which contains the Graph in SVG format and contains the List of models.
 *
 * @param {the plot id of the graph (tco3_zm, tco3_return etc.)} plotId
 * @param {the File name of the PDF} fileName
 * @param {the Model Groups which contains the names of the models.} modelGroups 
 * @param {the current Model data contains the properties of the models(color, linestyle etc.)} currentData 
 */
export async function downloadGraphAsPDF(
  plotId,
  fileName,
  modelGroups,
  currentData
) {
  let modelGroupsList = getListOfModelsForPdf(plotId, modelGroups, currentData);
  const svgElement = document.querySelector(".apexcharts-svg");
  let docDefinition = null;

  if (plotId === O3AS_PLOTS.tco3_zm || plotId === O3AS_PLOTS.tco3_return) {
    docDefinition = {
      info: {
        title: fileName,
      },
      pageOrientation: "landscape",
      content: [
        {
          svg: getAdjustedSVG(svgElement),
          fit: [760, 350],
        },
        {
          text: "List Of Used Models:",
          style: "header",
          fontSize: 14,
          bold: true,
          pageBreak: "before",
        },
        "\n",
        {
          ol: modelGroupsList,
        },
        {
          fontSize: 10,
          ul: legalNoticeLinks,
          pageBreak: "before",
          bold: true,
        },
      ],
    };
  } else {
    throw `the given plot id "${plotId}" is not defined`;
  }
  pdfMake.createPdf(docDefinition).download(fileName);
}


/**
 * returns the List of models in the format which the pdfMake libary accepts.
 *
 * @param {the plot id of the graph (tco3_zm, tco3_return etc.)} plotId
 * @param {the Model Groups which contains the names of the models.} modelGroups 
 * @param {the current Model data contains the properties of the models(color, linestyle etc.)} currentData 
 */
function getListOfModelsForPdf(plotId, modelGroups, currentData) {
  let modelGroupsList = [
    [{ text: "", style: "header" }, { ul: [{ text: "", color: "red" }] }],
  ];

  for (const modelGroup of Object.values(modelGroups)) {
    if (!modelGroup.isVisible) continue;

    let modelsInTheGroup = [];

    for (const [model, modelData] of Object.entries(modelGroup.models)) {
      if (!modelData.isVisible) continue;
      if (typeof currentData[model] === "undefined") continue;

      let textOfCurrentLineOfList;

      if (plotId == O3AS_PLOTS.tco3_zm) {
        textOfCurrentLineOfList = `${model} (linetype = ${currentData[model].plotStyle.linestyle})`;
      } else if (plotId == O3AS_PLOTS.tco3_return) {
        textOfCurrentLineOfList = `${model}`;
      }

      modelsInTheGroup.push({
        text: textOfCurrentLineOfList,
        color: `${currentData[model].plotStyle.color}`,
      });
    }
    modelGroupsList.push([
      { text: modelGroup.name, style: "header" },
      { ul: modelsInTheGroup },
    ]);
  }

  modelGroupsList.shift();

  return modelGroupsList;
}
