import React, { useState } from "react";
import { useDispatch } from "react-redux"
import { setDisplayXRange } from "../../../../../store/plotSlice";

/**
 * enables the user to zoom in and out of the x-axis
 * @param {*} props 
 *  props.defaultMin -> the default minimum value of the x-axis
 *  props.defaultMax -> the default maximum value of the x-axis
 *  props.min -> the smallest possible minimum value of the x-axis
 *  props.max -> the biggest possible maximum value of the x-axis
 * @returns a jsx containing a range slider
 */
export default function XAxisSlider(props) {
    
    props.min;
    props.max;
    props.error;

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