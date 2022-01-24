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
import { formatDataBasedOnPlotId } from "../../../utils/optionsFormatter";

/**
 * Static generation of the years on the x-axis, this will be fetched from the
 * api later
 */
const yearsOnXAxis = [...Array(20).keys()].map(value => `${value + 2000}`)
/**
 * Transforming the data from default-data.json, this data will be fetched 
 * from the api later
 */
const ySeries = data.map(modelObj => {        
        return {
            name: modelObj.model,
            data: modelObj.y.map(number => number.toFixed(2)),
        }
    }
)
/**
 * Static color mapping to provide color in hexformat for apexcharts
 */
const colors = data.map(modelObj => colourNameToHex(modelObj.plotstyle.color))
/**
 * Static humand readable stroke style mapping to apexchart stroke style
 */
const strokes = data.map(modelObj => convertToStrokeStyle(modelObj.plotstyle.linestyle))
/**
 * Static humand readable linewidth mapping to apexchart linewidth
 */
const lineWidth = data.map(el => 2) // default is 2

// build the big object that is handed over to apexcharts
settings.options.xaxis.categories.push(...yearsOnXAxis)
settings.options.colors.push(...colors)
settings.options.stroke.dashArray.push(...strokes)
settings.options.stroke.width.push(...lineWidth)
settings.series.push(...ySeries)

const prepareData = (data, plotId) => {
    const transformedData = formatDataBasedOnPlotId(data, plotId);
    // calculate statistical values
    // merge model settings
    // merge statistical values
    return transformedData;
}

const renderCorrectChartComponent = (plotId, data) => {
    // mapping: from plotId to chart type required (apexcharts component)
    // select compmonent: return comp, this gets rendered in Graph if data is there
    if (plotId === "tco3_zm") {
        const transformed = prepareData(data, plotId);
        settings.options.stroke.width = transformed.lineWidth;
        settings.options.stroke.dashArray = transformed.strokes;
        settings.series = transformed.ySeries;
        settings.options.xaxis.categories = transformed.xAxis;
        settings.options.colors = transformed.colors;
        return <Chart
            options={settings.options}
            series={settings.series}
            type={"line"}
            height={"60%"}
            width={"95%"}
        />
    } else if (plotId === "tco3_return") {
        return <Typography>To be implemented...</Typography>
    }
    
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
        // get options
        const {series, colors} = generateSeries({plotId, data: activeData.data}); // at first without sv, without excluded models
        const options = getOptions({plotId, colors});
        //console.log(settings.series)
        //console.log(series)
        return renderChartWithSettings({plotId, options, series: series}); // settings.series
    };

    // this "case" should not happen
    return <Typography>CRITICAL: an internal error occurred that shouldn't happen!</Typography>;
}

export default Graph;
