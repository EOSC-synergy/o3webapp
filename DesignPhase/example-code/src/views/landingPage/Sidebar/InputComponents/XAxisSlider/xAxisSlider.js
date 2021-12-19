import React, { useState } from "react";
import { useDispatch } from "react-redux"
import { setDisplayXRange } from "../../../../../store/plotSlice";

/**
 * enables the user to choose the range that should be visible on the x Axis of the plot
 * @param {Object} props
 * @prop {function} props.error - function for error handling
 * @returns {JSX} a jsx containing a range slider
 */
function XAxisSlider(props) {

    let i = props.error;
    
    const dispatch = useDispatch()

    /**
     * handles change of the slider by pushing the new value to redux
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

export default XAxisSlider;