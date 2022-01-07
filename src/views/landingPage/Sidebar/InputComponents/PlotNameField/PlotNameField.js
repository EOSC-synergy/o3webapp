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

    return (
        <>
        </>
    );
}

export default PlotNameField;