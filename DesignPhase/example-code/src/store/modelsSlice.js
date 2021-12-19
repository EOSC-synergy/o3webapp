import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    "octs": { // different plots
        "all": { // model group
            name: "Somehting",
            models: [
                { // single model
                    name: "Something 2",
                    institute: "Something elese",
                    dataset: "more something",
                    mean: true,
                    derivative: true,
                    median: true,
                    percentile: true,
                    color: "XXX",
                    plotStyle: "XXX",
                }
            ],
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
        setModels(state, action) { },
        setVisibility(state, action) { },
        setStatisticalValuesIncluded(state, action) { },
        addStatisticalValue(state, action) { },
        removeStatisticalValue(state, action) { },
    }
})

export const { 
    setModels,
    setVisibility, 
    setStatisticalValuesIncluded, 
    addStatisticalValue, 
    removeStatisticalValue 
} = modelsSlice.actions

export default modelsSlice.reducer