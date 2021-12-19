import React, { useState } from "react";
import { useDispatch } from "react-redux"
import { setDisplayXRange } from "../../../../../store/plotSlice";

/**
 * enables the user to zoom in and out of the y-axis
 * @param {*} props 
 *  props.currMin -> the default minimum value of the y-axis
 *  props.currMax -> the default maximum value of the y-axis
 *  props.min -> the smallest possible minimum value of the y-axis
 *  props.max -> the biggest possible maximum value of the y-axis
 * @returns a jsx containing a range slider
 */
export default function YAxisSlider(props) {
    
    props.min;
    props.max;
    props.error;

    // TODO: -> Redux
    props.currMin;
    props.currMax;
    props.changeMin;
    props.changeMax;
 
    const dispatch = useDispatch()

    const onChange = () => {
        dispatch(setDisplayXRange({min, max}))
    }


    return (
        <>
        </>
    );
}