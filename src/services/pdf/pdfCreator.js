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
 */
export async function downloadGraphAsPDF(
  plotId,
  fileName,
  modelGroups,
  currentData
) {
  //console.log(currentData);
  let modelGroupsList = [
    [{ text: "", style: "header" }, { ul: [{ text: "", color: "red" }] }],
  ];

  for (const modelGroup of Object.values(modelGroups)) {
    if (!modelGroup.isVisible) continue;

    let modelsInTheGroup = [];
    for (const [model, modelData] of Object.entries(modelGroup.models)) {
      if (!modelData.isVisible) continue;
      if (typeof currentData[model] === "undefined") continue;
      modelsInTheGroup.push({
        text: `${model}`,
        color: `${currentData[model].plotStyle.color}`,
      });
    }
    modelGroupsList.push([
      { text: modelGroup.name, style: "header" },
      { ul: modelsInTheGroup },
    ]);
  }

  modelGroupsList.shift();
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
          fit: [770, 350],
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

export async function downloadPDF(plotId, fileName, modelGroups, currentData) {
  if (plotId === O3AS_PLOTS.tco3_zm || plotId === O3AS_PLOTS.tco3_return) {
    const doc = new jsPDF();
    const svgElement = document.querySelector(".apexcharts-svg");
    console.log(svgElement.outerHTML);

    //doc.addSvgAsImage(svgElement.outerHTML, 10, 10, 100, 100, fileName, 'FAST', 0)
    doc.addSvgAsImage(
      `<svg height="100" width="100">
    <circle cx="50" cy="50" r="40" stroke="black" stroke-width="3" fill="red" />
    Sorry, your browser does not support inline SVG.  
  </svg> `,
      10,
      10,
      100,
      100,
      fileName,
      "FAST",
      0
    );
    doc.save(fileName + ".pdf");
  } else {
    throw `the given plot id "${plotId}" is not defined`;
  }
}
