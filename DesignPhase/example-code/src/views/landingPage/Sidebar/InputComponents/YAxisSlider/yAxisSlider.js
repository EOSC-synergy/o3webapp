import React, { useState } from "react";
import { useDispatch } from "react-redux"
import { setDisplayXRange } from "../../../../../store/plotSlice";

/**
 * enables the user to select a range that should be diisplayed at the y axis of the plot
 * @param {Object} props 
 * @param {function} props.error -> function for error handling
 * @returns {JSX} a jsx containing a range slider
 */
function YAxisSlider(props) {
    
    i = props.error;
 
    const dispatch = useDispatch()

    /**
     * handles the change from the slider
     * dispatches the action into redux
     */
    const onChange = () => {
        dispatch(setDisplayXRange({currMin, currMax}))
    }

    /**
     * get the smallest and biggest possible values, i.e. the end of the slider
     */
    const getPossibleRange = () => {

    }


    return (
        <>
        </>
    );
}

export default YAxisSlider;