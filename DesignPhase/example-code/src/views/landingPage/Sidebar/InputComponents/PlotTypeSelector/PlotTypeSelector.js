import React, { useState } from "react";

/**
 * enables the user to select a different plot type
 * @param {*} props 
 *  props.default -> the default plot type
 * @returns a jsx containing a dropdown to select the plot type
 */
export default function PlotTypeSelector(props) {

    // API call -> wohin?
    const getAllAvailablePlotTypes = () => {
        return null;
    }
    
    props.plotType;
    props.error;
    props.changePlotType;

    return (
        <>
        </>
    );
}