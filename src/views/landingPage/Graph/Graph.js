import * as React from 'react';
import {useDispatch, useSelector} from 'react-redux'
import { useGetRawPlotDataMutation } from '../../../services/API/apiSlice';
import { selectCurrentModelGroups } from '../../../store/modelsSlice';
import { selectPlotTitle, setTitle } from '../../../store/plotSlice';
import { selectCurrentReferenceSettings } from '../../../store/referenceSlice';
import {calculatePlotSeries} from "../../../services/math/math";

/**
 * A containter for the displayed graph.
 * Displays the currently selected plot.
 */
function Graph(props) {

    const title = useSelector(selectPlotTitle)
    const dispatch = useDispatch()

    return (<div>
        Graph: {title}
        <br />
        <button onClick={() => {
            console.log("dispatch")
            dispatch(setTitle({title: new Date().toISOString()}))
        }}>Change Title</button>
        {/* Graph displayed with ApexCharts goes here */}
    </div>);
}

export default Graph;
