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
    console.log(str);
    resolve(str);
  });
}

function addViewbox(str) {
  console.log(str);
  const lastIndex = str.indexOf("height") + 10;
  const offset = str.substring(lastIndex).indexOf('"');
  const insertAt = offset + lastIndex + 2;

  return (
    str.substring(0, insertAt) +
    `viewBox="0 0 2047 500" ` +
    str.substring(insertAt)
  );
}

export async function downloadGraphAsPDF(plotId, fileName) {
  //const svgAsBase64 = await getBase64Image();
    
  const svgElement = document.querySelector(".apexcharts-svg");
  const svgAsBase64 =
    "data:image/svg+xml;charset=utf-8," +
    encodeURIComponent(svgElement.outerHTML);

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
          svg: addViewbox(svgAsBase64),
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
