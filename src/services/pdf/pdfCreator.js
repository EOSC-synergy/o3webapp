import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { O3AS_PLOTS } from "../../utils/constants";

pdfMake.vfs = pdfFonts.pdfMake.vfs;

const legalNoticeLink = [
  "Terms of Use Link: https://o3as.data.kit.edu/policies/terms-of-use.html",
  "Privacy Policy Link: https://o3as.data.kit.edu/policies/privacy-policy.html",
  "How to Acknowledge Link: https://o3as.data.kit.edu/policies/how-to-acknowledge.html",
];

export async function getBase64Image() {
  return new Promise((resolve, reject) => {
    const svgElement = document.querySelector(".apexcharts-svg");
    var s = new XMLSerializer();
    var str = s.serializeToString(svgElement);
    resolve(str);
  });
}

function getAdjustedSVG(svg) {

  let bBox = svg.getBBox();
  let viewBoxParameters = "0 0 " + bBox.width + " " + bBox.height;
  svg.setAttribute("viewBox", viewBoxParameters); 
  console.log(svg);
  return svg.outerHTML;
}

export async function downloadGraphAsPDF(plotId, fileName) {
    
  const svgElement = document.querySelector(".apexcharts-svg");
  let docDefinition = null;

  if (plotId === O3AS_PLOTS.tco3_zm || plotId === O3AS_PLOTS.tco3_return) {
    docDefinition = {
      info: {
        title: fileName,
      },

      pageOrientation: "landscape",
      //pageMargins: [ 40, 180, 40, 60 ],
      content: [
        {
          svg: getAdjustedSVG(svgElement),
          fit: [770, 350],
        },
        '\n',
        '\n',
        '\n',
        {
          text: "List of used models:",
          fontSize: 14,
        },
        '\n',
        {
          // ul: models
        },
        '\n',
        '\n',
        '\n',
        {
          fontSize: 11,
          ul: legalNoticeLink,
        }
      ],
    };
  } else {
    throw `the given plot id "${plotId}" is not defined`;
  }
  pdfMake.createPdf(docDefinition).download(fileName);
}

export default function createPdf() {}
