import React, { useEffect } from 'react';
import Chart from "react-apexcharts"
import { getOptions, generateSeries } from "../../../utils/optionsFormatter/optionsFormatter"
import { useSelector } from 'react-redux'
import { selectPlotId, selectPlotTitle, selectPlotXRange, selectPlotYRange } from '../../../store/plotSlice/plotSlice';
import { selectVisibility } from '../../../store/referenceSlice/referenceSlice';
import { REQUEST_STATE, selectActivePlotData } from '../../../services/API/apiSlice';
import { Typography, CircularProgress } from '@mui/material';
import { APEXCHART_PLOT_TYPE, HEIGHT_LOADING_SPINNER, HEIGHT_GRAPH } from '../../../utils/constants';

/**
 * Currently there is no dynamic data linking. The graph will always
 * render the data from default-data.json in this folder. This is
 * just a preview to work with until the API is implemented and
 * synced with redux and the UI (input components).
 * 
 * @param {*} props currently not used
 * @returns a svg rendered element that represents a graph, this is done by 
 *          the apexcharts library
 */
function Graph(props) {

    const plotId = useSelector(selectPlotId);
    const plotTitle = useSelector(selectPlotTitle);
    const xAxisRange = useSelector(selectPlotXRange);
    const yAxisRange = useSelector(selectPlotYRange); 
    const activeData = useSelector(state => selectActivePlotData(state, plotId));
    const modelsSlice = useSelector(state => state.models);
    const refLineVisible = useSelector(selectVisibility)
    
    useEffect(() => { 
        // note: this is important, because we should only "propagate" the error to the top
        // if this component has finished rendering, causing no <em>side effects</em> in
        // its rendering process 
        if (activeData.status === REQUEST_STATE.error) {
            props.reportError(activeData.error);
        }
    })

    if (activeData.status === REQUEST_STATE.loading || activeData.status === REQUEST_STATE.idle) {
        return <div style={{display: "flex", alignItems: "center", justifyContent: "center", height: HEIGHT_LOADING_SPINNER}}>
            <div>
                <CircularProgress size={100}/> <br/>
                <Typography component="p">Loading Data...</Typography>
            </div>
            
        </div>
    } else if (activeData.status === REQUEST_STATE.error) {
        return <Typography>An error occurred, please try to reload the site.</Typography>;

    } else if (activeData.status === REQUEST_STATE.success) {
        const {data, styling} = generateSeries({plotId, data: activeData.data, modelsSlice, xAxisRange, yAxisRange, refLineVisible});
        const seriesNames = data.map(series => series.name);
        const options = getOptions({plotId, styling, plotTitle, xAxisRange, yAxisRange, seriesNames});
        const uniqueNumber = Date.now(); // forces apexcharts to re-render correctly!
        return <Chart key={uniqueNumber} options={options} series={data} type={APEXCHART_PLOT_TYPE[plotId]} height={HEIGHT_GRAPH} />
    };

    // this "case" should not happen
    return <Typography>CRITICAL: an internal error occurred that shouldn't happen!</Typography>;
}

export default React.memo(Graph, () => true); // prevent graph from rerendering if sidebar is opened and closed
