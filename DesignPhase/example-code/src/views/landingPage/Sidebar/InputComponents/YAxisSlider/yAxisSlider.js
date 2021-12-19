import React, { useState } from "react";
import { useDispatch } from "react-redux"
import { setDisplayXRange } from "../../../../../store/plotSlice";

/**
 * enables the user to select a range that should be diisplayed at the y axis of the plot
 * @param {Object} props 
 * @param {function} props.reportError -> function for error handling
 * @returns {JSX} a jsx containing a range slider
 */
function YAxisSlider(props) {
    
    let i = props.reportError;
 
    const dispatch = useDispatch()

    // dispatch(setDisplayXRange({currMin, currMax}))


    return (
        <>
        </>
    );
}

export default YAxisSlider;