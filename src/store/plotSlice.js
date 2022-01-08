import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    // currently active plot
    plotId: "tco3_zm",
    // maps plotids to their settings
    settings: {
        "tco3_zm": {
            name: "OCTS", // should show up in the drop down menu
            title: "OCTS Plot", // the title shown in the apexcharts generated chart
            location: {
                minLat: -90,
                maxLat: 90
            },
            displayXRange: {
                minX: 1960,
                maxX: 2100,
            },
            displayYRange: {
                minY: 200,
                maxY: 400,
            },
            months: [
                1
            ],
        },
        "tco3_return": {
            name: "Return/Recovery",
            title: "Return/Recovery Plot",
            location: { // custom user defined region
                minLat: -90,
                maxLat: 90
            },
            displayYRange: {
                minY: 200,
                maxY: 400,
            },
            months: [
                1
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
        setDisplayXRange(state, action) { },
        setDisplayYRange(state, action) { },
        setMonths(state, action) { },
    }   
})

export const {
    setCurrentType,
    setTitle,
    setLocation,
    setDisplayXRange,
    setDisplayYRange,
    setMonths,
} = plotSlice.actions

export const selectCurrentPlotType = state => state.plot.plotType
export const selectCurrentPlotId = state => state.plot.plotId
export const selectCurrentSettings = state => state.plot.settings[state.plot.plotId]

export default plotSlice.reducer