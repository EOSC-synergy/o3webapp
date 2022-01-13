import React, { useState } from "react";
import { useDispatch } from "react-redux"
import { setDisplayXRange } from "../../../../../store/plotSlice/plotSlice";

/**
 * enables the user to choose the range that should be visible on the x Axis of the plot
 * @param {Object} props
 * @param {function} props.reportError - function for error handling
 * @returns {JSX} a jsx containing a range slider
 */
function XAxisSlider(props) {

    let i = props.reportError;
    
    // const dispatch = useDispatch()

    // dispatch(setDisplayXRange({currMin, currMax}))

    return (
        <>
        XAxisSlider
        </>
    );
}

export default XAxisSlider;