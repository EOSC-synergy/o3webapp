import React, { useEffect } from 'react';
import Chart from "react-apexcharts"
import data from "./default-data.json"
import settings from "./default-settings.json"
import { convertToStrokeStyle, colourNameToHex, renderChartWithSettings, getOptions, generateSeries } from "../../../utils/optionsFormatter"
import {useSelector} from 'react-redux'
import { selectPlotId } from '../../../store/plotSlice/plotSlice';
import { REQUEST_STATE, selectActivePlotData } from '../../../services/API/apiSlice';
import { Spinner } from '../../../components/Spinner/Spinner';
import { Typography } from '@mui/material';
import { APEXCHART_PLOT_TYPE } from '../../../utils/constants';
import store from "../../../store/store";

function ChartWrapper(props) {

}

const MemoizedChart = React.memo(ChartWrapper);

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
    const activeData = useSelector(state => selectActivePlotData(state, plotId));
    const modelsSlice = useSelector(state => state.models);
    // settings
    // modelgroups => 

    useEffect(() => { 
        // note: this is important, because we should only "propagate" the error to the top
        // if this component has finished rendering, causing no <em>side effects</em> in
        // its rendering process 
        if (activeData.status === REQUEST_STATE.error) {
            props.reportError(activeData.error);
        }
    })

    if (activeData.status === REQUEST_STATE.loading || activeData.status === REQUEST_STATE.idle) {
        return <div style={{display: "flex", alignItems: "center", justifyContent: "center", height: "300px"}}>
            <Spinner text={"loading data"} size={"8em"}></Spinner>
        </div>

    } else if (activeData.status === REQUEST_STATE.error) {
        return <Typography>An error occurred, please try to reload the site.</Typography>;

    } else if (activeData.status === REQUEST_STATE.success) {
        const {series, styling} = generateSeries({plotId, data: activeData.data, modelsSlice});
        const options = getOptions({plotId, styling});
        return <Chart key={plotId} options={options} series={series} type={APEXCHART_PLOT_TYPE[plotId]} height={"400p"} />
    };

    // this "case" should not happen
    return <Typography>CRITICAL: an internal error occurred that shouldn't happen!</Typography>;
}

export default React.memo(Graph); // prevent graph from rerendering if sidebar is opened and closed
