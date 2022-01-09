import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    // currently active plot
    plotId: "tco3_zm",
    settings: {
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
                        isVisible: true, // show/hide individual models from a group
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
}

const modelsSlice = createSlice({
    name: "models",
    initialState,
    reducers: {
        // set models
        // add models

        updatedModelGroup(state, action) { },
        addedModelGroup(state, action) { },
        setVisibility(state, action) { 
            const { groupID, modelID, isVisible } = action.payload
            const activeSettings = state.settings[state.plotId]
            const activeModel = activeSettings[groupID].models[modelID]
            if (activeModel === undefined) {
                throw `tried to access model with modelID "${modelID}" that is not yet defined!`
            } 
            activeModel.isVisible = isVisible
        },
        setStatisticalValuesIncluded(state, action) { 
            // svType has to be a string of the form: 
            // mean | derivative | median | percentile
            const { groupID, modelID, svType, isIncluded } = action.payload;
            const activeSettings = state.settings[state.plotId];
            const activeModel = activeSettings[groupID].models[modelID]
            if (activeModel === undefined) {
                throw `tried to access model with modelID "${modelID}" that is not yet defined!`
            }
            if (activeModel[svType] === undefined) { // svType doesn't represent a valid statistical value
                throw `tried to set statistial value "${svType}" that is not a valid statistical value`
            }
            activeModel[svType] = isIncluded
        },
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