import * as React from 'react';
import {useDispatch, useSelector} from 'react-redux'
import { useGetRawPlotDataMutation } from '../../../services/API/apiSlice';
import { selectCurrentModelGroups } from '../../../store/modelsSlice';
import { selectPlotId, selectPlotTitle, setTitle, setActivePlotId } from '../../../store/plotSlice';
import { selectCurrentReferenceSettings } from '../../../store/referenceSlice';
import {calculatePlotSeries} from "../../../services/math/math";

/**
 * A containter for the displayed graph.
 * Displays the currently selected plot.
 */
function Graph(props) {

    return (<div>
        Graph
        {/* Graph displayed with ApexCharts goes here */}
    </div>);
}

export default Graph;
