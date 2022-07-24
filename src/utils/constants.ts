/**
 * A module defining all constants that are shared between different components.
 * It contains default values and settings for those components.
 *
 * @module Constants */ // used for auto generation of JSDocs with better-docs

/**
 * Stores the default model group.
 *
 * Modify this object to change the name or the models that appear when
 * the WebApp is initially loaded.
 * @category Utils
 */
export const DEFAULT_MODEL_GROUP = {
    groupId: undefined, // no valid id => add new group
    groupName: 'Example Group',
    modelList: [
        'CCMI-1_ACCESS_ACCESS-CCM-refC2',
        'CCMI-1_ACCESS_ACCESS-CCM-senC2fGHG',
        'CCMI-1_CCCma_CMAM-refC2',
    ],
};

/** Stores the error message that is shown if no month is selected.
 * @category Utils
 */
export const NO_MONTH_SELECTED =
    'Invalid Selection: Selecting at least one month should make this error go away.';

/** Stores all the months in short form. (first three letters)
 * @category Utils
 */
export const months = [
    Symbol('Jan'),
    Symbol('Feb'),
    Symbol('Mar'),
    Symbol('Apr'),
    Symbol('May'),
    Symbol('Jun'),
    Symbol('Jul'),
    Symbol('Aug'),
    Symbol('Sep'),
    Symbol('Oct'),
    Symbol('Nov'),
    Symbol('Dec'),
];

/** Stores the amount of months in a season
 * @category Utils
 */
export const NUM_MONTHS_IN_SEASON = 3;

/** Stores the amount of months in a year
 * @category Utils
 */
export const NUM_MONTHS = 12;

export type Latitude = {
    minLat: number;
    maxLat: number;
};

export type LatitudeBand = {
    text: symbol;
    value: Latitude;
};

/** Stores the latitude bands and its min/max values
 * @category Utils
 */
export const latitudeBands: LatitudeBand[] = [
    {
        text: Symbol('Southern Hemisphere (SH) Polar (90–60°S)'),
        value: { minLat: -90, maxLat: -60 },
    },
    {
        text: Symbol('SH Mid-Latitudes (60–35°S)'),
        value: { minLat: -60, maxLat: -35 },
    },
    {
        text: Symbol('Tropics (20°S–20°N)'),
        value: { minLat: -20, maxLat: 20 },
    },
    {
        text: Symbol('Northern Hemisphere (NH) Mid-Latitudes (35–60°N)'),
        value: { minLat: 35, maxLat: 60 },
    },
    {
        text: Symbol('NH Polar (60–90°N)'),
        value: { minLat: 60, maxLat: 90 },
    },
    {
        text: Symbol('Near-Global (60°S–60°N)'),
        value: { minLat: -60, maxLat: 60 },
    },
    {
        text: Symbol('Global (90°S–90°N)'),
        value: { minLat: -90, maxLat: 90 },
    },
    // !!! Custom must be last in array !!!
    {
        text: Symbol('Custom'),
        // ts-expect-error TODO: figure out this
        value: 'custom' as unknown as Latitude,
    },
];

/**
 * An "enum" which stores the plot types as they come from the api.
 * @constant {object}
 */
export const O3AS_PLOTS = {
    // used for internal testing or manual if-else
    tco3_zm: 'tco3_zm',
    tco3_return: 'tco3_return',
} as const;
export type O3AS_PLOTS = typeof O3AS_PLOTS[keyof typeof O3AS_PLOTS];

/**
 * The start year, no data is fetched for years before this point in time
 * @category Utils
 */
export const START_YEAR = 1960;

/**
 * The end year, no data is fetched for years after this point in time
 * @category Utils
 */
export const END_YEAR = 2100;

// important for api data transformation
/** This String stores the description of the antarctic region
 * @category Utils
 */
const SH_POLAR = 'SH Polar';

/** This string stores the description of the south hemisphere region
 * @category Utils
 */
const SH_MID = 'SH mid-lat';

/** This string stores the description of the tropics region
 * @category Utils
 */
const TROPICS = 'Tropics';

/** This string stores the description of the north hemisphere region
 * @category Utils
 */
const NH_MID = 'NH mid-lat';

/** This string stores the description of the arctic region
 * @category Utils
 */
const NH_POLAR = 'NH Polar';

/** This string stores the description of the near global region
 * @category Utils
 */
const NEAR_GLOBAL = 'Near global';

/** This string stores the description of the global region
 * @category Utils
 */
const GLOBAL = 'Global';

/** This string stores the description of the user region
 * @category Utils
 */
export const USER_REGION = 'User region';

// user region must be last element
export const ALL_REGIONS_ORDERED = [
    SH_POLAR,
    SH_MID,
    TROPICS,
    NH_MID,
    NH_POLAR,
    NEAR_GLOBAL,
    GLOBAL,
    USER_REGION,
];

/**
 * The mean: this appears in the model group card and is used to identify its statistical value settings.
 * @category Utils
 */
export const mean = 'mean';
/**
 * The standard deviation: this appears in the model group card and is used to identify its statistical value settings.
 * @category Utils
 */
export const std = 'standard deviation';
/**
 * The median: this appears in the model group card and is used to identify its statistical value settings.
 * @category Utils
 */
export const median = 'median';
/**
 * The percentile: this appears in the model group card and is used to identify its statistical value settings.
 * @category Utils
 */
export const percentile = 'percentile';

/**
 * The statistical values that are computable are listed here as
 * an "enum"
 * @category Utils
 */
export const STATISTICAL_VALUES = {
    [mean]: mean,
    [std]: std,
    [median]: median,
    [percentile]: percentile,
} as const;
export type STATISTICAL_VALUES = typeof STATISTICAL_VALUES[keyof typeof STATISTICAL_VALUES];

/**
 * Name for the helper statistical value series: This line is used to calculate the mean+/-std
 * @category Utils
 */
export const stdMean = 'stdMean';

/**
 * The lower percentile ~15.87th
 * @category Utils
 */
export const lowerPercentile = 'lowerPercentile';

/**
 * The lower percentile ~84.13th
 * @category Utils
 */
export const upperPercentile = 'upperPercentile';

/**
 * This extended sv list is used in the calculation to handle some changes that
 * came up after the specification / design phase: standard deviation is not one
 * but TWO lines. Same goes for percentile which is lower- AND upper-percentile.
 * @category Utils
 */
export const EXTENDED_SV_LIST = [stdMean, lowerPercentile, upperPercentile];

/**
 * The same statistical values as a list to verify certain payload data.
 * @category Utils
 */
export const STATISTICAL_VALUES_LIST = Object.values(STATISTICAL_VALUES);

/**
 * The default color of the backgrounds (Navbar, Footer, Sidebar, ...)
 * @category Utils
 */
export const BACKGROUND_BASE_COLOR = '#111';
