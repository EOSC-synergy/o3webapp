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
            displayXRange: {
                minX: 0,
                maxX: 0,
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
        setActivePlotId(state, action) {
            const { plotId } = action.payload
            state.plotId = plotId
        }, 
        setTitle(state, action) { 
            const { title } = action.payload
            state.settings[state.plotId].title = title
        },
        setLocation(state, action) { },
        setDisplayXRange(state, action) { },
        setDisplayYRange(state, action) { },
        setMonths(state, action) { },
    }   
})

export const {
    setActivePlotId,
    setTitle,
    setLocation,
    setDisplayXRange,
    setDisplayYRange,
    setMonths,
} = plotSlice.actions

// select the current active settings
export const selectPlotId = state => state.plot.plotId
export const selectPlotName = state => state.plot.settings[state.plot.plotId].name
export const selectPlotTitle = state => state.plot.settings[state.plot.plotId].title
export const selectPlotLocation = state => state.plot.settings[state.plot.plotId].location
export const selectPlotXRange = state => state.plot.settings[state.plot.plotId].displayXRange
export const selectPlotYRange = state => state.plot.settings[state.plot.plotId].displayYRange
export const selectPlotMonths = state => state.plot.settings[state.plot.plotId].months

export default plotSlice.reducer