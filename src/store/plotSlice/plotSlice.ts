import { createSlice } from '@reduxjs/toolkit';
import {
    ALL_REGIONS_ORDERED,
    START_YEAR,
    END_YEAR,
    latitudeBands,
    O3AS_PLOTS,
} from 'utils/constants';
import type { Latitude } from 'utils/constants';
import { HYDRATE } from 'next-redux-wrapper';

/**
 * These months are selected when the webapp starts
 * @category plotSlice
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

type PlotState = {
    plotId: O3AS_PLOTS;
    generalSettings: {
        location: Latitude | string;
        months: number[];
    };
    plotSpecificSettings: {
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
};

export type GlobalPlotState = {
    plot: PlotState;
};

/**
 * The initial state of the plotSlice defines the data structure in the
 * store. Each plot has its own settings i.e. title, location etc.
 *
 * IF you change this initial state you have to adapt the first test in the
 * corresponding test file, that tests the initial state.
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
 * The plotSlice is generated by the redux toolkit. The reducers are defined here
 * and the corresponding actions are auto-generated.
 * @category plotSlice
 */
const plotSlice = createSlice({
    name: 'plot',
    initialState,
    reducers: {
        /**
         * This reducer accepts an action object returned from setActivePlotId()
         * and calculates the new state based on the action and the action
         * data given in action.payload.
         *
         * In this case the active plotId is set to the given string.
         *
         * @param state the current store state of: state/plot
         * @param plotId a string that contains the new plot id
         * @example dispatch(setActivePlotId({id: "tco3_zm"}));s
         */
        setActivePlotId(
            state: PlotState,
            { payload: { plotId } }: Payload<{ plotId: O3AS_PLOTS }>
        ) {
            state.plotId = plotId;
        },

        /**
         * This reducer accepts an action object returned from setTitle()
         * and calculates the new state based on the action and the action
         * data given in action.payload.
         *
         * In this case the current plot title is set to the given string.
         *
         * @param state the current store state of: state/plot
         * @param title a string that contains the new plot title
         * @example dispatch(setTitle({title: "OCTS Plot Title"}))
         */
        setTitle(state: PlotState, { payload: { title } }: Payload<{ title: string }>) {
            state.plotSpecificSettings[state.plotId].title = title;
        },

        /**
         * This reducer accepts an action object returned from setLocation()
         * and calculates the new state based on the action and the action
         * data given in action.payload.
         *
         * In this case the current plot location is set with the provided
         * new latitude values.
         *
         * @param state the current store state of: state/plot
         * @param payload
         * @param payload.minLat a number specifying the minimum latitude
         * @param payload.maxLat a number specifying the maximum latitude
         * @exmaple dispatch(setLocation({minLat: -90, maxLat: 90}));
         */
        setLocation(state: PlotState, { payload }: Payload<Latitude>) {
            state.generalSettings.location = payload;
        },

        //TODO: update following JSDoc
        /**
         * This reducer accepts an action object returned from setDisplayXRange()
         * and calculates the new state based on the action and the action
         * data given in action.payload.
         *
         * For the tco3_zm the current displayXRange is updated with the given min and max
         * x values, i.e. you have to pass {years: {minX: 1960, maxX: 2100}} as payload.
         *
         * For the tco3_return the current displayXRange is updated with the given regions
         * values, i.e. you have to pass {regions: [0, 1, 2]} as payload.
         *
         *
         * @param state the current store state of: state/plot
         * @param payload the payload is an object containing the given data
         * @example dispatch(setDisplayXRange({years: {minX: 1960, maxX: 2100}}));
         * @example dispatch(setDisplayXRange({regions: [0, 1, 2]}));
         */
        setDisplayXRange(state: PlotState, { payload }: { payload: XRange }) {
            const currentPlotId = state.plotId;
            if (currentPlotId === O3AS_PLOTS.tco3_zm) {
                state.plotSpecificSettings[currentPlotId].displayXRange =
                    payload as unknown as YearsBasedXRange;
            } else if (currentPlotId === O3AS_PLOTS.tco3_return) {
                state.plotSpecificSettings[currentPlotId].displayXRange =
                    payload as unknown as RegionBasedXRange;
            } else {
                throw new Error(
                    `Illegal internal state, a non valid plot is current plot: "${currentPlotId}"`
                );
            }
        },

        /**
         * This reducer accepts an action object returned from setDisplayXRange()
         * and calculates the new state based on the action and the action
         * data given in action.payload.
         *
         * For the tco3_zm the current displayXRange is updated with the given min and max
         * x values, i.e. you have to pass {years: {minX: 1960, maxX: 2100}} as payload.
         *
         * For the tco3_return the current displayXRange is updated with the given regions
         * values, i.e. you have to pass {regions: [0, 1, 2]} as payload.
         *
         *
         * @param state the current store state of: state/plot
         * @param payload
         * @param payload.years.minX a number specifying the start of the x range for tco3_zm
         * @param payload.years.maxX a number specifying the end of the x range for tco3_zm
         * @param payload.regions an array specifying the selected regions (on the x-axis) for the tco3_return
         * @example dispatch(setDisplayXRange({years: {minX: 1960, maxX: 2100}}));
         * @example dispatch(setDisplayXRange({regions: [0, 1, 2]}));
         */
        setDisplayXRangeForPlot(
            state: PlotState,
            { payload }: { payload: { plotId: O3AS_PLOTS } & XRange }
        ) {
            const { plotId } = payload;
            if (plotId === O3AS_PLOTS.tco3_zm) {
                const {
                    years: { minX, maxX },
                } = payload as unknown as YearsBasedXRange;
                const xRange = state.plotSpecificSettings[plotId].displayXRange;
                xRange.years.minX = minX;
                xRange.years.maxX = maxX;
            } else if (plotId === O3AS_PLOTS.tco3_return) {
                const { regions } = payload as unknown as RegionBasedXRange;
                state.plotSpecificSettings[plotId].displayXRange.regions = regions;
            } else {
                throw new Error(
                    `Illegal internal state, a non valid plot is chosen plot: "${plotId}"`
                );
            }
        },

        /**
         * This reducer accepts an action object returned from setDisplayYRange()
         * and calculates the new state based on the action and the action
         * data given in action.payload.
         *
         * In this case the current displayYRange is updated with the given min and max
         * y values. "Current" is determined by the current active plotId.
         *
         * @param state the current store state of: state/plot
         * @param payload
         * @param payload.minY a number specifying the start of the y range
         * @param payload.maxY a number specifying the end of the y range
         * @example dispatch(setDisplayYRange({minY: 200, maxY: 400}));
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
         * This reducer accepts an action object returned from setDisplayYRange()
         * and calculates the new state based on the action and the action
         * data given in action.payload.
         *
         * In this case the displayYRange for the given plotId is updated with the
         * given min and max y values.
         *
         * @param state the current store state of: state/plot
         * @param plotId tco3_zm | tco3_return
         * @param payload.plotId
         * @param payload.minY a number specifying the start of the y range
         * @param payload.maxY a number specifying the end of the y range
         * @example dispatch(setDisplayYRange({minY: 200, maxY: 400}));
         */
        setDisplayYRangeForPlot(
            state: PlotState,
            { payload }: { payload: YRange & { plotId: O3AS_PLOTS } }
        ) {
            const { plotId, minY, maxY } = payload;
            if (minY === null || maxY === null) {
                return;
            }
            if (!Number.isFinite(minY) || !Number.isFinite(maxY)) {
                {
                    return;
                }
            }
            if (isNaN(minY) || isNaN(maxY)) {
                return;
            }

            const displayYRange = state.plotSpecificSettings[plotId].displayYRange;
            displayYRange.minY = minY;
            displayYRange.maxY = maxY;
        },

        /**
         * This reducer accepts an action object returned from setMonths()
         * and calculates the new state based on the action and the action
         * data given in action.payload.
         *
         * In this case the current selected months are updated to the given array.
         *
         * @param state the current store state of: state/plot
         * @param payload the payload is an object containing the given data
         * @param payload.months an array of integers describing the new months
         * @example dispatch(setMonths({months: [3, 4, 5]}));
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
 * The here listed actions are exported and serve as an interface for
 * the view (our React components).
 */
export const {
    setActivePlotId,
    setTitle,
    setLocation,
    setDisplayXRange,
    setDisplayXRangeForPlot,
    setDisplayYRange,
    setDisplayYRangeForPlot,
    setMonths,
} = plotSlice.actions;

/**
 * The reducer combining all reducers defined in the plot slice.
 * This has to be included in the redux store, otherwise dispatching
 * the above defined actions wouldn't trigger state updates.
 */
export default plotSlice.reducer;

/**
 * This selector allows components to select the current plot id
 * from the store. The plot id is a string using the same naming as the
 * o3as api e.g. tco3_zm or tco3_return
 *
 * @param state the global redux state
 * @returns the current active plot id
 * @category plotSlice
 * @function
 */
export const selectPlotId = (state: GlobalPlotState) => state.plot.plotId;

/**
 * This selector allows components to select the current plot title
 * from the store.
 *
 * @param state the global redux state
 * @returns the current active plot title
 * @function
 * @category plotSlice
 */
export const selectPlotTitle = (state: GlobalPlotState) =>
    state.plot.plotSpecificSettings[state.plot.plotId].title;

/**
 * This selector allows components to select the current plot location
 * from the store. The location is an object containing a minLat and maxLat attribute.
 *
 * @param state the global redux state
 * @returns holds the current location that includes a minLat and maxLat attribute.
 * @function
 * @category plotSlice
 */
export const selectPlotLocation = (state: GlobalPlotState) => state.plot.generalSettings.location;

/**
 * This selector allows components to select the current x range
 * from the store.
 *
 * @param state the global redux state
 * @returns holds the current x range that includes minX and maxX
 * @function
 * @category plotSlice
 */
export const selectPlotXRange = (state: GlobalPlotState) =>
    state.plot.plotSpecificSettings[state.plot.plotId].displayXRange;

/**
 * This selector allows components to select the current y range
 * from the store.
 *
 * @param state the global redux state
 * @returns holds the current x range that includes minY and maxY
 * @function
 * @category plotSlice
 */
export const selectPlotYRange = (state: GlobalPlotState) =>
    state.plot.plotSpecificSettings[state.plot.plotId].displayYRange;

/**
 * This selector allows components to select the current selected months
 * from the store.
 *
 * @param state the global redux state
 * @returns array of integers describing the current selected months
 * @function
 * @category plotSlice
 */
export const selectPlotMonths = (state: GlobalPlotState) => state.plot.generalSettings.months;

/**
 * This selector allows components to select the current user region name.
 *
 * @param state the global redux state
 * @returns the user region name
 * @function
 */
export const selectUserRegionName = (state: GlobalPlotState) =>
    state.plot.plotSpecificSettings.tco3_return.userRegionName;
