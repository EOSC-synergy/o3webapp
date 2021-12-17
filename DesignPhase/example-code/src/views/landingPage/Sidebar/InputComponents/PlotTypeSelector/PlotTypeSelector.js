import React, { useState } from "react";

function getAllAvailablePlotTypes() {
    return null;
}

/**
 * enables the user to select a different plot type
 * @param {*} props 
 *  props.default -> the default plot type
 * @returns a jsx containing a dropdown to select the plot type
 */
export default function PlotTypeSelector(props) {
    
    props.default;
    const [plotType, setPlotType] = useState("");

    return (
        <>
        </>
    );
}