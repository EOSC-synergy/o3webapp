import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { O3AS_PLOTS } from "../../utils/constants";

pdfMake.vfs = pdfFonts.pdfMake.vfs;

const legalNoticeLink = [
  "Terms of Use Link: https://o3as.data.kit.edu/policies/terms-of-use.html",
  "Privacy Policy Link: https://o3as.data.kit.edu/policies/privacy-policy.html",
  "How to Acknowledge Link: https://o3as.data.kit.edu/policies/how-to-acknowledge.html",
];

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
export async function downloadGraphAsPDF(plotId, fileName, modelGroups, currentData) {

  console.log(currentData);
  for (const modelGroup of Object.values(modelGroups)) {
    if (!modelGroup.isVisible) continue;
    // modelGroup.name = group name
    for (const [model, modelData] of Object.entries(modelGroup.models)) {
        if (!modelData.isVisible) continue;
        // model = name
        if (typeof currentData[model] === "undefined") {
          // default color? skip?
        }
        console.log(currentData[model].plotStyle) // color, linestyle?
    }
  }

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
        "\n","\n","\n",
        {
          text: "List of used models:",
          style: "header",
          fontSize: 14,
        },
        {
          
        },
        "\n","\n","\n",
        {
          fontSize: 11,
          ul: legalNoticeLink,
        },
      ],
    };
  } else {
    throw `the given plot id "${plotId}" is not defined`;
  }
  pdfMake.createPdf(docDefinition).download(fileName);
}
