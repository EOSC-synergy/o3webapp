import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    "OCTS": {
        year: 1980,
        model: "CCMI-1_ACCESS_ACCESS-CCM-refC2",
        visibile: false,
        offsetApplied: false,
    }
}

const referenceSlice = createSlice({
    name: "reference",
    initialState,
    reducers: {
        setReferenceYear(state, action) {
            const {year} = action.payload;
            state.OCTS.year = year;
         },
        setReferenceModel(state, action) { 
            const {model} = action.payload;
            state.OCTS.model = model;
        },
        setVisibile(state, action) { },
        setOffsetApplied(state, action) { },
    }
})

export const {
    setReferenceYear,
    setReferenceModel,
    setVisibile,
    setOffsetApplied,
} = referenceSlice.actions

export default referenceSlice.reducer

export const selectCurrentReferenceSettings = state=> state.reference[state.plot.plotId]
