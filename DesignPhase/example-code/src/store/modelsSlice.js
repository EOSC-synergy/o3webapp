import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    "octs": { // plot name (id)
        "all": { // model group
            name: "Somehting",
            modelList: ["CCMI-1_ACCESS_ACCESS-CCM-refC2"],
            models: { // models is lookup table
                "CCMI-1_ACCESS_ACCESS-CCM-refC2": { // single model
                    // name: "Something 2",
                    institute: "Something elese",
                    // dataset: "more something", is not stored here but instead in the api cache
                    mean: true,
                    derivative: true,
                    median: true,
                    percentile: true,
                    color: "XXX",
                    plotStyle: "XXX",
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