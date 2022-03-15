import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import {O3AS_PLOTS} from "../../../utils/constants";

/** 
 * This module handles all functions to create a pdf that can be downloaded from the site.
 * Downloading Pdf is not as trivial as downloading other formats, since Apex Charts does not provide a native function to support pdf download.
 * Moreover, extra legal information is appended to the pdf, which is not appended to the other supported downloadable datatypes.
 * 
 * @see {@link module:DownloadNotPdf} for all other format downloads
 * @module PdfCreator 
 * */ // used for auto generation of JSDocs with better-docs

/**
 * the Legal Notice links which will be parsed into the PDF.
 * @constant {Array}
 * @default 
    [ "Terms of Use Link: https://o3as.data.kit.edu/policies/terms-of-use.html",
    "Privacy Policy Link: https://o3as.data.kit.edu/policies/privacy-policy.html",
    "How to Acknowledge Link: https://o3as.data.kit.edu/policies/how-to-acknowledge.html"]
 */
const legalNoticeLinks = [
    "Terms of Use Link: https://o3as.data.kit.edu/policies/terms-of-use.html",
    "Privacy Policy Link: https://o3as.data.kit.edu/policies/privacy-policy.html",
    "How to Acknowledge Link: https://o3as.data.kit.edu/policies/how-to-acknowledge.html",
];

pdfMake.vfs = pdfFonts.pdfMake.vfs;

pdfMake.fonts = {

    Roboto: {
        normal: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Regular.ttf',
        bold: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Medium.ttf',
        italics: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Italic.ttf',
        bolditalics: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-MediumItalic.ttf'
    },


    JetBrainsFont: {
        normal: 'https://fonts.cdnfonts.com/s/36131/JetbrainsMonoExtrabold-ywLd5.woff',
        bold: 'https://fonts.cdnfonts.com/s/36131/JetbrainsMonoExtrabold-ywLd5.woff',
        italics: 'https://fonts.cdnfonts.com/s/36131/JetbrainsMonoExtrabold-ywLd5.woff',
        bolditalics: 'https://fonts.cdnfonts.com/s/36131/JetbrainsMonoExtrabold-ywLd5.woff'
    },
}

/**
 * Returns a Line presentation for the PDF concerning to the current line data.
 * @param {Array} currentData the current Model data contains the properties of the models(color, line style, etc.)
 * @param {String} model the model name which the Line presentation belongs to
 * @returns {Object} the Line Presentation which will be shown in the PDF.
 */
function getLinePresentation(currentData, model) {

    let linePattern = "";
    console.log(currentData[model].plotStyle.linestyle);
    if (currentData[model].plotStyle.linestyle === 'solid') {
        linePattern = `────`
    } else if (currentData[model].plotStyle.linestyle === 'dashed') {
        linePattern = `----`
    } else if (currentData[model].plotStyle.linestyle === 'dotted') {
        linePattern = `••••`
    }

    return {
        text: linePattern,
        font: 'JetBrainsFont',
        fontSize: 10,
        characterSpacing: 0,
        border: [false, false, false, false],
        color: `${currentData[model].plotStyle.color}`
    }
}


/**
 * This Method adjusts the svg element in order to scale it right in the pdf file.
 * the viewBox parameter of the svg element will be set to the width and height
 * values of the svg element.
 * visit the following website for more details about the viewBox parameter:
 * {@link https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/viewBox}
 *
 * @param {svg} svgElement svgElement element.
 * @returns returns the adjusted svg element.
 */
function getAdjustedSVG(svgElement) {
    let bBox = svgElement.getBBox();
    let viewBoxParameters = "0 0 " + bBox.width + " " + bBox.height;
    let clone = svgElement.cloneNode(true);
    clone.setAttribute("viewBox", viewBoxParameters);
    return clone.outerHTML;
}

/**
 * Downloads the PDF which contains the Graph in SVG format and contains the List of models.
 *
 * @param {string} plotId the plot id of the graph (tco3_zm, tco3_return etc.)
 * @param {string} fileName the File name of the PDF
 * @param {array} modelGroups the Model Groups which contains the names of the models
 * @param {array} currentData the current Model data contains the properties of the models (color, line style, etc.)
 * @async
 * @throws an Error if the given plotId is not supported. For available plot types check {@link O3AS_PLOTS}.
 */
export async function downloadGraphAsPDF(
    plotId,
    fileName,
    modelGroups,
    currentData
) {
    let modelGroupsList = getListOfModelsForPdf(plotId, modelGroups, currentData);

    const svgElement = document.querySelector(".apexcharts-svg")

    let docDefinition = null;

    if (plotId === O3AS_PLOTS.tco3_zm || plotId === O3AS_PLOTS.tco3_return) {
        docDefinition = {
            info: {
                title: fileName,
            },
            content: [
                {
                    svg: getAdjustedSVG(svgElement),
                    fit: [500, 250],
                    margin: 10
                },
                {
                    text: "List Of Used Models:",
                    style: "header",
                    fontSize: 10,
                    bold: true,

                },
                "\n",
                {
                    fontSize: 9,
                    ol: modelGroupsList,
                },
                {
                    fontSize: 9,
                    ul: legalNoticeLinks,
                    pageBreak: "before",
                    bold: true,
                },
            ],
        };
    } else {
        throw new Error(`the given plot id "${plotId}" is not defined`);
    }
    pdfMake.createPdf(docDefinition).download(fileName);
}


/**
 * Returns the List of models in the format which the pdfMake library accepts.
 *
 * @param {string} plotId the plot id of the graph (tco3_zm, tco3_return etc.)
 * @param {array} modelGroups the Model Groups which contains the names of the models
 * @param {array} currentData the current Model data contains the properties of the models(color, line style, etc.)
 * @return {object} the List of all Model Groups which will be shown at the PDF.
 */
function getListOfModelsForPdf(plotId, modelGroups, currentData) {
    let modelGroupsList = [
        [{text: "", style: "header"}, {ul: [{text: "", color: "red"}]}],
    ];

    for (const modelGroup of Object.values(modelGroups)) {

        // if the model group is invisible, it won't be shown in the PDF.
        if (!modelGroup.isVisible) continue;


        let modelsInTheGroup = [];

        for (const [model, modelData] of Object.entries(modelGroup.models)) {

            // if the model is invisible, it won't be shown in the PDF.
            if (!modelData.isVisible) continue;

            // if the data of the model is undefined, it won't be shown in the PDF.
            if (typeof currentData[model] === "undefined") continue;

            let textOfCurrentLineOfList;

            if (plotId === O3AS_PLOTS.tco3_zm) {
                textOfCurrentLineOfList = `${model}`;
            } else if (plotId === O3AS_PLOTS.tco3_return) {
                textOfCurrentLineOfList = `${model}`;
            }

            modelsInTheGroup.push([

                getLinePresentation(currentData, model),

                {
                    text: textOfCurrentLineOfList,
                    fontSize: 9,
                    border: [false, false, false, false],
                },

            ]);
        }
        modelGroupsList.push([
            {
                text: modelGroup.name,
                style: "header",
                bold: true,
                fontSize: 10,
            },
            {
                table: {
                    widths: ['auto', 'auto'],
                    body: modelsInTheGroup
                }
            },
        ]);
    }

    modelGroupsList.shift();

    return modelGroupsList;
}
