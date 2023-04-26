import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { O3AS_PLOTS } from 'utils/constants';
import { ModelGroup, ModelId } from 'store/modelsSlice';
import { ProcessedO3Data } from 'services/API/apiSlice';
import { Content } from 'pdfmake/interfaces';

/**
 * This module handles all functions to create a pdf that can be downloaded from the site.
 * Downloading Pdf is not as trivial as downloading other formats, since Apex Charts does not
 * provide a native function to support pdf download. Moreover, extra legal information is appended
 * to the pdf, which is not appended to the other supported downloadable datatypes.
 *
 * @module PdfCreator
 * @see {@link module:DownloadNotPdf} for all other format downloads
 */ // used for auto generation of JSDocs with better-docs

/** The Legal Notice links which will be parsed into the PDF. */
const legalNoticeLinks = [
    'Terms of Use Link: https://o3as.data.kit.edu/policies/terms-of-use.html',
    'Privacy Policy Link: https://o3as.data.kit.edu/policies/privacy-policy.html',
    'How to Acknowledge Link: https://o3as.data.kit.edu/policies/how-to-acknowledge.html',
];

pdfMake.vfs = pdfFonts.pdfMake.vfs;

pdfMake.fonts = {
    Roboto: {
        normal: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Regular.ttf',
        bold: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Medium.ttf',
        italics:
            'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Italic.ttf',
        bolditalics:
            'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-MediumItalic.ttf',
    },

    JetBrainsFont: {
        normal: 'https://fonts.cdnfonts.com/s/36131/JetbrainsMonoExtrabold-ywLd5.woff',
        bold: 'https://fonts.cdnfonts.com/s/36131/JetbrainsMonoExtrabold-ywLd5.woff',
        italics: 'https://fonts.cdnfonts.com/s/36131/JetbrainsMonoExtrabold-ywLd5.woff',
        bolditalics: 'https://fonts.cdnfonts.com/s/36131/JetbrainsMonoExtrabold-ywLd5.woff',
    },
};

/**
 * Returns a Line presentation for the PDF concerning to the current line data.
 *
 * @param currentData The current Model data contains the properties of the models(color, line
 *   style, etc.)
 * @param model The model name which the Line presentation belongs to
 * @returns The Line Presentation which will be shown in the PDF.
 */
const getLinePresentation = (currentData: ProcessedO3Data, model: string) => {
    let linePattern = '';
    if (currentData[model].plotStyle?.linestyle === 'solid') {
        linePattern = `────`;
    } else if (currentData[model].plotStyle?.linestyle === 'dashed') {
        linePattern = `----`;
    } else if (currentData[model].plotStyle?.linestyle === 'dotted') {
        linePattern = `••••`;
    }

    return {
        text: linePattern,
        font: 'JetBrainsFont',
        fontSize: 10,
        characterSpacing: 0,
        border: [false, false, false, false],
        color: `${currentData[model].plotStyle?.color}`,
    };
};

/**
 * This Method adjusts the svg element in order to scale it right in the pdf file. the viewBox
 * parameter of the svg element will be set to the width and height values of the svg element. visit
 * the following website for more details about the viewBox parameter:
 * {@link https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/viewBox}
 *
 * @param svgElement SvgElement element.
 * @returns Returns the adjusted svg element.
 */
const getAdjustedSVG = (svgElement: SVGGraphicsElement) => {
    const clone = svgElement.cloneNode(true) as SVGGraphicsElement;
    clone.setAttribute(
        'viewBox',
        `0 0 ${svgElement.getAttribute('width')} ${svgElement.getAttribute('height')}`
    );
    return clone.outerHTML;
};

/**
 * Downloads the PDF which contains the Graph in SVG format and contains the List of models.
 *
 * @async
 * @param plotId The plot id of the graph (tco3_zm, tco3_return etc.)
 * @param fileName The File name of the PDF
 * @param modelGroups The Model Groups which contains the names of the models
 * @param currentData The current Model data contains the properties of the models (color, line
 *   style, etc.)
 * @throws An Error if the given plotId is not supported. For available plot types check
 *   {@link O3AS_PLOTS}.
 */
export const downloadGraphAsPDF = async (
    plotId: O3AS_PLOTS,
    fileName: string,
    modelGroups: Record<ModelId, ModelGroup>,
    currentData: ProcessedO3Data
) => {
    const modelGroupsList = getListOfModelsForPdf(plotId, modelGroups, currentData);

    const svgElement = document.querySelector(
        '.apexcharts-svg'
    ) satisfies SVGGraphicsElement | null;
    if (svgElement === null) {
        throw new Error('could not find ApexCharts svg element');
    }

    if (plotId === O3AS_PLOTS.tco3_zm || plotId === O3AS_PLOTS.tco3_return) {
        pdfMake
            .createPdf({
                info: {
                    title: fileName,
                },
                content: [
                    {
                        svg: getAdjustedSVG(svgElement),
                        //svg: svgElement.outerHTML,
                        fit: [500, 250], // ?
                        margin: 10,
                    },
                    {
                        text: 'List Of Used Models:',
                        style: 'header',
                        fontSize: 10,
                        bold: true,
                    },
                    '\n',
                    {
                        fontSize: 9,
                        ol: modelGroupsList,
                    },
                    {
                        fontSize: 9,
                        ul: legalNoticeLinks,
                        pageBreak: 'before',
                        bold: true,
                    },
                ],
            })
            .download(fileName);
    } else {
        throw new Error(`the given plot id "${plotId}" is not defined`);
    }
};

/**
 * Returns the List of models in the format which the pdfMake library accepts.
 *
 * @param plotId The plot id of the graph (tco3_zm, tco3_return etc.)
 * @param modelGroups The Model Groups which contains the names of the models
 * @param currentData The current Model data contains the properties of the models(color, line
 *   style, etc.)
 * @returns The List of all Model Groups which will be shown at the PDF.
 */
const getListOfModelsForPdf = (
    plotId: O3AS_PLOTS,
    modelGroups: Record<ModelId, ModelGroup>,
    currentData: ProcessedO3Data
) => {
    const modelGroupsList: Content = [
        [{ text: '', style: 'header' }, { ul: [{ text: '', color: 'red' }] }],
    ];

    for (const modelGroup of Object.values(modelGroups)) {
        // if the model group is invisible, it won't be shown in the PDF.
        if (!modelGroup.isVisible) {
            continue;
        }

        const modelsInTheGroup = [];

        for (const [model, modelData] of Object.entries(modelGroup.models)) {
            // if the model is invisible, it won't be shown in the PDF.
            if (!modelData.isVisible) {
                continue;
            }

            // if the data of the model is undefined, it won't be shown in the PDF.
            if (typeof currentData[model] === 'undefined') {
                continue;
            }

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
                style: 'header',
                bold: true,
                fontSize: 10,
            },
            {
                table: {
                    widths: ['auto', 'auto'],
                    body: modelsInTheGroup,
                },
            },
        ]);
    }

    modelGroupsList.shift();

    return modelGroupsList;
};
