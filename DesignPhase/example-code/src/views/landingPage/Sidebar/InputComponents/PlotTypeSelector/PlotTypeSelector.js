import React, { useState } from "react";

/**
 * enables the user to select a different plot type
 * @param {*} props 
 *  props.default -> the default plot type
 * @returns a jsx containing a dropdown to select the plot type
 */
function PlotTypeSelector(props) {

    // TODO: API call -> wohin?
    const getAllAvailablePlotTypes = () => {
        return null;
    }
    
    // TODO: -> Redux
    let i = props.plotType;
    i = props.changePlotType;

    i = props.error;

    return (
        <>
        </>
    );
}

export default PlotTypeSelector;