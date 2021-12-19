import * as React from 'react';
import {useSelector} from 'react-redux'
import { useGetRawPlotDataMutation } from '../../../store/apiSlice';
import {calculatePlotSeries} from "../../../utils/math"

/**
 * A containter for the displayed graph.
 * Displays the currently selected plot.
 */
export default function Graph() {

    const plotType = useSelector(store => store.plot.plotType)
    const plotId = useSelector(store => store.plot.plotId)
    const options = useSelector(store => store.plot[plotId].options)
    const models = useSelector(store => store.models[plotId].all)
    
    const { data, isError, error, isLoading, isSuccess } = useGetRawPlotDataMutation(
        {
            plotType,
            latMin: options.latMin,
            latMax: options.latMax,
            modelList,
        }
    )
    // display loading spinner instead of graph until isSuccess = true
    // then load data
    const seriesData = generatePlotSeries(models, data)

    return (<div>
        {/* Graph displayed with ApexCharts goes here */}
    </div>);
}
