import React, { useState } from "react";
import { useDispatch } from "react-redux"
import { setTitle } from "../../../../../store/plotSlice";

/**
 * enables the user to rename the plot
 * @param {*} props 
 *  props.default -> default name of the plot
 * @returns a textfield to change the plotname
 */
export default function PlotNameField(props) {
    
    props.default;
    props.error;

    props.plotName;
    props.changePlotName;

    const handlePlotNameChange = () => {
        dispatch(setTitle(plotName))
    }

    return (
        <>
        </>
    );
}