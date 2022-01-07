import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    "octs": { // plot name (id)
        "all": { // model group
            name: "Somehting",
            modelList: ["CCMI-1_ACCESS_ACCESS-CCM-refC2"],
            models: { // models is lookup table
                "CCMI-1_ACCESS_ACCESS-CCM-refC2": { // single model
                    institute: "IMK",
                    dataset: {
                        x: [42],
                        y: [42],
                    },
                    mean: true,
                    derivative: true,
                    median: true,
                    percentile: true,
                    color: "#000000",
                    plotStyle: "solid",
                }
            },
            hidden: false,
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