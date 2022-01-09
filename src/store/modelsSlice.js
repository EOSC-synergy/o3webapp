import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    // active plot id is stored in state.plot.plotId
    "tco3_zm": { 
        // this objects holds key-value-pairs, the keys being the model-group 
        // identifier and the values being the settings for each group 
        "all": { 
            // model group storing all information until it is possible 
            // to implement more model groups
            name: "All OCTS models",
            modelList: ["CCMI-1_ACCESS_ACCESS-CCM-refC2"],
            models: { // models is lookup table
                "CCMI-1_ACCESS_ACCESS-CCM-refC2": { // single model
                    institute: "IMK",
                    dataset: {
                        x: [42],
                        y: [42],
                    },
                    color: "#000000",
                    plotStyle: "solid",
                    hidden: false, // show/hide individual models from a group
                    mean: true,
                    derivative: true,
                    median: true,
                    percentile: true,
                }
            },
            hidden: false, // show/hide complete group
            derivativeVisible: false,
            meanVisible: false,
            medianVisible: false,
            percentileVisible: false
        }
    },
    "tco3_return": {
        "all": { 
            name: "All Return/Recovery models",
            modelList: ["CCMI-1_ACCESS_ACCESS-CCM-refC2"],
            models: { // models is lookup table
                "CCMI-1_ACCESS_ACCESS-CCM-refC2": { // single model
                    institute: "IMK",
                    dataset: {
                        x: [42],
                        y: [42],
                    },
                    hidden: false, // show/hide individual models from a group
                    mean: true,
                    derivative: true,
                    median: true,
                    percentile: true,
                    color: "#000000",
                    plotStyle: "solid",
                }
            },
            hidden: false, // show/hide complete group
            derivativeVisible: false,
            meanVisible: false,
            medianVisible: false,
            percentileVisible: false
        }
    }
}

const modelsSlice = createSlice({
    name: "models",
    initialState,
    reducers: {
        updatedModelGroup(state, action) { },
        addedModelGroup(state, action) { },
        setVisibility(state, action) { },
        setStatisticalValuesIncluded(state, action) { },
        addStatisticalValue(state, action) { },
        removeStatisticalValue(state, action) { },
    }
})

export const { 
    updatedModelGroup,
    addedModelGroup,
    setVisibility, 
    setStatisticalValuesIncluded, 
    addStatisticalValue, 
    removeStatisticalValue 
} = modelsSlice.actions

export default modelsSlice.reducer

export const selectCurrentModelGroups = state => state.models[state.plot.plotId]
export const selectCurrentModelGroup = (state, groupId) => state.models[state.plot.plotId][groupId]