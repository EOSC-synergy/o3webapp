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

const APEXCHART_PLOT_TYPE = {
    tco3_zm: "line",
    tco3_return: "boxPlot"
    // vrom3?
}

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

    const [optionsState, setOptionsState] = React.useState({});
    const [seriesState, setSeriesState] = React.useState({});

    useEffect(() => { 
        // note: this is important, because we should only "propagate" the error to the top
        // if this component has finished rendering, causing no <em>side effects</em> in
        // its rendering process 
        if (activeData.status === REQUEST_STATE.error) {
            props.reportError(activeData.error);
        }
    })

    if (activeData.status === REQUEST_STATE.loading || activeData.status === REQUEST_STATE.idle) {
        return <Spinner text={"loading data"} size={"8em"}></Spinner>

    } else if (activeData.status === REQUEST_STATE.error) {
        return <Typography>An error occurred, please try to reload the site</Typography>;

    } else if (activeData.status === REQUEST_STATE.success) {
        const {series, colors} = generateSeries({plotId, data: activeData.data})
        const options = getOptions({plotId, colors});
        //console.log(settings.series)
        //console.log(series)
        console.log("plot id" + plotId);
        console.log(options);
        /*
        //ApexCharts.exec(plotId, "updateOptions", options, true);
        return renderChartWithSettings({plotId, options, series: series}); // settings.series
        */
        return <Chart options={options} series={series} type={APEXCHART_PLOT_TYPE[plotId]} height={"400p"} />
    };

    // this "case" should not happen
    return <Typography>CRITICAL: an internal error occurred that shouldn't happen!</Typography>;
}

export default Graph;
