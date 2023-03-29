import { createSlice } from '@reduxjs/toolkit';
import { HYDRATE } from 'next-redux-wrapper';

/**
 * The string identifying the default reference model used in the webApp
 *
 * @category ReferenceSlice
 * @default 'SBUV_GSFC_merged-SAT-ozone'
 */
export const DEFAULT_REF_MODEL = 'SBUV_GSFC_merged-SAT-ozone';

/**
 * The default year of the reference year
 *
 * @category ReferenceSlice
 * @default 1980
 */
export const DEFAULT_REF_YEAR = 1980;

export type ReferenceState = {
    settings: {
        year: number;
        model: string;
        visible: boolean;
        isOffsetApplied: boolean;
    };
};
export type GlobalReferenceState = {
    reference: ReferenceState;
};

/**
 * The initial state of the referenceSlice defines the data structure in the store. Each reference
 * setting has its own settings i.e. title, ref Year etc.
 *
 * If you change this initial state you have to adapt the first test in the corresponding test file,
 * that tests the initial state.
 */
const initialState: ReferenceState = {
    settings: {
        year: DEFAULT_REF_YEAR,
        model: DEFAULT_REF_MODEL,
        visible: true,
        isOffsetApplied: false,
    },
};

type Payload<T> = {
    payload: T;
};

/**
 * The referenceSlice is generated by the redux toolkit. The reducers are defined here and the
 * corresponding actions are auto-generated.
 *
 * @category ReferenceSlice
 * @constant {Object}
 */
const referenceSlice = createSlice({
    name: 'reference',
    initialState,
    reducers: {
        /**
         * This reducer accepts an action object returned from setYear() e.g.
         * dispatch(setYear({year: 1980})) and calculates the new state based on the action and the
         * action data given in action.payload.
         *
         * In this case the current year is set to the given year.
         *
         * @example
         *     dispatch(setYear({ year: 1980 }));
         *
         * @param state The current store state of: state/reference
         * @param year The new year.
         */
        setYear(state: ReferenceState, { payload: { year } }: Payload<{ year: number }>) {
            state.settings.year = year;
        },

        /**
         * This reducer accepts an action object returned from setModel() e.g.
         * dispatch(setModel({model: "CCMI-1_CCCma_CMAM-refC2"})) and calculates the new state based
         * on the action and the action data given in action.payload.
         *
         * In this case the current model is set to the given model.
         *
         * @example
         *     dispatch(setModel({ model: 'CCMI-1_CCCma_CMAM-refC2' }));
         *
         * @param state The current store state of: state/reference
         * @param model The new reference model name.
         */
        setModel(state: ReferenceState, { payload: { model } }: Payload<{ model: string }>) {
            state.settings.model = model;
        },

        /**
         * This reducer accepts an action object returned from setVisibility() e.g.
         * dispatch(setVisibility({visible: true})) and calculates the new state based on the action
         * and the action data given in action.payload.
         *
         * In this case the current visibility is set to the given visibility.
         *
         * @example
         *     dispatch(setVisibility({ visible: true }));
         *
         * @param state The current store state of: state/reference
         * @param visible Whether the reference line should be visible.
         */
        setVisibility(
            state: ReferenceState,
            { payload: { visible } }: Payload<{ visible: boolean }>
        ) {
            state.settings.visible = visible;
        },

        /**
         * This reducer accepts an action object returned from setOffsetApplied() e.g.
         * dispatch(setOffsetApplied({isOffsetApplied: true})) and calculates the new state based on
         * the action and the action data given in action.payload.
         *
         * In this case the current offset status is set to the given offset status.
         *
         * @example
         *     dispatch(setOffsetApplied({ isOffsetApplied: true }));
         *
         * @param {object} state The current store state of: state/reference
         * @param {object} action Accepts the action returned from setOffsetApplied()
         * @param {object} action.payload The payload is an object containing the given data
         * @param {boolean} action.payload.isOffsetApplied The boolean for the offset status.
         */
        setOffsetApplied(
            state: ReferenceState,
            { payload: { isOffsetApplied } }: Payload<{ isOffsetApplied: boolean }>
        ) {
            state.settings.isOffsetApplied = isOffsetApplied;
        },
    },
    extraReducers: {
        [HYDRATE]: (state: ReferenceState, action) => {
            console.log('HYDRATE', state, action.payload);
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
export const { setYear, setModel, setVisibility, setOffsetApplied } = referenceSlice.actions;

/**
 * The reducer combining all reducers defined in the reference slice. This has to be included in the
 * redux store, otherwise dispatching the above defined actions wouldn't trigger state updates.
 *
 * @category ReferenceSlice
 * @constant {Object}
 */
export default referenceSlice.reducer;

/**
 * This selector allows components to select the current reference year from the store.
 *
 * @category ReferenceSlice
 * @function
 * @param {object} state The global redux state
 * @returns {number} The current active reference year
 */
export const selectRefYear = (state: GlobalReferenceState) => state.reference.settings.year;

/**
 * This selector allows components to select the current reference model from the store.
 *
 * @category ReferenceSlice
 * @function
 * @param {object} state The global redux state
 * @returns {string} The current active reference model
 */
export const selectRefModel = (state: GlobalReferenceState) => state.reference.settings.model;

/**
 * This selector allows components to select the current visibility of the reference line from the
 * store.
 *
 * @category ReferenceSlice
 * @function
 * @param {object} state The global redux state
 * @returns {boolean} The current visibility of the reference line.
 */
export const selectVisibility = (state: GlobalReferenceState) => state.reference.settings.visible;

/**
 * This selector allows components to select the current status of the offset from the store.
 *
 * @category ReferenceSlice
 * @function
 * @param {object} state The global redux state
 * @returns {boolean} The current status of the offset.
 */
export const selectIsOffsetApplied = (state: GlobalReferenceState) =>
    state.reference.settings.isOffsetApplied;
