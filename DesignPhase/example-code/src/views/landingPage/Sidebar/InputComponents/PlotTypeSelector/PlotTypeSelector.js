import React, { useState } from "react";

/**
 * enables the user to select a different plot type
 * @param {*} props 
 *  props.default -> the default plot type
 * @returns a jsx containing a dropdown to select the plot type
 */
export default function PlotTypeSelector(props) {

    // TODO: API call -> wohin?
    const getAllAvailablePlotTypes = () => {
        return null;
    }
    
    // TODO: -> Redux
    props.plotType;
    props.changePlotType;

    props.error;

    return (
        <>
        </>
    );
}