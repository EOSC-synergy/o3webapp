import React, { useState } from "react";

/**
 * enables the user to rename the plot
 * @param {*} props 
 *  props.default -> default name of the plot
 * @returns a textfield to change the plotname
 */
export default function PlotNameField(props) {
    
    props.default;
    props.error;

    // TODO: -> redux
    props.plotName;
    props.changePlotName;

    return (
        <>
        </>
    );
}