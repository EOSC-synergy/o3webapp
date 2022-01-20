import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    plotType: "tco3_zm", // currently active plot
    // maps plotids to their settings
    settings: {
        "tco3_zm": {
            name: "OCTS", // should show up in the drop down menu
            year: 1980,
            model: "defaultModel",
            isVisibile: false,
            offsetApplied: false,
        },
        "tco3_return": {
            name: "Return/Recovery",
            year: 1980,
            model: "defaultModel",
            isVisibile: false,
            offsetApplied: false,
        }
    }
};

const referenceSlice = createSlice({
    name: "reference",
    initialState,
    reducers: {
        
        /**
         * This reducer accepts an action object returned from setYear()
         *     e.g. dispatch(setYear({year: 1980}))     
         * and calculates the new state based on the action and the action 
         * data given in action.payload.
         * 
         * In this case the current year is set to the given year.
         * 
         * @param {object} state the current store state of: state/plot
         * @param {object} action accepts the action returned from setYear()
         * @param {object} action.payload the payload is an object containg the given data
         * @param {number} action.payload.year a number that contains the new year.
         */
        setYear(state, action) { 
            const { year } = action.payload;
            state.settings[state.plotType].year = year;
        },
        
        /**
         * This reducer accepts an action object returned from setModel()
         *     e.g. dispatch(setModel({model: "CCMI-1_CCCma_CMAM-refC2"}))     
         * and calculates the new state based on the action and the action 
         * data given in action.payload.
         * 
         * In this case the current year is set to the given year.
         * 
         * @param {object} state the current store state of: state/plot
         * @param {object} action accepts the action returned from setYear()
         * @param {object} action.payload the payload is an object containg the given data
         * @param {string} action.payload.id a string that contains the new reference model name.
         */
        setModel(state, action) {
            const { model } = action.payload;
            state.settings[state.plotType].model = model;
         },

         /**
         * This reducer accepts an action object returned from setYear()
         *     e.g. dispatch(setYear({year: 1980}))     
         * and calculates the new state based on the action and the action 
         * data given in action.payload.
         * 
         * In this case the current year is set to the given year.
         * 
         * @param {object} state the current store state of: state/plot
         * @param {object} action accepts the action returned from setYear()
         * @param {object} action.payload the payload is an object containg the given data
         * @param {boolean} action.payload.isVisible the boolean for the refearence line visibility. 
         */
        setVisibile(state, action) {
            const { isVisibile } = action.payload;
            state.settings[state.plotType].isVisibile = isVisibile;
         },

                /**
         * This reducer accepts an action object returned from setYear()
         *     e.g. dispatch(setYear({year: 1980}))     
         * and calculates the new state based on the action and the action 
         * data given in action.payload.
         * 
         * In this case the current year is set to the given year.
         * 
         * @param {object} state the current store state of: state/plot
         * @param {object} action accepts the action returned from setYear()
         * @param {object} action.payload the payload is an object containg the given data
         * @param {number} action.payload.year a number that contains the new year.
         */
        setOffsetApplied(state, action) { },
    }
})

/**
 * The here listed actions are exported and serve as an interface for
 * the view (our react components).
 */
export const {
    setYear: setReferenceYear,
    setModel: setReferenceModel,
    setVisibile: setVisibleRefLine,
    setOffsetApplied,
} = referenceSlice.actions

/**
 * The reducer combining all reducers defined in the reference slice. 
 * This has to be included in the redux store, otherwise dispatching 
 * the above defined actions wouldn't trigger state updates.
 */
export default referenceSlice.reducer

/**
 * This selectors allows components to select the current reference year
 * from the store.
 * 
 * @param {object} state the global redux state
 * @returns {string} the current active reference year
 */
 export const selectRefYear = state => state.plot.settings[state.plotId].year;


 
export const selectCurrentReferenceSettings = state=> state.reference[state.plot.plotId]