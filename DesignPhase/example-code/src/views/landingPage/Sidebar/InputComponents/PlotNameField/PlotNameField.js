import React, { useState } from "react";

/**
 * enables the user to rename the plot
 * @param {*} props 
 *  props.default -> default name of the plot
 * @returns a textfield to change the plotname
 */
function PlotNameField(props) {
    
    let i = props.default;
    i = props.error;

    // TODO: -> redux
    i = props.plotName;
    i = props.changePlotName;

    return (
        <>
        </>
    );
}

export default PlotNameField;