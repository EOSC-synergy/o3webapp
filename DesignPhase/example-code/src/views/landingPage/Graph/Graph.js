import * as React from 'react';
import {useSelector} from 'react-redux'
import {calculatePlotSeries} from "../../../utils/math"

/**
 * A containter for the displayed graph.
 * Displays the currently selected plot.
 */
export default function Graph() {

    const plotType = useSelector(store => store.plot.plotType)
    const options = useSelector(store => store.plot[plotType].options)
    const models = useSelector(store => store.models[plotType].all)
    const seriesData = generatePlotSeries(models)
    

    const getDataToDisplay = () => {
        // Gets the currently selected models which should be displayed
    }

    return (<div>
        {/* Graph displayed with ApexCharts goes here */}
    </div>);
}
