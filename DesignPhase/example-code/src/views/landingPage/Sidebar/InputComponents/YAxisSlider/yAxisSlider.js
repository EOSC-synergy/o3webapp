import React, { useState } from "react";

/**
 * enables the user to zoom in and out of the y-axis
 * @param {Object} props 
 *  props.currMin -> the current minimum value of the y-axis
 *  props.currMax -> the current maximum value of the y-axis
 *  props.min -> the smallest possible minimum value of the y-axis
 *  props.max -> the biggest possible maximum value of the y-axis
 *  props.changeMin -> changes the minimum value displayed at the y-axis
 *  props.changeMax -> changes the maximum value displayed at the y-axis
 *  props.error -> function for error handling
 * @public
 * @returns a jsx containing a range slider
 */
function YAxisSlider(props) {
    
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

export default YAxisSlider;