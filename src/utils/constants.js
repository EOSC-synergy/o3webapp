import {
    mean as calculateMean,
    std as calculateStd,
    median as calculateMedian,
    quantile as calculatePercentile, // TODO import actual percentile
} from "../services/math/math";

// index.js

/**
 * Stores the default model group.
 *
 * Modify this object to change the name or the models that appear when
 * the WebApp is initially loaded.
 * @constant {object}
 * @category Utils
 * @subcategory Constants
 */
export const DEFAULT_MODEL_GROUP = {
    groupId: null, // no valid id => add new group 
    groupName: "Example Group",
    modelList: [
        "CCMI-1_ACCESS_ACCESS-CCM-refC2",
        "CCMI-1_ACCESS_ACCESS-CCM-senC2fGHG",
        "CCMI-1_CCCma_CMAM-refC2"
    ]
};

// client.js
/** Stores the error message that is shown if no month is selected.
 * @constant {string}
 * @category Utils
 * @subcategory Constants
*/
export const NO_MONTH_SELECTED = "Invalid Selection: Selecting at least one month should make this error go away.";

// ReferenceSlice
export const DEFAULT_REF_MODEL = "SBUV_GSFC_merged-SAT-ozone";
export const DEFAULT_REF_YEAR = 1980;

// Section.js
/** Stores the name of the LatitudeBandSelector component as a Symbol.
 *  @constant {string}
 * @category Utils
 * @subcategory Constants
*/
export const LBS_Symbol = Symbol("LatitudeBandSelector");
/** Stores the name of the LocationSelector component as a Symbol.
 *  @constant {string}
 * @category Utils
 * @subcategory Constants
*/
export const LS_Symbol = Symbol("LocationSelector");
/** Stores the name of the ModelGroupConfigurator component as a Symbol.
 *  @constant {string}
 * @category Utils
 * @subcategory Constants
*/
export const MGC_Symbol = Symbol("ModelGroupConfigurator");
/** Stores the name of the OffsetConfigurator component as a Symbol.
 *  @constant {string}
 * @category Utils
 * @subcategory Constants
*/
export const OC_Symbol = Symbol("OffsetConfigurator");
/** Stores the name of the PlotNameField component as a Symbol.
 *  @constant {string}
 * @category Utils
 * @subcategory Constants
*/
export const PNF_Symbol = Symbol("PlotNameField");
/** Stores the name of the ReferenceModelSelector component as a Symbol.
 *  @constant {string}
 * @category Utils
 * @subcategory Constants
*/
export const RMS_Symbol = Symbol("ReferenceModelSelector");
/** Stores the name of the ReferenceYearField component as a Symbol.
 *  @constant {string}
 * @category Utils
 * @subcategory Constants
*/
export const RYF_Symbol = Symbol("ReferenceYearField");
/** Stores the name of the RegionSelector component as a Symbol.
 *  @constant {string}
 * @category Utils
 * @subcategory Constants
*/
export const RS_Symbol = Symbol("RegionSelector");
/** Stores the name of the TimeCheckBoxGroup component as a Symbol.
 *  @constant {string}
 * @category Utils
 * @subcategory Constants
*/
export const TCG_Symbol = Symbol("TimeCheckBoxGroup");
/** Stores the name of the XAxisField component as a Symbol.
 *  @constant {string}
 * @category Utils
 * @subcategory Constants
*/
export const XAF_Symbol = Symbol("XAxisField");
/** Stores the name of the YAxisField component as a Symbol.
 *  @constant {string}
 * @category Utils
 * @subcategory Constants
*/
export const YAF_Symbol = Symbol("YAxisField");
/** Stores the name of the CustomLatitudeSelector component as a Symbol.
 *  @constant {string}
 * @category Utils
 * @subcategory Constants
*/
export const CLS_Symbol = Symbol("CustomLatitudeSelector");

// TimeCheckboxGroup.js
/** Stores the season Winter and its corresponding months.
 *  @constant {object}
 * @memberof TimeCheckBoxGroup
*/
export const Winter = {name: Symbol("Winter"), months: [12, 1, 2], seasonId: 0}

/** Stores the season Spring and its corresponding months.
 * @constant {object}
 * @memberof TimeCheckBoxGroups
*/
export const Spring = {name: Symbol("Spring"), months: [3, 4, 5], seasonId: 1}

/** Stores the season Summer and its corresponding months.
 * @constant {object}
 * @memberof TimeCheckBoxGroup
*/
export const Summer = {name: Symbol("Summer"), months: [6, 7, 8], seasonId: 2}

/** Stores the season Autumn and its corresponding months.
 * @constant {object}
 * @memberof TimeCheckBoxGroup
*/
export const Autumn = {name: Symbol("Autumn"), months: [9, 10, 11], seasonId: 3}

/** Array containing all season indext with the corresponding seasonId
 * @constant {array}
 * @memberof TimeCheckBoxGroup
*/
export const SEASONS_ARRAY = [Winter, Spring, Summer, Autumn];

/** Stores all the months in short form. (first three letters)
 * @constant {array}
 * @category Utils
 * @subcategory Constants
*/
export const months = [
    Symbol("Jan"), Symbol("Feb"), Symbol("Mar"), Symbol("Apr"),
    Symbol("May"), Symbol("Jun"), Symbol("Jul"), Symbol("Aug"),
    Symbol("Sep"), Symbol("Oct"), Symbol("Nov"), Symbol("Dec")
]
/** Stores the amount of months in a season
 * @constant {number}
 * @category Utils
 * @subcategory Constants
*/
export const NUM_MONTHS_IN_SEASON = 3;

/** Stores the amount of months in a year
 * @constant {number}
 * @category Utils
 * @subcategory Constants
 */
export const NUM_MONTHS = 12;

/** These months are selected when the webapp starts
 * @constant {array}
 * @category Utils
 * @subcategory Constants
*/
export const DEFAULT_MONTHS = [1, 2, 12];

// LatitudeBandSelector.js
/** Stores the latitude bands and its min/max values
 * @constant {array}
 * @category Utils
 * @subcategory Constants
*/
export const latitudeBands = [
    {
        text: Symbol("Southern Hemisphere (SH) Polar (90–60°S)"),
        value: {minLat: -90, maxLat: -60}
    },
    {
        text: Symbol("SH Mid-Latitudes (60–35°S)"),
        value: {minLat: -60, maxLat: -35}
    },
    {
        text: Symbol("Tropics (20°S–20°N)"),
        value: {minLat: -20, maxLat: 20}
    },
    {
        text: Symbol("Northern Hemisphere (NH) Mid-Latitudes (35–60°N)"),
        value: {minLat: 35, maxLat: 60}
    },
    {
        text: Symbol("NH Polar (60–90°N)"),
        value: {minLat: 60, maxLat: 90}
    },
    {
        text: Symbol("Near-Global (60°S–60°N)"),
        value: {minLat: -60, maxLat: 60}
    },
    {
        text: Symbol("Global (90°S–90°N)"),
        value: {minLat: -90, maxLat: 90}
    },
    // !!! Custom must be last in array !!!
    {
        text: Symbol("Custom"),
        value: 'custom'
    },
]

export const LATITUDE_BAND_LIST = latitudeBands.map(obj => obj.text.description);

// DownloadModal.js
export const fileFormats = [
    Symbol("CSV"), Symbol("PDF"), Symbol("PNG"), Symbol("SVG")
];

// PlotNameField.js

/** The max. length of the plot name
 * @constant {number}
 * @category Utils
 * @subcategory Constants
*/
export const PLOT_NAME_MAX_LEN = 40;
/*
// GRAPH
*/

/**
 * An "enum" which stores the plot types as they come from the api.
 * @constant {object}
 * @category Utils
 * @subcategory Constants
 */
export const O3AS_PLOTS = { // used for internal testing or manual if-else
    tco3_zm: "tco3_zm",
    tco3_return: "tco3_return",
};

/**
 * Maps the plots provided by the api to their apexcharts plot type
 * @constant {object}
 * @category Utils
 * @subcategory Constants
 */
export const APEXCHART_PLOT_TYPE = {
    tco3_zm: "line",
    tco3_return: "boxPlot"
};

/**
 * How large the loading spinner should appear.
 * @constant {string}
 * @category Utils
 * @subcategory Constants
 */
export const HEIGHT_LOADING_SPINNER = "300px";
/**
 * How tall the graph should appear
 * @constant {string}
 * @category Utils
 * @subcategory Constants
 */
export const HEIGHT_GRAPH = `${window.innerHeight * 0.75}px`;

/*
// Options Formatter, XAxisField, YAxisField, apiSlice
*/
/**
 * The start year, no data is fetched for years before this point in time
 * @constant {number}
 * @category Utils
 * @subcategory Constants
 */
export const START_YEAR = 1960;
/**
 * The end year, no data is fetched for years after this point in time
 * @constant {number}
 * @category Utils
 * @subcategory Constants
 */
export const END_YEAR = 2100;
/**
 * This array provides a list from start to end year with each year as a string
 * @constant {array}
 * @category Utils
 * @subcategory Constants
 */
export const IMPLICIT_YEAR_LIST = [...Array(END_YEAR - START_YEAR + 1).keys()].map(number => `${START_YEAR + number}`);

// important for api data transformation
/** This string stores the description of the antarctic region
 * @constant {string}
 * @category Utils
 * @subcategory Constants
*/
const ANTARCTIC = "Antarctic(Oct)";
/** This string stores the description of the south hemisphere region
 * @constant {string}
 * @category Utils
 * @subcategory Constants
*/
const SH_MID = "SH mid-lat";
/** This string stores the description of the north hemisphere region
 * @constant {string}
 * @category Utils
 * @subcategory Constants
*/
const NH_MID = "NH mid-lat";
/** This string stores the description of the tropics region
 * @constant {string}
 * @category Utils
 * @subcategory Constants
*/
const TROPICS = "Tropics";
/** This string stores the description of the arctic region
 * @constant {string}
 * @category Utils
 * @subcategory Constants
*/
const ARCTIC = "Arctic(Mar)";
/** This string stores the description of the near global region
 * @constant {string}
 * @category Utils
 * @subcategory Constants
*/
const NEAR_GLOBAL = "Near global";
/** This string stores the description of the global region
 * @constant {string}
 * @category Utils
 * @subcategory Constants
*/
const GLOBAL = "Global";
/** This string stores the description of the user region
 * @constant {string}
 * @category Utils
 * @subcategory Constants
*/
export const USER_REGION = "User region";

export const O3AS_REGIONS = {
    ANTARCTIC,
    SH_MID,
    NH_MID,
    TROPICS,
    ARCTIC,
    NEAR_GLOBAL,
    GLOBAL,
    // user region must be last element
    USER_REGION
}

// user region must be last element
export const ALL_REGIONS_ORDERED = [ANTARCTIC, SH_MID, NH_MID, TROPICS, ARCTIC, NEAR_GLOBAL, GLOBAL, USER_REGION];

/**
 * The mean: this appears in the model group card and is used to identify its statistical value settings.
 * @constant {string}
 * @category Utils
 * @subcategory Constants
 */
export const mean = "mean";
/**
 * The standard deviation: this appears in the model group card and is used to identify its statistical value settings.
 * @constant {string}
 * @category Utils
 * @subcategory Constants
 */
export const std = "standard deviation";
/**
 * The median: this appears in the model group card and is used to identify its statistical value settings.
 * @category Utils
 * @subcategory Constants
 * @constant {string}
 */
export const median = "median";
/**
 * The percentile: this appears in the model group card and is used to identify its statistical value settings.
 * @constant {string}
 * @category Utils
 * @subcategory Constants
 */
export const percentile = "percentile";

/**
 * The statistical values that are computable are listed here as
 * an "enum"
 * @constant {object}
 * @category Utils
 * @subcategory Constants
 */
export const STATISTICAL_VALUES = {}
// populate object automatically with the values: 
// the order corresponds to the order in the interface
const asList = [mean, std, median, percentile];
asList.forEach(sv => STATISTICAL_VALUES[sv] = sv);

/**
 * Name for the helper statistical value series: This line is used to calculate the mean+/-std
 * @constant {string}
 * @category Utils
 * @subcategory Constants
 */
export const stdMean = "stdMean";
/**
 * The lower percentile ~15.87th
 * @constant {string}
 * @category Utils
 * @subcategory Constants
 */
export const lowerPercentile = "lowerPercentile";
/**
 * The lower percentile ~84.13th
 * @constant {string}
 * @category Utils
 * @subcategory Constants
 */
export const upperPercentile = "upperPercentile";
/*
 * Regarding the percentile (message from Tobias):
 *
 * It would be good if you could include the 84.13th and 15.87th percentiles
 * which corresponds +1σ standard dev of the Gaussian distribution.
 * A workflow to calculate the percentiles is described on the following
 * website for example:
 *
 * https://www.indeed.com/career-advice/career-development/how-to-calculate-percentile
*/

/**
 * This extended sv list is used in the calculation to handle some changes that
 * came up after the specification / design phase: standard deviation is not one
 * but TWO lines. Same goes for percentile which is lower- AND upper-percentile.
 * @constant {array}
 * @category Utils
 * @subcategory Constants
 */
export const EXTENDED_SV_LIST = [stdMean, lowerPercentile, upperPercentile];


/**
 * The same statistical values as a list to verify certain payload data.
 * @constant {array}
 * @category Utils
 * @subcategory Constants
 */
export const STATISTICAL_VALUES_LIST = Object.values(STATISTICAL_VALUES);


/**
 * This object maps each statistical value that should be calculated
 * to a corresponding function describing HOW it should be calculated.
 * @constant {object}
 * @category Utils
 * @subcategory Constants
 */
export const SV_CALCULATION = {
    mean: calculateMean,
    median: calculateMedian,
    percentile: calculatePercentile,
    stdMean: calculateMean, // mean for std+-
}
SV_CALCULATION[std] = calculateStd;
SV_CALCULATION[lowerPercentile] = arr => calculatePercentile(arr, .1587);
SV_CALCULATION[upperPercentile] = arr => calculatePercentile(arr, .8413);
SV_CALCULATION[stdMean] = calculateMean;

/**
 * This object maps each statistical value that should be calculated
 * to a color it should be appear in.
 * @constant {object}
 * @category Utils
 * @subcategory Constants
 */
export const SV_COLORING = {
    mean: "#696969",
    "standard deviation": "#0e4e78",//"#000",
    median: "#000",
    percentile: "#000",
    "lowerPercentile": "#1e8509",
    "upperPercentile": "#1e8509",
    "mean+std": "#0e4e78",
    "mean-std": "#0e4e78",
}

/**
 * This object maps each statistical value that should be calculated
 * to its line dashing allowing an easy customization if e.g. the
 * mean should be dashed too.
 *
 * The integer values correspond to the dashing format that is
 * expected by apexcharts.
 * @constant {object}
 * @category Utils
 * @subcategory Constants
 */
export const SV_DASHING = {
    mean: 0,
    median: 2,
    percentile: 0,
    "mean+std": 8,
    "mean-std": 8,
    "lowerPercentile": 4,
    "upperPercentile": 4,
}

/**
 * This object maps each statistical value to its corresponding name that 
 * should be displayed in the legend of the plot and inside the tooltip when
 * hovering over a datapoint.
 */
export const SV_DISPLAY_NAME = {
    mean: "Mean",
    median: "Median",
    percentile: "Percentile",
    "mean+std": "μ + σ",
    "mean-std": "μ - σ",
    "lowerPercentile": "Lower %",
    "upperPercentile": "Upper %",

}

/**
 * This parameter specifies how thick the line of plotted models should appear.
 * @constant {number}
 * @category Utils
 * @subcategory Constants
 */
export const MODEL_LINE_THICKNESS = 2;
/**
 * This parameter specifies how thick the line of plotted statistical values should appear.
 * @constant {number}
 * @category Utils
 * @subcategory Constants
 */
export const STATISTICAL_VALUE_LINE_THICKNESS = 2;

/**
 * the Legal Notice links which will be parsed into the PDF.
 * @constant {array}
 * @category Utils
 * @subcategory Constants
 */
export const legalNoticeLinks = [
    "Terms of Use Link: https://o3as.data.kit.edu/policies/terms-of-use.html",
    "Privacy Policy Link: https://o3as.data.kit.edu/policies/privacy-policy.html",
    "How to Acknowledge Link: https://o3as.data.kit.edu/policies/how-to-acknowledge.html",
];
// Custom Latitude Selector

/**
 * The smallest possible latitude value.
 * @constant {number}
 * @category Utils
 * @subcategory Constants
 */
export const LATITUDE_BAND_MAX_VALUE = 90;

/**
 * The biggest possible latitude value.
 * @constant {number}
 * @category Utils
 * @subcategory Constants
 */
export const LATITUDE_BAND_MIN_VALUE = -90;


/**´
 * The default color of the backgrounds (Navbar, Footer, Sidebar, ...)
 * @constant {string}
 */
export const BACKGROUND_BASE_COLOR = '#111';
