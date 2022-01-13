import * as React from 'react';
import Chart from "react-apexcharts"
import data from "./default-data.json"
import settings from "./default-settings.json"
import { convertToStrokeStyle, colourNameToHex } from "../../../utils/optionsFormatter"

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

    return (<>
        {/* for the OCTS Plot */}
        <Chart
                options={settings.options}
                series={settings.series}
                type={"line"}
                height={"600px"}
            />
        
    </>);
}

export default Graph;
