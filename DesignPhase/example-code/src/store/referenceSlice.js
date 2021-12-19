import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    "OCTS": {
        year: 1980,
        model: "defaultModel",
        visibile: false,
        offsetApplied: false,
    }
}

const referenceSlice = createSlice({
    name: "reference",
    initialState,
    reducers: {
        setYear(state, action) { },
        setModel(state, action) { },
        setVisibile(state, action) { },
        setOffsetApplied(state, action) { },
    }
})

export const {
    setYear: setReferenceYear,
    setModel: setReferenceModel,
    setVisibile: setVisibleRefLine,
    setOffsetApplied,
} = referenceSlice.actions

export default referenceSlice.reducer
