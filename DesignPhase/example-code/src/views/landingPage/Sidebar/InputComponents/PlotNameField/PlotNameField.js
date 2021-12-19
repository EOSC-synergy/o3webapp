import React, { useState } from "react";
import { useDispatch } from "react-redux"
import { setTitle } from "../../../../../store/plotSlice";

/**
 * enables the user to rename the plot
 * @param {*} props 
 *  props.default -> default name of the plot
 * @returns a textfield to change the plotname
 */
function PlotNameField(props) {
    
    let i = props.default;
    i = props.error;

    i = props.plotName;
    i = props.changePlotName;

    const handlePlotNameChange = () => {
        dispatch(setTitle(plotName))
    }

    return (
        <>
        </>
    );
}

export default PlotNameField;