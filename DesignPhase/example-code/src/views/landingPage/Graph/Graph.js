import * as React from 'react';

/**
 * A containter for the displayed graph.
 * Displays the currently selected plot.
 */
export default function Graph() {
    const [plotData, setPlotData] = React.useState({});
    const [options, setOptions] = React.useState({});
    const [type, setType] = React.useState("line");

    const getDataToDisplay = () => {
        // Gets the currently selected models which should be displayed
    }

    return (<div>
        {/* Graph displayed with ApexCharts goes here */}
    </div>);
}
