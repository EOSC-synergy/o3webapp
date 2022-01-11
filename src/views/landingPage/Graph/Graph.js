import * as React from 'react';
import {useSelector} from 'react-redux'
import { useGetRawPlotDataMutation } from '../../../services/API/apiSlice';
import { selectCurrentModelGroups } from '../../../store/modelsSlice';
import { selectCurrentPlotId, selectCurrentPlotType, selectCurrentSettings } from '../../../store/plotSlice';
import { selectCurrentReferenceSettings } from '../../../store/referenceSlice';
// import {calculatePlotSeries} from "../../../utils/math"

/**
 * A containter for the displayed graph.
 * Displays the currently selected plot.
 */
function Graph(props) {

    // const plotType = selectCurrentPlotType()
    // const plotId = selectCurrentPlotId()
    // const options = useSelector(state => selectCurrentSettings(state, plotId))
    // const models = useSelector(state => selectCurrentModelGroup(state, plotId, "all"))
    // const referenceSettings = useSelector(state => selectCurrentReferenceSettings(state, plotId))
    
    // const { data, isError, error, isLoading, isSuccess } = useGetRawPlotDataMutation(
    //     {
    //         plotType,
    //         latMin: options.latMin,
    //         latMax: options.latMax,
    //         modelList,
    //     }
    // )
    
    // if (isSuccess) {
    //     // updateCurrentModelGroup with fetched data
    // }


    // display loading spinner instead of graph until isSuccess = true
    // then load data
    
    // const seriesData = generatePlotSeries(models)

    return (<div>
        {/* Graph displayed with ApexCharts goes here */}
    </div>);
}

export default Graph;
