import React, { useState } from "react";

/**
 * enables the user to zoom in and out of the x-axis
 * @param {Object} props 
 *  props.currMin -> the current minimum value of the x-axis
 *  props.currMax -> the current maximum value of the x-axis
 *  props.min -> the smallest possible minimum value of the x-axis
 *  props.max -> the biggest possible maximum value of the x-axis
 *  props.changeMin -> changes the minimum value displayed at the x-axis
 *  props.changeMax -> changes the maximum value displayed at the x-axis
 *  props.error -> function for error handling
 * @returns a jsx containing a range slider
 */
function XAxisSlider(props) {
    
    let i = props.min;
    i = props.max;
    i = props.error;

    // TODO: -> Redux
    i = props.currMin;
    i = props.currMax;
    i = props.changeMin;
    i = props.changeMax;
    
    return (
        <>
        </>
    );
}

export default XAxisSlider;