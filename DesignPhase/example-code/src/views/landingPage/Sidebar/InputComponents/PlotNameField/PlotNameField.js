import React, { useState } from "react";
import { useDispatch } from "react-redux"
import { setTitle } from "../../../../../store/plotSlice";

/**
 * enables the user to rename the plot
 * @param {Object} props 
 * @param {function} props.reportError - function for error handling
 * @returns {JSX} a textfield to change the plotname
 */
function PlotNameField(props) {
    
    let i = props.reportError;

    /**
     * handles the change of the plot name
     */
    const handlePlotNameChange = () => {
        dispatch(setTitle(plotName))
    }

    return (
        <>
        </>
    );
}

export default PlotNameField;