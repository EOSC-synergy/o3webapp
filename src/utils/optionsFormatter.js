import { q25, q75, median, mean } from "../services/math/math"
import { IMPLICIT_YEAR_LIST, O3AS_REGIONS, O3AS_PLOTS, ALL_REGIONS_ORDERED, STATISTICAL_VALUES_LIST, SV_CALCULATION, SV_COLORING, STATISTICAL_VALUES, APEXCHART_PLOT_TYPE, MODEL_LINE_THICKNESS, START_YEAR, END_YEAR } from "./constants"

export const defaultTCO3_zm = {
    xaxis: {
        type: "numeric",
        //categories: [],
        min: START_YEAR,
        max: END_YEAR,
        decimalsInFloat: 0,
        labels: {
            rotate: 0
        } 
    },
    yaxis: {
        min: 200,
        max: 400,
        forceNiceScale: true,
        decimalsInFloat: 2
    }, 
    chart: {
        id: O3AS_PLOTS.tco3_zm,
        animations: {
            enabled: false,
            easing: "linear"
        },
        toolbar: {
            "show": true,
            offsetX: -60,
            offsetY: 10,
            "tools":{
                "download": true,
                pan: false
            }
        },
        zoom: {
            enabled: true,
            type: "xy",
        },
        width: "100%"
    },
    legend: {
        show: true, 
        onItemClick: {
            toggleDataSeries: false
        }
    },
    dataLabels: {
        enabled: false,
    },
    tooltip: {
        enabled: true,
        shared: false,
    },
    colors: null, //styling.colors
    stroke: {
        //curve: "smooth", Ask betreuer for this
        width: null, // styling.width,
        dashArray: null, //styling.dashArray,
    },
    title: {
        text: "OCTS Plot",
        align: "center",
        floating: false,
        style: {
            fontSize:  "30px",
            fontWeight:  "bold",
            fontFamily:  "undefined",
            color:  "#4350af"
        }
    },
};

export const default_TCO3_return = {
    chart: {
      id: O3AS_PLOTS.tco3_return,
      type: 'boxPlot',
      animations: {
          enabled: false, // disable animations
      },
      zoom: {
          enabled: false,
          type: 'xy',
      }
    },
    colors: [undefined], // , ...styling.colors
    title: {
        text: "Return/Recovery",
        align: "center",
        floating: false,
        style: {
            fontSize:  "30px",
            fontWeight:  "bold",
            fontFamily:  "undefined",
            color:  "#4350af"
        }
    },
    tooltip: {
      shared: false,
      intersect: true
    },
    plotOptions: {
      boxPlot: {
        colors: {
          upper: "#8def4e", //'#5C4742',
          lower: "#63badb", //'#A5978B'
        }
      }
    },
    legend: {
        show: true,
    },
    
    markers: {
      size: 5,
      colors: [undefined], // ...styling.colors
      strokeColors: '#000',
      strokeWidth: 0,
      strokeOpacity: 0.2, //?
      strokeDashArray: 0, //?
      fillOpacity: 0.7,
      discrete: [],
      //shape: [undefined, "circle", "square"], // circle or square
      radius: 1,
      offsetX: 0, // interesting
      offsetY: 0,
      //onClick: (event) => {alert("click")},
      onDblClick: undefined,
      showNullDataPoints: true,
      hover: {
          size: 10,
            sizeOffset: 10,
      },
    }
    
};




/**
 * Iterates through the x and y data returned from the api for the tco3_zm and fills the corresponding years with
 * either data points, if they are present or with `null`. The first index corresponds to START_YEAR
 * 
 * @param {array} xValues an array holding the years
 * @param {array} yValues an array of the same length holding the datapoints for the corresponding years
 */
export function normalizeArray(xValues, yValues) {
    const result = [];
    let currentValueIndex = 0;
    
    for (let year of IMPLICIT_YEAR_LIST) {
        if (xValues[currentValueIndex] === year) {
            result.push(yValues[currentValueIndex]);
            currentValueIndex++;
        } else {
            result.push(null);
        }
    }
    return result;
}

/**
 * This function is called only once when the data from the api is fetched. It transforms the data
 * into a format that (hopefully) speeds up the computation of certain things.
 * 
 * The TCO3_ZM data is transformed from a x and y array into one single array whose first index 
 * represents the START_YEAR (1959) and so on. It contains either data points or null.
 * x = ['1960', '1963', '1965', '1966']
 * y = [0, 1, 2, 3]
 * normalized: [null (1959), 0, null (1961), null (1962), 1, null (1964), 2, 3, null (1967), ...]
 * 
 * The TCO3_RETURN data is transformed from a x and y array into a lookup table with the given region:
 * 
 *   "x": [
 *     "Antarctic(Oct)",
 *     "SH mid-lat",
 *     "Tropics",
 *     "Arctic(Mar)",              {
 *     "Near global",               "Antarctic(Oct)": 2064,
 *     "Global",                    "SH mid-lat": 2051,
 *     "User region"                "Tropics": 2060,
 *   ],                     =>      "Tropics": 2041,
 *   "y": [                             ...
 *     2064,                       }
 *     2051,
 *     2060,
 *     2041,
 *     2040,
 *     2049,
 *     2052,
 *     2052
 *   ]
 * 
 * @param {string} obj.plotId a string specifying the plot (to perform different transformations, according to the data format)
 * @param {object} obj.data an object holding the data as it was returned from the api 
 * @returns 
 */
export const preTransformApiData = ({plotId, data}) => {
    if (plotId === O3AS_PLOTS.tco3_zm) {
        const lookUpTable = {};
        for (let datum of data) {
            // top structure
            lookUpTable[datum.model] = {
                plotStyle: datum.plotstyle,
                data: normalizeArray(datum.x, datum.y), // this should speed up the calculation of the statistical values later
            };
        }
        return lookUpTable;
    } else if (plotId === O3AS_PLOTS.tco3_return) { // old way of doing this
        const lookUpTable = {};
        for (let datum of data) {
            // top structure
            lookUpTable[datum.model] = {
                plotStyle: datum.plotstyle,
                data: {}
            };

            // fill data
            for (let index in datum.x) {
                lookUpTable[datum.model].data[datum.x[index]] = datum.y[index];
            }
        }
        return lookUpTable;
    };
}

/**
 * This method calculates the boxplot values for the tco3_return plot.
 * For each region an array of 5 values is calculated: min, q1, median, q3, max
 * which is sufficient to render the desired box plot.
 * 
 * @param {object} data contains the region data from the api
 * @returns object holding an array of 5 values (min, q1, median, q3, max) for each region
 */
function calculateBoxPlotValues({data, modelsSlice}) {
    const boxPlotHolder = {}
	for (let region of ALL_REGIONS_ORDERED) {
		boxPlotHolder[region] = []
	}

    for (const [id, groupData] of Object.entries(modelsSlice.modelGroups)) { // iterate over model groups
        if (!groupData.isVisible) continue; // skip hidden groups
        for (const [model, modelInfo] of Object.entries(groupData.models)) {
            if (!modelInfo.isVisible) continue; // skip hidden models
            for (const [region, year] of Object.entries(data[model].data)) {
                boxPlotHolder[region].push(year);
            }
        }
    }
    
    const boxPlotValues = {}
	for (let region of ALL_REGIONS_ORDERED) {
		boxPlotHolder[region].sort()
		const arr = boxPlotHolder[region]
		boxPlotValues[region] = []
		boxPlotValues[region].push(
			arr[0],
			q25(arr),
			median(arr),
			q75(arr),
			arr[arr.length - 1]
		)
	}
    return boxPlotValues
}

function create2dArray(i) {
    return Array.from(Array(i), () => []);
}

function isIncludedInSv(model, groupData, svType) {
    return groupData.models[model][svType];
}

function buildSvMatrixTco3Zm({modelList, data}) {
    const SERIES_LENGTH = data[modelList[0]].data.length; // grab length of first model, should all be same

    const matrix = create2dArray(SERIES_LENGTH); // for arr of matrix: mean(arr), etc.

    for (let i = 0; i < SERIES_LENGTH; ++i) {
        for (const model of modelList) {
            matrix[i].push(
                data[model].data[i] // add null anyway to remain index mapping (null is filtered out later)
            )
        }
    }
    return matrix;
}

function buildSvMatrixTco3Return({modelList, data}) {
    const matrix = create2dArray(ALL_REGIONS_ORDERED.length);

    //console.log(data);
    for (const index in ALL_REGIONS_ORDERED) {
        const region = ALL_REGIONS_ORDERED[index]; // iterate over regions
        for (const model of modelList) {
            matrix[index].push(
                data[model].data[region] || null
            )
        }
    }
    console.log(matrix);
    return matrix;
    
}

function calculateSvForModels(modelList, data, groupData, buildMatrix) { // pass group data
    // only mean at beginning

    const matrix = buildMatrix({modelList, data}); // function supplied by caller

    const svHolder = {};
    STATISTICAL_VALUES_LIST.forEach(
        sv => svHolder[sv] = [] // init with empty array
    )

    for (const arr of matrix) { // fill with calculated sv
        for (const sv of STATISTICAL_VALUES_LIST) {
            // filter out values from not included models or null values
            const filtered = arr.filter((value, idx) => value !== null && isIncludedInSv(modelList[idx], groupData, sv));
            const value = SV_CALCULATION[sv](filtered) || null; // null as default if NaN or undefined
            svHolder[sv].push(value);    
        };
    };

    svHolder["mean+std"] = [];
    svHolder["mean-std"] = [];
    for (let i = 0; i < svHolder[STATISTICAL_VALUES.mean].length; ++i) {
        svHolder["mean+std"].push(svHolder.mean[i] + svHolder.derivative[i]);
        svHolder["mean-std"].push(svHolder.mean[i] - svHolder.derivative[i]);
    }
    console.log(svHolder)
    return svHolder;
}

function generateSingleTco3ReturnSeries(name, svData) {
    const transformedData = ALL_REGIONS_ORDERED.map((region, index) => {
        return {
            x: region,
            y: svData[index],
        }
    })

    return {
        name: name,
        data: transformedData,
        type: "scatter", // make generic
    }
}

function generateSingleTco3ZmSeries(name, svData) {
    return {
        name: name,
        data: svData.map((e, idx) => [START_YEAR + idx, e]),
        type: "line",
    }
}

function buildStatisticalSeries({data, modelsSlice, buildMatrix, generateSingleSvSeries}) {
    const svSeries = {
        data: [],
        colors: [],
        width: [],
        dashArray: [],
    };
    
    const modelGroups = modelsSlice.modelGroups;
    for (const [id, groupData] of Object.entries(modelGroups)) {

        const svHolder = calculateSvForModels(Object.keys(groupData.models), data, groupData, buildMatrix);

        for (const [sv, svData] of Object.entries(svHolder)) {
            
            if (sv === STATISTICAL_VALUES.derivative
                || sv === STATISTICAL_VALUES.percentile) continue; // skip for now
            
 
            svSeries.data.push(generateSingleSvSeries(`${sv}(${groupData.name})`, svData));
            svSeries.colors.push(SV_COLORING[sv]);   // coloring?
            svSeries.width.push(1);                  // thicker?
            svSeries.dashArray.push(0);              // solid?       
        }
    }
    return svSeries;
}

function generateTco3_ZmSeries({data, modelsSlice}) {
    const series = {
        data: [],
        colors: [],
        width: [],
        dashArray: [],
    }

    for (const [id, groupData] of Object.entries(modelsSlice.modelGroups)) { // iterate over model groups
        if (!groupData.isVisible) continue; // skip hidden groups
        for (const [model, modelInfo] of Object.entries(groupData.models)) {
            if (!modelInfo.isVisible) continue; // skip hidden models
            const modelData = data[model]; // retrieve data (api)
            series.data.push({
                type: APEXCHART_PLOT_TYPE.tco3_zm,
                name: model,
                data: modelData.data.map((e, idx) => [START_YEAR + idx, e]),
            });
    
            series.colors.push(colorNameToHex(modelData.plotStyle.color));
            series.width.push(MODEL_LINE_THICKNESS);
            series.dashArray.push(convertToStrokeStyle(modelData.plotStyle.linestyle)); // default line thickness
        }
    }

    // generate SV!
    const svSeries = buildStatisticalSeries({
        data, 
        modelsSlice, 
        buildMatrix: buildSvMatrixTco3Zm, 
        generateSingleSvSeries: generateSingleTco3ZmSeries
    });
    
    return combineSeries(series, svSeries);
}

function combineSeries(series1, series2) {
    const newSeries = {};
    newSeries.data = [...series1.data, ...series2.data];
    newSeries.colors = [...series1.colors, ...series2.colors];
    newSeries.width = [...series1.width, ...series2.width];
    newSeries.dashArray = [...series1.dashArray, ...series2.dashArray];
    return newSeries;
}

function generateTco3_ReturnSeries({data, modelsSlice}) {
    const series = {
        data: [],
        colors: [],
        width: [],
        dashArray: [],
    }
    
    // 1. build boxplot
    const boxPlotValues = calculateBoxPlotValues({data, modelsSlice});
    series.data.push({
            name: 'box',
            type: 'boxPlot',

            data: ALL_REGIONS_ORDERED.map(region => ({
                x: region,
                y: boxPlotValues[region],
            })),
        }
    );


    // 2. build scatter plot

    for (const [id, groupData] of Object.entries(modelsSlice.modelGroups)) { // iterate over model groups
        if (!groupData.isVisible) continue; // skip hidden groups
        for (const [model, modelInfo] of Object.entries(groupData.models)) {
            const modelData = data[model];
            const sortedData = ALL_REGIONS_ORDERED.map(region => ({
                x: region,
                y: modelData.data[region] || null, // null as default if data is missing
            }));
            
            series.data.push({
                name: model,
                data: sortedData,
                type: "scatter",
            });
            series.colors.push(
                colorNameToHex(modelData.plotStyle.color)
            )
        }
    }   

    // 3. generate statistical values
    const svSeries = buildStatisticalSeries({
        data,
        modelsSlice,
        buildMatrix: buildSvMatrixTco3Return,
        generateSingleSvSeries: generateSingleTco3ReturnSeries
    });
    return combineSeries(series, svSeries);
}

const SERIES_GENERATION = {}; // Map plotId to corresponding generation function
SERIES_GENERATION[O3AS_PLOTS.tco3_zm] = generateTco3_ZmSeries;
SERIES_GENERATION[O3AS_PLOTS.tco3_return] = generateTco3_ReturnSeries;

export function generateSeries({plotId, data, modelsSlice}) {
    const series = SERIES_GENERATION[plotId]({data, modelsSlice}); // execute correct function based on mapping
    return {
        data: series.data, 
        styling: {
            colors: series.colors, 
            dashArray: series.dashArray, 
            width: series.width,
        }
    }; // return generated series with styling to pass to apexcharts chart
}

export function getOptions({plotId, styling, plotTitle}) {
    if (plotId === O3AS_PLOTS.tco3_zm) {
        const newOptions = Object.assign({}, defaultTCO3_zm);
        newOptions.xaxis.categories = IMPLICIT_YEAR_LIST;
        newOptions.colors = styling.colors;
        newOptions.stroke.width = styling.width;
        newOptions.stroke.dashArray = styling.dashArray;
        newOptions.title = Object.assign({}, newOptions.title); // this is necessary in order for apexcharts to update the title
        newOptions.title.text = plotTitle;
        return newOptions;

    } else if (plotId === O3AS_PLOTS.tco3_return) {
        const newOptions = Object.assign({}, default_TCO3_return);
        newOptions.colors.push(...styling.colors); // for the legend!
        newOptions.title = Object.assign({}, newOptions.title);  // this is necessary in order for apexcharts to update the title
        newOptions.title.text = plotTitle;
        //newOptions.markers.colors.push(...styling.colors);
        return newOptions;
    }    
};

export function colorNameToHex(color)
{
    const colors = {"aliceblue":"#f0f8ff","antiquewhite":"#faebd7","aqua":"#00ffff","aquamarine":"#7fffd4","azure":"#f0ffff",
    "beige":"#f5f5dc","bisque":"#ffe4c4","black":"#000000","blanchedalmond":"#ffebcd","blue":"#0000ff","blueviolet":"#8a2be2","brown":"#a52a2a","burlywood":"#deb887",
    "cadetblue":"#5f9ea0","chartreuse":"#7fff00","chocolate":"#d2691e","coral":"#ff7f50","cornflowerblue":"#6495ed","cornsilk":"#fff8dc","crimson":"#dc143c","cyan":"#00ffff",
    "darkblue":"#00008b","darkcyan":"#008b8b","darkgoldenrod":"#b8860b","darkgray":"#a9a9a9","darkgreen":"#006400","darkkhaki":"#bdb76b","darkmagenta":"#8b008b","darkolivegreen":"#556b2f",
    "darkorange":"#ff8c00","darkorchid":"#9932cc","darkred":"#8b0000","darksalmon":"#e9967a","darkseagreen":"#8fbc8f","darkslateblue":"#483d8b","darkslategray":"#2f4f4f","darkturquoise":"#00ced1",
    "darkviolet":"#9400d3","deeppink":"#ff1493","deepskyblue":"#00bfff","dimgray":"#696969","dodgerblue":"#1e90ff",
    "firebrick":"#b22222","floralwhite":"#fffaf0","forestgreen":"#228b22","fuchsia":"#ff00ff",
    "gainsboro":"#dcdcdc","ghostwhite":"#f8f8ff","gold":"#ffd700","goldenrod":"#daa520","gray":"#808080","green":"#008000","greenyellow":"#adff2f",
    "honeydew":"#f0fff0","hotpink":"#ff69b4",
    "indianred ":"#cd5c5c","indigo":"#4b0082","ivory":"#fffff0","khaki":"#f0e68c",
    "lavender":"#e6e6fa","lavenderblush":"#fff0f5","lawngreen":"#7cfc00","lemonchiffon":"#fffacd","lightblue":"#add8e6","lightcoral":"#f08080","lightcyan":"#e0ffff","lightgoldenrodyellow":"#fafad2",
    "lightgrey":"#d3d3d3","lightgreen":"#90ee90","lightpink":"#ffb6c1","lightsalmon":"#ffa07a","lightseagreen":"#20b2aa","lightskyblue":"#87cefa","lightslategray":"#778899","lightsteelblue":"#b0c4de",
    "lightyellow":"#ffffe0","lime":"#00ff00","limegreen":"#32cd32","linen":"#faf0e6",
    "magenta":"#ff00ff","maroon":"#800000","mediumaquamarine":"#66cdaa","mediumblue":"#0000cd","mediumorchid":"#ba55d3","mediumpurple":"#9370d8","mediumseagreen":"#3cb371","mediumslateblue":"#7b68ee",
    "mediumspringgreen":"#00fa9a","mediumturquoise":"#48d1cc","mediumvioletred":"#c71585","midnightblue":"#191970","mintcream":"#f5fffa","mistyrose":"#ffe4e1","moccasin":"#ffe4b5",
    "navajowhite":"#ffdead","navy":"#000080",
    "oldlace":"#fdf5e6","olive":"#808000","olivedrab":"#6b8e23","orange":"#ffa500","orangered":"#ff4500","orchid":"#da70d6",
    "palegoldenrod":"#eee8aa","palegreen":"#98fb98","paleturquoise":"#afeeee","palevioletred":"#d87093","papayawhip":"#ffefd5","peachpuff":"#ffdab9","peru":"#cd853f","pink":"#ffc0cb","plum":"#dda0dd","powderblue":"#b0e0e6","purple":"#800080",
    "rebeccapurple":"#663399","red":"#ff0000","rosybrown":"#bc8f8f","royalblue":"#4169e1",
    "saddlebrown":"#8b4513","salmon":"#fa8072","sandybrown":"#f4a460","seagreen":"#2e8b57","seashell":"#fff5ee","sienna":"#a0522d","silver":"#c0c0c0","skyblue":"#87ceeb","slateblue":"#6a5acd","slategray":"#708090","snow":"#fffafa","springgreen":"#00ff7f","steelblue":"#4682b4",
    "tan":"#d2b48c","teal":"#008080","thistle":"#d8bfd8","tomato":"#ff6347","turquoise":"#40e0d0",
    "violet":"#ee82ee",
    "wheat":"#f5deb3","white":"#ffffff","whitesmoke":"#f5f5f5",
    "yellow":"#ffff00","yellowgreen":"#9acd32"};

    if (typeof colors[color.toLowerCase()] != 'undefined')
        return colors[color.toLowerCase()];

    return false;
};

export function convertToStrokeStyle(apiStyle) {
    const styles = {
        "solid": 0,
        "dotted": 1,
        "dashed": 3,
    };

    if (typeof styles[apiStyle.toLowerCase()] != 'undefined')
        return styles[apiStyle.toLowerCase()];
    return false;
};