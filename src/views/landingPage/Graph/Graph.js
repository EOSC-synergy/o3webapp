import * as React from 'react';
import Chart from "react-apexcharts"
import data from "./default-data.json"
import settings from "./default-settings.json"
import { convertToStrokeStyle, colourNameToHex } from "../../../utils/optionsFormatter"

// generate static preview for octs plot
const yearsOnXAxis = [...Array(141).keys()].map(value => `${value + 1960}`)
const ySeries = data.map(modelObj => {        
        return {
            name: modelObj.model,
            data: modelObj.y.map(number => number.toFixed(2)),
        }
    }
)
const colors = data.map(modelObj => colourNameToHex(modelObj.plotstyle.color))
const strokes = data.map(modelObj => convertToStrokeStyle(modelObj.plotstyle.linestyle))
const lineWidth = data.map(el => 2) // default is 2

console.log(settings)
settings.options.xaxis.categories.push(...yearsOnXAxis)
settings.options.colors.push(...colors)
settings.options.stroke.dashArray.push(...strokes)
settings.options.stroke.width.push(...lineWidth)
settings.series.push(...ySeries)
console.log(settings)

/**
 * A containter for the displayed graph.
 * Displays the currently selected plot.
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
