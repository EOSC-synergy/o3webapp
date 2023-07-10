import { createSlice } from '@reduxjs/toolkit';
import type { Latitude } from 'utils/constants';
import {
    ALL_REGIONS_ORDERED,
    END_YEAR,
    latitudeBands,
    O3AS_PLOTS,
    START_YEAR,
} from 'utils/constants';
import { HYDRATE } from 'next-redux-wrapper';

/**
 * These months are selected when the webapp starts
 *
 * @category PlotSlice
 */
const DEFAULT_MONTHS: number[] = [1, 2, 12];

// used for return
export type RegionBasedXRange = { regions: number[] };
// used for zm
export type YearsBasedXRange = {
    years: {
        minX: number;
        maxX: number;
    };
};
export type XRange = RegionBasedXRange | YearsBasedXRange;
export type YRange = {
    minY: number;
    maxY: number;
};

export type PlotSpecific = {
    // initial settings for tco3_zm
    [O3AS_PLOTS.tco3_zm]: {
        // the title shown in the apexcharts generated chart
        title: string;
        displayXRange: YearsBasedXRange;
        // gets adjusted automatically on each request
        displayYRange: YRange;
    };
    // initial settings for tco3_return
    [O3AS_PLOTS.tco3_return]: {
        title: string;
        displayXRange: RegionBasedXRange;
        // gets adjusted automatically on each request
        displayYRange: YRange;
        userRegionName?: string;
    };
};

type PlotSpecifics<
    Id extends O3AS_PLOTS,
    P extends keyof PlotSpecific[O3AS_PLOTS]
> = Id extends O3AS_PLOTS
    ? {
          plotId: Id;
      } & {
          [key in P]: PlotSpecific[Id][key];
      }
    : never;
type PickPlotSpecific<P extends keyof PlotSpecific[O3AS_PLOTS]> = PlotSpecifics<O3AS_PLOTS, P>;

export type PlotState = {
    plotId: O3AS_PLOTS;
    generalSettings: {
        location: Latitude;
        months: number[];
    };
    plotSpecificSettings: PlotSpecific;
};

export type GlobalPlotState = {
    plot: PlotState;
};

/**
 * The initial state of the plotSlice defines the data structure in the store. Each plot has its own
 * settings i.e. title, location etc.
 *
 * IF you change this initial state you have to adapt the first test in the corresponding test file,
 * that tests the initial state.
 */
export const initialState: PlotState = {
    plotId: O3AS_PLOTS.tco3_zm, // the initially active plot
    // maps plot ids to their settings
    generalSettings: {
        location: latitudeBands[6].value, // Global Region
        months: DEFAULT_MONTHS,
    },

    plotSpecificSettings: {
        // initall settings for tco3_zm
        [O3AS_PLOTS.tco3_zm]: {
            title: 'OCTS Plot', // the title shown in the apexcharts generated chart
            displayXRange: {
                years: {
                    minX: START_YEAR,
                    maxX: END_YEAR,
                },
            },
            displayYRange: { minY: 0, maxY: 0 }, // gets adjusted automatically on each request
        },
        // initall settings for tco3_return
        [O3AS_PLOTS.tco3_return]: {
            title: 'Return/Recovery Plot',
            displayXRange: {
                regions: [...Array(ALL_REGIONS_ORDERED.length).keys()], // implicitly refers to ALL_REGIONS_ORDERED by storing only the indices
            },
            displayYRange: { minY: 0, maxY: 0 }, // gets adjusted automatically on each request
        },
    },
};

type Payload<T> = {
    payload: T;
};

/**
 * The plotSlice is generated by the redux toolkit. The reducers are defined here and the
 * corresponding actions are auto-generated.
 *
 * @category PlotSlice
 */
const plotSlice = createSlice({
    name: 'plot',
    initialState,
    reducers: {
        /**
         * This reducer accepts an action object returned from setActivePlotId() and calculates the
         * new state based on the action and the action data given in action.payload.
         *
         * In this case the active plotId is set to the given string.
         *
         * @example
         *     dispatch(setActivePlotId({ id: 'tco3_zm' }));
         *     s;
         *
         * @param state The current store state of: state/plot
         * @param plotId A string that contains the new plot id
         */
        setActivePlotId(
            state: PlotState,
            { payload: { plotId } }: Payload<{ plotId: O3AS_PLOTS }>
        ) {
            state.plotId = plotId;
            console.log('active plot', plotId);
        },

        setTitle(state: PlotState, { payload: { title } }: Payload<{ title: string }>) {
            state.plotSpecificSettings[state.plotId].title = title;
        },

        /**
         * This reducer accepts an action object returned from setLocation() and calculates the new
         * state based on the action and the action data given in action.payload.
         *
         * In this case the current plot location is set with the provided new latitude values.
         *
         * @param state The current store state of: state/plot
         * @param payload
         * @param payload.minLat A number specifying the minimum latitude
         * @param payload.maxLat A number specifying the maximum latitude
         * @exmaple dispatch(setLocation({minLat: -90, maxLat: 90}));
         */
        setLocation(state: PlotState, { payload }: Payload<Latitude>) {
            state.generalSettings.location = payload;
        },

        /**
         * This reducer accepts an action object returned from setDisplayXRange() and calculates the
         * new state based on the action and the action data given in action.payload.
         *
         * For the tco3_zm the current displayXRange is updated with the given min and max x values,
         * i.e. you have to pass {years: {minX: 1960, maxX: 2100}} as payload.
         *
         * For the tco3_return the current displayXRange is updated with the given regions values,
         * i.e. you have to pass {regions: [0, 1, 2]} as payload.
         *
         * @example
         *     dispatch(setDisplayXRange({ years: { minX: 1960, maxX: 2100 } }));
         *
         * @example
         *     dispatch(setDisplayXRange({ regions: [0, 1, 2] }));
         *
         * @param state The current store state of: state/plot
         * @param payload
         * @param payload.years.minX A number specifying the start of the x range for tco3_zm
         * @param payload.years.maxX A number specifying the end of the x range for tco3_zm
         * @param payload.regions An array specifying the selected regions (on the x-axis) for the
         *   tco3_return
         */
        setDisplayXRangeForPlot(
            state: PlotState,
            { payload }: { payload: PickPlotSpecific<'displayXRange'> }
        ) {
            if (payload.plotId === 'tco3_zm') {
                const {
                    years: { minX, maxX },
                } = payload.displayXRange;
                const xRange = state.plotSpecificSettings[payload.plotId].displayXRange;
                xRange.years.minX = minX;
                xRange.years.maxX = maxX;
            } else if (payload.plotId === O3AS_PLOTS.tco3_return) {
                const { regions } = payload.displayXRange;
                state.plotSpecificSettings[payload.plotId].displayXRange.regions = regions;
            }
        },

        /**
         * This reducer accepts an action object returned from setDisplayYRange() and calculates the
         * new state based on the action and the action data given in action.payload.
         *
         * In this case the current displayYRange is updated with the given min and max y values.
         * "Current" is determined by the current active plotId.
         *
         * @example
         *     dispatch(setDisplayYRange({ minY: 200, maxY: 400 }));
         *
         * @param state The current store state of: state/plot
         * @param payload
         * @param payload.minY A number specifying the start of the y range
         * @param payload.maxY A number specifying the end of the y range
         */
        setDisplayYRange(state: PlotState, { payload }: { payload: YRange }) {
            if (payload.minY === null || payload.maxY === null) {
                return;
            }
            if (!Number.isFinite(payload.minY) || !Number.isFinite(payload.maxY)) {
                return;
            }
            if (isNaN(payload.minY) || isNaN(payload.maxY)) {
                return;
            }

            state.plotSpecificSettings[state.plotId].displayYRange = payload;
        },

        /**
         * This reducer accepts an action object returned from setDisplayYRange() and calculates the
         * new state based on the action and the action data given in action.payload.
         *
         * In this case the displayYRange for the given plotId is updated with the given min and max
         * y values.
         *
         * @example
         *     dispatch(setDisplayYRange({ minY: 200, maxY: 400 }));
         *
         * @param state The current store state of: state/plot
         * @param plotId Tco3_zm | tco3_return
         * @param payload.plotId
         * @param payload.minY A number specifying the start of the y range
         * @param payload.maxY A number specifying the end of the y range
         */
        setDisplayYRangeForPlot(
            state: PlotState,
            { payload }: { payload: PickPlotSpecific<'displayYRange'> }
        ) {
            const {
                plotId,
                displayYRange: { minY, maxY },
            } = payload;
            if (minY === null || maxY === null) {
                return;
            }
            if (!Number.isFinite(minY) || !Number.isFinite(maxY)) {
                return;
            }
            if (isNaN(minY) || isNaN(maxY)) {
                return;
            }

            const displayYRange = state.plotSpecificSettings[plotId].displayYRange;
            displayYRange.minY = minY;
            displayYRange.maxY = maxY;
        },

        /**
         * This reducer accepts an action object returned from setMonths() and calculates the new
         * state based on the action and the action data given in action.payload.
         *
         * In this case the current selected months are updated to the given array.
         *
         * @example
         *     dispatch(setMonths({ months: [3, 4, 5] }));
         *
         * @param state The current store state of: state/plot
         * @param payload The payload is an object containing the given data
         * @param payload.months An array of integers describing the new months
         */
        setMonths(state: PlotState, { payload }: { payload: { months: number[] } }) {
            state.generalSettings.months = payload.months;
        },
    },
    extraReducers: {
        [HYDRATE]: (state, action) => {
            return {
                ...state,
                ...action.payload.subject,
            };
        },
    },
});

/**
 * The here listed actions are exported and serve as an interface for the view (our React
 * components).
 */
export const {
    setActivePlotId,
    setTitle,
    setLocation,
    setDisplayXRangeForPlot,
    setDisplayYRange,
    setDisplayYRangeForPlot,
    setMonths,
} = plotSlice.actions;

/**
 * The reducer combining all reducers defined in the plot slice. This has to be included in the
 * redux store, otherwise dispatching the above defined actions wouldn't trigger state updates.
 */
export default plotSlice.reducer;

/**
 * This selector allows components to select the current plot id from the store. The plot id is a
 * string using the same naming as the o3as api e.g. tco3_zm or tco3_return
 *
 * @category PlotSlice
 * @function
 * @param state The global redux state
 * @returns The current active plot id
 */
export const selectPlotId = (state: GlobalPlotState) => state.plot.plotId;

/**
 * This selector allows components to select the current plot title from the store.
 *
 * @category PlotSlice
 * @function
 * @param state The global redux state
 * @returns The current active plot title
 */
export const selectPlotTitle = (state: GlobalPlotState) =>
    state.plot.plotSpecificSettings[state.plot.plotId].title;

/**
 * This selector allows components to select the current plot location from the store. The location
 * is an object containing a minLat and maxLat attribute.
 *
 * @category PlotSlice
 * @function
 * @param state The global redux state
 * @returns Holds the current location that includes a minLat and maxLat attribute.
 */
export const selectPlotLocation = (state: GlobalPlotState) => state.plot.generalSettings.location;

/**
 * This selector allows components to select the current x range from the store.
 *
 * @category PlotSlice
 * @function
 * @param plotId Plot type (needed for typing)
 * @returns Holds the current x range that includes minX and maxX
 */
const _selectPlotXRange =
    <T extends O3AS_PLOTS>(plotId: T) =>
    (state: GlobalPlotState): PlotSpecific[T]['displayXRange'] =>
        state.plot.plotSpecificSettings[plotId].displayXRange;
export const selectPlotXRangeZm = _selectPlotXRange(O3AS_PLOTS.tco3_zm);
export const selectPlotXRangeReturn = _selectPlotXRange(O3AS_PLOTS.tco3_return);

/**
 * This selector allows components to select the current y range from the store.
 *
 * @category PlotSlice
 * @function
 * @param state The global redux state
 * @returns Holds the current x range that includes minY and maxY
 */
export const selectPlotYRange = (state: GlobalPlotState) =>
    state.plot.plotSpecificSettings[state.plot.plotId].displayYRange;

/**
 * This selector allows components to select the current selected months from the store.
 *
 * @category PlotSlice
 * @function
 * @param state The global redux state
 * @returns Array of integers describing the current selected months
 */
export const selectPlotMonths = (state: GlobalPlotState) => state.plot.generalSettings.months;

/**
 * This selector allows components to select the current user region name.
 *
 * @function
 * @param state The global redux state
 * @returns The user region name
 */
export const selectUserRegionName = (state: GlobalPlotState) =>
    state.plot.plotSpecificSettings.tco3_return.userRegionName;
