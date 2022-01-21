import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  plotId: "tco3_zm", // currently active plot
  // maps plotTyps to their reference settings.
  settings: {
    tco3_zm: {
      name: "OCTS", // should show up in the drop down menu
      year: 1980,
      model: "defaultModel",
      isVisibile: false,
      isOffsetApplied: false,
    },
    tco3_return: {
      name: "Return/Recovery",
      year: 1980,
      model: "defaultModel",
      isVisibile: false,
      isOffsetApplied: false,
    },
  },
};

const referenceSlice = createSlice({
  name: "reference",
  initialState,
  reducers: {

    /**
     * This reducer accepts an action object returned from setActivePlotId()
     *     e.g. dispatch(setActivePlotId({id: "tco3_zm"}))
     * and calculates the new state based on the action and the action
     * data given in action.payload.
     *
     * In this case the active plotId is set to the given string.
     *
     * @param {object} state the current store state of: state/plot
     * @param {object} action accepts the action returned from setActivePlotId()
     * @param {object} action.payload the payload is an object containg the given data
     * @param {string} action.payload.plotId a string that contains the new plot id
     */
    setActivePlotId(state, action) {
      const { plotId } = action.payload;
      state.plotId = plotId;
    },

    /**
     * This reducer accepts an action object returned from setYear()
     *     e.g. dispatch(setYear({year: 1980}))
     * and calculates the new state based on the action and the action
     * data given in action.payload.
     *
     * In this case the current year is set to the given year.
     *
     * @param {object} state the current store state of: state/reference
     * @param {object} action accepts the action returned from setYear()
     * @param {object} action.payload the payload is an object containg the given data
     * @param {number} action.payload.year a number that contains the new year.
     */
    setYear(state, action) {
      const { year } = action.payload;
      state.settings[state.plotId].year = year;
    },

    /**
     * This reducer accepts an action object returned from setModel()
     *     e.g. dispatch(setModel({model: "CCMI-1_CCCma_CMAM-refC2"}))
     * and calculates the new state based on the action and the action
     * data given in action.payload.
     *
     * In this case the current year is set to the given year.
     *
     * @param {object} state the current store state of: state/reference
     * @param {object} action accepts the action returned from setModel()
     * @param {object} action.payload the payload is an object containg the given data
     * @param {string} action.payload.id a string that contains the new reference model name.
     */
    setModel(state, action) {
      const { model } = action.payload;
      state.settings[state.plotId].model = model;
    },

    /**
     * This reducer accepts an action object returned from setVisibile()
     *     e.g. dispatch(setYear({isVisible: true}))
     * and calculates the new state based on the action and the action
     * data given in action.payload.
     *
     * In this case the current visibility is set to the given visibility.
     *
     * @param {object} state the current store state of: state/reference
     * @param {object} action accepts the action returned from setVisibile()
     * @param {object} action.payload the payload is an object containg the given data
     * @param {boolean} action.payload.isVisible the boolean for the refearence line visibility.
     */
    setVisibile(state, action) {
      const { isVisibile } = action.payload;
      state.settings[state.plotId].isVisibile = isVisibile;
    },

    /**
     * This reducer accepts an action object returned from setOffsetApplied()
     *     e.g. dispatch(setOffsetApplied({isOffsetApplied: true}))
     * and calculates the new state based on the action and the action
     * data given in action.payload.
     *
     * In this case the current offset status  is set to the given offset status.
     *
     * @param {object} state the current store state of: state/reference
     * @param {object} action accepts the action returned from setOffsetApplied()
     * @param {object} action.payload the payload is an object containg the given data
     * @param {boolean} action.payload.isVisible the boolean for the refearence line visibility.
     */
    setOffsetApplied(state, action) {
      const { isOffsetApplied } = action.payload;
      state.settings[state.plotId].isOffsetApplied = isOffsetApplied;
    },
  },
});

/**
 * The here listed actions are exported and serve as an interface for
 * the view (our react components).
 */
export const {
  setYear: setReferenceYear,
  setModel: setReferenceModel,
  setVisibile: setVisibleRefLine,
  setOffsetApplied,
} = referenceSlice.actions;

/**
 * The reducer combining all reducers defined in the reference slice.
 * This has to be included in the redux store, otherwise dispatching
 * the above defined actions wouldn't trigger state updates.
 */
export default referenceSlice.reducer;


/**
 * This selectors allows components to select the current plot id
 * from the store. The plot id is a string using the same naming as the
 * o3as api e.g. tco3_zm or tco3_return
 * 
 * @param {object} state the global redux state
 * @returns {string} the current active plot id
 */
 export const selectPlotId = state => state.reference.plotId;


/**
 * This selectors allows components to select the current reference year
 * from the store.
 *
 * @param {object} state the global redux state
 * @returns {number} the current active reference year
 */
export const selectRefYear = (state) =>
  state.reference.settings[state.plotId].year;

/**
 * This selectors allows components to select the current reference model
 * from the store.
 *
 * @param {object} state the global redux state
 * @returns {string} the current active reference model
 */
export const selectRefModel = (state) =>
  state.reference.settings[state.plotId].model;

/**
 * This selectors allows components to select the current visibility of the reference line
 * from the store.
 *
 * @param {object} state the global redux state
 * @returns {boolean} the current visibility of the reference line.
 */
export const selectIsVisible = (state) =>
  state.reference.settings[state.plotId].isVisibile;

/**
 * This selectors allows components to select the current status of the offset
 * from the store.
 *
 * @param {object} state the global redux state
 * @returns {boolean} the current status of the offset.
 */
export const selectIsOffsetApplied = (state) =>
  state.reference.settings[state.plotId].isOffsetApplied;