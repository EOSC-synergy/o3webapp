import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    // currently active
    plotType: "tcm_return",
    plotId: "OCTS",
    // 
    settings: {
        "OCTS": {
            type: "tco3_zm",
            title: "example title",
            location: {
                minLat: -90,
                maxLat: 90
            },
            displayRange: {
                minX: 1960,
                maxX: 2100,
                minY: 200,
                maxY: 400,
            },
            months: [
                3,
                4,
                5,
            ],
        }
    }
}

const plotSlice = createSlice({
    name: "plot",
    initialState,
    reducers: {
        setCurrentType(state, action) { }, // change active plot
        setTitle(state, action) { },
        setLocation(state, action) { },
        setDisplayRange(state, action) { },
        setMonths(state, action) { },
    }   
})

export const {
    setCurrentType,
    setTitle,
    setLocation,
    setDisplayRange,
    setMonths,
} = plotSlice.actions

export const selectCurrentPlotType = state => state.plot.plotType

export default plotSlice.reducer