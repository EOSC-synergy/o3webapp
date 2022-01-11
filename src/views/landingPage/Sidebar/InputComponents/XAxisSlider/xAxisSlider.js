import React, { useState } from "react";
import { useDispatch } from "react-redux"
// import { setDisplayXRange } from "../../../../../store/plotSlice";

/**
 * enables the user to choose the range that should be visible on the x Axis of the plot
 * @param {Object} props
 * @prop {function} props.reportError - function for error handling
 * @returns {JSX} a jsx containing a range slider
 */
function XAxisSlider(props) {

    let i = props.reportError;
    
    const dispatch = useDispatch()

    // dispatch(setDisplayXRange({currMin, currMax}))

    return (
        <>
        </>
    );
}

export default XAxisSlider;