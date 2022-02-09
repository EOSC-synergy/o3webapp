import {
    mean as calculateMean,
    median as calculateMedian,
    std as calculateStd,
    q25 as calculatePercentile, // TODO import actual percentile
} from "../services/math/math";

// apiSlice
/** For reducing loading time while implementing: starting value for how many models should be fetched */
export const modelListBegin = 0;
/** For reducing loading time while implementing: starting value for how many models should be fetched */
export const modelListEnd = 10;

// ReferenceSlice
export const DEFAULT_REF_MODEL = "SBUV_GSFC_merged-SAT-ozone";
export const DEFAULT_REF_YEAR = 1980;

// Section.js
/** Stores the name of the LatitudeBandSelector component as a Symbol. */
export const LBS_Symbol = Symbol("LatitudeBandSelector");
/** Stores the name of the LocationSelector component as a Symbol. */
export const LS_Symbol = Symbol("LocationSelector");
/** Stores the name of the ModelGroupConfigurator component as a Symbol. */
export const MGC_Symbol = Symbol("ModelGroupConfigurator");
/** Stores the name of the OffsetConfigurator component as a Symbol. */
export const OC_Symbol = Symbol("OffsetConfigurator");
/** Stores the name of the PlotNameField component as a Symbol. */
export const PNF_Symbol = Symbol("PlotNameField");
/** Stores the name of the ReferenceModelSelector component as a Symbol. */
export const RMS_Symbol = Symbol("ReferenceModelSelector");
/** Stores the name of the ReferenceYearField component as a Symbol. */
export const RYF_Symbol = Symbol("ReferenceYearField");
/** Stores the name of the RegionSelector component as a Symbol. */
export const RS_Symbol = Symbol("RegionSelector");
/** Stores the name of the TimeCheckBoxGroup component as a Symbol. */
export const TCG_Symbol = Symbol("TimeCheckBoxGroup");
/** Stores the name of the XAxisField component as a Symbol. */
export const XAF_Symbol = Symbol("XAxisField");
/** Stores the name of the YAxisField component as a Symbol. */
export const YAF_Symbol = Symbol("YAxisField");
/** Stores the name of the CustomLatitudeSelector component as a Symbol. */
export const CLS_Symbol = Symbol("CustomLatitudeSelector");

// TimeCheckboxGroup.js
/** Stores the season Winter and its corresponding months. */
export const Winter = {name: Symbol("Winter"), months: [1, 2, 3], seasonId: 0}

/** Stores the season Spring and its corresponding months. */
export const Spring = {name: Symbol("Spring"), months: [4, 5, 6], seasonId: 1}

/** Stores the season Summer and its corresponding months. */
export const Summer = {name: Symbol("Summer"), months: [7, 8, 9], seasonId: 2}

/** Stores the season Autumn and its corresponding months. */
export const Autumn = {name: Symbol("Autumn"), months: [10, 11, 12], seasonId: 3}

/** Stores all the months in short form. (first three letters) */
export const months = [
    Symbol("Jan"), Symbol("Feb"), Symbol("Mar"), Symbol("Apr"),
    Symbol("May"), Symbol("Jun"), Symbol("Jul"), Symbol("Aug"),
    Symbol("Sep"), Symbol("Oct"), Symbol("Nov"), Symbol("Dec")
]
/** Stores the ammount of months in a season */
export const NUM_MONTHS_IN_SEASON = 3;

/** Stores the ammount of months in a year */
export const NUM_MONTHS = 12;

// LatitudeBandSelector.js
/** Stores the latitude bands and its min/max values */
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
export const fileFormats = [Symbol("pdf"), Symbol("png")];

// PlotNameField.js

/** The max. length of the plot name */
export const PLOT_NAME_MAX_LEN = 40;
/*
// GRAPH
*/

export const O3AS_PLOTS = { // used for internal testing or manual if-else
    tco3_zm: "tco3_zm",
    tco3_return: "tco3_return",
};

export const APEXCHART_PLOT_TYPE = {
    tco3_zm: "line",
    tco3_return: "boxPlot"
};

export const HEIGHT_LOADING_SPINNER = "300px";
export const HEIGHT_GRAPH = `${window.innerHeight * 0.75}px`;

/*
// Options Formatter, XAxisField, YAxisField, apiSlice
*/
export const START_YEAR = 1960;
export const END_YEAR = 2100;
// year list: 1959 - 2100
export const IMPLICIT_YEAR_LIST = [...Array(END_YEAR - START_YEAR + 1).keys()].map(number => `${START_YEAR + number}`);

// important for api data transformation
const ANTARCTIC = "Antarctic(Oct)";
const SH_MID = "SH mid-lat";
const NH_MID = "NH mid-lat";
const TROPICS = "Tropics";
const ARCTIC = "Arctic(Mar)";
const NEAR_GLOBAL = "Near global";
const GLOBAL = "Global";
const USER_REGION = "User region";
export const O3AS_REGIONS = {
    ANTARCTIC,
    SH_MID,
    NH_MID,
    TROPICS,
    ARCTIC,
    NEAR_GLOBAL,
    GLOBAL,
    USER_REGION
}
export const ALL_REGIONS_ORDERED = [ANTARCTIC, SH_MID, NH_MID, TROPICS, ARCTIC, NEAR_GLOBAL, GLOBAL, USER_REGION];


const mean = "mean";
const median = "median";
const derivative = "derivative";
const percentile = "percentile";
/**
 * The statistical values that are computable are listed here as
 * an "enum"
 */
export const STATISTICAL_VALUES = {
    mean,
    median,
    derivative,
    percentile,
}

/**
 * The same statistical values as a list to verify certain payload data
 */
export const STATISTICAL_VALUES_LIST = Object.values(STATISTICAL_VALUES);


export const SV_CALCULATION = {
    mean: calculateMean,
    median: calculateMedian,
    derivative: calculateStd,
    percentile: calculatePercentile,
    stdMean: calculateMean, // mean for std+-
}

export const SV_COLORING = {
    mean: "#000",
    median: "#000",
    derivative: "#000",
    percentile: "#000",
    "mean+std": "#000",
    "mean-std": "#000",
}

export const SV_DASHING = {
    mean: 0,
    median: 2,
    percentile: 0,
    "mean+std": 8,
    "mean-std": 8,
}

export const MODEL_LINE_THICKNESS = 2;

// Custom Latitude Selector

/**
 * The smallest possible latitude value .
 */
export const LATITUDE_BAND_MAX_VALUE = 90;

/**
  * The biggest possible latitude value.
  */
export const LATITUDE_BAND_MIN_VALUE = -90;

